/**
 * Accordion Component
 * 
 * Collapsible content sections with single/multiple expand support.
 * Based on shadcn/ui Accordion with Radix UI patterns.
 * 
 * @example
 * ```html
 * <div class="shc-accordion" data-accordion data-type="single" data-collapsible="true">
 *   <div class="shc-accordion-item" data-value="item-1">
 *     <button class="shc-accordion-trigger" data-accordion-trigger aria-expanded="false">
 *       <span>Section 1</span>
 *       <svg class="shc-accordion-chevron" width="15" height="15" viewBox="0 0 15 15">
 *         <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor"/>
 *       </svg>
 *     </button>
 *     <div class="shc-accordion-content" data-accordion-content>
 *       <div class="shc-accordion-content-inner">
 *         Content for section 1
 *       </div>
 *     </div>
 *   </div>
 * </div>
 * ```
 */

export const accordionStyles = `
  /* Accordion Container */
  .shc-accordion {
    width: 100%;
  }

  /* Accordion Item */
  .shc-accordion-item {
    border-bottom: 1px solid var(--border);
  }

  .shc-accordion-item:last-child {
    border-bottom: none;
  }

  /* Accordion Trigger */
  .shc-accordion-trigger {
    display: flex;
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
    text-align: left;
    background: transparent;
    border: none;
    color: var(--foreground);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .shc-accordion-trigger:hover {
    text-decoration: underline;
  }

  .shc-accordion-trigger:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
    border-radius: 0.25rem;
  }

  .shc-accordion-trigger[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }

  /* Chevron Icon */
  .shc-accordion-chevron {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .shc-accordion-trigger[aria-expanded="true"] .shc-accordion-chevron {
    transform: rotate(180deg);
  }

  /* Accordion Content */
  .shc-accordion-content {
    overflow: hidden;
    font-size: 0.875rem;
    line-height: 1.25rem;
    transition: height 0.2s ease, opacity 0.2s ease;
  }

  .shc-accordion-content[data-state="closed"] {
    height: 0;
    opacity: 0;
  }

  .shc-accordion-content[data-state="open"] {
    opacity: 1;
  }

  .shc-accordion-content-inner {
    padding-bottom: 1rem;
    padding-top: 0;
  }
`

export interface AccordionState {
  type: 'single' | 'multiple'
  collapsible: boolean
  value: string | string[]
}

/**
 * Initialize accordion functionality
 */
export function initAccordion(shadowRoot: ShadowRoot): void {
  const accordions = shadowRoot.querySelectorAll('[data-accordion]')
  
  accordions.forEach(accordion => {
    const accordionEl = accordion as HTMLElement
    const type = (accordionEl.dataset.type || 'single') as 'single' | 'multiple'
    const collapsible = accordionEl.dataset.collapsible === 'true'
    
    // Get all items within this accordion
    const items = accordion.querySelectorAll('[data-accordion-trigger]')
    
    items.forEach(trigger => {
      const triggerEl = trigger as HTMLButtonElement
      const item = triggerEl.closest('[data-value]') as HTMLElement
      const content = item?.querySelector('[data-accordion-content]') as HTMLElement
      
      if (!item || !content) return
      
      const itemValue = item.dataset.value || ''
      
      // Set initial state
      const isExpanded = triggerEl.getAttribute('aria-expanded') === 'true'
      content.dataset.state = isExpanded ? 'open' : 'closed'
      
      // Set initial height for smooth animation
      if (isExpanded) {
        content.style.height = 'auto'
      } else {
        content.style.height = '0'
      }
      
      // Click handler
      triggerEl.addEventListener('click', () => {
        if (triggerEl.getAttribute('aria-disabled') === 'true') return
        
        const currentlyExpanded = triggerEl.getAttribute('aria-expanded') === 'true'
        
        if (type === 'single') {
          // Close all other items first
          const allTriggers = accordion.querySelectorAll('[data-accordion-trigger]')
          allTriggers.forEach(otherTrigger => {
            if (otherTrigger === triggerEl) return
            
            const otherItem = otherTrigger.closest('[data-value]') as HTMLElement
            const otherContent = otherItem?.querySelector('[data-accordion-content]') as HTMLElement
            
            if (otherContent) {
              otherTrigger.setAttribute('aria-expanded', 'false')
              otherContent.dataset.state = 'closed'
              otherContent.style.height = '0'
            }
          })
          
          // Toggle current item
          if (currentlyExpanded && collapsible) {
            closeItem(triggerEl, content)
          } else if (!currentlyExpanded) {
            openItem(triggerEl, content)
          }
        } else {
          // Multiple mode - just toggle current
          if (currentlyExpanded) {
            closeItem(triggerEl, content)
          } else {
            openItem(triggerEl, content)
          }
        }
        
        // Dispatch custom event for HA integration
        const event = new CustomEvent('accordion-change', {
          detail: {
            value: itemValue,
            expanded: !currentlyExpanded
          },
          bubbles: true,
          composed: true
        })
        accordion.dispatchEvent(event)
      })
      
      // Keyboard navigation
      triggerEl.addEventListener('keydown', (e: KeyboardEvent) => {
        const triggers = Array.from(accordion.querySelectorAll('[data-accordion-trigger]')) as HTMLElement[]
        const currentIndex = triggers.indexOf(triggerEl)
        
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            const nextIndex = (currentIndex + 1) % triggers.length
            triggers[nextIndex]?.focus()
            break
          case 'ArrowUp':
            e.preventDefault()
            const prevIndex = (currentIndex - 1 + triggers.length) % triggers.length
            triggers[prevIndex]?.focus()
            break
          case 'Home':
            e.preventDefault()
            triggers[0]?.focus()
            break
          case 'End':
            e.preventDefault()
            triggers[triggers.length - 1]?.focus()
            break
        }
      })
    })
  })
}

function openItem(trigger: HTMLButtonElement, content: HTMLElement): void {
  trigger.setAttribute('aria-expanded', 'true')
  content.dataset.state = 'open'
  
  // Measure and set height for animation
  const inner = content.querySelector('.shc-accordion-content-inner') as HTMLElement
  if (inner) {
    const height = inner.scrollHeight
    content.style.height = `${height}px`
    
    // Reset to auto after animation
    setTimeout(() => {
      if (content.dataset.state === 'open') {
        content.style.height = 'auto'
      }
    }, 200)
  }
}

function closeItem(trigger: HTMLButtonElement, content: HTMLElement): void {
  // Set explicit height before closing for animation
  const inner = content.querySelector('.shc-accordion-content-inner') as HTMLElement
  if (inner) {
    content.style.height = `${inner.scrollHeight}px`
    
    // Force reflow
    content.offsetHeight
  }
  
  trigger.setAttribute('aria-expanded', 'false')
  content.dataset.state = 'closed'
  content.style.height = '0'
}

/**
 * Helper function to create accordion class string
 */
export function accordion(): string {
  return 'shc-accordion'
}

/**
 * Component definition for registry
 */
export const accordionComponent = {
  name: 'accordion',
  styles: accordionStyles,
  init: initAccordion
}