/**
 * AlertDialog Component
 *
 * CSS-only alert dialog for confirmation actions within the card.
 * Based on shadcn/ui AlertDialog but without Radix dependency (portal-free for Shadow DOM).
 *
 * Similar to Dialog but specifically for confirmations with Cancel/Action button pattern.
 * Great for: "Are you sure?" confirmations, destructive action warnings.
 *
 * @example
 * ```html
 * <!-- CSS-only version -->
 * <div class="shc-alert-dialog">
 *   <input type="checkbox" id="alert1" class="shc-alert-dialog-state" />
 *   <label for="alert1" class="shc-btn shc-btn-destructive">Delete</label>
 *   <div class="shc-alert-dialog-overlay">
 *     <div class="shc-alert-dialog-backdrop"></div>
 *     <div class="shc-alert-dialog-content">
 *       <div class="shc-alert-dialog-header">
 *         <h3 class="shc-alert-dialog-title">Are you sure?</h3>
 *         <p class="shc-alert-dialog-description">This action cannot be undone.</p>
 *       </div>
 *       <div class="shc-alert-dialog-footer">
 *         <label for="alert1" class="shc-btn shc-btn-outline">Cancel</label>
 *         <button class="shc-btn shc-btn-destructive">Delete</button>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/alert-dialog
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const alertDialogStyles = `
  /* AlertDialog Container - Scopes the dialog to its parent */
  .shc-alert-dialog {
    position: relative;
  }

  /* Hidden checkbox for CSS-only toggle */
  .shc-alert-dialog-state {
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

  /* AlertDialog Trigger */
  .shc-alert-dialog-trigger {
    cursor: pointer;
  }

  /* AlertDialog Overlay - Covers the card area */
  .shc-alert-dialog-overlay {
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
  .shc-alert-dialog-state:checked ~ .shc-alert-dialog-overlay {
    opacity: 1;
    pointer-events: auto;
  }

  /* Show overlay with data-state="open" (JS-controlled) */
  .shc-alert-dialog-overlay[data-state="open"] {
    opacity: 1;
    pointer-events: auto;
  }

  /* Backdrop - NOT clickable (unlike regular Dialog) */
  .shc-alert-dialog-backdrop {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  /* AlertDialog Content */
  .shc-alert-dialog-content {
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

  .shc-alert-dialog-state:checked ~ .shc-alert-dialog-overlay .shc-alert-dialog-content,
  .shc-alert-dialog-overlay[data-state="open"] .shc-alert-dialog-content {
    transform: scale(1);
  }

  /* AlertDialog Header */
  .shc-alert-dialog-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  @media (min-width: 640px) {
    .shc-alert-dialog-header {
      text-align: left;
    }
  }

  /* AlertDialog Title */
  .shc-alert-dialog-title {
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.2;
    color: var(--foreground);
    margin: 0;
  }

  /* AlertDialog Description */
  .shc-alert-dialog-description {
    font-size: 0.875rem;
    color: var(--muted-foreground);
    margin: 0;
  }

  /* AlertDialog Footer - Action buttons */
  .shc-alert-dialog-footer {
    display: flex;
    flex-direction: column-reverse;
    gap: 0.5rem;
  }

  @media (min-width: 640px) {
    .shc-alert-dialog-footer {
      flex-direction: row;
      justify-content: flex-end;
    }
  }

  /* AlertDialog Action Button (primary action - e.g., Delete) */
  .shc-alert-dialog-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    white-space: nowrap;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    height: 2.25rem;
    padding: 0 1rem;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
    border: none;
    background-color: var(--primary);
    color: var(--primary-foreground);
  }

  .shc-alert-dialog-action:hover {
    opacity: 0.9;
  }

  /* Destructive action variant */
  .shc-alert-dialog-action-destructive {
    background-color: var(--destructive);
    color: var(--destructive-foreground);
  }

  /* AlertDialog Cancel Button */
  .shc-alert-dialog-cancel {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    white-space: nowrap;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    height: 2.25rem;
    padding: 0 1rem;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
    border: 1px solid var(--input);
    background-color: var(--background);
    color: var(--foreground);
  }

  .shc-alert-dialog-cancel:hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  /* ===== Size variants ===== */
  .shc-alert-dialog-content-sm {
    max-width: 20rem;
  }

  .shc-alert-dialog-content-lg {
    max-width: 36rem;
  }

  /* ===== Icon variant (for warning/error icons) ===== */
  .shc-alert-dialog-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    margin: 0 auto 0.5rem;
    border-radius: 50%;
    background-color: var(--destructive);
    color: var(--destructive-foreground);
  }

  .shc-alert-dialog-icon > svg,
  .shc-alert-dialog-icon > ha-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .shc-alert-dialog-icon-warning {
    background-color: var(--warning, #f59e0b);
    color: var(--warning-foreground, white);
  }
`

/**
 * AlertDialog component definition
 */
export const alertDialogComponent: ComponentDefinition = {
  name: 'alert-dialog',
  styles: alertDialogStyles,
}

/**
 * Helper function to generate alert dialog container class names
 */
export function alertDialog(): string {
  return 'shc-alert-dialog'
}

/**
 * Helper function to generate alert dialog content class names
 * @param size - 'default', 'sm', or 'lg'
 */
export function alertDialogContent(size: 'default' | 'sm' | 'lg' = 'default'): string {
  const classes = ['shc-alert-dialog-content']

  if (size !== 'default') {
    classes.push(`shc-alert-dialog-content-${size}`)
  }

  return classes.join(' ')
}

/**
 * Simple alert dialog controller for vanilla JS usage
 * Manages open/close state - does NOT close on backdrop click (intentional)
 */
export function initAlertDialog(container: HTMLElement): () => void {
  const triggers = container.querySelectorAll('[data-alert-dialog-trigger]')
  const overlay = container.querySelector('.shc-alert-dialog-overlay')
  const cancelButtons = container.querySelectorAll('[data-alert-dialog-cancel]')
  const actionButtons = container.querySelectorAll('[data-alert-dialog-action]')

  if (!overlay) return () => {}

  const open = () => {
    overlay.setAttribute('data-state', 'open')
  }

  const close = () => {
    overlay.setAttribute('data-state', 'closed')
  }

  // NOTE: AlertDialog should NOT close on escape by default (requires explicit action)
  // But we can add it as optional behavior

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', open)
  })

  cancelButtons.forEach((btn) => {
    btn.addEventListener('click', close)
  })

  // Action buttons also close the dialog (after performing action)
  actionButtons.forEach((btn) => {
    btn.addEventListener('click', close)
  })

  // Cleanup function
  return () => {
    triggers.forEach((trigger) => {
      trigger.removeEventListener('click', open)
    })
    cancelButtons.forEach((btn) => {
      btn.removeEventListener('click', close)
    })
    actionButtons.forEach((btn) => {
      btn.removeEventListener('click', close)
    })
  }
}
