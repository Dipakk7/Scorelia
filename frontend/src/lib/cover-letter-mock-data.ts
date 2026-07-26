export interface MockResume {
  id: string
  name: string
  role: string
  atsScore: number
  updatedAt: string
}

export interface MockJobDescription {
  id: string
  jobTitle: string
  company: string
  hiringManager: string
  experienceLevel: string
  tone: string
  language: string
  description: string
  keySkills: string[]
}

export interface MockCoverLetterContent {
  id: string
  versionNumber: number
  versionLabel: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  applicantLocation: string
  applicantWebsite: string
  date: string
  recipientTitle: string
  companyName: string
  companyAddress: string
  salutation: string
  introParagraph: string
  bodyParagraph1: string
  bodyParagraph2: string
  closingParagraph: string
  signOff: string
  atsScore: number
  wordCount: number
  readabilityScore: number
  isFavorite?: boolean
  createdAt: string
}

export interface MockScoreBreakdown {
  overallScore: number
  readability: number
  professionalTone: number
  atsCompatibility: number
  grammar: number
  structure: number
  keywordsMatch: number
  benchmarkText: string
}

export interface MockKeywordItem {
  name: string
  status: 'matched' | 'missing'
  relevance: 'High' | 'Medium' | 'Critical'
}

export interface MockSmartSuggestion {
  id: string
  category: 'Missing Achievements' | 'Weak Action Verbs' | 'Long Paragraphs' | 'Passive Voice Warnings'
  title: string
  description: string
  impactBadge: string
  applied: boolean
}

export interface MockTemplate {
  id: string
  name: string
  description: string
  category: 'Modern' | 'Professional' | 'Executive' | 'Minimal' | 'Creative'
  badge?: string
}

export interface GenerationStage {
  id: number
  label: string
  description: string
  durationMs: number
}

export interface GenerationHistoryLog {
  id: string
  timestamp: string
  templateName: string
  tone: string
  atsScore: number
  versionLabel: string
  companyName: string
  jobTitle: string
}

// 1. Mock Resumes
export const mockResumes: MockResume[] = [
  {
    id: 'res-1',
    name: 'Dipak_Khandagale_AI_Engineer_2026.pdf',
    role: 'AI/ML Engineer',
    atsScore: 86,
    updatedAt: 'Updated 2 days ago',
  },
  {
    id: 'res-2',
    name: 'Software_Developer_Resume_V2.pdf',
    role: 'Full Stack Engineer',
    atsScore: 82,
    updatedAt: 'Updated 1 week ago',
  },
  {
    id: 'res-3',
    name: 'Data_Scientist_Master_Resume.pdf',
    role: 'Data Scientist',
    atsScore: 88,
    updatedAt: 'Updated 3 weeks ago',
  },
]

// 2. Mock Target Job Descriptions
export const mockJobDescriptions: MockJobDescription[] = [
  {
    id: 'jd-1',
    jobTitle: 'AI/ML Engineer',
    company: 'Google',
    hiringManager: 'Dr. Sarah Jenkins',
    experienceLevel: 'Fresher',
    tone: 'Professional',
    language: 'English (US)',
    description:
      'We are seeking an ambitious AI/ML Engineer to build machine learning models and scalable AI solutions. The ideal candidate will have strong expertise in Python, TensorFlow, PyTorch, Deep Learning, and NLP algorithms, with a proven track record of deploying intelligent software systems.',
    keySkills: ['Python', 'Machine Learning', 'NLP', 'TensorFlow', 'Data Analysis', 'SQL', 'PyTorch', 'MLOps'],
  },
  {
    id: 'jd-2',
    jobTitle: 'Senior Frontend Engineer',
    company: 'Microsoft',
    hiringManager: 'Alex Rivers',
    experienceLevel: 'Mid-Level',
    tone: 'Persuasive',
    language: 'English (US)',
    description:
      'Looking for a Senior Frontend Engineer to craft hyper-responsive user interfaces using React, TypeScript, and modern design systems. Responsibilities include optimizing web performance, ensuring WCAG accessibility, and leading component architecture.',
    keySkills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'State Management', 'Web Performance'],
  },
]

