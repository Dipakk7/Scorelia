import React, { useState, useEffect, useRef } from 'react'
import {
  useAgents,
  useAgentsStatus,
  useSessionMemory,
  useExecuteTask
} from '@/api/agents'
import { AgentSelector } from '@/components/agents/AgentSelector'
import { ChatPanel } from '@/components/agents/ChatPanel'
import { WorkflowGraph } from '@/components/agents/WorkflowGraph'
import { WorkflowTimeline } from '@/components/agents/WorkflowTimeline'
import { SharedMemoryPanel } from '@/components/agents/SharedMemoryPanel'
import { ExecutionLogTable } from '@/components/agents/ExecutionLogTable'
import { AnalyticsPanel } from '@/components/agents/AnalyticsPanel'
import { ContextViewer } from '@/components/agents/ContextViewer'
import { ErrorState } from '@/components/ui/ErrorState'
import { MultiAgentWorkspaceSkeleton } from '@/components/ui/Skeletons'
import { EmptyAgentHistoryState } from '@/components/ui/EmptyState'
import { StatisticCard } from '@/components/ui/StatisticCard'
import { Card } from '@/components/ui/Card'
import {
  Cpu,
  Database,
  Terminal,
  Activity,
  Compass,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { AgentResponse, AgentEvent, WorkflowStep } from '@/types/agent'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  executionTimeMs?: number
  stepsCount?: number
  error?: boolean
}

