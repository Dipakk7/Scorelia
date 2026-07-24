import React, { useState, useMemo } from 'react'
import { SectionNavPanel } from '@/components/resume-intelligence/sections/SectionNavPanel'
import { SectionAnalysisCard } from '@/components/resume-intelligence/sections/SectionAnalysisCard'
import { MOCK_SECTION_ANALYSIS_DATA } from '@/lib/mock-section-analysis'
import { Maximize2, Minimize2 } from 'lucide-react'

interface SectionAnalysisWorkspaceProps {
  searchQuery?: string
}

export const SectionAnalysisWorkspace: React.FC<SectionAnalysisWorkspaceProps> = ({
  searchQuery = '',
}) => {
  const sectionsList = Object.values(MOCK_SECTION_ANALYSIS_DATA)
  const [activeSectionId, setActiveSectionId] = useState<string>(sectionsList[0]?.id || 'professional-summary')
  const [expandAll, setExpandAll] = useState<boolean | null>(null)

  // Filter sections by search query if present
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sectionsList
    const query = searchQuery.toLowerCase()
    return sectionsList.filter(
      (sec) =>
        sec.sectionName.toLowerCase().includes(query) ||
        sec.strengths.some((s) => s.toLowerCase().includes(query)) ||
        sec.weaknesses.some((w) => w.toLowerCase().includes(query)) ||
        sec.recommendations.some((r) => r.recommendation.toLowerCase().includes(query))
    )
  }, [sectionsList, searchQuery])

  const handleSelectSection = (id: string) => {
    setActiveSectionId(id)
    const element = document.getElementById(`section-${id}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Top Workspace Controls: Expand All / Collapse All */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="font-medium">
          Showing {filteredSections.length} of {sectionsList.length} Sections
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpandAll(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Maximize2 className="w-3 h-3 text-purple-400" />
            <span>Expand All</span>
          </button>

          <button
            onClick={() => setExpandAll(false)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Minimize2 className="w-3 h-3 text-slate-400" />
            <span>Collapse All</span>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Section Navigation Panel */}
        <div className="lg:col-span-4">
          <SectionNavPanel
            sections={filteredSections}
            activeSectionId={activeSectionId}
            onSelectSection={handleSelectSection}
          />
        </div>

        {/* Right Column: Section Analysis Cards List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {filteredSections.map((section, idx) => (
            <SectionAnalysisCard
              key={`${section.id}-${expandAll}`}
              section={section}
              isDefaultExpanded={expandAll !== null ? expandAll : idx === 0}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SectionAnalysisWorkspace
