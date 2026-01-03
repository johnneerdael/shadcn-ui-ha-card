/**
 * Grid Canvas
 *
 * The main editing area where components are arranged using react-grid-layout.
 * Supports drag-and-drop from palette, resizing, and component selection.
 */

// @ts-ignore - Preact JSX pragma
import { h } from 'preact'
import { useState, useCallback, useMemo, useRef, useEffect } from 'preact/hooks'
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
 * Action buttons visible on hover for better UX
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
        h-full rounded-md border-2 transition-all cursor-pointer group relative
        flex flex-col items-center justify-center gap-1
        ${isSelected
          ? 'border-primary bg-primary/10 shadow-md shadow-primary/20'
          : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
        }
      `}
      onClick={handleClick}
    >
      {/* Component icon and name */}
      <ha-icon icon={icon} class={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
      <span class={`text-xs font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>{displayName}</span>

      {/* Show bound entity if set */}
      {item.bind && (
        <span class="text-[10px] text-muted-foreground truncate max-w-full px-2">
          {item.bind}
        </span>
      )}

      {/* Action buttons - visible on hover OR when selected */}
      <div class={`absolute top-1 right-1 flex gap-0.5 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <button
          type="button"
          class="p-1 rounded bg-background/80 border border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
          onClick={handleDelete}
          title="Delete component"
        >
          <ha-icon icon="mdi:trash-can-outline" class="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Selection indicator badge */}
      {isSelected && (
        <div class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-primary rounded-full border-2 border-background" />
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
  const containerRef = useRef<HTMLDivElement>(null)

  // Measure container width for responsive grid (with proper cleanup)
  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    resizeObserver.observe(node)

    // Proper cleanup - disconnect observer when component unmounts
    return () => resizeObserver.disconnect()
  }, [])

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
      ref={containerRef}
      class="flex-1 bg-muted/20 overflow-auto p-3"
      onClick={handleCanvasClick}
    >
      {/* Grid area with visual guide */}
      <div
        class="min-h-[500px] bg-card rounded-lg border-2 border-dashed border-border/50 relative transition-colors hover:border-primary/30"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: `${(containerWidth - 24) / COLS}px ${ROW_HEIGHT}px`,
        }}
      >
        {layout.length === 0 ? (
          <div class="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <div class="text-center p-8 rounded-lg border-2 border-dashed border-primary/20 bg-primary/5">
              <ha-icon icon="mdi:plus-circle-outline" class="w-12 h-12 mb-3 text-primary/50" />
              <p class="text-sm font-medium text-foreground/80">Drop components here</p>
              <p class="text-xs mt-1 text-muted-foreground">Drag from palette or click to add</p>
            </div>
          </div>
        ) : (
          // Using h() directly with any-typed props to avoid Preact/React type conflicts
          h(ReactGridLayout as any, gridProps as any)
        )}
      </div>

      {/* Canvas info footer */}
      <div class="mt-2 flex justify-between text-[10px] text-muted-foreground px-1">
        <span>{layout.length} component{layout.length !== 1 ? 's' : ''}</span>
        <span>{COLS} cols • {ROW_HEIGHT}px rows</span>
      </div>
    </div>
  )
}

export default GridCanvas
