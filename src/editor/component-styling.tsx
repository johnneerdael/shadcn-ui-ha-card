/**
 * Component Styling Panel
 *
 * Horizontal panel that appears when a component is selected in the canvas.
 * Shows component-specific properties, binding, styling options, and theme overrides.
 */

import { useState, useMemo, useCallback } from 'preact/hooks'
import { componentRegistry, type PropDefinition, type ActionType } from '../lib/component-registry'
import type { LayoutItem, ActionConfig, FormField, CardTheme, ComponentThemeOverride } from './types'

export interface ComponentStylingProps {
  /** Home Assistant instance */
  hass: unknown
  /** Selected layout item */
  selectedItem: LayoutItem
  /** Global card theme (for showing inherited values) */
  globalTheme?: CardTheme
  /** Callback when properties change */
  onPropertyChange: (itemId: string, updates: Partial<LayoutItem>) => void
  /** Callback to deselect */
  onDeselect: () => void
  /** Callback to delete */
  onDelete: (id: string) => void
}

/**
 * Available action types for the action selector
 */
const ACTION_TYPES: { value: ActionType; label: string }[] = [
  { value: 'toggle', label: 'Toggle' },
  { value: 'call-service', label: 'Service' },
  { value: 'more-info', label: 'Info' },
  { value: 'navigate', label: 'Navigate' },
]

/**
 * Default theme values (fallback when no global theme set)
 */
const DEFAULT_THEME: Required<Omit<CardTheme, 'spacing'>> = {
  primary: '#0070f3',
  secondary: '#7c3aed',
  background: '#ffffff',
  foreground: '#000000',
  radius: '0.5rem',
}

/**
 * Compact form field renderer
 */
function CompactField({
  field,
  hass,
  onChange,
}: {
  field: FormField
  hass: unknown
  onChange: (value: unknown) => void
}) {
  switch (field.type) {
    case 'entity':
      return (
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] text-muted-foreground whitespace-nowrap">{field.label}</span>
          <div class="flex-1 min-w-[120px]">
            <ha-entity-picker
              hass={hass}
              value={(field.value as string) || ''}
              onValueChanged={(e: CustomEvent) => onChange(e.detail.value)}
              allow-custom-entity
            />
          </div>
        </div>
      )
    case 'boolean':
    case 'boolean-or-binding':
      return (
        <label class="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            class="w-3.5 h-3.5 rounded border-input"
            checked={field.value as boolean}
            onChange={(e) => onChange((e.target as HTMLInputElement).checked)}
          />
          <span class="text-[10px] text-muted-foreground">{field.label}</span>
        </label>
      )
    case 'select':
      return (
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] text-muted-foreground whitespace-nowrap">{field.label}</span>
          <select
            class="h-5 px-1 text-[10px] rounded border border-input bg-background"
            value={(field.value as string) || (field.defaultValue as string) || ''}
            onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
          >
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )
    case 'number':
      return (
        <div class="flex items-center gap-1">
          <span class="text-[10px] text-muted-foreground whitespace-nowrap">{field.label}</span>
          <input
            type="number"
            class="h-5 w-14 px-1 text-[10px] rounded border border-input bg-background font-mono"
            value={(field.value as number) ?? (field.defaultValue as number) ?? 0}
            onChange={(e) => onChange(parseFloat((e.target as HTMLInputElement).value) || 0)}
          />
        </div>
      )
    case 'icon':
      return (
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] text-muted-foreground whitespace-nowrap">{field.label}</span>
          <ha-icon-picker
            value={(field.value as string) || ''}
            onValueChanged={(e: CustomEvent) => onChange(e.detail.value)}
          />
        </div>
      )
    default:
      return (
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] text-muted-foreground whitespace-nowrap">{field.label}</span>
          <input
            type="text"
            class="h-5 px-1.5 text-[10px] rounded border border-input bg-background flex-1 min-w-[80px]"
            value={(field.value as string) || ''}
            placeholder={field.description}
            onChange={(e) => onChange((e.target as HTMLInputElement).value)}
          />
        </div>
      )
  }
}

/**
 * Theme override color chip with inherit indicator
 */
