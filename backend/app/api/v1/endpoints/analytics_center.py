from fastapi import APIRouter, Depends, status
from typing import Dict, Any
from datetime import datetime, timezone

from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.analytics_center import (
  AnalyticsOverviewResponse,
  PlatformActivityResponse,
  ActiveUsersResponse,
  TopFeaturesResponse,
  PerformanceResponse,
  SystemHealthResponse,
  ReportsDashboardResponse,
  ReportHistoryResponse,
  DataSourcesResponse,
  AIInsightsResponse,
  AnalyticsActivityResponse,
)

router = APIRouter()

@router.get(
  "/overview",
  response_model=AnalyticsOverviewResponse,
  status_code=status.HTTP_200_OK,
  summary="Get Executive Analytics Overview",
)
async def get_analytics_overview(current_user: User = Depends(get_current_user)):
  return {
    "success": True,
    "message": "Analytics overview fetched successfully",
    "timestamp": datetime.now(timezone.utc).isoformat(),
    "metrics": [
      {
        "id": "total_sessions",
        "title": "Total Sessions",
        "value": "124.8K",
        "numericValue": 124800,
        "unit": "sessions",
        "trend": "↑ 14.2%",
        "trendDirection": "up",
        "isPositive": True,
        "status": "healthy",
        "iconName": "Activity",
        "description": "Total platform interactive user sessions across all modules",
        "sparklineData": [42, 48, 55, 52, 68, 74, 82, 95, 110, 124.8],
      },
      {
        "id": "active_users",
        "title": "Active Users",
        "value": "18.4K",
        "numericValue": 18400,
        "unit": "users",
        "trend": "↑ 8.6%",
        "trendDirection": "up",
        "isPositive": True,
        "status": "healthy",
        "iconName": "Users",
        "description": "Unique monthly active candidates & recruiters",
        "sparklineData": [12, 13.2, 14, 14.8, 15.5, 16.2, 17, 17.8, 18.1, 18.4],
      },
      {
        "id": "tasks_completed",
        "title": "Tasks Completed",
        "value": "3,421",
        "numericValue": 3421,
        "unit": "tasks",
        "trend": "↑ 22.4%",
        "trendDirection": "up",
        "isPositive": True,
        "status": "healthy",
        "iconName": "CheckCircle2",
        "description": "Resumes analyzed, ATS scans, & interview drills completed",
        "sparklineData": [1800, 2100, 2350, 2600, 2800, 3050, 3200, 3421],
      },
      {
        "id": "success_rate",
        "title": "Success Rate",
        "value": "98.4%",
        "numericValue": 98.4,
        "unit": "%",
        "trend": "↑ 1.2%",
        "trendDirection": "up",
        "isPositive": True,
        "status": "healthy",
        "iconName": "TrendingUp",
        "description": "Percentage of successful candidate evaluations & AI runs",
        "sparklineData": [95.2, 96.0, 96.8, 97.1, 97.5, 98.0, 98.4],
      },
      {
        "id": "avg_time_saved",
        "title": "Avg. Time Saved",
        "value": "4.2 hrs",
        "numericValue": 4.2,
        "unit": "hours",
        "trend": "↑ 18.5%",
        "trendDirection": "up",
        "isPositive": True,
        "status": "healthy",
        "iconName": "Clock",
        "description": "Estimated time saved per resume & cover letter generation",
        "sparklineData": [2.5, 2.8, 3.1, 3.5, 3.8, 4.0, 4.2],
      },
      {
        "id": "satisfaction_score",
        "title": "Satisfaction Score",
        "value": "4.9 / 5.0",
        "numericValue": 4.9,
        "unit": "rating",
        "trend": "↑ 0.3",
        "trendDirection": "up",
        "isPositive": True,
        "status": "healthy",
        "iconName": "Sparkles",
        "description": "Aggregated user experience rating across completed workflows",
        "sparklineData": [4.5, 4.6, 4.7, 4.7, 4.8, 4.8, 4.9],
      },
    ],
  }

