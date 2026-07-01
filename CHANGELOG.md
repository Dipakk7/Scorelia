# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
