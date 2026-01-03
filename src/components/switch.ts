/**
 * Switch Component
 * 
 * Toggle switch for on/off states with smooth animation.
 * Based on shadcn/ui Switch with Radix UI patterns.
 * 
 * @example
 * ```html
 * <button class="shc-switch" data-switch role="switch" aria-checked="false">
 *   <span class="shc-switch-thumb"></span>
 * </button>
 * 
 * <!-- With label -->
 * <label class="shc-switch-wrapper">
 *   <button class="shc-switch" data-switch role="switch" aria-checked="false">
 *     <span class="shc-switch-thumb"></span>
 *   </button>
 *   <span class="shc-switch-label">Enable feature</span>
 * </label>
 * ```
 */

export const switchStyles = `
  /* Switch Wrapper */
  .shc-switch-wrapper {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  /* Switch Button */
  .shc-switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 2.75rem;
    height: 1.5rem;
    flex-shrink: 0;
    background: var(--input);
    border: 2px solid transparent;
    border-radius: 9999px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    padding: 0;
  }

  .shc-switch:hover {
    opacity: 0.9;
  }

  .shc-switch:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  .shc-switch[aria-checked="true"] {
    background: var(--primary);
  }

  .shc-switch[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }

  /* Switch Thumb */
  .shc-switch-thumb {
    position: relative;
    display: block;
    width: 1.25rem;
    height: 1.25rem;
    background: white;
    border-radius: 9999px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
    pointer-events: none;
    transform: translateX(0);
  }

  .shc-switch[aria-checked="true"] .shc-switch-thumb {
    transform: translateX(1.25rem);
  }

  /* Switch Label */
  .shc-switch-label {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--foreground);
    user-select: none;
  }

  /* Size Variants */
  .shc-switch-sm {
    width: 2.25rem;
    height: 1.25rem;
  }

  .shc-switch-sm .shc-switch-thumb {
    width: 1rem;
    height: 1rem;
  }

  .shc-switch-sm[aria-checked="true"] .shc-switch-thumb {
    transform: translateX(1rem);
  }

  .shc-switch-lg {
    width: 3.25rem;
    height: 1.75rem;
  }

  .shc-switch-lg .shc-switch-thumb {
    width: 1.5rem;
    height: 1.5rem;
  }

  .shc-switch-lg[aria-checked="true"] .shc-switch-thumb {
    transform: translateX(1.5rem);
  }
`

/**
 * Initialize switch functionality
 */
export function initSwitch(shadowRoot: ShadowRoot): void {
  const switches = shadowRoot.querySelectorAll('[data-switch]')
  
  switches.forEach(switchEl => {
    const button = switchEl as HTMLButtonElement
    
    // Set initial state if not already set
    if (!button.hasAttribute('aria-checked')) {
      button.setAttribute('aria-checked', 'false')
    }
    
    // Ensure role is set
    if (!button.hasAttribute('role')) {
      button.setAttribute('role', 'switch')
    }
    
    // Click handler
    button.addEventListener('click', () => {
      if (button.getAttribute('aria-disabled') === 'true') return
      
      const currentChecked = button.getAttribute('aria-checked') === 'true'
      const newChecked = !currentChecked
      
      button.setAttribute('aria-checked', String(newChecked))
      
      // Dispatch custom event for HA integration
      const event = new CustomEvent('switch-change', {
        detail: {
          checked: newChecked,
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
            checked: newChecked
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
    const wrapper = button.closest('.shc-switch-wrapper') as HTMLLabelElement
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
 * Helper function to create switch class string
 */
export function switchClass(size?: 'sm' | 'default' | 'lg'): string {
  const classes = ['shc-switch']
  
  if (size === 'sm') {
    classes.push('shc-switch-sm')
  } else if (size === 'lg') {
    classes.push('shc-switch-lg')
  }
  
  return classes.join(' ')
}

/**
 * Component definition for registry
 */
export const switchComponent = {
  name: 'switch',
  styles: switchStyles,
  init: initSwitch
}