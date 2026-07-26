import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskService } from '@/services/taskService'
import type { TaskItem } from '@/data/taskAutomationKnowledgeMockData'

export function useTasks() {
  const queryClient = useQueryClient()

  const { data: tasks = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['agentTasksList'],
    queryFn: () => taskService.getTasks(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    retry: 2,
  })

  const toggleTaskStatusMutation = useMutation({
    mutationFn: (id: string) => taskService.toggleTaskStatus(id),
    onSuccess: (_, taskId) => {
      queryClient.setQueryData<TaskItem[]>(['agentTasksList'], (old = []) =>
        old.map((t) => {
          if (t.id === taskId) {
            const nextStatus = t.status === 'running' ? 'pending' : 'running'
            return { ...t, status: nextStatus as any }
          }
          return t
        })
      )
      queryClient.invalidateQueries({ queryKey: ['agentTasksList'] })
    },
  })

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<TaskItem[]>(['agentTasksList'], (old = []) =>
        old.filter((t) => t.id !== deletedId)
      )
      queryClient.invalidateQueries({ queryKey: ['agentTasksList'] })
    },
  })

  return {
    tasks,
    isLoading,
    isError,
    error,
    refetch,
    toggleTaskStatus: toggleTaskStatusMutation.mutateAsync,
    isToggling: toggleTaskStatusMutation.isPending,
    deleteTask: deleteTaskMutation.mutateAsync,
    isDeleting: deleteTaskMutation.isPending,
  }
}

export default useTasks
