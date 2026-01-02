# Layout Components

Components for organizing and structuring content.

---

## Card

A container for grouping content.

![Card](https://ui.shadcn.com/og/card.png)

### Basic Usage

```yaml
content: |
  <div class="shc-card">
    <div class="shc-card-header">
      <h3 class="shc-card-title">Living Room</h3>
      <p class="shc-card-description">Control your devices</p>
    </div>
    <div class="shc-card-content">
      <!-- Content here -->
    </div>
    <div class="shc-card-footer">
      <button class="shc-btn">Save</button>
    </div>
  </div>
```

### Device Card

```yaml
content: |
  <div class="shc-card">
    <div class="shc-card-header">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <ha-icon icon="mdi:lightbulb" style="{{ 'color: var(--warning);' if is_state('light.living_room', 'on') else '' }}"></ha-icon>
          <div>
            <h3 class="shc-card-title">{{ state_attr('light.living_room', 'friendly_name') }}</h3>
            <p class="shc-card-description">{{ states('light.living_room') | title }}</p>
          </div>
        </div>
        <button class="shc-switch" data-entity="light.living_room" data-state="{{ 'checked' if is_state('light.living_room', 'on') else '' }}">
          <span class="shc-switch-thumb"></span>
        </button>
      </div>
    </div>
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-card` | Base container |
| `shc-card-header` | Header section |
| `shc-card-title` | Title (h3) |
| `shc-card-description` | Subtitle |
| `shc-card-content` | Main content |
| `shc-card-footer` | Footer actions |

---

## Tabs

Tabbed interface for organizing content.

![Tabs](https://ui.shadcn.com/og/tabs.png)

### Basic Usage (CSS-Only)

```yaml
content: |
  <div class="shc-tabs">
    <div class="shc-tabs-list">
      <input type="radio" name="tabs" id="tab-1" class="shc-tabs-state" checked />
      <label for="tab-1" class="shc-tabs-trigger">Lights</label>

      <input type="radio" name="tabs" id="tab-2" class="shc-tabs-state" />
      <label for="tab-2" class="shc-tabs-trigger">Climate</label>
    </div>

    <div class="shc-tabs-content" data-tab="1">Lights content...</div>
    <div class="shc-tabs-content" data-tab="2">Climate content...</div>
  </div>
```

### Room Tabs

```yaml
content: |
  <div class="shc-tabs">
    <div class="shc-tabs-list shc-tabs-list-full">
      <input type="radio" name="room" id="living" class="shc-tabs-state" checked />
      <label for="living" class="shc-tabs-trigger">
        <ha-icon icon="mdi:sofa"></ha-icon> Living
      </label>

      <input type="radio" name="room" id="bedroom" class="shc-tabs-state" />
      <label for="bedroom" class="shc-tabs-trigger">
        <ha-icon icon="mdi:bed"></ha-icon> Bedroom
      </label>
    </div>

    <div class="shc-tabs-content" data-tab="living">
      <!-- Living room devices -->
    </div>
    <div class="shc-tabs-content" data-tab="bedroom">
      <!-- Bedroom devices -->
    </div>
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-tabs` | Container |
| `shc-tabs-list` | Tab buttons |
| `shc-tabs-list-full` | Full-width tabs |
| `shc-tabs-state` | Hidden radio |
| `shc-tabs-trigger` | Tab button |
| `shc-tabs-content` | Content panel |

---

## Accordion

Collapsible sections.

![Accordion](https://ui.shadcn.com/og/accordion.png)

### Basic Usage (CSS-Only)

```yaml
content: |
  <div class="shc-accordion">
    <div class="shc-accordion-item">
      <input type="checkbox" id="acc-1" class="shc-accordion-state" />
      <label for="acc-1" class="shc-accordion-trigger">
        <span>Section 1</span>
        <ha-icon icon="mdi:chevron-down" class="shc-accordion-chevron"></ha-icon>
      </label>
      <div class="shc-accordion-content">
        <div class="shc-accordion-content-inner">Content here...</div>
      </div>
    </div>
  </div>
```

### Room Groups

```yaml
content: |
  <div class="shc-accordion">
    {% for room in [{'name': 'Living Room', 'icon': 'mdi:sofa'}, {'name': 'Bedroom', 'icon': 'mdi:bed'}] %}
    <div class="shc-accordion-item">
      <input type="checkbox" id="room-{{ loop.index }}" class="shc-accordion-state" />
      <label for="room-{{ loop.index }}" class="shc-accordion-trigger">
        <div style="display: flex; align-items: center; gap: 12px;">
          <ha-icon icon="{{ room.icon }}"></ha-icon>
          <span>{{ room.name }}</span>
        </div>
        <ha-icon icon="mdi:chevron-down" class="shc-accordion-chevron"></ha-icon>
      </label>
      <div class="shc-accordion-content">
        <div class="shc-accordion-content-inner">
          <!-- Room devices -->
        </div>
      </div>
    </div>
    {% endfor %}
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-accordion` | Container |
| `shc-accordion-item` | Section |
| `shc-accordion-state` | Hidden checkbox |
| `shc-accordion-trigger` | Header |
| `shc-accordion-chevron` | Rotating arrow |
| `shc-accordion-content` | Wrapper |
| `shc-accordion-content-inner` | Padded content |

---

## Collapsible

Single expandable section.

![Collapsible](https://ui.shadcn.com/og/collapsible.png)

### Basic Usage

```yaml
content: |
  <div class="shc-collapsible">
    <input type="checkbox" id="coll-1" class="shc-collapsible-state" />
    <div class="shc-collapsible-header">
      <span>Advanced Settings</span>
      <label for="coll-1" class="shc-btn shc-btn-ghost shc-btn-sm">
        <ha-icon icon="mdi:chevron-down" class="shc-collapsible-chevron"></ha-icon>
      </label>
    </div>
    <div class="shc-collapsible-content">
      <div class="shc-collapsible-content-inner">
        Hidden content...
      </div>
    </div>
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-collapsible` | Container |
| `shc-collapsible-state` | Hidden checkbox |
| `shc-collapsible-header` | Always visible |
| `shc-collapsible-chevron` | Rotating icon |
| `shc-collapsible-content` | Wrapper |
| `shc-collapsible-content-inner` | Padded content |

---

## Dialog

In-card modal overlay.

![Dialog](https://ui.shadcn.com/og/dialog.png)

### Basic Usage (CSS-Only)

```yaml
content: |
  <div class="shc-dialog">
    <input type="checkbox" id="dialog-1" class="shc-dialog-state" />
    <label for="dialog-1" class="shc-btn">Open Dialog</label>

    <div class="shc-dialog-overlay">
      <label for="dialog-1" class="shc-dialog-backdrop"></label>
      <div class="shc-dialog-content">
        <div class="shc-dialog-header">
          <h3 class="shc-dialog-title">Settings</h3>
          <p class="shc-dialog-description">Configure options</p>
        </div>
        <div class="shc-dialog-body">
          <!-- Content -->
        </div>
        <div class="shc-dialog-footer">
          <label for="dialog-1" class="shc-btn shc-btn-outline">Cancel</label>
          <button class="shc-btn">Save</button>
        </div>
      </div>
    </div>
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-dialog` | Container |
| `shc-dialog-state` | Hidden checkbox |
| `shc-dialog-overlay` | Full overlay |
| `shc-dialog-backdrop` | Dark background |
| `shc-dialog-content` | Dialog box |
| `shc-dialog-content-sm/lg/xl` | Size variants |
| `shc-dialog-header/body/footer` | Sections |
| `shc-dialog-title/description` | Text |
| `shc-dialog-close` | Close button |

---

## Sheet

Slide-out panel from card edge.

![Sheet](https://ui.shadcn.com/og/sheet.png)

### Basic Usage (CSS-Only)

```yaml
content: |
  <div class="shc-sheet">
    <input type="checkbox" id="sheet-1" class="shc-sheet-state" />
    <label for="sheet-1" class="shc-btn">Open Sheet</label>

    <div class="shc-sheet-overlay">
      <label for="sheet-1" class="shc-sheet-backdrop"></label>
      <div class="shc-sheet-content shc-sheet-content-right">
        <div class="shc-sheet-header">
          <h3 class="shc-sheet-title">Details</h3>
        </div>
        <div class="shc-sheet-body">
          <!-- Content -->
        </div>
      </div>
    </div>
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-sheet` | Container |
| `shc-sheet-state` | Hidden checkbox |
| `shc-sheet-content-top/right/bottom/left` | Slide direction |
| `shc-sheet-header/body/footer` | Sections |

---

## Popover

Click-triggered floating panel.

![Popover](https://ui.shadcn.com/og/popover.png)

### Basic Usage (CSS-Only)

```yaml
content: |
  <div class="shc-popover">
    <input type="checkbox" id="pop-1" class="shc-popover-state" />
    <label for="pop-1" class="shc-btn shc-btn-outline">Options</label>
    <div class="shc-popover-content">
      <div style="padding: 12px;">
        Popover content...
      </div>
    </div>
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-popover` | Container |
| `shc-popover-state` | Hidden checkbox |
| `shc-popover-content` | Floating panel |
| `shc-popover-content-end` | Right-aligned |

---

## Separator

Visual divider.

![Separator](https://ui.shadcn.com/og/separator.png)

### Basic Usage

```yaml
content: |
  <div>Content above</div>
  <div class="shc-separator"></div>
  <div>Content below</div>

  <!-- Vertical -->
  <div style="display: flex; align-items: center; gap: 16px;">
    <span>Left</span>
    <div class="shc-separator shc-separator-vertical" style="height: 24px;"></div>
    <span>Right</span>
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-separator` | Horizontal line |
| `shc-separator-vertical` | Vertical line |

---

## Skeleton

Loading placeholder.

![Skeleton](https://ui.shadcn.com/og/skeleton.png)

### Basic Usage

```yaml
content: |
  <div style="display: flex; gap: 12px;">
    <div class="shc-skeleton shc-skeleton-circle" style="width: 48px; height: 48px;"></div>
    <div style="flex: 1;">
      <div class="shc-skeleton" style="height: 16px; width: 60%; margin-bottom: 8px;"></div>
      <div class="shc-skeleton" style="height: 14px; width: 40%;"></div>
    </div>
  </div>
```

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-skeleton` | Base with animation |
| `shc-skeleton-circle` | Circular shape |

---

## Aspect Ratio

Container maintaining width/height ratio.

![Aspect Ratio](https://ui.shadcn.com/og/aspect-ratio.png)

### Basic Usage

```yaml
content: |
  <div class="shc-aspect-ratio" style="--aspect-ratio: 16/9;">
    <img src="{{ state_attr('camera.front_door', 'entity_picture') }}" style="width: 100%; height: 100%; object-fit: cover;" />
  </div>
```

### Common Ratios
- `16/9` - Widescreen video
- `4/3` - Standard
- `1/1` - Square
- `9/16` - Vertical (doorbell)

### CSS Classes
| Class | Description |
|-------|-------------|
| `shc-aspect-ratio` | Container |

### CSS Variables
| Variable | Description |
|----------|-------------|
| `--aspect-ratio` | e.g., `16/9` |
