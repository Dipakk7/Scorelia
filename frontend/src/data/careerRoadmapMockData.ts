import type {
  CareerRoadmapHeroData,
  RoadmapPhase,
  RecommendedStepData,
  ChatMessageData,
  CareerInsightData,
  RecommendedActionData,
  SessionSummaryData,
  SkillsOverviewData,
  SkillCategoryItem,
  MissingSkillItem,
  PriorityMatrixItem,
  MarketDemandData,
  CertificationItem,
  LearningPathStep,
  MilestonesOverviewData,
  GoalTrackerData,
  MilestoneItem,
  UpcomingMilestoneItem,
  AchievementItem,
  NextStepPlannerItem,
  ProgressHistoryItem,
  ProductivityInsightData,
  JobOpportunityItem,
  JobMatchSummaryData,
  SkillMatchInsightData,
  ApplicationRecommendationItem,
} from '@/types/careerRoadmap'

export const careerRoadmapHeroMockData: CareerRoadmapHeroData = {
  title: 'Your Career Roadmap',
  subtitle: 'Personalized path to achieve your dream role with step-by-step guidance.',
  lastUpdated: '2 days ago',
  kpis: [
    {
      id: 'target-role',
      label: 'Target Role',
      value: 'AI/ML Engineer',
      subtext: 'Edit Goal →',
      actionable: true,
      actionText: 'Edit Goal →',
      accentColor: 'purple',
      iconType: 'briefcase',
    },
    {
      id: 'experience-level',
      label: 'Experience Level',
      value: 'Entry Level',
      subtext: '0–2 Years',
      accentColor: 'blue',
      iconType: 'graduationCap',
    },
    {
      id: 'target-timeline',
      label: 'Target Timeline',
      value: '12 Months',
      subtext: 'Recommended',
      accentColor: 'cyan',
      iconType: 'clock',
    },
    {
      id: 'current-progress',
      label: 'Current Progress',
      value: '32%',
      subtext: 'On Track',
      accentColor: 'emerald',
      iconType: 'progressRing',
      progressValue: 32,
    },
    {
      id: 'estimated-readiness',
      label: 'Estimated Readiness',
      value: '78%',
      subtext: 'In 12 Months',
      accentColor: 'amber',
      iconType: 'trendingUp',
      progressValue: 78,
    },
  ],
}

