from app.core.enums import InterviewType, InterviewDifficulty, QuestionCategory

DEFAULT_TOTAL_QUESTIONS = 5
DEFAULT_DIFFICULTY = InterviewDifficulty.MEDIUM.value
DEFAULT_INTERVIEW_TYPE = InterviewType.BEHAVIORAL.value

QUESTION_CATEGORIES = [c.value for c in QuestionCategory]

SCORE_BANDS = {
    "EXCELLENT": (90, 100),
    "GOOD": (70, 89),
    "AVERAGE": (50, 69),
    "POOR": (0, 49)
}
