# Phase 2 - Interactive Components Guide

This guide covers all Phase 2 interactive components with simple JavaScript state management.

## Overview

Phase 2 adds 8 interactive components with basic state management:

1. **Accordion** - Collapsible content sections
2. **Collapsible** - Simple show/hide toggle
3. **Toggle** - Toggle button with pressed state
4. **Switch** - Toggle switch for on/off states
5. **RadioGroup** - Radio button group with selection
6. **Checkbox** - Checkbox with checked state
7. **Select** - Dropdown select with options
8. **Slider** - Range slider with value state

All components:
- ✅ Work in Shadow DOM
- ✅ Support keyboard navigation
- ✅ Include proper ARIA attributes
- ✅ Emit custom events for HA integration
- ✅ Support multiple instances per card

---

## 1. Accordion

Collapsible content sections with single or multiple expand modes.

### Basic Usage

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

### Attributes

- `data-accordion` - Marks the accordion container
- `data-type` - `"single"` (only one item open) or `"multiple"` (multiple items can be open)
- `data-collapsible` - `"true"` allows closing the last open item in single mode
- `data-value` - Unique identifier for each accordion item

### Events

- `accordion-change` - Fired when item expands/collapses
  ```javascript
  detail: { value: string, expanded: boolean }
  ```

### Keyboard Navigation

- `↓` / `↑` - Navigate between triggers
- `Home` / `End` - Jump to first/last trigger
- `Enter` / `Space` - Toggle accordion item

---

## 2. Collapsible

Simple show/hide toggle for content.

### Basic Usage

```yaml
type: custom:shadcdn-template-card
content: |
  <div class="shc-collapsible" data-collapsible>
    <button class="shc-collapsible-trigger" data-collapsible-trigger aria-expanded="false">
      🔽 Show Advanced Options
    </button>
    <div class="shc-collapsible-content" data-collapsible-content data-state="closed">
      <div class="shc-collapsible-content-inner">
        <p>Advanced settings go here...</p>
        <input type="text" placeholder="API Key" />
      </div>
    </div>
  </div>
```

### Attributes

- `data-collapsible` - Marks the collapsible container
- `data-collapsible-trigger` - The button that toggles visibility
- `data-collapsible-content` - The content to show/hide

### Events

- `collapsible-change` - Fired when toggled
  ```javascript
  detail: { expanded: boolean }
  ```

---

## 3. Toggle

Toggle button with pressed state.

### Basic Usage

```yaml
type: custom:shadcdn-template-card
content: |
  <button class="shc-toggle" data-toggle aria-pressed="false">
    <svg class="shc-toggle-icon" width="15" height="15" viewBox="0 0 15 15">
      <path d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 11.1575 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1576 0.877045 7.49991 0.877045ZM1.82708 7.49988C1.82708 4.36686 4.36689 1.82704 7.49991 1.82704C10.6329 1.82704 13.1727 4.36686 13.1727 7.49988C13.1727 10.6329 10.6329 13.1727 7.49991 13.1727C4.36689 13.1727 1.82708 10.6329 1.82708 7.49988ZM10.1589 5.53774C10.3178 5.31191 10.2636 5.00001 10.0378 4.84109C9.81194 4.68217 9.50004 4.73642 9.34112 4.96225L6.51977 8.97154L5.35681 7.78706C5.16334 7.59002 4.84677 7.58711 4.64973 7.78058C4.45268 7.97404 4.44978 8.29061 4.64325 8.48765L6.22658 10.1003C6.33054 10.2062 6.47617 10.2604 6.62407 10.2483C6.77197 10.2363 6.90686 10.1591 6.99226 10.0377L10.1589 5.53774Z" fill="currentColor"/>
    </svg>
    Bold
  </button>
  
  <button class="shc-toggle shc-toggle-outline" data-toggle aria-pressed="false">
    Italic
  </button>
```

### Variants

- Default: `shc-toggle`
- Outline: `shc-toggle shc-toggle-outline`
- Sizes: `shc-toggle-sm`, `shc-toggle-lg`

### Events

- `toggle-change` - Fired when toggled
  ```javascript
  detail: { pressed: boolean, value?: string }
  ```

---

## 4. Switch

Toggle switch for on/off states.

### Basic Usage

```yaml
type: custom:shadcdn-template-card
content: |
  <label class="shc-switch-wrapper">
    <button class="shc-switch" data-switch role="switch" aria-checked="false" data-action="toggle_light">
      <span class="shc-switch-thumb"></span>
    </button>
    <span class="shc-switch-label">Living Room Lights</span>
  </label>
  
  <!-- Checked by default -->
  <label class="shc-switch-wrapper">
    <button class="shc-switch" data-switch role="switch" aria-checked="true">
      <span class="shc-switch-thumb"></span>
    </button>
    <span class="shc-switch-label">Notifications</span>
  </label>
```

### Attributes

- `data-switch` - Marks the switch button
- `aria-checked` - Current state: `"true"` or `"false"`
- `data-action` - Home Assistant action to trigger
- `data-value` - Optional value identifier

### Events

- `switch-change` - Fired when toggled
  ```javascript
  detail: { checked: boolean, value?: string }
  ```

---

## 5. RadioGroup

