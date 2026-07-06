import { useState } from 'react'
import type { FormEvent } from 'react'
import { useGithubProfile, useGithubInsights } from '@/api/analytics'
import { DeveloperScoreCard } from '@/components/analytics/DeveloperScoreCard'
import { LanguageDistributionChart } from '@/components/analytics/LanguageDistributionChart'
import { ContributionChart } from '@/components/analytics/ContributionChart'
import { GitHubCard } from '@/components/analytics/GitHubCard'
import { AnalyticsCard } from '@/components/analytics/AnalyticsCard'
import { Search, Users, Calendar, AlertCircle } from 'lucide-react'
import { GithubIntelligenceSkeleton } from '@/components/ui/Skeletons'
import { EmptyGithubState } from '@/components/ui/EmptyState'

// Custom Github SVG Icon to bypass missing brand icons in this version of lucide-react
const Github = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const { size = 24, ...rest } = props
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  )
}

export default function GithubIntelligencePage() {
  const [searchInput, setSearchInput] = useState('gaearon') // default showcase developer
  const [activeUsername, setActiveUsername] = useState('gaearon')

  const profileQuery = useGithubProfile(activeUsername)
  const insightsQuery = useGithubInsights(activeUsername)

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setActiveUsername(searchInput.trim())
    }
  }

  const isLoading = profileQuery.isLoading || insightsQuery.isLoading
  const error = profileQuery.error || insightsQuery.error

  const profile = profileQuery.data?.profile
  const repositorySummary = profileQuery.data?.repository_summary
  const insights = insightsQuery.data

  return (
    <div className="space-y-6 font-sans select-none pb-12">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            GitHub Intelligence
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time codebase analyzer compiling developer profile scores, languages, and repo statistics.
          </p>
        </div>

        {/* Username search form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 self-start md:self-auto w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search GitHub username..."
              className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold shadow-sm transition-all cursor-pointer text-xs flex items-center gap-1.5"
          >
            <Github size={14} />
            <span>Fetch</span>
          </button>
        </form>
      </div>

      {isLoading ? (
        <GithubIntelligenceSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md rounded-2xl p-6 text-center text-rose-500 gap-3">
          <AlertCircle className="h-12 w-12" />
          <div>
            <p className="text-md font-bold">Failed to fetch GitHub Analytics</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm">
              {error instanceof Error ? error.message : 'Ensure the user exists and the backend is connected.'}
            </p>
          </div>
          <button
            onClick={() => {
              profileQuery.refetch()
              insightsQuery.refetch()
            }}
            className="mt-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold text-xs text-slate-750 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
          >
            Retry Fetching
          </button>
        </div>
      ) : profile && repositorySummary && insights ? (
        <div className="space-y-6">
          {/* Developer Profile Header Card */}
          <div className="relative overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6 group shadow-xs">
            {/* Top right gradient accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-brand-500/10 via-brand-500/0 to-transparent opacity-50 pointer-events-none" />

            <img
              src={profile.avatar_url}
              alt={profile.name || profile.username}
              className="w-24 h-24 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm transition-transform group-hover:scale-103 duration-300"
            />

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
                    {profile.name || profile.username}
                  </h3>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md self-center md:self-auto">
                    @{profile.username}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl font-sans">
                  {profile.bio || 'This developer profile has no biography description.'}
                </p>
              </div>

              {/* Stats counts row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-xs font-semibold text-slate-450">
                <span className="flex items-center gap-1">
                  <Users size={14} className="text-slate-400" />
                  Followers: <strong className="text-slate-700 dark:text-slate-200">{profile.followers}</strong>
                </span>
                <span className="flex items-center gap-1">
                  Followings: <strong className="text-slate-700 dark:text-slate-200">{profile.following}</strong>
                </span>
                <span className="flex items-center gap-1">
                  Public Repos: <strong className="text-slate-700 dark:text-slate-200">{profile.public_repos_count}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-slate-400" />
                  Account Age: <strong className="text-slate-700 dark:text-slate-200">{profile.account_age_years.toFixed(1)} years</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Developer Score Card Section */}
          <DeveloperScoreCard score={insights.developer_score.developer_score} breakdown={insights.developer_score.breakdown} />

          {/* Languages & Activity Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnalyticsCard
              title="Primary Tech Stack"
              description="Byte percentage weight of repository languages"
              className="md:col-span-1"
            >
              <LanguageDistributionChart data={insights.languages.top_languages} />
            </AnalyticsCard>

            <AnalyticsCard
              title="Contribution Pattern"
              description="Commit activity calendars over past year"
              className="md:col-span-2"
            >
              <ContributionChart data={[]} title="Yearly Commit Matrix" colorScheme="emerald" />
            </AnalyticsCard>
          </div>

          {/* Repositories grid listing */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h4 className="text-lg font-bold tracking-tight text-slate-850 dark:text-slate-100 font-display">
                Analyzed Repositories
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                A filterable list of active public projects associated with this account.
              </p>
            </div>
            <GitHubCard repositories={repositorySummary.top_repositories} />
          </div>
        </div>
      ) : (
        <EmptyGithubState onAction={() => {
          setSearchInput('gaearon')
          setActiveUsername('gaearon')
        }} />
      )}
    </div>
  )
}
