import { ComponentChildren } from 'preact'
import { cn } from '../../lib/utils'

export interface ScrollAreaProps {
  children?: ComponentChildren
  className?: string
  orientation?: 'vertical' | 'horizontal' | 'both'
  style?: Record<string, string | number>
}

/**
 * Scroll Area Component
 *
 * Custom scrollable container with styled scrollbars.
 * Shadow DOM compatible - uses CSS-only approach.
 *
 * @example
 * <ScrollArea className="h-72">
 *   <div>Long list of content...</div>
 * </ScrollArea>
 */
export function ScrollArea({
  children,
  className,
  orientation = 'vertical',
  style,
  ...props
}: ScrollAreaProps) {
  const orientationClasses = {
    vertical: 'overflow-y-auto overflow-x-hidden',
    horizontal: 'overflow-x-auto overflow-y-hidden',
    both: 'overflow-auto',
  }

  return (
    <div
      data-slot="scroll-area"
      class={cn(
        'shc-scroll-area',
        'relative',
        orientationClasses[orientation],
        // Custom scrollbar styling
        '[&::-webkit-scrollbar]:w-2',
        '[&::-webkit-scrollbar]:h-2',
        '[&::-webkit-scrollbar-track]:bg-transparent',
        '[&::-webkit-scrollbar-thumb]:bg-border',
        '[&::-webkit-scrollbar-thumb]:rounded-full',
        '[&::-webkit-scrollbar-thumb]:hover:bg-border/80',
        // Firefox scrollbar
        'scrollbar-thin',
        'scrollbar-thumb-border',
        'scrollbar-track-transparent',
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}

// Export for component registry
ScrollArea.displayName = 'ScrollArea'
