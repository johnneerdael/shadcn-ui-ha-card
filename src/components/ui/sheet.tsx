/**
 * Sheet Component
 *
 * Preact implementation of Shadcn sheet component (Shadow DOM compatible).
 * Side drawer/panel that slides in from the edge.
 */

import { ComponentChildren, createContext } from 'preact'
import { useContext, useState, useCallback, useEffect } from 'preact/hooks'
import { cn } from '../../lib/utils'

interface SheetContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const SheetContext = createContext<SheetContextValue | undefined>(undefined)

export interface SheetProps {
  /** Controlled open state */
  open?: boolean
  /** Default open state */
  defaultOpen?: boolean
  /** Change handler */
  onOpenChange?: (open: boolean) => void
  /** Children content */
  children?: ComponentChildren
}

export function Sheet({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: SheetProps) {
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
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

export interface SheetTriggerProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function SheetTrigger({ children, className, ...props }: SheetTriggerProps) {
  const context = useContext(SheetContext)

  if (!context) {
    throw new Error('SheetTrigger must be used within Sheet')
  }

  const { setOpen } = context

  return (
    <button
      type="button"
      data-slot="sheet-trigger"
      class={cn('shc-sheet-trigger', className)}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  )
}

export interface SheetContentProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
  /** Side to slide from */
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function SheetContent({
  children,
  className,
  side = 'right',
  ...props
}: SheetContentProps) {
  const context = useContext(SheetContext)

  if (!context) {
    throw new Error('SheetContent must be used within Sheet')
  }

  const { open, setOpen } = context

  // Close on Escape key
  useEffect(() => {
    if (!open) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, setOpen])

  if (!open) return null

  const sideClasses = {
    top: 'inset-x-0 top-0 border-b',
    right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
    bottom: 'inset-x-0 bottom-0 border-t',
    left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
  }

  const slideClasses = {
    top: 'slide-in-from-top',
    right: 'slide-in-from-right',
    bottom: 'slide-in-from-bottom',
    left: 'slide-in-from-left',
  }

  return (
    <div
      data-slot="sheet-overlay"
      class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        data-slot="sheet-content"
        class={cn(
          'shc-sheet-content',
          'fixed z-50 gap-4 bg-background p-6 shadow-lg',
          'animate-in fade-in-0',
          sideClasses[side],
          slideClasses[side],
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
        <button
          type="button"
          class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          onClick={() => setOpen(false)}
        >
          <svg
            class="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  )
}

export interface SheetHeaderProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function SheetHeader({ children, className, ...props }: SheetHeaderProps) {
  return (
    <div
      data-slot="sheet-header"
      class={cn('shc-sheet-header', 'flex flex-col space-y-2 text-center sm:text-left', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface SheetTitleProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function SheetTitle({ children, className, ...props }: SheetTitleProps) {
  return (
    <h2
      data-slot="sheet-title"
      class={cn('shc-sheet-title', 'text-lg font-semibold text-foreground', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

export interface SheetDescriptionProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function SheetDescription({ children, className, ...props }: SheetDescriptionProps) {
  return (
    <p
      data-slot="sheet-description"
      class={cn('shc-sheet-description', 'text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export interface SheetFooterProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function SheetFooter({ children, className, ...props }: SheetFooterProps) {
  return (
    <div
      data-slot="sheet-footer"
      class={cn(
        'shc-sheet-footer',
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Sheet
