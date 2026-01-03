# Visual Editor Guide

The Shadcn Template Card includes a powerful visual editor that makes building beautiful Home Assistant dashboards easy—no coding required!

## Table of Contents
- [Getting Started](#getting-started)
- [Interface Overview](#interface-overview)
- [Building Your First Card](#building-your-first-card)
- [Working with Components](#working-with-components)
- [Entity Binding](#entity-binding)
- [Actions & Interactivity](#actions--interactivity)
- [Theme Overrides](#theme-overrides)
- [Layout & Positioning](#layout--positioning)
- [Tips & Tricks](#tips--tricks)

---

## Getting Started

### Opening the Editor

1. **Edit your dashboard** (click the pencil icon)
2. **Add a new card** (+ Add Card button)
3. **Search for "Shadcn Template Card"**
4. **Click to add** - The visual editor opens automatically!

### Interface Overview (v2.2.0)

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

#### 1. Card Theme (Top Bar)
- **Collapsible row** with global theme settings
- Set **Primary, Secondary, Background, Foreground** colors
- Configure **Border Radius, Gap, Padding**
- Click chevron to collapse when not needed

#### 2. Horizontal Component Picker
- **Full-width** component picker organized by category
- **One row per category**: Layout, Input, Feedback, Data
- **Click to add** - Component appears in canvas and is auto-selected

#### 3. Component Styling Panel
- **Only appears when a component is selected**
- Shows component **icon, name, entity binding, action selector**
- **Props row** - Component-specific properties (label, variant, size, etc.)
- **Theme Override row** - Click 🎨 to override card theme for this component

#### 4. Full-Width Canvas
- **Live preview** with actual entity data
- **Click to select** components
- **Drag to reposition** components
- **Resize handles** on selected components
- **Delete button** (×) on hover/selection

---

## Building Your First Card

Let's build a **light control card** step-by-step:

### Step 1: Set Card Theme

1. Look at the **Card Theme** row at the top
2. Click color pickers to choose your colors
3. Set **Radius** (0 = sharp, 1 = rounded)
4. Set **Gap** and **Padding** for spacing

### Step 2: Add a Button

1. Find **"Button"** in the Input row of the picker
2. **Click it** - Button appears in canvas and is selected
3. The **Component Styling panel** appears above the canvas:
   - Set **label**: "Toggle Light"
   - Choose **entity**: `light.living_room`
   - Set **action**: Toggle

### Step 3: Add a Switch

1. Click **"Switch"** in the picker
2. It's auto-selected, so configure it:
   - **label**: "Main Light"
   - **entity**: `light.living_room`
   - **action**: Toggle

### Step 4: Add a Slider for Brightness

1. Click **"Slider"** in the picker
2. Configure:
   - **label**: "Brightness"
   - **min**: 0, **max**: 100
   - **entity**: `light.living_room`

### Step 5: Make the Button Stand Out

1. Click the button in the canvas to select it
2. Click the **🎨 palette button** in the styling panel
3. The **Theme Override** row appears
4. Click the **Primary** color and change it to red (#ef4444)
5. Now this button has a red theme while others use card theme!

### Step 6: Test It

- Toggle the switch → light turns on/off
- Move slider → brightness changes
- Click button → light toggles
- It's fully functional!

---

## Working with Components

### Component Categories

**Layout:**
- Grid, Card, Tabs, Accordion, Collapsible, AspectRatio, ScrollArea, Separator

**Input:**
- Button, Switch, Slider, Checkbox, RadioGroup, Toggle, Select, Input, Textarea, Combobox

**Feedback:**
- Alert, Badge, Progress, Skeleton, Avatar, Label, Toast

**Data:**
- Chart, Table, Command, RawHTML

### Adding Components

**Click in Picker:**
1. Find component in horizontal picker
2. Click it
3. Component appears in canvas, auto-selected
4. Configure in styling panel above

### Selecting Components

**In Canvas:**
- Click any component to select it
- Selection shows with highlight ring
- Component name label appears on hover/selection
- Delete button (×) appears top-right

**Deselecting:**
- Click empty area in canvas
- Or click the × button in styling panel

### Deleting Components

- **From canvas:** Click × button on selected component
- **From styling panel:** Click trash icon (🗑)

---

## Entity Binding

Connect components to Home Assistant entities for **live data**:

### Binding in Component Styling

1. **Select component** in canvas
2. In the styling panel, find the **entity picker** (with link icon)
3. **Type or select** entity ID
4. Component now shows live entity state!

### Binding Examples

| Component | Entity | Behavior |
|-----------|--------|----------|
| Switch | `light.living_room` | Shows on/off, toggles when clicked |
| Slider | `light.living_room` | Shows brightness, changes when moved |
| Label | `sensor.temperature` | Shows current value |
| Badge | `binary_sensor.door` | Shows open/closed state |
| Progress | `sensor.battery` | Shows battery percentage |

---

## Actions & Interactivity

### Action Types

Select from the **Action dropdown** in the styling panel:

| Action | Description | Use Case |
|--------|-------------|----------|
| **Toggle** | Turn entity on/off | Lights, switches, fans |
| **Service** | Call any HA service | Custom automations |
| **Info** | Open more-info dialog | Show entity details |
| **Navigate** | Go to another view | Dashboard navigation |

### Configuring Actions

1. Select component
2. Choose action type from dropdown
3. For **Service**: Additional service input appears
4. For **Navigate**: Enter the path

---

## Theme Overrides

**NEW in v2.2.0:** Override card theme on individual components!

### How It Works

1. **Card Theme** (top bar) = Global defaults for all components
2. **Component Theme Override** = Per-component overrides

### Using Theme Overrides

1. **Select a component** in the canvas
2. **Click the 🎨 palette button** in the styling panel
3. **Theme Override row** appears with color pickers

### Visual Indicators

| State | Appearance |
|-------|------------|
| **Inherited** | Color picker is faded/dim |
| **Overridden** | Color picker has primary border + small × to clear |

### Override Options

- **Primary** - Override primary color
- **Secondary** - Override secondary color
- **BG** - Override background color
- **FG** - Override foreground/text color
- **Radius** - Override border radius (in rem)

### Clearing Overrides

- **Single override:** Click the small × on that color
- **All overrides:** Click "Clear all" link

### Example: Alert Button

Make a destructive button stand out:

```yaml
component: UiButton
props:
  label: Delete All
  variant: destructive
themeOverride:
  primary: '#dc2626'    # Red instead of card's blue
  radius: '0.25rem'     # Sharper than card's default
```

---

## Layout & Positioning

### Grid System

The canvas uses a **12-column grid**:

```
┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐
│1│2│3│4│5│6│7│8│9│10│11│12│
└─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘
```

**Component sizes:**
- **Full width:** 12 columns
- **Half width:** 6 columns
- **Third width:** 4 columns
- **Quarter width:** 3 columns

### Moving Components

1. **Click and hold** component in canvas
2. **Drag** to new position
3. Grid snaps automatically

### Resizing Components

1. **Select** component
2. **Drag corner handle** (bottom-right)
3. Resize width and height

---

## Tips & Tricks

### Pro Tips

**1. Set Card Theme First**
- Define your color scheme before adding components
- All components will inherit these defaults

**2. Use Theme Overrides Sparingly**
- Override only for emphasis (alerts, CTAs)
- Too many overrides = visual chaos

**3. Test Actions Immediately**
- Canvas is live - actions work!
- Verify toggle/service calls function

**4. Collapse What You Don't Need**
- Collapse Card Theme row when done
- More canvas space for editing

### Keyboard Shortcuts

- **Click** - Select component
- **Delete button** - Remove component
- **Esc** - Deselect (click empty area)

### Troubleshooting

**Component won't add:**
- Ensure you clicked the component button
- Check canvas for newly added component (may be at bottom)

**Binding not working:**
- Verify entity ID is correct
- Check entity exists in HA
- Ensure entity is not "unavailable"

**Theme override not showing:**
- Click the 🎨 button to expand override row
- Override row only shows when component is selected

**Layout looks wrong:**
- Check component width (drag to resize)
- Verify no overlapping components

---

## Advanced Features

### Component Props by Type

**Button:**
- variant: default, destructive, outline, secondary, ghost, link
- size: default, sm, lg, icon

**Badge:**
- variant: default, secondary, destructive, outline

**Alert:**
- variant: default, destructive

**Progress:**
- value: 0-100

### Config Format

The visual editor generates this YAML:

```yaml
type: custom:shadcn-template-card
theme:
  primary: '#0070f3'
  secondary: '#7c3aed'
  background: '#ffffff'
  foreground: '#000000'
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
    themeOverride:
      primary: '#ef4444'
```

---

## Next Steps

- **[Theme System Guide](theme-system.md)** - Deep dive into theming
- **[Component Reference](components/)** - All component props documented
- **[Examples](examples/)** - Pre-built card templates

**Need help?** Open an issue on GitHub or check the [User Guide](USER_GUIDE.md)

---

**Happy Building!**
