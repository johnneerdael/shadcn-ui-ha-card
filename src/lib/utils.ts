/**
 * Utility function for conditional class names (cn)
 *
 * Combines multiple class names, filters out falsy values,
 * and handles conditional classes.
 *
 * This is a simplified version of clsx/classnames for our needs.
 */

export type ClassValue = string | number | boolean | undefined | null | ClassValue[]

/**
 * Combine class names intelligently
 *
 * Usage:
 * ```ts
 * cn('base-class', condition && 'conditional-class', 'another-class')
 * cn(['class1', 'class2'], undefined, null, 'class3')
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = []

  for (const input of inputs) {
    if (!input) continue

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input))
    } else if (Array.isArray(input)) {
      const nested = cn(...input)
      if (nested) classes.push(nested)
    }
  }

  return classes.join(' ')
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date)
  return d.toLocaleDateString()
}

/**
 * Format time for display
 */
export function formatTime(date: Date | string | number): string {
  const d = new Date(date)
  return d.toLocaleTimeString()
}

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
