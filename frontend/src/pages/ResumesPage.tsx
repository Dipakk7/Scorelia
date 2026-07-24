import { useQuery } from '@tanstack/react-query'
import api from '@/api/api'
import type { ResumeResponse } from '@/types/resume'
import { ResumesSkeleton } from '@/components/ui/Skeletons'
import { ErrorState } from '@/components/ui/ErrorState'
import { ResumeBuilderShell } from '@/components/resume-builder/ResumeBuilderShell'

export default function ResumesPage() {
  // Fetch user resumes list
  const {
    data: resumesData,
    isLoading,
    error,
    refetch,
  } = useQuery<any>({
    queryKey: ['resumesList'],
    queryFn: async () => {
      const res = await api.get('/resumes')
      return res.data
    },
  })

  if (isLoading) {
    return <ResumesSkeleton />
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load resume module"
        message={(error as any)?.message || 'Could not sync resumes with the backend API.'}
        onRetry={() => refetch()}
      />
    )
  }

  const resumesArray: ResumeResponse[] = Array.isArray(resumesData)
    ? resumesData
    : resumesData?.resumes || []

  const activeResume = resumesArray[0]

  return (
    <div className="w-full text-left animate-fade-in font-sans">
      <ResumeBuilderShell
        resumeId={activeResume?.id}
        resumeName={activeResume?.original_filename || 'Dipak Khandagale Resume'}
      />
    </div>
  )
}
