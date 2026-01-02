/**
 * Split Canvas
 *
 * Combines live preview (top) with grid positioning (bottom) in a resizable split view.
 * This allows users to see the actual rendered card while editing positions.
 */

import { useState, useCallback, useRef, useEffect } from 'preact/hooks'
import { GridCanvas } from './grid-canvas'
import { LayoutRenderer } from '../renderer/layout-renderer'
import { BindingEngine, ActionHandler, type HomeAssistant } from '../lib/binding-engine'
import type { LayoutItem } from './types'

/**
 * Props for SplitCanvas
 */
export interface SplitCanvasProps {
  /** Layout items to render */
  layout: LayoutItem[]
  /** Currently selected item ID */
  selectedId: string | null
  /** Home Assistant instance for live preview */
  hass: unknown
  /** Callback when layout changes (drag/resize) */
  onLayoutChange: (layout: LayoutItem[]) => void
  /** Callback when an item is selected */
  onSelect: (id: string | null) => void
  /** Callback when an item should be deleted */
  onDelete: (id: string) => void
}

/**
 * SplitCanvas Component
 *
 * Provides a split view with:
 * - Top: Live preview showing actual rendered components
 * - Bottom: Grid canvas for positioning
 * - Draggable divider to adjust sizes
 */
export function SplitCanvas({
  layout,
  selectedId,
  hass,
  onLayoutChange,
  onSelect,
  onDelete,
}: SplitCanvasProps) {
  // Split ratio (0-1, where 0.5 = 50% each)
  const [splitRatio, setSplitRatio] = useState(0.4) // 40% preview, 60% grid
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize binding engine and action handler for live preview
  // Use containerRef as the root element for event dispatching (not document.body)
  // This ensures events bubble correctly within the editor preview
  const [bindingEngine, setBindingEngine] = useState<BindingEngine | null>(null)
  const [actionHandler, setActionHandler] = useState<ActionHandler | null>(null)

  // Initialize engines once containerRef is available
  useEffect(() => {
    if (hass && containerRef.current && !bindingEngine && !actionHandler) {
      setBindingEngine(new BindingEngine(hass as HomeAssistant, containerRef.current))
      setActionHandler(new ActionHandler(hass as HomeAssistant, containerRef.current))
    }
  }, [hass, bindingEngine, actionHandler])

  // Update engines when hass changes
  useEffect(() => {
    if (hass && bindingEngine && actionHandler) {
      bindingEngine.updateHass(hass as HomeAssistant)
      actionHandler.updateHass(hass as HomeAssistant)
    }
  }, [hass, bindingEngine, actionHandler])

  // Handle divider drag start
  const handleDividerMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  // Handle divider drag move
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const relativeY = e.clientY - rect.top
      const newRatio = relativeY / rect.height

      // Constrain ratio between 20% and 80%
      setSplitRatio(Math.max(0.2, Math.min(0.8, newRatio)))
    },
    [isDragging]
  )

  // Handle divider drag end
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add/remove global mouse listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Calculate heights
  const previewHeight = `${splitRatio * 100}%`
  const gridHeight = `${(1 - splitRatio) * 100}%`

  return (
    <div ref={containerRef} class="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Live Preview Pane */}
      <div
        class="flex flex-col border-b border-border bg-muted/30"
        style={{ height: previewHeight, minHeight: '100px' }}
      >
        {/* Preview Header */}
        <div class="flex items-center justify-between px-3 py-2 border-b border-border bg-card">
          <div class="flex items-center gap-2">
            <ha-icon icon="mdi:eye" class="w-4 h-4 text-primary" />
            <span class="text-xs font-semibold">Live Preview</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-muted-foreground">
              {layout.length} component{layout.length !== 1 ? 's' : ''}
            </span>
            <button
              class="p-1 rounded hover:bg-muted text-xs"
              onClick={() => setSplitRatio(splitRatio === 0.5 ? 0.4 : 0.5)}
              title="Toggle preview size"
            >
              <ha-icon icon="mdi:arrow-expand-vertical" class="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div class="flex-1 overflow-auto p-4">
          {layout.length === 0 ? (
            <div class="h-full flex items-center justify-center text-muted-foreground">
              <div class="text-center">
                <ha-icon icon="mdi:view-dashboard-outline" class="w-12 h-12 mb-2 opacity-30" />
                <p class="text-sm">No components yet</p>
                <p class="text-xs mt-1">Drag components from the palette</p>
              </div>
            </div>
          ) : (
            <div class="max-w-4xl mx-auto">
              {hass && bindingEngine && actionHandler ? (
                <LayoutRenderer
                  layout={layout}
                  hass={hass as HomeAssistant}
                  bindingEngine={bindingEngine}
                  actionHandler={actionHandler}
                />
              ) : (
                <div class="p-4 text-center text-muted-foreground text-sm">
                  Waiting for Home Assistant connection...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Resizable Divider */}
      <div
        class={`
          relative h-1 bg-border cursor-row-resize flex items-center justify-center
          hover:bg-primary/50 transition-colors
          ${isDragging ? 'bg-primary' : ''}
        `}
        onMouseDown={handleDividerMouseDown}
      >
        <div class="absolute w-8 h-3 bg-muted border border-border rounded-full flex items-center justify-center">
          <ha-icon icon="mdi:drag-horizontal" class="w-3 h-3 text-muted-foreground" />
        </div>
      </div>

      {/* Grid Positioning Pane */}
      <div
        class="flex flex-col bg-background"
        style={{ height: gridHeight, minHeight: '200px' }}
      >
        {/* Grid Header */}
        <div class="flex items-center justify-between px-3 py-2 border-b border-border bg-card">
          <div class="flex items-center gap-2">
            <ha-icon icon="mdi:grid" class="w-4 h-4 text-primary" />
            <span class="text-xs font-semibold">Grid Positioning</span>
          </div>
          <span class="text-[10px] text-muted-foreground">
            Drag and resize to position components
          </span>
        </div>

        {/* Grid Content */}
        <div class="flex-1 overflow-auto">
          <GridCanvas
            layout={layout}
            selectedId={selectedId}
            onLayoutChange={onLayoutChange}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  )
}

export default SplitCanvas
