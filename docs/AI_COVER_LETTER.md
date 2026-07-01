# AI Cover Letter Generator Infrastructure

This document describes the design, architecture, database models, schemas, workflows, and extension guides for the AI Cover Letter Generator module in CareerPilot AI.

---

## 1. Architecture

The AI Cover Letter module is structured according to **Clean Architecture** patterns, ensuring decoupling between database models, validation schemas, business logic (use cases), and API routers:

```
                  ┌───────────────────────┐
                  │      HTTP Request     │
                  └───────────┬───────────┘
                              ▼
                  ┌───────────────────────┐
                  │      API Router       │
                  │   (Dependency Inj.)   │
                  └───────────┬───────────┘
                              ▼
                  ┌───────────────────────┐
                  │  CoverLetterService   │
                  └──────┬──────────┬─────┘
                         │          │
        ┌────────────────┘          └────────────────┐
        ▼                                            ▼
┌──────────────┐                             ┌──────────────┐
│  AI Context  │                             │  CRUD Layer  │
│  Collector   │                             │   (DB Ops)   │
└──────────────┘                             └──────┬───────┘
                                                    ▼
                                             ┌──────────────┐
                                             │  PostgreSQL  │
                                             │  (SQLAlchemy)│
                                             └──────────────┘
```

- **API Router**: Exposes FastAPI endpoints, handles authentication/authorization, and validates request query/body shapes.
- **Service Layer**: Orchestrates execution flow, validates constraints, and organizes the raw query information.
- **Context Builder**: Combines all required inputs (Resume, parser data, reviews, rewrites, optimizations, ATS score) into a unified object context suitable for template rendering.
- **CRUD Layer**: Manages SQLAlchemy database transactions (Create, Read, List, Delete) for persistence.

---

## 2. Folder Structure

The module resides at `backend/app/cover_letter/` and follows standard structure conventions:

```
backend/app/cover_letter/
├── api/
│   ├── __init__.py
│   └── router.py              # Endpoint definitions (POST /generate, GET /history, etc.)
├── crud/
│   ├── __init__.py
│   └── crud.py                # Database transactions helper methods
├── models/
│   ├── __init__.py
│   └── ai_cover_letter.py     # SQLAlchemy model mapping tables and fields
├── prompts/
│   ├── base_system.jinja      # Versioned prompt placeholder: system prompt
│   ├── cover_letter.jinja     # Versioned prompt placeholder: standard template
│   ├── internship.jinja       # Versioned prompt placeholder: internship tailored template
│   ├── fresher.jinja          # Versioned prompt placeholder: fresher tailored template
│   └── experienced.jinja      # Versioned prompt placeholder: experienced tailored template
├── schemas/
│   ├── __init__.py
│   └── schemas.py             # Pydantic schemas (Request, Response, History, etc.)
├── services/
│   ├── __init__.py
│   ├── context.py             # Context parser (aggregating reviews, rewrites, ATS metrics)
│   └── service.py             # Core Orchestration Service coordinating inputs
├── utils/
│   └── __init__.py            # Helper methods
└── __init__.py
```

---

## 3. Database Schema

The database model is mapped to the table `ai_cover_letters` using SQLAlchemy:

| Attribute Name | Column Name | Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `UUID` | Primary Key, default UUID generation |
| `user_id` | `user_id` | `UUID` | Foreign Key (`users.id`), non-nullable, CASCADE on delete, Indexed |
| `resume_id` | `resume_id` | `UUID` | Foreign Key (`resumes.id`), non-nullable, CASCADE on delete, Indexed |
| `company_name` | `company_name` | `VARCHAR(100)` | Non-nullable |
| `job_title` | `job_title` | `VARCHAR(100)` | Non-nullable |
| `job_description`| `job_description`| `TEXT` | Nullable |
| `writing_style` | `writing_style` | `VARCHAR(50)` | Non-nullable (e.g. `PROFESSIONAL`) |
| `generation_mode`| `generation_mode`| `VARCHAR(50)` | Non-nullable (e.g. `STANDARD`) |
| `generated_content`| `generated_content`| `TEXT` | Nullable (stores LLM output) |
| `cover_letter_metadata`| `metadata` | `JSONB` | Nullable (holds scores, references, contexts) |
| `provider` | `provider` | `VARCHAR(50)` | Nullable |
| `model` | `model` | `VARCHAR(100)` | Nullable |
| `prompt_version` | `prompt_version` | `VARCHAR(20)` | Nullable |
| `created_at` | `created_at` | `TIMESTAMP` | Server-default `now()`, non-nullable |
| `updated_at` | `updated_at` | `TIMESTAMP` | Server-default `now()`, non-nullable |

