"""Entity extraction modules using NLP models and matching pipelines."""

import re
import spacy
from spacy.matcher import PhraseMatcher
from app.core.config import settings
from app.core.parser_constants import (
    EMAIL_REGEX,
    PHONE_REGEX,
    URL_REGEX,
    SECTION_HEADERS,
)
from app.core.skills_data import TECH_SKILLS

# Module-level cache
_nlp_model = None
_skill_matcher = None
_skill_casing_map = None

def get_nlp_model():
    """Lazy load the spaCy NLP model."""
    global _nlp_model
    if _nlp_model is None:
        _nlp_model = spacy.load(settings.SPACY_MODEL)
    return _nlp_model

def get_skill_matcher():
    """Lazy load the PhraseMatcher loaded with technical skills."""
    global _skill_matcher
    if _skill_matcher is None:
        nlp = get_nlp_model()
        matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
        
        # Compile patterns from TECH_SKILLS
        patterns = []
        for category, skills in TECH_SKILLS.items():
            for skill in skills:
                patterns.append(nlp.make_doc(skill))
        matcher.add("SKILL", patterns)
        _skill_matcher = matcher
    return _skill_matcher

def get_skill_casing_map() -> dict:
    """Generate casing map from lowercase to original casing in TECH_SKILLS."""
    global _skill_casing_map
    if _skill_casing_map is None:
        casing_map = {}
        for category, skills in TECH_SKILLS.items():
            for skill in skills:
                casing_map[skill.lower()] = skill
        _skill_casing_map = casing_map
    return _skill_casing_map

MONTH_MAP = {
    "jan": "01", "january": "01",
    "feb": "02", "february": "02",
    "mar": "03", "march": "03",
    "apr": "04", "april": "04",
    "may": "05",
    "jun": "06", "june": "06",
    "jul": "07", "july": "07",
    "aug": "08", "august": "08",
    "sep": "09", "september": "09",
    "oct": "10", "october": "10",
    "nov": "11", "november": "11",
    "dec": "12", "december": "12"
}

def normalize_single_date(s: str) -> str:
    s_clean = s.strip()
    if not s_clean:
        return ""
    if s_clean.lower() in ("present", "current", "now"):
        return "Present"
    
    # 1. Month name + Year: e.g. "Jan 2022", "January 2022", "Jan. 2022"
    month_year_pattern = r'\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{4})\b'
    m = re.search(month_year_pattern, s_clean, re.IGNORECASE)
    if m:
        month_name = m.group(1).lower()
        year = m.group(2)
        month_num = MONTH_MAP.get(month_name, "01")
        return f"{year}-{month_num}"
        
    # 2. MM/YYYY: e.g. "01/2022", "1/2022", "01-2022", "01.2022"
    mm_yyyy_pattern = r'\b(\d{1,2})[/\.-](\d{4})\b'
    m = re.search(mm_yyyy_pattern, s_clean)
    if m:
        month = int(m.group(1))
        year = m.group(2)
        if 1 <= month <= 12:
            return f"{year}-{month:02d}"
            
    # 3. YYYY: e.g. "2022"
    yyyy_pattern = r'\b(\d{4})\b'
    m = re.search(yyyy_pattern, s_clean)
    if m:
        return m.group(1)
        
    return s_clean

def normalize_date_range(duration_str: str) -> str:
    if not duration_str:
        return ""
    # Split by common separators: -, –, —, to, till
    parts = re.split(r'\s*(?:-|–|—|to|till)\s*', duration_str.strip())
    if len(parts) == 2:
        start = normalize_single_date(parts[0])
        end = normalize_single_date(parts[1])
        return f"{start} - {end}"
    elif len(parts) == 1:
        return normalize_single_date(parts[0])
    return duration_str

def normalize_email(email_str: str | None) -> str | None:
    if not email_str:
        return None
    email_clean = email_str.strip()
    if not re.match(r'^' + EMAIL_REGEX + r'$', email_clean):
        return None
    return email_clean.lower()

