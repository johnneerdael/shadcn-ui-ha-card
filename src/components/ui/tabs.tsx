/**
 * Tabs Component
 *
 * Simplified Preact implementation of Shadcn tabs for shadow DOM compatibility.
 * Based on shadcn-sourcecode/apps/v4/registry/bases/base/ui/tabs.tsx
 *
 * Note: This is a CSS-only implementation without @radix-ui/react-tabs
 * to avoid portal issues in shadow DOM.
 */

import { ComponentChildren, createContext } from 'preact'
import { useContext, useState, useCallback } from 'preact/hooks'
import { cn } from '../../lib/utils'

/**
 * Tabs Context for managing active tab state
 */
interface TabsContextValue {
  activeTab: string
  setActiveTab: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component')
  }
  return context
}

/**
 * Tabs Root Component
 */
export interface TabsProps {
  /** Currently active tab value */
  value?: string
  /** Default active tab if uncontrolled */
  defaultValue?: string
  /** Callback when active tab changes */
  onValueChange?: (value: string) => void
  /** Tabs orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Children components */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function Tabs({
  value: controlledValue,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const isControlled = controlledValue !== undefined
  const activeTab = isControlled ? controlledValue : internalValue

  const setActiveTab = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [isControlled, onValueChange]
  )

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, orientation }}>
      <div
        class={cn(
          'shc-tabs',
          orientation === 'horizontal' ? 'flex flex-col' : 'flex flex-row',
          className
        )}
        data-orientation={orientation}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

/**
 * TabsList Component
 */
export interface TabsListProps {
  children?: ComponentChildren
  className?: string
  variant?: 'default' | 'line'
}

export function TabsList({ children, className, variant = 'default' }: TabsListProps) {
  const { orientation } = useTabsContext()

  return (
    <div
      class={cn(
        'shc-tabs-list',
        'inline-flex items-center justify-center gap-1',
        variant === 'default'
          ? 'bg-muted p-1 rounded-md'
          : 'bg-transparent border-b border-border',
        orientation === 'vertical' && 'flex-col h-full',
        className
      )}
      data-variant={variant}
      role="tablist"
    >
      {children}
    </div>
  )
}

/**
 * TabsTrigger Component
 */
export interface TabsTriggerProps {
  /** Tab value identifier */
  value: string
  /** Tab label text */
  label?: string
  /** Children (alternative to label) */
  children?: ComponentChildren
  /** Additional className */
  className?: string
  /** Disabled state */
  disabled?: boolean
}

export function TabsTrigger({
  value,
  label,
  children,
  className,
  disabled = false,
}: TabsTriggerProps) {
  const { activeTab, setActiveTab, orientation } = useTabsContext()
  const isActive = activeTab === value

  const handleClick = useCallback(() => {
    if (!disabled) {
      setActiveTab(value)
    }
  }, [value, disabled, setActiveTab])

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      data-state={isActive ? 'active' : 'inactive'}
      class={cn(
        'shc-tabs-trigger',
        'inline-flex items-center justify-center whitespace-nowrap',
        'px-3 py-1.5 text-sm font-medium',
        'rounded-sm transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
        orientation === 'vertical' && 'w-full justify-start',
        className
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {children || label}
    </button>
  )
}

/**
 * TabsContent Component
 */
export interface TabsContentProps {
  /** Tab value identifier (must match TabsTrigger value) */
  value: string
  /** Children to render when active */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useTabsContext()
  const isActive = activeTab === value

  if (!isActive) {
    return null
  }

  return (
    <div
      role="tabpanel"
      data-state={isActive ? 'active' : 'inactive'}
      class={cn(
        'shc-tabs-content',
        'mt-2 ring-offset-background',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      {children}
    </div>
  )
}

export default Tabs
