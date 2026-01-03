# Feedback Components

Components for displaying status and information.

> **Tip:** For visual editing, use the [Visual Editor](../visual-editor.md) to add and configure components with drag-and-drop. Components also support [theme overrides](../theme-system.md#component-theme-override) in v2.2.0+.

---

## Alert

Callout for important messages.

![Alert](https://ui.shadcn.com/og/alert.png)

### Variants
- `default` - Standard
- `info` - Blue informational
- `success` - Green positive
- `warning` - Yellow caution
- `destructive` - Red error

### Basic Usage

```yaml
content: |
  <div class="shc-alert shc-alert-info">
    <ha-icon icon="mdi:information"></ha-icon>
    <div>
      <div class="shc-alert-title">Heads up!</div>
      <div class="shc-alert-description">Important information here.</div>
    </div>
  </div>
```

### Dynamic Status Alerts

```yaml
content: |
  {% if is_state('binary_sensor.system_problem', 'on') %}
  <div class="shc-alert shc-alert-destructive">
    <ha-icon icon="mdi:alert-circle"></ha-icon>
    <div>
      <div class="shc-alert-title">System Alert</div>
      <div class="shc-alert-description">{{ states('sensor.system_problem_description') }}</div>
    </div>
  </div>
  {% else %}
  <div class="shc-alert shc-alert-success">
    <ha-icon icon="mdi:check-circle"></ha-icon>
    <div>
      <div class="shc-alert-title">All Systems Normal</div>
      <div class="shc-alert-description">No issues detected.</div>
    </div>
  </div>
  {% endif %}
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-alert` | Base alert |
| `shc-alert-info` | Blue |
| `shc-alert-success` | Green |
| `shc-alert-warning` | Yellow |
| `shc-alert-destructive` | Red |
| `shc-alert-title` | Heading |
| `shc-alert-description` | Body text |

---

## Badge

Small status indicator.

![Badge](https://ui.shadcn.com/og/badge.png)

### Variants
- `default` - Primary
- `secondary` - Gray/muted
- `outline` - Border only
- `destructive` - Red

### Basic Usage

```yaml
content: |
  <span class="shc-badge">Default</span>
  <span class="shc-badge shc-badge-secondary">Secondary</span>
  <span class="shc-badge shc-badge-outline">Outline</span>
  <span class="shc-badge shc-badge-destructive">Error</span>
```

### Entity State Badges

```yaml
content: |
  <div style="display: flex; align-items: center; gap: 8px;">
    <span>Light</span>
    <span class="shc-badge {{ 'shc-badge-default' if is_state('light.living_room', 'on') else 'shc-badge-secondary' }}">
      {{ states('light.living_room') }}
    </span>
  </div>
```

### Room Counts

```yaml
content: |
  <div style="display: flex; align-items: center; gap: 8px;">
    <ha-icon icon="mdi:lightbulb"></ha-icon>
    <span>Lights</span>
    <span class="shc-badge shc-badge-secondary">
      {{ states.light | selectattr('state', 'eq', 'on') | list | count }}/{{ states.light | list | count }}
    </span>
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-badge` | Base (primary) |
| `shc-badge-secondary` | Gray |
| `shc-badge-outline` | Border only |
| `shc-badge-destructive` | Red |

---

## Progress

Horizontal progress bar.

![Progress](https://ui.shadcn.com/og/progress.png)

### Basic Usage

```yaml
content: |
  <div class="shc-progress">
    <div class="shc-progress-bar" style="width: 60%;"></div>
  </div>
```

### Battery Status

```yaml
content: |
  {% set level = states('sensor.phone_battery') | int %}
  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
    <span>Phone Battery</span>
    <span>{{ level }}%</span>
  </div>
  <div class="shc-progress">
    <div
      class="shc-progress-bar"
      style="width: {{ level }}%; background: {{ 'var(--destructive)' if level < 20 else 'var(--warning)' if level < 50 else 'var(--success)' }};"
    ></div>
  </div>
```

### Energy Usage

```yaml
content: |
  {% set used = states('sensor.energy_daily') | float %}
  {% set goal = 20 %}
  {% set percent = ((used / goal) * 100) | round %}

  <div style="text-align: center; margin-bottom: 12px;">
    <div style="font-size: 2rem; font-weight: 700;">{{ used }} kWh</div>
    <div style="color: var(--muted-foreground);">of {{ goal }} kWh goal</div>
  </div>

  <div class="shc-progress" style="height: 12px;">
    <div
      class="shc-progress-bar"
      style="width: {{ [percent, 100] | min }}%; background: {{ 'var(--destructive)' if percent > 100 else 'var(--success)' }};"
    ></div>
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-progress` | Container track |
| `shc-progress-bar` | Filled portion |
| `shc-progress-bar-animated` | Animated stripes |

---

## Label

Text label for form elements.

![Label](https://ui.shadcn.com/og/label.png)

### Basic Usage

```yaml
content: |
  <label class="shc-label">Device Name</label>
  <input type="text" class="shc-input" style="margin-top: 8px;" />
```

### With Description

```yaml
content: |
  <label class="shc-label">Email</label>
  <p class="shc-label-description">We'll never share your email.</p>
  <input type="email" class="shc-input" style="margin-top: 8px;" />
```

### Sensor Labels

```yaml
content: |
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
    <div>
      <label class="shc-label" style="color: var(--muted-foreground);">Temperature</label>
      <div style="font-size: 1.5rem; font-weight: 700;">{{ states('sensor.temperature') }}°C</div>
    </div>
    <div>
      <label class="shc-label" style="color: var(--muted-foreground);">Humidity</label>
      <div style="font-size: 1.5rem; font-weight: 700;">{{ states('sensor.humidity') }}%</div>
    </div>
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-label` | Base label |
| `shc-label-description` | Helper text |

---

## Tooltip

Hover-triggered popup.

![Tooltip](https://ui.shadcn.com/og/tooltip.png)

### Positions
- `top` (default)
- `bottom`
- `left`
- `right`

### Basic Usage (CSS-Only)

```yaml
content: |
  <div class="shc-tooltip">
    <button class="shc-btn shc-btn-icon">
      <ha-icon icon="mdi:lightbulb"></ha-icon>
    </button>
    <span class="shc-tooltip-content">Living Room Light</span>
  </div>
```

### Icon Tooltips

```yaml
content: |
  <div style="display: flex; gap: 8px;">
    {% for item in [
      {'icon': 'mdi:lightbulb', 'tip': 'Lights'},
      {'icon': 'mdi:thermostat', 'tip': 'Climate'},
      {'icon': 'mdi:lock', 'tip': 'Locks'}
    ] %}
    <div class="shc-tooltip">
      <button class="shc-btn shc-btn-ghost shc-btn-icon">
        <ha-icon icon="{{ item.icon }}"></ha-icon>
      </button>
      <span class="shc-tooltip-content">{{ item.tip }}</span>
    </div>
    {% endfor %}
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-tooltip` | Container |
| `shc-tooltip-content` | Popup text |
| `shc-tooltip-top/bottom/left/right` | Position |

---

## Hover Card

Rich content on hover.

![Hover Card](https://ui.shadcn.com/og/hover-card.png)

### Basic Usage (CSS-Only)

```yaml
content: |
  <div class="shc-hover-card">
    <span class="shc-hover-card-trigger" style="cursor: pointer;">
      Hover me
    </span>
    <div class="shc-hover-card-content" style="width: 280px;">
      <div style="padding: 16px;">
        <h4 style="font-weight: 600;">Title</h4>
        <p style="color: var(--muted-foreground);">Rich content here...</p>
      </div>
    </div>
  </div>
```

### Entity Preview

```yaml
content: |
  <div class="shc-hover-card">
    <button class="shc-btn shc-btn-outline shc-hover-card-trigger" data-entity="light.living_room">
      <ha-icon icon="mdi:lightbulb"></ha-icon> Living Room
    </button>
    <div class="shc-hover-card-content" style="width: 280px;">
      <div style="padding: 16px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <ha-icon icon="mdi:lightbulb" style="font-size: 24px;"></ha-icon>
          <div>
            <div style="font-weight: 600;">{{ state_attr('light.living_room', 'friendly_name') }}</div>
            <span class="shc-badge {{ 'shc-badge-default' if is_state('light.living_room', 'on') else 'shc-badge-secondary' }}">
              {{ states('light.living_room') }}
            </span>
          </div>
        </div>
        <button class="shc-btn shc-btn-sm" style="width: 100%;" data-entity="light.living_room">
          Toggle
        </button>
      </div>
    </div>
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-hover-card` | Container |
| `shc-hover-card-trigger` | Trigger element |
| `shc-hover-card-content` | Floating card |

---

## Alert Dialog

Confirmation dialog for destructive actions.

![Alert Dialog](https://ui.shadcn.com/og/alert-dialog.png)

### Basic Usage (CSS-Only)

```yaml
content: |
  <div class="shc-alert-dialog">
    <input type="checkbox" id="confirm-1" class="shc-alert-dialog-state" />
    <label for="confirm-1" class="shc-btn shc-btn-destructive">Delete</label>

    <div class="shc-alert-dialog-overlay">
      <div class="shc-alert-dialog-content">
        <div class="shc-alert-dialog-header">
          <h3 class="shc-alert-dialog-title">Are you sure?</h3>
          <p class="shc-alert-dialog-description">
            This action cannot be undone.
          </p>
        </div>
        <div class="shc-alert-dialog-footer">
          <label for="confirm-1" class="shc-btn shc-btn-outline">Cancel</label>
          <button class="shc-btn shc-btn-destructive">Delete</button>
        </div>
      </div>
    </div>
  </div>
```

### Confirm Dangerous Action

```yaml
content: |
  <div class="shc-alert-dialog">
    <input type="checkbox" id="reset-confirm" class="shc-alert-dialog-state" />
    <label for="reset-confirm" class="shc-btn shc-btn-destructive">
      <ha-icon icon="mdi:restore"></ha-icon>
      Factory Reset
    </label>

    <div class="shc-alert-dialog-overlay">
      <div class="shc-alert-dialog-content">
        <div class="shc-alert-dialog-header">
          <h3 class="shc-alert-dialog-title">Factory Reset Device?</h3>
          <p class="shc-alert-dialog-description">
            This will erase all settings and return the device to factory defaults. This action cannot be undone.
          </p>
        </div>
        <div class="shc-alert-dialog-footer">
          <label for="reset-confirm" class="shc-btn shc-btn-outline">Cancel</label>
          <button class="shc-btn shc-btn-destructive" data-entity="script.factory_reset">
            Yes, Reset Device
          </button>
        </div>
      </div>
    </div>
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-alert-dialog` | Container |
| `shc-alert-dialog-state` | Hidden checkbox |
| `shc-alert-dialog-overlay` | Full overlay |
| `shc-alert-dialog-content` | Dialog box |
| `shc-alert-dialog-header` | Header |
| `shc-alert-dialog-title` | Title |
| `shc-alert-dialog-description` | Body text |
| `shc-alert-dialog-footer` | Actions |
