export type HassThemes = {
  default_theme?: string
  themes?: Record<string, Record<string, string>>
}

export type SelectedTheme = string | { theme?: string }

const FALLBACKS = {
  bg: '#0f172a',
  card: '#0b1224',
  fg: '#e5e7eb',
  muted: 'rgba(255,255,255,0.04)',
  mutedFg: '#cbd5e1',
  border: '#1f2937',
  accent: '#a855f7',
  accentFg: '#0b1224',
  secondary: 'rgba(255,255,255,0.06)',
  secondaryFg: '#e5e7eb',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  radius: '0.75rem',
}

function pick(theme: Record<string, string> | undefined, keys: string[], fallback: string): string {
  if (!theme) return fallback
  for (const key of keys) {
    const value = theme[key]
    if (typeof value === 'string' && value.trim().length > 0) return value
  }
  return fallback
}

export function mapThemeVariables(
  themes: HassThemes | undefined,
  selectedTheme: SelectedTheme | undefined
): Record<string, string> {
  const themesMap = themes?.themes ?? {}
  const selected =
    typeof selectedTheme === 'string'
      ? selectedTheme
      : selectedTheme?.theme ?? themes?.default_theme

  const active = themesMap[selected ?? ''] ?? themesMap[themes?.default_theme ?? ''] ?? undefined

  const bg = pick(active, ['primary-background-color', 'card-background-color'], FALLBACKS.bg)
  const card = pick(active, ['ha-card-background', 'card-background-color', 'primary-background-color'], FALLBACKS.card)
  const fg = pick(active, ['primary-text-color', 'text-color'], FALLBACKS.fg)
  const muted = pick(active, ['secondary-background-color', 'divider-color'], FALLBACKS.muted)
  const mutedFg = pick(active, ['secondary-text-color'], FALLBACKS.mutedFg)
  const border = pick(active, ['divider-color', 'border-color'], FALLBACKS.border)
  const accent = pick(active, ['accent-color', 'state-icon-color'], FALLBACKS.accent)
  const secondary = pick(active, ['secondary-background-color'], FALLBACKS.secondary)
  const secondaryFg = pick(active, ['secondary-text-color'], FALLBACKS.secondaryFg)
  const success = pick(active, ['success-color'], FALLBACKS.success)
  const warning = pick(active, ['warning-color'], FALLBACKS.warning)
  const danger = pick(active, ['error-color', 'alert-color'], FALLBACKS.danger)

  return {
    // Legacy/internal variables
    '--stc-bg': bg,
    '--stc-card': card,
    '--stc-fg': fg,
    '--stc-muted': muted,
    '--stc-muted-fg': mutedFg,
    '--stc-border': border,
    '--stc-accent': accent,
    '--stc-ring': accent,
    '--stc-success': success,
    '--stc-warning': warning,
    '--stc-danger': danger,

    // shadcn / tailwind token-aligned variables
    '--background': bg,
    '--foreground': fg,
    '--card': card,
    '--card-foreground': fg,
    '--popover': card,
    '--popover-foreground': fg,
    '--primary': accent,
    '--primary-foreground': FALLBACKS.accentFg,
    '--secondary': secondary,
    '--secondary-foreground': secondaryFg,
    '--muted': muted,
    '--muted-foreground': mutedFg,
    '--accent': accent,
    '--accent-foreground': fg,
    '--destructive': danger,
    '--destructive-foreground': fg,
    '--border': border,
    '--input': border,
    '--ring': accent,
    '--radius': FALLBACKS.radius,
    '--success': success,
    '--success-foreground': fg,
    '--warning': warning,
    '--warning-foreground': fg,
    '--info': accent,
    '--info-foreground': fg,
    '--danger': danger,
    '--danger-foreground': fg,
  }
}