/**
 * Full Width Canvas
 *
 * Full-width canvas at the bottom of the editor.
 * Shows live preview with inline editing capabilities.
 * Components can be resized and deleted directly.
 */

import { useState, useRef, useEffect } from 'preact/hooks'
import { h } from 'preact'
// @ts-ignore - Type compatibility
import ReactGridLayout from 'react-grid-layout'
import { LayoutRenderer } from '../renderer/layout-renderer'
import { BindingEngine, ActionHandler, type HomeAssistant } from '../lib/binding-engine'
import { componentRegistry } from '../lib/component-registry'
import type { LayoutItem } from './types'

// Grid configuration
const COLS = 12
const ROW_HEIGHT = 40
const MARGIN: [number, number] = [8, 8]

export interface FullWidthCanvasProps {
  /** Layout items to render */
  layout: LayoutItem[]
  /** Currently selected item ID */
  selectedId: string | null
  /** Home Assistant instance */
  hass: unknown
  /** Callback when layout changes (drag/resize) */
  onLayoutChange: (layout: LayoutItem[]) => void
  /** Callback when an item is selected */
  onSelect: (id: string | null) => void
  /** Callback when an item should be deleted */
  onDelete: (id: string) => void
}

/**
 * Component overlay for selection and deletion
 */
function ComponentOverlay({
  item,
  isSelected,
  onSelect,
  onDelete,
}: {
  item: LayoutItem
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const compDef = componentRegistry.get(item.component)
  const displayName = compDef?.displayName || item.component

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    onSelect()
  }

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  return (
    <div
      class={`absolute inset-0 rounded-md transition-all cursor-pointer group ${
        isSelected
          ? 'ring-2 ring-primary ring-offset-1 bg-primary/5'
          : 'hover:ring-2 hover:ring-primary/50'
      }`}
      onClick={handleClick}
    >
      {/* Component label - top left */}
      <div class={`absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[10px] font-medium transition-opacity ${
        isSelected ? 'bg-primary text-primary-foreground opacity-100' : 'bg-muted text-muted-foreground opacity-0 group-hover:opacity-100'
      }`}>
        {displayName}
      </div>

      {/* Delete button - top right */}
      <button
        type="button"
        class={`absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground shadow-sm transition-opacity ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        onClick={handleDelete}
        title="Delete"
      >
        <ha-icon icon="mdi:close" class="w-3 h-3" />
      </button>
    </div>
  )
}

/**
 * Main FullWidthCanvas component
 */
export function FullWidthCanvas({
  layout,
  selectedId,
  hass,
  onLayoutChange,
  onSelect,
  onDelete,
}: FullWidthCanvasProps) {
  const [containerWidth, setContainerWidth] = useState(800)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize binding engine and action handler for live preview
  const [bindingEngine, setBindingEngine] = useState<BindingEngine | null>(null)
  const [actionHandler, setActionHandler] = useState<ActionHandler | null>(null)

  // Throttle updateHass
  const lastHassUpdateRef = useRef<number>(0)
  const HASS_UPDATE_THROTTLE_MS = 100

  // Measure container width
  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    resizeObserver.observe(node)

    return () => resizeObserver.disconnect()
  }, [])

  // Initialize engines
  useEffect(() => {
    if (hass && containerRef.current && !bindingEngine && !actionHandler) {
      const engine = new BindingEngine(hass as HomeAssistant, containerRef.current)
      const handler = new ActionHandler(hass as HomeAssistant, containerRef.current)
      setBindingEngine(engine)
      setActionHandler(handler)

      return () => {
        engine.destroy()
      }
    }
  }, [hass, bindingEngine, actionHandler])

  // Update engines when hass changes (throttled)
  useEffect(() => {
    if (hass && bindingEngine && actionHandler) {
      const now = Date.now()
      if (now - lastHassUpdateRef.current >= HASS_UPDATE_THROTTLE_MS) {
        lastHassUpdateRef.current = now
        bindingEngine.updateHass(hass as HomeAssistant)
        actionHandler.updateHass(hass as HomeAssistant)
      }
    }
  }, [hass, bindingEngine, actionHandler])

  // Convert LayoutItem[] to react-grid-layout format
  const gridLayout = layout.map((item) => ({
    i: item.i,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
    minW: item.minW || 2,
    minH: item.minH || 1,
    maxW: item.maxW,
    maxH: item.maxH,
    static: item.static,
  }))

  // Handle layout changes from drag/resize
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLayoutChange = (newGridLayout: any[]) => {
    const updatedLayout = layout.map((item) => {
      const gridItem = newGridLayout.find((g: any) => g.i === item.i)
      if (gridItem) {
        return {
          ...item,
          x: gridItem.x,
          y: gridItem.y,
          w: gridItem.w,
          h: gridItem.h,
        }
      }
      return item
    })

    onLayoutChange(updatedLayout)
  }

  // Handle click on empty canvas area (deselect)
  const handleCanvasClick = () => {
    onSelect(null)
  }

  // Build grid props
  const gridProps: Record<string, unknown> = {
    className: 'layout',
    layout: gridLayout,
    cols: COLS,
    rowHeight: ROW_HEIGHT,
    width: containerWidth - 32,
    margin: MARGIN,
    onLayoutChange: handleLayoutChange,
    useCSSTransforms: true,
    compactType: null,
    preventCollision: false,
  }

  return (
    <div
      ref={containerRef}
      class="flex-1 bg-muted/20 overflow-auto p-4"
      onClick={handleCanvasClick}
    >
      {layout.length === 0 ? (
        <div class="h-full min-h-[300px] flex items-center justify-center rounded-lg border-2 border-dashed border-border/50 bg-card">
          <div class="text-center p-8">
            <ha-icon icon="mdi:plus-circle-outline" class="w-12 h-12 mb-3 text-primary/50" />
            <p class="text-sm font-medium text-foreground/80">Add components from above</p>
            <p class="text-xs mt-1 text-muted-foreground">Click any component in the picker to add it here</p>
          </div>
        </div>
      ) : (
        <div
          class="bg-card rounded-lg border border-border relative"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border) / 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border) / 0.2) 1px, transparent 1px)
            `,
            backgroundSize: `${(containerWidth - 32) / COLS}px ${ROW_HEIGHT}px`,
          }}
        >
          {h(ReactGridLayout as any, {
            ...gridProps,
            children: layout.map((item) => (
              <div key={item.i} class="relative">
                {/* Actual component render */}
                {hass && bindingEngine && actionHandler && (
                  <div class="h-full overflow-hidden rounded-md">
                    <LayoutRenderer
                      layout={[item]}
                      hass={hass as HomeAssistant}
                      bindingEngine={bindingEngine}
                      actionHandler={actionHandler}
                    />
                  </div>
                )}
                {/* Selection overlay */}
                <ComponentOverlay
                  item={item}
                  isSelected={item.i === selectedId}
                  onSelect={() => onSelect(item.i)}
                  onDelete={() => onDelete(item.i)}
                />
              </div>
            )),
          } as any)}
        </div>
      )}

      {/* Canvas info footer */}
      <div class="mt-2 flex justify-between text-[10px] text-muted-foreground px-1">
        <span>{layout.length} component{layout.length !== 1 ? 's' : ''}</span>
        <span>{COLS} cols • {ROW_HEIGHT}px rows</span>
      </div>
    </div>
  )
}

export default FullWidthCanvas
