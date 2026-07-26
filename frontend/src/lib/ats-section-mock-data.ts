export interface ResumeSectionNavItem {
  id: string
  name: string
  score: number
  status: 'Pass' | 'Warning' | 'Needs Work' | 'Excellent'
  issueCount: number
  category: string
}

export interface SectionKeywordItem {
  id: string
  keyword: string
  category: 'matched' | 'missing' | 'suggested'
  frequency: number
  importance: 'High' | 'Medium' | 'Low'
}

export interface SectionFormatCheckItem {
  id: string
  title: string
  rule: string
  status: 'pass' | 'warning' | 'fail'
  details: string
  tip: string
}

export interface SectionQualityItem {
  name: string
  score: number
  description: string
  recommendation: string
}

export interface SectionTimelineItem {
  id: string
  stepNumber: number
  title: string
  priority: 'High' | 'Medium' | 'Low'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  estimatedImpact: string
  estimatedTime: string
  description: string
}

export interface SectionDetailData {
  id: string
  name: string
  score: number
  status: string
  summary: string
  recruiterNotes: string
  atsNotes: string
  keywords: SectionKeywordItem[]
  formattingChecks: SectionFormatCheckItem[]
  contentQuality: SectionQualityItem[]
  currentContent: string
  suggestedRewrite: string
  timeline: SectionTimelineItem[]
  quickTips: string[]
}

export const mockSectionsList: ResumeSectionNavItem[] = [
  { id: 'sec-contact', name: 'Contact Information', score: 95, status: 'Pass', issueCount: 0, category: 'Header' },
  { id: 'sec-summary', name: 'Professional Summary', score: 95, status: 'Pass', issueCount: 1, category: 'Summary' },
  { id: 'sec-experience', name: 'Work Experience', score: 92, status: 'Pass', issueCount: 2, category: 'Experience' },
  { id: 'sec-education', name: 'Education', score: 98, status: 'Excellent', issueCount: 0, category: 'Education' },
  { id: 'sec-projects', name: 'Key Projects', score: 88, status: 'Warning', issueCount: 2, category: 'Projects' },
  { id: 'sec-skills', name: 'Technical & Soft Skills', score: 90, status: 'Pass', issueCount: 1, category: 'Skills' },
  { id: 'sec-certifications', name: 'Certifications', score: 95, status: 'Pass', issueCount: 0, category: 'Certifications' },
  { id: 'sec-languages', name: 'Languages', score: 100, status: 'Excellent', issueCount: 0, category: 'Languages' },
]

