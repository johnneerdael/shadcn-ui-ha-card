# New Components Reference

This document covers the **advanced components** in Shadcn Template Card (34 total components with 85+ variants).

> **v2.2.0 Note:** All components now support **per-component theme overrides**. See [Theme System](theme-system.md) for details.

---

## Table of Contents

1. [AspectRatio](#aspectratio)
2. [Chart](#chart)
3. [Collapsible](#collapsible)
4. [Accordion](#accordion)
5. [Tooltip](#tooltip)
6. [Popover](#popover)
7. [HoverCard](#hovercard)
8. [Dialog](#dialog)
9. [AlertDialog](#alertdialog)
10. [Sheet](#sheet)

---

## AspectRatio

Maintains aspect ratio for child content (useful for images, videos, maps).

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ratio` | number | 1 | Aspect ratio (e.g., 16/9, 4/3, 1/1) |

### Example

```yaml
- component: UiAspectRatio
  props:
    ratio: 1.777  # 16:9
  children:
    - component: UiRawHTML
      props:
        content: <img src="..." />
```

### Use Cases

- Video players (16:9)
- Square images (1:1)
- Maps (4:3)
- Responsive images

---

## Chart

Simple bar chart visualization for sensor data.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | 'bar' | Chart type (bar, line, pie) |
| `data` | array | [] | Chart data points |
| `title` | string | - | Chart title |

### Data Format

```typescript
data: [
  { label: 'Mon', value: 23 },
  { label: 'Tue', value: 25 },
  { label: 'Wed', value: 21 }
]
```

### Example

```yaml
- component: UiChart
  props:
    title: "Temperature This Week"
    type: bar
    data:
      - label: Mon
        value: 23
      - label: Tue
        value: 25
      - label: Wed
        value: 21
```

### Use Cases

- Energy consumption
- Temperature trends
- Humidity levels
- Quick data visualization

---

## Collapsible

Show/hide content with smooth transitions.

### Components

- **Collapsible** - Container
- **CollapsibleTrigger** - Button to toggle
- **CollapsibleContent** - Content to show/hide

### Props

**Collapsible:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | - | Controlled open state |
| `defaultOpen` | boolean | false | Default open state |
| `onOpenChange` | function | - | Change handler |

### Example

```yaml
- component: UiCollapsible
  props:
    defaultOpen: false
  children:
    - component: UiCollapsibleTrigger
      children:
        - component: UiButton
          props:
            content: "Show Details"

    - component: UiCollapsibleContent
      children:
        - component: UiLabel
          props:
            content: "Hidden details here..."
```

### Use Cases

- Expandable sections
- "Show more" information
- Settings panels
- FAQ items

---

## Accordion

Collapsible sections with exclusive expansion (only one open at a time).

### Components

- **Accordion** - Container
- **AccordionItem** - Single accordion section
- **AccordionTrigger** - Button to toggle section
- **AccordionContent** - Content of section

### Props

**Accordion:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | 'single' | 'single' or 'multiple' expansion |
| `value` | string/array | - | Currently open item(s) |
| `defaultValue` | string/array | - | Default open item(s) |

**AccordionItem:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | string | Yes | Unique identifier |

### Example

```yaml
- component: UiAccordion
  props:
    type: single
    defaultValue: item-1
  children:
    - component: UiAccordionItem
      props:
        value: item-1
      children:
        - component: UiAccordionTrigger
          props:
            content: "Section 1"
        - component: UiAccordionContent
          children:
            - component: UiLabel
              props:
                content: "Content 1"

    - component: UiAccordionItem
      props:
        value: item-2
      children:
        - component: UiAccordionTrigger
          props:
            content: "Section 2"
        - component: UiAccordionContent
          children:
            - component: UiLabel
              props:
                content: "Content 2"
```

### Use Cases

- Settings sections
- FAQ pages
- Multi-step forms
- Category browsers

---

## Tooltip

Simple hover tooltip (CSS-only, no portals).

### Props

| Prop | Type | Description |
|------|------|-------------|
| `content` | string | Tooltip text to display |

### Example

```yaml
- component: UiTooltip
  props:
    content: "This is a helpful tip"
  children:
    - component: UiButton
      props:
        content: "Hover me"
```

### Use Cases

- Icon buttons (explain what they do)
- Abbreviated labels
- Helper text
- Quick explanations

### Limitations

- CSS-only (no advanced positioning)
- Simple text only
- Fixed position (above trigger)

---

## Popover

Click-triggered floating content.

### Components

- **Popover** - Container
- **PopoverTrigger** - Button to open
- **PopoverContent** - Content to display

### Props

**Popover:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | - | Controlled open state |
| `defaultOpen` | boolean | false | Default open state |

**PopoverContent:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | string | 'center' | Alignment (start, center, end) |
| `side` | string | 'bottom' | Side (top, right, bottom, left) |

### Example

```yaml
- component: UiPopover
  children:
    - component: UiPopoverTrigger
      children:
        - component: UiButton
          props:
            content: "Open Menu"

    - component: UiPopoverContent
      props:
        align: center
        side: bottom
      children:
        - component: UiLabel
          props:
            content: "Menu items here"
```

### Use Cases

- Context menus
- Dropdown menus
- Action panels
- Quick settings

---

## HoverCard

Hover-triggered floating content (similar to Popover but on hover).

### Components

- **HoverCard** - Container
- **HoverCardTrigger** - Element to hover
- **HoverCardContent** - Content to display

### Props

**HoverCardContent:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | string | 'center' | Alignment |
| `side` | string | 'bottom' | Side |

### Example

```yaml
- component: UiHoverCard
  children:
    - component: UiHoverCardTrigger
      children:
        - component: UiLabel
          props:
            content: "@username"

    - component: UiHoverCardContent
      props:
        align: center
      children:
        - component: UiCard
          children:
            - component: UiLabel
              props:
                content: "User profile preview"
```

### Use Cases

- User profile previews
- Entity information
- Link previews
- Rich tooltips

---

## Dialog

Modal dialog overlay.

### Components

- **Dialog** - Container
- **DialogTrigger** - Button to open
- **DialogContent** - Modal content
- **DialogHeader** - Header section
- **DialogTitle** - Title text
- **DialogDescription** - Description text
- **DialogFooter** - Footer section (buttons)

### Props

**Dialog:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | - | Controlled open state |
| `defaultOpen` | boolean | false | Default open state |

### Example

```yaml
- component: UiDialog
  children:
    - component: UiDialogTrigger
      children:
        - component: UiButton
          props:
            content: "Open Settings"

    - component: UiDialogContent
      children:
        - component: UiDialogHeader
          children:
            - component: UiDialogTitle
              props:
                content: "Settings"
            - component: UiDialogDescription
              props:
                content: "Configure your preferences"

        - component: UiLabel
          props:
            content: "Settings content here"

        - component: UiDialogFooter
          children:
            - component: UiButton
              props:
                content: "Save"
```

### Use Cases

- Settings modals
- Form dialogs
- Confirmations
- Detail views

---

## AlertDialog

Confirmation dialog (similar to Dialog but for important actions).

### Components

- **AlertDialog** - Container
- **AlertDialogTrigger** - Button to open
- **AlertDialogContent** - Modal content
- **AlertDialogHeader** - Header section
- **AlertDialogTitle** - Title
- **AlertDialogDescription** - Description
- **AlertDialogFooter** - Footer
- **AlertDialogAction** - Confirm button
- **AlertDialogCancel** - Cancel button

### Example

```yaml
- component: UiAlertDialog
  children:
    - component: UiAlertDialogTrigger
      children:
        - component: UiButton
          props:
            content: "Delete"
            variant: destructive

    - component: UiAlertDialogContent
      children:
        - component: UiAlertDialogHeader
          children:
            - component: UiAlertDialogTitle
              props:
                content: "Are you sure?"
            - component: UiAlertDialogDescription
              props:
                content: "This action cannot be undone."

        - component: UiAlertDialogFooter
          children:
            - component: UiAlertDialogCancel
              children:
                - component: UiButton
                  props:
                    content: "Cancel"
                    variant: outline

            - component: UiAlertDialogAction
              children:
                - component: UiButton
                  props:
                    content: "Delete"
                    variant: destructive
              action:
                type: call-service
                service: script.delete_item
```

### Use Cases

- Delete confirmations
- Destructive actions
- Important warnings
- Final confirmations

---

## Sheet

Side drawer/panel that slides in from edge.

### Components

- **Sheet** - Container
- **SheetTrigger** - Button to open
- **SheetContent** - Drawer content
- **SheetHeader** - Header section
- **SheetTitle** - Title
- **SheetDescription** - Description
- **SheetFooter** - Footer section

### Props

**SheetContent:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | string | 'right' | Side (top, right, bottom, left) |

### Example

```yaml
- component: UiSheet
  children:
    - component: UiSheetTrigger
      children:
        - component: UiButton
          props:
            content: "Open Menu"

    - component: UiSheetContent
      props:
        side: right
      children:
        - component: UiSheetHeader
          children:
            - component: UiSheetTitle
              props:
                content: "Navigation"
            - component: UiSheetDescription
              props:
                content: "Quick access menu"

        - component: UiLabel
          props:
            content: "Menu items..."

        - component: UiSheetFooter
          children:
            - component: UiButton
              props:
                content: "Close"
```

### Use Cases

- Navigation drawers
- Side panels
- Filter menus
- Mobile menus

**Sides:**
- `right` - Slides from right (default)
- `left` - Slides from left
- `top` - Slides from top
- `bottom` - Slides from bottom

---

## Comparison Chart

| Component | Trigger | Display | Best For |
|-----------|---------|---------|----------|
| **Tooltip** | Hover | Above element | Quick tips |
| **HoverCard** | Hover | Floating card | Rich previews |
| **Popover** | Click | Floating panel | Menus, options |
| **Dialog** | Click | Center modal | Settings, forms |
| **AlertDialog** | Click | Center modal | Confirmations |
| **Sheet** | Click | Side drawer | Navigation, panels |
| **Collapsible** | Click | Inline expand | Simple sections |
| **Accordion** | Click | Exclusive expand | Multiple sections |

---

## General Tips

### Shadow DOM Compatibility

All components work in Shadow DOM (no portals):
- ✅ Use absolute positioning within shadow root
- ✅ Click-outside detection works
- ✅ Escape key closes modals
- ❌ No focus trap (limitation)
- ❌ No advanced positioning calculations

### Styling

All components respect theme variables:
- `--primary` - Main color
- `--secondary` - Accent color
- `--background` - Surface color
- `--foreground` - Text color
- `--radius` - Border radius

### Accessibility

- Proper ARIA roles
- Keyboard navigation (Escape, Tab)
- Screen reader support
- Focus management

---

## Next Steps

- **[Visual Editor](visual-editor.md)** - How to add these components
- **[Theme System](theme-system.md)** - Customize their appearance
- **[Examples](examples/)** - See them in action

---

**All 34 components documented!**

## Using Theme Overrides

Every component supports per-component theme overrides (v2.2.0+):

```yaml
- component: UiDialog
  themeOverride:
    primary: '#ef4444'    # Red accent for this dialog
    radius: '0.25rem'     # Sharper corners
  children:
    - component: UiDialogTrigger
      # ...
```

See [Theme System](theme-system.md) for complete documentation. 🎉
