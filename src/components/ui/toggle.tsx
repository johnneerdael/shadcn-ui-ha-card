/**
 * Toggle Component
 *
 * Preact implementation of Shadcn toggle component (button-style toggle, no Radix).
 * Based on shadcn-sourcecode/apps/v4/registry/bases/radix/ui/toggle.tsx
 */

import { JSX, ComponentChildren } from 'preact'
import { cn } from '../../lib/utils'

export type ToggleVariant = 'default' | 'outline'
export type ToggleSize = 'default' | 'sm' | 'lg'

export interface ToggleProps extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'size'> {
  /** Pressed state */
  pressed?: boolean
  /** Default pressed state for uncontrolled */
  defaultPressed?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Change handler */
  onPressedChange?: (pressed: boolean) => void
  /** Toggle variant */
  variant?: ToggleVariant
  /** Toggle size */
  size?: ToggleSize
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

const variantStyles: Record<ToggleVariant, string> = {
  default: 'bg-transparent hover:bg-muted hover:text-muted-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
}

const sizeStyles: Record<ToggleSize, string> = {
  default: 'h-10 px-3',
  sm: 'h-9 px-2.5',
  lg: 'h-11 px-5',
}

export function Toggle({
  pressed,
  defaultPressed,
  disabled,
  onPressedChange,
  variant = 'default',
  size = 'default',
  children,
  className,
  onClick,
  ...props
}: ToggleProps) {
  const handleClick = (event: MouseEvent) => {
    if (!disabled) {
      onPressedChange?.(!pressed)
      onClick?.(event as any)
    }
  }

  return (
    <button
      type="button"
      role="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={handleClick}
      data-slot="toggle"
      data-state={pressed ? 'on' : 'off'}
      class={cn(
        'shc-toggle',
        'inline-flex items-center justify-center rounded-md text-sm font-medium',
        'ring-offset-background transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Toggle