export const roadmapPhasesMockData: RoadmapPhase[] = [
  {
    id: 'phase-1',
    phaseNumber: 1,
    title: 'AI Foundations',
    months: 'Months 1–3',
    progress: 100,
    status: 'completed',
    description: 'Build rock-solid mathematical, statistical, and programming fundamentals in AI and Python.',
    learningObjectives: [
      'Master Python core data structures and object-oriented paradigms',
      'Understand Linear Algebra, Calculus, and Matrix Operations for ML',
      'Perform EDA using Pandas, NumPy, and Matplotlib',
    ],
    checklist: [
      { id: 'c1-1', title: 'Python Programming & Data Structures', status: 'completed' },
      { id: 'c1-2', title: 'Statistics & Probability for Data Science', status: 'completed' },
      { id: 'c1-3', title: 'Linear Algebra & Vector Calculus', status: 'completed' },
      { id: 'c1-4', title: 'Exploratory Data Analysis (Pandas, NumPy)', status: 'completed' },
    ],
    estimatedHours: '120 hrs',
    difficulty: 'Beginner',
    skillTags: ['Python', 'Statistics', 'Linear Algebra', 'Pandas', 'EDA'],
    accentColor: 'purple',
  },
  {
    id: 'phase-2',
    phaseNumber: 2,
    title: 'Machine Learning',
    months: 'Months 4–6',
    progress: 72,
    status: 'in-progress',
    description: 'Master core machine learning algorithms, model evaluation, and feature engineering techniques.',
    learningObjectives: [
      'Implement Supervised & Unsupervised Machine Learning algorithms',
      'Cross-validate and optimize hyperparameters using Scikit-Learn',
      'Engineer domain-specific features and handle missing data',
    ],
    checklist: [
      { id: 'c2-1', title: 'Supervised Learning (Regression & Classification)', status: 'completed' },
      { id: 'c2-2', title: 'Unsupervised Learning (Clustering & Dimensionality Reduction)', status: 'completed' },
      { id: 'c2-3', title: 'Model Evaluation Metrics & Hyperparameter Tuning', status: 'current' },
      { id: 'c2-4', title: 'Scikit-learn Deep Dive & Pipeline Optimization', status: 'locked' },
      { id: 'c2-5', title: 'Feature Engineering & Data Preprocessing', status: 'locked' },
    ],
    estimatedHours: '140 hrs',
    difficulty: 'Intermediate',
    skillTags: ['Scikit-learn', 'Supervised ML', 'Clustering', 'Model Evaluation', 'Feature Engineering'],
    accentColor: 'blue',
  },
  {
    id: 'phase-3',
    phaseNumber: 3,
    title: 'LLMs & Generative AI',
    months: 'Months 7–9',
    progress: 12,
    status: 'upcoming',
    description: 'Deepen expertise in neural networks, transformer architectures, NLP, and large language models.',
    learningObjectives: [
      'Understand Deep Learning fundamentals with PyTorch',
      'Train Transformer models and implement Attention mechanisms',
      'Build RAG applications using LangChain and Vector Databases',
    ],
    checklist: [
      { id: 'c3-1', title: 'Deep Learning Basics (PyTorch & Neural Networks)', status: 'current' },
      { id: 'c3-2', title: 'Transformer Architectures & Attention Mechanisms', status: 'locked' },
      { id: 'c3-3', title: 'NLP Fundamentals & Tokenization Techniques', status: 'locked' },
      { id: 'c3-4', title: 'RAG & Vector Search Databases (ChromaDB, Pinecone)', status: 'locked' },
      { id: 'c3-5', title: 'Fine-tuning LLMs (LoRA, PEFT)', status: 'locked' },
    ],
    estimatedHours: '160 hrs',
    difficulty: 'Advanced',
    skillTags: ['PyTorch', 'Transformers', 'LLMs', 'RAG', 'LangChain', 'Vector Search'],
    accentColor: 'cyan',
  },
  {
    id: 'phase-4',
    phaseNumber: 4,
    title: 'Production AI Engineer',
    months: 'Months 10–12',
    progress: 0,
    status: 'planned',
    description: 'Deploy real-world end-to-end ML pipelines, containerize services, and build production portfolios.',
    learningObjectives: [
      'Deploy production models with FastAPI, Docker, and Kubernetes',
      'Implement MLOps CI/CD pipelines and model monitoring',
      'Design scalable System Architectures for ML applications',
    ],
    checklist: [
      { id: 'c4-1', title: 'End-to-End Production ML Capstone Project', status: 'locked' },
      { id: 'c4-2', title: 'MLOps Basics & Model Monitoring (MLflow, Docker)', status: 'locked' },
      { id: 'c4-3', title: 'System Design for Scalable ML Services', status: 'locked' },
      { id: 'c4-4', title: 'AI Portfolio Website & GitHub Showcases', status: 'locked' },
      { id: 'c4-5', title: 'Technical Interview & Coding Prep', status: 'locked' },
    ],
    estimatedHours: '180 hrs',
    difficulty: 'Expert',
    skillTags: ['MLOps', 'Docker', 'FastAPI', 'System Design', 'CI/CD', 'Portfolio'],
    accentColor: 'amber',
  },
]

export const recommendedNextStepsMockData: RecommendedStepData[] = [
  {
    id: 'step-1',
    type: 'Continue Learning',
    title: 'Continue Python Practice',
    subtitle: 'Complete remaining data structure algorithms',
    meta: '2/5 topics completed',
    estimatedTime: '2 hrs',
    difficulty: 'Beginner',
    action: 'Practice Now →',
    btnVariant: 'primary',
    tagBg: 'bg-purple-500/20 text-purple-300',
  },
  {
    id: 'step-2',
    type: 'Build Project',
    title: 'Build an LLM Project',
    subtitle: 'Construct an end-to-end RAG question answering pipeline',
    meta: '2 projects recommended',
    estimatedTime: '15 hrs',
    difficulty: 'Advanced',
    action: 'Start Project →',
    btnVariant: 'outline',
    tagBg: 'bg-blue-500/20 text-blue-300',
  },
  {
    id: 'step-3',
    type: 'Revision',
    title: 'Complete SQL Revision',
    subtitle: 'Practice complex joins, aggregations and window functions',
    meta: '12 problems left',
    estimatedTime: '4 hrs',
    difficulty: 'Intermediate',
    action: 'Revise Now →',
    btnVariant: 'outline',
    tagBg: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    id: 'step-4',
    type: 'Assessment',
    title: 'Prepare for Mock Interview',
    subtitle: 'Test machine learning system design & coding scenarios',
    meta: 'Last score: 72%',
    estimatedTime: '1 hr',
    difficulty: 'All Levels',
    action: 'Prepare Now →',
    btnVariant: 'outline',
    tagBg: 'bg-amber-500/20 text-amber-300',
  },
]

