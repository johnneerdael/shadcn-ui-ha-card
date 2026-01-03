/**
 * Combobox Component
 *
 * Searchable select dropdown with filtering (autocomplete).
 * Based on shadcn/ui Combobox (CSS-only with JS filtering).
 *
 * Useful for: Entity picker (100+ devices), music search, smart home device selection.
 *
 * @example
 * ```html
 * <div class="shc-combobox">
 *   <input type="checkbox" id="combo-1" class="shc-combobox-state" />
 *
 *   <div class="shc-combobox-trigger">
 *     <label for="combo-1" class="shc-combobox-value">Select device...</label>
 *     <ha-icon icon="mdi:chevron-down"></ha-icon>
 *   </div>
 *
 *   <div class="shc-combobox-content">
 *     <input type="text" class="shc-combobox-search" placeholder="Search..." />
 *     <div class="shc-combobox-list">
 *       <div class="shc-combobox-item" data-value="light.kitchen">Kitchen Light</div>
 *       <div class="shc-combobox-item" data-value="light.living_room">Living Room Light</div>
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/combobox
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const comboboxStyles = `
  .shc-combobox { position: relative; width: 100%; }
  .shc-combobox-state { position: absolute; opacity: 0; pointer-events: none; }

  .shc-combobox-trigger {
    display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
    width: 100%; min-height: 2.5rem; padding: 0.5rem 0.75rem;
    font-size: 0.875rem; color: var(--foreground);
    background-color: var(--background); border: 1px solid var(--border);
    border-radius: var(--radius, 0.375rem); cursor: pointer; transition: all 150ms ease;
  }

  .shc-combobox-trigger:hover { background-color: var(--accent); }
  .shc-combobox-value { flex: 1; text-align: left; }
  .shc-combobox-value:empty::before { content: 'Select...'; color: var(--muted-foreground); }

  .shc-combobox-content {
    position: absolute; top: 100%; left: 0; z-index: 50; width: 100%;
    margin-top: 0.25rem; padding: 0.25rem; background-color: var(--popover);
    border: 1px solid var(--border); border-radius: var(--radius, 0.375rem);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); opacity: 0; visibility: hidden;
    transform: translateY(-8px); transition: all 150ms ease; pointer-events: none;
  }

  .shc-combobox-state:checked ~ .shc-combobox-content {
    opacity: 1; visibility: visible; transform: translateY(0); pointer-events: auto;
  }

  .shc-combobox-search {
    width: 100%; padding: 0.5rem; margin-bottom: 0.25rem;
    font-size: 0.875rem; border: 1px solid var(--border);
    border-radius: calc(var(--radius, 0.375rem) - 0.125rem);
    background-color: var(--background); outline: none;
  }

  .shc-combobox-list { max-height: 200px; overflow-y: auto; }

  .shc-combobox-item {
    padding: 0.5rem 0.75rem; font-size: 0.875rem; color: var(--popover-foreground);
    border-radius: calc(var(--radius, 0.375rem) - 0.125rem);
    cursor: pointer; transition: background-color 150ms ease;
  }

  .shc-combobox-item:hover { background-color: var(--accent); color: var(--accent-foreground); }
  .shc-combobox-item[data-selected="true"] { background-color: var(--primary); color: var(--primary-foreground); }
  .shc-combobox-item[data-hidden="true"] { display: none; }
`

export const comboboxComponent: ComponentDefinition = {
  name: 'combobox',
  styles: comboboxStyles,
  description: 'Searchable select dropdown with autocomplete filtering',
}

export function initCombobox(container: HTMLElement): () => void {
  const checkbox = container.querySelector<HTMLInputElement>('.shc-combobox-state')
  const search = container.querySelector<HTMLInputElement>('.shc-combobox-search')
  const valueDisplay = container.querySelector('.shc-combobox-value')
  const items = Array.from(container.querySelectorAll('.shc-combobox-item'))

  if (!checkbox || !search || !valueDisplay || items.length === 0) return () => {}

  const filterItems = () => {
    const query = search.value.toLowerCase()
    items.forEach((item) => {
      const text = item.textContent?.toLowerCase() || ''
      item.setAttribute('data-hidden', text.includes(query) ? 'false' : 'true')
    })
  }

  const selectItem = (item: Element) => {
    items.forEach((i) => i.setAttribute('data-selected', 'false'))
    item.setAttribute('data-selected', 'true')
    valueDisplay.textContent = item.textContent || ''
    checkbox.checked = false
  }

  search.addEventListener('input', filterItems)
  items.forEach((item) => item.addEventListener('click', () => selectItem(item)))

  return () => {
    search.removeEventListener('input', filterItems)
  }
}
