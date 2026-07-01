import time
from collections import Counter
from datetime import datetime, timedelta
import structlog
from app.analytics.statistics.base import BaseStatistics

logger = structlog.get_logger()

class JobStatistics(BaseStatistics):
    @classmethod
    def get_job_analytics_data(cls, matches: list[dict]) -> dict:
        """
        Orchestrate all Job Match analytics calculations from the raw cache list.
        """
        overview = cls.calculate_job_overview(matches)
        distribution = cls.calculate_job_distribution(matches)
        skill_gaps = cls.calculate_job_skill_gaps(matches)
        trend = cls.calculate_job_trend(matches)
        recommendations = cls.calculate_job_recommendations(matches)
        history = cls.calculate_job_history(matches)

        return {
            "overview": overview,
            "distribution": distribution,
            "skill_gaps": skill_gaps,
            "trend": trend,
            "recommendations": recommendations,
            "history": history
        }

    @classmethod
    def calculate_job_overview(cls, matches: list[dict]) -> dict:
        scores = [m["overall_score"] for m in matches if "overall_score" in m]
        total = len(scores)
        if total == 0:
            return {
                "total_job_matches": 0,
                "average_match_score": 0.0,
                "highest_match_score": 0,
                "lowest_match_score": 0,
                "median_match_score": 0.0
            }
        return {
            "total_job_matches": total,
            "average_match_score": cls.calculate_average(scores),
            "highest_match_score": max(scores),
            "lowest_match_score": min(scores),
            "median_match_score": cls.calculate_median(scores)
        }

    @classmethod
    def calculate_job_distribution(cls, matches: list[dict]) -> dict:
        total = len(matches)
        distribution = {
            "90–100%": {"count": 0, "percentage": 0.0, "label": "90–100%", "value": 0},
            "80–89%": {"count": 0, "percentage": 0.0, "label": "80–89%", "value": 0},
            "70–79%": {"count": 0, "percentage": 0.0, "label": "70–79%", "value": 0},
            "60–69%": {"count": 0, "percentage": 0.0, "label": "60–69%", "value": 0},
            "Below 60%": {"count": 0, "percentage": 0.0, "label": "Below 60%", "value": 0}
        }
        
        if total == 0:
            return distribution
            
        for m in matches:
            score = m.get("overall_score", 0)
            if score >= 90:
                bucket = "90–100%"
            elif score >= 80:
                bucket = "80–89%"
            elif score >= 70:
                bucket = "70–79%"
            elif score >= 60:
                bucket = "60–69%"
            else:
                bucket = "Below 60%"
            distribution[bucket]["count"] += 1
            
        for bucket in distribution:
            cnt = distribution[bucket]["count"]
            distribution[bucket]["percentage"] = cls.percentage(cnt, total)
            distribution[bucket]["value"] = cnt
            
        return distribution

    @classmethod
    def calculate_job_skill_gaps(cls, matches: list[dict]) -> dict:
        total = len(matches)
        skill_counter = Counter()
        for m in matches:
            missing = m.get("missing_skills", [])
            for s in missing:
                if isinstance(s, str) and s.strip():
                    skill_counter[s.strip()] += 1
                    
        total_unique = len(skill_counter)
        top_missing_skills = []
        for name, count in skill_counter.most_common(10):
            top_missing_skills.append({
                "name": name,
                "count": count,
                "percentage": cls.percentage(count, total),
                "label": name,
                "value": count
            })
            
        return {
            "top_missing_skills": top_missing_skills,
            "missing_skill_frequency": dict(skill_counter),
            "total_unique_missing_skills": total_unique
        }

    @classmethod
    def calculate_job_trend(cls, matches: list[dict]) -> dict:
        trend_groups = {}
        for m in matches:
            dt = m.get("timestamp")
            if dt and isinstance(dt, datetime):
                date_key = cls.format_timeline(dt, "daily")
                if date_key not in trend_groups:
                    trend_groups[date_key] = []
                trend_groups[date_key].append(m.get("overall_score", 0))
                
        score_trend = []
        for date_key in sorted(trend_groups.keys()):
            scores = trend_groups[date_key]
            avg = round(cls.safe_divide(sum(scores), len(scores)), 1)
            score_trend.append({
                "date": date_key,
                "score": avg
            })
            
        return {"score_trend": score_trend}

    @classmethod
    def calculate_job_recommendations(cls, matches: list[dict]) -> dict:
        total = len(matches)
        rec_counter = Counter()
        for m in matches:
            recs = m.get("recommendations", [])
            for r in recs:
                msg = ""
                if isinstance(r, dict):
                    msg = r.get("message", "")
                elif hasattr(r, "message"):
                    msg = getattr(r, "message", "")
                if msg:
                    rec_counter[msg] += 1
                    
        top_recs = []
        for name, count in rec_counter.most_common(5):
            top_recs.append({
                "name": name,
                "count": count,
                "percentage": cls.percentage(count, total)
            })
            
        return {"top_recommendations": top_recs}

    @classmethod
    def calculate_job_history(cls, matches: list[dict]) -> dict:
        total = len(matches)
        if total == 0:
            return {
                "total_matches": 0,
                "latest_match": None,
                "average_matches_per_resume": 0.0,
                "repeated_job_descriptions": 0,
                "historical_match_growth": 0.0
            }
            
        # 1. Latest match mapping
        latest = matches[-1]
        latest_match = {
            "resume_id": latest["resume_id"],
            "timestamp": latest["timestamp"],
            "overall_score": latest["overall_score"],
            "grade": latest["grade"],
            "job_title": latest["job_title"],
            "company": latest["company"]
        }
        
        # 2. Avg matches per resume
        resume_counts = Counter(m["resume_id"] for m in matches if "resume_id" in m)
        avg_per_resume = round(cls.safe_divide(total, len(resume_counts)), 1)
        
        # 3. Repeated job descriptions (matched > 1 time)
        jd_counter = Counter((m["job_title"], m["company"]) for m in matches if "job_title" in m and "company" in m)
        repeated = sum(1 for jd, count in jd_counter.items() if count > 1)
        
        # 4. Growth
        now = datetime.utcnow()
        thirty_days_ago = now - timedelta(days=30)
        sixty_days_ago = now - timedelta(days=60)
        
        last_30 = sum(1 for m in matches if m["timestamp"].replace(tzinfo=None) >= thirty_days_ago)
        prev_30 = sum(1 for m in matches if sixty_days_ago <= m["timestamp"].replace(tzinfo=None) < thirty_days_ago)
        
        if prev_30 == 0:
            growth = 100.0 if last_30 > 0 else 0.0
        else:
            growth = round(((last_30 - prev_30) / prev_30) * 100.0, 1)
            
        return {
            "total_matches": total,
            "latest_match": latest_match,
            "average_matches_per_resume": avg_per_resume,
            "repeated_job_descriptions": repeated,
            "historical_match_growth": growth
        }
