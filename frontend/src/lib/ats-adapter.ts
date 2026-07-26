import type { ATSOverviewData } from './ats-mock-data'
import type { MetricItem } from './ats-mock-data'
import type { ATSCompatibilityItem } from './ats-mock-data'
import type {
  AIOverviewBannerData,
  PriorityRecommendationItem,
  RecruiterFeedbackData,
} from './ats-ai-mock-data'
import type { SectionDetailData, ResumeSectionNavItem } from './ats-section-mock-data'
import {
  mockAtsOverviewData,
  mockQuickMetrics,
  mockAtsCompatibility,
} from './ats-mock-data'
import {
  mockAiOverviewBanner,
  mockPriorityRecommendations,
  mockRecruiterFeedback,
} from './ats-ai-mock-data'
import { mockSectionsList, mockSectionDetailsMap } from './ats-section-mock-data'

/**
 * Safe Helper to safely get numeric score bounded between 0 and 100
 */
const safeScore = (val: any, fallback: number = 90): number => {
  if (typeof val === 'number' && !isNaN(val)) {
    return Math.min(Math.max(Math.round(val), 0), 100)
  }
  const parsed = parseFloat(val)
  if (!isNaN(parsed)) {
    return Math.min(Math.max(Math.round(parsed), 0), 100)
  }
  return fallback
}

/**
 * Helper to ensure a value is a valid object
 */
const safeObject = (val: any): Record<string, any> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val
  }
  return {}
}

/**
 * Transform live API response into ATSOverviewData
 */
export function transformToATSOverviewData(apiData: any, selectedResumeName?: string): ATSOverviewData {
  if (!apiData || (typeof apiData === 'object' && Object.keys(apiData).length === 0)) {
    return mockAtsOverviewData
  }

  const overall = safeScore(
    apiData?.overall_score ?? apiData?.ats_score ?? apiData?.score ?? apiData?.overall_ats_score,
    mockAtsOverviewData.overallScore
  )

  const raw = safeObject(apiData?.score_breakdown ?? apiData?.categories ?? apiData?.breakdown)

  const breakdown = [
    {
      label: 'Formatting',
      code: 'F',
      score: safeScore(raw.formatting ?? raw.format, 95),
      maxScore: 100,
      status: (raw.formatting ?? 95) >= 90 ? 'Excellent' : 'Very Good',
    },
    {
      label: 'Keywords',
      code: 'K',
      score: safeScore(raw.keywords ?? raw.keyword_match, 89),
      maxScore: 100,
      status: (raw.keywords ?? 89) >= 90 ? 'Excellent' : 'Very Good',
    },
    {
      label: 'Sections',
      code: 'S',
      score: safeScore(raw.sections ?? raw.structure, 92),
      maxScore: 100,
      status: (raw.sections ?? 92) >= 90 ? 'Excellent' : 'Very Good',
    },
    {
      label: 'Structure',
      code: 'Str',
      score: safeScore(raw.structure, 93),
      maxScore: 100,
      status: (raw.structure ?? 93) >= 90 ? 'Excellent' : 'Very Good',
    },
    {
      label: 'Readability',
      code: 'R',
      score: safeScore(raw.readability, 90),
      maxScore: 100,
      status: (raw.readability ?? 90) >= 90 ? 'Excellent' : 'Very Good',
    },
    {
      label: 'Parsing',
      code: 'P',
      score: safeScore(raw.parsing ?? raw.parser_accuracy, 94),
      maxScore: 100,
      status: (raw.parsing ?? 94) >= 90 ? 'Excellent' : 'Very Good',
    },
  ]

  return {
    overallScore: overall,
    maxScore: 100,
    status: overall >= 90 ? 'Excellent' : overall >= 80 ? 'Very Good' : 'Good',
    statusColor: overall >= 90 ? 'emerald' : 'purple',
    percentile: apiData?.percentile || `Top ${Math.max(100 - overall, 5)}% of candidates`,
    trend: apiData?.trend || '+5% from previous version',
    trendPositive: true,
    lastAnalyzed: apiData?.last_analyzed || new Date().toLocaleString(),
    scoreBreakdown: breakdown,
  }
}

/**
 * Transform live API response into QuickMetrics
 */
export function transformToQuickMetrics(apiData: any): MetricItem[] {
  if (!apiData || (typeof apiData === 'object' && Object.keys(apiData).length === 0)) {
    return mockQuickMetrics
  }

  return [
    {
      id: 'keyword-match',
      title: 'Keyword Match',
      category: 'Keywords',
      score: safeScore(apiData?.keyword_match_score ?? apiData?.keywords_score, 89),
      status: (apiData?.keyword_match_score ?? 89) >= 90 ? 'Excellent' : 'Very Good',
      statusType: (apiData?.keyword_match_score ?? 89) >= 90 ? 'excellent' : 'good',
      trend: '+4%',
      description: `${apiData?.keyword_match_percentage ?? 78}% of job description keywords present`,
    },
    {
      id: 'formatting',
      title: 'Formatting Score',
      category: 'Layout',
      score: safeScore(apiData?.formatting_score, 95),
      status: 'Excellent',
      statusType: 'excellent',
      trend: '+2%',
      description: 'Clean hierarchy, standard fonts & 0.5" margins',
    },
    {
      id: 'readability',
      title: 'Readability',
      category: 'Content',
      score: safeScore(apiData?.readability_score, 90),
      status: 'Very Good',
      statusType: 'good',
      trend: '+3%',
      description: 'Grade 11 reading level with strong action verbs',
    },
    {
      id: 'section-completeness',
      title: 'Section Completeness',
      category: 'Structure',
      score: safeScore(apiData?.section_completeness_score, 94),
      status: 'Excellent',
      statusType: 'excellent',
      trend: '0%',
      description: 'All 6 standard ATS section headings detected',
    },
    {
      id: 'skills-match',
      title: 'Skills Match',
      category: 'Technical',
      score: safeScore(apiData?.skills_match_score, 86),
      status: 'Very Good',
      statusType: 'good',
      trend: '+6%',
      description: '18 of 21 core technical competencies found',
    },
    {
      id: 'experience-quality',
      title: 'Experience Quality',
      category: 'Impact',
      score: safeScore(apiData?.experience_quality_score, 92),
      status: 'Excellent',
      statusType: 'excellent',
      trend: '+5%',
      description: '85% bullet points contain quantifiable metrics',
    },
  ]
}

