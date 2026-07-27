export type RepositoryHealthLevel = 'Excellent' | 'Good' | 'Average' | 'Needs Work' | 'Poor' | 'Archived'
export type RepositoryVisibility = 'Public' | 'Private'

export interface GitHubRepository {
  id: string
  name: string
  description: string
  visibility: RepositoryVisibility
  language: string
  languageColor: string
  stars: number
  forks: number
  issues: number
  pullRequests: number
  watchers: number
  lastCommit: string
  defaultBranch: string
  health: RepositoryHealthLevel
  license: string
  size: string
  updatedAt: string
}

export interface RepositoryStatsSummary {
  totalRepositories: number
  publicRepositories: number
  privateRepositories: number
  archivedRepositories: number
  forkedRepositories: number
  averageHealthScore: number
  totalStars: number
  totalForks: number
}

export const githubRepositoriesMockData: {
  summary: RepositoryStatsSummary
  repositories: GitHubRepository[]
} = {
  summary: {
    totalRepositories: 8,
    publicRepositories: 6,
    privateRepositories: 2,
    archivedRepositories: 1,
    forkedRepositories: 2,
    averageHealthScore: 88,
    totalStars: 246,
    totalForks: 43,
  },
  repositories: [
    {
      id: 'repo-1',
      name: 'scorelia',
      description: 'AI Career Intelligence Platform',
      visibility: 'Public',
      language: 'TypeScript',
      languageColor: '#3178c6',
      stars: 56,
      forks: 12,
      issues: 8,
      pullRequests: 6,
      watchers: 142,
      lastCommit: '2h ago',
      defaultBranch: 'main',
      health: 'Excellent',
      license: 'MIT',
      size: '14.2 MB',
      updatedAt: '2026-05-19',
    },
    {
      id: 'repo-2',
      name: 'careerpilot-ai',
      description: 'AI-powered career guidance system',
      visibility: 'Public',
      language: 'Python',
      languageColor: '#3572A5',
      stars: 32,
      forks: 7,
      issues: 5,
      pullRequests: 3,
      watchers: 89,
      lastCommit: '1d ago',
      defaultBranch: 'main',
      health: 'Good',
      license: 'Apache-2.0',
      size: '8.5 MB',
      updatedAt: '2026-05-18',
    },
    {
      id: 'repo-3',
      name: 'ml-projects',
      description: 'Machine learning projects collection',
      visibility: 'Public',
      language: 'Python',
      languageColor: '#3572A5',
      stars: 18,
      forks: 4,
      issues: 12,
      pullRequests: 2,
      watchers: 45,
      lastCommit: '3d ago',
      defaultBranch: 'main',
      health: 'Needs Work',
      license: 'MIT',
      size: '24.1 MB',
      updatedAt: '2026-05-16',
    },
    {
      id: 'repo-4',
      name: 'data-analysis',
      description: 'Data analysis and visualization',
      visibility: 'Private',
      language: 'Python',
      languageColor: '#3572A5',
      stars: 9,
      forks: 2,
      issues: 6,
      pullRequests: 1,
      watchers: 21,
      lastCommit: '5d ago',
      defaultBranch: 'main',
      health: 'Poor',
      license: 'Proprietary',
      size: '5.6 MB',
      updatedAt: '2026-05-14',
    },
    {
      id: 'repo-5',
      name: 'resume-parser',
      description: 'High performance ATS resume parsing service',
      visibility: 'Public',
      language: 'TypeScript',
      languageColor: '#3178c6',
      stars: 41,
      forks: 9,
      issues: 4,
      pullRequests: 5,
      watchers: 110,
      lastCommit: '12h ago',
      defaultBranch: 'main',
      health: 'Excellent',
      license: 'MIT',
      size: '4.8 MB',
      updatedAt: '2026-05-19',
    },
    {
      id: 'repo-6',
      name: 'ats-engine',
      description: 'Core matching and scoring algorithm microservice',
      visibility: 'Private',
      language: 'Go',
      languageColor: '#00ADD8',
      stars: 28,
      forks: 5,
      issues: 2,
      pullRequests: 4,
      watchers: 72,
      lastCommit: '1d ago',
      defaultBranch: 'main',
      health: 'Good',
      license: 'Proprietary',
      size: '3.2 MB',
      updatedAt: '2026-05-18',
    },
    {
      id: 'repo-7',
      name: 'scorelia-docs',
      description: 'Developer documentation and API specifications',
      visibility: 'Public',
      language: 'Markdown',
      languageColor: '#083fa1',
      stars: 15,
      forks: 3,
      issues: 1,
      pullRequests: 2,
      watchers: 38,
      lastCommit: '4d ago',
      defaultBranch: 'main',
      health: 'Excellent',
      license: 'CC-BY-4.0',
      size: '1.9 MB',
      updatedAt: '2026-05-15',
    },
    {
      id: 'repo-8',
      name: 'legacy-portfolio',
      description: 'Archived static personal website',
      visibility: 'Public',
      language: 'JavaScript',
      languageColor: '#f1e05a',
      stars: 7,
      forks: 1,
      issues: 0,
      pullRequests: 0,
      watchers: 12,
      lastCommit: '6mo ago',
      defaultBranch: 'master',
      health: 'Archived',
      license: 'MIT',
      size: '2.1 MB',
      updatedAt: '2025-11-10',
    },
  ],
}
