import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '@/services/notificationService'
import type { NotificationItem } from '@/data/insightsSystemHealthMockData'

export function useNotifications() {
  const queryClient = useQueryClient()

  const { data: notifications = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['notificationsList'],
    queryFn: () => notificationService.getNotifications(),
    staleTime: 1000 * 60 * 5,
  })

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<NotificationItem[]>(['notificationsList'], (old = []) =>
        old.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
      queryClient.invalidateQueries({ queryKey: ['notificationsList'] })
    },
  })

  const dismissMutation = useMutation({
    mutationFn: (id: string) => notificationService.dismissNotification(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<NotificationItem[]>(['notificationsList'], (old = []) =>
        old.filter((n) => n.id !== id)
      )
      queryClient.invalidateQueries({ queryKey: ['notificationsList'] })
    },
  })

  return {
    notifications,
    isLoading,
    isError,
    refetch,
    markAsRead: markAsReadMutation.mutateAsync,
    dismissNotification: dismissMutation.mutateAsync,
  }
}

export default useNotifications
