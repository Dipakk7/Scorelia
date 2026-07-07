# REST API Specification Document

## Scorelia — The Intelligent Career Copilot

---

## 1. API Design Philosophy

Scorelia follows a **RESTful, Resource-Oriented architecture** centered on standard HTTP verbs, structured URLs, and uniform response payloads. The API is designed with the following guidelines:

*   **Stateless Authentication (HttpOnly Cookies):** To prevent Cross-Site Scripting (XSS) and intercept token hijacking, authorization credentials are not transmitted via `Authorization` headers. Instead, a cryptographically signed JSON Web Token (JWT) is stored in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie named `access_token`. The backend middleware automatically extracts and validates this cookie on protected routes.
*   **Predictable Resource URIs:** API routes are nested logically under collections. (e.g., `/api/v1/resumes/{id}/ats-analysis`).
*   **Consistent Response Formats:** Standard response bodies are structured as JSON. Success responses return the requested resource object or array. Error responses follow a strict schema:
    ```json
    {
      "error": "ErrorType",
      "message": "Human-readable explanation of what went wrong.",
      "timestamp": "2026-06-27T12:00:00Z"
    }
    ```
*   **Semantic HTTP Status Codes:** 
    *   `200 OK` — Request completed successfully.
    *   `201 Created` — Resource successfully created.
    *   `204 No Content` — Action successful, no return payload (e.g., deletions).
    *   `400 Bad Request` — Client error (malformed JSON, validation failure).
    *   `401 Unauthorized` — Missing or invalid authentication token.
    *   `403 Forbidden` — Valid authentication but insufficient permissions for the specific resource.
    *   `404 Not Found` — Resource does not exist.
    *   `422 Unprocessable Entity` — Syntactically correct request but semantically invalid (e.g., file exceeds 5MB limit).
    *   `500 Internal Server Error` — Database or backend crash.
*   **Real-time AI Streaming:** For endpoints utilizing local LLM operations (such as the Career Roadmaps, AI assistant chat, and bullet optimizations), the API supports both standard JSON and **Server-Sent Events (SSE)**. Using `text/event-stream` enables real-time token delivery to the client.

---

## 2. API Endpoint Directory

*   **Authentication:**
    *   `POST /api/v1/auth/register` — User Sign-Up
    *   `POST /api/v1/auth/login` — User Sign-In (Sets Cookie)
    *   `POST /api/v1/auth/logout` — User Sign-Out (Clears Cookie)
    *   `GET /api/v1/auth/me` — Current Session Validation
*   **User Profile:**
    *   `GET /api/v1/profile` — Fetch Profile Settings
    *   `PUT /api/v1/profile` — Update Profile Settings
*   **Resume Upload & Parsing:**
    *   `POST /api/v1/resumes/upload` — Upload and Parse Resume
    *   `GET /api/v1/resumes` — List Resumes
    *   `GET /api/v1/resumes/{id}` — Fetch Parsed Resume Detail
    *   `DELETE /api/v1/resumes/{id}` — Remove Resume
*   **ATS Analysis:**
    *   `POST /api/v1/resumes/{id}/ats-analysis` — Execute ATS Optimization Analysis
    *   `GET /api/v1/resumes/{id}/ats-analysis` — Get Existing ATS Report
*   **Job Matching & Skill Gap Analysis:**
    *   `POST /api/v1/jobs` — Save Target Job Description
    *   `GET /api/v1/jobs` — List Target Job Descriptions
    *   `POST /api/v1/matching/compare` — Vector Match Resume to Job Description
    *   `GET /api/v1/matching/reports/{id}` — Fetch Matching & Skill Gap Report
*   **Resume Improvement:**
    *   `POST /api/v1/resumes/{id}/optimize-bullet` — AI-Powered Bullet Point Optimizer
*   **Interview Preparation:**
    *   `POST /api/v1/interviews/sessions` — Start Mock Interview
    *   `GET /api/v1/interviews/sessions` — List Interview Sessions
    *   `GET /api/v1/interviews/sessions/{id}` — Fetch Interview Logs
    *   `POST /api/v1/interviews/sessions/{id}/answer` — Submit Interview Answer
    *   `POST /api/v1/interviews/sessions/{id}/complete` — Conclude Session & Get Feedback
*   **Career Roadmap:**
    *   `POST /api/v1/roadmaps/generate` — Generate Milestones Career Roadmap
    *   `GET /api/v1/roadmaps` — List Active Career Roadmaps
    *   `GET /api/v1/roadmaps/{id}` — Fetch Detailed Career Roadmap
*   **AI Career Assistant:**
    *   `GET /api/v1/assistant/chats` — List AI Conversation Threads
    *   `POST /api/v1/assistant/chats` — Initialize Conversation Thread
    *   `POST /api/v1/assistant/chats/{id}/message` — Post Message to Assistant (Streaming)
    *   `DELETE /api/v1/assistant/chats/{id}` — Delete Conversation History
