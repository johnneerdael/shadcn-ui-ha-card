import { h, render } from 'preact'
import { renderTemplate, type HassLike } from './lib/template'
import { mapThemeVariables } from './lib/theme'
import { componentRegistry } from './components/index'
import { BindingEngine, ActionHandler, type HomeAssistant } from './lib/binding-engine'
import { LayoutRenderer } from './renderer/layout-renderer'
import type { LayoutItem, CardTheme } from './editor/types'
import { DEFAULT_CONFIG } from './constants'

// Support adoptedStyleSheets in all browsers
import 'construct-style-sheets-polyfill'

// Import CSS as inline string (Vite's ?inline query)
import generatedCss from './globals.css?inline'

declare const CARD_VERSION: string

export type TemplateVars = Record<string, unknown>

/**
 * Legacy template-based config (backward compatibility)
 */
export interface LegacyCardConfig {
  type: string
  title?: string
  content?: string
  variables?: TemplateVars
}

/**
 * New visual editor config
 */
export interface EditorCardConfig {
  type: string
  title?: string
  layout: LayoutItem[]
  variables?: TemplateVars
  theme?: CardTheme
}

/**
 * Union type for both config formats
 */
export type shadcnTemplateCardConfig = LegacyCardConfig | EditorCardConfig

export class shadcnTemplateCard extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['type', 'title', 'content']
  }

  // Provide default configuration for card picker
  static getStubConfig(): shadcnTemplateCardConfig {
    return DEFAULT_CONFIG as shadcnTemplateCardConfig
  }

  // Provide configuration element for visual editor
  static getConfigElement(): HTMLElement | null {
    // Return the visual editor element
    return document.createElement('shadcn-template-card-editor')
  }

  private _config?: shadcnTemplateCardConfig
  private _hass?: HassLike
  private _root?: ShadowRoot
  private _isConnected = false
  private _lastTheme?: string
  private _lastThemeVars?: Record<string, string>
  private _updatePending = false
  private _stylesInjected = false
  private _themeSheet?: CSSStyleSheet
  private _bindingEngine?: BindingEngine
  private _actionHandler?: ActionHandler

  constructor() {
    super()
    // Shadow DOM is now created lazily via ensureShadowRoot()
    // This fixes HA's custom element detection which has issues
    // when attachShadow() is called in the constructor
  }

  /**
   * Lazily create and return the shadow root
   * This pattern is required for Home Assistant compatibility
   */
  private ensureShadowRoot(): ShadowRoot {
    if (!this._root) {
      this._root = this.attachShadow({ mode: 'open' })
    }
    return this._root
  }

  connectedCallback(): void {
    this._isConnected = true
    // Ensure shadow root exists before injecting styles
    this.ensureShadowRoot()
    // Inject bundled CSS into shadow root
    this.injectStyles()
    // If config was set before connection, update again to ensure everything is ready
    if (this._config) {
      this.update()
    }
  }

  disconnectedCallback(): void {
    this._isConnected = false
  }

  setConfig(config: shadcnTemplateCardConfig): void {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid configuration for shadcn-template-card.')
    }

    // Validate configuration structure
    if (config.type !== 'custom:shadcn-template-card') {
      console.warn('shadcn-template-card: Unexpected type in config:', config.type)
    }

    this._config = { ...config }

    // DEBUG LOGGING
    console.log('[ShadcnCard] 📝 setConfig() called with:', config)
    console.log('[ShadcnCard] 📊 Current state:', {
      hasHass: !!this._hass,
      hasBindingEngine: !!this._bindingEngine,
      hasActionHandler: !!this._actionHandler,
      isConnected: this._isConnected,
    })

    // CRITICAL: Ensure shadow root exists before any rendering
    // Home Assistant calls setConfig() before connectedCallback() and needs
    // content in the shadow root immediately to stop showing loading spinner
    this.ensureShadowRoot()
    this.injectStyles()
    this.applyTheme()
    this.update()
  }

  set hass(hass: HassLike) {
    const previousHass = this._hass
    this._hass = hass

    // DEBUG LOGGING
    console.log('[ShadcnCard] 🏠 set hass() called')
    console.log('[ShadcnCard] Hass object:', hass ? 'Present' : 'NULL')

    // Initialize binding engine and action handler if not already initialized
    if (hass && !this._bindingEngine) {
      console.log('[ShadcnCard] 🔧 Initializing BindingEngine and ActionHandler...')
      this._bindingEngine = new BindingEngine(hass as HomeAssistant, this)
      this._actionHandler = new ActionHandler(hass as HomeAssistant, this)
      console.log('[ShadcnCard] ✅ Engines initialized')
    } else if (hass && this._bindingEngine) {
      // Update hass reference in existing engines
      this._bindingEngine.updateHass(hass as HomeAssistant)
      this._actionHandler?.updateHass(hass as HomeAssistant)
    }

    // Detect theme changes to avoid unnecessary re-renders
    const currentTheme = this.getSelectedTheme(hass)
    const themeChanged = currentTheme !== this._lastTheme

    if (themeChanged) {
      this._lastTheme = currentTheme
      this._lastThemeVars = undefined // Invalidate cached theme vars
    }

    // Only update if connected and (theme changed or first render or entities changed)
    if (this._isConnected && (themeChanged || !previousHass)) {
      this.scheduleUpdate()
    }
  }

  getCardSize(): number {
    // Calculate dynamic card size based on content
    if (!this._config) return 2

    // For visual editor config, calculate based on layout items
    if ('layout' in this._config && Array.isArray(this._config.layout)) {
      // Find the maximum y + h value to determine card height
      const maxHeight = this._config.layout.reduce((max, item) => {
        const itemHeight = (item.y || 0) + (item.h || 1)
        return Math.max(max, itemHeight)
      }, 0)

      // Each grid row is roughly 1 card unit
      return Math.max(2, Math.min(10, maxHeight))
    }

    // For legacy template config, calculate based on content lines
    if ('content' in this._config && this._config.content) {
      const lines = this._config.content.split('\n').length
      return Math.max(2, Math.min(10, Math.ceil(lines / 4) + 1))
    }

    return 2
  }

  /**
   * Grid sizing for Home Assistant's sections view (12-column grid)
   * Each cell is ~56px height + 8px gap
   * Required for HA 2024.11+ Sections View with drag-to-resize
   *
   * @see https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card
   */
  getGridOptions(): { rows: number; columns: number; min_rows?: number; min_columns?: number; max_rows?: number; max_columns?: number } {
    // Calculate based on content or use sensible defaults
    // Full-width by default (12 columns), 4 rows minimum
    return {
      rows: 4,        // Default: 4 rows (~232px height)
      columns: 12,    // Full width
      min_rows: 2,    // Minimum: 2 rows (~120px)
      min_columns: 6, // Half width minimum
    }
  }

  render(): void {
    this.update()
  }

  /**
   * Inject bundled Tailwind CSS into the shadow root
   * Uses adoptedStyleSheets API for efficient CSS sharing across shadow roots
   */
  private injectStyles(): void {
    if (this._stylesInjected) return

    const root = this.ensureShadowRoot()

    // Create and populate a CSSStyleSheet with the bundled CSS
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(generatedCss)

    // Apply to shadow root using adoptedStyleSheets API
    root.adoptedStyleSheets = [sheet]

    // Initialize component-specific styles from the registry
    componentRegistry.initAll(root)

    this._stylesInjected = true
  }

  /**
   * Apply custom theme CSS variables to shadow root
   * This follows shadcn philosophy: "adjusting the DNA of components"
   */
  private applyTheme(): void {
    // Only apply theme for editor configs
    if (!this._config || !('theme' in this._config) || !this._config.theme) {
      return
    }

    const root = this.ensureShadowRoot()
    const theme = this._config.theme
    const cssVars = this.buildCSSVariables(theme)

    // Create or update theme stylesheet
    if (!this._themeSheet) {
      this._themeSheet = new CSSStyleSheet()
      // Prepend theme sheet to existing stylesheets
      root.adoptedStyleSheets = [this._themeSheet, ...root.adoptedStyleSheets]
    }

    // Apply CSS variables to :host
    this._themeSheet.replaceSync(`:host { ${cssVars} }`)
  }

  /**
   * Build CSS variable declarations from theme config
   */
  private buildCSSVariables(theme: CardTheme): string {
    const vars: string[] = []

    // Color overrides
    if (theme.primary) vars.push(`--primary: ${theme.primary}`)
    if (theme.secondary) vars.push(`--secondary: ${theme.secondary}`)
    if (theme.background) vars.push(`--background: ${theme.background}`)
    if (theme.foreground) vars.push(`--foreground: ${theme.foreground}`)

    // Border radius override
    if (theme.radius) vars.push(`--radius: ${theme.radius}`)

    // Spacing defaults (components can still override)
    if (theme.spacing?.gap) vars.push(`--default-gap: ${theme.spacing.gap}`)
    if (theme.spacing?.padding) vars.push(`--default-padding: ${theme.spacing.padding}`)

    return vars.join('; ')
  }

  private scheduleUpdate(): void {
    // Debounce updates to prevent excessive re-renders
    if (this._updatePending) return

    this._updatePending = true
    requestAnimationFrame(() => {
      this._updatePending = false
      this.update()
    })
  }

  private update(): void {
    // Render even if not connected - Home Assistant needs content immediately after setConfig()
    if (!this._config) {
      return
    }

    const root = this.ensureShadowRoot()

    try {
      const title = this._config.title ?? 'shadcn-template-card'
      const themeVars = this.getThemeVariables()

      const styleVars = Object.entries(themeVars).reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = String(value)
        return acc
      }, {})

      // Check if this is a new editor config (has layout array)
      if ('layout' in this._config && Array.isArray(this._config.layout)) {
        // NEW VISUAL EDITOR FORMAT - Use LayoutRenderer
        if (!this._hass || !this._bindingEngine || !this._actionHandler) {
          // If hass not set yet, show loading state
          console.log('[ShadcnCard] ⏳ Showing loading state - missing:', {
            hass: !this._hass,
            bindingEngine: !this._bindingEngine,
            actionHandler: !this._actionHandler,
          })
          const node = h(
            'div',
            {
              class: 'shadcn-root flex flex-col gap-2 p-4 rounded-lg bg-card text-foreground shadow border border-border',
              style: styleVars,
            },
            h('div', { class: 'text-xs uppercase tracking-[0.14em] text-muted-foreground' }, title),
            h('div', { class: 'text-sm text-muted-foreground' }, 'Waiting for Home Assistant connection...')
          )
          render(node, root)
          return
        }

        console.log('[ShadcnCard] 🎨 Rendering layout with', this._config.layout.length, 'items')
        const node = h(
          'div',
          {
            class: 'shadcn-root',
            style: styleVars,
          },
          title && h('div', { class: 'text-xs uppercase tracking-[0.14em] text-muted-foreground p-4 pb-0' }, title),
          h(LayoutRenderer, {
            layout: this._config.layout,
            hass: this._hass as HomeAssistant,
            bindingEngine: this._bindingEngine,
            actionHandler: this._actionHandler,
          })
        )

        render(node, root)
      } else {
        // LEGACY TEMPLATE FORMAT - Use old rendering
        const raw = ('content' in this._config ? this._config.content : undefined) ?? 'Template content goes here.'
        const variables = this._config.variables ?? {}
        const renderedContent = renderTemplate(raw, this._hass, variables)

        // Use 'shadcn-root' class for PostCSS scoping
        const node = h(
          'div',
          {
            class: 'shadcn-root flex flex-col gap-2 p-4 rounded-lg bg-card text-foreground shadow border border-border',
            style: styleVars,
          },
          h('div', { class: 'text-xs uppercase tracking-[0.14em] text-muted-foreground' }, title),
          h(
            'pre',
            {
              class: 'text-xs font-mono whitespace-pre-wrap bg-muted text-foreground p-3 rounded border border-border',
            },
            renderedContent
          ),
          h(
            'div',
            { class: 'text-[10px] uppercase tracking-[0.08em] text-muted-foreground' },
            `Version: ${typeof CARD_VERSION === 'string' ? CARD_VERSION : 'dev'}`
          )
        )

        render(node, root)
      }
    } catch (error) {
      console.error('shadcn-template-card: Failed to render card:', error)
      // Render error state in shadow root
      root.innerHTML = `
        <div style="padding: 16px; color: #ef4444; border: 1px solid #ef4444; border-radius: 8px; background: rgba(239, 68, 68, 0.1);">
          <strong>Error rendering card:</strong>
          <pre style="margin-top: 8px; font-size: 12px; white-space: pre-wrap;">${error instanceof Error ? error.message : String(error)}</pre>
        </div>
      `
    }
  }

  private getSelectedTheme(hass: HassLike): string | undefined {
    const hassAny = hass as any
    if (!hassAny?.selectedTheme) return undefined

    return typeof hassAny.selectedTheme === 'string'
      ? hassAny.selectedTheme
      : hassAny.selectedTheme?.theme
  }

  private getThemeVariables(): Record<string, string> {
    // Return cached theme vars if available
    if (this._lastThemeVars) {
      return this._lastThemeVars
    }

    // Calculate new theme vars
    const themeVars = this.mapThemeVariables()
    this._lastThemeVars = themeVars
    return themeVars
  }

  private mapThemeVariables(): Record<string, string> {
    const hass = this._hass as any
    if (!hass?.themes) {
      // Return fallback values when themes aren't available
      return {
        '--stc-bg': '#0f172a',
        '--stc-card': '#0b1224',
        '--stc-fg': '#e5e7eb',
        '--stc-muted': 'rgba(255,255,255,0.04)',
        '--stc-muted-fg': '#cbd5e1',
        '--stc-border': '#1f2937',
        '--stc-accent': '#a855f7',
        '--stc-ring': '#a855f7',
        '--stc-success': '#22c55e',
        '--stc-warning': '#f59e0b',
        '--stc-danger': '#ef4444',
        '--background': '#0f172a',
        '--foreground': '#e5e7eb',
        '--card': '#0b1224',
        '--card-foreground': '#e5e7eb',
        '--popover': '#0b1224',
        '--popover-foreground': '#e5e7eb',
        '--primary': '#a855f7',
        '--primary-foreground': '#0b1224',
        '--secondary': 'rgba(255,255,255,0.06)',
        '--secondary-foreground': '#e5e7eb',
        '--muted': 'rgba(255,255,255,0.04)',
        '--muted-foreground': '#cbd5e1',
        '--accent': '#a855f7',
        '--accent-foreground': '#e5e7eb',
        '--destructive': '#ef4444',
        '--destructive-foreground': '#e5e7eb',
        '--border': '#1f2937',
        '--input': '#1f2937',
        '--ring': '#a855f7',
        '--radius': '0.75rem',
        '--success': '#22c55e',
        '--success-foreground': '#e5e7eb',
        '--warning': '#f59e0b',
        '--warning-foreground': '#e5e7eb',
        '--info': '#a855f7',
        '--info-foreground': '#e5e7eb',
        '--danger': '#ef4444',
        '--danger-foreground': '#e5e7eb',
      }
    }

    return mapThemeVariables(hass.themes, hass.selectedTheme)
  }
}