@router.get(
  "/platform-activity",
  response_model=PlatformActivityResponse,
  status_code=status.HTTP_200_OK,
  summary="Get Platform Activity Time Series",
)
async def get_platform_activity(current_user: User = Depends(get_current_user)):
  return {
    "success": True,
    "message": "Platform activity fetched successfully",
    "data": [
      {"date": "2025-05-11", "displayDate": "May 11", "sessions": 12400, "pageViews": 38200, "conversions": 840, "bounceRate": 24.2},
      {"date": "2025-05-12", "displayDate": "May 12", "sessions": 14200, "pageViews": 42100, "conversions": 980, "bounceRate": 22.8},
      {"date": "2025-05-13", "displayDate": "May 13", "sessions": 15800, "pageViews": 46800, "conversions": 1120, "bounceRate": 21.5},
      {"date": "2025-05-14", "displayDate": "May 14", "sessions": 16900, "pageViews": 51200, "conversions": 1280, "bounceRate": 20.4},
      {"date": "2025-05-15", "displayDate": "May 15", "sessions": 18200, "pageViews": 54900, "conversions": 1410, "bounceRate": 19.8},
      {"date": "2025-05-16", "displayDate": "May 16", "sessions": 19500, "pageViews": 58300, "conversions": 1560, "bounceRate": 18.9},
      {"date": "2025-05-17", "displayDate": "May 17", "sessions": 21400, "pageViews": 62400, "conversions": 1720, "bounceRate": 18.1},
    ],
  }

@router.get(
  "/active-users",
  response_model=ActiveUsersResponse,
  status_code=status.HTTP_200_OK,
  summary="Get Active Users Growth Time Series",
)
async def get_active_users(current_user: User = Depends(get_current_user)):
  return {
    "success": True,
    "message": "Active users growth fetched successfully",
    "data": [
      {"date": "2025-05-11", "displayDate": "May 11", "activeUsers": 14200, "newUsers": 1850, "returningUsers": 12350},
      {"date": "2025-05-12", "displayDate": "May 12", "activeUsers": 14900, "newUsers": 1920, "returningUsers": 12980},
      {"date": "2025-05-13", "displayDate": "May 13", "activeUsers": 15600, "newUsers": 2100, "returningUsers": 13500},
      {"date": "2025-05-14", "displayDate": "May 14", "activeUsers": 16300, "newUsers": 2240, "returningUsers": 14060},
      {"date": "2025-05-15", "displayDate": "May 15", "activeUsers": 17100, "newUsers": 2410, "returningUsers": 14690},
      {"date": "2025-05-16", "displayDate": "May 16", "activeUsers": 17800, "newUsers": 2550, "returningUsers": 15250},
      {"date": "2025-05-17", "displayDate": "May 17", "activeUsers": 18400, "newUsers": 2720, "returningUsers": 15680},
    ],
  }

@router.get(
  "/top-features",
  response_model=TopFeaturesResponse,
  status_code=status.HTTP_200_OK,
  summary="Get Top Features Usage Distribution",
)
async def get_top_features(current_user: User = Depends(get_current_user)):
  return {
    "success": True,
    "message": "Top features usage fetched successfully",
    "totalUsage": 3421,
    "data": [
      {"id": "feat_resume", "name": "Resume Builder & AI Optimizer", "usageCount": 1284, "percentage": 37.5, "color": "#a855f7"},
      {"id": "feat_ats", "name": "ATS Intelligence & Keyword Match", "usageCount": 942, "percentage": 27.5, "color": "#3b82f6"},
      {"id": "feat_interview", "name": "AI Interview Preparation Drills", "usageCount": 615, "percentage": 18.0, "color": "#10b981"},
      {"id": "feat_roadmap", "name": "Career Roadmap & Skill Analyzer", "usageCount": 380, "percentage": 11.1, "color": "#f59e0b"},
      {"id": "feat_cover_letter", "name": "Cover Letter AI Generator", "usageCount": 200, "percentage": 5.9, "color": "#ec4899"},
    ],
  }

