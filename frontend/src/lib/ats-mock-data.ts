export interface ATSOverviewData {
  overallScore: number
  maxScore: number
  status: string
  statusColor: string
  percentile: string
  trend: string
  trendPositive: boolean
  lastAnalyzed: string
  scoreBreakdown: {
    label: string
    code: string
    score: number
    maxScore: number
    status: string
  }[]
}

export interface MetricItem {
  id: string
  title: string
  category: string
  score: number
  status: string
  statusType: 'excellent' | 'good' | 'warning' | 'error'
  trend: string
  description: string
}

export interface ATSCompatibilityItem {
  id: string
  name: string
  score: number
  status: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Needs Improvement'
  logoBg: string
  matchedFeatures: string[]
}

export interface KeywordItem {
  id: string
  keyword: string
  category: 'technical' | 'soft' | 'domain' | 'tool'
  frequency: number
  importance: 'High' | 'Medium' | 'Low'
  status: 'matched' | 'missing' | 'suggested'
}

export interface FormattingItem {
  id: string
  title: string
  value: string
  status: 'pass' | 'warning' | 'fail'
  message: string
  tip: string
}

export interface SectionScoreItem {
  id: string
  title: string
  score: number
  status: string
  statusType: 'excellent' | 'good' | 'warning'
  itemCount: number
  criteriaBreakdown: { name: string; score: number; maxScore: number }[]
  tips: string[]
}

export interface AIRecommendationItem {
  id: string
  priority: 'High' | 'Medium' | 'Low'
  title: string
  description: string
  estimatedImpact: string
  impactValue: number
  category: string
}

export const mockAtsOverviewData: ATSOverviewData = {
  overallScore: 92,
  maxScore: 100,
  status: 'Excellent',
  statusColor: 'emerald',
  percentile: 'Top 18% of candidates',
  trend: '+5% from previous version',
  trendPositive: true,
  lastAnalyzed: 'May 18, 2026 at 10:24 AM',
  scoreBreakdown: [
    { label: 'Formatting', code: 'F', score: 95, maxScore: 100, status: 'Excellent' },
    { label: 'Keywords', code: 'K', score: 89, maxScore: 100, status: 'Very Good' },
    { label: 'Sections', code: 'S', score: 92, maxScore: 100, status: 'Excellent' },
    { label: 'Structure', code: 'Str', score: 93, maxScore: 100, status: 'Excellent' },
    { label: 'Readability', code: 'R', score: 90, maxScore: 100, status: 'Very Good' },
    { label: 'Parsing', code: 'P', score: 94, maxScore: 100, status: 'Excellent' },
  ],
}

export const mockQuickMetrics: MetricItem[] = [
  {
    id: 'keyword-match',
    title: 'Keyword Match',
    category: 'Keywords',
    score: 89,
    status: 'Very Good',
    statusType: 'good',
    trend: '+4%',
    description: '78% of job description keywords present',
  },
  {
    id: 'formatting',
    title: 'Formatting Score',
    category: 'Layout',
    score: 95,
    status: 'Excellent',
    statusType: 'excellent',
    trend: '+2%',
    description: 'Clean hierarchy, standard fonts & 0.5" margins',
  },
  {
    id: 'readability',
    title: 'Readability',
    category: 'Content',
    score: 90,
    status: 'Very Good',
    statusType: 'good',
    trend: '+3%',
    description: 'Grade 11 reading level with strong action verbs',
  },
  {
    id: 'section-completeness',
    title: 'Section Completeness',
    category: 'Structure',
    score: 94,
    status: 'Excellent',
    statusType: 'excellent',
    trend: '0%',
    description: 'All 6 standard ATS section headings detected',
  },
  {
    id: 'skills-match',
    title: 'Skills Match',
    category: 'Technical',
    score: 86,
    status: 'Very Good',
    statusType: 'good',
    trend: '+6%',
    description: '18 of 21 core technical competencies found',
  },
  {
    id: 'experience-quality',
    title: 'Experience Quality',
    category: 'Impact',
    score: 92,
    status: 'Excellent',
    statusType: 'excellent',
    trend: '+5%',
    description: '85% bullet points contain quantifiable metrics',
  },
]

