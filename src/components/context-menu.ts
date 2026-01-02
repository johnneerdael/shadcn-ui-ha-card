/**
 * ContextMenu Component
 *
 * Right-click context menu for power users.
 * Based on shadcn/ui ContextMenu (triggered by contextmenu event).
 *
 * Useful for: Power user actions, device cards, table rows.
 *
 * @example
 * ```html
 * <div class="shc-context-menu">
 *   <div class="shc-context-menu-trigger">
 *     Right-click me
 *   </div>
 *
 *   <div class="shc-context-menu-content">
 *     <div class="shc-context-menu-item">
 *       <ha-icon icon="mdi:pencil"></ha-icon>
 *       <span>Edit</span>
 *     </div>
 *     <div class="shc-context-menu-item">
 *       <ha-icon icon="mdi:refresh"></ha-icon>
 *       <span>Refresh</span>
 *     </div>
 *     <div class="shc-context-menu-separator"></div>
 *     <div class="shc-context-menu-item shc-context-menu-item-destructive">
 *       <ha-icon icon="mdi:delete"></ha-icon>
 *       <span>Delete</span>
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/context-menu
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const contextMenuStyles = `
  /* Context menu container */
  .shc-context-menu {
    position: relative;
  }

  /* Trigger area */
  .shc-context-menu-trigger {
    cursor: context-menu;
  }

  /* Context menu content */
  .shc-context-menu-content {
    position: fixed;
    z-index: 50;
    min-width: 12rem;
    padding: 0.25rem;
    background-color: var(--popover);
    border: 1px solid var(--border);
    border-radius: var(--radius, 0.375rem);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    opacity: 0;
    visibility: hidden;
    transform: scale(0.95);
    transition: opacity 150ms ease, transform 150ms ease, visibility 150ms;
    pointer-events: none;
  }

  /* Show menu when active */
  .shc-context-menu-content[data-state="open"] {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
    pointer-events: auto;
  }

  /* Menu item */
  .shc-context-menu-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: var(--popover-foreground);
    border-radius: calc(var(--radius, 0.375rem) - 0.125rem);
    cursor: pointer;
    transition: background-color 150ms ease;
    user-select: none;
    outline: none;
  }

  .shc-context-menu-item:hover,
  .shc-context-menu-item:focus {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  /* Destructive item variant */
  .shc-context-menu-item-destructive {
    color: var(--destructive);
  }

  .shc-context-menu-item-destructive:hover,
  .shc-context-menu-item-destructive:focus {
    background-color: var(--destructive);
    color: var(--destructive-foreground);
  }

  /* Disabled item */
  .shc-context-menu-item[aria-disabled="true"] {
    opacity: 0.5;
    pointer-events: none;
  }

  /* Menu separator */
  .shc-context-menu-separator {
    height: 1px;
    margin: 0.25rem 0;
    background-color: var(--border);
  }

  /* Menu label */
  .shc-context-menu-label {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Submenu indicator */
  .shc-context-menu-item-submenu::after {
    content: '›';
    margin-left: auto;
    font-size: 1.125rem;
  }

  /* Icon sizing */
  .shc-context-menu-item ha-icon {
    --mdc-icon-size: 1rem;
  }

  /* Keyboard shortcut hint */
  .shc-context-menu-shortcut {
    margin-left: auto;
    font-size: 0.75rem;
    color: var(--muted-foreground);
    letter-spacing: 0.05em;
  }
`

export const contextMenuComponent: ComponentDefinition = {
  name: 'context-menu',
  styles: contextMenuStyles,
  description: 'Right-click context menu for power user actions',
}

/**
 * Generate context menu classes
 */
export function contextMenu(): string {
  return 'shc-context-menu'
}

export function contextMenuTrigger(): string {
  return 'shc-context-menu-trigger'
}

export function contextMenuContent(): string {
  return 'shc-context-menu-content'
}

export function contextMenuItem(destructive = false): string {
  const classes = ['shc-context-menu-item']
  if (destructive) {
    classes.push('shc-context-menu-item-destructive')
  }
  return classes.join(' ')
}

export function contextMenuSeparator(): string {
  return 'shc-context-menu-separator'
}

export function contextMenuLabel(): string {
  return 'shc-context-menu-label'
}

export function contextMenuShortcut(): string {
  return 'shc-context-menu-shortcut'
}

/**
 * Initialize context menu with right-click trigger
 */
export function initContextMenu(container: HTMLElement): () => void {
  const trigger = container.querySelector('.shc-context-menu-trigger')
  const content = container.querySelector<HTMLElement>('.shc-context-menu-content')

  if (!trigger || !content) return () => {}

  let isOpen = false

  const open = (x: number, y: number) => {
    // Position menu at cursor
    content.style.left = `${x}px`
    content.style.top = `${y}px`
    content.setAttribute('data-state', 'open')
    isOpen = true

    // Adjust if menu would go off-screen
    setTimeout(() => {
      const rect = content.getBoundingClientRect()
      if (rect.right > window.innerWidth) {
        content.style.left = `${x - rect.width}px`
      }
      if (rect.bottom > window.innerHeight) {
        content.style.top = `${y - rect.height}px`
      }
    }, 0)
  }

  const close = () => {
    content.setAttribute('data-state', 'closed')
    isOpen = false
  }

  // Handle right-click on trigger
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    open(e.clientX, e.clientY)
  }

  // Close on outside click
  const handleOutsideClick = (e: MouseEvent) => {
    if (isOpen && !content.contains(e.target as Node)) {
      close()
    }
  }

  // Close on menu item click
  const items = content.querySelectorAll('.shc-context-menu-item')
  items.forEach((item) => {
    item.addEventListener('click', () => {
      if (!item.hasAttribute('aria-disabled')) {
        close()
      }
    })
  })

  // Close on Escape
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      close()
    }
  }

  trigger.addEventListener('contextmenu', handleContextMenu as EventListener)
  document.addEventListener('click', handleOutsideClick)
  document.addEventListener('keydown', handleEscape)

  // Cleanup
  return () => {
    trigger.removeEventListener('contextmenu', handleContextMenu as EventListener)
    document.removeEventListener('click', handleOutsideClick)
    document.removeEventListener('keydown', handleEscape)
  }
}
