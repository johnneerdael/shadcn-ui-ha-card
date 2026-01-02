/**
 * Chart Component
 *
 * Preact implementation of Shadcn chart component.
 * Simple bar/line chart visualization.
 */

import { ComponentChildren } from 'preact'
import { cn } from '../../lib/utils'

export type ChartType = 'bar' | 'line' | 'pie'

export interface ChartProps {
  /** Chart type */
  type?: ChartType
  /** Chart data */
  data?: Array<{ label: string; value: number }>
  /** Chart title */
  title?: string
  /** Children content (for custom charts) */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function Chart({
  type = 'bar',
  data = [],
  title,
  children,
  className,
  ...props
}: ChartProps) {
  // If children provided, render custom chart
  if (children) {
    return (
      <div
        data-slot="chart"
        class={cn('shc-chart', 'w-full', className)}
        {...props}
      >
        {children}
      </div>
    )
  }

  // Simple bar chart visualization
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <div
      data-slot="chart"
      class={cn('shc-chart', 'w-full space-y-2', className)}
      {...props}
    >
      {title && (
        <h3 class="text-sm font-semibold text-foreground">{title}</h3>
      )}
      <div class="space-y-2">
        {data.map((item, index) => (
          <div key={index} class="flex items-center gap-2">
            <span class="text-xs text-muted-foreground w-20 truncate">
              {item.label}
            </span>
            <div class="flex-1 h-6 bg-muted rounded overflow-hidden">
              <div
                class="h-full bg-primary transition-all"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span class="text-xs font-medium w-12 text-right">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Chart
