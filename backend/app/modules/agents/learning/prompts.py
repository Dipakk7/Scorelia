# app/modules/agents/learning/prompts.py

from app.ai.schemas.prompt_metadata import PromptTemplate, PromptMetadata

LEARNING_RECOMMEND_PROMPT = PromptTemplate(
    metadata=PromptMetadata(
        name="recommend",
        version="1.0.0",
        description="Learning Agent Recommendation Prompt",
        last_updated="2026-07-05",
        metadata={"category": "learning"}
    ),
    template_body="""You are an expert Learning Assistant. Recommend specific skills and topics the user should learn to advance to their target role.

Target Role: {{ target_role }}
{% if skills %}Skills to focus on: {{ skills }}{% endif %}
{% if resume_json %}
Resume Context:
{{ resume_json }}
{% endif %}

Instructions:
1. Provide a list of recommended topics and skills.
2. For each recommendation, provide title, description, priority (HIGH, MEDIUM, LOW), and reason.
3. Return response strictly as a JSON object matching the JSON schema below. Do not wrap the JSON block in markdown formatting or any other text; output raw JSON only.

JSON schema to return:
{
  "recommendations": [
    {
      "title": "Topic Title",
      "description": "Short description...",
      "priority": "HIGH",
      "reason": "Why this is recommended..."
    }
  ]
}"""
)

LEARNING_PATH_PROMPT = PromptTemplate(
    metadata=PromptMetadata(
        name="path",
        version="1.0.0",
        description="Learning Agent Pathway Generation Prompt",
        last_updated="2026-07-05",
        metadata={"category": "learning"}
    ),
    template_body="""You are an expert Learning Assistant. Formulate a personalized learning pathway for the user to reach their target role.

Target Role: {{ target_role }}
{% if preferences %}Learning Preferences: {{ preferences }}{% endif %}
{% if resume_json %}
Resume Context:
{{ resume_json }}
{% endif %}

Instructions:
1. Define phases (e.g. Phase 1, Phase 2) of learning.
2. For each phase, specify title, objective, estimated duration in weeks, and key topics.
3. Return response strictly as a JSON object matching the JSON schema below. Do not wrap the JSON block in markdown formatting or any other text; output raw JSON only.

JSON schema to return:
{
  "target_role": "{{ target_role }}",
  "phases": [
    {
      "phase_number": 1,
      "title": "Phase Title",
      "objective": "Objective of Phase 1...",
      "estimated_duration_weeks": 4,
      "topics": ["Topic A", "Topic B"]
    }
  ]
}"""
)

LEARNING_COURSES_PROMPT = PromptTemplate(
    metadata=PromptMetadata(
        name="courses",
        version="1.0.0",
        description="Learning Agent Course Recommendation RAG Prompt",
        last_updated="2026-07-05",
        metadata={"category": "learning"}
    ),
    template_body="""You are an expert Learning Assistant. Evaluate and rank the retrieved courses from our knowledge base that match the user's requirements.

{% if target_role %}Target Role: {{ target_role }}{% endif %}
{% if skills %}Target Skills: {{ skills }}{% endif %}
{% if query %}Search Query: {{ query }}{% endif %}

Retrieved Courses from RAG:
{{ rag_context }}

Instructions:
1. Evaluate and select the most relevant courses.
2. Provide a list of recommended courses.
3. For each course, list course_name, platform, estimated_hours, difficulty, description, and similarity_score (or recommendation reason).
4. Return response strictly as a JSON object matching the JSON schema below. Do not wrap the JSON block in markdown formatting or any other text; output raw JSON only.

JSON schema to return:
{
  "courses": [
    {
      "course_name": "Course Title",
      "platform": "Coursera / Udemy",
      "estimated_hours": 12,
      "difficulty": "Intermediate",
      "description": "Brief description...",
      "reason": "Why this matches your needs..."
    }
  ]
}"""
)

LEARNING_CERTIFICATIONS_PROMPT = PromptTemplate(
    metadata=PromptMetadata(
        name="certifications",
        version="1.0.0",
        description="Learning Agent Certification Recommendation Prompt",
        last_updated="2026-07-05",
        metadata={"category": "learning"}
    ),
    template_body="""You are an expert Learning Assistant. Recommend the most valued industry certifications for the user's target role.

Target Role: {{ target_role }}
{% if skills %}Target Skills: {{ skills }}{% endif %}

Instructions:
1. Identify 2-4 key certifications.
2. For each, specify certificate_name, issuing_organization, difficulty (Easy, Medium, Hard), cost_range (Low, Medium, High), and preparation_time_months.
3. Return response strictly as a JSON object matching the JSON schema below. Do not wrap the JSON block in markdown formatting or any other text; output raw JSON only.

JSON schema to return:
{
  "certifications": [
    {
      "certificate_name": "AWS Certified Solutions Architect",
      "issuing_organization": "Amazon Web Services",
      "difficulty": "Medium",
      "cost_range": "Medium",
      "preparation_time_months": 3,
      "reason": "Why this certificate is valued..."
    }
  ]
}"""
)

LEARNING_STUDY_PLAN_PROMPT = PromptTemplate(
    metadata=PromptMetadata(
        name="study_plan",
        version="1.0.0",
        description="Learning Agent Study Plan Prompt",
        last_updated="2026-07-05",
        metadata={"category": "learning"}
    ),
    template_body="""You are an expert Learning Assistant. Formulate a structured study plan based on study speed and weekly hours.

Target Role: {{ target_role }}
Hours Per Week: {{ hours_per_week }}
Duration Weeks: {{ duration_weeks }}

Instructions:
1. Provide a weekly breakdown for the given duration.
2. Define the focus of each week, specific study goals, topics, and estimated hours.
3. Return response strictly as a JSON object matching the JSON schema below. Do not wrap the JSON block in markdown formatting or any other text; output raw JSON only.

JSON schema to return:
{
  "study_plan": [
    {
      "week_number": 1,
      "weekly_focus": "Week Focus...",
      "topics": ["Topic A", "Topic B"],
      "study_hours": {{ hours_per_week }},
      "weekly_goals": ["Goal 1"]
    }
  ]
}"""
)
