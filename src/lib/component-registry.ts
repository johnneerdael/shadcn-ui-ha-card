/**
 * Enhanced Component Registry System
 *
 * Manages component registration, style injection, and initialization
 * for the shadcn component library within shadow DOM.
 *
 * This enhanced version supports:
 * - Visual editor integration via prop definitions
 * - Entity binding configuration
 * - Action definitions for HA service calls
 * - Component categorization
 */

import type { ComponentType } from 'preact'

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Prop types supported by the visual editor
 */
export type PropType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'select'
  | 'entity'
  | 'service'
  | 'icon'
  | 'color'
  | 'boolean-or-binding'

/**
 * Definition for a component prop that can be configured in the visual editor
 */
export interface PropDefinition {
  /** Prop name (e.g., 'variant', 'size') */
  name: string
  /** Type of the prop for form generation */
  type: PropType
  /** Default value */
  default?: unknown
  /** Options for 'select' type */
  options?: string[]
  /** Human-readable description */
  description?: string
  /** Whether this prop is required */
  required?: boolean
}

/**
 * Action types supported by components
 */
export type ActionType = 'toggle' | 'call-service' | 'navigate' | 'more-info' | 'fire-dom-event'

/**
 * Action definition for component interactions
 */
export interface ActionDefinition {
  type: ActionType
  /** Pre-filled service for call-service action */
  service?: string
  /** Use the bound entity as the service target */
  target_entity_from_bind?: boolean
}

/**
 * Entity binding configuration for automatic state mapping
 */
export interface BindingConfig {
  /**
   * Function to map entity state/attributes to component props
   * @param state - The entity state string
   * @param attributes - The entity attributes object
   * @returns Props to pass to the component
   */
  stateMapping: (state: string, attributes: Record<string, unknown>) => Record<string, unknown>
  /** Supported entity domains (e.g., ['light', 'switch']) */
  supportedDomains?: string[]
}

/**
 * Component categories for the visual editor palette
 */
export type ComponentCategory = 'layout' | 'input' | 'feedback' | 'data'

/**
 * Legacy component definition (backward compatible)
 */
export interface LegacyComponentDefinition {
  /** Component name (e.g., 'separator', 'skeleton') */
  name: string
  /** CSS styles for the component */
  styles: string
  /** Optional initialization function for interactive components */
  init?: (shadowRoot: ShadowRoot) => void
  /** Optional cleanup function */
  cleanup?: (shadowRoot: ShadowRoot) => void
}

/**
 * Enhanced component definition with visual editor support
 */
export interface ComponentDefinition extends LegacyComponentDefinition {
  /** Display name for the visual editor */
  displayName?: string
  /** Human-readable description */
  description?: string
  /** Category for the visual editor palette */
  category?: ComponentCategory
  /** MDI icon name (e.g., 'mdi:toggle-switch') */
  icon?: string
  /** React/Preact component (for future JSX rendering) */
  component?: ComponentType<Record<string, unknown>>
  /** Props exposed in the visual editor */
  props?: PropDefinition[]
  /** Default action when the component is interacted with */
  defaultAction?: ActionDefinition
  /** Entity binding configuration */
  binding?: BindingConfig
}

// ============================================================================
// UI Component Definitions (for Visual Editor)
// ============================================================================

/**
 * Pre-defined UI component definitions for the visual editor
 * These are the "UiCard", "UiButton", "UiSwitch" etc. components
 */
