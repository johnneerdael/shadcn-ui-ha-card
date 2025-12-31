# shadcdn-template-card

[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/release/jneerdael/status-banner-card.svg)](https://github.com/jneerdael/status-banner-card/releases)
[![License](https://img.shields.io/github/license/jneerdael/status-banner-card.svg)](LICENSE)


Home Assistant custom card that renders arbitrary HTML using shadcn-ui (Radix) component styles, Tailwind/Twind at runtime, and Jinja2-style templating to bind Home Assistant state. Uses per-shadow-root Twind + shadcn tokens mapped from the current HA theme so cards stay consistent with the user’s theme.

## Features

- Jinja2-like templating (`{{ }}`, `{% for %}`) with helpers: `states()`, `state_attr()`, `range()`, `Math`, `Date`, `vars`.
- shadcn-ui utility classes (buttons, badges, card, inputs, tabs, code/kbd) exposed for HA-friendly HTML usage; see [`src/components/index.ts`](src/components/index.ts).
- HA theme → shadcn token mapping with fallbacks; see [`mapThemeVariables`](src/lib/theme.ts:34).
- Per-card Twind instance scoped to the shadow DOM; see [`setupTwind`](src/lib/twind.ts:9).

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
- **[Component Reference](#using-shadcn-component-classes)** - All available shadcn components
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

### Component Reference

All available shadcn/ui components and their usage:
- **[shadcn/ui Components](https://ui.shadcn.com/docs/components)** - Official component documentation
- **[Available Classes](#using-shadcn-component-classes)** - Card-specific utility classes
- **[TUTORIAL.md](TUTORIAL.md)** - Step-by-step learning guide
- **[LIMITATIONS.md](LIMITATIONS.md)** - Known limitations and workarounds

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

## Roadmap

- Expand component helper set to full shadcn coverage
- Add action bindings and HA event helpers
- Interactive form components with state management
- Advanced animation and transition utilities

## License

MIT
