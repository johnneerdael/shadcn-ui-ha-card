/**
 * Card Editor
 *
 * Main visual editor with vertical layout:
 * 1. Card Theme Settings (top)
 * 2. Horizontal Component Picker (full-width, 1 row per category)
 * 3. Component Styling Panel (appears when component selected)
 * 4. Full-width Canvas with live preview (bottom - fills remaining space)
 */

import { h, render } from 'preact'
import { useState, useCallback, useMemo } from 'preact/hooks'
import { CardSettings } from './card-settings'
import { ComponentLibrary } from './component-library'
import { ComponentStyling } from './component-styling'
import { FullWidthCanvas } from './full-width-canvas'
import { Tooltip } from '../components/ui/tooltip'
import type { CardEditorProps, EditorConfig, LayoutItem, CardTheme } from './types'
import { createLayoutItem } from './types'

// Export utils for FullWidthCanvas drops
if (typeof window !== 'undefined') {
  (window as any).ShadcnTemplateCardUtils = { createLayoutItem }
}

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
  opacity: 0.9;
}
.react-grid-item.dropping {
  visibility: hidden;
}
.react-grid-item.react-grid-placeholder {
  background: var(--primary);
  opacity: 0.4;
  transition-duration: 100ms;
  z-index: 2;
  border-radius: 0.5rem;
  border: 2px dashed var(--primary);
  animation: placeholder-pulse 1s ease-in-out infinite;
}
@keyframes placeholder-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.5; }
}
.react-grid-item > .react-resizable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  opacity: 0;
  transition: opacity 150ms;
}
.react-grid-item:hover > .react-resizable-handle {
  opacity: 1;
}
.react-grid-item > .react-resizable-handle::after {
  content: "";
  position: absolute;
  right: 4px;
  bottom: 4px;
  width: 8px;
  height: 8px;
  border-right: 2px solid var(--primary);
  border-bottom: 2px solid var(--primary);
  border-radius: 1px;
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

  // Handle theme changes
  const handleThemeChange = useCallback(
    (theme: CardTheme) => {
      onChange({
        ...config,
        theme,
      })
    },
    [config, onChange]
  )

  // Handle adding a new component from picker
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

      // Select the new item to show its styling options
      setSelectedId(newItem.i)
    },
    [config, layout, onChange]
  )

  // Handle layout changes from canvas (drag/resize)
  const handleLayoutChange = useCallback(
    (newLayout: LayoutItem[]) => {
      // Direct update to config
      const updatedConfig = {
        ...config,
        layout: newLayout,
      }
      onChange(updatedConfig)
    },
    [config, onChange]
  )

  // Handle opening advanced settings (Card Configuration)
  const handleOpenConfig = useCallback(() => {
    // For now, toggle a special "card" selected state or we can add a flag to EditorConfig
    // But as per plan, we just need to ensure the button does something.
    // Let's implement a toggle for a "global settings" panel
    if (selectedId === '__global__') {
      setSelectedId(null)
    } else {
      setSelectedId('__global__')
    }
  }, [selectedId])

  // Handle adding a section (UiCard container)
  const handleAddSection = useCallback(() => {
    handleAddComponent('UiCard')
  }, [handleAddComponent])

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

  // Handle property changes from styling panel
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
    <div class="shadcn-root h-[700px] flex flex-col bg-background text-foreground rounded-lg overflow-hidden border border-border">
      {/* Toolbar - multi-line */}
      <div class="flex-shrink-0 border-b border-border bg-card">
        {/* Row 1: Title and App Actions */}
        <div class="flex items-center justify-between px-4 py-2.5 border-b border-border/50">
          <div class="flex items-center gap-3">
            <ha-icon icon="mdi:view-dashboard-edit" class="w-5 h-5 text-primary shrink-0" />
            <span class="font-bold text-sm tracking-tight text-foreground">UI Builder</span>
          </div>
          <div class="flex items-center gap-2">
            <Tooltip content="Undo (Ctrl+Z)">
              <button class="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors shrink-0">
                <ha-icon icon="mdi:undo" class="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip content="Redo (Ctrl+Y)">
              <button class="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors shrink-0">
                <ha-icon icon="mdi:redo" class="w-4 h-4" />
              </button>
            </Tooltip>
            <div class="w-px h-5 bg-border mx-1 shrink-0" />
            <Tooltip content="Card Configuration">
              <button
                onClick={handleOpenConfig}
                class={`p-1.5 rounded transition-colors shrink-0 ${
                  selectedId === '__global__' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <ha-icon icon="mdi:cog" class="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Row 2: Page Actions */}
        <div class="flex items-center justify-between px-4 py-2 bg-muted/10">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <Tooltip content="Add Section">
                <button
                  onClick={handleAddSection}
                  class="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-xs font-medium shrink-0"
                >
                  <ha-icon icon="mdi:view-grid-plus" class="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>
              </Tooltip>
            </div>
            <div class="h-5 w-px bg-border shrink-0" />
            <div class="flex items-center gap-2">
              <Tooltip content="Clean Layout">
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear the entire layout?')) {
                      handleLayoutChange([])
                    }
                  }}
                  class="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors text-xs font-medium shrink-0"
                >
                  <ha-icon icon="mdi:layers-remove" class="w-3.5 h-3.5" />
                  <span>Clean Layout</span>
                </button>
              </Tooltip>
            </div>
          </div>
          <div class="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60">
            <div class="flex items-center gap-1.5">
              <ha-icon icon="mdi:layers-outline" class="w-3 h-3" />
              <span>{layout.length} Layer{layout.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Card Theme Settings - fixed height, doesn't shrink */}
      <div class="flex-shrink-0">
        <CardSettings
          theme={config.theme}
          onChange={handleThemeChange}
        />
      </div>

      {/* 2. Component Library - inline, multi-line, categorized */}
      <div class="flex-shrink-0">
        <ComponentLibrary
          onAddComponent={handleAddComponent}
        />
      </div>

      {/* 3. Component Styling Panel (when component selected) - limited height with scroll */}
      {selectedItem && (
        <div class="flex-shrink-0 max-h-[180px] overflow-y-auto border-b border-border">
          <ComponentStyling
            hass={hass}
            selectedItem={selectedItem}
            globalTheme={config.theme}
            onPropertyChange={handlePropertyChange}
            onDeselect={() => setSelectedId(null)}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* 4. Full-width Canvas - fills ALL remaining space, guaranteed min height */}
      <div class="flex-1 min-h-[250px] overflow-hidden">
        <FullWidthCanvas
          layout={layout}
          selectedId={selectedId}
          hass={hass}
          onLayoutChange={handleLayoutChange}
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
  private _hass: unknown = null
  private _root?: ShadowRoot
  private _stylesInjected = false
  private _isRendering = false // Guard against render loops
  private _renderPending = false // Debounce rapid updates

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
   * Cleanup when element is removed from DOM
   */
  disconnectedCallback(): void {
    // Cancel any pending renders
    this._renderPending = false
    this._isRendering = false

    // Unmount Preact component from shadow root
    if (this._root) {
      render(null, this._root)
    }

    // Clear references to allow garbage collection
    this._hass = null
    this._config = { type: 'custom:shadcn-template-card', layout: [] }
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
    this.scheduleRender()
  }

  /**
   * Handle config changes from the editor
   * Dispatches 'config-changed' event for Home Assistant
   */
  private handleConfigChange = (newConfig: EditorConfig): void => {
    // Prevent triggering during render cycle (HA elements can fire events during mount)
    if (this._isRendering) {
      return
    }

    this._config = newConfig

    // Dispatch event for Home Assistant
    const event = new CustomEvent('config-changed', {
      bubbles: true,
      composed: true,
      detail: { config: newConfig },
    })
    this.dispatchEvent(event)

    // Schedule re-render (debounced)
    this.scheduleRender()
  }

  /**
   * Schedule a render on the next animation frame
   * This debounces rapid updates and prevents render loops
   */
  private scheduleRender(): void {
    if (this._renderPending) return

    this._renderPending = true
    requestAnimationFrame(() => {
      this._renderPending = false
      this.render()
    })
  }

  /**
   * Render the Preact component
   */
  private render(): void {
    // Prevent recursive renders
    if (this._isRendering) return
    this._isRendering = true

    try {
      const root = this.ensureShadowRoot()
      render(
        h(CardEditor, {
          hass: this._hass,
          config: this._config,
          onChange: this.handleConfigChange,
        }),
        root
      )
    } finally {
      this._isRendering = false
    }
  }
}

export default CardEditor
