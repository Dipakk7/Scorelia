export interface AIStrengthItem {
  id: string
  title: string
  explanation: string
  confidence: number // e.g. 98
}

export interface AIPriorityRecommendation {
  id: string
  title: string
  priority: 'High' | 'Medium' | 'Low'
  impactText: string // e.g. "+6 ATS Score"
  explanation: string
  suggestedAction: string
}

export interface AIRecruiterSimulation {
  overallRating: number // e.g. 4.8 / 5.0
  wouldInterviewPercentage: number // e.g. 88
  readingTimeSeconds: number // e.g. 22
  toneRating: string // e.g. "Executive / Senior"
  sentiment: 'Very Positive' | 'Positive' | 'Neutral'
  strengths: string[]
  concerns: string[]
}

export interface ATSWarningItem {
  id: string
  title: string
  severity: 'Critical' | 'Warning' | 'Info'
  explanation: string
  recommendedFix: string
}

export interface AIRewriteSuggestion {
  id: string
  sectionName: string
  scoreBoost: number
  originalText: string
  aiImprovedText: string
  rationale: string
}

export interface AIRoadmapStep {
  stepNumber: number
  title: string
  scoreGain: number
  estimatedMinutes: number
  category: string
}

export const MOCK_AI_INSIGHTS_DATA = {
  strengths: [
    {
      id: 's1',
      title: 'Strong Technical Skills Match',
      explanation: 'Primary stack (PyTorch, Python, FastAPI) perfectly matches senior AI postings.',
      confidence: 98,
    },
    {
      id: 's2',
      title: 'Excellent ATS Parseability',
      explanation: 'Clean single-column structure with standard header tags.',
      confidence: 99,
    },
    {
      id: 's3',
      title: 'Quantified Impact Statements',
      explanation: '75% of work experience bullets contain measurable percentage & dollar metrics.',
      confidence: 94,
    },
    {
      id: 's4',
      title: 'Clear Professional Summary',
      explanation: 'High relevance hook highlighting 5+ years of production ML experience.',
      confidence: 95,
    },
    {
      id: 's5',
      title: 'Optimal Section Hierarchy',
      explanation: 'Proper order of Work Experience, Technical Skills, and Projects.',
      confidence: 96,
    },
  ] as AIStrengthItem[],

  priorityRecommendations: [
    {
      id: 'r1',
      title: 'Add Quantified Cloud Deployment Metrics',
      priority: 'High',
      impactText: '+6 ATS Score',
      explanation: 'Include specific numbers for API latency reductions or model deployment scale.',
      suggestedAction: 'Apply Auto-Fix',
    },
    {
      id: 'r2',
      title: 'Include Missing MLOps & Kubernetes Keywords',
      priority: 'High',
      impactText: '+4 ATS Score',
      explanation: 'Adding Kubernetes & Triton Inference Server will boost recruiter search visibility by 18%.',
      suggestedAction: 'Insert Keywords',
    },
    {
      id: 'r3',
      title: 'Strengthen Education Section Hierarchy',
      priority: 'Medium',
      impactText: '+3 ATS Score',
      explanation: 'Add relevant coursework or thesis title to highlight specialization.',
      suggestedAction: 'Edit Education',
    },
    {
      id: 'r4',
      title: 'Consolidate Multi-line Bullet Points',
      priority: 'Medium',
      impactText: '+3 Quality Score',
      explanation: '2 bullet points in experience section exceed 3 lines, slowing recruiter skim speed.',
      suggestedAction: 'Shorten Bullets',
    },
  ] as AIPriorityRecommendation[],

  recruiterImpression: {
    overallRating: 4.8,
    wouldInterviewPercentage: 88,
    readingTimeSeconds: 22,
    toneRating: 'Senior Executive',
    sentiment: 'Very Positive',
    strengths: [
      'Immediate clarity on ML engineering stack',
      'Demonstrated ownership of high-scale systems',
      'Strong academic baseline with clear project proof',
    ],
    concerns: [
      'Lacks explicit mention of cross-functional team leadership',
      'Could highlight budget or revenue impact more clearly',
    ],
  } as AIRecruiterSimulation,

  atsWarnings: [
    {
      id: 'w1',
      title: 'Missing MLOps & Infrastructure Keywords',
      severity: 'Critical',
      explanation: 'Scanners flagged low density for container orchestration tools (Kubernetes, Helm).',
      recommendedFix: 'Add Kubernetes and Docker containerization to Skills section.',
    },
    {
      id: 'w2',
      title: 'Bulleted Paragraph Over 3 Lines',
      severity: 'Warning',
      explanation: 'Long bullet in Senior AI Engineer role reduces readability score by 6 pts.',
      recommendedFix: 'Split into two 1-2 line action bullets starting with strong verbs.',
    },
    {
      id: 'w3',
      title: 'Generic Soft Skills Listed',
      severity: 'Info',
      explanation: 'Standalone terms like "Team Player" have low ATS weight.',
      recommendedFix: 'Integrate leadership terms into project accomplishment descriptions.',
    },
  ] as ATSWarningItem[],

  aiRewrites: [
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
  ] as AIRewriteSuggestion[],

  roadmap: [
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
  ] as AIRoadmapStep[],

  aiConfidence: {
    analysisConfidence: 96,
    atsConfidence: 98,
    keywordConfidence: 92,
    formattingConfidence: 95,
  },
}
