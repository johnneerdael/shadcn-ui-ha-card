/**
 * Style Utilities
 * 
 * Helper functions for generating consistent CSS class names and styles
 * for shadcn components with the .shc- prefix.
 */

/**
 * Generate a shadcn component class name with the .shc- prefix
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Generate a base component class name
 */
export function component(name: string): string {
  return `shc-${name}`
}

/**
 * Generate a component variant class name
 */
export function variant(component: string, variant: string): string {
  return `shc-${component}-${variant}`
}

/**
 * Generate a component state class name
 */
export function state(component: string, state: string): string {
  return `shc-${component}-${state}`
}

/**
 * CSS Variable helper - creates a var() reference
 */
export function cssVar(name: string, fallback?: string): string {
  return fallback ? `var(--${name}, ${fallback})` : `var(--${name})`
}

/**
 * Create a style string from CSS variable values
 */
export function createStyleString(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ')
}

/**
 * Common CSS class builders for consistency
 */
export const classes = {
  /**
   * Base transition classes
   */
  transition: 'transition-colors duration-200',
  
  /**
   * Focus ring classes
   */
  focusRing: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
  
  /**
   * Disabled state classes
   */
  disabled: 'disabled:opacity-50 disabled:pointer-events-none',
  
  /**
   * Border classes
   */
  border: 'border border-[color:var(--border)]',
  
  /**
   * Rounded corners using CSS variable
   */
  rounded: 'rounded-[var(--radius)]',
  roundedMd: 'rounded-md',
  roundedLg: 'rounded-lg',
  roundedFull: 'rounded-full',
  
  /**
   * Shadow classes
   */
  shadow: 'shadow-sm',
  shadowMd: 'shadow-md',
  shadowLg: 'shadow-lg',
  
  /**
   * Background classes
   */
  bgBackground: 'bg-[var(--background)]',
  bgCard: 'bg-[var(--card)]',
  bgMuted: 'bg-[var(--muted)]',
  bgPrimary: 'bg-[var(--primary)]',
  bgSecondary: 'bg-[var(--secondary)]',
  bgDestructive: 'bg-[var(--destructive)]',
  
  /**
   * Text color classes
   */
  textForeground: 'text-[var(--foreground)]',
  textMutedForeground: 'text-[var(--muted-foreground)]',
  textPrimaryForeground: 'text-[var(--primary-foreground)]',
  textSecondaryForeground: 'text-[var(--secondary-foreground)]',
  textDestructiveForeground: 'text-[var(--destructive-foreground)]',
}

/**
 * Generate CSS for component animations
 */
export const animations = {
  fadeIn: `
    @keyframes shc-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  
  slideIn: `
    @keyframes shc-slide-in {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  
  pulse: `
    @keyframes shc-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,
  
  spin: `
    @keyframes shc-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
}

/**
 * Generate complete animation CSS
 */
export function getAnimationStyles(): string {
  return Object.values(animations).join('\n')
}

/**
 * Size utilities for consistent spacing
 */
export const sizes = {
  xs: {
    height: 'h-6',
    padding: 'px-2 py-1',
    text: 'text-xs',
  },
  sm: {
    height: 'h-8',
    padding: 'px-3 py-1.5',
    text: 'text-sm',
  },
  md: {
    height: 'h-10',
    padding: 'px-4 py-2',
    text: 'text-sm',
  },
  lg: {
    height: 'h-11',
    padding: 'px-5 py-2.5',
    text: 'text-base',
  },
  xl: {
    height: 'h-12',
    padding: 'px-6 py-3',
    text: 'text-base',
  },
}