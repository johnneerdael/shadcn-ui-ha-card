/**
 * Select Component
 *
 * Preact implementation of Shadcn select component (native <select>, no Radix).
 * Based on shadcn-sourcecode/apps/v4/registry/bases/radix/ui/select.tsx
 *
 * Simplified to use native HTML select element to avoid portal/Shadow DOM issues.
 */

import { JSX, ComponentChildren } from 'preact'
import { cn } from '../../lib/utils'

export interface SelectProps extends JSX.HTMLAttributes<HTMLSelectElement> {
  /** Select value */
  value?: string
  /** Default value for uncontrolled */
  defaultValue?: string
  /** Disabled state */
  disabled?: boolean
  /** Change handler */
  onChange?: (event: Event) => void
  /** Children (options) */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function Select({
  className,
  value,
  defaultValue,
  disabled,
  onChange,
  children,
  ...props
}: SelectProps) {
  return (
    <div class="relative inline-block">
      <select
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={onChange}
        data-slot="select"
        class={cn(
          'shc-select',
          'flex h-10 w-full items-center justify-between',
          'rounded-md border border-input bg-background',
          'px-3 py-2 text-sm',
          'ring-offset-background',
          'placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'appearance-none pr-8',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>
  )
}

export interface SelectOptionProps extends JSX.HTMLAttributes<HTMLOptionElement> {
  /** Option value */
  value: string
  /** Children content */
  children?: ComponentChildren
  /** Disabled state */
  disabled?: boolean
}

export function SelectOption({ value, children, disabled, ...props }: SelectOptionProps) {
  return (
    <option value={value} disabled={disabled} {...props}>
      {children}
    </option>
  )
}

export default Select
