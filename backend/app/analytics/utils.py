from datetime import datetime, timedelta

DEGREE_SCORES = {
    "PhD": 4,
    "Master": 3,
    "Bachelor": 2,
    "Diploma": 1,
    "Other": 0
}

def normalize_degree(degree_str: str) -> str:
    """Normalize education degrees to standard categories."""
    if not degree_str or not isinstance(degree_str, str):
        return "Other"
    d = degree_str.lower()
    if "phd" in d or "ph.d" in d or "doctor" in d:
        return "PhD"
    if "master" in d or "m.s" in d or "m.a" in d or "mba" in d or "m.tech" in d or "ms" == d.strip():
        return "Master"
    if "bachelor" in d or "b.s" in d or "b.a" in d or "b.tech" in d or "b.sc" in d or "bs" == d.strip() or "ba" == d.strip():
        return "Bachelor"
    if "diploma" in d or "associate" in d:
        return "Diploma"
    return "Other"

def safe_division(numerator: float, denominator: float, default: float = 0.0) -> float:
    """Safely divide two numbers, returning a default value if dividing by zero."""
    if not denominator:
        return default
    return numerator / denominator

def percentage(part: float, total: float) -> float:
    """Calculate percentage safely, returning float rounded to 1 decimal place."""
    return round(safe_division(part, total) * 100, 1)

def format_timeline_key(dt: datetime, bucket_type: str) -> str:
    """Format a datetime object into a timeline bucket string (daily, weekly, monthly)."""
    if bucket_type == "daily":
        return dt.strftime("%Y-%m-%d")
    elif bucket_type == "weekly":
        week_start = dt - timedelta(days=dt.weekday())
        return week_start.strftime("%Y-%m-%d")
    elif bucket_type == "monthly":
        return dt.strftime("%Y-%m")
    raise ValueError(f"Unknown bucket type: {bucket_type}")
