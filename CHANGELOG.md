# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-07-04 (Phase 11)
### Added
- **Foundation**: Set up clean architecture layout (`app/career_roadmap/`), SQLAlchemy models (`career_roadmaps`, `career_milestones`, `skill_gap_analyses`, `learning_recommendations`), and Pydantic validation schemas.
- **AI Generation**: Developed personalized step-by-step transition plan generator utilizing local LLM inference, Jinja-templated prompt registry prompts, validation checks, and telemetry metadata.
- **Skill Gap Engine**: Created an extraction service comparing candidate parsed resume skills against target role requirements to identify gaps and generate tailored learning recommendations (courses, platforms, and practice projects).
- **Timeline Planner**: Implemented milestone sequencing, task schedules, state controls (Not Started, In Progress, Completed), and date validation constraints.
- **Analytics Dashboard**: Integrated roadmap analytics, including target career analysis, milestone completion rates, and learning progress charts into the centralized analytics pipeline.

---

## [1.0.0] - 2026-07-03 (Phase 10)
### Added
- **Interview Foundation**: Designed a Clean Architecture directory structure (`app/interview/`), custom SQLAlchemy schemas (`interview_sessions`, `interview_turns`), and robust Pydantic schemas.
- **AI Platform Integration**: Integrated with the global thread-safe `PromptRegistry` using Jinja templates for dynamic prompt rendering, validation, metrics logging, and local LLM execution.
- **Question Generation**: Built an engine to automatically generate technical, behavioral, and resume-based questions tuned to the candidate's experience and targeted role.
- **Answer Evaluation**: Implemented a STAR (Situation, Task, Action, Result) methodology evaluation system compiling detailed feedback, scores, strengths, weaknesses, and improvement recommendations.
- **Mock Interview Engine**: Implemented an automated session state workflow spanning 7 states (`Created`, `Context Ready`, `Waiting For Questions`, `Waiting For Answers`, `Evaluation Pending`, `Evaluated`, `Completed`) with transaction checks.
- **Analytics**: Captured session completion rates, average response scores, detailed charts data, and historical logs.
- **Reports**: Generated summary and turn-level performance reports.
- **Testing**: Added a suite of unit and integration tests covering the generation, session management, evaluation, and analytics endpoints.
- **Documentation**: Formulated comprehensive user and architecture docs (`docs/AI_INTERVIEW.md`).

---

## [0.9.0] - 2026-07-01 (Phase 9)
### Added
- **Cover Letter Foundation**: Decoupled clean architecture folder mapping (`app/cover_letter/`), custom SQLAlchemy database models (`ai_cover_letters`, `ai_cover_letter_optimizations`, `ai_cover_letter_exports`), schema validations using Pydantic, and configurable experience-level based Jinja prompt templates.
- **AI Cover Letter Generation Engine**: Dynamic prompt resolving system choosing between Internship, Fresher, Experienced, Referral, Career Change, or Executive layout strategies. Incorporates local Ollama Qwen2.5 execution with high-fidelity structured JSON outputs.
- **Cover Letter Fact Check**: Implemented local LLM validation scanning generated content against original resume to identify and reject fabricated work experience, degrees, skills, or projects. Returns standard 422 validations on mismatches.
- **Cover Letter Optimization & Scoring Engine**: Built a service analyzing letters against job descriptions. Computes a weighted overall score across 10 distinct categories, compiles lists of matched/missing/recommended keywords, assesses cultural/mission/technical alignment, and provides detailed suggestions.
- **Local Diff Engine**: Computes word-level diff comparisons (`added_content`, `removed_content`, `modified_sections`) between original and optimized letters locally.
- **Cover Letter Export Engine**: Added high-quality export rendering engines:
  - **PDF** using ReportLab (supporting fonts, alignment, slate blue titles, page margins, and divider rules).
  - **DOCX** using Python-Docx (proper paragraph margins, styles, indentations).
  - **Markdown (MD)** (with structured YAML frontmatter).
  - **TXT** plain text files.
