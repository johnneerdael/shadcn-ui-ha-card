/**
 * Progress Component
 *
 * Preact implementation of Shadcn progress component (CSS-only, no Radix).
 * Based on shadcn-sourcecode/apps/v4/registry/bases/radix/ui/progress.tsx
 */

import { ComponentChildren } from 'preact'
import { cn } from '../../lib/utils'

export interface ProgressProps {
  /** Progress value (0-100) */
  value?: number
  /** Maximum value (default: 100) */
  max?: number
  /** Additional className */
  className?: string
  /** Optional children */
  children?: ComponentChildren
}

export function Progress({
  value = 0,
  max = 100,
  className,
  children,
}: ProgressProps) {
  // Calculate percentage
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div
      data-slot="progress"
      class={cn(
        'shc-progress',
        'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
        className
      )}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        data-slot="progress-indicator"
        class="shc-progress-indicator h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
      {children}
    </div>
  )
}

export default Progress