---

## 4. API Overview

Endpoints are served under the `/api/v1/ai/cover-letter` router prefix:

### 1. `POST /generate`
- **Purpose**: Generates a custom tailored, professional, ATS-optimized cover letter.
- **Request Body**: `CoverLetterRequest` containing:
  - `resume_id` (UUID, required)
  - `company_name` (string, required)
  - `job_title` (string, required)
  - `job_description` (string, optional)
  - `writing_style` (string, optional, e.g. `PROFESSIONAL`, `MODERN`, etc.)
  - `generation_mode` (enum, optional, e.g. `FAST`, `STANDARD`, `DETAILED`)
  - `experience_level` (enum, optional, e.g. `INTERNSHIP`, `FRESHER`, `EXPERIENCED`, `CAREER_CHANGE`, `REFERRAL`, `EXECUTIVE`)
- **Returns**: `CoverLetterResponse` (containing full metadata, scores, and reconstituted text).
- **Errors**: Returns a standardized `422 Unprocessable Entity` validation error (structure matches `ValidationErrorResponse`) if fact validation finds fabricated qualifications.

### 2. `GET /history`
- **Purpose**: Get all generated cover letters for the authenticated user.
- **Parameters**: `resume_id` (UUID, optional query param to filter history).
- **Returns**: `CoverLetterHistory`

### 3. `GET /{id}`
- **Purpose**: Fetch details of a specific cover letter.
- **Path Parameter**: `id` (UUID, cover letter ID).
- **Returns**: `CoverLetterResponse`

### 4. `DELETE /{id}`
- **Purpose**: Delete a specific cover letter.
- **Path Parameter**: `id` (UUID, cover letter ID).
- **Returns**: JSON object confirming deletion success.

---

## 5. Workflow and Generation Flow

The generation pipeline works as follows:

```
[POST /generate Request]
           │
           ▼
[Validate request inputs & build CoverLetterContext]
           │
           ▼
[Retrieve latest Review, Rewrite, Optimization, ATS score]
           │
           ▼
[CoverLetterTemplateResolver selects template using Registry strategies]
           │
           ├─► INTERNSHIP     ──► internship.jinja
           ├─► FRESHER        ──► fresher.jinja
           ├─► EXPERIENCED    ──► experienced.jinja
           ├─► CAREER_CHANGE  ──► career_change.jinja
           ├─► REFERRAL       ──► referral.jinja
           └─► EXECUTIVE      ──► executive.jinja
           │
           ▼
[Render Jinja variables & call AIService.execute(parser_type='json')]
           │
           ▼
[Validate JSON response using Pydantic AICoverLetterOutput]
           │
           ├───► (Fails validation? Retry once)
           │
           ▼
[Execute Fact Checking verification via fact_check.jinja prompt]
           │
           ├───► (Fabrication found? Reject and return 422 standard error)
           │
           ▼
[Store details in PostgreSQL DB (provider, model, latency, styles, scores)]
           │
           ▼
[Map database instance and return CoverLetterResponse]
```

### Fact Verification
Before saving, the generated cover letter text is passed to an AI-driven verification prompt (`fact_check.jinja`). The verification prompt compares the letter against the candidate's original resume to check for fabricated:
- Work experience / Employers
- Education / Degrees
- Technical Skills
- Certifications
- Projects / Accomplishments

If any hard facts are found to be fabricated, the generation is rejected and a `422 Unprocessable Entity` error is returned with specific location details.

### Reusing AI Infrastructure
- **Cache**: Reuses the process-wide `AI Cache` to avoid redundant calls for duplicate requests.
- **Metrics**: Automatically logs token counts, latency, and cache hits to `ai_metrics`.
- **Exception Handling**: Employs retry policies and maps connection timeouts/failures using the core AI exception wrappers.

---

## 6. Supported Settings