export const assistantMessagesMockData: ChatMessageData[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: "Hello Dipak! I'm your Scorelia AI Career Assistant. I've analyzed your target goal as an AI/ML Engineer and reviewed your active 12-Month Roadmap.",
    timestamp: '10:00 AM',
    bulletPoints: [
      'Phase 1 (AI Foundations) is 100% completed',
      'Phase 2 (Machine Learning) is currently 72% in progress',
      'Recommended focus: Complete Model Evaluation & Hyperparameter Tuning',
    ],
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'How can I accelerate my roadmap to reach 85%+ career readiness faster?',
    timestamp: '10:02 AM',
  },
  {
    id: 'msg-3',
    sender: 'assistant',
    text: 'To boost your readiness score from 78% to 85%+, focus on bridging your key skill gaps in MLOps and Deep Learning while completing your Phase 2 capstone project:',
    timestamp: '10:03 AM',
    bulletPoints: [
      'Complete the Scikit-learn Pipeline Optimization module in Phase 2',
      'Start an end-to-end RAG project with PyTorch & LangChain (Phase 3 preview)',
      'Practice 2 ML System Design scenarios to strengthen engineering depth',
    ],
    codeSnippet: `// Suggested Learning Velocity Target\nconst weeklyGoal = {\n  topicsToFinish: 3,\n  practiceCodingHours: 6,\n  mockInterviews: 1\n};`,
  },
]

export const suggestedPromptsMockData: string[] = [
  'Review my roadmap',
  'Suggest next skills',
  'Improve my AI engineer plan',
  'Recommend certifications',
  'Analyze my weak areas',
  'Generate a weekly study plan',
  'How can I reach my goal faster?',
  'Which projects should I build?',
]

export const careerInsightsMockData: CareerInsightData = {
  readinessScore: 78,
  strongestSkill: 'Python (85%)',
  weakestSkill: 'MLOps (20%)',
  estimatedTimeline: '12 Months',
  focusArea: 'Supervised Learning & Model Tuning',
  learningVelocity: 'High (4 topics/week)',
}

export const recommendedActionsMockData: RecommendedActionData[] = [
  { id: 'act-1', title: 'Continue Current Phase', category: 'Learning', iconName: 'play', actionText: 'Resume →' },
  { id: 'act-2', title: 'Review Skill Gap', category: 'Analytics', iconName: 'award', actionText: 'View →' },
  { id: 'act-3', title: 'Open Learning Resources', category: 'Study', iconName: 'book', actionText: 'Explore →' },
  { id: 'act-4', title: 'Start Mock Interview', category: 'Practice', iconName: 'video', actionText: 'Start →' },
  { id: 'act-5', title: 'Practice SQL & Coding', category: 'Coding', iconName: 'code', actionText: 'Solve →' },
  { id: 'act-6', title: 'View Resume Analysis', category: 'Resume', iconName: 'file', actionText: 'Inspect →' },
]

export const sessionSummaryMockData: SessionSummaryData = {
  todayFocus: 'Model Evaluation & Hyperparameter Tuning',
  goalsDiscussed: ['Python Data Structures', 'Scikit-learn Pipelines', 'MLOps Baseline'],
  aiSuggestionsCount: 3,
  completedTopicsCount: 2,
  sessionDuration: '24 mins',
}

export const skillsOverviewMockData: SkillsOverviewData = {
  overallReadiness: 78,
  gapScore: 22,
  completedSkillsCount: 18,
  totalSkillsCount: 24,
  marketAlignment: 'High (Top 15%)',
}

