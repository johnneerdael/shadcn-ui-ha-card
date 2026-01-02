/**
 * Form Component
 *
 * Form wrapper with validation patterns and styling.
 * Based on shadcn/ui Form (integrates with validation libraries like Zod).
 *
 * Useful for: Device setup wizards, settings forms, entity configuration.
 *
 * @example
 * ```html
 * <form class="shc-form">
 *   <div class="shc-form-field">
 *     <label class="shc-form-label" for="device-name">Device Name</label>
 *     <input type="text" id="device-name" class="shc-input" required />
 *     <p class="shc-form-description">The friendly name for this device</p>
 *     <p class="shc-form-message" data-error>This field is required</p>
 *   </div>
 *
 *   <div class="shc-form-field">
 *     <label class="shc-form-label" for="ip">IP Address</label>
 *     <input type="text" id="ip" class="shc-input" pattern="\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}" />
 *     <p class="shc-form-message" data-error>Invalid IP address format</p>
 *   </div>
 *
 *   <div class="shc-form-actions">
 *     <button type="submit" class="shc-btn shc-btn-primary">Save</button>
 *     <button type="button" class="shc-btn shc-btn-outline">Cancel</button>
 *   </div>
 * </form>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/form
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const formStyles = `
  /* Form container */
  .shc-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Form field (label + input + description + error) */
  .shc-form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* Form label */
  .shc-form-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--foreground);
  }

  .shc-form-label[data-required="true"]::after {
    content: ' *';
    color: var(--destructive);
  }

  /* Form description (helper text) */
  .shc-form-description {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--muted-foreground);
  }

  /* Form message (error/success) */
  .shc-form-message {
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 500;
    display: none;
  }

  .shc-form-message[data-error] {
    color: var(--destructive);
  }

  .shc-form-message[data-success] {
    color: var(--success);
  }

  /* Show error messages when field is invalid */
  .shc-form-field:has(input:invalid:not(:placeholder-shown)) .shc-form-message[data-error],
  .shc-form-field:has(select:invalid) .shc-form-message[data-error],
  .shc-form-field[data-error="true"] .shc-form-message[data-error] {
    display: block;
  }

  /* Show success messages when explicitly marked */
  .shc-form-field[data-success="true"] .shc-form-message[data-success] {
    display: block;
  }

  /* Invalid field styling */
  .shc-form-field:has(input:invalid:not(:placeholder-shown)) input,
  .shc-form-field[data-error="true"] input,
  .shc-form-field[data-error="true"] select {
    border-color: var(--destructive);
  }

  .shc-form-field:has(input:invalid:not(:placeholder-shown)) input:focus,
  .shc-form-field[data-error="true"] input:focus {
    box-shadow: 0 0 0 2px var(--destructive);
  }

  /* Valid field styling */
  .shc-form-field[data-success="true"] input,
  .shc-form-field[data-success="true"] select {
    border-color: var(--success);
  }

  /* Form actions (buttons) */
  .shc-form-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }

  /* Inline form (horizontal layout) */
  .shc-form-inline {
    flex-direction: row;
    align-items: flex-end;
  }

  .shc-form-inline .shc-form-field {
    flex: 1;
  }

  /* Loading state */
  .shc-form[data-loading="true"] {
    opacity: 0.6;
    pointer-events: none;
  }

  .shc-form[data-loading="true"]::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2rem;
    height: 2rem;
    margin: -1rem 0 0 -1rem;
    border: 2px solid var(--muted);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: shc-spin 0.75s linear infinite;
  }
`

export const formComponent: ComponentDefinition = {
  name: 'form',
  styles: formStyles,
  description: 'Form wrapper with validation and error messaging',
}

/**
 * Generate form classes
 */
export function form(inline = false): string {
  const classes = ['shc-form']
  if (inline) {
    classes.push('shc-form-inline')
  }
  return classes.join(' ')
}

export function formField(): string {
  return 'shc-form-field'
}

export function formLabel(): string {
  return 'shc-form-label'
}

export function formDescription(): string {
  return 'shc-form-description'
}

export function formMessage(): string {
  return 'shc-form-message'
}

export function formActions(): string {
  return 'shc-form-actions'
}

/**
 * Initialize form with validation
 */
export function initForm(form: HTMLFormElement): () => void {
  const handleSubmit = (e: Event) => {
    e.preventDefault()

    // Validate all fields
    const fields = form.querySelectorAll('.shc-form-field')
    let isValid = true

    fields.forEach((field) => {
      const input = field.querySelector('input, select, textarea')
      if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement) {
        if (!input.checkValidity()) {
          field.setAttribute('data-error', 'true')
          isValid = false
        } else {
          field.removeAttribute('data-error')
        }
      }
    })

    if (isValid) {
      // Form is valid, emit custom event
      form.dispatchEvent(new CustomEvent('form-valid', { detail: new FormData(form) }))
    }
  }

  form.addEventListener('submit', handleSubmit)

  // Cleanup
  return () => {
    form.removeEventListener('submit', handleSubmit)
  }
}
