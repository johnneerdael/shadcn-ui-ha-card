/**
 * Chart Components
 *
 * Shadcn-style chart wrapper around Recharts.
 * Provides ChartContainer, ChartTooltip, ChartLegend with theming support.
 *
 * Based on shadcn/ui Chart component.
 * @see https://ui.shadcn.com/docs/components/chart
 */

// @ts-ignore - Preact JSX pragma
import { h, createContext } from 'preact'
import { useContext, useId, useMemo } from 'preact/hooks'
// @ts-ignore - Type compatibility with preact/compat
import * as RechartsPrimitive from 'recharts'

// ============================================================================
// Types
// ============================================================================

export type ChartConfig = {
  [k: string]: {
    label?: string
    icon?: unknown
    color?: string
    theme?: {
      light: string
      dark: string
    }
  }
}

type ChartContextProps = {
  config: ChartConfig
}

// ============================================================================
// Context
// ============================================================================

const ChartContext = createContext<ChartContextProps | null>(null)

function useChart() {
  const context = useContext(ChartContext)

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />')
  }

  return context
}

// ============================================================================
// ChartContainer
// ============================================================================

interface ChartContainerProps {
  id?: string
  className?: string
  config: ChartConfig
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any
}

export function ChartContainer({
  id,
  className = '',
  children,
  config,
}: ChartContainerProps) {
  const uniqueId = useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        class={`shc-chart-container ${className}`}
      >
        <ChartStyle id={chartId} config={config} />
        {/* @ts-ignore - Recharts + Preact compatibility */}
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

// ============================================================================
// ChartStyle - Injects CSS variables for colors
// ============================================================================

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(
    ([, cfg]) => cfg.theme || cfg.color
  )

  if (!colorConfig.length) {
    return null
  }

  // Generate CSS for light and dark themes
  const cssContent = `
[data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .filter(Boolean)
  .join('\n')}
}
`

  return <style dangerouslySetInnerHTML={{ __html: cssContent }} />
}

// ============================================================================
// ChartTooltip
// ============================================================================

export const ChartTooltip = RechartsPrimitive.Tooltip

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{
    name?: string
    value?: number
    dataKey?: string
    color?: string
    payload?: Record<string, unknown>
    type?: string
  }>
  label?: string
  className?: string
  indicator?: 'line' | 'dot' | 'dashed'
  hideLabel?: boolean
  hideIndicator?: boolean
  labelFormatter?: (value: unknown, payload: unknown[]) => unknown
  formatter?: (value: unknown, name: string, item: unknown, index: number, payload: unknown) => unknown
  nameKey?: string
  labelKey?: string
}