export const UI_COMPONENTS: Record<string, ComponentDefinition> = {
  UiCard: {
    name: 'UiCard',
    displayName: 'Card',
    description: 'Container with header, content, and footer sections',
    category: 'layout',
    icon: 'mdi:card-outline',
    styles: '', // Uses Tailwind classes
    props: [
      { name: 'title', type: 'string', default: '', description: 'Card title' },
      { name: 'description', type: 'string', default: '', description: 'Card description' },
      { name: 'footer', type: 'string', default: '', description: 'Footer content' },
    ],
  },

  UiButton: {
    name: 'UiButton',
    displayName: 'Button',
    description: 'Clickable button with multiple variants',
    category: 'input',
    icon: 'mdi:button-cursor',
    styles: '', // Uses Tailwind classes
    props: [
      { name: 'label', type: 'string', default: 'Button', description: 'Button text' },
      {
        name: 'variant',
        type: 'select',
        options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        default: 'default',
        description: 'Button style variant',
      },
      {
        name: 'size',
        type: 'select',
        options: ['default', 'sm', 'lg', 'icon'],
        default: 'default',
        description: 'Button size',
      },
      { name: 'icon', type: 'icon', description: 'Optional icon' },
      { name: 'disabled', type: 'boolean', default: false, description: 'Disable the button' },
    ],
    defaultAction: { type: 'call-service' },
  },

  UiSwitch: {
    name: 'UiSwitch',
    displayName: 'Switch',
    description: 'Toggle switch for on/off states',
    category: 'input',
    icon: 'mdi:toggle-switch',
    styles: '', // Styles are in switch.ts
    props: [
      { name: 'checked', type: 'boolean-or-binding', default: false, description: 'Switch state' },
      { name: 'disabled', type: 'boolean', default: false, description: 'Disable the switch' },
      { name: 'label', type: 'string', default: '', description: 'Switch label' },
    ],
    defaultAction: { type: 'toggle', target_entity_from_bind: true },
    binding: {
      stateMapping: (state, attrs) => ({
        checked: state === 'on',
        disabled: attrs.assumed_state === true,
      }),
      supportedDomains: ['light', 'switch', 'input_boolean', 'fan', 'automation'],
    },
  },

  UiSlider: {
    name: 'UiSlider',
    displayName: 'Slider',
    description: 'Range slider for numeric values',
    category: 'input',
    icon: 'mdi:tune-vertical',
    styles: '', // Styles are in slider.ts
    props: [
      { name: 'value', type: 'number', default: 50, description: 'Current value' },
      { name: 'min', type: 'number', default: 0, description: 'Minimum value' },
      { name: 'max', type: 'number', default: 100, description: 'Maximum value' },
      { name: 'step', type: 'number', default: 1, description: 'Step increment' },
      { name: 'disabled', type: 'boolean', default: false, description: 'Disable the slider' },
    ],
    defaultAction: { type: 'call-service', service: 'number.set_value' },
    binding: {
      stateMapping: (state, attrs) => ({
        value: parseFloat(state) || 0,
        min: (attrs.min as number) ?? 0,
        max: (attrs.max as number) ?? 100,
        step: (attrs.step as number) ?? 1,
      }),
      supportedDomains: ['number', 'input_number', 'light'],
    },
  },

  UiProgress: {
    name: 'UiProgress',
    displayName: 'Progress',
    description: 'Progress bar for displaying completion',
    category: 'feedback',
    icon: 'mdi:progress-helper',
    styles: '', // Styles are in progress.ts
    props: [
      { name: 'value', type: 'number', default: 0, description: 'Progress value (0-100)' },
      { name: 'max', type: 'number', default: 100, description: 'Maximum value' },
    ],
    binding: {
      stateMapping: (state) => ({
        value: parseFloat(state) || 0,
      }),
      supportedDomains: ['sensor', 'number', 'input_number'],
    },
  },

  UiLabel: {
    name: 'UiLabel',
    displayName: 'Label',
    description: 'Text label for displaying entity states',
    category: 'data',
    icon: 'mdi:label-outline',
    styles: '', // Styles are in label.ts
    props: [
      { name: 'text', type: 'string', default: '', description: 'Label text' },
      {
        name: 'size',
        type: 'select',
        options: ['xs', 'sm', 'default', 'lg', 'xl'],
        default: 'default',
      },
    ],
    binding: {
      stateMapping: (state, attrs) => ({
        text: attrs.friendly_name ? `${attrs.friendly_name}: ${state}` : state,
      }),
      supportedDomains: undefined, // All domains
    },
  },

  UiToggle: {
    name: 'UiToggle',
    displayName: 'Toggle',
    description: 'Toggle button with pressed state for on/off actions',
    category: 'input',
    icon: 'mdi:toggle-switch-off',
    styles: '', // Styles are in toggle.ts
    props: [
      { name: 'pressed', type: 'boolean-or-binding', default: false, description: 'Toggle state' },
      {
        name: 'variant',
        type: 'select',
        options: ['default', 'outline'],
        default: 'default',
        description: 'Toggle style variant',
      },
      {
        name: 'size',
        type: 'select',
        options: ['default', 'sm', 'lg'],
        default: 'default',
        description: 'Toggle size',
      },
      { name: 'disabled', type: 'boolean', default: false, description: 'Disable the toggle' },
    ],
    defaultAction: { type: 'toggle', target_entity_from_bind: true },
    binding: {
      stateMapping: (state) => ({
        pressed: state === 'on',
      }),
      supportedDomains: ['light', 'switch', 'input_boolean', 'fan', 'automation'],
    },
  },

  UiCheckbox: {
    name: 'UiCheckbox',
    displayName: 'Checkbox',
    description: 'Checkbox with checked/unchecked states',
    category: 'input',
    icon: 'mdi:checkbox-marked',
    styles: '', // Styles are in checkbox.ts
    props: [
      { name: 'checked', type: 'boolean-or-binding', default: false, description: 'Checkbox state' },
      { name: 'label', type: 'string', default: '', description: 'Checkbox label' },
      { name: 'disabled', type: 'boolean', default: false, description: 'Disable the checkbox' },
    ],
    defaultAction: { type: 'toggle', target_entity_from_bind: true },
    binding: {
      stateMapping: (state) => ({
        checked: state === 'on',
      }),
      supportedDomains: ['input_boolean', 'switch'],
    },
  },

  UiSelect: {
    name: 'UiSelect',
    displayName: 'Select',
    description: 'Dropdown select for choosing options',
    category: 'input',
    icon: 'mdi:form-dropdown',
    styles: '', // Styles are in select.ts
    props: [
      { name: 'value', type: 'string', default: '', description: 'Selected value' },
      { name: 'placeholder', type: 'string', default: 'Select option...', description: 'Placeholder text' },
      { name: 'disabled', type: 'boolean', default: false, description: 'Disable the select' },
    ],
    defaultAction: { type: 'call-service', service: 'input_select.select_option' },
    binding: {
      stateMapping: (state, _attrs) => ({
        value: state,
        // Options would need to come from attributes for input_select
      }),
      supportedDomains: ['input_select', 'climate', 'fan'],
    },
  },

  UiAlert: {
    name: 'UiAlert',
    displayName: 'Alert',
    description: 'Informational alert message with variants',
    category: 'feedback',
    icon: 'mdi:alert-circle',
    styles: '', // Styles are in alert.ts
    props: [
      { name: 'title', type: 'string', default: '', description: 'Alert title' },
      { name: 'description', type: 'string', default: '', description: 'Alert description' },
      {
        name: 'variant',
        type: 'select',
        options: ['default', 'destructive', 'success', 'warning', 'info'],
        default: 'default',
        description: 'Alert style variant',
      },
    ],
  },

  UiAvatar: {
    name: 'UiAvatar',
    displayName: 'Avatar',
    description: 'User avatar with image and fallback',
    category: 'data',
    icon: 'mdi:account-circle',
    styles: '', // Styles are in avatar.ts
    props: [
      { name: 'src', type: 'string', default: '', description: 'Image URL' },
      { name: 'alt', type: 'string', default: '', description: 'Alt text' },
      { name: 'fallback', type: 'string', default: '', description: 'Fallback initials' },
      {
        name: 'size',
        type: 'select',
        options: ['default', 'sm', 'lg', 'xl'],
        default: 'default',
        description: 'Avatar size',
      },
    ],
    binding: {
      stateMapping: (state, attrs) => ({
        fallback: (attrs.friendly_name as string)?.slice(0, 2)?.toUpperCase() || state.slice(0, 2).toUpperCase(),
        src: attrs.entity_picture as string || '',
      }),
      supportedDomains: ['person', 'device_tracker'],
    },
  },

  UiSeparator: {
    name: 'UiSeparator',
    displayName: 'Separator',
    description: 'Visual divider line',
    category: 'layout',
    icon: 'mdi:minus',
    styles: '', // Styles are in separator.ts
    props: [
      {
        name: 'orientation',
        type: 'select',
        options: ['horizontal', 'vertical'],
        default: 'horizontal',
        description: 'Separator direction',
      },
    ],
  },

  UiSkeleton: {
    name: 'UiSkeleton',
    displayName: 'Skeleton',
    description: 'Loading placeholder with animation',
    category: 'layout',
    icon: 'mdi:rectangle-outline',
    styles: '', // Styles are in skeleton.ts
    props: [
      {
        name: 'variant',
        type: 'select',
        options: ['default', 'circle', 'text'],
        default: 'default',
        description: 'Skeleton shape',
      },
    ],
  },

  UiBadge: {
    name: 'UiBadge',
    displayName: 'Badge',
    description: 'Small status indicator for labels, counts, or status',
    category: 'feedback',
    icon: 'mdi:tag',
    styles: '', // Styles are in badge.ts
    props: [
      { name: 'text', type: 'string', default: '', description: 'Badge text' },
      {
        name: 'variant',
        type: 'select',
        options: ['default', 'secondary', 'destructive', 'outline', 'success', 'warning'],
        default: 'default',
        description: 'Badge style variant',
      },
      {
        name: 'size',
        type: 'select',
        options: ['default', 'sm', 'lg'],
        default: 'default',
        description: 'Badge size',
      },
    ],
    binding: {
      stateMapping: (state) => ({
        text: state,
      }),
      supportedDomains: undefined, // All domains
    },
  },

  UiChart: {
    name: 'UiChart',
    displayName: 'Chart',
    description: 'Line, bar, or area chart for displaying entity history',
    category: 'data',
    icon: 'mdi:chart-line',
    styles: '', // Styles are in chart.tsx and ui-chart.tsx
    props: [
      {
        name: 'chartType',
        type: 'select',
        options: ['line', 'bar', 'area'],
        default: 'line',
        description: 'Type of chart to display',
      },
      {
        name: 'hoursToShow',
        type: 'select',
        options: ['1', '6', '12', '24', '48', '168'],
        default: '24',
        description: 'Hours of history to display',
      },
      { name: 'height', type: 'number', default: 200, description: 'Chart height in pixels' },
      { name: 'showGrid', type: 'boolean', default: true, description: 'Show grid lines' },
      { name: 'showTooltip', type: 'boolean', default: true, description: 'Show tooltip on hover' },
      { name: 'showLegend', type: 'boolean', default: false, description: 'Show chart legend' },
      { name: 'color', type: 'color', default: 'var(--primary)', description: 'Chart color' },
      { name: 'strokeWidth', type: 'number', default: 2, description: 'Line stroke width' },
      { name: 'fill', type: 'boolean', default: false, description: 'Fill area under line' },
    ],
    binding: {
      stateMapping: (state, attrs) => ({
        currentValue: parseFloat(state) || 0,
        unit: attrs.unit_of_measurement as string || '',
      }),
      supportedDomains: ['sensor', 'number', 'counter', 'input_number'],
    },
  },

  UiInput: {
    name: 'UiInput',
    displayName: 'Input',
    description: 'Text input field for forms and user input',
    category: 'input',
    icon: 'mdi:form-textbox',
    styles: '', // Styles are in input.ts
    props: [
      { name: 'value', type: 'string', default: '', description: 'Input value' },
      { name: 'placeholder', type: 'string', default: 'Enter text...', description: 'Placeholder text' },
      {
        name: 'type',
        type: 'select',
        options: ['text', 'number', 'email', 'password', 'tel', 'url'],
        default: 'text',
        description: 'Input type',
      },
      {
        name: 'size',
        type: 'select',
        options: ['default', 'sm', 'lg'],
        default: 'default',
        description: 'Input size',
      },
      { name: 'disabled', type: 'boolean', default: false, description: 'Disable the input' },
    ],
    defaultAction: { type: 'call-service', service: 'input_text.set_value' },
    binding: {
      stateMapping: (state) => ({
        value: state,
      }),
      supportedDomains: ['input_text', 'text'],
    },
  },

  UiTabs: {
    name: 'UiTabs',
    displayName: 'Tabs',
    description: 'Tab navigation for organizing content into sections',
    category: 'layout',
    icon: 'mdi:tab',
    styles: '', // Styles are in tabs.ts
    props: [
      { name: 'defaultTab', type: 'string', default: '0', description: 'Default active tab index' },
      {
        name: 'variant',
        type: 'select',
        options: ['default', 'vertical'],
        default: 'default',
        description: 'Tabs layout variant',
      },
      { name: 'fullWidth', type: 'boolean', default: false, description: 'Tabs take full width' },
    ],
    // Tabs are layout components, no entity binding needed
    binding: undefined,
  },

  UiAccordion: {
    name: 'UiAccordion',
    displayName: 'Accordion',
    description: 'Collapsible content sections for grouping entities',
    category: 'layout',
    icon: 'mdi:chevron-down-box-outline',
    styles: '', // Styles are in accordion.ts
    props: [
      {
        name: 'type',
        type: 'select',
        options: ['single', 'multiple'],
        default: 'single',
        description: 'Allow single or multiple sections open',
      },
      { name: 'collapsible', type: 'boolean', default: true, description: 'Allow collapsing all sections' },
    ],
    // Layout component, no entity binding
    binding: undefined,
  },

  UiCollapsible: {
    name: 'UiCollapsible',
    displayName: 'Collapsible',
    description: 'Simple show/hide toggle for content sections',
    category: 'layout',
    icon: 'mdi:arrow-collapse-vertical',
    styles: '', // Styles are in collapsible.ts
    props: [
      { name: 'defaultOpen', type: 'boolean', default: false, description: 'Start expanded' },
    ],
    // Layout component, no entity binding
    binding: undefined,
  },

  UiRadioGroup: {
    name: 'UiRadioGroup',
    displayName: 'Radio Group',
    description: 'Single selection from multiple options (fan speed, modes)',
    category: 'input',
    icon: 'mdi:radiobox-marked',
    styles: '', // Styles are in radio-group.ts
    props: [
      { name: 'value', type: 'string', default: '', description: 'Selected value' },
      {
        name: 'orientation',
        type: 'select',
        options: ['vertical', 'horizontal'],
        default: 'vertical',
        description: 'Layout orientation',
      },
    ],
    defaultAction: { type: 'call-service', service: 'input_select.select_option' },
    binding: {
      stateMapping: (state) => ({
        value: state,
      }),
      supportedDomains: ['input_select', 'fan', 'climate'],
    },
  },

  UiTextarea: {
    name: 'UiTextarea',
    displayName: 'Textarea',
    description: 'Multi-line text input for TTS messages, notes',
    category: 'input',
    icon: 'mdi:text-box-outline',
    styles: '', // Styles are in textarea.ts
    props: [
      { name: 'value', type: 'string', default: '', description: 'Text content' },
      { name: 'placeholder', type: 'string', default: 'Enter text...', description: 'Placeholder text' },
      {
        name: 'resize',
        type: 'select',
        options: ['vertical', 'fixed', 'horizontal', 'both'],
        default: 'vertical',
        description: 'Resize behavior',
      },
      { name: 'rows', type: 'number', default: 4, description: 'Number of visible rows' },
      { name: 'disabled', type: 'boolean', default: false, description: 'Disable the textarea' },
    ],
    defaultAction: { type: 'call-service', service: 'input_text.set_value' },
    binding: {
      stateMapping: (state) => ({
        value: state,
      }),
      supportedDomains: ['input_text', 'text'],
    },
  },

  UiAspectRatio: {
    name: 'UiAspectRatio',
    displayName: 'Aspect Ratio',
    description: 'Container with fixed aspect ratio for camera feeds, images',
    category: 'layout',
    icon: 'mdi:aspect-ratio',
    styles: '', // Styles are in aspect-ratio.ts
    props: [
      {
        name: 'ratio',
        type: 'select',
        options: ['square', 'video', 'portrait', 'landscape', 'ultrawide'],
        default: 'video',
        description: 'Aspect ratio preset',
      },
    ],
    // Layout component, no entity binding
    binding: undefined,
  },

  UiTooltip: {
    name: 'UiTooltip',
    displayName: 'Tooltip',
    description: 'CSS-only tooltip for displaying info on hover (Shadow DOM safe)',
    category: 'feedback',
    icon: 'mdi:tooltip-text',
    styles: '', // Styles are in tooltip.ts
    props: [
      { name: 'content', type: 'string', default: 'Tooltip text', description: 'Tooltip content' },
      {
        name: 'side',
        type: 'select',
        options: ['top', 'right', 'bottom', 'left'],
        default: 'top',
        description: 'Position of the tooltip',
      },
      { name: 'delayed', type: 'boolean', default: false, description: 'Add delay before showing' },
      { name: 'showArrow', type: 'boolean', default: true, description: 'Show arrow pointer' },
    ],
    // Tooltip is a utility, no entity binding
    binding: undefined,
  },

  UiPopover: {
    name: 'UiPopover',
    displayName: 'Popover',
    description: 'CSS-only popover for interactive content on click (Shadow DOM safe)',
    category: 'layout',
    icon: 'mdi:card-text-outline',
    styles: '', // Styles are in popover.ts
    props: [
      {
        name: 'side',
        type: 'select',
        options: ['top', 'right', 'bottom', 'left'],
        default: 'bottom',
        description: 'Position of the popover',
      },
      {
        name: 'align',
        type: 'select',
        options: ['start', 'center', 'end'],
        default: 'center',
        description: 'Alignment of the popover',
      },
      {
        name: 'size',
        type: 'select',
        options: ['default', 'sm', 'lg', 'auto'],
        default: 'default',
        description: 'Width of the popover content',
      },
    ],
    // Popover is a container, no entity binding
    binding: undefined,
  },

  UiHoverCard: {
    name: 'UiHoverCard',
    displayName: 'Hover Card',
    description: 'CSS-only hover card for rich content preview on hover (Shadow DOM safe)',
    category: 'feedback',
    icon: 'mdi:card-account-details-outline',
    styles: '', // Styles are in hover-card.ts
    props: [
      {
        name: 'side',
        type: 'select',
        options: ['top', 'right', 'bottom', 'left'],
        default: 'bottom',
        description: 'Position of the hover card',
      },
      {
        name: 'align',
        type: 'select',
        options: ['start', 'center', 'end'],
        default: 'center',
        description: 'Alignment of the hover card',
      },
      {
        name: 'size',
        type: 'select',
        options: ['default', 'sm', 'lg', 'xl'],
        default: 'default',
        description: 'Width of the hover card content',
      },
      { name: 'instant', type: 'boolean', default: false, description: 'Show immediately without delay' },
    ],
    // HoverCard can show entity details on hover
    binding: {
      stateMapping: (state, attrs) => ({
        entityState: state,
        friendlyName: attrs.friendly_name as string || '',
        entityPicture: attrs.entity_picture as string || '',
      }),
      supportedDomains: ['person', 'device_tracker', 'camera', 'media_player'],
    },
  },

  UiDialog: {
    name: 'UiDialog',
    displayName: 'Dialog',
    description: 'CSS-only in-card modal for focused interactions (Shadow DOM safe)',
    category: 'layout',
    icon: 'mdi:window-maximize',
    styles: '', // Styles are in dialog.ts
    props: [
      { name: 'title', type: 'string', default: 'Dialog Title', description: 'Dialog title' },
      { name: 'description', type: 'string', default: '', description: 'Dialog description' },
      {
        name: 'size',
        type: 'select',
        options: ['default', 'sm', 'lg', 'xl', 'full'],
        default: 'default',
        description: 'Width of the dialog',
      },
      { name: 'showCloseButton', type: 'boolean', default: true, description: 'Show close button' },
      { name: 'fullCard', type: 'boolean', default: false, description: 'Dialog fills the parent card' },
    ],
    // Dialog is a container, no entity binding
    binding: undefined,
  },

  UiSheet: {
    name: 'UiSheet',
    displayName: 'Sheet',
    description: 'CSS-only in-card drawer for sliding panels (Shadow DOM safe)',
    category: 'layout',
    icon: 'mdi:page-layout-sidebar-right',
    styles: '', // Styles are in sheet.ts
    props: [
      { name: 'title', type: 'string', default: 'Sheet Title', description: 'Sheet title' },
      { name: 'description', type: 'string', default: '', description: 'Sheet description' },
      {
        name: 'side',
        type: 'select',
        options: ['right', 'left', 'top', 'bottom'],
        default: 'right',
        description: 'Which edge the sheet slides from',
      },
      {
        name: 'size',
        type: 'select',
        options: ['default', 'sm', 'lg', 'full'],
        default: 'default',
        description: 'Width/height of the sheet',
      },
      { name: 'showCloseButton', type: 'boolean', default: true, description: 'Show close button' },
    ],
    // Sheet is a container, no entity binding
    binding: undefined,
  },

  UiAlertDialog: {
    name: 'UiAlertDialog',
    displayName: 'Alert Dialog',
    description: 'CSS-only confirmation dialog with Cancel/Action buttons (Shadow DOM safe)',
    category: 'feedback',
    icon: 'mdi:alert-circle-outline',
    styles: '', // Styles are in alert-dialog.ts
    props: [
      { name: 'title', type: 'string', default: 'Are you sure?', description: 'Dialog title' },
      { name: 'description', type: 'string', default: 'This action cannot be undone.', description: 'Dialog description' },
      { name: 'cancelText', type: 'string', default: 'Cancel', description: 'Cancel button text' },
      { name: 'actionText', type: 'string', default: 'Continue', description: 'Action button text' },
      {
        name: 'variant',
        type: 'select',
        options: ['default', 'destructive'],
        default: 'default',
        description: 'Action button style (destructive for delete confirmations)',
      },
      {
        name: 'size',
        type: 'select',
        options: ['default', 'sm', 'lg'],
        default: 'default',
        description: 'Width of the dialog',
      },
    ],
    // AlertDialog is for confirmations, typically triggers a service call
    defaultAction: { type: 'call-service' },
    binding: undefined,
  },

  UiRawHTML: {
    name: 'UiRawHTML',
    displayName: 'Raw HTML',
    description: 'Custom HTML/Jinja template with full Shadcn component access',
    category: 'layout',
    icon: 'mdi:code-tags',
    styles: '',
    props: [
      {
        name: 'content',
        type: 'string',
        default: '<div class="shc-card shc-p-4">\n  <h3 class="shc-text-lg shc-font-semibold">Custom HTML</h3>\n  <p class="shc-text-muted-foreground">Your HTML here with Jinja2 support</p>\n</div>',
        description: 'HTML content with Jinja2 support. Access all .shc-* component classes.',
        required: true,
      },
    ],
    binding: undefined, // No automatic binding, user manages manually in HTML
  },

  // ============================================================================
  // v2.1.0: Critical Power User Components
  // ============================================================================

  UiScrollArea: {
    name: 'UiScrollArea',
    displayName: 'Scroll Area',
    description: 'Scrollable container with custom scrollbar styling',
    category: 'layout',
    icon: 'mdi:arrow-vertical-lock',
    styles: '',
    props: [
      {
        name: 'orientation',
        type: 'select',
        options: ['vertical', 'horizontal', 'both'],
        default: 'vertical',
        description: 'Scroll direction',
      },
      { name: 'maxHeight', type: 'string', default: '300px', description: 'Maximum height for vertical scroll' },
      { name: 'maxWidth', type: 'string', default: '100%', description: 'Maximum width for horizontal scroll' },
    ],
    binding: undefined, // Container component
  },

  UiToastProvider: {
    name: 'UiToastProvider',
    displayName: 'Toast Provider',
    description: 'Provides toast notification system for action feedback',
    category: 'feedback',
    icon: 'mdi:message-alert-outline',
    styles: '',
    props: [
      {
        name: 'type',
        type: 'select',
        options: ['default', 'success', 'error', 'warning', 'info'],
        default: 'default',
        description: 'Toast visual style',
      },
      { name: 'title', type: 'string', default: '', description: 'Toast title' },
      { name: 'description', type: 'string', default: '', description: 'Toast message content' },
      { name: 'duration', type: 'number', default: 3000, description: 'Auto-dismiss duration in milliseconds' },
      { name: 'actionLabel', type: 'string', default: '', description: 'Optional action button label' },
    ],
    binding: undefined, // Used for notifications, not entity-bound
  },

  UiCombobox: {
    name: 'UiCombobox',
    displayName: 'Combobox',
    description: 'Searchable autocomplete select for large entity lists',
    category: 'input',
    icon: 'mdi:format-list-checkbox',
    styles: '',
    props: [
      { name: 'placeholder', type: 'string', default: 'Select...', description: 'Placeholder text' },
      { name: 'searchPlaceholder', type: 'string', default: 'Search...', description: 'Search input placeholder' },
      { name: 'emptyMessage', type: 'string', default: 'No results found.', description: 'Empty state message' },
      { name: 'disabled', type: 'boolean', default: false, description: 'Disable the combobox' },
    ],
    defaultAction: { type: 'call-service' },
    binding: {
      stateMapping: (state) => ({
        value: state,
      }),
      supportedDomains: ['select', 'input_select'], // Best for select entities
    },
  },

  UiTable: {
    name: 'UiTable',
    displayName: 'Data Table',
    description: 'Sortable data table for device inventory and logs',
    category: 'data',
    icon: 'mdi:table',
    styles: '',
    props: [
      { name: 'sortable', type: 'boolean', default: true, description: 'Enable column sorting' },
      {
        name: 'columns',
        type: 'string',
        default: '[]',
        description: 'JSON array of column definitions: [{ key: "name", label: "Device Name", sortable: true }]',
      },
      {
        name: 'data',
        type: 'string',
        default: '[]',
        description: 'JSON array of row data: [{ id: "1", name: "Living Room Light", status: "On" }]',
      },
    ],
    binding: undefined, // Data passed via props, not entity-bound
  },

  UiCommand: {
    name: 'UiCommand',
    displayName: 'Command Palette',
    description: 'Cmd+K spotlight search for quick actions',
    category: 'input',
    icon: 'mdi:keyboard',
    styles: '',
    props: [
      { name: 'placeholder', type: 'string', default: 'Type a command or search...', description: 'Search input placeholder' },
      { name: 'emptyMessage', type: 'string', default: 'No results found.', description: 'Empty state message' },
      {
        name: 'groups',
        type: 'string',
        default: '[]',
        description: 'JSON array of command groups: [{ heading: "Actions", items: [{ id: "1", label: "Turn off lights", onSelect: "..." }] }]',
      },
    ],
    defaultAction: { type: 'call-service' },
    binding: undefined, // Command palette is not entity-bound
  },
}

