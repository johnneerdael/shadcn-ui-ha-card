/**
 * Component Registry System
 * 
 * Manages component registration, style injection, and initialization
 * for the shadcn component library within shadow DOM.
 */

export interface ComponentDefinition {
  /** Component name (e.g., 'separator', 'skeleton') */
  name: string
  /** CSS styles for the component */
  styles: string
  /** Optional initialization function for interactive components */
  init?: (shadowRoot: ShadowRoot) => void
  /** Optional cleanup function */
  cleanup?: (shadowRoot: ShadowRoot) => void
}

export class ComponentRegistry {
  private components = new Map<string, ComponentDefinition>()
  private injectedStyles = new WeakMap<ShadowRoot, Set<string>>()

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
    components.forEach(component => this.register(component))
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
    componentNames.forEach(name => this.injectStyles(shadowRoot, name))
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
}

// Global component registry instance
export const componentRegistry = new ComponentRegistry()