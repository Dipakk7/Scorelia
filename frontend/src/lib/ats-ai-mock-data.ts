export interface AIOverviewBannerData {
  readinessLevel: string
  readinessScore: number
  recruiterImpression: string
  recruiterScore: number
  passProbability: string
  passScore: number
  summary: string
}

export interface PriorityRecommendationItem {
  id: string
  priority: 'High' | 'Medium' | 'Low'
  category: string
  title: string
  description: string
  estimatedImpact: string
  estimatedTime: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  details: string[]
  completed: boolean
}

export interface KeywordIntelligenceItem {
  id: string
  keyword: string
  category: 'matched' | 'missing' | 'high-priority' | 'industry' | 'trending'
  frequency: number
  relevance: number
  importance: 'High' | 'Medium' | 'Low'
}

export interface RecruiterFeedbackData {
  firstImpression: string
  strengths: string[]
  weaknesses: string[]
  recruiterNotes: string
  interviewReadiness: number
  verdict: string
}

export interface TimelineStepItem {
  id: string
  stepNumber: number
  title: string
  description: string
  estimatedTime: string
  status: 'completed' | 'in-progress' | 'pending'
  actionLabel: string
}

export interface RiskAnalysisItem {
  id: string
  severity: 'Critical' | 'Warning' | 'Minor' | 'Safe'
  title: string
  description: string
  suggestedFix: string
  estimatedImpact: string
}

export interface BenchmarkData {
  candidatePercentile: number
  benchmarks: {
    level: 'Junior' | 'Mid-Level' | 'Senior' | 'Top Candidates'
    score: number
    percentile: string
  }[]
  categoryComparison: {
    category: string
    candidateScore: number
    benchmarkScore: number
  }[]
}

export interface ReadinessChecklistItem {
  id: string
  label: string
  category: string
  completed: boolean
  description: string
}

export const mockAiOverviewBanner: AIOverviewBannerData = {
  readinessLevel: '92% - Production Ready',
  readinessScore: 92,
  recruiterImpression: 'Highly Favorable (9.4 / 10)',
  recruiterScore: 94,
  passProbability: '95% ATS Pass Probability',
  passScore: 95,
  summary:
    'Your resume demonstrates exceptional formatting structure, strong metric density (85%), and clear chronological hierarchy. Resolving 2 high-priority machine learning keyword gaps will elevate your ranking into the top 5% of enterprise applicants.',
}

export const mockPriorityRecommendations: PriorityRecommendationItem[] = [
  {
    id: 'rec-p1',
    priority: 'High',
    category: 'Keywords',
    title: 'Add Missing PyTorch & Deep Learning Keywords',
    description: 'Target job description explicitly prioritizes PyTorch and Deep Learning experience. Adding these tokens boosts keyword alignment by +8%.',
    estimatedImpact: '+8 ATS Score',
    estimatedTime: '5 mins',
    difficulty: 'Easy',
    details: [
      'Include "PyTorch" under Technical Skills -> AI/ML frameworks.',
      'Add bullet point in Experience section detailing PyTorch model training experience.',
      'Reference Deep Learning in the Professional Summary paragraph.',
    ],
    completed: false,
  },
  {
    id: 'rec-p2',
    priority: 'High',
    category: 'Experience',
    title: 'Quantify Scale & Latency Metrics in Lead Role',
    description: '2 bullet points in your Lead AI Engineer role lack explicit numerical metrics (e.g. latency reduction, user scale).',
    estimatedImpact: '+5 ATS Score',
    estimatedTime: '10 mins',
    difficulty: 'Medium',
    details: [
      'Change "Built RAG search workspace" to "Engineered RAG vector search workspace reducing query latency by 45% for 100k+ users."',
      'Quantify team leadership impact and cost efficiency savings.',
    ],
    completed: false,
  },
  {
    id: 'rec-p3',
    priority: 'Medium',
    category: 'Structure',
    title: 'Group Technical Skills into Taxonomy Categories',
    description: 'ATS parsers index categorized skills (Languages, Frameworks, AI/ML, Cloud/DevOps) 18% more accurately than plain comma lists.',
    estimatedImpact: '+4 ATS Score',
    estimatedTime: '8 mins',
    difficulty: 'Easy',
    details: [
      'Group skills into: Languages (TypeScript, Python), Frameworks (React, FastAPI, PyTorch), Cloud (AWS, Docker, Kubernetes).',
    ],
    completed: false,
  },
  {
    id: 'rec-p4',
    priority: 'Medium',
    category: 'Formatting',
    title: 'Standardize Contact Information Header',
    description: 'Ensure phone number (+1 (555) 019-2834) and GitHub URL are formatted as clean plain text.',
    estimatedImpact: '+3 ATS Score',
    estimatedTime: '3 mins',
    difficulty: 'Easy',
    details: ['Use plain text without special unicode icons in the header block.'],
    completed: false,
  },
  {
    id: 'rec-p5',
    priority: 'Low',
    category: 'Education',
    title: 'Include Relevant Coursework / Specializations',
    description: 'Adding Advanced Deep Learning & Distributed Systems coursework increases secondary token match.',
    estimatedImpact: '+2 ATS Score',
    estimatedTime: '4 mins',
    difficulty: 'Easy',
    details: ['List 3 relevant Computer Science graduate courses under Education.'],
    completed: false,
  },
]

