import toast from 'react-hot-toast'

export const notify = {
  success: (message: string) => {
    toast.success(message, {
      icon: '✅',
    })
  },
  error: (message: string) => {
    toast.error(message, {
      icon: '❌',
    })
  },
  warning: (message: string) => {
    toast(message, {
      icon: '⚠️',
      style: {
        border: '1px solid var(--accent-warning)',
      },
    })
  },
  info: (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        border: '1px solid var(--accent-info)',
      },
    })
  },
  loading: (message: string) => {
    return toast.loading(message)
  },
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId)
  },
}

export default notify