def normalize_phone(phone_str: str | None) -> str | None:
    if not phone_str:
        return None
    phone_clean = phone_str.strip()
    digits = re.sub(r'\D', '', phone_clean)
    if not digits:
        return None
    
    if phone_clean.startswith('+') or len(digits) > 10:
        if len(digits) > 10:
            cc = digits[:-10]
            local = digits[-10:]
        else:
            cc = ""
            local = digits
        
        cc_prefix = f"+{cc}" if cc else ""
        if len(local) == 10:
            local_formatted = f"{local[:3]}-{local[3:6]}-{local[6:]}"
        else:
            local_formatted = local
            
        if cc_prefix:
            return f"{cc_prefix} {local_formatted}"
        else:
            return local_formatted
    else:
        if len(digits) == 10:
            return f"{digits[:3]}-{digits[3:6]}-{digits[6:]}"
        else:
            return digits

def normalize_link(url: str) -> str:
    url_clean = url.strip()
    while url_clean.endswith("/"):
        url_clean = url_clean[:-1]
    
    if not re.match(r'^https?://', url_clean, re.IGNORECASE):
        url_clean = "https://" + url_clean
    else:
        scheme_match = re.match(r'^(https?)(://)(.*)', url_clean, re.IGNORECASE)
        if scheme_match:
            url_clean = scheme_match.group(1).lower() + scheme_match.group(2) + scheme_match.group(3)
    
    return url_clean

def extract_email(text: str) -> str | None:
    """Extract first email using regex and normalize it."""
    if not text:
        return None
    match = re.search(EMAIL_REGEX, text)
    return normalize_email(match.group(0)) if match else None

def extract_phone(text: str) -> str | None:
    """Extract first phone number using regex and normalize it."""
    if not text:
        return None
    match = re.search(PHONE_REGEX, text)
    return normalize_phone(match.group(0)) if match else None

def extract_links(text: str) -> list[str]:
    """Extract unique LinkedIn, GitHub, Portfolio, Website, LeetCode, HackerRank, Kaggle URLs and normalize them."""
    if not text:
        return []
        
    matches = re.findall(URL_REGEX, text)
    links = []
    seen = set()
    
    # Supported domains specified by user
    domains = ["linkedin.com", "github.com", "leetcode.com", "hackerrank.com", "kaggle.com"]
    ignored_terms = {"b.tech", "m.tech", "b.e", "m.e", "ph.d", "phd"}
    
    for m in matches:
        m_clean = m.rstrip(".,?!:;/)-")
        
        # Skip emails matching general URL pattern
        if "@" in m_clean and not m_clean.startswith(("http://", "https://")):
            continue
            
        if m_clean.lower() in ignored_terms:
            continue
            
        norm_m = normalize_link(m_clean)
        
        if norm_m not in seen:
            seen.add(norm_m)
            links.append(norm_m)
            
    return links

def extract_name(text: str) -> str | None:
    """Extract first name entity from the first 500 characters using spaCy NER."""
    if not text:
        return None
    chunk = text[:500]
    nlp = get_nlp_model()
    doc = nlp(chunk)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            # Extract first line to avoid multi-line false positives from spaCy small model
            name = ent.text.split("\n")[0].strip()
            if name:
                return name
    return None

def extract_skills(text: str) -> list[str]:
    """Extract technical skills from text using PhraseMatcher.
    
    Preserves casing from TECH_SKILLS and returns them sorted alphabetically.
    Ignores skills shorter than 2 characters and removes duplicates.
    """
    if not text:
        return []
    nlp = get_nlp_model()
    matcher = get_skill_matcher()
    casing_map = get_skill_casing_map()
    
    doc = nlp(text)
    matches = matcher(doc)
    
    extracted = set()
    for match_id, start, end in matches:
        span = doc[start:end]
        span_lower = span.text.lower()
        if span_lower in casing_map:
            val = casing_map[span_lower]
            if len(val) >= 2:
                extracted.add(val)
            
    return sorted(list(extracted), key=str.lower)

