/**
 * Card Editor
 *
 * Main visual editor component that combines the palette, canvas, and properties panel.
 * Also provides the HTMLElement wrapper for Home Assistant integration.
 */

import { h, render } from 'preact'
import { useState, useCallback, useMemo } from 'preact/hooks'
import { ComponentPalette } from './component-palette'
import { SplitCanvas } from './split-canvas'
import { PropertiesPanel } from './properties-panel'
import type { CardEditorProps, EditorConfig, LayoutItem } from './types'
import { createLayoutItem } from './types'

// Import CSS for adoptedStyleSheets
import 'construct-style-sheets-polyfill'
import generatedCss from '../globals.css?inline'

// react-grid-layout requires its CSS
const gridLayoutCss = `
.react-grid-layout {
  position: relative;
  transition: height 200ms ease;
}
.react-grid-item {
  transition: all 200ms ease;
  transition-property: left, top;
}
.react-grid-item.cssTransforms {
  transition-property: transform;
}
.react-grid-item.resizing {
  z-index: 1;
  will-change: width, height;
}
.react-grid-item.react-draggable-dragging {
  transition: none;
  z-index: 3;
  will-change: transform;
}
.react-grid-item.dropping {
  visibility: hidden;
}
.react-grid-item.react-grid-placeholder {
  background: var(--primary);
  opacity: 0.2;
  transition-duration: 100ms;
  z-index: 2;
  border-radius: 0.5rem;
}
.react-grid-item > .react-resizable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
}
.react-grid-item > .react-resizable-handle::after {
  content: "";
  position: absolute;
  right: 3px;
  bottom: 3px;
  width: 8px;
  height: 8px;
  border-right: 2px solid rgba(0, 0, 0, 0.3);
  border-bottom: 2px solid rgba(0, 0, 0, 0.3);
}
.react-grid-item > .react-resizable-handle.react-resizable-handle-se {
  bottom: 0;
  right: 0;
  cursor: se-resize;
}
`

/**
 * Main CardEditor Preact component
 */
function CardEditor({ hass, config, onChange }: CardEditorProps) {
  // Editor state
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Get current layout from config (default to empty array)
  const layout = useMemo(() => config.layout || [], [config.layout])

  // Find selected item
  const selectedItem = useMemo(
    () => layout.find((item) => item.i === selectedId) || null,
    [layout, selectedId]
  )

  // Handle adding a new component from palette
  const handleAddComponent = useCallback(
    (componentType: string) => {
      // Find the lowest y position to add below existing items
      const maxY = layout.reduce((max, item) => Math.max(max, item.y + item.h), 0)

      const newItem = createLayoutItem(componentType, 0, maxY)
      const newLayout = [...layout, newItem]

      onChange({
        ...config,
        layout: newLayout,
      })

      // Select the new item
      setSelectedId(newItem.i)
    },
    [config, layout, onChange]
  )

  // Handle layout changes from canvas (drag/resize)
  const handleLayoutChange = useCallback(
    (newLayout: LayoutItem[]) => {
      onChange({
        ...config,
        layout: newLayout,
      })
    },
    [config, onChange]
  )

  // Handle component selection
  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id)
  }, [])

  // Handle component deletion
  const handleDelete = useCallback(
    (id: string) => {
      const newLayout = layout.filter((item) => item.i !== id)
      onChange({
        ...config,
        layout: newLayout,
      })

      // Deselect if deleted item was selected
      if (selectedId === id) {
        setSelectedId(null)
      }
    },
    [config, layout, onChange, selectedId]
  )

  // Handle property changes from properties panel
  const handlePropertyChange = useCallback(
    (itemId: string, updates: Partial<LayoutItem>) => {
      const newLayout = layout.map((item) =>
        item.i === itemId ? { ...item, ...updates } : item
      )
      onChange({
        ...config,
        layout: newLayout,
      })
    },
    [config, layout, onChange]
  )

  return (
    <div class="shadcn-root h-[500px] flex flex-col bg-background text-foreground rounded-lg overflow-hidden border border-border">
      {/* Toolbar */}
      <div class="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div class="flex items-center gap-2">
          <ha-icon icon="mdi:view-dashboard-edit" class="w-5 h-5 text-primary" />
          <span class="font-semibold text-sm">Visual Editor</span>
        </div>
        <div class="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{layout.length} component{layout.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Main editor area */}
      <div class="flex-1 flex overflow-hidden">
        {/* Left: Component Palette */}
        <div class="w-48 flex-shrink-0">
          <ComponentPalette onAddComponent={handleAddComponent} />
        </div>

        {/* Center: Split Canvas (Preview + Grid) */}
        <SplitCanvas
          layout={layout}
          selectedId={selectedId}
          hass={hass}
          onLayoutChange={handleLayoutChange}
          onSelect={handleSelect}
          onDelete={handleDelete}
        />

        {/* Right: Properties Panel */}
        <PropertiesPanel
          hass={hass}
          config={config}
          selectedItem={selectedItem}
          layout={layout}
          onPropertyChange={handlePropertyChange}
          onConfigChange={onChange}
          onSelect={handleSelect}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}