export const skillCategoriesMockData: SkillCategoryItem[] = [
  { id: 'sk-1', name: 'Python', completion: 85, status: 'completed', difficulty: 'Intermediate', iconName: 'code', accentColor: 'emerald' },
  { id: 'sk-2', name: 'Machine Learning', completion: 60, status: 'in-progress', difficulty: 'Intermediate', iconName: 'award', accentColor: 'amber' },
  { id: 'sk-3', name: 'Deep Learning', completion: 40, status: 'in-progress', difficulty: 'Advanced', iconName: 'zap', accentColor: 'blue' },
  { id: 'sk-4', name: 'Generative AI', completion: 35, status: 'missing', difficulty: 'Advanced', iconName: 'sparkles', accentColor: 'purple' },
  { id: 'sk-5', name: 'LLMs & RAG', completion: 30, status: 'missing', difficulty: 'Advanced', iconName: 'cpu', accentColor: 'cyan' },
  { id: 'sk-6', name: 'SQL & Databases', completion: 80, status: 'completed', difficulty: 'Beginner', iconName: 'database', accentColor: 'emerald' },
  { id: 'sk-7', name: 'FastAPI & REST', completion: 50, status: 'in-progress', difficulty: 'Intermediate', iconName: 'server', accentColor: 'blue' },
  { id: 'sk-8', name: 'Cloud & Infrastructure', completion: 25, status: 'missing', difficulty: 'Advanced', iconName: 'cloud', accentColor: 'amber' },
  { id: 'sk-9', name: 'MLOps & CI/CD', completion: 20, status: 'missing', difficulty: 'Expert', iconName: 'settings', accentColor: 'purple' },
]

export const missingSkillsMockData: MissingSkillItem[] = [
  { id: 'ms-1', name: 'Docker & Containerization', priority: 'Critical', estimatedHours: '12 hrs', recommendedTimeline: 'Weeks 1–2', category: 'DevOps' },
  { id: 'ms-2', name: 'Kubernetes Orchestration', priority: 'High', estimatedHours: '16 hrs', recommendedTimeline: 'Weeks 3–4', category: 'Infrastructure' },
  { id: 'ms-3', name: 'CI/CD Pipelines for ML', priority: 'High', estimatedHours: '10 hrs', recommendedTimeline: 'Weeks 5–6', category: 'MLOps' },
  { id: 'ms-4', name: 'LangGraph & Multi-Agents', priority: 'Medium', estimatedHours: '14 hrs', recommendedTimeline: 'Weeks 7–8', category: 'LLMs' },
  { id: 'ms-5', name: 'AWS Bedrock Integration', priority: 'Medium', estimatedHours: '8 hrs', recommendedTimeline: 'Weeks 9–10', category: 'Cloud' },
  { id: 'ms-6', name: 'Terraform IaC Baseline', priority: 'Medium', estimatedHours: '10 hrs', recommendedTimeline: 'Weeks 11–12', category: 'Cloud' },
]

export const priorityMatrixMockData: PriorityMatrixItem[] = [
  { id: 'pm-1', name: 'Scikit-learn Pipelines', impact: 'High', effort: 'Low', quadrant: 'quick-wins', category: 'Machine Learning' },
  { id: 'pm-2', name: 'FastAPI Service Layer', impact: 'High', effort: 'Low', quadrant: 'quick-wins', category: 'Backend' },
  { id: 'pm-3', name: 'RAG & Vector Search', impact: 'High', effort: 'High', quadrant: 'strategic', category: 'GenAI' },
  { id: 'pm-4', name: 'PyTorch Model Fine-tuning', impact: 'High', effort: 'High', quadrant: 'strategic', category: 'Deep Learning' },
  { id: 'pm-5', name: 'Markdown Documentation', impact: 'Low', effort: 'Low', quadrant: 'fill-ins', category: 'Tooling' },
  { id: 'pm-6', name: 'Basic SQL Formatting', impact: 'Low', effort: 'Low', quadrant: 'fill-ins', category: 'Data' },
  { id: 'pm-7', name: 'Legacy C++ CUDA Kernels', impact: 'Low', effort: 'High', quadrant: 'reevaluate', category: 'Low-level' },
  { id: 'pm-8', name: 'Custom Hardware Solvers', impact: 'Low', effort: 'High', quadrant: 'reevaluate', category: 'Hardware' },
]

export const marketDemandMockData: MarketDemandData = {
  demandLevel: 'Very High',
  hiringTrend: 'Increasing (+24% YoY)',
  yoyGrowth: '+24%',
  topHiringSkills: ['PyTorch', 'RAG Architectures', 'MLOps (Docker/K8s)', 'System Design for ML'],
  salaryRange: '$145,000 – $190,000 / yr',
  industryGrowth: 'Extremely Strong',
}

