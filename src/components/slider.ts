/**
 * Slider Component
 * 
 * Range slider with value state and drag interaction.
 * Based on shadcn/ui Slider with Radix UI patterns.
 * 
 * @example
 * ```html
 * <div class="shc-slider" data-slider data-min="0" data-max="100" data-step="1" data-value="50">
 *   <div class="shc-slider-track">
 *     <div class="shc-slider-range"></div>
 *   </div>
 *   <div class="shc-slider-thumb" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" tabindex="0"></div>
 * </div>
 * ```
 */

export const sliderStyles = `
  /* Slider Container */
  .shc-slider {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    touch-action: none;
    user-select: none;
    cursor: pointer;
  }

  /* Slider Track */
  .shc-slider-track {
    position: relative;
    flex-grow: 1;
    height: 0.5rem;
    background: var(--muted);
    border-radius: 9999px;
    overflow: hidden;
  }

  /* Slider Range (filled portion) */
  .shc-slider-range {
    position: absolute;
    height: 100%;
    background: var(--primary);
    border-radius: 9999px;
    transition: width 0.05s ease;
  }

  /* Slider Thumb */
  .shc-slider-thumb {
    position: absolute;
    display: block;
    width: 1.25rem;
    height: 1.25rem;
    background: white;
    border: 2px solid var(--primary);
    border-radius: 9999px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    cursor: grab;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .shc-slider-thumb:hover {
    transform: scale(1.1);
  }

  .shc-slider-thumb:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  .shc-slider-thumb:active,
  .shc-slider-thumb[data-dragging="true"] {
    cursor: grabbing;
    transform: scale(1.15);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .shc-slider[aria-disabled="true"] {
    opacity: 0.5;
    pointer-events: none;
  }

  .shc-slider[aria-disabled="true"] .shc-slider-thumb {
    cursor: not-allowed;
  }

  /* Vertical Slider */
  .shc-slider[data-orientation="vertical"] {
    flex-direction: column;
    height: 200px;
    width: auto;
  }

  .shc-slider[data-orientation="vertical"] .shc-slider-track {
    width: 0.5rem;
    height: 100%;
  }

  .shc-slider[data-orientation="vertical"] .shc-slider-range {
    width: 100%;
    height: auto;
    bottom: 0;
  }
`

interface SliderState {
  min: number
  max: number
  step: number
  value: number
  isDragging: boolean
}

/**
 * Initialize slider functionality
 */
