import { TemplateContext } from '../types';

/**
 * Parse and evaluate template strings with {{ }} syntax
 *
 * Supported expressions:
 * - {{ state }} - entity state
 * - {{ attr.name }} - entity attribute
 * - {{ states('entity_id') }} - other entity state
 * - {{ state_attr('entity_id', 'attr') }} - other entity attribute
 * - {{ value | filter }} - apply filter
 * - {{ value | filter(arg) }} - apply filter with argument
 */
export function parseTemplate(template: string, context: TemplateContext): string {
  if (!template || typeof template !== 'string') {
    return template ?? '';
  }

  if (!template.includes('{{')) {
    return template;
  }

  return template.replace(/\{\{\s*(.+?)\s*\}\}/g, (_, expression) => {
    try {
      return evaluateExpression(expression.trim(), context);
    } catch (e) {
      console.warn(`[status-banner-card] Failed to evaluate expression: ${expression}`, e);
      return '';
    }
  });
}

/**
 * Evaluate a single expression
 */
function evaluateExpression(expr: string, ctx: TemplateContext): string {
  // Handle filters: value | filter | filter2
  const parts = expr.split('|').map((p) => p.trim());
  let value = resolveValue(parts[0], ctx);

  // Apply filters
  for (let i = 1; i < parts.length; i++) {
    value = applyFilter(value, parts[i], ctx);
  }

  return String(value ?? '');
}

/**
 * Resolve a value from the context
 */
function resolveValue(expr: string, ctx: TemplateContext): unknown {
  // {{ state }}
  if (expr === 'state') {
    return ctx.state;
  }

  // {{ attr.name }}
  if (expr.startsWith('attr.')) {
    const attrName = expr.substring(5);
    return ctx.attr[attrName];
  }

  // {{ states('entity_id') }}
  const statesMatch = expr.match(/^states\(['"](.+)['"]\)$/);
  if (statesMatch) {
    return ctx.hass.states[statesMatch[1]]?.state ?? 'unknown';
  }

  // {{ state_attr('entity_id', 'attr') }}
  const attrMatch = expr.match(/^state_attr\(['"](.+)['"],\s*['"](.+)['"]\)$/);
  if (attrMatch) {
    return ctx.hass.states[attrMatch[1]]?.attributes[attrMatch[2]];
  }

  // {{ as_timestamp(value) }}
  const timestampMatch = expr.match(/^as_timestamp\((.+)\)$/);
  if (timestampMatch) {
    const innerValue = resolveValue(timestampMatch[1].trim(), ctx);
    const date = new Date(String(innerValue));
    return isNaN(date.getTime()) ? 0 : date.getTime() / 1000;
  }

  // Check if it's a string literal 'value' or "value"
  const stringMatch = expr.match(/^['"](.+)['"]$/);
  if (stringMatch) {
    return stringMatch[1];
  }

  // Check if it's a number
  const num = parseFloat(expr);
  if (!isNaN(num)) {
    return num;
  }

  // Return as-is (could be a literal)
  return expr;
}

/**
 * Apply a filter to a value
 */
function applyFilter(value: unknown, filterExpr: string, ctx: TemplateContext): unknown {
  // Parse filter name and arguments
  const match = filterExpr.match(/^(\w+)(?:\((.+)\))?$/);
  if (!match) return value;

  const [, filterName, args] = match;
  const str = String(value ?? '');

  switch (filterName) {
    case 'upper':
      return str.toUpperCase();

    case 'lower':
      return str.toLowerCase();

    case 'capitalize':
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    case 'title':
      return str.replace(/\b\w/g, (c) => c.toUpperCase());

    case 'replace': {
      const [search, replace] = parseArgs(args);
      return str.replace(new RegExp(escapeRegex(search), 'g'), replace ?? '');
    }

    case 'default': {
      const [defaultValue] = parseArgs(args);
      return str && str !== 'unknown' && str !== 'unavailable' ? str : defaultValue ?? '';
    }

    case 'color_map':
      return ctx.colorMap?.[str] ?? ctx.colorMap?.default ?? str;

    case 'timestamp_custom': {
      const [format] = parseArgs(args);
      const timestamp = typeof value === 'number' ? value : parseFloat(str);
      if (isNaN(timestamp)) return str;
      const date = new Date(timestamp * 1000);
      return formatTimestamp(date, format ?? '%H:%M');
    }

    case 'round': {
      const [precision] = parseArgs(args);
      const num = typeof value === 'number' ? value : parseFloat(str);
      if (isNaN(num)) return str;
      const p = parseInt(precision ?? '0', 10);
      return num.toFixed(p);
    }

    case 'int': {
      const num = typeof value === 'number' ? value : parseFloat(str);
      return isNaN(num) ? 0 : Math.floor(num);
    }

    case 'float': {
      const num = parseFloat(str);
      return isNaN(num) ? 0.0 : num;
    }

    default:
      console.warn(`[status-banner-card] Unknown filter: ${filterName}`);
      return value;
  }
}

/**
 * Parse comma-separated arguments from a filter
 */
function parseArgs(args: string | undefined): string[] {
  if (!args) return [];

  const result: string[] = [];
  let current = '';
  let inQuote = false;
  let quoteChar = '';

  for (let i = 0; i < args.length; i++) {
    const char = args[i];

    if ((char === '"' || char === "'") && !inQuote) {
      inQuote = true;
      quoteChar = char;
    } else if (char === quoteChar && inQuote) {
      inQuote = false;
      quoteChar = '';
    } else if (char === ',' && !inQuote) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    result.push(current.trim());
  }

  return result.map((a) => a.replace(/^['"]|['"]$/g, ''));
}

/**
 * Format a Date object using strftime-like format
 */
function formatTimestamp(date: Date, format: string): string {
  const pad = (n: number, width = 2) => String(n).padStart(width, '0');

  const replacements: Record<string, string> = {
    '%Y': String(date.getFullYear()),
    '%y': String(date.getFullYear()).slice(-2),
    '%m': pad(date.getMonth() + 1),
    '%d': pad(date.getDate()),
    '%H': pad(date.getHours()),
    '%M': pad(date.getMinutes()),
    '%S': pad(date.getSeconds()),
    '%I': pad(date.getHours() % 12 || 12),
    '%p': date.getHours() >= 12 ? 'PM' : 'AM',
    '%j': pad(getDayOfYear(date), 3),
    '%w': String(date.getDay()),
    '%a': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
    '%A': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
      date.getDay()
    ],
    '%b': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
      date.getMonth()
    ],
    '%B': [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ][date.getMonth()],
    '%%': '%',
  };

  let result = format;
  for (const [token, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(token, 'g'), value);
  }

  return result;
}

/**
 * Get day of year (1-366)
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}