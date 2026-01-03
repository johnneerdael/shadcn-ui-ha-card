# Examples Gallery

Complete dashboard configurations for common Home Assistant use cases.

> **v2.2.0 Visual Editor:** For a no-code approach, use the [Visual Editor](../visual-editor.md) to build cards with drag-and-drop. The examples below show advanced YAML configurations with Jinja2 templates.
>
> **Theme Overrides:** All components support per-component theme overrides. See [Theme System](../theme-system.md) for details.

***

## Climate Control Panel

A comprehensive thermostat control card with temperature display, mode selection, and scheduling.

```YAML
type: custom:shadcn-template-card
title: Climate Control
content: |
  <div class="shc-card-content">
    <!-- Temperature Display -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="font-size: 4rem; font-weight: 700; line-height: 1;">
        {{ state_attr('climate.thermostat', 'current_temperature') }}°
      </div>
      <div style="color: var(--muted-foreground); margin-top: 4px;">
        Target: {{ state_attr('climate.thermostat', 'temperature') }}°
      </div>
    </div>

    <!-- Mode Selection -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 24px;">
      {% for mode in [
        {'value': 'off', 'icon': 'mdi:power', 'label': 'Off'},
        {'value': 'heat', 'icon': 'mdi:fire', 'label': 'Heat'},
        {'value': 'cool', 'icon': 'mdi:snowflake', 'label': 'Cool'},
        {'value': 'auto', 'icon': 'mdi:autorenew', 'label': 'Auto'}
      ] %}
      <button
        class="shc-btn {{ 'shc-btn-default' if state_attr('climate.thermostat', 'hvac_mode') == mode.value else 'shc-btn-outline' }}"
        data-entity="climate.thermostat"
        data-action="climate.set_hvac_mode"
        style="flex-direction: column; height: auto; padding: 12px;"
      >
        <ha-icon icon="{{ mode.icon }}"></ha-icon>
        <span style="font-size: 0.75rem; margin-top: 4px;">{{ mode.label }}</span>
      </button>
      {% endfor %}
    </div>

    <!-- Temperature Slider -->
    <div style="margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-size: 0.875rem;">Target Temperature</span>
        <span style="font-weight: 600;">{{ state_attr('climate.thermostat', 'temperature') }}°</span>
      </div>
      <input
        type="range"
        class="shc-slider"
        min="16" max="28" step="0.5"
        value="{{ state_attr('climate.thermostat', 'temperature') }}"
        data-entity="climate.thermostat"
        data-attribute="temperature"
        data-action="climate.set_temperature"
      />
      <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--muted-foreground);">
        <span>16°</span>
        <span>28°</span>
      </div>
    </div>

    <!-- Quick Stats -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding-top: 16px; border-top: 1px solid var(--border);">
      <div style="text-align: center;">
        <ha-icon icon="mdi:water-percent" style="color: var(--info);"></ha-icon>
        <div style="font-size: 1.25rem; font-weight: 600;">{{ state_attr('climate.thermostat', 'current_humidity') }}%</div>
        <div style="font-size: 0.75rem; color: var(--muted-foreground);">Humidity</div>
      </div>
      <div style="text-align: center;">
        <ha-icon icon="mdi:fan" style="color: var(--muted-foreground);"></ha-icon>
        <div style="font-size: 1.25rem; font-weight: 600;">{{ state_attr('climate.thermostat', 'fan_mode') | title }}</div>
        <div style="font-size: 0.75rem; color: var(--muted-foreground);">Fan</div>
      </div>
      <div style="text-align: center;">
        <ha-icon icon="mdi:{{ 'flame' if state_attr('climate.thermostat', 'hvac_action') == 'heating' else 'snowflake' if state_attr('climate.thermostat', 'hvac_action') == 'cooling' else 'pause' }}" style="color: {{ 'var(--destructive)' if state_attr('climate.thermostat', 'hvac_action') == 'heating' else 'var(--info)' if state_attr('climate.thermostat', 'hvac_action') == 'cooling' else 'var(--muted-foreground)' }};"></ha-icon>
        <div style="font-size: 1.25rem; font-weight: 600;">{{ state_attr('climate.thermostat', 'hvac_action') | title }}</div>
        <div style="font-size: 0.75rem; color: var(--muted-foreground);">Status</div>
      </div>
    </div>
  </div>
```

