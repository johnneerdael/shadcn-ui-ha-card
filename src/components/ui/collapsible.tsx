/**
 * Collapsible Component
 *
 * Preact implementation of Shadcn collapsible component.
 * Show/hide content with smooth transitions.
 */

import { ComponentChildren, createContext } from 'preact'
import { useContext, useState, useCallback } from 'preact/hooks'
import { cn } from '../../lib/utils'

interface CollapsibleContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const CollapsibleContext = createContext<CollapsibleContextValue | undefined>(undefined)

export interface CollapsibleProps {
  /** Controlled open state */
  open?: boolean
  /** Default open state for uncontrolled */
  defaultOpen?: boolean
  /** Change handler */
  onOpenChange?: (open: boolean) => void
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function Collapsible({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
  ...props
}: CollapsibleProps) {
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
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <div
        data-slot="collapsible"
        data-state={open ? 'open' : 'closed'}
        class={cn('shc-collapsible', className)}
        {...props}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
}

export interface CollapsibleTriggerProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function CollapsibleTrigger({ children, className, ...props }: CollapsibleTriggerProps) {
  const context = useContext(CollapsibleContext)

  if (!context) {
    throw new Error('CollapsibleTrigger must be used within Collapsible')
  }

  const { open, setOpen } = context

  return (
    <button
      type="button"
      data-slot="collapsible-trigger"
      data-state={open ? 'open' : 'closed'}
      class={cn('shc-collapsible-trigger', className)}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </button>
  )
}

export interface CollapsibleContentProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function CollapsibleContent({ children, className, ...props }: CollapsibleContentProps) {
  const context = useContext(CollapsibleContext)

  if (!context) {
    throw new Error('CollapsibleContent must be used within Collapsible')
  }

  const { open } = context

  if (!open) return null

  return (
    <div
      data-slot="collapsible-content"
      data-state={open ? 'open' : 'closed'}
      class={cn('shc-collapsible-content', 'overflow-hidden transition-all', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default Collapsible
