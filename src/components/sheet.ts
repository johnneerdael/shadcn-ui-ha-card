/**
 * Sheet Component
 *
 * CSS-only sheet/drawer for sliding panels within the card.
 * Based on shadcn/ui Sheet but without Radix dependency (portal-free for Shadow DOM).
 *
 * This is an "in-card" sheet - it slides from the card edges rather than screen edges.
 * Great for: Device details, settings panels, mobile-friendly navigation.
 *
 * Uses data-side to determine which edge the sheet slides from.
 *
 * @example
 * ```html
 * <!-- CSS-only version -->
 * <div class="shc-sheet">
 *   <input type="checkbox" id="sheet1" class="shc-sheet-state" />
 *   <label for="sheet1" class="shc-btn">Open Sheet</label>
 *   <div class="shc-sheet-overlay">
 *     <label for="sheet1" class="shc-sheet-backdrop"></label>
 *     <div class="shc-sheet-content" data-side="right">
 *       <div class="shc-sheet-header">
 *         <h3 class="shc-sheet-title">Title</h3>
 *         <p class="shc-sheet-description">Description</p>
 *       </div>
 *       <div class="shc-sheet-body">Content here...</div>
 *       <div class="shc-sheet-footer">
 *         <label for="sheet1" class="shc-btn">Close</label>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/sheet
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const sheetStyles = `
  /* Sheet Container - Scopes the sheet to its parent */
  .shc-sheet {
    position: relative;
  }

  /* Hidden checkbox for CSS-only toggle */
  .shc-sheet-state {
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

  /* Sheet Trigger */
  .shc-sheet-trigger {
    cursor: pointer;
  }

  /* Sheet Overlay - Covers the card area */
  .shc-sheet-overlay {
    position: absolute;
    inset: 0;
    z-index: 50;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    overflow: hidden;
  }

  /* Show overlay when checkbox is checked */
  .shc-sheet-state:checked ~ .shc-sheet-overlay {
    opacity: 1;
    pointer-events: auto;
  }

  /* Show overlay with data-state="open" (JS-controlled) */
  .shc-sheet-overlay[data-state="open"] {
    opacity: 1;
    pointer-events: auto;
  }

  /* Backdrop - Clickable to close */
  .shc-sheet-backdrop {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }

  /* Sheet Content Base */
  .shc-sheet-content {
    position: absolute;
    z-index: 51;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: var(--background);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
  }

  /* ===== Side variants ===== */

  /* Right (default) */
  .shc-sheet-content,
  .shc-sheet-content[data-side="right"] {
    top: 0;
    right: 0;
    bottom: 0;
    width: 75%;
    max-width: 24rem;
    border-left: 1px solid var(--border);
    transform: translateX(100%);
  }

  .shc-sheet-state:checked ~ .shc-sheet-overlay .shc-sheet-content,
  .shc-sheet-state:checked ~ .shc-sheet-overlay .shc-sheet-content[data-side="right"],
  .shc-sheet-overlay[data-state="open"] .shc-sheet-content,
  .shc-sheet-overlay[data-state="open"] .shc-sheet-content[data-side="right"] {
    transform: translateX(0);
  }

  /* Left */
  .shc-sheet-content[data-side="left"] {
    top: 0;
    left: 0;
    right: auto;
    bottom: 0;
    width: 75%;
    max-width: 24rem;
    border-left: none;
    border-right: 1px solid var(--border);
    transform: translateX(-100%);
  }

  .shc-sheet-state:checked ~ .shc-sheet-overlay .shc-sheet-content[data-side="left"],
  .shc-sheet-overlay[data-state="open"] .shc-sheet-content[data-side="left"] {
    transform: translateX(0);
  }

  /* Top */
  .shc-sheet-content[data-side="top"] {
    top: 0;
    left: 0;
    right: 0;
    bottom: auto;
    width: 100%;
    max-width: none;
    height: auto;
    max-height: 50%;
    border-left: none;
    border-bottom: 1px solid var(--border);
    transform: translateY(-100%);
  }

  .shc-sheet-state:checked ~ .shc-sheet-overlay .shc-sheet-content[data-side="top"],
  .shc-sheet-overlay[data-state="open"] .shc-sheet-content[data-side="top"] {
    transform: translateY(0);
  }

  /* Bottom */
  .shc-sheet-content[data-side="bottom"] {
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: none;
    height: auto;
    max-height: 50%;
    border-left: none;
    border-top: 1px solid var(--border);
    transform: translateY(100%);
  }

  .shc-sheet-state:checked ~ .shc-sheet-overlay .shc-sheet-content[data-side="bottom"],
  .shc-sheet-overlay[data-state="open"] .shc-sheet-content[data-side="bottom"] {
    transform: translateY(0);
  }

  /* Sheet Header */
  .shc-sheet-header {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    padding: 1rem;
  }

  /* Sheet Title */
  .shc-sheet-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--foreground);
    margin: 0;
  }

  /* Sheet Description */
  .shc-sheet-description {
    font-size: 0.875rem;
    color: var(--muted-foreground);
    margin: 0;
  }

  /* Sheet Body */
  .shc-sheet-body {
    flex: 1;
    overflow: auto;
    padding: 0 1rem;
    font-size: 0.875rem;
  }

  /* Sheet Footer */
  .shc-sheet-footer {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
  }

  /* Sheet Close Button */
  .shc-sheet-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    border: none;
    background: transparent;
    opacity: 0.7;
    cursor: pointer;
    transition: opacity 0.2s;
    padding: 0;
  }

  .shc-sheet-close:hover {
    opacity: 1;
  }

  .shc-sheet-close > svg,
  .shc-sheet-close > ha-icon {
    width: 1rem;
    height: 1rem;
    pointer-events: none;
  }

  /* ===== Width variants for left/right sheets ===== */
  .shc-sheet-content-sm {
    max-width: 16rem;
  }

  .shc-sheet-content-lg {
    max-width: 32rem;
  }

  .shc-sheet-content-full {
    max-width: 100%;
    width: 100%;
  }

  /* ===== Height variants for top/bottom sheets ===== */
  .shc-sheet-content[data-side="top"].shc-sheet-content-sm,
  .shc-sheet-content[data-side="bottom"].shc-sheet-content-sm {
    max-height: 25%;
  }

  .shc-sheet-content[data-side="top"].shc-sheet-content-lg,
  .shc-sheet-content[data-side="bottom"].shc-sheet-content-lg {
    max-height: 75%;
  }

  .shc-sheet-content[data-side="top"].shc-sheet-content-full,
  .shc-sheet-content[data-side="bottom"].shc-sheet-content-full {
    max-height: 100%;
    height: 100%;
  }
