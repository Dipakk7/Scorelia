import type {
  CoverLetterResponse,
  CoverLetterHistory,
  QualityScore,
  KeywordAnalysis,
  OptimizationSuggestion,
} from '@/types/cover-letter'
import type { ResumeResponse } from '@/types/resume'
import {
  type MockCoverLetterContent,
  type MockScoreBreakdown,
  type MockKeywordItem,
  type MockSmartSuggestion,
  mockCoverLetterVersions,
  mockScoreBreakdown,
  mockKeywordItems,
  mockSmartSuggestions,
} from './cover-letter-mock-data'

export interface AdaptedResumeOption {
  id: string
  title: string
  score: number
  updatedAt: string
}

/**
 * Safely adapts backend CoverLetterResponse into MockCoverLetterContent format for components.
 * NEVER returns null or undefined.
 */
export function adaptBackendCoverLetter(
  raw?: CoverLetterResponse | null
): MockCoverLetterContent {
  if (!raw) {
    return mockCoverLetterVersions[0]
  }

  const rawContent = raw.generated_content ?? ''
  const paragraphs = rawContent.split(/\n\n+/).filter(Boolean)

  const intro = paragraphs[0] ?? mockCoverLetterVersions[0].introParagraph
  const body1 = paragraphs[1] ?? mockCoverLetterVersions[0].bodyParagraph1
  const body2 = paragraphs[2] ?? mockCoverLetterVersions[0].bodyParagraph2
  const closing = paragraphs[3] ?? paragraphs[paragraphs.length - 1] ?? mockCoverLetterVersions[0].closingParagraph

  const atsScore = raw.metadata?.ats_score ?? 92

  return {
    id: raw.id ?? `cl-${Date.now()}`,
    versionNumber: 1,
    versionLabel: `Live Draft — ${raw.company_name ?? 'Target Company'}`,
    applicantName: 'Dipak Khandagale',
    applicantEmail: 'dipak@scorelia.ai',
    applicantPhone: '+1 (555) 019-2834',
    applicantLocation: 'Mountain View, CA',
    applicantWebsite: 'linkedin.com/in/dipakk',
    date: new Date(raw.created_at || Date.now()).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    recipientTitle: 'Hiring Manager',
    companyName: raw.company_name ?? 'Google',
    companyAddress: '1600 Amphitheatre Parkway, Mountain View, CA 94043',
    salutation: 'Dear Hiring Manager,',
    introParagraph: intro,
    bodyParagraph1: body1,
    bodyParagraph2: body2,
    closingParagraph: closing,
    signOff: 'Sincerely,\nDipak Khandagale',
    atsScore,
    wordCount: rawContent.split(/\s+/).filter(Boolean).length || 210,
    readabilityScore: 94,
    isFavorite: true,
    createdAt: 'Just now',
  }
}

/**
 * Safely adapts backend ResumeResponse array.
 * NEVER returns null or empty error.
 */
export function adaptBackendResumes(
  rawList?: ResumeResponse[] | null
): AdaptedResumeOption[] {
  const safeList = rawList ?? []
  if (safeList.length === 0) {
    return [
      { id: 'res-1', title: 'Dipak_Khandagale_AI_Engineer.pdf', score: 86, updatedAt: 'Updated 2 days ago' },
      { id: 'res-2', title: 'Software_Developer_Master.pdf', score: 82, updatedAt: 'Updated 1 week ago' },
    ]
  }

  return safeList.map((r, idx) => ({
    id: r.id ?? `res-${idx}`,
    title: r.original_filename ?? r.title ?? `Resume_${idx + 1}.pdf`,
    score: r.ats_score ?? 85,
    updatedAt: r.created_at ? `Updated ${new Date(r.created_at).toLocaleDateString()}` : 'Recent',
  }))
}

/**
 * Safely adapts backend score categories into MockScoreBreakdown.
 */
export function adaptBackendScoreBreakdown(
  quality?: QualityScore | null
): MockScoreBreakdown {
  if (!quality || !quality.category_scores) {
    return mockScoreBreakdown
  }

  const cat = quality.category_scores
  return {
    overallScore: quality.overall_score ?? 92,
    readability: cat.readability ?? 94,
    professionalTone: cat.professional_tone ?? 91,
    atsCompatibility: cat.ats ?? 89,
    grammar: cat.grammar ?? 98,
    structure: cat.structure ?? 93,
    keywordsMatch: cat.keyword_usage ?? 89,
    benchmarkText: `Top ${Math.max(1, 100 - (quality.overall_score ?? 90))}% of candidates`,
  }
}

/**
 * Safely adapts backend KeywordAnalysis into MockKeywordItem array.
 */
export function adaptBackendKeywords(
  analysis?: KeywordAnalysis | null
): MockKeywordItem[] {
  if (!analysis) {
    return mockKeywordItems
  }

  const matched = (analysis.matched_keywords ?? []).map((k) => ({
    name: k,
    status: 'matched' as const,
    relevance: 'High' as const,
  }))

  const missing = (analysis.missing_keywords ?? []).map((k) => ({
    name: k,
    status: 'missing' as const,
    relevance: 'Critical' as const,
  }))

  const combined = [...matched, ...missing]
  return combined.length > 0 ? combined : mockKeywordItems
}

/**
 * Safely adapts backend suggestions array into MockSmartSuggestion array.
 */
export function adaptBackendSuggestions(
  rawSuggestions?: OptimizationSuggestion[] | null
): MockSmartSuggestion[] {
  if (!rawSuggestions || rawSuggestions.length === 0) {
    return mockSmartSuggestions
  }

  return rawSuggestions.map((s, idx) => ({
    id: `sug-${idx + 1}`,
    category: 'Missing Achievements',
    title: s.reason || 'Optimization Suggestion',
    description: s.suggested_improvement || s.expected_benefit || 'Enhance formatting.',
    impactBadge: `+${s.estimated_ats_improvement || 5} Impact`,
    applied: false,
  }))
}
