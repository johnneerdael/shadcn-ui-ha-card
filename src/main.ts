import './globals.css'
import { ShadcdnTemplateCard } from './card'
import type { ShadcdnTemplateCardConfig } from './card'

declare const CARD_VERSION: string

// Register the custom element with Home Assistant
if (!customElements.get('shadcdn-template-card')) {
  customElements.define('shadcdn-template-card', ShadcdnTemplateCard)
}

// Export types for TypeScript consumers
export type { ShadcdnTemplateCardConfig }
export { ShadcdnTemplateCard }