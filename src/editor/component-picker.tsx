/**
 * Searchable Component Picker
 *
 * A compact "Add Component" button that opens a searchable command palette
 * within a popover. Reduces vertical clutter in the editor.
 */

import { useMemo, useState } from 'preact/hooks'
import { componentRegistry, type ComponentCategory } from '../lib/component-registry'
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover'
import { Command } from '../components/ui/command'
import type { PaletteItem } from './types'

export interface ComponentPickerProps {
  /** Callback when component is added */
  onAddComponent: (componentType: string) => void
}

/**
 * Main ComponentPicker component
 */
export function ComponentPicker({ onAddComponent }: ComponentPickerProps) {
  const [open, setOpen] = useState(false)

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

  // Group items by category for the command palette
  const groups = useMemo(() => {
    const categories: ComponentCategory[] = ['layout', 'input', 'feedback', 'data']

    return categories.map(category => ({
      heading: category.charAt(0).toUpperCase() + category.slice(1),
      items: paletteItems
        .filter(item => item.category === category)
        .map(item => ({
          id: item.name,
          label: item.displayName,
          description: item.description,
          icon: item.icon, // Passing MDI icon string
          onSelect: () => {
            onAddComponent(item.name)
            setOpen(false)
          }
        }))
    })).filter(group => group.items.length > 0)
  }, [paletteItems, onAddComponent])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs font-medium">
        <ha-icon icon="mdi:plus" class="w-3.5 h-3.5" />
        Add Component
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="p-0 w-72 border-none shadow-none bg-transparent">
        <Command
          open={open}
          onOpenChange={setOpen}
          placeholder="Search components..."
          groups={groups.map(g => ({
            ...g,
            items: g.items.map(item => ({
              ...item,
              // Custom rendering for HA icon
              icon: <ha-icon icon={item.icon} class="w-4 h-4 text-muted-foreground" />
            }))
          })) as any}
          className="relative top-0 left-0 translate-x-0 translate-y-0"
        />
      </PopoverContent>
    </Popover>
  )
}

export default ComponentPicker
