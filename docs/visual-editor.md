# Visual Editor Guide

The Shadcn Template Card includes a powerful drag-and-drop visual editor that makes building beautiful Home Assistant dashboards easy—no coding required!

## Table of Contents
- [Getting Started](#getting-started)
- [Interface Overview](#interface-overview)
- [Building Your First Card](#building-your-first-card)
- [Working with Components](#working-with-components)
- [Entity Binding](#entity-binding)
- [Actions & Interactivity](#actions--interactivity)
- [Layout & Positioning](#layout--positioning)
- [Tips & Tricks](#tips--tricks)

---

## Getting Started

### Opening the Editor

1. **Edit your dashboard** (click the pencil icon)
2. **Add a new card** (+ Add Card button)
3. **Search for "Shadcn Template Card"**
4. **Click to add** - The visual editor opens automatically!

### Interface Overview

The editor has **3 main panels**:

```
┌─────────────┬──────────────────────┬─────────────┐
│  Component  │                      │ Properties  │
│   Palette   │    Live Canvas       │   Panel     │
│  (Browse)   │  (Drag & Position)   │  (Configure)│
│             │                      │             │
│  🎨 Button  │  ┌────────────────┐  │ 🔧 Props    │
│  🎨 Card    │  │  [Preview]     │  │ 🔗 Binding  │
│  🎨 Switch  │  │                │  │ ⚡ Actions   │
│  🎨 Slider  │  │  [Grid]        │  │ 📐 Layout   │
│  ...        │  └────────────────┘  │             │
└─────────────┴──────────────────────┴─────────────┘
```

#### 1. Component Palette (Left)
- Browse **75+ shadcn components**
- Organized by category
- **Drag** components onto canvas
- **Search** to find components quickly

#### 2. Live Canvas (Center)
**Split view with resizable divider:**

- **Top: Live Preview**
  - See your card with real entity data
  - Fully interactive (switches work, buttons click)
  - Automatically updates when entities change

- **Bottom: Grid Canvas**
  - 12-column grid for precise positioning
  - **Drag** to move components
  - **Resize** with corner handles
  - Grid snapping for perfect alignment

#### 3. Properties Panel (Right)
**Two modes:**

- **When component selected:** Edit properties
  - Component Props (text, colors, variants)
  - Entity Binding (connect to HA entities)
  - Actions (what happens on click/change)
  - Layout & Alignment controls

- **When nothing selected:** Card configuration
  - **Theme Tab:** Customize colors, radius, spacing
  - **Tree Tab:** View component hierarchy

---

## Building Your First Card

Let's build a **light control card** step-by-step:

### Step 1: Add a Card Container

1. Find **"Card"** in the palette
2. **Drag** onto canvas
3. Click to select it
4. In properties panel:
   - Set **title:** "Living Room"
   - Set **description:** "Control your lights"

### Step 2: Add a Switch

1. Find **"Switch"** in palette
2. **Drag into the card** (you'll see it nested in tree view)
3. Select the switch
4. In **Properties** tab:
   - Set **label:** "Main Light"
5. In **Binding** section:
   - Click **entity picker**
   - Choose `light.living_room`
6. In **Action** section:
   - Select action type: **Toggle**

### Step 3: Add Brightness Slider

1. Drag **"Slider"** into the card
2. Configure properties:
   - **label:** "Brightness"
   - **min:** 0
   - **max:** 100
3. Bind to same entity: `light.living_room`
4. The slider automatically controls brightness!

### Step 4: Test It

- Switch to **Preview** pane (top)
- Toggle the switch → light turns on/off
- Move slider → brightness changes
- It's fully functional!

### Step 5: Save

- Click **Save** or click outside editor
- Changes are automatically saved to your dashboard

---

## Working with Components

### Component Categories

**Interactive Forms:**
- Button, Switch, Slider, Checkbox, RadioGroup, Toggle, Select, Input, Textarea

**Display & Feedback:**
- Alert, Badge, Progress, Skeleton, Separator, Avatar, Label

**Layout Containers:**
- Card, Tabs, Accordion, Collapsible, AspectRatio

**Advanced UI:**
- Dialog, AlertDialog, Sheet, Popover, HoverCard, Tooltip

**Data:**
- Chart, RawHTML

### Adding Components

**Method 1: Drag & Drop**
```
1. Find component in palette
2. Drag onto canvas
3. Drop where you want it
```

**Method 2: Click to Add**
```
1. Click component in palette
2. It appears on canvas
3. Drag to position
```

### Nesting Components

Some components are **containers** that hold other components:

**Card → Switch, Slider, Button**
```yaml
UiCard
├── UiSwitch
├── UiSlider
└── UiButton
```

**Tabs → Multiple Tab Content Areas**
```yaml
UiTabs
├── UiTabsList
│   ├── UiTabsTrigger (Tab 1)
│   └── UiTabsTrigger (Tab 2)
├── UiTabsContent (Content 1)
└── UiTabsContent (Content 2)
```

**To nest components:**
1. Drag child component **onto** the parent
2. Or use **Tree View** to see/reorganize hierarchy
3. Children inherit parent's layout (vertical stack by default)

---

## Entity Binding

Connect components to Home Assistant entities for **live data**:

### Basic Binding

1. **Select component**
2. **Scroll to "Entity Binding" section**
3. **Click entity picker** (or type entity ID)
4. **Choose entity** from list

**What happens:**
- Component shows current entity state
- Updates automatically when state changes
- For switches/sliders: Controls the entity

### Binding Examples

**Switch → Light:**
```
Entity: light.living_room
→ Shows on/off state
→ Toggles light when clicked
```

**Slider → Light Brightness:**
```
Entity: light.living_room
→ Shows current brightness (0-255)
→ Changes brightness when moved
```

**Label → Temperature:**
```
Entity: sensor.temperature
→ Shows current temperature value
→ Updates every time sensor changes
```

**Badge → Door Status:**
```
Entity: binary_sensor.front_door
→ Shows "open" or "closed"
→ Changes color based on state
```

### Advanced Binding

For complex scenarios, you can:
- Bind **multiple components** to same entity
- Use **Jinja templates** in props for custom formatting
- Combine with **Actions** for custom behavior

---

## Actions & Interactivity

Make components **do things** when clicked:

### Action Types

**1. Toggle**
- Toggles entity on/off
- Works with: lights, switches, input_boolean
- Example: Light switch button

**2. Call Service**
- Calls any Home Assistant service
- Customize with service data
- Example: Play media, set thermostat, trigger automation

**3. More Info**
- Opens entity's more-info dialog
- Shows full entity details
- Example: Click sensor to see history graph

**4. Navigate**
- Go to another dashboard/view
- Example: "Open Settings" button

**5. Fire Event**
- Fire custom browser events
- For advanced integrations
- Example: Trigger custom JavaScript

### Configuring Actions

1. **Select component**
2. **Scroll to "Action Configuration"**
3. **Choose action type**
4. **Fill in details:**

**For Call Service:**
```
Service: light.turn_on
Service Data:
  brightness: 255
  color_name: red
```

**For Navigate:**
```
Navigation Path: /lovelace/settings
```

### Multiple Actions

You can add actions to:
- **onClick:** What happens when clicked
- **onChange:** What happens when value changes (sliders, switches)
- **onHover:** What happens on hover (advanced)

---

## Layout & Positioning

### Grid System

The canvas uses a **12-column grid**:

```
┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐
│ │ │ │ │ │ │ │ │ │ │ │ │  Each column = 1 unit
└─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘
 1 2 3 4 5 6 7 8 9 10 11 12
```

**Component sizes:**
- **Full width:** 12 columns (w=12)
- **Half width:** 6 columns (w=6)
- **Third width:** 4 columns (w=4)
- **Quarter width:** 3 columns (w=3)

### Moving Components

**Drag to move:**
1. Click and hold component
2. Drag to new position
3. Grid snaps to nearest position

**Resize:**
1. Select component
2. Drag corner handle
3. Adjust width/height

### Alignment Controls

In **Properties Panel → Layout & Style**:

**Align Self:**
- Start (top)
- Center (middle)
- End (bottom)
- Stretch (fill)

**Justify Self:**
- Start (left)
- Center (middle)
- End (right)
- Stretch (fill)

**Width:**
- Auto (fits content)
- Full (100%)
- Custom (e.g., 200px)

**Spacing:**
- Gap (space between children)
- Margin (space outside)
- Padding (space inside)

### Layout Modes

Components can use different layout modes:

**Grid Mode** (root level)
- Precise x/y positioning
- Drag and resize
- Best for dashboard layout

**Flow Mode** (inside containers)
- Automatic stacking
- Vertical or horizontal
- Best for forms, lists

---

## Tips & Tricks

### 🎯 Pro Tips

**1. Use Tree View for Complex Layouts**
- Click away from components
- Switch to "Tree" tab
- See full hierarchy
- Drag to reorganize

**2. Duplicate Components**
- Select component
- Copy config from Tree view
- Paste and modify
- Saves time for similar items

**3. Test in Preview First**
- Always check Preview pane
- Test actions work
- Verify bindings update
- Ensures quality

**4. Start with Presets**
- Use theme presets (Material, Apple, etc.)
- Customize from there
- Saves design time

**5. Group Related Items**
- Use Card containers
- Keeps organization clean
- Easier to move groups

### ⚡ Keyboard Shortcuts

- **Delete:** Remove selected component
- **Esc:** Deselect component
- **Arrow keys:** Nudge position (when selected)
- **Tab:** Next component
- **Shift+Tab:** Previous component

### 🐛 Troubleshooting

**Component won't drop:**
- Make sure dropping in valid area
- Check if parent accepts children
- Try Tree view instead

**Binding not working:**
- Verify entity ID is correct
- Check entity exists in HA
- Ensure entity is available (not unavailable)

**Action not firing:**
- Check action type is appropriate
- Verify service exists
- Look at browser console for errors

**Layout looks wrong:**
- Check component width settings
- Verify container layout mode
- Reset alignment to defaults

### 🎨 Design Best Practices

**Visual Hierarchy:**
- Use Card components to group related items
- Bigger components = more important
- Consistent spacing between sections

**Color & Theme:**
- Start with a preset theme
- Use primary color for important actions
- Secondary color for less important items
- Keep background/foreground high contrast

**Spacing:**
- Don't cram too much in one card
- Use separators between sections
- Padding creates "breathing room"

**Responsive Design:**
- Test on mobile view
- Full-width components work better on mobile
- Stack vertically for narrow screens

---

## Advanced Features

### Custom Component Props

Every component has **specific properties**:

**Button:**
- variant: default, destructive, outline, ghost
- size: default, sm, lg, icon
- disabled: true/false

**Badge:**
- variant: default, secondary, destructive, outline
- content: Text to display

**Alert:**
- variant: default, destructive
- title: Alert heading
- description: Alert message

### Layout Style System

Fine-tune with **Layout & Style** section:

```yaml
style:
  alignSelf: center      # Vertical alignment
  justifySelf: center    # Horizontal alignment
  width: full            # Width control
  gap: 1rem             # Space between children
  margin: 1rem          # Outer spacing
  padding: 1.5rem       # Inner spacing
```

### Entity State Formatting

Use templates in props:

```yaml
props:
  label: "{{ states('sensor.temperature') }}°C"
  subtitle: "Updated {{ relative_time(states.sensor.temperature.last_changed) }}"
```

---

## Next Steps

- **[Theme System Guide](theme-system.md)** - Customize colors and styling
- **[Component Reference](components/)** - Detailed docs for all 75 components
- **[Examples](examples/)** - Pre-built card templates

**Need help?** Open an issue on GitHub or check the [User Guide](USER_GUIDE.md)

---

**Happy Building!** 🎉
