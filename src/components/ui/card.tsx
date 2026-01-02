/**
 * Card Component (Preact)
 *
 * Container component for grouping related content.
 * Based on shadcn/ui Card with Home Assistant integration.
 *
 * @see https://ui.shadcn.com/docs/components/card
 */

import { ComponentChildren } from 'preact'
import { cn } from '../../lib/utils'

/**
 * Card component props
 */
export interface CardProps {
  /** Card content */
  children?: ComponentChildren
  /** Additional CSS classes */
  className?: string
  /** Click handler (for interactive cards) */
  onClick?: (event: MouseEvent) => void
}

/**
 * Card Header props
 */
export interface CardHeaderProps {
  children?: ComponentChildren
  className?: string
}

/**
 * Card Title props
 */
export interface CardTitleProps {
  children?: ComponentChildren
  className?: string
}

/**
 * Card Description props
 */
export interface CardDescriptionProps {
  children?: ComponentChildren
  className?: string
}

/**
 * Card Content props
 */
export interface CardContentProps {
  children?: ComponentChildren
  className?: string
}

/**
 * Card Footer props
 */
export interface CardFooterProps {
  children?: ComponentChildren
  className?: string
}

/**
 * Card Component
 *
 * Main container component for card layout
 *
 * Usage:
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description goes here</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     Main content area
 *   </CardContent>
 *   <CardFooter>
 *     Footer content
 *   </CardFooter>
 * </Card>
 * ```
 */
export function Card({
  children,
  className,
  onClick,
  ...props
}: CardProps) {
  const cardClasses = cn(
    'rounded-lg',
    'border',
    'border-[var(--border)]',
    'bg-[var(--card)]',
    'text-[var(--card-foreground)]',
    'shadow-sm',
    onClick && 'cursor-pointer hover:bg-[var(--accent)]/5 transition-colors',
    className
  )

  return (
    <div
      class={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * CardHeader Component
 *
 * Header section of the card (typically contains title and description)
 */
export function CardHeader({
  children,
  className,
  ...props
}: CardHeaderProps) {
  const headerClasses = cn(
    'flex',
    'flex-col',
    'space-y-1.5',
    'p-6',
    className
  )

  return (
    <div class={headerClasses} {...props}>
      {children}
    </div>
  )
}

/**
 * CardTitle Component
 *
 * Title text in the card header
 */
export function CardTitle({
  children,
  className,
  ...props
}: CardTitleProps) {
  const titleClasses = cn(
    'text-2xl',
    'font-semibold',
    'leading-none',
    'tracking-tight',
    className
  )

  return (
    <h3 class={titleClasses} {...props}>
      {children}
    </h3>
  )
}

/**
 * CardDescription Component
 *
 * Description text in the card header
 */
export function CardDescription({
  children,
  className,
  ...props
}: CardDescriptionProps) {
  const descriptionClasses = cn(
    'text-sm',
    'text-[var(--muted-foreground)]',
    className
  )

  return (
    <p class={descriptionClasses} {...props}>
      {children}
    </p>
  )
}

/**
 * CardContent Component
 *
 * Main content area of the card
 */
export function CardContent({
  children,
  className,
  ...props
}: CardContentProps) {
  const contentClasses = cn(
    'p-6',
    'pt-0',
    className
  )

  return (
    <div class={contentClasses} {...props}>
      {children}
    </div>
  )
}

/**
 * CardFooter Component
 *
 * Footer section of the card (typically contains actions)
 */
export function CardFooter({
  children,
  className,
  ...props
}: CardFooterProps) {
  const footerClasses = cn(
    'flex',
    'items-center',
    'p-6',
    'pt-0',
    className
  )

  return (
    <div class={footerClasses} {...props}>
      {children}
    </div>
  )
}

/**
 * Export default for convenience
 */
export default Card
