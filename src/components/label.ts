/**
 * Label Component
 * 
 * Form label with enhanced styling and accessibility support.
 * 
 * @example
 * ```yaml
 * content: |
 *   <label class="shc-label" for="email">Email address</label>
 *   <input id="email" type="email" class="shc-input" />
 * ```
 * 
 * @see https://ui.shadcn.com/docs/components/label
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const labelStyles = `
  /* Base label styles */
  .shc-label {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1;
    color: var(--foreground);
    cursor: pointer;
    user-select: none;
  }

  /* Disabled state */
  .shc-label:has(+ :disabled),
  .shc-label[data-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* Required indicator */
  .shc-label-required::after {
    content: " *";
    color: var(--destructive);
  }

  /* Optional indicator */
  .shc-label-optional::after {
    content: " (optional)";
    font-weight: 400;
    opacity: 0.7;
  }

  /* Error state */
  .shc-label-error {
    color: var(--destructive);
  }

  /* Size variants */
  .shc-label-sm {
    font-size: 0.75rem;
  }

  .shc-label-lg {
    font-size: 1rem;
  }

  /* Description text */
  .shc-label-description {
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.25rem;
    color: var(--muted-foreground);
    margin-top: 0.25rem;
    display: block;
  }

  /* Inline label (for checkboxes/radio) */
  .shc-label-inline {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 400;
  }
`

/**
 * Label component definition
 */
export const labelComponent: ComponentDefinition = {
  name: 'label',
  styles: labelStyles,
}

/**
 * Helper function to generate label class names
 * @param options - Label configuration options
 */
export function label(options?: {
  size?: 'default' | 'sm' | 'lg'
  required?: boolean
  optional?: boolean
  error?: boolean
  inline?: boolean
}): string {
  const baseClass = 'shc-label'
  const classes = [baseClass]
  
  if (options?.size && options.size !== 'default') {
    classes.push(`shc-label-${options.size}`)
  }
  if (options?.required) {
    classes.push('shc-label-required')
  }
  if (options?.optional) {
    classes.push('shc-label-optional')
  }
  if (options?.error) {
    classes.push('shc-label-error')
  }
  if (options?.inline) {
    classes.push('shc-label-inline')
  }
  
  return classes.join(' ')
}