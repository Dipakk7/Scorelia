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
        border: '1px solid #eab308',
      },
    })
  },
  info: (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        border: '1px solid #3b82f6',
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
