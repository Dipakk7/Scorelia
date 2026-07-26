export type AgentStatus = 'active' | 'paused' | 'running' | 'offline' | 'error' | 'queued'

export interface AgentActivityItem {
  id: string
  action: string
  timestamp: string
  type: 'success' | 'info' | 'warning' | 'error'
}

export interface AgentConsoleItem {
  id: string
  name: string
  category: string
  description: string
  status: AgentStatus
  tasksCompleted: number
  successRate: number
  avgResponseTime: string
  creditsUsed: number
  lastActive: string
  iconBg: string
  capabilities: string[]
  tags: string[]
  recentActivity: AgentActivityItem[]
}

export const mockAgentsData: AgentConsoleItem[] = [
  {
    id: 'resume-assistant',
    name: 'Resume Assistant',
    category: 'Optimization',
    description: 'Helps with resume optimization, keyword tailoring, and formatting.',
    status: 'active',
    tasksCompleted: 312,
    successRate: 98.1,
    avgResponseTime: '0.84s',
    creditsUsed: 624,
    lastActive: '2m ago',
    iconBg: 'bg-purple-600',
    capabilities: ['ATS Optimization', 'Keyword Extraction', 'Bullet Point Enhancement', 'PDF Parsing'],
    tags: ['Resume', 'ATS', 'Core'],
    recentActivity: [
      { id: 'act-1', action: 'Analyzed resume for Senior Software Engineer', timestamp: '2m ago', type: 'success' },
      { id: 'act-2', action: 'Generated 5 high-impact bullet points', timestamp: '15m ago', type: 'success' },
      { id: 'act-3', action: 'Completed ATS match score evaluation (94%)', timestamp: '1h ago', type: 'info' }
    ]
  },
  {
    id: 'ats-optimizer',
    name: 'ATS Optimizer',
    category: 'Analysis',
    description: 'Improves ATS compatibility and parses layout structure.',
    status: 'active',
    tasksCompleted: 265,
    successRate: 96.2,
    avgResponseTime: '1.12s',
    creditsUsed: 530,
    lastActive: '5m ago',
    iconBg: 'bg-blue-600',
    capabilities: ['Parse Tree Audit', 'Section Label Matching', 'Font Compliance', 'Margin Verification'],
    tags: ['ATS', 'Compliance'],
    recentActivity: [
      { id: 'act-4', action: 'Scanned candidate document against Workday ATS rules', timestamp: '5m ago', type: 'success' },
      { id: 'act-5', action: 'Flagged non-standard table formatting in Education section', timestamp: '45m ago', type: 'warning' }
    ]
  },
  {
    id: 'interview-coach',
    name: 'Interview Coach',
    category: 'Preparation',
    description: 'Provides mock interview preparation, behavioral questions, and feedback.',
    status: 'running',
    tasksCompleted: 198,
    successRate: 94.9,
    avgResponseTime: '1.45s',
    creditsUsed: 396,
    lastActive: '7m ago',
    iconBg: 'bg-cyan-600',
    capabilities: ['STAR Method Evaluator', 'System Design Simulator', 'Behavioral Question Bank'],
    tags: ['Interview', 'Coaching'],
    recentActivity: [
      { id: 'act-6', action: 'Conducting live mock interview for Engineering Manager role', timestamp: '7m ago', type: 'info' },
      { id: 'act-7', action: 'Generated feedback report on Leadership principles', timestamp: '2h ago', type: 'success' }
    ]
  },
  {
    id: 'cover-letter-writer',
    name: 'Cover Letter Writer',
    category: 'Generation',
    description: 'Generates highly tailored cover letters targeting specific job descriptions.',
    status: 'active',
    tasksCompleted: 176,
    successRate: 97.2,
    avgResponseTime: '1.03s',
    creditsUsed: 352,
    lastActive: '12m ago',
    iconBg: 'bg-emerald-600',
    capabilities: ['Tone Adjustment', 'Company Research Synthesis', 'Personalization Engine'],
    tags: ['CoverLetter', 'Writing'],
    recentActivity: [
      { id: 'act-8', action: 'Drafted tailored cover letter for Google Lead Developer position', timestamp: '12m ago', type: 'success' }
    ]
  },
  {
    id: 'career-advisor',
    name: 'Career Advisor',
    category: 'Guidance',
    description: 'Provides strategic career guidance, skill gap analysis, and progression paths.',
    status: 'active',
    tasksCompleted: 142,
    successRate: 93.0,
    avgResponseTime: '1.67s',
    creditsUsed: 284,
    lastActive: '18m ago',
    iconBg: 'bg-amber-600',
    capabilities: ['Career Roadmap Generation', 'Salary Benchmark Lookup', 'Skill Matrix Alignment'],
    tags: ['Strategy', 'Roadmap'],
    recentActivity: [
      { id: 'act-9', action: 'Mapped 12-month transition path to Principal AI Architect', timestamp: '18m ago', type: 'success' }
    ]
  },
  {
    id: 'rag-agent',
    name: 'RAG Agent',
    category: 'Knowledge Base',
    description: 'Searches internal vector knowledge base for relevant domain citations.',
    status: 'active',
    tasksCompleted: 98,
    successRate: 92.3,
    avgResponseTime: '1.56s',
    creditsUsed: 196,
    lastActive: '22m ago',
    iconBg: 'bg-indigo-600',
    capabilities: ['Vector Index Search', 'Hybrid BM25 Retrieval', 'Citation Verification'],
    tags: ['RAG', 'VectorDB'],
    recentActivity: [
      { id: 'act-10', action: 'Indexed 12 new career whitepapers into Pinecone vector index', timestamp: '22m ago', type: 'success' }
    ]
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    category: 'Analytics',
    description: 'Analyzes career performance metrics and application conversion rates.',
    status: 'paused',
    tasksCompleted: 57,
    successRate: 88.1,
    avgResponseTime: '2.42s',
    creditsUsed: 114,
    lastActive: '1h ago',
    iconBg: 'bg-orange-600',
    capabilities: ['Funnel Telemetry Analysis', 'Cohort Retention Modeling', 'Response Rate Forecasting'],
    tags: ['Analytics', 'Telemetry'],
    recentActivity: [
      { id: 'act-11', action: 'Agent paused by user due to scheduled maintenance window', timestamp: '1h ago', type: 'warning' }
    ]
  },
  {
    id: 'assistant-agent',
    name: 'Assistant Agent',
    category: 'General',
    description: 'General purpose conversational task assistant and quick responder.',
    status: 'offline',
    tasksCompleted: 0,
    successRate: 0,
    avgResponseTime: '—',
    creditsUsed: 0,
    lastActive: '2h ago',
    iconBg: 'bg-slate-600',
    capabilities: ['General Query Answering', 'Drafting Notes', 'Task Scheduling'],
    tags: ['General', 'Fallback'],
    recentActivity: [
      { id: 'act-12', action: 'Agent initialized in stand-by offline state', timestamp: '2h ago', type: 'info' }
    ]
  },
  {
    id: 'code-intelligence',
    name: 'Code Intelligence Agent',
    category: 'Engineering',
    description: 'Analyzes GitHub repositories and evaluates technical portfolio code quality.',
    status: 'active',
    tasksCompleted: 115,
    successRate: 95.8,
    avgResponseTime: '1.28s',
    creditsUsed: 230,
    lastActive: '25m ago',
    iconBg: 'bg-[#6366f1]',
    capabilities: ['GitHub AST Analysis', 'Code Smells Audit', 'Test Coverage Verifier'],
    tags: ['GitHub', 'Engineering'],
    recentActivity: [
      { id: 'act-13', action: 'Audited 14 TypeScript repositories for clean architecture', timestamp: '25m ago', type: 'success' }
    ]
  },
  {
    id: 'skill-gap-matcher',
    name: 'Skill Gap Matcher',
    category: 'Analysis',
    description: 'Compares target job requirements against current candidate skills.',
    status: 'active',
    tasksCompleted: 89,
    successRate: 91.4,
    avgResponseTime: '1.18s',
    creditsUsed: 178,
    lastActive: '40m ago',
    iconBg: 'bg-rose-600',
    capabilities: ['Target Job Scraping', 'Skill Delta Computation', 'Course Recommendation'],
    tags: ['Skills', 'Matching'],
    recentActivity: [
      { id: 'act-14', action: 'Identified 3 missing skills for Staff Engineer role', timestamp: '40m ago', type: 'info' }
    ]
  },
  {
    id: 'linkedin-optimizer',
    name: 'LinkedIn Profile Optimizer',
    category: 'Optimization',
    description: 'Enhances LinkedIn headlines, summaries, and recruiter visibility.',
    status: 'active',
    tasksCompleted: 145,
    successRate: 96.5,
    avgResponseTime: '0.92s',
    creditsUsed: 290,
    lastActive: '1h ago',
    iconBg: 'bg-sky-600',
    capabilities: ['Headline SEO Optimization', 'About Section Synthesizer', 'Recruiter Keyword Match'],
    tags: ['LinkedIn', 'Branding'],
    recentActivity: [
      { id: 'act-15', action: 'Optimized headline for Senior React & Next.js Architect', timestamp: '1h ago', type: 'success' }
    ]
  },
  {
    id: 'job-tracker-agent',
    name: 'Job Application Tracker',
    category: 'Automation',
    description: 'Automates tracking of submitted applications, interview stages, and follow-ups.',
    status: 'queued',
    tasksCompleted: 74,
    successRate: 89.9,
    avgResponseTime: '1.85s',
    creditsUsed: 148,
    lastActive: '1h 15m ago',
    iconBg: 'bg-teal-600',
    capabilities: ['Status Synchronization', 'Follow-up Email Reminder', 'Pipeline Kanban Sync'],
    tags: ['Tracking', 'Automation'],
    recentActivity: [
      { id: 'act-16', action: 'Scheduled email reminder for Stripe recruiter follow-up', timestamp: '1h 15m ago', type: 'info' }
    ]
  },
  {
    id: 'salary-negotiator',
    name: 'Salary Negotiator',
    category: 'Guidance',
    description: 'Provides negotiation scripts, equity benchmarks, and counter-offer advice.',
    status: 'error',
    tasksCompleted: 34,
    successRate: 82.5,
    avgResponseTime: '2.10s',
    creditsUsed: 68,
    lastActive: '3h ago',
    iconBg: 'bg-red-600',
    capabilities: ['Offer Breakdown Analyzer', 'Equity Valuation Calculator', 'Counter-Script Generator'],
    tags: ['Salary', 'Negotiation'],
    recentActivity: [
      { id: 'act-17', action: 'API quota limit exceeded during compensation benchmark query', timestamp: '3h ago', type: 'error' }
    ]
  },
  {
    id: 'portfolio-builder',
    name: 'Portfolio Builder',
    category: 'Generation',
    description: 'Creates responsive developer portfolio layouts showcasing projects.',
    status: 'active',
    tasksCompleted: 62,
    successRate: 94.0,
    avgResponseTime: '1.75s',
    creditsUsed: 124,
    lastActive: '3h 30m ago',
    iconBg: 'bg-purple-700',
    capabilities: ['Markdown Project Extractor', 'Live Demo Link Validator', 'Theme Customizer'],
    tags: ['Portfolio', 'Projects'],
    recentActivity: [
      { id: 'act-18', action: 'Generated interactive React portfolio layout template', timestamp: '3h 30m ago', type: 'success' }
    ]
  },
  {
    id: 'networking-assistant',
    name: 'Networking Assistant',
    category: 'Guidance',
    description: 'Drafts cold outreach emails and LinkedIn connection messages.',
    status: 'active',
    tasksCompleted: 110,
    successRate: 95.1,
    avgResponseTime: '1.05s',
    creditsUsed: 220,
    lastActive: '4h ago',
    iconBg: 'bg-violet-600',
    capabilities: ['Outreach Customization', 'Mutual Connection Lookup', 'InMail Drafter'],
    tags: ['Networking', 'Outreach'],
    recentActivity: [
      { id: 'act-19', action: 'Generated 3 cold outreach messages for Meta recruiters', timestamp: '4h ago', type: 'success' }
    ]
  },
  {
    id: 'executive-agent',
    name: 'Executive Career Agent',
    category: 'Strategy',
    description: 'Provides C-suite resume framing and executive advisory guidance.',
    status: 'active',
    tasksCompleted: 45,
    successRate: 98.9,
    avgResponseTime: '1.30s',
    creditsUsed: 90,
    lastActive: '5h ago',
    iconBg: 'bg-indigo-700',
    capabilities: ['P&L Leadership Metrics', 'Board Bio Generator', 'Executive Alignment Audit'],
    tags: ['Executive', 'Leadership'],
    recentActivity: [
      { id: 'act-20', action: 'Drafted Board Bio for VP of Engineering candidate', timestamp: '5h ago', type: 'success' }
    ]
  }
]
