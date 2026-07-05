# app/modules/agents/cover_letter/prompts.py

from app.ai.schemas.prompt_metadata import PromptTemplate, PromptMetadata

COVER_LETTER_REVIEW_PROMPT = PromptTemplate(
    metadata=PromptMetadata(
        name="review",
        version="1.0.0",
        description="AI Cover Letter Review Prompt Template",
        last_updated="2026-07-05",
        metadata={"category": "cover_letter"}
    ),
    template_body="""You are a professional hiring manager and recruiting specialist.
Evaluate the following cover letter. If a job description is provided, assess how well the cover letter aligns with that job description.

Cover Letter Content:
{{ cover_letter_content }}

{% if job_description %}
Target Job Description:
{{ job_description }}
{% endif %}

Instructions:
1. Rate the overall quality of the cover letter from 0 to 100.
2. Identify 2-4 key strengths.
3. Identify 2-4 key weaknesses or areas of improvement.
4. Provide 3-5 actionable recommendations to make it more compelling.
5. Return response strictly as a JSON object matching the JSON schema below. Do not wrap the JSON block in markdown formatting or any other text; output raw JSON only.

JSON schema to return:
{
  "overall_score": 85,
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}"""
)

COVER_LETTER_REWRITE_PROMPT = PromptTemplate(
    metadata=PromptMetadata(
        name="rewrite",
        version="1.0.0",
        description="AI Cover Letter Rewrite Prompt Template",
        last_updated="2026-07-05",
        metadata={"category": "cover_letter"}
    ),
    template_body="""You are a professional career coach and expert copywriter.
Rewrite the following cover letter using the provided rewrite instructions. If a job description is provided, tailor the rewritten cover letter to match it.

Original Cover Letter:
{{ cover_letter_content }}

Rewrite Instructions:
{{ instructions }}

{% if job_description %}
Target Job Description:
{{ job_description }}
{% endif %}

Instructions:
1. Incorporate the rewrite instructions precisely while keeping professional formatting intact.
2. Return response strictly as a JSON object matching the JSON schema below. Do not wrap the JSON block in markdown formatting or any other text; output raw JSON only.

JSON schema to return:
{
  "rewritten_content": "The full rewritten text of the cover letter..."
}"""
)
