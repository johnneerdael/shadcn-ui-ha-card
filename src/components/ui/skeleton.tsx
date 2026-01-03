/**
 * Skeleton Component
 *
 * Preact implementation of Shadcn skeleton component (CSS-only loading placeholder).
 * Based on shadcn-sourcecode/apps/v4/registry/bases/radix/ui/skeleton.tsx
 */

import { cn } from '../../lib/utils'

export interface SkeletonProps {
  /** Additional className */
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      class={cn(
        'shc-skeleton',
        'animate-pulse rounded-md bg-muted',
        className
      )}
      {...props}
    />
  )
}

export default Skeleton
