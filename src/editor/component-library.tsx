/**
 * Inline Component Library
 *
 * A multi-line, categorized component library that is always visible.
 * Supports drag-and-drop directly onto the canvas.
 */

import { useMemo } from 'preact/hooks'
import { componentRegistry, type ComponentCategory } from '../lib/component-registry'
import type { PaletteItem } from './types'

export interface ComponentLibraryProps {
  /** Callback when component is added */
  onAddComponent: (componentType: string) => void
}

/**
 * Main ComponentLibrary component
 */
export function ComponentLibrary({ onAddComponent }: ComponentLibraryProps) {
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
    const dt = e.dataTransfer
    if (dt) {
      dt.effectAllowed = 'move'
    }
  }

  return (
    <div class="bg-card border-b border-border select-none flex flex-col">
      <div class="px-4 py-2 border-b border-border/50 bg-muted/20 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <ha-icon icon="mdi:library-outline" class="w-4 h-4 text-primary shrink-0" />
          <span class="text-[10px] font-bold uppercase tracking-wider text-foreground">Component Library</span>
        </div>
        <span class="text-[9px] font-medium text-muted-foreground uppercase tracking-tight">Drag to Canvas or Click to Add</span>
      </div>

      <div class="p-3 space-y-4 max-h-[300px] overflow-y-auto scrollbar-thin">
        {categories.map((cat) => {
          const items = paletteItems.filter(item => item.category === cat.key)
          if (items.length === 0) return null

          return (
            <div key={cat.key} class="space-y-2">
              <div class="flex items-center gap-3 px-1">
                <ha-icon icon={cat.icon} class="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
                <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{cat.label}</span>
                <div class="h-px flex-1 bg-border/40 ml-1" />
              </div>

              <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {items.map((item) => (
                  <button
                    key={item.name}
                    title={item.description}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, item.name)}
                    onClick={() => onAddComponent(item.name)}
                    class="flex flex-col items-center justify-center w-full aspect-square gap-1.5 p-1 rounded-md border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all group shrink-0"
                  >
                    <div class="w-8 h-8 flex items-center justify-center rounded bg-muted group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                      <ha-icon icon={item.icon} class="w-5 h-5" />
                    </div>
                    <span class="text-[8px] font-bold text-center leading-tight line-clamp-2 px-0.5 text-foreground/80 group-hover:text-primary transition-colors uppercase tracking-tighter">
                      {item.displayName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ComponentLibrary
