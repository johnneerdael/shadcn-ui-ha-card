/**
 * Alert Component
 *
 * Preact implementation of Shadcn alert component.
 * Based on shadcn-sourcecode/apps/v4/registry/bases/radix/ui/alert.tsx
 */

import { ComponentChildren } from 'preact'
import { cn } from '../../lib/utils'

export type AlertVariant = 'default' | 'destructive'

export interface AlertProps {
  /** Alert variant */
  variant?: AlertVariant
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

const variantStyles: Record<AlertVariant, string> = {
  default: 'bg-background text-foreground border-border',
  destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
}

export function Alert({ variant = 'default', children, className, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      data-slot="alert"
      data-variant={variant}
      class={cn(
        'shc-alert',
        'relative w-full rounded-lg border p-4',
        '[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px]',
        '[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4',
        '[&>svg]:text-foreground',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface AlertTitleProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function AlertTitle({ children, className, ...props }: AlertTitleProps) {
  return (
    <h5
      data-slot="alert-title"
      class={cn('shc-alert-title', 'mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h5>
  )
}

export interface AlertDescriptionProps {
  /** Children content */
  children?: ComponentChildren
  /** Additional className */
  className?: string
}

export function AlertDescription({ children, className, ...props }: AlertDescriptionProps) {
  return (
    <div
      data-slot="alert-description"
      class={cn('shc-alert-description', 'text-sm [&_p]:leading-relaxed', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default Alert
