/**
 * ScrollArea Component
 *
 * Styled scrollable container with custom scrollbar.
 * Based on shadcn/ui ScrollArea.
 *
 * Useful for: Long device lists, notification feeds, log viewers.
 *
 * @example
 * ```html
 * <div class="shc-scroll-area" style="height: 300px;">
 *   <div class="shc-scroll-area-viewport">
 *     <!-- Long content here -->
 *     <div>Item 1</div>
 *     <div>Item 2</div>
 *     <!-- ... many items ... -->
 *   </div>
 * </div>
 *
 * <!-- Horizontal scroll -->
 * <div class="shc-scroll-area shc-scroll-area-horizontal" style="width: 300px;">
 *   <div class="shc-scroll-area-viewport">
 *     <div style="display: flex; gap: 12px;">
 *       <!-- Wide content -->
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/scroll-area
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const scrollAreaStyles = `
  /* Scroll area container */
  .shc-scroll-area {
    position: relative;
    overflow: hidden;
  }

  /* Viewport (actual scrollable content) */
  .shc-scroll-area-viewport {
    width: 100%;
    height: 100%;
    overflow: auto;
    scrollbar-gutter: stable;
  }

  /* Vertical scroll (default) */
  .shc-scroll-area-viewport {
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* Horizontal scroll */
  .shc-scroll-area-horizontal .shc-scroll-area-viewport {
    overflow-x: auto;
    overflow-y: hidden;
  }

  /* Both directions */
  .shc-scroll-area-both .shc-scroll-area-viewport {
    overflow: auto;
  }

  /* Custom scrollbar styling (Webkit) */
  .shc-scroll-area-viewport::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  .shc-scroll-area-viewport::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 5px;
  }

  .shc-scroll-area-viewport::-webkit-scrollbar-thumb {
    background: var(--muted);
    border-radius: 5px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  .shc-scroll-area-viewport::-webkit-scrollbar-thumb:hover {
    background: var(--muted-foreground);
    background-clip: padding-box;
  }

  /* Firefox scrollbar styling */
  .shc-scroll-area-viewport {
    scrollbar-width: thin;
    scrollbar-color: var(--muted) transparent;
  }

  /* Scroll shadows (optional visual enhancement) */
  .shc-scroll-area-shadows .shc-scroll-area-viewport {
    background:
      /* Shadow at top */
      linear-gradient(var(--background) 30%, transparent),
      /* Shadow at bottom */
      linear-gradient(transparent, var(--background) 70%) 0 100%,
      /* Top gradient */
      radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, 0.2), transparent),
      /* Bottom gradient */
      radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, 0.2), transparent) 0 100%;
    background-repeat: no-repeat;
    background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
    background-attachment: local, local, scroll, scroll;
  }
`

export const scrollAreaComponent: ComponentDefinition = {
  name: 'scroll-area',
  styles: scrollAreaStyles,
  description: 'Styled scrollable container with custom scrollbar',
}

/**
 * Generate scroll area classes
 */
export function scrollArea(
  direction: 'vertical' | 'horizontal' | 'both' = 'vertical',
  shadows = false
): string {
  const classes = ['shc-scroll-area']

  if (direction === 'horizontal') {
    classes.push('shc-scroll-area-horizontal')
  } else if (direction === 'both') {
    classes.push('shc-scroll-area-both')
  }

  if (shadows) {
    classes.push('shc-scroll-area-shadows')
  }

  return classes.join(' ')
}

export function scrollAreaViewport(): string {
  return 'shc-scroll-area-viewport'
}
