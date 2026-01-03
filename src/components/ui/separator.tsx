/**
 * Separator Component
 *
 * Preact implementation of Shadcn separator component (CSS-only).
 * Based on shadcn-sourcecode/apps/v4/registry/bases/radix/ui/separator.tsx
 */

import { cn } from '../../lib/utils'

export type SeparatorOrientation = 'horizontal' | 'vertical'

export interface SeparatorProps {
  /** Orientation of the separator */
  orientation?: SeparatorOrientation
  /** Additional className */
  className?: string
  /** Decorative (not semantically meaningful) */
  decorative?: boolean
}

export function Separator({
  orientation = 'horizontal',
  decorative = true,
  className,
  ...props
}: SeparatorProps) {
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      data-slot="separator"
      data-orientation={orientation}
      class={cn(
        'shc-separator',
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  )
}

export default Separator
