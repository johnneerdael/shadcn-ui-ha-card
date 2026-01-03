/**
 * InputOTP Component
 *
 * One-Time Password / PIN input with individual digit fields.
 * Based on shadcn/ui InputOTP.
 *
 * Useful for: Alarm PIN entry, parental controls, 2FA codes.
 *
 * @example
 * ```html
 * <div class="shc-input-otp" data-length="4">
 *   <input type="text" class="shc-input-otp-slot" maxlength="1" pattern="[0-9]" inputmode="numeric" />
 *   <input type="text" class="shc-input-otp-slot" maxlength="1" pattern="[0-9]" inputmode="numeric" />
 *   <input type="text" class="shc-input-otp-slot" maxlength="1" pattern="[0-9]" inputmode="numeric" />
 *   <input type="text" class="shc-input-otp-slot" maxlength="1" pattern="[0-9]" inputmode="numeric" />
 * </div>
 *
 * <!-- With separator -->
 * <div class="shc-input-otp" data-length="6">
 *   <input type="text" class="shc-input-otp-slot" maxlength="1" />
 *   <input type="text" class="shc-input-otp-slot" maxlength="1" />
 *   <input type="text" class="shc-input-otp-slot" maxlength="1" />
 *   <div class="shc-input-otp-separator"></div>
 *   <input type="text" class="shc-input-otp-slot" maxlength="1" />
 *   <input type="text" class="shc-input-otp-slot" maxlength="1" />
 *   <input type="text" class="shc-input-otp-slot" maxlength="1" />
 * </div>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/input-otp
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const inputOTPStyles = `
  /* OTP container */
  .shc-input-otp {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Individual digit slot */
  .shc-input-otp-slot {
    width: 2.5rem;
    height: 2.5rem;
    text-align: center;
    font-size: 1.25rem;
    font-weight: 600;
    font-family: monospace;
    color: var(--foreground);
    background-color: var(--background);
    border: 2px solid var(--border);
    border-radius: var(--radius, 0.375rem);
    outline: none;
    transition: all 150ms ease;
  }

  .shc-input-otp-slot:focus {
    border-color: var(--ring);
    box-shadow: 0 0 0 2px var(--ring);
  }

  .shc-input-otp-slot:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Filled state */
  .shc-input-otp-slot[data-filled="true"] {
    border-color: var(--primary);
  }

  /* Error state */
  .shc-input-otp[data-error="true"] .shc-input-otp-slot {
    border-color: var(--destructive);
  }

  .shc-input-otp[data-error="true"] .shc-input-otp-slot:focus {
    box-shadow: 0 0 0 2px var(--destructive);
  }

  /* Separator between groups */
  .shc-input-otp-separator {
    width: 1px;
    height: 2rem;
    background-color: var(--border);
  }

  /* Size variants */
  .shc-input-otp-sm .shc-input-otp-slot {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
  }

  .shc-input-otp-lg .shc-input-otp-slot {
    width: 3rem;
    height: 3rem;
    font-size: 1.5rem;
  }

  /* Loading state */
  .shc-input-otp[data-loading="true"] .shc-input-otp-slot {
    opacity: 0.6;
    pointer-events: none;
  }
`

export const inputOTPComponent: ComponentDefinition = {
  name: 'input-otp',
  styles: inputOTPStyles,
  description: 'One-Time Password / PIN input with individual digit fields',
}

/**
 * Generate input OTP classes
 */
export function inputOTP(size: 'default' | 'sm' | 'lg' = 'default'): string {
  const classes = ['shc-input-otp']
  if (size !== 'default') {
    classes.push(`shc-input-otp-${size}`)
  }
  return classes.join(' ')
}

export function inputOTPSlot(): string {
  return 'shc-input-otp-slot'
}

export function inputOTPSeparator(): string {
  return 'shc-input-otp-separator'
}

/**
 * Initialize input OTP with auto-focus and auto-advance behavior
 */
export function initInputOTP(container: HTMLElement): () => void {
  const slots = Array.from(container.querySelectorAll<HTMLInputElement>('.shc-input-otp-slot'))

  if (slots.length === 0) return () => {}

  const updateFilled = () => {
    slots.forEach((slot) => {
      slot.setAttribute('data-filled', slot.value.length > 0 ? 'true' : 'false')
    })
  }

  const handleInput = (index: number) => (e: Event) => {
    const input = e.target as HTMLInputElement
    const value = input.value

    // Only allow single character
    if (value.length > 1) {
      input.value = value.slice(0, 1)
    }

    updateFilled()

    // Auto-advance to next slot
    if (value.length === 1 && index < slots.length - 1) {
      slots[index + 1].focus()
    }
  }

  const handleKeyDown = (index: number) => (e: KeyboardEvent) => {
    const input = e.target as HTMLInputElement

    // Backspace: clear and move to previous
    if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
      slots[index - 1].focus()
      slots[index - 1].value = ''
      updateFilled()
    }

    // Arrow keys navigation
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      slots[index - 1].focus()
    }

    if (e.key === 'ArrowRight' && index < slots.length - 1) {
      e.preventDefault()
      slots[index + 1].focus()
    }
  }

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault()
    const paste = e.clipboardData?.getData('text') || ''
    const chars = paste.replace(/\D/g, '').split('') // Extract digits only

    chars.forEach((char, i) => {
      if (i < slots.length) {
        slots[i].value = char
      }
    })

    updateFilled()

    // Focus last filled slot or first empty
    const lastFilled = Math.min(chars.length, slots.length) - 1
    if (lastFilled >= 0) {
      slots[lastFilled].focus()
    }
  }

  // Attach listeners
  slots.forEach((slot, index) => {
    slot.addEventListener('input', handleInput(index))
    slot.addEventListener('keydown', handleKeyDown(index))
    slot.addEventListener('paste', handlePaste)
  })

  // Initial state
  updateFilled()

  // Cleanup
  return () => {
    slots.forEach((slot, index) => {
      slot.removeEventListener('input', handleInput(index))
      slot.removeEventListener('keydown', handleKeyDown(index))
      slot.removeEventListener('paste', handlePaste)
    })
  }
}

/**
 * Get the complete OTP value from all slots
 */
export function getOTPValue(container: HTMLElement): string {
  const slots = container.querySelectorAll<HTMLInputElement>('.shc-input-otp-slot')
  return Array.from(slots)
    .map((slot) => slot.value)
    .join('')
}

/**
 * Clear all OTP slots
 */
export function clearOTP(container: HTMLElement): void {
  const slots = container.querySelectorAll<HTMLInputElement>('.shc-input-otp-slot')
  slots.forEach((slot) => {
    slot.value = ''
    slot.setAttribute('data-filled', 'false')
  })
  if (slots.length > 0) {
    (slots[0] as HTMLInputElement).focus()
  }
}
