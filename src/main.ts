import './globals.css'
import { shadcnTemplateCard } from './card'
import type { shadcnTemplateCardConfig } from './card'
import { ShadcnCardEditorElement } from './editor'
import {
  CARD_NAME,
  CARD_DESCRIPTION,
  DOCUMENTATION_URL,
  CONSOLE_BANNER,
  CONSOLE_BANNER_STYLE_1,
  CONSOLE_BANNER_STYLE_2,
} from './constants'

// Console banner for card initialization
console.info(CONSOLE_BANNER, CONSOLE_BANNER_STYLE_1, CONSOLE_BANNER_STYLE_2)

// DEBUG: Log registration start
console.log('[ShadcnCard] 🚀 Starting custom element registration...')
console.log('[ShadcnCard] 📦 Card class:', shadcnTemplateCard)
console.log('[ShadcnCard] 🎨 Editor class:', ShadcnCardEditorElement)

// Registration must happen synchronously at module load
// Use defensive checks to prevent double-registration issues
try {
  if (!customElements.get('shadcn-template-card')) {
    console.log('[ShadcnCard] 🔧 Registering card element: shadcn-template-card')
    customElements.define('shadcn-template-card', shadcnTemplateCard)
    console.log('[ShadcnCard] ✅ Card element registered successfully')
  } else {
    console.warn('[ShadcnCard] ⚠️ Card element already registered, skipping')
  }
} catch (error) {
  console.error('[ShadcnCard] ❌ Card registration failed:', error)
}

try {
  if (!customElements.get('shadcn-template-card-editor')) {
    console.log('[ShadcnCard] 🔧 Registering editor element: shadcn-template-card-editor')
    customElements.define('shadcn-template-card-editor', ShadcnCardEditorElement)
    console.log('[ShadcnCard] ✅ Editor element registered successfully')
  } else {
    console.warn('[ShadcnCard] ⚠️ Editor element already registered, skipping')
  }
} catch (error) {
  console.error('[ShadcnCard] ❌ Editor registration failed:', error)
}

// Verify registration
console.log('[ShadcnCard] 🔍 Verifying registration...')
console.log('[ShadcnCard] Card defined:', customElements.get('shadcn-template-card'))
console.log('[ShadcnCard] Editor defined:', customElements.get('shadcn-template-card-editor'))

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

console.log('[ShadcnCard] 🎯 Adding to card picker...')
window.customCards = window.customCards || []
window.customCards.push({
  type: 'shadcn-template-card',  // NO "custom:" prefix for card picker!
  name: CARD_NAME,
  description: CARD_DESCRIPTION,
  preview: false,
  documentationURL: DOCUMENTATION_URL,
})
console.log('[ShadcnCard] ✅ Added to card picker')
console.log('[ShadcnCard] 📋 Current customCards:', window.customCards)
console.log('[ShadcnCard] 🎉 All registration complete!')

// Export types for TypeScript consumers
export type { shadcnTemplateCardConfig }
export { shadcnTemplateCard }