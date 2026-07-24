import type {
  ResumeReviewResponse,
  ResumeOptimizationResponse,
  ResumeQualityScore,
  KeywordAnalysis,
} from '@/types/resume-intelligence'
import type { ResumeResponse } from '@/types/resume'
import type { BreakdownItem } from '@/components/resume-intelligence/ScoreBreakdownCard'
import type { RadarDataPoint } from '@/components/resume-intelligence/QualityRadarCard'
import type { KeywordCategoryItem } from '@/components/resume-intelligence/KeywordMatchCard'
import type { RoleBenchmarkData } from '@/components/resume-intelligence/CompetitorBenchmarkCard'
import type { MetricItem } from '@/components/resume-intelligence/MiniMetricCards'
import type { AIRecruiterSimulation, ATSWarningItem, AIRewriteSuggestion, AIRoadmapStep } from '@/lib/mock-ai-insights'
import type { SectionAnalysisData } from '@/lib/mock-section-analysis'

/**
 * 1. Overview Score Gauge Data Adapter
 */
export function transformToOverviewScore(
  review?: ResumeReviewResponse | null,
  optimization?: ResumeOptimizationResponse | null
) {
  const score = review?.overall_score ?? optimization?.quality_score?.overall_score ?? 92
  const statusText = score >= 90 ? 'Excellent' : score >= 80 ? 'Good' : 'Needs Improvement'
  const percentile = Math.min(99, Math.max(50, Math.round(score * 0.95)))

  return {
    score,
    maxScore: 100,
    statusText,
    percentileText: `Top ${100 - percentile}% of candidates`,
    headlineText:
      score >= 85
        ? "Your resume is performing great! 🎉"
        : "Your resume has high potential for optimization!",
    descriptionText:
      review?.overall_summary ||
      `You're in the top ${100 - percentile}% of candidates. Address the suggested improvements to reach the top 10%.`,
  }
}

/**
 * 2. Mini Trend Metrics Data Adapter
 */
export function transformToMiniMetrics(
  review?: ResumeReviewResponse | null,
  optimization?: ResumeOptimizationResponse | null
): MetricItem[] {
  const qs = optimization?.quality_score
  const atsScore = qs?.ats ?? 98
  const contentScore = qs?.readability ?? 88
  const recruiterScore = qs?.technical_skills ?? 91

  return [
    {
      id: 'score-change',
      value: '+12',
      label: 'Score Change',
      subtitle: 'vs last analysis',
      badgeText: '↑ +12 pts',
      badgeVariant: 'emerald',
      sparklineColor: '#10b981',
      trend: [72, 75, 78, 82, 85, review?.overall_score ?? 92],
    },
    {
      id: 'ats-friendly',
      value: `${atsScore}%`,
      label: 'ATS Friendly',
      subtitle: 'Parse Rate 100%',
      badgeText: atsScore >= 90 ? 'Excellent' : 'Good',
      badgeVariant: 'emerald',
      sparklineColor: '#10b981',
      trend: [90, 92, 95, 96, atsScore, atsScore],
    },
    {
      id: 'content-quality',
      value: `${contentScore}%`,
      label: 'Content Quality',
      subtitle: 'Action Verbs High',
      badgeText: contentScore >= 85 ? 'Very Good' : 'Good',
      badgeVariant: 'amber',
      sparklineColor: '#f59e0b',
      trend: [80, 82, 84, 85, 87, contentScore],
    },
    {
      id: 'recruiter-appeal',
      value: `${recruiterScore}%`,
      label: 'Recruiter Appeal',
      subtitle: 'Impact Density High',
      badgeText: recruiterScore >= 90 ? 'Excellent' : 'Good',
      badgeVariant: 'emerald',
      sparklineColor: '#10b981',
      trend: [82, 84, 87, 89, 90, recruiterScore],
    },
  ]
}

/**
 * 3. Score Breakdown Data Adapter
 */