export function ChartTooltipContent({
  active,
  payload,
  className = '',
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  formatter,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart()

  const tooltipLabel = useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey || item?.dataKey || item?.name || 'value'}`
    const itemConfig = config[key]
    const value = labelFormatter
      ? labelFormatter(label, payload)
      : itemConfig?.label || label

    if (!value) {
      return null
    }

    return <div class="shc-chart-tooltip-label">{value}</div>
  }, [label, labelFormatter, payload, hideLabel, config, labelKey])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== 'dot'

  return (
    <div class={`shc-chart-tooltip ${className}`}>
      {!nestLabel ? tooltipLabel : null}
      <div class="shc-chart-tooltip-items">
        {payload
          .filter((item) => item.type !== 'none')
          .map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`
            const itemConfig = config[key]
            const indicatorColor = (item.payload as Record<string, unknown>)?.fill as string || item.color

            return (
              <div key={item.dataKey || index} class="shc-chart-tooltip-item">
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload) as any
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      itemConfig.icon
                    ) : (
                      !hideIndicator && (
                        <div
                          class={`shc-chart-tooltip-indicator shc-chart-tooltip-indicator-${indicator}`}
                          style={{ '--indicator-color': indicatorColor }}
                        />
                      )
                    )}
                    <div class="shc-chart-tooltip-content">
                      {nestLabel ? tooltipLabel : null}
                      <span class="shc-chart-tooltip-name">
                        {itemConfig?.label || item.name}
                      </span>
                      {item.value !== undefined && (
                        <span class="shc-chart-tooltip-value">
                          {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

// ============================================================================
// ChartLegend
// ============================================================================

export const ChartLegend = RechartsPrimitive.Legend

interface ChartLegendContentProps {
  className?: string
  payload?: Array<{
    value?: string
    dataKey?: string
    color?: string
    type?: string
  }>
  verticalAlign?: 'top' | 'bottom'
  hideIcon?: boolean
  nameKey?: string
}

export function ChartLegendContent({
  className = '',
  payload,
  verticalAlign = 'bottom',
  hideIcon = false,
  nameKey,
}: ChartLegendContentProps) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      class={`shc-chart-legend ${verticalAlign === 'top' ? 'shc-chart-legend-top' : 'shc-chart-legend-bottom'} ${className}`}
    >
      {payload
        .filter((item) => item.type !== 'none')
        .map((item) => {
          const key = `${nameKey || item.dataKey || 'value'}`
          const itemConfig = config[key]

          return (
            <div key={item.value} class="shc-chart-legend-item">
              {itemConfig?.icon && !hideIcon ? (
                itemConfig.icon
              ) : (
                <div
                  class="shc-chart-legend-indicator"
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span>{itemConfig?.label || item.value}</span>
            </div>
          )
        })}
    </div>
  )
}

// ============================================================================
// Styles
// ============================================================================

export const chartStyles = `
  /* Chart Container */
  .shc-chart-container {
    display: flex;
    aspect-ratio: 16 / 9;
    justify-content: center;
    font-size: 0.75rem;
    width: 100%;
    min-height: 200px;
  }

  /* Recharts overrides */
  .shc-chart-container .recharts-cartesian-axis-tick text {
    fill: var(--muted-foreground);
  }

  .shc-chart-container .recharts-cartesian-grid line[stroke='#ccc'] {
    stroke: var(--border);
    opacity: 0.5;
  }

  .shc-chart-container .recharts-curve.recharts-tooltip-cursor {
    stroke: var(--border);
  }

  .shc-chart-container .recharts-rectangle.recharts-tooltip-cursor {
    fill: var(--muted);
  }

  .shc-chart-container .recharts-radial-bar-background-sector {
    fill: var(--muted);
  }

  .shc-chart-container .recharts-reference-line line[stroke='#ccc'] {
    stroke: var(--border);
  }

  .shc-chart-container .recharts-dot[stroke='#fff'] {
    stroke: transparent;
  }

  .shc-chart-container .recharts-sector[stroke='#fff'] {
    stroke: transparent;
  }

  .shc-chart-container .recharts-layer,
  .shc-chart-container .recharts-sector,
  .shc-chart-container .recharts-surface {
    outline: none;
  }

  /* Tooltip */
  .shc-chart-tooltip {
    display: grid;
    min-width: 8rem;
    align-items: start;
    gap: 0.375rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border);
    background: var(--background);
    padding: 0.375rem 0.625rem;
    font-size: 0.75rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .shc-chart-tooltip-label {
    font-weight: 500;
  }

  .shc-chart-tooltip-items {
    display: grid;
    gap: 0.375rem;
  }

  .shc-chart-tooltip-item {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }

  .shc-chart-tooltip-indicator {
    flex-shrink: 0;
    border-radius: 2px;
    background-color: var(--indicator-color);
  }

  .shc-chart-tooltip-indicator-dot {
    width: 0.625rem;
    height: 0.625rem;
  }

  .shc-chart-tooltip-indicator-line {
    width: 0.25rem;
    height: 100%;
  }

  .shc-chart-tooltip-indicator-dashed {
    width: 0;
    border-width: 1.5px;
    border-style: dashed;
    border-color: var(--indicator-color);
    background-color: transparent;
  }

  .shc-chart-tooltip-content {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    line-height: 1;
  }

  .shc-chart-tooltip-name {
    color: var(--muted-foreground);
  }

  .shc-chart-tooltip-value {
    font-family: ui-monospace, monospace;
    font-weight: 500;
    color: var(--foreground);
    font-variant-numeric: tabular-nums;
  }

  /* Legend */
  .shc-chart-legend {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .shc-chart-legend-top {
    padding-bottom: 0.75rem;
  }

  .shc-chart-legend-bottom {
    padding-top: 0.75rem;
  }

  .shc-chart-legend-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .shc-chart-legend-indicator {
    width: 0.5rem;
    height: 0.5rem;
    flex-shrink: 0;
    border-radius: 2px;
  }

  .shc-chart-legend-item svg {
    width: 0.75rem;
    height: 0.75rem;
    color: var(--muted-foreground);
  }
`

// Re-export Recharts components for convenience
export {
  RechartsPrimitive,
}
