# Shadcn Template Card User Guide

A professional Home Assistant dashboard card featuring **34 Shadcn UI components** with a visual drag-and-drop editor, entity binding, and powerful theming system.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Visual Editor (v2.2.0)](#visual-editor-v220)
- [Components](#components)
- [Entity Binding](#entity-binding)
- [Theming](#theming)
- [Actions](#actions)
- [Examples](#examples)

---

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant
2. Go to "Frontend" → "Custom repositories"
3. Add: `https://github.com/johnneerdael/shadcn-template-card`
4. Install "Shadcn Template Card"
5. Refresh your browser

### Manual Installation

1. Download `shadcn-template-card.js` from the [latest release](https://github.com/johnneerdael/shadcn-template-card/releases)
2. Copy to `/config/www/shadcn-template-card/`
3. Add resource in Configuration → Dashboards → Resources:
   ```yaml
   url: /local/shadcn-template-card/shadcn-template-card.js
   type: module
   ```

---

## Quick Start

### Using the Visual Editor

1. **Edit your dashboard** (click the pencil icon)
2. **Add Card** → Search for "Shadcn Template Card"
3. The visual editor opens automatically
4. **Set your theme** at the top (colors, radius, spacing)
5. **Add components** by clicking in the horizontal picker
6. **Configure components** by selecting them in the canvas
7. **Drag to reposition** and resize as needed

### YAML Configuration

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
  - i: button-1
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
```

---

## Visual Editor (v2.2.0)

The editor uses a **vertical flow layout**:

```
┌──────────────────────────────────────────────────────────────┐
│ Visual Editor                                       1 comp   │
├──────────────────────────────────────────────────────────────┤
│ Card Theme: [■Pri] [■Sec] [■BG] [■FG] Radius Gap Padding    │  ← 1. Global Theme
├──────────────────────────────────────────────────────────────┤
│ Layout: Grid Card │ Input: Button Switch Slider Checkbox... │  ← 2. Component Picker
├──────────────────────────────────────────────────────────────┤
│ [Icon] Button │ [Entity▼] │ [Action▼] │ [🎨] │ [🗑] [×]     │  ← 3. Component Styling
│ Props: label [Click me] variant [default▼] size [default▼]  │     (when selected)
│ Theme Override: [■Pri] [■Sec] [■BG] [■FG] Radius [0.5] rem  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                  FULL-WIDTH LIVE CANVAS                      │  ← 4. Canvas
│              (Click components to select them)               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 1. Card Theme (Top Bar)

Set your global theme that all components inherit:
- **Primary** - Main brand color (buttons, active states)
- **Secondary** - Accent color (badges, secondary buttons)
- **BG** - Background color
- **FG** - Foreground/text color
- **Radius** - Border roundness (0 = sharp, 1 = rounded)
- **Gap** - Space between elements
- **Padding** - Space inside containers

### 2. Horizontal Component Picker

One row per category:
- **Layout**: Grid, Card, Tabs, Accordion, Collapsible, etc.
- **Input**: Button, Switch, Slider, Checkbox, Select, Input, etc.
- **Feedback**: Alert, Badge, Progress, Skeleton, Avatar, etc.
- **Data**: Chart, Table, Command, RawHTML

Click any component to add it to the canvas.

### 3. Component Styling Panel

Appears when a component is selected:
- **Entity binding** - Connect to Home Assistant entity
- **Action** - What happens on tap (toggle, service, info, navigate)
- **Props** - Component-specific properties
- **Theme Override** (🎨) - Override card theme for this component only

### 4. Full-Width Canvas

Live preview of your card:
- Click to select components
- Drag to reposition
- Resize handles on selected components
- Delete button (×) on selection

---

## Components

All components are based on [shadcn/ui](https://ui.shadcn.com).

### Input Components

| Component | Bindable Domains | Use Case |
|-----------|------------------|----------|
| Button | Any | Service calls, actions |
| Switch | `light`, `switch`, `fan` | Toggle entities |
| Slider | `light`, `cover`, `fan` | Brightness, position |
| Checkbox | `input_boolean`, `switch` | Binary toggles |
| Toggle | `light`, `switch`, `fan` | Toggle with label |
| Select | `input_select`, `climate` | Option selection |
| Input | `input_text`, `input_number` | Text entry |
| Textarea | `input_text` | Multi-line text |
| RadioGroup | `input_select`, `fan` | Single selection |
| Combobox | Any | Searchable select |

### Layout Components

| Component | Use Case |
|-----------|----------|
| Card | Device grouping, sections |
| Tabs | Room/mode organization |
| Accordion | Collapsible groups |
| Collapsible | Advanced settings |
| AspectRatio | Camera feeds, images |
| ScrollArea | Long content |
| Separator | Section dividers |

### Feedback Components

| Component | Use Case |
|-----------|----------|
| Alert | Notifications, warnings |
| Badge | Status indicators |
| Progress | Battery, download progress |
| Skeleton | Loading states |
| Avatar | Person icons |
| Label | Sensor readings, text |
| Toast | Temporary notifications |

### Data Components

| Component | Use Case |
|-----------|----------|
| Chart | Sensor history graphs |
| Table | Entity lists, logs |
| Command | Search/command palette |
| RawHTML | Custom HTML content |

---

## Entity Binding

Connect components to Home Assistant entities for live data.

### In Visual Editor

1. Select a component in the canvas
2. Use the entity picker dropdown
3. Choose your entity

### In YAML

```yaml
layout:
  - component: UiSwitch
    bind: light.living_room
    props:
      label: Living Room Light
```

### Binding Behavior

| Component | Entity Type | Behavior |
|-----------|-------------|----------|
| Switch | light/switch | Shows on/off, toggles |
| Slider | light | Shows/sets brightness |
| Progress | sensor | Shows numeric value as % |
| Badge | binary_sensor | Shows state text |
| Label | sensor | Shows state value |

---

## Theming

### Two-Level Theme System (v2.2.0)

**Level 1: Card Theme (Global)**
```yaml
theme:
  primary: '#0070f3'     # Main brand color
  secondary: '#7c3aed'   # Accent color
  background: '#ffffff'  # Card surface
  foreground: '#000000'  # Text color
  radius: '0.5rem'       # Border roundness
  spacing:
    gap: '0.5rem'        # Between elements
    padding: '1rem'      # Inside containers
```

**Level 2: Component Theme Override**
```yaml
layout:
  - component: UiButton
    props:
      label: Delete
    themeOverride:
      primary: '#ef4444'   # Red instead of card's blue
      radius: '0.25rem'    # Sharper than card's default
```

### Theme Inheritance

```
DEFAULTS → CARD THEME → COMPONENT themeOverride
```

Components inherit from card theme, which inherits from defaults. Component-level overrides take highest priority.

### Using Theme Overrides in Visual Editor

1. Select a component in the canvas
2. Click the **🎨 palette button**
3. Override any theme property
4. Visual indicators:
   - **Faded** = inherited from card
   - **Solid with border** = overridden
   - **Small ×** = click to clear override

---

## Actions

### Action Types

| Type | Description |
|------|-------------|
| `toggle` | Turn entity on/off |
| `call-service` | Call any HA service |
| `more-info` | Open entity dialog |
| `navigate` | Go to another view |

### In Visual Editor

1. Select component
2. Choose action from dropdown
3. For services, additional fields appear

### In YAML

```yaml
layout:
  - component: UiButton
    bind: light.bedroom
    action:
      type: toggle
    props:
      label: Toggle Light

  - component: UiButton
    action:
      type: call-service
      service: script.good_morning
    props:
      label: Good Morning

  - component: UiButton
    action:
      type: navigate
      navigation_path: /lovelace/settings
    props:
      label: Settings
```

---

## Examples

### Simple Light Control

```yaml
type: custom:shadcn-template-card
theme:
  primary: '#f59e0b'
  radius: '0.75rem'
layout:
  - i: switch-1
    x: 0
    y: 0
    w: 6
    h: 2
    component: UiSwitch
    bind: light.living_room
    action:
      type: toggle
    props:
      label: Living Room

  - i: slider-1
    x: 6
    y: 0
    w: 6
    h: 2
    component: UiSlider
    bind: light.living_room
    props:
      min: 0
      max: 100
```

### Status Dashboard with Theme Overrides

```yaml
type: custom:shadcn-template-card
theme:
  primary: '#3b82f6'
  radius: '0.25rem'
layout:
  - component: UiBadge
    bind: binary_sensor.front_door
    props:
      children: Front Door
    themeOverride:
      primary: '#10b981'  # Green for security

  - component: UiBadge
    bind: sensor.battery
    props:
      children: Battery
    themeOverride:
      primary: '#f59e0b'  # Orange for battery

  - component: UiButton
    props:
      label: Emergency Stop
    themeOverride:
      primary: '#dc2626'  # Red for alerts
```

### See More Examples

- **[Visual Editor Guide](./visual-editor.md)** - Complete editor tutorial
- **[Theme System](./theme-system.md)** - Advanced theming guide
- **[Examples Gallery](./examples/)** - Pre-built card templates

---

## Troubleshooting

### Component not updating

- Check entity ID is correct
- Verify entity is not "unavailable"
- Refresh the page

### Theme not applying

- Check hex color format (#rrggbb)
- Refresh browser if needed
- Clear browser cache

### Canvas empty

- Add components from the horizontal picker
- Check browser console for errors

### Actions not working

- Verify entity binding is set
- Check action type is appropriate for entity
- Test service in Developer Tools first

---

## Support

- [GitHub Issues](https://github.com/johnneerdael/shadcn-template-card/issues)
- [Home Assistant Community](https://community.home-assistant.io/)

---

## License

MIT License - see [LICENSE](../LICENSE) for details.