export function transformToBreakdownItems(
  qs?: ResumeQualityScore | null
): BreakdownItem[] {
  return [
    {
      id: 'ats-compatibility',
      label: 'ATS Compatibility',
      score: qs?.ats ?? 98,
      maxScore: 100,
      statusText: 'Optimal',
      color: 'text-emerald-400',
      trackColor: 'from-emerald-500 to-teal-400',
    },
    {
      id: 'content-quality',
      label: 'Content Quality',
      score: qs?.readability ?? 88,
      maxScore: 100,
      statusText: 'Strong',
      color: 'text-purple-400',
      trackColor: 'from-purple-500 to-pink-500',
    },
    {
      id: 'readability',
      label: 'Readability & Flow',
      score: qs?.grammar ?? 89,
      maxScore: 100,
      statusText: 'Good',
      color: 'text-teal-400',
      trackColor: 'from-teal-500 to-cyan-400',
    },
    {
      id: 'skills-keywords',
      label: 'Skills & Keywords',
      score: qs?.technical_skills ?? 90,
      maxScore: 100,
      statusText: 'High Match',
      color: 'text-amber-400',
      trackColor: 'from-amber-500 to-orange-400',
    },
    {
      id: 'experience-impact',
      label: 'Experience & Impact',
      score: qs?.experience ?? 92,
      maxScore: 100,
      statusText: 'Quantified',
      color: 'text-indigo-400',
      trackColor: 'from-indigo-500 to-purple-500',
    },
    {
      id: 'projects-relevance',
      label: 'Project Relevance',
      score: qs?.projects ?? 91,
      maxScore: 100,
      statusText: 'Verified',
      color: 'text-sky-400',
      trackColor: 'from-sky-500 to-blue-500',
    },
    {
      id: 'education-certs',
      label: 'Education & Certs',
      score: qs?.completeness ?? 85,
      maxScore: 100,
      statusText: 'Standard',
      color: 'text-blue-400',
      trackColor: 'from-blue-500 to-indigo-400',
    },
    {
      id: 'structure-formatting',
      label: 'Formatting & Layout',
      score: qs?.formatting ?? 93,
      maxScore: 100,
      statusText: 'Clean',
      color: 'text-cyan-400',
      trackColor: 'from-cyan-500 to-sky-400',
    },
  ]
}

/**
 * 4. Quality Radar Chart Data Adapter
 */
export function transformToRadarData(
  qs?: ResumeQualityScore | null
): RadarDataPoint[] {
  return [
    {
      label: 'Content Quality',
      userScore: qs?.readability ?? 88,
      benchmarkScore: 96,
      description: 'Depth and clarity of achievements.',
      suggestion: 'Quantify 2 additional key metrics with percentages or dollar values.',
    },
    {
      label: 'ATS Optimization',
      userScore: qs?.ats ?? 98,
      benchmarkScore: 95,
      description: 'Parseability for ATS scanners.',
      suggestion: 'Exceeds benchmark standards. Keep current single-column hierarchy.',
    },
    {
      label: 'Structure & Formatting',
      userScore: qs?.formatting ?? 93,
      benchmarkScore: 94,
      description: 'Visual layout symmetry and spacing.',
      suggestion: 'Consolidate 1 long bullet into 2 succinct impact statements.',
    },
    {
      label: 'Skills & Keywords',
      userScore: qs?.technical_skills ?? 90,
      benchmarkScore: 98,
      description: 'Role-specific tech stack density.',
      suggestion: 'Add ML Ops, Kubernetes, and Model Deployment keywords.',
    },
    {
      label: 'Achievements Impact',
      userScore: qs?.experience ?? 91,
      benchmarkScore: 95,
      description: 'Action-verb starting power.',
      suggestion: 'Use stronger leadership verbs like Architected, Spearheaded.',
    },
    {
      label: 'Readability',
      userScore: qs?.grammar ?? 89,
      benchmarkScore: 92,
      description: 'Sentence length and clarity score.',
      suggestion: 'Slightly reduce technical jargon density in summary section.',
    },
  ]
}

/**
 * 5. Keyword Match Data Adapter
 */
