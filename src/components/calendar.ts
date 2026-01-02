/**
 * Calendar Component
 *
 * Date grid for scheduling and date selection.
 * Based on shadcn/ui Calendar (CSS-only grid, JS for date logic).
 *
 * Useful for: Automation scheduling, vacation mode, viewing camera history.
 *
 * @example
 * ```html
 * <div class="shc-calendar">
 *   <div class="shc-calendar-header">
 *     <button class="shc-btn shc-btn-ghost shc-btn-sm"><ha-icon icon="mdi:chevron-left"></ha-icon></button>
 *     <div class="shc-calendar-title">January 2026</div>
 *     <button class="shc-btn shc-btn-ghost shc-btn-sm"><ha-icon icon="mdi:chevron-right"></ha-icon></button>
 *   </div>
 *   <div class="shc-calendar-grid">
 *     <div class="shc-calendar-weekday">Sun</div>
 *     <div class="shc-calendar-weekday">Mon</div>
 *     <!-- ... -->
 *     <div class="shc-calendar-day" data-date="2026-01-01">1</div>
 *     <div class="shc-calendar-day shc-calendar-day-today" data-date="2026-01-02">2</div>
 *     <div class="shc-calendar-day shc-calendar-day-selected" data-date="2026-01-15">15</div>
 *   </div>
 * </div>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/calendar
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const calendarStyles = `
  .shc-calendar { width: 100%; max-width: 350px; padding: 1rem; background-color: var(--card); border: 1px solid var(--border); border-radius: var(--radius, 0.5rem); }
  .shc-calendar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
  .shc-calendar-title { font-size: 0.875rem; font-weight: 600; }

  .shc-calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.25rem; }
  .shc-calendar-weekday { padding: 0.5rem; font-size: 0.75rem; font-weight: 600; color: var(--muted-foreground); text-align: center; }

  .shc-calendar-day {
    aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
    font-size: 0.875rem; color: var(--foreground); background-color: transparent;
    border-radius: var(--radius, 0.375rem); cursor: pointer; transition: all 150ms ease;
  }

  .shc-calendar-day:hover { background-color: var(--accent); }
  .shc-calendar-day-outside { color: var(--muted-foreground); opacity: 0.5; }
  .shc-calendar-day-disabled { opacity: 0.3; cursor: not-allowed; pointer-events: none; }
  .shc-calendar-day-today { border: 2px solid var(--primary); font-weight: 600; }
  .shc-calendar-day-selected { background-color: var(--primary); color: var(--primary-foreground); font-weight: 600; }
  .shc-calendar-day-selected:hover { opacity: 0.9; }

  /* Range selection */
  .shc-calendar-day-range-start,
  .shc-calendar-day-range-end { background-color: var(--primary); color: var(--primary-foreground); }
  .shc-calendar-day-range-middle { background-color: var(--accent); }
`

export const calendarComponent: ComponentDefinition = {
  name: 'calendar',
  styles: calendarStyles,
  description: 'Date grid for scheduling and date selection',
}
