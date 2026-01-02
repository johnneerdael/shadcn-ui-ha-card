/**
 * UiChart Component
 *
 * Home Assistant integrated chart component that fetches entity history
 * and renders using Recharts via shadcn chart wrapper.
 *
 * @example
 * ```tsx
 * <UiChart
 *   hass={hass}
 *   entityId="sensor.power_consumption"
 *   chartType="line"
 *   hoursToShow={24}
 *   height={200}
 * />
 * ```
 */

// @ts-ignore - Preact JSX pragma
import { h } from 'preact'
import { useState, useEffect, useMemo, useCallback } from 'preact/hooks'
// @ts-ignore - Type compatibility with preact/compat
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from './chart'

// ============================================================================
// Types
// ============================================================================

interface HomeAssistant {
  callApi: (method: string, path: string) => Promise<unknown>
  states: Record<string, {
    state: string
    attributes: Record<string, unknown>
    entity_id: string
    last_changed: string
    last_updated: string
  }>
}

interface HistoryPoint {
  state: string
  last_changed: string
  last_updated: string
}

interface ChartDataPoint {
  timestamp: number
  time: string
  value: number
}

export interface UiChartProps {
  hass: HomeAssistant
  entityId: string
  chartType?: 'line' | 'bar' | 'area'
  hoursToShow?: number
  height?: number
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  color?: string
  strokeWidth?: number
  className?: string
}

// ============================================================================
// History Fetching
// ============================================================================

async function fetchHistory(
  hass: HomeAssistant,
  entityId: string,
  hoursToShow: number
): Promise<HistoryPoint[][]> {
  const start = new Date(Date.now() - hoursToShow * 60 * 60 * 1000)
  const url = `history/period/${start.toISOString()}?filter_entity_id=${entityId}&minimal_response&no_attributes`

  try {
    const response = await hass.callApi('GET', url)
    return (response as HistoryPoint[][]) || []
  } catch (error) {
    console.error('Error fetching history:', error)
    return []
  }
}

// ============================================================================
// Data Transformation
// ============================================================================

function transformHistoryToChartData(
  history: HistoryPoint[][],
  hoursToShow: number
): ChartDataPoint[] {
  if (!history.length || !history[0]?.length) {
    return []
  }

  const now = Date.now()
  const startTime = now - hoursToShow * 60 * 60 * 1000

  return history[0]
    .filter((point) => {
      const timestamp = new Date(point.last_changed).getTime()
      return timestamp >= startTime && !isNaN(parseFloat(point.state))
    })
    .map((point) => {
      const timestamp = new Date(point.last_changed).getTime()
      const date = new Date(timestamp)

      // Format time based on range
      let timeFormat: string
      if (hoursToShow <= 6) {
        timeFormat = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } else if (hoursToShow <= 48) {
        timeFormat = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } else {
        timeFormat = date.toLocaleDateString([], { month: 'short', day: 'numeric' })
      }

      return {
        timestamp,
        time: timeFormat,
        value: parseFloat(point.state) || 0,
      }
    })
    .sort((a, b) => a.timestamp - b.timestamp)
}

// ============================================================================
// UiChart Component
// ============================================================================

