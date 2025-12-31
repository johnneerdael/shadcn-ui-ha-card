/**
 * RadioGroup Component
 * 
 * Radio button group with single selection state.
 * Based on shadcn/ui RadioGroup with Radix UI patterns.
 * 
 * @example
 * ```html
 * <div class="shc-radio-group" data-radio-group role="radiogroup" aria-label="Options">
 *   <label class="shc-radio-item">
 *     <button class="shc-radio-button" data-radio role="radio" aria-checked="false" data-value="option1">
 *       <span class="shc-radio-indicator"></span>
 *     </button>
 *     <span class="shc-radio-label">Option 1</span>
 *   </label>
 *   <label class="shc-radio-item">
 *     <button class="shc-radio-button" data-radio role="radio" aria-checked="false" data-value="option2">
 *       <span class="shc-radio-indicator"></span>
 *     </button>
 *     <span class="shc-radio-label">Option 2</span>
 *   </label>
 * </div>
 * ```
 */

export const radioGroupStyles = `
  /* Radio Group Container */
  .shc-radio-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  /* Radio Item (label wrapper) */
  .shc-radio-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  /* Radio Button */
  .shc-radio-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    background: transparent;
    border: 2px solid var(--primary);
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
  }

  .shc-radio-button:hover {
    background: var(--muted);
  }

  .shc-radio-button:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  .shc-radio-button[aria-checked="true"] {
    border-color: var(--primary);
  }

  .shc-radio-button[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }

  /* Radio Indicator (inner dot) */
  .shc-radio-indicator {
    display: block;
    width: 0.625rem;
    height: 0.625rem;
    background: var(--primary);
    border-radius: 9999px;
    opacity: 0;
    transform: scale(0);
    transition: all 0.2s ease;
  }

  .shc-radio-button[aria-checked="true"] .shc-radio-indicator {
    opacity: 1;
    transform: scale(1);
  }

  /* Radio Label */
  .shc-radio-label {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--foreground);
    user-select: none;
  }

  /* Horizontal Layout */
  .shc-radio-group[data-orientation="horizontal"] {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }
`

/**
 * Initialize radio group functionality
 */
export function initRadioGroup(shadowRoot: ShadowRoot): void {
  const radioGroups = shadowRoot.querySelectorAll('[data-radio-group]')
  
  radioGroups.forEach(group => {
    const groupEl = group as HTMLElement
    const radios = Array.from(group.querySelectorAll('[data-radio]')) as HTMLButtonElement[]
    
    if (radios.length === 0) return
    
    // Ensure role is set
    if (!groupEl.hasAttribute('role')) {
      groupEl.setAttribute('role', 'radiogroup')
    }
    
    // Set initial checked state
    const checkedRadio = radios.find(r => r.getAttribute('aria-checked') === 'true')
    if (!checkedRadio && radios.length > 0) {
      // If no radio is checked, check the first one by default (optional behavior)
      // Comment out these lines if you want no default selection
      // radios[0].setAttribute('aria-checked', 'true')
    }
    
    radios.forEach((radio, index) => {
      // Ensure role is set
      if (!radio.hasAttribute('role')) {
        radio.setAttribute('role', 'radio')
      }
      
      // Set initial checked state if not set
      if (!radio.hasAttribute('aria-checked')) {
        radio.setAttribute('aria-checked', 'false')
      }
      
      // Set tabindex for keyboard navigation
      const isChecked = radio.getAttribute('aria-checked') === 'true'
      radio.setAttribute('tabindex', isChecked ? '0' : '-1')
      
      // Click handler
      radio.addEventListener('click', () => {
        if (radio.getAttribute('aria-disabled') === 'true') return
        
        selectRadio(group, radio, radios)
      })
      
      // Keyboard navigation
      radio.addEventListener('keydown', (e: KeyboardEvent) => {
        if (radio.getAttribute('aria-disabled') === 'true') return
        
        let targetIndex = index
        
        switch (e.key) {
          case 'ArrowDown':
          case 'ArrowRight':
            e.preventDefault()
            targetIndex = (index + 1) % radios.length
            break
          case 'ArrowUp':
          case 'ArrowLeft':
            e.preventDefault()
            targetIndex = (index - 1 + radios.length) % radios.length
            break
          case ' ':
          case 'Enter':
            e.preventDefault()
            selectRadio(group, radio, radios)
            return
          default:
            return
        }
        
        // Focus and select the target radio
        const targetRadio = radios[targetIndex]
        if (targetRadio && targetRadio.getAttribute('aria-disabled') !== 'true') {
          selectRadio(group, targetRadio, radios)
          targetRadio.focus()
        }
      })
      
      // Handle label clicks
      const item = radio.closest('.shc-radio-item') as HTMLLabelElement
      if (item && item.tagName === 'LABEL') {
        item.addEventListener('click', (e) => {
          // Prevent double-firing if radio was clicked directly
          if (e.target === radio) return
          e.preventDefault()
          if (radio.getAttribute('aria-disabled') !== 'true') {
            selectRadio(group, radio, radios)
          }
        })
      }
    })
  })
}

function selectRadio(group: Element, selectedRadio: HTMLButtonElement, allRadios: HTMLButtonElement[]): void {
  // Uncheck all radios in the group
  allRadios.forEach(radio => {
    radio.setAttribute('aria-checked', 'false')
    radio.setAttribute('tabindex', '-1')
  })
  
  // Check the selected radio
  selectedRadio.setAttribute('aria-checked', 'true')
  selectedRadio.setAttribute('tabindex', '0')
  
  const value = selectedRadio.dataset.value
  
  // Dispatch custom event for HA integration
  const event = new CustomEvent('radio-change', {
    detail: {
      value: value
    },
    bubbles: true,
    composed: true
  })
  group.dispatchEvent(event)
  
  // Trigger action if defined
  const action = selectedRadio.dataset.action || (group as HTMLElement).dataset.action
  if (action) {
    const actionEvent = new CustomEvent('ha-action', {
      detail: {
        action,
        value: value
      },
      bubbles: true,
      composed: true
    })
    group.dispatchEvent(actionEvent)
  }
}

/**
 * Helper function to create radio group class string
 */
export function radioGroup(_orientation?: 'vertical' | 'horizontal'): string {
  return 'shc-radio-group'
}

/**
 * Component definition for registry
 */
export const radioGroupComponent = {
  name: 'radio-group',
  styles: radioGroupStyles,
  init: initRadioGroup
}