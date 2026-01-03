# Theme System Guide

The Shadcn Template Card includes a powerful theming system with **card-level themes** and **component-level overrides**.

## Philosophy

Following shadcn/ui's approach: **"You're not just toggling settings—you're adjusting the DNA of the components."**

Instead of pre-packaged themes you can't modify, you get direct control over:
- CSS Variables that define component colors
- Border radius for visual personality
- Spacing for layout breathing room
- **NEW in v2.2.0:** Per-component theme overrides

**Result:** Every card—and even every component—can have a unique, professional look.

---

## Two-Level Theme System

### Level 1: Card Theme (Global)

Set in the **Card Theme row** at the top of the editor:

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

All components inherit these values by default.

### Level 2: Component Theme Override (NEW!)

Override any theme property for **individual components**:

```yaml
layout:
  - i: button-1
    component: UiButton
    props:
      label: Alert Action
    themeOverride:
      primary: '#ef4444'   # Red instead of card's blue
      radius: '0.25rem'    # Sharper than card's default
```

This button will be red while other components stay blue.

---

## Using the Theme Editor

### Card Theme (Top Bar)

1. Open the card editor
2. Look at the **Card Theme** row at the top
3. Set your global colors and spacing
4. Click chevron to collapse when done

**Controls:**
- **Primary** - Click color picker to choose
- **Secondary** - Complementary color
- **BG** - Background color
- **FG** - Foreground/text color
- **Radius** - Number input (0-1 rem)
- **Gap** - Space between elements
- **Padding** - Space inside containers

### Component Theme Override

1. **Select a component** in the canvas
2. Click the **🎨 palette button** in the styling panel
3. **Theme Override row** appears

**Visual Indicators:**
| State | Appearance |
|-------|------------|
| Inherited | Color picker is faded/dim |
| Overridden | Solid color + primary border + small × |

**Override Options:**
- **Primary** - Override primary color
- **Secondary** - Override secondary color
- **BG** - Override background
- **FG** - Override foreground
- **Radius** - Override border radius

**Clearing:**
- Click small × on any color to clear that override
- Click "Clear all" to reset all overrides

---

## Theme Controls Reference

### Primary Color

**What it affects:**
- Main buttons (Call to Action)
- Active states
- Progress bars
- Links
- Focus rings

**Examples:**
```
Blue:   #0070f3  (Default, professional)
Purple: #6200ea  (Material Design)
Green:  #10b981  (Success/eco)
Red:    #ef4444  (Alerts/warnings)
```

### Secondary Color

**What it affects:**
- Secondary buttons
- Badges
- Accents
- Hover states
- Less important elements

**Examples:**
```
Teal:   #03dac6  (Material complement)
Indigo: #5856d6  (Apple complement)
Orange: #f97316  (Warm accent)
```

### Background & Foreground

**Background - Card surface color:**
- Light theme: `#ffffff` (white)
- Dark theme: `#1f1f1f` (dark gray)
- Tinted: `#f5f5f7` (Apple gray)

**Foreground - Text color:**
- Light theme: `#000000` (black)
- Dark theme: `#ffffff` (white)
- Soft: `#1d1d1f` (dark gray)

### Border Radius

Controls roundness:

```
0rem    = Sharp, modern, corporate
0.25rem = Slightly rounded, material
0.5rem  = Default, balanced
0.75rem = Apple-like, friendly
1rem    = Very round, playful
```

### Spacing

**Gap** - Space between child elements:
```
0.25rem = Tight, compact
0.5rem  = Default, balanced
1rem    = Spacious, open
```

**Padding** - Space inside containers:
```
0.5rem  = Minimal
1rem    = Default
1.5rem  = Generous
```

---

## Use Cases for Component Overrides

### Alert/Destructive Buttons

Make delete buttons stand out:

```yaml
- component: UiButton
  props:
    label: Delete All
    variant: destructive
  themeOverride:
    primary: '#dc2626'  # Bright red
```

### Status Indicators

Different colors for different states:

```yaml
# Success badge
- component: UiBadge
  props:
    children: Online
  themeOverride:
    primary: '#10b981'  # Green

# Warning badge
- component: UiBadge
  props:
    children: Low Battery
  themeOverride:
    primary: '#f59e0b'  # Orange
```

