/**
 * Enhanced Component Registry System
 *
 * Manages component registration, style injection, and initialization
 * for the shadcn component library within shadow DOM.
 *
 * This enhanced version supports:
 * - Visual editor integration via prop definitions
 * - Entity binding configuration
 * - Action definitions for HA service calls
 * - Component categorization
 */

import type { ComponentType } from 'preact'

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Prop types supported by the visual editor
 */
export type PropType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'select'
  | 'entity'
  | 'service'
  | 'icon'
  | 'color'
  | 'boolean-or-binding'

/**
 * Definition for a component prop that can be configured in the visual editor
 */
export interface PropDefinition {
  /** Prop name (e.g., 'variant', 'size') */
  name: string
  /** Type of the prop for form generation */
  type: PropType
  /** Default value */
  default?: unknown
  /** Options for 'select' type */
  options?: string[]
  /** Human-readable description */
  description?: string
  /** Whether this prop is required */
  required?: boolean
}

/**
 * Action types supported by components
 */
export type ActionType = 'toggle' | 'call-service' | 'navigate' | 'more-info' | 'fire-dom-event'

/**
 * Action definition for component interactions
 */
export interface ActionDefinition {
  type: ActionType
  /** Pre-filled service for call-service action */
  service?: string
  /** Use the bound entity as the service target */
  target_entity_from_bind?: boolean
}

/**
 * Entity binding configuration for automatic state mapping
 */
export interface BindingConfig {
  /**
   * Function to map entity state/attributes to component props
   * @param state - The entity state string
   * @param attributes - The entity attributes object
   * @returns Props to pass to the component
   */
  stateMapping: (state: string, attributes: Record<string, unknown>) => Record<string, unknown>
  /** Supported entity domains (e.g., ['light', 'switch']) */
  supportedDomains?: string[]
}

/**
 * Component categories for the visual editor palette
 */
export type ComponentCategory = 'layout' | 'input' | 'feedback' | 'data'

/**
 * Legacy component definition (backward compatible)
 */
export interface LegacyComponentDefinition {
  /** Component name (e.g., 'separator', 'skeleton') */
  name: string
  /** CSS styles for the component */
  styles: string
  /** Optional initialization function for interactive components */
  init?: (shadowRoot: ShadowRoot) => void
  /** Optional cleanup function */
  cleanup?: (shadowRoot: ShadowRoot) => void
}

/**
 * Enhanced component definition with visual editor support
 */
export interface ComponentDefinition extends LegacyComponentDefinition {
  /** Display name for the visual editor */
  displayName?: string
  /** Human-readable description */
  description?: string
  /** Category for the visual editor palette */
  category?: ComponentCategory
  /** MDI icon name (e.g., 'mdi:toggle-switch') */
  icon?: string
  /** React/Preact component (for future JSX rendering) */
  component?: ComponentType<Record<string, unknown>>
  /** Props exposed in the visual editor */
  props?: PropDefinition[]
  /** Default action when the component is interacted with */
  defaultAction?: ActionDefinition
  /** Entity binding configuration */
  binding?: BindingConfig
}

// ============================================================================
// UI Component Definitions (for Visual Editor)
// ============================================================================

/**
 * Pre-defined UI component definitions for the visual editor
 * These are the "UiCard", "UiButton", "UiSwitch" etc. components
 */