### 1. Writing Styles
Styles are configured under `SUPPORTED_WRITING_STYLES` in the schemas module and can be dynamically updated:
- `PROFESSIONAL` (Default)
- `MODERN`
- `FORMAL`
- `FRIENDLY`
- `EXECUTIVE`
- `STARTUP`
- `ACADEMIC`
- `GOVERNMENT`
- `CONCISE`
- `ENTHUSIASTIC`
- `CREATIVE`

### 2. Generation Modes
Modes control output length and complexity:
- `FAST`: Focused, high-impact, short letter (Max 1024 tokens).
- `STANDARD`: Balanced 3-part layout (Max 2048 tokens).
- `DETAILED`: Exhaustive, deep-dive alignment paragraph-by-paragraph (Max 4096 tokens).

## 7. Developer Guide

### Running Tests
To run all tests (including the newly added Cover Letter generation, schema, resolver, fact validation, and optimization tests):
```powershell
# Run the entire backend test suite from backend directory
.\venv\Scripts\pytest ..\tests

# Run specifically the cover letter test files
.\venv\Scripts\pytest ..\tests/test_cover_letter.py
.\venv\Scripts\pytest ..\tests/test_cover_letter_optimization.py
```

### Adding New Prompts or Styles
1. **Prompts**: Place new Jinja templates in `backend/app/ai/prompts/templates/cover_letter/`. Add the template name mapping to the `CoverLetterTemplateResolver` registry in `resolver.py`.
2. **Styles**: Simply append new uppercase styles to the `WritingStyle` enum or the `SUPPORTED_WRITING_STYLES` list in `schemas.py` to permit request validation.

---

## 8. Cover Letter Optimization & Quality Engine

The Cover Letter Optimization Engine leverages `AIService` and a custom prompt (`optimization.jinja`) to analyze a generated cover letter, provide structured optimization suggestions, calculate weighted quality scores, extract keyword statistics, evaluate company alignment, and compute version differences.

### 1. Optimization Flow

```
[POST /optimize Request]
           │
           ▼
[Fetch Cover Letter & Associated Resume from DB]
           │
           ▼
[Check input constraints & optimization mode (FAST/STANDARD/DETAILED)]
           │
           ▼
[Render optimization.jinja variables]
           │
           ▼
[Execute AIService.execute(parser_type='json')]
           │
           ├─► Rejects invalid JSON and retries once
           │
           ▼
[Extract Optimized Content & Analysis Fields]
           │
           ▼
[Compute word-level text differences using Local Diff Engine]
           │
           ▼
[Create AICoverLetterOptimization record in DB]
           │
           ▼
[Map database instance and return CoverLetterOptimizationResponse]
```

### 2. Scoring Methodology

The quality engine calculates a weighted **Overall Score (0-100)** based on 10 distinct quality categories, each scored between 0 and 100.
The categories evaluated are:
- **Grammar**: Typographical accuracy, sentence structure, and syntax correctness.
- **Professional Tone**: Appropriateness of tone matching the target job description (e.g. executive, formal, startup).
- **Readability**: Reading ease, flow, and paragraph length.
- **ATS**: Overall ATS parser compatibility.
- **Keyword Usage**: Insertion of vital technical/domain skills.
- **Company Alignment**: Match with the employer's mission and industry language.
- **Job Alignment**: Direct relevance of experience to responsibilities.
- **Personalization**: Integration of candidate's unique metrics and projects.
- **Structure**: Logical progression (greeting, intro, body, closing, signature).
- **Closing**: Impactfulness and call-to-action effectiveness of the closing paragraph.

### 3. Keyword Analysis

The optimization prompt evaluates keyword density across the original cover letter, target job description, and resume. It categorizes terms as:
- `matched_keywords`: Essential keywords successfully present in the letter.
- `missing_keywords`: Important keywords in the job description that are missing from the letter.
- `recommended_keywords`: High-impact industry-relevant terms to add.
- `overused_keywords`: Filler or repetitive vocabulary to reduce.
- `weak_keywords`: Passive verbs or low-impact assertions.
- `strong_action_verbs`: Action-oriented verbs (e.g. *orchestrated*, *spearheaded*, *automated*) to highlight.

### 4. Company Alignment