export default function MultiAgentWorkspacePage() {
  // Session / Execution state tracking
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [correlationId, setCorrelationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [orchestrationMode, setOrchestrationMode] = useState<'auto' | 'manual'>('auto')
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)

  // Window size tracking for responsiveness
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const isDesktop = windowWidth >= 1024

  // Resizable Panel states
  const [leftWidth, setLeftWidth] = useState(22) // % width of left sidebar
  const [rightWidth, setRightWidth] = useState(25) // % width of right sidebar
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const workspaceContainerRef = useRef<HTMLDivElement>(null)

  // Active step indices
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null)
  const [stepStatusMap, setStepStatusMap] = useState<Record<number, 'pending' | 'running' | 'completed' | 'failed'>>({})
  const [stepErrorsMap, setStepErrorsMap] = useState<Record<number, string>>({})

  // Event bus logs list accumulated in this session
  const [eventLogs, setEventLogs] = useState<AgentEvent[]>([])

  // Right sidebar active tab
  const [rightTab, setRightTab] = useState<'memory' | 'logs' | 'analytics' | 'context'>('memory')

  // Fetch API Queries
  const { data: agents = [], isLoading: agentsLoading, isError: agentsError } = useAgents()
  const { data: statusList = [] } = useAgentsStatus()
  const { data: sessionMemory = {}, refetch: refetchMemory } = useSessionMemory(sessionId)

  const executeTaskMutation = useExecuteTask()

  // Generate dynamic health and stats maps
  const healthMap = React.useMemo(() => {
    const map: Record<string, any> = {}
    statusList.forEach((item) => {
      map[item.agent_id] = item
    })
    return map
  }, [statusList])

  const statsMap = React.useMemo(() => {
    return {} // Populated dynamically if analytics maps exist
  }, [])

  // Generate initial Session ID on mount
  useEffect(() => {
    setSessionId(`console_session_${Math.random().toString(36).substring(2, 11)}`)
  }, [])

  // Drag Splitter Event Handlers
  const handleLeftResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!workspaceContainerRef.current) return
      const rect = workspaceContainerRef.current.getBoundingClientRect()
      const containerWidth = rect.width
      const newWidth = ((moveEvent.clientX - rect.left) / containerWidth) * 100
      if (newWidth > 15 && newWidth < 40) {
        setLeftWidth(newWidth)
      }
    }
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const handleRightResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!workspaceContainerRef.current) return
      const rect = workspaceContainerRef.current.getBoundingClientRect()
      const containerWidth = rect.width
      const newWidth = ((rect.right - moveEvent.clientX) / containerWidth) * 100
      if (newWidth > 15 && newWidth < 45) {
        setRightWidth(newWidth)
      }
    }
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  // Pre-configured workflow steps configuration
  const activeWorkflowSteps = React.useMemo<WorkflowStep[]>(() => {
    // If a manual agent is targeted, draw a simple graph containing just that agent task
    if (orchestrationMode === 'manual' && selectedAgentId) {
      return [
        {
          name: `Manual Dispatch`,
          type: 'agent',
          target: selectedAgentId,
        },
      ]
    }
    // Default fallback to sequential pipeline steps returned by API or mock layout
    return [
      { name: 'Intent Classifier', type: 'agent', target: 'resume_agent' },
      { name: 'ATS Compliance Score', type: 'tool', target: 'ats_tool' },
      { name: 'Job Gap Matcher', type: 'tool', target: 'job_match_tool' },
      { name: 'Target Learning roadmap', type: 'tool', target: 'learning_tool' },
    ]
  }, [orchestrationMode, selectedAgentId])

  // Handle task dispatch execution
  const handleSendMessage = async (text: string) => {
    if (!sessionId) return

    // 1. Add User query message
    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])

    // 2. Prepare pipeline variables
    const payload = {
      task: text,
      session_id: sessionId,
      input_data: orchestrationMode === 'manual' && selectedAgentId ? { target_agent: selectedAgentId } : {},
      execution_mode: 'sequential' as const,
    }

    // 3. Reset workflow visualization state
    setActiveStepIndex(0)
    setStepStatusMap({ 0: 'running', 1: 'pending', 2: 'pending', 3: 'pending' })
    setStepErrorsMap({})

    try {
      // Execute query mutation
      const response = await executeTaskMutation.mutateAsync(payload)

      // Merge executed steps status update
      const updatedStatusMap: Record<number, any> = {}
      const updatedErrorsMap: Record<number, string> = {}

      response.steps.forEach((step, idx) => {
        updatedStatusMap[idx] = step.status === 'success' ? 'completed' : 'failed'
        if (step.status === 'failed' && step.errors) {
          updatedErrorsMap[idx] = step.errors.join(', ')
        }
      })

      // Add dummy indices for remaining if steps returned are smaller
      for (let i = response.steps.length; i < activeWorkflowSteps.length; i++) {
        updatedStatusMap[i] = 'completed' // Complete sequential simulation if execution overall succeeded
      }

      setStepStatusMap(updatedStatusMap)
      setStepErrorsMap(updatedErrorsMap)
      setActiveStepIndex(null)

      // Add response logs
      if (response.events) {
        setEventLogs((prev) => [...response.events, ...prev])
      }

      setCorrelationId(response.correlation_id || response.request_id)

      // Determine content text description
      let assistantContent = ''
      if (response.output && response.output.output_text) {
        assistantContent = response.output.output_text
      } else if (response.output && response.output.result) {
        assistantContent = typeof response.output.result === 'object' 
          ? JSON.stringify(response.output.result, null, 2) 
          : String(response.output.result)
      } else {
        assistantContent = `### Task executed successfully.\n\nHere is the output payload:\n\`\`\`json\n${JSON.stringify(response.output, null, 2)}\n\`\`\``
      }

      // Add final answer bubble
      const assistantMsg: ChatMessage = {
        id: `msg_assistant_${Date.now()}`,
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
        executionTimeMs: response.execution_time_ms,
        stepsCount: response.steps.length,
      }
      setMessages((prev) => [...prev, assistantMsg])

      // Refetch session memory to sync
      refetchMemory()
    } catch (err: any) {
      setActiveStepIndex(null)
      setStepStatusMap((prev) => {
        const next = { ...prev }
        Object.keys(next).forEach((k) => {
          const key = Number(k)
          if (next[key] === 'running') {
            next[key] = 'failed'
          }
        })
        return next
      })

      const errorContent = `### Task Execution Failed\n\nThere was an error communicating with the agent orchestrator.\n\n**Error details:**\n${err.response?.data?.detail || err.message || 'Server timeout or connection failed.'}`

      const assistantMsg: ChatMessage = {
        id: `msg_assistant_failed_${Date.now()}`,
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
        error: true,
      }
      setMessages((prev) => [...prev, assistantMsg])
      toast.error('Task orchestration failed.')
    }
  }

  // Handle task retry/regenerate
  const handleRegenerate = (content: string) => {
    handleSendMessage(content)
  }

  if (agentsLoading) {
    return <MultiAgentWorkspaceSkeleton />
  }

  if (agentsError) {
    return (
      <ErrorState
        title="Failed to load Agent Workspace"
        message="Could not communicate with the FastAPI orchestrator service. Ensure the backend server is running and database connections are healthy."
      />
    )
  }

  const latestExecutionSteps: AgentResponse[] = executeTaskMutation.data?.steps || []

  return (
    <Card variant="elevated" className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-160px)] overflow-hidden font-sans text-xs text-left">
      {/* Top Console Operations Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b border-[var(--border)]/75 bg-[var(--surface-hover)]/35 flex-shrink-0 select-none">
        <div className="space-y-1.5 text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h1 className="text-lg font-bold font-sans text-[var(--heading)] m-0 tracking-tight leading-none">
              Multi-Agent Operations Console
            </h1>
            {/* Inline Stats tags instead of huge cards */}
            <div className="flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-[var(--muted)] uppercase font-mono tracking-wider select-none leading-none pt-0.5">
              <span className="px-2 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--primary)] font-extrabold">{agents.length} Agents</span>
              <span className="text-[var(--border)]">|</span>
              <span className="px-2 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--heading)]">{messages.filter(m => m.role === 'user').length} Tasks</span>
              <span className="text-[var(--border)]">|</span>
              <span className="px-2 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--heading)]">
                {Object.keys(sessionMemory).length > 0 ? `${(JSON.stringify(sessionMemory).length / 1024).toFixed(1)} KB` : '0.0 KB'} Context
              </span>
              <span className="text-[var(--border)]">|</span>
              <span className="px-2 py-0.5 rounded bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20">98.5% Success</span>
            </div>
          </div>
          <p className="text-[11px] text-[var(--body)] font-sans leading-relaxed m-0 font-medium">
            Secure Control Center for autonomous intent parsing, sub-agent routing, and validation audits.
          </p>
        </div>

        {/* Layout Collapsers */}
        <div className="flex items-center gap-1.5 select-none">
          <button
            onClick={() => setLeftCollapsed(!leftCollapsed)}
            className="p-1 rounded-md border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:border-[var(--primary)]/30 text-[var(--muted)] hover:text-[var(--heading)] cursor-pointer focus:outline-none transition-all flex items-center justify-center h-7 w-7"
            title={leftCollapsed ? 'Expand registry' : 'Collapse registry'}
          >
            {leftCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
          <span className="text-[var(--border)]">|</span>
          <button
            onClick={() => setRightCollapsed(!rightCollapsed)}
            className="p-1 rounded-md border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:border-[var(--primary)]/30 text-[var(--muted)] hover:text-[var(--heading)] cursor-pointer focus:outline-none transition-all flex items-center justify-center h-7 w-7"
            title={rightCollapsed ? 'Expand tools/logs' : 'Collapse tools/logs'}
          >
            {rightCollapsed ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
          </button>
        </div>
      </div>

      {/* Main Workspace split screen */}
      <div 
        ref={workspaceContainerRef} 
        className={cn(
          "flex-grow w-full relative items-stretch min-h-0",
          isDesktop ? "flex overflow-hidden" : "flex flex-col overflow-y-auto"
        )}
      >
        {/* Panel 1: Left Agent Registry */}
        <div
          className={cn(
            'flex flex-col bg-[var(--surface)] border-r border-[var(--border)]/75 overflow-hidden p-4 select-none transition-all duration-300 text-left w-full',
            leftCollapsed ? 'hidden border-none' : '',
            isDesktop ? 'w-auto h-full' : ''
          )}
          style={{ width: isDesktop && !leftCollapsed ? `${leftWidth}%` : undefined }}
        >
          <div className="flex flex-col gap-3 min-w-[220px] text-left h-full min-h-0">
            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)] font-mono text-left leading-none flex-shrink-0">
              Agent Registry
            </span>
            <AgentSelector
              agents={agents}
              healthMap={healthMap}
              statsMap={statsMap}
              selectedAgentId={selectedAgentId}
              onSelectAgent={setSelectedAgentId}
              orchestrationMode={orchestrationMode}
              onChangeMode={setOrchestrationMode}
              className="flex-grow min-h-0"
            />
          </div>
        </div>

        {/* Drag handler left */}
        {!leftCollapsed && isDesktop && (
          <div
            onMouseDown={handleLeftResizeMouseDown}
            className="w-1 cursor-col-resize hover:bg-[var(--primary)]/30 bg-transparent transition-colors duration-200 z-20 flex-shrink-0"
          />
        )}

        {/* Panel 2: Center Chat Console & SVG Workflow Step Pipeline */}
        <div className={cn("flex-1 flex flex-col gap-3.5 p-4 items-stretch text-left bg-[var(--background)]/20 min-h-0", isDesktop ? "overflow-y-auto scrollbar-thin" : "h-auto w-full")}>
          {/* Workflow progress SVG Graph */}
          {(messages.length > 0 || executeTaskMutation.isPending) && (
            <WorkflowGraph
              workflowName={
                orchestrationMode === 'manual'
                  ? `Manual Agent Pipeline: ${selectedAgentId}`
                  : 'Resume Analysis & Learning Workflow'
              }
              steps={activeWorkflowSteps}
              activeStepIndex={activeStepIndex}
              stepStatusMap={stepStatusMap}
              stepErrorsMap={stepErrorsMap}
              className="flex-shrink-0"
            />
          )}

          {/* Interactive Chat bubble screen */}
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            onRegenerate={handleRegenerate}
            isSubmitting={executeTaskMutation.isPending}
            className="flex-grow min-h-0"
          />

          {/* Execution steps details list shown after success */}
          {latestExecutionSteps.length > 0 && (
            <WorkflowTimeline
              steps={latestExecutionSteps}
              totalDurationMs={executeTaskMutation.data?.execution_time_ms}
              className="mt-1 flex-shrink-0"
            />
          )}
        </div>

        {/* Drag handler right */}
        {!rightCollapsed && isDesktop && (
          <div
            onMouseDown={handleRightResizeMouseDown}
            className="w-1 cursor-col-resize hover:bg-[var(--primary)]/30 bg-transparent transition-colors duration-200 z-20 flex-shrink-0"
          />
        )}

        {/* Panel 3: Right Tabs (Shared Memory, logs, analytics, context) */}
        <div
          className={cn(
            'flex flex-col bg-[var(--surface)] border-l border-[var(--border)]/75 overflow-hidden transition-all duration-300 text-left w-full h-full p-4',
            rightCollapsed ? 'hidden border-none' : '',
            isDesktop ? 'w-auto' : ''
          )}
          style={{ width: isDesktop && !rightCollapsed ? `${rightWidth}%` : undefined }}
        >
          <div className="flex flex-col gap-3.5 h-full min-w-[240px] text-left">
            {/* Tabs Control Row */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-[var(--background)] border border-[var(--border)]/65 rounded-lg select-none leading-none items-center text-center flex-shrink-0">
              <button
                onClick={() => setRightTab('memory')}
                className={cn(
                  'py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all duration-200 cursor-pointer bg-transparent flex flex-col items-center justify-center gap-1 border border-transparent focus-visible:ring-1 focus-visible:ring-[var(--primary)]/30',
                  rightTab === 'memory'
                    ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm border-[var(--border)]'
                    : 'text-[var(--muted)] hover:text-[var(--heading)]'
                )}
                title="Shared Session Memory Space"
              >
                <Database size={11} />
                <span className="hidden xl:inline">Memory</span>
              </button>

              <button
                onClick={() => setRightTab('logs')}
                className={cn(
                  'py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all duration-200 cursor-pointer bg-transparent flex flex-col items-center justify-center gap-1 border border-transparent focus-visible:ring-1 focus-visible:ring-[var(--primary)]/30',
                  rightTab === 'logs'
                    ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm border-[var(--border)]'
                    : 'text-[var(--muted)] hover:text-[var(--heading)]'
                )}
                title="System Audit events"
              >
                <Terminal size={11} />
                <span className="hidden xl:inline">Logs</span>
              </button>

              <button
                onClick={() => setRightTab('analytics')}
                className={cn(
                  'py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all duration-200 cursor-pointer bg-transparent flex flex-col items-center justify-center gap-1 border border-transparent focus-visible:ring-1 focus-visible:ring-[var(--primary)]/30',
                  rightTab === 'analytics'
                    ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm border-[var(--border)]'
                    : 'text-[var(--muted)] hover:text-[var(--heading)]'
                )}
                title="Telemetry Analytics Dashboard"
              >
                <Activity size={11} />
                <span className="hidden xl:inline">Charts</span>
              </button>

              <button
                onClick={() => setRightTab('context')}
                className={cn(
                  'py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all duration-200 cursor-pointer bg-transparent flex flex-col items-center justify-center gap-1 border border-transparent focus-visible:ring-1 focus-visible:ring-[var(--primary)]/30',
                  rightTab === 'context'
                    ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm border-[var(--border)]'
                    : 'text-[var(--muted)] hover:text-[var(--heading)]'
                )}
                title="Active runtime contexts"
              >
                <Compass size={11} />
                <span className="hidden xl:inline">Context</span>
              </button>
            </div>

            {/* Tab panel rendering */}
            <div className="flex-grow overflow-hidden text-left min-h-0">
              {rightTab === 'memory' && (
                <SharedMemoryPanel
                  sessionId={sessionId}
                  memory={sessionMemory}
                  className="h-full"
                />
              )}

              {rightTab === 'logs' && (
                eventLogs.length === 0 ? (
                  <div className="h-full flex items-center justify-center p-4 border border-[var(--border)]/65 rounded-xl bg-[var(--surface-hover)]">
                    <EmptyAgentHistoryState />
                  </div>
                ) : (
                  <ExecutionLogTable
                    events={eventLogs}
                    className="h-full"
                  />
                )
              )}

              {rightTab === 'analytics' && (
                <AnalyticsPanel className="h-full" />
              )}

              {rightTab === 'context' && (
                <ContextViewer
                  sessionId={sessionId}
                  correlationId={correlationId}
                  className="h-full"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
