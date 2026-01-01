import './globals.css'
import { shadcnTemplateCard } from './card'
import type { shadcnTemplateCardConfig } from './card'

declare const CARD_VERSION: string

// CRITICAL: Registration must happen IMMEDIATELY and synchronously
// Home Assistant expects the custom element to be defined when the script loads
// Using try/catch instead of conditional check to ensure synchronous execution
try {
  customElements.define('shadcn-template-card', shadcnTemplateCard)
} catch (e) {
  // Already defined - this is fine (NotSupportedError)
  if (!(e instanceof DOMException && e.name === 'NotSupportedError')) {
    throw e
  }
}

// Register card in the card picker UI
// This is required for the card to appear in Home Assistant's "Add Card" dialog
declare global {
  interface Window {
    customCards?: Array<{
      type: string
      name: string
      description?: string
      preview?: boolean
      documentationURL?: string
    }>
  }
}

window.customCards = window.customCards || []
window.customCards.push({
  type: 'custom:shadcn-template-card',
  name: 'Shadcn Template Card',
  description: 'A flexible template card with Shadcn UI components and Tailwind styling',
  preview: false,
  documentationURL: 'https://github.com/johnneerdael/shadcn-template-card', // Update with actual URL
})

// Export types for TypeScript consumers
export type { shadcnTemplateCardConfig }
export { shadcnTemplateCard }