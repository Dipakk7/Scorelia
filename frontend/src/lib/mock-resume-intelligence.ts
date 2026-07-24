export interface IntelligenceMetric {
  id: string
  label: string
  score: number
  maxScore: number
  category: 'core' | 'content' | 'ats' | 'format'
  statusText: string
  color: string
  trackColor: string
}

export interface RadarDimension {
  label: string
  userScore: number
  benchmarkScore: number
  description: string
  suggestion: string
}

export interface KeywordCategory {
  category: string
  matched: string[]
  missing: string[]
}

export interface BenchmarkRoleData {
  role: string
  userPercentile: number
  userScore: number
  averageScore: number
  totalCandidates: number
  bellCurvePoints: Array<{ x: number; y: number }>
}

export interface ResumeStatsData {
  wordCount: number
  charCount: number
  readingTimeMinutes: number
  pageCount: number
  sectionCount: number
  skillsCount: number
  experienceCount: number
  projectCount: number
}

export const MOCK_RESUME_INTELLIGENCE_DATA = {
  overallScore: {
    score: 92,
    maxScore: 100,
    statusText: 'Excellent',
    percentileText: 'Top 18% of candidates',
    headlineText: "Your resume is performing great! 🎉",
    descriptionText:
      "You're in the top 18% of candidates. Address the suggested improvements to reach the top 10%.",
  },

  miniMetrics: [
    {
      id: 'score-change',
      value: '+12',
      label: 'Score Change',
      subtitle: 'vs last analysis',
      badgeText: '↑ +12 pts',
      badgeVariant: 'emerald' as const,
      sparklineColor: '#10b981',
      trend: [72, 75, 78, 82, 85, 92],
    },
    {
      id: 'ats-friendly',
      value: '98%',
      label: 'ATS Friendly',
      subtitle: 'Parse Rate 100%',
      badgeText: 'Excellent',
      badgeVariant: 'emerald' as const,
      sparklineColor: '#10b981',
      trend: [90, 92, 95, 96, 98, 98],
    },
    {
      id: 'content-quality',
      value: '88%',
      label: 'Content Quality',
      subtitle: 'Action Verbs 92%',
      badgeText: 'Very Good',
      badgeVariant: 'amber' as const,
      sparklineColor: '#f59e0b',
      trend: [80, 82, 84, 85, 87, 88],
    },
    {
      id: 'recruiter-appeal',
      value: '91%',
      label: 'Recruiter Appeal',
      subtitle: 'Impact Density High',
      badgeText: 'Excellent',
      badgeVariant: 'emerald' as const,
      sparklineColor: '#10b981',
      trend: [82, 84, 87, 89, 90, 91],
    },
  ],

  scoreBreakdown: [
    {
      id: 'ats-compatibility',
      label: 'ATS Compatibility',
      score: 98,
      maxScore: 100,
      category: 'ats' as const,
      statusText: 'Optimal',
      color: 'text-emerald-400',
      trackColor: 'from-emerald-500 to-teal-400',
    },
    {
      id: 'content-quality',
      label: 'Content Quality',
      score: 88,
      maxScore: 100,
      category: 'content' as const,
      statusText: 'Strong',
      color: 'text-purple-400',
      trackColor: 'from-purple-500 to-pink-500',
    },
    {
      id: 'readability',
      label: 'Readability & Flow',
      score: 89,
      maxScore: 100,
      category: 'content' as const,
      statusText: 'Good',
      color: 'text-teal-400',
      trackColor: 'from-teal-500 to-cyan-400',
    },
    {
      id: 'skills-keywords',
      label: 'Skills & Keywords',
      score: 90,
      maxScore: 100,
      category: 'core' as const,
      statusText: 'High Match',
      color: 'text-amber-400',
      trackColor: 'from-amber-500 to-orange-400',
    },
    {
      id: 'experience-impact',
      label: 'Experience & Impact',
      score: 92,
      maxScore: 100,
      category: 'core' as const,
      statusText: 'Quantified',
      color: 'text-indigo-400',
      trackColor: 'from-indigo-500 to-purple-500',
    },
    {
      id: 'projects-relevance',
      label: 'Project Relevance',
      score: 91,
      maxScore: 100,
      category: 'core' as const,
      statusText: 'Verified',
      color: 'text-sky-400',
      trackColor: 'from-sky-500 to-blue-500',
    },
    {
      id: 'education-certs',
      label: 'Education & Certs',
      score: 85,
      maxScore: 100,
      category: 'format' as const,
      statusText: 'Standard',
      color: 'text-blue-400',
      trackColor: 'from-blue-500 to-indigo-400',
    },
    {
      id: 'structure-formatting',
      label: 'Formatting & Layout',
      score: 93,
      maxScore: 100,
      category: 'format' as const,
      statusText: 'Clean',
      color: 'text-cyan-400',
      trackColor: 'from-cyan-500 to-sky-400',
    },
  ],

  radarDimensions: [
    {
      label: 'Content Quality',
      userScore: 88,
      benchmarkScore: 96,
      description: 'Depth and clarity of achievements and professional experience.',
      suggestion: 'Quantify 2 additional key metrics with percentages or dollar values.',
    },
    {
      label: 'ATS Optimization',
      userScore: 98,
      benchmarkScore: 95,
      description: 'Format, fonts, headers, and section parseability for scanners.',
      suggestion: 'Exceeds benchmark standards. Keep current single-column hierarchy.',
    },
    {
      label: 'Structure & Formatting',
      userScore: 93,
      benchmarkScore: 94,
      description: 'Visual symmetry, line spacing, font consistency, and bullet length.',
      suggestion: 'Consolidate 1 long bullet into 2 succinct impact statements.',
    },
    {
      label: 'Skills & Keywords',
      userScore: 90,
      benchmarkScore: 98,
      description: 'Presence of role-specific tech stack and methodology terms.',
      suggestion: 'Add ML Ops, Kubernetes, and Model Deployment keywords.',
    },
    {
      label: 'Achievements Impact',
      userScore: 91,
      benchmarkScore: 95,
      description: 'Action-verb starting power and measurable result metrics.',
      suggestion: 'Use stronger leadership verbs like Architected, Spearheaded.',
    },
    {
      label: 'Readability',
      userScore: 89,
      benchmarkScore: 92,
      description: 'Flesch-Kincaid readability score and sentence complexity.',
      suggestion: 'Slightly reduce technical jargon density in summary section.',
    },
  ],

  keywordAnalysis: {
    matchPercentage: 78,
    matchedCount: 78,
    missingCount: 22,
    totalCount: 100,
    categories: [
      {
        category: 'AI & ML Core',
        matched: ['PyTorch', 'TensorFlow', 'Transformers', 'LLMs', 'Scikit-learn', 'NLP'],
        missing: ['Triton', 'vLLM', 'LangChain'],
      },
      {
        category: 'Backend & Systems',
        matched: ['Python', 'FastAPI', 'Docker', 'PostgreSQL', 'REST APIs', 'Redis'],
        missing: ['Kubernetes', 'gRPC', 'Kafka'],
      },
      {
        category: 'Cloud & Infrastructure',
        matched: ['AWS', 'S3', 'EC2', 'Docker', 'CI/CD'],
        missing: ['Terraform', 'GCP Vertex AI'],
      },
      {
        category: 'Methodologies',
        matched: ['Agile', 'Git', 'Code Review', 'System Architecture'],
        missing: ['MLOps Pipeline', 'Model Monitoring'],
      },
    ],
  },

  resumeStats: {
    wordCount: 1248,
    charCount: 7420,
    readingTimeMinutes: 4.5,
    pageCount: 1.6,
    sectionCount: 9,
    skillsCount: 28,
    experienceCount: 4,
    projectCount: 5,
  },

  competitorBenchmark: {
    'AI/ML Engineer': {
      role: 'AI/ML Engineer',
      userPercentile: 82, // Top 18%
      userScore: 92,
      averageScore: 74,
      totalCandidates: 14200,
    },
    'Full Stack Developer': {
      role: 'Full Stack Developer',
      userPercentile: 88, // Top 12%
      userScore: 92,
      averageScore: 71,
      totalCandidates: 32500,
    },
    'Data Scientist': {
      role: 'Data Scientist',
      userPercentile: 85, // Top 15%
      userScore: 92,
      averageScore: 73,
      totalCandidates: 18900,
    },
    'DevOps Specialist': {
      role: 'DevOps Specialist',
      userPercentile: 79, // Top 21%
      userScore: 92,
      averageScore: 76,
      totalCandidates: 11400,
    },
    'Product Manager': {
      role: 'Product Manager',
      userPercentile: 75, // Top 25%
      userScore: 92,
      averageScore: 78,
      totalCandidates: 9800,
    },
  },
}
