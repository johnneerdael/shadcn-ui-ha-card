# shadcdn-template-card Limitations

**Current Version**: 0.2.0  
**Last Updated**: 2025-12-31

---

## Overview

This document outlines the current limitations of shadcdn-template-card when integrating shadcn/ui components with Home Assistant. While the card provides powerful templating and styling capabilities, there are inherent constraints due to the shadow DOM isolation, static HTML rendering, and Home Assistant's execution environment.

---

## 🚫 Unsupported shadcn/ui Components

### Interactive Components with Complex State Management

These components **cannot be used** because they require React/Preact state management hooks and event handling that aren't supported in our static HTML template system:

#### 1. **Form Components**
- ❌ **Form** - Requires React Hook Form integration
- ❌ **Select** - Needs state management for dropdown
- ❌ **Combobox** - Requires search state and keyboard navigation
- ❌ **Command** - Complex command palette with state
- ❌ **Date Picker** - Calendar state and selection logic
- ❌ **Multi-Select** - Selection state management

**Why**: These components rely on `useState`, `useEffect`, and event handlers that execute JavaScript callbacks.

**Workaround**: Use static HTML `<select>`, `<input type="date">` with `.shc-input` styling.

```yaml
# ❌ Won't work
content: |
  <Select>...</Select>

# ✅ Use instead
content: |
  <select class="shc-input">
    <option>Option 1</option>
    <option>Option 2</option>
  </select>
```

---

#### 2. **Dialog/Modal Components**
- ❌ **Dialog** - Requires portal rendering and state
- ❌ **Alert Dialog** - Confirmation state management
- ❌ **Drawer** - Slide-in panel with animation state
- ❌ **Sheet** - Side panel with open/close state
- ❌ **Popover** - Positioning and visibility state
- ❌ **Tooltip** - Hover state and positioning
- ❌ **Hover Card** - Hover detection and state

**Why**: These components use React portals, complex positioning logic, and animation state machines.

**Workaround**: Use Home Assistant's native `browser_mod` or `popup-card` for modals.

---

#### 3. **Data Display Components**
- ❌ **Data Table** - Sorting, filtering, pagination state
- ❌ **Pagination** - Page state management
- ❌ **Collapsible** - Expand/collapse state
- ❌ **Accordion** - Multiple panel states
- ❌ **Tabs** - Active tab state

**Why**: These require state to track which items are selected, expanded, or visible.

**Workaround**: Use static layouts with Jinja2 conditionals for visibility.

```yaml
# ❌ Won't work
content: |
  <Accordion>...</Accordion>

# ✅ Use Jinja2 conditionals
content: |
  {% if show_details %}
    <div class="shc-card">Details here</div>
  {% endif %}
```

---

#### 4. **Navigation Components**
- ❌ **Menu** - Requires open/close state
- ❌ **Menubar** - Complex keyboard navigation
- ❌ **Navigation Menu** - Active route and dropdowns
- ❌ **Context Menu** - Right-click detection
- ❌ **Dropdown Menu** - State for open/closed

**Why**: Menus need JavaScript to handle clicks, keyboard events, and positioning.

**Workaround**: Use static button groups or Home Assistant's native navigation.

---

#### 5. **Feedback Components**
- ❌ **Toast/Sonner** - Requires notification queue state
- ⚠️ **Alert** - Static alerts work, but no close button functionality
- ❌ **Progress with Animation** - Cannot animate dynamically

**Why**: Toasts need a notification system with timers and state.

**Workaround**: Use Home Assistant's `persistent_notification` service.

---

#### 6. **Advanced Input Components**
- ❌ **Slider** - Requires drag state and value updates
- ❌ **Switch** - Toggle state management
- ❌ **Checkbox** - Checked state
- ❌ **Radio Group** - Selection state
- ❌ **Toggle Group** - Multiple toggle states
- ❌ **Input OTP** - Multi-input coordination

**Why**: These need to update state on user interaction.

**Workaround**: Use Home Assistant's `input_number`, `input_boolean`, or `input_select` entities, then display values via templates.

```yaml
# ❌ Won't work
content: |
  <Slider value={value} onChange={...} />

# ✅ Use Home Assistant entities
content: |
  <input type="range" 
         value="{{ states('input_number.temperature') }}"
         class="w-full">
  <div>Current: {{ states('input_number.temperature') }}°</div>
```

---

### ✅ Supported shadcn/ui Components

These components work because they're **purely presentational** (CSS-based):

