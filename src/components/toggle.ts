/**
 * Toggle Component
 * 
 * Toggle button with pressed state for on/off actions.
 * Based on shadcn/ui Toggle with Radix UI patterns.
 * 
 * @example
 * ```html
 * <button class="shc-toggle" data-toggle aria-pressed="false">
 *   <svg class="shc-toggle-icon" width="15" height="15" viewBox="0 0 15 15">
 *     <path d="..." fill="currentColor"/>
 *   </svg>
 *   Toggle Me
 * </button>
 * ```
 */

export const toggleStyles = `
  /* Toggle Button */
  .shc-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    color: var(--foreground);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .shc-toggle:hover {
    background: var(--muted);
    color: var(--muted-foreground);
  }

  .shc-toggle:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  .shc-toggle[aria-pressed="true"] {
    background: var(--accent);
    color: var(--accent-foreground);
  }

  .shc-toggle[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }

  .shc-toggle-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  /* Toggle Variants */
  .shc-toggle-sm {
    padding: 0.375rem 0.625rem;
    font-size: 0.8125rem;
  }

  .shc-toggle-sm .shc-toggle-icon {
    width: 0.875rem;
    height: 0.875rem;
  }

  .shc-toggle-lg {
    padding: 0.625rem 1rem;
    font-size: 0.9375rem;
  }

  .shc-toggle-lg .shc-toggle-icon {
    width: 1.125rem;
    height: 1.125rem;
  }

  .shc-toggle-outline {
    background: transparent;
    border: 1px solid var(--border);
  }

  .shc-toggle-outline:hover {
    background: var(--accent);
    color: var(--accent-foreground);
  }

  .shc-toggle-outline[aria-pressed="true"] {
    background: var(--accent);
    color: var(--accent-foreground);
  }
`

/**
 * Initialize toggle functionality
 */
export function initToggle(shadowRoot: ShadowRoot): void {
  const toggles = shadowRoot.querySelectorAll('[data-toggle]')
  
  toggles.forEach(toggle => {
    const toggleEl = toggle as HTMLButtonElement
    
    // Set initial state if not already set
    if (!toggleEl.hasAttribute('aria-pressed')) {
      toggleEl.setAttribute('aria-pressed', 'false')
    }
    
    // Click handler
    toggleEl.addEventListener('click', () => {
      if (toggleEl.getAttribute('aria-disabled') === 'true') return
      
      const currentPressed = toggleEl.getAttribute('aria-pressed') === 'true'
      const newPressed = !currentPressed
      
      toggleEl.setAttribute('aria-pressed', String(newPressed))
      
      // Dispatch custom event for HA integration
      const event = new CustomEvent('toggle-change', {
        detail: {
          pressed: newPressed,
          value: toggleEl.dataset.value
        },
        bubbles: true,
        composed: true
      })
      toggleEl.dispatchEvent(event)
      
      // Trigger action if defined
      const action = toggleEl.dataset.action
      if (action) {
        const actionEvent = new CustomEvent('ha-action', {
          detail: {
            action,
            pressed: newPressed
          },
          bubbles: true,
          composed: true
        })
        toggleEl.dispatchEvent(actionEvent)
      }
    })
    
    // Keyboard support
    toggleEl.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        toggleEl.click()
      }
    })
  })
}

/**
 * Helper function to create toggle class string
 */
export function toggle(variant?: 'default' | 'outline', size?: 'sm' | 'default' | 'lg'): string {
  const classes = ['shc-toggle']
  
  if (variant === 'outline') {
    classes.push('shc-toggle-outline')
  }
  
  if (size === 'sm') {
    classes.push('shc-toggle-sm')
  } else if (size === 'lg') {
    classes.push('shc-toggle-lg')
  }
  
  return classes.join(' ')
}

/**
 * Component definition for registry
 */
export const toggleComponent = {
  name: 'toggle',
  styles: toggleStyles,
  init: initToggle
}