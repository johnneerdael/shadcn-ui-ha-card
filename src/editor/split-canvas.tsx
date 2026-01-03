/**
 * Split Canvas
 *
 * WYSIWYG-style editor with grid canvas as the primary editing area.
 * Toggle between: Grid Only, Side-by-Side, or Preview Only views.
 */

import { useState, useRef, useEffect } from 'preact/hooks'
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

type ViewMode = 'grid' | 'split' | 'preview'

/**
 * SplitCanvas Component
 *
 * Provides flexible view modes:
 * - Grid: Full-width grid canvas for positioning
 * - Split: Side-by-side grid and preview
 * - Preview: Full preview (useful for checking final result)
 */
export function SplitCanvas({
  layout,
  selectedId,
  hass,
  onLayoutChange,
  onSelect,
  onDelete,
}: SplitCanvasProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize binding engine and action handler for live preview
  const [bindingEngine, setBindingEngine] = useState<BindingEngine | null>(null)
  const [actionHandler, setActionHandler] = useState<ActionHandler | null>(null)

  // Throttle updateHass to prevent excessive updates
  const lastHassUpdateRef = useRef<number>(0)
  const HASS_UPDATE_THROTTLE_MS = 100

  // Initialize engines once containerRef is available
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

  const showGrid = viewMode === 'grid' || viewMode === 'split'
  const showPreview = viewMode === 'preview' || viewMode === 'split'

  return (
    <div ref={containerRef} class="flex-1 flex flex-col overflow-hidden bg-background">
      {/* View Mode Toggle Bar */}
      <div class="flex items-center justify-between px-3 py-1.5 border-b border-border bg-card">
        <div class="flex items-center gap-1">
          {/* View mode buttons */}
          <button
            type="button"
            class={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
              viewMode === 'grid'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-muted-foreground'
            }`}
            onClick={() => setViewMode('grid')}
            title="Grid only"
          >
            <ha-icon icon="mdi:grid" class="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
          <button
            type="button"
            class={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
              viewMode === 'split'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-muted-foreground'
            }`}
            onClick={() => setViewMode('split')}
            title="Split view"
          >
            <ha-icon icon="mdi:view-split-vertical" class="w-3.5 h-3.5" />
            <span>Split</span>
          </button>
          <button
            type="button"
            class={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
              viewMode === 'preview'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-muted-foreground'
            }`}
            onClick={() => setViewMode('preview')}
            title="Preview only"
          >
            <ha-icon icon="mdi:eye" class="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
        <span class="text-[10px] text-muted-foreground">
          {layout.length} component{layout.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Main Content Area */}
      <div class="flex-1 flex overflow-hidden">
        {/* Grid Canvas (Left/Full) */}
        {showGrid && (
          <div class={`flex flex-col overflow-hidden ${viewMode === 'split' ? 'flex-1 border-r border-border' : 'flex-1'}`}>
            <GridCanvas
              layout={layout}
              selectedId={selectedId}
              onLayoutChange={onLayoutChange}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          </div>
        )}

        {/* Live Preview (Right/Full) */}
        {showPreview && (
          <div class={`flex flex-col overflow-hidden ${viewMode === 'split' ? 'w-[320px] flex-shrink-0' : 'flex-1'}`}>
            {/* Preview Header */}
            <div class="flex items-center gap-2 px-3 py-1.5 border-b border-border bg-muted/30">
              <ha-icon icon="mdi:eye" class="w-3.5 h-3.5 text-muted-foreground" />
              <span class="text-xs font-medium text-muted-foreground">Live Preview</span>
            </div>

            {/* Preview Content */}
            <div class="flex-1 overflow-auto p-3 bg-muted/20">
              {layout.length === 0 ? (
                <div class="h-full flex items-center justify-center text-muted-foreground">
                  <div class="text-center">
                    <ha-icon icon="mdi:view-dashboard-outline" class="w-10 h-10 mb-2 opacity-30" />
                    <p class="text-xs">No components</p>
                    <p class="text-[10px] mt-1 opacity-70">Add from palette</p>
                  </div>
                </div>
              ) : (
                <div class={viewMode === 'preview' ? 'max-w-2xl mx-auto' : ''}>
                  {hass && bindingEngine && actionHandler ? (
                    <LayoutRenderer
                      layout={layout}
                      hass={hass as HomeAssistant}
                      bindingEngine={bindingEngine}
                      actionHandler={actionHandler}
                    />
                  ) : (
                    <div class="p-4 text-center text-muted-foreground text-xs">
                      Connecting to Home Assistant...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SplitCanvas
