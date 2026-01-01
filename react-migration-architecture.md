# React-Based Architecture Migration Plan

## Executive Summary

**Current State**: Preact-based card with Twind runtime CSS, Radix UI components, and template rendering
**Target State**: Pure React-based card with bundled Tailwind CSS, component registry, visual editor, and data binding engine
**Gap Assessment**: ~60% alignment - solid foundation but missing critical features

---

## 🚨 CRITICAL: The "Custom Element Not Found" Issue

### Root Cause Analysis

The error `Custom element not found: custom:shadcn-template-card` occurs because **Home Assistant cannot find the custom element definition**. Based on analyzing the current code:

**Current Implementation** ([`main.ts`](../shadcn-template-card/src/main.ts:8-10)):
```typescript
if (!customElements.get('shadcn-template-card')) {
  customElements.define('shadcn-template-card', shadcnTemplateCard)
}
```

**The Problem**: This code IS correct, but Home Assistant's Lovelace system loads custom cards differently:

1. HA loads the script as a module
2. HA expects the element to be defined IMMEDIATELY when script executes
3. HA then calls `customElements.get('shadcn-template-card')` to verify

**Why It Might Fail**:
1. **Build Output Issue**: ES module builds can defer execution of side effects
2. **Module Loading**: The `format: 'es'` output may not execute synchronously
3. **Import Order**: Circular dependencies or async imports delay registration

### Immediate Fix Required

**Option 1: Force Immediate Execution** (RECOMMENDED)

Change [`main.ts`](../shadcn-template-card/src/main.ts:1-37) to ensure synchronous registration:

```typescript
// main.ts - CRITICAL: Registration must happen IMMEDIATELY
import './globals.css'
import { shadcnTemplateCard } from './card'

// IMMEDIATELY define - no conditional check first
// If already defined, this is a no-op
try {
  customElements.define('shadcn-template-card', shadcnTemplateCard)
} catch (e) {
  // Already defined - this is fine
  if (!(e instanceof DOMException && e.name === 'NotSupportedError')) {
    throw e
  }
}

// THEN register with HA card picker
window.customCards = window.customCards || []
window.customCards.push({
  type: 'custom:shadcn-template-card',
  name: 'Shadcn Template Card',
  description: 'A flexible template card with Shadcn UI components',
  preview: false,
})
```

**Option 2: Use IIFE Format** (Alternative)

Change [`vite.config.ts`](../shadcn-template-card/vite.config.ts:102) to IIFE:

```typescript
output: {
  format: 'iife',  // Changed from 'es'
  name: 'ShadcnTemplateCard',
  entryFileNames: 'shadcn-template-card.js',
}
```

IIFE format executes immediately when the script loads, ensuring synchronous registration.

**Option 3: Use UMD Format** (Maximum Compatibility)

```typescript
output: {
  format: 'umd',
  name: 'ShadcnTemplateCard',
  entryFileNames: 'shadcn-template-card.js',
  globals: {},
}
```

### Home Assistant Custom Card Requirements

Based on Home Assistant developer documentation, custom cards MUST:

1. **Define a Custom Element**: `customElements.define('card-name', CardClass)`
2. **Class Requirements**:
   - Extend `HTMLElement`
   - Implement `setConfig(config)` method
   - Implement `set hass(hass)` setter
   - Optionally implement `getCardSize()` for layout hints
   - Optionally implement `static getConfigElement()` for visual editor
   - Optionally implement `static getStubConfig()` for default config

3. **Register with Card Picker** (optional but recommended):
   ```typescript
   window.customCards = window.customCards || []
   window.customCards.push({ type: 'custom:card-name', ... })
   ```

