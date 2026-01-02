/**
 * AlertDialog Component
 *
 * Preact implementation of Shadcn alert-dialog component.
 * Modal dialog for important confirmations.
 */

import { ComponentChildren, createContext } from 'preact'
import { useContext, useState, useCallback } from 'preact/hooks'
import { cn } from '../../lib/utils'

interface AlertDialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const AlertDialogContext = createContext<AlertDialogContextValue | undefined>(undefined)

export interface AlertDialogProps {
  /** Controlled open state */
  open?: boolean
  /** Default open state */
  defaultOpen?: boolean
  /** Change handler */
  onOpenChange?: (open: boolean) => void
  /** Children content */
  children?: ComponentChildren
}

export function AlertDialog({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [isControlled, onOpenChange]
  )

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  )
}

export interface AlertDialogTriggerProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function AlertDialogTrigger({ children, className, ...props }: AlertDialogTriggerProps) {
  const context = useContext(AlertDialogContext)

  if (!context) {
    throw new Error('AlertDialogTrigger must be used within AlertDialog')
  }

  const { setOpen } = context

  return (
    <button
      type="button"
      data-slot="alert-dialog-trigger"
      class={cn('shc-alert-dialog-trigger', className)}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  )
}

export interface AlertDialogContentProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function AlertDialogContent({ children, className, ...props }: AlertDialogContentProps) {
  const context = useContext(AlertDialogContext)

  if (!context) {
    throw new Error('AlertDialogContent must be used within AlertDialog')
  }

  const { open } = context

  if (!open) return null

  return (
    <div
      data-slot="alert-dialog-overlay"
      class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
    >
      <div
        data-slot="alert-dialog-content"
        class={cn(
          'shc-alert-dialog-content',
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          'z-50 w-full max-w-lg',
          'rounded-lg border bg-background p-6 shadow-lg',
          'animate-in fade-in-0 zoom-in-95',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

export interface AlertDialogHeaderProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function AlertDialogHeader({ children, className, ...props }: AlertDialogHeaderProps) {
  return (
    <div
      data-slot="alert-dialog-header"
      class={cn('shc-alert-dialog-header', 'flex flex-col space-y-2 text-center sm:text-left', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface AlertDialogTitleProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function AlertDialogTitle({ children, className, ...props }: AlertDialogTitleProps) {
  return (
    <h2
      data-slot="alert-dialog-title"
      class={cn('shc-alert-dialog-title', 'text-lg font-semibold', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

export interface AlertDialogDescriptionProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function AlertDialogDescription({ children, className, ...props }: AlertDialogDescriptionProps) {
  return (
    <p
      data-slot="alert-dialog-description"
      class={cn('shc-alert-dialog-description', 'text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export interface AlertDialogFooterProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function AlertDialogFooter({ children, className, ...props }: AlertDialogFooterProps) {
  return (
    <div
      data-slot="alert-dialog-footer"
      class={cn(
        'shc-alert-dialog-footer',
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface AlertDialogActionProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
  /** Click handler */
  onClick?: (event: MouseEvent) => void
}

export function AlertDialogAction({ children, className, onClick, ...props }: AlertDialogActionProps) {
  const context = useContext(AlertDialogContext)

  if (!context) {
    throw new Error('AlertDialogAction must be used within AlertDialog')
  }

  const { setOpen } = context

  const handleClick = (e: MouseEvent) => {
    onClick?.(e)
    setOpen(false)
  }

  return (
    <button
      type="button"
      data-slot="alert-dialog-action"
      class={cn('shc-alert-dialog-action', className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

export interface AlertDialogCancelProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function AlertDialogCancel({ children, className, ...props }: AlertDialogCancelProps) {
  const context = useContext(AlertDialogContext)

  if (!context) {
    throw new Error('AlertDialogCancel must be used within AlertDialog')
  }

  const { setOpen } = context

  return (
    <button
      type="button"
      data-slot="alert-dialog-cancel"
      class={cn('shc-alert-dialog-cancel', className)}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </button>
  )
}

export default AlertDialog
