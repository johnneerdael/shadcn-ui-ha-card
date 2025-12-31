# shadcdn-template-card Advanced Tutorial

**Building Complex, Dynamic Home Assistant Cards with shadcn/ui Components and Jinja2 Templating**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Basic Concepts](#basic-concepts)
4. [Tutorial 1: Smart Home Dashboard](#tutorial-1-smart-home-dashboard)
5. [Tutorial 2: Multi-Room Climate Control](#tutorial-2-multi-room-climate-control)
6. [Tutorial 3: Energy Monitoring Dashboard](#tutorial-3-energy-monitoring-dashboard)
7. [Tutorial 4: Security System Panel](#tutorial-4-security-system-panel)
8. [Tutorial 5: Advanced Multi-Device Status Grid](#tutorial-5-advanced-multi-device-status-grid)
9. [Component Reference](#component-reference)
10. [Jinja2 Template Reference](#jinja2-template-reference)
11. [Styling Guide](#styling-guide)
12. [Troubleshooting](#troubleshooting)

---

## Introduction

This tutorial teaches you to create sophisticated Home Assistant dashboard cards by combining:
- **shadcn/ui components** - Beautiful, accessible UI components
- **Tailwind CSS utility classes** - Flexible styling
- **Jinja2-style templating** - Dynamic content from Home Assistant state
- **Home Assistant entities** - Real-time data integration

By the end, you'll build complex cards like multi-room climate controls, energy dashboards, and security panels.

---

## Prerequisites

### Installation

Ensure you have the card installed:

```yaml
# configuration.yaml
lovelace:
  resources:
    - url: /local/shadcdn-template-card/shadcdn-template-card.js
      type: module
```

### Required Knowledge

- Basic YAML syntax
- Home Assistant entity IDs
- Basic HTML structure understanding
- Familiarity with Jinja2 templating (similar to Home Assistant's native templates)

---

## Basic Concepts

### Available shadcn Components

The card provides these pre-styled component classes:

- **Buttons**: `.shc-btn`, `.shc-btn-primary`, `.shc-btn-secondary`, `.shc-btn-ghost`
- **Badges**: `.shc-badge`, `.shc-badge-primary`, `.shc-badge-destructive`, `.shc-badge-outline`
- **Cards**: `.shc-card`, `.shc-card-header`, `.shc-card-title`, `.shc-card-content`
- **Inputs**: `.shc-input`, `.shc-textarea`
- **Surfaces**: `.shc-surface` (generic container with card styling)
- **Typography**: `.shc-text-muted`, `.shc-text-sm`, `.shc-text-lg`

### Jinja2 Template Features

**Variables Access**:
```jinja2
{{ states('sensor.temperature') }}
{{ state_attr('climate.living_room', 'current_temperature') }}
```

**Loops**:
```jinja2
{% for room in ['living_room', 'bedroom', 'kitchen'] %}
  <div>{{ room }}</div>
{% endfor %}
```

**Custom Variables**:
```yaml
variables:
  rooms:
    - living_room
    - bedroom
  threshold: 25
```

**Helper Functions**:
- `states(entity_id)` - Get entity state
- `state_attr(entity_id, attribute)` - Get entity attribute
- `range(start, end, step)` - Generate number sequences
- `Math.*` - JavaScript Math functions
- `Date.*` - JavaScript Date functions

---

## Tutorial 1: Smart Home Dashboard

### Goal
Create a comprehensive dashboard showing lights, climate, and security status.

### Code

```yaml
type: custom:shadcdn-template-card
title: Home Status
variables:
  lights:
    - light.living_room
    - light.bedroom
    - light.kitchen
  rooms:
    - name: Living Room
      climate: climate.living_room
      motion: binary_sensor.living_room_motion
    - name: Bedroom
      climate: climate.bedroom
      motion: binary_sensor.bedroom_motion
content: |
  <div class="space-y-4">
    
    <!-- Header Section -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">Home Overview</h2>
        <p class="text-sm text-[var(--muted-foreground)]">
          {{ Date().toLocaleTimeString() }}
        </p>
      </div>
      <div class="flex gap-2">
        <span class="shc-badge shc-badge-primary">
          {{ lights|length }} Lights
        </span>
        <span class="shc-badge shc-badge-outline">
          {{ rooms|length }} Rooms
        </span>
      </div>
    </div>
    
    <!-- Lights Status Grid -->
    <div class="shc-card">
      <div class="shc-card-header">
        <div class="shc-card-title">💡 Lighting</div>
      </div>
      <div class="shc-card-content">
        <div class="grid grid-cols-3 gap-3">
          {% for light in lights %}
          <div class="shc-surface flex flex-col items-center p-3 rounded-lg">
            <div class="text-2xl mb-2">
              {{ states(light) == 'on' ? '💡' : '🌑' }}
            </div>
            <div class="text-xs font-medium text-center">
              {{ light.split('.')[1].replace('_', ' ')|title }}
            </div>
            <div class="text-xs mt-1">
              <span class="shc-badge {{ states(light) == 'on' ? 'shc-badge-primary' : '' }}">
                {{ states(light)|upper }}
              </span>
            </div>
            {% if states(light) == 'on' %}
            <div class="text-[10px] text-[var(--muted-foreground)] mt-1">
              {{ state_attr(light, 'brightness') || '—' }}% brightness
            </div>
            {% endif %}
          </div>
          {% endfor %}
        </div>
      </div>
    </div>
    
    <!-- Room Climate Grid -->
    <div class="shc-card">
      <div class="shc-card-header">
        <div class="shc-card-title">🌡️ Climate</div>
      </div>
      <div class="shc-card-content">
        <div class="grid grid-cols-2 gap-3">
          {% for room in rooms %}
          <div class="shc-surface p-4 rounded-lg">
            <div class="flex items-center justify-between mb-3">
              <div class="font-semibold">{{ room.name }}</div>
              <div class="text-xs">
                <span class="shc-badge {{ states(room.motion) == 'on' ? 'shc-badge-primary' : 'shc-badge-outline' }}">
                  {{ states(room.motion) == 'on' ? '👤 Active' : '💤 Idle' }}
                </span>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div class="text-xs text-[var(--muted-foreground)]">Current</div>
                <div class="text-2xl font-bold">
                  {{ state_attr(room.climate, 'current_temperature') || '—' }}°
                </div>
              </div>
              <div>
                <div class="text-xs text-[var(--muted-foreground)]">Target</div>
                <div class="text-2xl font-bold text-[var(--primary)]">
                  {{ state_attr(room.climate, 'temperature') || '—' }}°
                </div>
              </div>
            </div>
            
            <div class="mt-3 flex items-center justify-between text-xs">
              <span class="text-[var(--muted-foreground)]">
                Mode: {{ states(room.climate) }}
              </span>
              <span class="text-[var(--muted-foreground)]">
                Humidity: {{ state_attr(room.climate, 'current_humidity') || '—' }}%
              </span>
            </div>
          </div>
          {% endfor %}
        </div>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="flex gap-2">
      <button class="shc-btn shc-btn-primary flex-1">All Lights Off</button>
      <button class="shc-btn shc-btn-secondary flex-1">Away Mode</button>
      <button class="shc-btn shc-btn-ghost">Settings</button>
    </div>
    
  </div>
```

### Explanation

**Key Features**:
1. **Dynamic Light Grid**: Loops through lights, shows status with emoji and badges
2. **Climate Monitoring**: Displays temperature, target, humidity per room
3. **Motion Detection**: Shows room occupancy status
4. **Responsive Grid**: Uses Tailwind grid utilities for layout
5. **shadcn Theming**: Automatically adapts to Home Assistant theme

---

## Tutorial 2: Multi-Room Climate Control

### Goal
Advanced climate dashboard with temperature trends, HVAC modes, and per-room controls.

### Code

```yaml
type: custom:shadcdn-template-card
title: Climate Control Center
variables:
  rooms:
    - name: Living Room
      entity: climate.living_room
      temp_sensor: sensor.living_room_temperature
      humidity_sensor: sensor.living_room_humidity
      icon: 🛋️
    - name: Bedroom
      entity: climate.bedroom
      temp_sensor: sensor.bedroom_temperature
      humidity_sensor: sensor.bedroom_humidity
      icon: 🛏️
    - name: Office
      entity: climate.office
      temp_sensor: sensor.office_temperature
      humidity_sensor: sensor.office_humidity
      icon: 💼
  comfort_min: 20
  comfort_max: 24
content: |
  <div class="space-y-4">
    
    <!-- System Overview Header -->
    <div class="shc-card bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
      <div class="shc-card-content text-white p-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-3xl font-bold mb-1">
              {{ Math.round((state_attr('climate.living_room', 'current_temperature') + 
                             state_attr('climate.bedroom', 'current_temperature') + 
                             state_attr('climate.office', 'current_temperature')) / 3) }}°C
            </div>
            <div class="text-sm opacity-90">Average Home Temperature</div>
          </div>
          <div class="text-right">
            <div class="text-2xl mb-1">💨</div>
            <div class="text-xs opacity-75">
              {% for room in rooms %}
                {% if states(room.entity) != 'off' %}✓{% endif %}
              {% endfor %}
              Active Systems
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Room Cards -->
    {% for room in rooms %}
    <div class="shc-card">
      <div class="shc-card-header">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ room.icon }}</span>
            <div>
              <div class="shc-card-title">{{ room.name }}</div>
              <div class="text-xs text-[var(--muted-foreground)]">
                Climate Control
              </div>
            </div>
          </div>
          <div>
            <span class="shc-badge {{ states(room.entity) == 'off' ? '' : 'shc-badge-primary' }}">
              {{ states(room.entity)|upper }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="shc-card-content space-y-4">
        
        <!-- Temperature Display -->
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-xs text-[var(--muted-foreground)] mb-1">Current</div>
            <div class="text-3xl font-bold">
              {{ state_attr(room.entity, 'current_temperature') || states(room.temp_sensor) || '—' }}°
            </div>
          </div>
          <div class="text-center">
            <div class="text-xs text-[var(--muted-foreground)] mb-1">Target</div>
            <div class="text-3xl font-bold text-[var(--primary)]">
              {{ state_attr(room.entity, 'temperature') || '—' }}°
            </div>
          </div>
          <div class="text-center">
            <div class="text-xs text-[var(--muted-foreground)] mb-1">Humidity</div>
            <div class="text-3xl font-bold text-[var(--accent)]">
              {{ state_attr(room.entity, 'current_humidity') || states(room.humidity_sensor) || '—' }}%
            </div>
          </div>
        </div>
        
        <!-- Comfort Status Bar -->
        <div class="shc-surface p-3 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium">Comfort Level</span>
            {% set current_temp = state_attr(room.entity, 'current_temperature')|float %}
            {% if current_temp >= comfort_min and current_temp <= comfort_max %}
              <span class="shc-badge shc-badge-primary text-xs">✓ Optimal</span>
            {% elif current_temp < comfort_min %}
              <span class="shc-badge text-xs" style="background: var(--info)">❄️ Cool</span>
            {% else %}
              <span class="shc-badge text-xs" style="background: var(--warning)">🔥 Warm</span>
            {% endif %}
          </div>
          <div class="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
            {% set temp_pct = ((current_temp - 15) / 15 * 100)|int %}
            <div class="h-full bg-gradient-to-r from-blue-400 via-green-400 to-red-400" 
                 style="width: {{ Math.min(100, Math.max(0, temp_pct)) }}%">
            </div>
          </div>
          <div class="flex justify-between text-[10px] text-[var(--muted-foreground)] mt-1">
            <span>15°</span>
            <span>{{ comfort_min }}°</span>
            <span>{{ comfort_max }}°</span>
            <span>30°</span>
          </div>
        </div>
        
        <!-- HVAC Mode Buttons -->
        <div class="grid grid-cols-4 gap-2">
          {% for mode in ['heat', 'cool', 'auto', 'off'] %}
          <button class="shc-btn {{ states(room.entity) == mode ? 'shc-btn-primary' : 'shc-btn-ghost' }} text-xs">
            {% if mode == 'heat' %}🔥
            {% elif mode == 'cool' %}❄️
            {% elif mode == 'auto' %}🔄
            {% else %}⏹️
            {% endif %}
            {{ mode|title }}
          </button>
          {% endfor %}
        </div>
        
        <!-- Temperature Adjustment -->
        <div class="flex items-center gap-3">
          <button class="shc-btn shc-btn-secondary flex-1">− 1°</button>
          <div class="flex-1 text-center">
            <input type="range" min="15" max="30" 
                   value="{{ state_attr(room.entity, 'temperature') || 20 }}"
                   class="w-full">
          </div>
          <button class="shc-btn shc-btn-secondary flex-1">+ 1°</button>
        </div>
        
        <!-- Additional Info -->
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="shc-surface p-2 rounded">
            <div class="text-[var(--muted-foreground)]">Fan</div>
            <div class="font-semibold">{{ state_attr(room.entity, 'fan_mode') || 'Auto' }}</div>
          </div>
          <div class="shc-surface p-2 rounded">
            <div class="text-[var(--muted-foreground)]">Swing</div>
            <div class="font-semibold">{{ state_attr(room.entity, 'swing_mode') || 'Off' }}</div>
          </div>
        </div>
        
      </div>
    </div>
    {% endfor %}
    
    <!-- Global Actions -->
    <div class="grid grid-cols-2 gap-3">
      <button class="shc-btn shc-btn-primary">
        🏠 Home Mode (22°)
      </button>
      <button class="shc-btn shc-btn-secondary">
        🌙 Sleep Mode (19°)
      </button>
      <button class="shc-btn shc-btn-secondary">
        ✈️ Away Mode (Off)
      </button>
      <button class="shc-btn shc-btn-ghost">
        ⚙️ Advanced Settings
      </button>
    </div>
    
  </div>
```

### Advanced Features

1. **Gradient Header**: Shows system-wide average temperature
2. **Comfort Level Indicator**: Visual bar showing temperature relative to comfort zone
3. **Dynamic Mode Buttons**: Highlights active HVAC mode
4. **Temperature Slider**: Range input for fine-tuned control
5. **Per-Room Statistics**: Fan mode, swing mode, humidity
6. **Global Presets**: Quick buttons for common scenarios

---

## Tutorial 3: Energy Monitoring Dashboard

### Goal
Real-time energy consumption tracking with device breakdowns and cost calculations.

### Code

```yaml
type: custom:shadcdn-template-card
title: Energy Monitor
variables:
  electricity_rate: 0.25  # $ per kWh
  devices:
    - name: HVAC System
      entity: sensor.hvac_power
      icon: 🌡️
      category: climate
    - name: Water Heater
      entity: sensor.water_heater_power
      icon: 🚿
      category: water
    - name: Washing Machine
      entity: sensor.washer_power
      icon: 👕
      category: appliances
    - name: Refrigerator
      entity: sensor.fridge_power
      icon: 🧊
      category: appliances
    - name: Lights
      entity: sensor.lights_power
      icon: 💡
      category: lighting
    - name: Entertainment
      entity: sensor.tv_power
      icon: 📺
      category: entertainment
content: |
  <div class="space-y-4">
    
    <!-- Total Power Header -->
    <div class="shc-card bg-gradient-to-br from-yellow-500 to-orange-600">
      <div class="shc-card-content text-white p-6">
        {% set total_power = 0 %}
        {% for device in devices %}
          {% set power = states(device.entity)|float %}
          {% set total_power = total_power + power %}
        {% endfor %}
        
        <div class="text-center">
          <div class="text-5xl font-bold mb-2">
            {{ total_power|round(2) }} W
          </div>
          <div class="text-lg opacity-90 mb-4">Current Power Usage</div>
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div class="opacity-75">Hourly</div>
              <div class="font-bold">${{ (total_power / 1000 * electricity_rate)|round(2) }}</div>
            </div>
            <div>
              <div class="opacity-75">Daily</div>
              <div class="font-bold">${{ (total_power / 1000 * 24 * electricity_rate)|round(2) }}</div>
            </div>
            <div>
              <div class="opacity-75">Monthly</div>
              <div class="font-bold">${{ (total_power / 1000 * 24 * 30 * electricity_rate)|round(0) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Device Power Breakdown -->
    <div class="shc-card">
      <div class="shc-card-header">
        <div class="shc-card-title">⚡ Device Breakdown</div>
      </div>
      <div class="shc-card-content space-y-2">
        {% for device in devices %}
        {% set power = states(device.entity)|float %}
        {% set percentage = (power / total_power * 100)|round(1) if total_power > 0 else 0 %}
        
        <div class="shc-surface p-3 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-xl">{{ device.icon }}</span>
              <div>
                <div class="font-semibold text-sm">{{ device.name }}</div>
                <div class="text-xs text-[var(--muted-foreground)]">
                  {{ device.category|title }}
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-bold">{{ power|round(0) }} W</div>
              <div class="text-xs text-[var(--muted-foreground)]">
                ${{ (power / 1000 * 24 * 30 * electricity_rate)|round(2) }}/mo
              </div>
            </div>
          </div>
          
          <!-- Power Usage Bar -->
          <div class="relative h-2 bg-[var(--muted)] rounded-full overflow-hidden">
            <div class="absolute h-full bg-gradient-to-r from-green-400 to-yellow-500"
                 style="width: {{ percentage }}%">
            </div>
          </div>
          <div class="flex justify-between text-[10px] text-[var(--muted-foreground)] mt-1">
            <span>{{ percentage }}% of total</span>
            <span class="{{ power > 1000 ? 'text-red-500 font-bold' : '' }}">
              {% if power > 1000 %}⚠️ High
              {% elif power > 100 %}Normal
              {% elif power > 0 %}Low
              {% else %}Off
              {% endif %}
            </span>
          </div>
        </div>
        {% endfor %}
      </div>
    </div>
    
    <!-- Category Summary -->
    <div class="shc-card">
      <div class="shc-card-header">
        <div class="shc-card-title">📊 By Category</div>
      </div>
      <div class="shc-card-content">
        <div class="grid grid-cols-2 gap-3">
          {% for category in ['climate', 'appliances', 'lighting', 'entertainment', 'water'] %}
          {% set category_power = 0 %}
          {% for device in devices %}
            {% if device.category == category %}
              {% set category_power = category_power + (states(device.entity)|float) %}
            {% endif %}
          {% endfor %}
          
          <div class="shc-surface p-4 rounded-lg text-center">
            <div class="text-3xl mb-2">
              {% if category == 'climate' %}🌡️
              {% elif category == 'appliances' %}🏠
              {% elif category == 'lighting' %}💡
              {% elif category == 'entertainment' %}📺
              {% else %}🚿
              {% endif %}
            </div>
            <div class="text-xs text-[var(--muted-foreground)] mb-1">
              {{ category|title }}
            </div>
            <div class="text-2xl font-bold">
              {{ category_power|round(0) }}W
            </div>
            <div class="text-xs text-[var(--muted-foreground)] mt-1">
              ${{ (category_power / 1000 * 24 * 30 * electricity_rate)|round(2) }}/mo
            </div>
          </div>
          {% endfor %}
        </div>
      </div>
    </div>
    
    <!-- Energy Saving Tips -->
    <div class="shc-card bg-[var(--muted)]">
      <div class="shc-card-content p-4">
        <div class="flex items-start gap-3">
          <div class="text-2xl">💡</div>
          <div class="flex-1">
            <div class="font-semibold mb-1">Energy Saving Tip</div>
            <div class="text-sm text-[var(--muted-foreground)]">
              {% if total_power > 3000 %}
                High power usage detected! Consider turning off unused devices.
              {% elif total_power > 2000 %}
                Your energy usage is above average. Check for devices left on standby.
              {% else %}
                Great job! Your energy usage is within normal range.
              {% endif %}
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
```

### Key Features

1. **Real-Time Cost Calculation**: Converts watts to dollars per hour/day/month
2. **Visual Power Bars**: Shows each device's percentage of total consumption
3. **Category Grouping**: Summarizes power by type (climate, appliances, etc.)
4. **High Usage Alerts**: Highlights devices consuming over 1kW
5. **Dynamic Tips**: Context-aware energy-saving recommendations
6. **Monthly Cost Projections**: Helps budget electricity expenses

---

## Tutorial 4: Security System Panel

### Goal
Comprehensive security dashboard with zones, cameras, and alarm controls.

### Code

```yaml
type: custom:shadcdn-template-card
title: Security Center
variables:
  zones:
    - name: Front Door
      sensor: binary_sensor.front_door
      camera: camera.front_door
      icon: 🚪
    - name: Back Door
      sensor: binary_sensor.back_door
      camera: camera.back_door
      icon: 🚪
    - name: Garage
      sensor: binary_sensor.garage_door
      camera: camera.garage
      icon: 🚗
    - name: Windows
      sensor: binary_sensor.windows
      camera: camera.window_view
      icon: 🪟
    - name: Motion Sensors
      sensor: binary_sensor.motion_detected
      camera: camera.motion_area
      icon: 👁️
  alarm_entity: alarm_control_panel.home
content: |
  <div class="space-y-4">
    
    <!-- Alarm Status Header -->
    <div class="shc-card {{ states(alarm_entity) == 'armed_away' ? 'bg-red-600' : states(alarm_entity) == 'armed_home' ? 'bg-yellow-600' : 'bg-green-600' }}">
      <div class="shc-card-content text-white p-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-4xl font-bold mb-2">
              {% if states(alarm_entity) == 'disarmed' %}🔓 DISARMED
              {% elif states(alarm_entity) == 'armed_home' %}🏠 ARMED HOME
              {% elif states(alarm_entity) == 'armed_away' %}🚨 ARMED AWAY
              {% elif states(alarm_entity) == 'triggered' %}🚨 ALARM TRIGGERED
              {% else %}⚠️ {{ states(alarm_entity)|upper }}
              {% endif %}
            </div>
            <div class="text-sm opacity-90">
              System Status: {{ state_attr(alarm_entity, 'code_format') ? 'Protected' : 'Open' }}
            </div>
          </div>
          <div class="text-6xl">
            {% if states(alarm_entity) == 'disarmed' %}✅
            {% elif states(alarm_entity) == 'triggered' %}🚨
            {% else %}🔒
            {% endif %}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Zone Status Grid -->
    <div class="shc-card">
      <div class="shc-card-header">
        <div class="shc-card-title">🛡️ Security Zones</div>
      </div>
      <div class="shc-card-content">
        <div class="grid grid-cols-2 gap-3">
          {% for zone in zones %}
          {% set is_open = states(zone.sensor) == 'on' %}
          
          <div class="shc-surface p-4 rounded-lg {{ is_open ? 'border-2 border-red-500' : '' }}">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-2xl">{{ zone.icon }}</span>
                <div class="font-semibold text-sm">{{ zone.name }}</div>
              </div>
              <div>
                <span class="shc-badge {{ is_open ? 'shc-badge-destructive' : 'shc-badge-primary' }}">
                  {{ is_open ? '⚠️ OPEN' : '✓ SECURE' }}
                </span>
              </div>
            </div>
            
            <!-- Camera Placeholder -->
            <div class="bg-[var(--muted)] rounded h-24 flex items-center justify-center mb-2">
              <div class="text-center text-xs text-[var(--muted-foreground)]">
                <div class="text-2xl mb-1">📹</div>
                <div>{{ zone.camera }}</div>
              </div>
            </div>
            
            <!-- Zone Details -->
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div class="text-[var(--muted-foreground)]">Last Changed</div>
                <div class="font-semibold">
                  {{ state_attr(zone.sensor, 'last_changed') ? 'Recently' : '—' }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-[var(--muted-foreground)]">Status</div>
                <div class="font-semibold">
                  {{ state_attr(zone.sensor, 'device_class') || 'Monitor' }}
                </div>
              </div>
            </div>
          </div>
          {% endfor %}
        </div>
      </div>
    </div>
    
    <!-- Alarm Control Panel -->
    <div class="shc-card">
      <div class="shc-card-header">
        <div class="shc-card-title">🔐 Alarm Control</div>
      </div>
      <div class="shc-card-content space-y-3">
        
        <!-- PIN Entry (Visual Only) -->
        <div class="shc-surface p-4 rounded-lg">
          <div class="text-sm text-[var(--muted-foreground)] mb-2 text-center">
            Enter Security Code
          </div>
          <div class="flex justify-center gap-2 mb-3">
            {% for i in range(4) %}
            <div class="w-12 h-12 border-2 border-[var(--border)] rounded-lg flex items-center justify-center text-2xl">
              •
            </div>
            {% endfor %}
          </div>
          <div class="grid grid-cols-3 gap-2">
            {% for num in range(1, 10) %}
            <button class="shc-btn shc-btn-ghost h-12">{{ num }}</button>
            {% endfor %}
            <button class="shc-btn shc-btn-ghost h-12">✓</button>
            <button class="shc-btn shc-btn-ghost h-12">0</button>
            <button class="shc-btn shc-btn-ghost h-12">✗</button>
          </div>
        </div>
        
        <!-- Arm Mode Buttons -->
        <div class="grid grid-cols-3 gap-2">
          <button class="shc-btn {{ states(alarm_entity) == 'armed_away' ? 'shc-btn-primary' : 'shc-btn-secondary' }}">
            <div class="text-center">
              <div class="text-xl mb-1">🚨</div>
              <div class="text-xs">Away</div>
            </div>
          </button>
          <button class="shc-btn {{ states(alarm_entity) == 'armed_home' ? 'shc-btn-primary' : 'shc-btn-secondary' }}">
            <div class="text-center">
              <div class="text-xl mb-1">🏠</div>
              <div class="text-xs">Home</div>
            </div>
          </button>
          <button class="shc-btn {{ states(alarm_entity) == 'disarmed' ? 'shc-btn-primary' : 'shc-btn-secondary' }}">
            <div class="text-center">
              <div class="text-xl mb-1">🔓</div>
              <div class="text-xs">Disarm</div>
            </div>
          </button>
        </div>
        
      </div>
    </div>
    
    <!-- Recent Events -->
    <div class="shc-card">
      <div class="shc-card-header">
        <div class="shc-card-title">📋 Recent Events</div>
      </div>
      <div class="shc-card-content space-y-2">
        {% for i in range(5) %}
        <div class="flex items-center gap-3 py-2 border-b border-[var(--border)]">
          <div class="text-2xl">
            {{ ['🚪', '👁️', '🔒', '⚠️', '✅'][i] }}
          </div>
          <div class="flex-1">
            <div class="text-sm font-semibold">
              {{ ['Front door opened', 'Motion detected in garage', 'System armed', 'Zone breach', 'System disarmed'][i] }}
            </div>
            <div class="text-xs text-[var(--muted-foreground)]">
              {{ [2, 15, 30, 45, 60][i] }} minutes ago
            </div>
          </div>
        </div>
        {% endfor %}
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="grid grid-cols-2 gap-3">
      <button class="shc-btn shc-btn-secondary">
        📹 View All Cameras
      </button>
      <button class="shc-btn shc-btn-secondary">
        📊 Security Report
      </button>
      <button class="shc-btn shc-btn-ghost">
        ⚙️ Settings
      </button>
      <button class="shc-btn shc-btn-destructive">
        🚨 Panic Button
      </button>
    </div>
    
  </div>
```

### Security Features

1. **Dynamic Status Header**: Color-coded by alarm state (red/yellow/green)
2. **Zone Monitoring**: Real-time status for doors, windows, motion sensors
3. **Visual PIN Pad**: Simulated keypad for arm/disarm (UI only)
4. **Camera Placeholders**: Positions for camera streams
5. **Event Log**: Shows recent security events with timestamps
6. **Panic Button**: Emergency alert trigger

---

## Tutorial 5: Advanced Multi-Device Status Grid

### Goal
Create the most complex card: A comprehensive smart home status dashboard with all device types, advanced templating, and dynamic calculations.

### Code

```yaml
type: custom:shadcdn-template-card
title: Complete Home Status
variables:
  rooms:
    - id: living_room
      name: Living Room
      icon: 🛋️
      devices:
        lights: [light.living_room_main, light.living_room_lamp]
        climate: climate.living_room
        media: media_player.living_room_tv
        motion: binary_sensor.living_room_motion
        temperature: sensor.living_room_temperature
        humidity: sensor.living_room_humidity
    - id: bedroom
      name: Bedroom
      icon: 🛏️
      devices:
        lights: [light.bedroom_ceiling, light.bedroom_lamp]
        climate: climate.bedroom
        media: media_player.bedroom_speaker
        motion: binary_sensor.bedroom_motion
        temperature: sensor.bedroom_temperature
        humidity: sensor.bedroom_humidity
    - id: kitchen
      name: Kitchen
      icon: 🍳
      devices:
        lights: [light.kitchen_main, light.kitchen_under_cabinet]
        appliances: [switch.coffee_maker, switch.dishwasher]
        temperature: sensor.kitchen_temperature
        humidity: sensor.kitchen_humidity
  weather_entity: weather.home
  energy_today: sensor.energy_consumption_daily
  water_today: sensor.water_usage_daily
content: |
  <div class="space-y-4">
    
    <!-- Global Status Bar -->
    <div class="shc-card bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
      <div class="shc-card-content text-white p-4">
        <div class="grid grid-cols-4 gap-4 text-center">
          
          <!-- Active Devices Count -->
          <div>
            {% set active_lights = 0 %}
            {% for room in rooms %}
              {% for light in room.devices.lights %}
                {% if states(light) == 'on' %}
                  {% set active_lights = active_lights + 1 %}
                {% endif %}
              {% endfor %}
            {% endfor %}
            <div class="text-3xl font-bold">{{ active_lights }}</div>
            <div class="text-xs opacity-90">Lights On</div>
          </div>
          
          <!-- Climate Systems -->
          <div>
            {% set climate_count = 0 %}
            {% for room in rooms %}
              {% if room.devices.climate and states(room.devices.climate) != 'off' %}
                {% set climate_count = climate_count + 1 %}
              {% endif %}
            {% endfor %}
            <div class="text-3xl font-bold">{{ climate_count }}</div>
            <div class="text-xs opacity-90">HVAC Active</div>
          </div>
          
          <!-- Motion Activity -->
          <div>
            {% set motion_count = 0 %}
            {% for room in rooms %}
              {% if room.devices.motion and states(room.devices.motion) == 'on' %}
                {% set motion_count = motion_count + 1 %}
              {% endif %}
            {% endfor %}
            <div class="text-3xl font-bold">{{ motion_count }}/{{ rooms|length }}</div>
            <div class="text-xs opacity-90">Rooms Active</div>
          </div>
          
          <!-- Energy Today -->
          <div>
            <div class="text-3xl font-bold">{{ states(energy_today)|round(1) }}</div>
            <div class="text-xs opacity-90">kWh Today</div>
          </div>
          
        </div>
      </div>
    </div>
    
    <!-- Weather Widget -->
    <div class="shc-card">
      <div class="shc-card-content p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="text-5xl">
              {% set condition = states(weather_entity) %}
              {% if condition == 'sunny' %}☀️
              {% elif condition == 'cloudy' %}☁️
              {% elif condition == 'rainy' %}🌧️
              {% elif condition == 'snowy' %}❄️
              {% else %}🌤️
              {% endif %}
            </div>
            <div>
              <div class="text-3xl font-bold">
                {{ state_attr(weather_entity, 'temperature') }}°
              </div>
              <div class="text-sm text-[var(--muted-foreground)]">
                {{ states(weather_entity)|title }}
              </div>
            </div>
          </div>
          <div class="text-right text-sm">
            <div>Feels like {{ state_attr(weather_entity, 'apparent_temperature') }}°</div>
            <div class="text-[var(--muted-foreground)]">
              Humidity {{ state_attr(weather_entity, 'humidity') }}%
            </div>
            <div class="text-[var(--muted-foreground)]">
              Wind {{ state_attr(weather_entity, 'wind_speed') }} km/h
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Room Cards with Complete Status -->
    {% for room in rooms %}
    <div class="shc-card">
      <div class="shc-card-header">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ room.icon }}</span>
            <div>
              <div class="shc-card-title">{{ room.name }}</div>
              <div class="text-xs text-[var(--muted-foreground)]">
                {% set activity_level = 0 %}
                {% if room.devices.motion and states(room.devices.motion) == 'on' %}
                  {% set activity_level = activity_level + 1 %}
                {% endif %}
                {% for light in room.devices.lights %}
                  {% if states(light) == 'on' %}
                    {% set activity_level = activity_level + 1 %}
                  {% endif %}
                {% endfor %}
                {% if room.devices.media and states(room.devices.media) != 'off' %}
                  {% set activity_level = activity_level + 1 %}
                {% endif %}
                
                Activity: {{ ['Idle', 'Low', 'Medium', 'High', 'Very High'][Math.min(4, activity_level)] }}
              </div>
            </div>
          </div>
          <div>
            <span class="shc-badge {{ room.devices.motion and states(room.devices.motion) == 'on' ? 'shc-badge-primary' : 'shc-badge-outline' }}">
              {{ room.devices.motion and states(room.devices.motion) == 'on' ? '👤 Occupied' : '💤 Empty' }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="shc-card-content space-y-4">
        
        <!-- Environment Stats -->
        <div class="grid grid-cols-3 gap-3">
          <div class="shc-surface p-3 rounded-lg text-center">
            <div class="text-xs text-[var(--muted-foreground)] mb-1">Temperature</div>
            <div class="text-2xl font-bold">
              {{ states(room.devices.temperature) || state_attr(room.devices.climate, 'current_temperature') || '—' }}°
            </div>
          </div>
          <div class="shc-surface p-3 rounded-lg text-center">
            <div class="text-xs text-[var(--muted-foreground)] mb-1">Humidity</div>
            <div class="text-2xl font-bold">
              {{ states(room.devices.humidity) || state_attr(room.devices.climate, 'current_humidity') || '—' }}%
            </div>
          </div>
          <div class="shc-surface p-3 rounded-lg text-center">
            <div class="text-xs text-[var(--muted-foreground)] mb-1">Climate</div>
            <div class="text-sm font-bold">
              {{ states(room.devices.climate) || 'N/A' }}
            </div>
          </div>
        </div>
        
        <!-- Lighting Control -->
        <div>
          <div class="text-xs font-semibold text-[var(--muted-foreground)] mb-2">💡 Lighting</div>
          <div class="grid grid-cols-{{ room.devices.lights|length }} gap-2">
            {% for light in room.devices.lights %}
            <div class="shc-surface p-2 rounded-lg text-center">
              <div class="text-xl mb-1">{{ states(light) == 'on' ? '💡' : '🌑' }}</div>
              <div class="text-[10px] font-medium">
                {{ light.split('.')[1].split('_')[-1]|title }}
              </div>
              <div class="text-[10px] text-[var(--muted-foreground)]">
                {{ states(light) == 'on' ? (state_attr(light, 'brightness') || 100) + '%' : 'Off' }}
              </div>
            </div>
            {% endfor %}
          </div>
        </div>
        
        <!-- Media Player (if exists) -->
        {% if room.devices.media %}
        <div>
          <div class="text-xs font-semibold text-[var(--muted-foreground)] mb-2">📺 Media</div>
          <div class="shc-surface p-3 rounded-lg">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-semibold text-sm">
                  {{ state_attr(room.devices.media, 'friendly_name') || 'Media Player' }}
                </div>
                <div class="text-xs text-[var(--muted-foreground)]">
                  {{ states(room.devices.media)|title }}
                </div>
              </div>
              <div class="flex gap-2">
                <button class="shc-btn shc-btn-ghost text-xs px-2 py-1">⏮</button>
                <button class="shc-btn shc-btn-ghost text-xs px-2 py-1">
                  {{ states(room.devices.media) == 'playing' ? '⏸' : '▶️' }}
                </button>
                <button class="shc-btn shc-btn-ghost text-xs px-2 py-1">⏭</button>
              </div>
            </div>
            {% if states(room.devices.media) == 'playing' %}
            <div class="mt-2 text-xs">
              <div class="font-semibold">{{ state_attr(room.devices.media, 'media_title') || 'Unknown' }}</div>
              <div class="text-[var(--muted-foreground)]">
                {{ state_attr(room.devices.media, 'media_artist') || '' }}
              </div>
            </div>
            {% endif %}
          </div>
        </div>
        {% endif %}
        
        <!-- Appliances (if exists) -->
        {% if room.devices.appliances %}
        <div>
          <div class="text-xs font-semibold text-[var(--muted-foreground)] mb-2">🔌 Appliances</div>
          <div class="flex gap-2">
            {% for appliance in room.devices.appliances %}
            <div class="shc-surface flex-1 p-2 rounded-lg text-center">
              <div class="text-xl mb-1">{{ states(appliance) == 'on' ? '⚡' : '⏺️' }}</div>
              <div class="text-[10px] font-medium">
                {{ appliance.split('.')[1].split('_')[-1]|title }}
              </div>
            </div>
            {% endfor %}
          </div>
        </div>
        {% endif %}
        
        <!-- Room Controls -->
        <div class="flex gap-2">
          <button class="shc-btn shc-btn-primary flex-1 text-xs">All Lights Off</button>
          <button class="shc-btn shc-btn-secondary flex-1 text-xs">Scene</button>
          <button class="shc-btn shc-btn-ghost text-xs px-3">⚙️</button>
        </div>
        
      </div>
    </div>
    {% endfor %}
    
    <!-- System Summary -->
    <div class="shc-card">
      <div class="shc-card-header">
        <div class="shc-card-title">📊 System Overview</div>
      </div>
      <div class="shc-card-content">
        <div class="grid grid-cols-2 gap-3 text-sm">
          
          <!-- Total Devices -->
          <div class="shc-surface p-3 rounded-lg">
            <div class="text-[var(--muted-foreground)] text-xs mb-1">Total Devices</div>
            {% set total_devices = 0 %}
            {% for room in rooms %}
              {% set total_devices = total_devices + (room.devices.lights|length) %}
              {% if room.devices.climate %}{% set total_devices = total_devices + 1 %}{% endif %}
              {% if room.devices.media %}{% set total_devices = total_devices + 1 %}{% endif %}
              {% if room.devices.appliances %}
                {% set total_devices = total_devices + (room.devices.appliances|length) %}
              {% endif %}
            {% endfor %}
            <div class="text-2xl font-bold">{{ total_devices }}</div>
          </div>
          
          <!-- Energy Today -->
          <div class="shc-surface p-3 rounded-lg">
            <div class="text-[var(--muted-foreground)] text-xs mb-1">Energy Today</div>
            <div class="text-2xl font-bold">{{ states(energy_today)|round(1) }} kWh</div>
          </div>
          
          <!-- Average Temperature -->
          <div class="shc-surface p-3 rounded-lg">
            <div class="text-[var(--muted-foreground)] text-xs mb-1">Avg Temperature</div>
            {% set temp_sum = 0 %}
            {% set temp_count = 0 %}
            {% for room in rooms %}
              {% if room.devices.temperature %}
                {% set temp_sum = temp_sum + (states(room.devices.temperature)|float) %}
                {% set temp_count = temp_count + 1 %}
              {% endif %}
            {% endfor %}
            <div class="text-2xl font-bold">
              {{ temp_count > 0 ? (temp_sum / temp_count)|round(1) : '—' }}°
            </div>
          </div>
          
          <!-- Active Rooms -->
          <div class="shc-surface p-3 rounded-lg">
            <div class="text-[var(--muted-foreground)] text-xs mb-1">Active Rooms</div>
            {% set active_rooms = 0 %}
            {% for room in rooms %}
              {% if room.devices.motion and states(room.devices.motion) == 'on' %}
                {% set active_rooms = active_rooms + 1 %}
              {% endif %}
            {% endfor %}
            <div class="text-2xl font-bold">{{ active_rooms }}/{{ rooms|length }}</div>
          </div>
          
        </div>
      </div>
    </div>
    
    <!-- Global Actions -->
    <div class="grid grid-cols-2 gap-3">
      <button class="shc-btn shc-btn-primary">🌟 Good Night</button>
      <button class="shc-btn shc-btn-primary">☀️ Good Morning</button>
      <button class="shc-btn shc-btn-secondary">✈️ Away Mode</button>
      <button class="shc-btn shc-btn-secondary">🏠 Home Mode</button>
    </div>
    
  </div>
```

### Advanced Features Demonstrated

1. **Complex Variable Calculations**: Counts active devices, calculates averages
2. **Nested Loops**: Iterates through rooms and their devices
3. **Conditional Device Rendering**: Shows sections only if devices exist
4. **Activity Level Algorithm**: Calculates room activity from multiple sources
5. **Dynamic Grid Layouts**: Adapts columns to number of lights
6. **Comprehensive Entity Integration**: Lights, climate, media, appliances, sensors
7. **Real-Time Statistics**: Live counts and averages across all rooms
8. **Media Player Controls**: Shows now-playing info when active
9. **Weather Integration**: Displays current conditions with adaptive icons
10. **Multi-Level Theming**: Uses both shadcn components and custom styling

---

## Component Reference

### Button Variants

```html
<button class="shc-btn shc-btn-primary">Primary Action</button>
<button class="shc-btn shc-btn-secondary">Secondary Action</button>
<button class="shc-btn shc-btn-ghost">Subtle Action</button>
<button class="shc-btn shc-btn-destructive">Destructive Action</button>
```

### Badge Variants

```html
<span class="shc-badge">Default</span>
<span class="shc-badge shc-badge-primary">Primary</span>
<span class="shc-badge shc-badge-secondary">Secondary</span>
<span class="shc-badge shc-badge-destructive">Destructive</span>
<span class="shc-badge shc-badge-outline">Outline</span>
```

### Card Structure

```html
<div class="shc-card">
  <div class="shc-card-header">
    <div class="shc-card-title">Title</div>
    <div class="shc-card-description">Description</div>
  </div>
  <div class="shc-card-content">
    <!-- Content here -->
  </div>
  <div class="shc-card-footer">
    <!-- Footer actions -->
  </div>
</div>
```

### Form Elements

```html
<input type="text" class="shc-input" placeholder="Enter text...">
<textarea class="shc-textarea" placeholder="Enter description..."></textarea>
<select class="shc-select">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

---

## Jinja2 Template Reference

### Variable Access

```jinja2
{{ variable_name }}
{{ states('entity.id') }}
{{ state_attr('entity.id', 'attribute_name') }}
```

### Loops

```jinja2
{% for item in collection %}
  {{ item }}
{% endfor %}

{% for key, value in dictionary.items() %}
  {{ key }}: {{ value }}
{% endfor %}
```

### Loop Variables

```jinja2
{% for item in items %}
  {{ loop.index }}     <!-- 1, 2, 3... -->
  {{ loop.index1 }}    <!-- Same as index -->
  {{ loop.first }}     <!-- true on first iteration -->
  {{ loop.last }}      <!-- true on last iteration -->
{% endfor %}
```

### Filters

```jinja2
{{ value|float }}              <!-- Convert to float -->
{{ value|int }}                <!-- Convert to integer -->
{{ value|round(2) }}           <!-- Round to 2 decimals -->
{{ text|title }}               <!-- Title Case -->
{{ text|upper }}               <!-- UPPERCASE -->
{{ text|lower }}               <!-- lowercase -->
{{ list|length }}              <!-- Get length -->
{{ value|default('N/A') }}     <!-- Default value if empty -->
```

### Math Operations

```jinja2
{{ value + 10 }}               <!-- Addition -->
{{ value - 5 }}                <!-- Subtraction -->
{{ value * 2 }}                <!-- Multiplication -->
{{ value / 2 }}                <!-- Division -->
{{ Math.round(value) }}        <!-- Math functions -->
{{ Math.max(a, b, c) }}        <!-- Maximum value -->
{{ Math.min(a, b, c) }}        <!-- Minimum value -->
```

### Conditional Expressions

```jinja2
{{ condition ? 'true_value' : 'false_value' }}
{{ states('light.x') == 'on' ? '💡' : '🌑' }}
```

### String Operations

```jinja2
{{ 'hello world'.split(' ') }}           <!-- Split string -->
{{ 'hello_world'.replace('_', ' ') }}    <!-- Replace characters -->
{{ entity.split('.')[1] }}               <!-- Get part after dot -->
```

---

## Styling Guide

### Tailwind Utility Classes

**Layout**:
```html
<div class="flex items-center justify-between">
<div class="grid grid-cols-3 gap-4">
<div class="space-y-4">  <!-- Vertical spacing -->
<div class="space-x-2">  <!-- Horizontal spacing -->
```

**Sizing**:
```html
<div class="w-full h-screen">
<div class="w-1/2 h-24">
<div class="p-4 m-2">  <!-- Padding & margin -->
```

**Typography**:
```html
<div class="text-sm font-bold">
<div class="text-2xl font-semibold">
<div class="text-xs text-[var(--muted-foreground)]">
<div class="uppercase tracking-wide">
```

**Colors (using CSS variables)**:
```html
<div class="bg-[var(--primary)] text-[var(--primary-foreground)]">
<div class="text-[var(--muted-foreground)]">
<div class="border border-[var(--border)]">
```

**Borders & Shadows**:
```html
<div class="rounded-lg shadow-md">
<div class="border-2 border-red-500">
```

### Theme Variables

Available CSS variables:
- `--primary` - Primary color
- `--secondary` - Secondary color
- `--muted` - Muted background
- `--muted-foreground` - Muted text
- `--accent` - Accent color
- `--destructive` - Error/danger color
- `--border` - Border color
- `--card` - Card background
- `--foreground` - Main text color

---

## Troubleshooting

### Common Issues

**1. Template not rendering**
- Check syntax: `{{ }}` for variables, `{% %}` for logic
- Verify entity IDs exist in Home Assistant
- Check browser console for JavaScript errors

**2. Styles not applying**
- Ensure using correct class names (e.g., `shc-btn` not `btn`)
- Check Tailwind classes are spelled correctly
- Verify custom CSS variables are defined

**3. Entity data not showing**
- Use `{{ states('entity.id') }}` to verify entity exists
- Check entity is available in Home Assistant
- Try `{{ state_attr('entity.id', 'attribute') || '—' }}` for safety

**4. Loops not working**
- Verify collection variable is defined
- Check loop syntax: `{% for x in y %}...{% endfor %}`
- Ensure collection is iterable (array/list)

**5. Card size incorrect**
- Card size calculated dynamically based on content lines
- Minimum size: 2, Maximum size: 10
- Check `content` variable has expected line count

### Debug Tips

```yaml
# Show all entity states
content: |
  {% for entity in hass.states %}
    {{ entity }}
  {% endfor %}

# Show variable values
content: |
  {{ variables }}

# Test specific entity
content: |
  Entity: {{ states('light.living_room') }}
  Attributes: {{ state_attr('light.living_room', 'brightness') }}
```

---

## Best Practices

1. **Use Variables**: Define entity lists in `variables:` for reusability
2. **Error Handling**: Use `|| '—'` to provide fallback values
3. **Semantic Classes**: Prefer shadcn component classes over raw Tailwind
4. **Consistent Spacing**: Use `space-y-4` and `gap-3` for uniform layouts
5. **Performance**: Avoid deeply nested loops on large datasets
6. **Accessibility**: Use semantic HTML and appropriate ARIA labels
7. **Responsive Design**: Test on different screen sizes
8. **Theme Awareness**: Use CSS variables for colors to respect user themes

---

## Conclusion

You now have the knowledge to create complex, dynamic Home Assistant dashboard cards using shadcn/ui components and Jinja2 templating. The tutorials progress from simple status displays to comprehensive multi-device dashboards.

Key takeaways:
- Combine shadcn components with Tailwind utilities for flexible styling
- Use Jinja2 loops and conditionals for dynamic content
- Access Home Assistant entity states and attributes
- Create reusable templates with variables
- Build responsive, theme-aware interfaces

Experiment with these patterns and create your own unique dashboard cards!

---

## Tutorial 6: Advanced Components Showcase

### Goal
Demonstrate all new Phase 1 and Phase 2 components in a comprehensive interactive dashboard.

### Code

```yaml
type: custom:shadcdn-template-card
title: Advanced Components Demo
variables:
  devices:
    - name: Living Room
      temp: 22.5
      humidity: 45
      lights_on: 3
      motion: true
    - name: Bedroom
      temp: 20.1
      humidity: 52
      lights_on: 1
      motion: false
    - name: Kitchen
      temp: 23.8
      humidity: 58
      lights_on: 2
      motion: true
content: |
  <div class="space-y-4">
    
    <!-- Accordion FAQ Section -->
    <div class="shc-card">
      <div class="shc-card-header">
        <div class="shc-card-title">📚 Frequently Asked Questions</div>
      </div>
      <div class="shc-card-content">
        <div class="shc-accordion" data-accordion data-type="single" data-collapsible="true">
          <div class="shc-accordion-item" data-value="faq-1">
            <button class="shc-accordion-trigger" data-accordion-trigger aria-expanded="false">
              <span>How do I control my lights?</span>
              <svg class="shc-accordion-chevron" width="15" height="15" viewBox="0 0 15 15">
                <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor"/>
              </svg>
            </button>
            <div class="shc-accordion-content" data-accordion-content data-state="closed">
              <div class="shc-accordion-content-inner">
                Use the switches below to toggle individual lights, or use the sliders to adjust brightness levels.
              </div>
            </div>
          </div>
          
          <div class="shc-accordion-item" data-value="faq-2">
            <button class="shc-accordion-trigger" data-accordion-trigger aria-expanded="false">
              <span>What do the progress bars show?</span>
              <svg class="shc-accordion-chevron" width="15" height="15" viewBox="0 0 15 15">
                <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor"/>
              </svg>
            </button>
            <div class="shc-accordion-content" data-accordion-content data-state="closed">
              <div class="shc-accordion-content-inner">
                Progress bars indicate temperature and humidity levels relative to comfortable ranges.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Interactive Form with All Input Types -->
    <div class="shc-card">
      <div class="shc-card-header">
        <div class="shc-card-title">⚙️ Device Settings</div>
        <div class="shc-card-description">Configure your smart home devices</div>
      </div>
      <div class="shc-card-content space-y-4">
        
        <!-- Text Input with Label -->
        <div class="space-y-2">
          <label class="shc-label" for="device-name">Device Name</label>
          <input id="device-name" type="text" class="shc-input" placeholder="My Smart Device" />
        </div>
        
        <!-- Textarea -->
        <div class="space-y-2">
          <label class="shc-label" for="notes">Notes</label>
          <textarea id="notes" class="shc-textarea" placeholder="Add device notes..." rows="3"></textarea>
        </div>
        
        <!-- Separator -->
        <div class="shc-separator" role="separator"></div>
        
        <!-- Radio Group -->
        <div class="space-y-2">
          <label class="shc-label">Device Type</label>
          <div class="shc-radio-group" data-radio-group role="radiogroup" aria-label="Device Type">
            <label class="shc-radio-item">
              <button class="shc-radio-button" data-radio role="radio" aria-checked="true" data-value="light">
                <span class="shc-radio-indicator"></span>
              </button>
              <span class="shc-radio-label">💡 Light</span>
            </label>
            <label class="shc-radio-item">
              <button class="shc-radio-button" data-radio role="radio" aria-checked="false" data-value="sensor">
                <span class="shc-radio-indicator"></span>
              </button>
              <span class="shc-radio-label">🌡️ Sensor</span>
            </label>
            <label class="shc-radio-item">
              <button class="shc-radio-button" data-radio role="radio" aria-checked="false" data-value="switch">
                <span class="shc-radio-indicator"></span>
              </button>
              <span class="shc-radio-label">🔌 Switch</span>
            </label>
          </div>
        </div>
        
        <!-- Switches -->
        <div class="space-y-3">
          <label class="shc-label">Features</label>
          <label class="shc-switch-wrapper">
            <button class="shc-switch" data-switch role="switch" aria-checked="true">
              <span class="shc-switch-thumb"></span>
            </button>
            <span class="shc-switch-label">Enable Automation</span>
          </label>
          <label class="shc-switch-wrapper">
            <button class="shc-switch" data-switch role="switch" aria-checked="false">
              <span class="shc-switch-thumb"></span>
            </button>
            <span class="shc-switch-label">Send Notifications</span>
          </label>
        </div>
        
        <!-- Checkboxes -->
        <div class="space-y-3">
          <label class="shc-label">Advanced Options</label>
          <label class="shc-checkbox-wrapper">
            <button class="shc-checkbox" data-checkbox role="checkbox" aria-checked="true">
              <svg class="shc-checkbox-indicator" width="15" height="15" viewBox="0 0 15 15">
                <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor"/>
              </svg>
            </button>
            <span class="shc-checkbox-label">Enable debug logging</span>
          </label>
          <label class="shc-checkbox-wrapper">
            <button class="shc-checkbox" data-checkbox role="checkbox" aria-checked="false">
              <span class="shc-checkbox-indicator" width="15" height="15" viewBox="0 0 15 15">
                <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor"/>
              </svg>
            </button>
            <span class="shc-checkbox-label">Auto-update firmware</span>
          </label>
        </div>
        
        <!-- Collapsible Advanced Settings -->
        <div class="shc-collapsible" data-collapsible>
          <button class="shc-collapsible-trigger shc-btn shc-btn-ghost w-full" data-collapsible-trigger aria-expanded="false">
            🔽 Advanced Settings
          </button>
          <div class="shc-collapsible-content" data-collapsible-content data-state="closed">
            <div class="shc-collapsible-content-inner space-y-3 mt-3">
              <!-- Select Dropdown -->
              <div class="space-y-2">
                <label class="shc-label">Update Channel</label>
                <div class="shc-select" data-select>
                  <button class="shc-select-trigger" data-select-trigger aria-expanded="false">
                    <span class="shc-select-value" data-select-value data-placeholder="Select channel..."></span>
                    <svg class="shc-select-icon" width="15" height="15" viewBox="0 0 15 15">
                      <path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor"/>
                    </svg>
                  </button>
                  <div class="shc-select-content" data-select-content data-state="closed">
                    <div class="shc-select-item" data-select-item data-value="stable">Stable</div>
                    <div class="shc-select-item" data-select-item data-value="beta">Beta</div>
                    <div class="shc-select-item" data-select-item data-value="dev">Development</div>
                  </div>
                </div>
              </div>
              
              <!-- Alert -->
              <div class="shc-alert">
                <div class="shc-alert-title">⚠️ Warning</div>
                <div class="shc-alert-description">
                  Changing advanced settings may affect device stability.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="shc-card-footer flex gap-2">
        <button class="shc-btn shc-btn-primary flex-1">Save Changes</button>
        <button class="shc-btn shc-btn-ghost">Cancel</button>
      </div>
    </div>
    
    <!-- Interactive Dashboard with Sliders -->
    <div class="shc-card">
      <div class="shc-card-header">
        <div class="shc-card-title">🎛️ Room Controls</div>
      </div>
      <div class="shc-card-content space-y-4">
        {% for device in devices %}
        <div class="shc-surface p-4 rounded-lg">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <div class="shc-avatar shc-avatar-sm">
                <div class="shc-avatar-fallback">{{ device.name[0] }}</div>
              </div>
              <div>
                <div class="font-semibold">{{ device.name }}</div>
                <div class="text-xs text-[var(--muted-foreground)]">
                  {{ device.lights_on }} lights active
                </div>
              </div>
            </div>
            <span class="shc-badge {{ device.motion ? 'shc-badge-primary' : '' }}">
              {{ device.motion ? '👤 Occupied' : '💤 Empty' }}
            </span>
          </div>
          
          <!-- Temperature Display with Progress -->
          <div class="space-y-2 mb-3">
            <div class="flex justify-between text-sm">
              <span>Temperature</span>
              <span class="font-semibold">{{ device.temp }}°C</span>
            </div>
            <div class="shc-progress">
              <div class="shc-progress-indicator" style="width: {{ ((device.temp - 15) / 15 * 100)|int }}%"></div>
            </div>
          </div>
          
          <!-- Humidity with Progress -->
          <div class="space-y-2 mb-3">
            <div class="flex justify-between text-sm">
              <span>Humidity</span>
              <span class="font-semibold">{{ device.humidity }}%</span>
            </div>
            <div class="shc-progress">
              <div class="shc-progress-indicator" style="width: {{ device.humidity }}%"></div>
            </div>
          </div>
          
          <!-- Brightness Slider -->
          <div class="space-y-2">
            <label class="shc-label text-xs">Brightness Control</label>
            <div class="shc-slider" data-slider data-min="0" data-max="100" data-step="1" data-value="{{ (device.lights_on * 33)|int }}">
              <div class="shc-slider-track">
                <div class="shc-slider-range"></div>
              </div>
              <div class="shc-slider-thumb" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="{{ (device.lights_on * 33)|int }}" tabindex="0"></div>
            </div>
          </div>
        </div>
        {% endfor %}
      </div>
    </div>
    
    <!-- Data Visualization with Multiple Components -->
    <div class="shc-card">
      <div class="shc-card-header">
        <div class="shc-card-title">📊 System Status</div>
        <div class="shc-card-description">Real-time monitoring dashboard</div>
      </div>
      <div class="shc-card-content space-y-4">
        
        <!-- Loading Skeletons (can be shown conditionally) -->
        <div class="grid grid-cols-3 gap-3">
          <div class="shc-surface p-3 rounded-lg text-center">
            <div class="text-xs text-[var(--muted-foreground)] mb-1">Active Devices</div>
            <div class="text-2xl font-bold">
              {{ devices|length }}
            </div>
          </div>
          <div class="shc-surface p-3 rounded-lg text-center">
            <div class="text-xs text-[var(--muted-foreground)] mb-1">Total Lights</div>
            <div class="text-2xl font-bold">
              {% set total_lights = 0 %}
              {% for d in devices %}
                {% set total_lights = total_lights + d.lights_on %}
              {% endfor %}
              {{ total_lights }}
            </div>
          </div>
          <div class="shc-surface p-3 rounded-lg text-center">
            <div class="text-xs text-[var(--muted-foreground)] mb-1">Occupied</div>
            <div class="text-2xl font-bold">
              {% set occupied = 0 %}
              {% for d in devices %}
                {% if d.motion %}{% set occupied = occupied + 1 %}{% endif %}
              {% endfor %}
              {{ occupied }}
            </div>
          </div>
        </div>
        
        <!-- Aspect Ratio Example -->
        <div>
          <label class="shc-label text-xs mb-2 block">Security Camera Feed</label>
          <div class="shc-aspect-ratio shc-aspect-video">
            <div class="w-full h-full bg-[var(--muted)] rounded flex items-center justify-center">
              <div class="text-center">
                <div class="text-4xl mb-2">📹</div>
                <div class="text-sm text-[var(--muted-foreground)]">Camera Feed Placeholder</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Toggle Buttons -->
        <div class="flex gap-2 flex-wrap">
          <button class="shc-toggle" data-toggle aria-pressed="true">
            All Lights
          </button>
          <button class="shc-toggle shc-toggle-outline" data-toggle aria-pressed="false">
            Security
          </button>
          <button class="shc-toggle shc-toggle-outline" data-toggle aria-pressed="false">
            Climate
          </button>
        </div>
      </div>
    </div>
    
  </div>
```

### Features Demonstrated

1. **Accordion Component**
   - FAQ-style collapsible sections
   - Single-item expansion mode
   - Smooth animations with chevron indicators

2. **Complete Form Components**
   - Text inputs with labels
   - Textarea for multi-line input
   - Radio button groups
   - Switch toggles
   - Checkboxes with multiple states
   - Select dropdowns

3. **Collapsible Advanced Settings**
   - Toggle to show/hide additional options
   - Nested components within collapsible

4. **Slider Controls**
   - Interactive brightness sliders
   - Dynamic values from device data
   - Keyboard and mouse control

5. **Progress Indicators**
   - Temperature and humidity visualization
   - Percentage-based progress bars
   - Color-coded status

6. **Avatar Components**
   - User/room initials
   - Multiple sizes
   - Fallback support

7. **Aspect Ratio Container**
   - 16:9 video placeholder
   - Maintains proportions responsively

8. **Toggle Buttons**
   - Pressed/unpressed states
   - Outline variants
   - Multiple toggles in a group

9. **Alert Messages**
   - Warning alerts in collapsible sections
   - Contextual feedback

10. **Badge Status Indicators**
    - Occupancy status
    - Dynamic styling based on state

This comprehensive example showcases all Phase 1 and Phase 2 components working together in a realistic smart home dashboard scenario.

---

**Need Help?**
- Check the [README](README.md) for installation and basic usage
- Review [COMPONENTS.md](COMPONENTS.md) for complete component reference
- See [COMPONENT_REFERENCE.md](COMPONENT_REFERENCE.md) for quick copy-paste snippets
- Explore [PHASE2_COMPONENTS.md](PHASE2_COMPONENTS.md) for interactive component details
- Visit [LIMITATIONS.md](LIMITATIONS.md) for known limitations