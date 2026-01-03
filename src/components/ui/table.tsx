import { ComponentChildren } from 'preact'
import { useState } from 'preact/hooks'
import { cn } from '../../lib/utils'

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  className?: string
}

export interface TableRow {
  id: string
  [key: string]: unknown
}

export interface TableProps {
  columns: TableColumn[]
  data: TableRow[]
  className?: string
  sortable?: boolean
}

type SortDirection = 'asc' | 'desc' | null

/**
 * Table Component
 *
 * Data table with sorting capabilities.
 * For large datasets, use with ScrollArea.
 *
 * @example
 * <Table
 *   columns={[
 *     { key: 'name', label: 'Device Name', sortable: true },
 *     { key: 'status', label: 'Status' }
 *   ]}
 *   data={[
 *     { id: '1', name: 'Living Room Light', status: 'Online' },
 *     { id: '2', name: 'Bedroom Switch', status: 'Offline' }
 *   ]}
 * />
 */
export function Table({ columns, data, className, sortable = true, ...props }: TableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const handleSort = (columnKey: string) => {
    const column = columns.find((c) => c.key === columnKey)
    if (!sortable || !column?.sortable) return

    if (sortColumn === columnKey) {
      // Toggle direction: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortDirection(null)
        setSortColumn(null)
      }
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  // Sort data
  const sortedData = [...data]
  if (sortColumn && sortDirection) {
    sortedData.sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]

      if (aVal === bVal) return 0

      const comparison =
        typeof aVal === 'string' && typeof bVal === 'string'
          ? aVal.localeCompare(bVal)
          : (aVal as number) > (bVal as number)
          ? 1
          : -1

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }

  return (
    <div
      data-slot="table"
      class={cn('shc-table', 'w-full overflow-auto', className)}
      {...props}
    >
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-border bg-muted/50">
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column.key)}
                class={cn(
                  'px-4 py-3 text-left text-sm font-medium',
                  column.sortable && sortable && 'cursor-pointer hover:bg-muted',
                  column.className
                )}
              >
                <div class="flex items-center gap-2">
                  <span>{column.label}</span>
                  {column.sortable && sortable && (
                    <span class="text-muted-foreground">
                      {sortColumn === column.key ? (
                        sortDirection === 'asc' ? (
                          '↑'
                        ) : (
                          '↓'
                        )
                      ) : (
                        <span class="opacity-40">↕</span>
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr key={row.id} class="border-b border-border hover:bg-muted/50 transition-colors">
              {columns.map((column) => (
                <td
                  key={column.key}
                  class={cn('px-4 py-3 text-sm', column.className)}
                >
                  {String(row[column.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {sortedData.length === 0 && (
        <div class="py-8 text-center text-sm text-muted-foreground">
          No data available
        </div>
      )}
    </div>
  )
}

// Simplified individual table components for manual construction

export function TableHeader({ children, className }: { children?: ComponentChildren; className?: string }) {
  return <thead class={cn('border-b border-border bg-muted/50', className)}>{children}</thead>
}

export function TableBody({ children, className }: { children?: ComponentChildren; className?: string }) {
  return <tbody class={className}>{children}</tbody>
}

export function TableRow({ children, className }: { children?: ComponentChildren; className?: string }) {
  return (
    <tr class={cn('border-b border-border hover:bg-muted/50 transition-colors', className)}>
      {children}
    </tr>
  )
}

export function TableHead({ children, className }: { children?: ComponentChildren; className?: string }) {
  return (
    <th class={cn('px-4 py-3 text-left text-sm font-medium', className)}>
      {children}
    </th>
  )
}

export function TableCell({ children, className }: { children?: ComponentChildren; className?: string }) {
  return (
    <td class={cn('px-4 py-3 text-sm', className)}>
      {children}
    </td>
  )
}

// Export for component registry
Table.displayName = 'Table'
TableHeader.displayName = 'TableHeader'
TableBody.displayName = 'TableBody'
TableRow.displayName = 'TableRow'
TableHead.displayName = 'TableHead'
TableCell.displayName = 'TableCell'
