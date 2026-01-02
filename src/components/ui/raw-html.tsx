/**
 * Raw HTML Component
 *
 * Renders custom HTML content with Jinja2 template support.
 * Provides full access to all Shadcn component CSS classes (.shc-*).
 */

import { ComponentChildren } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

export interface RawHTMLProps {
  /** HTML content to render (supports Jinja2 templates) */
  content: string
  /** Optional children (ignored) */
  children?: ComponentChildren
  /** Optional className for the wrapper */
  className?: string
}

/**
 * RawHTML Component
 *
 * Renders arbitrary HTML content with dangerouslySetInnerHTML.
 * For the visual editor, this allows power users to write custom HTML
 * with full access to all .shc-* Shadcn component classes.
 *
 * Security Note: This component renders user-provided HTML without sanitization.
 * It's designed for use in Home Assistant where users have full control over their
 * configuration and understand the security implications.
 */
export function RawHTML({ content, className }: RawHTMLProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [processedContent, setProcessedContent] = useState(content)

  useEffect(() => {
    // For now, just use the content as-is
    // Jinja2 resolution will be handled by BindingEngine in the future
    setProcessedContent(content)
  }, [content])

  return (
    <div
      ref={containerRef}
      class={`shc-raw-html-container ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  )
}

export default RawHTML
