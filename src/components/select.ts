/**
 * Select Component
 * 
 * Custom dropdown select with option selection.
 * This is a simple CSS-only version. For complex dropdowns with portals, see Phase 3.
 * Based on shadcn/ui Select patterns.
 * 
 * @example
 * ```html
 * <div class="shc-select" data-select>
 *   <button class="shc-select-trigger" data-select-trigger aria-expanded="false">
 *     <span class="shc-select-value" data-select-value data-placeholder="Select option..."></span>
 *     <svg class="shc-select-icon" width="15" height="15" viewBox="0 0 15 15">
 *       <path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor"/>
 *     </svg>
 *   </button>
 *   <div class="shc-select-content" data-select-content data-state="closed">
 *     <div class="shc-select-item" data-select-item data-value="option1">
 *       Option 1
 *     </div>
 *     <div class="shc-select-item" data-select-item data-value="option2">
 *       Option 2
 *     </div>
 *   </div>
 * </div>
 * ```
 */

export const selectStyles = `
  /* Select Container */
  .shc-select {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  /* Select Trigger */
  .shc-select-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    color: var(--foreground);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .shc-select-trigger:hover {
    background: var(--muted);
  }

  .shc-select-trigger:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  .shc-select-trigger[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }

  /* Select Value */
  .shc-select-value {
    flex: 1;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .shc-select-value:empty::before {
    content: attr(data-placeholder);
    color: var(--muted-foreground);
  }

  /* Select Icon */
  .shc-select-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    opacity: 0.5;
  }

  /* Select Content (Dropdown) */
  .shc-select-content {
    position: absolute;
    top: calc(100% + 0.25rem);
    left: 0;
    right: 0;
    z-index: 50;
    max-height: 15rem;
    overflow-y: auto;
    background: var(--popover);
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    opacity: 0;
    transform: translateY(-0.5rem);
    transition: all 0.2s ease;
    pointer-events: none;
  }

  .shc-select-content[data-state="open"] {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  /* Select Item */
  .shc-select-item {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--foreground);
    cursor: pointer;
    transition: background-color 0.2s ease;
    user-select: none;
  }

  .shc-select-item:hover {
    background: var(--muted);
  }

  .shc-select-item:focus {
    outline: none;
    background: var(--muted);
  }

  .shc-select-item[data-selected="true"] {
    background: var(--accent);
    color: var(--accent-foreground);
  }

  .shc-select-item[data-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }
`

/**
 * Initialize select functionality
 */
export function initSelect(shadowRoot: ShadowRoot): void {
  const selects = shadowRoot.querySelectorAll('[data-select]')
  
  selects.forEach(select => {
    const selectEl = select as HTMLElement
    const trigger = select.querySelector('[data-select-trigger]') as HTMLButtonElement
    const content = select.querySelector('[data-select-content]') as HTMLElement
    const valueEl = select.querySelector('[data-select-value]') as HTMLElement
    const items = Array.from(select.querySelectorAll('[data-select-item]')) as HTMLElement[]
    
    if (!trigger || !content || !valueEl || items.length === 0) return
    
    let selectedValue: string | null = null
    
    // Set initial state
    content.dataset.state = 'closed'
    trigger.setAttribute('aria-expanded', 'false')
    
    // Check for initially selected item
    const initialSelected = items.find(item => item.dataset.selected === 'true')
    if (initialSelected) {
      selectedValue = initialSelected.dataset.value || null
      valueEl.textContent = initialSelected.textContent
    }
    
    // Toggle dropdown
    trigger.addEventListener('click', (e) => {
      e.stopPropagation()
      if (trigger.getAttribute('aria-disabled') === 'true') return
      
      const isOpen = content.dataset.state === 'open'
      
      if (isOpen) {
        closeSelect(trigger, content)
      } else {
        openSelect(trigger, content)
      }
    })
    
    // Select item
    items.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation()
        if (item.dataset.disabled === 'true') return
        
        const value = item.dataset.value || ''
        
        // Update selection
        items.forEach(i => i.dataset.selected = 'false')
        item.dataset.selected = 'true'
        selectedValue = value
        
        // Update display value
        valueEl.textContent = item.textContent
        
        // Close dropdown
        closeSelect(trigger, content)
        
        // Dispatch custom event
        const event = new CustomEvent('select-change', {
          detail: {
            value: value
          },
          bubbles: true,
          composed: true
        })
        select.dispatchEvent(event)
        
        // Trigger action if defined
        const action = selectEl.dataset.action
        if (action) {
          const actionEvent = new CustomEvent('ha-action', {
            detail: {
              action,
              value: value
            },
            bubbles: true,
            composed: true
          })
          select.dispatchEvent(actionEvent)
        }
      })
      
      // Keyboard navigation within dropdown
      item.addEventListener('keydown', (e: KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            const nextIndex = (index + 1) % items.length
            items[nextIndex]?.focus()
            break
          case 'ArrowUp':
            e.preventDefault()
            const prevIndex = (index - 1 + items.length) % items.length
            items[prevIndex]?.focus()
            break
          case 'Enter':
          case ' ':
            e.preventDefault()
            item.click()
            break
          case 'Escape':
            e.preventDefault()
            closeSelect(trigger, content)
            trigger.focus()
            break
        }
      })
    })
    
    // Keyboard support for trigger
    trigger.addEventListener('keydown', (e: KeyboardEvent) => {
      if (trigger.getAttribute('aria-disabled') === 'true') return
      
      const isOpen = content.dataset.state === 'open'
      
      switch (e.key) {
        case 'Enter':
        case ' ':
        case 'ArrowDown':
          e.preventDefault()
          if (!isOpen) {
            openSelect(trigger, content)
            items[0]?.focus()
          }
          break
        case 'Escape':
          e.preventDefault()
          if (isOpen) {
            closeSelect(trigger, content)
          }
          break
      }
    })
    
    // Close on click outside
    const closeOnClickOutside = (e: Event) => {
      if (!selectEl.contains(e.target as Node)) {
        closeSelect(trigger, content)
      }
    }
    
    shadowRoot.addEventListener('click', closeOnClickOutside)
  })
}

function openSelect(trigger: HTMLButtonElement, content: HTMLElement): void {
  trigger.setAttribute('aria-expanded', 'true')
  content.dataset.state = 'open'
}

function closeSelect(trigger: HTMLButtonElement, content: HTMLElement): void {
  trigger.setAttribute('aria-expanded', 'false')
  content.dataset.state = 'closed'
}

/**
 * Helper function to create select class string
 */
export function select(): string {
  return 'shc-select'
}

/**
 * Component definition for registry
 */
export const selectComponent = {
  name: 'select',
  styles: selectStyles,
  init: initSelect
}