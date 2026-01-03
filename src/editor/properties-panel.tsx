/**
 * Properties Panel
 *
 * Displays and edits properties of the selected component.
 * Auto-generates form fields based on component prop definitions.
 * Includes toggle between Grid Position view and Tree Structure view.
 */

// @ts-ignore - Preact JSX pragma
import { h } from 'preact'
import { useMemo, useCallback, useState } from 'preact/hooks'
import { componentRegistry, type PropDefinition, type ActionType } from '../lib/component-registry'
import type { PropertiesPanelProps, ActionConfig, FormField, LayoutStyle, CardTheme } from './types'
import { TreeView } from './tree-view'
import { ThemeEditor } from './theme-editor'

/**
 * Available action types for the action selector
 */
const ACTION_TYPES: { value: ActionType; label: string }[] = [
  { value: 'toggle', label: 'Toggle' },
  { value: 'call-service', label: 'Call Service' },
  { value: 'more-info', label: 'More Info' },
  { value: 'navigate', label: 'Navigate' },
  { value: 'fire-dom-event', label: 'Fire Event' },
]

/**
 * String input field
 */
function StringField({
  field,
  onChange,
}: {
  field: FormField
  onChange: (value: string) => void
}) {
  // Use textarea for content that contains newlines or is longer than 100 chars
  const value = (field.value as string) || ''
  const isMultiline = value.includes('\n') || value.length > 100 || field.name === 'content'

  return (
    <div class="space-y-1.5">
      <label class="text-sm font-medium">{field.label}</label>
      {isMultiline ? (
        <textarea
          class="w-full px-3 py-2 text-sm rounded-md border border-input bg-background font-mono"
          value={value}
          placeholder={field.description}
          onChange={(e) => onChange((e.target as HTMLTextAreaElement).value)}
          rows={10}
          spellcheck={false}
        />
      ) : (
        <input
          type="text"
          class="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
          value={value}
          placeholder={field.description}
          onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        />
      )}
      {field.description && (
        <p class="text-xs text-muted-foreground">{field.description}</p>
      )}
    </div>
  )
}

/**
 * Number input field
 */
function NumberField({
  field,
  onChange,
}: {
  field: FormField
  onChange: (value: number) => void
}) {
  return (
    <div class="space-y-1.5">
      <label class="text-sm font-medium">{field.label}</label>
      <input
        type="number"
        class="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
        value={(field.value as number) ?? (field.defaultValue as number) ?? 0}
        onChange={(e) => onChange(parseFloat((e.target as HTMLInputElement).value) || 0)}
      />
      {field.description && (
        <p class="text-xs text-muted-foreground">{field.description}</p>
      )}
    </div>
  )
}

/**
 * Boolean checkbox field
 */
function BooleanField({
  field,
  onChange,
}: {
  field: FormField
  onChange: (value: boolean) => void
}) {
  return (
    <label class="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        class="w-4 h-4 rounded border-input"
        checked={field.value as boolean}
        onChange={(e) => onChange((e.target as HTMLInputElement).checked)}
      />
      <span class="text-sm font-medium">{field.label}</span>
      {field.description && (
        <span class="text-xs text-muted-foreground">({field.description})</span>
      )}
    </label>
  )
}

/**
 * Select dropdown field
 */