export function transformToKeywordData(
  ka?: KeywordAnalysis | null
) {
  const matched = Array.isArray(ka?.matched_keywords) && ka.matched_keywords.length > 0
    ? ka.matched_keywords
    : ['PyTorch', 'TensorFlow', 'Python', 'FastAPI', 'Docker', 'AWS']
    
  const missing = Array.isArray(ka?.missing_keywords) && ka.missing_keywords.length > 0
    ? ka.missing_keywords
    : ['Kubernetes', 'Triton', 'gRPC']

  const total = (matched.length + missing.length) || 100
  const matchPercentage = Math.round((matched.length / total) * 100) || 78

  const categories: KeywordCategoryItem[] = [
    {
      category: 'AI & ML Core',
      matched: matched.filter((k) => ['pytorch', 'tensorflow', 'llm', 'nlp', 'python', 'scikit'].some((sub) => String(k).toLowerCase().includes(sub))),
      missing: missing.filter((k) => ['triton', 'vllm', 'langchain'].some((sub) => String(k).toLowerCase().includes(sub))),
    },
    {
      category: 'Backend & Cloud',
      matched: matched.filter((k) => ['fastapi', 'docker', 'aws', 'postgres', 'redis', 'rest'].some((sub) => String(k).toLowerCase().includes(sub))),
      missing: missing.filter((k) => ['kubernetes', 'grpc', 'terraform'].some((sub) => String(k).toLowerCase().includes(sub))),
    },
  ]

  // Ensure default keywords exist if filters yielded empty arrays
  if (categories[0].matched.length === 0) categories[0].matched = ['PyTorch', 'Python', 'TensorFlow']
  if (categories[0].missing.length === 0) categories[0].missing = ['Triton', 'vLLM']
  if (categories[1].matched.length === 0) categories[1].matched = ['FastAPI', 'Docker', 'AWS']
  if (categories[1].missing.length === 0) categories[1].missing = ['Kubernetes', 'gRPC']

  return {
    matchPercentage,
    matchedCount: matched.length,
    missingCount: missing.length,
    totalCount: total,
    categories,
  }
}

/**
 * 6. Content Insights Data Adapter
 */
export function transformToContentStats(
  resume?: ResumeResponse | null,
  optimization?: ResumeOptimizationResponse | null
) {
  const comp = optimization?.completeness
  const evaluatedCount = comp?.evaluated_sections ? Object.keys(comp.evaluated_sections).length : 9

  return {
    wordCount: 1248,
    charCount: 7420,
    readingTimeMinutes: 4.5,
    pageCount: 1.6,
    sectionCount: evaluatedCount,
    skillsCount: optimization?.keyword_optimization?.matched_keywords?.length || 28,
    experienceCount: 4,
    projectCount: 5,
  }
}

/**
 * 7. Competitor Benchmark Adapter
 */
export function transformToBenchmarkMap(
  optimization?: ResumeOptimizationResponse | null
): Record<string, RoleBenchmarkData> {
  const overall = optimization?.quality_score?.overall_score ?? 92

  return {
    'AI/ML Engineer': {
      role: 'AI/ML Engineer',
      userPercentile: 82,
      userScore: overall,
      averageScore: 74,
      totalCandidates: 14200,
    },
    'Full Stack Developer': {
      role: 'Full Stack Developer',
      userPercentile: 88,
      userScore: overall,
      averageScore: 71,
      totalCandidates: 32500,
    },
    'Data Scientist': {
      role: 'Data Scientist',
      userPercentile: 85,
      userScore: overall,
      averageScore: 73,
      totalCandidates: 18900,
    },
    'DevOps Specialist': {
      role: 'DevOps Specialist',
      userPercentile: 79,
      userScore: overall,
      averageScore: 76,
      totalCandidates: 11400,
    },
    'Product Manager': {
      role: 'Product Manager',
      userPercentile: 75,
      userScore: overall,
      averageScore: 78,
      totalCandidates: 9800,
    },
  }
}

/**
 * 8. AI Recruiter Simulation Adapter
 */
export function transformToRecruiterSimulation(
  review?: ResumeReviewResponse | null,
  optimization?: ResumeOptimizationResponse | null
): AIRecruiterSimulation {
  const rating = ((review?.overall_score ?? 92) / 20).toFixed(1)

  const strengthsList = Array.isArray(review?.strengths) && review.strengths.length > 0
    ? review.strengths.slice(0, 3)
    : [
        'Immediate clarity on ML engineering stack',
        'Demonstrated ownership of high-scale systems',
        'Strong academic baseline with clear project proof',
      ]

  const concernsList = Array.isArray(review?.weaknesses) && review.weaknesses.length > 0
    ? review.weaknesses.slice(0, 2)
    : [
        'Lacks explicit mention of cross-functional team leadership',
        'Could highlight budget or revenue impact more clearly',
      ]

  return {
    overallRating: parseFloat(rating),
    wouldInterviewPercentage: Math.min(98, Math.round((review?.overall_score ?? 92) * 0.95)),
    readingTimeSeconds: 22,
    toneRating: review?.career_feedback ? 'Executive Senior' : 'Senior Professional',
    sentiment: 'Very Positive',
    strengths: strengthsList,
    concerns: concernsList,
  }
}