def _extract_section_text(text: str, section_key: str) -> str | None:
    """Helper heuristic to extract section content based on headers.
    
    Looks for headers of the specified section key and extracts text
    until the next known header from any section is encountered.
    """
    if not text:
        return None
        
    lines = text.split("\n")
    target_start_idx = -1
    
    # 1. Locate the header line for the targeted section
    for idx, line in enumerate(lines):
        clean_line = line.strip().lower().rstrip(":")
        if clean_line in SECTION_HEADERS[section_key]:
            target_start_idx = idx
            break
            
    if target_start_idx == -1:
        return None
        
    # 2. Extract lines until the next section header is encountered
    target_end_idx = len(lines)
    for idx in range(target_start_idx + 1, len(lines)):
        clean_line = lines[idx].strip().lower().rstrip(":")
        # Check if the line matches any known section header
        matched_any = False
        for sec_key, headers in SECTION_HEADERS.items():
            if clean_line in headers:
                matched_any = True
                break
        if matched_any:
            target_end_idx = idx
            break
            
    # Join and return stripped content
    section_lines = lines[target_start_idx + 1 : target_end_idx]
    section_text = "\n".join(section_lines).strip()
    return section_text if section_text else None

# Regex patterns for Education
DEGREE_PATTERNS = [
    r"\bB\.?\s?Tech\b(?:\s+in\s+[A-Za-z]+(?:\s+[A-Za-z]+){0,3})?",
    r"\bM\.?\s?Tech\b(?:\s+in\s+[A-Za-z]+(?:\s+[A-Za-z]+){0,3})?",
    r"\bB\.?\s?C\.?\s?A\b",
    r"\bM\.?\s?C\.?\s?A\b",
    r"\bB\.?\s?E\b(?:\s+in\s+[A-Za-z]+(?:\s+[A-Za-z]+){0,3})?",
    r"\bPh\.?D\b",
    r"\bPhD\b",
    r"\bBachelor(?:'s)?(?:\s+of\s+[A-Za-z]+(?:\s+[A-Za-z]+){0,4})?",
    r"\bMaster(?:'s)?(?:\s+of\s+[A-Za-z]+(?:\s+[A-Za-z]+){0,4})?",
    r"\bDiploma\b"
]

# Character class excluding delimiters to prevent greediness across lines/parts
INSTITUTION_PATTERN = r'\b(?:[A-Za-z0-9\.\s&]+)?\b(?:University|College|Institute|School|Academy|IIT|MIT|BITS|NIT)\b(?:\s+(?:of|for|in|at)\s+[A-Za-z0-9\.\s&]+|\s+[A-Za-z0-9\.\s&]+)?'