function ThemeColorChip({
  label,
  value,
  inheritedValue,
  onChange,
  onClear,
}: {
  label: string
  value?: string
  inheritedValue: string
  onChange: (value: string) => void
  onClear: () => void
}) {
  const isOverridden = value !== undefined && value !== ''
  const displayValue = isOverridden ? value : inheritedValue

  return (
    <div class="flex items-center gap-1">
      <span class="text-[10px] text-muted-foreground">{label}</span>
      <div class="relative">
        <input
          type="color"
          value={displayValue}
          onChange={(e) => onChange((e.target as HTMLInputElement).value)}
          class={`h-5 w-5 rounded border cursor-pointer ${
            isOverridden ? 'border-primary' : 'border-input opacity-60'
          }`}
          title={isOverridden ? `${label}: ${value} (overridden)` : `${label}: ${inheritedValue} (inherited)`}
        />
        {isOverridden && (
          <button
            type="button"
            class="absolute -top-1 -right-1 w-3 h-3 bg-destructive text-destructive-foreground rounded-full text-[8px] flex items-center justify-center"
            onClick={onClear}
            title="Clear override (inherit from card)"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Main ComponentStyling component
 */
export function ComponentStyling({
  hass,
  selectedItem,
  globalTheme = {},
  onPropertyChange,
  onDeselect,
  onDelete,
}: ComponentStylingProps) {
  const [showThemeOverrides, setShowThemeOverrides] = useState(false)

  // Get component definition from registry
  const compDef = useMemo(() => {
    return componentRegistry.get(selectedItem.component)
  }, [selectedItem.component])

  // Merge global theme with defaults for inherited values
  const effectiveGlobalTheme = useMemo(() => ({
    primary: globalTheme.primary || DEFAULT_THEME.primary,
    secondary: globalTheme.secondary || DEFAULT_THEME.secondary,
    background: globalTheme.background || DEFAULT_THEME.background,
    foreground: globalTheme.foreground || DEFAULT_THEME.foreground,
    radius: globalTheme.radius || DEFAULT_THEME.radius,
  }), [globalTheme])

  // Check if any theme overrides are set
  const hasThemeOverrides = useMemo(() => {
    const override = selectedItem.themeOverride
    if (!override) return false
    return !!(override.primary || override.secondary || override.background || override.foreground || override.radius)
  }, [selectedItem.themeOverride])

  // Convert prop definitions to form fields
  const formFields = useMemo((): FormField[] => {
    if (!compDef?.props) return []

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
    (e: CustomEvent) => {
      onPropertyChange(selectedItem.i, { bind: e.detail.value || undefined })
    },
    [selectedItem, onPropertyChange]
  )

  // Handle action type change
  const handleActionTypeChange = useCallback(
    (type: string) => {
      const action: ActionConfig | undefined = type ? { type: type as ActionType } : undefined
      onPropertyChange(selectedItem.i, { action })
    },
    [selectedItem, onPropertyChange]
  )

  // Handle theme override change
  const handleThemeOverrideChange = useCallback(
    (key: keyof ComponentThemeOverride, value: string | undefined) => {
      const currentOverride = selectedItem.themeOverride || {}
      const newOverride: ComponentThemeOverride = { ...currentOverride }

      if (value === undefined || value === '') {
        delete newOverride[key]
      } else {
        newOverride[key] = value
      }

      // If all overrides are cleared, set to undefined
      const hasAnyOverride = Object.values(newOverride).some(v => v !== undefined && v !== '')
      onPropertyChange(selectedItem.i, {
        themeOverride: hasAnyOverride ? newOverride : undefined,
      })
    },
    [selectedItem, onPropertyChange]
  )

  const displayName = compDef?.displayName || selectedItem.component

  return (
    <div class="bg-card border-b border-border">
      {/* Header row */}
      <div class="flex items-center gap-3 px-3 py-1.5 border-b border-border/50">
        {/* Component info */}
        <div class="flex items-center gap-2">
          <ha-icon icon={compDef?.icon || 'mdi:shape'} class="w-4 h-4 text-primary" />
          <span class="text-xs font-medium">{displayName}</span>
        </div>

        {/* Entity binding */}
        <div class="flex items-center gap-1.5 flex-1">
          <ha-icon icon="mdi:link-variant" class="w-3.5 h-3.5 text-muted-foreground" />
          <div class="flex-1 max-w-[200px]">
            <ha-entity-picker
              hass={hass}
              value={selectedItem.bind || ''}
              onValueChanged={handleBindChange}
              allow-custom-entity
            />
          </div>
        </div>

        {/* Action */}
        <div class="flex items-center gap-1.5">
          <ha-icon icon="mdi:gesture-tap" class="w-3.5 h-3.5 text-muted-foreground" />
          <select
            class="h-5 px-1 text-[10px] rounded border border-input bg-background"
            value={selectedItem.action?.type || ''}
            onChange={(e) => handleActionTypeChange((e.target as HTMLSelectElement).value)}
          >
            <option value="">No action</option>
            {ACTION_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Theme override toggle */}
        <button
          type="button"
          class={`p-1 rounded transition-colors ${
            showThemeOverrides || hasThemeOverrides
              ? 'bg-primary/20 text-primary'
              : 'hover:bg-muted text-muted-foreground'
          }`}
          onClick={() => setShowThemeOverrides(!showThemeOverrides)}
          title={hasThemeOverrides ? 'Theme overrides active' : 'Override theme for this component'}
        >
          <ha-icon icon="mdi:palette" class="w-3.5 h-3.5" />
        </button>

        {/* Actions */}
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="p-1 hover:bg-destructive hover:text-destructive-foreground rounded transition-colors"
            onClick={() => onDelete(selectedItem.i)}
            title="Delete component"
          >
            <ha-icon icon="mdi:trash-can-outline" class="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            class="p-1 hover:bg-muted rounded transition-colors"
            onClick={onDeselect}
            title="Deselect"
          >
            <ha-icon icon="mdi:close" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Properties row */}
      {formFields.length > 0 && (
        <div class="flex flex-wrap items-center gap-3 px-3 py-2 border-b border-border/50">
          {formFields.map((field) => (
            <CompactField
              key={field.name}
              field={field}
              hass={hass}
              onChange={(value) => handlePropChange(field.name, value)}
            />
          ))}
        </div>
      )}

      {/* Theme override row (collapsible) */}
      {showThemeOverrides && (
        <div class="flex flex-wrap items-center gap-4 px-3 py-2 bg-muted/30">
          <span class="text-[10px] font-medium text-muted-foreground">Theme Override:</span>

          {/* Color overrides */}
          <ThemeColorChip
            label="Primary"
            value={selectedItem.themeOverride?.primary}
            inheritedValue={effectiveGlobalTheme.primary}
            onChange={(v) => handleThemeOverrideChange('primary', v)}
            onClear={() => handleThemeOverrideChange('primary', undefined)}
          />
          <ThemeColorChip
            label="Secondary"
            value={selectedItem.themeOverride?.secondary}
            inheritedValue={effectiveGlobalTheme.secondary}
            onChange={(v) => handleThemeOverrideChange('secondary', v)}
            onClear={() => handleThemeOverrideChange('secondary', undefined)}
          />
          <ThemeColorChip
            label="BG"
            value={selectedItem.themeOverride?.background}
            inheritedValue={effectiveGlobalTheme.background}
            onChange={(v) => handleThemeOverrideChange('background', v)}
            onClear={() => handleThemeOverrideChange('background', undefined)}
          />
          <ThemeColorChip
            label="FG"
            value={selectedItem.themeOverride?.foreground}
            inheritedValue={effectiveGlobalTheme.foreground}
            onChange={(v) => handleThemeOverrideChange('foreground', v)}
            onClear={() => handleThemeOverrideChange('foreground', undefined)}
          />

          {/* Radius override */}
          <div class="flex items-center gap-1">
            <span class="text-[10px] text-muted-foreground">Radius</span>
            <input
              type="number"
              min="0"
              max="2"
              step="0.1"
              value={parseFloat(selectedItem.themeOverride?.radius?.replace('rem', '') || '') || ''}
              placeholder={parseFloat(effectiveGlobalTheme.radius.replace('rem', '')).toString()}
              onChange={(e) => {
                const val = (e.target as HTMLInputElement).value
                handleThemeOverrideChange('radius', val ? `${val}rem` : undefined)
              }}
              class={`h-5 w-12 px-1 text-[10px] rounded border bg-background font-mono ${
                selectedItem.themeOverride?.radius ? 'border-primary' : 'border-input'
              }`}
            />
            <span class="text-[10px] text-muted-foreground">rem</span>
          </div>

          {/* Clear all overrides */}
          {hasThemeOverrides && (
            <button
              type="button"
              class="text-[10px] text-destructive hover:underline"
              onClick={() => onPropertyChange(selectedItem.i, { themeOverride: undefined })}
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ComponentStyling