*   **Dashboard Analytics:**
    *   `GET /api/v1/analytics/dashboard` — Fetch Aggregated Charts and Trend Analytics

---

## 3. Detailed Endpoint Specifications

### 3.1 Authentication

#### 3.1.1 User Registration
*   **Endpoint Name:** User Registration
*   **HTTP Method:** `POST`
*   **URL:** `/api/v1/auth/register`
*   **Description:** Creates a new user record in the database.
*   **Authentication Required:** No
*   **Request Body:**
    *   `email` (string, required): Lowercase email address.
    *   `password` (string, required): Minimum 8 characters.
*   **Response Body:**
    *   `id` (uuid): Newly generated user identifier.
    *   `email` (string): User email address.
    *   `created_at` (datetime): Timestamp of creation.
*   **Status Codes:**
    *   `201 Created` — Registration successful.
    *   `400 Bad Request` — Email already exists or password too weak.
*   **Example JSON Request:**
    ```json
    {
      "email": "candidate@example.com",
      "password": "SecurePassword123"
    }
    ```
*   **Example JSON Response:**
    ```json
    {
      "id": "e29c259e-4e3a-4a2e-8367-111111111111",
      "email": "candidate@example.com",
      "created_at": "2026-06-27T11:42:00Z"
    }
    ```

---

#### 3.1.2 User Login
*   **Endpoint Name:** User Login
*   **HTTP Method:** `POST`
*   **URL:** `/api/v1/auth/login`
*   **Description:** Authenticates the user and sets the JWT inside an HttpOnly cookie.
*   **Authentication Required:** No
*   **Request Body:**
    *   `email` (string, required)
    *   `password` (string, required)
*   **Response Body:**
    *   `status` (string): Confirmation message.
    *   `user` (object): User details schema.
