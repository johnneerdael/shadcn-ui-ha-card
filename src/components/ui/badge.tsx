/**
 * Badge Component
 *
 * Preact implementation of Shadcn badge component.
 * Based on shadcn-sourcecode/apps/v4/registry/bases/radix/ui/badge.tsx
 */

import { ComponentChildren } from 'preact'
import { cn } from '../../lib/utils'

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

export interface BadgeProps {
  /** Badge variant */
  variant?: BadgeVariant
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
  secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
  outline: 'text-foreground',
}

export function Badge({
  variant = 'default',
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      class={cn(
        'shc-badge',
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