export const mockKeywordIntelligence: KeywordIntelligenceItem[] = [
  // Matched
  { id: 'ki-1', keyword: 'React 19', category: 'matched', frequency: 6, relevance: 98, importance: 'High' },
  { id: 'ki-2', keyword: 'TypeScript', category: 'matched', frequency: 5, relevance: 95, importance: 'High' },
  { id: 'ki-3', keyword: 'Node.js', category: 'matched', frequency: 4, relevance: 90, importance: 'High' },
  { id: 'ki-4', keyword: 'FastAPI', category: 'matched', frequency: 4, relevance: 92, importance: 'High' },
  { id: 'ki-5', keyword: 'Python', category: 'matched', frequency: 5, relevance: 96, importance: 'High' },
  
  // Missing
  { id: 'ki-6', keyword: 'PyTorch', category: 'missing', frequency: 0, relevance: 94, importance: 'High' },
  { id: 'ki-7', keyword: 'Deep Learning', category: 'missing', frequency: 0, relevance: 91, importance: 'High' },
  { id: 'ki-8', keyword: 'Distributed Systems', category: 'missing', frequency: 0, relevance: 88, importance: 'High' },
  
  // High Priority
  { id: 'ki-9', keyword: 'RAG Architecture', category: 'high-priority', frequency: 3, relevance: 96, importance: 'High' },
  { id: 'ki-10', keyword: 'Vector Databases (Qdrant)', category: 'high-priority', frequency: 2, relevance: 93, importance: 'High' },

  // Industry
  { id: 'ki-11', keyword: 'Microservices', category: 'industry', frequency: 2, relevance: 85, importance: 'Medium' },
  { id: 'ki-12', keyword: 'CI/CD Pipelines', category: 'industry', frequency: 2, relevance: 82, importance: 'Medium' },

  // Trending
  { id: 'ki-13', keyword: 'AI Agents & Tool Calling', category: 'trending', frequency: 3, relevance: 95, importance: 'High' },
  { id: 'ki-14', keyword: 'LLM Fine-Tuning', category: 'trending', frequency: 1, relevance: 90, importance: 'Medium' },
]

export const mockRecruiterFeedback: RecruiterFeedbackData = {
  firstImpression: 'Strong Senior/Lead Candidate Profile',
  strengths: [
    'Exceptional technical breadth spanning AI/ML engineering and modern React/TypeScript frontend architecture.',
    'High metric density with clear business outcome metrics (% latency reduction, $ cost savings, user scale).',
    'Clean, professional layout with zero formatting flaws or parser warnings.',
  ],
  weaknesses: [
    'Could expand on distributed ML inference infrastructure details.',
    'Contact header phone format can be standardized for older ATS parsers.',
  ],
  recruiterNotes:
    'Candidate exhibits top 5% qualifications for Senior AI / Full-Stack Lead roles. Profile stands out immediately due to clear quantified impact and technical alignment.',
  interviewReadiness: 94,
  verdict: 'Recommended for Immediate Interview',
}

export const mockOptimizationTimeline: TimelineStepItem[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    title: 'Formatting Audit',
    description: 'Verify 0.5" margins, ATS fonts, and tableless layout.',
    estimatedTime: '2 mins',
    status: 'completed',
    actionLabel: 'Passed Audit',
  },
  {
    id: 'step-2',
    stepNumber: 2,
    title: 'Keyword Injection',
    description: 'Add PyTorch, Deep Learning & Distributed Systems keywords.',
    estimatedTime: '5 mins',
    status: 'in-progress',
    actionLabel: 'Inject Keywords',
  },
  {
    id: 'step-3',
    stepNumber: 3,
    title: 'Experience Quantification',
    description: 'Add percentage metrics and revenue scale to experience bullet points.',
    estimatedTime: '10 mins',
    status: 'pending',
    actionLabel: 'Quantify Bullets',
  },
  {
    id: 'step-4',
    stepNumber: 4,
    title: 'Projects Highlight',
    description: 'Align project architecture descriptions with target job role requirements.',
    estimatedTime: '8 mins',
    status: 'pending',
    actionLabel: 'Update Projects',
  },
  {
    id: 'step-5',
    stepNumber: 5,
    title: 'Skills Taxonomy',
    description: 'Group skills into Languages, Frameworks, Databases, and Tools.',
    estimatedTime: '5 mins',
    status: 'pending',
    actionLabel: 'Group Skills',
  },
  {
    id: 'step-6',
    stepNumber: 6,
    title: 'Final Review & Export',
    description: 'Re-run ATS simulation scanner and generate production PDF report.',
    estimatedTime: '2 mins',
    status: 'pending',
    actionLabel: 'Run Final Check',
  },
]

