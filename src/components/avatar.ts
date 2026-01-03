/**
 * Avatar Component
 * 
 * User profile image with fallback text initials and status indicator support.
 * 
 * @example
 * ```yaml
 * content: |
 *   <div class="shc-avatar">
 *     <img src="/path/to/image.jpg" alt="User" class="shc-avatar-image" />
 *     <div class="shc-avatar-fallback">AB</div>
 *   </div>
 * ```
 * 
 * @see https://ui.shadcn.com/docs/components/avatar
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const avatarStyles = `
  /* Avatar container */
  .shc-avatar {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    overflow: hidden;
    user-select: none;
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    background-color: var(--muted);
  }

  /* Avatar image */
  .shc-avatar-image {
    aspect-ratio: 1 / 1;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  /* Avatar fallback (initials) */
  .shc-avatar-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: var(--muted);
    color: var(--muted-foreground);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1;
  }

  /* Hide fallback when image loads */
  .shc-avatar-image:not([src=""]) ~ .shc-avatar-fallback {
    display: none;
  }

  /* Size variants */
  .shc-avatar-sm {
    width: 2rem;
    height: 2rem;
  }

  .shc-avatar-sm .shc-avatar-fallback {
    font-size: 0.75rem;
  }

  .shc-avatar-lg {
    width: 3rem;
    height: 3rem;
  }

  .shc-avatar-lg .shc-avatar-fallback {
    font-size: 1rem;
  }

  .shc-avatar-xl {
    width: 4rem;
    height: 4rem;
  }

  .shc-avatar-xl .shc-avatar-fallback {
    font-size: 1.25rem;
  }

  /* Status indicator */
  .shc-avatar-status {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 9999px;
    border: 2px solid var(--background);
  }

  .shc-avatar-status-online {
    background-color: var(--success, #22c55e);
  }

  .shc-avatar-status-offline {
    background-color: var(--muted-foreground);
  }

  .shc-avatar-status-busy {
    background-color: var(--destructive, #ef4444);
  }

  .shc-avatar-status-away {
    background-color: var(--warning, #f59e0b);
  }
`

/**
 * Avatar component definition
 */
export const avatarComponent: ComponentDefinition = {
  name: 'avatar',
  styles: avatarStyles,
}

/**
 * Helper function to generate avatar class names
 * @param size - 'default', 'sm', 'lg', or 'xl'
 */
export function avatar(size: 'default' | 'sm' | 'lg' | 'xl' = 'default'): string {
  return size === 'default' ? 'shc-avatar' : `shc-avatar shc-avatar-${size}`
}