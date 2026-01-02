# Data Components

Components for data visualization.

---

## Avatar

User/person image display.

![Avatar](https://ui.shadcn.com/og/avatar.png)

### Supported Entities
`person`, `device_tracker`

### Basic Usage

```yaml
content: |
  <div class="shc-avatar">
    <img
      src="{{ state_attr('person.john', 'entity_picture') }}"
      alt="John"
      class="shc-avatar-image"
    />
    <span class="shc-avatar-fallback">JD</span>
  </div>
```

### Person with Status

```yaml
content: |
  <div style="display: flex; align-items: center; gap: 12px;">
    <div class="shc-avatar" style="position: relative;">
      {% if state_attr('person.john', 'entity_picture') %}
      <img src="{{ state_attr('person.john', 'entity_picture') }}" class="shc-avatar-image" />
      {% else %}
      <span class="shc-avatar-fallback">JD</span>
      {% endif %}
      <!-- Status dot -->
      <div style="position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--background); background: {{ 'var(--success)' if is_state('person.john', 'home') else 'var(--muted-foreground)' }};"></div>
    </div>
    <div>
      <div style="font-weight: 600;">John</div>
      <div style="font-size: 0.875rem; color: var(--muted-foreground);">
        {{ states('person.john') | title }}
      </div>
    </div>
  </div>
```

### Family Presence Row

```yaml
content: |
  <div style="display: flex; gap: 16px; justify-content: center;">
    {% for person in states.person %}
    <div style="text-align: center;">
      <div class="shc-avatar {{ 'shc-avatar-lg' }}" style="border: 3px solid {{ 'var(--success)' if person.state == 'home' else 'transparent' }};">
        {% if state_attr(person.entity_id, 'entity_picture') %}
        <img src="{{ state_attr(person.entity_id, 'entity_picture') }}" class="shc-avatar-image" />
        {% else %}
        <span class="shc-avatar-fallback">{{ person.attributes.friendly_name[:2] | upper }}</span>
        {% endif %}
      </div>
      <div style="font-size: 0.75rem; margin-top: 4px;">{{ person.attributes.friendly_name.split()[0] }}</div>
    </div>
    {% endfor %}
  </div>
```

### Size Variants

```yaml
content: |
  <div style="display: flex; align-items: center; gap: 12px;">
    <div class="shc-avatar shc-avatar-sm">
      <span class="shc-avatar-fallback">SM</span>
    </div>
    <div class="shc-avatar">
      <span class="shc-avatar-fallback">MD</span>
    </div>
    <div class="shc-avatar shc-avatar-lg">
      <span class="shc-avatar-fallback">LG</span>
    </div>
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-avatar` | Container |
| `shc-avatar-sm` | Small (32px) |
| `shc-avatar-lg` | Large (64px) |
| `shc-avatar-image` | Image element |
| `shc-avatar-fallback` | Initials fallback |

---

## Chart

Data visualization for sensors and history.

![Chart](https://ui.shadcn.com/og/chart.png)

### Supported Entities
`sensor`, `number`, `counter`

### Basic Usage

```yaml
content: |
  <div class="shc-chart" data-entity="sensor.temperature" data-hours="24">
    <!-- Chart renders here -->
  </div>
```

### Temperature Chart Card

```yaml
type: custom:shadcn-template-card
title: Temperature History
content: |
  <div class="shc-card-content">
    <!-- Current Value -->
    <div style="display: flex; justify-content: space-between; align-items: end; margin-bottom: 16px;">
      <div>
        <div style="font-size: 0.875rem; color: var(--muted-foreground);">Current</div>
        <div style="font-size: 2.5rem; font-weight: 700;">{{ states('sensor.temperature') }}°</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 0.875rem; color: var(--muted-foreground);">Today</div>
        <div style="font-size: 0.875rem;">
          <span style="color: var(--info);">↓ {{ state_attr('sensor.temperature', 'min') }}°</span>
          <span style="color: var(--destructive);">↑ {{ state_attr('sensor.temperature', 'max') }}°</span>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="shc-chart" data-entity="sensor.temperature" data-hours="24" style="height: 150px;">
    </div>
  </div>
```

### Energy Usage Chart

```yaml
type: custom:shadcn-template-card
title: Energy Usage
content: |
  <div class="shc-card-content">
    <div class="shc-tabs">
      <div class="shc-tabs-list shc-tabs-list-full">
        <input type="radio" name="energy-period" id="energy-day" class="shc-tabs-state" checked />
        <label for="energy-day" class="shc-tabs-trigger">Day</label>

        <input type="radio" name="energy-period" id="energy-week" class="shc-tabs-state" />
        <label for="energy-week" class="shc-tabs-trigger">Week</label>

        <input type="radio" name="energy-period" id="energy-month" class="shc-tabs-state" />
        <label for="energy-month" class="shc-tabs-trigger">Month</label>
      </div>

      <div class="shc-tabs-content" data-tab="day">
        <div class="shc-chart" data-entity="sensor.energy_hourly" data-hours="24" style="height: 200px;"></div>
      </div>
      <div class="shc-tabs-content" data-tab="week">
        <div class="shc-chart" data-entity="sensor.energy_daily" data-hours="168" style="height: 200px;"></div>
      </div>
      <div class="shc-tabs-content" data-tab="month">
        <div class="shc-chart" data-entity="sensor.energy_daily" data-hours="720" style="height: 200px;"></div>
      </div>
    </div>
  </div>
```

### Multi-Sensor Comparison

```yaml
type: custom:shadcn-template-card
title: Climate Sensors
content: |
  <div class="shc-card-content">
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 16px;">
      {% for sensor in [
        {'entity': 'sensor.living_room_temp', 'name': 'Living Room', 'color': 'var(--chart-1)'},
        {'entity': 'sensor.bedroom_temp', 'name': 'Bedroom', 'color': 'var(--chart-2)'},
        {'entity': 'sensor.kitchen_temp', 'name': 'Kitchen', 'color': 'var(--chart-3)'},
        {'entity': 'sensor.outdoor_temp', 'name': 'Outside', 'color': 'var(--chart-4)'}
      ] %}
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 12px; height: 12px; border-radius: 2px; background: {{ sensor.color }};"></div>
        <span style="font-size: 0.875rem;">{{ sensor.name }}</span>
        <span style="font-size: 0.875rem; font-weight: 600; margin-left: auto;">{{ states(sensor.entity) }}°</span>
      </div>
      {% endfor %}
    </div>

    <div class="shc-chart" data-entities="sensor.living_room_temp,sensor.bedroom_temp,sensor.kitchen_temp,sensor.outdoor_temp" data-hours="24" style="height: 200px;">
    </div>
  </div>
```

### Mini Sparkline

```yaml
content: |
  <div style="display: flex; align-items: center; gap: 12px;">
    <ha-icon icon="mdi:thermometer"></ha-icon>
    <div style="flex: 1;">
      <div style="font-weight: 500;">Temperature</div>
      <div class="shc-chart shc-chart-sparkline" data-entity="sensor.temperature" data-hours="6" style="height: 24px; width: 100px;"></div>
    </div>
    <div style="font-size: 1.25rem; font-weight: 700;">{{ states('sensor.temperature') }}°</div>
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-chart` | Base chart container |
| `shc-chart-sparkline` | Mini inline chart |

### Data Attributes
| Attribute | Description |
|-----------|-------------|
| `data-entity` | Single entity ID |
| `data-entities` | Comma-separated entity IDs |
| `data-hours` | History period |
| `data-type` | Chart type (line, bar, area) |

### Chart Configuration (Advanced)

```yaml
content: |
  <div
    class="shc-chart"
    data-entity="sensor.energy_daily"
    data-hours="168"
    data-type="bar"
    data-color="var(--success)"
    data-fill="true"
    data-show-grid="true"
    data-show-labels="true"
    style="height: 200px;"
  ></div>
```

### CSS Variables for Charts
| Variable | Description |
|----------|-------------|
| `--chart-1` | First series color |
| `--chart-2` | Second series color |
| `--chart-3` | Third series color |
| `--chart-4` | Fourth series color |
| `--chart-5` | Fifth series color |
