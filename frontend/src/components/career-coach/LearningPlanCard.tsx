import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { ProgressTracker } from './ProgressTracker'
import { CheckSquare, Square, Book, PlayCircle, Award, Terminal, Calendar, Layers } from 'lucide-react'
import type { AILearningPlanResponse } from '@/types/roadmap'

interface LearningPlanCardProps {
  learningPlan: AILearningPlanResponse | null
  roadmapId: string
  isLoading?: boolean
}

export function LearningPlanCard({ learningPlan, roadmapId, isLoading = false }: LearningPlanCardProps) {
  // Key for local storage
  const storageKey = `scorelia_tasks_completed_${roadmapId}`

  // State to hold completed tasks mapping (task unique string -> boolean)
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({})

  // Load completed tasks status from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        setCompletedTasks(JSON.parse(saved))
      } else {
        setCompletedTasks({})
      }
    } catch (e) {
      console.error('Failed to load completed tasks', e)
    }
  }, [roadmapId, storageKey])

  // Save changes to localStorage
  const toggleTask = (taskKey: string) => {
    const nextState = {
      ...completedTasks,
      [taskKey]: !completedTasks[taskKey]
    }
    setCompletedTasks(nextState)
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextState))
    } catch (e) {
      console.error('Failed to save completed tasks', e)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="border-slate-200/60 dark:border-slate-800/40 animate-pulse">
            <CardContent className="h-32 bg-slate-100/50 dark:bg-slate-900/50" />
          </Card>
        ))}
      </div>
    )
  }

  if (!learningPlan) {
    return (
      <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md">
        <CardContent className="py-12 text-center text-xs text-slate-400 italic">
          No learning plan generated yet. Generate or select a roadmap to get started.
        </CardContent>
      </Card>
    )
  }

  // Gather all items to calculate a progress percentage
  // We'll collect all checkable tasks in a list
  const checkableTasks = (() => {
    const list: { key: string; label: string; group: string }[] = []
    
    // Add weekly tasks
    learningPlan.weekly_plan?.forEach((week) => {
      week.schedule?.forEach((day) => {
        day.tasks?.forEach((task, tIdx) => {
          list.push({
            key: `week-${week.week_number}-day-${day.day}-task-${tIdx}`,
            label: `Week ${week.week_number} (${day.day}): ${task}`,
            group: 'Weekly Schedule'
          })
        })
      })
    })

    // Add general items
    learningPlan.courses?.forEach((item, idx) => {
      list.push({ key: `course-${idx}`, label: item, group: 'Courses' })
    })

    learningPlan.books?.forEach((item, idx) => {
      list.push({ key: `book-${idx}`, label: item, group: 'Books' })
    })

    learningPlan.hands_on_projects?.forEach((item, idx) => {
      list.push({ key: `project-${idx}`, label: item, group: 'Projects' })
    })

    learningPlan.certification_suggestions?.forEach((item, idx) => {
      list.push({ key: `cert-${idx}`, label: item, group: 'Certifications' })
    })

    return list
  })()

  const totalTasks = checkableTasks.length
  const completedTasksCount = checkableTasks.filter(t => completedTasks[t.key]).length
  const progressPercent = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Learning Plan header & Progress tracker */}
      <Card className="border-slate-200/60 dark:border-slate-800/40 bg-slate-900 text-white p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold font-display m-0">Learning Progress</h3>
            <p className="text-xs text-slate-400 font-sans m-0">
              Track courses, books, project milestones, and certifications.
            </p>
          </div>
          <div className="w-full md:max-w-xs space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-350">
              <span>Tasks Check-off: {completedTasksCount}/{totalTasks}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <ProgressTracker value={progressPercent} />
          </div>
        </div>
      </Card>

      {/* Split layout: Left for Weekly plan, Right for monthly goals and resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {/* Weekly plan (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-extrabold font-display text-slate-900 dark:text-white flex items-center gap-2 pl-1 m-0">
            <Calendar size={16} className="text-brand-500" />
            <span>Weekly Learning Schedule</span>
          </h3>

          <div className="space-y-4">
            {learningPlan.weekly_plan?.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No weekly schedule generated.</p>
            ) : (
              learningPlan.weekly_plan?.map((week) => (
                <Card key={week.week_number} className="border-slate-200/60 dark:border-slate-800/40 bg-white/60 dark:bg-slate-900/40">
                  <CardHeader className="pb-3 text-left">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <CardTitle className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 m-0">
                          Week {week.week_number}: {week.topic}
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 mt-1">
                          Focus: {week.focus}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    {/* Objectives list */}
                    {week.objectives && week.objectives.length > 0 && (
                      <div className="bg-slate-50 dark:bg-slate-950/20 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
                        <h5 className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Weekly Objectives</h5>
                        <ul className="list-disc pl-4 space-y-1">
                          {week.objectives.map((obj, oIdx) => (
                            <li key={oIdx} className="text-xs text-slate-650 dark:text-slate-455 font-sans">
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Schedule schedule item checks */}
                    <div className="space-y-3">
                      {week.schedule?.map((day) => (
                        <div key={day.day} className="space-y-2">
                          <h6 className="text-xs font-bold text-brand-600 dark:text-brand-400 font-display m-0">{day.day} — {day.focus}</h6>
                          <div className="space-y-1.5 pl-2">
                            {day.tasks?.map((task, tIdx) => {
                              const tKey = `week-${week.week_number}-day-${day.day}-task-${tIdx}`
                              const isDone = !!completedTasks[tKey]
                              return (
                                <button
                                  key={tIdx}
                                  onClick={() => toggleTask(tKey)}
                                  className="w-full flex items-start gap-2.5 text-left text-xs text-slate-650 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 p-1.5 rounded-lg transition-colors cursor-pointer focus:outline-none"
                                >
                                  <span className="shrink-0 mt-0.5 text-slate-400 hover:text-brand-500">
                                    {isDone ? (
                                      <CheckSquare size={16} className="text-brand-600 dark:text-brand-400" />
                                    ) : (
                                      <Square size={16} />
                                    )}
                                  </span>
                                  <span className={isDone ? 'line-through text-slate-400' : ''}>
                                    {task}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Recommended Resources (1/3 width) */}
        <div className="space-y-6">
          <h3 className="text-sm font-extrabold font-display text-slate-900 dark:text-white flex items-center gap-2 pl-1 m-0">
            <Layers size={16} className="text-purple-500" />
            <span>Recommended Assets</span>
          </h3>

          <div className="space-y-5">
            {/* Courses section */}
            {learningPlan.courses && learningPlan.courses.length > 0 && (
              <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/60 dark:bg-slate-900/40">
                <CardHeader className="pb-3 text-left">
                  <CardTitle className="text-xs font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-1.5 m-0">
                    <PlayCircle size={15} className="text-blue-500" />
                    <span>Courses</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {learningPlan.courses.map((item, idx) => {
                    const tKey = `course-${idx}`
                    const isDone = !!completedTasks[tKey]
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleTask(tKey)}
                        className="w-full flex items-start gap-2.5 text-left text-xs text-slate-650 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 p-1.5 rounded-lg transition-colors cursor-pointer focus:outline-none"
                      >
                        <span className="shrink-0 mt-0.5">
                          {isDone ? <CheckSquare size={14} className="text-brand-600" /> : <Square size={14} />}
                        </span>
                        <span className={isDone ? 'line-through text-slate-400' : ''}>{item}</span>
                      </button>
                    )
                  })}
                </CardContent>
              </Card>
            )}

            {/* Books section */}
            {learningPlan.books && learningPlan.books.length > 0 && (
              <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/60 dark:bg-slate-900/40">
                <CardHeader className="pb-3 text-left">
                  <CardTitle className="text-xs font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-1.5 m-0">
                    <Book size={15} className="text-emerald-500" />
                    <span>Books</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {learningPlan.books.map((item, idx) => {
                    const tKey = `book-${idx}`
                    const isDone = !!completedTasks[tKey]
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleTask(tKey)}
                        className="w-full flex items-start gap-2.5 text-left text-xs text-slate-650 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 p-1.5 rounded-lg transition-colors cursor-pointer focus:outline-none"
                      >
                        <span className="shrink-0 mt-0.5">
                          {isDone ? <CheckSquare size={14} className="text-brand-600" /> : <Square size={14} />}
                        </span>
                        <span className={isDone ? 'line-through text-slate-400' : ''}>{item}</span>
                      </button>
                    )
                  })}
                </CardContent>
              </Card>
            )}

            {/* Practice Projects section */}
            {learningPlan.hands_on_projects && learningPlan.hands_on_projects.length > 0 && (
              <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/60 dark:bg-slate-900/40">
                <CardHeader className="pb-3 text-left">
                  <CardTitle className="text-xs font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-1.5 m-0">
                    <Terminal size={15} className="text-amber-500" />
                    <span>Practice Projects</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {learningPlan.hands_on_projects.map((item, idx) => {
                    const tKey = `project-${idx}`
                    const isDone = !!completedTasks[tKey]
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleTask(tKey)}
                        className="w-full flex items-start gap-2.5 text-left text-xs text-slate-650 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 p-1.5 rounded-lg transition-colors cursor-pointer focus:outline-none"
                      >
                        <span className="shrink-0 mt-0.5">
                          {isDone ? <CheckSquare size={14} className="text-brand-600" /> : <Square size={14} />}
                        </span>
                        <span className={isDone ? 'line-through text-slate-400' : ''}>{item}</span>
                      </button>
                    )
                  })}
                </CardContent>
              </Card>
            )}

            {/* Certifications section */}
            {learningPlan.certification_suggestions && learningPlan.certification_suggestions.length > 0 && (
              <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/60 dark:bg-slate-900/40">
                <CardHeader className="pb-3 text-left">
                  <CardTitle className="text-xs font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-1.5 m-0">
                    <Award size={15} className="text-purple-500" />
                    <span>Certifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {learningPlan.certification_suggestions.map((item, idx) => {
                    const tKey = `cert-${idx}`
                    const isDone = !!completedTasks[tKey]
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleTask(tKey)}
                        className="w-full flex items-start gap-2.5 text-left text-xs text-slate-650 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 p-1.5 rounded-lg transition-colors cursor-pointer focus:outline-none"
                      >
                        <span className="shrink-0 mt-0.5">
                          {isDone ? <CheckSquare size={14} className="text-brand-600" /> : <Square size={14} />}
                        </span>
                        <span className={isDone ? 'line-through text-slate-400' : ''}>{item}</span>
                      </button>
                    )
                  })}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default LearningPlanCard
