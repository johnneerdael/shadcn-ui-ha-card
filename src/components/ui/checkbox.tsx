/**
 * Checkbox Component
 *
 * Preact implementation of Shadcn checkbox component (CSS-only, no Radix).
 * Based on shadcn-sourcecode/apps/v4/registry/bases/radix/ui/checkbox.tsx
 */

import { JSX } from 'preact'
import { cn } from '../../lib/utils'

export interface CheckboxProps extends Omit<JSX.HTMLAttributes<HTMLInputElement>, 'size'> {
  /** Checked state */
  checked?: boolean
  /** Default checked state for uncontrolled */
  defaultChecked?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Change handler */
  onChange?: (event: Event) => void
  /** Additional className */
  className?: string
}

export function Checkbox({
  className,
  checked,
  defaultChecked,
  disabled,
  onChange,
  ...props
}: CheckboxProps) {
  return (
    <label
      class={cn(
        'shc-checkbox',
        'relative inline-flex items-center justify-center',
        'h-4 w-4 shrink-0 rounded-sm border border-primary',
        'ring-offset-background',
        'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        data-slot="checkbox"
        class="absolute inset-0 opacity-0 cursor-pointer peer"
        {...props}
      />
      <svg
        class={cn(
          'shc-checkbox-indicator',
          'h-4 w-4 pointer-events-none',
          'opacity-0 peer-checked:opacity-100',
          'transition-opacity'
        )}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </label>
  )
}

export default Checkbox