export const UI_COMPONENTS: Record<string, ComponentDefinition> = {
  UiCard: {
    name: 'UiCard',
    displayName: 'Card',
    description: 'Container with header, content, and footer sections',
    category: 'layout',
    icon: 'mdi:card-outline',
    styles: '', // Uses Tailwind classes
    props: [
      { name: 'title', type: 'string', default: '', description: 'Card title' },
      { name: 'description', type: 'string', default: '', description: 'Card description' },
      { name: 'footer', type: 'string', default: '', description: 'Footer content' },
    ],
  },

  UiButton: {
    name: 'UiButton',
    displayName: 'Button',
    description: 'Clickable button with multiple variants',
    category: 'input',
    icon: 'mdi:button-cursor',
    styles: '', // Uses Tailwind classes
    props: [
      { name: 'label', type: 'string', default: 'Button', description: 'Button text' },
      {
        name: 'variant',
        type: 'select',
        options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        default: 'default',
        description: 'Button style variant',
      },
      {
        name: 'size',
        type: 'select',
        options: ['default', 'sm', 'lg', 'icon'],
        default: 'default',
        description: 'Button size',
      },
      { name: 'icon', type: 'icon', description: 'Optional icon' },
      { name: 'disabled', type: 'boolean', default: false, description: 'Disable the button' },
    ],
    defaultAction: { type: 'call-service' },
  },

  UiSwitch: {
    name: 'UiSwitch',
    displayName: 'Switch',
    description: 'Toggle switch for on/off states',
    category: 'input',
    icon: 'mdi:toggle-switch',
    styles: '', // Styles are in switch.ts
    props: [
      { name: 'checked', type: 'boolean-or-binding', default: false, description: 'Switch state' },
      { name: 'disabled', type: 'boolean', default: false, description: 'Disable the switch' },
      { name: 'label', type: 'string', default: '', description: 'Switch label' },
    ],
    defaultAction: { type: 'toggle', target_entity_from_bind: true },
    binding: {
      stateMapping: (state, attrs) => ({
        checked: state === 'on',
        disabled: attrs.assumed_state === true,
      }),
      supportedDomains: ['light', 'switch', 'input_boolean', 'fan', 'automation'],
    },
  },

  UiSlider: {
    name: 'UiSlider',
    displayName: 'Slider',
    description: 'Range slider for numeric values',
    category: 'input',
    icon: 'mdi:tune-vertical',
    styles: '', // Styles are in slider.ts
    props: [
      { name: 'value', type: 'number', default: 50, description: 'Current value' },
      { name: 'min', type: 'number', default: 0, description: 'Minimum value' },
      { name: 'max', type: 'number', default: 100, description: 'Maximum value' },
      { name: 'step', type: 'number', default: 1, description: 'Step increment' },
      { name: 'disabled', type: 'boolean', default: false, description: 'Disable the slider' },
    ],
    defaultAction: { type: 'call-service', service: 'number.set_value' },
    binding: {
      stateMapping: (state, attrs) => ({
        value: parseFloat(state) || 0,
        min: (attrs.min as number) ?? 0,
        max: (attrs.max as number) ?? 100,
        step: (attrs.step as number) ?? 1,
      }),
      supportedDomains: ['number', 'input_number', 'light'],
    },
  },

  UiProgress: {
    name: 'UiProgress',
    displayName: 'Progress',
    description: 'Progress bar for displaying completion',
    category: 'feedback',
    icon: 'mdi:progress-helper',
    styles: '', // Styles are in progress.ts
    props: [
      { name: 'value', type: 'number', default: 0, description: 'Progress value (0-100)' },
      { name: 'max', type: 'number', default: 100, description: 'Maximum value' },
    ],
    binding: {
      stateMapping: (state) => ({
        value: parseFloat(state) || 0,
      }),
      supportedDomains: ['sensor', 'number', 'input_number'],
    },
  },

  UiLabel: {
    name: 'UiLabel',
    displayName: 'Label',
    description: 'Text label for displaying entity states',
    category: 'data',
    icon: 'mdi:label-outline',
    styles: '', // Styles are in label.ts
    props: [
      { name: 'text', type: 'string', default: '', description: 'Label text' },
      {
        name: 'size',
        type: 'select',
        options: ['xs', 'sm', 'default', 'lg', 'xl'],
        default: 'default',
      },
    ],
    binding: {
      stateMapping: (state, attrs) => ({
        text: attrs.friendly_name ? `${attrs.friendly_name}: ${state}` : state,
      }),
      supportedDomains: undefined, // All domains
    },
  },
}

// ============================================================================
// Component Registry Class
// ============================================================================

