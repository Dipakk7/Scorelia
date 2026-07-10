import { Card, CardContent } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { MapPin, Globe, Mail, Briefcase, Calendar, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileCardProps {
  user: {
    full_name: string | null
    email: string
    role: string | null
    bio: string | null
    location: string | null
    website: string | null
    linkedin: string | null
    github: string | null
    profile_picture: string | null
    created_at: string
  }
  className?: string
}

export function ProfileCard({ user, className }: ProfileCardProps) {
  const userDisplayName = user.full_name || user.email.split('@')[0] || 'User'
  const memberSince = new Date(user.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Card className={cn('border-slate-200/60 dark:border-slate-800/40 bg-card/40 backdrop-blur-md overflow-hidden relative', className)}>
      <div className="absolute right-0 top-0 -mr-16 -mt-16 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
      <CardContent className="p-6 flex flex-col items-center text-center">
        {/* Avatar */}
        <Avatar
          src={user.profile_picture}
          fallbackText={userDisplayName}
          className="h-24 w-24 border-3 border-border shadow-md mb-4"
        />

        {/* Name and Role */}
        <h3 className="text-xl font-bold font-display text-foreground">
          {userDisplayName}
        </h3>
        <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 mt-1 flex items-center gap-1.5 justify-center">
          <Briefcase size={14} />
          {user.role || 'Job Seeker'}
        </p>

        {/* Bio */}
        {user.bio ? (
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed font-sans max-w-sm">
            "{user.bio}"
          </p>
        ) : (
          <p className="text-sm italic text-muted-foreground mt-4 max-w-sm">
            No bio provided yet. Click edit to describe your professional interests.
          </p>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-slate-200/50 dark:bg-slate-800/50 my-5" />

        {/* Meta Info List */}
        <div className="w-full space-y-3.5 text-sm text-left">
          <div className="flex items-center gap-3 text-muted-foreground font-sans">
            <Mail size={16} className="text-muted-foreground shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>

          {user.location && (
            <div className="flex items-center gap-3 text-muted-foreground font-sans">
              <MapPin size={16} className="text-muted-foreground shrink-0" />
              <span className="truncate">{user.location}</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-muted-foreground font-sans">
            <Calendar size={16} className="text-muted-foreground shrink-0" />
            <span>Member since {memberSince}</span>
          </div>
        </div>

        {/* Social Links */}
        {(user.website || user.linkedin || user.github) && (
          <>
            <div className="w-full h-px bg-slate-200/50 dark:bg-slate-800/50 my-5" />
            <div className="flex items-center gap-3 mt-1.5">
              {user.website && (
                <a
                  href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl border border-border hover:border-brand-500/40 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 bg-slate-50 dark:bg-slate-900/50 hover:shadow-xs transition-all cursor-pointer"
                  aria-label="Website Portfolio"
                >
                  <Globe size={16} />
                </a>
              )}

              {user.linkedin && (
                <a
                  href={user.linkedin.startsWith('http') ? user.linkedin : `https://linkedin.com/in/${user.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl border border-border hover:border-brand-500/40 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 bg-slate-50 dark:bg-slate-900/50 hover:shadow-xs transition-all cursor-pointer"
                  aria-label="LinkedIn Profile"
                >
                  <Link2 size={16} />
                </a>
              )}

              {user.github && (
                <a
                  href={user.github.startsWith('http') ? user.github : `https://github.com/${user.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl border border-border hover:border-brand-500/40 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 bg-slate-50 dark:bg-slate-900/50 hover:shadow-xs transition-all cursor-pointer"
                  aria-label="GitHub Profile"
                >
                  <Link2 size={16} />
                </a>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
