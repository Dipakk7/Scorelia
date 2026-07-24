export interface SectionIssue {
  id: string
  severity: 'Critical' | 'Warning' | 'Info'
  title: string
  description: string
  whyItMatters: string
}

export interface SectionRecommendation {
  id: string
  recommendation: string
  expectedScoreIncrease: number
  expectedAtsIncrease: number
  priority: 'High' | 'Medium' | 'Low'
  estimatedMinutes: number
}

export interface SectionRewrite {
  currentVersion: string
  aiImprovedVersion: string
  aiImprovedText?: string
  highlightedImprovements: string[]
}

export interface SectionATSAnalysis {
  keywordDensity: string
  missingKeywords: string[]
  sectionLengthStatus: 'Optimal' | 'Short' | 'Long'
  formattingScore: number
  atsCompatibilityScore: number
}

export interface SectionRecruiterAnalysis {
  wouldContinueReading: boolean
  estimatedReadingTimeSeconds: number
  overallImpressionText: string
  topStrength: string
  biggestConcern: string
}

export interface SectionImprovementTimeline {
  quickFixes: Array<{ title: string; minutes: number; scoreGain: number }>
  mediumFixes: Array<{ title: string; minutes: number; scoreGain: number }>
  majorFixes: Array<{ title: string; minutes: number; scoreGain: number }>
}

export interface SectionVersionItem {
  versionNumber: number
  versionLabel: string
  dateText: string
  changeSummary: string
  scoreAtVersion: number
}

export interface SectionAnalysisData {
  id: string
  sectionName: string
  score: number
  maxScore: number
  status: 'Excellent' | 'Good' | 'Needs Improvement'
  confidence: number
  trend: string
  strengths: string[]
  weaknesses: string[]
  atsImpact: string
  recruiterImpression: string
  writingQuality: string
  readabilityScore: number
  keywordCoverage: number
  completeness: number
  issuesFound: SectionIssue[]
  recommendations: SectionRecommendation[]
  rewritePreview: SectionRewrite
  atsAnalysis: SectionATSAnalysis
  recruiterAnalysis: SectionRecruiterAnalysis
  improvementTimeline: SectionImprovementTimeline
  versionHistory: SectionVersionItem[]
}

