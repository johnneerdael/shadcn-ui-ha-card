# Theme System Guide

The Shadcn Template Card includes a powerful **per-card theming system** that lets you customize the visual style of individual cards without affecting others.

## Philosophy

Following shadcn/ui's approach: **"You're not just toggling settings—you're adjusting the DNA of the components."**

Instead of pre-packaged themes you can't modify, you get direct control over:
- CSS Variables that define component colors
- Border radius for visual personality
- Spacing for layout breathing room

**Result:** Every card can have a unique, professional look that matches your vision.

---

## Quick Start

### Accessing the Theme Editor

1. **Open card editor**
2. **Click away from all components** (deselect)
3. **Switch to "Theme" tab** in right panel
4. **Start customizing!**

### Using Presets

The fastest way to get started:

1. Scroll to **"Quick Presets"** section
2. Click a preset:
   - **Material** - Purple & teal, modern
   - **Apple** - Blue & indigo, rounded
   - **Corporate** - Navy & gray, sharp
   - **Playful** - Pink & purple, bubbly
3. **Customize from there**

---

## Theme Controls

### 1. Primary Color

**What it affects:**
- Main buttons (Call to Action)
- Active states
- Progress bars
- Links
- Focus rings

**When to change:**
- Match your brand color
- Create visual hierarchy
- Distinguish card types

**Examples:**
```
Blue:   #0070f3  (Default, professional)
Purple: #6200ea  (Material Design)
Green:  #10b981  (Success/eco)
Red:    #ef4444  (Alerts/warnings)
```

### 2. Secondary Color

**What it affects:**
- Secondary buttons
- Badges
- Accents
- Hover states
- Less important elements

**When to change:**
- Complement primary color
- Create visual variety
- Highlight secondary actions

**Examples:**
```
Teal:   #03dac6  (Material complement)
Indigo: #5856d6  (Apple complement)
Orange: #f97316  (Warm accent)
Cyan:   #06b6d4  (Cool accent)
```

### 3. Background & Foreground

**Background - Card surface color:**
- Light theme: `#ffffff` (white)
- Dark theme: `#1f1f1f` (dark gray)
- Tinted: `#f5f5f7` (Apple gray)
- Warm: `#fef3c7` (Playful cream)

**Foreground - Text color:**
- Light theme: `#000000` (black)
- Dark theme: `#ffffff` (white)
- Soft: `#1d1d1f` (dark gray)
- Warm: `#78350f` (brown)

**When to change:**
- Match dashboard theme
- Create mood (dark/light)
- Improve readability
- Special contexts (nighttime cards)

### 4. Border Radius

Controls how **round** or **sharp** components look:

```
0rem    = Sharp, modern, corporate
0.25rem = Slightly rounded, material
0.5rem  = Default, balanced
0.75rem = Apple-like, friendly
1rem    = Very round, playful
```

**Slider control:** Drag from "Sharp" to "Bubbly"

**What it affects:**
- Buttons
- Cards
- Inputs
- Badges
- All interactive elements

**When to change:**
- Match overall dashboard style
- Create personality
- Distinguish card categories

### 5. Spacing

Controls the **breathing room** in your layout:

**Gap** - Space between child elements:
```
0.25rem = Tight, compact
0.5rem  = Default, balanced
0.75rem = Comfortable
1rem    = Spacious, open
```

**Padding** - Space inside containers:
```
0.5rem  = Minimal padding
1rem    = Default padding
1.5rem  = Generous padding
2rem    = Extra spacious
```

**When to change:**
- Information density needs
- Visual breathing room
- Mobile vs desktop layouts
- Content type (data vs forms)

---

## Theme Presets

### Material Design 3

```yaml
theme:
  primary: '#6200ea'      # Deep purple
  secondary: '#03dac6'    # Teal
  background: '#ffffff'   # White
  foreground: '#000000'   # Black
  radius: '0.25rem'       # Slightly rounded
  spacing:
    gap: '0.5rem'         # Balanced
    padding: '1rem'       # Standard
```

**Best for:**
- Modern, professional dashboards
- Data-heavy layouts
- Google-style interfaces

### Apple Human Interface

```yaml
theme:
  primary: '#007aff'      # iOS blue
  secondary: '#5856d6'    # Purple
  background: '#f5f5f7'   # Light gray
  foreground: '#1d1d1f'   # Near black
  radius: '0.75rem'       # Rounded
  spacing:
    gap: '0.75rem'        # Generous
    padding: '1.5rem'     # Spacious
```

**Best for:**
- Consumer-friendly interfaces
- Media control cards
- iOS-style dashboards

### Corporate/Professional

```yaml
theme:
  primary: '#1e40af'      # Navy blue
  secondary: '#64748b'    # Slate gray
  background: '#ffffff'   # White
  foreground: '#0f172a'   # Very dark blue
  radius: '0rem'          # Sharp edges
  spacing:
    gap: '1rem'           # Structured
    padding: '2rem'       # Generous
```

**Best for:**
- Business dashboards
- Data analytics
- Security/monitoring
- Professional contexts

### Playful/Creative

```yaml
theme:
  primary: '#ec4899'      # Pink
  secondary: '#8b5cf6'    # Purple
  background: '#fef3c7'   # Cream
  foreground: '#78350f'   # Brown
  radius: '1rem'          # Very round
  spacing:
    gap: '1rem'           # Open
    padding: '1.5rem'     # Comfortable
```

**Best for:**
- Kids' rooms
- Entertainment areas
- Creative spaces
- Fun contexts

