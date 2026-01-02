/**
 * Input Component
 *
 * Text input field for forms and user input.
 * Based on shadcn/ui Input component.
 *
 * @example
 * ```html
 * <input type="text" class="shc-input" placeholder="Enter value..." />
 * <input type="number" class="shc-input" />
 * <input type="text" class="shc-input" disabled />
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/input
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const inputStyles = `
  /* Base input styles */
  .shc-input {
    display: flex;
    height: 2.25rem;
    width: 100%;
    min-width: 0;
    border-radius: 0.375rem;
    border: 1px solid var(--input);
    background-color: transparent;
    padding: 0.25rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--foreground);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: color 0.2s, box-shadow 0.2s, border-color 0.2s;
    outline: none;
  }

  @media (min-width: 768px) {
    .shc-input {
      font-size: 0.875rem;
    }
  }

  /* Placeholder */
  .shc-input::placeholder {
    color: var(--muted-foreground);
  }

  /* Text selection */
  .shc-input::selection {
    background-color: var(--primary);
    color: var(--primary-foreground);
  }

  /* Focus state */
  .shc-input:focus,
  .shc-input:focus-visible {
    border-color: var(--ring);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ring) 50%, transparent);
  }

  /* Disabled state */
  .shc-input:disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* Invalid state */
  .shc-input[aria-invalid="true"],
  .shc-input:invalid {
    border-color: var(--destructive);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--destructive) 20%, transparent);
  }

  /* File input styling */
  .shc-input[type="file"]::file-selector-button {
    display: inline-flex;
    height: 1.75rem;
    border: 0;
    background-color: transparent;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--foreground);
    cursor: pointer;
  }

  /* Size variants */
  .shc-input-sm {
    height: 1.75rem;
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 0.25rem;
  }

  .shc-input-lg {
    height: 2.75rem;
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  /* Dark mode adjustments */
  @media (prefers-color-scheme: dark) {
    .shc-input {
      background-color: color-mix(in srgb, var(--input) 30%, transparent);
    }
  }
`

/**
 * Input component definition
 */
export const inputComponent: ComponentDefinition = {
  name: 'input',
  styles: inputStyles,
}

/**
 * Helper function to generate input class names
 * @param size - 'default', 'sm', or 'lg'
 */
export function input(size: 'default' | 'sm' | 'lg' = 'default'): string {
  const classes = ['shc-input']

  if (size !== 'default') {
    classes.push(`shc-input-${size}`)
  }

  return classes.join(' ')
}
