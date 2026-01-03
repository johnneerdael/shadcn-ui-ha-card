/**
 * Horizontal Component Picker
 *
 * Full-width horizontal picker with one row per category.
 * Clicking a component adds it to the canvas and opens its styling panel.
 */

import { useMemo } from 'preact/hooks'
import { componentRegistry, type ComponentCategory } from '../lib/component-registry'
import type { PaletteItem } from './types'

export interface HorizontalPickerProps {
  /** Callback when component is added */
  onAddComponent: (componentType: string) => void
}

/**
 * Category display configuration
 */
const CATEGORY_CONFIG: Record<ComponentCategory, { label: string; icon: string }> = {
  layout: { label: 'Layout', icon: 'mdi:view-grid' },
  input: { label: 'Input', icon: 'mdi:form-textbox' },
  feedback: { label: 'Feedback', icon: 'mdi:message-alert' },
  data: { label: 'Data', icon: 'mdi:database' },
}

const CATEGORY_ORDER: ComponentCategory[] = ['layout', 'input', 'feedback', 'data']

/**
 * Single component button in the picker
 */
function PickerButton({
  item,
  onAdd,
}: {
  item: PaletteItem
  onAdd: (type: string) => void
}) {
  return (
    <button
      type="button"
      class="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-accent hover:text-accent-foreground transition-colors text-left whitespace-nowrap"
      onClick={() => onAdd(item.name)}
      title={item.description}
    >
      <ha-icon icon={item.icon} class="w-3.5 h-3.5 text-muted-foreground" />
      <span class="text-xs">{item.displayName}</span>
    </button>
  )
}

/**
 * Single category row
 */
function CategoryRow({
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
    <div class="flex items-center gap-2 px-3 py-1 border-b border-border last:border-b-0">
      {/* Category label */}
      <div class="flex items-center gap-1.5 w-20 flex-shrink-0">
        <ha-icon icon={config.icon} class="w-3.5 h-3.5 text-muted-foreground" />
        <span class="text-xs font-medium text-muted-foreground">{config.label}</span>
      </div>

      {/* Scrollable component list */}
      <div class="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-thin">
        {items.map((item) => (
          <PickerButton key={item.name} item={item} onAdd={onAdd} />
        ))}
      </div>
    </div>
  )
}

/**
 * Main HorizontalPicker component
 */
export function HorizontalPicker({ onAddComponent }: HorizontalPickerProps) {
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

  return (
    <div class="bg-card border-b border-border">
      {CATEGORY_ORDER.map((category) => (
        <CategoryRow
          key={category}
          category={category}
          items={groupedItems[category]}
          onAdd={onAddComponent}
        />
      ))}
    </div>
  )
}

export default HorizontalPicker
