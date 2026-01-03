/**
 * Tabs Component
 *
 * Tab navigation for organizing content into sections.
 * Based on shadcn/ui Tabs with CSS-only styling (no Radix dependency).
 *
 * Uses data attributes for state management:
 * - data-state="active" on triggers and content for active tab
 * - data-slot for styling hooks
 *
 * @example
 * ```html
 * <div class="shc-tabs">
 *   <div class="shc-tabs-list">
 *     <button class="shc-tabs-trigger" data-state="active">Tab 1</button>
 *     <button class="shc-tabs-trigger">Tab 2</button>
 *   </div>
 *   <div class="shc-tabs-content" data-state="active">Content 1</div>
 *   <div class="shc-tabs-content">Content 2</div>
 * </div>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/tabs
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const tabsStyles = `
  /* Tabs Container */
  .shc-tabs {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* Tabs List */
  .shc-tabs-list {
    display: inline-flex;
    height: 2.25rem;
    width: fit-content;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    background-color: var(--muted);
    color: var(--muted-foreground);
    padding: 3px;
  }

  /* Tab Trigger */
  .shc-tabs-trigger {
    display: inline-flex;
    flex: 1;
    height: calc(100% - 1px);
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    white-space: nowrap;
    border-radius: 0.375rem;
    border: 1px solid transparent;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--foreground);
    background: transparent;
    cursor: pointer;
    transition: color 0.2s, box-shadow 0.2s;
    outline: none;
  }

  /* Tab Trigger Hover */
  .shc-tabs-trigger:hover {
    color: var(--foreground);
  }

  /* Tab Trigger Active State */
  .shc-tabs-trigger[data-state="active"] {
    background-color: var(--background);
    color: var(--foreground);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  /* Tab Trigger Focus */
  .shc-tabs-trigger:focus-visible {
    border-color: var(--ring);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ring) 50%, transparent);
    outline: 1px solid var(--ring);
  }

  /* Tab Trigger Disabled */
  .shc-tabs-trigger:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  /* Tab Trigger Icons */
  .shc-tabs-trigger > svg,
  .shc-tabs-trigger > ha-icon {
    width: 1rem;
    height: 1rem;
    pointer-events: none;
    flex-shrink: 0;
  }

  /* Tab Content */
  .shc-tabs-content {
    display: none;
    flex: 1;
    outline: none;
  }

  .shc-tabs-content[data-state="active"] {
    display: block;
  }

  /* Dark mode adjustments */
  @media (prefers-color-scheme: dark) {
    .shc-tabs-trigger[data-state="active"] {
      border-color: var(--input);
      background-color: color-mix(in srgb, var(--input) 30%, transparent);
    }

    .shc-tabs-trigger {
      color: var(--muted-foreground);
    }

    .shc-tabs-trigger[data-state="active"] {
      color: var(--foreground);
    }
  }

  /* Full width variant */
  .shc-tabs-list-full {
    width: 100%;
  }

  .shc-tabs-list-full .shc-tabs-trigger {
    flex: 1;
  }

  /* Vertical tabs variant */
  .shc-tabs-vertical {
    flex-direction: row;
  }

  .shc-tabs-vertical .shc-tabs-list {
    flex-direction: column;
    height: auto;
    width: auto;
  }

  .shc-tabs-vertical .shc-tabs-trigger {
    width: 100%;
    justify-content: flex-start;
  }

  .shc-tabs-vertical .shc-tabs-content {
    flex: 1;
    padding-left: 0.5rem;
  }
`

/**
 * Tabs component definition
 */
export const tabsComponent: ComponentDefinition = {
  name: 'tabs',
  styles: tabsStyles,
}

/**
 * Helper function to generate tabs class names
 * @param variant - 'default' or 'vertical'
 * @param fullWidth - whether tabs should take full width
 */
export function tabs(
  variant: 'default' | 'vertical' = 'default',
  _fullWidth = false
): string {
  const classes = ['shc-tabs']

  if (variant === 'vertical') {
    classes.push('shc-tabs-vertical')
  }

  return classes.join(' ')
}

/**
 * Helper function for tabs list classes
 */
export function tabsList(fullWidth = false): string {
  const classes = ['shc-tabs-list']

  if (fullWidth) {
    classes.push('shc-tabs-list-full')
  }

  return classes.join(' ')
}

/**
 * Simple tabs controller for vanilla JS usage
 * Manages active state across triggers and content
 */
export function initTabs(container: HTMLElement): void {
  const triggers = container.querySelectorAll('.shc-tabs-trigger')
  const contents = container.querySelectorAll('.shc-tabs-content')

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => {
      // Deactivate all
      triggers.forEach((t) => t.setAttribute('data-state', 'inactive'))
      contents.forEach((c) => c.setAttribute('data-state', 'inactive'))

      // Activate clicked
      trigger.setAttribute('data-state', 'active')
      if (contents[index]) {
        contents[index].setAttribute('data-state', 'active')
      }
    })
  })
}