export function initSlider(shadowRoot: ShadowRoot): void {
  const sliders = shadowRoot.querySelectorAll('[data-slider]')
  
  sliders.forEach(slider => {
    const sliderEl = slider as HTMLElement
    const track = slider.querySelector('.shc-slider-track') as HTMLElement
    const range = slider.querySelector('.shc-slider-range') as HTMLElement
    const thumb = slider.querySelector('.shc-slider-thumb') as HTMLElement
    
    if (!track || !range || !thumb) return
    
    // Parse slider configuration
    const state: SliderState = {
      min: parseFloat(sliderEl.dataset.min || '0'),
      max: parseFloat(sliderEl.dataset.max || '100'),
      step: parseFloat(sliderEl.dataset.step || '1'),
      value: parseFloat(sliderEl.dataset.value || '0'),
      isDragging: false
    }
    
    // Initialize position
    updateSliderPosition(sliderEl, track, range, thumb, state)
    
    // Mouse/Touch drag handlers
    let startX = 0
    let startValue = 0
    
    const handleStart = (e: MouseEvent | TouchEvent) => {
      if (sliderEl.getAttribute('aria-disabled') === 'true') return
      
      e.preventDefault()
      state.isDragging = true
      thumb.dataset.dragging = 'true'
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      startX = clientX
      startValue = state.value
      
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchmove', handleMove)
      document.addEventListener('touchend', handleEnd)
    }
    
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!state.isDragging) return
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const rect = track.getBoundingClientRect()
      const offsetX = clientX - rect.left
      const percentage = Math.max(0, Math.min(1, offsetX / rect.width))
      
      const rawValue = state.min + percentage * (state.max - state.min)
      const steppedValue = Math.round(rawValue / state.step) * state.step
      state.value = Math.max(state.min, Math.min(state.max, steppedValue))
      
      updateSliderPosition(sliderEl, track, range, thumb, state)
      
      // Dispatch change event while dragging (for live updates)
      dispatchSliderEvent(slider, state, 'slider-input')
    }
    
    const handleEnd = () => {
      if (!state.isDragging) return
      
      state.isDragging = false
      thumb.dataset.dragging = 'false'
      
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
      
      // Dispatch final change event
      dispatchSliderEvent(slider, state, 'slider-change')
    }
    
    // Attach event listeners
    thumb.addEventListener('mousedown', handleStart)
    thumb.addEventListener('touchstart', handleStart)
    
    // Click on track to jump to position
    track.addEventListener('click', (e: MouseEvent) => {
      if (sliderEl.getAttribute('aria-disabled') === 'true') return
      if (e.target === thumb) return
      
      const rect = track.getBoundingClientRect()
      const offsetX = e.clientX - rect.left
      const percentage = Math.max(0, Math.min(1, offsetX / rect.width))
      
      const rawValue = state.min + percentage * (state.max - state.min)
      const steppedValue = Math.round(rawValue / state.step) * state.step
      state.value = Math.max(state.min, Math.min(state.max, steppedValue))
      
      updateSliderPosition(sliderEl, track, range, thumb, state)
      dispatchSliderEvent(slider, state, 'slider-change')
    })
    
    // Keyboard support
    thumb.addEventListener('keydown', (e: KeyboardEvent) => {
      if (sliderEl.getAttribute('aria-disabled') === 'true') return
      
      let handled = false
      const largeStep = (state.max - state.min) / 10
      
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault()
          state.value = Math.min(state.max, state.value + state.step)
          handled = true
          break
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault()
          state.value = Math.max(state.min, state.value - state.step)
          handled = true
          break
        case 'PageUp':
          e.preventDefault()
          state.value = Math.min(state.max, state.value + largeStep)
          handled = true
          break
        case 'PageDown':
          e.preventDefault()
          state.value = Math.max(state.min, state.value - largeStep)
          handled = true
          break
        case 'Home':
          e.preventDefault()
          state.value = state.min
          handled = true
          break
        case 'End':
          e.preventDefault()
          state.value = state.max
          handled = true
          break
      }
      
      if (handled) {
        updateSliderPosition(sliderEl, track, range, thumb, state)
        dispatchSliderEvent(slider, state, 'slider-change')
      }
    })
  })
}

function updateSliderPosition(
  slider: HTMLElement,
  track: HTMLElement,
  range: HTMLElement,
  thumb: HTMLElement,
  state: SliderState
): void {
  const percentage = ((state.value - state.min) / (state.max - state.min)) * 100
  
  // Update range width
  range.style.width = `${percentage}%`
  
  // Update thumb position (accounting for thumb width)
  const thumbWidth = thumb.offsetWidth
  const trackWidth = track.offsetWidth
  const thumbOffset = (percentage / 100) * (trackWidth - thumbWidth)
  thumb.style.left = `${thumbOffset}px`
  
  // Update ARIA attributes
  thumb.setAttribute('aria-valuenow', String(state.value))
  thumb.setAttribute('aria-valuemin', String(state.min))
  thumb.setAttribute('aria-valuemax', String(state.max))
  
  // Update data attribute
  slider.dataset.value = String(state.value)
}

function dispatchSliderEvent(slider: Element, state: SliderState, eventName: string): void {
  const event = new CustomEvent(eventName, {
    detail: {
      value: state.value,
      min: state.min,
      max: state.max
    },
    bubbles: true,
    composed: true
  })
  slider.dispatchEvent(event)
  
  // Trigger HA action on change (not on input for performance)
  if (eventName === 'slider-change') {
    const action = (slider as HTMLElement).dataset.action
    if (action) {
      const actionEvent = new CustomEvent('ha-action', {
        detail: {
          action,
          value: state.value
        },
        bubbles: true,
        composed: true
      })
      slider.dispatchEvent(actionEvent)
    }
  }
}

/**
 * Helper function to create slider class string
 */
export function slider(): string {
  return 'shc-slider'
}

/**
 * Component definition for registry
 */
export const sliderComponent = {
  name: 'slider',
  styles: sliderStyles,
  init: initSlider
}