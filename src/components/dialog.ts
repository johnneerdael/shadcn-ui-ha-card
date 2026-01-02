/**
 * Dialog Component
 *
 * CSS-only dialog/modal for focused interactions within the card.
 * Based on shadcn/ui Dialog but without Radix dependency (portal-free for Shadow DOM).
 *
 * This is an "in-card" dialog - it overlays the card content rather than the entire screen.
 * For full-screen dialogs, use HA's native `hass-more-info` event or Bubble Card pattern.
 *
 * Uses checkbox hack for CSS-only toggle, or data-state with JS controller.
 *
 * @example
 * ```html
 * <!-- CSS-only version -->
 * <div class="shc-dialog">
 *   <input type="checkbox" id="dlg1" class="shc-dialog-state" />
 *   <label for="dlg1" class="shc-btn">Open Dialog</label>
 *   <div class="shc-dialog-overlay">
 *     <label for="dlg1" class="shc-dialog-backdrop"></label>
 *     <div class="shc-dialog-content">
 *       <div class="shc-dialog-header">
 *         <h3 class="shc-dialog-title">Title</h3>
 *         <p class="shc-dialog-description">Description</p>
 *       </div>
 *       <div class="shc-dialog-body">Content here...</div>
 *       <div class="shc-dialog-footer">
 *         <label for="dlg1" class="shc-btn shc-btn-secondary">Cancel</label>
 *         <button class="shc-btn">Confirm</button>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/dialog
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const dialogStyles = `
  /* Dialog Container - Scopes the dialog to its parent */
  .shc-dialog {
    position: relative;
  }

  /* Hidden checkbox for CSS-only toggle */
  .shc-dialog-state {
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

  /* Dialog Trigger */
  .shc-dialog-trigger {
    cursor: pointer;
  }

  /* Dialog Overlay - Covers the card area */
  .shc-dialog-overlay {
    position: absolute;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }

  /* Show overlay when checkbox is checked */
  .shc-dialog-state:checked ~ .shc-dialog-overlay {
    opacity: 1;
    pointer-events: auto;
  }

  /* Show overlay with data-state="open" (JS-controlled) */
  .shc-dialog-overlay[data-state="open"] {
    opacity: 1;
    pointer-events: auto;
  }

  /* Backdrop - Clickable to close */
  .shc-dialog-backdrop {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }

  /* Dialog Content */
  .shc-dialog-content {
    position: relative;
    z-index: 51;
    display: grid;
    gap: 1rem;
    width: calc(100% - 2rem);
    max-width: 28rem;
    max-height: calc(100% - 2rem);
    overflow: auto;
    padding: 1.5rem;
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: scale(0.95);
    transition: transform 0.2s ease;
  }

  .shc-dialog-state:checked ~ .shc-dialog-overlay .shc-dialog-content,
  .shc-dialog-overlay[data-state="open"] .shc-dialog-content {
    transform: scale(1);
  }

  /* Dialog Header */
  .shc-dialog-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  @media (min-width: 640px) {
    .shc-dialog-header {
      text-align: left;
    }
  }

  /* Dialog Title */
  .shc-dialog-title {
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.2;
    color: var(--foreground);
    margin: 0;
  }

  /* Dialog Description */
  .shc-dialog-description {
    font-size: 0.875rem;
    color: var(--muted-foreground);
    margin: 0;
  }

  /* Dialog Body */
  .shc-dialog-body {
    font-size: 0.875rem;
  }

  /* Dialog Footer */
  .shc-dialog-footer {
    display: flex;
    flex-direction: column-reverse;
    gap: 0.5rem;
  }

  @media (min-width: 640px) {
    .shc-dialog-footer {
      flex-direction: row;
      justify-content: flex-end;
    }
  }

  /* Dialog Close Button */
  .shc-dialog-close {
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

  .shc-dialog-close:hover {
    opacity: 1;
  }

  .shc-dialog-close > svg,
  .shc-dialog-close > ha-icon {
    width: 1rem;
    height: 1rem;
    pointer-events: none;
  }

  /* ===== Size variants ===== */
  .shc-dialog-content-sm {
    max-width: 20rem;
  }

  .shc-dialog-content-lg {
    max-width: 36rem;
  }

  .shc-dialog-content-xl {
    max-width: 48rem;
  }

  .shc-dialog-content-full {
    max-width: calc(100% - 2rem);
    width: calc(100% - 2rem);
  }

  /* ===== Full-card variant (fills parent container) ===== */
  .shc-dialog-fullcard .shc-dialog-overlay {
    border-radius: inherit;
  }

  .shc-dialog-fullcard .shc-dialog-backdrop {
    border-radius: inherit;
  }

  .shc-dialog-fullcard .shc-dialog-content {
    max-width: none;
    max-height: none;
    width: calc(100% - 2rem);
    height: auto;
  }
`

/**
 * Dialog component definition
 */
export const dialogComponent: ComponentDefinition = {
  name: 'dialog',
  styles: dialogStyles,
}

/**
 * Helper function to generate dialog container class names
 * @param fullCard - Dialog fills the parent card
 */
export function dialog(fullCard = false): string {
  const classes = ['shc-dialog']

  if (fullCard) {
    classes.push('shc-dialog-fullcard')
  }

  return classes.join(' ')
}

/**
 * Helper function to generate dialog content class names
 * @param size - 'default', 'sm', 'lg', 'xl', or 'full'
 */
export function dialogContent(size: 'default' | 'sm' | 'lg' | 'xl' | 'full' = 'default'): string {
  const classes = ['shc-dialog-content']

  if (size !== 'default') {
    classes.push(`shc-dialog-content-${size}`)
  }

  return classes.join(' ')
}

/**
 * Simple dialog controller for vanilla JS usage
 * Manages open/close state with escape key support
 */
export function initDialog(container: HTMLElement): () => void {
  const triggers = container.querySelectorAll('[data-dialog-trigger]')
  const overlay = container.querySelector('.shc-dialog-overlay')
  const closeButtons = container.querySelectorAll('[data-dialog-close]')

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
  const backdrop = container.querySelector('.shc-dialog-backdrop')
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
