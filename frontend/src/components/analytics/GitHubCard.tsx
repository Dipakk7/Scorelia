import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Star, GitFork, ExternalLink, BookOpen } from 'lucide-react'

interface RepoProps {
  name: string
  description: string | null
  stars: number
  forks: number
  url: string
}

interface GitHubCardProps {
  repositories: RepoProps[]
}

export function GitHubCard({ repositories }: GitHubCardProps) {
  if (!repositories || repositories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-sm">
        No repositories found.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {repositories.map((repo) => (
        <Card
          key={repo.name}
          className="border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/35 hover:bg-white/80 dark:hover:bg-slate-900/50 hover:shadow-md transition-all duration-300 group"
        >
          <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold tracking-tight text-sm truncate font-display">
                  <BookOpen size={16} className="text-slate-400 group-hover:text-brand-500 transition-colors" />
                  <span className="truncate group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                    {repo.name}
                  </span>
                </div>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  title="View repository on GitHub"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-455 line-clamp-2 min-h-[2rem]">
                {repo.description || 'No description provided.'}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/40 pt-3 text-[11px] font-semibold text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 group-hover:text-amber-500 transition-colors">
                  <Star size={12} className="fill-amber-500/10 group-hover:fill-amber-500" />
                  {repo.stars}
                </span>
                <span className="flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                  <GitFork size={12} />
                  {repo.forks}
                </span>
              </div>
              <Badge className="bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 border-none font-bold text-[9px] uppercase tracking-wide">
                Repository
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