Evaluates the qualitative alignment of the candidate's pitch to the organization:
- `mission_alignment`: Qualitative breakdown of how candidate objectives align with company goals.
- `culture_fit`: Interpersonal tone compatibility.
- `role_alignment`: Relevance to requirements.
- `technical_alignment`: Direct stack capabilities match.
- `industry_language`: Proper use of sector terminologies.
- `alignment_confidence`: Confidence score (0.0 to 1.0).

### 5. API Specification

#### 1. `POST /api/v1/ai/cover-letter/optimize`
- **Purpose**: Analyze, score, and optimize an existing cover letter.
- **Request Body (`CoverLetterOptimizationRequest`)**:
  ```json
  {
    "cover_letter_id": "b0d11079-a766-4ac5-919a-1b0b07395d96",
    "job_description": "Optional target job description override",
    "model_override": null,
    "bypass_cache": false
  }
  ```
- **Response (`CoverLetterOptimizationResponse`)**:
  ```json
  {
    "id": "e4f8d22d-23a5-4ff1-88c7-45e3f43b67ca",
    "user_id": "7b6d55d8-bc93-49da-ad6c-8df7a2f0459e",
    "cover_letter_id": "b0d11079-a766-4ac5-919a-1b0b07395d96",
    "quality_score": {
      "overall_score": 92,
      "category_scores": {
        "grammar": 95,
        "professional_tone": 90,
        "readability": 90,
        "ats": 90,
        "keyword_usage": 92,
        "company_alignment": 95,
        "job_alignment": 95,
        "personalization": 90,
        "structure": 90,
        "closing": 92
      }
    },
    "keyword_analysis": {
      "matched_keywords": ["python", "fastapi"],
      "missing_keywords": ["sqlalchemy"],
      "recommended_keywords": ["sql"],
      "overused_keywords": ["very"],
      "weak_keywords": ["try"],
      "strong_action_verbs": ["spearheaded"]
    },
    "company_alignment": {
      "mission_alignment": "Candidate values scalable web architecture, matching company mission.",
      "culture_fit": "Speaks to ownership and active development.",
      "role_alignment": "Fully matches requirements for FastAPI services.",
      "technical_alignment": "Demonstrated expertise in Python APIs.",
      "industry_language": "Standard cloud/SaaS terms.",
      "alignment_confidence": 0.95
    },
    "suggestions": {
      "high_priority": [
        {
          "reason": "Weak introductory paragraph.",
          "expected_benefit": "Hooks hiring manager's interest instantly.",
          "suggested_improvement": "Specify direct experience building cloud APIs in the opening.",
          "estimated_ats_improvement": 10
        }
      ],
      "medium_priority": [],
      "low_priority": []
    },
    "original_content": "Original letter text...",
    "optimized_content": "Optimized letter text...",
    "version_comparison": {
      "added_content": ["strong", "spearheaded"],
      "removed_content": ["very", "helped"],
      "modified_sections": [
        {
          "from": "I helped build the backend.",
          "to": "I spearheaded building the backend."
        }
      ],
      "improvement_summary": "Improved action verbs, grammar, and alignment.",
      "estimated_quality_gain": 15
    },
    "metadata": {
      "prompt_version": "1.0.0",
      "model": "llama3",
      "provider": "ollama",
      "created_at": "2026-07-01T21:38:08Z",
      "latency_ms": 150.0
    },
    "created_at": "2026-07-01T21:38:08Z",
    "updated_at": "2026-07-01T21:38:08Z"
  }
  ```

#### 2. `POST /api/v1/ai/cover-letter/compare`
- **Purpose**: Compute text changes and gain estimations between two letters locally.
- **Request Body (`CoverLetterCompareRequest`)**:
  ```json
  {
    "original_content": "Original letter text...",
    "optimized_content": "Optimized letter text...",
    "improvement_summary": "Version comparison computed successfully.",
    "estimated_quality_gain": 15
  }
  ```
- **Response (`VersionComparison`)**:
  ```json
  {
    "added_content": ["strong", "spearheaded"],
    "removed_content": ["very", "helped"],
    "modified_sections": [
      {
        "from": "I helped build the backend.",
        "to": "I spearheaded building the backend."
      }
    ],
    "improvement_summary": "Improved action verbs, grammar, and alignment.",
    "estimated_quality_gain": 15
  }
  ```

