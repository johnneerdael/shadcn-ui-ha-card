/**
 * Button Component (Preact)
 *
 * Interactive button component with variants, sizes, and entity binding support.
 * Based on shadcn/ui Button with Home Assistant integration.
 *
 * @see https://ui.shadcn.com/docs/components/button
 */

import { ComponentChildren } from 'preact'
import { cn } from '../../lib/utils'

/**
 * Button variant types matching shadcn/ui design system
 */
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'

/**
 * Button size options
 */
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

/**
 * Button component props
 */
export interface ButtonProps {
  /** Button content (text, icons, etc.) */
  children?: ComponentChildren
  /** Visual variant */
  variant?: ButtonVariant
  /** Size variant */
  size?: ButtonSize
  /** Click handler */
  onClick?: (event: MouseEvent) => void
  /** Disabled state */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset'
  /** ARIA label for accessibility */
  'aria-label'?: string
  /** Whether button takes full width */
  fullWidth?: boolean
}

/**
 * Button Component
 *
 * Usage:
 * ```tsx
 * <Button variant="default" size="default" onClick={handleClick}>
 *   Click Me
 * </Button>
 * ```
 */
export function Button({
  children,
  variant = 'default',
  size = 'default',
  onClick,
  disabled = false,
  className,
  type = 'button',
  fullWidth = false,
  ...props
}: ButtonProps) {
  // Base button styles (matching shadcn/ui)
  const baseStyles = [
    'inline-flex',
    'items-center',
    'justify-center',
    'whitespace-nowrap',
    'rounded-md',
    'text-sm',
    'font-medium',
    'ring-offset-background',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
  ]

  // Variant styles using CSS variables (HA theme compatible)
  const variantStyles: Record<ButtonVariant, string> = {
    default: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90',
    destructive: 'bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/90',
    outline: 'border border-[var(--input)] bg-[var(--background)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
    secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/80',
    ghost: 'hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
    link: 'text-[var(--primary)] underline-offset-4 hover:underline',
  }

  // Size styles
  const sizeStyles: Record<ButtonSize, string> = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  }

  // Full width modifier
  const widthStyles = fullWidth ? 'w-full' : ''

  const buttonClasses = cn(
    baseStyles.join(' '),
    variantStyles[variant],
    sizeStyles[size],
    widthStyles,
    className
  )

  return (
    <button
      type={type}
      class={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * Export default for convenience
 */
export default Button
