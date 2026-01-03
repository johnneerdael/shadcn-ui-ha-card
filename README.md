# Shadcn Template Card

[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/release/johnneerdael/shadcn-ui-ha-card.svg)](https://github.com/johnneerdael/shadcn-ui-ha-card/releases)
[![License](https://img.shields.io/github/license/johnneerdael/shadcn-ui-ha-card.svg)](LICENSE)

A professional **Visual Editor** for Home Assistant that brings the complete **shadcn/ui component library** (34 components, 85+ variants) with drag-and-drop layout, live preview, and per-card theming. Build beautiful, interactive dashboards without writing code!

## What's New in v2.2.0

- **Redesigned Visual Editor** - New vertical flow layout for better workflow
- **Component Theme Overrides** - Override card theme on individual components
- **Horizontal Component Picker** - Full-width picker with one row per category
- **Inline Component Styling** - Properties and theme appear when component selected
- **Full-Width Canvas** - More space for your card preview

## Features

### Visual Editor (v2.2.0 Redesign)

```
┌──────────────────────────────────────────────────────────┐
│ Visual Editor                                   1 comp   │
├──────────────────────────────────────────────────────────┤
│ Card Theme: [■Pri] [■Sec] [■BG] [■FG] Radius Gap Padding │  ← Collapsible global theme
├──────────────────────────────────────────────────────────┤
│ Layout: Grid Card │ Input: Button Switch Slider ...      │  ← Horizontal picker
├──────────────────────────────────────────────────────────┤
│ [Button] [Entity▼] [Action▼] [🎨] [🗑] [×]               │  ← Component styling (when selected)
│ Props: label [Click me] variant [default▼]               │
│ Theme Override: [■Pri] [■Sec] [■BG] [■FG] Radius [0.5]  │  ← Override card theme!
├──────────────────────────────────────────────────────────┤
│                                                          │
│              FULL-WIDTH LIVE CANVAS                      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Key Features:**
- **Click to Add** - Click any component in the horizontal picker to add it
- **Inline Editing** - Select component in canvas, edit properties in the panel above
- **Theme Inheritance** - Components inherit card theme, with optional per-component overrides
- **Live Preview** - Canvas shows actual rendered components with entity data
- **Drag to Resize** - Resize handles on selected components

### 34+ Shadcn Components

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

**Card-Level Theme (Global):**
- Primary, Secondary, Background, Foreground colors
- Border radius (Sharp → Bubbly)
- Gap and Padding spacing

**Component-Level Overrides (NEW!):**
- Click the 🎨 button when a component is selected
- Override any theme property for just that component
- Faded colors = inherited from card
- Solid colors with border = overridden
- Small × to clear individual overrides

### Technical Excellence
- **Entity Binding** - Connect components to Home Assistant entities
- **Action Handlers** - Toggle, call-service, navigate, more-info, fire-event
- **Jinja2 Templates** - Full templating support for dynamic content
- **Shadow DOM** - Isolated styling, no conflicts
- **TypeScript** - Fully typed for safety and IDE support

## Installation

### HACS (Recommended)

1. **Add Custom Repository**
   - Open HACS in Home Assistant
   - Click the 3-dot menu → **Custom repositories**
   - Add: `https://github.com/johnneerdael/shadcn-ui-ha-card`
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

## Quick Start

### Using the Visual Editor

1. **Add Card** - Edit dashboard → Add Card → Search "Shadcn Template Card"

2. **Set Card Theme** - Expand the theme row at top, set your colors and spacing

3. **Add Components** - Click components in the horizontal picker to add them

4. **Configure Component** - Click component in canvas to select it:
   - Set entity binding
   - Choose tap action
   - Edit component-specific props
   - Click 🎨 to override theme for this component only

5. **Arrange** - Drag to reposition, use handles to resize

6. **Save** - Changes auto-save to card config

### Example Config

```yaml
type: custom:shadcn-template-card
theme:
  primary: '#0070f3'
  secondary: '#7c3aed'
  radius: '0.5rem'
  spacing:
    gap: '0.5rem'
    padding: '1rem'
layout:
  - i: button-abc123
    x: 0
    y: 0
    w: 4
    h: 2
    component: UiButton
    bind: light.living_room
    action:
      type: toggle
    props:
      label: Toggle Light
      variant: default
    themeOverride:           # NEW: Per-component theme override
      primary: '#ef4444'     # This button will be red instead of blue
  - i: switch-def456
    x: 4
    y: 0
    w: 4
    h: 2
    component: UiSwitch
    bind: switch.fan
    props:
      label: Fan
```

## Documentation

- **[User Guide](docs/USER_GUIDE.md)** - Complete usage guide
- **[Visual Editor](docs/visual-editor.md)** - Editor features and tips
- **[Theme System](docs/theme-system.md)** - Theming and customization
- **[Component Reference](docs/components/)** - All components documented
- **[Examples](docs/examples/)** - Real-world card examples

## Architecture

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
├── editor/                 # Visual editor (v2.2.0 redesign)
│   ├── card-editor.tsx     # Main vertical layout
│   ├── card-settings.tsx   # Global theme row
│   ├── horizontal-picker.tsx # Component picker
│   ├── component-styling.tsx # Inline props + theme override
│   ├── full-width-canvas.tsx # Live preview canvas
│   ├── tree-view.tsx
│   └── types.ts            # Includes ComponentThemeOverride
├── components/ui/          # 34 shadcn components
├── renderer/               # Component rendering
│   ├── layout-renderer.tsx
│   └── component-map.tsx
└── lib/                    # Utilities
    ├── binding-engine.ts   # Entity state binding
    ├── theme-presets.ts    # Theme presets
    └── component-registry.ts
```

## Development

```bash
# Install dependencies
npm install

# Dev server with hot reload
npm run dev

# Type check
npm run type-check

# Build production
npm run build
```

## Bundle Size

```
CSS:  36.78 kB │ gzip:  6.19 kB
JS:  338.38 kB │ gzip: 77.34 kB
```

Includes **34 components** + visual editor + theme system with component overrides!

## Credits

- **[shadcn/ui](https://ui.shadcn.com/)** - Component library
- **[Home Assistant](https://www.home-assistant.io/)** - Smart home platform
- **[Preact](https://preactjs.com/)** - Fast React alternative

## License

MIT License - see [LICENSE](LICENSE) for details

---

**Built with love for the Home Assistant community**

*Need help? Open an issue or check the [User Guide](docs/USER_GUIDE.md)*