#### 3. `GET /api/v1/ai/cover-letter/optimizations`
- **Purpose**: Get history list of optimizations for the user (optionally filtered by `cover_letter_id`).
- **Response (`CoverLetterOptimizationListResponse`)**:
  ```json
  {
    "optimizations": [ ... ],
    "total": 1
  }
  ```

#### 4. `GET /api/v1/ai/cover-letter/optimization/{id}`
- **Purpose**: Retrieve specific optimization details by UUID.
- **Response (`CoverLetterOptimizationResponse`)**

#### 5. `DELETE /api/v1/ai/cover-letter/optimization/{id}`
- **Purpose**: Delete an optimization record from history.
- **Response**:
  ```json
  {
    "success": true,
    "message": "Cover letter optimization deleted successfully."
  }
  ```

---

## 9. Cover Letter Export Engine

The AI Cover Letter Export Engine allows candidates to download their generated or optimized cover letters in multiple professional formats using custom styling templates.

### 1. Export Architecture

The export subsystem is built on top of a decoupled `CoverLetterExportService`, which retrieves the required cover letter (or specific optimization result) and formats the text body into the selected target format:

```
                     ┌──────────────────────────┐
                     │   Export API Endpoint    │
                     └─────────────┬────────────┘
                                   │
                                   ▼
                     ┌──────────────────────────┐
                     │CoverLetterExportService  │
                     └──────┬────────────────┬──┘
                            │                │
             ┌──────────────┘                └──────────────┐
             ▼                                              ▼
┌─────────────────────────┐                    ┌─────────────────────────┐
│     Format Renderers    │                    │     Storage Manager     │
├─────────────────────────┤                    ├─────────────────────────┤
│ - reportlab (PDF)       │                    │ - Saves to secure path  │
│ - python-docx (DOCX)    │                    │   uuid.{format}         │
│ - Markdown (MD)         │                    │ - Cleans files on delete│
│ - Plain Text (TXT)      │                    │ - Sets friendly name in │
└─────────────────────────┘                    │   header for download   │
                                               └─────────────────────────┘
```

### 2. Supported Formats

- **PDF**: Generated using `reportlab`. Supports professional margins, colors, page properties, font family mappings (e.g. `Helvetica` or `Times-Roman`), dynamic recipient block alignments, horizontal rules, and a small metadata notice.
- **DOCX**: Generated using `python-docx`. Includes customized paragraph and font styling matching the templates, structured spacing, and a clean paragraph-border horizontal divider.
- **Markdown (MD)**: Generated as standard markdown with a YAML frontmatter metadata block containing details like export time, scores, and model names.
- **Plain Text (TXT)**: Generated as raw UTF-8 text with structured dividers and a footer block showing the export parameters.

### 3. Design Templates

Style and structure variations are defined dynamically:
- **Professional**: Balanced structure, Helvetica, Slate blue accent, divider line, left header.
- **Modern**: Clean Helvetica layout, Indigo accent, larger margins, left header.
- **Minimal**: Plain black Helvetica styling with larger (1-inch) margins, simple header.
- **Corporate**: Traditional Times-Roman, Navy Blue headings, divider line, right-aligned header.
- **Startup**: Trendy Helvetica style, Indigo details, left header.
- **Executive**: Sophisticated Times-Roman layout, Burgundy headings, centered header block.
- **Academic**: Strict traditional black Times-Roman, standard academic formatting.
- **Government**: Very formal layout, dark slate Times-Roman text, line divider.

### 4. API Endpoints

Served under the `/api/v1/ai/cover-letter/` router:

#### `POST /export/pdf`
- **Request Body (`CoverLetterExportRequest`)**:
  ```json
  {
    "cover_letter_id": "b0d11079-a766-4ac5-919a-1b0b07395d96",
    "optimization_id": "optional-optimization-uuid",
    "template_name": "Professional"
  }
  ```
- **Returns**: `CoverLetterExportResponse` JSON containing file size, format, template and metadata.

#### `POST /export/docx`
- **Request Body**: `CoverLetterExportRequest`
- **Returns**: `CoverLetterExportResponse`

#### `POST /export/md`
- **Request Body**: `CoverLetterExportRequest`
- **Returns**: `CoverLetterExportResponse`

