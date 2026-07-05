# app/modules/agents/security.py

import re
import html
import structlog
from typing import Dict, Any, Tuple, Optional

logger = structlog.get_logger()

# Patterns for sensitive data masking (PII, Credentials)
CREDENTIAL_PATTERNS = [
    r"(?i)(?:api_key|apikey|secret|password|passwd|private_key|token|auth_token)\s*[:=]\s*['\"][a-zA-Z0-9_\-\.\~]{8,}['\"]",
    r"(?i)bearer\s+[a-zA-Z0-9_\-\.\~]{15,}",
]

PII_PATTERNS = {
    "credit_card": r"\b(?:\d[ -]*?){13,16}\b",
    "ssn": r"\b\d{3}-\d{2}-\d{4}\b",
    "email": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b"
}

# Prompt Injection Attack Patterns
INJECTION_KEYWORDS = [
    r"(?i)\bignore\s+(?:all\s+)?(?:previous\s+)?instructions\b",
    r"(?i)\bsystem\s+override\b",
    r"(?i)\byou\s+are\s+now\s+a\b",
    r"(?i)\bforget\s+(?:everything\s+)?(?:about\s+)?(?:what\s+)?you\b",
    r"(?i)\bnew\s+role\b",
    r"(?i)\bdo\s+not\s+warn\s+me\b",
    r"(?i)\bdisregard\s+(?:the\s+)?(?:above\s+)?instructions\b",
    r"(?i)\bdeveloper\s+mode\b",
    r"(?i)\bjailbreak\b",
]

def sanitize_input(text: str) -> str:
    """Strips HTML tags, escapes strings, and limits input length to prevent DOS."""
    if not text:
        return ""
    # Strip HTML tags
    clean = re.sub(r"<[^>]*?>", "", text)
    # Unescape and escape to clean entities
    clean = html.escape(html.unescape(clean))
    return clean

def detect_prompt_injection(text: str) -> Tuple[bool, Optional[str]]:
    """Analyzes text for typical prompt injection attacks. Returns (is_attack, reason)."""
    if not text:
        return False, None
        
    for pattern in INJECTION_KEYWORDS:
        if re.search(pattern, text):
            return True, f"Matched prompt injection signature: {pattern}"
            
    # Check for excessive instructions mimicry
    if text.count("---") > 4 or text.count("===") > 4:
        return True, "Excessive delimiter characters (possible structure jailbreak attempt)"
        
    return False, None

def filter_sensitive_info(text: str) -> str:
    """Masks credentials, credit cards, and SSNs from prompts/outputs."""
    if not text:
        return ""
        
    filtered = text
    
    # Mask credentials
    for pattern in CREDENTIAL_PATTERNS:
        matches = re.findall(pattern, filtered)
        for match in matches:
            filtered = filtered.replace(match, "[MASKED_CREDENTIAL]")
            
    # Mask PII
    for name, pattern in PII_PATTERNS.items():
        if name == "email":
            # Mask emails keeping format somewhat but anonymous
            filtered = re.sub(pattern, "masked_email@example.com", filtered)
        else:
            filtered = re.sub(pattern, f"[MASKED_{name.upper()}]", filtered)
            
    return filtered

def log_security_event(event_type: str, user_id: str, details: Dict[str, Any]):
    """Logs a security event to audit system with elevated logger level."""
    logger.warn(
        "security_event_detected",
        event_type=event_type,
        user_id=user_id,
        **details
    )