/**
 * HTMLElement wrapper for Home Assistant
 *
 * This class wraps the Preact CardEditor component as a custom element
 * that Home Assistant can instantiate via getConfigElement().
 */
export class ShadcnCardEditorElement extends HTMLElement {
  private _config: EditorConfig = { type: 'custom:shadcn-template-card', layout: [] }
  private _hass: unknown
  private _root?: ShadowRoot
  private _stylesInjected = false

  constructor() {
    super()
    // Shadow DOM is created lazily via ensureShadowRoot()
    // This fixes HA's custom element detection
  }

  /**
   * Lazily create and return the shadow root
   */
  private ensureShadowRoot(): ShadowRoot {
    if (!this._root) {
      this._root = this.attachShadow({ mode: 'open' })
    }
    return this._root
  }

  connectedCallback(): void {
    this.ensureShadowRoot()
    this.injectStyles()
    this.render()
  }

  /**
   * Inject CSS using adoptedStyleSheets
   */
  private injectStyles(): void {
    if (this._stylesInjected) return

    const root = this.ensureShadowRoot()

    // Create stylesheet with Tailwind CSS
    const tailwindSheet = new CSSStyleSheet()
    tailwindSheet.replaceSync(generatedCss)

    // Create stylesheet with react-grid-layout CSS
    const gridSheet = new CSSStyleSheet()
    gridSheet.replaceSync(gridLayoutCss)

    root.adoptedStyleSheets = [tailwindSheet, gridSheet]
    this._stylesInjected = true
  }

  /**
   * Called by Home Assistant to set the current config
   */
  setConfig(config: EditorConfig): void {
    this._config = config
    this.ensureShadowRoot()
    this.injectStyles()
    this.render()
  }

  /**
   * Called by Home Assistant when hass object updates
   */
  set hass(hass: unknown) {
    this._hass = hass
    this.render()
  }

  /**
   * Handle config changes from the editor
   * Dispatches 'config-changed' event for Home Assistant
   */
  private handleConfigChange = (newConfig: EditorConfig): void => {
    this._config = newConfig

    // Dispatch event for Home Assistant
    const event = new CustomEvent('config-changed', {
      bubbles: true,
      composed: true,
      detail: { config: newConfig },
    })
    this.dispatchEvent(event)

    // Re-render with new config
    this.render()
  }

  /**
   * Render the Preact component
   */
  private render(): void {
    const root = this.ensureShadowRoot()
    render(
      h(CardEditor, {
        hass: this._hass,
        config: this._config,
        onChange: this.handleConfigChange,
      }),
      root
    )
  }
}

export default CardEditor