***

## Lighting Dashboard

Room-based lighting control with brightness sliders and scene activation.

```YAML
type: custom:shadcn-template-card
title: Lighting
content: |
  <div class="shc-tabs">
    <div class="shc-tabs-list shc-tabs-list-full">
      <input type="radio" name="room" id="room-living" class="shc-tabs-state" checked />
      <label for="room-living" class="shc-tabs-trigger">Living</label>
      <input type="radio" name="room" id="room-bedroom" class="shc-tabs-state" />
      <label for="room-bedroom" class="shc-tabs-trigger">Bedroom</label>
      <input type="radio" name="room" id="room-kitchen" class="shc-tabs-state" />
      <label for="room-kitchen" class="shc-tabs-trigger">Kitchen</label>
    </div>

    <div class="shc-tabs-content" data-tab="living" style="padding: 16px;">
      <!-- Scenes -->
      <div style="display: flex; gap: 8px; margin-bottom: 16px;">
        {% for scene in [
          {'entity': 'scene.living_bright', 'icon': 'mdi:brightness-7', 'name': 'Bright'},
          {'entity': 'scene.living_relax', 'icon': 'mdi:brightness-5', 'name': 'Relax'},
          {'entity': 'scene.living_movie', 'icon': 'mdi:movie', 'name': 'Movie'}
        ] %}
        <button class="shc-btn shc-btn-outline shc-btn-sm" style="flex: 1;" data-entity="{{ scene.entity }}">
          <ha-icon icon="{{ scene.icon }}"></ha-icon>
          {{ scene.name }}
        </button>
        {% endfor %}
      </div>

      <!-- Lights -->
      <div style="display: grid; gap: 16px;">
        {% for light in ['light.living_ceiling', 'light.living_lamp', 'light.living_accent'] %}
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <ha-icon icon="mdi:lightbulb" style="{{ 'color: var(--warning);' if is_state(light, 'on') else '' }}"></ha-icon>
              <span>{{ state_attr(light, 'friendly_name') }}</span>
            </div>
            <button class="shc-switch" data-entity="{{ light }}" data-state="{{ 'checked' if is_state(light, 'on') else '' }}">
              <span class="shc-switch-thumb"></span>
            </button>
          </div>
          {% if is_state(light, 'on') %}
          <input
            type="range" class="shc-slider"
            min="0" max="255"
            value="{{ state_attr(light, 'brightness') | default(0) }}"
            data-entity="{{ light }}"
            data-attribute="brightness"
          />
          {% endif %}
        </div>
        {% endfor %}
      </div>
    </div>

    <div class="shc-tabs-content" data-tab="bedroom" style="padding: 16px;">
      <!-- Similar structure for bedroom -->
    </div>

    <div class="shc-tabs-content" data-tab="kitchen" style="padding: 16px;">
      <!-- Similar structure for kitchen -->
    </div>
  </div>
```

***

## Security System

Alarm control with door/window status and camera preview.

