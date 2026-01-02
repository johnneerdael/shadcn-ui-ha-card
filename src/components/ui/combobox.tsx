import { useState, useRef, useEffect } from 'preact/hooks'
import { cn } from '../../lib/utils'

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
}

/**
 * Combobox Component
 *
 * Autocomplete/searchable select component for large lists.
 * Shadow DOM compatible - uses absolute positioning.
 *
 * @example
 * <Combobox
 *   options={[
 *     { value: 'light1', label: 'Living Room Light' },
 *     { value: 'light2', label: 'Bedroom Light' }
 *   ]}
 *   placeholder="Select a device..."
 *   onValueChange={(value) => console.log(value)}
 * />
 */
export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  className,
  disabled = false,
  ...props
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get selected option label
  const selectedOption = options.find((opt) => opt.value === value)
  const selectedLabel = selectedOption?.label || placeholder

  // Close on click outside
  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open])

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue)
    setOpen(false)
    setSearchQuery('')
  }

  const handleToggle = () => {
    if (!disabled) {
      setOpen(!open)
      if (!open) {
        setSearchQuery('')
      }
    }
  }

  return (
    <div
      ref={containerRef}
      data-slot="combobox"
      class={cn('shc-combobox', 'relative', className)}
      {...props}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        class={cn(
          'flex w-full items-center justify-between rounded-md border border-input',
          'bg-background px-3 py-2 text-sm',
          'hover:bg-accent hover:text-accent-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          open && 'ring-2 ring-ring ring-offset-2'
        )}
      >
        <span class={cn(!value && 'text-muted-foreground')}>{selectedLabel}</span>
        <svg
          class={cn('h-4 w-4 opacity-50 transition-transform', open && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          class={cn(
            'absolute z-50 mt-1 w-full',
            'rounded-md border bg-popover shadow-md',
            'animate-in fade-in-0 zoom-in-95'
          )}
        >
          {/* Search Input */}
          <div class="p-2">
            <input
              ref={inputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
              class={cn(
                'w-full rounded-md border border-input bg-background',
                'px-3 py-2 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-ring'
              )}
            />
          </div>

          {/* Options List */}
          <div class="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div class="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                  class={cn(
                    'w-full text-left rounded-sm px-3 py-2 text-sm',
                    'hover:bg-accent hover:text-accent-foreground',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    value === option.value && 'bg-accent text-accent-foreground font-medium'
                  )}
                >
                  {option.label}
                  {value === option.value && (
                    <span class="ml-2">✓</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Export for component registry
Combobox.displayName = 'Combobox'