export const certificationRecommendationsMockData: CertificationItem[] = [
  { id: 'cert-1', title: 'Oracle Cloud Infrastructure AI Foundations', provider: 'Oracle', estimatedDuration: '4 weeks', difficulty: 'Beginner', priority: 'High', actionText: 'Enroll →' },
  { id: 'cert-2', title: 'Microsoft Certified: Azure AI Engineer Associate', provider: 'Microsoft', estimatedDuration: '6 weeks', difficulty: 'Intermediate', priority: 'High', actionText: 'Enroll →' },
  { id: 'cert-3', title: 'AWS Certified Machine Learning - Specialty', provider: 'Amazon Web Services', estimatedDuration: '8 weeks', difficulty: 'Advanced', priority: 'Recommended', actionText: 'Explore →' },
  { id: 'cert-4', title: 'TensorFlow Developer Certificate', provider: 'Google DeepMind', estimatedDuration: '6 weeks', difficulty: 'Intermediate', priority: 'Recommended', actionText: 'Explore →' },
]

export const learningPathMockData: LearningPathStep[] = [
  { stepNumber: 1, title: 'Python', status: 'completed', description: 'Core data structures, OOP, Pandas & NumPy' },
  { stepNumber: 2, title: 'Machine Learning', status: 'current', description: 'Supervised, Unsupervised & Scikit-learn' },
  { stepNumber: 3, title: 'Deep Learning', status: 'upcoming', description: 'PyTorch, Neural Networks & Computer Vision' },
  { stepNumber: 4, title: 'LLMs & RAG', status: 'upcoming', description: 'Transformers, LangChain & Vector DBs' },
  { stepNumber: 5, title: 'Production AI', status: 'upcoming', description: 'FastAPI, Docker & Model Deployment' },
  { stepNumber: 6, title: 'MLOps Mastery', status: 'upcoming', description: 'CI/CD, Kubernetes & Model Monitoring' },
]

export const milestonesOverviewMockData: MilestonesOverviewData = {
  completedMilestones: 12,
  upcomingMilestones: 4,
  currentStreakDays: 18,
  overallCompletionPercentage: 78,
}

export const goalTrackerMockData: GoalTrackerData = {
  currentGoal: 'Senior AI/ML Engineer Role',
  targetCompletionQuarter: 'Q4 2026',
  goalHealth: 'Excellent (On Track)',
  weeklyProgressPercentage: 80,
  weeklyTasksDone: 4,
  weeklyTasksTotal: 5,
  monthlyProgressPercentage: 72,
  monthlyTopicsDone: 18,
  monthlyTopicsTotal: 25,
}

export const milestonesTimelineMockData: MilestoneItem[] = [
  {
    id: 'm-1',
    title: 'Python Core & Data Structures',
    phaseName: 'Phase 1: Foundations',
    targetDate: 'June 15, 2026',
    status: 'completed',
    progress: 100,
    description: 'Mastered Python syntax, data structures, algorithms, and numerical libraries (Pandas/NumPy).',
    priority: 'High',
    estimatedEffort: '40 hrs',
    iconName: 'code',
  },
  {
    id: 'm-2',
    title: 'Supervised Learning & Scikit-learn',
    phaseName: 'Phase 2: Core ML',
    targetDate: 'July 10, 2026',
    status: 'completed',
    progress: 100,
    description: 'Implemented regression, classification, decision trees, and cross-validation pipelines.',
    priority: 'High',
    estimatedEffort: '45 hrs',
    iconName: 'award',
  },
  {
    id: 'm-3',
    title: 'Model Evaluation & Hyperparameter Tuning',
    phaseName: 'Phase 2: Core ML',
    targetDate: 'August 15, 2026',
    status: 'in-progress',
    progress: 72,
    description: 'Tuning ROC-AUC curves, GridSearch optimization, and feature importance analysis.',
    priority: 'Critical',
    estimatedEffort: '35 hrs',
    iconName: 'sliders',
  },
  {
    id: 'm-4',
    title: 'Deep Learning & PyTorch Basics',
    phaseName: 'Phase 3: LLMs & GenAI',
    targetDate: 'September 20, 2026',
    status: 'upcoming',
    progress: 12,
    description: 'Build backpropagation neural nets, CNNs, and loss optimization loops in PyTorch.',
    priority: 'Medium',
    estimatedEffort: '50 hrs',
    iconName: 'zap',
  },
  {
    id: 'm-5',
    title: 'LLM Fine-Tuning & RAG Pipelines',
    phaseName: 'Phase 3: LLMs & GenAI',
    targetDate: 'October 30, 2026',
    status: 'planned',
    progress: 0,
    description: 'Train LoRA adapters, set up ChromaDB vector search, and build LangChain agents.',
    priority: 'Critical',
    estimatedEffort: '60 hrs',
    iconName: 'cpu',
  },
]