```YAML
type: custom:shadcn-template-card
title: Security
content: |
  <div class="shc-card-content">
    <!-- Alarm Status -->
    <div style="display: flex; align-items: center; gap: 16px; padding: 16px; margin-bottom: 16px; border-radius: 8px;
      background: {{ 'var(--destructive)' if states('alarm_control_panel.home') == 'triggered' else 'var(--success)' if 'armed' in states('alarm_control_panel.home') else 'var(--muted)' }};">
      <ha-icon icon="mdi:shield-{{ 'alert' if states('alarm_control_panel.home') == 'triggered' else 'check' if 'armed' in states('alarm_control_panel.home') else 'off' }}" style="font-size: 32px; color: white;"></ha-icon>
      <div style="color: white;">
        <div style="font-weight: 600; font-size: 1.25rem;">{{ states('alarm_control_panel.home') | replace('_', ' ') | title }}</div>
        <div style="font-size: 0.875rem; opacity: 0.9;">Changed {{ states.alarm_control_panel.home.last_changed | relative_time }}</div>
      </div>
    </div>

    <!-- Arm Buttons -->
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 16px;">
      <button class="shc-btn shc-btn-outline" data-entity="alarm_control_panel.home" data-action="alarm_control_panel.alarm_disarm">
        <ha-icon icon="mdi:shield-off"></ha-icon> Disarm
      </button>
      <button class="shc-btn shc-btn-outline" data-entity="alarm_control_panel.home" data-action="alarm_control_panel.alarm_arm_home">
        <ha-icon icon="mdi:shield-home"></ha-icon> Arm Home
      </button>
      <button class="shc-btn shc-btn-outline" data-entity="alarm_control_panel.home" data-action="alarm_control_panel.alarm_arm_away">
        <ha-icon icon="mdi:shield-lock"></ha-icon> Arm Away
      </button>
      <button class="shc-btn shc-btn-outline" data-entity="alarm_control_panel.home" data-action="alarm_control_panel.alarm_arm_night">
        <ha-icon icon="mdi:shield-moon"></ha-icon> Arm Night
      </button>
    </div>

    <div class="shc-separator" style="margin: 16px 0;"></div>

    <!-- Door/Window Status -->
    <div style="font-weight: 500; margin-bottom: 12px;">Entry Points</div>
    <div style="display: grid; gap: 8px;">
      {% for sensor in states.binary_sensor | selectattr('attributes.device_class', 'in', ['door', 'window']) | list %}
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: var(--muted); border-radius: 6px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <ha-icon icon="mdi:{{ 'door' if sensor.attributes.device_class == 'door' else 'window-closed' }}" style="{{ 'color: var(--destructive);' if sensor.state == 'on' else '' }}"></ha-icon>
          <span>{{ sensor.attributes.friendly_name }}</span>
        </div>
        <span class="shc-badge {{ 'shc-badge-destructive' if sensor.state == 'on' else 'shc-badge-secondary' }}">
          {{ 'Open' if sensor.state == 'on' else 'Closed' }}
        </span>
      </div>
      {% endfor %}
    </div>
  </div>
```

***

## Media Player Card

Now playing display with playback controls.

```YAML
type: custom:shadcn-template-card
content: |
  <div style="padding: 16px;">
    <!-- Album Art -->
    <div style="aspect-ratio: 1/1; max-width: 200px; margin: 0 auto 16px; border-radius: 8px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.3);">
      <img
        src="{{ state_attr('media_player.spotify', 'entity_picture') or '/local/default-album.png' }}"
        style="width: 100%; height: 100%; object-fit: cover;"
      />
    </div>

    <!-- Track Info -->
    <div style="text-align: center; margin-bottom: 16px;">
      <div style="font-weight: 600; font-size: 1.125rem;">{{ state_attr('media_player.spotify', 'media_title') or 'Not Playing' }}</div>
      <div style="color: var(--muted-foreground);">{{ state_attr('media_player.spotify', 'media_artist') }}</div>
    </div>

    <!-- Progress -->
    {% if state_attr('media_player.spotify', 'media_duration') %}
    <div style="margin-bottom: 16px;">
      <div class="shc-progress" style="height: 4px;">
        <div class="shc-progress-bar" style="width: {{ (state_attr('media_player.spotify', 'media_position') / state_attr('media_player.spotify', 'media_duration') * 100) | round }}%;"></div>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 4px; font-size: 0.75rem; color: var(--muted-foreground);">
        <span>{{ state_attr('media_player.spotify', 'media_position') | timestamp_custom('%M:%S', false) }}</span>
        <span>{{ state_attr('media_player.spotify', 'media_duration') | timestamp_custom('%M:%S', false) }}</span>
      </div>
    </div>
    {% endif %}

    <!-- Controls -->
    <div style="display: flex; justify-content: center; align-items: center; gap: 16px;">
      <button class="shc-btn shc-btn-ghost shc-btn-icon" data-entity="media_player.spotify" data-action="media_player.media_previous_track">
        <ha-icon icon="mdi:skip-previous"></ha-icon>
      </button>
      <button class="shc-btn shc-btn-icon" style="width: 56px; height: 56px;" data-entity="media_player.spotify" data-action="media_player.media_play_pause">
        <ha-icon icon="{{ 'mdi:pause' if is_state('media_player.spotify', 'playing') else 'mdi:play' }}" style="font-size: 28px;"></ha-icon>
      </button>
      <button class="shc-btn shc-btn-ghost shc-btn-icon" data-entity="media_player.spotify" data-action="media_player.media_next_track">
        <ha-icon icon="mdi:skip-next"></ha-icon>
      </button>
    </div>

    <!-- Volume -->
    <div style="margin-top: 16px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <ha-icon icon="mdi:volume-low"></ha-icon>
        <input
          type="range" class="shc-slider" style="flex: 1;"
          min="0" max="100"
          value="{{ (state_attr('media_player.spotify', 'volume_level') * 100) | round }}"
          data-entity="media_player.spotify"
          data-attribute="volume_level"
          data-action="media_player.volume_set"
        />
        <ha-icon icon="mdi:volume-high"></ha-icon>
      </div>
    </div>
  </div>
```