### Grouped Components

Make a group stand out:

```yaml
# Control card with different accent
- component: UiCard
  themeOverride:
    primary: '#8b5cf6'  # Purple section
  children:
    # Children inherit this override
```

### Call-to-Action

Highlight the main action:

```yaml
# Other buttons use card theme
- component: UiButton
  props:
    label: Cancel
    variant: outline

# Main CTA overrides to stand out
- component: UiButton
  props:
    label: Save Changes
  themeOverride:
    primary: '#10b981'  # Green for positive
```

---

## Theme Inheritance Flow

```
┌─────────────────────────────────────────┐
│           DEFAULTS                      │
│   primary: #0070f3                      │
│   radius: 0.5rem                        │
│   etc...                                │
└─────────────┬───────────────────────────┘
              │ overridden by
              ▼
┌─────────────────────────────────────────┐
│         CARD THEME                      │
│   theme:                                │
│     primary: '#6200ea'  ← overrides     │
│     radius: '0.25rem'   ← overrides     │
│     (other props use defaults)          │
└─────────────┬───────────────────────────┘
              │ overridden by
              ▼
┌─────────────────────────────────────────┐
│     COMPONENT themeOverride             │
│   themeOverride:                        │
│     primary: '#ef4444'  ← overrides     │
│     (other props use card theme)        │
└─────────────────────────────────────────┘
```

---

## Example Configurations

### Professional Dashboard

```yaml
type: custom:shadcn-template-card
theme:
  primary: '#1e40af'      # Navy
  secondary: '#64748b'    # Slate
  radius: '0rem'          # Sharp
layout:
  - component: UiButton
    props:
      label: View Report
  - component: UiButton
    props:
      label: Export Data
    themeOverride:
      primary: '#10b981'  # Green export button
```

### Kids' Room Controls

```yaml
type: custom:shadcn-template-card
theme:
  primary: '#ec4899'      # Pink
  secondary: '#8b5cf6'    # Purple
  radius: '1rem'          # Bubbly
  background: '#fef3c7'   # Cream
layout:
  - component: UiSwitch
    props:
      label: Night Light
  - component: UiButton
    props:
      label: Bedtime Mode
    themeOverride:
      primary: '#6366f1'  # Indigo for sleep
```

### Alert Dashboard

```yaml
type: custom:shadcn-template-card
theme:
  primary: '#3b82f6'      # Blue default
  radius: '0.25rem'
layout:
  - component: UiBadge
    props:
      children: All Systems Normal
    themeOverride:
      primary: '#10b981'  # Green

  - component: UiBadge
    props:
      children: 2 Warnings
    themeOverride:
      primary: '#f59e0b'  # Orange

  - component: UiButton
    props:
      label: Emergency Stop
    themeOverride:
      primary: '#dc2626'  # Red
      radius: '0rem'      # Sharp for urgency
```

---

## Troubleshooting

**Card theme not applying:**
- Verify hex format (#rrggbb)
- Check Card Theme row is expanded
- Refresh browser if needed

**Component override not working:**
- Make sure component is selected
- Click 🎨 button to show override row
- Check that you changed the color (not just clicked)

**Override not clearing:**
- Click the small × on the color chip
- Or use "Clear all" link

**Colors look wrong:**
- Check background/foreground contrast
- Test in both light and dark modes
- Use contrast checker tool

---

## Best Practices

1. **Set card theme first** - Define your base look before adding components

2. **Use overrides sparingly** - Too many different colors = visual chaos

3. **Override for purpose** - Alerts, CTAs, status indicators—not decoration

4. **Maintain contrast** - Ensure text is readable against backgrounds

5. **Test with real data** - Preview with actual entity states

---

## Next Steps

- **[Visual Editor](visual-editor.md)** - Learn the full editor interface
- **[Component Reference](components/)** - See all component props
- **[Examples](examples/)** - Pre-built themed cards

**Experiment!** Per-card and per-component theming lets you try bold ideas safely.

---

**Have fun customizing!** 🎨