export const upcomingMilestonesMockData: UpcomingMilestoneItem[] = [
  { id: 'um-1', title: 'Complete FastAPI Microservice', dueDate: 'Aug 15, 2026', daysRemaining: 5, priority: 'High', progress: 60 },
  { id: 'um-2', title: 'Finish LLM RAG Portfolio', dueDate: 'Sep 01, 2026', daysRemaining: 22, priority: 'Critical', progress: 20 },
  { id: 'um-3', title: 'Deploy Scorelia ML Service', dueDate: 'Sep 20, 2026', daysRemaining: 41, priority: 'High', progress: 10 },
  { id: 'um-4', title: 'Prepare for Mock Interview', dueDate: 'Oct 05, 2026', daysRemaining: 56, priority: 'Medium', progress: 0 },
]

export const achievementGalleryMockData: AchievementItem[] = [
  { id: 'ach-1', title: 'Python Master', unlockDate: 'June 12, 2026', description: 'Completed 50+ data structure & algorithm exercises', iconName: 'award', badgeRibbon: 'Gold Medal' },
  { id: 'ach-2', title: 'Machine Learning Complete', unlockDate: 'July 04, 2026', description: 'Trained and cross-validated 10+ ML models', iconName: 'zap', badgeRibbon: 'Verified' },
  { id: 'ach-3', title: 'SQL Foundations', unlockDate: 'May 20, 2026', description: 'Mastered complex joins, window functions & aggregations', iconName: 'database', badgeRibbon: 'Expert' },
  { id: 'ach-4', title: 'FastAPI Builder', unlockDate: 'July 22, 2026', description: 'Built scalable RESTful microservices', iconName: 'server', badgeRibbon: 'Pro' },
]

export const nextStepsPlannerMockData: NextStepPlannerItem[] = [
  { id: 'nsp-1', title: 'Study Docker & Containerization', category: 'DevOps', estimatedDuration: '3 hrs', priority: 'High', actionText: 'Start Study →', iconName: 'box' },
  { id: 'nsp-2', title: 'Complete Kubernetes Labs', category: 'Infrastructure', estimatedDuration: '5 hrs', priority: 'High', actionText: 'Start Labs →', iconName: 'cloud' },
  { id: 'nsp-3', title: 'Deploy Portfolio Website', category: 'Portfolio', estimatedDuration: '8 hrs', priority: 'Critical', actionText: 'Deploy Now →', iconName: 'globe' },
  { id: 'nsp-4', title: 'Practice DSA Problems', category: 'Coding', estimatedDuration: '2 hrs', priority: 'Medium', actionText: 'Solve DSA →', iconName: 'code' },
  { id: 'nsp-5', title: 'Complete Interview Prep Mock', category: 'Interview', estimatedDuration: '1 hr', priority: 'High', actionText: 'Start Mock →', iconName: 'video' },
  { id: 'nsp-6', title: 'Apply to AI Engineer Jobs', category: 'Career', estimatedDuration: '4 hrs', priority: 'High', actionText: 'Apply Now →', iconName: 'briefcase' },
]

export const progressHistoryMockData: ProgressHistoryItem[] = [
  { id: 'ph-1', title: 'Completed Python Data Structures Module', description: 'Finished 15 exercises on Trees and Graphs with 100% score.', timestamp: 'Today, 09:30 AM', eventType: 'completed' },
  { id: 'ph-2', title: 'Finished SQL Window Functions Revision', description: 'Solved 12 complex database query scenarios on LeetCode.', timestamp: 'Yesterday, 04:15 PM', eventType: 'completed' },
  { id: 'ph-3', title: 'Started LLM RAG Architecture Roadmap', description: 'Initiated Phase 3 Vector Search & LangChain modules.', timestamp: '3 days ago', eventType: 'started' },
  { id: 'ph-4', title: 'Completed Resume Intelligence Audit', description: 'Achieved ATS compatibility score of 86/100.', timestamp: '5 days ago', eventType: 'analysis' },
]

