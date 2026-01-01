/**
 * Binding Engine for Home Assistant Entity Integration
 *
 * This module provides:
 * - Direct entity → component prop mapping
 * - Jinja2 template resolution via WebSocket
 * - Debounced template rendering to prevent flooding HA
 * - Action handling for service calls
 *
 * @see https://github.com/home-assistant/home-assistant-js-websocket
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Home Assistant entity state object
 */
export interface HassEntity {
  entity_id: string
  state: string
  attributes: Record<string, unknown>
  last_changed: string
  last_updated: string
  context: {
    id: string
    user_id: string | null
  }
}

/**
 * Home Assistant service target
 */
export interface HassServiceTarget {
  entity_id?: string | string[]
  device_id?: string | string[]
  area_id?: string | string[]
}

/**
 * Home Assistant object interface
 */
export interface HomeAssistant {
  states: Record<string, HassEntity>
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: HassServiceTarget
  ): Promise<void>
  callWS<T>(params: { type: string; [key: string]: unknown }): Promise<T>
  themes: {
    darkMode: boolean
    theme: string
    themes: Record<string, Record<string, string>>
  }
  selectedTheme: string | { theme: string }
  user: {
    id: string
    name: string
    is_admin: boolean
  }
  locale: {
    language: string
    number_format: string
    time_format: string
  }
}

/**
 * Complex binding configuration with Jinja template
 */
export interface BindingConfig {
  /** Entity ID for direct binding */
  entity?: string
  /** Jinja2 template string */
  template?: string
  /** Attribute to extract (optional) */
  attribute?: string
}

/**
 * Action configuration for component interactions
 */
export interface ActionConfig {
  action: 'toggle' | 'call-service' | 'navigate' | 'more-info' | 'fire-dom-event'
  /** For call-service action */
  service?: string
  service_data?: Record<string, unknown>
  target?: HassServiceTarget
  /** For navigate action */
  navigation_path?: string
  /** For more-info action */
  entity?: string
  /** For fire-dom-event action */
  event_type?: string
  event_data?: Record<string, unknown>
}

/**
 * Resolved binding result with common prop mappings
 */
export interface ResolvedBinding {
  /** Raw entity state */
  state: string | undefined
  /** Entity attributes */
  attributes: Record<string, unknown>
  /** Common prop: boolean checked state */
  checked: boolean
  /** Common prop: numeric value */
  value: number
  /** Common prop: entity is available */
  available: boolean
  /** Friendly name from attributes */
  friendlyName: string | undefined
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Simple debounce utility
 */
function debounce<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  delay: number
): (...args: TArgs) => Promise<TReturn> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let pendingResolve: ((value: TReturn) => void) | null = null

  return (...args: TArgs): Promise<TReturn> => {
    return new Promise((resolve) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      pendingResolve = resolve
      timeoutId = setTimeout(async () => {
        const result = await fn(...args)
        pendingResolve?.(result)
        timeoutId = null
        pendingResolve = null
      }, delay)
    })
  }
}

// ============================================================================
// Jinja Resolver Class
// ============================================================================

/**
 * Resolves Jinja2 templates using Home Assistant's WebSocket API
 * Includes caching and request deduplication
 */
export class JinjaResolver {
  private cache = new Map<string, { value: string; timestamp: number }>()
  private pendingRequests = new Map<string, Promise<string>>()
  private readonly CACHE_TTL = 5000 // 5 seconds

  constructor(private hass: HomeAssistant) {}

  /**
   * Resolve a Jinja2 template using HA's WebSocket API
   *
   * The `hass` object received in `set hass()` has the callWS method
   * which is a wrapper around connection.sendMessagePromise()
   *
   * @see https://github.com/home-assistant/home-assistant-js-websocket
   */
  async resolve(template: string): Promise<string> {
    // Check cache first
    const cached = this.cache.get(template)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.value
    }

    // Check if request already pending (deduplication)
    if (this.pendingRequests.has(template)) {
      return this.pendingRequests.get(template)!
    }

    // Make WebSocket call via hass object
    const promise = this.hass
      .callWS<{ result: string }>({
        type: 'render_template',
        template: template,
      })
      .then((response) => {
        this.cache.set(template, { value: response.result, timestamp: Date.now() })
        this.pendingRequests.delete(template)
        return response.result
      })
      .catch((error) => {
        console.error('Template render failed:', template, error)
        this.pendingRequests.delete(template)
        throw error
      })

    this.pendingRequests.set(template, promise)
    return promise
  }

  /**
   * Debounced version for rapid state changes
   * Prevents flooding HA with template render requests
   */
  resolveDebounced = debounce(this.resolve.bind(this), 300)

  /**
   * Clear cache when needed (e.g., on config change)
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Update the hass object reference
   */
  updateHass(hass: HomeAssistant): void {
    this.hass = hass
  }
}

// ============================================================================
// Action Handler Class
// ============================================================================

/**
 * Handles component actions (toggle, call-service, navigate, etc.)
 */
export class ActionHandler {
  constructor(
    private hass: HomeAssistant,
    private element: HTMLElement
  ) {}