**Current Implementation Status**:
- ✅ Extends `HTMLElement` ([`card.ts:18`](../shadcn-template-card/src/card.ts:18))
- ✅ `setConfig()` method ([`card.ts:70-91`](../shadcn-template-card/src/card.ts:70))
- ✅ `set hass()` setter ([`card.ts:93-110`](../shadcn-template-card/src/card.ts:93))
- ✅ `getCardSize()` method ([`card.ts:112-121`](../shadcn-template-card/src/card.ts:112))
- ✅ `static getStubConfig()` ([`card.ts:24-30`](../shadcn-template-card/src/card.ts:24))
- ✅ `static getConfigElement()` ([`card.ts:33-37`](../shadcn-template-card/src/card.ts:33))
- ✅ `window.customCards` registration ([`main.ts:26-33`](../shadcn-template-card/src/main.ts:26))
- ❌ **MISSING**: `getGridOptions()` for Sections View - NEEDS IMPLEMENTATION
- ⚠️ **`customElements.define()` may not execute synchronously** - NEEDS FIX

### Missing: getGridOptions() Method (Home Assistant 2024.11+)

Per [Home Assistant Developer Docs](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card), the new **Sections View** requires `getGridOptions()` for proper sizing. Each section uses a **12-column grid** with cells of ~56px height.

**Required Implementation** (add to [`card.ts`](../shadcn-template-card/src/card.ts)):

```typescript
/**
 * Grid sizing for Home Assistant's sections view (12-column grid)
 * Each cell is ~56px height + 8px gap
 *
 * @see https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card
 */
getGridOptions(): { rows: number; columns: number; min_rows?: number; min_columns?: number; max_rows?: number; max_columns?: number } {
  // Calculate based on content or use sensible defaults
  // Full-width by default (12 columns), 2 rows minimum
  return {
    rows: 4,        // Default: 4 rows (~232px height)
    columns: 12,    // Full width
    min_rows: 2,    // Minimum: 2 rows (~120px)
    min_columns: 6, // Half width minimum
  }
}
```

This enables the card to work properly in the new HA dashboard Sections view with drag-to-resize functionality.

---

## Current Implementation Analysis

### ✅ What We Have (Strengths)

#### 1. **Build System** (90% Complete)
- ✅ Vite with proper configuration
- ✅ Single ES module output (`format: 'es'`)
- ✅ TypeScript support
- ✅ Source maps for debugging
- ❌ **Missing**: CSS bundling (currently using runtime Twind)

**Current**: [`vite.config.ts`](../shadcn-template-card/vite.config.ts:102)
```typescript
format: 'es',  // ✅ Correct for HA
entryFileNames: 'shadcn-template-card.js',  // ✅ Single file
```

#### 2. **Component Library** (70% Complete)
- ✅ 24+ shadcn components ported
- ✅ Radix UI primitives (Accordion, Select, Slider, etc.)
- ✅ Preact/React compatibility layer
- ❌ **Missing**: Component registry system
- ❌ **Missing**: Props exposed to configuration UI

**Current**: Direct import approach
```typescript
import { Accordion } from '@radix-ui/react-accordion'
import { Switch } from '@/components/switch'
```

**Target**: Registry-based approach
```typescript
ComponentRegistry.get('UiSwitch') // Returns configured component
```

#### 3. **Styling System** (40% Complete)
- ✅ Twind for runtime CSS generation
- ✅ Shadow DOM scoped
- ✅ Theme integration via CSS variables
- ❌ **Missing**: Bundled Tailwind CSS (critical for performance)
- ❌ **Missing**: Class prefixing (`shadcn-bg-red-500`)

**Current**: Runtime CSS generation
```typescript
setupTwind(shadowRoot) // Generates CSS on-the-fly
```

**Target**: Build-time CSS bundling
```typescript
// Tailwind CSS bundled into .js file during build
// Classes prefixed: shadcn-* to avoid conflicts
```

#### 4. **Data Binding** (30% Complete)
- ✅ Jinja2-style templates (`{{ }}`, `{% for %}`)
- ✅ Basic helpers (states(), state_attr())
- ❌ **Missing**: Direct entity mapping
- ❌ **Missing**: Bidirectional binding (entity ↔ component)
- ❌ **Missing**: Websocket-based Jinja resolver with debounce

**Current**: Template rendering only
```yaml
content: |
  <div>{{ states('light.living_room') }}</div>
```

