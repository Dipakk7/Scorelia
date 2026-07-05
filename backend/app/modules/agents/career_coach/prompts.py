# app/modules/agents/career_coach/prompts.py

from app.ai.schemas.prompt_metadata import PromptTemplate, PromptMetadata

CAREER_COACH_ANALYZE_PROMPT = PromptTemplate(
    metadata=PromptMetadata(
        name="analyze",
        version="1.0.0",
        description="Career Coach Agent Profile Analysis Prompt",
        last_updated="2026-07-05",
        metadata={"category": "career_coach"}
    ),
    template_body="""You are an expert Career Coach. Analyze the user's career readiness, skill gaps, risks, and insights for their target role based on their profile and optional resume.

Target Role: {{ target_role }}
{% if experience_level %}Experience Level: {{ experience_level }}{% endif %}
{% if resume_json %}
Resume Profile Data:
{{ resume_json }}
{% endif %}

Instructions:
1. Assess the readiness of the user for the target role as a score from 0 to 100.
2. Formulate technical and soft skills match analysis.
3. Identify potential career transition risks and challenges.
4. Output actionable insights and guidance summary.
5. Return response strictly as a JSON object matching the JSON schema below. Do not wrap the JSON block in markdown formatting or any other text; output raw JSON only.

JSON schema to return:
{
  "readiness_score": 75,
  "technical_skills_analysis": {
    "matched": ["Skill A", "Skill B"],
    "missing": ["Skill C"]
  },
  "soft_skills_analysis": {
    "matched": ["Skill X"],
    "missing": ["Skill Y"]
  },
  "career_risks": ["Risk Description 1", "Risk Description 2"],
  "actionable_insights": ["Insight 1", "Insight 2"],
  "guidance_summary": "Detailed summary guidance..."
}"""
)

CAREER_COACH_PROGRESS_PROMPT = PromptTemplate(
    metadata=PromptMetadata(
        name="progress",
        version="1.0.0",
        description="Career Coach Agent Progress and Tracking Prompt",
        last_updated="2026-07-05",
        metadata={"category": "career_coach"}
    ),
    template_body="""You are an expert Career Coach. Evaluate the user's career roadmap progress, complete milestones tracking, next steps, and specific recommendations.

Target Role: {{ target_role }}
Total Milestones: {{ total_milestones }}
Completed Milestone Indices: {{ completed_milestones }}
Current Milestone Index: {{ current_milestone }}

Roadmap Milestones Details:
{{ milestones_details }}

Instructions:
1. Compute the progress completion percentage (0.0 to 100.0).
2. Detail the next steps required to unlock/advance the current milestone.
3. Provide tailored coach recommendations.
4. Return response strictly as a JSON object matching the JSON schema below. Do not wrap the JSON block in markdown formatting or any other text; output raw JSON only.

JSON schema to return:
{
  "completion_percentage": 50.0,
  "completed_milestones": [1],
  "current_milestone": 2,
  "next_steps": ["Step 1", "Step 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}"""
)

CAREER_COACH_WEEKLY_PLAN_PROMPT = PromptTemplate(
    metadata=PromptMetadata(
        name="weekly_plan",
        version="1.0.0",
        description="Career Coach Agent Weekly Study/Career Action Plan Prompt",
        last_updated="2026-07-05",
        metadata={"category": "career_coach"}
    ),
    template_body="""You are an expert Career Coach. Generate a highly detailed weekly action and study plan for Week {{ week_number }} of the user's career roadmap.

Target Role: {{ target_role }}
Roadmap Milestones:
{{ milestones_details }}

Instructions:
1. Define the week's key focus areas.
2. Outline 3-5 specific actionable tasks.
3. Estimate the total hours required.
4. Provide clear success criteria.
5. Return response strictly as a JSON object matching the JSON schema below. Do not wrap the JSON block in markdown formatting or any other text; output raw JSON only.

JSON schema to return:
{
  "week_number": {{ week_number }},
  "focus_areas": ["Focus Area 1", "Focus Area 2"],
  "tasks": ["Task 1", "Task 2"],
  "estimated_hours": 10,
  "success_criteria": ["Criteria 1", "Criteria 2"]
}"""
)

CAREER_COACH_MONTHLY_PLAN_PROMPT = PromptTemplate(
    metadata=PromptMetadata(
        name="monthly_plan",
        version="1.0.0",
        description="Career Coach Agent Monthly Milestone Study Plan Prompt",
        last_updated="2026-07-05",
        metadata={"category": "career_coach"}
    ),
    template_body="""You are an expert Career Coach. Generate a detailed monthly planning guide for Month {{ month_number }} of the user's career roadmap.

Target Role: {{ target_role }}
Roadmap Milestones:
{{ milestones_details }}

Instructions:
1. Detail the milestones alignment for this month.
2. Define the key focus areas.
3. Provide a weekly breakdown for the weeks in this month (Week 1 through Week 4).
4. Set the monthly goals.
5. Return response strictly as a JSON object matching the JSON schema below. Do not wrap the JSON block in markdown formatting or any other text; output raw JSON only.

JSON schema to return:
{
  "month_number": {{ month_number }},
  "milestones": ["Milestone A"],
  "key_focus": "Monthly Focus Area",
  "weekly_breakdown": {
    "Week 1": "Focus description...",
    "Week 2": "Focus description...",
    "Week 3": "Focus description...",
    "Week 4": "Focus description..."
  },
  "monthly_goals": ["Goal 1", "Goal 2"]
}"""
)
