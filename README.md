<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=220&section=header&text=Scorelia&fontSize=70&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=The%20Intelligent%20Career%20Copilot&descAlignY=58&descSize=20" width="100%"/>

<br/>

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=20&duration=3000&pause=800&color=38BDF8&center=true&vCenter=true&width=680&lines=Parse+resumes+with+local+AI;Score+ATS+compatibility+instantly;Match+jobs+with+semantic+search;100%25+private+%E2%80%A2+100%25+local+%E2%80%A2+100%25+free" alt="Typing SVG" />

<br/><br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React_19-black?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Ollama](https://img.shields.io/badge/Ollama-1a1a1a?style=for-the-badge&logo=ollama&logoColor=white)](https://ollama.com/)

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=3&width=1000" width="100%"/>

<br/>

<a href="#-overview"><img src="https://img.shields.io/badge/Overview-black?style=flat-square&logo=googledocs&logoColor=white" /></a>
<a href="#-key-features"><img src="https://img.shields.io/badge/Features-black?style=flat-square&logo=sparkfun&logoColor=white" /></a>
<a href="#%EF%B8%8F-technology-stack"><img src="https://img.shields.io/badge/Tech%20Stack-black?style=flat-square&logo=techcrunch&logoColor=white" /></a>
<a href="#-system-architecture"><img src="https://img.shields.io/badge/Architecture-black?style=flat-square&logo=diagramsdotnet&logoColor=white" /></a>
<a href="#%EF%B8%8F-installation--setup"><img src="https://img.shields.io/badge/Setup-black?style=flat-square&logo=gitbook&logoColor=white" /></a>
<a href="#-documentation"><img src="https://img.shields.io/badge/Docs-black?style=flat-square&logo=readthedocs&logoColor=white" /></a>

<br/><br/>

<img src="https://img.shields.io/github/last-commit/Dipakk7/Scorelia?style=flat-square&color=6366f1&label=last%20commit" />
<img src="https://img.shields.io/github/languages/top/Dipakk7/Scorelia?style=flat-square&color=38bdf8" />
<img src="https://komarev.com/ghpvc/?username=Dipakk7&repo=Scorelia&style=flat-square&color=blue&label=repo+views" />
<img src="https://img.shields.io/badge/status-actively%20developed-brightgreen?style=flat-square" />

</div>

<br/>

## 📌 Overview

> **Scorelia** is a full-stack AI career intelligence platform that helps job seekers analyze resumes, check ATS compatibility, semantically match resumes against job descriptions, prepare for interviews, and get personalized career guidance — powered entirely by open-source AI running on your own machine.
>
> No external API costs. No data leaving your device. Just a private, local AI career copilot.

<div align="center">

| | |
|:---:|:---|
| 🔒 | **Privacy-first** — resumes, credentials, and chat history never leave your device |
| 💸 | **Zero cost** — no licensing fees, no external API bills |
| 🧩 | **End-to-end platform** — resume optimization, ATS checks, job matching, mock interviews, and roadmaps in one place |
| 🏗️ | **Modular architecture** — clean separation between FastAPI backend, React frontend, and a multi-agent AI orchestration layer |

</div>

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=2&width=1000" width="100%"/>

## 🚀 Key Features

<table>
<tr>
<td width="50%" valign="top">

### 📄 Resume Intelligence
Extracts skills, experience, and education from PDF/Word resumes using NLP-driven parsing.

### ✅ ATS Resume Analysis
Deep compliance checks against applicant tracking systems, with formatting and keyword feedback.

### 🎯 Vector-Based Job Matching
Semantic alignment scoring between resumes and job descriptions using local embeddings — beyond simple keyword matching.

### 🧠 Skill Gap Analysis
Identifies missing skills for a target role and recommends a learning path to close the gap.

</td>
<td width="50%" valign="top">

### ✍️ AI-Powered Resume Optimizer
Interactive, LLM-driven rewriting to maximize resume impact, sentence by sentence.

### 🎤 Interactive Interview Prep
Real-time mock interviews with job-specific questions and constructive AI feedback.

### 🗺️ Dynamic Career Roadmap
AI-generated, step-by-step career paths with milestones and certifications.

### 💬 AI Career Assistant (RAG)
A persistent, context-aware chatbot that queries your resumes and job data using ChromaDB + Ollama.

</td>
</tr>
</table>

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=2&width=1000" width="100%"/>

## 🛠️ Technology Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=react,vite,ts,tailwind,fastapi,py,postgres,docker,githubactions,nginx" />

</div>

| Layer | Technology | Details |
|:--|:--|:--|
| **Frontend** | React 19, Vite, TypeScript | Fast dev/build tooling, client-side routing via React Router |
| **Styling & UI** | Tailwind CSS, Lucide React, Sonner | Utility-first styling, iconography, and toast notifications |
| **Forms & Validation** | React Hook Form, Zod, React Dropzone | Type-safe form handling and file upload validation |
| **Data Fetching & Viz** | Axios, Recharts | API communication and dynamic dashboard charts |
| **Backend** | FastAPI, Python 3.12, Uvicorn | Async event loop, structured Pydantic schemas, performance-oriented endpoints |
| **Database** | PostgreSQL, SQLAlchemy, Alembic | Relational storage with ORM modeling and versioned migrations |
| **Vector DB** | ChromaDB | Local persistent vector storage for RAG knowledge bases |
| **Authentication** | JWT, Passlib | Secure token-based auth with hashed password storage |
| **AI LLM Engine** | Ollama (Qwen 2.5 3B Instruct) | Low-latency local model inference for content generation |
| **Embedding Engine** | Ollama (nomic-embed-text) | Local normalized 768-dimensional text embedding generation |
| **NLP & Vectors** | spaCy, Sentence Transformers, scikit-learn | Entity extraction (NER), semantic cosine similarity, vectorization |
| **Multi-Agent System** | Agent Orchestrator, Shared Memory, Tool Calling | Specialized agents — Resume, ATS, Job Match, Interview, Career Coach, Learning |
| **Testing** | Pytest, ESLint, Oxlint | Backend unit/integration tests and frontend type/lint checks |
| **Deployment** | Docker, Docker Compose, Nginx, GitHub Actions | Containerized production deployment with CI/CD pipeline |

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=2&width=1000" width="100%"/>

## 📐 System Architecture

Scorelia follows a clean, decoupled client-server architecture designed to run efficiently on commodity developer hardware without external API expenses.

```mermaid
graph TD
    User[User] --> Frontend[React 19 + Vite Frontend]
    Frontend --> API[FastAPI Router]

    API --> Auth[JWT Security Guard]
    API --> Parser[spaCy Parser Engine]
    API --> Embedding[Sentence Transformers Engine]
    API --> Workflow[Resume Workflow Service]
    API --> Interview[Interview Service]
    API --> Roadmap[Roadmap Service]
    API --> RAGOrch[RAG Orchestrator]

    Parser --> Embedding

    Workflow --> Review[Review Engine]
    Workflow --> Rewrite[Rewrite Engine]
    Workflow --> Optimize[Optimization Engine]

    Review --> Registry[Prompt Registry]
    Rewrite --> Registry
    Optimize --> Registry

    Interview --> InterviewWorkflow[Interview Workflow]
    InterviewWorkflow --> InterviewAI[Interview AI Service]
    InterviewAI --> Registry

    Roadmap --> RoadmapGen[Roadmap Generator]
    Roadmap --> SkillGap[Skill Gap Engine]
    Roadmap --> Timeline[Timeline Planner]
    RoadmapGen --> Registry
    SkillGap --> Registry

    RAGOrch --> RAGCache[Multi-Tier Cache]
    RAGOrch --> RAGRetriever[Multi-Collection Retriever]
    RAGOrch --> RAGGen[RAG Generator]

    RAGRetriever --> Chroma[(ChromaDB)]
    RAGRetriever --> EmbedService[Embedding Service]
    EmbedService --> OllamaEmbed[Ollama nomic-embed-text]

    RAGGen --> Registry

    Registry --> Factory[Provider Factory]
    Factory --> Ollama[Ollama Qwen 2.5 3B]

    API --> DB[(PostgreSQL)]
```

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=2&width=1000" width="100%"/>

## 📂 Folder Structure

```
Scorelia/
├── .github/                        # CI/CD workflows & templates
├── assets/                         # Brand assets & resume templates
├── backend/                        # FastAPI server & Python ML/LLM services
├── config/                         # Setup and environment configs
├── database/                       # Relational migrations and seeds
├── docs/                           # Architecture, DB schema, and API specifications
├── frontend/                       # React + Vite SPA client
├── screenshots/                    # Documentation images
├── scripts/                        # One-click installers & downloader utilities
├── tests/                          # Backend & frontend unit, integration, and E2E tests
├── CHANGELOG.md                    # Version history and release notes
├── FRONTEND_ARCHITECTURE.md        # Frontend structure and design decisions
├── GITHUB_RELEASE_REPORT.md        # Release audit and readiness report
├── PRODUCTION_READINESS_REPORT.md  # Production deployment checklist
├── RELEASE_NOTES.md                # Per-release notes
├── LICENSE                         # MIT License
└── README.md                       # Project overview and setup guide
```

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=2&width=1000" width="100%"/>

## 📖 Documentation

Detailed architecture and planning documents live in the [`docs/`](docs) directory:

| Document | Description |
|:--|:--|
| [Project Requirements (PRD)](docs/PROJECT_REQUIREMENTS.md) | Product requirements, functional constraints, and persona descriptions |
| [Software Architecture (SAD)](docs/SOFTWARE_ARCHITECTURE.md) | Clean architecture layers, data sequence flows, and design justifications |
| [Database Design](docs/DATABASE_DESIGN.md) | PostgreSQL schemas, index models, constraints, and GIN/JSONB details |
| [API Specification](docs/API_SPECIFICATION.md) | RESTful endpoint structures, HTTP statuses, cookie auth, and JSON payloads |
| [UI/UX Style Guide](docs/UI_UX_GUIDE.md) | Obsidian-glassmorphism styling, grid values, and Framer Motion dynamics |
| [Module Breakdown](docs/MODULE_BREAKDOWN.md) | Responsibilities, inputs/outputs, and dependencies of all 12 modules |
| [System Workflow](docs/SYSTEM_WORKFLOW.md) | User journey mappings, Mermaid charts, and error-handling flows |
| [Development Roadmap](docs/DEVELOPMENT_ROADMAP.md) | Implementation milestones, testing strategy, and Git workflow |
| [RAG Architecture](docs/RAG_ARCHITECTURE.md) | Retrieval-augmented generation design, indexing pipeline, vector storage |
| [RAG Production Guide](docs/RAG_PRODUCTION_GUIDE.md) | Production tuning, monitoring, caching, and troubleshooting |
| [Frontend Architecture](FRONTEND_ARCHITECTURE.md) | Frontend structure, component design, and state management decisions |
| [Production Readiness Report](PRODUCTION_READINESS_REPORT.md) | Deployment checklist and production audit findings |

<details>
<summary><b>📚 More docs (multi-agent system, prompt management, per-feature specs)</b></summary>
<br/>

| Document | Description |
|:--|:--|
| [Multi-Agent Architecture](docs/MULTI_AGENT_ARCHITECTURE.md) | Agent orchestration, shared memory, and tool-calling design |
| [Prompt Management](docs/PROMPT_MANAGEMENT.md) | Prompt registry structure and versioning strategy |
| [AI Resume Review](docs/AI_RESUME_REVIEW.md) | Resume review agent design and scoring logic |
| [AI Resume Rewrite](docs/AI_RESUME_REWRITE.md) | Rewrite engine prompt flow and output formatting |
| [AI Resume Optimization](docs/AI_RESUME_OPTIMIZATION.md) | Optimization pipeline and impact scoring |
| [AI Interview](docs/AI_INTERVIEW.md) | Mock interview generation and feedback scoring |
| [AI Cover Letter](docs/AI_COVER_LETTER.md) | Cover letter generation workflow |
| [AI Career Roadmap](docs/AI_CAREER_ROADMAP.md) | Roadmap generation and milestone planning |
| [Analytics (Phase 7)](docs/PHASE7_ANALYTICS.md) | Analytics dashboard design and metrics |

</details>

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=2&width=1000" width="100%"/>

## 📸 Screenshots

| Feature | Preview |
|:--|:--:|
| Dashboard | *coming soon* |
| Resume Parser | *coming soon* |
| ATS Analysis | *coming soon* |
| Job Matching | *coming soon* |
| AI Assistant | *coming soon* |

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=2&width=1000" width="100%"/>

## ⚙️ Installation & Setup

<details open>
<summary><b>Prerequisites</b></summary>
<br/>

- Python 3.12+
- Node.js 18+ & npm
- PostgreSQL 15+
- [Ollama](https://ollama.com) (installed and running as a background service)

</details>

<details open>
<summary><b>1. Clone the repository</b></summary>
<br/>

```bash
git clone https://github.com/Dipakk7/Scorelia.git
cd Scorelia
```

</details>

<details>
<summary><b>2. Backend setup</b></summary>
<br/>

```bash
cd backend
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

</details>

<details>
<summary><b>3. Frontend setup</b></summary>
<br/>

```bash
cd frontend
npm install
```

</details>

<details>
<summary><b>4. PostgreSQL setup</b></summary>
<br/>

Create a local database:

```sql
CREATE DATABASE scorelia_db;
```

Configure credentials in `backend/.env` (default: `postgres/postgres@localhost:5432`).

</details>

<details>
<summary><b>5. Ollama setup</b></summary>
<br/>

Download and run [Ollama](https://ollama.com), then pull the required models:

```bash
ollama pull qwen2.5:3b
ollama pull nomic-embed-text
```

</details>

<details>
<summary><b>6. ChromaDB setup</b></summary>
<br/>

ChromaDB runs locally in-process with the backend — no extra setup required. Storage paths are defined in `backend/app/core/config.py` and auto-initialized at `backend/storage/chromadb`.

</details>

<details>
<summary><b>7. Environment variables</b></summary>
<br/>

**Backend:**

```bash
cp config/backend.env.example backend/.env
```

Ensure `DATABASE_URL` and `JWT_SECRET_KEY` are set.

**Frontend:**

```bash
cp config/frontend.env.example frontend/.env.development
```

Set `VITE_API_URL=http://localhost:8000/api/v1`.

</details>

<details open>
<summary><b>8. Run locally</b></summary>
<br/>

**Backend:**

```bash
cd backend
source venv/bin/activate      # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload
```

**Frontend:**

```bash
cd frontend
npm run dev
```

</details>

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=2&width=1000" width="100%"/>

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

<br/>

<div align="center">

## 👨‍💻 Connect With Me

[![GitHub](https://img.shields.io/badge/GitHub-Dipakk7-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Dipakk7)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Dipak%20Khandagale-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/dipakkhandagale/)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit%20Site-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://dipakkhandagale.vercel.app/)

<br/>

### ⭐ If you find Scorelia useful, consider starring the repo!

[![Star on GitHub](https://img.shields.io/github/stars/Dipakk7/Scorelia?style=for-the-badge&color=gold&logo=github)](https://github.com/Dipakk7/Scorelia/stargazers)

<br/><br/>

<a href="#scorelia">
  <img src="https://img.shields.io/badge/⬆-Back%20to%20Top-black?style=for-the-badge" />
</a>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

</div>