**Target**: Direct entity binding
```yaml
components:
  - type: UiSwitch
    bind: light.living_room  # Auto-maps state to checked prop
    action: toggle  # Calls light.toggle on change
```

---

## Critical Gaps Analysis

### 🔴 Gap 1: CSS Bundling (CRITICAL)

**Problem**: Runtime Twind generation causes:
- Performance overhead on every render
- FOUC (Flash of Unstyled Content)
- Shadow DOM complexity
- No offline CSS

**Current Flow**:
```
Load card → Initialize Twind → Parse template → Generate CSS → Apply styles
                                  ↑ Happens on EVERY render
```

**Target Flow**:
```
Build time: Extract Tailwind → Prefix classes → Bundle into .js
Runtime: Load card → Inject <style> → Instant styling
```

**Implementation**:
```typescript
// vite.config.ts - Add CSS injection plugin
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    preact(),
    cssInjectedByJsPlugin({
      styleId: 'shadcn-card-styles',
      injectCode: (cssCode) => {
        // Prefix all classes with 'shadcn-'
        const prefixedCss = cssCode.replace(/\./g, '.shadcn-')
        return `
          const style = document.createElement('style');
          style.textContent = ${JSON.stringify(prefixedCss)};
          document.head.appendChild(style);
        `
      }
    })
  ]
})
```

**PostCSS Config** (prefix classes):
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-prefix-selector': {
      prefix: '.shadcn-',
      exclude: [':root', 'html', 'body']
    }
  }
}
```

---

### 🔴 Gap 2: Component Registry (CRITICAL)

**Problem**: No centralized mapping of components to configuration UI

**Current**: Direct imports in code
```typescript
// Each component imported separately
import { Button } from './components/button'
import { Switch } from './components/switch'
```

**Target**: Registry pattern
```typescript
// src/lib/component-registry.ts
export interface ComponentDefinition {
  name: string
  component: ComponentType
  props: PropDefinition[]
  defaultAction?: string
  category: 'layout' | 'input' | 'feedback' | 'data'
}

export const ComponentRegistry = {
  UiCard: {
    component: Card,
    props: [
      { name: 'title', type: 'string', default: '' },
      { name: 'description', type: 'string', default: '' },
      { name: 'footer', type: 'string', default: '' }
    ],
    category: 'layout'
  },
  UiButton: {
    component: Button,
    props: [
      { name: 'variant', type: 'select', options: ['default', 'destructive', 'outline'], default: 'default' },
      { name: 'size', type: 'select', options: ['sm', 'default', 'lg'], default: 'default' },
      { name: 'icon', type: 'icon-picker', default: null }
    ],
    defaultAction: 'call-service',
    category: 'input'
  },
  UiSwitch: {
    component: Switch,
    props: [
      { name: 'checked', type: 'boolean-or-binding', default: false },
      { name: 'disabled', type: 'boolean', default: false }
    ],
    defaultAction: 'toggle',
    category: 'input'
  }
}

// Usage in renderer
const ComponentClass = ComponentRegistry[config.type].component
return <ComponentClass {...resolvedProps} />
```

---

### 🔴 Gap 3: Data Binding Engine (CRITICAL)

**Problem**: No automatic entity → prop mapping

**Current**: Manual template strings
```yaml
content: |
  <shadcn-switch checked="{{ states('light.living_room') == 'on' }}"></shadcn-switch>
```

**Target**: Direct entity binding
```yaml
components:
  - type: UiSwitch
    bind: light.living_room
```

**Implementation**:
```typescript
// src/lib/binding-engine.ts
export class BindingEngine {
  constructor(private hass: HomeAssistant) {}
  
  // Direct entity mapping
  resolveBinding(binding: string | BindingConfig): any {
    if (typeof binding === 'string') {
      // Simple entity ID: 'light.living_room'
      const state = this.hass.states[binding]
      return {
        state: state?.state,
        attributes: state?.attributes,
        // Auto-map common props
        checked: state?.state === 'on',
        value: parseFloat(state?.state) || 0
      }
    }
    
    // Complex binding with Jinja
    if (binding.template) {
      return this.resolveJinjaTemplate(binding.template)
    }
  }
  
