import './globals.css'
import { ShadcdnTemplateCard } from './card'
import type { ShadcdnTemplateCardConfig } from './card'

declare const CARD_VERSION: string

// Register the custom element with Home Assistant
if (!customElements.get('shadcdn-template-card')) {
  customElements.define('shadcdn-template-card', ShadcdnTemplateCard)
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
  type: 'custom:shadcdn-template-card',
  name: 'Shadcn Template Card',
  description: 'A flexible template card with Shadcn UI components and Tailwind styling',
  preview: false,
  documentationURL: 'https://github.com/johnneerdael/shadcdn-template-card', // Update with actual URL
})

// Export types for TypeScript consumers
export type { ShadcdnTemplateCardConfig }
export { ShadcdnTemplateCard }