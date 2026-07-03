import uuid
import time
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
import structlog
from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.services.resume_service import get_user_resumes
from app.interview.models.interview import InterviewSession, InterviewTurn
from app.interview.schemas.reports import (
    InterviewAnalyticsResponse,
    TrendAnalysis,
    SkillGapAnalysis,
    Recommendations,
    SessionStatistics,
    ResponseTimeAnalysis
)
from app.interview.services.service import InterviewService

logger = structlog.get_logger()

class InterviewAnalyticsService:
    """Service layer for computing interview session analytics and generating AI reports."""

    def __init__(self, db: Session, interview_service: InterviewService):
        self.db = db
        self.interview_service = interview_service

    def calculate_session_analytics(self, session: InterviewSession) -> InterviewAnalyticsResponse:
        """Compute quantitative metrics and trends from session turns.
        
        Merges them with qualitative report components if cached in session_metadata.
        """
        turns_sorted = sorted(session.turns, key=lambda t: t.question_number)
        evaluated_turns = [t for t in turns_sorted if t.score is not None and t.scores]

        # 1. Base Scores Calculations
        total_eval = len(evaluated_turns)
        overall_score = int(sum(t.score for t in evaluated_turns) / total_eval) if total_eval > 0 else 0

        # Calculate category scores
        category_scores_map = {}
        cat_groups = {}
        for t in evaluated_turns:
            cat = (t.question_category or "GENERAL").upper().strip()
            cat_groups.setdefault(cat, []).append(t.score)
        for cat, scores_list in cat_groups.items():
            category_scores_map[cat] = float(sum(scores_list) / len(scores_list))

        # Calculate average metrics across all evaluated turns
        comm_score = int(sum(t.scores.get("communication_score", 0) for t in evaluated_turns) / total_eval) if total_eval > 0 else 0
        gram_score = int(sum(t.scores.get("grammar_score", 0) for t in evaluated_turns) / total_eval) if total_eval > 0 else 0
        conf_score = int(sum(t.scores.get("confidence_score", 0) for t in evaluated_turns) / total_eval) if total_eval > 0 else 0
        prof_score = int(sum(t.scores.get("professionalism_score", 0) for t in evaluated_turns) / total_eval) if total_eval > 0 else 0

        # Technical Score
        tech_turns = [t for t in evaluated_turns if (t.question_category or "").upper().strip() in ("TECHNICAL", "ROLE_SPECIFIC")]
        technical_score = int(sum(t.scores.get("technical_score", 0) for t in tech_turns) / len(tech_turns)) if tech_turns else overall_score

        # Behavioral Score
        behav_turns = [t for t in evaluated_turns if (t.question_category or "").upper().strip() in ("BEHAVIORAL", "SITUATIONAL")]
        behavioral_score = int(sum(t.score for t in behav_turns) / len(behav_turns)) if behav_turns else overall_score

        # HR Score
        hr_turns = [t for t in evaluated_turns if (t.question_category or "").upper().strip() in ("HR", "FIT")]
        hr_score = int(sum(t.score for t in hr_turns) / len(hr_turns)) if hr_turns else overall_score

        # Problem Solving Score
        ps_scores = []
        for t in evaluated_turns:
            rubric = t.evaluation_metadata.get("rubric_scores", {}) if t.evaluation_metadata else {}
            ps_val = rubric.get("problem_solving") or rubric.get("problem_solving_score")
            if ps_val is not None:
                ps_scores.append(ps_val)
            elif (t.question_category or "").upper().strip() in ("TECHNICAL", "ROLE_SPECIFIC"):
                ps_scores.append(t.scores.get("technical_score", t.score))
        problem_solving_score = int(sum(ps_scores) / len(ps_scores)) if ps_scores else overall_score

        # STAR Score
        star_turns = [t for t in evaluated_turns if (t.question_category or "").upper().strip() in ("BEHAVIORAL", "SITUATIONAL")]
        star_score = int(sum(t.scores.get("star_score", 0) for t in star_turns) / len(star_turns)) if star_turns else 0
        if star_score == 0 and evaluated_turns:
            # Fallback to general star scores if any exist
            all_star = [t.scores.get("star_score", 0) for t in evaluated_turns if t.scores.get("star_score") is not None]
            if all_star:
                star_score = int(sum(all_star) / len(all_star))

        # Question Accuracy
        question_accuracy = float(overall_score)

        # 2. Timing Metrics
        meta = session.session_metadata or {}
        q_timers = meta.get("question_timers", {})
        durations = [t.get("duration_seconds") for t in q_timers.values() if t.get("duration_seconds") is not None]
        avg_resp_time = float(sum(durations) / len(durations)) if durations else 0.0

        session_completion_rate = float((total_eval / session.total_questions) * 100.0) if session.total_questions > 0 else 0.0

        # Difficulty progression
        questions_list = meta.get("questions", [])
        diff_progression = [q.get("difficulty", "MEDIUM") for q in questions_list]

        # Question category distribution
        cat_dist = {}
        for q in questions_list:
            cat = (q.get("category") or "GENERAL").upper().strip()
            cat_dist[cat] = cat_dist.get(cat, 0) + 1

        # Follow-up Question Rate
        followups_count = len([t for t in session.turns if (t.evaluation_metadata or {}).get("is_followup")])
        total_turns_count = len(session.turns)
        follow_up_rate = float((followups_count / total_turns_count) * 100.0) if total_turns_count > 0 else 0.0

        # 3. Trends Calculations
        perf_trend = [t.score for t in turns_sorted if t.score is not None]
        diff_trend = [q.get("difficulty", "MEDIUM") for q in questions_list]
        comm_trend = [t.scores.get("communication_score", 0) for t in turns_sorted if t.score is not None and t.scores]
        conf_trend = [t.scores.get("confidence_score", 0) for t in turns_sorted if t.score is not None and t.scores]
        star_trend = [t.scores.get("star_score", 0) for t in turns_sorted if t.score is not None and t.scores]
        resp_trend = [float(q_timers.get(str(t.question_number), {}).get("duration_seconds", 0.0)) for t in turns_sorted]

        # 4. Load qualitative data from cache if present
        cached_report = meta.get("report", {})
        
        summary = cached_report.get("summary", "No summary report generated yet. Request the full report to trigger AI evaluation.")
        strengths = cached_report.get("strengths", [])
        weaknesses = cached_report.get("weaknesses", [])
        improvement_plan = cached_report.get("improvement_plan", [])

        # Sub-structures
        gap_data = cached_report.get("skill_gap_analysis", {})
        skill_gap = SkillGapAnalysis(
            strong_skills=gap_data.get("strong_skills", []),
            weak_skills=gap_data.get("weak_skills", []),
            missing_topics=gap_data.get("missing_topics", []),
            repeated_mistakes=gap_data.get("repeated_mistakes", []),
            knowledge_gaps=gap_data.get("knowledge_gaps", []),
            behavioral_weaknesses=gap_data.get("behavioral_weaknesses", []),
            technical_weaknesses=gap_data.get("technical_weaknesses", []),
            communication_issues=gap_data.get("communication_issues", []),
            improvement_priorities=gap_data.get("improvement_priorities", [])
        )

        rec_data = cached_report.get("recommendations", {})
        recommendations = Recommendations(
            learning_recommendations=rec_data.get("learning_recommendations", []),
            practice_topics=rec_data.get("practice_topics", []),
            suggested_projects=rec_data.get("suggested_projects", []),
            certification_suggestions=rec_data.get("certification_suggestions", []),
            interview_tips=rec_data.get("interview_tips", []),
            resume_improvement_suggestions=rec_data.get("resume_improvement_suggestions", []),
            cover_letter_suggestions=rec_data.get("cover_letter_suggestions", []),
            career_guidance=rec_data.get("career_guidance", [])
        )

        session_statistics = SessionStatistics(
            overall_score=overall_score,
            technical_score=technical_score,
            behavioral_score=behavioral_score,
            hr_score=hr_score,
            communication_score=comm_score,
            grammar_score=gram_score,
            confidence_score=conf_score,
            professionalism_score=prof_score,
            problem_solving_score=problem_solving_score,
            star_score=star_score,
            question_accuracy=question_accuracy,
            average_response_time=avg_resp_time,
            session_completion_rate=session_completion_rate,
            difficulty_progression=diff_progression,
            question_category_distribution=cat_dist,
            follow_up_question_rate=follow_up_rate
        )

        response_time_analysis = ResponseTimeAnalysis(
            average_response_time=avg_resp_time,
            response_time_trend=resp_trend,
            total_duration_seconds=meta.get("total_duration_seconds"),
            total_paused_seconds=meta.get("total_paused_seconds", 0.0)
        )

        trend_analysis = TrendAnalysis(
            performance_trend=perf_trend,
            difficulty_trend=diff_trend,
            communication_trend=comm_trend,
            confidence_trend=conf_trend,
            star_trend=star_trend,
            response_time_trend=resp_trend
        )

        return InterviewAnalyticsResponse(
            session_id=session.id,
            overall_score=overall_score,
            category_scores=category_scores_map,
            trend_analysis=trend_analysis,
            skill_gap_analysis=skill_gap,
            recommendations=recommendations,
            session_statistics=session_statistics,
            difficulty_progression=diff_progression,
            response_time_analysis=response_time_analysis,
            strengths=strengths,
            weaknesses=weaknesses,
            improvement_plan=improvement_plan,
            summary=summary
        )

    async def get_or_create_report(self, session_id: uuid.UUID, user_id: uuid.UUID) -> InterviewAnalyticsResponse:
        """Retrieve cached session report or trigger AI report synthesis."""
        session = self.interview_service.db.query(InterviewSession).filter(
            InterviewSession.id == session_id,
            InterviewSession.user_id == user_id
        ).first()
        
        if not session:
            raise ValueError(f"Interview session with ID '{session_id}' not found.")

        meta = session.session_metadata or {}
        if "report" in meta:
            # Report is already cached, return it!
            return self.calculate_session_analytics(session)

        # Trigger fresh generation
        return await self.regenerate_report(session_id, user_id)

    async def regenerate_report(self, session_id: uuid.UUID, user_id: uuid.UUID) -> InterviewAnalyticsResponse:
        """Trigger AI report synthesis directly, bypassing and updating cache."""
        session = self.interview_service.db.query(InterviewSession).filter(
            InterviewSession.id == session_id,
            InterviewSession.user_id == user_id
        ).first()

        if not session:
            raise ValueError(f"Interview session with ID '{session_id}' not found.")

        # Ensure we have turns to aggregate
        turns_sorted = sorted(session.turns, key=lambda t: t.question_number)
        evaluated_turns = [t for t in turns_sorted if t.score is not None]
        if not evaluated_turns:
            raise ValueError("Cannot generate a report for a session with no evaluated answers.")

        # Load Resume details
        resume = None
        if session.resume_id:
            resume = self.interview_service.db.query(Resume).filter(
                Resume.id == session.resume_id,
                Resume.user_id == user_id
            ).first()
        else:
            # Fallback: Latest resume
            resumes = get_user_resumes(self.interview_service.db, user_id)
            if resumes:
                resume = resumes[0]

        resume_skills = []
        resume_experience = ""
        if resume and resume.parsed_data:
            resume_skills = resume.parsed_data.get("skills", [])
            exp_list = resume.parsed_data.get("experience", [])
            exp_strings = []
            for exp in exp_list:
                title = exp.get("title", "Software Engineer")
                company = exp.get("company", "Company")
                duration = exp.get("duration", "")
                desc = exp.get("description", "")
                exp_strings.append(f"{title} at {company} ({duration}): {desc}")
            resume_experience = "; ".join(exp_strings)

        # Compile turns details for prompt
        turns_context = []
        for t in evaluated_turns:
            scores = t.scores or {}
            meta_eval = t.evaluation_metadata or {}
            turns_context.append({
                "question_number": t.question_number,
                "question_category": t.question_category or "GENERAL",
                "question_text": t.question_text,
                "answer_text": t.answer_text or "[No Answer]",
                "score": t.score or 0,
                "feedback": t.feedback or "",
                "strengths": meta_eval.get("strengths", []),
                "weaknesses": meta_eval.get("weaknesses", []),
                "missing_topics": meta_eval.get("missing_topics", []),
                "improvements": meta_eval.get("improvements", [])
            })

        # Build prompt inputs
        variables = {
            "role": session.target_role or "Software Engineer",
            "company": session.company_name or "Target Company",
            "interview_type": session.interview_type,
            "difficulty": session.difficulty,
            "resume_skills": resume_skills,
            "resume_experience": resume_experience,
            "turns": turns_context
        }

        # Run LLM report generation synthesis
        start_time = time.perf_counter()
        
        ai_response = await self.interview_service.interview_ai_service.ai_service.execute(
            category="interview",
            name="report_generation",
            variables=variables,
            parser_type="json",
            temperature=0.3,
            max_tokens=2048
        )
        
        latency_ms = (time.perf_counter() - start_time) * 1000

        # Validate parsed response dictionary
        report_data = ai_response.parsed_response
        if not isinstance(report_data, dict):
            raise ValueError("AI Service did not return a valid JSON object dictionary for the report.")

        # Ensure all expected top-level keys exist
        for key in ["summary", "strengths", "weaknesses", "improvement_plan", "skill_gap_analysis", "recommendations"]:
            if key not in report_data:
                report_data[key] = {} if key in ("skill_gap_analysis", "recommendations") else [] if key in ("strengths", "weaknesses", "improvement_plan") else "Analysis not completed."

        # Cache report inside session metadata
        meta = dict(session.session_metadata or {})
        meta["report"] = report_data
        session.session_metadata = meta
        
        self.interview_service.db.commit()

        # Privacy-conscious logging (no resume contents, answers, or prompt text)
        logger.info(
            "interview_report_generated",
            session_id=str(session.id),
            latency=latency_ms,
            provider=ai_response.provider,
            model=ai_response.model,
            generation_time=datetime.now(timezone.utc).isoformat()
        )

        return self.calculate_session_analytics(session)

    async def get_history_analytics(self, user_id: uuid.UUID) -> Dict[str, Any]:
        """Aggregate data programmatically across all completed interview sessions for a user."""
        sessions = self.interview_service.db.query(InterviewSession).filter(
            InterviewSession.user_id == user_id,
            InterviewSession.status == "COMPLETED"
        ).order_by(InterviewSession.created_at.asc()).all()

        if not sessions:
            return {
                "total_sessions": 0,
                "completed_sessions": 0,
                "average_overall_score": 0.0,
                "average_category_scores": {},
                "overall_performance_trend": [],
                "difficulty_trend": [],
                "communication_trend": [],
                "confidence_trend": [],
                "star_trend": [],
                "response_time_trend": [],
                "skill_improvement_trend": {},
                "skill_gap_analysis": {
                    "strong_skills": [],
                    "weak_skills": [],
                    "missing_topics": [],
                    "repeated_mistakes": [],
                    "knowledge_gaps": [],
                    "behavioral_weaknesses": [],
                    "technical_weaknesses": [],
                    "communication_issues": [],
                    "improvement_priorities": []
                },
                "recommendations": {
                    "learning_recommendations": [],
                    "practice_topics": [],
                    "suggested_projects": [],
                    "certification_suggestions": [],
                    "interview_tips": [],
                    "resume_improvement_suggestions": [],
                    "cover_letter_suggestions": [],
                    "career_guidance": []
                }
            }

        # 1. Programmatic Numeric Aggregations
        session_analytics = [self.calculate_session_analytics(s) for s in sessions]
        
        total_sessions = len(sessions)
        avg_score = float(sum(sa.overall_score for sa in session_analytics) / total_sessions)

        # Average category scores
        category_scores_map = {}
        category_counts = {}
        for sa in session_analytics:
            for cat, score in sa.category_scores.items():
                category_scores_map[cat] = category_scores_map.get(cat, 0.0) + score
                category_counts[cat] = category_counts.get(cat, 0) + 1
        for cat in category_scores_map:
            category_scores_map[cat] = category_scores_map[cat] / category_counts[cat]

        # Trends over time
        perf_trend = [sa.overall_score for sa in session_analytics]
        diff_trend = [s.difficulty for s in sessions]
        comm_trend = [int(sa.session_statistics.communication_score) for sa in session_analytics]
        conf_trend = [int(sa.session_statistics.confidence_score) for sa in session_analytics]
        star_trend = [int(sa.session_statistics.star_score) for sa in session_analytics]
        resp_trend = [float(sa.session_statistics.average_response_time) for sa in session_analytics]

        # Skill Improvement Trend
        overall_imp = float(perf_trend[-1] - perf_trend[0]) if len(perf_trend) > 1 else 0.0
        improvement_trend = {
            "overall_score_change": overall_imp,
            "recent_vs_average": float(perf_trend[-1] - avg_score)
        }

        # 2. Skill Gap Aggregations
        all_strong_skills = []
        all_weak_skills = []
        all_missing_topics = []
        all_mistakes = []
        all_kgaps = []
        all_bweak = []
        all_tweak = []
        all_comm_issues = []
        all_priorities = []

        for sa in session_analytics:
            all_strong_skills.extend(sa.skill_gap_analysis.strong_skills)
            all_weak_skills.extend(sa.skill_gap_analysis.weak_skills)
            all_missing_topics.extend(sa.skill_gap_analysis.missing_topics)
            all_mistakes.extend(sa.skill_gap_analysis.repeated_mistakes)
            all_kgaps.extend(sa.skill_gap_analysis.knowledge_gaps)
            all_bweak.extend(sa.skill_gap_analysis.behavioral_weaknesses)
            all_tweak.extend(sa.skill_gap_analysis.technical_weaknesses)
            all_comm_issues.extend(sa.skill_gap_analysis.communication_issues)
            all_priorities.extend(sa.skill_gap_analysis.improvement_priorities)

        # Deduplicate list elements preserving order or pick top frequencies
        def unique_list(seq: List[str]) -> List[str]:
            seen = set()
            return [x for x in seq if not (x in seen or seen.add(x))]

        skill_gap = {
            "strong_skills": unique_list(all_strong_skills)[:8],
            "weak_skills": unique_list(all_weak_skills)[:8],
            "missing_topics": unique_list(all_missing_topics)[:8],
            "repeated_mistakes": unique_list(all_mistakes)[:8],
            "knowledge_gaps": unique_list(all_kgaps)[:8],
            "behavioral_weaknesses": unique_list(all_bweak)[:8],
            "technical_weaknesses": unique_list(all_tweak)[:8],
            "communication_issues": unique_list(all_comm_issues)[:8],
            "improvement_priorities": unique_list(all_priorities)[:8]
        }

        # 3. Recommendations Consolidation
        # Pull consolidated lists from recent sessions' recommendations
        learning_recs = []
        practice_topics = []
        projects = []
        certifications = []
        tips = []
        resume_recs = []
        cover_letter_recs = []
        career_guidance_recs = []

        for sa in reversed(session_analytics):  # prioritize recent sessions
            learning_recs.extend(sa.recommendations.learning_recommendations)
            practice_topics.extend(sa.recommendations.practice_topics)
            projects.extend(sa.recommendations.suggested_projects)
            certifications.extend(sa.recommendations.certification_suggestions)
            tips.extend(sa.recommendations.interview_tips)
            resume_recs.extend(sa.recommendations.resume_improvement_suggestions)
            cover_letter_recs.extend(sa.recommendations.cover_letter_suggestions)
            career_guidance_recs.extend(sa.recommendations.career_guidance)

        recs = {
            "learning_recommendations": unique_list(learning_recs)[:8],
            "practice_topics": unique_list(practice_topics)[:8],
            "suggested_projects": unique_list(projects)[:5],
            "certification_suggestions": unique_list(certifications)[:5],
            "interview_tips": unique_list(tips)[:8],
            "resume_improvement_suggestions": unique_list(resume_recs)[:5],
            "cover_letter_suggestions": unique_list(cover_letter_recs)[:5],
            "career_guidance": unique_list(career_guidance_recs)[:5]
        }

        return {
            "total_sessions": total_sessions,
            "completed_sessions": total_sessions,
            "average_overall_score": round(avg_score, 1),
            "average_category_scores": category_scores_map,
            "overall_performance_trend": perf_trend,
            "difficulty_trend": diff_trend,
            "communication_trend": comm_trend,
            "confidence_trend": conf_trend,
            "star_trend": star_trend,
            "response_time_trend": resp_trend,
            "skill_improvement_trend": improvement_trend,
            "skill_gap_analysis": skill_gap,
            "recommendations": recs
        }