export const productivityInsightsMockData: ProductivityInsightData = {
  learningConsistencyPercentage: 94,
  avgStudyHoursPerDay: 2.8,
  tasksCompletedTotal: 48,
  weeklyTrendPercentage: '+15%',
  longestStreakDays: 24,
  mostProductiveDay: 'Thursday',
}

export const jobMatchSummaryMockData: JobMatchSummaryData = {
  totalMatches: 24,
  highMatchCount: 14,
  avgSalaryRange: '$125K – $165K',
  topSkillDemand: 'Python, PyTorch, RAG',
}

export const jobOpportunitiesMockData: JobOpportunityItem[] = [
  {
    id: 'job-1',
    title: 'Senior AI/ML Engineer',
    company: 'Anthropic',
    companyInitials: 'AN',
    location: 'San Francisco, CA',
    isRemote: true,
    salary: '$160,000 - $210,000',
    matchScore: 94,
    matchingSkills: ['Python', 'PyTorch', 'LangChain', 'FastAPI', 'Pandas'],
    missingSkills: ['Docker', 'Kubernetes'],
    featured: true,
    postedAgo: '2 hours ago',
    jobType: 'Full-time',
    experienceLevel: 'Mid–Senior',
  },
  {
    id: 'job-2',
    title: 'Machine Learning Infrastructure Engineer',
    company: 'Databricks',
    companyInitials: 'DB',
    location: 'San Jose, CA',
    isRemote: true,
    salary: '$150,000 - $195,000',
    matchScore: 88,
    matchingSkills: ['Python', 'Scikit-learn', 'SQL', 'FastAPI'],
    missingSkills: ['AWS MLOps', 'Kubeflow'],
    featured: true,
    postedAgo: '5 hours ago',
    jobType: 'Full-time',
    experienceLevel: 'Entry–Mid',
  },
  {
    id: 'job-3',
    title: 'Generative AI Developer',
    company: 'Scale AI',
    companyInitials: 'SA',
    location: 'New York, NY',
    isRemote: false,
    salary: '$140,000 - $180,000',
    matchScore: 85,
    matchingSkills: ['Python', 'Transformers', 'FastAPI', 'Vector DB'],
    missingSkills: ['LangGraph', 'Ray'],
    featured: false,
    postedAgo: '1 day ago',
    jobType: 'Full-time',
    experienceLevel: 'Mid Level',
  },
  {
    id: 'job-4',
    title: 'Junior AI Software Engineer',
    company: 'Perplexity AI',
    companyInitials: 'PX',
    location: 'Remote',
    isRemote: true,
    salary: '$120,000 - $155,000',
    matchScore: 91,
    matchingSkills: ['Python', 'Pandas', 'FastAPI', 'REST APIs', 'Git'],
    missingSkills: ['Redis'],
    featured: false,
    postedAgo: '2 days ago',
    jobType: 'Full-time',
    experienceLevel: 'Entry Level',
  },
]

export const skillMatchInsightMockData: SkillMatchInsightData[] = [
  {
    category: 'Core AI & ML',
    matchingSkills: ['Python', 'NumPy', 'Pandas', 'Scikit-learn', 'PyTorch'],
    missingSkills: ['TensorFlow (Legacy)'],
    recommendedSkills: ['LangChain RAG', 'Transformers fine-tuning'],
  },
  {
    category: 'MLOps & Infrastructure',
    matchingSkills: ['FastAPI', 'Git', 'Linux CLI'],
    missingSkills: ['Docker Containerization', 'Kubernetes Cluster Setup', 'MLflow Tracking'],
    recommendedSkills: ['Docker Desktop Hands-on', 'AWS SageMaker pipelines'],
  },
]

export const applicationRecommendationsMockData: ApplicationRecommendationItem[] = [
  {
    id: 'rec-1',
    title: 'Tailor Resume for Anthropic AI Role',
    company: 'Anthropic',
    tip: 'Add RAG vector database & FastAPI benchmarks to your resume key achievements.',
    readinessScore: 94,
    actionText: 'Optimize Resume →',
  },
  {
    id: 'rec-2',
    title: 'Add Containerization to Scale AI Application',
    company: 'Scale AI',
    tip: 'Completing Phase 2 MLOps Docker module will boost match score from 85% to 96%.',
    readinessScore: 85,
    actionText: 'Start Docker Module →',
  },
]
