import { h, render } from 'preact'
import { setupTwind } from './lib/twind'
import { renderTemplate, type HassLike } from './lib/template'
import { mapThemeVariables } from './lib/theme'
import { componentRegistry } from './components/index'

declare const CARD_VERSION: string

export type TemplateVars = Record<string, unknown>

export interface ShadcdnTemplateCardConfig {
  type: string
  title?: string
  content?: string
  variables?: TemplateVars
}

export class ShadcdnTemplateCard extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['type', 'title', 'content']
  }

  // Provide default configuration for card picker
  static getStubConfig(): ShadcdnTemplateCardConfig {
    return {
      type: 'custom:shadcdn-template-card',
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

  private _config?: ShadcdnTemplateCardConfig
  private _hass?: HassLike
  private _tw?: ReturnType<typeof setupTwind>['tw']
  private readonly _root: ShadowRoot
  private _isConnected = false
  private _lastTheme?: string
  private _lastThemeVars?: Record<string, string>
  private _updatePending = false

  constructor() {
    super()
    this._root = this.attachShadow({ mode: 'open' })
  }

  connectedCallback(): void {
    this._isConnected = true
    // Ensure Twind is initialized when element is connected
    this.ensureTwind()
    // If config was set before connection, update now
    if (this._config) {
      this.update()
    }
  }

  disconnectedCallback(): void {
    this._isConnected = false
    // Cleanup: Remove any event listeners or resources
    // The shadow root and its contents will be garbage collected
    // TODO: Add cleanup for any event listeners added in future
  }

  setConfig(config: ShadcdnTemplateCardConfig): void {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid configuration for shadcdn-template-card.')
    }

    // Validate configuration structure
    if (config.type !== 'custom:shadcdn-template-card') {
      console.warn('shadcdn-template-card: Unexpected type in config:', config.type)
    }

    this._config = { ...config }
    
    // Only initialize and update if element is connected
    if (this._isConnected) {
      this.ensureTwind()
      this.update()
    }
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

  render(): void {
    this.update()
  }

  private ensureTwind(): void {
    if (!this._tw) {
      const { tw } = setupTwind(this._root)
      this._tw = tw
      
      // Inject all component styles into shadow root
      componentRegistry.initAll(this._root)
    }
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
    if (!this._config || !this._tw || !this._isConnected) return

    const title = this._config.title ?? 'shadcdn-template-card'
    const raw = this._config.content ?? 'Template content goes here.'
    const variables = this._config.variables ?? {}
    const renderedContent = renderTemplate(raw, this._hass, variables)
    const themeVars = this.getThemeVariables()

    const styleVars = Object.entries(themeVars).reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = String(value)
      return acc
    }, {})

    const node = h(
      'div',
      {
        class: this._tw(
          'flex flex-col gap-2 p-4 rounded-lg bg-[var(--stc-card)] text-[var(--stc-fg)] shadow border border-[color:var(--stc-border)]'
        ),
        style: styleVars,
      },
      h('div', { class: this._tw('text-xs uppercase tracking-[0.14em] text-[var(--stc-muted-fg)]') }, title),
      h(
        'pre',
        {
          class: this._tw(
            'text-xs font-mono whitespace-pre-wrap bg-[var(--stc-muted)] text-[var(--stc-fg)] p-3 rounded border border-[color:var(--stc-border)]'
          ),
        },
        renderedContent
      ),
      h(
        'div',
        { class: this._tw('text-[10px] uppercase tracking-[0.08em] text-[color:var(--stc-muted-fg)]') },
        `Version: ${typeof CARD_VERSION === 'string' ? CARD_VERSION : 'dev'}`
      )
    )

    render(node, this._root)
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