/**
 * 9. ATS Risk Analysis Adapter
 */
export function transformToATSInfo(
  review?: ResumeReviewResponse | null,
  optimization?: ResumeOptimizationResponse | null
): ATSWarningItem[] {
  const missingKws = Array.isArray(optimization?.ats_optimization?.missing_keywords) && optimization.ats_optimization.missing_keywords.length > 0
    ? optimization.ats_optimization.missing_keywords
    : ['Kubernetes', 'Helm']

  const sectionsToImprove = Array.isArray(optimization?.ats_optimization?.sections_needing_improvement)
    ? optimization.ats_optimization.sections_needing_improvement
    : []

  const list: ATSWarningItem[] = []

  if (missingKws.length > 0) {
    list.push({
      id: 'ats-kw-risk',
      title: `Missing Critical Keywords (${missingKws.slice(0, 2).join(', ')})`,
      severity: 'Critical',
      explanation: `ATS scanner detected low keyword density for target role terms: ${missingKws.join(', ')}.`,
      recommendedFix: `Insert ${missingKws.slice(0, 2).join(' and ')} in your Skills or Experience section.`,
    })
  }

  if (sectionsToImprove.length > 0) {
    list.push({
      id: 'ats-sec-risk',
      title: `Formatting Risk in ${sectionsToImprove[0]}`,
      severity: 'Warning',
      explanation: `Section ${sectionsToImprove[0]} requires clearer bullet separation.`,
      recommendedFix: 'Re-format into standard bulleted action statements.',
    })
  } else {
    list.push({
      id: 'ats-bullet-risk',
      title: 'Bulleted Paragraph Over 3 Lines',
      severity: 'Warning',
      explanation: 'Long bullet points in Work Experience section lower overall readability score.',
      recommendedFix: 'Split into concise 1-2 line action statements.',
    })
  }

  list.push({
    id: 'ats-soft-risk',
    title: 'Generic Skill Terms Detected',
    severity: 'Info',
    explanation: 'Standalone buzzwords have lower ATS weighting than quantified results.',
    recommendedFix: 'Pair soft skills with specific project achievements.',
  })

  return list
}

/**
 * 10. AI Rewrite Suggestions Adapter
 */
export function transformToRewrites(
  optimization?: ResumeOptimizationResponse | null
): AIRewriteSuggestion[] {
  const ach = Array.isArray(optimization?.achievement_optimization)
    ? optimization.achievement_optimization
    : []

  if (ach.length > 0) {
    return ach.map((item, idx) => ({
      id: `rewrite-${idx}`,
      sectionName: idx === 0 ? 'Work Experience Bullet' : 'Achievement Statement',
      scoreBoost: parseInt(String(item.estimated_improvement)) || 5,
      originalText: item.original_bullet || '',
      aiImprovedText: item.suggested_bullet || '',
      rationale: item.reason || '',
    }))
  }

  return [
    {
      id: 'rw1',
      sectionName: 'Professional Summary',
      scoreBoost: 8,
      originalText:
        'Experienced Software Engineer with experience in Python and Machine Learning building AI models and web APIs for various client projects.',
      aiImprovedText:
        'Senior AI & ML Engineer with 5+ years of experience building and scaling production LLM infrastructure, real-time inference APIs (FastAPI, PyTorch), and cloud pipelines. Reduced model latency by 42% while managing $120k GPU compute budgets.',
      rationale: 'Replaced vague statements with quantified metrics, senior keywords, and business impact.',
    },
    {
      id: 'rw2',
      sectionName: 'Work Experience Bullet',
      scoreBoost: 5,
      originalText:
        'Worked on training deep learning models for image classification and deployed them on cloud servers for company application.',
      aiImprovedText:
        'Architected and trained PyTorch ResNet & Transformer models achieving 96.4% precision; containerized and deployed via Docker/AWS EKS, serving 2M+ daily active requests.',
      rationale: 'Added exact frameworks (PyTorch, Docker, EKS), precision metrics (96.4%), and request scale (2M+ daily).',
    },
  ]
}

/**
 * 11. AI Improvement Roadmap Adapter
 */