#### `POST /export/txt`
- **Request Body**: `CoverLetterExportRequest`
- **Returns**: `CoverLetterExportResponse`

#### `GET /exports`
- **Purpose**: Retrieve history list of all exports for the user.
- **Returns**: `CoverLetterExportListResponse` JSON.

#### `GET /export/{id}`
- **Purpose**: Download the generated export file.
- **Returns**: Binary `FileResponse` stream with the appropriate MIME content-type and a friendly attachment header (`Content-Disposition: attachment; filename="..."`).

#### `DELETE /export/{id}`
- **Purpose**: Delete the export record from history and purge the physical file from storage.
- **Returns**: Deletion confirmation JSON.

### 5. Database Schema (`ai_cover_letter_exports`)

| Attribute Name | Column Name | Type | Description |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `UUID` | Primary Key, UUID |
| `user_id` | `user_id` | `UUID` | Foreign Key (`users.id`), non-nullable, cascade |
| `cover_letter_id` | `cover_letter_id` | `UUID` | Foreign Key (`ai_cover_letters.id`), non-nullable, cascade |
| `optimization_id` | `optimization_id` | `UUID` | Foreign Key (`ai_cover_letter_optimizations.id`), nullable, set-null |
| `export_format` | `export_format` | `VARCHAR(20)` | PDF, DOCX, MD, TXT |
| `template_name` | `template_name` | `VARCHAR(50)` | Style template name |
| `file_name` | `file_name` | `VARCHAR(255)` | Friendly download filename |
| `file_size` | `file_size` | `INTEGER` | Exported file size in bytes |
| `export_metadata` | `metadata` | `JSONB` | Non-sensitive export metadata |
| `created_at` | `created_at` | `TIMESTAMP` | Record creation timestamp |
| `updated_at` | `updated_at` | `TIMESTAMP` | Record update timestamp |

### 6. Developer Guide

#### Running Tests
To run all tests including cover letter export engine unit and API tests:
```powershell
# Run specifically the export engine tests
.\venv\Scripts\pytest ..\tests/test_cover_letter_export.py
```

---

## 10. Examples

### 1. Generated Cover Letter Output (Standard Layout)

```text
[Candidate Name]
[Candidate Contact Info]

July 01, 2026

Hiring Manager
[Company Name]
[Company Address]

Dear Hiring Manager,

I am writing to express my strong interest in the [Job Title] position at [Company Name]. With my background in [Core Field] and hands-on experience in [Key Skills], I am confident that I can make a significant contribution to your engineering team.

In my previous role, I spearheaded the development of [Key Accomplishment] which resulted in [Quantifiable Result]. I am particularly drawn to [Company Name]'s mission of [Company Mission], and I am eager to apply my skills in [Key Skill] to support your growth.

Thank you for your time and consideration. I look forward to the opportunity to discuss how my qualifications align with your team's needs.

Sincerely,

[Candidate Name]
```

### 2. Export API JSON Payloads

#### Generate Request
```json
{
  "resume_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "company_name": "Google",
  "job_title": "Senior Software Engineer",
  "job_description": "We are looking for a Senior Software Engineer with expertise in Python, FastAPI, and PostgreSQL...",
  "writing_style": "PROFESSIONAL",
  "generation_mode": "STANDARD",
  "experience_level": "EXPERIENCED"
}
```

#### Generate Response
```json
{
  "id": "e4f8d22d-23a5-4ff1-88c7-45e3f43b67ca",
  "user_id": "7b6d55d8-bc93-49da-ad6c-8df7a2f0459e",
  "resume_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "company_name": "Google",
  "job_title": "Senior Software Engineer",
  "job_description": "We are looking for a Senior Software Engineer with expertise in Python, FastAPI, and PostgreSQL...",
  "writing_style": "PROFESSIONAL",
  "generation_mode": "STANDARD",
  "generated_content": "Dear Hiring Manager...",
  "metadata": {
    "prompt_version": "1.0.0",
    "model": "qwen2.5:3b",
    "provider": "ollama",
    "latency_ms": 1250.0
  },
  "created_at": "2026-07-01T22:00:00Z",
  "updated_at": "2026-07-01T22:00:00Z"
}
```