---

## Advanced Customization

### CSS Variables Generated

When you set theme values, these CSS variables are created:

```css
:host {
  --primary: #0070f3;
  --secondary: #7c3aed;
  --background: #ffffff;
  --foreground: #000000;
  --radius: 0.5rem;
  --default-gap: 0.5rem;
  --default-padding: 1rem;
}
```

### How It Works

1. **You set theme** in editor
2. **Variables injected** into card's shadow root
3. **Components use variables** automatically
4. **Changes apply live** - no rebuild

### Per-Card Independence

Each card has its own theme:

```yaml
# Card 1: Material theme
- type: custom:shadcn-template-card
  theme:
    primary: '#6200ea'
    radius: '0.25rem'

# Card 2: Apple theme
- type: custom:shadcn-template-card
  theme:
    primary: '#007aff'
    radius: '0.75rem'

# Card 3: No theme (uses defaults)
- type: custom:shadcn-template-card
```

---

## Use Cases

### By Dashboard Type

**Home Control:**
- Primary: Warm color (orange, yellow)
- Radius: Medium (0.5rem)
- Spacing: Comfortable
- → Easy to tap, friendly

**Security Monitoring:**
- Primary: Alert red or navy
- Radius: Sharp (0rem)
- Spacing: Tight (0.25rem)
- → Serious, data-dense

**Media Center:**
- Primary: Entertainment purple
- Radius: Very round (1rem)
- Spacing: Generous
- → Fun, relaxed

**Energy Dashboard:**
- Primary: Eco green
- Radius: Medium
- Spacing: Balanced
- → Clear, informative

### By Room

**Living Room:**
```yaml
theme:
  primary: '#f97316'  # Warm orange
  radius: '0.75rem'   # Friendly
```

**Bedroom:**
```yaml
theme:
  primary: '#8b5cf6'  # Calm purple
  radius: '1rem'      # Soft
  background: '#1f1f1f'  # Dark for night
```

**Home Office:**
```yaml
theme:
  primary: '#1e40af'  # Professional blue
  radius: '0rem'      # Sharp
  spacing:
    gap: '1rem'       # Organized
```

**Kids' Room:**
```yaml
theme:
  primary: '#ec4899'  # Fun pink
  secondary: '#facc15'  # Yellow accent
  radius: '1rem'      # Bubbly
```

### By Time of Day

**Daytime Cards:**
```yaml
theme:
  background: '#ffffff'  # Bright
  foreground: '#000000'
  primary: '#0070f3'     # Vivid
```

**Nighttime Cards:**
```yaml
theme:
  background: '#1f1f1f'  # Dark
  foreground: '#ffffff'
  primary: '#3b82f6'     # Softer blue
```

---

## Color Picker Tips

### Choosing Colors

**Primary color:**
1. Start with brand color or favorite color
2. Ensure good contrast with background
3. Test with buttons and badges
4. Should "pop" but not overwhelm

**Secondary color:**
1. Complementary to primary (color wheel opposite)
2. Or analogous (next to primary on wheel)
3. Should be distinct but harmonious
4. Lower saturation than primary

**Helpful tools:**
- [Coolors.co](https://coolors.co) - Color palette generator
- [Adobe Color](https://color.adobe.com) - Color wheel tool
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - Accessibility

### Accessibility

**Minimum contrast ratios:**
- Normal text: 4.5:1
- Large text: 3:1
- UI components: 3:1

**Test your theme:**
1. Preview card in editor
2. Check text readability
3. Verify button visibility
4. Test with actual lights dimmed (nighttime)

---

## Examples

### Energy Monitoring Card

```yaml
type: custom:shadcn-template-card
title: Energy Today
theme:
  primary: '#10b981'      # Green for eco
  secondary: '#f59e0b'    # Yellow for solar
  radius: '0.25rem'       # Modern
  spacing:
    gap: '0.75rem'
layout:
  # ... components showing energy usage
```

### Climate Control Card

```yaml
type: custom:shadcn-template-card
title: Thermostat
theme:
  primary: '#ef4444'      # Red for heat
  secondary: '#3b82f6'    # Blue for cool
  radius: '0.75rem'       # Friendly
  background: '#f5f5f7'   # Soft gray
layout:
  # ... climate controls
```

### Media Player Card

```yaml
type: custom:shadcn-template-card
title: Now Playing
theme:
  primary: '#8b5cf6'      # Purple entertainment
  secondary: '#ec4899'    # Pink accent
  radius: '1rem'          # Fun, round
  background: '#1f1f1f'   # Dark for media
  foreground: '#ffffff'
  spacing:
    padding: '2rem'       # Spacious
layout:
  # ... media controls
```

---

## Troubleshooting

**Colors not applying:**
- Check hex format (#rrggbb)
- Verify theme is saved
- Refresh browser
- Check browser console for errors

**Theme looks wrong:**
- Reset to preset and start over
- Check background/foreground contrast
- Test in light and dark modes
- Verify CSS variables in dev tools

**Components not using theme:**
- Some components have hard-coded colors
- Check component-specific props
- Use CSS classes for advanced styling

---

## Next Steps

- **[Visual Editor](visual-editor.md)** - Learn the editor interface
- **[Component Reference](components/)** - See how components use theme
- **[Examples](examples/)** - Pre-built themed cards

**Experiment!** The beauty of per-card theming is you can try bold ideas without affecting other cards.

---

**Have fun customizing!** 🎨