  // Jinja2/JS template resolver with debounce
  private resolveJinjaTemplate = debounce((template: string) => {
    return this.hass.callWS({
      type: 'render_template',
      template: template,
      timeout: 5 // seconds
    })
  }, 300) // Debounce for 300ms
  
  // Action handler
  handleAction(action: ActionConfig, entityId: string) {
    switch (action.type) {
      case 'toggle':
        this.hass.callService('homeassistant', 'toggle', {
          entity_id: entityId
        })
        break
      case 'call-service':
        this.hass.callService(
          action.service.split('.')[0],
          action.service.split('.')[1],
          action.service_data
        )
        break
    }
  }
}

// Component usage
function SwitchComponent({ bind, action }) {
  const binding = useBinding(bind) // Custom hook
  
  return (
    <Switch
      checked={binding.checked}
      onCheckedChange={(checked) => {
        handleAction(action || 'toggle', bind)
      }}
    />
  )
}
```

---

### 🟡 Gap 4: Visual Editor (MEDIUM Priority)

**Problem**: No WYSIWYG editor - users must write YAML

**Current**: Code-only configuration
```yaml
type: custom:shadcn-template-card
content: |
  <div class="...">
    <!-- Manual HTML -->
  </div>
```

**Target**: Drag-and-drop visual editor
```typescript
// src/editor/card-editor.tsx
export function ShadcnCardEditor({ config, onChange }) {
  return (
    <div className="editor-layout">
      {/* Left: Component Palette */}
      <ComponentPalette />
      
      {/* Center: Live Canvas */}
      <GridCanvas
        layout={config.layout}
        onLayoutChange={(newLayout) => {
          onChange({ ...config, layout: newLayout })
        }}
      />
      
      {/* Right: Properties Panel */}
      <PropertiesPanel
        selected={selectedComponent}
        onPropertyChange={handlePropertyChange}
      />
    </div>
  )
}
```

**Grid Layout** using `react-grid-layout`:
```typescript
import GridLayout from 'react-grid-layout'

function GridCanvas({ layout, onLayoutChange }) {
  return (
    <GridLayout
      className="grid-canvas"
      layout={layout}
      cols={12}
      rowHeight={30}
      width={1200}
      onLayoutChange={onLayoutChange}
    >
      {layout.map(item => (
        <div key={item.i} data-grid={item}>
          <ComponentRenderer type={item.component} props={item.props} />
        </div>
      ))}
    </GridLayout>
  )
}
```

**Configuration Output**:
```yaml
type: custom:shadcn-template-card
layout:
  - i: 'button-1'
    component: UiButton
    x: 0
    y: 0
    w: 4
    h: 2
    props:
      variant: primary
      label: "Toggle Light"
    action:
      type: toggle
      entity: light.living_room
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
**Goal**: Fix CSS bundling and basic structure

1. **Replace Twind with Build-time Tailwind**
   - [ ] Add `vite-plugin-css-injected-by-js`
   - [ ] Configure PostCSS for class prefixing (`shadcn-*`)
   - [ ] Extract Tailwind CSS during build
   - [ ] Inject CSS into Shadow DOM on load
   - [ ] Remove Twind runtime dependencies

2. **Create Component Registry**
   - [ ] Define `ComponentDefinition` interface
   - [ ] Register Card, Button, Switch components
   - [ ] Add prop type definitions
   - [ ] Implement registry lookup system

**Deliverable**: Card loads with bundled CSS, no Twind overhead

---

### Phase 2: Data Binding (Week 2)
**Goal**: Implement entity → component binding

3. **Build Binding Engine**
   - [ ] Create `BindingEngine` class
   - [ ] Implement direct entity mapping (`bind: 'light.room'`)
   - [ ] Add Jinja template resolver via WebSocket
   - [ ] Implement debounce for template rendering
   - [ ] Add bidirectional prop mapping

