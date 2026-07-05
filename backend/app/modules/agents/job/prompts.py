# app/modules/agents/job/prompts.py

from app.ai.schemas.prompt_metadata import PromptTemplate, PromptMetadata

JOB_ANALYZE_PROMPT = PromptTemplate(
    metadata=PromptMetadata(
        name="analyze",
        version="1.0.0",
        description="Job Match Gap Analysis Prompt Template",
        last_updated="2026-07-05",
        metadata={"category": "job"}
    ),
    template_body="""You are a technical matching AI.
Compare the following parsed resume with the Target Job Description. Provide a detailed analysis of the match.

Resume JSON:
{{ resume_json }}

Target Job Description:
{{ job_description }}

{% if gap_analysis_output %}
Calculated Python Gaps:
{{ gap_analysis_output }}
{% endif %}

Instructions:
1. Conduct a deep comparative analysis of skills, experience, education, and certifications.
2. Explain specifically what is matching and what is missing or deficient.
3. Assess the candidate's alignment for this position.
4. Return response strictly as a JSON object matching the JSON schema below. Do not wrap the JSON block in markdown formatting or any other text; output raw JSON only.

JSON schema to return:
{
  "match_summary": "Overall summary of the candidate's fit...",
  "education_match_explanation": "Detailed comparison of education requirements...",
  "experience_match_explanation": "Detailed comparison of experience requirements...",
  "skills_match_explanation": "Detailed comparison of skills...",
  "certification_match_explanation": "Detailed comparison of certifications..."
}"""
)

JOB_RECOMMEND_PROMPT = PromptTemplate(
    metadata=PromptMetadata(
        name="recommend",
        version="1.0.0",
        description="Job Match Recommendations Prompt Template",
        last_updated="2026-07-05",
        metadata={"category": "job"}
    ),
    template_body="""You are an expert career counselor.
Provide recommendations on how the candidate can optimize their resume or bridge gaps to better match target roles.

Resume JSON:
{{ resume_json }}

{% if job_description %}
Target Job Description:
{{ job_description }}
{% endif %}

{% if rag_context %}
Relevant Job and Skill Reference Material:
{{ rag_context }}
{% endif %}

Instructions:
1. Outline specific, actionable recommendations for the candidate.
2. If RAG Reference Material is provided, incorporate context/information from it (e.g. typical industry standards, certification suggestions, online learning links).
3. Focus on bridging critical gaps in skills, experience, certifications, and educational representation.
4. Return response strictly as a JSON object matching the JSON schema below. Do not wrap the JSON block in markdown formatting or any other text; output raw JSON only.

JSON schema to return:
{
  "recommendations": [
    {
      "category": "skills/experience/certifications/education/formatting",
      "priority": "HIGH/MEDIUM/LOW",
      "actionable_item": "Specific recommendation...",
      "rationale": "Why this recommendation is important...",
      "reference_source": "Citation or source from reference material if available, else 'General Recruiter Advice'"
    }
  ]
}"""
)
