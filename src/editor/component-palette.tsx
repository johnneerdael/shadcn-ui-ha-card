/**
 * Component Palette
 *
 * Displays available components grouped by category for drag-and-drop
 * onto the grid canvas. Includes search and collapsible categories.
 */

// @ts-ignore - Preact JSX pragma
import { h } from 'preact'
import { useMemo, useState, useCallback } from 'preact/hooks'
import { componentRegistry, type ComponentCategory } from '../lib/component-registry'
import type { ComponentPaletteProps, PaletteItem } from './types'

/**
 * Category display configuration
 */
const CATEGORY_CONFIG: Record<ComponentCategory, { label: string; icon: string }> = {
  layout: { label: 'Layout', icon: 'mdi:view-grid' },
  input: { label: 'Input', icon: 'mdi:form-textbox' },
  feedback: { label: 'Feedback', icon: 'mdi:message-alert' },
  data: { label: 'Data', icon: 'mdi:database' },
}

/**
 * Single draggable palette item
 */
function PaletteItemComponent({
  item,
  onAdd,
}: {
  item: PaletteItem
  onAdd: (type: string) => void
}) {
  const handleDragStart = (e: DragEvent) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('componentType', item.name)
      e.dataTransfer.effectAllowed = 'copy'
    }
  }

  const handleClick = () => {
    onAdd(item.name)
  }

  return (
    <button
      type="button"
      class="flex items-center gap-1.5 w-full px-2 py-1.5 rounded hover:bg-accent hover:text-accent-foreground transition-colors text-left cursor-grab active:cursor-grabbing group"
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      title={item.description}
    >
      <ha-icon icon={item.icon} class="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground" />
      <span class="text-xs truncate">{item.displayName}</span>
    </button>
  )
}

/**
 * Collapsible category section
 */
function CategorySection({
  category,
  items,
  onAdd,
  defaultExpanded = true,
}: {
  category: ComponentCategory
  items: PaletteItem[]
  onAdd: (type: string) => void
  defaultExpanded?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const config = CATEGORY_CONFIG[category]

  if (items.length === 0) return null

  return (
    <div class="mb-1">
      <button
        type="button"
        class="flex items-center gap-1.5 w-full px-2 py-1.5 hover:bg-muted rounded transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <ha-icon
          icon={isExpanded ? 'mdi:chevron-down' : 'mdi:chevron-right'}
          class="w-3 h-3 text-muted-foreground"
        />
        <ha-icon icon={config.icon} class="w-3.5 h-3.5 text-muted-foreground" />
        <span class="text-xs font-medium text-muted-foreground flex-1 text-left">
          {config.label}
        </span>
        <span class="text-[10px] text-muted-foreground/60">{items.length}</span>
      </button>
      {isExpanded && (
        <div class="ml-2 mt-0.5 space-y-0.5">
          {items.map((item) => (
            <PaletteItemComponent key={item.name} item={item} onAdd={onAdd} />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Main ComponentPalette component
 */
export function ComponentPalette({ onAddComponent }: ComponentPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Get all UI components from registry and convert to palette items
  const paletteItems = useMemo(() => {
    const uiComponents = componentRegistry.getUIComponents()
    return uiComponents.map((comp): PaletteItem => ({
      name: comp.name,
      displayName: comp.displayName || comp.name,
      description: comp.description || '',
      category: comp.category || 'layout',
      icon: comp.icon || 'mdi:shape',
    }))
  }, [])

  // Filter items by search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return paletteItems
    const query = searchQuery.toLowerCase()
    return paletteItems.filter(
      (item) =>
        item.displayName.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    )
  }, [paletteItems, searchQuery])

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<ComponentCategory, PaletteItem[]> = {
      layout: [],
      input: [],
      feedback: [],
      data: [],
    }

    for (const item of filteredItems) {
      groups[item.category].push(item)
    }

    return groups
  }, [filteredItems])

  // Define category order
  const categoryOrder: ComponentCategory[] = ['layout', 'input', 'feedback', 'data']

  const handleSearchChange = useCallback((e: Event) => {
    setSearchQuery((e.target as HTMLInputElement).value)
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  return (
    <div class="h-full flex flex-col bg-card">
      {/* Header with search */}
      <div class="p-2 border-b border-border space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold">Components</span>
          <span class="text-[10px] text-muted-foreground">{filteredItems.length}</span>
        </div>
        {/* Search input */}
        <div class="relative">
          <ha-icon icon="mdi:magnify" class="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            class="w-full pl-7 pr-7 py-1 text-xs rounded border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search..."
            value={searchQuery}
            onInput={handleSearchChange}
          />
          {searchQuery && (
            <button
              type="button"
              class="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded"
              onClick={handleClearSearch}
            >
              <ha-icon icon="mdi:close" class="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable component list */}
      <div class="flex-1 overflow-y-auto p-1.5">
        {searchQuery ? (
          // Flat list when searching
          <div class="space-y-0.5">
            {filteredItems.map((item) => (
              <PaletteItemComponent key={item.name} item={item} onAdd={onAddComponent} />
            ))}
            {filteredItems.length === 0 && (
              <div class="p-3 text-center text-muted-foreground text-xs">
                No components match "{searchQuery}"
              </div>
            )}
          </div>
        ) : (
          // Categorized list
          categoryOrder.map((category) => (
            <CategorySection
              key={category}
              category={category}
              items={groupedItems[category]}
              onAdd={onAddComponent}
              defaultExpanded={category === 'layout' || category === 'input'}
            />
          ))
        )}
      </div>

      {/* Footer hint */}
      <div class="px-2 py-1.5 border-t border-border">
        <p class="text-[10px] text-muted-foreground text-center">
          Drag or click to add
        </p>
      </div>
    </div>
  )
}

export default ComponentPalette
