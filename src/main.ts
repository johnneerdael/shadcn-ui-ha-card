import './globals.css'
import { shadcnTemplateCard } from './card'
import type { shadcnTemplateCardConfig } from './card'
import { ShadcnCardEditorElement } from './editor'
import {
  CARD_TYPE,
  CARD_NAME,
  CARD_DESCRIPTION,
  DOCUMENTATION_URL,
  CONSOLE_BANNER,
  CONSOLE_BANNER_STYLE_1,
  CONSOLE_BANNER_STYLE_2,
} from './constants'

// Console banner for card initialization
console.info(CONSOLE_BANNER, CONSOLE_BANNER_STYLE_1, CONSOLE_BANNER_STYLE_2)

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
  type: CARD_TYPE,
  name: CARD_NAME,
  description: CARD_DESCRIPTION,
  preview: false,
  documentationURL: DOCUMENTATION_URL,
})

// Export types for TypeScript consumers
export type { shadcnTemplateCardConfig }
export { shadcnTemplateCard }