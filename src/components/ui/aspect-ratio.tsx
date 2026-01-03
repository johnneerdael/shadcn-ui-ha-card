/**
 * AspectRatio Component
 *
 * Preact implementation of Shadcn aspect-ratio component (CSS-only).
 * Maintains aspect ratio for child content.
 */

import { ComponentChildren } from 'preact'
import { cn } from '../../lib/utils'

export interface AspectRatioProps {
  /** Aspect ratio (e.g., 16/9, 4/3, 1/1) */
  ratio?: number
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function AspectRatio({ ratio = 1, children, className, ...props }: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      class={cn('shc-aspect-ratio', 'relative w-full', className)}
      style={{ paddingBottom: `${100 / ratio}%` }}
      {...props}
    >
      <div class="absolute inset-0">{children}</div>
    </div>
  )
}

export default AspectRatio
