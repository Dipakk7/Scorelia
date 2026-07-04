# app/modules/rag/citations/formatter.py

from typing import List
from app.modules.rag.citations.models import Citation, CitationStyle


def format_citation(citation: Citation, index: int, style: CitationStyle) -> str:
    """Format a single Citation object into a string using the specified style.

    Args:
        citation: The Citation object.
        index: The index of the citation (1-based index).
        style: The target CitationStyle.

    Returns:
        Formatted citation string.
    """
    source = citation.source_file or "Unknown Source"
    page = f"p. {citation.page_number}" if citation.page_number else ""
    section = f"Section: {citation.section}" if citation.section else ""

    if style == CitationStyle.IEEE:
        return f"[{index}]"

    elif style == CitationStyle.APA:
        parts = [source]
        if page:
            parts.append(page)
        return f"({', '.join(parts)})"

    elif style == CitationStyle.INLINE:
        page_val = f":{citation.page_number}" if citation.page_number else ""
        return f"[{source}{page_val}]"

    elif style == CitationStyle.NONE:
        return f"{source} (chunk: {citation.chunk_id})"

    else:
        # CitationStyle.STANDARD
        details = []
        if page:
            details.append(page)
        if section:
            details.append(section)
        
        details_str = f" ({', '.join(details)})" if details else ""
        return f"[{index}] {source}{details_str}"


def format_citations(citations: List[Citation], style: CitationStyle) -> List[str]:
    """Format a list of Citation objects into string representations.

    Args:
        citations: List of Citation objects.
        style: CitationStyle to use.

    Returns:
        List of formatted strings.
    """
    return [format_citation(citation, idx + 1, style) for idx, citation in enumerate(citations)]
