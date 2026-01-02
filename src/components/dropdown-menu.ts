/**
 * DropdownMenu Component
 *
 * CSS-only dropdown menu for actions and options.
 * Based on shadcn/ui DropdownMenu but without Radix (uses checkbox hack for Shadow DOM).
 *
 * Useful for: Device overflow actions, context menus, settings dropdowns.
 *
 * @example
 * ```html
 * <div class="shc-dropdown-menu">
 *   <input type="checkbox" id="menu-1" class="shc-dropdown-menu-state" />
 *   <label for="menu-1" class="shc-btn shc-btn-outline">
 *     Options
 *     <ha-icon icon="mdi:chevron-down"></ha-icon>
 *   </label>
 *
 *   <div class="shc-dropdown-menu-content">
 *     <div class="shc-dropdown-menu-item">
 *       <ha-icon icon="mdi:pencil"></ha-icon>
 *       <span>Edit</span>
 *     </div>
 *     <div class="shc-dropdown-menu-item">
 *       <ha-icon icon="mdi:content-copy"></ha-icon>
 *       <span>Duplicate</span>
 *     </div>
 *     <div class="shc-dropdown-menu-separator"></div>
 *     <div class="shc-dropdown-menu-item shc-dropdown-menu-item-destructive">
 *       <ha-icon icon="mdi:delete"></ha-icon>
 *       <span>Delete</span>
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/dropdown-menu
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const dropdownMenuStyles = `
  /* Dropdown container */
  .shc-dropdown-menu {
    position: relative;
    display: inline-block;
  }

  /* Hidden checkbox for state */
  .shc-dropdown-menu-state {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  /* Dropdown content (menu) */
  .shc-dropdown-menu-content {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 50;
    min-width: 12rem;
    margin-top: 0.5rem;
    padding: 0.25rem;
    background-color: var(--popover);
    border: 1px solid var(--border);
    border-radius: var(--radius, 0.375rem);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: opacity 150ms ease, transform 150ms ease, visibility 150ms;
    pointer-events: none;
  }

  /* Show menu when checkbox is checked */
  .shc-dropdown-menu-state:checked ~ .shc-dropdown-menu-content {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
  }

  /* Alignment variants */
  .shc-dropdown-menu-content-end {
    left: auto;
    right: 0;
  }

  .shc-dropdown-menu-content-center {
    left: 50%;
    transform: translateX(-50%) translateY(-8px);
  }

  .shc-dropdown-menu-state:checked ~ .shc-dropdown-menu-content-center {
    transform: translateX(-50%) translateY(0);
  }

  /* Menu item */
  .shc-dropdown-menu-item {
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

  .shc-dropdown-menu-item:hover,
  .shc-dropdown-menu-item:focus {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  /* Destructive item variant */
  .shc-dropdown-menu-item-destructive {
    color: var(--destructive);
  }

  .shc-dropdown-menu-item-destructive:hover,
  .shc-dropdown-menu-item-destructive:focus {
    background-color: var(--destructive);
    color: var(--destructive-foreground);
  }

  /* Disabled item */
  .shc-dropdown-menu-item[aria-disabled="true"] {
    opacity: 0.5;
    pointer-events: none;
  }

  /* Menu separator */
  .shc-dropdown-menu-separator {
    height: 1px;
    margin: 0.25rem 0;
    background-color: var(--border);
  }

  /* Menu label (non-clickable header) */
  .shc-dropdown-menu-label {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Checkbox/Radio item */
  .shc-dropdown-menu-item-indicator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
  }

  /* Icon sizing within menu items */
  .shc-dropdown-menu-item ha-icon {
    --mdc-icon-size: 1rem;
  }

  /* Close menu when clicking outside (JS helper required) */
  .shc-dropdown-menu-backdrop {
    position: fixed;
    inset: 0;
    z-index: 49;
    display: none;
  }

  .shc-dropdown-menu-state:checked ~ .shc-dropdown-menu-backdrop {
    display: block;
  }
`

export const dropdownMenuComponent: ComponentDefinition = {
  name: 'dropdown-menu',
  styles: dropdownMenuStyles,
  description: 'Dropdown menu for actions and options',
}

/**
 * Generate dropdown menu classes
 */
export function dropdownMenu(): string {
  return 'shc-dropdown-menu'
}

export function dropdownMenuContent(align: 'start' | 'center' | 'end' = 'start'): string {
  const classes = ['shc-dropdown-menu-content']
  if (align === 'end') {
    classes.push('shc-dropdown-menu-content-end')
  } else if (align === 'center') {
    classes.push('shc-dropdown-menu-content-center')
  }
  return classes.join(' ')
}

export function dropdownMenuItem(destructive = false): string {
  const classes = ['shc-dropdown-menu-item']
  if (destructive) {
    classes.push('shc-dropdown-menu-item-destructive')
  }
  return classes.join(' ')
}

export function dropdownMenuSeparator(): string {
  return 'shc-dropdown-menu-separator'
}

export function dropdownMenuLabel(): string {
  return 'shc-dropdown-menu-label'
}

/**
 * Initialize dropdown menu with click-outside-to-close behavior
 */
export function initDropdownMenu(container: HTMLElement): () => void {
  const checkbox = container.querySelector<HTMLInputElement>('.shc-dropdown-menu-state')
  const content = container.querySelector('.shc-dropdown-menu-content')

  if (!checkbox || !content) return () => {}

  // Close when clicking outside
  const closeOnOutsideClick = (e: MouseEvent) => {
    if (!content.contains(e.target as Node) && checkbox.checked) {
      checkbox.checked = false
    }
  }

  // Close when clicking a menu item
  const items = content.querySelectorAll('.shc-dropdown-menu-item')
  items.forEach((item) => {
    item.addEventListener('click', () => {
      if (!item.hasAttribute('aria-disabled')) {
        checkbox.checked = false
      }
    })
  })

  // Cleanup
  return () => {
    document.removeEventListener('click', closeOnOutsideClick)
  }
}
