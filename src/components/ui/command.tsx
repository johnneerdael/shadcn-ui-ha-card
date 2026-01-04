import { useState, useRef, useEffect } from 'preact/hooks'
import { cn } from '../../lib/utils'

export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: string
  keywords?: string[]
  onSelect: () => void
  disabled?: boolean
}

export interface CommandGroup {
  heading?: string
  items: CommandItem[]
}

export interface CommandProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  emptyMessage?: string
  groups?: CommandGroup[]
  className?: string
}

/**
 * Command Component
 *
 * Command palette / spotlight search (Cmd+K) for Home Assistant (Shadow DOM compatible).
 * Called a "massive usability booster" for complex smart homes.
 *
 * **Shadow DOM Strategy:**
 * Fixed center positioning with full-screen backdrop, similar to Dialog.
 * No portals - renders inline with z-index stacking.
 *
 * **Why No Radix UI:**
 * - Radix doesn't have a Command component
 * - Custom implementation inspired by cmdk library
 * - Fixed positioning works perfectly in shadow root
 *
 * **Features:**
 * - Grouped commands with headings
 * - Fuzzy search across labels, descriptions, and keywords
 * - Keyboard-first interaction:
 *   - Arrow Up/Down: Navigate items
 *   - Enter: Select item
 *   - Escape: Close palette
 * - Auto-focus search input
 * - Click-outside to close
 *
 * **Use Case:**
 * Perfect for power users with complex HA setups:
 * - Quick actions: "Turn off kitchen lights"
 * - Navigation: "Goto automation settings"
 * - Device control: Search by name/room/type
 * - Scene activation: Search scenes by keyword
 *
 * @example
 * ```tsx
 * <Command
 *   open={open}
 *   onOpenChange={setOpen}
 *   placeholder="Type a command or search..."
 *   groups={[
 *     {
 *       heading: 'Quick Actions',
 *       items: [
 *         {
 *           id: 'lights-off',
 *           label: 'Turn off all lights',
 *           description: 'Turn off every light in the house',
 *           keywords: ['lights', 'off', 'all'],
 *           onSelect: () => turnOffLights()
 *         }
 *       ]
 *     }
 *   ]}
 * />
 * ```
 */
export function Command({
  open = false,
  onOpenChange,
  placeholder = 'Type a command or search...',
  emptyMessage = 'No results found.',
  groups = [],
  className,
  ...props
}: CommandProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Filter and flatten items based on search
  const filteredGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (item.disabled) return false
        const query = searchQuery.toLowerCase()
        const label = item.label.toLowerCase()
        const description = item.description?.toLowerCase() || ''
        const keywords = item.keywords?.join(' ').toLowerCase() || ''
        return label.includes(query) || description.includes(query) || keywords.includes(query)
      }),
    }))
    .filter((group) => group.items.length > 0)

  const flatFilteredItems = filteredGroups.flatMap((g) => g.items)

  // Close on Escape
  useEffect(() => {
    if (!open) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange?.(false)
        setSearchQuery('')
        setSelectedIndex(0)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onOpenChange])

  // Handle keyboard navigation
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, flatFilteredItems.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const selectedItem = flatFilteredItems[selectedIndex]
        if (selectedItem) {
          selectedItem.onSelect()
          onOpenChange?.(false)
          setSearchQuery('')
          setSelectedIndex(0)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, flatFilteredItems, selectedIndex, onOpenChange])

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  // Click outside to close
  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-slot="command"]')) {
        onOpenChange?.(false)
        setSearchQuery('')
        setSelectedIndex(0)
      }
    }

    // Delay to avoid closing immediately
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        class="fixed inset-0 bg-black/50 z-50 animate-in fade-in-0"
        onClick={() => onOpenChange?.(false)}
      />

      {/* Command Dialog */}
      <div
        data-slot="command"
        class={cn(
          'fixed left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2',
          'z-50 w-full max-w-2xl',
          'rounded-lg border bg-popover shadow-lg',
          'animate-in fade-in-0 zoom-in-95',
          className
        )}
        {...props}
      >
        {/* Search Input */}
        <div class="flex items-center border-b px-4">
          <svg class="h-5 w-5 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
            class="flex h-14 w-full rounded-md bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd class="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
            <span class="text-xs">ESC</span>
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} class="max-h-96 overflow-y-auto p-2">
          {flatFilteredItems.length === 0 ? (
            <div class="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</div>
          ) : (
            filteredGroups.map((group, groupIdx) => (
              <div key={groupIdx} class="mb-2">
                {group.heading && (
                  <div class="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {group.heading}
                  </div>
                )}
                {group.items.map((item) => {
                  const itemIndex = flatFilteredItems.indexOf(item)
                  const isSelected = itemIndex === selectedIndex

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.onSelect()
                        onOpenChange?.(false)
                        setSearchQuery('')
                        setSelectedIndex(0)
                      }}
                      class={cn(
                        'w-full flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-left',
                        'hover:bg-accent hover:text-accent-foreground',
                        isSelected && 'bg-accent text-accent-foreground'
                      )}
                    >
                      {item.icon && <span>{item.icon}</span>}
                      <div class="flex-1 min-w-0">
                        <div class="font-medium whitespace-normal">{item.label}</div>
                        {item.description && (
                          <div class="text-xs text-muted-foreground whitespace-normal">{item.description}</div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

// Export for component registry
Command.displayName = 'Command'
