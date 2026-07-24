import React, { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/api'
import type { ResumeResponse, ParsedResumeData } from '@/types/resume'
import type { SampleResumeData } from './templates/types'
import { parsedDataToSampleResume, sampleResumeToParsedData } from './utils/resumeAdapter'
import { ResumeBuilderHeader } from './ResumeBuilderHeader'
import { ResumeBuilderStepper } from './ResumeBuilderStepper'
import { ResumeEditingPanel } from './ResumeEditingPanel'
import { ResumePreviewPanel } from './ResumePreviewPanel'
import { ResumeAssistantPanel } from './ResumeAssistantPanel'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import toast from 'react-hot-toast'
import { PenTool, Eye, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResumeBuilderShellProps {
  resumeId?: string
  resumeName?: string
  initialResumeName?: string
}

export const ResumeBuilderShell: React.FC<ResumeBuilderShellProps> = ({
  resumeId,
  resumeName,
  initialResumeName = 'My Resume',
}) => {
  const queryClient = useQueryClient()
  const [activeStep, setActiveStep] = useState<number>(1)
  const [mobileActivePanel, setMobileActivePanel] = useState<'editor' | 'preview' | 'assistant'>('editor')
  const effectiveResumeName = resumeName || initialResumeName

  // Fetch all resumes list from backend
  const { data: resumesResponse } = useQuery<any>({
    queryKey: ['resumes'],
    queryFn: async () => {
      const res = await api.get('/resumes')
      return res.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
  })

  // Safely handle both array response and object response { resumes: [...], total: N }
  const resumesArray: ResumeResponse[] = Array.isArray(resumesResponse)
    ? resumesResponse
    : resumesResponse?.resumes || []

  const currentResumeRecord = resumesArray.find((r) => r.id === resumeId) || resumesArray[0]

  // State: Single source of truth for resume data
  const [resumeData, setResumeData] = useState<SampleResumeData>(() =>
    parsedDataToSampleResume(currentResumeRecord?.parsed_data, currentResumeRecord?.original_filename || initialResumeName)
  )

  const [saveStatus, setSaveStatus] = useState<string>('Auto-saved 1 min ago')
  const [isSaving, setIsSaving] = useState<boolean>(false)

  // Update internal state when backend query completes
  useEffect(() => {
    if (currentResumeRecord?.parsed_data) {
      setResumeData(parsedDataToSampleResume(currentResumeRecord.parsed_data, currentResumeRecord.original_filename))
    }
  }, [currentResumeRecord])

  // Mutation: Autosave resume to backend via PUT /resumes/{id}
  const saveMutation = useMutation({
    mutationFn: async (updated: SampleResumeData) => {
      if (!currentResumeRecord?.id) return
      const payloadParsedData = sampleResumeToParsedData(updated, currentResumeRecord.parsed_data)
      const res = await api.put(`/resumes/${currentResumeRecord.id}`, {
        parsed_data: payloadParsedData,
      })
      return res.data
    },
    onMutate: () => {
      setIsSaving(true)
      setSaveStatus('Saving changes...')
    },
    onSuccess: () => {
      setIsSaving(false)
      setSaveStatus('Auto-saved just now')
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
    },
    onError: () => {
      setIsSaving(false)
      setSaveStatus('Save failed - Offline mode')
    },
  })

  // Register Ctrl + S shortcut for manual save
  useKeyboardShortcuts({
    onSave: () => {
      if (currentResumeRecord?.id) {
        saveMutation.mutate(resumeData)
        toast.success('Resume draft saved!')
      }
    },
  })

  // Debounced autosave ref timer
  const autosaveTimerRef = useRef<any>(null)

  // Timer unmount cleanup to prevent memory leaks
  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current)
      }
    }
  }, [])

  const handleUpdateResumeData = (updated: SampleResumeData) => {
    setResumeData(updated)
    setSaveStatus('Unsaved edits...')

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current)
    }

    autosaveTimerRef.current = setTimeout(() => {
      if (currentResumeRecord?.id) {
        saveMutation.mutate(updated)
      }
    }, 2000)
  }

  const stepNames = [
    'Personal Information',
    'Contact Information',
    'Executive Summary',
    'Work Experience',
    'Education',
    'Technical Skills',
    'Projects',
    'Review & Export',
  ]

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-5rem)] space-y-4 text-left font-sans animate-fade-in">
      {/* Top Header */}
      <ResumeBuilderHeader
        resumeName={currentResumeRecord?.original_filename || effectiveResumeName}
        activeStep={activeStep}
        totalSteps={8}
        completionPercentage={Math.round((activeStep / 8) * 100)}
        activeStepName={stepNames[activeStep - 1] || 'Personal Information'}
        estTimeRemaining={`${Math.max(1, 9 - activeStep)} min remaining`}
      />

      {/* Horizontal Stepper Navigation */}
      <ResumeBuilderStepper
        activeStep={activeStep}
        onStepClick={(stepId) => setActiveStep(stepId)}
      />

      {/* Mobile/Tablet Panel View Selector */}
      <div className="flex lg:hidden items-center bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 gap-1">
        <button
          type="button"
          onClick={() => setMobileActivePanel('editor')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border',
            mobileActivePanel === 'editor'
              ? 'bg-purple-600 text-white border-purple-400 shadow-md'
              : 'bg-transparent text-slate-400 border-transparent hover:text-white'
          )}
        >
          <PenTool size={14} />
          <span>Editor</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileActivePanel('preview')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border',
            mobileActivePanel === 'preview'
              ? 'bg-purple-600 text-white border-purple-400 shadow-md'
              : 'bg-transparent text-slate-400 border-transparent hover:text-white'
          )}
        >
          <Eye size={14} />
          <span>Preview</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileActivePanel('assistant')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border',
            mobileActivePanel === 'assistant'
              ? 'bg-purple-600 text-white border-purple-400 shadow-md'
              : 'bg-transparent text-slate-400 border-transparent hover:text-white'
          )}
        >
          <Bot size={14} />
          <span>AI &amp; ATS</span>
        </button>
      </div>

      {/* Main 3-Column Workspace Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[650px] items-stretch">
        {/* Left Editing Workspace Panel */}
        <div
          className={cn(
            'lg:col-span-4 xl:col-span-4 h-full min-h-[600px]',
            mobileActivePanel === 'editor' ? 'block' : 'hidden lg:block'
          )}
        >
          <ResumeEditingPanel
            activeStep={activeStep}
            onStepChange={(stepId) => setActiveStep(stepId)}
            resumeData={resumeData}
            onUpdateResumeData={handleUpdateResumeData}
            onSaveDraft={() => saveMutation.mutate(resumeData)}
            isSaving={isSaving}
          />
        </div>

        {/* Center Resume Preview Panel */}
        <div
          className={cn(
            'lg:col-span-5 xl:col-span-5 h-full min-h-[600px]',
            mobileActivePanel === 'preview' ? 'block' : 'hidden lg:block'
          )}
        >
          <ResumePreviewPanel resumeData={resumeData} saveStatus={saveStatus} />
        </div>

        {/* Right AI & ATS Assistant Panel */}
        <div
          className={cn(
            'lg:col-span-3 xl:col-span-3 h-full min-h-[600px]',
            mobileActivePanel === 'assistant' ? 'block' : 'hidden lg:block'
          )}
        >
          <ResumeAssistantPanel />
        </div>
      </div>
    </div>
  )
}
