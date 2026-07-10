import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useBlocker } from 'react-router-dom'
import { Edit2, Save, X, Plus, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'

import api from '@/api/api'
import { useAuth } from '@/providers/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { ProfileCard } from '@/components/ui/ProfileCard'
import { SkillBadge } from '@/components/ui/SkillBadge'
import { AvatarUploader } from '@/components/ui/AvatarUploader'
import { EditableField } from '@/components/ui/EditableField'
import { Loader } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/ErrorState'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'

interface ProfileStats {
  resume_count: number
  ats_average: number
  interview_score: number
  career_progress: number
}

export default function ProfilePage() {
  const queryClient = useQueryClient()
  const { refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  // Query profile
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const res = await api.get('/auth/me')
      return res.data
    },
  })

  // Query stats
  const { data: stats, isLoading: isStatsLoading } = useQuery<ProfileStats>({
    queryKey: ['profileStats'],
    queryFn: async () => {
      const res = await api.get('/analytics/profile-stats')
      return res.data
    },
  })

  // Form states
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [github, setGithub] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [newSkill, setNewSkill] = useState('')

  // Sync profile data to form state when editing starts or data loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setRole(profile.role || 'Job Seeker')
      setBio(profile.bio || '')
      setLocation(profile.location || '')
      setWebsite(profile.website || '')
      setLinkedin(profile.linkedin || '')
      setGithub(profile.github || '')
      setSkills(profile.skills || [])
      setProfilePicture(profile.profile_picture || null)
    }
  }, [profile, isEditing])

  // Detect unsaved changes
  const isDirty =
    isEditing &&
    (fullName !== (profile?.full_name || '') ||
      role !== (profile?.role || 'Job Seeker') ||
      bio !== (profile?.bio || '') ||
      location !== (profile?.location || '') ||
      website !== (profile?.website || '') ||
      linkedin !== (profile?.linkedin || '') ||
      github !== (profile?.github || '') ||
      JSON.stringify(skills) !== JSON.stringify(profile?.skills || []) ||
      profilePicture !== (profile?.profile_picture || null))

  // 1. Native beforeunload listener (for browser reload / tab close)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to discard them?'
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  // 2. React Router v7 navigation blocker (for in-app transitions)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  )

  const showBlockerModal = blocker.state === 'blocked'

  // Profile update mutation
  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.put('/auth/me', payload)
      return res.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile'], data)
      refreshUser()
      setIsEditing(false)
      toast.success('Profile details successfully saved')
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to save changes. Please try again.')
    },
  })

  const handleSave = () => {
    updateMutation.mutate({
      full_name: fullName,
      role,
      bio,
      location,
      website,
      linkedin,
      github,
      skills,
      profile_picture: profilePicture,
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.trim()) return
    if (skills.includes(newSkill.trim())) {
      toast.error('Skill is already added.')
      return
    }
    setSkills([...skills, newSkill.trim()])
    setNewSkill('')
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove))
  }

  if (isProfileLoading || isStatsLoading) {
    return <Loader label="Syncing profile records..." />
  }

  if (profileError) {
    return (
      <ErrorState
        title="Failed to Load Profile"
        message="Could not load profile details from server. Please verify backend state."
        onRetry={() => queryClient.invalidateQueries({ queryKey: ['userProfile'] })}
      />
    )
  }

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-50 m-0">
            Professional Profile
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Customize details and credentials analyzed by Scorelia.
          </p>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                <X size={16} />
                <span>Cancel</span>
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                isLoading={updateMutation.isPending}
                className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 cursor-pointer"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 size={16} />
              <span>Edit Profile</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: profile card */}
        <div className="lg:col-span-1 space-y-6">
          {profile && <ProfileCard user={profile} />}

          {/* Stats Grid Card */}
          <Card className="border-slate-200/60 dark:border-slate-800/40 bg-card/40 backdrop-blur-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold font-display text-slate-900 dark:text-slate-50 uppercase tracking-wider text-left">
                Copilot Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/40 dark:border-slate-800/40 text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Resumes</p>
                <p className="text-xl font-bold font-display text-slate-850 dark:text-slate-100 mt-1">
                  {stats?.resume_count ?? 0}
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/40 dark:border-slate-800/40 text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Avg ATS</p>
                <p className="text-xl font-bold font-display text-slate-850 dark:text-slate-100 mt-1">
                  {stats?.ats_average ? `${Math.round(stats.ats_average)}%` : '0%'}
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/40 dark:border-slate-800/40 text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Interview</p>
                <p className="text-xl font-bold font-display text-slate-850 dark:text-slate-100 mt-1">
                  {stats?.interview_score ? `${Math.round(stats.interview_score)}%` : '0%'}
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/40 dark:border-slate-800/40 text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Roadmap</p>
                <p className="text-xl font-bold font-display text-slate-850 dark:text-slate-100 mt-1">
                  {stats?.career_progress ? `${Math.round(stats.career_progress)}%` : '0%'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Profile Details form / display */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200/60 dark:border-slate-800/40 bg-card/40 backdrop-blur-md text-left">
            <CardHeader className="border-b border-slate-200/40 dark:border-slate-800/40 pb-5">
              <CardTitle className="text-base font-bold font-display text-slate-900 dark:text-slate-50">
                {isEditing ? 'Modify Profile Details' : 'Identity & Links'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Picture Upload in editing mode */}
              {isEditing && (
                <div className="pb-2">
                  <label className="text-xs font-semibold text-muted-foreground font-sans uppercase tracking-wider block mb-2">
                    Profile Photo
                  </label>
                  <AvatarUploader
                    value={profilePicture}
                    onChange={setProfilePicture}
                    fallbackName={fullName}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditableField
                  isEditing={isEditing}
                  label="Full Name"
                  value={fullName}
                  onChange={setFullName}
                  placeholder="e.g. Jane Doe"
                />
                <EditableField
                  isEditing={isEditing}
                  label="Target Role / Headline"
                  value={role}
                  onChange={setRole}
                  placeholder="e.g. Senior Frontend Engineer"
                />
                <EditableField
                  isEditing={isEditing}
                  label="Location"
                  value={location}
                  onChange={setLocation}
                  placeholder="e.g. San Francisco, CA"
                />
                <EditableField
                  isEditing={isEditing}
                  label="Portfolio Website"
                  value={website}
                  onChange={setWebsite}
                  type="url"
                  placeholder="e.g. portfolio.com"
                />
                <EditableField
                  isEditing={isEditing}
                  label="LinkedIn Profile URL"
                  value={linkedin}
                  onChange={setLinkedin}
                  type="url"
                  placeholder="e.g. linkedin.com/in/username"
                />
                <EditableField
                  isEditing={isEditing}
                  label="GitHub Username"
                  value={github}
                  onChange={setGithub}
                  placeholder="e.g. githubusername"
                />
              </div>

              <EditableField
                isEditing={isEditing}
                label="Professional Bio"
                value={bio}
                onChange={setBio}
                type="textarea"
                placeholder="Write a brief description of your background, experience, and interests."
              />
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card className="border-slate-200/60 dark:border-slate-800/40 bg-card/40 backdrop-blur-md text-left">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold font-display text-slate-900 dark:text-slate-50">
                Expertise & Skills
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Skills tags used by the AI engine to evaluate matching and milestones.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing && (
                <form onSubmit={addSkill} className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill e.g. React"
                    className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none transition-colors"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="flex items-center gap-1 shrink-0 px-3 py-1.5 text-xs font-semibold cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </Button>
                </form>
              )}

              {skills.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400 dark:text-slate-500 italic font-sans">
                  No skills listed yet.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.map((skill) => (
                    <SkillBadge
                      key={skill}
                      skill={skill}
                      onDelete={isEditing ? () => removeSkill(skill) : undefined}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Blocker dialog */}
      <Dialog open={showBlockerModal} onOpenChange={() => blocker.reset?.()}>
        <DialogContent className="max-w-md border-border bg-card">
          <DialogHeader className="text-left flex flex-row gap-3 items-center">
            <div className="h-10 w-10 shrink-0 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center border border-amber-500/20">
              <ShieldAlert size={20} />
            </div>
            <div>
              <DialogTitle className="text-slate-900 dark:text-slate-50 font-display font-bold">
                Unsaved Changes
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground font-sans mt-0.5">
                You have modified your profile settings.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="py-3 text-sm text-slate-600 dark:text-slate-350 font-sans leading-relaxed text-left">
            Are you sure you want to discard your edits and leave? Any unsaved adjustments will be lost permanently.
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => blocker.reset?.()}
              className="text-xs font-semibold border-slate-250 cursor-pointer"
            >
              Keep Editing
            </Button>
            <Button
              variant="primary"
              onClick={() => blocker.proceed?.()}
              className="text-xs font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              Discard & Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