export const mockAtsCompatibility: ATSCompatibilityItem[] = [
  {
    id: 'workday',
    name: 'Workday',
    score: 95,
    status: 'Excellent',
    logoBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    matchedFeatures: ['Tableless layout', 'Standard font parsing', 'Date format ISO'],
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    score: 92,
    status: 'Excellent',
    logoBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    matchedFeatures: ['Custom section headers', 'PDF text extraction', 'Token matching'],
  },
  {
    id: 'lever',
    name: 'Lever',
    score: 90,
    status: 'Very Good',
    logoBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    matchedFeatures: ['Plain text fallback', 'Skill taxonomy mapping', 'Contact parser'],
  },
  {
    id: 'icims',
    name: 'iCIMS',
    score: 88,
    status: 'Very Good',
    logoBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    matchedFeatures: ['Multi-page parsing', 'Bullet formatting', 'Education index'],
  },
  {
    id: 'bamboohr',
    name: 'BambooHR',
    score: 87,
    status: 'Very Good',
    logoBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    matchedFeatures: ['Keyword frequency check', 'Job title alignment', 'Clean headers'],
  },
  {
    id: 'smartrecruiters',
    name: 'SmartRecruiters',
    score: 85,
    status: 'Good',
    logoBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    matchedFeatures: ['Experience timeline', 'Skills weight map', 'Standard font check'],
  },
]

export const mockKeywords: KeywordItem[] = [
  // Matched Keywords
  { id: 'k1', keyword: 'React', category: 'technical', frequency: 6, importance: 'High', status: 'matched' },
  { id: 'k2', keyword: 'TypeScript', category: 'technical', frequency: 5, importance: 'High', status: 'matched' },
  { id: 'k3', keyword: 'Node.js', category: 'technical', frequency: 4, importance: 'High', status: 'matched' },
  { id: 'k4', keyword: 'GraphQL', category: 'technical', frequency: 3, importance: 'Medium', status: 'matched' },
  { id: 'k5', keyword: 'Python', category: 'technical', frequency: 4, importance: 'High', status: 'matched' },
  { id: 'k6', keyword: 'Tailwind CSS', category: 'tool', frequency: 3, importance: 'Medium', status: 'matched' },
  { id: 'k7', keyword: 'Docker', category: 'tool', frequency: 2, importance: 'Medium', status: 'matched' },
  { id: 'k8', keyword: 'REST API', category: 'technical', frequency: 5, importance: 'High', status: 'matched' },
  { id: 'k9', keyword: 'Agile / Scrum', category: 'domain', frequency: 3, importance: 'Medium', status: 'matched' },
  { id: 'k10', keyword: 'Problem Solving', category: 'soft', frequency: 2, importance: 'Low', status: 'matched' },

  // Missing Keywords
  { id: 'k11', keyword: 'PyTorch', category: 'technical', frequency: 0, importance: 'High', status: 'missing' },
  { id: 'k12', keyword: 'Deep Learning', category: 'domain', frequency: 0, importance: 'High', status: 'missing' },
  { id: 'k13', keyword: 'Natural Language Processing', category: 'domain', frequency: 0, importance: 'High', status: 'missing' },
  { id: 'k14', keyword: 'TensorFlow', category: 'technical', frequency: 0, importance: 'Medium', status: 'missing' },
  { id: 'k15', keyword: 'Kubernetes', category: 'tool', frequency: 0, importance: 'Medium', status: 'missing' },
  { id: 'k16', keyword: 'Distributed Systems', category: 'domain', frequency: 0, importance: 'High', status: 'missing' },

  // Suggested Keywords
  { id: 'k17', keyword: 'System Architecture', category: 'domain', frequency: 0, importance: 'Medium', status: 'suggested' },
  { id: 'k18', keyword: 'Microservices', category: 'technical', frequency: 0, importance: 'Medium', status: 'suggested' },
  { id: 'k19', keyword: 'CI/CD Pipeline', category: 'tool', frequency: 0, importance: 'Medium', status: 'suggested' },
  { id: 'k20', keyword: 'Unit Testing (Jest / Vitest)', category: 'tool', frequency: 0, importance: 'High', status: 'suggested' },
]

