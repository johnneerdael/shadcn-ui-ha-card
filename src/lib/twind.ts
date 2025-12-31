import { twind, cssom } from '@twind/core'
import presetAutoprefix from '@twind/preset-autoprefix'
import presetTailwind from '@twind/preset-tailwind'

/**
 * Mount a twind instance scoped to a shadowRoot.
 * Uses a constructable stylesheet to keep styles encapsulated per card instance.
 */
export function setupTwind(shadowRoot: ShadowRoot): { tw: ReturnType<typeof twind> } {
  const styleEl = document.createElement('style')
  shadowRoot.appendChild(styleEl)

  const sheet = cssom(styleEl.sheet as CSSStyleSheet)

  const tw = twind(
    {
      presets: [presetAutoprefix(), presetTailwind()],
      hash: false, // deterministic class names to ease debugging
    },
    sheet,
  )

  return { tw }
}