4. **Action System**
   - [ ] Implement `call-service` action
   - [ ] Add `toggle` shorthand
   - [ ] Create `navigate` action
   - [ ] Add `fire-dom-event` support

**Deliverable**: Components update from HA state, actions trigger services

---

### Phase 3: Visual Editor (Week 3-4)
**Goal**: WYSIWYG editor for non-technical users

5. **Component Palette**
   - [ ] Categorize components (Layout, Input, Feedback)
   - [ ] Add drag-and-drop from palette
   - [ ] Show component previews

6. **Grid Canvas**
   - [ ] Integrate `react-grid-layout`
   - [ ] Implement resize handles
   - [ ] Add snap-to-grid
   - [ ] Live preview updates

7. **Properties Panel**
   - [ ] Auto-generate form from component props
   - [ ] Add entity picker
   - [ ] Implement conditional logic builder
   - [ ] Add icon picker

**Deliverable**: Full visual editor with code export

---

### Phase 4: Polish (Week 5)
**Goal**: Production-ready features

8. **Advanced Features**
   - [ ] State-based styling (if entity.state == 'on', variant = 'destructive')
   - [ ] Multi-entity support
   - [ ] Template variables
   - [ ] Responsive breakpoints

9. **Documentation**
   - [ ] Update all guides for new system
   - [ ] Create video tutorials
   - [ ] Add migration guide from v1.x

**Deliverable**: Production release v2.0.0

---

## Architecture Comparison Table

| Feature | Current (Preact/Twind) | Target (React/Bundled) | Gap | Priority |
|---------|----------------------|----------------------|-----|----------|
| **Build System** | ✅ Vite + ES modules | ✅ Same | None | - |
| **CSS Handling** | ❌ Runtime Twind | ✅ Build-time bundled | 🔴 Critical | P0 |
| **Class Prefixing** | ❌ No prefixing | ✅ `shadcn-*` prefix | 🔴 Critical | P0 |
| **Component Library** | ✅ 24+ components | ✅ Same | None | - |
| **Component Registry** | ❌ Direct imports | ✅ Centralized registry | 🔴 Critical | P0 |
| **Entity Binding** | ❌ Template-only | ✅ Direct + templates | 🔴 Critical | P0 |
| **Action System** | ❌ Manual | ✅ Declarative | 🔴 Critical | P0 |
| **Jinja Resolver** | ❌ Client-side | ✅ WebSocket + debounce | 🟡 Medium | P1 |
| **Visual Editor** | ❌ None | ✅ Full WYSIWYG | 🟡 Medium | P1 |
| **Grid Layout** | ❌ None | ✅ react-grid-layout | 🟡 Medium | P1 |
| **Shadow DOM** | ✅ Per-card | ✅ Same | None | - |
| **Theme Integration** | ✅ CSS variables | ✅ Same | None | - |
| **Accessibility** | ✅ Radix UI | ✅ Same | None | - |

---

## Migration Strategy

### Option A: Incremental Migration (Recommended)
**Timeline**: 5 weeks  
**Risk**: Low  
**Approach**: Add new features alongside existing system

1. Week 1: Add CSS bundling (parallel to Twind)
2. Week 2: Implement binding engine (new config format)
3. Week 3-4: Build visual editor (optional feature)
4. Week 5: Deprecate Twind, finalize

**Pros**: No breaking changes, gradual rollout  
**Cons**: Temporary code duplication

### Option B: Big Bang Rewrite
**Timeline**: 3 weeks  
**Risk**: High  
**Approach**: Complete v2.0 rewrite

1. Week 1: Foundation + CSS
2. Week 2: Binding + Registry
3. Week 3: Editor + Polish

**Pros**: Clean slate, faster  
**Cons**: Breaking changes for existing users

---

---

## Home Assistant API Integration

### Required Interfaces

