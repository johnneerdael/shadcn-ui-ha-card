/**
 * Tooltip Component
 *
 * CSS-only tooltip for displaying contextual information on hover.
 * Based on shadcn/ui Tooltip but without Radix dependency (portal-free for Shadow DOM).
 *
 * Uses data attributes for positioning:
 * - data-side="top|right|bottom|left" for tooltip position
 *
 * @example
 * ```html
 * <span class="shc-tooltip">
 *   <button class="shc-tooltip-trigger">Hover me</button>
 *   <span class="shc-tooltip-content" data-side="top">Tooltip text</span>
 * </span>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/tooltip
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const tooltipStyles = `
  /* Tooltip Container - Inline wrapper for positioning context */
  .shc-tooltip {
    position: relative;
    display: inline-flex;
  }

  /* Tooltip Trigger */
  .shc-tooltip-trigger {
    cursor: pointer;
  }

  /* Tooltip Content - Hidden by default */
  .shc-tooltip-content {
    position: absolute;
    z-index: 50;
    width: max-content;
    max-width: 20rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    line-height: 1.4;
    text-align: center;
    color: var(--background);
    background-color: var(--foreground);
    border-radius: 0.375rem;
    pointer-events: none;
    opacity: 0;
    transform: scale(0.95);
    transition: opacity 0.15s ease, transform 0.15s ease;
  }

  /* Show tooltip on hover */
  .shc-tooltip:hover .shc-tooltip-content,
  .shc-tooltip:focus-within .shc-tooltip-content,
  .shc-tooltip-trigger:focus + .shc-tooltip-content {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }

  /* ===== Positioning by side ===== */

  /* Top (default) */
  .shc-tooltip-content,
  .shc-tooltip-content[data-side="top"] {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) scale(0.95);
    margin-bottom: 0.5rem;
  }

  .shc-tooltip:hover .shc-tooltip-content,
  .shc-tooltip:hover .shc-tooltip-content[data-side="top"],
  .shc-tooltip:focus-within .shc-tooltip-content,
  .shc-tooltip:focus-within .shc-tooltip-content[data-side="top"] {
    transform: translateX(-50%) scale(1);
  }

  /* Bottom */
  .shc-tooltip-content[data-side="bottom"] {
    top: 100%;
    bottom: auto;
    left: 50%;
    transform: translateX(-50%) scale(0.95);
    margin-top: 0.5rem;
    margin-bottom: 0;
  }

  .shc-tooltip:hover .shc-tooltip-content[data-side="bottom"],
  .shc-tooltip:focus-within .shc-tooltip-content[data-side="bottom"] {
    transform: translateX(-50%) scale(1);
  }

  /* Left */
  .shc-tooltip-content[data-side="left"] {
    top: 50%;
    right: 100%;
    bottom: auto;
    left: auto;
    transform: translateY(-50%) scale(0.95);
    margin-right: 0.5rem;
    margin-bottom: 0;
  }

  .shc-tooltip:hover .shc-tooltip-content[data-side="left"],
  .shc-tooltip:focus-within .shc-tooltip-content[data-side="left"] {
    transform: translateY(-50%) scale(1);
  }

  /* Right */
  .shc-tooltip-content[data-side="right"] {
    top: 50%;
    left: 100%;
    bottom: auto;
    right: auto;
    transform: translateY(-50%) scale(0.95);
    margin-left: 0.5rem;
    margin-bottom: 0;
  }

  .shc-tooltip:hover .shc-tooltip-content[data-side="right"],
  .shc-tooltip:focus-within .shc-tooltip-content[data-side="right"] {
    transform: translateY(-50%) scale(1);
  }

  /* ===== Arrow ===== */
  .shc-tooltip-arrow {
    position: absolute;
    width: 0.625rem;
    height: 0.625rem;
    background-color: var(--foreground);
    transform: rotate(45deg);
    border-radius: 2px;
  }

  /* Arrow positioning for top */
  .shc-tooltip-content .shc-tooltip-arrow,
  .shc-tooltip-content[data-side="top"] .shc-tooltip-arrow {
    bottom: -0.3125rem;
    left: 50%;
    margin-left: -0.3125rem;
  }

  /* Arrow positioning for bottom */
  .shc-tooltip-content[data-side="bottom"] .shc-tooltip-arrow {
    top: -0.3125rem;
    bottom: auto;
    left: 50%;
    margin-left: -0.3125rem;
  }

  /* Arrow positioning for left */
  .shc-tooltip-content[data-side="left"] .shc-tooltip-arrow {
    top: 50%;
    right: -0.3125rem;
    bottom: auto;
    left: auto;
    margin-top: -0.3125rem;
    margin-left: 0;
  }

  /* Arrow positioning for right */
  .shc-tooltip-content[data-side="right"] .shc-tooltip-arrow {
    top: 50%;
    left: -0.3125rem;
    right: auto;
    bottom: auto;
    margin-top: -0.3125rem;
    margin-left: 0;
  }

  /* ===== Variants ===== */

  /* Delay variant - longer hover before showing */
  .shc-tooltip-delayed .shc-tooltip-content {
    transition-delay: 0.3s;
  }

  .shc-tooltip-delayed:hover .shc-tooltip-content {
    transition-delay: 0s;
  }

  /* No arrow variant */
  .shc-tooltip-no-arrow .shc-tooltip-arrow {
    display: none;
  }
`

/**
 * Tooltip component definition
 */
export const tooltipComponent: ComponentDefinition = {
  name: 'tooltip',
  styles: tooltipStyles,
}

/**
 * Helper function to generate tooltip container class names
 * @param options - Configuration options
 */
export function tooltip(options: {
  delayed?: boolean
  noArrow?: boolean
} = {}): string {
  const classes = ['shc-tooltip']

  if (options.delayed) {
    classes.push('shc-tooltip-delayed')
  }

  if (options.noArrow) {
    classes.push('shc-tooltip-no-arrow')
  }

  return classes.join(' ')
}

/**
 * Helper function to generate tooltip content class names
 * @param _side - Which side to show the tooltip (applied via data-side attribute)
 */
export function tooltipContent(_side: 'top' | 'right' | 'bottom' | 'left' = 'top'): string {
  return `shc-tooltip-content`
}

/**
 * Returns the data-side attribute value
 */
export function tooltipSide(side: 'top' | 'right' | 'bottom' | 'left'): string {
  return side
}
