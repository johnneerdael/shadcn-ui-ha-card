/**
 * Grid Canvas
 *
 * The main editing area where components are arranged using react-grid-layout.
 * Supports drag-and-drop from palette, resizing, and component selection.
 */

// @ts-ignore - Preact JSX pragma
import { h } from 'preact'
import { useState, useCallback, useMemo } from 'preact/hooks'
// @ts-ignore - Type compatibility
import ReactGridLayout from 'react-grid-layout'
import type { GridCanvasProps, LayoutItem } from './types'
import { createLayoutItem } from './types'
import { componentRegistry } from '../lib/component-registry'

// Grid configuration
const COLS = 12
const ROW_HEIGHT = 40
const MARGIN: [number, number] = [8, 8]

/**
 * Component preview renderer
 * Shows a simplified preview of each component in the grid
 */
function ComponentPreview({
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
  const icon = compDef?.icon || 'mdi:shape'

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
      class={`
        h-full rounded-md border-2 transition-colors cursor-pointer
        flex flex-col items-center justify-center gap-1
        ${isSelected
          ? 'border-primary bg-primary/10'
          : 'border-border bg-card hover:border-primary/50'
        }
      `}
      onClick={handleClick}
    >
      {/* Component icon and name */}
      <ha-icon icon={icon} class="w-6 h-6 text-muted-foreground" />
      <span class="text-xs font-medium text-foreground">{displayName}</span>

      {/* Show bound entity if set */}
      {item.bind && (
        <span class="text-[10px] text-muted-foreground truncate max-w-full px-2">
          {item.bind}
        </span>
      )}

      {/* Delete button (visible when selected) */}
      {isSelected && (
        <button
          type="button"
          class="absolute top-1 right-1 p-1 rounded-sm bg-destructive/10 hover:bg-destructive/20 text-destructive"
          onClick={handleDelete}
          title="Delete component"
        >
          <ha-icon icon="mdi:close" class="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

/**
 * Main GridCanvas component
 */
export function GridCanvas({
  layout,
  selectedId,
  onLayoutChange,
  onSelect,
  onDelete,
}: GridCanvasProps) {
  const [containerWidth, setContainerWidth] = useState(800)

  // Convert LayoutItem[] to react-grid-layout format
  const gridLayout = useMemo(() => {
    return layout.map((item) => ({
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
  }, [layout])

  // Handle layout changes from drag/resize
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLayoutChange = useCallback(
    (newGridLayout: any[]) => {
      // Merge position changes back into our LayoutItem format
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
    },
    [layout, onLayoutChange]
  )

  // Handle drop from palette
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDrop = useCallback(
    (_newLayout: any, layoutItem: any, e: Event) => {
      const dragEvent = e as DragEvent
      const componentType = dragEvent.dataTransfer?.getData('componentType')

      if (!componentType) return

      // Create new layout item at drop position
      const newItem = createLayoutItem(componentType, layoutItem.x, layoutItem.y)

      // Add to layout
      onLayoutChange([...layout, newItem])

      // Select the new item
      onSelect(newItem.i)
    },
    [layout, onLayoutChange, onSelect]
  )

  // Handle click on empty canvas area (deselect)
  const handleCanvasClick = useCallback(() => {
    onSelect(null)
  }, [onSelect])

  // Measure container width for responsive grid
  const measureRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width)
        }
      })
      resizeObserver.observe(node)
      return () => resizeObserver.disconnect()
    }
  }, [])

  // Build grid children
  const gridChildren = layout.map((item) => (
    <div key={item.i} class="relative">
      <ComponentPreview
        item={item}
        isSelected={item.i === selectedId}
        onSelect={() => onSelect(item.i)}
        onDelete={() => onDelete(item.i)}
      />
    </div>
  ))

  // Build props object to avoid inline type issues
  const gridProps: Record<string, unknown> = {
    className: 'layout',
    layout: gridLayout,
    cols: COLS,
    rowHeight: ROW_HEIGHT,
    width: containerWidth - 32,
    margin: MARGIN,
    onLayoutChange: handleLayoutChange,
    onDrop: handleDrop,
    isDroppable: true,
    droppingItem: { i: '__dropping__', x: 0, y: 0, w: 4, h: 2 },
    useCSSTransforms: true,
    compactType: null,
    preventCollision: false,
    children: gridChildren,
  }

  return (
    <div
      ref={measureRef}
      class="flex-1 bg-muted/30 overflow-auto p-4"
      onClick={handleCanvasClick}
    >
      {/* Grid area with visual guide */}
      <div
        class="min-h-[400px] bg-card rounded-lg border border-dashed border-border relative"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: `${containerWidth / COLS}px ${ROW_HEIGHT}px`,
        }}
      >
        {layout.length === 0 ? (
          <div class="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <div class="text-center">
              <ha-icon icon="mdi:drag" class="w-12 h-12 mb-2 opacity-50" />
              <p class="text-sm">Drag components here</p>
              <p class="text-xs mt-1">or click a component in the palette</p>
            </div>
          </div>
        ) : (
          // Using h() directly with any-typed props to avoid Preact/React type conflicts
          h(ReactGridLayout as any, gridProps as any)
        )}
      </div>

      {/* Canvas info footer */}
      <div class="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{layout.length} component{layout.length !== 1 ? 's' : ''}</span>
        <span>{COLS} columns × {ROW_HEIGHT}px rows</span>
      </div>
    </div>
  )
}

export default GridCanvas
