/**
 * Tooltip Component
 *
 * Preact implementation of Shadcn tooltip component (CSS-only, no portals).
 * Uses title attribute fallback for Shadow DOM compatibility.
 */

import { ComponentChildren } from 'preact'
import { cn } from '../../lib/utils'

export interface TooltipProps {
  /** Tooltip content */
  content?: string
  /** Children content (trigger) */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function Tooltip({ content, children, className, ...props }: TooltipProps) {
  return (
    <div
      data-slot="tooltip"
      class={cn('shc-tooltip', 'inline-block relative group', className)}
      {...props}
    >
      {children}
      {content && (
        <div
          class={cn(
            'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
            'px-2 py-1 text-xs rounded bg-popover text-popover-foreground shadow-md',
            'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
            'transition-all duration-150 pointer-events-none z-50',
            'whitespace-nowrap'
          )}
        >
          {content}
          {/* Arrow */}
          <div
            class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 rotate-45 bg-popover"
          />
        </div>
      )}
    </div>
  )
}

export default Tooltip