`

/**
 * Sheet component definition
 */
export const sheetComponent: ComponentDefinition = {
  name: 'sheet',
  styles: sheetStyles,
}

/**
 * Helper function to generate sheet container class names
 */
export function sheet(): string {
  return 'shc-sheet'
}

/**
 * Helper function to generate sheet content class names
 * @param size - 'default', 'sm', 'lg', or 'full'
 */
export function sheetContent(size: 'default' | 'sm' | 'lg' | 'full' = 'default'): string {
  const classes = ['shc-sheet-content']

  if (size !== 'default') {
    classes.push(`shc-sheet-content-${size}`)
  }

  return classes.join(' ')
}

/**
 * Simple sheet controller for vanilla JS usage
 * Manages open/close state with escape key and backdrop click support
 */
export function initSheet(container: HTMLElement): () => void {
  const triggers = container.querySelectorAll('[data-sheet-trigger]')
  const overlay = container.querySelector('.shc-sheet-overlay')
  const closeButtons = container.querySelectorAll('[data-sheet-close]')

  if (!overlay) return () => {}

  const open = () => {
    overlay.setAttribute('data-state', 'open')
  }

  const close = () => {
    overlay.setAttribute('data-state', 'closed')
  }

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && overlay.getAttribute('data-state') === 'open') {
      close()
    }
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', open)
  })

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', close)
  })

  // Click on backdrop to close
  const backdrop = container.querySelector('.shc-sheet-backdrop')
  if (backdrop) {
    backdrop.addEventListener('click', close)
  }

  document.addEventListener('keydown', handleEscape)

  // Cleanup function
  return () => {
    triggers.forEach((trigger) => {
      trigger.removeEventListener('click', open)
    })
    closeButtons.forEach((btn) => {
      btn.removeEventListener('click', close)
    })
    if (backdrop) {
      backdrop.removeEventListener('click', close)
    }
    document.removeEventListener('keydown', handleEscape)
  }
}