// 3. Multi-Version Mock Cover Letter Contents
export const mockCoverLetterVersions: MockCoverLetterContent[] = [
  {
    id: 'v1',
    versionNumber: 1,
    versionLabel: 'Version 1 — Standard Professional Draft',
    applicantName: 'Dipak Khandagale',
    applicantEmail: 'dipak@scorelia.ai',
    applicantPhone: '+1 (555) 019-2834',
    applicantLocation: 'Mountain View, CA',
    applicantWebsite: 'linkedin.com/in/dipakk',
    date: 'May 18, 2026',
    recipientTitle: 'Hiring Manager',
    companyName: 'Google',
    companyAddress: '1600 Amphitheatre Parkway, Mountain View, CA 94043',
    salutation: 'Dear Hiring Manager,',
    introParagraph:
      'I am writing to express my strong enthusiasm for the AI/ML Engineer position at Google. As a recent graduate in Artificial Intelligence and Data Science with hands-on technical experience building end-to-end intelligent systems, I am eager to leverage my skills in machine learning, deep neural networks, and scalable software design to drive innovation at Google.',
    bodyParagraph1:
      'During my academic journey and machine learning engineering projects, I developed a Deepfake Video Detector using custom convolutional neural networks and an AI Investment Assistant leveraging advanced NLP models. My core technical repertoire spans Python, TensorFlow, PyTorch, scikit-learn, and SQL. I have systematically optimized neural network training workflows to achieve 94.2% model classification accuracy while streamlining inference latency for real-time applications.',
    bodyParagraph2:
      'What deeply inspires me about Google is your relentless commitment to organizing the world’s information and making AI universally accessible and impactful. My experience aligning technical model architecture with user-centric engineering principles positions me to contribute effectively to Google’s research and machine learning product initiatives from day one.',
    closingParagraph:
      'Thank you for considering my application. I would welcome the opportunity to discuss how my technical expertise, problem-solving mindset, and passion for artificial intelligence align with Google’s engineering vision.',
    signOff: 'Sincerely,\nDipak Khandagale',
    atsScore: 92,
    wordCount: 210,
    readabilityScore: 94,
    isFavorite: true,
    createdAt: 'Just now',
  },
  {
    id: 'v2',
    versionNumber: 2,
    versionLabel: 'Version 2 — Concise High-Impact Draft',
    applicantName: 'Dipak Khandagale',
    applicantEmail: 'dipak@scorelia.ai',
    applicantPhone: '+1 (555) 019-2834',
    applicantLocation: 'Mountain View, CA',
    applicantWebsite: 'linkedin.com/in/dipakk',
    date: 'May 18, 2026',
    recipientTitle: 'Hiring Manager',
    companyName: 'Google',
    companyAddress: '1600 Amphitheatre Parkway, Mountain View, CA 94043',
    salutation: 'Dear Hiring Manager,',
    introParagraph:
      'As an ambitious AI/ML Engineer specializing in deep neural networks and real-time MLOps pipelines, I am thrilled to apply for the AI/ML Engineer role at Google.',
    bodyParagraph1:
      'Over the past two years, I engineered a computer vision Deepfake Video Detector achieving 94.2% accuracy and developed an NLP AI Investment Assistant. Proficient in Python, PyTorch, TensorFlow, and SQL, I specialize in streamlining model inference speeds and optimizing distributed training pipelines for production environments.',
    bodyParagraph2:
      'Google’s leadership in foundational AI models and open research perfectly aligns with my drive to engineer scalable, ethical AI solutions.',
    closingParagraph:
      'I am eager to bring my problem-solving mindset and technical expertise to Google’s engineering team.',
    signOff: 'Sincerely,\nDipak Khandagale',
    atsScore: 89,
    wordCount: 145,
    readabilityScore: 96,
    isFavorite: false,
    createdAt: '10 mins ago',
  },
  {
    id: 'v3',
    versionNumber: 3,
    versionLabel: 'Version 3 — Executive AI Optimized Draft',
    applicantName: 'Dipak Khandagale',
    applicantEmail: 'dipak@scorelia.ai',
    applicantPhone: '+1 (555) 019-2834',
    applicantLocation: 'Mountain View, CA',
    applicantWebsite: 'linkedin.com/in/dipakk',
    date: 'May 18, 2026',
    recipientTitle: 'Hiring Manager & Engineering Leadership',
    companyName: 'Google',
    companyAddress: '1600 Amphitheatre Parkway, Mountain View, CA 94043',
    salutation: 'Dear Hiring Manager and Google Engineering Team,',
    introParagraph:
      'It is with great excitement that I submit my application for the AI/ML Engineer position at Google. Combining a rigorous academic foundation in Artificial Intelligence & Data Science with proven success architecting production machine learning systems, I am prepared to contribute immediately to Google’s world-class AI infrastructure.',
    bodyParagraph1:
      'Throughout my engineering projects, I have focused on solving high-complexity problems at the intersection of deep learning and real-time data analytics. Highlights include architecting a Deepfake Video Detection neural network that achieved 94.2% precision and deploying an NLP Investment Intelligence Assistant handling multi-modal queries. My core stack includes Python, PyTorch, TensorFlow, MLOps, SQL, and Docker containerization.',
    bodyParagraph2:
      'Google’s dedication to pushing the boundaries of AI capabilities while prioritizing accessibility and safety resonates deeply with my engineering philosophy. I am eager to apply my expertise in model optimization, system latency reduction, and collaborative research to support Google’s strategic roadmap.',
    closingParagraph:
      'Thank you for your time and consideration. I welcome the opportunity to discuss how my technical acumen and passion for AI innovation will add value to Google’s engineering organization.',
    signOff: 'Sincerely,\nDipak Khandagale',
    atsScore: 95,
    wordCount: 238,
    readabilityScore: 92,
    isFavorite: false,
    createdAt: '25 mins ago',
  },
]