/**
 * Transform live API response into ATS Compatibility Systems
 */
export function transformToATSCompatibility(apiData: any): ATSCompatibilityItem[] {
  if (!apiData || !apiData.compatibility_systems) return mockAtsCompatibility

  const systems = apiData.compatibility_systems
  if (Array.isArray(systems) && systems.length > 0) {
    return systems.map((sys: any, idx: number) => ({
      id: sys?.id || `sys-${idx}`,
      name: sys?.name || 'ATS Platform',
      score: safeScore(sys?.score, 90),
      status: (sys?.score ?? 90) >= 90 ? 'Excellent' : 'Very Good',
      logoBg: sys?.logoBg || 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      matchedFeatures: Array.isArray(sys?.features) ? sys.features : ['Standard font parsing', 'Date ISO'],
    }))
  }

  return mockAtsCompatibility
}

/**
 * Transform live API response into AI Overview Banner Data
 */
export function transformToAIOverviewBanner(apiData: any): AIOverviewBannerData {
  if (!apiData || (typeof apiData === 'object' && Object.keys(apiData).length === 0)) {
    return mockAiOverviewBanner
  }

  const overall = safeScore(apiData?.overall_score ?? apiData?.score, 92)

  return {
    readinessLevel: `${overall}% - ${overall >= 90 ? 'Production Ready' : 'Optimization Recommended'}`,
    readinessScore: overall,
    recruiterImpression: apiData?.recruiter_impression || `Highly Favorable (${(overall / 10).toFixed(1)} / 10)`,
    recruiterScore: safeScore(apiData?.recruiter_score, 94),
    passProbability: `${safeScore(apiData?.pass_probability, 95)}% ATS Pass Probability`,
    passScore: safeScore(apiData?.pass_probability, 95),
    summary:
      apiData?.summary ||
      apiData?.executive_summary ||
      mockAiOverviewBanner.summary,
  }
}

/**
 * Transform live API response into Priority Recommendations
 */
export function transformToPriorityRecommendations(apiData: any): PriorityRecommendationItem[] {
  if (!apiData) return mockPriorityRecommendations

  const rawRecs = apiData?.recommendations || apiData?.priority_recommendations || []
  if (Array.isArray(rawRecs) && rawRecs.length > 0) {
    return rawRecs.map((r: any, idx: number) => ({
      id: r?.id || `rec-live-${idx}`,
      priority: r?.priority === 'High' || r?.priority === 'Medium' || r?.priority === 'Low' ? r.priority : 'Medium',
      category: r?.category || 'Keywords',
      title: r?.title || 'Optimization Step',
      description: r?.description || r?.message || '',
      estimatedImpact: r?.estimated_impact || r?.impact || '+4 ATS Score',
      estimatedTime: r?.estimated_time || '5 mins',
      difficulty: r?.difficulty || 'Easy',
      details: Array.isArray(r?.details) ? r.details : [r?.description || 'Follow guidelines.'],
      completed: false,
    }))
  }

  return mockPriorityRecommendations
}

/**
 * Transform live API response into Recruiter Feedback Data
 */
export function transformToRecruiterFeedback(apiData: any): RecruiterFeedbackData {
  if (!apiData || !apiData.recruiter_feedback) return mockRecruiterFeedback

  const fb = safeObject(apiData.recruiter_feedback)
  return {
    firstImpression: fb.first_impression || mockRecruiterFeedback.firstImpression,
    strengths: Array.isArray(fb.strengths) ? fb.strengths : mockRecruiterFeedback.strengths,
    weaknesses: Array.isArray(fb.weaknesses) ? fb.weaknesses : mockRecruiterFeedback.weaknesses,
    recruiterNotes: fb.recruiter_notes || mockRecruiterFeedback.recruiterNotes,
    interviewReadiness: safeScore(fb.interview_readiness, 94),
    verdict: fb.verdict || mockRecruiterFeedback.verdict,
  }
}

/**
 * Transform live API response into Section List Navigation Items
 */
export function transformToSectionList(apiData: any): ResumeSectionNavItem[] {
  if (!apiData || !apiData.sections) return mockSectionsList

  const sec = apiData.sections
  if (Array.isArray(sec) && sec.length > 0) {
    return sec.map((s: any) => ({
      id: s?.id || `sec-${s?.name?.toLowerCase().replace(/\s+/g, '-')}`,
      name: s?.name || 'Section',
      score: safeScore(s?.score, 90),
      status: (s?.score ?? 90) >= 95 ? 'Excellent' : (s?.score ?? 90) >= 90 ? 'Pass' : 'Warning',
      issueCount: typeof s?.issues === 'number' ? s.issues : 0,
      category: s?.category || s?.name || 'Section',
    }))
  }

  return mockSectionsList
}

/**
 * Safe Section Details Map fallback
 */
export function transformToSectionDetailsMap(apiData: any): Record<string, SectionDetailData> {
  if (!apiData || !apiData.section_details) return mockSectionDetailsMap
  const rawDetails = safeObject(apiData.section_details)
  return { ...mockSectionDetailsMap, ...rawDetails }
}
