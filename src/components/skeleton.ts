/**
 * Skeleton Component
 * 
 * Loading placeholder component that displays an animated pulse effect
 * to indicate content is being loaded.
 * 
 * @example
 * ```yaml
 * content: |
 *   <div class="flex flex-col gap-2">
 *     <div class="shc-skeleton" style="height: 20px; width: 100%;"></div>
 *     <div class="shc-skeleton" style="height: 20px; width: 80%;"></div>
 *     <div class="shc-skeleton shc-skeleton-circle" style="height: 40px; width: 40px;"></div>
 *   </div>
 * ```
 * 
 * @see https://ui.shadcn.com/docs/components/skeleton
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const skeletonStyles = `
  /* Skeleton animation */
  @keyframes shc-skeleton-pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Base skeleton styles */
  .shc-skeleton {
    display: block;
    background-color: var(--muted);
    border-radius: var(--radius, 0.5rem);
    animation: shc-skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    position: relative;
    overflow: hidden;
  }

  /* Default size if not specified */
  .shc-skeleton:not([style*="height"]) {
    height: 1rem;
  }

  .shc-skeleton:not([style*="width"]) {
    width: 100%;
  }

  /* Circle variant for avatars */
  .shc-skeleton-circle {
    border-radius: 9999px;
  }

  /* Rectangle variant (explicit) */
  .shc-skeleton-rect {
    border-radius: var(--radius, 0.5rem);
  }

  /* Text line variant */
  .shc-skeleton-text {
    height: 0.875rem;
    border-radius: 0.25rem;
  }

  /* Disable animation variant */
  .shc-skeleton-static {
    animation: none;
  }
`

/**
 * Skeleton component definition
 */
export const skeletonComponent: ComponentDefinition = {
  name: 'skeleton',
  styles: skeletonStyles,
}

/**
 * Helper function to generate skeleton class names
 * @param variant - 'default', 'circle', 'text', or 'rect'
 * @param animated - Whether to show animation (default: true)
 */
export function skeleton(
  variant: 'default' | 'circle' | 'text' | 'rect' = 'default',
  animated: boolean = true
): string {
  const baseClass = 'shc-skeleton'
  const variantClass = variant !== 'default' ? `shc-skeleton-${variant}` : ''
  const animationClass = !animated ? 'shc-skeleton-static' : ''
  
  return [baseClass, variantClass, animationClass].filter(Boolean).join(' ')
}