export const mockRiskAnalysis: RiskAnalysisItem[] = [
  {
    id: 'risk-1',
    severity: 'Warning',
    title: 'Missing Core Job Keyword: PyTorch',
    description: 'Target job description mentions PyTorch 4 times, but token is missing from your resume skills section.',
    suggestedFix: 'Add "PyTorch" to Technical Skills -> AI/ML Frameworks.',
    estimatedImpact: '+4 ATS Score',
  },
  {
    id: 'risk-2',
    severity: 'Warning',
    title: 'Phone Number International Formatting',
    description: 'Phone format "+1-555-019-2834" may cause parse warnings in legacy Workday parsers.',
    suggestedFix: 'Use clean standard format: "+1 (555) 019-2834".',
    estimatedImpact: '+2 ATS Score',
  },
  {
    id: 'risk-3',
    severity: 'Minor',
    title: 'Uncategorized Skills List',
    description: 'Skills listed as plain comma list rather than categorized sub-groups.',
    suggestedFix: 'Group into Languages, Frameworks, Cloud, and Tools.',
    estimatedImpact: '+2 ATS Score',
  },
  {
    id: 'risk-4',
    severity: 'Safe',
    title: 'Tableless PDF Structure',
    description: 'No HTML tables or graphic elements detected in PDF layout.',
    suggestedFix: 'None required (100% ATS Compliant).',
    estimatedImpact: 'Passed Check',
  },
]

export const mockIndustryBenchmark: BenchmarkData = {
  candidatePercentile: 92,
  benchmarks: [
    { level: 'Junior', score: 65, percentile: 'Top 70%' },
    { level: 'Mid-Level', score: 78, percentile: 'Top 45%' },
    { level: 'Senior', score: 86, percentile: 'Top 25%' },
    { level: 'Top Candidates', score: 92, percentile: 'Top 8%' },
  ],
  categoryComparison: [
    { category: 'Keyword Match', candidateScore: 89, benchmarkScore: 82 },
    { category: 'Formatting', candidateScore: 95, benchmarkScore: 88 },
    { category: 'Readability', candidateScore: 90, benchmarkScore: 84 },
    { category: 'Experience Quality', candidateScore: 92, benchmarkScore: 80 },
    { category: 'Section Structure', candidateScore: 94, benchmarkScore: 86 },
  ],
}

export const mockAtsChecklist: ReadinessChecklistItem[] = [
  { id: 'chk-1', label: 'Contact Information & Plain Text Links', category: 'Header', completed: true, description: 'Email, phone, location, and GitHub profile' },
  { id: 'chk-2', label: 'Professional Summary Paragraph', category: 'Summary', completed: true, description: 'Role alignment and value proposition' },
  { id: 'chk-3', label: 'Standard ATS Section Headings', category: 'Structure', completed: true, description: 'Summary, Experience, Education, Skills, Projects' },
  { id: 'chk-4', label: 'High-Impact Target Keywords', category: 'Keywords', completed: false, description: 'PyTorch, Deep Learning, Distributed Systems' },
  { id: 'chk-5', label: 'Quantified Bullet Points (% / $)', category: 'Experience', completed: true, description: '85% bullet points contain metrics' },
  { id: 'chk-6', label: 'Categorized Skills Taxonomy', category: 'Skills', completed: false, description: 'Categorized by Frameworks, Languages, Tools' },
  { id: 'chk-7', label: 'Text-Selectable PDF File Format', category: 'Formatting', completed: true, description: 'Vector PDF with 0.5" margins' },
]

export const mockAiSidebarData = {
  aiSummary: {
    healthScore: 92,
    readinessTag: 'Production Ready',
    topStrength: 'Metric Density & Formatting',
    keyFocusArea: 'Machine Learning Keywords',
  },
  quickTips: [
    'Tailor keywords for each specific job application to gain +5-10% ATS match.',
    'Keep resume length to 2 pages for senior roles with 5+ years experience.',
    'Use active power verbs (Engineered, Architected, Spearheaded) for every bullet.',
  ],
  recentRecommendations: [
    { title: 'Added PyTorch to Skills', status: 'Completed', gain: '+4 ATS' },
    { title: 'Quantified Latency Metric', status: 'Completed', gain: '+3 ATS' },
    { title: 'Standardized Margins', status: 'Completed', gain: '+2 ATS' },
  ],
}
