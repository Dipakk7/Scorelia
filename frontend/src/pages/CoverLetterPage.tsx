import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { useScoreliaReducedMotion, getContainerVariants, getSectionVariants } from '@/lib/motion'
import { useCoverLetter } from '@/hooks/useCoverLetter'
import { CoverLetterHeader } from '@/components/cover-letter/CoverLetterHeader'
import { CoverLetterStepsBar } from '@/components/cover-letter/CoverLetterStepsBar'
import { WorkspaceLayout } from '@/components/cover-letter/WorkspaceLayout'
import { CoverLetterInputsCard } from '@/components/cover-letter/CoverLetterInputsCard'
import { CoverLetterPreviewCard } from '@/components/cover-letter/CoverLetterPreviewCard'
import { AIEnhancementToolsCard } from '@/components/cover-letter/AIEnhancementToolsCard'
import { CoverLetterQuickActions } from '@/components/cover-letter/CoverLetterQuickActions'
import { AIGenerationProgressPanel } from '@/components/cover-letter/AIGenerationProgressPanel'
import { VersionHistoryPanel } from '@/components/cover-letter/VersionHistoryPanel'
import { GenerationHistoryPanel } from '@/components/cover-letter/GenerationHistoryPanel'
import { CoverLetterScoreCard } from '@/components/cover-letter/CoverLetterScoreCard'
import { KeywordsMatchedCard } from '@/components/cover-letter/KeywordsMatchedCard'
import { AIAssistantCard } from '@/components/cover-letter/AIAssistantCard'
import { SmartSuggestionsCard } from '@/components/cover-letter/SmartSuggestionsCard'
import { CoverLetterTemplatesCard } from '@/components/cover-letter/CoverLetterTemplatesCard'
import { DocumentStylePanel, defaultDocumentStyleSettings, type DocumentStyleSettings } from '@/components/cover-letter/DocumentStylePanel'
import { PersonalizationInsightsCard } from '@/components/cover-letter/PersonalizationInsightsCard'
import { CompareVersionsModal } from '@/components/cover-letter/CompareVersionsModal'
import { ExportCoverLetterModal } from '@/components/cover-letter/ExportCoverLetterModal'
import { LoadingSkeleton } from '@/components/cover-letter/LoadingSkeleton'
import { EmptyState } from '@/components/cover-letter/EmptyState'
import {
  mockCoverLetterVersions,
  type MockCoverLetterContent,
  mockToolTransformations,
  type GenerationHistoryLog,
} from '@/lib/cover-letter-mock-data'

