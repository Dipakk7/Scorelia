import time
from collections import Counter
import structlog
from sqlalchemy import func
from sqlalchemy.orm import Session, load_only
from sqlalchemy.exc import SQLAlchemyError

from app.models.resume import Resume
from app.core.ats_constants import SCORE_WEIGHTS
from app.services.ats.ats_service import calculate_ats_score
from app.services.ats.grading import determine_grade
from app.analytics.statistics.base import BaseStatistics

logger = structlog.get_logger()

class ATSCategory:
    """ATS scoring categories defined as constants to avoid hardcoded strings."""
    CONTACT = "contact"
    SKILLS = "skills"
    EDUCATION = "education"
    EXPERIENCE = "experience"
    PROJECTS = "projects"
    CERTIFICATIONS = "certifications"

def retrieve_scored_resumes(db: Session) -> list[Resume]:
    """
    Retrieve all resumes that have been scored.
    Defers loading of heavy text columns like raw_text using load_only for optimization.
    """
    start = time.perf_counter()
    try:
        results = db.query(Resume).options(
            load_only(
                Resume.id, 
                Resume.user_id, 
                Resume.parsed_data, 
                Resume.ats_score, 
                Resume.uploaded_at
            )
        ).filter(Resume.ats_score.isnot(None)).all()
        
        duration_ms = (time.perf_counter() - start) * 1000.0
        logger.info("Database queries completed", query_duration_ms=round(duration_ms, 2))
        return results
    except SQLAlchemyError as e:
        duration_ms = (time.perf_counter() - start) * 1000.0
        logger.error("Database query failures", query_duration_ms=round(duration_ms, 2), error=str(e))
        raise

