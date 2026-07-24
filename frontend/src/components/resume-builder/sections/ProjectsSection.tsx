import React, { useState } from 'react'
import { FolderGit2, Plus, Trash2, ChevronDown, ChevronUp, GripVertical, ArrowUp, ArrowDown } from 'lucide-react'

export interface ProjectItem {
  id: string
  name: string
  subtitle?: string
  liveUrl?: string
  githubUrl?: string
  techStack?: string[]
  bullets: string[]
}

interface ProjectsSectionProps {
  items?: ProjectItem[]
  onAdd?: () => void
  onDelete?: (id: string) => void
  onUpdate?: (id: string, updated: ProjectItem) => void
  onReorder?: (items: ProjectItem[]) => void
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  items = [
    {
      id: 'proj-1',
      name: 'Scorelia – AI Career Intelligence Platform',
      subtitle: 'Python, FastAPI, React, PostgreSQL',
      liveUrl: 'https://scorelia.ai',
      githubUrl: 'github.com/Dipakkhandagale7/scorelia',
      techStack: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'TailwindCSS'],
      bullets: [
        'Built an AI-powered platform that provides resume scoring, ATS analysis, job matching, interview preparation, and personalized career roadmaps.',
        'Architected asynchronous FastAPI backend services with high-concurrency request handling.',
      ],
    },
    {
      id: 'proj-2',
      name: 'Deepfake Video Detector',
      subtitle: 'Python, TensorFlow, OpenCV',
      githubUrl: 'github.com/Dipakkhandagale7/deepfake-detector',
      techStack: ['Python', 'TensorFlow', 'ResNet50', 'BiLSTM', 'OpenCV'],
      bullets: [
        'Developed a deepfake detection model using ResNet50 + BiLSTM with high classification accuracy.',
      ],
    },
  ],
  onAdd,
  onDelete,
  onUpdate,
  onReorder,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return

    const newItems = [...items]
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp
    onReorder?.(newItems)
  }

  return (
    <div className="space-y-5 animate-fade-in text-left">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
            <FolderGit2 size={14} />
            <span>Key Projects</span>
          </div>
          <h3 className="text-lg font-bold text-white font-display mt-0.5 m-0">
            Portfolio &amp; Open Source Projects
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Showcase technical projects, GitHub repositories, systems built, and product links. Drag to reorder.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600/80 hover:bg-purple-600 border border-purple-500/40 shadow-sm cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <Plus size={14} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="bg-slate-900/40 border border-dashed border-white/15 rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/20">
            <FolderGit2 size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white m-0">No Projects Added Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto m-0">
              Highlight key projects, hackathon wins, and production applications built.
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer transition-all"
          >
            <Plus size={13} />
            <span>Add First Project</span>
          </button>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {items.map((proj, idx) => {
          const isExpanded = expandedId === proj.id
          return (
            <div
              key={proj.id}
              className="bg-slate-900/60 border border-white/10 rounded-xl overflow-hidden shadow-sm transition-all group"
            >
              {/* Header Bar */}
              <div
                onClick={() => toggleExpand(proj.id)}
                className="flex items-center justify-between p-3.5 bg-slate-950/40 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Reorder Handle & Arrow Controls */}
                  <div
                    className="flex items-center gap-0.5 text-slate-500 group-hover:text-slate-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GripVertical size={16} className="cursor-grab active:cursor-grabbing" />
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-0.5 hover:text-purple-400 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                      aria-label="Move project up"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-0.5 hover:text-purple-400 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                      aria-label="Move project down"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-extrabold text-xs">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate m-0">
                      {proj.name || 'Untitled Project'}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate m-0 font-sans">
                      {proj.subtitle || (proj.techStack || []).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.(proj.id)
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-white/10 cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="p-1.5 text-slate-400">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Body */}
              {isExpanded && (
                <div className="p-4 md:p-5 space-y-4 border-t border-white/5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Project Title *</label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) =>
                          onUpdate?.(proj.id, { ...proj, name: e.target.value })
                        }
                        placeholder="e.g. Scorelia AI Platform"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 font-sans">Live Demo URL</label>
                      <input
                        type="text"
                        value={proj.liveUrl || ''}
                        onChange={(e) =>
                          onUpdate?.(proj.id, { ...proj, liveUrl: e.target.value })
                        }
                        placeholder="https://myproject.com"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 font-sans">GitHub Repo</label>
                      <input
                        type="text"
                        value={proj.githubUrl || ''}
                        onChange={(e) =>
                          onUpdate?.(proj.id, { ...proj, githubUrl: e.target.value })
                        }
                        placeholder="github.com/user/project"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-purple-500/80"
                      />
                    </div>
                  </div>

                  {/* Bullet Points List */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <label className="text-xs font-semibold text-slate-300">Project Features &amp; Technical Highlights</label>
                    {proj.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <span className="text-slate-500 font-mono text-xs">•</span>
                        <input
                          type="text"
                          value={b}
                          onChange={(e) => {
                            const newBullets = [...proj.bullets]
                            newBullets[bIdx] = e.target.value
                            onUpdate?.(proj.id, { ...proj, bullets: newBullets })
                          }}
                          placeholder="Describe what you built, architecture used, and results achieved"
                          className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-purple-500/80"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newBullets = proj.bullets.filter((_, i) => i !== bIdx)
                            onUpdate?.(proj.id, { ...proj, bullets: newBullets })
                          }}
                          className="p-1 text-slate-500 hover:text-pink-400 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        onUpdate?.(proj.id, {
                          ...proj,
                          bullets: [...proj.bullets, 'New key project highlight or feature.'],
                        })
                      }}
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <Plus size={13} /> Add Highlight
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
