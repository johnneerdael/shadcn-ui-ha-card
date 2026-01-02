/**
 * ToggleGroup Component
 *
 * Group of toggle buttons where one or multiple can be selected.
 * Based on shadcn/ui ToggleGroup (using radio buttons for single, checkboxes for multiple).
 *
 * Useful for: Day-of-week selection, zone cleaning (robot vacuum), view modes.
 *
 * @example
 * ```html
 * <!-- Single selection (radio buttons) -->
 * <div class="shc-toggle-group" role="group">
 *   <input type="radio" name="view" id="view-grid" class="shc-toggle-group-state" checked />
 *   <label for="view-grid" class="shc-toggle-group-item">
 *     <ha-icon icon="mdi:view-grid"></ha-icon>
 *     Grid
 *   </label>
 *
 *   <input type="radio" name="view" id="view-list" class="shc-toggle-group-state" />
 *   <label for="view-list" class="shc-toggle-group-item">
 *     <ha-icon icon="mdi:view-list"></ha-icon>
 *     List
 *   </label>
 * </div>
 *
 * <!-- Multiple selection (checkboxes) -->
 * <div class="shc-toggle-group shc-toggle-group-multiple" role="group">
 *   <input type="checkbox" id="day-mon" class="shc-toggle-group-state" checked />
 *   <label for="day-mon" class="shc-toggle-group-item">Mon</label>
 *
 *   <input type="checkbox" id="day-tue" class="shc-toggle-group-state" />
 *   <label for="day-tue" class="shc-toggle-group-item">Tue</label>
 *
 *   <input type="checkbox" id="day-wed" class="shc-toggle-group-state" checked />
 *   <label for="day-wed" class="shc-toggle-group-item">Wed</label>
 * </div>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/toggle-group
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const toggleGroupStyles = `
  /* Toggle group container */
  .shc-toggle-group {
    display: inline-flex;
    align-items: center;
    gap: 0;
    background-color: var(--muted);
    border-radius: var(--radius, 0.375rem);
    padding: 0.25rem;
  }

  /* Hide radio/checkbox inputs */
  .shc-toggle-group-state {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  /* Toggle item (label acting as button) */
  .shc-toggle-group-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 2.25rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--muted-foreground);
    background-color: transparent;
    border-radius: calc(var(--radius, 0.375rem) - 0.125rem);
    cursor: pointer;
    transition: all 150ms ease;
    user-select: none;
    white-space: nowrap;
  }

  .shc-toggle-group-item:hover {
    background-color: var(--muted-foreground);
    color: var(--background);
    opacity: 0.8;
  }

  /* Active/checked state */
  .shc-toggle-group-state:checked + .shc-toggle-group-item {
    background-color: var(--background);
    color: var(--foreground);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .shc-toggle-group-state:checked + .shc-toggle-group-item:hover {
    opacity: 1;
  }

  /* Disabled state */
  .shc-toggle-group-state:disabled + .shc-toggle-group-item {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Size variants */
  .shc-toggle-group-sm .shc-toggle-group-item {
    min-height: 2rem;
    padding: 0.375rem 0.625rem;
    font-size: 0.8125rem;
  }

  .shc-toggle-group-lg .shc-toggle-group-item {
    min-height: 2.75rem;
    padding: 0.625rem 1rem;
    font-size: 0.9375rem;
  }

  /* Vertical orientation */
  .shc-toggle-group-vertical {
    flex-direction: column;
    align-items: stretch;
  }

  .shc-toggle-group-vertical .shc-toggle-group-item {
    justify-content: flex-start;
  }

  /* Icon sizing within toggle group */
  .shc-toggle-group-item ha-icon {
    --mdc-icon-size: 1rem;
  }
`

export const toggleGroupComponent: ComponentDefinition = {
  name: 'toggle-group',
  styles: toggleGroupStyles,
  description: 'Group of toggleable buttons for single or multiple selection',
}

/**
 * Generate toggle group classes
 */
export function toggleGroup(
  options: {
    size?: 'default' | 'sm' | 'lg'
    vertical?: boolean
    multiple?: boolean
  } = {}
): string {
  const classes = ['shc-toggle-group']

  if (options.size && options.size !== 'default') {
    classes.push(`shc-toggle-group-${options.size}`)
  }

  if (options.vertical) {
    classes.push('shc-toggle-group-vertical')
  }

  if (options.multiple) {
    classes.push('shc-toggle-group-multiple')
  }

  return classes.join(' ')
}

export function toggleGroupItem(): string {
  return 'shc-toggle-group-item'
}
