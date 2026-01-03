/**
 * Checkbox Component
 * 
 * Checkbox with checked/unchecked/indeterminate states.
 * Based on shadcn/ui Checkbox with Radix UI patterns.
 * 
 * @example
 * ```html
 * <button class="shc-checkbox" data-checkbox role="checkbox" aria-checked="false">
 *   <svg class="shc-checkbox-indicator" width="15" height="15" viewBox="0 0 15 15">
 *     <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor"/>
 *   </svg>
 * </button>
 * 
 * <!-- With label -->
 * <label class="shc-checkbox-wrapper">
 *   <button class="shc-checkbox" data-checkbox role="checkbox" aria-checked="false">
 *     <svg class="shc-checkbox-indicator" width="15" height="15" viewBox="0 0 15 15">
 *       <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor"/>
 *     </svg>
 *   </button>
 *   <span class="shc-checkbox-label">Accept terms</span>
 * </label>
 * ```
 */

export const checkboxStyles = `
  /* Checkbox Wrapper */
  .shc-checkbox-wrapper {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  /* Checkbox Button */
  .shc-checkbox {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    background: transparent;
    border: 2px solid var(--primary);
    border-radius: 0.25rem;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
  }

  .shc-checkbox:hover {
    background: var(--muted);
  }

  .shc-checkbox:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  .shc-checkbox[aria-checked="true"],
  .shc-checkbox[aria-checked="mixed"] {
    background: var(--primary);
    border-color: var(--primary);
  }

  .shc-checkbox[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }

  /* Checkbox Indicator (checkmark) */
  .shc-checkbox-indicator {
    width: 1rem;
    height: 1rem;
    color: var(--primary-foreground);
    opacity: 0;
    transform: scale(0);
    transition: all 0.2s ease;
  }

  .shc-checkbox[aria-checked="true"] .shc-checkbox-indicator {
    opacity: 1;
    transform: scale(1);
  }

  /* Indeterminate state (dash) */
  .shc-checkbox[aria-checked="mixed"] .shc-checkbox-indicator {
    opacity: 1;
    transform: scale(1);
  }

  /* Checkbox Label */
  .shc-checkbox-label {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--foreground);
    user-select: none;
  }
`

/**
 * Initialize checkbox functionality
 */
export function initCheckbox(shadowRoot: ShadowRoot): void {
  const checkboxes = shadowRoot.querySelectorAll('[data-checkbox]')
  
  checkboxes.forEach(checkbox => {
    const button = checkbox as HTMLButtonElement
    
    // Set initial state if not already set
    if (!button.hasAttribute('aria-checked')) {
      button.setAttribute('aria-checked', 'false')
    }
    
    // Ensure role is set
    if (!button.hasAttribute('role')) {
      button.setAttribute('role', 'checkbox')
    }
    
    // Click handler
    button.addEventListener('click', () => {
      if (button.getAttribute('aria-disabled') === 'true') return
      
      const currentChecked = button.getAttribute('aria-checked')
      let newChecked: string
      
      // Handle indeterminate state
      if (currentChecked === 'mixed') {
        newChecked = 'false'
      } else if (currentChecked === 'true') {
        newChecked = 'false'
      } else {
        newChecked = 'true'
      }
      
      button.setAttribute('aria-checked', newChecked)
      
      // Dispatch custom event for HA integration
      const event = new CustomEvent('checkbox-change', {
        detail: {
          checked: newChecked === 'true',
          indeterminate: newChecked === 'mixed',
          value: button.dataset.value
        },
        bubbles: true,
        composed: true
      })
      button.dispatchEvent(event)
      
      // Trigger action if defined
      const action = button.dataset.action
      if (action) {
        const actionEvent = new CustomEvent('ha-action', {
          detail: {
            action,
            checked: newChecked === 'true'
          },
          bubbles: true,
          composed: true
        })
        button.dispatchEvent(actionEvent)
      }
    })
    
    // Keyboard support
    button.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        button.click()
      }
    })
    
    // Handle label clicks
    const wrapper = button.closest('.shc-checkbox-wrapper') as HTMLLabelElement
    if (wrapper && wrapper.tagName === 'LABEL') {
      wrapper.addEventListener('click', (e) => {
        // Prevent double-firing if button was clicked directly
        if (e.target === button) return
        e.preventDefault()
        button.click()
      })
    }
  })
}

/**
 * Helper function to create checkbox class string
 */
export function checkbox(): string {
  return 'shc-checkbox'
}

/**
 * Component definition for registry
 */
export const checkboxComponent = {
  name: 'checkbox',
  styles: checkboxStyles,
  init: initCheckbox
}