class ATSStatistics(BaseStatistics):
    @classmethod
    def get_ats_analytics_data(cls, db: Session) -> dict:
        """
        Orchestrates calculation of all ATS analytics.
        """
        scored_resumes = retrieve_scored_resumes(db)
        
        # Store original database scores to prevent in-memory mutation by calculate_ats_score
        db_scores = {r.id: r.ats_score for r in scored_resumes if r.ats_score is not None}
        
        overview = cls.calculate_ats_overview(scored_resumes, db_scores)
        grade_dist = cls.calculate_ats_grade_distribution(scored_resumes, db_scores)
        category_breakdown = cls.calculate_ats_category_breakdown(scored_resumes)
        trend = cls.calculate_ats_trend_analytics(scored_resumes, db_scores)
        weaknesses = cls.calculate_ats_weakness_insights(scored_resumes)
        
        return {
            "overview": overview,
            "grade_distribution": grade_dist,
            "category_breakdown": category_breakdown,
            "trend": trend,
            "weaknesses": weaknesses
        }

    @classmethod
    def calculate_ats_overview(cls, scored_resumes: list[Resume], db_scores: dict) -> dict:
        """Calculate high-level summary score metrics."""
        scores = list(db_scores.values())
        total_evals = len(scores)
        
        if total_evals == 0:
            return {
                "total_ats_evaluations": 0,
                "average_ats_score": 0.0,
                "highest_ats_score": 0,
                "lowest_ats_score": 0,
                "median_ats_score": 0.0
            }
            
        return {
            "total_ats_evaluations": total_evals,
            "average_ats_score": cls.calculate_average(scores),
            "highest_ats_score": max(scores),
            "lowest_ats_score": min(scores),
            "median_ats_score": cls.calculate_median(scores)
        }

    @classmethod
    def calculate_ats_grade_distribution(cls, scored_resumes: list[Resume], db_scores: dict) -> dict:
        """Group scores into grade cohorts (Excellent, Good, Fair, Needs Improvement)."""
        total_evals = len(db_scores)
        distribution = {
            "Excellent": {"count": 0, "percentage": 0.0},
            "Good": {"count": 0, "percentage": 0.0},
            "Fair": {"count": 0, "percentage": 0.0},
            "Needs Improvement": {"count": 0, "percentage": 0.0}
        }
        
        if total_evals == 0:
            return distribution

        for score in db_scores.values():
            grade = determine_grade(score)
            if grade in distribution:
                distribution[grade]["count"] += 1
            else:
                distribution["Needs Improvement"]["count"] += 1
                    
        for grade in distribution:
            distribution[grade]["percentage"] = cls.percentage(distribution[grade]["count"], total_evals)
            
        return distribution

    @classmethod
    def calculate_ats_category_breakdown(cls, scored_resumes: list[Resume]) -> dict:
        """Compute the average and contribution weight of each category score."""
        total_evals = len(scored_resumes)
        categories = [
            ATSCategory.CONTACT,
            ATSCategory.SKILLS,
            ATSCategory.EDUCATION,
            ATSCategory.EXPERIENCE,
            ATSCategory.PROJECTS,
            ATSCategory.CERTIFICATIONS
        ]
        
        category_sums = {cat: 0.0 for cat in categories}
        
        for r in scored_resumes:
            # Recalculate scoring details in-memory
            try:
                score_response = calculate_ats_score(r)
                breakdown = score_response.breakdown
                for cat in categories:
                    category_sums[cat] += getattr(breakdown, cat, 0.0)
            except Exception as e:
                logger.warning("Failed to score resume during category breakdown", resume_id=str(r.id), error=str(e))
                
        category_breakdown = {}
        for cat in categories:
            weight = SCORE_WEIGHTS.get(cat, 0)
            avg = round(cls.safe_divide(category_sums[cat], total_evals), 1) if total_evals > 0 else 0.0
            category_breakdown[cat] = {
                "average": avg,
                "weight": weight
            }
            
        return category_breakdown

    @classmethod
    def calculate_ats_trend_analytics(cls, scored_resumes: list[Resume], db_scores: dict) -> dict:
        """Format historical scores sorted chronologically, and count improvement rate."""
        # 1. Group daily average scores
        trend_groups = {}
        for r in scored_resumes:
            score = db_scores.get(r.id)
            if score is not None:
                date_key = cls.format_timeline(r.uploaded_at, "daily")
                if date_key not in trend_groups:
                    trend_groups[date_key] = []
                trend_groups[date_key].append(score)
                
        score_trend = []
        for date_key in sorted(trend_groups.keys()):
            scores_on_day = trend_groups[date_key]
            avg_score = round(cls.safe_divide(sum(scores_on_day), len(scores_on_day)), 1)
            score_trend.append({
                "date": date_key,
                "score": avg_score
            })
            
        # 2. Compute Improvement Rate (last score vs first score per user, averaged)
        user_resumes = {}
        for r in scored_resumes:
            score = db_scores.get(r.id)
            if score is not None:
                uid = str(r.user_id)
                if uid not in user_resumes:
                    user_resumes[uid] = []
                user_resumes[uid].append((r.uploaded_at, score))
                
        improvements = []
        for uid, items in user_resumes.items():
            if len(items) >= 2:
                # Sort by uploaded_at ascending
                sorted_items = sorted(items, key=lambda x: x[0])
                earliest_score = sorted_items[0][1]
                latest_score = sorted_items[-1][1]
                improvements.append(latest_score - earliest_score)
                
        improvement_rate = round(cls.safe_divide(sum(improvements), len(improvements)), 1) if improvements else 0.0
        
        return {
            "score_trend": score_trend,
            "improvement_rate": improvement_rate
        }

    @classmethod
    def calculate_ats_weakness_insights(cls, scored_resumes: list[Resume]) -> dict:
        """Isolate weaknesses and recommendations frequencies from JSON results."""
        total_evals = len(scored_resumes)
        weakness_counter = Counter()
        rec_counter = Counter()
        
        for r in scored_resumes:
            try:
                score_response = calculate_ats_score(r)
                # Weaknesses are list[str]
                for w in score_response.weaknesses:
                    if isinstance(w, str) and w.strip():
                        weakness_counter[w.strip()] += 1
                # Recommendations are list[ATSRecommendation]
                for rec in score_response.recommendations:
                    if rec.message:
                        rec_counter[rec.message] += 1
            except Exception as e:
                logger.warning("Failed to score resume during weaknesses insights", resume_id=str(r.id), error=str(e))
                
        top_weaknesses = []
        for name, count in weakness_counter.most_common(5):
            top_weaknesses.append({
                "name": name,
                "count": count,
                "percentage": cls.percentage(count, total_evals)
            })
            
        top_recommendations = []
        for name, count in rec_counter.most_common(5):
            top_recommendations.append({
                "name": name,
                "count": count,
                "percentage": cls.percentage(count, total_evals)
            })
            
        return {
            "top_weaknesses": top_weaknesses,
            "top_recommendations": top_recommendations
        }