// ============================================================================
// Component Registry Class
// ============================================================================

export class ComponentRegistry {
  private components = new Map<string, ComponentDefinition>()
  private injectedStyles = new WeakMap<ShadowRoot, Set<string>>()

  constructor() {
    // Pre-register UI components for visual editor
    Object.values(UI_COMPONENTS).forEach((comp) => {
      this.components.set(comp.name, comp)
    })
  }

  /**
   * Register a component with the registry
   */
  register(component: ComponentDefinition): void {
    this.components.set(component.name, component)
  }

  /**
   * Register multiple components at once
   */
  registerAll(components: ComponentDefinition[]): void {
    components.forEach((component) => this.register(component))
  }

  /**
   * Get a registered component
   */
  get(name: string): ComponentDefinition | undefined {
    return this.components.get(name)
  }

  /**
   * Check if a component is registered
   */
  has(name: string): boolean {
    return this.components.has(name)
  }

  /**
   * Inject component styles into a shadow root
   * Tracks injected styles to prevent duplicates
   */
  injectStyles(shadowRoot: ShadowRoot, componentName: string): void {
    const component = this.components.get(componentName)
    if (!component) {
      console.warn(`Component '${componentName}' not found in registry`)
      return
    }

    // Skip if no styles to inject
    if (!component.styles) return

    // Track which styles have been injected into this shadow root
    if (!this.injectedStyles.has(shadowRoot)) {
      this.injectedStyles.set(shadowRoot, new Set())
    }

    const injected = this.injectedStyles.get(shadowRoot)!
    if (injected.has(componentName)) {
      return // Already injected
    }

    // Create and append style element
    const styleEl = document.createElement('style')
    styleEl.textContent = component.styles
    styleEl.setAttribute('data-component', componentName)
    shadowRoot.appendChild(styleEl)

    injected.add(componentName)
  }

