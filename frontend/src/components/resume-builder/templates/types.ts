export type ResumeTemplateId = 'modern' | 'professional' | 'executive' | 'minimal' | 'creative'

export interface TemplateMetadata {
  id: ResumeTemplateId
  name: string
  description: string
  category: 'Popular' | 'Corporate' | 'Executive' | 'Clean' | 'Creative'
  thumbnailBg: string
  accentColor: string
  features: string[]
}

export interface SampleResumeData {
  fullName: string
  professionalTitle: string
  headline: string
  email: string
  phone: string
  countryCode: string
  location: string
  website: string
  linkedin: string
  github: string
  summary: string
  experience: Array<{
    id: string
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    bullets: string[]
  }>
  education: Array<{
    id: string
    degree: string
    institution: string
    location: string
    startDate: string
    endDate: string
    gpa?: string
  }>
  skills: Array<{
    id: string
    name: string
    skills: string[]
  }>
  projects: Array<{
    id: string
    name: string
    subtitle?: string
    liveUrl?: string
    githubUrl?: string
    bullets: string[]
  }>
  certifications: Array<{
    id: string
    name: string
    issuer: string
    date: string
    credentialUrl?: string
  }>
  languages: Array<{
    id: string
    name: string
    proficiency: string
  }>
  achievements: Array<{
    id: string
    title: string
    issuer?: string
    impactMetric?: string
    description: string
  }>
  references: Array<{
    id: string
    name: string
    title: string
    company: string
    email?: string
    phone?: string
  }>
  availableUponRequest?: boolean
}

export const TEMPLATES_LIST: TemplateMetadata[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean, corporate layout with classic navy headers. Ideal for enterprise & finance roles.',
    category: 'Corporate',
    thumbnailBg: 'bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950',
    accentColor: '#1e40af',
    features: ['Classic Dividers', 'ATS Optimized', 'Formal Serif/Sans typography'],
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Vibrant purple accent bar with clean two-column skills layout. Preferred for tech & AI engineers.',
    category: 'Popular',
    thumbnailBg: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-950',
    accentColor: '#7c3aed',
    features: ['Vibrant Accents', 'Tech Badges', 'Compact Header'],
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated gold & dark slate header banner. Tailored for leaders & managers.',
    category: 'Executive',
    thumbnailBg: 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900',
    accentColor: '#b45309',
    features: ['Executive Banner', 'Metrics Highlight', 'Leadership Styling'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Monochrome minimalist design focusing on typography hierarchy & high readability.',
    category: 'Clean',
    thumbnailBg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900',
    accentColor: '#334155',
    features: ['Monochrome', 'Generous Spacing', 'High Scanning Speed'],
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold gradient headers and modern visual skill chips for designers & innovative roles.',
    category: 'Creative',
    thumbnailBg: 'bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-950',
    accentColor: '#db2777',
    features: ['Gradient Accents', 'Skill Chips', 'Visual Hierarchy'],
  },
]

export const DEMO_RESUME_DATA: SampleResumeData = {
  fullName: 'DIPAK KHANDAGALE',
  professionalTitle: 'AI/ML ENGINEER',
  headline: 'Specializing in Deep Learning, NLP & End-to-End AI Solutions',
  email: 'dipakkhandagale7@gmail.com',
  phone: '+91 87672 54321',
  countryCode: '+91',
  location: 'Ahilyanagar, Maharashtra, India',
  website: 'dipakkhandagale.vercel.app',
  linkedin: 'linkedin.com/in/dipak-khandagale',
  github: 'github.com/Dipakkhandagale7',
  summary:
    'AI/ML Engineer with hands-on experience in machine learning, deep learning, NLP, and data analysis. Skilled in Python, TensorFlow, PyTorch, and building end-to-end AI solutions. Passionate about creating intelligent systems that solve real-world problems.',
  experience: [
    {
      id: 'exp-1',
      title: 'AI Intern',
      company: 'RaiTalk',
      location: 'Remote',
      startDate: 'Jan 2026',
      endDate: 'May 2026',
      current: false,
      bullets: [
        'Collected, cleaned, and analyzed data to extract actionable insights for core models.',
        'Built dashboards and reports to track user behavior, engagement, and model inference latency.',
        'Conducted A/B testing and experiments to optimize product performance by 25%.',
        'Collaborated with AI and product teams to improve feature delivery and deployment pipelines.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.Tech in Artificial Intelligence & Data Science',
      institution: 'Savitribai Phule Pune University',
      location: 'Pune, India',
      startDate: '2022',
      endDate: '2026',
      gpa: '8.8 / 10.0',
    },
  ],
  skills: [
    {
      id: 's-1',
      name: 'Languages',
      skills: ['Python', 'SQL', 'JavaScript', 'TypeScript', 'C++'],
    },
    {
      id: 's-2',
      name: 'ML / AI',
      skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenCV', 'NLP', 'LangChain'],
    },
    {
      id: 's-3',
      name: 'Tools & DBs',
      skills: ['FastAPI', 'React', 'PostgreSQL', 'Docker', 'Git', 'MySQL', 'VS Code'],
    },
    {
      id: 's-4',
      name: 'Data',
      skills: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
    },
  ],
  projects: [
    {
      id: 'p-1',
      name: 'Scorelia – AI Career Intelligence Platform',
      subtitle: 'Python, FastAPI, React, PostgreSQL',
      liveUrl: 'https://scorelia.vercel.app',
      githubUrl: 'github.com/Dipakkhandagale7/scorelia',
      bullets: [
        'Built an AI-powered platform providing resume scoring, ATS analysis, job matching, interview prep, and career roadmaps.',
        'Engineered high-concurrency FastAPI microservices with optimized spaCy parsing pipelines.',
      ],
    },
    {
      id: 'p-2',
      name: 'Deepfake Video Detector',
      subtitle: 'Python, TensorFlow, OpenCV',
      githubUrl: 'github.com/Dipakkhandagale7/deepfake-detector',
      bullets: [
        'Developed a deepfake detection model using ResNet50 + BiLSTM with sub-second inference latency.',
      ],
    },
  ],
  certifications: [
    {
      id: 'c-1',
      name: 'AWS Certified Machine Learning – Specialty',
      issuer: 'Amazon Web Services',
      date: '2025',
    },
    {
      id: 'c-2',
      name: 'TensorFlow Developer Certificate',
      issuer: 'Google',
      date: '2024',
    },
  ],
  languages: [
    { id: 'l-1', name: 'English', proficiency: 'Fluent' },
    { id: 'l-2', name: 'Hindi', proficiency: 'Native' },
    { id: 'l-3', name: 'Marathi', proficiency: 'Native' },
  ],
  achievements: [
    {
      id: 'a-1',
      title: 'Top 1% Rank in National AI Hackathon',
      issuer: 'Tech Excellence Council',
      impactMetric: 'Rank 4 / 3,500 Teams',
      description: 'Built a real-time deepfake audio detector with high classification accuracy.',
    },
  ],
  references: [],
  availableUponRequest: true,
}