  /**
   * Handle an action configuration
   */
  async handleAction(config: ActionConfig, entityId?: string): Promise<void> {
    switch (config.action) {
      case 'toggle':
        if (entityId) {
          await this.hass.callService('homeassistant', 'toggle', {
            entity_id: entityId,
          })
        }
        break

      case 'call-service':
        if (config.service) {
          const [domain, service] = config.service.split('.')
          await this.hass.callService(domain, service, config.service_data, config.target)
        }
        break

      case 'navigate':
        if (config.navigation_path) {
          // Use HA's navigation system
          history.pushState(null, '', config.navigation_path)
          window.dispatchEvent(new CustomEvent('location-changed'))
        }
        break

      case 'more-info':
        // Fire HA's more-info dialog event
        const moreInfoEvent = new CustomEvent('hass-more-info', {
          bubbles: true,
          composed: true,
          detail: { entityId: config.entity || entityId },
        })
        this.element.dispatchEvent(moreInfoEvent)
        break

      case 'fire-dom-event':
        const domEvent = new CustomEvent(config.event_type || 'custom-event', {
          bubbles: true,
          composed: true,
          detail: config.event_data,
        })
        this.element.dispatchEvent(domEvent)
        break
    }
  }

  /**
   * Update the hass object reference
   */
  updateHass(hass: HomeAssistant): void {
    this.hass = hass
  }
}

// ============================================================================
// Binding Engine Class
// ============================================================================

/**
 * Main binding engine for entity → component prop mapping
 */
export class BindingEngine {
  private jinjaResolver: JinjaResolver
  private actionHandler: ActionHandler

  constructor(
    private hass: HomeAssistant,
    element: HTMLElement
  ) {
    this.jinjaResolver = new JinjaResolver(hass)
    this.actionHandler = new ActionHandler(hass, element)
  }

  /**
   * Resolve a binding to component props
   *
   * @param binding - Entity ID string or complex binding config
   * @returns Resolved props for the component
   */
  resolveBinding(binding: string | BindingConfig): ResolvedBinding {
    if (typeof binding === 'string') {
      // Simple entity ID: 'light.living_room'
      return this.resolveEntityBinding(binding)
    }

    // Complex binding with entity or template
    if (binding.entity) {
      const resolved = this.resolveEntityBinding(binding.entity)

      // Extract specific attribute if requested
      if (binding.attribute && resolved.attributes) {
        return {
          ...resolved,
          state: String(resolved.attributes[binding.attribute] ?? ''),
          value: parseFloat(String(resolved.attributes[binding.attribute])) || 0,
        }
      }

      return resolved
    }

    // Return empty binding if no entity
    return {
      state: undefined,
      attributes: {},
      checked: false,
      value: 0,
      available: false,
      friendlyName: undefined,
    }
  }

  /**
   * Resolve a Jinja template binding (async)
   */
  async resolveTemplateBinding(template: string): Promise<string> {
    return this.jinjaResolver.resolve(template)
  }

  /**
   * Resolve a Jinja template with debounce (async)
   */
  async resolveTemplateDebouncedBinding(template: string): Promise<string> {
    return this.jinjaResolver.resolveDebounced(template)
  }

  /**
   * Handle an action
   */
  async handleAction(action: ActionConfig, entityId?: string): Promise<void> {
    return this.actionHandler.handleAction(action, entityId)
  }

  /**
   * Get the raw entity state object
   */
  getEntity(entityId: string): HassEntity | undefined {
    return this.hass.states[entityId]
  }

  /**
   * Check if an entity exists
   */
  hasEntity(entityId: string): boolean {
    return entityId in this.hass.states
  }

  /**
   * Update the hass object reference (call when hass changes)
   */
  updateHass(hass: HomeAssistant): void {
    this.hass = hass
    this.jinjaResolver.updateHass(hass)
    this.actionHandler.updateHass(hass)
  }

  /**
   * Clear the Jinja template cache
   */
  clearCache(): void {
    this.jinjaResolver.clearCache()
  }

  /**
   * Internal: Resolve entity ID to binding props
   */
  private resolveEntityBinding(entityId: string): ResolvedBinding {
    const entity = this.hass.states[entityId]

    if (!entity) {
      return {
        state: undefined,
        attributes: {},
        checked: false,
        value: 0,
        available: false,
        friendlyName: undefined,
      }
    }

    const state = entity.state
    const attributes = entity.attributes

    return {
      state,
      attributes,
      // Auto-map common props
      checked: state === 'on',
      value: parseFloat(state) || 0,
      available: state !== 'unavailable' && state !== 'unknown',
      friendlyName: attributes.friendly_name as string | undefined,
    }
  }
}

// ============================================================================
// React Hook (for future use)
// ============================================================================

/**
 * Custom hook for using bindings in React/Preact components
 * (Placeholder for future implementation)
 *
 * Usage:
 * ```tsx
 * function SwitchComponent({ bind, action }) {
 *   const binding = useBinding(bind)
 *
 *   return (
 *     <Switch
 *       checked={binding.checked}
 *       onCheckedChange={() => handleAction(action || 'toggle', bind)}
 *     />
 *   )
 * }
 * ```
 */
// export function useBinding(bind: string | BindingConfig): ResolvedBinding {
//   // Implementation will use Preact hooks and context
//   // to access the BindingEngine instance
// }
