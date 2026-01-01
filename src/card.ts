import { h, render } from 'preact'
import { renderTemplate, type HassLike } from './lib/template'
import { mapThemeVariables } from './lib/theme'
import { componentRegistry } from './components/index'

// Support adoptedStyleSheets in all browsers
import 'construct-style-sheets-polyfill'

// Import CSS as inline string (Vite's ?inline query)
import generatedCss from './globals.css?inline'

declare const CARD_VERSION: string

export type TemplateVars = Record<string, unknown>

export interface shadcnTemplateCardConfig {
  type: string
  title?: string
  content?: string
  variables?: TemplateVars
}

export class shadcnTemplateCard extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['type', 'title', 'content']
  }

  // Provide default configuration for card picker
  static getStubConfig(): shadcnTemplateCardConfig {
    return {
      type: 'custom:shadcn-template-card',
      title: 'New Card',
      content: 'Template content goes here.',
    }
  }

  // Provide configuration element for visual editor
  static getConfigElement(): HTMLElement | null {
    // TODO: Implement visual configuration editor
    // For now, return null to indicate YAML-only configuration
    return null
  }

  private _config?: shadcnTemplateCardConfig
  private _hass?: HassLike
  private readonly _root: ShadowRoot
  private _isConnected = false
  private _lastTheme?: string
  private _lastThemeVars?: Record<string, string>
  private _updatePending = false
  private _stylesInjected = false

  constructor() {
    super()
    this._root = this.attachShadow({ mode: 'open' })
  }

  connectedCallback(): void {
    this._isConnected = true
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

    // DEBUG LOGGING: Intentionally kept in production for troubleshooting
    console.log('shadcn-template-card: setConfig() called with:', config)

    // CRITICAL: Always initialize and render, even if not connected yet
    // Home Assistant calls setConfig() before connectedCallback() and needs
    // content in the shadow root immediately to stop showing loading spinner
    this.injectStyles()
    this.update()
  }

  set hass(hass: HassLike) {
    const previousHass = this._hass
    this._hass = hass

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
    // Each line of content ≈ 0.5 units, minimum 2, maximum 10
    if (!this._config?.content) return 2

    const lines = this._config.content.split('\n').length
    const calculatedSize = Math.max(2, Math.min(10, Math.ceil(lines / 4) + 1))

    return calculatedSize
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

    // Create and populate a CSSStyleSheet with the bundled CSS
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(generatedCss)

    // Apply to shadow root using adoptedStyleSheets API
    this._root.adoptedStyleSheets = [sheet]

    // Initialize component-specific styles from the registry
    componentRegistry.initAll(this._root)

    this._stylesInjected = true
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

    try {
      const title = this._config.title ?? 'shadcn-template-card'
      const raw = this._config.content ?? 'Template content goes here.'
      const variables = this._config.variables ?? {}
      const renderedContent = renderTemplate(raw, this._hass, variables)
      const themeVars = this.getThemeVariables()

      const styleVars = Object.entries(themeVars).reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = String(value)
        return acc
      }, {})

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

      render(node, this._root)
    } catch (error) {
      console.error('shadcn-template-card: Failed to render card:', error)
      // Render error state in shadow root
      this._root.innerHTML = `
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