#### Layout & Container Components
- ✅ **Card** (`.shc-card`, `.shc-card-header`, `.shc-card-content`)
- ✅ **Separator** (use `<hr class="...">` or divs with border)
- ✅ **Aspect Ratio** (use Tailwind `aspect-*` classes)
- ✅ **Scroll Area** (use `overflow-auto` classes)

#### Display Components
- ✅ **Badge** (`.shc-badge` variants)
- ✅ **Avatar** (use `<img>` with rounded classes)
- ✅ **Skeleton** (use animated background classes)
- ✅ **Alert** (static display only, no close button)

#### Typography Components
- ✅ **Typography** (standard HTML with Tailwind classes)
- ✅ **Label** (`.shc-label` or standard `<label>`)

#### Button Components
- ✅ **Button** (`.shc-btn` variants)
- ⚠️ **Button** with loading state (visual only, no actual loading)

---

## 🔒 Shadow DOM Limitations

### 1. **Global CSS Doesn't Apply**
The card uses Shadow DOM for style encapsulation. Home Assistant's global styles and custom themes **don't automatically apply** to card content.

**Impact**:
- Custom CSS in `themes.yaml` won't affect card
- Global font changes won't apply
- Custom icon fonts may not work

**Workaround**: Card automatically maps HA theme variables to CSS custom properties.

---

### 2. **No Access to Home Assistant's Component Registry**
Cannot use Home Assistant's custom elements like:
- ❌ `<ha-icon>` - HA's icon component
- ❌ `<ha-card>` - HA's card wrapper
- ❌ `<hui-*>` - HA's UI components
- ❌ `<state-badge>` - HA's state badge

**Workaround**: Use emojis or Unicode symbols for icons.

```yaml
content: |
  <!-- ❌ Won't work -->
  <ha-icon icon="mdi:lightbulb"></ha-icon>
  
  <!-- ✅ Use emoji -->
  <div class="text-2xl">💡</div>
```

---

### 3. **Event Handlers Don't Work**
Cannot use `onclick`, `onchange`, or other DOM event attributes because there's no JavaScript context.

```yaml
# ❌ Won't work
content: |
  <button onclick="alert('test')">Click</button>

# ✅ Buttons are visual only
content: |
  <button class="shc-btn shc-btn-primary">Visual Button</button>
```

---

## 🎨 Styling Limitations

### 1. **Limited Tailwind Directives**
Cannot use Tailwind's `@apply`, `@layer`, or `@screen` directives in inline styles.

**Works**:
- ✅ Utility classes: `flex`, `gap-4`, `text-lg`
- ✅ CSS variables: `bg-[var(--primary)]`
- ✅ Arbitrary values: `w-[300px]`

**Doesn't Work**:
- ❌ `@apply flex items-center`
- ❌ `@layer components { ... }`
- ❌ `@screen md { ... }`

---

### 2. **No CSS-in-JS**
Cannot use styled-components, emotion, or other CSS-in-JS libraries.

**Workaround**: Use Tailwind classes exclusively.

---

### 3. **Animation Limitations**
CSS animations work, but JavaScript-based animations (GSAP, Framer Motion) don't.

**Works**:
```yaml
content: |
  <div class="animate-pulse">Loading...</div>
```

**Doesn't Work**:
- ❌ JavaScript animation libraries
- ❌ Coordinated multi-element animations
- ❌ Animation callbacks

---

## 📊 Template Engine Limitations

### 1. **Jinja2 Subset Only**
Supports a **limited subset** of Jinja2 syntax:

**Supported**:
- ✅ Variables: `{{ var }}`
- ✅ For loops: `{% for x in y %}...{% endfor %}`
- ✅ Ternary: `{{ condition ? true : false }}`
- ✅ Filters: `|float`, `|int`, `|round()`, `|title`, `|upper`, `|lower`

**NOT Supported**:
- ❌ If/else blocks: `{% if %}...{% endif %}`
- ❌ Elif: `{% elif %}`
- ❌ Macros: `{% macro %}`
- ❌ Includes: `{% include %}`
- ❌ Extends/inheritance: `{% extends %}`
- ❌ Set: `{% set %}`
- ❌ Custom filters
- ❌ Tests: `{% if x is defined %}`

**Workaround**: Use ternary operators for conditionals:

```yaml
# ❌ Not supported
content: |
  {% if temperature > 20 %}
    Hot
  {% else %}
    Cold
  {% endif %}

# ✅ Use ternary
content: |
  {{ states('sensor.temperature')|float > 20 ? 'Hot' : 'Cold' }}
```

