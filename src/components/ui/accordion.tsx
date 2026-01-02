/**
 * Accordion Component
 *
 * Preact implementation of Shadcn accordion component.
 * Collapsible sections with exclusive expansion.
 */

import { ComponentChildren, createContext } from 'preact'
import { useContext, useState, useCallback } from 'preact/hooks'
import { cn } from '../../lib/utils'

interface AccordionContextValue {
  type: 'single' | 'multiple'
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined)

export interface AccordionProps {
  /** Type of accordion */
  type?: 'single' | 'multiple'
  /** Controlled value */
  value?: string | string[]
  /** Default value for uncontrolled */
  defaultValue?: string | string[]
  /** Change handler */
  onValueChange?: (value: string | string[]) => void
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function Accordion({
  type = 'single',
  value: controlledValue,
  defaultValue,
  onValueChange,
  children,
  className,
  ...props
}: AccordionProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const handleValueChange = useCallback(
    (newValue: string | string[]) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [isControlled, onValueChange]
  )

  return (
    <AccordionContext.Provider value={{ type, value, onValueChange: handleValueChange }}>
      <div
        data-slot="accordion"
        class={cn('shc-accordion', 'flex w-full flex-col', className)}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemContextValue {
  value: string
  isOpen: boolean
  toggle: () => void
}

const AccordionItemContext = createContext<AccordionItemContextValue | undefined>(undefined)

export interface AccordionItemProps {
  /** Item value */
  value: string
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function AccordionItem({ value, children, className, ...props }: AccordionItemProps) {
  const context = useContext(AccordionContext)

  if (!context) {
    throw new Error('AccordionItem must be used within Accordion')
  }

  const { type, value: accordionValue, onValueChange } = context

  const isOpen =
    type === 'single'
      ? accordionValue === value
      : Array.isArray(accordionValue) && accordionValue.includes(value)

  const toggle = useCallback(() => {
    if (type === 'single') {
      onValueChange?.(isOpen ? '' : value)
    } else {
      const currentValues = (accordionValue as string[]) || []
      const newValues = isOpen
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]
      onValueChange?.(newValues)
    }
  }, [type, value, isOpen, accordionValue, onValueChange])

  return (
    <AccordionItemContext.Provider value={{ value, isOpen, toggle }}>
      <div
        data-slot="accordion-item"
        data-state={isOpen ? 'open' : 'closed'}
        class={cn('shc-accordion-item', 'border-b border-border', className)}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

export interface AccordionTriggerProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function AccordionTrigger({ children, className, ...props }: AccordionTriggerProps) {
  const context = useContext(AccordionItemContext)

  if (!context) {
    throw new Error('AccordionTrigger must be used within AccordionItem')
  }

  const { isOpen, toggle } = context

  return (
    <button
      type="button"
      data-slot="accordion-trigger"
      aria-expanded={isOpen}
      class={cn(
        'shc-accordion-trigger',
        'flex flex-1 items-center justify-between py-4 font-medium',
        'transition-all hover:underline',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      onClick={toggle}
      {...props}
    >
      {children}
      <svg
        class={cn(
          'h-4 w-4 shrink-0 transition-transform duration-200',
          isOpen && 'rotate-180'
        )}
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
    </button>
  )
}

export interface AccordionContentProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function AccordionContent({ children, className, ...props }: AccordionContentProps) {
  const context = useContext(AccordionItemContext)

  if (!context) {
    throw new Error('AccordionContent must be used within AccordionItem')
  }

  const { isOpen } = context

  if (!isOpen) return null

  return (
    <div
      data-slot="accordion-content"
      class={cn(
        'shc-accordion-content',
        'overflow-hidden text-sm transition-all',
        'pb-4 pt-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Accordion