export const mockFormattingAudit: FormattingItem[] = [
  {
    id: 'f1',
    title: 'File Type',
    value: 'PDF (.pdf)',
    status: 'pass',
    message: 'Standard PDF format with selectable plain text.',
    tip: 'Perfect! Always use text-based PDF files instead of image scans.',
  },
  {
    id: 'f2',
    title: 'Font Usage',
    value: 'Calibri / Inter',
    status: 'pass',
    message: 'ATS-friendly standard sans-serif font family.',
    tip: 'Recommended ATS fonts include Inter, Arial, Calibri, and Helvetica.',
  },
  {
    id: 'f3',
    title: 'Font Size',
    value: '10pt - 12pt',
    status: 'pass',
    message: 'Body text is 10.5pt, section headings are 14pt bold.',
    tip: 'Keep body text between 10-12pt and headings between 13-16pt.',
  },
  {
    id: 'f4',
    title: 'Page Margins',
    value: '0.5 inch',
    status: 'pass',
    message: 'Consistent 0.5" margin spacing on all 4 borders.',
    tip: 'Standard 0.5 to 1.0 inch margins ensure clean parsing.',
  },
  {
    id: 'f5',
    title: 'Headings Alignment',
    value: '6 Standard Headings',
    status: 'pass',
    message: 'Recognized headings: Summary, Experience, Education, Projects, Skills, Certifications.',
    tip: 'Avoid non-standard heading titles like "What I Do" or "My Background".',
  },
  {
    id: 'f6',
    title: 'Bullet Points',
    value: 'Consistent Disc',
    status: 'pass',
    message: 'Standard bullet characters used throughout.',
    tip: 'Do not use custom icon bullet characters or graphics.',
  },
  {
    id: 'f7',
    title: 'Section Order',
    value: 'Reverse Chronological',
    status: 'pass',
    message: 'Logical section flow suited for senior engineering roles.',
    tip: 'Header -> Summary -> Experience -> Skills -> Education is optimal.',
  },
  {
    id: 'f8',
    title: 'Contact Information',
    value: 'Formatted',
    status: 'warning',
    message: 'Phone number format (+1-xxx-xxx-xxxx) could be simplified.',
    tip: 'Ensure email, phone, LinkedIn, and GitHub links are clear plain text.',
  },
]

export const mockSectionScores: SectionScoreItem[] = [
  {
    id: 'sec-summary',
    title: 'Professional Summary',
    score: 95,
    status: 'Excellent',
    statusType: 'excellent',
    itemCount: 4,
    criteriaBreakdown: [
      { name: 'Role Title Alignment', score: 10, maxScore: 10 },
      { name: 'Core Competency Keywords', score: 9, maxScore: 10 },
      { name: 'Years of Experience', score: 10, maxScore: 10 },
      { name: 'Quantifiable Value Proposition', score: 9.5, maxScore: 10 },
    ],
    tips: ['Include 1-2 more target role keywords in the summary paragraph.'],
  },
  {
    id: 'sec-experience',
    title: 'Work Experience',
    score: 92,
    status: 'Excellent',
    statusType: 'excellent',
    itemCount: 12,
    criteriaBreakdown: [
      { name: 'Action Verbs Usage', score: 10, maxScore: 10 },
      { name: 'Quantifiable Metrics (% / $)', score: 8.5, maxScore: 10 },
      { name: 'Job Title Clarity', score: 10, maxScore: 10 },
      { name: 'Date Range Formatting', score: 9, maxScore: 10 },
    ],
    tips: ['Add metric results to the 2nd bullet point under Senior Frontend Engineer.'],
  },
  {
    id: 'sec-education',
    title: 'Education',
    score: 98,
    status: 'Excellent',
    statusType: 'excellent',
    itemCount: 2,
    criteriaBreakdown: [
      { name: 'Degree Name Parsing', score: 10, maxScore: 10 },
      { name: 'Institution Name', score: 10, maxScore: 10 },
      { name: 'Graduation Year Format', score: 9.5, maxScore: 10 },
    ],
    tips: ['Education section is perfectly structured and parsed.'],
  },
  {
    id: 'sec-projects',
    title: 'Key Projects',
    score: 88,
    status: 'Very Good',
    statusType: 'good',
    itemCount: 3,
    criteriaBreakdown: [
      { name: 'Tech Stack Tagging', score: 9, maxScore: 10 },
      { name: 'Live Link References', score: 8.5, maxScore: 10 },
      { name: 'Impact Description', score: 8.5, maxScore: 10 },
    ],
    tips: ['Specify technical architecture patterns used in the AI Search project.'],
  },
  {
    id: 'sec-skills',
    title: 'Technical & Soft Skills',
    score: 90,
    status: 'Very Good',
    statusType: 'good',
    itemCount: 18,
    criteriaBreakdown: [
      { name: 'Hard Skill Taxonomy', score: 9.5, maxScore: 10 },
      { name: 'Tooling & Libraries', score: 8.5, maxScore: 10 },
      { name: 'Soft Skills Balance', score: 9, maxScore: 10 },
    ],
    tips: ['Group skills into categories (Frontend, Backend, AI/ML, DevOps).'],
  },
  {
    id: 'sec-certifications',
    title: 'Certifications',
    score: 95,
    status: 'Excellent',
    statusType: 'excellent',
    itemCount: 3,
    criteriaBreakdown: [
      { name: 'Issuing Body Parsing', score: 10, maxScore: 10 },
      { name: 'Credential ID / URL', score: 9, maxScore: 10 },
    ],
    tips: ['Add expiration or issuance dates for all credentials.'],
  },
  {
    id: 'sec-languages',
    title: 'Languages',
    score: 100,
    status: 'Excellent',
    statusType: 'excellent',
    itemCount: 2,
    criteriaBreakdown: [
      { name: 'Proficiency Levels', score: 10, maxScore: 10 },
    ],
    tips: ['Section parsed with 100% accuracy.'],
  },
]

