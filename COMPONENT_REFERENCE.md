# Component Quick Reference

Copy-paste ready code snippets for all shadcdn-template-card components.

---

## 📋 Quick Navigation

**Layout:** [Card](#card) · [Separator](#separator) · [Aspect Ratio](#aspect-ratio)  
**Typography:** [Label](#label) · [Badge](#badge) · [Alert](#alert)  
**Forms:** [Input](#input) · [Textarea](#textarea) · [Checkbox](#checkbox) · [Radio](#radio-group) · [Switch](#switch) · [Select](#select) · [Slider](#slider)  
**Interactive:** [Button](#button) · [Toggle](#toggle) · [Accordion](#accordion) · [Collapsible](#collapsible) · [Tabs](#tabs)  
**Feedback:** [Progress](#progress) · [Skeleton](#skeleton) · [Avatar](#avatar)  
**Code:** [Code](#code) · [Kbd](#kbd)

---

## Card

```yaml
<div class="shc-card">
  <div class="shc-card-header">
    <div class="shc-card-title">Title</div>
    <div class="shc-card-description">Description</div>
  </div>
  <div class="shc-card-content">
    Content goes here
  </div>
  <div class="shc-card-footer">
    <button class="shc-btn shc-btn-primary">Action</button>
  </div>
</div>
```

---

## Separator

```yaml
<!-- Horizontal -->
<div class="shc-separator" role="separator"></div>

<!-- Vertical -->
<div class="flex gap-4">
  <div>Left</div>
  <div class="shc-separator shc-separator-vertical" role="separator"></div>
  <div>Right</div>
</div>
```

---

## Aspect Ratio

```yaml
<!-- 16:9 Video -->
<div class="shc-aspect-ratio shc-aspect-video">
  <img src="/local/image.jpg" alt="Image" />
</div>

<!-- 1:1 Square -->
<div class="shc-aspect-ratio shc-aspect-square">
  <div>Content</div>
</div>

<!-- Custom Ratio -->
<div class="shc-aspect-ratio" style="--aspect-ratio: 4/3;">
  <iframe src="https://example.com"></iframe>
</div>
```

---

## Label

```yaml
<label class="shc-label" for="input-id">Label Text</label>
<input id="input-id" type="text" class="shc-input" />
```

---

## Badge

```yaml
<span class="shc-badge">Default</span>
<span class="shc-badge shc-badge-primary">Primary</span>
<span class="shc-badge shc-badge-secondary">Secondary</span>
<span class="shc-badge shc-badge-destructive">Error</span>
<span class="shc-badge shc-badge-outline">Outline</span>
```

---

## Alert

```yaml
<!-- Info Alert -->
<div class="shc-alert">
  <div class="shc-alert-title">Info</div>
  <div class="shc-alert-description">Message here</div>
</div>

<!-- Error Alert -->
<div class="shc-alert shc-alert-destructive">
  <div class="shc-alert-title">⚠️ Error</div>
  <div class="shc-alert-description">Error message</div>
</div>
```

---

## Input

```yaml
<input type="text" class="shc-input" placeholder="Enter text..." />
<input type="number" class="shc-input" placeholder="Number" value="0" />
<input type="email" class="shc-input" placeholder="email@example.com" />
```

---

## Textarea

```yaml
<textarea class="shc-textarea" placeholder="Enter notes..." rows="4"></textarea>
```

---

## Checkbox

```yaml
<label class="shc-checkbox-wrapper">
  <button class="shc-checkbox" data-checkbox role="checkbox" aria-checked="false">
    <svg class="shc-checkbox-indicator" width="15" height="15" viewBox="0 0 15 15">
      <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor"/>
    </svg>
  </button>
  <span class="shc-checkbox-label">Accept terms</span>
</label>
```

---

## Radio Group

```yaml
<div class="shc-radio-group" data-radio-group role="radiogroup" aria-label="Options">
  <label class="shc-radio-item">
    <button class="shc-radio-button" data-radio role="radio" aria-checked="true" data-value="option1">
      <span class="shc-radio-indicator"></span>
    </button>
    <span class="shc-radio-label">Option 1</span>
  </label>
  
  <label class="shc-radio-item">
    <button class="shc-radio-button" data-radio role="radio" aria-checked="false" data-value="option2">
      <span class="shc-radio-indicator"></span>
    </button>
    <span class="shc-radio-label">Option 2</span>
  </label>
</div>
```

---

## Switch

```yaml
<label class="shc-switch-wrapper">
  <button class="shc-switch" data-switch role="switch" aria-checked="false">
    <span class="shc-switch-thumb"></span>
  </button>
  <span class="shc-switch-label">Enable Feature</span>
</label>
```

---

## Select

```yaml
<div class="shc-select" data-select>
  <button class="shc-select-trigger" data-select-trigger aria-expanded="false">
    <span class="shc-select-value" data-select-value data-placeholder="Select..."></span>
    <svg class="shc-select-icon" width="15" height="15" viewBox="0 0 15 15">
      <path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor"/>
    </svg>
  </button>
  <div class="shc-select-content" data-select-content data-state="closed">
    <div class="shc-select-item" data-select-item data-value="1">Option 1</div>
    <div class="shc-select-item" data-select-item data-value="2">Option 2</div>
    <div class="shc-select-item" data-select-item data-value="3">Option 3</div>
  </div>
</div>
```

---

## Slider

```yaml
<div class="shc-slider" data-slider data-min="0" data-max="100" data-step="1" data-value="50">
  <div class="shc-slider-track">
    <div class="shc-slider-range"></div>
  </div>
  <div class="shc-slider-thumb" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" tabindex="0"></div>
</div>
```

---

## Button

```yaml
<button class="shc-btn shc-btn-primary">Primary</button>
<button class="shc-btn shc-btn-secondary">Secondary</button>
<button class="shc-btn shc-btn-outline">Outline</button>
<button class="shc-btn shc-btn-ghost">Ghost</button>
<button class="shc-btn shc-btn-destructive">Delete</button>

<!-- Sizes -->
<button class="shc-btn shc-btn-primary shc-btn-sm">Small</button>
<button class="shc-btn shc-btn-primary">Default</button>
<button class="shc-btn shc-btn-primary shc-btn-lg">Large</button>
```

---

## Toggle

```yaml
<button class="shc-toggle" data-toggle aria-pressed="false">
  Toggle Text
</button>

<button class="shc-toggle shc-toggle-outline" data-toggle aria-pressed="false">
  Outline Toggle
</button>
```

---

## Accordion

```yaml
<div class="shc-accordion" data-accordion data-type="single" data-collapsible="true">
  <div class="shc-accordion-item" data-value="item-1">
    <button class="shc-accordion-trigger" data-accordion-trigger aria-expanded="false">
      <span>Section Title</span>
      <svg class="shc-accordion-chevron" width="15" height="15" viewBox="0 0 15 15">
        <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor"/>
      </svg>
    </button>
    <div class="shc-accordion-content" data-accordion-content data-state="closed">
      <div class="shc-accordion-content-inner">
        Content goes here
      </div>
    </div>
  </div>
</div>
```

---

## Collapsible

```yaml
<div class="shc-collapsible" data-collapsible>
  <button class="shc-collapsible-trigger" data-collapsible-trigger aria-expanded="false">
    🔽 Toggle Content
  </button>
  <div class="shc-collapsible-content" data-collapsible-content data-state="closed">
    <div class="shc-collapsible-content-inner">
      Hidden content here
    </div>
  </div>
</div>
```

---

## Tabs

```yaml
<div class="shc-tabs">
  <div class="shc-tabs-list">
    <button class="shc-tabs-trigger" data-state="active">Tab 1</button>
    <button class="shc-tabs-trigger" data-state="inactive">Tab 2</button>
    <button class="shc-tabs-trigger" data-state="inactive">Tab 3</button>
  </div>
  <div class="shc-tabs-content" data-state="active">
    Content for Tab 1
  </div>
  <div class="shc-tabs-content" data-state="inactive">
    Content for Tab 2
  </div>
  <div class="shc-tabs-content" data-state="inactive">
    Content for Tab 3
  </div>
</div>
```

---

## Progress

```yaml
<!-- Basic progress bar -->
<div class="shc-progress">
  <div class="shc-progress-indicator" style="width: 75%"></div>
</div>

<!-- With label -->
<div class="space-y-2">
  <div class="flex justify-between text-sm">
    <span>Progress</span>
    <span>75%</span>
  </div>
  <div class="shc-progress">
    <div class="shc-progress-indicator" style="width: 75%"></div>
  </div>
</div>
```

---

## Skeleton

```yaml
<!-- Text lines -->
<div class="shc-skeleton shc-skeleton-text"></div>
<div class="shc-skeleton shc-skeleton-text" style="width: 60%"></div>

<!-- Circle (avatar) -->
<div class="shc-skeleton shc-skeleton-circle"></div>

<!-- Rectangle (image) -->
<div class="shc-skeleton shc-skeleton-rectangle" style="height: 200px"></div>
```

---

## Avatar

```yaml
<!-- With image -->
<div class="shc-avatar">
  <img src="/local/photo.jpg" alt="User" class="shc-avatar-image" />
  <div class="shc-avatar-fallback">JD</div>
</div>

<!-- Initials only -->
<div class="shc-avatar">
  <div class="shc-avatar-fallback">AB</div>
</div>

<!-- Sizes -->
<div class="shc-avatar shc-avatar-sm">
  <div class="shc-avatar-fallback">S</div>
</div>
<div class="shc-avatar shc-avatar-lg">
  <div class="shc-avatar-fallback">L</div>
</div>
```

---

## Code

```yaml
<p>Use the <code class="shc-code">states()</code> function</p>
```

---

## Kbd

```yaml
<p>Press <kbd class="shc-kbd">Ctrl</kbd> + <kbd class="shc-kbd">S</kbd> to save</p>
```

---

## Common Patterns

### Form with Multiple Inputs

```yaml
<div class="shc-card">
  <div class="shc-card-header">
    <div class="shc-card-title">Settings Form</div>
  </div>
  <div class="shc-card-content space-y-4">
    <div class="space-y-2">
      <label class="shc-label">Name</label>
      <input type="text" class="shc-input" placeholder="Enter name" />
    </div>
    
    <div class="space-y-2">
      <label class="shc-label">Description</label>
      <textarea class="shc-textarea" rows="3"></textarea>
    </div>
    
    <label class="shc-checkbox-wrapper">
      <button class="shc-checkbox" data-checkbox role="checkbox" aria-checked="false">
        <svg class="shc-checkbox-indicator" width="15" height="15" viewBox="0 0 15 15">
          <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor"/>
        </svg>
      </button>
      <span class="shc-checkbox-label">Enable feature</span>
    </label>
  </div>
  <div class="shc-card-footer">
    <button class="shc-btn shc-btn-primary">Save</button>
  </div>
</div>
```

### Status Dashboard

```yaml
<div class="space-y-4">
  <!-- Header with badges -->
  <div class="flex items-center justify-between">
    <h2 class="text-2xl font-bold">System Status</h2>
    <div class="flex gap-2">
      <span class="shc-badge shc-badge-primary">3 Active</span>
      <span class="shc-badge shc-badge-outline">5 Idle</span>
    </div>
  </div>
  
  <!-- Status cards -->
  <div class="grid grid-cols-2 gap-3">
    <div class="shc-card">
      <div class="shc-card-content">
        <div class="flex items-center justify-between">
          <span>Temperature</span>
          <span class="text-2xl font-bold">{{ states('sensor.temp') }}°</span>
        </div>
        <div class="shc-progress mt-2">
          <div class="shc-progress-indicator" style="width: 70%"></div>
        </div>
      </div>
    </div>
    
    <div class="shc-card">
      <div class="shc-card-content">
        <div class="flex items-center justify-between">
          <span>Humidity</span>
          <span class="text-2xl font-bold">{{ states('sensor.humidity') }}%</span>
        </div>
        <div class="shc-progress mt-2">
          <div class="shc-progress-indicator" style="width: 45%"></div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Interactive Control Panel

```yaml
<div class="shc-card">
  <div class="shc-card-header">
    <div class="shc-card-title">Device Control</div>
  </div>
  <div class="shc-card-content space-y-4">
    <!-- Switch -->
    <label class="shc-switch-wrapper">
      <button class="shc-switch" data-switch role="switch" aria-checked="false">
        <span class="shc-switch-thumb"></span>
      </button>
      <span class="shc-switch-label">Main Power</span>
    </label>
    
    <!-- Slider -->
    <div class="space-y-2">
      <label class="shc-label">Brightness</label>
      <div class="shc-slider" data-slider data-min="0" data-max="100" data-value="75">
        <div class="shc-slider-track">
          <div class="shc-slider-range"></div>
        </div>
        <div class="shc-slider-thumb" role="slider" tabindex="0"></div>
      </div>
    </div>
    
    <!-- Select -->
    <div class="space-y-2">
      <label class="shc-label">Mode</label>
      <div class="shc-select" data-select>
        <button class="shc-select-trigger" data-select-trigger>
          <span class="shc-select-value" data-select-value data-placeholder="Select mode..."></span>
          <svg class="shc-select-icon" width="15" height="15" viewBox="0 0 15 15">
            <path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor"/>
          </svg>
        </button>
        <div class="shc-select-content" data-select-content data-state="closed">
          <div class="shc-select-item" data-select-item data-value="auto">Auto</div>
          <div class="shc-select-item" data-select-item data-value="heat">Heat</div>
          <div class="shc-select-item" data-select-item data-value="cool">Cool</div>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## CSS Class Cheat Sheet

### Layout
- `.shc-card` - Card container
- `.shc-separator` - Horizontal divider
- `.shc-separator-vertical` - Vertical divider
- `.shc-aspect-ratio` - Aspect ratio container
- `.shc-aspect-video` - 16:9 ratio
- `.shc-aspect-square` - 1:1 ratio

### Typography
- `.shc-label` - Form label
- `.shc-badge` - Badge/tag
- `.shc-badge-primary` - Primary badge
- `.shc-badge-destructive` - Error badge
- `.shc-alert` - Alert box
- `.shc-alert-destructive` - Error alert

### Forms
- `.shc-input` - Text input
- `.shc-textarea` - Multi-line input
- `.shc-checkbox` - Checkbox button
- `.shc-checkbox-wrapper` - Checkbox + label
- `.shc-radio-group` - Radio group container
- `.shc-radio-button` - Radio button
- `.shc-switch` - Toggle switch
- `.shc-switch-wrapper` - Switch + label
- `.shc-select` - Select dropdown
- `.shc-slider` - Range slider

### Interactive
- `.shc-btn` - Button base
- `.shc-btn-primary` - Primary button
- `.shc-btn-secondary` - Secondary button
- `.shc-toggle` - Toggle button
- `.shc-accordion` - Accordion container
- `.shc-collapsible` - Collapsible container
- `.shc-tabs` - Tabs container

### Feedback
- `.shc-progress` - Progress bar
- `.shc-skeleton` - Loading placeholder
- `.shc-avatar` - Avatar container

### Utilities
- `.shc-code` - Inline code
- `.shc-kbd` - Keyboard key
- `.space-y-{n}` - Vertical spacing
- `.space-x-{n}` - Horizontal spacing
- `.flex` - Flexbox
- `.grid` - Grid layout

---

## Resources

- **[Full Documentation](COMPONENTS.md)** - Complete component reference
- **[Tutorial](TUTORIAL.md)** - Learn by building
- **[Interactive Guide](PHASE2_COMPONENTS.md)** - Phase 2 components
- **[README](README.md)** - Getting started