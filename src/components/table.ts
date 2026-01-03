/**
 * Table Component
 *
 * Data table for displaying structured information.
 * Based on shadcn/ui Table with sortable columns support.
 *
 * Useful for: Device inventory, log viewer, entity lists.
 *
 * @example
 * ```html
 * <div class="shc-table-container">
 *   <table class="shc-table">
 *     <thead class="shc-table-header">
 *       <tr>
 *         <th class="shc-table-head">Device</th>
 *         <th class="shc-table-head">Status</th>
 *         <th class="shc-table-head shc-table-head-right">Battery</th>
 *       </tr>
 *     </thead>
 *     <tbody class="shc-table-body">
 *       <tr class="shc-table-row">
 *         <td class="shc-table-cell">Kitchen Sensor</td>
 *         <td class="shc-table-cell"><span class="shc-badge shc-badge-default">Online</span></td>
 *         <td class="shc-table-cell shc-table-cell-right">95%</td>
 *       </tr>
 *     </tbody>
 *   </table>
 * </div>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/table
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const tableStyles = `
  .shc-table-container { width: 100%; overflow-x: auto; border: 1px solid var(--border); border-radius: var(--radius, 0.375rem); }
  .shc-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }

  .shc-table-header { background-color: var(--muted); }
  .shc-table-head { padding: 0.75rem 1rem; text-align: left; font-weight: 600; color: var(--muted-foreground); border-bottom: 1px solid var(--border); }
  .shc-table-head-right { text-align: right; }
  .shc-table-head-center { text-align: center; }

  .shc-table-body { }
  .shc-table-row { transition: background-color 150ms ease; }
  .shc-table-row:hover { background-color: var(--muted); }
  .shc-table-row:not(:last-child) { border-bottom: 1px solid var(--border); }

  .shc-table-cell { padding: 0.75rem 1rem; color: var(--foreground); }
  .shc-table-cell-right { text-align: right; }
  .shc-table-cell-center { text-align: center; }

  /* Sortable header */
  .shc-table-head-sortable { cursor: pointer; user-select: none; }
  .shc-table-head-sortable:hover { background-color: var(--accent); }
  .shc-table-head-sortable::after { content: '⇅'; margin-left: 0.5rem; opacity: 0.3; }
  .shc-table-head-sortable[data-sort="asc"]::after { content: '↑'; opacity: 1; }
  .shc-table-head-sortable[data-sort="desc"]::after { content: '↓'; opacity: 1; }

  /* Striped rows */
  .shc-table-striped .shc-table-row:nth-child(even) { background-color: var(--muted); }

  /* Compact variant */
  .shc-table-compact .shc-table-head,
  .shc-table-compact .shc-table-cell { padding: 0.5rem 0.75rem; }

  /* Empty state */
  .shc-table-empty { padding: 2rem; text-align: center; color: var(--muted-foreground); }
`

export const tableComponent: ComponentDefinition = {
  name: 'table',
  styles: tableStyles,
  description: 'Data table for structured information display',
}

export function initTable(container: HTMLElement): () => void {
  const sortableHeaders = container.querySelectorAll('.shc-table-head-sortable')
  const tbody = container.querySelector('.shc-table-body')

  if (!tbody) return () => {}

  sortableHeaders.forEach((header, index) => {
    header.addEventListener('click', () => {
      const currentSort = header.getAttribute('data-sort')
      const newSort = currentSort === 'asc' ? 'desc' : 'asc'

      // Clear other headers
      sortableHeaders.forEach((h) => h.removeAttribute('data-sort'))
      header.setAttribute('data-sort', newSort)

      // Sort rows
      const rows = Array.from(tbody.querySelectorAll('.shc-table-row'))
      rows.sort((a, b) => {
        const aText = a.querySelectorAll('.shc-table-cell')[index]?.textContent || ''
        const bText = b.querySelectorAll('.shc-table-cell')[index]?.textContent || ''
        return newSort === 'asc' ? aText.localeCompare(bText) : bText.localeCompare(aText)
      })

      rows.forEach((row) => tbody.appendChild(row))
    })
  })

  return () => {}
}