def extract_education(text: str) -> list[dict]:
    """Extract education details using section-based heuristics and regex."""
    section_text = _extract_section_text(text, "education")
    if not section_text:
        return []
        
    lines = [line.strip() for line in section_text.split("\n") if line.strip()]
    results = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Check if line contains a degree pattern
        has_degree = False
        degree_name = None
        for pattern in DEGREE_PATTERNS:
            m = re.search(pattern, line, re.IGNORECASE)
            if m:
                has_degree = True
                degree_name = m.group(0).strip()
                break
                
        if has_degree:
            entry_lines = [line]
            j = i + 1
            while j < len(lines):
                next_line = lines[j]
                if any(re.search(pat, next_line, re.IGNORECASE) for pat in DEGREE_PATTERNS):
                    break
                entry_lines.append(next_line)
                j += 1
                
            # Search for institution name line-by-line to avoid greedy cross-line matches
            institution = ""
            for eline in entry_lines:
                inst_match = re.search(INSTITUTION_PATTERN, eline, re.IGNORECASE)
                if inst_match:
                    institution = inst_match.group(0).strip()
                    break
            
            entry_text = " ".join(entry_lines)
            # Find passing year
            year_match = re.search(r'\b(19\d{2}|20\d{2})\b', entry_text)
            year = year_match.group(1) if year_match else ""
            
            results.append({
                "degree": degree_name or "",
                "institution": institution,
                "year": normalize_single_date(year),
                "raw_text": "\n".join(entry_lines)
            })
            i = j
        else:
            # Check for institution in current line
            inst_match = re.search(INSTITUTION_PATTERN, line, re.IGNORECASE)
            if inst_match:
                entry_lines = [line]
                degree_name = ""
                
                # Check if next line contains a degree
                j = i + 1
                if j < len(lines):
                    next_line = lines[j]
                    for pat in DEGREE_PATTERNS:
                        m = re.search(pat, next_line, re.IGNORECASE)
                        if m:
                            degree_name = m.group(0).strip()
                            entry_lines.append(next_line)
                            break
                    if len(entry_lines) > 1:
                        i = j
                        
                institution = inst_match.group(0).strip()
                entry_text = " ".join(entry_lines)
                year_match = re.search(r'\b(19\d{2}|20\d{2})\b', entry_text)
                year = year_match.group(1) if year_match else ""
                
                results.append({
                    "degree": degree_name,
                    "institution": institution,
                    "year": normalize_single_date(year),
                    "raw_text": "\n".join(entry_lines)
                })
            i += 1
            
    # Deduplicate education entries while preserving order
    seen = set()
    deduped_results = []
    for edu in results:
        deg = (edu.get("degree") or "").strip().lower()
        inst = (edu.get("institution") or "").strip().lower()
        yr = (edu.get("year") or "").strip().lower()
        raw = (edu.get("raw_text") or "").strip().lower()
        if deg or inst:
            key = (deg, inst, yr)
        else:
            key = (raw,)
        if key not in seen:
            seen.add(key)
            deduped_results.append(edu)
            
    return deduped_results

# Experience heuristics
ROLE_PATTERNS = [
    r"\bSoftware\s+Engineer\b",
    r"\bData\s+Scientist\b",
    r"\bML\s+Engineer\b",
    r"\bAnalyst\b",
    r"\bDeveloper\b",
    r"\bResearcher\b",
    r"\bIntern\b"
]

DATE_RANGE_REGEX = r'\b(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+)?(?:\d{2}/)?(?:20|19)\d{2}\s*(?:-|–|to)\s*(?:Present|(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+)?(?:\d{2}/)?(?:20|19)\d{2})\b'

def extract_experience(text: str) -> list[dict]:
    """Extract professional experience entries using custom heuristics."""
    section_text = _extract_section_text(text, "experience")
    if not section_text:
        return []
        
    lines = [line.strip() for line in section_text.split("\n")]
    items = []
    current_item = None
    
    for line in lines:
        if not line:
            continue
            
        found_role = None
        for pattern in ROLE_PATTERNS:
            m = re.search(pattern, line, re.IGNORECASE)
            if m:
                segments = re.split(r'[-–|•,]', line)
                for seg in segments:
                    if re.search(pattern, seg, re.IGNORECASE):
                        found_role = seg.strip()
                        break
                if not found_role:
                    found_role = m.group(0).strip()
                break
                
        if found_role:
            if current_item:
                items.append(current_item)
                
            company = ""
            
            # Check for "at" pattern first
            at_match = re.search(r'\bat\s+([A-Za-z0-9\s&,\.]+)', line, re.IGNORECASE)
            if at_match:
                company = at_match.group(1).strip()
                title = line[:at_match.start()].strip()
                if not title:
                    title = found_role
            else:
                title = found_role
                segments = [seg.strip() for seg in re.split(r'[-–|•,]', line) if seg.strip()]
                if len(segments) > 1:
                    for seg in segments:
                        if title.lower() in seg.lower():
                            title = seg
                        elif not re.search(DATE_RANGE_REGEX, seg, re.IGNORECASE):
                            company = seg
            
            dur_match = re.search(DATE_RANGE_REGEX, line, re.IGNORECASE)
            duration = dur_match.group(0).strip() if dur_match else ""
            
            current_item = {
                "title": title,
                "company": company,
                "duration": duration,
                "description": "",
                "raw_lines": [line]
            }
        else:
            if current_item:
                current_item["raw_lines"].append(line)
                
                dur_match = re.search(DATE_RANGE_REGEX, line, re.IGNORECASE)
                if dur_match and not current_item["duration"]:
                    current_item["duration"] = dur_match.group(0).strip()
                else:
                    clean_line = re.sub(r'^[•\-\*\s]+', '', line).strip()
                    if clean_line:
                        if current_item["description"]:
                            current_item["description"] += "\n" + clean_line
                        else:
                            current_item["description"] = clean_line
                            
    if current_item:
        items.append(current_item)
        
    for item in items:
        item["raw_text"] = "\n".join(item.pop("raw_lines"))
        item["duration"] = normalize_date_range(item["duration"])
        
    # Deduplicate experience entries while preserving order
    seen = set()
    deduped_items = []
    for exp in items:
        title = (exp.get("title") or "").strip().lower()
        comp = (exp.get("company") or "").strip().lower()
        dur = (exp.get("duration") or "").strip().lower()
        raw = (exp.get("raw_text") or "").strip().lower()
        if title or comp:
            key = (title, comp, dur)
        else:
            key = (raw,)
        if key not in seen:
            seen.add(key)
            deduped_items.append(exp)
            
    return deduped_items

