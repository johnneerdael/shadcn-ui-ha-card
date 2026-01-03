/**
 * Input Component
 *
 * Preact implementation of Shadcn input component.
 * Based on shadcn-sourcecode/apps/v4/registry/bases/radix/ui/input.tsx
 */

import { JSX } from 'preact'
import { cn } from '../../lib/utils'

export interface InputProps extends Omit<JSX.HTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input type */
  type?: string
  /** Input value */
  value?: string | number
  /** Default value for uncontrolled */
  defaultValue?: string | number
  /** Placeholder text */
  placeholder?: string
  /** Disabled state */
  disabled?: boolean
  /** Read-only state */
  readOnly?: boolean
  /** Change handler */
  onChange?: (event: Event) => void
  /** Additional className */
  className?: string
}

export function Input({
  className,
  type = 'text',
  value,
  defaultValue,
  placeholder,
  disabled,
  readOnly,
  onChange,
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      onChange={onChange}
      data-slot="input"
      class={cn(
        'shc-input',
        'flex h-10 w-full rounded-md border border-input',
        'bg-background px-3 py-2 text-sm',
        'ring-offset-background',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export default Input
