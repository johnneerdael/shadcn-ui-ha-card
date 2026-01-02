/**
 * Radio Group Component
 *
 * Preact implementation of Shadcn radio-group component (native radio inputs, no Radix).
 * Based on shadcn-sourcecode/apps/v4/registry/bases/radix/ui/radio-group.tsx
 */

import { JSX, ComponentChildren, createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { cn } from '../../lib/utils'

interface RadioGroupContextValue {
  name: string
  value?: string
  onChange?: (value: string) => void
}

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined)

export interface RadioGroupProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Selected value */
  value?: string
  /** Default value for uncontrolled */
  defaultValue?: string
  /** Name for the radio group */
  name?: string
  /** Change handler */
  onChange?: (value: string) => void
  /** Children (RadioGroupItem components) */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function RadioGroup({
  value,
  defaultValue,
  name = 'radio-group',
  onChange,
  children,
  className,
  ...props
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ name, value, onChange }}>
      <div
        role="radiogroup"
        data-slot="radio-group"
        class={cn('shc-radio-group', 'grid gap-2', className)}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

export interface RadioGroupItemProps extends Omit<JSX.HTMLAttributes<HTMLInputElement>, 'value' | 'size'> {
  /** Radio value */
  value: string
  /** Disabled state */
  disabled?: boolean
  /** Additional className */
  className?: string
}

export function RadioGroupItem({ value, disabled, className, ...props }: RadioGroupItemProps) {
  const context = useContext(RadioGroupContext)

  if (!context) {
    throw new Error('RadioGroupItem must be used within RadioGroup')
  }

  const { name, value: groupValue, onChange } = context
  const isChecked = groupValue === value

  const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.checked) {
      onChange?.(value)
    }
  }

  return (
    <label
      class={cn(
        'shc-radio-group-item',
        'relative inline-flex items-center justify-center',
        'h-4 w-4 shrink-0 rounded-full border border-primary',
        'ring-offset-background',
        'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        data-slot="radio-group-item-input"
        class="absolute inset-0 opacity-0 cursor-pointer peer"
        {...props}
      />
      <div
        class={cn(
          'shc-radio-group-indicator',
          'h-2.5 w-2.5 rounded-full bg-current',
          'opacity-0 peer-checked:opacity-100',
          'transition-opacity'
        )}
      />
    </label>
  )
}

export default RadioGroup