export function UiChart({
  hass,
  entityId,
  chartType = 'line',
  hoursToShow = 24,
  height = 200,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  color = 'var(--primary)',
  strokeWidth = 2,
  className = '',
}: UiChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get entity friendly name for legend
  const entityName = useMemo(() => {
    const entity = hass?.states?.[entityId]
    return (entity?.attributes?.friendly_name as string) || entityId?.split('.')[1] || 'Value'
  }, [hass, entityId])

  // Chart config for theming
  const chartConfig: ChartConfig = useMemo(() => ({
    value: {
      label: entityName,
      color: color,
    },
  }), [entityName, color])

  // Fetch history on mount and when params change
  const loadHistory = useCallback(async () => {
    if (!hass || !entityId) {
      setError('Missing hass or entityId')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const history = await fetchHistory(hass, entityId, hoursToShow)
      const chartData = transformHistoryToChartData(history, hoursToShow)
      setData(chartData)
    } catch (err) {
      setError('Failed to load history')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [hass, entityId, hoursToShow])

  useEffect(() => {
    loadHistory()

    // Refresh every 5 minutes
    const interval = setInterval(loadHistory, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [loadHistory])

  // Loading state
  if (loading && data.length === 0) {
    return (
      <div class={`shc-chart-loading ${className}`} style={{ height: `${height}px` }}>
        <div class="shc-chart-loading-spinner" />
        <span>Loading chart...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div class={`shc-chart-error ${className}`} style={{ height: `${height}px` }}>
        <span>{error}</span>
      </div>
    )
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div class={`shc-chart-empty ${className}`} style={{ height: `${height}px` }}>
        <span>No data available</span>
      </div>
    )
  }

  // Common chart props
  const commonChartProps = {
    data,
    margin: { top: 10, right: 10, left: 10, bottom: 0 },
    accessibilityLayer: true,
  }

  // Render chart based on type using h() for React/Preact compatibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderChart = (): any => {
    // Common axis props
    const xAxisProps = {
      dataKey: 'time',
      tickLine: false,
      axisLine: false,
      tickMargin: 8,
      minTickGap: 32,
    }

    const yAxisProps = {
      tickLine: false,
      axisLine: false,
      tickMargin: 8,
      width: 40,
    }

    const gridProps = {
      vertical: false,
      strokeDasharray: '3 3',
    }

    // Build children array for the chart
    const buildChartChildren = (dataElement: any) => {
      const children: any[] = []

      if (showGrid) {
        children.push(h(CartesianGrid as any, gridProps))
      }

      children.push(h(XAxis as any, xAxisProps))
      children.push(h(YAxis as any, yAxisProps))

      if (showTooltip) {
        children.push(
          h(ChartTooltip as any, {
            cursor: chartType === 'bar' ? { fill: 'var(--muted)', opacity: 0.3 } : false,
            content: h(ChartTooltipContent as any, {}),
          })
        )
      }

      if (showLegend) {
        children.push(h(ChartLegend as any, { content: h(ChartLegendContent as any, {}) }))
      }

      children.push(dataElement)

      return children
    }

    switch (chartType) {
      case 'bar':
        return h(
          BarChart as any,
          commonChartProps,
          ...buildChartChildren(
            h(Bar as any, {
              dataKey: 'value',
              fill: 'var(--color-value)',
              radius: [4, 4, 0, 0],
            })
          )
        )

      case 'area':
        return h(
          AreaChart as any,
          commonChartProps,
          ...buildChartChildren(
            h(Area as any, {
              dataKey: 'value',
              type: 'monotone',
              fill: 'var(--color-value)',
              fillOpacity: 0.3,
              stroke: 'var(--color-value)',
              strokeWidth,
            })
          )
        )

      case 'line':
      default:
        return h(
          LineChart as any,
          commonChartProps,
          ...buildChartChildren(
            h(Line as any, {
              dataKey: 'value',
              type: 'monotone',
              stroke: 'var(--color-value)',
              strokeWidth,
              dot: false,
              activeDot: { r: 4 },
            })
          )
        )
    }
  }

  return (
    <div class={className} style={{ height: `${height}px` }}>
      <ChartContainer config={chartConfig}>
        {renderChart()}
      </ChartContainer>
    </div>
  )
}

// ============================================================================
// Additional Styles
// ============================================================================

export const uiChartStyles = `
  /* Loading state */
  .shc-chart-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: var(--muted-foreground);
    font-size: 0.875rem;
  }

  .shc-chart-loading-spinner {
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid var(--muted);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: shc-chart-spin 1s linear infinite;
  }

  @keyframes shc-chart-spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Error state */
  .shc-chart-error {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--destructive);
    font-size: 0.875rem;
  }

  /* Empty state */
  .shc-chart-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted-foreground);
    font-size: 0.875rem;
  }
`

export default UiChart
