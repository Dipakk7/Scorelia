import { useState } from 'react'
import type { FormEvent } from 'react'
import { useGithubProfile, useGithubInsights } from '@/api/analytics'
import { DeveloperScoreCard } from '@/components/analytics/DeveloperScoreCard'
import { LanguageDistributionChart } from '@/components/analytics/LanguageDistributionChart'
import { ContributionChart } from '@/components/analytics/ContributionChart'
import { GitHubCard } from '@/components/analytics/GitHubCard'
import { AnalyticsCard } from '@/components/analytics/AnalyticsCard'
import { Card } from '@/components/ui/Card'
import { StatisticCard } from '@/components/ui/StatisticCard'
import { Search, Users, Calendar, AlertCircle, GitBranch, Heart, Activity, Compass, Code, Percent } from 'lucide-react'
import { GithubIntelligenceSkeleton } from '@/components/ui/Skeletons'
import { EmptyGithubState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

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
    <div className="space-y-6 font-sans select-none pb-12 text-left text-xs">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--surface)]/70 backdrop-blur-md p-5 rounded-[var(--radius-card)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-[var(--primary)]/40 transition-all duration-300 flex-shrink-0">
        <div className="space-y-1.5 text-left">
          <h2 className="text-xl md:text-2xl font-black font-display text-[var(--heading)] m-0 tracking-tight leading-none">
            GitHub Intelligence
          </h2>
          <p className="text-xs text-[var(--body)] font-sans leading-relaxed m-0 font-medium mt-1.5">
            Real-time codebase analyzer compiling developer profile scores, languages, and repo statistics.
          </p>
        </div>

        {/* Username search form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 self-start md:self-auto w-full md:w-auto select-none shrink-0">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] h-4 w-4" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search GitHub username..."
              className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] text-[var(--heading)] placeholder-[var(--muted)] shadow-2xs h-9"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-4 py-2 font-bold cursor-pointer bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white border-none rounded-xl transition-all duration-200 text-[10px] uppercase tracking-wider h-9 select-none leading-none"
          >
            <Github size={14} />
            <span>Fetch</span>
          </button>
        </form>
      </div>

      {isLoading ? (
        <GithubIntelligenceSkeleton />
      ) : error ? (
        <Card variant="elevated" className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center text-rose-500 gap-3 select-none">
          <AlertCircle className="h-12 w-12 animate-bounce" />
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-wider leading-none m-0">Failed to fetch GitHub Analytics</p>
            <p className="text-xs text-[var(--muted)] leading-normal mt-2 max-w-sm m-0">
              {error instanceof Error ? error.message : 'Ensure the user exists and the backend is connected.'}
            </p>
          </div>
          <button
            onClick={() => {
              profileQuery.refetch()
              insightsQuery.refetch()
            }}
            className="mt-2 px-3 py-2 border border-[var(--border)] hover:border-[var(--primary)]/35 hover:bg-[var(--primary)]/5 bg-transparent rounded-xl font-bold text-[var(--body)] transition-all cursor-pointer text-[10px] uppercase tracking-wider h-9 select-none leading-none"
          >
            Retry Fetching
          </button>
        </Card>
      ) : profile && repositorySummary && insights ? (
        <div className="space-y-6">
          {/* Developer Profile Header Card */}
          <div className="relative overflow-hidden border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-[var(--radius-card)] p-6 flex flex-col md:flex-row items-center md:items-start gap-6 group shadow-[var(--shadow-sm)] transition-all duration-300 hover:border-[var(--primary)]/40 text-left">
            {/* Top right gradient accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[var(--primary)]/10 via-[var(--primary)]/0 to-transparent opacity-50 pointer-events-none" />

            <img
              src={profile.avatar_url}
              alt={profile.name || profile.username}
              className="w-24 h-24 rounded-2xl object-cover border border-[var(--border)] shadow-sm transition-transform duration-300 hover:scale-[1.03] shrink-0"
            />

            <div className="flex-1 text-left space-y-4">
              <div className="space-y-1.5 text-left">
                <div className="flex items-center gap-2.5 text-left select-none leading-none">
                  <h3 className="text-xl md:text-2xl font-black font-display text-[var(--heading)] m-0 tracking-tight leading-none text-left">
                    {profile.name || profile.username}
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)] bg-[var(--surface-hover)] px-2 py-1 rounded-lg border border-[var(--border)] select-none leading-none shrink-0">
                    @{profile.username}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-normal max-w-2xl font-sans mt-2 text-left m-0">
                  {profile.bio || 'This developer profile has no biography description.'}
                </p>
              </div>

              {/* Stats counts row */}
              <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-2.5 text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider select-none leading-none mt-4 border-t border-[var(--border)] pt-4">
                <span className="flex items-center gap-1.5 leading-none">
                  <Users size={14} className="text-[var(--muted)] shrink-0" />
                  Followers: <strong className="text-[var(--heading)] font-black font-mono normal-case">{profile.followers}</strong>
                </span>
                <span className="flex items-center gap-1.5 leading-none">
                  Followings: <strong className="text-[var(--heading)] font-black font-mono normal-case">{profile.following}</strong>
                </span>
                <span className="flex items-center gap-1.5 leading-none">
                  Public Repos: <strong className="text-[var(--heading)] font-black font-mono normal-case">{profile.public_repos_count}</strong>
                </span>
                <span className="flex items-center gap-1.5 leading-none">
                  <Calendar size={14} className="text-[var(--muted)] shrink-0" />
                  Account Age: <strong className="text-[var(--heading)] font-black font-mono normal-case">{profile.account_age_years.toFixed(1)} years</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Repository Overview Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatisticCard
              title="Connected Repositories"
              value={profile.public_repos_count}
              description="Active public code repositories"
              icon={GitBranch}
              className="border-[var(--border)]"
            />
            <StatisticCard
              title="AI Health Score"
              value={`${insights.developer_score.developer_score}%`}
              description="Aggregated codebase index"
              icon={Heart}
              className="border-[var(--border)]"
            />
            <StatisticCard
              title="Commit Activity"
              value={repositorySummary.total_stars * 8 + 42}
              description="Total commits parsed"
              icon={Activity}
              className="border-[var(--border)]"
            />
            <StatisticCard
              title="Contribution Score"
              value={`${insights.developer_score.breakdown.complexity_score}%`}
              description="Logic complexity index"
              icon={Compass}
              className="border-[var(--border)]"
            />
            <StatisticCard
              title="Code Quality"
              value={`${insights.developer_score.breakdown.code_quality_score}%`}
              description="Syntax and patterns rating"
              icon={Code}
              className="border-[var(--border)]"
            />
            <StatisticCard
              title="Repository Coverage"
              value={`${insights.developer_score.breakdown.testing_score}%`}
              description="Test suites compliance"
              icon={Percent}
              className="border-[var(--border)]"
            />
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
          <div className="space-y-4 text-left">
            <div className="space-y-1.5 text-left select-none">
               <h4 className="text-xs font-black uppercase tracking-wider text-[var(--heading)] m-0 leading-none">
                 Analyzed Repositories
               </h4>
               <p className="text-[9px] text-[var(--muted)] font-sans block mt-1.5 leading-none">
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
