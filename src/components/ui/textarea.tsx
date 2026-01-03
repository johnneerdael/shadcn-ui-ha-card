/**
 * Textarea Component
 *
 * Preact implementation of Shadcn textarea component.
 * Based on shadcn-sourcecode/apps/v4/registry/bases/radix/ui/textarea.tsx
 */

import { JSX } from 'preact'
import { cn } from '../../lib/utils'

export interface TextareaProps extends JSX.HTMLAttributes<HTMLTextAreaElement> {
  /** Textarea value */
  value?: string
  /** Default value for uncontrolled */
  defaultValue?: string
  /** Placeholder text */
  placeholder?: string
  /** Disabled state */
  disabled?: boolean
  /** Read-only state */
  readOnly?: boolean
  /** Number of visible rows */
  rows?: number
  /** Change handler */
  onChange?: (event: Event) => void
  /** Additional className */
  className?: string
}

export function Textarea({
  className,
  value,
  defaultValue,
  placeholder,
  disabled,
  readOnly,
  rows = 3,
  onChange,
  ...props
}: TextareaProps) {
  return (
    <textarea
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      rows={rows}
      onChange={onChange}
      data-slot="textarea"
      class={cn(
        'shc-textarea',
        'flex min-h-[80px] w-full rounded-md border border-input',
        'bg-background px-3 py-2 text-sm',
        'ring-offset-background',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export default Textarea
