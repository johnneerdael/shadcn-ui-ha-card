# Component Library Reference

Complete reference guide for all 24+ shadcn/ui components available in the shadcdn-template-card.

---

## Table of Contents

### Layout & Structure
- [Card](#card)
- [Separator](#separator)
- [Aspect Ratio](#aspect-ratio)

### Typography & Content
- [Label](#label)
- [Badge](#badge)
- [Alert](#alert)

### Forms & Inputs
- [Input](#input)
- [Textarea](#textarea)
- [Checkbox](#checkbox)
- [Radio Group](#radiogroup)
- [Switch](#switch)
- [Select](#select)
- [Slider](#slider)

### Interactive Elements
- [Button](#button)
- [Toggle](#toggle)
- [Accordion](#accordion)
- [Collapsible](#collapsible)
- [Tabs](#tabs)

### Feedback & Status
- [Progress](#progress)
- [Skeleton](#skeleton)
- [Avatar](#avatar)

### Code & Data
- [Code](#code)
- [Kbd](#kbd)

---

## Layout & Structure

### Card

Structured container component with header, content, and footer sections.

**Features:**
- Semantic structure with distinct sections
- Consistent padding and spacing
- Theme-aware background and borders
- Flexible content layout

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <div class="shc-card">
    <div class="shc-card-header">
      <div class="shc-card-title">Dashboard Status</div>
      <div class="shc-card-description">Real-time system overview</div>
    </div>
    <div class="shc-card-content">
      <p>Temperature: {{ states('sensor.temperature') }}°C</p>
      <p>Humidity: {{ states('sensor.humidity') }}%</p>
    </div>
    <div class="shc-card-footer">
      <button class="shc-btn shc-btn-primary">Refresh</button>
    </div>
  </div>
```

**CSS Classes:**
- `.shc-card` - Main card container
- `.shc-card-header` - Header section
- `.shc-card-title` - Title text (large, bold)
- `.shc-card-description` - Subtitle text (muted)
- `.shc-card-content` - Main content area
- `.shc-card-footer` - Footer section

**See Also:** [Tutorial Examples](TUTORIAL.md#tutorial-1-smart-home-dashboard)

---

### Separator

Visual divider to separate content sections.

**Features:**
- Horizontal or vertical orientation
- Customizable spacing
- Theme-aware colors
- Semantic content separation

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <div class="space-y-4">
    <div>Section 1 Content</div>
    <div class="shc-separator" role="separator"></div>
    <div>Section 2 Content</div>
    
    <!-- Vertical separator -->
    <div class="flex gap-4">
      <div>Left</div>
      <div class="shc-separator shc-separator-vertical" role="separator"></div>
      <div>Right</div>
    </div>
  </div>
```

**Variants:**
- `.shc-separator` - Horizontal separator (default)
- `.shc-separator-vertical` - Vertical separator

**See Also:** [PHASE2_COMPONENTS.md](PHASE2_COMPONENTS.md#separator)

---

### Aspect Ratio

Maintain consistent width-to-height ratios for content containers.

**Features:**
- Common aspect ratios (16:9, 4:3, 1:1, 21:9)
- Custom ratio support
- Responsive scaling
- Perfect for images and videos

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <!-- 16:9 aspect ratio -->
  <div class="shc-aspect-ratio shc-aspect-video">
    <img src="/local/camera-feed.jpg" alt="Camera" />
  </div>
  
  <!-- Square (1:1) -->
  <div class="shc-aspect-ratio shc-aspect-square">
    <div class="flex items-center justify-center bg-[var(--muted)]">
      Profile Photo
    </div>
  </div>
  
  <!-- Custom ratio (4:3) -->
  <div class="shc-aspect-ratio" style="--aspect-ratio: 4/3;">
    <iframe src="https://example.com"></iframe>
  </div>
```

**Variants:**
- `.shc-aspect-square` - 1:1 ratio
- `.shc-aspect-video` - 16:9 ratio
- Custom: Use `style="--aspect-ratio: width/height;"`

---

## Typography & Content

### Label

Form labels and text indicators with consistent styling.

**Features:**
- Accessible form labels
- Consistent typography
- Peer state support (disabled, error)
- Screen reader friendly

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <div class="space-y-2">
    <label class="shc-label" for="email">Email Address</label>
    <input id="email" type="email" class="shc-input" />
  </div>
  
  <!-- With helper text -->
  <div class="space-y-2">
    <label class="shc-label">
      Temperature Threshold
      <span class="text-xs text-[var(--muted-foreground)]">(in °C)</span>
    </label>
    <input type="number" class="shc-input" value="22" />
  </div>
```

**CSS Classes:**
- `.shc-label` - Label element with proper styling and spacing

**See Also:** [Form Components](#forms--inputs)

---

### Badge

Status indicators and tags with multiple color variants.

**Features:**
- Multiple color variants
- Outline and solid styles
- Compact size for inline use
- Semantic color meanings

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <div class="flex gap-2 flex-wrap">
    <span class="shc-badge">Default</span>
    <span class="shc-badge shc-badge-primary">Active</span>
    <span class="shc-badge shc-badge-secondary">Inactive</span>
    <span class="shc-badge shc-badge-destructive">Error</span>
    <span class="shc-badge shc-badge-outline">Outline</span>
  </div>
  
  <!-- Dynamic with state -->
  <span class="shc-badge {{ states('light.living_room') == 'on' ? 'shc-badge-primary' : '' }}">
    {{ states('light.living_room')|upper }}
  </span>
```

**Variants:**
- `.shc-badge` - Default gray badge
- `.shc-badge-primary` - Primary color (blue)
- `.shc-badge-secondary` - Secondary color
- `.shc-badge-destructive` - Error/danger (red)
- `.shc-badge-outline` - Outline style

**See Also:** [Tutorial Examples](TUTORIAL.md#tutorial-1-smart-home-dashboard)

---

### Alert

Contextual feedback messages with variants for different severities.

**Features:**
- Multiple severity variants
- Icon support
- Title and description layout
- Full-width or inline

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <!-- Default alert -->
  <div class="shc-alert">
    <div class="shc-alert-title">Heads up!</div>
    <div class="shc-alert-description">
      System maintenance scheduled for tonight at 2 AM.
    </div>
  </div>
  
  <!-- Destructive alert -->
  <div class="shc-alert shc-alert-destructive">
    <div class="shc-alert-title">⚠️ Error</div>
    <div class="shc-alert-description">
      Connection to {{ states('sensor.temperature') }} failed.
    </div>
  </div>
  
  <!-- Warning alert -->
  <div class="shc-alert" style="--alert-bg: var(--warning); --alert-fg: var(--warning-foreground);">
    <div class="shc-alert-title">🔔 Notice</div>
    <div class="shc-alert-description">
      Battery low: {{ state_attr('sensor.battery', 'battery_level') }}%
    </div>
  </div>
```

**Variants:**
- `.shc-alert` - Default informational alert
- `.shc-alert-destructive` - Error/danger alert

**CSS Classes:**
- `.shc-alert-title` - Alert title (bold)
- `.shc-alert-description` - Alert message text

---

## Forms & Inputs

### Input

Text input field with consistent styling and states.

**Features:**
- Multiple input types (text, email, number, etc.)
- Disabled and error states
- Placeholder support
- Full-width responsive

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <div class="space-y-3">
    <!-- Text input -->
    <input type="text" class="shc-input" placeholder="Enter name..." />
    
    <!-- Number input -->
    <input type="number" class="shc-input" placeholder="Temperature" value="22" />
    
    <!-- With label -->
    <div class="space-y-2">
      <label class="shc-label">Email Address</label>
      <input type="email" class="shc-input" placeholder="you@example.com" />
    </div>
    
    <!-- Disabled state -->
    <input type="text" class="shc-input" disabled value="Read-only value" />
  </div>
```

**CSS Classes:**
- `.shc-input` - Input field with all styles and states

**See Also:** [Label](#label), [Textarea](#textarea)

---

### Textarea

Multi-line text input for longer content.

**Features:**
- Resizable height
- Consistent styling with input
- Placeholder support
- Auto-grows with content

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <div class="space-y-2">
    <label class="shc-label">Notes</label>
    <textarea class="shc-textarea" placeholder="Enter your notes..." rows="4"></textarea>
  </div>
  
  <!-- With default value -->
  <textarea class="shc-textarea" rows="3">
    {{ state_attr('automation.example', 'description') }}
  </textarea>
```

**CSS Classes:**
- `.shc-textarea` - Textarea with consistent styling

---

### Checkbox

Checkbox with checked, unchecked, and indeterminate states.

**Features:**
- Three states: checked, unchecked, indeterminate
- Keyboard accessible (Space to toggle)
- Custom checked indicator
- Label association

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <!-- Basic checkbox -->
  <label class="shc-checkbox-wrapper">
    <button class="shc-checkbox" data-checkbox role="checkbox" aria-checked="false">
      <svg class="shc-checkbox-indicator" width="15" height="15" viewBox="0 0 15 15">
        <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor"/>
      </svg>
    </button>
    <span class="shc-checkbox-label">Accept terms and conditions</span>
  </label>
  
  <!-- Pre-checked -->
  <label class="shc-checkbox-wrapper">
    <button class="shc-checkbox" data-checkbox role="checkbox" aria-checked="true">
      <svg class="shc-checkbox-indicator" width="15" height="15" viewBox="0 0 15 15">
        <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor"/>
      </svg>
    </button>
    <span class="shc-checkbox-label">Enable notifications</span>
  </label>
```

**Attributes:**
- `data-checkbox` - Marks the checkbox element
- `aria-checked` - State: `"true"`, `"false"`, or `"mixed"` (indeterminate)
- `data-value` - Optional value identifier

**Events:**
- `checkbox-change` - Fired when state changes
  ```javascript
  detail: { checked: boolean, indeterminate: boolean, value?: string }
  ```

**Keyboard:**
- `Space` - Toggle checked state

**See Also:** [PHASE2_COMPONENTS.md#checkbox](PHASE2_COMPONENTS.md#6-checkbox)

---

### RadioGroup

Radio button group with single selection.

**Features:**
- Single selection enforced
- Horizontal or vertical layout
- Keyboard navigation (arrow keys)
- Custom radio indicators

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <div class="shc-radio-group" data-radio-group role="radiogroup" aria-label="Theme">
    <label class="shc-radio-item">
      <button class="shc-radio-button" data-radio role="radio" aria-checked="true" data-value="light">
        <span class="shc-radio-indicator"></span>
      </button>
      <span class="shc-radio-label">Light Mode</span>
    </label>
    
    <label class="shc-radio-item">
      <button class="shc-radio-button" data-radio role="radio" aria-checked="false" data-value="dark">
        <span class="shc-radio-indicator"></span>
      </button>
      <span class="shc-radio-label">Dark Mode</span>
    </label>
  </div>
```

**Attributes:**
- `data-radio-group` - Marks the radio group container
- `data-radio` - Individual radio button
- `data-value` - Value for the radio option
- `data-orientation` - `"horizontal"` or `"vertical"` (default)

**Events:**
- `radio-change` - Fired when selection changes
  ```javascript
  detail: { value: string }
  ```

**Keyboard:**
- `↓` / `→` - Next option
- `↑` / `←` - Previous option
- `Space` / `Enter` - Select option

**See Also:** [PHASE2_COMPONENTS.md#radiogroup](PHASE2_COMPONENTS.md#5-radiogroup)

---

### Switch

Toggle switch for on/off states.

**Features:**
- Clear visual on/off state
- Animated thumb transition
- Keyboard accessible (Space to toggle)
- Label support

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <label class="shc-switch-wrapper">
    <button class="shc-switch" data-switch role="switch" aria-checked="false">
      <span class="shc-switch-thumb"></span>
    </button>
    <span class="shc-switch-label">Living Room Lights</span>
  </label>
  
  <!-- Dynamic with entity state -->
  <label class="shc-switch-wrapper">
    <button class="shc-switch" data-switch role="switch" 
            aria-checked="{{ states('light.bedroom') == 'on' ? 'true' : 'false' }}"
            data-action="light.toggle" data-value="light.bedroom">
      <span class="shc-switch-thumb"></span>
    </button>
    <span class="shc-switch-label">Bedroom Lights</span>
  </label>
```

**Attributes:**
- `data-switch` - Marks the switch element
- `aria-checked` - Current state: `"true"` or `"false"`
- `data-action` - Home Assistant service to call
- `data-value` - Entity ID or value

**Events:**
- `switch-change` - Fired when toggled
  ```javascript
  detail: { checked: boolean, value?: string }
  ```

**Keyboard:**
- `Space` - Toggle switch

**See Also:** [PHASE2_COMPONENTS.md#switch](PHASE2_COMPONENTS.md#4-switch)

---

### Select

Dropdown select menu with options.

**Features:**
- Dropdown with option list
- Keyboard navigation
- Placeholder support
- Selected value display

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <div class="shc-select" data-select>
    <button class="shc-select-trigger" data-select-trigger aria-expanded="false">
      <span class="shc-select-value" data-select-value data-placeholder="Select mode..."></span>
      <svg class="shc-select-icon" width="15" height="15" viewBox="0 0 15 15">
        <path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor"/>
      </svg>
    </button>
    <div class="shc-select-content" data-select-content data-state="closed">
      <div class="shc-select-item" data-select-item data-value="heat">Heat</div>
      <div class="shc-select-item" data-select-item data-value="cool">Cool</div>
      <div class="shc-select-item" data-select-item data-value="auto">Auto</div>
      <div class="shc-select-item" data-select-item data-value="off">Off</div>
    </div>
  </div>
```

**Attributes:**
- `data-select` - Marks the select container
- `data-select-trigger` - The button that opens dropdown
- `data-select-content` - The dropdown menu
- `data-select-item` - Individual option
- `data-value` - Value for each option
- `data-selected` - Mark option as pre-selected

**Events:**
- `select-change` - Fired when selection changes
  ```javascript
  detail: { value: string }
  ```

**Keyboard:**
- `↓` / `↑` - Navigate options
- `Enter` / `Space` - Select option or toggle
- `Escape` - Close dropdown

**See Also:** [PHASE2_COMPONENTS.md#select](PHASE2_COMPONENTS.md#7-select)

---

### Slider

Range slider with drag and keyboard control.

**Features:**
- Drag to adjust value
- Keyboard increment/decrement
- Min/max/step configuration
- Visual range indicator

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <!-- Brightness slider -->
  <div class="space-y-2">
    <label class="shc-label">Brightness</label>
    <div class="shc-slider" data-slider data-min="0" data-max="100" data-step="1" data-value="75">
      <div class="shc-slider-track">
        <div class="shc-slider-range"></div>
      </div>
      <div class="shc-slider-thumb" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="75" tabindex="0"></div>
    </div>
  </div>
  
  <!-- Temperature slider -->
  <div class="space-y-2">
    <label class="shc-label">Target Temperature: <span id="temp-value">21°C</span></label>
    <div class="shc-slider" data-slider data-min="16" data-max="30" data-step="0.5" data-value="21">
      <div class="shc-slider-track">
        <div class="shc-slider-range"></div>
      </div>
      <div class="shc-slider-thumb" role="slider" tabindex="0"></div>
    </div>
  </div>
```

**Attributes:**
- `data-slider` - Marks the slider container
- `data-min` - Minimum value (default: 0)
- `data-max` - Maximum value (default: 100)
- `data-step` - Step increment (default: 1)
- `data-value` - Initial value
- `data-action` - Home Assistant action to trigger

**Events:**
- `slider-input` - Fired continuously while dragging
- `slider-change` - Fired when value is committed
  ```javascript
  detail: { value: number, min: number, max: number }
  ```

**Keyboard:**
- `→` / `↑` - Increase by step
- `←` / `↓` - Decrease by step
- `Page Up` - Increase by 10%
- `Page Down` - Decrease by 10%
- `Home` - Jump to minimum
- `End` - Jump to maximum

**See Also:** [PHASE2_COMPONENTS.md#slider](PHASE2_COMPONENTS.md#8-slider)

---

## Interactive Elements

### Button

Clickable buttons with multiple variants and sizes.

**Features:**
- Multiple visual variants
- Size options (sm, default, lg)
- Disabled state
- Icon support

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <div class="flex gap-2 flex-wrap">
    <button class="shc-btn shc-btn-primary">Primary Action</button>
    <button class="shc-btn shc-btn-secondary">Secondary</button>
    <button class="shc-btn shc-btn-outline">Outline</button>
    <button class="shc-btn shc-btn-ghost">Ghost</button>
    <button class="shc-btn shc-btn-destructive">Delete</button>
  </div>
  
  <!-- Sizes -->
  <div class="flex gap-2 items-center">
    <button class="shc-btn shc-btn-primary shc-btn-sm">Small</button>
    <button class="shc-btn shc-btn-primary">Default</button>
    <button class="shc-btn shc-btn-primary shc-btn-lg">Large</button>
  </div>
  
  <!-- Disabled -->
  <button class="shc-btn shc-btn-primary" disabled>Disabled</button>
```

**Variants:**
- `.shc-btn-primary` - Primary action (blue)
- `.shc-btn-secondary` - Secondary action (gray)
- `.shc-btn-outline` - Outline style
- `.shc-btn-ghost` - Minimal ghost style
- `.shc-btn-destructive` - Destructive action (red)

**Sizes:**
- `.shc-btn-sm` - Small button
- Default - Standard size
- `.shc-btn-lg` - Large button

---

### Toggle

Toggle button with pressed/unpressed states.

**Features:**
- Visual pressed state
- Keyboard accessible
- Outline variant
- Icon support

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <div class="flex gap-2">
    <button class="shc-toggle" data-toggle aria-pressed="false">
      <svg class="shc-toggle-icon" width="15" height="15" viewBox="0 0 15 15">
        <path d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 11.1575 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1576 0.877045 7.49991 0.877045Z" fill="currentColor"/>
      </svg>
      Bold
    </button>
    
    <button class="shc-toggle" data-toggle aria-pressed="true">
      Italic
    </button>
    
    <button class="shc-toggle shc-toggle-outline" data-toggle aria-pressed="false">
      Underline
    </button>
  </div>
```

**Variants:**
- `.shc-toggle` - Default solid style
- `.shc-toggle-outline` - Outline style

**Sizes:**
- `.shc-toggle-sm` - Small
- `.shc-toggle-lg` - Large

**Attributes:**
- `data-toggle` - Marks the toggle element
- `aria-pressed` - State: `"true"` or `"false"`

**Events:**
- `toggle-change` - Fired when toggled
  ```javascript
  detail: { pressed: boolean, value?: string }
  ```

**See Also:** [PHASE2_COMPONENTS.md#toggle](PHASE2_COMPONENTS.md#3-toggle)

---

### Accordion

Collapsible content sections with keyboard navigation.

**Features:**
- Single or multiple expand modes
- Smooth expand/collapse animations
- Keyboard navigation
- Chevron icon indicator

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <div class="shc-accordion" data-accordion data-type="single" data-collapsible="true">
    <div class="shc-accordion-item" data-value="item-1">
      <button class="shc-accordion-trigger" data-accordion-trigger aria-expanded="false">
        <span>What is Home Assistant?</span>
        <svg class="shc-accordion-chevron" width="15" height="15" viewBox="0 0 15 15">
          <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor"/>
        </svg>
      </button>
      <div class="shc-accordion-content" data-accordion-content data-state="closed">
        <div class="shc-accordion-content-inner">
          Home Assistant is open source home automation that puts local control and privacy first.
        </div>
      </div>
    </div>
    
    <div class="shc-accordion-item" data-value="item-2">
      <button class="shc-accordion-trigger" data-accordion-trigger aria-expanded="false">
        <span>Is it free?</span>
        <svg class="shc-accordion-chevron" width="15" height="15" viewBox="0 0 15 15">
          <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor"/>
        </svg>
      </button>
      <div class="shc-accordion-content" data-accordion-content data-state="closed">
        <div class="shc-accordion-content-inner">
          Yes! Home Assistant is completely free and open source.
        </div>
      </div>
    </div>
  </div>
```

**Attributes:**
- `data-accordion` - Marks the accordion container
- `data-type` - `"single"` (one open) or `"multiple"` (multiple open)
- `data-collapsible` - Allow closing last item in single mode
- `data-value` - Unique identifier for each item

**Events:**
- `accordion-change` - Fired when item expands/collapses
  ```javascript
  detail: { value: string, expanded: boolean }
  ```

**Keyboard:**
- `↓` / `↑` - Navigate between triggers
- `Home` / `End` - Jump to first/last
- `Enter` / `Space` - Toggle item

**See Also:** [PHASE2_COMPONENTS.md#accordion](PHASE2_COMPONENTS.md#1-accordion)

---

### Collapsible

Simple show/hide toggle for content.

**Features:**
- Single toggle control
- Smooth animations
- Minimal markup
- Keyboard accessible

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <div class="shc-collapsible" data-collapsible>
    <button class="shc-collapsible-trigger" data-collapsible-trigger aria-expanded="false">
      🔽 Show Advanced Options
    </button>
    <div class="shc-collapsible-content" data-collapsible-content data-state="closed">
      <div class="shc-collapsible-content-inner">
        <div class="space-y-2 mt-2">
          <input type="text" class="shc-input" placeholder="API Key" />
          <input type="text" class="shc-input" placeholder="Secret" />
        </div>
      </div>
    </div>
  </div>
```

**Attributes:**
- `data-collapsible` - Marks the container
- `data-collapsible-trigger` - Toggle button
- `data-collapsible-content` - Content to show/hide

**Events:**
- `collapsible-change` - Fired when toggled
  ```javascript
  detail: { expanded: boolean }
  ```

**See Also:** [PHASE2_COMPONENTS.md#collapsible](PHASE2_COMPONENTS.md#2-collapsible)

---

### Tabs

Tab navigation for organizing content into sections.

**Features:**
- Multiple tab support
- Active state styling
- Keyboard navigation
- Content panels

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <div class="shc-tabs">
    <div class="shc-tabs-list">
      <button class="shc-tabs-trigger" data-state="active">Overview</button>
      <button class="shc-tabs-trigger" data-state="inactive">Details</button>
      <button class="shc-tabs-trigger" data-state="inactive">Settings</button>
    </div>
    <div class="shc-tabs-content" data-state="active">
      <p>Overview content here...</p>
    </div>
    <div class="shc-tabs-content" data-state="inactive">
      <p>Details content here...</p>
    </div>
    <div class="shc-tabs-content" data-state="inactive">
      <p>Settings content here...</p>
    </div>
  </div>
```

**CSS Classes:**
- `.shc-tabs-list` - Container for tab buttons
- `.shc-tabs-trigger` - Individual tab button
- `.shc-tabs-content` - Content panel for each tab

---

## Feedback & Status

### Progress

Progress bars and indicators for showing completion status.

**Features:**
- Horizontal progress bar
- Percentage-based values
- Smooth animations
- Customizable colors

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <!-- Basic progress bar -->
  <div class="shc-progress">
    <div class="shc-progress-indicator" style="width: 75%"></div>
  </div>
  
  <!-- With label -->
  <div class="space-y-2">
    <div class="flex justify-between text-sm">
      <span>Download Progress</span>
      <span>75%</span>
    </div>
    <div class="shc-progress">
      <div class="shc-progress-indicator" style="width: 75%"></div>
    </div>
  </div>
  
  <!-- Dynamic from sensor -->
  {% set battery = state_attr('sensor.phone', 'battery_level')|float %}
  <div class="space-y-2">
    <div class="flex justify-between text-sm">
      <span>Battery Level</span>
      <span>{{ battery }}%</span>
    </div>
    <div class="shc-progress">
      <div class="shc-progress-indicator" style="width: {{ battery }}%"></div>
    </div>
  </div>
```

**CSS Classes:**
- `.shc-progress` - Progress bar container
- `.shc-progress-indicator` - Filled progress indicator

**See Also:** [Tutorial Examples](TUTORIAL.md#tutorial-3-energy-monitoring-dashboard)

---

### Skeleton

Loading state placeholders with pulse animation.

**Features:**
- Multiple shape variants
- Pulse animation
- Flexible sizing
- Grid layouts

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <div class="space-y-4">
    <!-- Text skeleton -->
    <div class="shc-skeleton shc-skeleton-text"></div>
    <div class="shc-skeleton shc-skeleton-text" style="width: 60%"></div>
    
    <!-- Circle skeleton (avatar) -->
    <div class="shc-skeleton shc-skeleton-circle"></div>
    
    <!-- Rectangle skeleton (image) -->
    <div class="shc-skeleton shc-skeleton-rectangle" style="height: 200px"></div>
    
    <!-- Card skeleton -->
    <div class="shc-card">
      <div class="shc-card-content space-y-3">
        <div class="flex items-center gap-3">
          <div class="shc-skeleton shc-skeleton-circle"></div>
          <div class="flex-1 space-y-2">
            <div class="shc-skeleton shc-skeleton-text"></div>
            <div class="shc-skeleton shc-skeleton-text" style="width: 70%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
```

**Variants:**
- `.shc-skeleton-text` - Text line placeholder
- `.shc-skeleton-circle` - Circular placeholder (avatars)
- `.shc-skeleton-rectangle` - Rectangular placeholder (images)

---

### Avatar

User profile images with fallback support.

**Features:**
- Image with fallback
- Multiple sizes
- Initials fallback
- Status indicators

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <!-- With image -->
  <div class="shc-avatar">
    <img src="/local/user-photo.jpg" alt="User" class="shc-avatar-image" />
    <div class="shc-avatar-fallback">JD</div>
  </div>
  
  <!-- Initials only -->
  <div class="shc-avatar">
    <div class="shc-avatar-fallback">AB</div>
  </div>
  
  <!-- Sizes -->
  <div class="flex gap-2 items-center">
    <div class="shc-avatar shc-avatar-sm">
      <div class="shc-avatar-fallback">S</div>
    </div>
    <div class="shc-avatar">
      <div class="shc-avatar-fallback">M</div>
    </div>
    <div class="shc-avatar shc-avatar-lg">
      <div class="shc-avatar-fallback">L</div>
    </div>
  </div>
```

**Variants:**
- `.shc-avatar-sm` - Small avatar
- Default - Medium avatar
- `.shc-avatar-lg` - Large avatar

**CSS Classes:**
- `.shc-avatar-image` - Image element
- `.shc-avatar-fallback` - Fallback content (initials)

---

## Code & Data

### Code

Inline code snippets with monospace font.

**Features:**
- Monospace font
- Distinct background
- Inline or block display
- Syntax highlighting ready

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <p>
    Use the <code class="shc-code">states()</code> function to get entity states.
  </p>
  
  <p>
    Example: <code class="shc-code">{{ states('sensor.temperature') }}</code>
  </p>
```

**CSS Classes:**
- `.shc-code` - Inline code with background and padding

---

### Kbd

Keyboard shortcut indicators.

**Features:**
- Keyboard key styling
- Multiple key combinations
- Uppercase formatting
- Proper spacing

**Usage:**
```yaml
type: custom:shadcdn-template-card
content: |
  <p>
    Press <kbd class="shc-kbd">Ctrl</kbd> + <kbd class="shc-kbd">S</kbd> to save
  </p>
  
  <p>
    Use <kbd class="shc-kbd">↑</kbd> and <kbd class="shc-kbd">↓</kbd> to navigate
  </p>
```

**CSS Classes:**
- `.shc-kbd` - Keyboard key with border and styling

---

## Accessibility

All components implement:

- ✅ **ARIA Attributes** - Proper roles, states, and properties
- ✅ **Keyboard Navigation** - Full keyboard support
- ✅ **Focus Management** - Visible focus indicators
- ✅ **Screen Reader Support** - Meaningful labels and announcements

---

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+

---

## Resources

- **[Quick Reference](COMPONENT_REFERENCE.md)** - Copy-paste cheat sheet
- **[Tutorial](TUTORIAL.md)** - Learn by building examples
- **[Interactive Components](PHASE2_COMPONENTS.md)** - Deep dive into Phase 2 components
- **[shadcn/ui](https://ui.shadcn.com/)** - Official shadcn/ui documentation
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility class reference

---

## Need Help?

- Check the [README](README.md) for installation and basic usage
- Review [LIMITATIONS.md](LIMITATIONS.md) for known limitations
- See [TUTORIAL.md](TUTORIAL.md) for progressive examples
- Visit [shadcn/ui](https://ui.shadcn.com/) for design guidelines