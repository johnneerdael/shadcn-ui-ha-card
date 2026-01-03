/// <reference types="vite/client" />

declare const CARD_VERSION: string

// Type declaration for ?inline CSS imports
declare module '*.css?inline' {
  const css: string
  export default css
}

// Home Assistant custom elements for JSX
declare namespace preact.JSX {
  interface IntrinsicElements {
    'ha-icon': {
      icon?: string
      class?: string
      style?: string | Record<string, string>
    }
    'ha-entity-picker': {
      hass?: unknown
      value?: string
      onValueChanged?: (e: CustomEvent<{ value: string }>) => void
      'allow-custom-entity'?: boolean
      label?: string
    }
    'ha-icon-picker': {
      value?: string
      onValueChanged?: (e: CustomEvent<{ value: string }>) => void
      label?: string
    }
    'ha-service-picker': {
      hass?: unknown
      value?: string
      onValueChanged?: (e: CustomEvent<{ value: string }>) => void
    }
  }
}
