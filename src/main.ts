import './globals.css'
import { shadcnTemplateCard } from './card'
import type { shadcnTemplateCardConfig } from './card'
import { ShadcnCardEditorElement } from './editor'

declare const CARD_VERSION: string

// Registration must happen synchronously at module load
customElements.define('shadcn-template-card', shadcnTemplateCard)
customElements.define('shadcn-template-card-editor', ShadcnCardEditorElement)

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