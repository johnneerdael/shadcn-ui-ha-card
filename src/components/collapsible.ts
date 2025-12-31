/**
 * Collapsible Component
 * 
 * Simple show/hide toggle for content sections.
 * Based on shadcn/ui Collapsible with Radix UI patterns.
 * 
 * @example
 * ```html
 * <div class="shc-collapsible" data-collapsible>
 *   <button class="shc-collapsible-trigger" data-collapsible-trigger aria-expanded="false">
 *     Toggle Content
 *   </button>
 *   <div class="shc-collapsible-content" data-collapsible-content>
 *     Hidden content goes here
 *   </div>
 * </div>
 * ```
 */

export const collapsibleStyles = `
  /* Collapsible Container */
  .shc-collapsible {
    width: 100%;
  }

  /* Collapsible Trigger */
  .shc-collapsible-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
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

  .shc-collapsible-trigger:hover {
    background: var(--muted);
  }

  .shc-collapsible-trigger:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  .shc-collapsible-trigger[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }

  /* Collapsible Content */
  .shc-collapsible-content {
    overflow: hidden;
    transition: height 0.2s ease, opacity 0.2s ease;
  }

  .shc-collapsible-content[data-state="closed"] {
    height: 0;
    opacity: 0;
  }

  .shc-collapsible-content[data-state="open"] {
    opacity: 1;
  }

  .shc-collapsible-content-inner {
    padding-top: 0.75rem;
  }
`

/**
 * Initialize collapsible functionality
 */
export function initCollapsible(shadowRoot: ShadowRoot): void {
  const collapsibles = shadowRoot.querySelectorAll('[data-collapsible]')
  
  collapsibles.forEach(collapsible => {
    const trigger = collapsible.querySelector('[data-collapsible-trigger]') as HTMLButtonElement
    const content = collapsible.querySelector('[data-collapsible-content]') as HTMLElement
    
    if (!trigger || !content) return
    
    // Set initial state
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true'
    content.dataset.state = isExpanded ? 'open' : 'closed'
    
    // Set initial height
    if (isExpanded) {
      content.style.height = 'auto'
    } else {
      content.style.height = '0'
    }
    
    // Click handler
    trigger.addEventListener('click', () => {
      if (trigger.getAttribute('aria-disabled') === 'true') return
      
      const currentlyExpanded = trigger.getAttribute('aria-expanded') === 'true'
      
      if (currentlyExpanded) {
        closeCollapsible(trigger, content)
      } else {
        openCollapsible(trigger, content)
      }
      
      // Dispatch custom event for HA integration
      const event = new CustomEvent('collapsible-change', {
        detail: {
          expanded: !currentlyExpanded
        },
        bubbles: true,
        composed: true
      })
      collapsible.dispatchEvent(event)
    })
    
    // Keyboard support
    trigger.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        trigger.click()
      }
    })
  })
}

function openCollapsible(trigger: HTMLButtonElement, content: HTMLElement): void {
  trigger.setAttribute('aria-expanded', 'true')
  content.dataset.state = 'open'
  
  // Measure and set height for animation
  const inner = content.querySelector('.shc-collapsible-content-inner') as HTMLElement
  if (inner) {
    const height = inner.scrollHeight
    content.style.height = `${height}px`
    
    // Reset to auto after animation
    setTimeout(() => {
      if (content.dataset.state === 'open') {
        content.style.height = 'auto'
      }
    }, 200)
  } else {
    // If no inner wrapper, use content's scrollHeight
    const height = content.scrollHeight
    content.style.height = `${height}px`
    
    setTimeout(() => {
      if (content.dataset.state === 'open') {
        content.style.height = 'auto'
      }
    }, 200)
  }
}

function closeCollapsible(trigger: HTMLButtonElement, content: HTMLElement): void {
  // Set explicit height before closing for animation
  const currentHeight = content.scrollHeight
  content.style.height = `${currentHeight}px`
  
  // Force reflow
  content.offsetHeight
  
  trigger.setAttribute('aria-expanded', 'false')
  content.dataset.state = 'closed'
  content.style.height = '0'
}

/**
 * Helper function to create collapsible class string
 */
export function collapsible(): string {
  return 'shc-collapsible'
}

/**
 * Component definition for registry
 */
export const collapsibleComponent = {
  name: 'collapsible',
  styles: collapsibleStyles,
  init: initCollapsible
}