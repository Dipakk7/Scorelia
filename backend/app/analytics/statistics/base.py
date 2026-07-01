import math
from datetime import datetime
from app.analytics.utils import safe_division, percentage, format_timeline_key

class BaseStatistics:
    """
    Base statistics class containing shared calculation, average, median,
    and timeline formatting helpers for Resume, ATS, and future statistics.
    """
    
    @staticmethod
    def safe_divide(numerator: float, denominator: float, default: float = 0.0) -> float:
        """Safely divide numerator by denominator, returning default if division by zero."""
        return safe_division(numerator, denominator, default)

    @staticmethod
    def percentage(part: float, total: float) -> float:
        """Safely calculate percentage formatted to 1 decimal place."""
        return percentage(part, total)

    @staticmethod
    def calculate_average(values: list[float | int]) -> float:
        """Calculate the average of numeric values rounded to 1 decimal place."""
        if not values:
            return 0.0
        return round(sum(values) / len(values), 1)

    @staticmethod
    def calculate_median(values: list[float | int]) -> float:
        """Calculate the median of numeric values rounded to 1 decimal place."""
        if not values:
            return 0.0
        sorted_vals = sorted(values)
        n = len(sorted_vals)
        mid = n // 2
        if n % 2 == 0:
            median_val = (sorted_vals[mid - 1] + sorted_vals[mid]) / 2.0
        else:
            median_val = sorted_vals[mid]
        return round(float(median_val), 1)

    @staticmethod
    def format_timeline(dt: datetime, bucket_type: str) -> str:
        """Format datetime into standard chronological daily, weekly, or monthly string key."""
        return format_timeline_key(dt, bucket_type)
