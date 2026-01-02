/**
 * Switch Component (Preact)
 *
 * Toggle switch component for binary controls (lights, switches, etc.).
 * Based on shadcn/ui Switch with Home Assistant entity binding.
 *
 * @see https://ui.shadcn.com/docs/components/switch
 */

import { useState, useEffect } from 'preact/hooks'
import { cn } from '../../lib/utils'

/**
 * Switch component props
 */
export interface SwitchProps {
  /** Whether the switch is checked (on) */
  checked?: boolean
  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean
  /** Change handler */
  onCheckedChange?: (checked: boolean) => void
  /** Click handler (alternative to onCheckedChange) */
  onClick?: (event: MouseEvent) => void
  /** Disabled state */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** ARIA label for accessibility */
  'aria-label'?: string
  /** ID for label association */
  id?: string
}

/**
 * Switch Component
 *
 * Usage:
 * ```tsx
 * // Controlled
 * <Switch checked={isOn} onCheckedChange={setIsOn} />
 *
 * // Uncontrolled
 * <Switch defaultChecked={true} onCheckedChange={(checked) => console.log(checked)} />
 *
 * // With entity binding (via LayoutRenderer)
 * // checked will be set by BindingEngine, onClick by ActionHandler
 * <Switch checked={entityState === 'on'} onClick={toggleEntity} />
 * ```
 */
export function Switch({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  onClick,
  disabled = false,
  className,
  ...props
}: SwitchProps) {
  // Internal state for uncontrolled mode
  const [internalChecked, setInternalChecked] = useState(defaultChecked)

  // Use controlled value if provided, otherwise use internal state
  const isControlled = checkedProp !== undefined
  const checked = isControlled ? checkedProp : internalChecked

  // Sync internal state with prop changes (for controlled mode)
  useEffect(() => {
    if (isControlled && checkedProp !== internalChecked) {
      setInternalChecked(checkedProp)
    }
  }, [checkedProp, isControlled])

  // Handle toggle
  const handleClick = (event: MouseEvent) => {
    if (disabled) return

    const newChecked = !checked

    // Update internal state (uncontrolled mode)
    if (!isControlled) {
      setInternalChecked(newChecked)
    }

    // Call callbacks
    onCheckedChange?.(newChecked)
    onClick?.(event)
  }

  // Base switch container styles
  const containerClasses = cn(
    'peer',
    'inline-flex',
    'h-6',
    'w-11',
    'shrink-0',
    'cursor-pointer',
    'items-center',
    'rounded-full',
    'border-2',
    'border-transparent',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    // Background color based on state
    checked
      ? 'bg-[var(--primary)]'
      : 'bg-[var(--input)]',
    className
  )

  // Thumb (sliding circle) styles
  const thumbClasses = cn(
    'pointer-events-none',
    'block',
    'h-5',
    'w-5',
    'rounded-full',
    'bg-[var(--background)]',
    'shadow-lg',
    'ring-0',
    'transition-transform',
    // Translate based on checked state
    checked ? 'translate-x-5' : 'translate-x-0'
  )

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? 'checked' : 'unchecked'}
      disabled={disabled}
      class={containerClasses}
      onClick={handleClick}
      {...props}
    >
      <span class={thumbClasses} />
    </button>
  )
}

/**
 * Export default for convenience
 */
export default Switch
