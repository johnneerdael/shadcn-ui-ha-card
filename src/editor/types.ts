/**
 * Visual Editor Type Definitions
 *
 * These types define the configuration format produced by the visual editor
 * and consumed by the card renderer.
 */

import type { ActionType, ComponentCategory, PropType } from '../lib/component-registry'

/**
 * Action configuration for component interactions
 */
export interface ActionConfig {
  /** Type of action to perform */
  type: ActionType
  /** Service to call (for call-service action) */
  service?: string
  /** Service data */
  service_data?: Record<string, unknown>
  /** Navigation path (for navigate action) */
  navigation_path?: string
  /** Entity for more-info dialog */
  entity?: string
}

/**
 * Layout mode determines how the item is positioned
 * - 'grid': Uses x/y/w/h positioning (react-grid-layout)
 * - 'flow-vertical': Vertical stack layout (flexbox column)
 * - 'flow-horizontal': Horizontal flow layout (flexbox row)
 */
export type LayoutMode = 'grid' | 'flow-vertical' | 'flow-horizontal'

/**
 * Style controls for advanced layout customization
 */
export interface LayoutStyle {
  /** Align item within its container (flexbox align-self) */
  alignSelf?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  /** Justify item within its container (flexbox justify-self) */
  justifySelf?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  /** Width control ('auto', 'full' for 100%, or explicit like '200px') */
  width?: 'auto' | 'full' | string
  /** Gap between child items (for container components) */
  gap?: string
  /** Margin around the component */
  margin?: string
  /** Padding inside the component */
  padding?: string
}

/**
 * A single item in the grid layout
 * Combines react-grid-layout positioning with component configuration
 *
 * This interface supports both flat grid layouts (root level) and
 * hierarchical nested layouts (children within containers like Tabs, Accordion)
 */
export interface LayoutItem {
  /** Unique identifier for this layout item */
  i: string

  // Grid positioning (for layoutMode: 'grid')
  /** X position in grid units (0-11 for 12-column grid) */
  x: number
  /** Y position in grid units */
  y: number
  /** Width in grid units */
  w: number
  /** Height in grid units */
  h: number
  /** Minimum width */
  minW?: number
  /** Minimum height */
  minH?: number
  /** Maximum width */
  maxW?: number
  /** Maximum height */
  maxH?: number
  /** Whether this item is static (non-draggable, non-resizable) */
  static?: boolean

  // Component configuration
  /** Component type from registry (e.g., 'UiButton', 'UiSwitch') */
  component: string
  /** Props to pass to the component */
  props: Record<string, unknown>
  /** Entity binding (e.g., 'light.living_room') */
  bind?: string
  /** Action configuration */
  action?: ActionConfig

  // Hierarchical nesting support (NEW)
  /** Layout mode determines positioning strategy */
  layoutMode?: LayoutMode
  /** Child items (for container components like Tabs, Accordion, Card) */
  children?: LayoutItem[]
  /** Parent item ID (null for root items) */
  parentId?: string | null

  // Advanced styling (NEW)
  /** Style controls for alignment, spacing, sizing */
  style?: LayoutStyle

  // Component-level theme overrides (NEW)
  /** Override global theme for this component only */
  themeOverride?: ComponentThemeOverride
}

/**
 * Component-level theme overrides
 * These values override the card's global theme for a specific component
 * Undefined values inherit from the global CardTheme
 */
export interface ComponentThemeOverride {
  /** Override primary color */
  primary?: string
  /** Override secondary color */
  secondary?: string
  /** Override background color */
  background?: string
  /** Override foreground/text color */
  foreground?: string
  /** Override border radius */
  radius?: string
}

/**
 * Theme configuration for per-card styling
 * Follows shadcn philosophy: adjust the DNA of components via CSS Variables
 */
export interface CardTheme {
  /** Main brand color */
  primary?: string
  /** Accent/complementary color */
  secondary?: string
  /** Card background tone */
  background?: string
  /** Text color */
  foreground?: string
  /** Border radius (0rem = sharp, 1rem = bubbly) */
  radius?: string
  /** Spacing controls (breathability) */
  spacing?: {
    /** Default gap between elements */
    gap?: string
    /** Default card padding */
    padding?: string
  }
}

/**
 * Full editor configuration
 * This is what gets saved to the card config
 */
export interface EditorConfig {
  /** Card type identifier */
  type: 'custom:shadcn-template-card'
  /** Optional card title */
  title?: string
  /** Layout items (grid components) */
  layout: LayoutItem[]
  /** Global variables for template rendering */
  variables?: Record<string, unknown>
  /** Per-card theme configuration (NEW) */
  theme?: CardTheme
}

/**
 * Palette item for drag-and-drop
 */
export interface PaletteItem {
  /** Component name from registry */
  name: string
  /** Display name */
  displayName: string
  /** Component description */
  description: string
  /** Category for grouping */
  category: ComponentCategory
  /** MDI icon name */
  icon: string
}

/**
 * Editor state for managing selection and editing
 */
export interface EditorState {
  /** Currently selected layout item ID */
  selectedId: string | null
  /** Whether we're in edit mode */
  isEditing: boolean
  /** Layout items */
  layout: LayoutItem[]
}

/**
 * Props for the main CardEditor component
 */
export interface CardEditorProps {
  /** Home Assistant instance */
  hass: unknown
  /** Lovelace config (contains theme info, etc.) */
  lovelace?: unknown
  /** Current card configuration */
  config: EditorConfig
  /** Callback when configuration changes */
  onChange: (config: EditorConfig) => void
}

/**
 * Form field definition for auto-generated property forms
 */
export interface FormField {
  /** Field name (prop key) */
  name: string
  /** Field label */
  label: string
  /** Field type */
  type: PropType
  /** Current value */
  value: unknown
  /** Default value */
  defaultValue?: unknown
  /** Options for select fields */
  options?: string[]
  /** Field description/help text */
  description?: string
  /** Whether the field is required */
  required?: boolean
}

/**
 * Default sizes for new components added to the grid
 */
export const DEFAULT_COMPONENT_SIZES: Record<string, { w: number; h: number }> = {
  UiCard: { w: 12, h: 4 },
  UiButton: { w: 4, h: 2 },
  UiSwitch: { w: 4, h: 2 },
  UiSlider: { w: 6, h: 2 },
  UiProgress: { w: 6, h: 1 },
  UiLabel: { w: 4, h: 1 },
}

/**
 * Generate a unique ID for a new layout item
 */
export function generateItemId(componentType: string): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 6)
  return `${componentType.toLowerCase()}-${timestamp}-${random}`
}

/**
 * Create a new layout item with default values
 */
export function createLayoutItem(
  componentType: string,
  x: number = 0,
  y: number = 0
): LayoutItem {
  const size = DEFAULT_COMPONENT_SIZES[componentType] || { w: 4, h: 2 }

  return {
    i: generateItemId(componentType),
    x,
    y,
    w: size.w,
    h: size.h,
    minW: 2,
    minH: 1,
    component: componentType,
    props: {},
  }
}
