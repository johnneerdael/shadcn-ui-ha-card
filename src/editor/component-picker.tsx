/**
 * Searchable Component Picker
 *
 * A compact "Add Component" button that opens a searchable command palette
 * within a popover. Reduces vertical clutter in the editor.
 */

import { useMemo, useState } from 'preact/hooks'
import { componentRegistry, type ComponentCategory } from '../lib/component-registry'
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover'
import { Tooltip } from '../components/ui/tooltip'
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

  // Group items by category
  const categories: { key: ComponentCategory; label: string; icon: string }[] = [
    { key: 'layout', label: 'Layout', icon: 'mdi:view-grid' },
    { key: 'input', label: 'Input', icon: 'mdi:form-textbox' },
    { key: 'feedback', label: 'Feedback', icon: 'mdi:message-alert' },
    { key: 'data', label: 'Data', icon: 'mdi:database' },
  ]

  const handleDragStart = (e: DragEvent, type: string) => {
    e.dataTransfer?.setData('text/plain', type)
    // For react-grid-layout external drop
    const dt = e.dataTransfer
    if (dt) {
      dt.effectAllowed = 'move'
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs font-medium flex-shrink-0">
        <ha-icon icon="mdi:plus" class="w-3.5 h-3.5" />
        Add Component
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="p-0 w-[400px] border border-border shadow-xl bg-popover overflow-hidden">
        <div class="flex flex-col max-h-[450px]">
          <div class="px-3 py-2 border-b border-border bg-muted/30">
            <span class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Components Library</span>
          </div>

          <div class="flex-1 overflow-y-auto p-2">
            {categories.map((cat) => {
              const items = paletteItems.filter(item => item.category === cat.key)
              if (items.length === 0) return null

              return (
                <div key={cat.key} class="mb-4 last:mb-0">
                  <div class="flex items-center gap-1.5 px-2 mb-1.5">
                    <ha-icon icon={cat.icon} class="w-3 h-3 text-primary/60" />
                    <span class="text-[10px] font-semibold text-muted-foreground">{cat.label}</span>
                  </div>

                  <div class="flex flex-wrap gap-1">
                    {items.map((item) => (
                      <Tooltip key={item.name} content={item.description}>
                        <button
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, item.name)}
                          onClick={() => {
                            onAddComponent(item.name)
                            setOpen(false)
                          }}
                          class="flex flex-col items-center justify-center w-[74px] h-[64px] gap-1.5 p-1 rounded-md border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all group"
                        >
                          <div class="w-8 h-8 flex items-center justify-center rounded bg-muted group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary transition-colors">
                            <ha-icon icon={item.icon} class="w-5 h-5" />
                          </div>
                          <span class="text-[9px] font-medium text-center leading-tight line-clamp-2 px-0.5">
                            {item.displayName}
                          </span>
                        </button>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ComponentPicker