def extract_projects(text: str) -> list[dict]:
    """Extract academic or personal projects."""
    section_text = _extract_section_text(text, "projects")
    if not section_text:
        return []
        
    blocks = [b.strip() for b in section_text.split("\n\n") if b.strip()]
    
    if len(blocks) <= 1:
        lines = [line.strip() for line in section_text.split("\n") if line.strip()]
        blocks = []
        current_block = []
        for line in lines:
            is_header = False
            if not line.startswith(("-", "*", "•")):
                if len(line.split()) < 10:
                    is_header = True
            if is_header and current_block:
                blocks.append("\n".join(current_block))
                current_block = [line]
            else:
                current_block.append(line)
        if current_block:
            blocks.append("\n".join(current_block))
            
    results = []
    for block in blocks:
        lines = [l.strip() for l in block.split("\n") if l.strip()]
        if not lines:
            continue
            
        first_line = lines[0]
        name = first_line
        
        for sep in [":", " - ", " – ", " | "]:
            if sep in first_line:
                name = first_line.split(sep)[0].strip()
                break
                
        name = re.sub(r'^[•\-\*\s]+', '', name).strip()
        
        description = ""
        if len(lines) > 1:
            desc_lines = []
            for line in lines[1:]:
                clean_l = re.sub(r'^[•\-\*\s]+', '', line).strip()
                if clean_l:
                    desc_lines.append(clean_l)
            description = " ".join(desc_lines)
        else:
            if name != first_line:
                description = first_line[len(name):].lstrip(":-|– ").strip()
                
        technologies = extract_skills(block)
        
        results.append({
            "name": name,
            "description": description,
            "technologies": technologies,
            "raw_text": block
        })
        
    # Deduplicate projects while preserving order
    seen = set()
    deduped_results = []
    for proj in results:
        name_key = (proj.get("name") or "").strip().lower()
        raw_key = (proj.get("raw_text") or "").strip().lower()
        key = name_key if name_key else raw_key
        if key not in seen:
            seen.add(key)
            deduped_results.append(proj)
            
    return deduped_results

def extract_certifications(text: str) -> list[str]:
    """Extract list of certification names."""
    section_text = _extract_section_text(text, "certifications")
    if not section_text:
        return []
        
    lines = [line.strip() for line in section_text.split("\n") if line.strip()]
    certs = []
    for line in lines:
        cleaned = re.sub(r'^[•\-\*\d\.\s\)\(]+', '', line).strip()
        if cleaned and len(cleaned) > 3:
            certs.append(cleaned)
            
    # Deduplicate certifications case-insensitively while preserving order
    seen = set()
    deduped_certs = []
    for cert in certs:
        cert_lower = cert.lower()
        if cert_lower not in seen:
            seen.add(cert_lower)
            deduped_certs.append(cert)
            
    return deduped_certs
