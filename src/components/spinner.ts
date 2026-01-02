/**
 * Spinner Component
 *
 * Loading indicator with CSS-only animation.
 * Useful for: Loading states, data fetching, pending operations.
 *
 * @example
 * ```html
 * <!-- Default spinner -->
 * <div class="shc-spinner"></div>
 *
 * <!-- Small spinner -->
 * <div class="shc-spinner shc-spinner-sm"></div>
 *
 * <!-- Large spinner -->
 * <div class="shc-spinner shc-spinner-lg"></div>
 *
 * <!-- With text -->
 * <div style="display: flex; align-items: center; gap: 8px;">
 *   <div class="shc-spinner shc-spinner-sm"></div>
 *   <span>Loading...</span>
 * </div>
 * ```
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const spinnerStyles = `
  /* Base spinner */
  .shc-spinner {
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid var(--muted);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: shc-spin 0.75s linear infinite;
  }

  /* Size variants */
  .shc-spinner-sm {
    width: 1rem;
    height: 1rem;
    border-width: 1.5px;
  }

  .shc-spinner-lg {
    width: 2rem;
    height: 2rem;
    border-width: 3px;
  }

  /* Animation */
  @keyframes shc-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Full-page centered spinner */
  .shc-spinner-fullpage {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
  }
`

export const spinnerComponent: ComponentDefinition = {
  name: 'spinner',
  styles: spinnerStyles,
  description: 'Loading indicator with animated spinner',
}

/**
 * Generate spinner classes
 */
export function spinner(size: 'default' | 'sm' | 'lg' = 'default', centered = false): string {
  const classes = ['shc-spinner']

  if (size !== 'default') {
    classes.push(`shc-spinner-${size}`)
  }

  if (centered) {
    classes.push('shc-spinner-fullpage')
  }

  return classes.join(' ')
}
