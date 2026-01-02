# Shadcn Template Card Documentation

A professional Home Assistant dashboard card featuring **45 Shadcn UI components** with full entity binding, theming, and both visual editor and YAML configuration support.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Components](#components)
- [Entity Binding](#entity-binding)
- [Theming](#theming)
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
2. Copy to `/config/www/shadcn-template-card.js`
3. Add resource in Configuration → Dashboards → Resources:
   ```yaml
   url: /local/shadcn-template-card.js
   type: module
   ```

---

## Quick Start

### Visual Editor

1. Edit your dashboard
2. Click "Add Card"
3. Search for "Shadcn Template Card"
4. Use the drag-and-drop editor to add components

### YAML Configuration

```yaml
type: custom:shadcn-template-card
title: My Card
content: |
  <div class="shc-card">
    <div class="shc-card-header">
      <h3 class="shc-card-title">Living Room</h3>
    </div>
    <div class="shc-card-content">
      <button class="shc-switch" data-entity="light.living_room">
        <span class="shc-switch-thumb"></span>
      </button>
    </div>
  </div>
```

---

## Components

All components are based on [shadcn/ui](https://ui.shadcn.com). See their site for live interactive previews.

### [Input Components](./components/input-components.md)

Components for user interaction and entity control.

| Component | Preview | Bindable Domains |
|-----------|:-------:|------------------|
| Button | [![Button](https://ui.shadcn.com/og/button.png)](https://ui.shadcn.com/docs/components/button) | Any (service calls) |
| Switch | [![Switch](https://ui.shadcn.com/og/switch.png)](https://ui.shadcn.com/docs/components/switch) | `light`, `switch`, `fan`, `input_boolean` |
| Slider | [![Slider](https://ui.shadcn.com/og/slider.png)](https://ui.shadcn.com/docs/components/slider) | `light`, `cover`, `fan`, `input_number` |
| Toggle | [![Toggle](https://ui.shadcn.com/og/toggle.png)](https://ui.shadcn.com/docs/components/toggle) | `light`, `switch`, `fan`, `input_boolean` |
| Checkbox | [![Checkbox](https://ui.shadcn.com/og/checkbox.png)](https://ui.shadcn.com/docs/components/checkbox) | `input_boolean`, `switch` |
| Select | [![Select](https://ui.shadcn.com/og/select.png)](https://ui.shadcn.com/docs/components/select) | `input_select`, `climate`, `fan` |
| Input | [![Input](https://ui.shadcn.com/og/input.png)](https://ui.shadcn.com/docs/components/input) | `input_text`, `input_number` |
| Textarea | [![Textarea](https://ui.shadcn.com/og/textarea.png)](https://ui.shadcn.com/docs/components/textarea) | `input_text` |
| Radio Group | [![Radio](https://ui.shadcn.com/og/radio-group.png)](https://ui.shadcn.com/docs/components/radio-group) | `input_select`, `fan`, `climate` |
| **Toggle Group** | [![Toggle](https://ui.shadcn.com/og/toggle-group.png)](https://ui.shadcn.com/docs/components/toggle-group) | Day selection, zones |
| **Combobox** | [![Combobox](https://ui.shadcn.com/og/combobox.png)](https://ui.shadcn.com/docs/components/combobox) | Entity picker (100+) |
| **Input OTP** | [![InputOTP](https://ui.shadcn.com/og/input-otp.png)](https://ui.shadcn.com/docs/components/input-otp) | PIN codes, 2FA |
| **Form** | [![Form](https://ui.shadcn.com/og/form.png)](https://ui.shadcn.com/docs/components/form) | Device wizards |

### [Layout Components](./components/layout-components.md)

Components for organizing and structuring content.

| Component | Preview | Use Case |
|-----------|:-------:|----------|
| Card | [![Card](https://ui.shadcn.com/og/card.png)](https://ui.shadcn.com/docs/components/card) | Device grouping |
| Tabs | [![Tabs](https://ui.shadcn.com/og/tabs.png)](https://ui.shadcn.com/docs/components/tabs) | Room organization |
| Accordion | [![Accordion](https://ui.shadcn.com/og/accordion.png)](https://ui.shadcn.com/docs/components/accordion) | Entity grouping |
| Collapsible | [![Collapsible](https://ui.shadcn.com/og/collapsible.png)](https://ui.shadcn.com/docs/components/collapsible) | Advanced settings |
| Dialog | [![Dialog](https://ui.shadcn.com/og/dialog.png)](https://ui.shadcn.com/docs/components/dialog) | Device settings |
| Sheet | [![Sheet](https://ui.shadcn.com/og/sheet.png)](https://ui.shadcn.com/docs/components/sheet) | Mobile details panel |
| **Drawer** | [![Drawer](https://ui.shadcn.com/og/drawer.png)](https://ui.shadcn.com/docs/components/drawer) | Mobile pull-up actions |
| Popover | [![Popover](https://ui.shadcn.com/og/popover.png)](https://ui.shadcn.com/docs/components/popover) | Quick actions |
| Separator | [![Separator](https://ui.shadcn.com/og/separator.png)](https://ui.shadcn.com/docs/components/separator) | Section dividers |
| Skeleton | [![Skeleton](https://ui.shadcn.com/og/skeleton.png)](https://ui.shadcn.com/docs/components/skeleton) | Loading states |
| Aspect Ratio | [![AspectRatio](https://ui.shadcn.com/og/aspect-ratio.png)](https://ui.shadcn.com/docs/components/aspect-ratio) | Camera feeds |
| **Breadcrumb** | [![Breadcrumb](https://ui.shadcn.com/og/breadcrumb.png)](https://ui.shadcn.com/docs/components/breadcrumb) | Navigation trail |
| **Pagination** | [![Pagination](https://ui.shadcn.com/og/pagination.png)](https://ui.shadcn.com/docs/components/pagination) | Page navigation |
| **Scroll Area** | [![ScrollArea](https://ui.shadcn.com/og/scroll-area.png)](https://ui.shadcn.com/docs/components/scroll-area) | Scrollable content |

### [Feedback Components](./components/feedback-components.md)

Components for displaying status and information.

| Component | Preview | Use Case |
|-----------|:-------:|----------|
| Alert | [![Alert](https://ui.shadcn.com/og/alert.png)](https://ui.shadcn.com/docs/components/alert) | System notifications |
| Badge | [![Badge](https://ui.shadcn.com/og/badge.png)](https://ui.shadcn.com/docs/components/badge) | Status indicators |
| Progress | [![Progress](https://ui.shadcn.com/og/progress.png)](https://ui.shadcn.com/docs/components/progress) | Battery, downloads |
| Label | [![Label](https://ui.shadcn.com/og/label.png)](https://ui.shadcn.com/docs/components/label) | Sensor readings |
| Tooltip | [![Tooltip](https://ui.shadcn.com/og/tooltip.png)](https://ui.shadcn.com/docs/components/tooltip) | Icon explanations |
| Hover Card | [![HoverCard](https://ui.shadcn.com/og/hover-card.png)](https://ui.shadcn.com/docs/components/hover-card) | Entity previews |
| Alert Dialog | [![AlertDialog](https://ui.shadcn.com/og/alert-dialog.png)](https://ui.shadcn.com/docs/components/alert-dialog) | Confirmations |
| **Spinner** | [![Loading](https://ui.shadcn.com/og/spinner.png)](https://ui.shadcn.com/docs/components/spinner) | Loading indicator |

### [Navigation Components](./components/navigation-components.md)

Components for menus and navigation.

| Component | Preview | Use Case |
|-----------|:-------:|----------|
| **Dropdown Menu** | [![DropdownMenu](https://ui.shadcn.com/og/dropdown-menu.png)](https://ui.shadcn.com/docs/components/dropdown-menu) | Device actions, overflow menus |
| **Context Menu** | [![ContextMenu](https://ui.shadcn.com/og/context-menu.png)](https://ui.shadcn.com/docs/components/context-menu) | Right-click power actions |

### [Data Components](./components/data-components.md)

Components for data visualization.

| Component | Preview | Bindable Domains |
|-----------|:-------:|------------------|
| Avatar | [![Avatar](https://ui.shadcn.com/og/avatar.png)](https://ui.shadcn.com/docs/components/avatar) | `person`, `device_tracker` |
| Chart | [![Chart](https://ui.shadcn.com/og/chart.png)](https://ui.shadcn.com/docs/components/chart) | `sensor`, `number`, `counter` |
| **Table** | [![Table](https://ui.shadcn.com/og/table.png)](https://ui.shadcn.com/docs/components/table) | Device inventory, logs |
| **Calendar** | [![Calendar](https://ui.shadcn.com/og/calendar.png)](https://ui.shadcn.com/docs/components/calendar) | Automation scheduling |
| **Carousel** | [![Carousel](https://ui.shadcn.com/og/carousel.png)](https://ui.shadcn.com/docs/components/carousel) | Camera feeds, galleries |

---

## Entity Binding

Bind components to Home Assistant entities for automatic state updates and actions.

### Basic Binding

```yaml
content: |
  <button class="shc-switch" data-entity="light.kitchen">
    <span class="shc-switch-thumb"></span>
  </button>
```

### Binding with Custom Service

```yaml
content: |
  <button
    class="shc-btn"
    data-entity="script.good_morning"
    data-action="script.turn_on"
  >
    Good Morning
  </button>
```

### Binding with State Display (Jinja2)

```yaml
content: |
  <span class="shc-badge" data-entity="sensor.temperature">
    {{ states('sensor.temperature') }}°C
  </span>
```

### Data Attributes Reference

| Attribute | Description |
|-----------|-------------|
| `data-entity` | Entity ID to bind |
| `data-action` | Service to call |
| `data-attribute` | Attribute for service data |
| `data-state` | Current state indicator |

---

## Theming

The card automatically inherits Home Assistant theme variables.

### CSS Variables

| Variable | Description |
|----------|-------------|
| `--primary` | Primary brand color |
| `--secondary` | Secondary color |
| `--destructive` | Error/danger color |
| `--muted` | Subtle backgrounds |
| `--accent` | Highlight color |
| `--background` | Card background |
| `--foreground` | Text color |
| `--border` | Border color |
| `--success` | Success/green |
| `--warning` | Warning/yellow |
| `--info` | Info/blue |

---

## Examples

See the [Examples Gallery](./examples/README.md) for complete dashboard configurations:

- Climate Control Panel
- Lighting Dashboard
- Security System
- Media Player Card
- Energy Monitor
- Room Overview

---

## Support

- [GitHub Issues](https://github.com/johnneerdael/shadcn-template-card/issues)
- [Home Assistant Community](https://community.home-assistant.io/)

---

## License

MIT License - see [LICENSE](../LICENSE) for details.
