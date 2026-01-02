/**
 * Theme Presets
 *
 * Pre-configured theme definitions following popular design systems
 * These provide quick starting points for users to customize their cards
 */

import type { CardTheme } from '../editor/types'

export const THEME_PRESETS: Record<string, CardTheme> = {
  /**
   * Material Design 3
   * Purple primary, teal secondary, clean spacing
   */
  material: {
    primary: '#6200ea',
    secondary: '#03dac6',
    background: '#ffffff',
    foreground: '#000000',
    radius: '0.25rem',
    spacing: {
      gap: '0.5rem',
      padding: '1rem',
    },
  },

  /**
   * Apple Human Interface Guidelines
   * Blue primary, indigo secondary, generous spacing, rounded corners
   */
  apple: {
    primary: '#007aff',
    secondary: '#5856d6',
    background: '#f5f5f7',
    foreground: '#1d1d1f',
    radius: '0.75rem',
    spacing: {
      gap: '0.75rem',
      padding: '1.5rem',
    },
  },

  /**
   * Corporate/Professional
   * Navy primary, gray secondary, sharp edges, structured spacing
   */
  corporate: {
    primary: '#1e40af',
    secondary: '#64748b',
    background: '#ffffff',
    foreground: '#0f172a',
    radius: '0rem',
    spacing: {
      gap: '1rem',
      padding: '2rem',
    },
  },

  /**
   * Playful/Creative
   * Pink primary, purple secondary, high radius, comfortable spacing
   */
  playful: {
    primary: '#ec4899',
    secondary: '#8b5cf6',
    background: '#fef3c7',
    foreground: '#78350f',
    radius: '1rem',
    spacing: {
      gap: '1rem',
      padding: '1.5rem',
    },
  },
}

/**
 * Get a theme preset by name
 * Returns undefined if preset doesn't exist
 */
export function getThemePreset(name: string): CardTheme | undefined {
  return THEME_PRESETS[name]
}

/**
 * Get all available theme preset names
 */
export function getThemePresetNames(): string[] {
  return Object.keys(THEME_PRESETS)
}
