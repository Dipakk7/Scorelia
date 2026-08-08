import React, { useState, useMemo, useEffect } from 'react'
import { useTasks } from '@/hooks/useTasks'
import {
  type TaskItem,
  type TaskStatus,
  type TaskPriority,
} from '@/data/taskAutomationKnowledgeMockData'
import { SearchAgents } from './SearchAgents'
import { EmptyTasksState } from './EmptyTasksState'
import DeleteDialog from '@/components/ui/DeleteDialog'
import {
  CheckSquare,
  Clock,
  Play,
  Pause,
  RotateCcw,
  XCircle,
  MoreVertical,
  Bot,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TasksWorkspaceProps {
  className?: string
}

export function TasksWorkspace({ className }: TasksWorkspaceProps) {
  const { tasks: queryTasks, toggleTaskStatus, deleteTask } = useTasks()

  const [tasksList, setTasksList] = useState<TaskItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [deletingTask, setDeletingTask] = useState<TaskItem | null>(null)

  useEffect(() => {
    if (queryTasks && queryTasks.length > 0) {
      setTasksList(queryTasks)
    }
  }, [queryTasks])

  // Handlers
  const handleToggleTaskStatus = async (taskId: string) => {
    setTasksList((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus: TaskStatus = t.status === 'running' ? 'pending' : 'running'
          return { ...t, status: nextStatus }
        }
        return t
      })
    )
    await toggleTaskStatus(taskId)
  }

  const handleDeleteTask = async (taskId: string) => {
    setTasksList((prev) => prev.filter((t) => t.id !== taskId))
    setDeletingTask(null)
    await deleteTask(taskId)
  }

  // Summary Counts
  const pendingCount = useMemo(() => tasksList.filter((t) => t.status === 'pending' || t.status === 'queued').length, [tasksList])
  const runningCount = useMemo(() => tasksList.filter((t) => t.status === 'running').length, [tasksList])
  const completedCount = useMemo(() => tasksList.filter((t) => t.status === 'completed').length, [tasksList])
  const failedCount = useMemo(() => tasksList.filter((t) => t.status === 'failed').length, [tasksList])

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasksList.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const nameMatch = t.name.toLowerCase().includes(q)
        const agentMatch = t.assignedAgent.toLowerCase().includes(q)
        return nameMatch || agentMatch
      }
      return true
    })
  }, [tasksList, statusFilter, priorityFilter, searchQuery])

  return (
    <div className={cn('space-y-4 sm:space-y-5 text-left font-sans w-full max-w-full min-w-0', className)}>
      {/* 1. Summary Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 items-stretch">
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#111322] border border-white/10 flex items-center justify-between shadow-lg">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pending / Queued</span>
            <span className="text-xl sm:text-2xl font-black text-white">{pendingCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <Clock size={18} />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-[#111322] border border-white/10 flex items-center justify-between shadow-lg">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Running Now</span>
            <span className="text-xl sm:text-2xl font-black text-white">{runningCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
            <Play size={18} className="animate-pulse" />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-[#111322] border border-white/10 flex items-center justify-between shadow-lg">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed Today</span>
            <span className="text-xl sm:text-2xl font-black text-white">{completedCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <CheckSquare size={18} />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-[#111322] border border-white/10 flex items-center justify-between shadow-lg">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Failed Tasks</span>
            <span className="text-xl sm:text-2xl font-black text-white">{failedCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
            <AlertCircle size={18} />
          </div>
        </div>
      </div>

      {/* 2. Controls Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#111322] border border-white/10 shadow-xl">
        <SearchAgents
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search task name or assigned agent..."
        />

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b0c14] border border-white/10 text-slate-300">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#111322]">All Statuses</option>
              <option value="running" className="bg-[#111322]">Running</option>
              <option value="pending" className="bg-[#111322]">Pending</option>
              <option value="queued" className="bg-[#111322]">Queued</option>
              <option value="completed" className="bg-[#111322]">Completed</option>
              <option value="failed" className="bg-[#111322]">Failed</option>
              <option value="cancelled" className="bg-[#111322]">Cancelled</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b0c14] border border-white/10 text-slate-300">
            <span className="text-slate-400 font-medium">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#111322]">All Priorities</option>
              <option value="critical" className="bg-[#111322]">Critical</option>
              <option value="high" className="bg-[#111322]">High</option>
              <option value="medium" className="bg-[#111322]">Medium</option>
              <option value="low" className="bg-[#111322]">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Task Queue Table / List */}
      {filteredTasks.length === 0 ? (
        <EmptyTasksState
          onResetFilters={() => {
            setSearchQuery('')
            setStatusFilter('all')
            setPriorityFilter('all')
          }}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111322] shadow-xl">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead className="bg-[#0b0c14] border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none">
              <tr>
                <th className="py-3.5 px-4">Task Name</th>
                <th className="py-3.5 px-3">Assigned Agent</th>
                <th className="py-3.5 px-3">Priority</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Progress</th>
                <th className="py-3.5 px-3">Est. Duration</th>
                <th className="py-3.5 px-3">Created</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-white/[0.03] transition-colors">
                  {/* Task Name */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{task.name}</span>
                  </td>

                  {/* Assigned Agent */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className={cn('h-6 w-6 rounded-lg flex items-center justify-center text-white text-[10px]', task.assignedAgentIconBg)}>
                        <Bot size={13} />
                      </div>
                      <span className="font-semibold text-slate-200 text-xs">{task.assignedAgent}</span>
                    </div>
                  </td>

                  {/* Priority Badge */}
                  <td className="py-3.5 px-3">
                    {task.priority === 'critical' && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider">
                        Critical
                      </span>
                    )}
                    {task.priority === 'high' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                        High
                      </span>
                    )}
                    {task.priority === 'medium' && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider">
                        Medium
                      </span>
                    )}
                    {task.priority === 'low' && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30 text-[10px] font-bold uppercase tracking-wider">
                        Low
                      </span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3">
                    {task.status === 'running' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping" />
                        Running
                      </span>
                    )}
                    {task.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold">
                        Pending
                      </span>
                    )}
                    {task.status === 'queued' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30 text-[11px] font-semibold">
                        Queued
                      </span>
                    )}
                    {task.status === 'completed' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                        Completed
                      </span>
                    )}
                    {task.status === 'failed' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-semibold">
                        Failed
                      </span>
                    )}
                    {task.status === 'cancelled' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-slate-700 text-[11px] font-semibold">
                        Cancelled
                      </span>
                    )}
                  </td>

                  {/* Progress % */}
                  <td className="py-3.5 px-3 min-w-[100px]">
                    <div className="space-y-1">
                      <span className="font-semibold text-[11px] font-mono text-slate-300">{task.progress}%</span>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            task.status === 'failed'
                              ? 'bg-rose-500'
                              : task.progress === 100
                              ? 'bg-emerald-400'
                              : 'bg-purple-500'
                          )}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="py-3.5 px-3 font-mono text-slate-300">{task.estimatedDuration}</td>

                  {/* Created */}
                  <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">{task.createdTime}</td>

                  {/* Quick Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(activeMenuId === task.id ? null : task.id)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {activeMenuId === task.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                          <div className="absolute right-0 top-full mt-1 z-50 w-36 rounded-xl bg-[#121322] border border-white/10 shadow-2xl p-1 space-y-0.5 text-xs text-slate-200">
                            <button
                              type="button"
                              onClick={() => {
                                handleToggleTaskStatus(task.id)
                                setActiveMenuId(null)
                              }}
                              className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left font-medium cursor-pointer"
                            >
                              {task.status === 'running' ? <Pause size={13} className="text-amber-400" /> : <Play size={13} className="text-emerald-400" />}
                              <span>{task.status === 'running' ? 'Pause' : 'Run Task'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setActiveMenuId(null)}
                              className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left font-medium cursor-pointer"
                            >
                              <RotateCcw size={13} className="text-blue-400" />
                              <span>Retry Task</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null)
                                setDeletingTask(task)
                              }}
                              className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 text-left font-medium cursor-pointer"
                            >
                              <XCircle size={13} />
                              <span>Cancel / Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingTask && (
        <DeleteDialog
          isOpen={!!deletingTask}
          onClose={() => setDeletingTask(null)}
          onConfirm={async () => handleDeleteTask(deletingTask.id)}
          title={`Delete "${deletingTask.name}"?`}
          description="Are you sure you want to cancel and delete this task from the queue?"
        />
      )}
    </div>
  )
}

export default TasksWorkspace
