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
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-xs font-bold leading-none select-none text-center">
        No repositories found.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left font-sans text-xs select-none">
      {repositories.map((repo) => (
        <Card
          key={repo.name}
          className="border border-[var(--border)] bg-card/70 backdrop-blur-md rounded-[var(--radius-card)] shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300 overflow-hidden text-left font-sans text-xs group flex flex-col justify-between h-full"
        >
          <CardContent className="p-5 flex flex-col justify-between h-full gap-4 text-left">
            <div className="space-y-2 text-left">
              <div className="flex items-start justify-between text-left">
                <div className="flex items-center gap-2 text-slate-805 dark:text-slate-100 font-bold tracking-tight text-xs truncate leading-none text-left">
                  <BookOpen size={16} className="text-slate-400 group-hover:text-brand-500 transition-colors shrink-0" />
                  <span className="truncate group-hover:text-brand-500 dark:hover:text-brand-400 transition-colors leading-none">
                    {repo.name}
                  </span>
                </div>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-105 dark:hover:bg-slate-850 transition-all cursor-pointer shrink-0"
                  title="View repository on GitHub"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem] leading-normal text-left">
                {repo.description || 'No description provided.'}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--border)]/60 pt-3 text-[10px] font-bold text-slate-455 select-none leading-none">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 group-hover:text-amber-500 transition-colors leading-none font-mono">
                  <Star size={12} className="fill-amber-500/10 group-hover:fill-amber-500" />
                  {repo.stars}
                </span>
                <span className="flex items-center gap-1 group-hover:text-blue-505 transition-colors leading-none font-mono">
                  <GitFork size={12} />
                  {repo.forks}
                </span>
              </div>
              <Badge className="bg-brand-500/10 hover:bg-brand-500/20 text-brand-655 dark:text-brand-400 border border-brand-500/10 font-bold text-[9px] uppercase tracking-widest leading-none rounded-[var(--radius-sm)] select-none px-2 py-1 shrink-0">
                Repository
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
export default GitHubCard