function SelectField({
  field,
  onChange,
}: {
  field: FormField
  onChange: (value: string) => void
}) {
  return (
    <div class="space-y-1.5">
      <label class="text-sm font-medium">{field.label}</label>
      <select
        class="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
        value={(field.value as string) || (field.defaultValue as string) || ''}
        onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
      >
        {field.options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {field.description && (
        <p class="text-xs text-muted-foreground">{field.description}</p>
      )}
    </div>
  )
}

/**
 * Entity picker using HA's native element
 */
function EntityField({
  field,
  hass,
  onChange,
}: {
  field: FormField
  hass: unknown
  onChange: (value: string) => void
}) {
  return (
    <div class="space-y-1.5">
      <label class="text-sm font-medium">{field.label}</label>
      <ha-entity-picker
        hass={hass}
        value={(field.value as string) || ''}
        onValueChanged={(e: CustomEvent) => onChange(e.detail.value)}
        allow-custom-entity
      />
      {field.description && (
        <p class="text-xs text-muted-foreground">{field.description}</p>
      )}
    </div>
  )
}

/**
 * Icon picker using HA's native element
 */
function IconField({
  field,
  onChange,
}: {
  field: FormField
  onChange: (value: string) => void
}) {
  return (
    <div class="space-y-1.5">
      <label class="text-sm font-medium">{field.label}</label>
      <ha-icon-picker
        value={(field.value as string) || ''}
        onValueChanged={(e: CustomEvent) => onChange(e.detail.value)}
      />
      {field.description && (
        <p class="text-xs text-muted-foreground">{field.description}</p>
      )}
    </div>
  )
}

/**
 * Dynamic field renderer based on prop type
 */
function FormFieldRenderer({
  field,
  hass,
  onChange,
}: {
  field: FormField
  hass: unknown
  onChange: (name: string, value: unknown) => void
}) {
  const handleChange = useCallback(
    (value: unknown) => {
      onChange(field.name, value)
    },
    [field.name, onChange]
  )

  switch (field.type) {
    case 'string':
      return <StringField field={field} onChange={handleChange as (v: string) => void} />
    case 'number':
      return <NumberField field={field} onChange={handleChange as (v: number) => void} />
    case 'boolean':
    case 'boolean-or-binding':
      return <BooleanField field={field} onChange={handleChange as (v: boolean) => void} />
    case 'select':
      return <SelectField field={field} onChange={handleChange as (v: string) => void} />
    case 'entity':
      return <EntityField field={field} hass={hass} onChange={handleChange as (v: string) => void} />
    case 'icon':
      return <IconField field={field} onChange={handleChange as (v: string) => void} />
    case 'color':
      return <StringField field={field} onChange={handleChange as (v: string) => void} />
    case 'service':
      return <StringField field={field} onChange={handleChange as (v: string) => void} />
    default:
      return <StringField field={field} onChange={handleChange as (v: string) => void} />
  }
}

/**
 * Entity binding section
 */
function BindingSection({
  hass,
  bind,
  onChange,
}: {
  hass: unknown
  bind?: string
  onChange: (bind: string | undefined) => void
}) {
  return (
    <div class="space-y-3 p-3 rounded-md bg-muted/50">
      <h4 class="text-sm font-semibold flex items-center gap-2">
        <ha-icon icon="mdi:link-variant" class="w-4 h-4" />
        Entity Binding
      </h4>
      <ha-entity-picker
        hass={hass}
        value={bind || ''}
        onValueChanged={(e: CustomEvent) => onChange(e.detail.value || undefined)}
        allow-custom-entity
      />
      <p class="text-xs text-muted-foreground">
        Bind component state to a Home Assistant entity
      </p>
    </div>
  )
}

/**
 * Action configuration section
 */
function ActionSection({
  action,
  onChange,
}: {
  action?: ActionConfig
  onChange: (action: ActionConfig | undefined) => void
}) {
  const handleTypeChange = useCallback(
    (type: ActionType) => {
      onChange({ ...action, type })
    },
    [action, onChange]
  )

  const handleServiceChange = useCallback(
    (service: string) => {
      onChange({ ...action, type: action?.type || 'call-service', service })
    },
    [action, onChange]
  )

  return (
    <div class="space-y-3 p-3 rounded-md bg-muted/50">
      <h4 class="text-sm font-semibold flex items-center gap-2">
        <ha-icon icon="mdi:gesture-tap" class="w-4 h-4" />
        Tap Action
      </h4>

      {/* Action type selector */}
      <select
        class="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
        value={action?.type || 'toggle'}
        onChange={(e) => handleTypeChange((e.target as HTMLSelectElement).value as ActionType)}
      >
        <option value="">No action</option>
        {ACTION_TYPES.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Service input for call-service action */}
      {action?.type === 'call-service' && (
        <div class="space-y-1.5">
          <label class="text-xs text-muted-foreground">Service</label>
          <input
            type="text"
            class="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
            value={action.service || ''}
            placeholder="e.g., light.turn_on"
            onChange={(e) => handleServiceChange((e.target as HTMLInputElement).value)}
          />
        </div>
      )}
    </div>
  )
}

/**
 * Layout & Alignment Controls Section
 */
function LayoutStyleSection({
  style,
  onChange,
}: {
  style?: LayoutStyle
  onChange: (style: LayoutStyle) => void
}) {
  const handleAlignSelfChange = useCallback(
    (value: LayoutStyle['alignSelf']) => {
      onChange({ ...style, alignSelf: value })
    },
    [style, onChange]
  )

  const handleJustifySelfChange = useCallback(
    (value: LayoutStyle['justifySelf']) => {
      onChange({ ...style, justifySelf: value })
    },
    [style, onChange]
  )

  const handleWidthChange = useCallback(
    (width: string) => {
      onChange({ ...style, width })
    },
    [style, onChange]
  )

  const handleGapChange = useCallback(
    (gap: string) => {
      onChange({ ...style, gap })
    },
    [style, onChange]
  )

  const handleMarginChange = useCallback(
    (margin: string) => {
      onChange({ ...style, margin })
    },
    [style, onChange]
  )

  const handlePaddingChange = useCallback(
    (padding: string) => {
      onChange({ ...style, padding })
    },
    [style, onChange]
  )

  return (
    <div class="space-y-3 p-3 rounded-md bg-muted/50">
      <h4 class="text-sm font-semibold flex items-center gap-2">
        <ha-icon icon="mdi:page-layout-body" class="w-4 h-4" />
        Layout & Alignment
      </h4>

      {/* Align Self */}
      <div class="space-y-1.5">
        <label class="text-xs font-medium">Align Self</label>
        <div class="grid grid-cols-4 gap-1">
          {[
            { value: 'flex-start', icon: 'mdi:align-vertical-top', label: 'Start' },
            { value: 'center', icon: 'mdi:align-vertical-center', label: 'Center' },
            { value: 'flex-end', icon: 'mdi:align-vertical-bottom', label: 'End' },
            { value: 'stretch', icon: 'mdi:arrow-expand-vertical', label: 'Stretch' },
          ].map((opt) => (
            <button
              key={opt.value}
              class={`px-2 py-1.5 text-xs rounded border transition-colors ${
                style?.alignSelf === opt.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-input hover:bg-accent'
              }`}
              onClick={() => handleAlignSelfChange(opt.value as LayoutStyle['alignSelf'])}
            >
              <ha-icon icon={opt.icon} class="w-3 h-3 mb-0.5" />
              <div class="text-[10px]">{opt.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Justify Self */}
      <div class="space-y-1.5">
        <label class="text-xs font-medium">Justify Self</label>
        <div class="grid grid-cols-4 gap-1">
          {[
            { value: 'flex-start', icon: 'mdi:align-horizontal-left', label: 'Start' },
            { value: 'center', icon: 'mdi:align-horizontal-center', label: 'Center' },
            { value: 'flex-end', icon: 'mdi:align-horizontal-right', label: 'End' },
            { value: 'stretch', icon: 'mdi:arrow-expand-horizontal', label: 'Stretch' },
          ].map((opt) => (
            <button
              key={opt.value}
              class={`px-2 py-1.5 text-xs rounded border transition-colors ${
                style?.justifySelf === opt.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-input hover:bg-accent'
              }`}
              onClick={() => handleJustifySelfChange(opt.value as LayoutStyle['justifySelf'])}
            >
              <ha-icon icon={opt.icon} class="w-3 h-3 mb-0.5" />
              <div class="text-[10px]">{opt.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Width Control */}
      <div class="space-y-1.5">
        <label class="text-xs font-medium">Width</label>
        <div class="flex gap-1">
          <button
            class={`flex-1 px-2 py-1.5 text-xs rounded border transition-colors ${
              !style?.width || style?.width === 'auto'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-input hover:bg-accent'
            }`}
            onClick={() => handleWidthChange('auto')}
          >
            Auto
          </button>
          <button
            class={`flex-1 px-2 py-1.5 text-xs rounded border transition-colors ${
              style?.width === 'full'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-input hover:bg-accent'
            }`}
            onClick={() => handleWidthChange('full')}
          >
            Full
          </button>
        </div>
        {style?.width && style.width !== 'auto' && style.width !== 'full' && (
          <input
            type="text"
            class="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
            value={style.width}
            placeholder="e.g., 200px, 50%"
            onChange={(e) => handleWidthChange((e.target as HTMLInputElement).value)}
          />
        )}
        {(!style?.width || style.width === 'auto' || style.width === 'full') && (
          <button
            class="w-full px-2 py-1.5 text-xs rounded border border-input bg-background hover:bg-accent"
            onClick={() => handleWidthChange('200px')}
          >
            + Custom
          </button>
        )}
      </div>

      {/* Gap (for containers) */}
      <div class="space-y-1.5">
        <label class="text-xs font-medium">Gap (for children)</label>
        <input
          type="text"
          class="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
          value={style?.gap || ''}
          placeholder="e.g., 1rem, 8px"
          onChange={(e) => handleGapChange((e.target as HTMLInputElement).value)}
        />
        <p class="text-xs text-muted-foreground">Space between child elements</p>
      </div>

      {/* Margin */}
      <div class="space-y-1.5">
        <label class="text-xs font-medium">Margin</label>
        <input
          type="text"
          class="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
          value={style?.margin || ''}
          placeholder="e.g., 1rem, 8px 16px"
          onChange={(e) => handleMarginChange((e.target as HTMLInputElement).value)}
        />
        <p class="text-xs text-muted-foreground">Outer spacing around component</p>
      </div>

      {/* Padding */}
      <div class="space-y-1.5">
        <label class="text-xs font-medium">Padding</label>
        <input
          type="text"
          class="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
          value={style?.padding || ''}
          placeholder="e.g., 1rem, 8px 16px"
          onChange={(e) => handlePaddingChange((e.target as HTMLInputElement).value)}
        />
        <p class="text-xs text-muted-foreground">Inner spacing inside component</p>
      </div>
    </div>
  )
}

/**
 * Main PropertiesPanel component
 */
export function PropertiesPanel({
  hass,
  config,
  selectedItem,
  layout,
  onPropertyChange,
  onConfigChange,
  onSelect,
  onDelete,
}: PropertiesPanelProps) {
  // View toggle state: 'properties' or 'tree' (when component selected), 'theme' or 'tree' (when no selection)
  const [viewMode, setViewMode] = useState<'properties' | 'tree' | 'theme'>('properties')
  // Collapsed state for the entire panel
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Get component definition from registry
  const compDef = useMemo(() => {
    if (!selectedItem) return null
    return componentRegistry.get(selectedItem.component)
  }, [selectedItem?.component])

  // Convert prop definitions to form fields
  const formFields = useMemo((): FormField[] => {
    if (!compDef?.props || !selectedItem) return []

    return compDef.props.map((prop: PropDefinition) => ({
      name: prop.name,
      label: prop.name.charAt(0).toUpperCase() + prop.name.slice(1),
      type: prop.type,
      value: selectedItem.props[prop.name],
      defaultValue: prop.default,
      options: prop.options,
      description: prop.description,
      required: prop.required,
    }))
  }, [compDef, selectedItem])

  // Handle prop value change
  const handlePropChange = useCallback(
    (propName: string, value: unknown) => {
      if (!selectedItem) return
      onPropertyChange(selectedItem.i, {
        props: {
          ...selectedItem.props,
          [propName]: value,
        },
      })
    },
    [selectedItem, onPropertyChange]
  )

  // Handle binding change
  const handleBindChange = useCallback(
    (bind: string | undefined) => {
      if (!selectedItem) return
      onPropertyChange(selectedItem.i, { bind })
    },
    [selectedItem, onPropertyChange]
  )

  // Handle action change
  const handleActionChange = useCallback(
    (action: ActionConfig | undefined) => {
      if (!selectedItem) return
      onPropertyChange(selectedItem.i, { action })
    },
    [selectedItem, onPropertyChange]
  )

  // Handle style change
  const handleStyleChange = useCallback(
    (style: LayoutStyle) => {
      if (!selectedItem) return
      onPropertyChange(selectedItem.i, { style })
    },
    [selectedItem, onPropertyChange]
  )

  // Handle theme change
  const handleThemeChange = useCallback(
    (theme: CardTheme) => {
      onConfigChange({ ...config, theme })
    },
    [config, onConfigChange]
  )

  // Collapsed state - just show expand button
  if (isCollapsed) {
    return (
      <div class="h-full flex flex-col border-l border-border bg-card w-10">
        <button
          type="button"
          class="flex-1 flex flex-col items-center justify-center gap-2 hover:bg-muted transition-colors"
          onClick={() => setIsCollapsed(false)}
          title="Expand properties panel"
        >
          <ha-icon icon="mdi:chevron-left" class="w-4 h-4 text-muted-foreground" />
          <span class="text-[10px] text-muted-foreground [writing-mode:vertical-rl] rotate-180">
            Properties
          </span>
        </button>
      </div>
    )
  }

  // Empty state - show theme/tree toggle when no selection
  if (!selectedItem) {
    // Default to theme view when no selection
    const emptyViewMode = viewMode === 'properties' ? 'theme' : viewMode

    return (
      <div class="h-full flex flex-col border-l border-border bg-card w-72">
        <div class="p-3 border-b border-border">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-semibold">Card Configuration</h3>
            <button
              type="button"
              class="p-1 hover:bg-muted rounded transition-colors"
              onClick={() => setIsCollapsed(true)}
              title="Collapse panel"
            >
              <ha-icon icon="mdi:chevron-right" class="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Theme/Tree Toggle */}
          <div class="flex gap-1 p-1 bg-muted rounded-md">
            <button
              class={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                emptyViewMode === 'theme'
                  ? 'bg-background shadow-sm font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setViewMode('theme')}
            >
              <div class="flex items-center justify-center gap-1">
                <ha-icon icon="mdi:palette" class="w-3 h-3" />
                <span>Theme</span>
              </div>
            </button>
            <button
              class={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                emptyViewMode === 'tree'
                  ? 'bg-background shadow-sm font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setViewMode('tree')}
            >
              <div class="flex items-center justify-center gap-1">
                <ha-icon icon="mdi:file-tree" class="w-3 h-3" />
                <span>Tree</span>
              </div>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-auto">
          {emptyViewMode === 'theme' ? (
            <ThemeEditor theme={config.theme} onChange={handleThemeChange} />
          ) : (
            <TreeView
              items={layout}
              selectedId={null}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          )}
        </div>
      </div>
    )
  }

  const displayName = compDef?.displayName || selectedItem.component

  return (
    <div class="h-full flex flex-col border-l border-border bg-card w-72">
      {/* Header with view toggle */}
      <div class="p-3 border-b border-border">
        <div class="flex items-center gap-2 mb-2">
          <ha-icon icon={compDef?.icon || 'mdi:shape'} class="w-5 h-5 text-primary" />
          <h3 class="text-sm font-semibold flex-1">{displayName}</h3>
          <button
            type="button"
            class="p-1 hover:bg-muted rounded transition-colors"
            onClick={() => setIsCollapsed(true)}
            title="Collapse panel"
          >
            <ha-icon icon="mdi:chevron-right" class="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <p class="text-xs text-muted-foreground mb-3">
          {compDef?.description || 'Configure component properties'}
        </p>

        {/* View Toggle */}
        <div class="flex gap-1 p-1 bg-muted rounded-md">
          <button
            class={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
              viewMode === 'properties'
                ? 'bg-background shadow-sm font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setViewMode('properties')}
          >
            <div class="flex items-center justify-center gap-1">
              <ha-icon icon="mdi:tune" class="w-3 h-3" />
              <span>Properties</span>
            </div>
          </button>
          <button
            class={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
              viewMode === 'tree'
                ? 'bg-background shadow-sm font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setViewMode('tree')}
          >
            <div class="flex items-center justify-center gap-1">
              <ha-icon icon="mdi:file-tree" class="w-3 h-3" />
              <span>Tree</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content area - switches between properties and tree */}
      {viewMode === 'properties' ? (
        <div class="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Component Props */}
          {formFields.length > 0 && (
            <div class="space-y-3">
              <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Properties
              </h4>
              {formFields.map((field) => (
                <FormFieldRenderer
                  key={field.name}
                  field={field}
                  hass={hass}
                  onChange={handlePropChange}
                />
              ))}
            </div>
          )}

          {/* Entity Binding */}
          <BindingSection
            hass={hass}
            bind={selectedItem.bind}
            onChange={handleBindChange}
          />

          {/* Action Configuration */}
          <ActionSection
            action={selectedItem.action}
            onChange={handleActionChange}
          />

          {/* Layout & Alignment Controls */}
          <LayoutStyleSection
            style={selectedItem.style}
            onChange={handleStyleChange}
          />

          {/* Debug: Item ID */}
          <div class="pt-3 border-t border-border">
            <p class="text-xs text-muted-foreground">
              ID: <code class="bg-muted px-1 rounded">{selectedItem.i}</code>
            </p>
          </div>
        </div>
      ) : (
        <div class="flex-1 overflow-hidden">
          <TreeView
            items={layout}
            selectedId={selectedItem.i}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        </div>
      )}
    </div>
  )
}

export default PropertiesPanel
