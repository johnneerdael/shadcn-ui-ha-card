/**
 * Dialog Component
 *
 * Preact implementation of Shadcn dialog component (Shadow DOM compatible).
 * Modal dialog without portals - uses fixed positioning within shadow root.
 *
 * **Shadow DOM Strategy:**
 * This component is specifically designed for Home Assistant's Shadow DOM environment.
 * Unlike Radix UI's Dialog which uses React Portals, this implementation renders
 * inline with fixed positioning relative to the shadow root's viewport.
 *
 * **Why No Radix UI:**
 * - Radix Dialog uses `ReactDOM.createPortal()` to render outside the component tree
 * - Portals break in Shadow DOM (cannot append to `document.body`)
 * - Custom implementation uses `position: fixed` relative to shadow root
 * - Z-index is scoped within shadow root (no conflicts with HA UI)
 *
 * **Event Handling:**
 * - `document.addEventListener` is SAFE in Shadow DOM (events bubble up from shadow root)
 * - Escape key handler works globally as expected
 * - Click-outside handled via overlay click event
 * - All listeners properly cleaned up in useEffect returns to prevent memory leaks
 *
 * **Architecture:**
 * - DialogContent renders backdrop + content in the same DOM tree
 * - Uses `fixed inset-0` for backdrop (covers shadow root viewport)
 * - Content is centered using `fixed left-1/2 top-1/2 -translate-x/y-1/2`
 * - Z-index `z-50` is safe within shadow root isolation
 *
 * @example
 * ```tsx
 * <Dialog open={open} onOpenChange={setOpen}>
 *   <DialogTrigger>Open Dialog</DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Dialog Title</DialogTitle>
 *       <DialogDescription>Dialog description text</DialogDescription>
 *     </DialogHeader>
 *     <div>Dialog content goes here</div>
 *     <DialogFooter>
 *       <button onClick={() => setOpen(false)}>Close</button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 *
 * @see https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card
 */

import { ComponentChildren, createContext } from 'preact'
import { useContext, useState, useCallback, useEffect } from 'preact/hooks'
import { cn } from '../../lib/utils'

interface DialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined)

export interface DialogProps {
  /** Controlled open state */
  open?: boolean
  /** Default open state */
  defaultOpen?: boolean
  /** Change handler */
  onOpenChange?: (open: boolean) => void
  /** Children content */
  children?: ComponentChildren
}

export function Dialog({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogProps) {
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
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

export interface DialogTriggerProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function DialogTrigger({ children, className, ...props }: DialogTriggerProps) {
  const context = useContext(DialogContext)

  if (!context) {
    throw new Error('DialogTrigger must be used within Dialog')
  }

  const { setOpen } = context

  return (
    <button
      type="button"
      data-slot="dialog-trigger"
      class={cn('shc-dialog-trigger', className)}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  )
}

export interface DialogContentProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function DialogContent({ children, className, ...props }: DialogContentProps) {
  const context = useContext(DialogContext)

  if (!context) {
    throw new Error('DialogContent must be used within Dialog')
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

  return (
    <div
      data-slot="dialog-overlay"
      class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        data-slot="dialog-content"
        class={cn(
          'shc-dialog-content',
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          'z-50 w-full max-w-lg',
          'rounded-lg border bg-background p-6 shadow-lg',
          'animate-in fade-in-0 zoom-in-95',
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

export interface DialogHeaderProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function DialogHeader({ children, className, ...props }: DialogHeaderProps) {
  return (
    <div
      data-slot="dialog-header"
      class={cn('shc-dialog-header', 'flex flex-col space-y-1.5 text-center sm:text-left', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface DialogTitleProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function DialogTitle({ children, className, ...props }: DialogTitleProps) {
  return (
    <h2
      data-slot="dialog-title"
      class={cn('shc-dialog-title', 'text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

export interface DialogDescriptionProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function DialogDescription({ children, className, ...props }: DialogDescriptionProps) {
  return (
    <p
      data-slot="dialog-description"
      class={cn('shc-dialog-description', 'text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export interface DialogFooterProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function DialogFooter({ children, className, ...props }: DialogFooterProps) {
  return (
    <div
      data-slot="dialog-footer"
      class={cn('shc-dialog-footer', 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default Dialog
