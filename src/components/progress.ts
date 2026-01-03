/**
 * Progress Component
 * 
 * Visual progress indicator that shows completion percentage.
 * 
 * @example
 * ```yaml
 * content: |
 *   <div class="shc-progress">
 *     <div class="shc-progress-indicator" style="transform: translateX(-40%)"></div>
 *   </div>
 * ```
 * 
 * @see https://ui.shadcn.com/docs/components/progress
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const progressStyles = `
  /* Progress container */
  .shc-progress {
    position: relative;
    height: 1rem;
    width: 100%;
    overflow: hidden;
    border-radius: 9999px;
    background-color: var(--secondary);
  }

  /* Progress indicator */
  .shc-progress-indicator {
    height: 100%;
    width: 100%;
    flex: 1 1 0%;
    background-color: var(--primary);
    transition: all 0.3s ease-in-out;
  }

  /* Transform is used to show progress: translateX(-X%) where X = 100 - progress */
  /* Example: 60% progress = translateX(-40%) */
  
  /* Size variants */
  .shc-progress-sm {
    height: 0.5rem;
  }

  .shc-progress-lg {
    height: 1.5rem;
  }

  /* Color variants */
  .shc-progress-success .shc-progress-indicator {
    background-color: var(--success, #22c55e);
  }

  .shc-progress-warning .shc-progress-indicator {
    background-color: var(--warning, #f59e0b);
  }

  .shc-progress-destructive .shc-progress-indicator {
    background-color: var(--destructive);
  }

  /* Indeterminate animation */
  @keyframes shc-progress-indeterminate {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .shc-progress-indeterminate .shc-progress-indicator {
    animation: shc-progress-indeterminate 1.5s ease-in-out infinite;
    width: 50%;
  }
`

/**
 * Progress component definition
 */
export const progressComponent: ComponentDefinition = {
  name: 'progress',
  styles: progressStyles,
}

/**
 * Helper function to generate progress class names
 * @param size - 'default', 'sm', or 'lg'
 * @param variant - 'default', 'success', 'warning', or 'destructive'
 */
export function progress(
  size: 'default' | 'sm' | 'lg' = 'default',
  variant: 'default' | 'success' | 'warning' | 'destructive' = 'default'
): string {
  const baseClass = 'shc-progress'
  const sizeClass = size !== 'default' ? `shc-progress-${size}` : ''
  const variantClass = variant !== 'default' ? `shc-progress-${variant}` : ''
  
  return [baseClass, sizeClass, variantClass].filter(Boolean).join(' ')
}

/**
 * Calculate the transform value for a progress percentage
 * @param percent - Progress percentage (0-100)
 * @returns CSS transform string
 */
export function progressTransform(percent: number): string {
  const clampedPercent = Math.max(0, Math.min(100, percent))
  const translateX = -(100 - clampedPercent)
  return `translateX(${translateX}%)`
}