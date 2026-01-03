/**
 * Breadcrumb Component
 *
 * Navigation breadcrumb trail showing current location in hierarchy.
 * Based on shadcn/ui Breadcrumb.
 *
 * Useful for: Multi-level navigation (Home > Floor > Room), settings paths.
 *
 * @example
 * ```html
 * <nav aria-label="breadcrumb" class="shc-breadcrumb">
 *   <ol class="shc-breadcrumb-list">
 *     <li class="shc-breadcrumb-item">
 *       <a href="#" class="shc-breadcrumb-link">Home</a>
 *     </li>
 *     <li class="shc-breadcrumb-separator" aria-hidden="true">/</li>
 *     <li class="shc-breadcrumb-item">
 *       <a href="#" class="shc-breadcrumb-link">Second Floor</a>
 *     </li>
 *     <li class="shc-breadcrumb-separator" aria-hidden="true">/</li>
 *     <li class="shc-breadcrumb-item">
 *       <span class="shc-breadcrumb-page" aria-current="page">Bedroom</span>
 *     </li>
 *   </ol>
 * </nav>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/breadcrumb
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const breadcrumbStyles = `
  /* Breadcrumb container */
  .shc-breadcrumb {
    display: inline-flex;
  }

  /* Breadcrumb list */
  .shc-breadcrumb-list {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
  }

  /* Breadcrumb item */
  .shc-breadcrumb-item {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Breadcrumb link */
  .shc-breadcrumb-link {
    color: var(--muted-foreground);
    font-size: 0.875rem;
    font-weight: 400;
    text-decoration: none;
    transition: color 150ms ease;
  }

  .shc-breadcrumb-link:hover {
    color: var(--foreground);
  }

  /* Current page (non-link) */
  .shc-breadcrumb-page {
    color: var(--foreground);
    font-size: 0.875rem;
    font-weight: 500;
  }

  /* Separator */
  .shc-breadcrumb-separator {
    color: var(--muted-foreground);
    font-size: 0.875rem;
    user-select: none;
  }

  /* Ellipsis for collapsed breadcrumbs */
  .shc-breadcrumb-ellipsis {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    color: var(--muted-foreground);
  }

  .shc-breadcrumb-ellipsis::before {
    content: '...';
  }
`

export const breadcrumbComponent: ComponentDefinition = {
  name: 'breadcrumb',
  styles: breadcrumbStyles,
  description: 'Navigation breadcrumb for hierarchical location display',
}

/**
 * Generate breadcrumb classes
 */
export function breadcrumb(): string {
  return 'shc-breadcrumb'
}

export function breadcrumbList(): string {
  return 'shc-breadcrumb-list'
}

export function breadcrumbItem(): string {
  return 'shc-breadcrumb-item'
}

export function breadcrumbLink(): string {
  return 'shc-breadcrumb-link'
}

export function breadcrumbPage(): string {
  return 'shc-breadcrumb-page'
}

export function breadcrumbSeparator(): string {
  return 'shc-breadcrumb-separator'
}
