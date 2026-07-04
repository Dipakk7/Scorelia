# app/modules/rag/retrieval/filters.py

from typing import Dict, Any, Optional
from app.modules.rag.retrieval.models import MetadataFilter


def compile_metadata_filter(metadata_filter: Optional[MetadataFilter]) -> Optional[Dict[str, Any]]:
    """Compiles a MetadataFilter model into a ChromaDB-compatible 'where' filter dictionary.

    Maps:
    - document_id -> document_id
    - file_type   -> source_type
    - page_number -> page_number
    - section     -> section
    - source      -> source_file
    - version     -> version
    - start_date  -> created_at (string comparison with $gte)
    - end_date    -> created_at (string comparison with $lte)

    Supports single values (equality), lists ($in operator), and date ranges.
    Multiple conditions are logically grouped using the ChromaDB '$and' operator.
    """
    if not metadata_filter:
        return None

    filters = []

    # 1. document_id
    if metadata_filter.document_id is not None:
        if isinstance(metadata_filter.document_id, list):
            if len(metadata_filter.document_id) > 0:
                filters.append({"document_id": {"$in": metadata_filter.document_id}})
        else:
            filters.append({"document_id": metadata_filter.document_id})

    # 2. file_type (source_type in indexed metadata)
    if metadata_filter.file_type is not None:
        if isinstance(metadata_filter.file_type, list):
            if len(metadata_filter.file_type) > 0:
                filters.append({"source_type": {"$in": metadata_filter.file_type}})
        else:
            filters.append({"source_type": metadata_filter.file_type})

    # 3. page_number
    if metadata_filter.page_number is not None:
        if isinstance(metadata_filter.page_number, list):
            if len(metadata_filter.page_number) > 0:
                filters.append({"page_number": {"$in": metadata_filter.page_number}})
        else:
            filters.append({"page_number": metadata_filter.page_number})

    # 4. section
    if metadata_filter.section is not None:
        if isinstance(metadata_filter.section, list):
            if len(metadata_filter.section) > 0:
                filters.append({"section": {"$in": metadata_filter.section}})
        else:
            filters.append({"section": metadata_filter.section})

    # 5. source (source_file in indexed metadata)
    if metadata_filter.source is not None:
        if isinstance(metadata_filter.source, list):
            if len(metadata_filter.source) > 0:
                filters.append({"source_file": {"$in": metadata_filter.source}})
        else:
            filters.append({"source_file": metadata_filter.source})

    # 6. version
    if metadata_filter.version is not None:
        if isinstance(metadata_filter.version, list):
            if len(metadata_filter.version) > 0:
                filters.append({"version": {"$in": metadata_filter.version}})
        else:
            filters.append({"version": metadata_filter.version})

    # 7. Date range on created_at
    if metadata_filter.start_date is not None:
        filters.append({"created_at": {"$gte": metadata_filter.start_date.isoformat()}})

    if metadata_filter.end_date is not None:
        filters.append({"created_at": {"$lte": metadata_filter.end_date.isoformat()}})

    if not filters:
        return None
    if len(filters) == 1:
        return filters[0]
    return {"$and": filters}
