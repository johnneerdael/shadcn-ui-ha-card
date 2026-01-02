# Shadcn Template Card

[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/release/johnneerdael/shadcn-ui-ha-card.svg)](https://github.com/jneerdael/shadcn-ui-ha-card/releases)
[![License](https://img.shields.io/github/license/johnneerdael/status-banner-card.svg)](LICENSE)

A professional **Visual Editor** for Home Assistant that brings the complete **shadcn/ui component library** (34 components, 85+ variants) with drag-and-drop layout, live preview, and per-card theming. Build beautiful, interactive dashboards without writing code!

## 🎨 Features

### Visual Editor (NEW!)
- **Drag & Drop** - Intuitive visual builder with component palette
- **Live Preview** - See changes instantly with real entity data
- **Tree View** - Hierarchical component structure for complex layouts
- **Properties Panel** - Edit component props, bindings, actions, and styling
- **Grid Positioning** - Precise 12-column grid with drag-to-resize
- **Theme Editor** - Customize colors, radius, and spacing per card

### 34+ Shadcn Components (v2.1.0)
**Complete core component coverage** from shadcn/ui:

**Interactive Forms:**
- Button, Switch, Slider, Checkbox, RadioGroup, Toggle, Select, Input, Textarea, Combobox

**Display & Feedback:**
- Alert, Badge, Progress, Skeleton, Separator, Avatar, Label, Toast

**Layout Containers:**
- Card, Tabs, Accordion, Collapsible, AspectRatio, ScrollArea

**Advanced UI:**
- Dialog, AlertDialog, Sheet, Popover, HoverCard, Tooltip

**Data & Visualization:**
- Chart, Table, Command, RawHTML (for custom content)

### Theme System
- **Per-Card Themes** - Each card can have unique styling
- **Quick Presets** - Material, Apple, Corporate, Playful
- **5 Key Controls** - Primary, Secondary, Radius, Background/Foreground, Spacing
- **Live Updates** - Changes apply instantly via CSS Variables
- **Shadcn Philosophy** - "Adjust the DNA of components" directly

### Technical Excellence
- **Entity Binding** - Connect components to Home Assistant entities
- **Action Handlers** - Toggle, call-service, navigate, more-info, fire-event
- **Jinja2 Templates** - Full templating support for dynamic content
- **Shadow DOM** - Isolated styling, no conflicts
- **TypeScript** - Fully typed for safety and IDE support
- **Accessibility** - ARIA support, keyboard navigation, screen readers

## 📦 Installation

### HACS (Recommended)

1. **Add Custom Repository**
   - Open HACS in Home Assistant
   - Click the 3-dot menu → **Custom repositories**
   - Add: `https://github.com/YOUR_USERNAME/shadcn-template-card`
   - Category: **Lovelace**

2. **Install**
   - Search for "Shadcn Template Card"
   - Click **Download**
   - Restart Home Assistant

3. **Start Building**
   - Add card via dashboard editor
   - Visual editor opens automatically!

### Manual Installation

```bash
# Build
npm install
npm run build

# Copy to Home Assistant
cp dist/shadcn-template-card.js /config/www/shadcn-template-card/
cp dist/shadcn-template-card.css /config/www/shadcn-template-card/
```

Add to `configuration.yaml`:
```yaml
lovelace:
  resources:
    - url: /local/shadcn-template-card/shadcn-template-card.js
      type: module
```

## 🚀 Quick Start

### Using the Visual Editor

1. **Add Card**
   - Edit dashboard → Add Card → Search "Shadcn Template Card"

2. **Drag Components**
   - Browse component palette (left panel)
   - Drag components onto canvas

3. **Configure**
   - Select component
   - Edit properties (right panel)
   - Bind to entities
   - Add actions

4. **Customize Theme**
   - Click away from components
   - Switch to "Theme" tab
   - Adjust colors, radius, spacing
   - Apply presets

5. **Save**
   - Changes auto-save to card config

### Example: Light Control Card

Visual editor automatically generates this config:

```yaml
type: custom:shadcn-template-card
title: Living Room
theme:
  primary: '#0070f3'
  radius: '0.5rem'
  spacing:
    gap: '0.75rem'
layout:
  - i: card-1
    x: 0
    y: 0
    w: 12
    h: 6
    component: UiCard
    props:
      title: Lights
    children:
      - i: switch-1
        component: UiSwitch
        bind: light.living_room
        action:
          type: toggle
        props:
          label: Main Light
      - i: slider-1
        component: UiSlider
        bind: light.living_room
        props:
          label: Brightness
          min: 0
          max: 100
```

### Legacy Template Mode

Still supports raw HTML/Jinja templates:

```yaml
type: custom:shadcn-template-card
title: Welcome
content: |
  <div class="shc-card">
    <div class="shc-card-header">
      <h2 class="shc-card-title">Hello, {{ states('sensor.username') }}!</h2>
    </div>
    <div class="shc-card-content">
      <p>Temperature: {{ states('sensor.temperature') }}°C</p>
    </div>
  </div>
```

## 📚 Documentation

- **[User Guide](docs/USER_GUIDE.md)** - Complete usage guide
- **[Visual Editor](docs/visual-editor.md)** - Editor features and tips
- **[Theme System](docs/theme-system.md)** - Theming and customization
- **[Component Reference](docs/components/)** - All 75 components documented
- **[Examples](docs/examples/)** - Real-world card examples

## 🏗️ Architecture

### Technology Stack
- **Preact** - Lightweight React alternative (3KB)
- **Vite** - Lightning-fast build tool
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling (bundled, not runtime)
- **React Grid Layout** - Drag-and-drop positioning

### File Structure
```
src/
├── card.ts                 # Custom element & runtime
├── editor/                 # Visual editor
│   ├── card-editor.tsx     # Main editor component
│   ├── component-palette.tsx
│   ├── split-canvas.tsx    # Preview + grid
│   ├── properties-panel.tsx
│   ├── theme-editor.tsx    # NEW: Theme customization
│   └── tree-view.tsx
├── components/ui/          # 75 shadcn components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ... (72 more)
├── renderer/               # Component rendering
│   ├── layout-renderer.tsx
│   └── component-map.tsx
└── lib/                    # Utilities
    ├── binding-engine.ts   # Entity state binding
    ├── action-handler.ts   # HA actions
    ├── theme-presets.ts    # Theme presets
    └── component-registry.ts
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Dev server with hot reload
npm run dev

# Type check
npm run type-check

# Build production
npm run build

# Validate architecture
npm run validate
```

## 🤝 Contributing

Contributions welcome! Please:

1. Check existing issues
2. Follow TypeScript/Preact conventions
3. Test in actual Home Assistant
4. Update documentation

## 📊 Bundle Size

```
CSS:  30.60 kB │ gzip:  5.39 kB
JS:  331.76 kB │ gzip: 74.70 kB
```

Includes **29 components (75+ variants)** + visual editor + theme system!

## 🙏 Credits

- **[shadcn/ui](https://ui.shadcn.com/)** - Component library
- **[Home Assistant](https://www.home-assistant.io/)** - Smart home platform
- **[Preact](https://preactjs.com/)** - Fast React alternative

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

**Built with ❤️ for the Home Assistant community**

*Need help? Open an issue or check the [User Guide](docs/USER_GUIDE.md)*
