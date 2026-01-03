/**
 * Avatar Component
 *
 * Preact implementation of Shadcn avatar component (CSS-only).
 * Based on shadcn-sourcecode/apps/v4/registry/bases/radix/ui/avatar.tsx
 */

import { ComponentChildren } from 'preact'
import { cn } from '../../lib/utils'

export interface AvatarProps {
  /** Children content (AvatarImage or AvatarFallback) */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function Avatar({ children, className, ...props }: AvatarProps) {
  return (
    <div
      data-slot="avatar"
      class={cn(
        'shc-avatar',
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface AvatarImageProps {
  /** Image source URL */
  src?: string
  /** Alt text */
  alt?: string
  /** Additional className */
  className?: string
}

export function AvatarImage({ src, alt, className, ...props }: AvatarImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      data-slot="avatar-image"
      class={cn('shc-avatar-image', 'aspect-square h-full w-full', className)}
      {...props}
    />
  )
}

export interface AvatarFallbackProps {
  /** Children content (typically initials) */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function AvatarFallback({ children, className, ...props }: AvatarFallbackProps) {
  return (
    <div
      data-slot="avatar-fallback"
      class={cn(
        'shc-avatar-fallback',
        'flex h-full w-full items-center justify-center rounded-full',
        'bg-muted',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Avatar