// 4. 7-Stage Generation Timeline Definitions
export const mockGenerationStages: GenerationStage[] = [
  { id: 1, label: 'Resume Analysis', description: 'Parsing experience & skills graph', durationMs: 600 },
  { id: 2, label: 'Job Description Analysis', description: 'Extracting key role requirements', durationMs: 700 },
  { id: 3, label: 'Skill Matching', description: 'Aligning technical keywords & competencies', durationMs: 600 },
  { id: 4, label: 'ATS Optimization', description: 'Structuring format for recruiter screeners', durationMs: 800 },
  { id: 5, label: 'Tone Optimization', description: 'Refining executive & professional phrasing', durationMs: 700 },
  { id: 6, label: 'Draft Generation', description: 'Synthesizing tailored cover letter paragraphs', durationMs: 900 },
  { id: 7, label: 'Final Quality Review', description: 'Running grammar & readability check', durationMs: 700 },
]

// 5. Detailed Score Breakdown
export const mockScoreBreakdown: MockScoreBreakdown = {
  overallScore: 92,
  readability: 94,
  professionalTone: 91,
  atsCompatibility: 89,
  grammar: 98,
  structure: 93,
  keywordsMatch: 89,
  benchmarkText: 'Top 14% of candidate submissions',
}

// 6. Keywords Matched & Missing
export const mockKeywordItems: MockKeywordItem[] = [
  { name: 'Machine Learning', status: 'matched', relevance: 'Critical' },
  { name: 'Python', status: 'matched', relevance: 'Critical' },
  { name: 'TensorFlow', status: 'matched', relevance: 'High' },
  { name: 'Deep Learning', status: 'matched', relevance: 'High' },
  { name: 'Data Analysis', status: 'matched', relevance: 'Medium' },
  { name: 'NLP', status: 'matched', relevance: 'High' },
  { name: 'AI Models', status: 'matched', relevance: 'High' },
  { name: 'Scalability', status: 'matched', relevance: 'Medium' },
  { name: 'PyTorch', status: 'matched', relevance: 'High' },
  { name: 'Scikit-Learn', status: 'matched', relevance: 'Medium' },
  { name: 'MLOps', status: 'matched', relevance: 'High' },
  { name: 'SQL', status: 'matched', relevance: 'Medium' },
  { name: 'Kubernetes', status: 'missing', relevance: 'Medium' },
  { name: 'Vector Databases', status: 'missing', relevance: 'High' },
  { name: 'System Design', status: 'missing', relevance: 'Critical' },
]

// 7. Smart Suggestions
export const mockSmartSuggestions: MockSmartSuggestion[] = [
  {
    id: 'sug-1',
    category: 'Missing Achievements',
    title: 'Add a specific achievement',
    description: 'Include a quantifiable metric (e.g. "improved inference speed by 25%").',
    impactBadge: '+8 Impact',
    applied: false,
  },
  {
    id: 'sug-2',
    category: 'Weak Action Verbs',
    title: 'Strengthen action verbs',
    description: 'Replace "worked on" with stronger verbs like "engineered" or "orchestrated".',
    impactBadge: '+6 Clarity',
    applied: false,
  },
  {
    id: 'sug-3',
    category: 'Long Paragraphs',
    title: 'Optimize paragraph length',
    description: 'Break body paragraph 1 into two concise sections for faster recruiter scanning.',
    impactBadge: '+5 Readability',
    applied: false,
  },
  {
    id: 'sug-4',
    category: 'Passive Voice Warnings',
    title: 'Reduce passive voice usage',
    description: 'Convert "models were developed by me" to active voice "I engineered machine learning models".',
    impactBadge: '+4 Tone',
    applied: false,
  },
]

