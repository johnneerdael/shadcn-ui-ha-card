/**
 * Pagination Component
 *
 * Page navigation controls for splitting content across multiple pages.
 * Based on shadcn/ui Pagination.
 *
 * Useful for: Video library, event logs, device inventory tables.
 *
 * @example
 * ```html
 * <nav aria-label="pagination" class="shc-pagination">
 *   <div class="shc-pagination-content">
 *     <button class="shc-pagination-item" disabled>
 *       <ha-icon icon="mdi:chevron-left"></ha-icon>
 *       <span>Previous</span>
 *     </button>
 *
 *     <button class="shc-pagination-item shc-pagination-item-active" aria-current="page">1</button>
 *     <button class="shc-pagination-item">2</button>
 *     <button class="shc-pagination-item">3</button>
 *     <span class="shc-pagination-ellipsis">...</span>
 *     <button class="shc-pagination-item">10</button>
 *
 *     <button class="shc-pagination-item">
 *       <span>Next</span>
 *       <ha-icon icon="mdi:chevron-right"></ha-icon>
 *     </button>
 *   </div>
 * </nav>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/pagination
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const paginationStyles = `
  /* Pagination container */
  .shc-pagination {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  /* Pagination content wrapper */
  .shc-pagination-content {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-wrap: wrap;
  }

  /* Pagination item (button) */
  .shc-pagination-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    min-width: 2.5rem;
    height: 2.5rem;
    padding: 0 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--foreground);
    background-color: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius, 0.375rem);
    cursor: pointer;
    transition: all 150ms ease;
    user-select: none;
  }

  .shc-pagination-item:hover:not(:disabled):not(.shc-pagination-item-active) {
    background-color: var(--muted);
  }

  .shc-pagination-item:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Active page */
  .shc-pagination-item-active {
    background-color: var(--primary);
    color: var(--primary-foreground);
    border-color: var(--primary);
  }

  .shc-pagination-item-active:hover {
    opacity: 0.9;
  }

  /* Ellipsis for skipped pages */
  .shc-pagination-ellipsis {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    color: var(--muted-foreground);
    user-select: none;
  }

  .shc-pagination-ellipsis::before {
    content: '...';
  }

  /* First/Last buttons */
  .shc-pagination-item-first,
  .shc-pagination-item-last {
    gap: 0.5rem;
  }

  /* Icon sizing within pagination buttons */
  .shc-pagination-item ha-icon {
    --mdc-icon-size: 1rem;
  }
`

export const paginationComponent: ComponentDefinition = {
  name: 'pagination',
  styles: paginationStyles,
  description: 'Page navigation controls for multi-page content',
}

/**
 * Generate pagination classes
 */
export function pagination(): string {
  return 'shc-pagination'
}

export function paginationContent(): string {
  return 'shc-pagination-content'
}

export function paginationItem(active = false): string {
  const classes = ['shc-pagination-item']
  if (active) {
    classes.push('shc-pagination-item-active')
  }
  return classes.join(' ')
}

export function paginationEllipsis(): string {
  return 'shc-pagination-ellipsis'
}
