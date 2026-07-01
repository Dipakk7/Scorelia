from typing import Dict, Any

TEMPLATES: Dict[str, Dict[str, Any]] = {
    "Professional": {
        "font_family": "Helvetica",
        "font_size": 11,
        "line_height": 14,
        "primary_color": "#1E293B",  # Dark Slate
        "secondary_color": "#475569", # Muted Slate
        "margin_inches": 0.75,
        "header_align": "LEFT",
        "divider": True,
        "spacing_after_header": 18,
        "spacing_paragraph": 12,
    },
    "Modern": {
        "font_family": "Helvetica",
        "font_size": 11,
        "line_height": 15,
        "primary_color": "#0F172A",  # Charcoal Black
        "secondary_color": "#0EA5E9", # Modern Sky Blue
        "margin_inches": 0.75,
        "header_align": "LEFT",
        "divider": True,
        "spacing_after_header": 20,
        "spacing_paragraph": 14,
    },
    "Minimal": {
        "font_family": "Helvetica",
        "font_size": 10,
        "line_height": 13,
        "primary_color": "#111827",  # Pitch Black
        "secondary_color": "#6B7280", # Gray
        "margin_inches": 1.0,
        "header_align": "LEFT",
        "divider": False,
        "spacing_after_header": 14,
        "spacing_paragraph": 10,
    },
    "Corporate": {
        "font_family": "Times-Roman",
        "font_size": 11,
        "line_height": 14,
        "primary_color": "#1B365D",  # Deep Navy Blue
        "secondary_color": "#475569",
        "margin_inches": 0.75,
        "header_align": "RIGHT",
        "divider": True,
        "spacing_after_header": 22,
        "spacing_paragraph": 12,
    },
    "Startup": {
        "font_family": "Helvetica",
        "font_size": 11,
        "line_height": 15,
        "primary_color": "#6366F1",  # Trendy Indigo
        "secondary_color": "#1F2937", # Dark Gray
        "margin_inches": 0.75,
        "header_align": "LEFT",
        "divider": False,
        "spacing_after_header": 16,
        "spacing_paragraph": 12,
    },
    "Executive": {
        "font_family": "Times-Roman",
        "font_size": 12,
        "line_height": 16,
        "primary_color": "#4A0E17",  # Rich Burgundy
        "secondary_color": "#374151",
        "margin_inches": 0.8,
        "header_align": "CENTER",
        "divider": True,
        "spacing_after_header": 24,
        "spacing_paragraph": 14,
    },
    "Academic": {
        "font_family": "Times-Roman",
        "font_size": 12,
        "line_height": 16,
        "primary_color": "#000000",  # Strict Black
        "secondary_color": "#334155",
        "margin_inches": 1.0,
        "header_align": "LEFT",
        "divider": False,
        "spacing_after_header": 15,
        "spacing_paragraph": 12,
    },
    "Government": {
        "font_family": "Times-Roman",
        "font_size": 11,
        "line_height": 14,
        "primary_color": "#0F172A",  # Formal Navy/Black
        "secondary_color": "#1E293B",
        "margin_inches": 1.0,
        "header_align": "LEFT",
        "divider": True,
        "spacing_after_header": 20,
        "spacing_paragraph": 12,
    }
}

SUPPORTED_TEMPLATES = list(TEMPLATES.keys())
