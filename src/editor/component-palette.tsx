/**
 * Component Palette
 *
 * Displays available components grouped by category for drag-and-drop
 * onto the grid canvas.
 */

// @ts-ignore - Preact JSX pragma
import { h } from 'preact'
import { useMemo } from 'preact/hooks'
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
      class="flex items-center gap-2 w-full p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-left cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      title={item.description}
    >
      <ha-icon icon={item.icon} class="w-5 h-5 text-muted-foreground" />
      <span class="text-sm">{item.displayName}</span>
    </button>
  )
}

/**
 * Category section with collapsible list
 */
function CategorySection({
  category,
  items,
  onAdd,
}: {
  category: ComponentCategory
  items: PaletteItem[]
  onAdd: (type: string) => void
}) {
  const config = CATEGORY_CONFIG[category]

  if (items.length === 0) return null

  return (
    <div class="mb-4">
      <div class="flex items-center gap-2 mb-2 px-2">
        <ha-icon icon={config.icon} class="w-4 h-4 text-muted-foreground" />
        <span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {config.label}
        </span>
      </div>
      <div class="space-y-1">
        {items.map((item) => (
          <PaletteItemComponent key={item.name} item={item} onAdd={onAdd} />
        ))}
      </div>
    </div>
  )
}

/**
 * Main ComponentPalette component
 */
export function ComponentPalette({ onAddComponent }: ComponentPaletteProps) {
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

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<ComponentCategory, PaletteItem[]> = {
      layout: [],
      input: [],
      feedback: [],
      data: [],
    }

    for (const item of paletteItems) {
      groups[item.category].push(item)
    }

    return groups
  }, [paletteItems])

  // Define category order
  const categoryOrder: ComponentCategory[] = ['layout', 'input', 'feedback', 'data']

  return (
    <div class="h-full flex flex-col border-r border-border bg-card">
      {/* Header */}
      <div class="p-3 border-b border-border">
        <h3 class="text-sm font-semibold">Components</h3>
        <p class="text-xs text-muted-foreground mt-1">
          Drag to canvas or click to add
        </p>
      </div>

      {/* Scrollable component list */}
      <div class="flex-1 overflow-y-auto p-2">
        {categoryOrder.map((category) => (
          <CategorySection
            key={category}
            category={category}
            items={groupedItems[category]}
            onAdd={onAddComponent}
          />
        ))}

        {paletteItems.length === 0 && (
          <div class="p-4 text-center text-muted-foreground text-sm">
            No components available
          </div>
        )}
      </div>
    </div>
  )
}

export default ComponentPalette
