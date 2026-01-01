# Status Banner Card

[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/release/jneerdael/status-banner-card.svg)](https://github.com/jneerdael/status-banner-card/releases)
[![License](https://img.shields.io/github/license/jneerdael/status-banner-card.svg)](LICENSE)

A flexible Home Assistant Lovelace card with a distinctive banner design for displaying entity states. Perfect for garbage collection schedules, EV charging status, alarm systems, or any status-driven automation.

![Status Banner Card Preview](docs/preview.png)

## Features

- 🎨 **Distinctive Banner Design** - Angled color accent with optional diagonal stripe pattern
- 🔧 **Fully Configurable** - Rule-based state-to-display mapping
- 📝 **Template Support** - Use `{{ state }}`, `{{ attr.name }}`, filters, and more
- 🎯 **Action Support** - Tap actions, button actions, service calls
- 🌈 **Color Mapping** - Define color palettes for dynamic theming
- 📱 **Responsive** - Works on all screen sizes
- 🌙 **Theme Support** - Respects Home Assistant themes
- 📋 **Visual Editor** - Full GUI configuration

## Examples

![EV Charging Card](https://github.com/johnneerdael/status-banner-card/blob/main/examples/ev-charging.png?raw=true)

- [EV Charging Blueprint](https://gist.githubusercontent.com/johnneerdael/a71b316da3ece86165fe3ae4a9668023/raw/d06c38c4ce01cc7582e6c29174533ec96ccd4ac6/ev-charging-001.yaml), Addons used: Lynk&Co, Zonneplan, and PirateWeather, Camera Integration and LLM Vision + AI Task

![Smart Bin Detection Card](https://github.com/johnneerdael/status-banner-card/blob/main/examples/garbage-collection.png?raw=true)

- [Smart Bin Detection Blueprint](https://gist.githubusercontent.com/johnneerdael/f1907f11554b50ee9eee3391987f9092/raw/d105230acd8447b602b1cbea8638129085405083/garbage-collection-001.yaml), Addons used: Afvalbeheer, Time and Date, TTS and Camera Integration and LLM Vision

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Click the three dots menu → Custom repositories
3. Add `https://github.com/jneerdael/status-banner-card` as a Lovelace repository
4. Search for "Status Banner Card" and install
5. Refresh your browser

### Manual Installation

1. Download `status-banner-card.js` from the [latest release](https://github.com/jneerdael/status-banner-card/releases)
2. Copy to `/config/www/status-banner-card.js`
3. Add resource in Home Assistant:
   - Go to Settings → Dashboards → Resources
   - Add `/local/status-banner-card.js` as JavaScript Module

## Quick Start

```yaml
type: custom:status-banner-card
entity: sensor.garbage_dashboard_status

rules:
  - state: PUT_OUT
    title: "PUT OUT {{ attr.friendly_name_text | upper }}"
    subtitle: "Collection Tomorrow"
    icon: mdi:delete-restore
    color: "{{ attr.target_bin | color_map }}"
    status_text: "Scheduled. AI will verify placement tonight."

  - state: BRING_IN
    title: "BRING IN {{ attr.friendly_name_text | upper }}"
    subtitle: "Bin Detected on Street"
    icon: mdi:delete-alert
    color: "#F44336"
    status_text: "Please return the bin to the garage."

default:
  title: "NO ACTIVE TASKS"
  subtitle: "All Bins accounted for"
  icon: mdi:delete-off
  color: "#505050"
  status_text: "Next collection: {{ states('sensor.avalex_tomorrow') }}"

color_map:
  blue: "#2196F3"
  green: "#4CAF50"
  purple: "#9C27B0"
  black: "#686868"
```

## Configuration

### Basic Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `entity` | string | ✅ | - | Primary entity ID |
| `rules` | array | ❌ | `[]` | State-to-display rules |
| `default` | object | ❌ | - | Default display when no rules match |
| `color_map` | object | ❌ | - | Named color mappings |

### Rule Configuration

Each rule in the `rules` array can have:

| Option | Type | Description |
|--------|------|-------------|
| `state` | string | State value to match (exact or `/regex/`) |
| `attribute` | object | Match on attribute: `{ name: "attr_name", value: "value" }` |
| `title` | string | Title text (supports templates) |
| `subtitle` | string | Subtitle text (supports templates) |
| `icon` | string | MDI icon (e.g., `mdi:home`) |
| `color` | string | Hex color or template with `color_map` |
| `status_text` | string | Status box text (supports templates) |

### Layout Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `show_pattern` | boolean | `true` | Show diagonal stripe pattern |
| `show_status` | boolean | `true` | Show status box |
| `show_footer` | boolean | `true` | Show footer with timestamp/button |
| `header_height` | string | `120px` | Header section height |
| `icon_size` | string | `54px` | Main icon size |
| `border_radius` | string | `16px` | Card corner radius |
| `variant` | string | `full` | Card variant: `full`, `header-only`, `compact` |

### Footer Options

| Option | Type | Description |
|--------|------|-------------|
| `timestamp_entity` | string | Entity for "Last Check" timestamp |
| `timestamp_attribute` | string | Attribute name (default: `last_triggered`) |
| `button_actions` | array | Button configurations |

### Button Action

```yaml
button_actions:
  - selector: ".update-btn"
    label: "Update Status"
    icon: mdi:refresh
    tap_action:
      action: call-service
      service: input_button.press
      target:
        entity_id: input_button.garbage_status_manual
```

## Template System

### Available Variables

| Variable | Description |
|----------|-------------|
| `{{ state }}` | Entity state value |
| `{{ attr.name }}` | Entity attribute |
| `{{ states('entity_id') }}` | Another entity's state |
| `{{ state_attr('entity_id', 'attr') }}` | Another entity's attribute |

### Available Filters

| Filter | Example | Description |
|--------|---------|-------------|
| `upper` | `{{ state \| upper }}` | UPPERCASE |
| `lower` | `{{ state \| lower }}` | lowercase |
| `capitalize` | `{{ state \| capitalize }}` | Capitalize |
| `title` | `{{ state \| title }}` | Title Case |
| `replace` | `{{ state \| replace('_', ' ') }}` | Replace text |
| `default` | `{{ attr.val \| default('N/A') }}` | Fallback value |
| `color_map` | `{{ attr.type \| color_map }}` | Map to color |
| `timestamp_custom` | `{{ ts \| timestamp_custom('%H:%M') }}` | Format timestamp |
| `round` | `{{ value \| round(2) }}` | Round number |
| `int` | `{{ value \| int }}` | Convert to integer |
| `float` | `{{ value \| float }}` | Convert to float |

## Entity & Template Sensor Setup

- **Recommended state values:** `PUT_OUT`, `BRING_IN`, `IDLE` (or any domain-specific states you map in `rules`).
- **Recommended attributes:**
  - `target_bin`: short key for the color/type (e.g., `blue`, `green`, `purple`, `black`).
  - `friendly_name_text`: display-friendly name (e.g., "Paper", "Compost").
  - Optional: `status_reason`, `next_collection`, `source` (e.g., `schedule`, `vision`, `manual`).
- **Color mapping:** Define `color_map` in the card config and refer to it with `{{ attr.target_bin \| color_map }}` inside `rules`.

### Color mapping (card config)

```yaml
type: custom:status-banner-card
entity: sensor.garbage_dashboard_status

color_map:
  blue: "#2196F3"
  green: "#4CAF50"
  purple: "#9C27B0"
  black: "#686868"
  default: "#9E9E9E"
```

## Simple schedule-driven template sensor

```yaml
template:
  - sensor:
      - name: Garbage Dashboard Status
        unique_id: garbage_dashboard_status
        state: >
          {% set raw_tomorrow = states('sensor.avalex_tomorrow') | lower %}
          {% set raw_today = states('sensor.avalex_today') | lower %}
          {% set invalid = ['unknown', 'unavailable', 'geen', 'none'] %}
          {% set has_tomorrow = raw_tomorrow not in invalid %}
          {% set has_today = raw_today not in invalid %}
          {% if has_tomorrow %}
            PUT_OUT
          {% elif has_today %}
            BRING_IN
          {% else %}
            IDLE
          {% endif %}
        attributes:
          target_bin: >
            {% set cmap = {'restafval': 'black', 'gft': 'green', 'papier': 'blue', 'pmd': 'purple'} %}
            {% if raw_tomorrow not in ['unknown', 'unavailable', 'geen', 'none'] %}
              {{ cmap.get(raw_tomorrow, 'none') }}
            {% elif raw_today not in ['unknown', 'unavailable', 'geen', 'none'] %}
              {{ cmap.get(raw_today, 'none') }}
            {% else %}
              none
            {% endif %}
          friendly_name_text: >
            {% set names = {'restafval': 'General Waste', 'gft': 'Compost', 'pmd': 'Plastic and Metal', 'papier': 'Paper'} %}
            {% if raw_tomorrow not in ['unknown', 'unavailable', 'geen', 'none'] %}
              {{ names.get(raw_tomorrow, raw_tomorrow) }}
            {% elif raw_today not in ['unknown', 'unavailable', 'geen', 'none'] %}
              {{ names.get(raw_today, raw_today) }}
            {% else %}
              Bin
            {% endif %}
          next_collection: "{{ states('sensor.avalex_tomorrow') }}"
```

### Card config (simple)

```yaml
type: custom:status-banner-card
entity: sensor.garbage_dashboard_status

color_map:
  blue: "#2196F3"
  green: "#4CAF50"
  purple: "#9C27B0"
  black: "#686868"
  default: "#9E9E9E"

rules:
  - state: PUT_OUT
    title: "PUT OUT {{ attr.friendly_name_text | upper }}"
    subtitle: "Collection Tomorrow"
    icon: mdi:delete-restore
    color: "{{ attr.target_bin | color_map }}"
    status_text: "Scheduled. AI/automation will verify placement tonight."
  - state: BRING_IN
    title: "BRING IN {{ attr.friendly_name_text | upper }}"
    subtitle: "Bin Detected on Street"
    icon: mdi:delete-alert
    color: "#F44336"
    status_text: "Please return the bin to the garage."

default:
  title: "NO ACTIVE TASKS"
  subtitle: "All bins accounted for"
  icon: mdi:delete-off
  color: "#505050"
  status_text: "Next collection: {{ states('sensor.avalex_tomorrow') }}"
```

## Advanced vision + memory outline (matches automation)

Use the provided automation (LLM vision with multi-day memory) to update `input_text.bin_status_memory` and rely on schedule sensors. The template sensor below prioritizes memory when the bin is out, then schedule:

```yaml
template:
  - sensor:
      - name: Garbage Dashboard Status
        unique_id: garbage_dashboard_status
        state: >
          {% set mem = states('input_text.bin_status_memory') %}
          {% set raw_tomorrow = states('sensor.avalex_tomorrow') | lower %}
          {% set raw_today = states('sensor.avalex_today') | lower %}
          {% set invalid = ['unknown', 'unavailable', 'geen', 'none', ''] %}
          {% if mem not in invalid %}
            BRING_IN
          {% elif raw_tomorrow not in invalid %}
            PUT_OUT
          {% elif raw_today not in invalid %}
            BRING_IN
          {% else %}
            IDLE
          {% endif %}
        attributes:
          target_bin: >
            {% set cmap = {'restafval': 'black', 'gft': 'green', 'papier': 'blue', 'pmd': 'purple'} %}
            {% if mem not in ['unknown', 'unavailable', ''] %}
              {{ mem }}
            {% elif raw_tomorrow not in ['unknown', 'unavailable', 'geen', 'none'] %}
              {{ cmap.get(raw_tomorrow, 'none') }}
            {% elif raw_today not in ['unknown', 'unavailable', 'geen', 'none'] %}
              {{ cmap.get(raw_today, 'none') }}
            {% else %}
              none
            {% endif %}
          friendly_name_text: >
            {% set names = {'restafval': 'General Waste', 'gft': 'Compost', 'pmd': 'Plastic and Metal', 'papier': 'Paper'} %}
            {% if mem not in ['unknown', 'unavailable', ''] %}
              {{ mem | capitalize }}
            {% elif raw_tomorrow not in ['unknown', 'unavailable', 'geen', 'none'] %}
              {{ names.get(raw_tomorrow, raw_tomorrow) }}
            {% elif raw_today not in ['unknown', 'unavailable', 'geen', 'none'] %}
              {{ names.get(raw_today, raw_today) }}
            {% else %}
              Bin
            {% endif %}
          status_reason: >
            {% if mem not in ['unknown', 'unavailable', ''] %}
              Vision/memory indicates bin still out
            {% else %}
              Schedule-driven
            {% endif %}
          source: >
            {% if mem not in ['unknown', 'unavailable', ''] %}vision{% else %}schedule{% endif %}
```

### Card config (advanced vision + memory)

```yaml
type: custom:status-banner-card
entity: sensor.garbage_dashboard_status

color_map:
  blue: "#2196F3"
  green: "#4CAF50"
  purple: "#9C27B0"
  black: "#686868"
  default: "#9E9E9E"

rules:
  - state: PUT_OUT
    title: "PUT OUT {{ attr.friendly_name_text | upper }}"
    subtitle: "Collection Tomorrow"
    icon: mdi:delete-restore
    color: "{{ attr.target_bin | color_map }}"
    status_text: >
      Scheduled. Vision will verify placement tonight.
  - state: BRING_IN
    title: "BRING IN {{ attr.friendly_name_text | upper }}"
    subtitle: >
      {% if attr.source == 'vision' %}Bin detected on street{% else %}Based on collection schedule{% endif %}
    icon: mdi:delete-alert
    color: "#F44336"
    status_text: >
      {% if attr.status_reason %}{{ attr.status_reason }}{% else %}Please return the bin.{% endif %}

default:
  title: "NO ACTIVE TASKS"
  subtitle: "All bins accounted for"
  icon: mdi:delete-off
  color: "#505050"
  status_text: "Next collection: {{ states('sensor.avalex_tomorrow') }}"
```

Notes:
- The automation should write the detected color to `input_text.bin_status_memory` when a bin stays out, and clear it once returned.
- The LLM vision step counts bins by color; keep color keys aligned with `color_map` and the automation’s mapping.
- Floodlight on/off and multi-camera shots improve detection quality.
- Use `mode: parallel` with a `max` guard (as in the provided automation) to allow manual tests without blocking scheduled runs.

## Examples

### EV Charging Status

```yaml
type: custom:status-banner-card
entity: input_select.ev_ai_action

rules:
  - state: CHARGE_NOW
    title: "{{ state | replace('_', ' ') }}"
    subtitle: "{{ states('input_text.ev_ai_time_window') }}"
    icon: mdi:lightning-bolt
    color: "#4CAF50"
    status_text: "{{ states('input_text.ev_ai_reason') }}"

  - state: STOP_CHARGING
    title: "{{ state | replace('_', ' ') }}"
    subtitle: "{{ states('input_text.ev_ai_time_window') }}"
    icon: mdi:stop-circle-outline
    color: "#F44336"
    status_text: "{{ states('input_text.ev_ai_reason') }}"

default:
  title: "{{ state | replace('_', ' ') }}"
  subtitle: "Monitoring"
  icon: mdi:clock-outline
  color: "#FF9800"

timestamp_entity: automation.ev_charging_ai_energy_strategist
```

### Alarm Status

```yaml
type: custom:status-banner-card
entity: alarm_control_panel.home

rules:
  - state: armed_away
    title: ARMED AWAY
    subtitle: House Secured
    icon: mdi:shield-lock
    color: "#F44336"
    status_text: "All sensors active"

  - state: armed_home
    title: ARMED HOME
    subtitle: Perimeter Only
    icon: mdi:shield-home
    color: "#FF9800"
    status_text: "Motion sensors disabled"

  - state: disarmed
    title: DISARMED
    subtitle: System Inactive
    icon: mdi:shield-off
    color: "#4CAF50"

default:
  title: "{{ state | upper }}"
  icon: mdi:shield-alert
  color: "#9E9E9E"
```

### Compact Variant

```yaml
type: custom:status-banner-card
entity: sensor.cpu_temperature
variant: compact
show_status: false
show_footer: false

rules:
  - state: "/[0-5][0-9]/"
    title: "CPU TEMP: {{ state }}°C"
    icon: mdi:thermometer
    color: "#4CAF50"

  - state: "/[6-7][0-9]/"
    title: "CPU TEMP: {{ state }}°C"
    icon: mdi:thermometer-alert
    color: "#FF9800"

default:
  title: "CPU TEMP: {{ state }}°C"
  icon: mdi:thermometer-high
  color: "#F44336"
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Lint code
npm run lint
```

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Credits

Inspired by the [tailwindcss-template-card](https://github.com/usernein/tailwindcss-template-card) and the Home Assistant [boilerplate-card](https://github.com/custom-cards/boilerplate-card).