export default function CoverLetterPage() {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const containerVariants = getContainerVariants(shouldReduceMotion)
  const itemVariants = getSectionVariants(shouldReduceMotion)

  // React Query Hook Connection
  const {
    resumesQuery,
    historyQuery,
    generateMutation,
    updateMutation,
    selectedLetterId,
    handleSelectLetter,
    errorMessage,
    setErrorMessage,
    adaptedResumes,
    adaptedActiveContent,
  } = useCoverLetter()

  const [currentStep, setCurrentStep] = useState(3)
  const [selectedTemplateId, setSelectedTemplateId] = useState('modern')
  const [viewState, setViewState] = useState<'workspace' | 'skeleton' | 'empty'>('workspace')

  // Style Settings state
  const [styleSettings, setStyleSettings] = useState<DocumentStyleSettings>(defaultDocumentStyleSettings)

  // Compare Modal state
  const [isCompareOpen, setIsCompareOpen] = useState(false)

  // Export Modal state
  const [isExportOpen, setIsExportOpen] = useState(false)

  // Active Letter Content Override state
  const [activeVersion, setActiveVersion] = useState<MockCoverLetterContent>(adaptedActiveContent)

  // Sync active version when backend adapted content changes
  React.useEffect(() => {
    if (adaptedActiveContent) {
      setActiveVersion(adaptedActiveContent)
    }
  }, [adaptedActiveContent])

  // AI Generation mode state
  const [isGenerating, setIsGenerating] = useState(false)

  const handleUpdateStyleSettings = (newSettings: Partial<DocumentStyleSettings>) => {
    setStyleSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const handleStartGeneration = () => {
    setIsGenerating(true)
  }

  const handleCompleteGeneration = () => {
    setIsGenerating(false)
    setCurrentStep(3)
  }

  const handleCancelGeneration = () => {
    setIsGenerating(false)
  }

  // Handle Form Submit / Generate Action via React Query Mutation
  const handleGenerateSubmit = (formData: {
    resumeId: string
    companyName: string
    jobTitle: string
    hiringManager: string
    jobDescription: string
    tone: string
    experienceLevel: string
    language: string
  }) => {
    setIsGenerating(true)
    generateMutation.mutate(
      {
        resume_id: formData.resumeId,
        company_name: formData.companyName,
        job_title: formData.jobTitle,
        job_description: formData.jobDescription,
        writing_style: formData.tone,
      },
      {
        onSettled: () => {
          setIsGenerating(false)
          setCurrentStep(3)
        },
      }
    )
  }

  // AI Tool Transformations
  const handleApplyToolTransformation = (toolId: string) => {
    const transform = mockToolTransformations[toolId]
    if (transform) {
      const updatedContent = `${transform.intro}\n\n${transform.body1}\n\n${transform.body2}\n\n${transform.closing}`
      setActiveVersion((prev) => ({
        ...prev,
        introParagraph: transform.intro,
        bodyParagraph1: transform.body1,
        bodyParagraph2: transform.body2,
        closingParagraph: transform.closing,
      }))

      if (selectedLetterId) {
        updateMutation.mutate({ id: selectedLetterId, content: updatedContent })
      }
    }
  }

  // Quick Actions
  const handleCopyText = () => {
    const text = `${activeVersion.introParagraph}\n\n${activeVersion.bodyParagraph1}\n\n${activeVersion.bodyParagraph2}\n\n${activeVersion.closingParagraph}`
    navigator.clipboard?.writeText(text)
  }

  const handleDuplicateVersion = () => {
    const newVer: MockCoverLetterContent = {
      ...activeVersion,
      id: `v-${Date.now()}`,
      versionNumber: 2,
      versionLabel: `Version 2 — Custom Edit`,
      createdAt: 'Just now',
    }
    setActiveVersion(newVer)
  }

  const handleResetDraft = () => {
    setActiveVersion(adaptedActiveContent)
    setStyleSettings(defaultDocumentStyleSettings)
  }

  const handleToggleFavorite = () => {
    setActiveVersion((prev) => ({ ...prev, isFavorite: !prev.isFavorite }))
  }

  const handleRestoreFromHistory = (log: GenerationHistoryLog) => {
    if (log.id) {
      handleSelectLetter(log.id)
    }
  }

  const isLoading = resumesQuery.isLoading || historyQuery.isLoading

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-full overflow-x-hidden p-4 sm:p-6 text-left selection:bg-purple-500/30"
    >
      {/* Top Header */}
      <CoverLetterHeader
        onGenerateClick={handleStartGeneration}
        onExportClick={() => setIsExportOpen(true)}
      />

      {/* Inline Error Card with Retry */}
      {errorMessage && (
        <motion.div
          variants={itemVariants}
          className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-300 flex items-center justify-between gap-3 animate-fade-in"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-500/20 text-rose-200 font-bold hover:bg-rose-500/30 border-none cursor-pointer"
          >
            <RefreshCw size={11} />
            <span>Dismiss</span>
          </button>
        </motion.div>
      )}

      {/* Side-by-Side Compare Versions Modal */}
      <CompareVersionsModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        originalVersion={mockCoverLetterVersions[0]}
        activeVersion={activeVersion}
      />

      {/* Export Document Modal */}
      <ExportCoverLetterModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        content={activeVersion}
        styleSettings={styleSettings}
      />

      {/* Workspace View Mode Pill Bar */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-xs"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-[var(--heading)] font-sans">Phase 9 Production Verification Edition:</span>
          <div className="flex items-center gap-1 bg-[var(--surface-hover)]/60 p-1 rounded-xl border border-[var(--border)]">
            <button
              type="button"
              onClick={() => setViewState('workspace')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer border-none ${
                viewState === 'workspace'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'bg-transparent text-[var(--muted)] hover:text-[var(--heading)]'
              }`}
            >
              Verified Workspace
            </button>
            <button
              type="button"
              onClick={() => setViewState('skeleton')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer border-none ${
                viewState === 'skeleton'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'bg-transparent text-[var(--muted)] hover:text-[var(--heading)]'
              }`}
            >
              Skeleton Shimmer
            </button>
            <button
              type="button"
              onClick={() => setViewState('empty')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer border-none ${
                viewState === 'empty'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'bg-transparent text-[var(--muted)] hover:text-[var(--heading)]'
              }`}
            >
              Empty State
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExportOpen(true)}
          className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer bg-transparent border-none p-0"
        >
          Export (.pdf, .docx, .md, .txt, .json) ⚡
        </button>
      </motion.div>

      {/* Step Navigation Wizard */}
      <CoverLetterStepsBar currentStep={currentStep} onSelectStep={setCurrentStep} />

      {/* Dynamic View Rendering */}
      {isLoading || viewState === 'skeleton' ? (
        <LoadingSkeleton />
      ) : viewState === 'empty' ? (
        <EmptyState
          onAction={() => {
            setViewState('workspace')
          }}
        />
      ) : (
        <WorkspaceLayout
          leftContent={
            <>
              {/* Multi-Stage AI Generation Timeline Modal / Progress Overlay */}
              {isGenerating && (
                <AIGenerationProgressPanel
                  onComplete={handleCompleteGeneration}
                  onCancel={handleCancelGeneration}
                />
              )}

              {/* Document Personalization & Style Settings Panel */}
              <DocumentStylePanel
                settings={styleSettings}
                onUpdateSettings={handleUpdateStyleSettings}
              />

              {/* Quick Actions Toolbar */}
              <CoverLetterQuickActions
                onCopyText={handleCopyText}
                onDuplicateVersion={handleDuplicateVersion}
                onResetDraft={handleResetDraft}
                onToggleFavorite={handleToggleFavorite}
                onDownloadClick={() => setIsExportOpen(true)}
                isFavorite={activeVersion.isFavorite}
              />

              {/* Inputs Card */}
              <CoverLetterInputsCard
                resumes={adaptedResumes}
                isGenerating={generateMutation.isPending || isGenerating}
                onStartGeneration={handleStartGeneration}
                onGenerateClick={handleGenerateSubmit}
              />

              {/* Cover Letter Preview & Inline Editor Card */}
              <CoverLetterPreviewCard
                activeVersion={activeVersion}
                selectedTemplateId={selectedTemplateId}
                onTemplateChange={setSelectedTemplateId}
                isGenerating={isGenerating}
                styleSettings={styleSettings}
              />

              {/* 8 AI Enhancement Actions Panel */}
              <AIEnhancementToolsCard
                onApplyToolTransformation={handleApplyToolTransformation}
              />
            </>
          }
          rightSidebar={
            <>
              {/* Personalization Insights Widget */}
              <PersonalizationInsightsCard />

              {/* Version History & Edit Log Drawer */}
              <VersionHistoryPanel
                activeVersionId={activeVersion.id}
                onSelectVersion={setActiveVersion}
                onOpenCompareModal={() => setIsCompareOpen(true)}
              />

              {/* Cover Letter Score Gauge & Sub-Metrics */}
              <CoverLetterScoreCard />

              {/* Matched & Missing Keywords */}
              <KeywordsMatchedCard />

              {/* Scorelia AI Assistant Chat */}
              <AIAssistantCard />

              {/* Generation History Log */}
              <GenerationHistoryPanel onRestoreGeneration={handleRestoreFromHistory} />

              {/* Smart Suggestions */}
              <SmartSuggestionsCard />

              {/* Cover Letter Templates Picker */}
              <CoverLetterTemplatesCard
                selectedTemplateId={selectedTemplateId}
                onSelectTemplate={setSelectedTemplateId}
              />
            </>
          }
        />
      )}
    </motion.div>
  )
}
