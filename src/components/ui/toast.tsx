import { ComponentChildren } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { createContext } from 'preact'
import { cn } from '../../lib/utils'

// Toast types
export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title?: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Toast context for global toast management
export const ToastContext = createContext<{
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
} | null>(null)

// Toast Provider Component
export interface ToastProviderProps {
  children?: ComponentChildren
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    const newToast: Toast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])

    // Auto-dismiss after duration
    const duration = toast.duration || 3000
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

// Toast Container - renders toasts in bottom-right corner
interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      style={{ maxWidth: '420px' }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => onClose(toast.id)} />
      ))}
    </div>
  )
}

// Individual Toast Item
interface ToastItemProps {
  toast: Toast
  onClose: () => void
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false)

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose()
    }, 200) // Match animation duration
  }

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => {
      // Component is already visible
    }, 10)
    return () => clearTimeout(timer)
  }, [])

  const typeStyles = {
    default: 'bg-background border-border',
    success: 'bg-green-50 border-green-200 text-green-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
  }

  const typeIcons = {
    default: null,
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }

  return (
    <div
      data-slot="toast"
      class={cn(
        'shc-toast',
        'pointer-events-auto',
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg',
        'transition-all duration-200',
        isExiting
          ? 'opacity-0 translate-x-full'
          : 'opacity-100 translate-x-0 animate-in slide-in-from-right',
        typeStyles[toast.type]
      )}
    >
      {typeIcons[toast.type] && (
        <div class="text-lg font-semibold flex-shrink-0">{typeIcons[toast.type]}</div>
      )}

      <div class="flex-1 min-w-0">
        {toast.title && <div class="font-semibold mb-1">{toast.title}</div>}
        {toast.description && <div class="text-sm opacity-90">{toast.description}</div>}
        {toast.action && (
          <button
            onClick={() => {
              toast.action!.onClick()
              handleClose()
            }}
            class="mt-2 text-sm font-medium underline hover:no-underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={handleClose}
        class="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  )
}

// Utility function to create toasts from anywhere
// (In real usage, this would be accessed via useContext(ToastContext))
export function toast(options: Omit<Toast, 'id'>) {
  // This is a placeholder - actual implementation requires context
  console.log('Toast:', options)
}

toast.success = (title: string, description?: string) => {
  toast({ type: 'success', title, description })
}

toast.error = (title: string, description?: string) => {
  toast({ type: 'error', title, description })
}

toast.warning = (title: string, description?: string) => {
  toast({ type: 'warning', title, description })
}

toast.info = (title: string, description?: string) => {
  toast({ type: 'info', title, description })
}

// Export for component registry
ToastProvider.displayName = 'ToastProvider'