Radio button group with single selection.

### Basic Usage

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
    
    <label class="shc-radio-item">
      <button class="shc-radio-button" data-radio role="radio" aria-checked="false" data-value="auto">
        <span class="shc-radio-indicator"></span>
      </button>
      <span class="shc-radio-label">Auto</span>
    </label>
  </div>
```

### Horizontal Layout

```yaml
content: |
  <div class="shc-radio-group" data-radio-group data-orientation="horizontal">
    <!-- radio items -->
  </div>
```

### Events

- `radio-change` - Fired when selection changes
  ```javascript
  detail: { value: string }
  ```

### Keyboard Navigation

- `↓` / `→` - Next option
- `↑` / `←` - Previous option
- `Space` / `Enter` - Select

---

## 6. Checkbox

Checkbox with checked/unchecked/indeterminate states.

### Basic Usage

```yaml
type: custom:shadcdn-template-card
content: |
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

### Indeterminate State

```yaml
content: |
  <button class="shc-checkbox" data-checkbox role="checkbox" aria-checked="mixed">
    <svg class="shc-checkbox-indicator" width="15" height="15" viewBox="0 0 15 15">
      <path d="M3 7.5C3 7.22386 3.22386 7 3.5 7H11.5C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8H3.5C3.22386 8 3 7.77614 3 7.5Z" fill="currentColor"/>
    </svg>
  </button>
```

### Events

- `checkbox-change` - Fired when checked state changes
  ```javascript
  detail: { checked: boolean, indeterminate: boolean, value?: string }
  ```

---

## 7. Select

Dropdown select with option selection.

### Basic Usage

```yaml
type: custom:shadcdn-template-card
content: |
  <div class="shc-select" data-select data-action="set_climate_mode">
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

### Pre-selected Value

```yaml
content: |
  <div class="shc-select" data-select>
    <button class="shc-select-trigger" data-select-trigger>
      <span class="shc-select-value" data-select-value>Heat</span>
      <!-- icon -->
    </button>
    <div class="shc-select-content" data-select-content>
      <div class="shc-select-item" data-select-item data-value="heat" data-selected="true">Heat</div>
      <div class="shc-select-item" data-select-item data-value="cool">Cool</div>
    </div>
  </div>
```

### Events

- `select-change` - Fired when selection changes
  ```javascript
  detail: { value: string }
  ```

### Keyboard Navigation

- `↓` / `↑` - Navigate options when open
- `Enter` / `Space` - Select option / Open dropdown
- `Escape` - Close dropdown

---

## 8. Slider

Range slider with drag interaction.

### Basic Usage

```yaml
type: custom:shadcdn-template-card
content: |
  <div class="shc-slider" data-slider data-min="0" data-max="100" data-step="1" data-value="50" data-action="set_brightness">
    <div class="shc-slider-track">
      <div class="shc-slider-range"></div>
    </div>
    <div class="shc-slider-thumb" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" tabindex="0"></div>
  </div>
  
  <!-- Temperature control -->
  <div class="shc-slider" data-slider data-min="16" data-max="30" data-step="0.5" data-value="21">
    <div class="shc-slider-track">
      <div class="shc-slider-range"></div>
    </div>
    <div class="shc-slider-thumb" role="slider" tabindex="0"></div>
  </div>
```

### Attributes

- `data-min` - Minimum value (default: 0)
- `data-max` - Maximum value (default: 100)
- `data-step` - Step increment (default: 1)
- `data-value` - Initial value (default: 0)
- `data-action` - Home Assistant action to trigger on change

### Events

- `slider-input` - Fired while dragging (for live updates)
- `slider-change` - Fired when drag completes or value commits
  ```javascript
  detail: { value: number, min: number, max: number }
  ```

### Keyboard Navigation

- `→` / `↑` - Increase by step
- `←` / `↓` - Decrease by step
- `Page Up` - Increase by 10%
- `Page Down` - Decrease by 10%
- `Home` - Jump to minimum
- `End` - Jump to maximum

---

## Home Assistant Integration

### Action Binding

All interactive components support `data-action` attribute for triggering Home Assistant actions:

```yaml
content: |
  <button class="shc-switch" data-switch data-action="light.toggle" data-value="light.living_room">
    <span class="shc-switch-thumb"></span>
  </button>
```

When the component state changes, it dispatches a `ha-action` custom event that can be captured by the card system.

### Event Handling

Listen for component-specific events:

```javascript
card.addEventListener('switch-change', (event) => {
  console.log('Switch toggled:', event.detail.checked)
  // Trigger Home Assistant service call
})
```

---

## Accessibility

All Phase 2 components implement:

✅ **ARIA Attributes** - Proper roles, states, and properties  
✅ **Keyboard Navigation** - Full keyboard support with arrow keys, Enter, Space, Escape  
✅ **Focus Management** - Visible focus indicators and logical tab order  
✅ **Screen Reader Support** - Meaningful labels and state announcements

---

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+

---

## Next Steps

Phase 3 will add portal-based overlay components:
- Dialog
- Popover
- Tooltip
- DropdownMenu
- And more...

These components require advanced shadow DOM portal management for rendering overlays that escape the card boundary while maintaining styling and functionality.