export const mockSectionDetailsMap: Record<string, SectionDetailData> = {
  'sec-contact': {
    id: 'sec-contact',
    name: 'Contact Information',
    score: 95,
    status: 'Pass',
    summary: 'Contact block contains clear email, location, phone number, and plain text GitHub profile URL.',
    recruiterNotes: 'Header is crisp and easy to find immediately. Phone format is clean.',
    atsNotes: 'Contact data parsed with 100% token extraction accuracy across Workday, Greenhouse, and Lever.',
    keywords: [
      { id: 'ck-1', keyword: 'San Francisco, CA', category: 'matched', frequency: 1, importance: 'High' },
      { id: 'ck-2', keyword: 'github.com/Dipakk7', category: 'matched', frequency: 1, importance: 'High' },
      { id: 'ck-3', keyword: 'LinkedIn Profile', category: 'suggested', frequency: 0, importance: 'Medium' },
    ],
    formattingChecks: [
      { id: 'cf-1', title: 'Heading', rule: 'Standard Name Header', status: 'pass', details: 'Full name formatted in bold 20pt font.', tip: 'Keep header centered or left-aligned.' },
      { id: 'cf-2', title: 'Font', rule: 'Sans-Serif Inter/Arial', status: 'pass', details: 'Clean standard typography.', tip: 'Avoid script fonts.' },
      { id: 'cf-3', title: 'Spacing', rule: '12pt Top Margin', status: 'pass', details: 'Proper top margin spacing.', tip: 'Do not crowd top margin.' },
      { id: 'cf-4', title: 'Bullet Points', rule: 'Not Applicable', status: 'pass', details: 'Clean single-line layout.', tip: 'Separate items with pipes or dots.' },
      { id: 'cf-5', title: 'Dates', rule: 'Not Applicable', status: 'pass', details: 'No dates in contact block.', tip: 'Keep dates in Experience section.' },
      { id: 'cf-6', title: 'Alignment', rule: 'Left Aligned', status: 'pass', details: 'Consistent left border alignment.', tip: 'Matches document margins.' },
      { id: 'cf-7', title: 'Consistency', rule: 'Plain Text Links', status: 'pass', details: 'Hyperlinks include plain text fallback.', tip: 'Always include text link.' },
    ],
    contentQuality: [
      { name: 'Clarity', score: 98, description: 'Direct and readable contact information.', recommendation: 'Header is optimal.' },
      { name: 'Impact', score: 90, description: 'Links directly to GitHub portfolio.', recommendation: 'Add LinkedIn short URL.' },
      { name: 'Relevance', score: 95, description: 'Includes location matching target job city.', recommendation: 'Include target work authorization status if applicable.' },
    ],
    currentContent: `DIPAK KHANDAGALE\nAI/ML & Lead Full Stack Engineer\ndipak.khandagale@scorelia.ai | +1 (555) 019-2834 | San Francisco, CA | github.com/Dipakk7`,
    suggestedRewrite: `DIPAK KHANDAGALE\nSenior Full Stack & AI Systems Engineer\ndipak.khandagale@scorelia.ai | +1 (555) 019-2834 | San Francisco, CA\nGitHub: github.com/Dipakk7 | LinkedIn: linkedin.com/in/dipak-khandagale`,
    timeline: [
      { id: 'ctl-1', stepNumber: 1, title: 'Add LinkedIn Profile URL', priority: 'Medium', difficulty: 'Easy', estimatedImpact: '+2 ATS Score', estimatedTime: '2 mins', description: 'Add plain text LinkedIn vanity URL to header.' },
    ],
    quickTips: ['Keep contact information in the body text area, not in header/footer document margins.'],
  },
  'sec-summary': {
    id: 'sec-summary',
    name: 'Professional Summary',
    score: 95,
    status: 'Pass',
    summary: 'High-impact summary establishing senior engineering leadership, core tech stack, and 6+ years experience.',
    recruiterNotes: 'Summary delivers immediate value proposition and technical authority.',
    atsNotes: 'Primary job title matching score is 98%.',
    keywords: [
      { id: 'sk-1', keyword: 'Full Stack Engineer', category: 'matched', frequency: 2, importance: 'High' },
      { id: 'sk-2', keyword: 'React 19', category: 'matched', frequency: 1, importance: 'High' },
      { id: 'sk-3', keyword: 'TypeScript', category: 'matched', frequency: 1, importance: 'High' },
      { id: 'sk-4', keyword: 'RAG Pipelines', category: 'matched', frequency: 1, importance: 'High' },
      { id: 'sk-5', keyword: 'PyTorch', category: 'missing', frequency: 0, importance: 'High' },
      { id: 'sk-6', keyword: 'Distributed Systems', category: 'suggested', frequency: 0, importance: 'Medium' },
    ],
    formattingChecks: [
      { id: 'sf-1', title: 'Heading', rule: 'PROFESSIONAL SUMMARY', status: 'pass', details: 'Standard uppercase heading.', tip: 'Heading is 100% recognized by ATS.' },
      { id: 'sf-2', title: 'Font', rule: '10.5pt Regular', status: 'pass', details: 'Readable body font size.', tip: 'Keep paragraph under 4 lines.' },
      { id: 'sf-3', title: 'Spacing', rule: '1.15 Line Height', status: 'pass', details: 'Clean paragraph spacing.', tip: 'Maintain 6pt space after.' },
      { id: 'sf-4', title: 'Bullet Points', rule: 'Paragraph Block', status: 'pass', details: 'Standard short narrative style.', tip: 'Use narrative rather than bullets for summary.' },
      { id: 'sf-5', title: 'Dates', rule: 'Not Applicable', status: 'pass', details: 'No dates in summary.', tip: 'Keep years of experience numerical.' },
      { id: 'sf-6', title: 'Alignment', rule: 'Justified / Left', status: 'pass', details: 'Left aligned paragraph text.', tip: 'Matches page flow.' },
      { id: 'sf-7', title: 'Consistency', rule: 'Active Verbs', status: 'pass', details: 'Strong action lead words.', tip: 'Maintain active voice.' },
    ],
    contentQuality: [
      { name: 'Clarity', score: 95, description: 'Concise summary of experience and tools.', recommendation: 'Include PyTorch keyword.' },
      { name: 'Impact', score: 94, description: 'Strong active language.', recommendation: 'Add target domain emphasis.' },
      { name: 'Action Verbs', score: 96, description: 'Led with "Results-driven", "engineering", "architecting".', recommendation: 'Keep action verbs active.' },
      { name: 'Quantified Results', score: 90, description: 'Mentions "6+ years experience".', recommendation: 'Add scale metric (e.g. 100k+ users).' },
      { name: 'Relevance', score: 95, description: '95% alignment with target senior engineer job description.', recommendation: 'Add PyTorch.' },
    ],
    currentContent: `Results-driven AI/ML & Senior Full Stack Engineer with 6+ years of experience engineering scalable web applications, RAG pipelines, and intelligent AI career tools. Expert in React 19, TypeScript, Python, FastAPI, and PyTorch.`,
    suggestedRewrite: `Results-driven AI/ML & Senior Full Stack Engineer with 6+ years of experience engineering scalable web applications, RAG vector pipelines, and distributed AI systems handling 100k+ users. Core expertise in React 19, TypeScript, Python, FastAPI, PyTorch, and cloud architecture.`,
    timeline: [
      { id: 'stl-1', stepNumber: 1, title: 'Inject PyTorch & RAG Vector Keywords', priority: 'High', difficulty: 'Easy', estimatedImpact: '+4 ATS Score', estimatedTime: '3 mins', description: 'Explicitly mention PyTorch and vector search pipelines in summary.' },
    ],
    quickTips: ['Keep summary between 3-4 lines maximum for fast recruiter scanning.'],
  },
  'sec-experience': {
    id: 'sec-experience',
    name: 'Work Experience',
    score: 92,
    status: 'Pass',
    summary: 'Strong experience section featuring 2 roles, clear chronological dates, and 85% quantified bullet points.',
    recruiterNotes: 'Chronological timeline is clear. Metric impact ($ / %) stands out immediately.',
    atsNotes: 'Role titles and date ranges parsed with 97% accuracy.',
    keywords: [
      { id: 'ek-1', keyword: 'Lead AI Engineer', category: 'matched', frequency: 1, importance: 'High' },
      { id: 'ek-2', keyword: 'Senior Frontend Developer', category: 'matched', frequency: 1, importance: 'High' },
      { id: 'ek-3', keyword: 'RAG Vector Search', category: 'matched', frequency: 2, importance: 'High' },
      { id: 'ek-4', keyword: 'Qdrant / LangChain', category: 'matched', frequency: 2, importance: 'High' },
      { id: 'ek-5', keyword: 'PyTorch Model Training', category: 'missing', frequency: 0, importance: 'High' },
      { id: 'ek-6', keyword: 'CI/CD Automated Deployment', category: 'suggested', frequency: 0, importance: 'Medium' },
    ],
    formattingChecks: [
      { id: 'ef-1', title: 'Heading', rule: 'WORK EXPERIENCE', status: 'pass', details: 'Standard uppercase section heading.', tip: 'Heading is recognized.' },
      { id: 'ef-2', title: 'Font', rule: '10.5pt Regular', status: 'pass', details: 'Consistent font family.', tip: 'Bold company names and titles.' },
      { id: 'ef-3', title: 'Spacing', rule: '6pt Paragraph Space', status: 'pass', details: 'Clean margin spacing between jobs.', tip: 'Maintain space.' },
      { id: 'ef-4', title: 'Bullet Points', rule: 'Standard Disc Bullets', status: 'pass', details: 'Consistent bullet characters.', tip: 'Do not use custom icons.' },
      { id: 'ef-5', title: 'Dates', rule: '2024 - Present / 2021 - 2024', status: 'pass', details: 'Standard ISO year range formatting.', tip: 'Include month format (e.g. Jan 2024 - Present).' },
      { id: 'ef-6', title: 'Alignment', rule: 'Left Aligned with Right Dates', status: 'pass', details: 'Clean date alignment on right border.', tip: 'Right align dates.' },
      { id: 'ef-7', title: 'Consistency', rule: 'Action Verb Bullets', status: 'pass', details: '100% bullet points begin with active verbs.', tip: 'Maintain past/present tense.' },
    ],
    contentQuality: [
      { name: 'Clarity', score: 94, description: 'Clear responsibilities and technical achievements.', recommendation: 'Add month dates.' },
      { name: 'Impact', score: 95, description: 'Quantified results (98% parsing accuracy, 100k+ users).', recommendation: 'Quantify team size.' },
      { name: 'Action Verbs', score: 98, description: 'Led with "Engineered", "Architected", "Led".', recommendation: 'Keep power verbs.' },
      { name: 'Quantified Results', score: 88, description: '85% of bullets contain metrics.', recommendation: 'Add metric to 2nd bullet under TechScale.' },
      { name: 'Relevance', score: 92, description: 'High alignment with senior engineering expectations.', recommendation: 'Add PyTorch bullet.' },
    ],
    currentContent: `Lead AI Engineer | Scorelia Career Intelligence Inc. | 2024 - Present\n• Engineered full-stack ATS analysis module increasing resume parsing accuracy to 98% across enterprise systems.\n• Architected RAG vector search workspace using FastAPI, Qdrant, and LangChain handling 100k+ candidate profiles.\n\nSenior Frontend Developer | TechScale Solutions | 2021 - 2024\n• Led team of 5 engineers building responsive React applications with 99.9% uptime.`,
    suggestedRewrite: `Lead AI Engineer | Scorelia Career Intelligence Inc. | Jan 2024 - Present\n• Engineered full-stack ATS analysis module increasing resume parsing accuracy to 98% across enterprise ATS platforms.\n• Architected RAG vector search workspace using FastAPI, PyTorch, Qdrant, and LangChain, reducing query latency by 45% for 100k+ candidate profiles.\n\nSenior Frontend Developer | TechScale Solutions | Mar 2021 - Jan 2024\n• Led engineering team of 5 building high-availability React/TypeScript applications with 99.9% uptime for 250k monthly active users.`,
    timeline: [
      { id: 'etl-1', stepNumber: 1, title: 'Add Month-Year Date Formatting', priority: 'High', difficulty: 'Easy', estimatedImpact: '+3 ATS Score', estimatedTime: '3 mins', description: 'Change "2024 - Present" to "Jan 2024 - Present" for exact experience indexing.' },
      { id: 'etl-2', stepNumber: 2, title: 'Inject Latency Reduction Metric', priority: 'Medium', difficulty: 'Easy', estimatedImpact: '+2 ATS Score', estimatedTime: '4 mins', description: 'Add "reducing query latency by 45%" to RAG vector search bullet point.' },
    ],
    quickTips: ['Always use month-year formats (e.g. Jan 2024 - Present) for accurate work duration calculation.'],
  },
  'sec-education': {
    id: 'sec-education',
    name: 'Education',
    score: 98,
    status: 'Excellent',
    summary: 'Education section is 100% parsed with zero errors.',
    recruiterNotes: 'B.S. in Computer Science verified.',
    atsNotes: 'Degree name and university parsed with 100% accuracy.',
    keywords: [
      { id: 'edk-1', keyword: 'B.S. Computer Science', category: 'matched', frequency: 1, importance: 'High' },
      { id: 'edk-2', keyword: 'Software Engineering', category: 'matched', frequency: 1, importance: 'High' },
    ],
    formattingChecks: [
      { id: 'edf-1', title: 'Heading', rule: 'EDUCATION', status: 'pass', details: 'Standard heading.', tip: 'Heading is recognized.' },
      { id: 'edf-2', title: 'Font', rule: '10.5pt Regular', status: 'pass', details: 'Clean font layout.', tip: 'Keep clean.' },
      { id: 'edf-3', title: 'Spacing', rule: 'Standard Spacing', status: 'pass', details: 'Proper spacing.', tip: 'Keep clean.' },
      { id: 'edf-4', title: 'Bullet Points', rule: 'Not Applicable', status: 'pass', details: 'No bullets needed.', tip: 'Keep clean.' },
      { id: 'edf-5', title: 'Dates', rule: 'Graduation Year', status: 'pass', details: 'Standard year.', tip: 'Keep clean.' },
      { id: 'edf-6', title: 'Alignment', rule: 'Left Aligned', status: 'pass', details: 'Aligned correctly.', tip: 'Keep clean.' },
      { id: 'edf-7', title: 'Consistency', rule: 'Standard Degree Format', status: 'pass', details: 'Standard format.', tip: 'Keep clean.' },
    ],
    contentQuality: [
      { name: 'Clarity', score: 100, description: '100% clear degree and university formatting.', recommendation: 'Education section is optimal.' },
      { name: 'Impact', score: 96, description: 'B.S. in CS matches target job degree requirements.', recommendation: 'Keep clean.' },
      { name: 'Relevance', score: 100, description: '100% relevant degree.', recommendation: 'Optimal.' },
    ],
    currentContent: `Bachelor of Science in Computer Science | California State University | Graduated 2021`,
    suggestedRewrite: `Bachelor of Science in Computer Science | California State University | 2017 - 2021`,
    timeline: [],
    quickTips: ['Place Education below Experience for candidates with 3+ years experience.'],
  },
  'sec-projects': {
    id: 'sec-projects',
    name: 'Key Projects',
    score: 88,
    status: 'Warning',
    summary: 'Projects section contains high-value AI applications but lacks explicit architecture tags.',
    recruiterNotes: 'Project scope is impressive. Add live links.',
    atsNotes: 'Project heading parsed cleanly.',
    keywords: [
      { id: 'pk-1', keyword: 'RAG Career Workspace', category: 'matched', frequency: 1, importance: 'High' },
      { id: 'pk-2', keyword: 'FastAPI / React', category: 'matched', frequency: 1, importance: 'High' },
      { id: 'pk-3', keyword: 'System Architecture', category: 'missing', frequency: 0, importance: 'Medium' },
    ],
    formattingChecks: [
      { id: 'pf-1', title: 'Heading', rule: 'KEY PROJECTS', status: 'pass', details: 'Standard heading.', tip: 'Recognized.' },
      { id: 'pf-2', title: 'Font', rule: '10.5pt Regular', status: 'pass', details: 'Consistent.', tip: 'Keep clean.' },
      { id: 'pf-3', title: 'Spacing', rule: 'Standard', status: 'pass', details: 'Clean spacing.', tip: 'Keep clean.' },
      { id: 'pf-4', title: 'Bullet Points', rule: 'Disc Bullets', status: 'warning', details: '1 bullet lacks bold tech stack prefix.', tip: 'Prefix bullets with tech stack.' },
      { id: 'pf-5', title: 'Dates', rule: '2024', status: 'pass', details: 'Year listed.', tip: 'Keep clean.' },
      { id: 'pf-6', title: 'Alignment', rule: 'Left Aligned', status: 'pass', details: 'Aligned.', tip: 'Keep clean.' },
      { id: 'pf-7', title: 'Consistency', rule: 'Project Links', status: 'warning', details: 'GitHub project repository URL missing.', tip: 'Include repository link.' },
    ],
    contentQuality: [
      { name: 'Clarity', score: 90, description: 'Clear project descriptions.', recommendation: 'Add GitHub link.' },
      { name: 'Impact', score: 86, description: 'Good impact statement.', recommendation: 'Add metric user count.' },
      { name: 'Action Verbs', score: 90, description: 'Built, engineered.', recommendation: 'Keep active.' },
      { name: 'Quantified Results', score: 82, description: 'Needs user scale metric.', recommendation: 'Add user metric.' },
      { name: 'Relevance', score: 92, description: 'High AI project relevance.', recommendation: 'Add PyTorch.' },
    ],
    currentContent: `RAG AI Career Intelligence Platform | 2024\n• Built multi-agent RAG career workspace using React, FastAPI, and Qdrant.`,
    suggestedRewrite: `RAG AI Career Intelligence Platform | github.com/Dipakk7/scorelia | 2024\n• Engineered multi-agent RAG career workspace using React 19, TypeScript, FastAPI, PyTorch, and Qdrant, serving 10k+ active queries.`,
    timeline: [
      { id: 'ptl-1', stepNumber: 1, title: 'Add Project Repository URL', priority: 'High', difficulty: 'Easy', estimatedImpact: '+4 ATS Score', estimatedTime: '2 mins', description: 'Add plain text GitHub URL to project heading.' },
    ],
    quickTips: ['Prefix project bullets with bold tech stack tags (e.g. Tech Stack: React, FastAPI, PyTorch).'],
  },
  'sec-skills': {
    id: 'sec-skills',
    name: 'Technical & Soft Skills',
    score: 90,
    status: 'Pass',
    summary: 'Technical skills section contains high-value keywords but can be grouped into sub-categories.',
    recruiterNotes: 'Strong skill breadth across AI and Full Stack.',
    atsNotes: 'Skills indexed with 94% accuracy.',
    keywords: [
      { id: 'skk-1', keyword: 'React 19', category: 'matched', frequency: 1, importance: 'High' },
      { id: 'skk-2', keyword: 'TypeScript', category: 'matched', frequency: 1, importance: 'High' },
      { id: 'skk-3', keyword: 'PyTorch', category: 'missing', frequency: 0, importance: 'High' },
    ],
    formattingChecks: [
      { id: 'skf-1', title: 'Heading', rule: 'TECHNICAL SKILLS', status: 'pass', details: 'Standard heading.', tip: 'Recognized.' },
      { id: 'skf-2', title: 'Font', rule: '10.5pt Regular', status: 'pass', details: 'Clean font.', tip: 'Keep clean.' },
      { id: 'skf-3', title: 'Spacing', rule: 'Standard', status: 'pass', details: 'Proper spacing.', tip: 'Keep clean.' },
      { id: 'skf-4', title: 'Bullet Points', rule: 'Category Headers', status: 'warning', details: 'Currently listed as plain comma list.', tip: 'Group by sub-category.' },
      { id: 'skf-5', title: 'Dates', rule: 'Not Applicable', status: 'pass', details: 'No dates.', tip: 'Keep clean.' },
      { id: 'skf-6', title: 'Alignment', rule: 'Left Aligned', status: 'pass', details: 'Aligned.', tip: 'Keep clean.' },
      { id: 'skf-7', title: 'Consistency', rule: 'Taxonomy Category', status: 'pass', details: 'Standard terms.', tip: 'Keep clean.' },
    ],
    contentQuality: [
      { name: 'Clarity', score: 92, description: 'Clear skill listing.', recommendation: 'Group into categories.' },
      { name: 'Impact', score: 90, description: 'High technical relevance.', recommendation: 'Add PyTorch.' },
      { name: 'Relevance', score: 94, description: 'Matches senior job requirements.', recommendation: 'Optimal.' },
    ],
    currentContent: `Languages & Frameworks: React 19, TypeScript, JavaScript, Python, Node.js, FastAPI, GraphQL, HTML5, CSS3, Tailwind CSS, Docker, PostgreSQL, Qdrant, Git, REST API`,
    suggestedRewrite: `Languages: TypeScript, Python, JavaScript, HTML5, CSS3, SQL\nFrameworks & Libraries: React 19, FastAPI, PyTorch, Node.js, GraphQL, Tailwind CSS\nDatabases & Cloud: Qdrant Vector DB, PostgreSQL, Docker, AWS, Git, REST API`,
    timeline: [
      { id: 'sktl-1', stepNumber: 1, title: 'Group Skills by Sub-Categories', priority: 'High', difficulty: 'Easy', estimatedImpact: '+4 ATS Score', estimatedTime: '3 mins', description: 'Group skills into Languages, Frameworks, and Databases & Cloud.' },
    ],
    quickTips: ['Group skills into 3-4 sub-categories for 18% better ATS token indexing.'],
  },
  'sec-certifications': {
    id: 'sec-certifications',
    name: 'Certifications',
    score: 95,
    status: 'Pass',
    summary: 'Certifications section is clear and recognized.',
    recruiterNotes: 'AWS & Deep Learning certifications verified.',
    atsNotes: 'Certifications parsed cleanly.',
    keywords: [
      { id: 'ckk-1', keyword: 'AWS Certified Developer', category: 'matched', frequency: 1, importance: 'High' },
      { id: 'ckk-2', keyword: 'DeepLearning.AI Specialization', category: 'matched', frequency: 1, importance: 'High' },
    ],
    formattingChecks: [
      { id: 'ckf-1', title: 'Heading', rule: 'CERTIFICATIONS', status: 'pass', details: 'Standard heading.', tip: 'Recognized.' },
      { id: 'ckf-2', title: 'Font', rule: '10.5pt', status: 'pass', details: 'Clean font.', tip: 'Keep clean.' },
      { id: 'ckf-3', title: 'Spacing', rule: 'Standard', status: 'pass', details: 'Clean.', tip: 'Keep clean.' },
      { id: 'ckf-4', title: 'Bullet Points', rule: 'Disc Bullets', status: 'pass', details: 'Clean bullets.', tip: 'Keep clean.' },
      { id: 'ckf-5', title: 'Dates', rule: 'Issue Year', status: 'pass', details: 'Year listed.', tip: 'Keep clean.' },
      { id: 'ckf-6', title: 'Alignment', rule: 'Left Aligned', status: 'pass', details: 'Aligned.', tip: 'Keep clean.' },
      { id: 'ckf-7', title: 'Consistency', rule: 'Issuer Listed', status: 'pass', details: 'Issuer listed.', tip: 'Keep clean.' },
    ],
    contentQuality: [
      { name: 'Clarity', score: 96, description: 'Clear certification credentials.', recommendation: 'Optimal.' },
      { name: 'Impact', score: 94, description: 'High AWS & AI value.', recommendation: 'Keep updated.' },
      { name: 'Relevance', score: 96, description: '100% relevant.', recommendation: 'Optimal.' },
    ],
    currentContent: `• AWS Certified Developer – Associate | Amazon Web Services (2023)\n• Deep Learning Specialization | DeepLearning.AI (2023)`,
    suggestedRewrite: `• AWS Certified Developer – Associate | Amazon Web Services | 2023\n• Deep Learning Specialization | DeepLearning.AI | 2023`,
    timeline: [],
    quickTips: ['Always include issuing organization name for credential verification.'],
  },
  'sec-languages': {
    id: 'sec-languages',
    name: 'Languages',
    score: 100,
    status: 'Excellent',
    summary: 'Languages section parsed with 100% accuracy.',
    recruiterNotes: 'English (Native/Professional) verified.',
    atsNotes: 'Languages section 100% recognized.',
    keywords: [
      { id: 'lk-1', keyword: 'English', category: 'matched', frequency: 1, importance: 'High' },
    ],
    formattingChecks: [
      { id: 'lf-1', title: 'Heading', rule: 'LANGUAGES', status: 'pass', details: 'Standard heading.', tip: 'Recognized.' },
      { id: 'lf-2', title: 'Font', rule: '10.5pt', status: 'pass', details: 'Clean font.', tip: 'Keep clean.' },
      { id: 'lf-3', title: 'Spacing', rule: 'Standard', status: 'pass', details: 'Clean.', tip: 'Keep clean.' },
      { id: 'lf-4', title: 'Bullet Points', rule: 'Not Applicable', status: 'pass', details: 'Clean.', tip: 'Keep clean.' },
      { id: 'lf-5', title: 'Dates', rule: 'Not Applicable', status: 'pass', details: 'Clean.', tip: 'Keep clean.' },
      { id: 'lf-6', title: 'Alignment', rule: 'Left Aligned', status: 'pass', details: 'Clean.', tip: 'Keep clean.' },
      { id: 'lf-7', title: 'Consistency', rule: 'Proficiency Level', status: 'pass', details: 'Clean.', tip: 'Keep clean.' },
    ],
    contentQuality: [
      { name: 'Clarity', score: 100, description: '100% clear proficiency rating.', recommendation: 'Optimal.' },
      { name: 'Impact', score: 100, description: 'Professional fluency.', recommendation: 'Optimal.' },
      { name: 'Relevance', score: 100, description: '100% relevant.', recommendation: 'Optimal.' },
    ],
    currentContent: `English (Full Professional Proficiency)`,
    suggestedRewrite: `English (Full Professional Proficiency)`,
    timeline: [],
    quickTips: ['Include proficiency levels (e.g. Native, Full Professional Proficiency).'],
  },
}
