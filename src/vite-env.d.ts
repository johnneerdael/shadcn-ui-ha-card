/// <reference types="vite/client" />

declare const CARD_VERSION: string

// Type declaration for ?inline CSS imports
declare module '*.css?inline' {
  const css: string
  export default css
}
