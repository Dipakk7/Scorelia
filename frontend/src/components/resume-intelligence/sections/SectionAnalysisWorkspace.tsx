import React, { useState, useMemo, useEffect, useCallback } from 'react'
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
  const sectionsList = useMemo(() => Object.values(MOCK_SECTION_ANALYSIS_DATA), [])

  // State: Set of expanded section IDs
  const [expandedSectionIds, setExpandedSectionIds] = useState<Set<string>>(() => {
    const initialSet = new Set<string>()
    if (sectionsList[0]?.id) {
      initialSet.add(sectionsList[0].id)
    }
    return initialSet
  })

  // State: Active section ID for the navigator
  const [activeSectionId, setActiveSectionId] = useState<string>(sectionsList[0]?.id || 'professional-summary')

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

  // Select section handler from Navigator (Fixes Work Experience & scrolling)
  const handleSelectSection = useCallback((id: string) => {
    setActiveSectionId(id)

    // Ensure target section is expanded
    setExpandedSectionIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })

    // Scroll smoothly to the element
    setTimeout(() => {
      const element = document.getElementById(`section-${id}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 50)
  }, [])

  // Toggle single card expand/collapse
  const handleToggleExpand = useCallback((id: string) => {
    setExpandedSectionIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  // Expand all sections
  const handleExpandAll = useCallback(() => {
    setExpandedSectionIds(new Set(filteredSections.map((s) => s.id)))
  }, [filteredSections])

  // Collapse all sections
  const handleCollapseAll = useCallback(() => {
    setExpandedSectionIds(new Set())
  }, [])

  // Scroll Synchronization Observer
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id.replace('section-', '')
          if (sectionId) {
            setActiveSectionId(sectionId)
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-10% 0px -60% 0px',
      threshold: 0.1,
    })

    filteredSections.forEach((sec) => {
      const el = document.getElementById(`section-${sec.id}`)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [filteredSections])

  return (
    <div className="flex flex-col gap-4">
      {/* Top Workspace Controls: Showing count & Expand All / Collapse All */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="font-medium">
          Showing <strong className="text-slate-200">{filteredSections.length}</strong> of {sectionsList.length} Sections
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExpandAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e101c] border border-slate-800/80 hover:border-purple-500/40 text-[11px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer select-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <Maximize2 className="w-3 h-3 text-purple-400" />
            <span>Expand All</span>
          </button>

          <button
            onClick={handleCollapseAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e101c] border border-slate-800/80 hover:border-purple-500/40 text-[11px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer select-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <Minimize2 className="w-3 h-3 text-slate-400" />
            <span>Collapse All</span>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Section Navigation Panel */}
        <div className="lg:col-span-4 sticky top-6">
          <SectionNavPanel
            sections={filteredSections}
            activeSectionId={activeSectionId}
            onSelectSection={handleSelectSection}
          />
        </div>

        {/* Right Column: Section Analysis Cards List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {filteredSections.map((section) => (
            <SectionAnalysisCard
              key={section.id}
              section={section}
              isExpanded={expandedSectionIds.has(section.id)}
              onToggleExpand={() => handleToggleExpand(section.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SectionAnalysisWorkspace