@router.get(
  "/performance",
  response_model=PerformanceResponse,
  status_code=status.HTTP_200_OK,
  summary="Get Infrastructure Performance & Telemetry",
)
async def get_performance(current_user: User = Depends(get_current_user)):
  return {
    "success": True,
    "message": "Performance telemetry fetched successfully",
    "metrics": [
      {"id": "response_time", "title": "Avg. Response Time", "value": "1.32s", "numericValue": 1.32, "trend": "↓ 12.5%", "isPositive": True, "status": "healthy", "iconName": "Clock", "description": "Average latency across API endpoints", "comparisonLabel": "vs target 1.5s", "sparklineData": [1.6, 1.52, 1.48, 1.41, 1.38, 1.35, 1.32], "strokeColor": "#a855f7", "iconBg": "bg-purple-500/20 text-purple-400 border-purple-500/30"},
      {"id": "uptime", "title": "Platform Uptime", "value": "99.9%", "numericValue": 99.9, "trend": "↑ 0.1%", "isPositive": True, "status": "healthy", "iconName": "ShieldCheck", "description": "System operational availability percentage", "comparisonLabel": "vs last 30 days", "sparklineData": [99.7, 99.8, 99.8, 99.9, 99.9, 99.9, 99.9], "strokeColor": "#10b981", "iconBg": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"},
      {"id": "error_rate", "title": "Error Rate", "value": "0.12%", "numericValue": 0.12, "trend": "↓ 18.2%", "isPositive": True, "status": "healthy", "iconName": "AlertOctagon", "description": "HTTP 5xx and 4xx exception ratio", "comparisonLabel": "vs target <0.5%", "sparklineData": [0.22, 0.19, 0.18, 0.16, 0.14, 0.13, 0.12], "strokeColor": "#38bdf8", "iconBg": "bg-sky-500/20 text-sky-400 border-sky-500/30"},
      {"id": "api_success", "title": "API Success Rate", "value": "99.6%", "numericValue": 99.6, "trend": "↑ 1.3%", "isPositive": True, "status": "healthy", "iconName": "CheckCircle", "description": "Successful HTTP response ratio", "comparisonLabel": "vs last 30 days", "sparklineData": [98.2, 98.6, 98.9, 99.1, 99.3, 99.5, 99.6], "strokeColor": "#06b6d4", "iconBg": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"},
      {"id": "cpu_usage", "title": "CPU Usage", "value": "24%", "numericValue": 24, "trend": "↓ 4.1%", "isPositive": True, "status": "healthy", "iconName": "Cpu", "description": "Average cluster CPU load", "comparisonLabel": "vs 80% threshold", "sparklineData": [32, 29, 28, 26, 25, 25, 24], "strokeColor": "#6366f1", "iconBg": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"},
      {"id": "memory_usage", "title": "Memory Usage", "value": "42%", "numericValue": 42, "trend": "↑ 1.8%", "isPositive": True, "status": "healthy", "iconName": "HardDrive", "description": "Cluster RAM consumption ratio", "comparisonLabel": "vs 85% threshold", "sparklineData": [38, 39, 40, 41, 41, 42, 42], "strokeColor": "#ec4899", "iconBg": "bg-pink-500/20 text-pink-400 border-pink-500/30"},
      {"id": "queue_health", "title": "Queue Health", "value": "99.8%", "numericValue": 99.8, "trend": "↑ 0.5%", "isPositive": True, "status": "healthy", "iconName": "Layers", "description": "Message broker delivery success", "comparisonLabel": "vs 98% SLA", "sparklineData": [99.2, 99.4, 99.5, 99.6, 99.7, 99.8, 99.8], "strokeColor": "#14b8a6", "iconBg": "bg-teal-500/20 text-teal-400 border-teal-500/30"},
      {"id": "db_latency", "title": "Database Latency", "value": "14ms", "numericValue": 14, "trend": "↓ 8.3%", "isPositive": True, "status": "healthy", "iconName": "Database", "description": "Average SQL/NoSQL query roundtrip", "comparisonLabel": "vs target <30ms", "sparklineData": [18, 17, 16, 15, 15, 14, 14], "strokeColor": "#3b82f6", "iconBg": "bg-blue-500/20 text-blue-400 border-blue-500/30"},
    ],
    "responseTimeTrend": [
      {"date": "2025-05-11", "displayDate": "May 11", "responseTime": 1.62, "target": 1.5},
      {"date": "2025-05-12", "displayDate": "May 12", "responseTime": 1.54, "target": 1.5},
      {"date": "2025-05-13", "displayDate": "May 13", "responseTime": 1.48, "target": 1.5},
      {"date": "2025-05-14", "displayDate": "May 14", "responseTime": 1.41, "target": 1.5},
      {"date": "2025-05-15", "displayDate": "May 15", "responseTime": 1.38, "target": 1.5},
      {"date": "2025-05-16", "displayDate": "May 16", "responseTime": 1.35, "target": 1.5},
      {"date": "2025-05-17", "displayDate": "May 17", "responseTime": 1.32, "target": 1.5},
    ],
    "taskCompletionTrend": [
      {"date": "2025-04-20", "displayDate": "Apr 20 – Apr 26", "completed": 2150, "pending": 450, "failed": 85},
      {"date": "2025-04-27", "displayDate": "Apr 27 – May 3", "completed": 2480, "pending": 510, "failed": 92},
      {"date": "2025-05-04", "displayDate": "May 4 – May 10", "completed": 2980, "pending": 620, "failed": 110},
      {"date": "2025-05-11", "displayDate": "May 11 – May 17", "completed": 3421, "pending": 710, "failed": 125},
    ],
  }

@router.get(
  "/system-health",
  response_model=SystemHealthResponse,
  status_code=status.HTTP_200_OK,
  summary="Get System Health Services Status",
)
async def get_system_health(current_user: User = Depends(get_current_user)):
  return {
    "success": True,
    "message": "System health services fetched successfully",
    "data": [
      {"id": "api_gateway", "name": "API Gateway", "status": "healthy", "value": "18ms", "threshold": "< 50ms", "lastUpdated": "1m ago", "iconName": "Server"},
      {"id": "auth_service", "name": "Authentication", "status": "healthy", "value": "24ms", "threshold": "< 100ms", "lastUpdated": "1m ago", "iconName": "Shield"},
      {"id": "database", "name": "Database Cluster", "status": "healthy", "value": "14ms", "threshold": "< 30ms", "lastUpdated": "1m ago", "iconName": "Database"},
      {"id": "storage", "name": "Object Storage", "status": "healthy", "value": "45ms", "threshold": "< 150ms", "lastUpdated": "2m ago", "iconName": "HardDrive"},
      {"id": "queue", "name": "Queue Service", "status": "healthy", "value": "99.8%", "threshold": "> 98%", "lastUpdated": "1m ago", "iconName": "Layers"},
      {"id": "llm_service", "name": "LLM Orchestrator", "status": "warning", "value": "1.42s", "threshold": "< 1.5s", "lastUpdated": "1m ago", "iconName": "Bot"},
    ],
  }

@router.get(
  "/reports",
  response_model=ReportsDashboardResponse,
  status_code=status.HTTP_200_OK,
  summary="Get Reports Workspace Data",
)
async def get_reports_workspace(current_user: User = Depends(get_current_user)):
  return {
    "success": True,
    "message": "Reports workspace data fetched successfully",
    "overview": [
      {"id": "total_reports", "title": "Total Reports", "value": "128", "subtitle": "+12 this month", "iconName": "FileText", "iconBg": "bg-purple-500/20 text-purple-400 border-purple-500/30"},
      {"id": "scheduled_jobs", "title": "Scheduled Jobs", "value": "12", "subtitle": "4 running weekly", "iconName": "Calendar", "iconBg": "bg-blue-500/20 text-blue-400 border-blue-500/30"},
      {"id": "successful_exports", "title": "Export Success", "value": "98.4%", "subtitle": "vs 95% SLA", "iconName": "CheckCircle", "iconBg": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"},
      {"id": "storage_used", "title": "Storage Used", "value": "1.24 GB", "subtitle": "of 10 GB limit", "iconName": "HardDrive", "iconBg": "bg-[#a855f7]/20 text-indigo-400 border-indigo-500/30"},
      {"id": "generation_time", "title": "Avg Gen Time", "value": "2.4s", "subtitle": "↓ 0.6s vs last week", "iconName": "Clock", "iconBg": "bg-amber-500/20 text-amber-400 border-amber-500/30"},
      {"id": "report_success", "title": "Report Success Rate", "value": "99.2%", "subtitle": "127/128 completed", "iconName": "Target", "iconBg": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"},
    ],
    "templates": [
      {"id": "tmpl_exec", "name": "Executive Summary", "description": "Comprehensive multi-module KPI dashboard overview for leadership.", "category": "Executive", "estimatedGenerationTime": "~2.5s", "format": "PDF", "iconName": "FileText", "iconBg": "bg-purple-500/20 text-purple-400 border-purple-500/30"},
      {"id": "tmpl_ats", "name": "ATS Compliance Audit", "description": "Detailed candidate ATS compliance metrics, keyword gaps, and score distributions.", "category": "Compliance", "estimatedGenerationTime": "~1.8s", "format": "Excel", "iconName": "Scan", "iconBg": "bg-blue-500/20 text-blue-400 border-blue-500/30"},
      {"id": "tmpl_pipeline", "name": "Candidate Pipeline Trends", "description": "Funnel analytics tracking candidate progression and interview preparation readiness.", "category": "Pipeline", "estimatedGenerationTime": "~3.1s", "format": "PowerPoint", "iconName": "TrendingUp", "iconBg": "bg-pink-500/20 text-pink-400 border-pink-500/30"},
      {"id": "tmpl_perf", "name": "System Performance SLA", "description": "Infrastructure metrics audit including endpoint latency, uptime, and database queries.", "category": "Engineering", "estimatedGenerationTime": "~1.2s", "format": "JSON", "iconName": "Activity", "iconBg": "bg-teal-500/20 text-teal-400 border-teal-500/30"},
    ],
    "savedReports": [
      {"id": "rep_1", "name": "Q2 Executive Intelligence Digest", "createdAt": "2025-05-15", "lastUpdated": "2025-05-17", "owner": "Dipak Khandagale", "size": "4.2 MB", "status": "completed", "format": "PDF"},
      {"id": "rep_2", "name": "ATS Compliance & Keyword Audit", "createdAt": "2025-05-14", "lastUpdated": "2025-05-16", "owner": "Engineering Team", "size": "1.8 MB", "status": "completed", "format": "Excel"},
      {"id": "rep_3", "name": "Weekly System Performance SLA Report", "createdAt": "2025-05-12", "lastUpdated": "2025-05-15", "owner": "DevOps Automated", "size": "850 KB", "status": "completed", "format": "JSON"},
      {"id": "rep_4", "name": "Candidate Interview Preparedness Summary", "createdAt": "2025-05-10", "lastUpdated": "2025-05-11", "owner": "HR Analytics", "size": "12.4 MB", "status": "completed", "format": "PowerPoint"},
      {"id": "rep_5", "name": "Raw Telemetry Event Stream", "createdAt": "2025-05-08", "lastUpdated": "2025-05-09", "owner": "Dipak Khandagale", "size": "24.1 MB", "status": "completed", "format": "CSV"},
    ],
    "scheduledReports": [
      {"id": "sched_1", "name": "Weekly Executive Briefing", "frequency": "Weekly", "nextRun": "May 19, 2025 • 09:00 AM", "deliveryMethod": "Email PDF (Executive Board)", "enabled": True, "status": "queued"},
      {"id": "sched_2", "name": "Daily Infrastructure Health Audit", "frequency": "Daily", "nextRun": "May 18, 2025 • 00:00 AM", "deliveryMethod": "Slack Webhook (#eng-alerts)", "enabled": True, "status": "queued"},
      {"id": "sched_3", "name": "Monthly Candidate Pipeline Review", "frequency": "Monthly", "nextRun": "June 1, 2025 • 08:00 AM", "deliveryMethod": "Email PDF & Excel", "enabled": True, "status": "queued"},
      {"id": "sched_4", "name": "Bi-Weekly ATS Scoring Benchmark", "frequency": "Weekly", "nextRun": "May 22, 2025 • 10:00 AM", "deliveryMethod": "Email CSV Data", "enabled": False, "status": "cancelled"},
    ],
    "exportOptions": [
      {"id": "exp_pdf", "format": "PDF", "name": "Executive PDF Document", "description": "High-resolution vector report layout suitable for executive presentations.", "estimatedSize": "~4.5 MB", "compatibility": "Adobe Acrobat, All Browsers", "iconName": "FileText", "iconBg": "bg-purple-500/20 text-purple-400 border-purple-500/30"},
      {"id": "exp_xlsx", "format": "Excel", "name": "Microsoft Excel Spreadsheet", "description": "Multi-sheet workbook containing raw tabular data, formulas, and charts.", "estimatedSize": "~2.1 MB", "compatibility": "MS Excel, Google Sheets", "iconName": "FileSpreadsheet", "iconBg": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"},
      {"id": "exp_csv", "format": "CSV", "name": "Comma Separated Values", "description": "Lightweight plain-text matrix representation for data warehouse ingestion.", "estimatedSize": "~650 KB", "compatibility": "Python Pandas, BI Tools", "iconName": "Table", "iconBg": "bg-blue-500/20 text-blue-400 border-blue-500/30"},
      {"id": "exp_json", "format": "JSON", "name": "Structured JSON Payload", "description": "Fully typed schema dataset payload optimized for API integrations.", "estimatedSize": "~1.1 MB", "compatibility": "REST/GraphQL Clients", "iconName": "Code", "iconBg": "bg-amber-500/20 text-amber-400 border-amber-500/30"},
      {"id": "exp_pptx", "format": "PowerPoint", "name": "PowerPoint Presentation", "description": "Formatted slide deck template containing auto-generated charts & takeaways.", "estimatedSize": "~14.2 MB", "compatibility": "MS PowerPoint, Keynote", "iconName": "Presentation", "iconBg": "bg-pink-500/20 text-pink-400 border-pink-500/30"},
    ],
  }

@router.get(
  "/report-history",
  response_model=ReportHistoryResponse,
  status_code=status.HTTP_200_OK,
  summary="Get Report Generation Audit History",
)
async def get_report_history(current_user: User = Depends(get_current_user)):
  return {
    "success": True,
    "message": "Report history audit log fetched successfully",
    "data": [
      {"id": "hist_1", "name": "Q2 Executive Intelligence Digest", "status": "completed", "generatedAt": "2m ago", "duration": "2.4s", "format": "PDF", "initiatedBy": "Dipak Khandagale"},
      {"id": "hist_2", "name": "ATS Compliance & Keyword Audit", "status": "completed", "generatedAt": "15m ago", "duration": "1.8s", "format": "Excel", "initiatedBy": "Automated Job"},
      {"id": "hist_3", "name": "Raw Telemetry Event Stream", "status": "completed", "generatedAt": "1h ago", "duration": "3.6s", "format": "CSV", "initiatedBy": "Dipak Khandagale"},
      {"id": "hist_4", "name": "Daily Infrastructure Health Audit", "status": "completed", "generatedAt": "3h ago", "duration": "1.1s", "format": "JSON", "initiatedBy": "DevOps Scheduler"},
      {"id": "hist_5", "name": "Bi-Weekly ATS Benchmark", "status": "failed", "generatedAt": "1d ago", "duration": "0.8s", "format": "CSV", "initiatedBy": "Automated Job"},
    ],
  }

@router.get(
  "/data-sources",
  response_model=DataSourcesResponse,
  status_code=status.HTTP_200_OK,
  summary="Get Data Sources Health",
)
async def get_data_sources(current_user: User = Depends(get_current_user)):
  return {
    "success": True,
    "message": "Data sources health fetched successfully",
    "data": [
      {"id": "ds_postgres", "name": "PostgreSQL Relational DB", "status": "healthy", "records": "1,420,890", "lastSync": "1m ago", "health": 99.9, "latency": "14ms", "iconName": "Database"},
      {"id": "ds_chroma", "name": "ChromaDB Vector Store", "status": "healthy", "records": "482,100", "lastSync": "2m ago", "health": 99.8, "latency": "18ms", "iconName": "Layers"},
      {"id": "ds_ollama", "name": "Ollama LLM Orchestrator", "status": "healthy", "records": "128,450", "lastSync": "1m ago", "health": 99.5, "latency": "1.42s", "iconName": "Bot"},
      {"id": "ds_ats", "name": "Scorelia ATS Engine", "status": "healthy", "records": "342,100", "lastSync": "3m ago", "health": 99.9, "latency": "22ms", "iconName": "Scan"},
      {"id": "ds_parser", "name": "Resume AI Parser", "status": "healthy", "records": "89,200", "lastSync": "1m ago", "health": 99.7, "latency": "1.12s", "iconName": "FileText"},
      {"id": "ds_redis", "name": "Redis Analytics Cache", "status": "healthy", "records": "2,480,000", "lastSync": "Real-time", "health": 100.0, "latency": "2ms", "iconName": "Zap"},
    ],
  }

@router.get(
  "/insights",
  response_model=AIInsightsResponse,
  status_code=status.HTTP_200_OK,
  summary="Get AI Insights & Executive Recommendations",
)
async def get_ai_insights(current_user: User = Depends(get_current_user)):
  return {
    "success": True,
    "message": "AI insights fetched successfully",
    "insights": [
      {
        "id": "engagement_spike",
        "title": "User Engagement",
        "summary": "Engagement is 24% higher than last week across interactive modules.",
        "severity": "high",
        "severityBadgeText": "High",
        "category": "User Behavior",
        "confidence": 94,
        "timestamp": "10m ago",
        "iconName": "TrendingUp",
        "actionLabel": "View Breakdown",
      },
      {
        "id": "feature_growth",
        "title": "Feature Opportunity",
        "summary": "Career Roadmap usage is growing fast among senior candidates.",
        "severity": "medium",
        "severityBadgeText": "Medium",
        "category": "Feature Adoption",
        "confidence": 88,
        "timestamp": "25m ago",
        "iconName": "Sparkles",
        "actionLabel": "Explore Roadmap",
      },
      {
        "id": "system_performance",
        "title": "Performance",
        "summary": "System performance is optimal with average response latency at 1.32s.",
        "severity": "low",
        "severityBadgeText": "Good",
        "category": "Infrastructure",
        "confidence": 99,
        "timestamp": "1h ago",
        "iconName": "Zap",
        "actionLabel": "Check Uptime",
      },
      {
        "id": "retention_dip",
        "title": "Retention",
        "summary": "7-day retention dropped by 3% following recent UI navigation updates.",
        "severity": "critical",
        "severityBadgeText": "Watch",
        "category": "Retention",
        "confidence": 82,
        "timestamp": "2h ago",
        "iconName": "AlertTriangle",
        "actionLabel": "Audit Retention",
      },
    ],
    "recommendations": [
      {
        "id": "rec_interview",
        "title": "Optimize Mock Interview Feedback Loops",
        "description": "Streamline AI feedback latency to increase session completions.",
        "priority": "High",
        "estimatedImpact": "+18% Engagement",
        "timeToImplement": "2-3 days",
        "category": "User Retention",
      },
      {
        "id": "rec_ats",
        "title": "Expand ATS Keyword Parsing Models",
        "description": "Incorporate new tech stack tags for engineering job descriptions.",
        "priority": "Medium",
        "estimatedImpact": "+12% ATS Score Accuracy",
        "timeToImplement": "1 week",
        "category": "Intelligence",
      },
      {
        "id": "rec_cache",
        "title": "Enable RAG Knowledge Cache Pre-warming",
        "description": "Pre-cache top 100 domain queries to reduce retrieval latency.",
        "priority": "Low",
        "estimatedImpact": "-150ms Retrieval Latency",
        "timeToImplement": "1-2 days",
        "category": "Performance",
      },
    ],
  }

@router.get(
  "/activity",
  response_model=AnalyticsActivityResponse,
  status_code=status.HTTP_200_OK,
  summary="Get Analytics Activity Feed Timeline",
)
async def get_analytics_activity(current_user: User = Depends(get_current_user)):
  return {
    "success": True,
    "message": "Activity feed fetched successfully",
    "data": [
      {
        "id": "act_1",
        "title": "Resume analyzed",
        "description": "Senior Software Engineer resume parsed and scored 94/100.",
        "type": "resume",
        "status": "completed",
        "timestamp": "2m ago",
        "timeGroup": "Today",
        "actor": "AI Resume Engine",
        "iconName": "FileText",
        "iconBg": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      },
      {
        "id": "act_2",
        "title": "ATS report generated",
        "description": "Full compliance report generated for vacancy target #4092.",
        "type": "ats",
        "status": "completed",
        "timestamp": "5m ago",
        "timeGroup": "Today",
        "actor": "Scorelia ATS",
        "iconName": "Scan",
        "iconBg": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      },
      {
        "id": "act_3",
        "title": "Mock interview completed",
        "description": "System Architecture interview prep drill scored 89% STAR accuracy.",
        "type": "interview",
        "status": "completed",
        "timestamp": "12m ago",
        "timeGroup": "Today",
        "actor": "Interview Coach",
        "iconName": "UserCheck",
        "iconBg": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      },
      {
        "id": "act_4",
        "title": "Cover letter created",
        "description": "Targeted executive cover letter drafted for Lead Architect role.",
        "type": "cover_letter",
        "status": "completed",
        "timestamp": "18m ago",
        "timeGroup": "Today",
        "actor": "AI Letter Writer",
        "iconName": "MailOpen",
        "iconBg": "bg-amber-500/20 text-amber-400 border-amber-500/30",
      },
      {
        "id": "act_5",
        "title": "Roadmap updated",
        "description": "Distributed Systems learning track updated with 3 new milestones.",
        "type": "roadmap",
        "status": "completed",
        "timestamp": "25m ago",
        "timeGroup": "Today",
        "actor": "Career Planner",
        "iconName": "Map",
        "iconBg": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      },
    ],
  }
