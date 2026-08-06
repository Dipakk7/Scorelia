import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { useScoreliaReducedMotion, getContainerVariants, getSectionVariants } from '@/lib/motion'
import { useCoverLetter } from '@/hooks/useCoverLetter'
import { CoverLetterHeader, type CoverLetterTab } from '@/components/cover-letter/CoverLetterHeader'
import { WorkspaceLayout } from '@/components/cover-letter/WorkspaceLayout'
import { CoverLetterSidebar } from '@/components/cover-letter/CoverLetterSidebar'
import { CoverLetterInputsCard } from '@/components/cover-letter/CoverLetterInputsCard'
import { CoverLetterPreviewCard } from '@/components/cover-letter/CoverLetterPreviewCard'
import { AIEnhancementToolsCard } from '@/components/cover-letter/AIEnhancementToolsCard'
import { AIGenerationProgressPanel } from '@/components/cover-letter/AIGenerationProgressPanel'
import { VersionHistoryPanel } from '@/components/cover-letter/VersionHistoryPanel'
import { GenerationHistoryPanel } from '@/components/cover-letter/GenerationHistoryPanel'
import { CoverLetterScoreCard } from '@/components/cover-letter/CoverLetterScoreCard'
import { SmartSuggestionsCard } from '@/components/cover-letter/SmartSuggestionsCard'
import { defaultDocumentStyleSettings, type DocumentStyleSettings } from '@/components/cover-letter/DocumentStylePanel'
import { CompareVersionsModal } from '@/components/cover-letter/CompareVersionsModal'
import { ExportCoverLetterModal } from '@/components/cover-letter/ExportCoverLetterModal'
import { LoadingSkeleton } from '@/components/cover-letter/LoadingSkeleton'
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

  const [activeTab, setActiveTab] = useState<CoverLetterTab>('editor')
  const [selectedTemplateId, setSelectedTemplateId] = useState('modern')

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
    setActiveTab('editor')
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
          setActiveTab('editor')
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

  const handleResetDraft = () => {
    setActiveVersion(adaptedActiveContent)
    setStyleSettings(defaultDocumentStyleSettings)
  }

  const handleRestoreFromHistory = (log: GenerationHistoryLog) => {
    if (log.id) {
      handleSelectLetter(log.id)
    }
  }

  const isLoading = resumesQuery.isLoading || historyQuery.isLoading

  // Selected metadata titles for Header display
  const selectedResumeTitle = adaptedResumes[0]?.title ?? 'Dipak_Khandagale_AI_Engineer.pdf'

  return (
    <div className="-m-4 md:-m-6 lg:-m-8 p-3 sm:p-4 lg:p-5 w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] space-y-4 sm:space-y-5 text-slate-100 selection:bg-purple-500/30 font-sans">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="space-y-4 sm:space-y-5"
      >
        {/* Top Executive Header & Workspace Tab Bar */}
        <CoverLetterHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onGenerateClick={handleStartGeneration}
          onExportClick={() => setIsExportOpen(true)}
          onRefreshClick={handleResetDraft}
          isGenerating={isGenerating || generateMutation.isPending}
          selectedResumeTitle={selectedResumeTitle}
          companyName="Google"
          jobTitle="Senior AI Engineer"
        />

        {/* Inline Error Card with Dismiss */}
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

        {/* Dynamic Workspace View Switching */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            {/* WORKSPACE TAB 1: SETUP & TARGET JOB */}
            {activeTab === 'setup' && (
              <motion.div
                key="workspace-setup"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                transition={{ duration: 0.2 }}
              >
                <WorkspaceLayout
                  leftContent={
                    <CoverLetterInputsCard
                      resumes={adaptedResumes}
                      isGenerating={generateMutation.isPending || isGenerating}
                      onStartGeneration={handleStartGeneration}
                      onGenerateClick={handleGenerateSubmit}
                    />
                  }
                  rightSidebar={
                    <CoverLetterSidebar
                      activeWorkspaceTab={activeTab}
                      activeVersionId={activeVersion.id}
                      selectedTemplateId={selectedTemplateId}
                      onSelectTemplate={setSelectedTemplateId}
                      onSelectVersion={setActiveVersion}
                      onOpenCompareModal={() => setIsCompareOpen(true)}
                      onRestoreGeneration={handleRestoreFromHistory}
                    />
                  }
                />
              </motion.div>
            )}

            {/* WORKSPACE TAB 2: WRITING STUDIO */}
            {activeTab === 'editor' && (
              <motion.div
                key="workspace-editor"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                transition={{ duration: 0.2 }}
              >
                <WorkspaceLayout
                  leftContent={
                    <>
                      {isGenerating && (
                        <AIGenerationProgressPanel
                          onComplete={handleCompleteGeneration}
                          onCancel={handleCancelGeneration}
                        />
                      )}

                      <CoverLetterPreviewCard
                        activeVersion={activeVersion}
                        selectedTemplateId={selectedTemplateId}
                        onTemplateChange={setSelectedTemplateId}
                        isGenerating={isGenerating}
                        styleSettings={styleSettings}
                        onUpdateStyleSettings={handleUpdateStyleSettings}
                        onCopyText={handleCopyText}
                        onExportClick={() => setIsExportOpen(true)}
                      />
                    </>
                  }
                  rightSidebar={
                    <CoverLetterSidebar
                      activeWorkspaceTab={activeTab}
                      activeVersionId={activeVersion.id}
                      selectedTemplateId={selectedTemplateId}
                      onSelectTemplate={setSelectedTemplateId}
                      onSelectVersion={setActiveVersion}
                      onOpenCompareModal={() => setIsCompareOpen(true)}
                      onRestoreGeneration={handleRestoreFromHistory}
                    />
                  }
                />
              </motion.div>
            )}

            {/* WORKSPACE TAB 3: AI OPTIMIZATION */}
            {activeTab === 'optimization' && (
              <motion.div
                key="workspace-optimization"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                transition={{ duration: 0.2 }}
              >
                <WorkspaceLayout
                  leftContent={
                    <>
                      <AIEnhancementToolsCard
                        onApplyToolTransformation={handleApplyToolTransformation}
                      />
                      <SmartSuggestionsCard />
                    </>
                  }
                  rightSidebar={
                    <CoverLetterSidebar
                      activeWorkspaceTab={activeTab}
                      activeVersionId={activeVersion.id}
                      selectedTemplateId={selectedTemplateId}
                      onSelectTemplate={setSelectedTemplateId}
                      onSelectVersion={setActiveVersion}
                      onOpenCompareModal={() => setIsCompareOpen(true)}
                      onRestoreGeneration={handleRestoreFromHistory}
                    />
                  }
                />
              </motion.div>
            )}

            {/* WORKSPACE TAB 4: REVIEW & EXPORT */}
            {activeTab === 'review' && (
              <motion.div
                key="workspace-review"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                transition={{ duration: 0.2 }}
              >
                <WorkspaceLayout
                  leftContent={
                    <>
                      <CoverLetterScoreCard
                        onExportClick={() => setIsExportOpen(true)}
                        onCopyClick={handleCopyText}
                      />
                      <VersionHistoryPanel
                        activeVersionId={activeVersion.id}
                        onSelectVersion={setActiveVersion}
                        onOpenCompareModal={() => setIsCompareOpen(true)}
                      />
                      <GenerationHistoryPanel onRestoreGeneration={handleRestoreFromHistory} />
                    </>
                  }
                  rightSidebar={
                    <CoverLetterSidebar
                      activeWorkspaceTab={activeTab}
                      activeVersionId={activeVersion.id}
                      selectedTemplateId={selectedTemplateId}
                      onSelectTemplate={setSelectedTemplateId}
                      onSelectVersion={setActiveVersion}
                      onOpenCompareModal={() => setIsCompareOpen(true)}
                      onRestoreGeneration={handleRestoreFromHistory}
                    />
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  )
}
