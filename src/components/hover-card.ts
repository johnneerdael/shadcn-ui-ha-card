/**
 * HoverCard Component
 *
 * CSS-only hover card for displaying rich content on hover.
 * Similar to Tooltip but with more space for detailed information.
 * Based on shadcn/ui HoverCard but without Radix dependency (portal-free for Shadow DOM).
 *
 * Great for: Entity previews, user profiles, camera thumbnails on hover.
 *
 * Uses data attributes for positioning:
 * - data-side="top|right|bottom|left" for card position
 * - data-align="start|center|end" for alignment
 *
 * @example
 * ```html
 * <div class="shc-hover-card">
 *   <button class="shc-hover-card-trigger">@user</button>
 *   <div class="shc-hover-card-content" data-side="bottom">
 *     <div class="flex gap-4">
 *       <img class="shc-avatar" src="..." />
 *       <div>
 *         <h4>User Name</h4>
 *         <p>Bio text here...</p>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/hover-card
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const hoverCardStyles = `
  /* HoverCard Container */
  .shc-hover-card {
    position: relative;
    display: inline-flex;
  }

  /* HoverCard Trigger */
  .shc-hover-card-trigger {
    cursor: pointer;
  }

  /* HoverCard Content - Hidden by default */
  .shc-hover-card-content {
    position: absolute;
    z-index: 50;
    width: 16rem;
    padding: 1rem;
    font-size: 0.875rem;
    color: var(--popover-foreground, var(--foreground));
    background-color: var(--popover, var(--background));
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    opacity: 0;
    transform: scale(0.95);
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
    /* Delay before showing (allows accidental hovers to pass) */
    transition-delay: 0.15s;
  }

  /* Show hover card on hover with delay */
  .shc-hover-card:hover .shc-hover-card-content,
  .shc-hover-card:focus-within .shc-hover-card-content {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
    transition-delay: 0.3s;
  }

  /* Hide immediately when leaving */
  .shc-hover-card:not(:hover) .shc-hover-card-content {
    transition-delay: 0.1s;
  }

  /* ===== Positioning by side ===== */

  /* Bottom (default) */
  .shc-hover-card-content,
  .shc-hover-card-content[data-side="bottom"] {
    top: 100%;
    left: 50%;
    transform: translateX(-50%) scale(0.95);
    margin-top: 0.5rem;
  }

  .shc-hover-card:hover .shc-hover-card-content,
  .shc-hover-card:hover .shc-hover-card-content[data-side="bottom"],
  .shc-hover-card:focus-within .shc-hover-card-content,
  .shc-hover-card:focus-within .shc-hover-card-content[data-side="bottom"] {
    transform: translateX(-50%) scale(1);
  }

  /* Top */
  .shc-hover-card-content[data-side="top"] {
    bottom: 100%;
    top: auto;
    left: 50%;
    transform: translateX(-50%) scale(0.95);
    margin-bottom: 0.5rem;
    margin-top: 0;
  }

  .shc-hover-card:hover .shc-hover-card-content[data-side="top"],
  .shc-hover-card:focus-within .shc-hover-card-content[data-side="top"] {
    transform: translateX(-50%) scale(1);
  }

  /* Left */
  .shc-hover-card-content[data-side="left"] {
    top: 50%;
    right: 100%;
    bottom: auto;
    left: auto;
    transform: translateY(-50%) scale(0.95);
    margin-right: 0.5rem;
    margin-top: 0;
  }

  .shc-hover-card:hover .shc-hover-card-content[data-side="left"],
  .shc-hover-card:focus-within .shc-hover-card-content[data-side="left"] {
    transform: translateY(-50%) scale(1);
  }

  /* Right */
  .shc-hover-card-content[data-side="right"] {
    top: 50%;
    left: 100%;
    bottom: auto;
    right: auto;
    transform: translateY(-50%) scale(0.95);
    margin-left: 0.5rem;
    margin-top: 0;
  }

  .shc-hover-card:hover .shc-hover-card-content[data-side="right"],
  .shc-hover-card:focus-within .shc-hover-card-content[data-side="right"] {
    transform: translateY(-50%) scale(1);
  }

  /* ===== Alignment ===== */

  /* Start alignment */
  .shc-hover-card-content[data-align="start"] {
    left: 0;
    transform: translateX(0) scale(0.95);
  }

  .shc-hover-card-content[data-side="top"][data-align="start"],
  .shc-hover-card-content[data-side="bottom"][data-align="start"] {
    left: 0;
    transform: translateX(0) scale(0.95);
  }

  .shc-hover-card:hover .shc-hover-card-content[data-align="start"],
  .shc-hover-card:focus-within .shc-hover-card-content[data-align="start"],
  .shc-hover-card:hover .shc-hover-card-content[data-side="top"][data-align="start"],
  .shc-hover-card:hover .shc-hover-card-content[data-side="bottom"][data-align="start"],
  .shc-hover-card:focus-within .shc-hover-card-content[data-side="top"][data-align="start"],
  .shc-hover-card:focus-within .shc-hover-card-content[data-side="bottom"][data-align="start"] {
    transform: translateX(0) scale(1);
  }

  /* End alignment */
  .shc-hover-card-content[data-align="end"] {
    left: auto;
    right: 0;
    transform: translateX(0) scale(0.95);
  }

  .shc-hover-card-content[data-side="top"][data-align="end"],
  .shc-hover-card-content[data-side="bottom"][data-align="end"] {
    left: auto;
    right: 0;
    transform: translateX(0) scale(0.95);
  }

  .shc-hover-card:hover .shc-hover-card-content[data-align="end"],
  .shc-hover-card:focus-within .shc-hover-card-content[data-align="end"],
  .shc-hover-card:hover .shc-hover-card-content[data-side="top"][data-align="end"],
  .shc-hover-card:hover .shc-hover-card-content[data-side="bottom"][data-align="end"],
  .shc-hover-card:focus-within .shc-hover-card-content[data-side="top"][data-align="end"],
  .shc-hover-card:focus-within .shc-hover-card-content[data-side="bottom"][data-align="end"] {
    transform: translateX(0) scale(1);
  }

  /* ===== Width variants ===== */
  .shc-hover-card-content-sm {
    width: 12rem;
  }

  .shc-hover-card-content-lg {
    width: 20rem;
  }

  .shc-hover-card-content-xl {
    width: 24rem;
  }

  /* ===== No delay variant ===== */
  .shc-hover-card-instant .shc-hover-card-content {
    transition-delay: 0s;
  }

  .shc-hover-card-instant:hover .shc-hover-card-content {
    transition-delay: 0s;
  }
`

/**
 * HoverCard component definition
 */
export const hoverCardComponent: ComponentDefinition = {
  name: 'hover-card',
  styles: hoverCardStyles,
}

/**
 * Helper function to generate hover card container class names
 * @param instant - Show immediately without delay
 */
export function hoverCard(instant = false): string {
  const classes = ['shc-hover-card']

  if (instant) {
    classes.push('shc-hover-card-instant')
  }

  return classes.join(' ')
}

/**
 * Helper function to generate hover card content class names
 * @param size - 'default', 'sm', 'lg', or 'xl'
 */
export function hoverCardContent(size: 'default' | 'sm' | 'lg' | 'xl' = 'default'): string {
  const classes = ['shc-hover-card-content']

  if (size !== 'default') {
    classes.push(`shc-hover-card-content-${size}`)
  }

  return classes.join(' ')
}