---

### 2. **No Template Caching**
Templates are re-evaluated on every Home Assistant state change, which can impact performance with complex templates.

**Impact**: Large loops or many entity lookups can cause lag.

**Workaround**: Keep templates simple, limit loops to <50 iterations.

---

### 3. **No Access to Home Assistant Template Functions**
Cannot use HA's native template functions like:
- ❌ `now()`
- ❌ `utcnow()`
- ❌ `relative_time()`
- ❌ `distance()`
- ❌ `is_state_attr()`

**Available Instead**:
- ✅ `states(entity_id)` - Get entity state
- ✅ `state_attr(entity_id, attr)` - Get attribute
- ✅ `Math.*` - JavaScript Math functions
- ✅ `Date.*` - JavaScript Date functions

---

## 🔐 Security Limitations

### 1. **Expression Sanitization**
The template engine blocks dangerous patterns to prevent code injection:

**Blocked Keywords**:
- `constructor`, `prototype`, `__proto__`
- `Function`, `eval`, `setTimeout`, `setInterval`
- `import`, `require`, `process`, `global`
- `window`, `document`, `fetch`, `XMLHttpRequest`
- `localStorage`, `sessionStorage`

**Impact**: Cannot access browser APIs or execute arbitrary code.

---

### 2. **HTML Escaping**
All template output is HTML-escaped to prevent XSS attacks:

```yaml
# Input
content: |
  {{ '<script>alert(1)</script>' }}

# Output (escaped)
&lt;script&gt;alert(1)&lt;/script&gt;
```

**Impact**: Cannot inject raw HTML via templates (by design).

---

## 📱 Device & Browser Limitations

### 1. **Mobile Browser Constraints**
- Some Tailwind utility classes may not work on older mobile browsers
- Flexbox/Grid work, but complex layouts may not render perfectly
- Touch events not captured (no JavaScript)

---

### 2. **Browser Compatibility**
Requires modern browser with:
- ES2015 support
- Shadow DOM v1
- CSS custom properties
- Flexbox/Grid

**Minimum Versions**:
- Chrome/Edge: 63+
- Firefox: 63+
- Safari: 11.1+
- iOS Safari: 11.3+

---

## 🎯 Performance Limitations

### 1. **No Code Splitting**
Entire card bundle loaded at once (~50-100KB gzipped).

**Impact**: Initial load time on slow connections.

---

### 2. **Re-render on Every State Change**
Card updates whenever ANY Home Assistant entity changes (though now throttled to 60fps).

**Impact**: High CPU usage if many entities change rapidly.

**Mitigation**: Update throttling implemented in v0.2.0.

---

### 3. **Large Lists**
Rendering 100+ items in a loop can cause lag.

**Recommendation**: Limit loops to <50 items for smooth performance.

---

## 🔄 Workarounds Summary

| Limitation | Workaround |
|------------|------------|
| Interactive forms | Use HA `input_*` entities, display via templates |
| Dialogs/modals | Use `browser_mod` or `popup-card` |
| Animations | Use CSS animations only |
| Icons | Use emojis or Unicode symbols |
| Conditionals | Use ternary operators: `{{ condition ? true : false }}` |
| State management | Rely on Home Assistant entities |
| Event handlers | Cards are display-only, no click actions |
| Data tables | Use static layouts with Jinja2 loops |
| Navigation | Use HA's native navigation |

---

## 🚀 Future Enhancements

These limitations may be addressed in future versions:

1. **If/Else Support** - Add `{% if %}` conditional blocks
2. **Action Binding** - Support `tap_action` like other HA cards
3. **Partial Re-renders** - Only update changed sections
4. **Component Presets** - Pre-built interactive components
5. **Animation Helpers** - JS-powered animations in controlled manner
6. **More Jinja2 Features** - Macros, includes, set statements

---

## 📞 Getting Help

**Questions about limitations?**
- Check [TUTORIAL.md](TUTORIAL.md) for working examples
- Review [README.md](README.md) for supported features
- See [BUG_ANALYSIS.md](BUG_ANALYSIS.md) for known issues

**Found a way around a limitation?**
- Share your workaround in GitHub Discussions
- Contribute examples to the tutorial

---

**Last Updated**: 2025-12-31  
**Version**: 0.2.0  
**Applies To**: shadcdn-template-card with Preact + Twind