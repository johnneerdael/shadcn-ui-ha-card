/**
 * Editor Module Exports
 */

export { ShadcnCardEditorElement, default as CardEditor } from './card-editor'
export { ComponentPalette } from './component-palette'
export { GridCanvas } from './grid-canvas'
export { PropertiesPanel } from './properties-panel'

export type {
  EditorConfig,
  LayoutItem,
  ActionConfig,
  PaletteItem,
  EditorState,
  CardEditorProps,
  ComponentPaletteProps,
  GridCanvasProps,
  PropertiesPanelProps,
  FormField,
} from './types'

export {
  DEFAULT_COMPONENT_SIZES,
  generateItemId,
  createLayoutItem,
} from './types'
