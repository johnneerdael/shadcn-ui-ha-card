/**
 * Alert Component
 * 
 * Informational message banners with different variants for different message types.
 * 
 * @example
 * ```yaml
 * content: |
 *   <div class="shc-alert">
 *     <div class="shc-alert-title">Heads up!</div>
 *     <div class="shc-alert-description">You can add components to your app.</div>
 *   </div>
 * ```
 * 
 * @see https://ui.shadcn.com/docs/components/alert
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const alertStyles = `
  /* Base alert styles */
  .shc-alert {
    position: relative;
    width: 100%;
    border-radius: var(--radius, 0.5rem);
    border: 1px solid var(--border);
    padding: 1rem;
    background-color: var(--card);
    color: var(--card-foreground);
  }

  /* Alert title */
  .shc-alert-title {
    margin-bottom: 0.25rem;
    font-weight: 500;
    line-height: 1;
    letter-spacing: -0.025em;
  }

  /* Alert description */
  .shc-alert-description {
    font-size: 0.875rem;
    line-height: 1.25rem;
    opacity: 0.9;
  }

  /* Icon container */
  .shc-alert-icon {
    position: absolute;
    left: 1rem;
    top: 1rem;
    opacity: 0.9;
  }

  .shc-alert:has(.shc-alert-icon) {
    padding-left: 2.75rem;
  }

  /* Default variant */
  .shc-alert-default {
    background-color: var(--card);
    border-color: var(--border);
    color: var(--card-foreground);
  }

  /* Destructive variant */
  .shc-alert-destructive {
    border-color: var(--destructive);
    background-color: var(--destructive);
    color: var(--destructive-foreground);
  }

  .shc-alert-destructive .shc-alert-title {
    color: var(--destructive-foreground);
  }

  .shc-alert-destructive .shc-alert-description {
    color: var(--destructive-foreground);
  }

  /* Success variant */
  .shc-alert-success {
    border-color: var(--success, #22c55e);
    background-color: var(--success, #22c55e);
    color: var(--success-foreground, var(--foreground));
  }

  .shc-alert-success .shc-alert-title {
    color: var(--success-foreground, var(--foreground));
  }

  .shc-alert-success .shc-alert-description {
    color: var(--success-foreground, var(--foreground));
  }

  /* Warning variant */
  .shc-alert-warning {
    border-color: var(--warning, #f59e0b);
    background-color: var(--warning, #f59e0b);
    color: var(--warning-foreground, var(--foreground));
  }

  .shc-alert-warning .shc-alert-title {
    color: var(--warning-foreground, var(--foreground));
  }

  .shc-alert-warning .shc-alert-description {
    color: var(--warning-foreground, var(--foreground));
  }

  /* Info variant */
  .shc-alert-info {
    border-color: var(--info, var(--primary));
    background-color: var(--info, var(--primary));
    color: var(--info-foreground, var(--primary-foreground));
  }

  .shc-alert-info .shc-alert-title {
    color: var(--info-foreground, var(--primary-foreground));
  }

  .shc-alert-info .shc-alert-description {
    color: var(--info-foreground, var(--primary-foreground));
  }
`

/**
 * Alert component definition
 */
export const alertComponent: ComponentDefinition = {
  name: 'alert',
  styles: alertStyles,
}

/**
 * Helper function to generate alert class names
 * @param variant - 'default', 'destructive', 'success', 'warning', or 'info'
 */
export function alert(
  variant: 'default' | 'destructive' | 'success' | 'warning' | 'info' = 'default'
): string {
  return variant === 'default' ? 'shc-alert' : `shc-alert shc-alert-${variant}`
}