export const mockAiRecommendations: AIRecommendationItem[] = [
  {
    id: 'rec-1',
    priority: 'High',
    title: 'Add Missing Machine Learning Keywords',
    description: 'Include PyTorch, Deep Learning, and Distributed Systems to boost job match by up to 12%.',
    estimatedImpact: '+8 ATS',
    impactValue: 8,
    category: 'Keywords',
  },
  {
    id: 'rec-2',
    priority: 'High',
    title: 'Quantify Work Experience Achievements',
    description: 'Add specific percentage or revenue impact metrics to 2 bullet points in your current role.',
    estimatedImpact: '+5 ATS',
    impactValue: 5,
    category: 'Experience',
  },
  {
    id: 'rec-3',
    priority: 'Medium',
    title: 'Group Technical Skills by Domain',
    description: 'Structure skills into sub-categories (Frontend, Backend, AI/ML, Tools) for improved ATS token indexing.',
    estimatedImpact: '+4 ATS',
    impactValue: 4,
    category: 'Skills',
  },
  {
    id: 'rec-4',
    priority: 'Low',
    title: 'Standardize Phone Number Formatting',
    description: 'Use clean standard format "+1 (555) 019-2834" to prevent contact details parsing warnings.',
    estimatedImpact: '+2 ATS',
    impactValue: 2,
    category: 'Formatting',
  },
]

export const mockParserPreview = {
  parseSuccessRate: 97,
  originalPreviewText: `
DIPAK KHANDAGALE
AI/ML & Lead Full Stack Engineer
dipak.khandagale@scorelia.ai | +1 (555) 019-2834 | San Francisco, CA | github.com/Dipakk7

PROFESSIONAL SUMMARY
Results-driven AI/ML & Senior Full Stack Engineer with 6+ years of experience engineering scalable web applications, RAG pipelines, and intelligent AI career tools. Expert in React 19, TypeScript, Python, FastAPI, and PyTorch.

WORK EXPERIENCE
Lead AI Engineer | Scorelia Career Intelligence Inc. | 2024 - Present
• Engineered full-stack ATS analysis module increasing resume parsing accuracy to 98% across enterprise systems.
• Architected RAG vector search workspace using FastAPI, Qdrant, and LangChain handling 100k+ candidate profiles.

Senior Frontend Developer | TechScale Solutions | 2021 - 2024
• Led team of 5 engineers building responsive React applications with 99.9% uptime.
  `,
  parsedJsonOutput: {
    contact: {
      name: 'Dipak Khandagale',
      title: 'AI/ML & Lead Full Stack Engineer',
      email: 'dipak.khandagale@scorelia.ai',
      phone: '+1 (555) 019-2834',
      location: 'San Francisco, CA',
      github: 'github.com/Dipakk7',
    },
    sectionsDetected: ['SUMMARY', 'EXPERIENCE', 'EDUCATION', 'PROJECTS', 'SKILLS', 'CERTIFICATIONS'],
    parsedSkills: ['React 19', 'TypeScript', 'Python', 'FastAPI', 'PyTorch', 'RAG', 'Node.js', 'Docker', 'GraphQL'],
    parsedExperienceCount: 2,
    parseAccuracy: '97%',
  },
}

export const mockSidebarData = {
  analysisSummary: {
    totalChecks: 28,
    passedChecks: 25,
    warningChecks: 2,
    failedChecks: 1,
    overallGrade: 'A+',
  },
  recentReports: [
    { id: 'rep-1', date: 'Today, 10:24 AM', score: 92, target: 'Senior AI Engineer' },
    { id: 'rep-2', date: 'Yesterday, 4:15 PM', score: 88, target: 'Full Stack Architect' },
    { id: 'rep-3', date: 'May 12, 2026', score: 84, target: 'Principal Software Lead' },
  ],
  resources: [
    { title: 'ATS Formatting Best Practices Guide', link: '#' },
    { title: 'Top 50 High-Impact Action Verbs', link: '#' },
    { title: 'How Enterprise ATS Parsers Work', link: '#' },
  ],
}
