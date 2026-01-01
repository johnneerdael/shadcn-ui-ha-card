# shadcdn-template-card

[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/release/jneerdael/status-banner-card.svg)](https://github.com/jneerdael/status-banner-card/releases)
[![License](https://img.shields.io/github/license/jneerdael/status-banner-card.svg)](LICENSE)


Home Assistant custom card that renders arbitrary HTML using shadcn-ui (Radix) component styles, Tailwind/Twind at runtime, and Jinja2-style templating to bind Home Assistant state. Uses per-shadow-root Twind + shadcn tokens mapped from the current HA theme so cards stay consistent with the user's theme.

## Features

- **24+ shadcn/ui Components** - Complete library from simple badges to interactive accordions and sliders
- **Jinja2 Templating** - Full templating support (`{{ }}`, `{% for %}`) with helpers: [`states()`](src/lib/template.ts:88), [`state_attr()`](src/lib/template.ts:88), [`range()`](src/lib/template.ts:88), `Math`, `Date`, `vars`
- **Interactive Components** - Accordion, Collapsible, Toggle, Switch, RadioGroup, Checkbox, Select, Slider with full keyboard navigation
- **CSS-Only Components** - Separator, Skeleton, Avatar, Alert, Progress, AspectRatio, Label, Textarea
- **Theme Integration** - Automatic HA theme → shadcn token mapping with fallbacks; see [`mapThemeVariables()`](src/lib/theme.ts:34)
- **Shadow DOM Scoped** - Per-card Twind instance for isolated styling; see [`setupTwind()`](src/lib/twind.ts:9)
- **Accessibility First** - Full ARIA support, keyboard navigation, and screen reader compatibility

## Installation

### HACS (Recommended)

1. **Add Custom Repository**
   - Open HACS in Home Assistant
   - Click the 3-dot menu → **Custom repositories**
   - Add repository URL: `https://github.com/YOUR_USERNAME/shadcdn-template-card`
   - Category: **Lovelace**
   - Click **Add**

2. **Install the Card**
   - Search for "Shadcn Template Card" in HACS
   - Click **Download**
   - Restart Home Assistant

3. **Add to Dashboard**
   - The card will be automatically available in your dashboard editor
   - No manual resource configuration needed!

### Manual Installation

1. Build the bundle:

   ```bash
   npm install
   npm run build
   ```

   The output bundle is `dist/shadcdn-template-card.js`.

2. Copy `dist/shadcdn-template-card.js` to `config/www/shadcdn-template-card/` in Home Assistant.

3. Add to Lovelace resources:

   ```yaml
   lovelace:
     resources:
       - url: /local/shadcdn-template-card/shadcdn-template-card.js
         type: module
   ```

4. Restart Home Assistant and add the card.

### Development

- Live dev: `npm run dev` (Vite) and serve a test dashboard pointing to the dev server.
- Type-check: `npm run type-check`
- Lint: `npm run lint`

## Quick Start

### Your First Card

Create a simple status card in your Lovelace dashboard:

1. **Add Card via UI**
   - Edit your dashboard
   - Click "Add Card"
   - Search for "Shadcn Template Card"
   - Click to add

2. **Configure in YAML**
   ```yaml
   type: custom:shadcdn-template-card
   title: Welcome
   content: |
     <div class="space-y-3">
       <div class="shc-card">
         <div class="shc-card-header">
           <div class="shc-card-title">Hello, Home Assistant!</div>
           <div class="shc-card-description">
             Your first shadcn card with beautiful components
           </div>
         </div>
         <div class="shc-card-content">
           <p class="text-sm text-[var(--muted-foreground)]">
             Current time: {{ Date.now() }}
           </p>
         </div>
       </div>
     </div>
   ```

3. **Save and View**
   - Click "Save" in the card editor
   - Your styled card appears instantly!

### Next Steps

- **[See Full Tutorial](TUTORIAL.md)** - Progressive examples from beginner to advanced
- **[Complete Component Library](#component-library)** - All 24+ available components
- **[Component Reference](COMPONENTS.md)** - Detailed component documentation
- **[Quick Reference](COMPONENT_REFERENCE.md)** - Copy-paste ready snippets
- **[shadcn/ui Documentation](https://ui.shadcn.com/)** - Official component docs and design system

## Usage Examples

### Basic Card

```yaml
type: custom:shadcdn-template-card
title: HVAC
content: |
  <div class="space-y-2">
    <div class="text-sm text-[var(--muted-foreground)]">
      Mode: {{ states('climate.living_room') }}
    </div>
    <div class="flex items-center gap-2">
      <span class="text-lg font-semibold">{{ state_attr('climate.living_room','current_temperature') }}°C</span>
      <span class="text-sm text-[var(--muted-foreground)]">Target {{ state_attr('climate.living_room','temperature') }}°C</span>
    </div>
    <button class="shc-btn shc-btn-primary">Action</button>
  </div>
```

### Looping with Jinja-style `for`

```yaml
type: custom:shadcdn-template-card
title: Sensors
content: |
  <div class="grid grid-cols-2 gap-3">
    {% for entity_id in ['sensor.kitchen', 'sensor.living_room'] %}
    <div class="shc-surface">
      <div class="text-sm font-semibold">{{ entity_id }}</div>
      <div class="text-xs text-[var(--muted-foreground)]">Value: {{ states(entity_id) }}</div>
      <div class="text-xs text-[var(--muted-foreground)]">Attr unit: {{ state_attr(entity_id,'unit_of_measurement') }}</div>
    </div>
    {% endfor %}
  </div>
```

### Custom Variables

```yaml
type: custom:shadcdn-template-card
title: Greetings
variables:
  name: "Ada"
content: |
  <div class="text-base">Hello, {{ name }}!</div>
```

### Using shadcn Component Classes

The card exposes shadcn-style utility classes you can use directly in your HTML:

```yaml
type: custom:shadcdn-template-card
title: Component Examples
content: |
  <div class="space-y-4">
    <!-- Buttons -->
    <div class="flex gap-2">
      <button class="shc-btn shc-btn-primary">Primary</button>
      <button class="shc-btn shc-btn-secondary">Secondary</button>
      <button class="shc-btn shc-btn-ghost">Ghost</button>
    </div>
    
    <!-- Badges -->
    <div class="flex gap-2">
      <span class="shc-badge shc-badge-default">Default</span>
      <span class="shc-badge shc-badge-primary">Primary</span>
      <span class="shc-badge shc-badge-destructive">Destructive</span>
    </div>
    
    <!-- Cards -->
    <div class="shc-card">
      <div class="shc-card-header">
        <div class="shc-card-title">Card Title</div>
        <div class="shc-card-description">Card description goes here</div>
      </div>
      <div class="shc-card-content">
        <p>Card content with shadcn styling</p>
      </div>
    </div>
    
    <!-- Inputs -->
    <div class="space-y-2">
      <input type="text" class="shc-input" placeholder="Enter text..." />
      <input type="number" class="shc-input" placeholder="Enter number..." />
    </div>
  </div>
```

### Conditional Rendering

```yaml
type: custom:shadcdn-template-card
title: Conditional
content: |
  <div class="space-y-2">
    {% if states('light.living_room') == 'on' %}
    <div class="shc-badge shc-badge-primary">Light is ON</div>
    {% else %}
    <div class="shc-badge shc-badge-secondary">Light is OFF</div>
    {% endif %}
  </div>
```

### Using Range Helper

```yaml
type: custom:shadcdn-template-card
title: Range Example
content: |
  <div class="grid grid-cols-5 gap-2">
    {% for i in range(1, 6) %}
    <div class="shc-surface p-2 text-center">
      <div class="text-lg font-bold">{{ i }}</div>
    </div>
    {% endfor %}
  </div>
```

### Math and Date Helpers

```yaml
type: custom:shadcdn-template-card
title: Helpers
content: |
  <div class="space-y-2">
    <div>2 + 3 = {{ Math.add(2, 3) }}</div>
    <div>10 / 2 = {{ Math.divide(10, 2) }}</div>
    <div>Max: {{ Math.max(5, 10, 3) }}</div>
    <div>Current time: {{ Date.now() }}</div>
  </div>
```

## Component Library

The card includes **24+ shadcn/ui components** organized into categories for easy reference.

### Layout & Structure
- **[Card](COMPONENTS.md#card)** - Container with header, content, and footer sections
- **[Separator](COMPONENTS.md#separator)** - Visual divider between content sections
- **[Aspect Ratio](COMPONENTS.md#aspect-ratio)** - Maintain consistent width-to-height ratios

### Typography & Content
- **[Label](COMPONENTS.md#label)** - Form labels and text indicators
- **[Badge](COMPONENTS.md#badge)** - Status indicators and tags
- **[Alert](COMPONENTS.md#alert)** - Contextual feedback messages

### Forms & Inputs
- **[Input](COMPONENTS.md#input)** - Text input field
- **[Textarea](COMPONENTS.md#textarea)** - Multi-line text input
- **[Checkbox](COMPONENTS.md#checkbox)** - Checkboxes with checked/indeterminate states
- **[Radio Group](COMPONENTS.md#radiogroup)** - Radio button groups with single selection
- **[Switch](COMPONENTS.md#switch)** - Toggle switches for on/off states
- **[Select](COMPONENTS.md#select)** - Dropdown select menus
- **[Slider](COMPONENTS.md#slider)** - Range sliders with drag interaction

### Interactive Elements
- **[Button](COMPONENTS.md#button)** - Clickable buttons with multiple variants
- **[Toggle](COMPONENTS.md#toggle)** - Toggle buttons with pressed states
- **[Accordion](COMPONENTS.md#accordion)** - Collapsible content sections
- **[Collapsible](COMPONENTS.md#collapsible)** - Simple show/hide toggles
- **[Tabs](COMPONENTS.md#tabs)** - Tab navigation for content organization

### Feedback & Status
- **[Progress](COMPONENTS.md#progress)** - Progress bars and indicators
- **[Skeleton](COMPONENTS.md#skeleton)** - Loading state placeholders
- **[Avatar](COMPONENTS.md#avatar)** - User profile images with fallbacks

### Code & Data
- **[Code](COMPONENTS.md#code)** - Inline code snippets
- **[Kbd](COMPONENTS.md#kbd)** - Keyboard shortcut indicators

### Quick Component Reference

| Component | Type | Key Features |
|-----------|------|--------------|
| Accordion | Interactive | Collapsible sections, keyboard nav, single/multiple modes |
| Alert | CSS-only | Contextual messages, variants (default, destructive, warning) |
| Avatar | CSS-only | Profile images, fallback support, size variants |
| Badge | CSS-only | Status tags, multiple color variants |
| Button | CSS-only | Multiple variants, sizes, states |
| Card | CSS-only | Structured container with header/content/footer |
| Checkbox | Interactive | Checked/unchecked/indeterminate states |
| Collapsible | Interactive | Simple toggle, smooth animations |
| Input | CSS-only | Text input with variants |
| Label | CSS-only | Form labels |
| Progress | CSS-only | Progress bars, percentage display |
| Radio Group | Interactive | Single selection, keyboard nav |
| Select | Interactive | Dropdown menu, searchable options |
| Separator | CSS-only | Visual dividers, horizontal/vertical |
| Skeleton | CSS-only | Loading placeholders |
| Slider | Interactive | Range input, drag/keyboard control |
| Switch | Interactive | Toggle on/off states |
| Tabs | CSS-only | Content organization |
| Textarea | CSS-only | Multi-line text input |
| Toggle | Interactive | Pressed/unpressed button states |

**View detailed documentation:**
- **[COMPONENTS.md](COMPONENTS.md)** - Complete component reference with examples
- **[COMPONENT_REFERENCE.md](COMPONENT_REFERENCE.md)** - Quick copy-paste snippets
- **[PHASE2_COMPONENTS.md](PHASE2_COMPONENTS.md)** - Interactive component details
- **[TUTORIAL.md](TUTORIAL.md)** - Learn by building real examples

## Theming

The card maps the active HA theme to shadcn tokens and legacy `--stc-*` vars; see [`mapThemeVariables`](src/lib/theme.ts:34). Colors and radii flow into Twind via `twind.config.js` (CSS-variable-backed palette). You can override per card:

```yaml
type: custom:shadcdn-template-card
title: Custom palette
content: |
  <div class="shc-surface">
    Custom colors
  </div>
style:
  --primary: #22d3ee
  --primary-foreground: #0b1224
```

## Documentation

### Getting Started
- **[Quick Start Guide](#quick-start)** - Your first card in 5 minutes
- **[TUTORIAL.md](TUTORIAL.md)** - Progressive learning from basics to advanced
- **[HACS_SETUP.md](HACS_SETUP.md)** - HACS installation and configuration

### Component Documentation
- **[COMPONENTS.md](COMPONENTS.md)** - Complete component library reference
- **[COMPONENT_REFERENCE.md](COMPONENT_REFERENCE.md)** - Quick copy-paste cheat sheet
- **[PHASE2_COMPONENTS.md](PHASE2_COMPONENTS.md)** - Interactive components deep dive
- **[Available Classes](#using-shadcn-component-classes)** - Legacy utility classes

### Advanced Topics
- **[LIMITATIONS.md](LIMITATIONS.md)** - Known limitations and workarounds
- **[DEBUGGING.md](DEBUGGING.md)** - Troubleshooting and deployment guide
- **[Architecture Notes](#architecture-notes)** - Technical implementation details

## Troubleshooting

Having issues with the card? Check the **[Debugging Guide](DEBUGGING.md)** for comprehensive troubleshooting:

### Quick Fixes

**Card not appearing?**
- Run `customElements.get('shadcdn-template-card')` in browser console
- Should return the card class (not `undefined`)
- See [Quick Diagnosis Checklist](DEBUGGING.md#quick-diagnosis-checklist)

**Card appears but unstyled?**
- Check browser console for Twind initialization errors
- Clear browser cache (Ctrl+F5 / Cmd+Shift+R)
- See [Twind CSS Issues](DEBUGGING.md#issue-3-twind-css-not-loading)

**Build errors?**
- Ensure `format: 'es'` is set in [`vite.config.ts`](vite.config.ts:1)
- Run `npm install` to update dependencies
- See [Build Troubleshooting](DEBUGGING.md#build-troubleshooting)

**After updating the card:**
1. Clear browser cache
2. Hard reload (Ctrl+F5 / Cmd+Shift+R)
3. Restart Home Assistant if needed
4. See [Deployment Checklist](DEBUGGING.md#deployment-checklist)

### Essential Console Commands

```javascript
// Check if card is registered
customElements.get('shadcdn-template-card');

// Check HACS registration
window.customCards?.find(c => c.type === 'shadcdn-template-card');

// Verify all components
console.log(customElements.get('shadcdn-button'));
console.log(customElements.get('shadcdn-input'));
console.log(customElements.get('shadcdn-select'));
```

### Full Documentation

For detailed troubleshooting steps, see **[DEBUGGING.md](DEBUGGING.md)**:
- [Common Issues and Solutions](DEBUGGING.md#common-issues-and-solutions)
- [Browser Console Debugging](DEBUGGING.md#browser-console-debugging)
- [Deployment Checklist](DEBUGGING.md#deployment-checklist)
- [Build Troubleshooting](DEBUGGING.md#build-troubleshooting)

### Design System

This card implements the **[shadcn/ui design system](https://ui.shadcn.com/)** with:
- **Radix UI primitives** - Accessible component foundation
- **Tailwind CSS utilities** - Via runtime Twind engine
- **CSS variables** - Automatic HA theme mapping
- **Type-safe** - Full TypeScript support

Explore shadcn components at **[ui.shadcn.com](https://ui.shadcn.com/)** for:
- Component examples and live demos
- Design principles and guidelines
- Accessibility patterns
- Color system and theming

## Architecture Notes

- Card custom element: [`ShadcdnTemplateCard`](src/card.ts:17) — attaches a shadow root, mounts Twind, renders templated HTML, injects theme vars.
- Template engine: [`renderTemplate`](src/lib/template.ts:88) — handles nested `{% for %}` then `{{ ... }}` with helper context.
- Twind setup: [`setupTwind`](src/lib/twind.ts:9) — per-card CSSOM sheet, deterministic class names.
- Global styles: [`globals.css`](src/globals.css:1) — base shadcn host styles and `.shc-surface`.

## Recent Updates

### Version 1.1.0 (Latest)
- ✅ **16 New Components** - Complete Tier 1 and Tier 2 implementation
- ✅ **Interactive Components** - Accordion, Collapsible, Toggle, Switch, RadioGroup, Checkbox, Select, Slider
- ✅ **CSS Components** - Separator, Skeleton, Avatar, Alert, Progress, AspectRatio, Label, Textarea
- ✅ **Full Accessibility** - ARIA attributes, keyboard navigation, screen reader support
- ✅ **Component Registry** - Centralized component management system
- ✅ **Comprehensive Documentation** - Complete guides for all components

### Roadmap

**Phase 3: Portal Components** (Planned)
- Dialog, Popover, Tooltip, DropdownMenu
- Advanced shadow DOM portal management
- Overlay positioning and z-index management

**Future Enhancements**
- Action bindings for Home Assistant service calls
- Form validation and state persistence
- Advanced animation and transition utilities
- Component theming and customization API

## License

MIT
