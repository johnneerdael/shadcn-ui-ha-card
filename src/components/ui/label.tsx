/**
 * Label Component (Preact)
 *
 * Text label component for form fields and entity displays.
 * Based on shadcn/ui Label with Home Assistant integration.
 *
 * @see https://ui.shadcn.com/docs/components/label
 */

import { ComponentChildren } from 'preact'
import { cn } from '../../lib/utils'

/**
 * Label component props
 */
export interface LabelProps {
  /** Label text or content */
  children?: ComponentChildren
  /** For attribute (links to input ID) */
  htmlFor?: string
  /** Additional CSS classes */
  className?: string
  /** Whether label is required (adds asterisk) */
  required?: boolean
  /** Label color variant */
  variant?: 'default' | 'muted' | 'destructive'
}

/**
 * Label Component
 *
 * Usage:
 * ```tsx
 * <Label htmlFor="entity-name">Entity Name</Label>
 * <Label variant="muted">Secondary text</Label>
 * ```
 */
export function Label({
  children,
  htmlFor,
  className,
  required = false,
  variant = 'default',
  ...props
}: LabelProps) {
  // Base label styles
  const baseStyles = [
    'text-sm',
    'font-medium',
    'leading-none',
    'peer-disabled:cursor-not-allowed',
    'peer-disabled:opacity-70',
  ]

  // Variant styles
  const variantStyles: Record<string, string> = {
    default: 'text-[var(--foreground)]',
    muted: 'text-[var(--muted-foreground)]',
    destructive: 'text-[var(--destructive)]',
  }

  const labelClasses = cn(
    baseStyles.join(' '),
    variantStyles[variant],
    className
  )

  return (
    <label
      for={htmlFor}
      class={labelClasses}
      {...props}
    >
      {children}
      {required && <span class="text-[var(--destructive)] ml-1">*</span>}
    </label>
  )
}

/**
 * Export default for convenience
 */
export default Label