***

## Energy Monitor

Power consumption with daily/weekly charts.

```YAML
type: custom:shadcn-template-card
title: Energy
content: |
  <div class="shc-card-content">
    <!-- Current Power -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="font-size: 3rem; font-weight: 700;">{{ states('sensor.power_consumption') }}</div>
      <div style="color: var(--muted-foreground);">Watts (Current)</div>
    </div>

    <!-- Today's Stats -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;">
      <div style="text-align: center; padding: 12px; background: var(--muted); border-radius: 8px;">
        <div style="font-size: 1.5rem; font-weight: 700;">{{ states('sensor.energy_daily') }}</div>
        <div style="font-size: 0.75rem; color: var(--muted-foreground);">kWh Today</div>
      </div>
      <div style="text-align: center; padding: 12px; background: var(--muted); border-radius: 8px;">
        <div style="font-size: 1.5rem; font-weight: 700;">${{ (states('sensor.energy_daily') | float * 0.12) | round(2) }}</div>
        <div style="font-size: 0.75rem; color: var(--muted-foreground);">Cost Today</div>
      </div>
      <div style="text-align: center; padding: 12px; background: var(--muted); border-radius: 8px;">
        <div style="font-size: 1.5rem; font-weight: 700;">{{ states('sensor.solar_production') }}</div>
        <div style="font-size: 0.75rem; color: var(--muted-foreground);">kWh Solar</div>
      </div>
    </div>

    <!-- Progress to Daily Goal -->
    {% set goal = 20 %}
    {% set used = states('sensor.energy_daily') | float %}
    {% set percent = ((used / goal) * 100) | round %}
    <div style="margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span>Daily Goal Progress</span>
        <span>{{ percent }}%</span>
      </div>
      <div class="shc-progress" style="height: 8px;">
        <div class="shc-progress-bar" style="width: {{ [percent, 100] | min }}%; background: {{ 'var(--destructive)' if percent > 100 else 'var(--success)' }};"></div>
      </div>
    </div>

    <!-- Top Consumers -->
    <div style="font-weight: 500; margin-bottom: 12px;">Top Consumers</div>
    <div style="display: grid; gap: 8px;">
      {% for device in [
        {'name': 'HVAC', 'power': 1200, 'icon': 'mdi:air-conditioner'},
        {'name': 'Water Heater', 'power': 450, 'icon': 'mdi:water-boiler'},
        {'name': 'Refrigerator', 'power': 150, 'icon': 'mdi:fridge'}
      ] %}
      <div style="display: flex; align-items: center; gap: 12px; padding: 8px; background: var(--muted); border-radius: 6px;">
        <ha-icon icon="{{ device.icon }}"></ha-icon>
        <span style="flex: 1;">{{ device.name }}</span>
        <span style="font-weight: 500;">{{ device.power }}W</span>
      </div>
      {% endfor %}
    </div>
  </div>
```

***

## Room Overview

Multi-sensor room card with quick controls.