export class ComponentRegistry {
  private components = new Map<string, ComponentDefinition>()
  private injectedStyles = new WeakMap<ShadowRoot, Set<string>>()

  constructor() {
    // Pre-register UI components for visual editor
    Object.values(UI_COMPONENTS).forEach((comp) => {
      this.components.set(comp.name, comp)
    })
  }

  /**
   * Register a component with the registry
   */
  register(component: ComponentDefinition): void {
    this.components.set(component.name, component)
  }

  /**
   * Register multiple components at once
   */
  registerAll(components: ComponentDefinition[]): void {
    components.forEach((component) => this.register(component))
  }

  /**
   * Get a registered component
   */
  get(name: string): ComponentDefinition | undefined {
    return this.components.get(name)
  }

  /**
   * Check if a component is registered
   */
  has(name: string): boolean {
    return this.components.has(name)
  }

  /**
   * Inject component styles into a shadow root
   * Tracks injected styles to prevent duplicates
   */
  injectStyles(shadowRoot: ShadowRoot, componentName: string): void {
    const component = this.components.get(componentName)
    if (!component) {
      console.warn(`Component '${componentName}' not found in registry`)
      return
    }

    // Skip if no styles to inject
    if (!component.styles) return

    // Track which styles have been injected into this shadow root
    if (!this.injectedStyles.has(shadowRoot)) {
      this.injectedStyles.set(shadowRoot, new Set())
    }

    const injected = this.injectedStyles.get(shadowRoot)!
    if (injected.has(componentName)) {
      return // Already injected
    }

    // Create and append style element
    const styleEl = document.createElement('style')
    styleEl.textContent = component.styles
    styleEl.setAttribute('data-component', componentName)
    shadowRoot.appendChild(styleEl)

    injected.add(componentName)
  }

  /**
   * Inject styles for multiple components
   */
  injectAllStyles(shadowRoot: ShadowRoot, componentNames: string[]): void {
    componentNames.forEach((name) => this.injectStyles(shadowRoot, name))
  }

  /**
   * Initialize a component in a shadow root
   */
  init(shadowRoot: ShadowRoot, componentName: string): void {
    const component = this.components.get(componentName)
    if (!component) {
      console.warn(`Component '${componentName}' not found in registry`)
      return
    }

    // Inject styles first
    this.injectStyles(shadowRoot, componentName)

    // Call init function if provided
    if (component.init) {
      component.init(shadowRoot)
    }
  }

  /**
   * Initialize all registered components
   */
  initAll(shadowRoot: ShadowRoot): void {
    this.components.forEach((_, name) => {
      this.init(shadowRoot, name)
    })
  }

  /**
   * Cleanup component resources
   */
  cleanup(shadowRoot: ShadowRoot, componentName: string): void {
    const component = this.components.get(componentName)
    if (component?.cleanup) {
      component.cleanup(shadowRoot)
    }
  }

  /**
   * Get all registered component names
   */
  getComponentNames(): string[] {
    return Array.from(this.components.keys())
  }

  /**
   * Get count of registered components
   */
  size(): number {
    return this.components.size
  }

  /**
   * Get components by category (for visual editor palette)
   */
  getByCategory(category: ComponentCategory): ComponentDefinition[] {
    return Array.from(this.components.values()).filter((c) => c.category === category)
  }

  /**
   * Get all UI components (those with visual editor support)
   */
  getUIComponents(): ComponentDefinition[] {
    return Array.from(this.components.values()).filter(
      (c) => c.category !== undefined && c.props !== undefined
    )
  }

  /**
   * Get components that support a specific entity domain
   */
  getComponentsForDomain(domain: string): ComponentDefinition[] {
    return Array.from(this.components.values()).filter((c) => {
      if (!c.binding) return false
      if (!c.binding.supportedDomains) return true // Supports all domains
      return c.binding.supportedDomains.includes(domain)
    })
  }
}

// Global component registry instance
export const componentRegistry = new ComponentRegistry()