export const MOCK_SECTION_ANALYSIS_DATA: Record<string, SectionAnalysisData> = {
  'professional-summary': {
    id: 'professional-summary',
    sectionName: 'Professional Summary',
    score: 94,
    maxScore: 100,
    status: 'Excellent',
    confidence: 98,
    trend: '+6 pts',
    strengths: [
      'High-impact opening sentence with clear role definition',
      'Quantified years of experience (5+ years in ML engineering)',
      'Primary technical stack keywords featured prominently',
    ],
    weaknesses: [
      'Could highlight dollar values or revenue impact in addition to percentage metrics',
    ],
    atsImpact: 'High parseability rating with top keyword match density in summary.',
    recruiterImpression: 'Immediate clarity on candidate background and technical focus.',
    writingQuality: 'Executive level phrasing with active leadership verbs.',
    readabilityScore: 94,
    keywordCoverage: 96,
    completeness: 98,
    issuesFound: [
      {
        id: 'ps-i1',
        severity: 'Warning',
        title: 'Missing Revenue or Scalability Proof',
        description: 'Summary highlights efficiency percentages but omits system scale metrics.',
        whyItMatters: 'Executive recruiters evaluate candidates based on scale of systems managed.',
      },
    ],
    recommendations: [
      {
        id: 'ps-r1',
        recommendation: 'Add explicit GPU compute budget or daily user request numbers ($120k budget / 2M requests)',
        expectedScoreIncrease: 4,
        expectedAtsIncrease: 3,
        priority: 'High',
        estimatedMinutes: 2,
      },
    ],
    rewritePreview: {
      currentVersion:
        'Experienced Software Engineer with experience in Python and Machine Learning building AI models and web APIs.',
      aiImprovedVersion:
        'Senior AI & ML Engineer with 5+ years of experience building and scaling production LLM infrastructure, real-time inference APIs (FastAPI, PyTorch), and cloud pipelines. Reduced model latency by 42% while managing $120k GPU compute budgets.',
      aiImprovedText:
        'Senior AI & ML Engineer with 5+ years of experience building and scaling production LLM infrastructure, real-time inference APIs (FastAPI, PyTorch), and cloud pipelines. Reduced model latency by 42% while managing $120k GPU compute budgets.',
      highlightedImprovements: ['Added metric proof', 'Senior active verbs', 'Stack density'],
    },
    atsAnalysis: {
      keywordDensity: 'Optimal',
      missingKeywords: ['Triton'],
      sectionLengthStatus: 'Optimal',
      formattingScore: 98,
      atsCompatibilityScore: 96,
    },
    recruiterAnalysis: {
      wouldContinueReading: true,
      estimatedReadingTimeSeconds: 4,
      overallImpressionText: 'Strong summary statement that invites deeper reading.',
      topStrength: 'Clear seniority signal',
      biggestConcern: 'None',
    },
    improvementTimeline: {
      quickFixes: [{ title: 'Insert budget numbers', minutes: 2, scoreGain: 4 }],
      mediumFixes: [],
      majorFixes: [],
    },
    versionHistory: [
      {
        versionNumber: 1,
        versionLabel: 'Original Upload',
        dateText: '2 hours ago',
        changeSummary: 'Parsed initial summary draft',
        scoreAtVersion: 88,
      },
      {
        versionNumber: 2,
        versionLabel: 'AI Optimized',
        dateText: 'Just now',
        changeSummary: 'Applied executive rewrite',
        scoreAtVersion: 94,
      },
    ],
  },

  'work-experience': {
    id: 'work-experience',
    sectionName: 'Work Experience',
    score: 92,
    maxScore: 100,
    status: 'Excellent',
    confidence: 96,
    trend: '+4 pts',
    strengths: [
      'Strong action verbs at the start of every bullet point',
      '75% of bullets contain quantified metrics',
      'Logical reverse-chronological order with clear timeline',
    ],
    weaknesses: [
      '2 bullet points in earliest role exceed 3 lines in length',
    ],
    atsImpact: '100% parse rate across standard ATS resume parsers.',
    recruiterImpression: 'Clear career progression with increasing technical ownership.',
    writingQuality: 'Results-driven metric phrasing.',
    readabilityScore: 91,
    keywordCoverage: 94,
    completeness: 96,
    issuesFound: [
      {
        id: 'we-i1',
        severity: 'Warning',
        title: 'Long Bullet Paragraph',
        description: 'Work experience bullet point extends past 3 lines.',
        whyItMatters: 'Recruiters skim bullet points in 6 seconds; long blocks get skipped.',
      },
    ],
    recommendations: [
      {
        id: 'we-r1',
        recommendation: 'Split 3-line bullet point into two 1-2 line action statements.',
        expectedScoreIncrease: 3,
        expectedAtsIncrease: 2,
        priority: 'Medium',
        estimatedMinutes: 3,
      },
    ],
    rewritePreview: {
      currentVersion:
        'Worked on deep learning model training for image classification and deployed on servers.',
      aiImprovedVersion:
        'Architected and trained PyTorch ResNet & Transformer models achieving 96.4% precision; containerized and deployed via Docker/AWS EKS, serving 2M+ daily active requests.',
      aiImprovedText:
        'Architected and trained PyTorch ResNet & Transformer models achieving 96.4% precision; containerized and deployed via Docker/AWS EKS, serving 2M+ daily active requests.',
      highlightedImprovements: ['Quantified scale (2M+ requests)', 'Framework stack added'],
    },
    atsAnalysis: {
      keywordDensity: 'Optimal',
      missingKeywords: ['Kubernetes'],
      sectionLengthStatus: 'Optimal',
      formattingScore: 96,
      atsCompatibilityScore: 95,
    },
    recruiterAnalysis: {
      wouldContinueReading: true,
      estimatedReadingTimeSeconds: 12,
      overallImpressionText: 'Solid work experience history with clear deliverables.',
      topStrength: 'Measurable metric outcomes',
      biggestConcern: 'Bullet point length in early roles',
    },
    improvementTimeline: {
      quickFixes: [{ title: 'Split long bullet point', minutes: 3, scoreGain: 3 }],
      mediumFixes: [],
      majorFixes: [],
    },
    versionHistory: [
      {
        versionNumber: 1,
        versionLabel: 'Original Upload',
        dateText: '2 hours ago',
        changeSummary: 'Parsed initial work experience',
        scoreAtVersion: 88,
      },
    ],
  },
}

export default MOCK_SECTION_ANALYSIS_DATA
