/**
 * Drawer Component
 *
 * Mobile-friendly bottom drawer (alias for Sheet with bottom positioning).
 * Based on shadcn/ui Drawer - optimized for mobile pull-up interactions.
 *
 * Useful for: Mobile quick actions, media player controls, "Now Playing" info.
 *
 * @example
 * ```html
 * <div class="shc-drawer">
 *   <input type="checkbox" id="drawer-1" class="shc-drawer-state" />
 *   <label for="drawer-1" class="shc-btn">Open Drawer</label>
 *
 *   <div class="shc-drawer-overlay">
 *     <label for="drawer-1" class="shc-drawer-backdrop"></label>
 *     <div class="shc-drawer-content">
 *       <!-- Drag handle -->
 *       <div class="shc-drawer-handle"></div>
 *
 *       <div class="shc-drawer-header">
 *         <h3 class="shc-drawer-title">Quick Actions</h3>
 *         <p class="shc-drawer-description">Select an action</p>
 *       </div>
 *
 *       <div class="shc-drawer-body">
 *         <!-- Content -->
 *       </div>
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/drawer
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const drawerStyles = `
  /* Drawer container */
  .shc-drawer {
    position: relative;
  }

  /* Hidden checkbox for state */
  .shc-drawer-state {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  /* Drawer overlay (full screen backdrop) */
  .shc-drawer-overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    opacity: 0;
    visibility: hidden;
    transition: opacity 200ms ease, visibility 200ms;
    pointer-events: none;
  }

  .shc-drawer-state:checked ~ .shc-drawer-overlay {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  /* Backdrop */
  .shc-drawer-backdrop {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }

  /* Drawer content (slides from bottom) */
  .shc-drawer-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 90vh;
    background-color: var(--card);
    border-top-left-radius: var(--radius, 0.5rem);
    border-top-right-radius: var(--radius, 0.5rem);
    box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(100%);
    transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1);
    overflow: auto;
  }

  .shc-drawer-state:checked ~ .shc-drawer-overlay .shc-drawer-content {
    transform: translateY(0);
  }

  /* Drag handle (visual indicator) */
  .shc-drawer-handle {
    width: 3rem;
    height: 0.25rem;
    margin: 1rem auto 0.5rem;
    background-color: var(--muted-foreground);
    border-radius: 9999px;
    opacity: 0.5;
  }

  /* Drawer header */
  .shc-drawer-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .shc-drawer-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--card-foreground);
  }

  .shc-drawer-description {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: var(--muted-foreground);
  }

  /* Drawer body */
  .shc-drawer-body {
    padding: 1.5rem;
  }

  /* Drawer footer */
  .shc-drawer-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  /* Size variants */
  .shc-drawer-content-sm {
    max-height: 50vh;
  }

  .shc-drawer-content-lg {
    max-height: 95vh;
  }

  /* Full-height variant */
  .shc-drawer-content-full {
    max-height: 100vh;
    border-radius: 0;
  }
`

export const drawerComponent: ComponentDefinition = {
  name: 'drawer',
  styles: drawerStyles,
  description: 'Mobile-friendly bottom drawer for quick actions',
}

/**
 * Generate drawer classes
 */
export function drawer(): string {
  return 'shc-drawer'
}

export function drawerContent(size: 'default' | 'sm' | 'lg' | 'full' = 'default'): string {
  const classes = ['shc-drawer-content']
  if (size !== 'default') {
    classes.push(`shc-drawer-content-${size}`)
  }
  return classes.join(' ')
}

export function drawerHandle(): string {
  return 'shc-drawer-handle'
}

export function drawerHeader(): string {
  return 'shc-drawer-header'
}

export function drawerTitle(): string {
  return 'shc-drawer-title'
}

export function drawerDescription(): string {
  return 'shc-drawer-description'
}

export function drawerBody(): string {
  return 'shc-drawer-body'
}

export function drawerFooter(): string {
  return 'shc-drawer-footer'
}

/**
 * Initialize drawer with backdrop close
 */
export function initDrawer(container: HTMLElement): () => void {
  const checkbox = container.querySelector<HTMLInputElement>('.shc-drawer-state')
  const backdrop = container.querySelector('.shc-drawer-backdrop')

  if (!checkbox || !backdrop) return () => {}

  const close = () => {
    checkbox.checked = false
  }

  const handleBackdropClick = () => {
    close()
  }

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && checkbox.checked) {
      close()
    }
  }

  backdrop.addEventListener('click', handleBackdropClick)
  document.addEventListener('keydown', handleEscape)

  // Cleanup
  return () => {
    backdrop.removeEventListener('click', handleBackdropClick)
    document.removeEventListener('keydown', handleEscape)
  }
}
