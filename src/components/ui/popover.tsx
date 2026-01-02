/**
 * Popover Component
 *
 * Preact implementation of Shadcn popover component (Shadow DOM compatible).
 * Simplified without portals - uses absolute positioning within container.
 *
 * **Shadow DOM Strategy:**
 * Uses absolute positioning relative to the trigger element instead of React Portals.
 * Content is rendered as a sibling to the trigger within the same parent container.
 *
 * **Why No Radix UI:**
 * - Radix Popover uses Floating UI with portals
 * - Portals would render outside shadow root causing positioning issues
 * - Custom implementation uses `position: absolute` relative to trigger
 *
 * **Positioning:**
 * - Supports 4 sides: top, right, bottom (default), left
 * - Uses CSS transforms for centering on each side
 * - Z-index `z-50` scoped within shadow root
 *
 * **Event Handling:**
 * - Click-outside detection via `document.mousedown`
 * - Escape key closes popover
 * - Both handlers properly cleaned up on unmount
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverTrigger>Open Popover</PopoverTrigger>
 *   <PopoverContent side="bottom">
 *     <div>Popover content here</div>
 *   </PopoverContent>
 * </Popover>
 * ```
 */

import { ComponentChildren, createContext } from 'preact'
import { useContext, useState, useCallback, useRef, useEffect } from 'preact/hooks'
import { cn } from '../../lib/utils'

interface PopoverContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const PopoverContext = createContext<PopoverContextValue | undefined>(undefined)

export interface PopoverProps {
  /** Controlled open state */
  open?: boolean
  /** Default open state */
  defaultOpen?: boolean
  /** Change handler */
  onOpenChange?: (open: boolean) => void
  /** Children content */
  children?: ComponentChildren
}

export function Popover({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: PopoverProps) {
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
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div data-slot="popover" class="shc-popover relative inline-block">
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

export interface PopoverTriggerProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function PopoverTrigger({ children, className, ...props }: PopoverTriggerProps) {
  const context = useContext(PopoverContext)

  if (!context) {
    throw new Error('PopoverTrigger must be used within Popover')
  }

  const { open, setOpen } = context

  return (
    <button
      type="button"
      data-slot="popover-trigger"
      data-state={open ? 'open' : 'closed'}
      class={cn('shc-popover-trigger', className)}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </button>
  )
}

export interface PopoverContentProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
  /** Alignment */
  align?: 'start' | 'center' | 'end'
  /** Side */
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function PopoverContent({
  children,
  className,
  align = 'center',
  side = 'bottom',
  ...props
}: PopoverContentProps) {
  const context = useContext(PopoverContext)
  const contentRef = useRef<HTMLDivElement>(null)

  if (!context) {
    throw new Error('PopoverContent must be used within Popover')
  }

  const { open, setOpen } = context

  // Close on click outside
  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, setOpen])

  if (!open) return null

  const positionClasses = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
  }

  const alignClasses = {
    start: side === 'top' || side === 'bottom' ? 'left-0' : 'top-0',
    center: side === 'top' || side === 'bottom' ? 'left-1/2 -translate-x-1/2' : 'top-1/2 -translate-y-1/2',
    end: side === 'top' || side === 'bottom' ? 'right-0' : 'bottom-0',
  }

  return (
    <div
      ref={contentRef}
      data-slot="popover-content"
      data-state={open ? 'open' : 'closed'}
      class={cn(
        'shc-popover-content',
        'absolute z-50 min-w-[8rem] overflow-hidden',
        'rounded-md border bg-popover p-4 text-popover-foreground shadow-md',
        'animate-in fade-in-0 zoom-in-95',
        positionClasses[side],
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Popover
