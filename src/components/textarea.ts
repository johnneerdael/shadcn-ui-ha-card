/**
 * Textarea Component
 * 
 * Enhanced multiline text input with resizing options and better styling.
 * 
 * @example
 * ```yaml
 * content: |
 *   <textarea class="shc-textarea" placeholder="Enter your message..."></textarea>
 *   <textarea class="shc-textarea shc-textarea-fixed" rows="4"></textarea>
 * ```
 * 
 * @see https://ui.shadcn.com/docs/components/textarea
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const textareaStyles = `
  /* Base textarea styles */
  .shc-textarea {
    display: flex;
    min-height: 5rem;
    width: 100%;
    border-radius: var(--radius, 0.5rem);
    border: 1px solid var(--border);
    background-color: var(--background);
    padding: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: var(--foreground);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: all 0.2s;
    resize: vertical;
  }

  .shc-textarea::placeholder {
    color: var(--muted-foreground);
  }

  .shc-textarea:focus {
    outline: none;
    border-color: var(--ring);
    box-shadow: 0 0 0 2px var(--ring), 0 0 0 4px var(--background);
  }

  .shc-textarea:focus-visible {
    outline: none;
    ring: 2px;
    ring-color: var(--ring);
    ring-offset: 2px;
    ring-offset-color: var(--background);
  }

  .shc-textarea:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* Resize variants */
  .shc-textarea-fixed {
    resize: none;
  }

  .shc-textarea-horizontal {
    resize: horizontal;
  }

  .shc-textarea-both {
    resize: both;
  }

  /* Size variants */
  .shc-textarea-sm {
    min-height: 3.5rem;
    padding: 0.5rem;
    font-size: 0.75rem;
  }

  .shc-textarea-lg {
    min-height: 7rem;
    padding: 1rem;
    font-size: 1rem;
  }

  /* Error state */
  .shc-textarea-error {
    border-color: var(--destructive);
  }

  .shc-textarea-error:focus {
    border-color: var(--destructive);
    box-shadow: 0 0 0 2px var(--destructive), 0 0 0 4px var(--background);
  }

  /* Success state */
  .shc-textarea-success {
    border-color: var(--success, #22c55e);
  }

  .shc-textarea-success:focus {
    border-color: var(--success, #22c55e);
    box-shadow: 0 0 0 2px var(--success, #22c55e), 0 0 0 4px var(--background);
  }

  /* Character count */
  .shc-textarea-wrapper {
    position: relative;
    width: 100%;
  }

  .shc-textarea-count {
    position: absolute;
    bottom: 0.5rem;
    right: 0.75rem;
    font-size: 0.75rem;
    color: var(--muted-foreground);
    pointer-events: none;
  }

  .shc-textarea-wrapper .shc-textarea {
    padding-bottom: 2rem;
  }
`

/**
 * Textarea component definition
 */
export const textareaComponent: ComponentDefinition = {
  name: 'textarea',
  styles: textareaStyles,
}

/**
 * Helper function to generate textarea class names
 * @param options - Textarea configuration options
 */
export function textarea(options?: {
  size?: 'default' | 'sm' | 'lg'
  resize?: 'vertical' | 'fixed' | 'horizontal' | 'both'
  error?: boolean
  success?: boolean
}): string {
  const baseClass = 'shc-textarea'
  const classes = [baseClass]
  
  if (options?.size && options.size !== 'default') {
    classes.push(`shc-textarea-${options.size}`)
  }
  if (options?.resize && options.resize !== 'vertical') {
    classes.push(`shc-textarea-${options.resize}`)
  }
  if (options?.error) {
    classes.push('shc-textarea-error')
  }
  if (options?.success) {
    classes.push('shc-textarea-success')
  }
  
  return classes.join(' ')
}