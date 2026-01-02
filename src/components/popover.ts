/**
 * Popover Component
 *
 * CSS-only popover for displaying interactive content on click.
 * Based on shadcn/ui Popover but without Radix dependency (portal-free for Shadow DOM).
 *
 * Uses checkbox hack for click-to-toggle behavior (CSS-only, no JS required).
 * Can also use data-state attribute with JS controller for more control.
 *
 * Uses data attributes for positioning:
 * - data-side="top|right|bottom|left" for popover position
 * - data-align="start|center|end" for alignment
 * - data-state="open|closed" for visibility
 *
 * @example
 * ```html
 * <!-- CSS-only version using checkbox hack -->
 * <div class="shc-popover">
 *   <input type="checkbox" id="pop1" class="shc-popover-state" />
 *   <label for="pop1" class="shc-popover-trigger shc-btn">Open</label>
 *   <div class="shc-popover-content" data-side="bottom">
 *     <h4>Title</h4>
 *     <p>Content here...</p>
 *   </div>
 * </div>
 *
 * <!-- JS-controlled version -->
 * <div class="shc-popover">
 *   <button class="shc-popover-trigger shc-btn">Open</button>
 *   <div class="shc-popover-content" data-state="closed" data-side="bottom">
 *     <h4>Title</h4>
 *     <p>Content here...</p>
 *   </div>
 * </div>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/popover
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const popoverStyles = `
  /* Popover Container */
  .shc-popover {
    position: relative;
    display: inline-flex;
  }

  /* Hidden checkbox for CSS-only toggle */
  .shc-popover-state {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Popover Trigger */
  .shc-popover-trigger {
    cursor: pointer;
  }

  /* Popover Content - Hidden by default */
  .shc-popover-content {
    position: absolute;
    z-index: 50;
    width: 18rem;
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
    transition: opacity 0.15s ease, transform 0.15s ease;
  }

  /* Show popover when checkbox is checked (CSS-only) */
  .shc-popover-state:checked ~ .shc-popover-content {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }

  /* Show popover with data-state="open" (JS-controlled) */
  .shc-popover-content[data-state="open"] {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }

  /* ===== Positioning by side ===== */

  /* Bottom (default) */
  .shc-popover-content,
  .shc-popover-content[data-side="bottom"] {
    top: 100%;
    left: 50%;
    transform: translateX(-50%) scale(0.95);
    margin-top: 0.5rem;
  }

  .shc-popover-state:checked ~ .shc-popover-content,
  .shc-popover-state:checked ~ .shc-popover-content[data-side="bottom"],
  .shc-popover-content[data-state="open"],
  .shc-popover-content[data-state="open"][data-side="bottom"] {
    transform: translateX(-50%) scale(1);
  }

  /* Top */
  .shc-popover-content[data-side="top"] {
    bottom: 100%;
    top: auto;
    left: 50%;
    transform: translateX(-50%) scale(0.95);
    margin-bottom: 0.5rem;
    margin-top: 0;
  }

  .shc-popover-state:checked ~ .shc-popover-content[data-side="top"],
  .shc-popover-content[data-state="open"][data-side="top"] {
    transform: translateX(-50%) scale(1);
  }

  /* Left */
  .shc-popover-content[data-side="left"] {
    top: 50%;
    right: 100%;
    bottom: auto;
    left: auto;
    transform: translateY(-50%) scale(0.95);
    margin-right: 0.5rem;
    margin-top: 0;
  }

  .shc-popover-state:checked ~ .shc-popover-content[data-side="left"],
  .shc-popover-content[data-state="open"][data-side="left"] {
    transform: translateY(-50%) scale(1);
  }

  /* Right */
  .shc-popover-content[data-side="right"] {
    top: 50%;
    left: 100%;
    bottom: auto;
    right: auto;
    transform: translateY(-50%) scale(0.95);
    margin-left: 0.5rem;
    margin-top: 0;
  }

  .shc-popover-state:checked ~ .shc-popover-content[data-side="right"],
  .shc-popover-content[data-state="open"][data-side="right"] {
    transform: translateY(-50%) scale(1);
  }

  /* ===== Alignment ===== */

  /* Start alignment */
  .shc-popover-content[data-align="start"] {
    left: 0;
    transform: translateX(0) scale(0.95);
  }

  .shc-popover-content[data-side="top"][data-align="start"],
  .shc-popover-content[data-side="bottom"][data-align="start"] {
    left: 0;
    transform: translateX(0) scale(0.95);
  }

  .shc-popover-state:checked ~ .shc-popover-content[data-align="start"],
  .shc-popover-content[data-state="open"][data-align="start"],
  .shc-popover-state:checked ~ .shc-popover-content[data-side="top"][data-align="start"],
  .shc-popover-state:checked ~ .shc-popover-content[data-side="bottom"][data-align="start"],
  .shc-popover-content[data-state="open"][data-side="top"][data-align="start"],
  .shc-popover-content[data-state="open"][data-side="bottom"][data-align="start"] {
    transform: translateX(0) scale(1);
  }

  /* End alignment */
  .shc-popover-content[data-align="end"] {
    left: auto;
    right: 0;
    transform: translateX(0) scale(0.95);
  }

  .shc-popover-content[data-side="top"][data-align="end"],
  .shc-popover-content[data-side="bottom"][data-align="end"] {
    left: auto;
    right: 0;
    transform: translateX(0) scale(0.95);
  }

  .shc-popover-state:checked ~ .shc-popover-content[data-align="end"],
  .shc-popover-content[data-state="open"][data-align="end"],
  .shc-popover-state:checked ~ .shc-popover-content[data-side="top"][data-align="end"],
  .shc-popover-state:checked ~ .shc-popover-content[data-side="bottom"][data-align="end"],
  .shc-popover-content[data-state="open"][data-side="top"][data-align="end"],
  .shc-popover-content[data-state="open"][data-side="bottom"][data-align="end"] {
    transform: translateX(0) scale(1);
  }

  /* ===== Backdrop for click-outside-to-close ===== */
  .shc-popover-backdrop {
    position: fixed;
    inset: 0;
    z-index: 49;
    display: none;
  }

  .shc-popover-state:checked ~ .shc-popover-backdrop {
    display: block;
  }

  /* ===== Close button ===== */
  .shc-popover-close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    opacity: 0.7;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .shc-popover-close:hover {
    opacity: 1;
  }

  /* ===== Width variants ===== */
  .shc-popover-content-sm {
    width: 12rem;
  }

  .shc-popover-content-lg {
    width: 24rem;
  }

  .shc-popover-content-auto {
    width: auto;
    min-width: 12rem;
    max-width: 24rem;
  }
`

/**
 * Popover component definition
 */
export const popoverComponent: ComponentDefinition = {
  name: 'popover',
  styles: popoverStyles,
}

/**
 * Helper function to generate popover container class names
 */
export function popover(): string {
  return 'shc-popover'
}

/**
 * Helper function to generate popover content class names
 * @param size - 'default', 'sm', 'lg', or 'auto'
 */
export function popoverContent(size: 'default' | 'sm' | 'lg' | 'auto' = 'default'): string {
  const classes = ['shc-popover-content']

  if (size !== 'default') {
    classes.push(`shc-popover-content-${size}`)
  }

  return classes.join(' ')
}

/**
 * Simple popover controller for vanilla JS usage
 * Manages open/close state with click-outside-to-close
 */
export function initPopover(container: HTMLElement): () => void {
  const trigger = container.querySelector('.shc-popover-trigger')
  const content = container.querySelector('.shc-popover-content')

  if (!trigger || !content) return () => {}

  const open = () => {
    content.setAttribute('data-state', 'open')
  }

  const close = () => {
    content.setAttribute('data-state', 'closed')
  }

  const toggle = () => {
    const isOpen = content.getAttribute('data-state') === 'open'
    if (isOpen) {
      close()
    } else {
      open()
    }
  }

  const handleClickOutside = (e: Event) => {
    const target = e.target as Node
    if (!container.contains(target)) {
      close()
    }
  }

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close()
    }
  }

  trigger.addEventListener('click', toggle)
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)

  // Cleanup function
  return () => {
    trigger.removeEventListener('click', toggle)
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscape)
  }
}
