/**
 * LayoutRenderer Component
 *
 * Recursively renders LayoutItem[] configuration into actual Preact components.
 * This is the bridge between the editor's JSON config and the live card UI.
 *
 * Key responsibilities:
 * - Convert component names to Preact component instances
 * - Apply entity bindings via BindingEngine
 * - Wire action handlers for user interactions
 * - Apply style controls (alignment, spacing, sizing)
 * - Recursively render nested children
 *
 * @see /docs/architecture/layout-renderer.md for detailed documentation
 */

import { FunctionComponent } from 'preact'
import type { LayoutItem } from '../editor/types'
import type { HomeAssistant } from '../lib/binding-engine'
import { BindingEngine, ActionHandler } from '../lib/binding-engine'
import { getComponentByName } from './component-map'

/**
 * Props for the LayoutRenderer component
 */
export interface LayoutRendererProps {
  /** Layout items to render */
  layout: LayoutItem[]
  /** Home Assistant instance for entity state */
  hass: HomeAssistant
  /** Binding engine for entity → props mapping */
  bindingEngine: BindingEngine
  /** Action handler for user interactions */
  actionHandler: ActionHandler
}

/**
 * Props for individual LayoutItemRenderer
 */
interface LayoutItemRendererProps {
  /** Single layout item to render */
  item: LayoutItem
  /** Home Assistant instance */
  hass: HomeAssistant
  /** Binding engine */
  bindingEngine: BindingEngine
  /** Action handler */
  actionHandler: ActionHandler
}

/**
 * Main LayoutRenderer component
 *
 * Renders the root layout items (typically grid-positioned components)
 * Each item is wrapped in a layout container with appropriate styling
 */
export const LayoutRenderer: FunctionComponent<LayoutRendererProps> = ({
  layout,
  hass,
  bindingEngine,
  actionHandler,
}) => {
  if (!layout || layout.length === 0) {
    return (
      <div class="shc-layout-empty">
        <div class="shc-layout-empty-message">
          <ha-icon icon="mdi:view-dashboard-outline"></ha-icon>
          <p>No components configured yet</p>
          <p class="shc-layout-empty-hint">
            Use the visual editor to add components
          </p>
        </div>
      </div>
    )
  }

  return (
    <div class="shc-layout-root">
      {layout.map((item) => (
        <LayoutItemRenderer
          key={item.i}
          item={item}
          hass={hass}
          bindingEngine={bindingEngine}
          actionHandler={actionHandler}
        />
      ))}
    </div>
  )
}

/**
 * LayoutItemRenderer - Renders a single layout item
 *
 * This component:
 * 1. Resolves the component class from the registry
 * 2. Applies entity bindings if present
 * 3. Wires action handlers if present
 * 4. Applies style controls (align, width, margin, padding)
 * 5. Recursively renders children for container components
 */
const LayoutItemRenderer: FunctionComponent<LayoutItemRendererProps> = ({
  item,
  hass,
  bindingEngine,
  actionHandler,
}) => {
  // 1. Resolve component from registry
  const ComponentClass = getComponentByName(item.component)

  if (!ComponentClass) {
    console.warn(`[LayoutRenderer] Unknown component: ${item.component}`)
    return (
      <div class="shc-layout-item-error">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>Unknown component: {item.component}</span>
      </div>
    )
  }

  // 2. Apply entity binding if exists
  const boundProps = item.bind
    ? bindingEngine.resolveBinding(item.bind)
    : { ...item.props }

  // 3. Apply action handler if exists
  const actionProps: Record<string, unknown> = {}
  if (item.action) {
    actionProps.onClick = () => {
      // Convert editor ActionConfig to binding-engine ActionConfig
      const bindingAction = {
        action: item.action!.type,
        service: item.action!.service,
        service_data: item.action!.service_data,
        navigation_path: item.action!.navigation_path,
        entity: item.action!.entity || item.bind,
      }
      actionHandler.handleAction(bindingAction, item.bind)
    }
  }

  // 4. Apply style controls
  const layoutMode = item.layoutMode || 'grid'
  const style = item.style || {}

  const containerStyle: Record<string, string> = {}

  // Alignment controls (flexbox)
  if (style.alignSelf) {
    containerStyle.alignSelf = style.alignSelf
  }
  if (style.justifySelf) {
    containerStyle.justifySelf = style.justifySelf
  }

  // Width control
  if (style.width) {
    containerStyle.width = style.width === 'full' ? '100%' : style.width
  }

  // Spacing controls
  if (style.gap) {
    containerStyle.gap = style.gap
  }
  if (style.margin) {
    containerStyle.margin = style.margin
  }
  if (style.padding) {
    containerStyle.padding = style.padding
  }

  // Layout mode specific styles
  if (layoutMode === 'flow-vertical') {
    containerStyle.display = 'flex'
    containerStyle.flexDirection = 'column'
  } else if (layoutMode === 'flow-horizontal') {
    containerStyle.display = 'flex'
    containerStyle.flexDirection = 'row'
  }

  // 5. Render children recursively (if this is a container component)
  const childrenElements = item.children?.map((child) => (
    <LayoutItemRenderer
      key={child.i}
      item={child}
      hass={hass}
      bindingEngine={bindingEngine}
      actionHandler={actionHandler}
    />
  ))

  // 6. Render the component with all props, styles, and children
  return (
    <div
      class={`shc-layout-item shc-layout-${layoutMode}`}
      style={containerStyle}
      data-component={item.component}
      data-item-id={item.i}
    >
      <ComponentClass {...boundProps} {...actionProps}>
        {childrenElements}
      </ComponentClass>
    </div>
  )
}

/**
 * Export both named and default for flexibility
 */
export default LayoutRenderer
