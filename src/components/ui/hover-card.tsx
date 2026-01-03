/**
 * HoverCard Component
 *
 * Preact implementation of Shadcn hover-card component (Shadow DOM compatible).
 * Displays content on hover, similar to Popover.
 */

import { ComponentChildren } from 'preact'
import { cn } from '../../lib/utils'

export interface HoverCardProps {
  /** Children content */
  children?: ComponentChildren
}

export function HoverCard({ children }: HoverCardProps) {
  return (
    <div data-slot="hover-card" class="shc-hover-card relative inline-block group">
      {children}
    </div>
  )
}

export interface HoverCardTriggerProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function HoverCardTrigger({ children, className, ...props }: HoverCardTriggerProps) {
  return (
    <div
      data-slot="hover-card-trigger"
      class={cn('shc-hover-card-trigger', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface HoverCardContentProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
  /** Alignment */
  align?: 'start' | 'center' | 'end'
  /** Side */
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function HoverCardContent({
  children,
  className,
  align = 'center',
  side = 'bottom',
  ...props
}: HoverCardContentProps) {
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
      data-slot="hover-card-content"
      class={cn(
        'shc-hover-card-content',
        'absolute z-50 w-64',
        'rounded-md border bg-popover p-4 text-sm text-popover-foreground shadow-md',
        'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
        'transition-all duration-200 pointer-events-none',
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

export default HoverCard
