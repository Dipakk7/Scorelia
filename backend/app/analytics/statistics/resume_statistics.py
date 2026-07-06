import time
from datetime import datetime, timedelta
from collections import Counter
import structlog
from sqlalchemy import func
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.models.user import User
from typing import Any
from app.models.resume import Resume
from app.core.enums import ResumeStatus
from app.services.job_match.matcher import calculate_experience_years
from app.analytics.statistics.base import BaseStatistics
from app.analytics.utils import normalize_degree, DEGREE_SCORES

logger = structlog.get_logger()

class ResumeStatistics(BaseStatistics):
    @classmethod
    def get_dashboard_db_stats(cls, db: Session, user_id: Any = None) -> dict:
        """
        Query user and resume metrics from the database using aggregate functions.
        """
        start = time.perf_counter()
        try:
            total_users = db.query(func.count(User.id)).scalar() or 0
            
            if user_id:
                total_resumes = db.query(func.count(Resume.id)).filter(Resume.user_id == user_id).scalar() or 0
                parsed_resumes = db.query(func.count(Resume.id)).filter(
                    Resume.user_id == user_id, Resume.status == ResumeStatus.PARSED
                ).scalar() or 0
                avg_ats = db.query(func.avg(Resume.ats_score)).filter(Resume.user_id == user_id).scalar()
                latest_resume = db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.uploaded_at.desc()).first()
            else:
                total_resumes = db.query(func.count(Resume.id)).scalar() or 0
                parsed_resumes = db.query(func.count(Resume.id)).filter(
                    Resume.status == ResumeStatus.PARSED
                ).scalar() or 0
                avg_ats = db.query(func.avg(Resume.ats_score)).scalar()
                latest_resume = db.query(Resume).order_by(Resume.uploaded_at.desc()).first()

            average_ats_score = round(float(avg_ats), 1) if avg_ats is not None else 0.0

            duration_ms = (time.perf_counter() - start) * 1000.0
            logger.info("Database queries completed", query_duration_ms=round(duration_ms, 2))

            return {
                "total_users": total_users,
                "total_resumes": total_resumes,
                "parsed_resumes": parsed_resumes,
                "average_ats_score": average_ats_score,
                "latest_resume": latest_resume
            }
        except SQLAlchemyError as e:
            duration_ms = (time.perf_counter() - start) * 1000.0
            logger.error("Database query failures", query_duration_ms=round(duration_ms, 2), error=str(e))
            raise

    @classmethod
    def get_resume_overview_stats(cls, db: Session) -> dict:
        """
        Query and calculate resume overview metrics using aggregate SQL queries where possible.
        """
        start = time.perf_counter()
        try:
            total_resumes = db.query(func.count(Resume.id)).scalar() or 0
            parsed_resumes = db.query(func.count(Resume.id)).filter(
                Resume.status == ResumeStatus.PARSED
            ).scalar() or 0
            
            unparsed_resumes = total_resumes - parsed_resumes
            parsing_success_rate = cls.percentage(parsed_resumes, total_resumes)

            # Calculate average resume character length in db (naive check on raw_text column)
            avg_len = db.query(func.avg(func.length(Resume.raw_text))).filter(Resume.raw_text.isnot(None)).scalar()
            average_resume_length = round(float(avg_len), 1) if avg_len is not None else 0.0

            oldest_resume = db.query(Resume).order_by(Resume.uploaded_at.asc()).first()
            newest_resume = db.query(Resume).order_by(Resume.uploaded_at.desc()).first()

            # Date calculation (uploaded this week/month) using naive UTC datetimes
            now = datetime.utcnow()
            one_week_ago = now - timedelta(days=7)
            one_month_ago = now - timedelta(days=30)

            resumes_uploaded_this_week = db.query(func.count(Resume.id)).filter(
                Resume.uploaded_at >= one_week_ago
            ).scalar() or 0

            resumes_uploaded_this_month = db.query(func.count(Resume.id)).filter(
                Resume.uploaded_at >= one_month_ago
            ).scalar() or 0

            duration_ms = (time.perf_counter() - start) * 1000.0
            logger.info("Database queries completed", query_duration_ms=round(duration_ms, 2))

            return {
                "total_resumes": total_resumes,
                "parsed_resumes": parsed_resumes,
                "unparsed_resumes": unparsed_resumes,
                "parsing_success_rate": parsing_success_rate,
                "average_resume_length": average_resume_length,
                "oldest_resume": oldest_resume,
                "newest_resume": newest_resume,
                "resumes_uploaded_this_week": resumes_uploaded_this_week,
                "resumes_uploaded_this_month": resumes_uploaded_this_month
            }
        except SQLAlchemyError as e:
            duration_ms = (time.perf_counter() - start) * 1000.0
            logger.error("Database query failures", query_duration_ms=round(duration_ms, 2), error=str(e))
            raise

    @classmethod
    def get_parsed_resumes_data(cls, db: Session) -> list[dict]:
        """
        Query parsed_data column values from the database for parsed resumes.
        """
        start = time.perf_counter()
        try:
            results = db.query(Resume.parsed_data).filter(
                Resume.status == ResumeStatus.PARSED,
                Resume.parsed_data.isnot(None)
            ).all()
            duration_ms = (time.perf_counter() - start) * 1000.0
            logger.info("Database queries completed", query_duration_ms=round(duration_ms, 2))
            return [r[0] for r in results if r[0]]
        except SQLAlchemyError as e:
            duration_ms = (time.perf_counter() - start) * 1000.0
            logger.error("Database query failures", query_duration_ms=round(duration_ms, 2), error=str(e))
            raise

    @classmethod
    def get_upload_timeline_dates(cls, db: Session) -> list[datetime]:
        """
        Query all uploaded timestamps chronologically.
        """
        start = time.perf_counter()
        try:
            results = db.query(Resume.uploaded_at).order_by(Resume.uploaded_at.asc()).all()
            duration_ms = (time.perf_counter() - start) * 1000.0
            logger.info("Database queries completed", query_duration_ms=round(duration_ms, 2))
            return [r[0] for r in results if r[0]]
        except SQLAlchemyError as e:
            duration_ms = (time.perf_counter() - start) * 1000.0
            logger.error("Database query failures", query_duration_ms=round(duration_ms, 2), error=str(e))
            raise

    @classmethod
    def calculate_skills_analytics(cls, parsed_resumes_data: list[dict]) -> dict:
        """
        Compute top_skills, total_unique_skills, most_common_skill, and skill_frequency.
        """
        skill_counter = Counter()

        for parsed_data in parsed_resumes_data:
            data = parsed_data.get("data", {})
            skills_node = data.get("skills", {})
            skills_list = []
            if isinstance(skills_node, dict):
                skills_list = skills_node.get("value", [])
            elif isinstance(skills_node, list):
                skills_list = skills_node
            
            for skill in skills_list:
                if isinstance(skill, str) and skill.strip():
                    skill_counter[skill.strip()] += 1

        total_unique_skills = len(skill_counter)
        most_common_skill = skill_counter.most_common(1)[0][0] if total_unique_skills > 0 else None
        top_skills = [item[0] for item in skill_counter.most_common(10)]
        skill_frequency = dict(skill_counter)

        return {
            "top_skills": top_skills,
            "total_unique_skills": total_unique_skills,
            "most_common_skill": most_common_skill,
            "skill_frequency": skill_frequency
        }

    @classmethod
    def calculate_experience_analytics(cls, parsed_resumes_data: list[dict]) -> dict:
        """
        Compute average_years_experience and experience_distribution.
        """
        distribution = {
            "0–1 years": 0,
            "2–4 years": 0,
            "5–8 years": 0,
            "8+ years": 0
        }
        
        total_years_sum = 0.0
        parsed_count = 0

        for parsed_data in parsed_resumes_data:
            data = parsed_data.get("data", {})
            exp_node = data.get("experience", {})
            experience_list = []
            if isinstance(exp_node, dict):
                experience_list = exp_node.get("value", [])
            elif isinstance(exp_node, list):
                experience_list = exp_node

            total_resume_years = 0.0
            for exp in experience_list:
                if isinstance(exp, dict):
                    dur = exp.get("duration", "")
                    total_resume_years += calculate_experience_years(dur)
            
            parsed_count += 1
            total_years_sum += total_resume_years

            # Categorize using en-dash (Unicode U+2013)
            if total_resume_years <= 1.0:
                distribution["0–1 years"] += 1
            elif total_resume_years <= 4.0:
                distribution["2–4 years"] += 1
            elif total_resume_years <= 8.0:
                distribution["5–8 years"] += 1
            else:
                distribution["8+ years"] += 1

        average_years_experience = round(cls.safe_divide(total_years_sum, parsed_count), 1)

        return {
            "average_years_experience": average_years_experience,
            "experience_distribution": distribution
        }

    @classmethod
    def calculate_education_analytics(cls, parsed_resumes_data: list[dict]) -> dict:
        """
        Compute education_distribution.
        """
        distribution = {
            "Bachelor": 0,
            "Master": 0,
            "PhD": 0,
            "Diploma": 0,
            "Other": 0
        }

        for parsed_data in parsed_resumes_data:
            data = parsed_data.get("data", {})
            edu_node = data.get("education", {})
            edu_list = []
            if isinstance(edu_node, dict):
                edu_list = edu_node.get("value", [])
            elif isinstance(edu_node, list):
                edu_list = edu_node

            highest_degree = "Other"
            highest_score = -1

            for edu in edu_list:
                if isinstance(edu, dict):
                    deg = edu.get("degree", "")
                    norm_deg = normalize_degree(deg)
                    score = DEGREE_SCORES.get(norm_deg, 0)
                    if score > highest_score:
                         highest_score = score
                         highest_degree = norm_deg

            if highest_score == -1:
                distribution["Other"] += 1
            else:
                distribution[highest_degree] += 1

        return {
            "education_distribution": distribution
        }

    @classmethod
    def calculate_timeline_analytics(cls, uploaded_dates: list[datetime]) -> dict:
        """
        Compute daily, weekly, and monthly chronological upload counts.
        """
        daily = {}
        weekly = {}
        monthly = {}

        for dt in uploaded_dates:
            day_key = cls.format_timeline(dt, "daily")
            week_key = cls.format_timeline(dt, "weekly")
            month_key = cls.format_timeline(dt, "monthly")

            daily[day_key] = daily.get(day_key, 0) + 1
            weekly[week_key] = weekly.get(week_key, 0) + 1
            monthly[month_key] = monthly.get(month_key, 0) + 1

        return {
            "daily": daily,
            "weekly": weekly,
            "monthly": monthly
        }