export function transformToRoadmap(
  review?: ResumeReviewResponse | null,
  optimization?: ResumeOptimizationResponse | null
): AIRoadmapStep[] {
  const recs = (Array.isArray(optimization?.recommendations) && optimization.recommendations.length > 0)
    ? optimization.recommendations
    : (Array.isArray(review?.priority_improvements) && review.priority_improvements.length > 0)
    ? review.priority_improvements
    : []

  if (recs.length > 0) {
    return recs.slice(0, 4).map((r: any, idx: number) => ({
      stepNumber: idx + 1,
      title: r.reason || r.type || `Optimize Step ${idx + 1}`,
      scoreGain: parseInt(String(r.estimated_improvement)) || 4,
      estimatedMinutes: idx * 2 + 3,
      category: r.section || 'General',
    }))
  }

  return [
    {
      stepNumber: 1,
      title: 'Optimize Professional Summary',
      scoreGain: 6,
      estimatedMinutes: 3,
      category: 'Summary',
    },
    {
      stepNumber: 2,
      title: 'Insert Critical Cloud & MLOps Keywords',
      scoreGain: 4,
      estimatedMinutes: 2,
      category: 'Keywords',
    },
    {
      stepNumber: 3,
      title: 'Quantify Work Experience Achievements',
      scoreGain: 5,
      estimatedMinutes: 5,
      category: 'Experience',
    },
    {
      stepNumber: 4,
      title: 'Refine Project Technical Descriptions',
      scoreGain: 3,
      estimatedMinutes: 4,
      category: 'Projects',
    },
  ]
}

/**
 * 12. Section Analysis Map Adapter
 */
export function transformToSectionMap(
  review?: ResumeReviewResponse | null,
  optimization?: ResumeOptimizationResponse | null
): Record<string, SectionAnalysisData> {
  const backendSections = review?.sections || {}
  const result: Record<string, SectionAnalysisData> = {}

  // Standard 10 section keys
  const sectionKeys = [
    'professional-summary',
    'work-experience',
    'skills',
    'projects',
    'education',
    'certifications',
    'languages',
    'achievements',
    'custom-sections',
    'references',
  ]

  sectionKeys.forEach((key) => {
    const bSec = backendSections[key] || backendSections[key.replace('-', '_')]
    const name = key.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const score = bSec?.score ?? 90

    const recsList = Array.isArray(bSec?.recommendations)
      ? bSec.recommendations.map((r, i) => ({
          id: `rec-${i}`,
          recommendation: r.suggested_fix || r.reason || '',
          expectedScoreIncrease: 4,
          expectedAtsIncrease: 5,
          priority: r.priority === 'HIGH' ? ('High' as const) : ('Medium' as const),
          estimatedMinutes: 3,
        }))
      : []

    result[key] = {
      id: key,
      sectionName: name,
      score,
      maxScore: 100,
      status: score >= 90 ? 'Excellent' : score >= 80 ? 'Good' : 'Needs Improvement',
      confidence: 96,
      trend: '+4 pts',
      strengths: [bSec?.feedback || `Well-formatted ${name} content with clear keywords`],
      weaknesses: recsList.map((r) => r.recommendation).filter(Boolean).length > 0
        ? recsList.map((r) => r.recommendation)
        : ['Could add additional metric proof'],
      atsImpact: `High parseability score for ${name}`,
      recruiterImpression: `Clean and professional ${name} presentation`,
      writingQuality: 'Executive level phrasing',
      readabilityScore: 92,
      keywordCoverage: 90,
      completeness: 95,
      issuesFound: [],
      recommendations: recsList,
      rewritePreview: {
        currentVersion: `Current ${name} draft details...`,
        aiImprovedVersion: `AI Improved ${name} content with optimized keywords and metrics.`,
        highlightedImprovements: ['Added metric proof', 'Optimized active verbs'],
      },
      atsAnalysis: {
        keywordDensity: 'Optimal',
        missingKeywords: [],
        sectionLengthStatus: 'Optimal',
        formattingScore: 95,
        atsCompatibilityScore: 94,
      },
      recruiterAnalysis: {
        wouldContinueReading: true,
        estimatedReadingTimeSeconds: 3,
        overallImpressionText: `Strong ${name} presentation.`,
        topStrength: 'Clear structure',
        biggestConcern: 'None',
      },
      improvementTimeline: {
        quickFixes: [{ title: `Optimize ${name} phrasing`, minutes: 3, scoreGain: 4 }],
        mediumFixes: [],
        majorFixes: [],
      },
      versionHistory: [
        { versionNumber: 1, versionLabel: 'Current Version', dateText: '2 mins ago', changeSummary: `Parsed ${name} content`, scoreAtVersion: score },
      ],
    }
  })

  return result
}
