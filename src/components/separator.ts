/**
 * Separator Component
 * 
 * A visual divider that separates content, available in horizontal and vertical orientations.
 * 
 * @example
 * ```yaml
 * content: |
 *   <div class="shc-separator"></div>
 *   <div class="shc-separator-vertical" style="height: 20px;"></div>
 * ```
 * 
 * @see https://ui.shadcn.com/docs/components/separator
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const separatorStyles = `
  /* Base separator styles */
  .shc-separator {
    flex-shrink: 0;
    background-color: var(--border);
    height: 1px;
    width: 100%;
  }

  /* Horizontal separator (default) */
  .shc-separator-horizontal {
    flex-shrink: 0;
    background-color: var(--border);
    height: 1px;
    width: 100%;
  }

  /* Vertical separator */
  .shc-separator-vertical {
    flex-shrink: 0;
    background-color: var(--border);
    width: 1px;
    height: 100%;
    align-self: stretch;
  }

  /* Decorative variant (non-semantic) */
  .shc-separator[data-orientation="horizontal"] {
    height: 1px;
    width: 100%;
  }

  .shc-separator[data-orientation="vertical"] {
    width: 1px;
    height: 100%;
  }
`

/**
 * Separator component definition
 */
export const separatorComponent: ComponentDefinition = {
  name: 'separator',
  styles: separatorStyles,
}

/**
 * Helper function to generate separator class names
 * @param orientation - 'horizontal' or 'vertical'
 */
export function separator(orientation: 'horizontal' | 'vertical' = 'horizontal'): string {
  return orientation === 'horizontal' ? 'shc-separator-horizontal' : 'shc-separator-vertical'
}