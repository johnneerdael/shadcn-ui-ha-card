/**
 * Badge Component
 *
 * Small status indicator for displaying labels, counts, or status.
 * Based on shadcn/ui Badge with multiple variants.
 *
 * @example
 * ```html
 * <span class="shc-badge">Default</span>
 * <span class="shc-badge shc-badge-secondary">Secondary</span>
 * <span class="shc-badge shc-badge-destructive">Error</span>
 * <span class="shc-badge shc-badge-outline">Outline</span>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/badge
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const badgeStyles = `
  /* Base badge styles */
  .shc-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    border: 1px solid transparent;
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.25rem;
    white-space: nowrap;
    flex-shrink: 0;
    gap: 0.25rem;
    transition: color 0.2s, background-color 0.2s, box-shadow 0.2s;
    overflow: hidden;
    width: fit-content;
  }

  /* Default variant */
  .shc-badge,
  .shc-badge-default {
    background-color: var(--primary);
    color: var(--primary-foreground);
    border-color: transparent;
  }

  a.shc-badge:hover,
  a.shc-badge-default:hover {
    background-color: color-mix(in srgb, var(--primary) 90%, transparent);
  }

  /* Secondary variant */
  .shc-badge-secondary {
    background-color: var(--secondary);
    color: var(--secondary-foreground);
    border-color: transparent;
  }

  a.shc-badge-secondary:hover {
    background-color: color-mix(in srgb, var(--secondary) 90%, transparent);
  }

  /* Destructive variant */
  .shc-badge-destructive {
    background-color: var(--destructive);
    color: var(--destructive-foreground, #fff);
    border-color: transparent;
  }

  a.shc-badge-destructive:hover {
    background-color: color-mix(in srgb, var(--destructive) 90%, transparent);
  }

  /* Outline variant */
  .shc-badge-outline {
    background-color: transparent;
    color: var(--foreground);
    border-color: var(--border);
  }

  a.shc-badge-outline:hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  /* Success variant (custom for HA) */
  .shc-badge-success {
    background-color: var(--success, #22c55e);
    color: var(--success-foreground, #fff);
    border-color: transparent;
  }

  /* Warning variant (custom for HA) */
  .shc-badge-warning {
    background-color: var(--warning, #f59e0b);
    color: var(--warning-foreground, #fff);
    border-color: transparent;
  }

  /* Icon support */
  .shc-badge > svg,
  .shc-badge > ha-icon {
    width: 0.75rem;
    height: 0.75rem;
    pointer-events: none;
  }

  /* Size variants */
  .shc-badge-sm {
    padding: 0 0.375rem;
    font-size: 0.625rem;
    line-height: 1rem;
  }

  .shc-badge-lg {
    padding: 0.25rem 0.625rem;
    font-size: 0.875rem;
    line-height: 1.5rem;
  }
`

/**
 * Badge component definition
 */
export const badgeComponent: ComponentDefinition = {
  name: 'badge',
  styles: badgeStyles,
}

/**
 * Helper function to generate badge class names
 * @param variant - 'default', 'secondary', 'destructive', 'outline', 'success', or 'warning'
 * @param size - 'default', 'sm', or 'lg'
 */
export function badge(
  variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' = 'default',
  size: 'default' | 'sm' | 'lg' = 'default'
): string {
  const classes = ['shc-badge']

  if (variant !== 'default') {
    classes.push(`shc-badge-${variant}`)
  }

  if (size !== 'default') {
    classes.push(`shc-badge-${size}`)
  }

  return classes.join(' ')
}
