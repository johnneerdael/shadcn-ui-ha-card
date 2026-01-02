# Input Components

Components for user interaction and entity control.

---

## Button

A clickable button for actions and service calls.

![Button](https://ui.shadcn.com/og/button.png)

### Variants
- `default` - Primary action
- `secondary` - Less prominent
- `outline` - Bordered
- `ghost` - Minimal
- `destructive` - Dangerous actions

### Basic Usage

```yaml
content: |
  <button class="shc-btn" data-entity="script.good_morning">
    Good Morning
  </button>

  <button class="shc-btn shc-btn-outline" data-entity="light.living_room">
    <ha-icon icon="mdi:lightbulb"></ha-icon>
    Toggle Light
  </button>

  <button class="shc-btn shc-btn-destructive" data-entity="script.alarm">
    Emergency
  </button>
```

### Scene Buttons

```yaml
content: |
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
    {% for scene in [
      {'entity': 'scene.movie', 'icon': 'mdi:movie', 'name': 'Movie'},
      {'entity': 'scene.dinner', 'icon': 'mdi:silverware', 'name': 'Dinner'},
      {'entity': 'scene.reading', 'icon': 'mdi:book', 'name': 'Reading'},
      {'entity': 'scene.sleep', 'icon': 'mdi:bed', 'name': 'Sleep'}
    ] %}
    <button class="shc-btn shc-btn-outline" data-entity="{{ scene.entity }}">
      <ha-icon icon="{{ scene.icon }}"></ha-icon>
      {{ scene.name }}
    </button>
    {% endfor %}
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-btn` | Base button |
| `shc-btn-secondary` | Secondary style |
| `shc-btn-outline` | Bordered |
| `shc-btn-ghost` | Minimal |
| `shc-btn-destructive` | Red/danger |
| `shc-btn-sm` | Small size |
| `shc-btn-lg` | Large size |
| `shc-btn-icon` | Icon-only (square) |

---

## Switch

A toggle switch for on/off states.

![Switch](https://ui.shadcn.com/og/switch.png)

### Supported Entities
`light`, `switch`, `fan`, `input_boolean`, `automation`

### Basic Usage

```yaml
content: |
  <div style="display: flex; align-items: center; justify-content: space-between;">
    <span>Living Room Light</span>
    <button
      class="shc-switch"
      data-entity="light.living_room"
      data-state="{{ 'checked' if is_state('light.living_room', 'on') else '' }}"
    >
      <span class="shc-switch-thumb"></span>
    </button>
  </div>
```

### Device List

```yaml
content: |
  <div style="display: grid; gap: 12px;">
    {% for device in [
      {'entity': 'light.ceiling', 'icon': 'mdi:ceiling-light', 'name': 'Ceiling'},
      {'entity': 'light.lamp', 'icon': 'mdi:lamp', 'name': 'Floor Lamp'},
      {'entity': 'switch.tv', 'icon': 'mdi:television', 'name': 'TV'}
    ] %}
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <ha-icon icon="{{ device.icon }}"></ha-icon>
        <span>{{ device.name }}</span>
      </div>
      <button class="shc-switch" data-entity="{{ device.entity }}" data-state="{{ 'checked' if is_state(device.entity, 'on') else '' }}">
        <span class="shc-switch-thumb"></span>
      </button>
    </div>
    {% endfor %}
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-switch` | Switch container |
| `shc-switch-thumb` | Moving indicator |

---

## Slider

A range input for numeric values.

![Slider](https://ui.shadcn.com/og/slider.png)

### Supported Entities
`light` (brightness), `cover` (position), `fan` (speed), `input_number`, `number`

### Basic Usage

```yaml
content: |
  <div>
    <label style="display: block; margin-bottom: 8px;">Brightness</label>
    <input
      type="range"
      class="shc-slider"
      min="0"
      max="255"
      value="{{ state_attr('light.living_room', 'brightness') | default(0) }}"
      data-entity="light.living_room"
      data-attribute="brightness"
    />
  </div>
```

### Light Control Card

```yaml
content: |
  <div style="padding: 16px;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <ha-icon icon="mdi:lightbulb" style="{{ 'color: var(--warning);' if is_state('light.living_room', 'on') else '' }}"></ha-icon>
        <span>{{ state_attr('light.living_room', 'friendly_name') }}</span>
      </div>
      <button class="shc-switch" data-entity="light.living_room" data-state="{{ 'checked' if is_state('light.living_room', 'on') else '' }}">
        <span class="shc-switch-thumb"></span>
      </button>
    </div>
    {% if is_state('light.living_room', 'on') %}
    <input
      type="range"
      class="shc-slider"
      min="0" max="255"
      value="{{ state_attr('light.living_room', 'brightness') }}"
      data-entity="light.living_room"
      data-attribute="brightness"
    />
    {% endif %}
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-slider` | Base slider |

---

## Toggle

A pressed-state button (alternative to switch).

![Toggle](https://ui.shadcn.com/og/toggle.png)

### Basic Usage

```yaml
content: |
  <button
    class="shc-toggle"
    data-entity="light.desk_lamp"
    data-state="{{ 'pressed' if is_state('light.desk_lamp', 'on') else '' }}"
  >
    <ha-icon icon="mdi:desk-lamp"></ha-icon>
  </button>
```

### Quick Actions Toolbar

```yaml
content: |
  <div style="display: flex; gap: 8px; flex-wrap: wrap;">
    {% for item in [
      {'entity': 'switch.gaming_mode', 'icon': 'mdi:gamepad-variant', 'name': 'Gaming'},
      {'entity': 'switch.movie_mode', 'icon': 'mdi:movie', 'name': 'Movie'},
      {'entity': 'switch.work_mode', 'icon': 'mdi:briefcase', 'name': 'Work'}
    ] %}
    <button
      class="shc-toggle"
      data-entity="{{ item.entity }}"
      data-state="{{ 'pressed' if is_state(item.entity, 'on') else '' }}"
    >
      <ha-icon icon="{{ item.icon }}"></ha-icon>
      {{ item.name }}
    </button>
    {% endfor %}
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-toggle` | Base toggle |
| `shc-toggle-outline` | Bordered variant |
| `shc-toggle-sm` | Small size |
| `shc-toggle-lg` | Large size |

---

## Checkbox

A checkbox for boolean selection.

![Checkbox](https://ui.shadcn.com/og/checkbox.png)

### Supported Entities
`input_boolean`, `switch`

### Basic Usage

```yaml
content: |
  <label class="shc-checkbox-container">
    <input
      type="checkbox"
      class="shc-checkbox"
      data-entity="input_boolean.guest_mode"
      {{ 'checked' if is_state('input_boolean.guest_mode', 'on') else '' }}
    />
    <span>Enable Guest Mode</span>
  </label>
```

### Notification Settings

```yaml
content: |
  <div style="display: flex; flex-direction: column; gap: 12px;">
    {% for option in [
      {'entity': 'input_boolean.notify_motion', 'label': 'Motion alerts'},
      {'entity': 'input_boolean.notify_door', 'label': 'Door/window alerts'},
      {'entity': 'input_boolean.notify_climate', 'label': 'Climate alerts'}
    ] %}
    <label class="shc-checkbox-container">
      <input type="checkbox" class="shc-checkbox" data-entity="{{ option.entity }}" {{ 'checked' if is_state(option.entity, 'on') else '' }} />
      <span>{{ option.label }}</span>
    </label>
    {% endfor %}
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-checkbox` | Base checkbox |
| `shc-checkbox-container` | Label wrapper |

---

## Select

A dropdown for selecting from options.

![Select](https://ui.shadcn.com/og/select.png)

### Supported Entities
`input_select`, `climate` (hvac_mode), `fan` (preset_mode)

### Basic Usage

```yaml
content: |
  <select
    class="shc-select"
    data-entity="input_select.house_mode"
  >
    {% for option in state_attr('input_select.house_mode', 'options') %}
    <option value="{{ option }}" {{ 'selected' if states('input_select.house_mode') == option else '' }}>
      {{ option }}
    </option>
    {% endfor %}
  </select>
```

### Climate Mode Select

```yaml
content: |
  <select
    class="shc-select"
    data-entity="climate.thermostat"
    data-action="climate.set_hvac_mode"
    data-attribute="hvac_mode"
  >
    {% for mode in state_attr('climate.thermostat', 'hvac_modes') %}
    <option value="{{ mode }}" {{ 'selected' if state_attr('climate.thermostat', 'hvac_mode') == mode else '' }}>
      {{ mode | title }}
    </option>
    {% endfor %}
  </select>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-select` | Base select |
| `shc-select-sm` | Small size |
| `shc-select-lg` | Large size |

---

## Input

A text input field.

![Input](https://ui.shadcn.com/og/input.png)

### Supported Entities
`input_text`, `text`, `input_number`

### Basic Usage

```yaml
content: |
  <input
    type="text"
    class="shc-input"
    data-entity="input_text.device_name"
    value="{{ states('input_text.device_name') }}"
    placeholder="Enter name..."
  />
```

### Number Input

```yaml
content: |
  <input
    type="number"
    class="shc-input"
    data-entity="input_number.target_temp"
    value="{{ states('input_number.target_temp') }}"
    min="16" max="28" step="0.5"
  />
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-input` | Base input |
| `shc-input-sm` | Small size |
| `shc-input-lg` | Large size |

---

## Textarea

A multi-line text input.

![Textarea](https://ui.shadcn.com/og/textarea.png)

### Basic Usage

```yaml
content: |
  <textarea
    class="shc-textarea"
    data-entity="input_text.notes"
    placeholder="Add notes..."
    rows="4"
  >{{ states('input_text.notes') }}</textarea>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-textarea` | Base textarea |

---

## Radio Group

Mutually exclusive options.

![Radio Group](https://ui.shadcn.com/og/radio-group.png)

### Supported Entities
`input_select`, `fan` (speed), `climate` (mode)

### Basic Usage

```yaml
content: |
  <fieldset class="shc-radio-group">
    {% for option in state_attr('input_select.house_mode', 'options') %}
    <label class="shc-radio-item">
      <input type="radio" name="mode" value="{{ option }}" {{ 'checked' if states('input_select.house_mode') == option else '' }} />
      <span>{{ option | title }}</span>
    </label>
    {% endfor %}
  </fieldset>
```

### Fan Speed Control

```yaml
content: |
  <fieldset class="shc-radio-group">
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
      {% for speed in [{'value': 25, 'label': 'Low'}, {'value': 50, 'label': 'Med'}, {'value': 75, 'label': 'High'}, {'value': 100, 'label': 'Max'}] %}
      <label class="shc-radio-card {{ 'shc-radio-card-selected' if state_attr('fan.ceiling', 'percentage') == speed.value else '' }}">
        <input type="radio" name="fan" value="{{ speed.value }}" {{ 'checked' if state_attr('fan.ceiling', 'percentage') == speed.value else '' }} />
        <span>{{ speed.label }}</span>
      </label>
      {% endfor %}
    </div>
  </fieldset>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-radio-group` | Container |
| `shc-radio-item` | Standard radio + label |
| `shc-radio-card` | Card-style option |
| `shc-radio-card-selected` | Selected card state |
