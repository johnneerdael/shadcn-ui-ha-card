/**
 * Card Settings Panel
 *
 * Compact horizontal panel for card-level CSS settings.
 * Displayed at the top of the editor.
 */

import { useState, useCallback } from 'preact/hooks'
import type { CardTheme } from './types'

export interface CardSettingsProps {
  /** Current theme configuration */
  theme?: CardTheme
  /** Callback when theme changes */
  onChange: (theme: CardTheme) => void
}

/**
 * Compact color picker
 */
function ColorChip({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div class="flex items-center gap-1.5">
      <span class="text-[10px] text-muted-foreground">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        class="h-5 w-5 rounded border border-input cursor-pointer"
        title={`${label}: ${value}`}
      />
    </div>
  )
}

/**
 * Compact number input
 */
function NumberChip({
  label,
  value,
  unit,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  unit: string
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}) {
  return (
    <div class="flex items-center gap-1">
      <span class="text-[10px] text-muted-foreground">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat((e.target as HTMLInputElement).value) || 0)}
        class="h-5 w-12 px-1 text-[10px] rounded border border-input bg-background text-foreground font-mono text-right"
      />
      <span class="text-[10px] text-muted-foreground">{unit}</span>
    </div>
  )
}

/**
 * Main CardSettings component
 */
export function CardSettings({ theme = {}, onChange }: CardSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleColorChange = useCallback(
    (key: keyof CardTheme, value: string) => {
      onChange({ ...theme, [key]: value })
    },
    [theme, onChange]
  )

  const handleRadiusChange = useCallback(
    (value: number) => {
      onChange({ ...theme, radius: `${value}rem` })
    },
    [theme, onChange]
  )

  const handleSpacingChange = useCallback(
    (key: 'gap' | 'padding', value: number) => {
      onChange({
        ...theme,
        spacing: { ...theme?.spacing, [key]: `${value}rem` },
      })
    },
    [theme, onChange]
  )

  // Parse current values
  const radius = parseFloat(theme.radius?.replace('rem', '') || '0.5')
  const gap = parseFloat(theme.spacing?.gap?.replace('rem', '') || '0.5')
  const padding = parseFloat(theme.spacing?.padding?.replace('rem', '') || '1')

  return (
    <div class="bg-card border-b border-border">
      {/* Header with collapse toggle */}
      <button
        type="button"
        class="w-full flex items-center justify-between px-3 py-1.5 hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div class="flex items-center gap-2">
          <ha-icon icon="mdi:palette-outline" class="w-3.5 h-3.5 text-primary" />
          <span class="text-xs font-medium">Card Theme</span>
        </div>
        <ha-icon
          icon={isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'}
          class="w-3.5 h-3.5 text-muted-foreground"
        />
      </button>

      {/* Settings row */}
      {isExpanded && (
        <div class="flex flex-wrap items-center gap-4 px-3 py-2 border-t border-border/50">
          {/* Colors */}
          <div class="flex items-center gap-3">
            <ColorChip
              label="Primary"
              value={theme.primary || '#0070f3'}
              onChange={(v) => handleColorChange('primary', v)}
            />
            <ColorChip
              label="Secondary"
              value={theme.secondary || '#7c3aed'}
              onChange={(v) => handleColorChange('secondary', v)}
            />
            <ColorChip
              label="BG"
              value={theme.background || '#ffffff'}
              onChange={(v) => handleColorChange('background', v)}
            />
            <ColorChip
              label="FG"
              value={theme.foreground || '#000000'}
              onChange={(v) => handleColorChange('foreground', v)}
            />
          </div>

          {/* Divider */}
          <div class="h-4 w-px bg-border" />

          {/* Sizing */}
          <div class="flex items-center gap-3">
            <NumberChip
              label="Radius"
              value={radius}
              unit="rem"
              min={0}
              max={1}
              step={0.1}
              onChange={handleRadiusChange}
            />
            <NumberChip
              label="Gap"
              value={gap}
              unit="rem"
              min={0}
              max={3}
              step={0.25}
              onChange={(v) => handleSpacingChange('gap', v)}
            />
            <NumberChip
              label="Padding"
              value={padding}
              unit="rem"
              min={0}
              max={3}
              step={0.25}
              onChange={(v) => handleSpacingChange('padding', v)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CardSettings
