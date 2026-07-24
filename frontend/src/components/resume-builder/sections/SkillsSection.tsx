import React, { useState } from 'react'
import { Code, Plus, X, GripVertical, ArrowUp, ArrowDown } from 'lucide-react'

export interface SkillCategory {
  id: string
  name: string
  skills: string[]
}

interface SkillsSectionProps {
  categories?: SkillCategory[]
  onAddCategory?: () => void
  onDeleteCategory?: (id: string) => void
  onUpdateCategory?: (id: string, updated: SkillCategory) => void
  onReorder?: (categories: SkillCategory[]) => void
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  categories = [
    {
      id: 'cat-1',
      name: 'Programming Languages',
      skills: ['Python', 'SQL', 'JavaScript', 'TypeScript', 'C++'],
    },
    {
      id: 'cat-2',
      name: 'ML & AI Frameworks',
      skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenCV', 'NLP', 'LangChain'],
    },
    {
      id: 'cat-3',
      name: 'Tools & Databases',
      skills: ['FastAPI', 'React', 'PostgreSQL', 'Docker', 'Git', 'MySQL', 'VS Code'],
    },
    {
      id: 'cat-4',
      name: 'Data Libraries',
      skills: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
    },
  ],
  onAddCategory,
  onDeleteCategory,
  onUpdateCategory,
  onReorder,
}) => {
  const [newSkillText, setNewSkillText] = useState<Record<string, string>>({})

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= categories.length) return

    const newCats = [...categories]
    const temp = newCats[index]
    newCats[index] = newCats[targetIndex]
    newCats[targetIndex] = temp
    onReorder?.(newCats)
  }

  const handleAddSkillTag = (catId: string) => {
    const text = (newSkillText[catId] || '').trim()
    if (!text) return

    const cat = categories.find((c) => c.id === catId)
    if (cat && onUpdateCategory) {
      onUpdateCategory(catId, {
        ...cat,
        skills: [...cat.skills, text],
      })
      setNewSkillText({ ...newSkillText, [catId]: '' })
    }
  }

  const handleRemoveSkillTag = (catId: string, skillIdx: number) => {
    const cat = categories.find((c) => c.id === catId)
    if (cat && onUpdateCategory) {
      onUpdateCategory(catId, {
        ...cat,
        skills: cat.skills.filter((_, i) => i !== skillIdx),
      })
    }
  }

  return (
    <div className="space-y-5 animate-fade-in text-left">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
            <Code size={14} />
            <span>Technical Capabilities</span>
          </div>
          <h3 className="text-lg font-bold text-white font-display mt-0.5 m-0">
            Skills &amp; Competencies
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Group skills into clear categories for maximum readability and ATS keyword matching. Drag categories to reorder.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddCategory}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600/80 hover:bg-purple-600 border border-purple-500/40 shadow-sm cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <Plus size={14} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="bg-slate-900/40 border border-dashed border-white/15 rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/20">
            <Code size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white m-0">No Skills Added Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto m-0">
              Add technical languages, frameworks, developer tools, and domain expertise.
            </p>
          </div>
          <button
            type="button"
            onClick={onAddCategory}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer transition-all"
          >
            <Plus size={13} />
            <span>Add Skill Category</span>
          </button>
        </div>
      )}

      {/* Skill Categories List */}
      <div className="space-y-3">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className="bg-slate-900/60 border border-white/10 rounded-xl p-4 space-y-3 shadow-sm group"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-slate-500 group-hover:text-slate-300">
                  <GripVertical size={16} className="cursor-grab active:cursor-grabbing" />
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-0.5 hover:text-purple-400 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                    aria-label="Move skill category up"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === categories.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-0.5 hover:text-purple-400 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                    aria-label="Move skill category down"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) =>
                    onUpdateCategory?.(cat.id, { ...cat, name: e.target.value })
                  }
                  className="text-xs font-bold text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-purple-500 focus:outline-none px-1 py-0.5 rounded transition-colors font-display"
                />
              </div>

              <button
                type="button"
                onClick={() => onDeleteCategory?.(cat.id)}
                className="text-xs text-slate-500 hover:text-pink-400 cursor-pointer p-1"
                title="Remove Category"
              >
                <X size={14} />
              </button>
            </div>

            {/* Skill Tags List */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {cat.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-950/40 text-purple-200 border border-purple-500/30 group/tag"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkillTag(cat.id, sIdx)}
                    className="text-purple-400 hover:text-white cursor-pointer opacity-70 group-hover/tag:opacity-100"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}

              {/* Add Tag Input Box */}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="+ Add skill tag..."
                  value={newSkillText[cat.id] || ''}
                  onChange={(e) => setNewSkillText({ ...newSkillText, [cat.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddSkillTag(cat.id)
                    }
                  }}
                  className="bg-slate-950/80 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-200 focus:outline-none focus:border-purple-500/80 w-32"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
