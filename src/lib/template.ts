export type HassLike = {
  states?: Record<string, any>
  themes?: {
    default_theme?: string
    themes?: Record<string, Record<string, string>>
  }
  selectedTheme?: string | { theme?: string }
}

/**
 * Safe-ish expression evaluator scoped to provided context.
 * Supports simple JS expressions used within {{ ... }} or {% for ... in ... %}.
 */
function evaluateExpression(expr: string, context: Record<string, unknown>): unknown {
  try {
    // Sanitize expression - block dangerous patterns
    const dangerous = [
      'constructor',
      'prototype',
      '__proto__',
      'Function',
      'eval',
      'setTimeout',
      'setInterval',
      'import',
      'require',
      'process',
      'global',
      'window',
      'document',
      'fetch',
      'XMLHttpRequest',
      'localStorage',
      'sessionStorage',
    ]
    
    const lowerExpr = expr.toLowerCase()
    for (const pattern of dangerous) {
      if (lowerExpr.includes(pattern.toLowerCase())) {
        console.error(`Template security: Blocked dangerous expression containing '${pattern}'`)
        return `[Blocked: ${pattern}]`
      }
    }
    
    // eslint-disable-next-line no-new-func
    const fn = new Function(
      'ctx',
      `with (ctx) { return (${expr}); }`
    ) as (ctx: Record<string, unknown>) => unknown
    return fn(context)
  } catch (error) {
    console.error('Template evaluation error:', error instanceof Error ? error.message : 'Unknown error')
    return `[Error: ${error instanceof Error ? error.message : 'Invalid expression'}]`
  }
}

function renderInline(template: string, context: Record<string, unknown>): string {
  return template.replace(/{{\s*([^}]+)\s*}}/g, (_match, expr: string) => {
    const value = evaluateExpression(expr.trim(), context)
    if (value === null || value === undefined) return ''
    // Basic HTML escaping for security
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  })
}

function renderForLoops(template: string, context: Record<string, unknown>): string {
  return template.replace(
    /{%\s*for\s+(\w+)\s+in\s+([^%]+)%}([\s\S]*?){%\s*endfor\s*%}/g,
    (_match, itemVar: string, collectionExpr: string, body: string) => {
      const collection = evaluateExpression(collectionExpr.trim(), context)

      if (!collection || typeof (collection as any)[Symbol.iterator] !== 'function') {
        console.warn(`Template warning: '${collectionExpr}' is not iterable`)
        return `[Warning: ${collectionExpr} is not iterable]`
      }

      try {
        return Array.from(collection as Iterable<unknown>)
          .map((item, index) => {
            const scoped = { ...context, [itemVar]: item, loop: { index, index1: index + 1 } }
            // Allow nested loops by re-applying loop rendering within the body
            const bodyWithLoops = renderForLoops(body, scoped)
            return renderInline(bodyWithLoops, scoped)
          })
          .join('')
      } catch (error) {
        console.error('Template loop error:', error instanceof Error ? error.message : 'Unknown error')
        return `[Error in loop: ${error instanceof Error ? error.message : 'Unknown'}]`
      }
    }
  )
}

function buildContext(
  hass: HassLike | undefined,
  variables: Record<string, unknown> | undefined
): Record<string, unknown> {
  const vars = variables ?? {}

  const states = (entityId: string): unknown =>
    (hass as any)?.states?.[entityId]?.state ?? ''

  const state_attr = (entityId: string, attr: string): unknown =>
    (hass as any)?.states?.[entityId]?.attributes?.[attr]

  const range = (start: number, end?: number, step = 1): number[] => {
    const from = end === undefined ? 0 : start
    const to = end === undefined ? start : end
    const sign = step === 0 ? 1 : step
    const output: number[] = []
    for (let i = from; sign > 0 ? i < to : i > to; i += sign) {
      output.push(i)
    }
    return output
  }

  return {
    hass,
    vars,
    variables: vars,
    ...vars,
    Math,
    Date,
    range,
    states,
    state_attr,
  }
}

export function renderTemplate(
  content: string,
  hass: HassLike | undefined,
  variables: Record<string, unknown> = {}
): string {
  const context = buildContext(hass, variables)

  // Handle loops first (supports nesting), then inline expressions.
  const withLoops = renderForLoops(content, context)
  return renderInline(withLoops, context)
}