```YAML
type: custom:shadcn-template-card
title: Living Room
content: |
  <div class="shc-card-content">
    <!-- Quick Stats Row -->
    <div style="display: flex; justify-content: space-around; margin-bottom: 16px; padding: 12px; background: var(--muted); border-radius: 8px;">
      <div style="text-align: center;">
        <ha-icon icon="mdi:thermometer"></ha-icon>
        <div style="font-weight: 600;">{{ states('sensor.living_room_temperature') }}°</div>
      </div>
      <div class="shc-separator shc-separator-vertical" style="height: 40px;"></div>
      <div style="text-align: center;">
        <ha-icon icon="mdi:water-percent"></ha-icon>
        <div style="font-weight: 600;">{{ states('sensor.living_room_humidity') }}%</div>
      </div>
      <div class="shc-separator shc-separator-vertical" style="height: 40px;"></div>
      <div style="text-align: center;">
        <ha-icon icon="mdi:lightbulb-group"></ha-icon>
        <div style="font-weight: 600;">{{ states.light | selectattr('entity_id', 'search', 'living') | selectattr('state', 'eq', 'on') | list | count }}</div>
      </div>
    </div>

    <!-- Quick Controls -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px;">
      {% for item in [
        {'entity': 'light.living_ceiling', 'icon': 'mdi:ceiling-light', 'name': 'Ceiling'},
        {'entity': 'light.living_lamp', 'icon': 'mdi:floor-lamp', 'name': 'Lamp'},
        {'entity': 'switch.living_tv', 'icon': 'mdi:television', 'name': 'TV'},
        {'entity': 'fan.living_fan', 'icon': 'mdi:fan', 'name': 'Fan'}
      ] %}
      <button
        class="shc-btn {{ 'shc-btn-default' if is_state(item.entity, 'on') else 'shc-btn-outline' }}"
        data-entity="{{ item.entity }}"
        style="flex-direction: column; height: auto; padding: 12px;"
      >
        <ha-icon icon="{{ item.icon }}"></ha-icon>
        <span style="font-size: 0.7rem; margin-top: 4px;">{{ item.name }}</span>
      </button>
      {% endfor %}
    </div>

    <!-- Scenes -->
    <div style="font-weight: 500; margin-bottom: 8px;">Scenes</div>
    <div style="display: flex; gap: 8px;">
      {% for scene in [
        {'entity': 'scene.living_bright', 'name': 'Bright'},
        {'entity': 'scene.living_relax', 'name': 'Relax'},
        {'entity': 'scene.living_movie', 'name': 'Movie'},
        {'entity': 'scene.living_off', 'name': 'Off'}
      ] %}
      <button class="shc-btn shc-btn-outline shc-btn-sm" style="flex: 1;" data-entity="{{ scene.entity }}">
        {{ scene.name }}
      </button>
      {% endfor %}
    </div>
  </div>
```

***

## Person Presence Card

Family location tracking with avatars.

```YAML
type: custom:shadcn-template-card
title: Family
content: |
  <div class="shc-card-content">
    <div style="display: grid; gap: 12px;">
      {% for person in states.person %}
      <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--muted); border-radius: 8px;">
        <div style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; border: 3px solid {{ 'var(--success)' if person.state == 'home' else 'var(--muted-foreground)' }};">
          {% if state_attr(person.entity_id, 'entity_picture') %}
          <img src="{{ state_attr(person.entity_id, 'entity_picture') }}" style="width: 100%; height: 100%; object-fit: cover;" />
          {% else %}
          <div style="width: 100%; height: 100%; background: var(--primary); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
            {{ person.attributes.friendly_name[:2] | upper }}
          </div>
          {% endif %}
        </div>
        <div style="flex: 1;">
          <div style="font-weight: 600;">{{ person.attributes.friendly_name }}</div>
          <div style="font-size: 0.875rem; color: var(--muted-foreground);">
            {% if person.state == 'home' %}
            Home
            {% else %}
            {{ person.state }}
            {% endif %}
          </div>
        </div>
        <span class="shc-badge {{ 'shc-badge-default' if person.state == 'home' else 'shc-badge-secondary' }}">
          {{ 'Home' if person.state == 'home' else 'Away' }}
        </span>
      </div>
      {% endfor %}
    </div>
  </div>
```