*   **Headers Set:**
    *   `Set-Cookie`: `access_token=<JWT_TOKEN>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
*   **Status Codes:**
    *   `200 OK` — Authentication verified.
    *   `401 Unauthorized` — Invalid email or password credentials.
*   **Example JSON Request:**
    ```json
    {
      "email": "candidate@example.com",
      "password": "SecurePassword123"
    }
    ```
*   **Example JSON Response:**
    ```json
    {
      "status": "success",
      "user": {
        "id": "e29c259e-4e3a-4a2e-8367-111111111111",
        "email": "candidate@example.com"
      }
    }
    ```

---

#### 3.1.3 User Logout
*   **Endpoint Name:** User Logout
*   **HTTP Method:** `POST`
*   **URL:** `/api/v1/auth/logout`
*   **Description:** Clears the cookie containing the JWT.
*   **Authentication Required:** Yes
*   **Request Body:** None
*   **Response Body:**
    *   `status` (string): Confirmation message.
*   **Headers Set:**
    *   `Set-Cookie`: `access_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`
*   **Status Codes:**
    *   `200 OK` — Logout processed.
*   **Example JSON Response:**
    ```json
    {
      "status": "logged_out"
    }
    ```

---

#### 3.1.4 Get Current User Session
*   **Endpoint Name:** Verify Session
*   **HTTP Method:** `GET`
*   **URL:** `/api/v1/auth/me`
*   **Description:** Checks cookie validities and returns session verification details.
*   **Authentication Required:** Yes (validated via `access_token` cookie)
*   **Request Body:** None
*   **Response Body:**
    *   `id` (uuid): Active user identifier.
    *   `email` (string): Verified email address.
*   **Status Codes:**
    *   `200 OK` — Verified session.
    *   `401 Unauthorized` — Token invalid or expired.
*   **Example JSON Response:**
    ```json
    {
      "id": "e29c259e-4e3a-4a2e-8367-111111111111",
      "email": "candidate@example.com"
    }
    ```

---

### 3.2 User Profile

#### 3.2.1 Fetch User Profile
*   **Endpoint Name:** Fetch Profile Settings
*   **HTTP Method:** `GET`
*   **URL:** `/api/v1/profile`
*   **Description:** Retrieves demographic settings and personal skills listings.
*   **Authentication Required:** Yes
*   **Request Body:** None
*   **Response Body:**
    *   `id` (uuid): Profile unique key.
    *   `first_name` (string): First name of user.
    *   `last_name` (string): Last name of user.
    *   `phone_number` (string): Contact number.
    *   `current_role` (string): Active title.
    *   `target_role` (string): Desired title.
    *   `skills` (array of strings): Primary competencies.
    *   `preferences` (object): Config JSON.
*   **Status Codes:**
    *   `200 OK` — Profile loaded.
    *   `404 Not Found` — Profile missing.
*   **Example JSON Response:**
    ```json
    {
      "id": "f83a45c3-1d9e-42ef-98aa-222222222222",
      "first_name": "Jane",
      "last_name": "Doe",
      "phone_number": "+1-555-0199",
      "current_role": "Junior Backend Dev",
      "target_role": "Senior Backend Dev",
      "skills": ["Python", "SQL", "FastAPI"],
      "preferences": {
        "theme": "dark",
        "notifications_enabled": true
      }
    }
    ```

---

#### 3.2.2 Update User Profile
*   **Endpoint Name:** Update Profile
*   **HTTP Method:** `PUT`
*   **URL:** `/api/v1/profile`
*   **Description:** Updates user metrics, preferences, and skills keys.
*   **Authentication Required:** Yes
*   **Request Body:**
    *   `first_name` (string)
    *   `last_name` (string)
    *   `phone_number` (string)
    *   `current_role` (string)
    *   `target_role` (string)
    *   `skills` (array of strings)
    *   `preferences` (object)
*   **Response Body:** Updated Profile schema (same as GET profile).
*   **Status Codes:**
    *   `200 OK` — Profile updated.
    *   `400 Bad Request` — Invalid inputs.
*   **Example JSON Request:**
    ```json
    {
      "first_name": "Jane",
      "last_name": "Doe",
      "phone_number": "+1-555-0199",
      "current_role": "Backend Dev",
      "target_role": "Senior Backend Dev",
      "skills": ["Python", "SQL", "FastAPI", "PostgreSQL"],
      "preferences": {
        "theme": "dark",
        "notifications_enabled": true
      }
    }
    ```
*   **Example JSON Response:**
    ```json
    {
      "id": "f83a45c3-1d9e-42ef-98aa-222222222222",
      "first_name": "Jane",
      "last_name": "Doe",
      "phone_number": "+1-555-0199",
      "current_role": "Backend Dev",
      "target_role": "Senior Backend Dev",
      "skills": ["Python", "SQL", "FastAPI", "PostgreSQL"],
      "preferences": {
        "theme": "dark",
        "notifications_enabled": true
      }
    }
    ```

---

### 3.3 Resume Upload & Parsing

#### 3.3.1 Upload & Parse Resume
*   **Endpoint Name:** Upload and Parse Resume
*   **HTTP Method:** `POST`
*   **URL:** `/api/v1/resumes/upload`
*   **Description:** Accepts a `.pdf` or `.docx` file (multipart form data). The backend extracts raw text and runs the spaCy NLP pipeline to return structured entities, saving the record.
*   **Authentication Required:** Yes
*   **Request Headers:** `Content-Type: multipart/form-data`
*   **Request Parameters:** None
*   **Request Body:**
    *   `file` (binary, required): PDF or DOCX file (limit 5MB).
*   **Response Body:**
    *   `id` (uuid): Generated resume key.
    *   `file_name` (string): Uploaded name.
    *   `file_size` (integer): Size in bytes.
    *   `parsed_json` (object): Parsed data structure containing skills, experience, education, projects.
    *   `created_at` (datetime): Creation time.
*   **Status Codes:**
    *   `201 Created` — Resume uploaded and successfully parsed.
    *   `400 Bad Request` — Unsupported file format.
    *   `422 Unprocessable Entity` — File exceeds 5MB or contains unreadable contents.
*   **Example JSON Response:**
    ```json
    {
      "id": "a91b5c47-3e2a-464a-bdbe-333333333333",
      "file_name": "jane_doe_resume.pdf",
      "file_size": 102450,
      "parsed_json": {
        "personal_info": {
          "name": "Jane Doe",
          "email": "jane.doe@example.com"
        },
        "skills": ["Python", "FastAPI", "PostgreSQL"],
        "experience": [
          {
            "company": "Tech Corp",
            "role": "Software Engineer",
            "start_date": "2024-01",
            "end_date": "Present",
            "bullet_points": ["Developed FastAPI backend web servers."]
          }
        ],
        "education": [
          {
            "institution": "State University",
            "degree": "B.S. in Computer Science"
          }
        ]
      },
      "created_at": "2026-06-27T11:43:00Z"
    }
    ```

---

#### 3.3.2 List Resumes
*   **Endpoint Name:** List Resumes
*   **HTTP Method:** `GET`
*   **URL:** `/api/v1/resumes`
*   **Description:** Fetches a list of the user's active resumes (excluding raw text payloads for faster indexing queries).
*   **Authentication Required:** Yes
*   **Request Body:** None
*   **Response Body:** Array of Resume summaries.
*   **Status Codes:**
    *   `200 OK` — List retrieved.
*   **Example JSON Response:**
    ```json
    [
      {
        "id": "a91b5c47-3e2a-464a-bdbe-333333333333",
        "file_name": "jane_doe_resume.pdf",
        "file_size": 102450,
        "created_at": "2026-06-27T11:43:00Z"
      }
    ]
    ```

---

#### 3.3.3 Fetch Parsed Resume Detail
*   **Endpoint Name:** Fetch Resume Details
*   **HTTP Method:** `GET`
*   **URL:** `/api/v1/resumes/{id}`
*   **Description:** Retrieves full raw text and structural parsed JSON for a specific resume index.
*   **Authentication Required:** Yes
*   **Request Parameters:**
    *   `id` (uuid, path parameter, required)
*   **Response Body:** Full Resume Schema (including raw_text).
*   **Status Codes:**
    *   `200 OK` — Details loaded.
    *   `404 Not Found` — Resume missing.
*   **Example JSON Response:**
    ```json
    {
      "id": "a91b5c47-3e2a-464a-bdbe-333333333333",
      "file_name": "jane_doe_resume.pdf",
      "file_size": 102450,
      "raw_text": "Jane Doe\njane.doe@example.com\nPython, FastAPI...",
      "parsed_json": {
        "personal_info": {
          "name": "Jane Doe",
          "email": "jane.doe@example.com"
        },
        "skills": ["Python", "FastAPI", "PostgreSQL"],
        "experience": []
      },
      "created_at": "2026-06-27T11:43:00Z"
    }
    ```

---

#### 3.3.4 Remove Resume
*   **Endpoint Name:** Delete Resume
*   **HTTP Method:** `DELETE`
*   **URL:** `/api/v1/resumes/{id}`
*   **Description:** Deletes a specific resume. All linked ATS reports and evaluations cascade on delete.
*   **Authentication Required:** Yes
*   **Request Parameters:**
    *   `id` (uuid, path parameter, required)
*   **Response Body:** None
*   **Status Codes:**
    *   `204 No Content` — Deletion successful.
    *   `404 Not Found` — Resume not found.

---

### 3.4 ATS Analysis

#### 3.4.1 Run ATS Analysis
*   **Endpoint Name:** Run ATS Analysis
*   **HTTP Method:** `POST`
*   **URL:** `/api/v1/resumes/{id}/ats-analysis`
*   **Description:** Prompts the parser to inspect formatting issues, verify sections, calculate structural readability (0–100), and generate recommendations.
*   **Authentication Required:** Yes
*   **Request Parameters:**
    *   `id` (uuid, path, required): Target resume ID.
*   **Response Body:**
    *   `id` (uuid): ATS Report ID.
    *   `resume_id` (uuid): Refers to targeted resume.
    *   `score` (integer): Output percentage.
    *   `formatting_issues` (array of strings): Readability issues.
    *   `missing_sections` (array of strings): Omitted blocks.
    *   `recommendations` (array of objects): Steps for remediation.
*   **Status Codes:**
    *   `200 OK` — Analysis completed.
    *   `404 Not Found` — Resume missing.
*   **Example JSON Response:**
    ```json
    {
      "id": "b182d334-a12b-42ef-bdbe-444444444444",
      "resume_id": "a91b5c47-3e2a-464a-bdbe-333333333333",
      "score": 75,
      "formatting_issues": [
        "Identified 2-column tabular styling, which can cause reading order errors in some ATS systems."
      ],
      "missing_sections": [
        "Executive Summary",
        "Projects"
      ],
      "recommendations": [
        {
          "issue": "Missing Executive Summary",
          "action": "Add a 3-sentence summary at the top outlining backend experience.",
          "priority": "High"
        }
      ]
    }
    ```

---

#### 3.4.2 Fetch Stored ATS Report
*   **Endpoint Name:** Fetch ATS Report
*   **HTTP Method:** `GET`
*   **URL:** `/api/v1/resumes/{id}/ats-analysis`
*   **Description:** Returns the saved ATS report for a specific resume, avoiding repeating computations.
*   **Authentication Required:** Yes
*   **Request Parameters:**
    *   `id` (uuid, path, required)
*   **Status Codes:**
    *   `200 OK` — Report loaded.
    *   `404 Not Found` — Report or resume missing.
*   **Example JSON Response:** Same as `POST /api/v1/resumes/{id}/ats-analysis`.

---

### 3.5 Job Matching & Skill Gap Analysis

#### 3.5.1 Save Target Job Description
*   **Endpoint Name:** Save Job Description
*   **HTTP Method:** `POST`
*   **URL:** `/api/v1/jobs`
*   **Description:** Saves a target job description and extracts key skills via NLP.
*   **Authentication Required:** Yes
*   **Request Body:**
    *   `title` (string, required): Target job title.
    *   `company` (string, optional): Employer name.
    *   `raw_text` (string, required): Full description text.
*   **Response Body:**
    *   `id` (uuid): Job Description ID.
    *   `title` (string): Title.
    *   `company` (string): Company.
    *   `skills_list` (array of strings): NLP-extracted target skills.
    *   `created_at` (datetime): Timestamp.
*   **Status Codes:**
    *   `201 Created` — Saved and parsed.
*   **Example JSON Request:**
    ```json
    {
      "title": "Backend Software Engineer",
      "company": "NextGen Technologies",
      "raw_text": "We are seeking a Backend Software Engineer with experience in Python, FastAPI, and Postgres DB."
    }
    ```
*   **Example JSON Response:**
    ```json
    {
      "id": "c71a39d4-1a2b-42ef-bdbe-555555555555",
      "title": "Backend Software Engineer",
      "company": "NextGen Technologies",
      "skills_list": ["Python", "FastAPI", "Postgres DB"],
      "created_at": "2026-06-27T11:44:00Z"
    }
    ```

---

#### 3.5.2 List Saved Job Descriptions
*   **Endpoint Name:** List Job Descriptions
*   **HTTP Method:** `GET`
*   **URL:** `/api/v1/jobs`
*   **Description:** Fetches all job profiles saved by the user (excluding raw text payloads).
*   **Authentication Required:** Yes
*   **Response Body:** Array of Job Description summaries.
*   **Status Codes:**
    *   `200 OK` — List retrieved.
*   **Example JSON Response:**
    ```json
    [
      {
        "id": "c71a39d4-1a2b-42ef-bdbe-555555555555",
        "title": "Backend Software Engineer",
        "company": "NextGen Technologies",
        "skills_list": ["Python", "FastAPI", "Postgres DB"],
        "created_at": "2026-06-27T11:44:00Z"
      }
    ]
    ```

---

#### 3.5.3 Vector Match Comparison
*   **Endpoint Name:** Perform Job Match Analysis
*   **HTTP Method:** `POST`
*   **URL:** `/api/v1/matching/compare`
*   **Description:** Computes cosine similarity matching using Sentence Transformers embeddings between a resume and a job description. Automatically generates the skill gap analysis.
*   **Authentication Required:** Yes
*   **Request Body:**
    *   `resume_id` (uuid, required)
    *   `job_description_id` (uuid, required)
*   **Response Body:**
    *   `match_id` (uuid): Job Match key.
    *   `match_score` (number): Vector cosine rating.
    *   `ats_compatibility_score` (number): Dynamic overall reading compatibility.
    *   `skill_gap_analysis` (object): Contains present skills, missing skills, recommended skills, and action plan.
*   **Status Codes:**
    *   `201 Created` — Match processed and saved.
    *   `404 Not Found` — Selected resume or job ID not found.
*   **Example JSON Request:**
    ```json
    {
      "resume_id": "a91b5c47-3e2a-464a-bdbe-333333333333",
      "job_description_id": "c71a39d4-1a2b-42ef-bdbe-555555555555"
    }
    ```
*   **Example JSON Response:**
    ```json
    {
      "match_id": "d182e443-a12b-42ef-bdbe-666666666666",
      "match_score": 82.50,
      "ats_compatibility_score": 85.00,
      "skill_gap_analysis": {
        "present_skills": ["Python", "FastAPI"],
        "missing_skills": ["Postgres DB"],
        "recommended_skills": ["SQL Performance Optimization", "Docker"],
        "action_plan": [
          "Complete a PostgreSQL indexing course.",
          "Add Postgres database projects to your resume."
        ]
      }
    }
    ```

---

#### 3.5.4 Fetch Stored Match Report
*   **Endpoint Name:** Fetch Match Details
*   **HTTP Method:** `GET`
*   **URL:** `/api/v1/matching/reports/{id}`
*   **Description:** Retrieves historical scoring profiles and skill gaps for a saved match record.
*   **Authentication Required:** Yes
*   **Request Parameters:**
    *   `id` (uuid, path, required): Job Match ID.
*   **Status Codes:**
    *   `200 OK` — Metrics loaded.
    *   `404 Not Found` — Report not found.
*   **Example JSON Response:** Same as response in `POST /api/v1/matching/compare`.

---

### 3.6 Resume Improvement

#### 3.6.1 AI-Powered Bullet Point Optimizer
*   **Endpoint Name:** Optimize Bullet Point
*   **HTTP Method:** `POST`
*   **URL:** `/api/v1/resumes/{id}/optimize-bullet`
*   **Description:** Prompts local Ollama (Qwen 2.5 3B) model to rewrite a specific resume bullet point utilizing the STAR method, tailored to a target job description.
*   **Authentication Required:** Yes
*   **Request Body:**
    *   `original_bullet` (string, required): Bullet point to improve.
    *   `job_description_id` (uuid, optional): Target job ID to optimize context.
    *   `focus_keywords` (array of strings, optional): Keywords to integrate.
*   **Response Body:**
    *   `original_bullet` (string)
    *   `optimized_bullet` (string): AI STAR-optimized replacement suggestion.
    *   `explanation` (string): Context detailing the enhancement.
*   **Status Codes:**
    *   `200 OK` — Optimization returned.
    *   `404 Not Found` — Resume or job ID not found.
*   **Example JSON Request:**
    ```json
    {
      "original_bullet": "Responsible for maintaining the backend API and fixing bugs.",
      "job_description_id": "c71a39d4-1a2b-42ef-bdbe-555555555555",
      "focus_keywords": ["FastAPI", "Latency"]
    }
    ```
*   **Example JSON Response:**
    ```json
    {
      "original_bullet": "Responsible for maintaining the backend API and fixing bugs.",
      "optimized_bullet": "Optimized and maintained high-throughput FastAPI endpoints, resolving core bugs to reduce API latency by 15%.",
      "explanation": "Rewritten using the STAR format. Added quantitative impact (latency reduction) and featured critical skills (FastAPI, optimization)."
    }
    ```

---

### 3.7 Interview Preparation

#### 3.7.1 Start Mock Interview Session
*   **Endpoint Name:** Start Mock Session
*   **HTTP Method:** `POST`
*   **URL:** `/api/v1/interviews/sessions`
*   **Description:** Spawns a mock interview thread. The backend initializes context and uses the local LLM to generate the first question based on the target role/company or job description.
*   **Authentication Required:** Yes
*   **Request Body:**
    *   `target_role` (string, required): e.g., 'Python Dev'.
    *   `company` (string, optional): Target employer context.
    *   `job_description_id` (uuid, optional): Job description schema to extract questions from.
*   **Response Body:**
    *   `id` (uuid): Interview session unique identifier.
    *   `target_role` (string)
    *   `company` (string)
    *   `status` (string): `started`
    *   `first_question` (string): Initial AI interview question.
*   **Status Codes:**
    *   `201 Created` — Session created.
*   **Example JSON Request:**
    ```json
    {
      "target_role": "Backend Engineer",
      "company": "NextGen Technologies",
      "job_description_id": "c71a39d4-1a2b-42ef-bdbe-555555555555"
    }
    ```
*   **Example JSON Response:**
    ```json
    {
      "id": "e29f345a-1a2b-42ef-bdbe-777777777777",
      "target_role": "Backend Engineer",
      "company": "NextGen Technologies",
      "status": "started",
      "first_question": "To start, could you explain how you would design a rate limiter for a FastAPI server?"
    }
    ```

---

#### 3.7.2 List Interview Sessions
*   **Endpoint Name:** List Interview Sessions
*   **HTTP Method:** `GET`
*   **URL:** `/api/v1/interviews/sessions`
*   **Description:** Returns historical session summaries (excluding full transcript details to save payload sizes).
*   **Authentication Required:** Yes
*   **Status Codes:**
    *   `200 OK` — List retrieved.
*   **Example JSON Response:**
    ```json
    [
      {
        "id": "e29f345a-1a2b-42ef-bdbe-777777777777",
        "target_role": "Backend Engineer",
        "company": "NextGen Technologies",
        "status": "completed",
        "score": 85,
        "created_at": "2026-06-27T11:45:00Z"
      }
    ]
    ```

---

#### 3.7.3 Fetch Interview Logs
*   **Endpoint Name:** Fetch Session Details
*   **HTTP Method:** `GET`
*   **URL:** `/api/v1/interviews/sessions/{id}`
*   **Description:** Returns full chat logs and structured scoring feedback for a specific session ID.
*   **Authentication Required:** Yes
*   **Request Parameters:**
    *   `id` (uuid, path, required)
*   **Status Codes:**
    *   `200 OK` — Loaded session details.
    *   `404 Not Found` — Session not found.
*   **Example JSON Response:**
    ```json
    {
      "id": "e29f345a-1a2b-42ef-bdbe-777777777777",
      "target_role": "Backend Engineer",
      "company": "NextGen Technologies",
      "status": "in_progress",
      "score": null,
      "overall_feedback": null,
      "transcript": [
        {
          "speaker": "interviewer",
          "message": "To start, could you explain how you would design a rate limiter for a FastAPI server?",
          "timestamp": "2026-06-27T11:45:10Z"
        },
        {
          "speaker": "candidate",
          "message": "I would use a redis-based token bucket algorithm as middleware.",
          "timestamp": "2026-06-27T11:46:00Z",
          "evaluation": {
            "score": 88,
            "feedback": "Strong answer. Correctly identified token bucket and Redis architecture."
          }
        }
      ]
    }
    ```

---

#### 3.7.4 Submit Interview Answer
*   **Endpoint Name:** Submit Answer
*   **HTTP Method:** `POST`
*   **URL:** `/api/v1/interviews/sessions/{id}/answer`
*   **Description:** Submits the user's answer. The backend prompts local LLM to grade the answer and return the next question.
*   **Authentication Required:** Yes
*   **Request Parameters:**
    *   `id` (uuid, path, required)
*   **Request Body:**
    *   `answer` (string, required): Candidate's response.
*   **Response Body:**
    *   `score` (integer): Grading rating for this specific response (0-100).
    *   `feedback` (string): Critique and optimal correction details.
    *   `next_question` (string): Next question generated by the interviewer (returns `null` if maximum question count is reached).
*   **Status Codes:**
    *   `200 OK` — Answer graded successfully.
    *   `400 Bad Request` — Interview session is already closed.
*   **Example JSON Request:**
    ```json
    {
      "answer": "I would use a redis-based token bucket algorithm as middleware."
    }
    ```
*   **Example JSON Response:**
    ```json
    {
      "score": 88,
      "feedback": "Strong answer. Correctly identified token bucket and Redis architecture. You could improve by mentioning throttling headers.",
      "next_question": "Great. Next, how do you handle database connection pooling in FastAPI?"
    }
    ```

---

#### 3.7.5 Conclude Interview Session
*   **Endpoint Name:** Complete Session
*   **HTTP Method:** `POST`
*   **URL:** `/api/v1/interviews/sessions/{id}/complete`
*   **Description:** Terminates the session, calculates the average total score, and writes a final evaluation summary.
*   **Authentication Required:** Yes
*   **Request Parameters:**
    *   `id` (uuid, path, required)
*   **Request Body:** None
*   **Response Body:**
    *   `id` (uuid): Session ID.
    *   `status` (string): `completed`
    *   `score` (integer): Overall average performance score.
    *   `overall_feedback` (string): Final performance evaluation.
*   **Status Codes:**
    *   `200 OK` — Session concluded.
*   **Example JSON Response:**
    ```json
    {
      "id": "e29f345a-1a2b-42ef-bdbe-777777777777",
      "status": "completed",
      "score": 85,
      "overall_feedback": "Overall strong performance. Excellent conceptual system design knowledge. Minor gaps in local caching configurations."
    }
    ```

---

### 3.8 Career Roadmap

#### 3.8.1 Generate Career Roadmap
*   **Endpoint Name:** Generate Career Roadmap
*   **HTTP Method:** `POST`
*   **URL:** `/api/v1/roadmaps/generate`
*   **Description:** Connects to local LLM (Qwen 2.5 3B) to generate a milestone roadmap mapping the career transition.
*   **Authentication Required:** Yes
*   **Request Body:**
    *   `current_role` (string, required): e.g., 'Junior Dev'.
    *   `target_role` (string, required): e.g., 'Lead backend architect'.
*   **Response Body:**
    *   `id` (uuid): Generated roadmap identifier.
    *   `current_role` (string)
    *   `target_role` (string)
    *   `roadmap_steps` (array of objects): Step milestones details.
*   **Status Codes:**
    *   `201 Created` — Roadmap successfully mapped.
*   **Example JSON Request:**
    ```json
    {
      "current_role": "Junior Backend Dev",
      "target_role": "Senior Backend Architect"
    }
    ```
*   **Example JSON Response:**
    ```json
    {
      "id": "f83a45c3-1d9e-42ef-bdbe-888888888888",
      "current_role": "Junior Backend Dev",
      "target_role": "Senior Backend Architect",
      "roadmap_steps": [
        {
          "step_number": 1,
          "title": "Master Database Architecture",
          "estimated_timeline": "2-3 Months",
          "focus_skills": ["PostgreSQL Tuning", "NoSQL Models"],
          "action_items": ["Learn EXPLAIN ANALYZE for Postgres queries."],
          "learning_resources": [
            {
              "title": "PgSQL Internals",
              "url": "https://postgrespro.com/blog/media/books/internals.pdf"
            }
          ]
        }
      ]
    }
    ```

---

#### 3.8.2 List Active Career Roadmaps
*   **Endpoint Name:** List Roadmaps
*   **HTTP Method:** `GET`
*   **URL:** `/api/v1/roadmaps`
*   **Description:** Fetches all saved roadmaps for the authenticated user (excluding deep milestone arrays).
*   **Authentication Required:** Yes
*   **Response Body:** Array of roadmap summaries.
*   **Status Codes:**
    *   `200 OK` — List retrieved.
*   **Example JSON Response:**
    ```json
    [
      {
        "id": "f83a45c3-1d9e-42ef-bdbe-888888888888",
        "current_role": "Junior Backend Dev",
        "target_role": "Senior Backend Architect",
        "created_at": "2026-06-27T11:46:00Z"
      }
    ]
    ```

---

#### 3.8.3 Fetch Detailed Career Roadmap
*   **Endpoint Name:** Fetch Roadmap Details
*   **HTTP Method:** `GET`
*   **URL:** `/api/v1/roadmaps/{id}`
*   **Description:** Returns full milestone schemas for a specific roadmap ID.
*   **Authentication Required:** Yes
*   **Request Parameters:**
    *   `id` (uuid, path, required)
*   **Status Codes:**
    *   `200 OK` — Roadmap loaded.
    *   `404 Not Found` — Roadmap not found.
*   **Example JSON Response:** Same response payload as `POST /api/v1/roadmaps/generate`.

---

### 3.9 AI Career Assistant

#### 3.9.1 List Conversation Threads
*   **Endpoint Name:** List Chat Threads
*   **HTTP Method:** `GET`
*   **URL:** `/api/v1/assistant/chats`
*   **Description:** Retrieves a summary of conversation threads for the system-wide chat assistant.
*   **Authentication Required:** Yes
*   **Response Body:** Array of Chat summaries.
*   **Status Codes:**
    *   `200 OK` — List loaded.
*   **Example JSON Response:**
    ```json
    [
      {
        "id": "a91b45c2-1a2b-42ef-bdbe-999999999999",
        "title": "Resume optimization questions",
        "updated_at": "2026-06-27T11:47:00Z"
      }
    ]
    ```

---

#### 3.9.2 Initialize Conversation Thread
*   **Endpoint Name:** Create Chat Thread
*   **HTTP Method:** `POST`
*   **URL:** `/api/v1/assistant/chats`
*   **Description:** Initializes a new chat conversation thread.
*   **Authentication Required:** Yes
*   **Request Body:** None
*   **Response Body:**
    *   `id` (uuid): New Chat ID.
    *   `title` (string): `New Chat`
    *   `messages` (array): `'[]'`
*   **Status Codes:**
    *   `201 Created` — Chat thread initialized.
*   **Example JSON Response:**
    ```json
    {
      "id": "a91b45c2-1a2b-42ef-bdbe-999999999999",
      "title": "New Chat",
      "messages": []
    }
    ```

---

#### 3.9.3 Send Message to Assistant (Streaming / Non-Streaming)
*   **Endpoint Name:** Send Assistant Message
*   **HTTP Method:** `POST`
*   **URL:** `/api/v1/assistant/chats/{id}/message`
*   **Description:** Posts a prompt to the assistant. The backend executes queries against local LLM (Qwen 2.5 3B), utilizing context-aware indexes of the user's parsed resume.
*   **Authentication Required:** Yes
*   **Request Parameters:**
    *   `id` (uuid, path, required)
    *   `stream` (boolean, query parameter, optional): Defaults to `true`. If `true`, returns a Server-Sent Events (SSE) `text/event-stream`. If `false`, returns standard JSON.
*   **Request Body:**
    *   `message` (string, required): User question.
*   **Response Body (when stream=false):**
    *   `sender` (string): `assistant`
    *   `message` (string): Complete assistant text response.
    *   `timestamp` (datetime)
*   **Response Body (when stream=true):**
    *   Header: `Content-Type: text/event-stream`
    *   Body: Stream of data tokens: `data: {"token": "Hello"}\n\ndata: {"token": " world"}\n\ndata: [DONE]\n\n`
*   **Status Codes:**
    *   `200 OK` — Message sent.
    *   `404 Not Found` — Chat thread not found.
*   **Example JSON Response (when stream=false):**
    ```json
    {
      "sender": "assistant",
      "message": "Based on your resume, you have strong FastAPI skills, but I noticed a lack of PostgreSQL performance experience, which is required for the target Backend Engineer role.",
      "timestamp": "2026-06-27T11:48:00Z"
    }
    ```

---

#### 3.9.4 Delete Conversation History
*   **Endpoint Name:** Delete Chat Thread
*   **HTTP Method:** `DELETE`
*   **URL:** `/api/v1/assistant/chats/{id}`
*   **Description:** Deletes a specific conversation thread.
*   **Authentication Required:** Yes
*   **Request Parameters:**
    *   `id` (uuid, path, required)
*   **Status Codes:**
    *   `204 No Content` — Chat deleted.
    *   `404 Not Found` — Chat not found.

---

### 3.10 Dashboard Analytics

#### 3.10.1 Fetch Dashboard Analytics
*   **Endpoint Name:** Fetch Dashboard Analytics
*   **HTTP Method:** `GET`
*   **URL:** `/api/v1/analytics/dashboard`
*   **Description:** Returns metrics counts and time-series data formats to load Plotly dashboard visualizers directly.
*   **Authentication Required:** Yes
*   **Response Body:**
    *   `metrics` (object): General counts.
    *   `ats_score_trends` (array of objects): History tracking for line charts.
    *   `skill_radar_data` (object): Skills match distributions.
    *   `interview_performance_trends` (array of objects): Mock progression tracking.
*   **Status Codes:**
    *   `200 OK` — Dashboard data retrieved.
*   **Example JSON Response:**
    ```json
    {
      "metrics": {
        "total_resumes_uploaded": 3,
        "total_interviews_completed": 5,
        "average_match_rating": 82.50,
        "average_interview_score": 85.00
      },
      "ats_score_trends": [
        {
          "date": "2026-06-15",
          "score": 65
        },
        {
          "date": "2026-06-20",
          "score": 72
        },
        {
          "date": "2026-06-27",
          "score": 85
        }
      ],
      "skill_radar_data": {
        "categories": ["Backend", "Frontend", "Databases", "DevOps", "Testing"],
        "resume_levels": [80, 50, 60, 40, 70],
        "target_job_levels": [90, 70, 80, 60, 80]
      },
      "interview_performance_trends": [
        {
          "session_id": "e29f345a-1a2b-42ef-bdbe-777777777777",
          "role": "Backend Engineer",
          "score": 85,
          "date": "2026-06-27"
        }
      ]
    }
    ```
