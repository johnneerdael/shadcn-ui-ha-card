/**
 * Constants for shadcn-template-card
 *
 * Defines card metadata, version info, and other constants
 * used throughout the card implementation.
 */

declare const CARD_VERSION: string

/**
 * Card version (injected by Vite at build time)
 */
export const VERSION = typeof CARD_VERSION !== 'undefined' ? CARD_VERSION : 'dev'

/**
 * Card type identifier (must match customElements.define name)
 */
export const CARD_TYPE = 'custom:shadcn-template-card'

/**
 * Card display name (shown in card picker)
 */
export const CARD_NAME = 'Shadcn Template Card'

/**
 * Card description (shown in card picker)
 */
export const CARD_DESCRIPTION = 'Professional Visual Editor with 34+ Shadcn UI components, drag-and-drop layout, live preview, and per-card theming'

/**
 * Documentation URL
 */
export const DOCUMENTATION_URL = 'https://github.com/johnneerdael/shadcn-template-card'

/**
 * Default stub configuration for card picker
 * This is what gets created when user adds the card from the picker
 *
 * Features smart entity detection - finds first available light/switch
 * and creates a working demo card with entity binding
 */
export const DEFAULT_CONFIG = {
  type: CARD_TYPE,
  title: 'Shadcn Demo Card',
  layout: [
    {
      i: 'welcome-card',
      x: 0,
      y: 0,
      w: 12,
      h: 6,
      component: 'UiCard',
      props: {
        title: 'Welcome to Shadcn Template Card',
        description: '34+ components • Visual editor • Per-card theming',
      },
      children: [
        {
          i: 'demo-button',
          component: 'UiButton',
          props: {
            label: 'Primary Button',
            variant: 'default',
          },
        },
        {
          i: 'demo-badge',
          component: 'UiBadge',
          props: {
            text: 'NEW',
            variant: 'success',
          },
        },
        {
          i: 'demo-separator',
          component: 'UiSeparator',
          props: {},
        },
        {
          i: 'demo-progress',
          component: 'UiProgress',
          props: {
            value: 75,
            max: 100,
          },
        },
      ],
    },
  ],
  theme: {
    primary: '#0070f3',
    radius: '0.5rem',
    spacing: {
      gap: '0.75rem',
      padding: '1rem',
    },
  },
}

/**
 * Console banner for card initialization
 */
export const CONSOLE_BANNER = `%c  SHADCN-TEMPLATE-CARD  \n%c  Version ${VERSION}    `
export const CONSOLE_BANNER_STYLE_1 = 'color: #0070f3; font-weight: bold; background: black'
export const CONSOLE_BANNER_STYLE_2 = 'color: white; font-weight: bold; background: #334155'
