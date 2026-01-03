/**
 * Theme Editor Component
 *
 * Provides UI for editing card theme (colors, radius, spacing)
 * Follows shadcn philosophy: "adjusting the DNA of components"
 */

import type { CardTheme } from './types'
import { THEME_PRESETS } from '../lib/theme-presets'

export interface ThemeEditorProps {
  /** Current theme configuration */
  theme?: CardTheme
  /** Callback when theme changes */
  onChange: (theme: CardTheme) => void
}

export function ThemeEditor({ theme = {}, onChange }: ThemeEditorProps) {
  const handleColorChange = (key: keyof CardTheme, value: string) => {
    onChange({ ...theme, [key]: value })
  }

  const handleSpacingChange = (key: 'gap' | 'padding', value: string) => {
    onChange({
      ...theme,
      spacing: { ...theme?.spacing, [key]: value },
    })
  }

  const handleRadiusChange = (value: string) => {
    onChange({ ...theme, radius: value })
  }

  const applyPreset = (presetName: string) => {
    const preset = THEME_PRESETS[presetName]
    if (preset) {
      onChange(preset)
    }
  }

  return (
    <div class="space-y-4 p-4">
      <div class="space-y-1">
        <h3 class="text-sm font-semibold text-foreground">Card Theme</h3>
        <p class="text-xs text-muted-foreground">
          Customize the DNA of your components
        </p>
      </div>

      {/* Color Controls */}
      <div class="space-y-3">
        <h4 class="text-xs font-medium text-foreground uppercase tracking-wider">Colors</h4>

        <ColorField
          label="Primary"
          value={theme.primary || '#0070f3'}
          onChange={(v) => handleColorChange('primary', v)}
        />

        <ColorField
          label="Secondary"
          value={theme.secondary || '#7c3aed'}
          onChange={(v) => handleColorChange('secondary', v)}
        />

        <ColorField
          label="Background"
          value={theme.background || '#ffffff'}
          onChange={(v) => handleColorChange('background', v)}
        />

        <ColorField
          label="Foreground"
          value={theme.foreground || '#000000'}
          onChange={(v) => handleColorChange('foreground', v)}
        />
      </div>

      {/* Radius Control */}
      <div class="space-y-3">
        <h4 class="text-xs font-medium text-foreground uppercase tracking-wider">Visual Style</h4>

        <RadiusSlider
          value={theme.radius || '0.5rem'}
          onChange={handleRadiusChange}
        />
      </div>

      {/* Spacing Controls */}
      <div class="space-y-3">
        <h4 class="text-xs font-medium text-foreground uppercase tracking-wider">Spacing</h4>

        <SpacingField
          label="Gap"
          value={theme.spacing?.gap || '0.5rem'}
          onChange={(v) => handleSpacingChange('gap', v)}
        />

        <SpacingField
          label="Padding"
          value={theme.spacing?.padding || '1rem'}
          onChange={(v) => handleSpacingChange('padding', v)}
        />
      </div>

      {/* Theme Presets */}
      <div class="space-y-3 pt-3 border-t border-border">
        <h4 class="text-xs font-medium text-foreground uppercase tracking-wider">Quick Presets</h4>

        <div class="grid grid-cols-2 gap-2">
          <PresetButton name="Material" onClick={() => applyPreset('material')} />
          <PresetButton name="Apple" onClick={() => applyPreset('apple')} />
          <PresetButton name="Corporate" onClick={() => applyPreset('corporate')} />
          <PresetButton name="Playful" onClick={() => applyPreset('playful')} />
        </div>
      </div>
    </div>
  )
}

/**
 * Color picker field
 */
interface ColorFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}

function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div class="flex items-center justify-between gap-2">
      <label class="text-sm text-foreground">{label}</label>
      <div class="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange((e.target as HTMLInputElement).value)}
          class="h-8 w-8 rounded border border-input cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange((e.target as HTMLInputElement).value)}
          class="h-8 w-24 px-2 text-sm rounded border border-input bg-background text-foreground font-mono"
          placeholder="#000000"
        />
      </div>
    </div>
  )
}

/**
 * Radius slider with numeric input (0rem to 1rem)
 */
interface RadiusSliderProps {
  value: string
  onChange: (value: string) => void
}

function RadiusSlider({ value, onChange }: RadiusSliderProps) {
  // Parse rem value to number
  const numValue = parseFloat(value.replace('rem', '')) || 0.5

  const handleSliderChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const rem = parseFloat(target.value)
    onChange(`${rem}rem`)
  }

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const rem = parseFloat(target.value) || 0
    const clamped = Math.max(0, Math.min(1, rem))
    onChange(`${clamped}rem`)
  }

  return (
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <label class="text-sm text-foreground">Border Radius</label>
        <div class="flex items-center gap-1">
          <input
            type="number"
            min="0"
            max="1"
            step="0.05"
            value={numValue}
            onChange={handleInputChange}
            class="h-6 w-14 px-1.5 text-xs rounded border border-input bg-background text-foreground font-mono text-right"
          />
          <span class="text-xs text-muted-foreground">rem</span>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={numValue}
        onChange={handleSliderChange}
        class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
      />

      <div class="flex justify-between text-[10px] text-muted-foreground">
        <span>Sharp</span>
        <span>Bubbly</span>
      </div>
    </div>
  )
}

/**
 * Spacing field with slider and numeric input (rem)
 */
interface SpacingFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}

function SpacingField({ label, value, onChange }: SpacingFieldProps) {
  // Parse rem value to number
  const numValue = parseFloat(value.replace('rem', '')) || 0.5

  const handleSliderChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const rem = parseFloat(target.value)
    onChange(`${rem}rem`)
  }

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const rem = parseFloat(target.value) || 0
    const clamped = Math.max(0, Math.min(3, rem))
    onChange(`${clamped}rem`)
  }

  return (
    <div class="space-y-1.5">
      <div class="flex items-center justify-between">
        <label class="text-sm text-foreground">{label}</label>
        <div class="flex items-center gap-1">
          <input
            type="number"
            min="0"
            max="3"
            step="0.25"
            value={numValue}
            onChange={handleInputChange}
            class="h-6 w-14 px-1.5 text-xs rounded border border-input bg-background text-foreground font-mono text-right"
          />
          <span class="text-xs text-muted-foreground">rem</span>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max="3"
        step="0.25"
        value={numValue}
        onChange={handleSliderChange}
        class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  )
}

/**
 * Preset button
 */
interface PresetButtonProps {
  name: string
  onClick: () => void
}

function PresetButton({ name, onClick }: PresetButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      class="px-3 py-2 text-sm rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      {name}
    </button>
  )
}

export default ThemeEditor