// 8. Template Options
export const mockTemplates: MockTemplate[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean, balanced font hierarchy with subtle purple branding accents.',
    category: 'Modern',
    badge: 'Popular',
  },
  {
    id: 'professional',
    name: 'Classic Corporate',
    description: 'Standard single-column corporate layout with traditional serif fonts.',
    category: 'Professional',
  },
  {
    id: 'executive',
    name: 'Executive Leadership',
    description: 'Bold header section, emphasis on leadership impact and key highlights.',
    category: 'Executive',
  },
  {
    id: 'minimal',
    name: 'Creative Minimal',
    description: 'Sleek, lightweight typography tailored for tech startups and designers.',
    category: 'Minimal',
  },
  {
    id: 'creative',
    name: 'Bold Impact',
    description: 'Modern two-accent color header with prominent contact icons.',
    category: 'Creative',
  },
]

// 9. AI Assistant Chat Prompts & Responses
export const mockAssistantResponses: Record<string, string> = {
  'Strengthen opening':
    'I recommend opening with a strong hook: "Driven by a passion for building scalable neural networks, I am excited to apply for the AI/ML Engineer role at Google."',
  'Add measurable achievements':
    'Here is an achievement tweak: "Engineered deep learning pipelines that enhanced model prediction accuracy from 88% to 94.2% while reducing memory overhead by 30%."',
  'Improve closing':
    'Try a confident closing: "I look forward to discussing how my experience in PyTorch and MLOps can contribute to Google’s next-generation AI platforms."',
  'Increase keyword relevance':
    'Added missing high-priority keywords: Vector Databases, System Design, and Kubernetes integration into body paragraph 2.',
}

// 10. AI Tool Transformation Text Presets
export const mockToolTransformations: Record<
  string,
  { intro: string; body1: string; body2: string; closing: string }