  /**
   * Inject styles for multiple components
   */
  injectAllStyles(shadowRoot: ShadowRoot, componentNames: string[]): void {
    componentNames.forEach((name) => this.injectStyles(shadowRoot, name))
  }

  /**
   * Initialize a component in a shadow root
   */
  init(shadowRoot: ShadowRoot, componentName: string): void {
    const component = this.components.get(componentName)
    if (!component) {
      console.warn(`Component '${componentName}' not found in registry`)
      return
    }

    // Inject styles first
    this.injectStyles(shadowRoot, componentName)

    // Call init function if provided
    if (component.init) {
      component.init(shadowRoot)
    }
  }

  /**
   * Initialize all registered components
   */
  initAll(shadowRoot: ShadowRoot): void {
    this.components.forEach((_, name) => {
      this.init(shadowRoot, name)
    })
  }

  /**
   * Cleanup component resources
   */
  cleanup(shadowRoot: ShadowRoot, componentName: string): void {
    const component = this.components.get(componentName)
    if (component?.cleanup) {
      component.cleanup(shadowRoot)
    }
  }

  /**
   * Get all registered component names
   */
  getComponentNames(): string[] {
    return Array.from(this.components.keys())
  }

  /**
   * Get count of registered components
   */
  size(): number {
    return this.components.size
  }

  /**
   * Get components by category (for visual editor palette)
   */
  getByCategory(category: ComponentCategory): ComponentDefinition[] {
    return Array.from(this.components.values()).filter((c) => c.category === category)
  }

  /**
   * Get all UI components (those with visual editor support)
   */
  getUIComponents(): ComponentDefinition[] {
    return Array.from(this.components.values()).filter(
      (c) => c.category !== undefined && c.props !== undefined
    )
  }

  /**
   * Get components that support a specific entity domain
   */
  getComponentsForDomain(domain: string): ComponentDefinition[] {
    return Array.from(this.components.values()).filter((c) => {
      if (!c.binding) return false
      if (!c.binding.supportedDomains) return true // Supports all domains
      return c.binding.supportedDomains.includes(domain)
    })
  }
}

// Global component registry instance
export const componentRegistry = new ComponentRegistry()