```typescript
// types/home-assistant.d.ts
interface HomeAssistant {
  // Core state object - contains all entity states
  states: Record<string, HassEntity>
  
  // Service calling
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, any>,
    target?: HassServiceTarget
  ): Promise<void>
  
  // WebSocket connection for real-time updates
  callWS<T>(params: {
    type: string
    [key: string]: any
  }): Promise<T>
  
  // Theme information
  themes: {
    darkMode: boolean
    theme: string
    themes: Record<string, Record<string, string>>
  }
  selectedTheme: string | { theme: string }
  
  // User info
  user: {
    id: string
    name: string
    is_admin: boolean
  }
  
  // Localization
  locale: {
    language: string
    number_format: string
    time_format: string
  }
}

interface HassEntity {
  entity_id: string
  state: string
  attributes: Record<string, any>
  last_changed: string
  last_updated: string
  context: {
    id: string
    user_id: string | null
  }
}

interface HassServiceTarget {
  entity_id?: string | string[]
  device_id?: string | string[]
  area_id?: string | string[]
}
```

### WebSocket Template Rendering (Validated from HA Docs)

Per [Home Assistant JS WebSocket documentation](https://github.com/home-assistant/home-assistant-js-websocket), use the `render_template` message type.

**Official API Pattern** (from HA WebSocket library):
```javascript
// Direct WebSocket message
const templateResult = await connection.sendMessagePromise({
  type: 'render_template',
  template: '{{ states.light.living_room.state }}'
});
console.log('Rendered:', templateResult);
```

For custom cards, the `hass` object provides `callWS()` which wraps the WebSocket connection:

```typescript
// lib/jinja-resolver.ts
// VALIDATED against Home Assistant developer documentation

export class JinjaResolver {
  private cache = new Map<string, { value: any; timestamp: number }>()
  private pendingRequests = new Map<string, Promise<any>>()
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
    const promise = this.hass.callWS<{ result: string }>({
      type: 'render_template',
      template: template,
      // Note: timeout is optional, defaults vary by HA version
    }).then(response => {
      this.cache.set(template, { value: response.result, timestamp: Date.now() })
      this.pendingRequests.delete(template)
      return response.result
    }).catch(error => {
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
  
  // Clear cache when needed (e.g., on config change)
  clearCache(): void {
    this.cache.clear()
  }
}

// Simple debounce utility
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let pendingResolve: ((value: any) => void) | null = null
  
  return (...args: Parameters<T>) => {
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
```

### Action Handler Implementation

```typescript
// lib/action-handler.ts
import type { HomeAssistant } from './types'

interface ActionConfig {
  action: 'toggle' | 'call-service' | 'navigate' | 'more-info' | 'fire-dom-event'
  // For call-service
  service?: string
  service_data?: Record<string, any>
  target?: HassServiceTarget
  // For navigate
  navigation_path?: string
  // For more-info
  entity?: string
  // For fire-dom-event
  event_type?: string
  event_data?: Record<string, any>
}

export class ActionHandler {
  constructor(
    private hass: HomeAssistant,
    private element: HTMLElement
  ) {}
  
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
          await this.hass.callService(
            domain,
            service,
            config.service_data,
            config.target
          )
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
}
```

---

## Updated Component Registry Design

Based on the current [`component-registry.ts`](../shadcn-template-card/src/lib/component-registry.ts), enhance it to support the visual editor:

```typescript
// lib/component-registry.ts (Enhanced)
export interface PropDefinition {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'entity' | 'service' | 'icon' | 'color'
  default?: any
  options?: string[] // For 'select' type
  description?: string
  required?: boolean
}

export interface ActionDefinition {
  type: 'toggle' | 'call-service' | 'navigate' | 'more-info'
  // Pre-filled values
  service?: string
  target_entity_from_bind?: boolean // Use bound entity as target
}

export interface ComponentDefinition {
  name: string
  displayName: string
  description: string
  category: 'layout' | 'input' | 'feedback' | 'data'
  icon: string // MDI icon name
  
  // React/Preact component
  component: ComponentType<any>
  
  // Props exposed in visual editor
  props: PropDefinition[]
  
  // CSS styles for shadow DOM
  styles: string
  
  // Default action when component interacts
  defaultAction?: ActionDefinition
  
  // Entity binding configuration
  binding?: {
    // How to map entity state to props
    stateMapping: (state: string, attributes: Record<string, any>) => Record<string, any>
    // Supported entity domains
    supportedDomains?: string[]
  }
  
  // Init/cleanup functions
  init?: (shadowRoot: ShadowRoot) => void
  cleanup?: (shadowRoot: ShadowRoot) => void
}

// Example registrations
export const UI_COMPONENTS: Record<string, ComponentDefinition> = {
  UiCard: {
    name: 'UiCard',
    displayName: 'Card',
    description: 'Container with header, content, and footer sections',
    category: 'layout',
    icon: 'mdi:card-outline',
    component: Card,
    props: [
      { name: 'title', type: 'string', default: '', description: 'Card title' },
      { name: 'description', type: 'string', default: '', description: 'Card description' },
      { name: 'footer', type: 'string', default: '', description: 'Footer content' },
    ],
    styles: cardStyles,
  },
  
  UiButton: {
    name: 'UiButton',
    displayName: 'Button',
    description: 'Clickable button with multiple variants',
    category: 'input',
    icon: 'mdi:button-cursor',
    component: Button,
    props: [
      { name: 'label', type: 'string', default: 'Button', description: 'Button text' },
      { name: 'variant', type: 'select', options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'], default: 'default' },
      { name: 'size', type: 'select', options: ['default', 'sm', 'lg', 'icon'], default: 'default' },
      { name: 'icon', type: 'icon', description: 'Optional icon' },
      { name: 'disabled', type: 'boolean', default: false },
    ],
    styles: buttonStyles,
    defaultAction: { type: 'call-service' },
  },
  
  UiSwitch: {
    name: 'UiSwitch',
    displayName: 'Switch',
    description: 'Toggle switch for on/off states',
    category: 'input',
    icon: 'mdi:toggle-switch',
    component: Switch,
    props: [
      { name: 'checked', type: 'boolean', default: false },
      { name: 'disabled', type: 'boolean', default: false },
      { name: 'label', type: 'string', default: '' },
    ],
    styles: switchStyles,
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
    component: Slider,
    props: [
      { name: 'value', type: 'number', default: 50 },
      { name: 'min', type: 'number', default: 0 },
      { name: 'max', type: 'number', default: 100 },
      { name: 'step', type: 'number', default: 1 },
      { name: 'disabled', type: 'boolean', default: false },
    ],
    styles: sliderStyles,
    defaultAction: { type: 'call-service', service: 'number.set_value' },
    binding: {
      stateMapping: (state, attrs) => ({
        value: parseFloat(state) || 0,
        min: attrs.min ?? 0,
        max: attrs.max ?? 100,
        step: attrs.step ?? 1,
      }),
      supportedDomains: ['number', 'input_number', 'light'], // Light for brightness
    },
  },
}
```

---

## Conclusion

**Current Implementation**: 60% aligned with ideal architecture
- Strong foundation (Vite, Preact, Radix UI, Shadow DOM)
- Missing critical features (CSS bundling, registry, binding engine)
- **CRITICAL BUG**: Custom element registration may not be synchronous

**Recommended Path**: **Option A - Incremental Migration**
- Maintain backward compatibility
- Add features progressively
- Lower risk, gradual user adoption

**Immediate Priority** (Before any other work):
1. 🔴 **CRITICAL**: Fix custom element registration timing issue
2. 🔴 **P0**: CSS bundling (performance)
3. 🔴 **P0**: Enhanced component registry (scalability)
4. 🔴 **P0**: Binding engine with action handlers (usability)
5. 🟡 **P1**: Jinja WebSocket resolver (performance)
6. 🟡 **P1**: Visual editor (adoption)

**Next Action**: Fix the `customElements.define()` synchronous execution issue FIRST, then begin Phase 1 - CSS bundling replacement