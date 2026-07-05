# app/modules/agents/ats/prompts.py

from app.ai.schemas.prompt_metadata import PromptTemplate, PromptMetadata

ATS_REVIEW_PROMPT = PromptTemplate(
    metadata=PromptMetadata(
        name="review",
        version="1.0.0",
        description="ATS Review Prompt Template",
        last_updated="2026-07-05",
        metadata={"category": "ats"}
    ),
    template_body="""You are an ATS (Applicant Tracking System) Specialist.
Analyze the following parsed resume JSON content and return a structured assessment.
If a Job Description is provided, analyze the resume in relation to the Job Description.

Resume JSON:
{{ resume_json }}

{% if job_description %}
Job Description:
{{ job_description }}
{% endif %}

Instructions:
1. Provide an overall review of the resume from an ATS parser compatibility and relevance standpoint.
2. Determine the candidate's ATS Readiness (High, Medium, or Low).
3. Identify keyword matches and perform keyword analysis.
4. Call out missing skills that are typical for this domain or explicitly required by the Job Description.
5. Provide actionable recommendations to bypass ATS filters.
6. Return response strictly as a JSON object matching the JSON schema below. Do not wrap the JSON block in markdown formatting or any other text; output raw JSON only.

JSON schema to return:
{
  "overall_review": "Comprehensive review of the resume...",
  "ats_readiness": "High",
  "keyword_analysis": ["keyword1", "keyword2"],
  "missing_skills": ["skill1", "skill2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}"""
)

ATS_IMPROVE_PROMPT = PromptTemplate(
    metadata=PromptMetadata(
        name="improve",
        version="1.0.0",
        description="ATS Improvement Suggestions Prompt Template",
        last_updated="2026-07-05",
        metadata={"category": "ats"}
    ),
    template_body="""You are a senior technical recruiter and career coach.
Analyze the following parsed resume and suggest concrete improvements to make the resume stand out to Applicant Tracking Systems.

Resume JSON:
{{ resume_json }}

{% if job_description %}
Target Job Description:
{{ job_description }}
{% endif %}

Instructions:
1. Provide a list of improvement suggestions grouped by section.
2. For each suggestion, assign a priority ("HIGH", "MEDIUM", "LOW") and provide a clear explanation.
3. Return response strictly as a JSON object matching the JSON schema below. Do not wrap the JSON block in markdown formatting or any other text; output raw JSON only.

JSON schema to return:
{
  "improvement_suggestions": [
    {
      "section": "Name of section (e.g. experience, skills, summary, etc.)",
      "suggestion": "Actionable feedback on what to change...",
      "priority": "HIGH"
    }
  ]
}"""
)