> = {
  'improve-writing': {
    intro:
      'I am thrilled to submit my candidate application for the AI/ML Engineer position at Google. Driven by a deep commitment to artificial intelligence research and practical software delivery, I look forward to adding value to Google’s core engineering team.',
    body1:
      'Throughout my academic specialization in Artificial Intelligence & Data Science, I designed scalable computer vision algorithms—including a Deepfake Video Detector with 94.2% accuracy—and built an NLP AI Investment Assistant. My daily stack encompasses Python, PyTorch, TensorFlow, and MLOps.',
    body2:
      'Google’s pioneering research in large-scale machine learning aligns seamlessly with my aspiration to engineer high-impact AI infrastructure.',
    closing:
      'Thank you for your review. I look forward to an opportunity to present how my engineering skills fit Google’s technical roadmap.',
  },
  'make-professional': {
    intro:
      'Please accept this letter as formal expression of my interest in the AI/ML Engineer role at Google. With advanced training in Artificial Intelligence and empirical software engineering experience, I offer technical proficiency across deep neural networks and production data pipelines.',
    body1:
      'My technical achievements include architecting a Deepfake Video Detector utilizing convolutional neural networks and developing an NLP Investment Assistant. I possess advanced competence in Python, PyTorch, TensorFlow, and SQL data modeling.',
    body2:
      'Google’s institutional commitment to technical excellence and responsible AI deployment reflects my professional principles.',
    closing:
      'I appreciate your consideration and welcome the opportunity to discuss my qualifications during an interview.',
  },
  shorten: {
    intro:
      'I am excited to apply for the AI/ML Engineer position at Google, bringing hands-on experience in PyTorch, TensorFlow, and production ML pipelines.',
    body1:
      'Key accomplishments include engineering a 94.2% accurate Deepfake Video Detector and building an NLP AI Investment Assistant using Python and SQL.',
    body2:
      'I am inspired by Google’s AI vision and eager to contribute to scalable machine learning systems.',
    closing:
      'Thank you for your consideration. I look forward to discussing my background.',
  },
  expand: {
    intro:
      'I am writing with immense enthusiasm to apply for the AI/ML Engineer position at Google. Having recently graduated with honors in Artificial Intelligence and Data Science, I have dedicated my career to mastering deep neural network architectures, distributed model training, and low-latency inference pipelines.',
    body1:
      'Over the past two years, I led the technical implementation of two flagship projects: a computer vision Deepfake Video Detector (achieving 94.2% validation accuracy across 50,000 video samples) and a conversational NLP AI Investment Assistant. My core technical toolkit includes Python, PyTorch, TensorFlow, scikit-learn, MLOps, SQL, and Docker containerization.',
    body2:
      'Google’s legendary engineering culture and leadership in foundational AI models provide an ideal platform for me to deploy scalable neural systems that solve real-world problems for millions of users worldwide.',
    closing:
      'Thank you for reviewing my credentials. I welcome the privilege of interviewing with your team to detail how my problem-solving drive aligns with Google’s research roadmap.',
  },
  'fix-grammar': {
    intro:
      'I am writing to express my strong interest in the AI/ML Engineer position at Google. As a graduate in Artificial Intelligence and Data Science with hands-on technical experience building intelligent systems, I am eager to leverage my skills to drive innovation at Google.',
    body1:
      'During my academic journey, I developed a Deepfake Video Detector using convolutional neural networks and an AI Investment Assistant using NLP models. My technical skills include Python, TensorFlow, PyTorch, scikit-learn, and SQL.',
    body2:
      'Google’s commitment to organizing the world’s information inspires me, and I am eager to contribute to Google’s machine learning initiatives.',
    closing:
      'Thank you for considering my application. I look forward to discussing how my skills align with Google’s engineering vision.',
  },
  'add-keywords': {
    intro:
      'I am writing to apply for the AI/ML Engineer role at Google, bringing deep technical skills in Deep Learning, PyTorch, MLOps, Vector Databases, and System Design.',
    body1:
      'I engineered a Deepfake Video Detector with 94.2% accuracy using PyTorch and built an NLP AI Investment Assistant utilizing Vector Databases and SQL data pipelines.',
    body2:
      'My background in distributed System Design and Kubernetes container orchestration prepares me to build scalable AI systems at Google.',
    closing:
      'Thank you for your time. I look forward to discussing my technical alignment with Google.',
  },
  'ats-optimization': {
    intro:
      'Application for AI/ML Engineer (Req #2026-AI) at Google. Candidate background includes B.S. Artificial Intelligence & Data Science, Python, PyTorch, TensorFlow, and MLOps.',
    body1:
      'Technical Experience: Engineered Deepfake Video Detector (94.2% accuracy) and AI Investment Assistant utilizing Python, TensorFlow, PyTorch, scikit-learn, and SQL.',
    body2:
      'Role Alignment: Qualified for AI/ML Engineer responsibilities including neural model deployment, data pipeline optimization, and scalable software design at Google.',
    closing:
      'Contact candidate Dipak Khandagale at dipak@scorelia.ai for interview scheduling.',
  },
  'stronger-closing': {
    intro:
      'I am writing to express my strong enthusiasm for the AI/ML Engineer position at Google.',
    body1:
      'My technical repertoire includes Python, PyTorch, TensorFlow, and building production neural networks with proven 94.2% classification accuracy.',
    body2:
      'Google’s commitment to AI research aligns with my dedication to building scalable intelligent systems.',
    closing:
      'I am confident that my technical rigor and proactive problem-solving mindset make me an immediate value-add for Google. I look forward to scheduling a technical interview at your earliest convenience.',
  },
}

// 11. Mock Generation History
export const mockGenerationLogs: GenerationHistoryLog[] = [
  {
    id: 'gen-1',
    timestamp: 'Just now',
    templateName: 'Modern Professional',
    tone: 'Professional',
    atsScore: 92,
    versionLabel: 'v1',
    companyName: 'Google',
    jobTitle: 'AI/ML Engineer',
  },
  {
    id: 'gen-2',
    timestamp: '10 mins ago',
    templateName: 'Creative Minimal',
    tone: 'Persuasive',
    atsScore: 89,
    versionLabel: 'v2',
    companyName: 'Google',
    jobTitle: 'AI/ML Engineer',
  },
  {
    id: 'gen-3',
    timestamp: '25 mins ago',
    templateName: 'Executive Leadership',
    tone: 'Executive',
    atsScore: 95,
    versionLabel: 'v3',
    companyName: 'Google',
    jobTitle: 'AI/ML Engineer',
  },
  {
    id: 'gen-4',
    timestamp: 'Yesterday',
    templateName: 'Classic Corporate',
    tone: 'Formal',
    atsScore: 88,
    versionLabel: 'v1.1',
    companyName: 'Microsoft',
    jobTitle: 'Senior Frontend Engineer',
  },
]
