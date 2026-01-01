import { ActionConfig } from 'custom-card-helpers';

/**
 * Main configuration interface for Status Banner Card
 */
export interface StatusBannerCardConfig {
  /** Card type identifier */
  type: string;

  /** Primary entity to display */
  entity: string;

  /**
   * Rules evaluated in order - first matching rule wins
   * If no rules match, default values are used
   */
  rules?: StateRule[];

  /** Default values when no rule matches */
  default?: Partial<DisplayConfig>;

  /**
   * Named color mappings for use in templates
   * Usage: {{ attr.bin_type | color_map }}
   */
  color_map?: Record<string, string>;

  /** Entity for "last updated" timestamp display */
  timestamp_entity?: string;

  /** Attribute to use for timestamp - default: last_triggered */
  timestamp_attribute?: string;

  /** Entity for secondary info in status box */
  secondary_info_entity?: string;

  /** Tap action for entire card */
  tap_action?: ActionConfig;

  /** Hold action for entire card */
  hold_action?: ActionConfig;

  /** Button actions - matched by CSS selector */
  button_actions?: ButtonAction[];

  /** Show diagonal stripe pattern on header accent */
  show_pattern?: boolean;

  /** Custom label for status box header (e.g., Status, Strategy) */
  status_label?: string;

  /** Show status box below header */
  show_status?: boolean;

  /** Show footer with timestamp and button */
  show_footer?: boolean;

  /** Header height (CSS value) */
  header_height?: string;

  /** Main icon size (CSS value) */
  icon_size?: string;

  /** Border radius (CSS value) */
  border_radius?: string;

  /** Card style variant */
  variant?: 'full' | 'header-only' | 'compact';
}

/**
 * State rule for matching entity state to display configuration
 */
export interface StateRule {
  /** State value to match (exact or regex with /pattern/) */
  state?: string;

  /** Attribute condition */
  attribute?: {
    name: string;
    value: string;
  };

  /** Title template string */
  title?: string;

  /** Subtitle template string */
  subtitle?: string;

  /** Icon (MDI icon or template) */
  icon?: string;

  /** Color (hex color or template with color_map) */
  color?: string;

  /** Status text template for status box */
  status_text?: string;
}

/**
 * Display configuration for rendering
 */
export interface DisplayConfig {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  status_text?: string;
}

/**
 * Resolved display data after template processing
 */
export interface DisplayData {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  statusText: string;
  statusLabel: string;
}

/**
 * Button action configuration
 */
export interface ButtonAction {
  /** CSS selector for button element */
  selector: string;

  /** Button label - template string */
  label?: string;

  /** Button icon */
  icon?: string;

  /** Tap action */
  tap_action: ActionConfig;
}

/**
 * Template context for evaluating expressions
 */
export interface TemplateContext {
  hass: HomeAssistantFixed;
  entity: string;
  state: string;
  attr: Record<string, unknown>;
  colorMap?: Record<string, string>;
}

/**
 * Extended HomeAssistant type with states
 */
export interface HomeAssistantFixed {
  states: Record<string, HassEntity>;
  callService: (domain: string, service: string, data?: Record<string, unknown>) => Promise<void>;
  formatEntityState: (stateObj: HassEntity) => string;
  formatEntityAttributeValue: (stateObj: HassEntity, attribute: string) => string;
  language: string;
  locale: Record<string, unknown>;
}

/**
 * Home Assistant entity state
 */
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
  context: {
    id: string;
    parent_id: string | null;
    user_id: string | null;
  };
}