- **Export History & Isolation**: Implemented export metadata histories, file cleanup/purging on delete, strict security path traversal protections, ownership validations, and download authorizations.
- **Test Coverage**: Expanded backend testing with 21 new unit and integration tests covering the entire Cover Letter workflow, with all 317 workspace tests passing.

---

## [0.8.0] - 2026-07-01 (Phase 8)
### Added
- **AI Foundation**: Implemented a decoupled factory pattern for AI providers, a robust client for local Ollama deployments, and health check validation.
- **Prompt Management System**: Created a Prompts Registry for loading, rendering via Jinja templates, caching outputs, handling retries, and recording token and time metrics.
- **AI Resume Review Engine**: Developed a service to scan resumes, evaluate layout, structure, and impact, and output a structured JSON review with a Resume Quality Score.
- **AI Resume Rewrite Engine**: Built interactive rewriting capabilities that structure bullet points to align with job descriptions or specific professional modes.
- **AI Resume Optimization Engine**: Designed a service that calculates career readiness, industry alignment, keyword match ratios, and suggested improvement resources.
- **Workflow Orchestration Engine**: Built a unified Orchestrator to parse, review, rewrite, and optimize resumes in a single end-to-end execution.
- **Database Schema & Migrations**: Configured models and migrations for reviews, rewrites, and optimizations, resolving all head revisions in Alembic.
- **Robust Endpoints**: Exposed FastAPI controllers for all AI operations, supporting streaming, schema-validated payloads, and historical CRUD.
- **Test Coverage**: Added comprehensive test files covering AI Foundation, Prompt Cache, Review, Rewrite, and Optimization services with all 296 workspace tests passing.
- **Technical Documentation**: Generated developer onboarding documents for AI Review, AI Rewrite, Prompt Management, and AI Resume Optimization modules.

---

## [0.7.0] - 2026-07-01
### Added
- **Analytics Foundation**: Implemented centralized statistics layer and mathematical utility functions inside `BaseStatistics`.
- **Dashboard Analytics**: Created system-wide aggregation for total users, resumes, job matches, and averages.
- **Resume Analytics**: Integrated detailed parsed content distribution, skill frequencies, education cohorts, and timeline metrics.
- **ATS Analytics**: Added aggregate ATS scoring, grade distribution cohorts, category breakdowns, and weakness lists.
- **Job Match Analytics**: Developed job match score bucket distribution, top missing skills list, and history timeline.
- **GitHub Profile Analytics**: Created public GitHub API integration with metadata caching for user profiles and repository summaries.
- **GitHub Repository Insights**: Designed repository-level language analysis, activity recency, and Developer Score formula.
- **Charts Engine**: Created dynamic, registry-driven chart generation with fallback behavior (partial failures skip failed charts).
- **FastAPI Endpoints**: Exposed robust endpoints for all analytics and charts under `/api/v1/analytics/`.
- **Comprehensive Testing**: Added 42 new unit and integration tests specifically covering analytics modules, mock endpoints, and edge cases.
- **Detailed Documentation**: Created `docs/PHASE7_ANALYTICS.md` documenting the structure, routes, known limitations, and performance audit.

---

## [0.6.0] - 2026-06-20
### Added
- **Job Matching Engine**: Implemented intelligent resume-to-job matching, gap analysis, and missing keyword/skill extraction.
- **Job Match Export**: Added PDF/JSON export support for job matching metrics.

---

## [0.5.0] - 2026-06-10
### Added
- **ATS Scoring Engine**: Created section-by-section evaluation algorithms and automated feedback generators.

---

## [0.4.0] - 2026-05-30
### Added
- **Intelligent Parser Engine**: Configured SpaCy model, section detectors, and normalization mappings.

---

## [0.3.0] - 2026-05-15
### Added
- **Resume Pipeline**: Created secure document storage, validation rules, and parser hooks.

---

## [0.2.0] - 2026-04-30
### Added
- **Authentication**: Built JWT authentication, login workflows, and token validations.

---

## [0.1.0] - 2026-04-15
### Added
- **Core backend**: Initialized FastAPI structure, SQLAlchemy engine, logging configuration, and health endpoints.
