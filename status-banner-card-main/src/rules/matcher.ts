import { StateRule, DisplayConfig, DisplayData, TemplateContext, HomeAssistantFixed } from '../types';
import { parseTemplate } from '../template/parser';
import { FALLBACK_DISPLAY, ERROR_DISPLAY } from '../constants';

/**
 * Match rules against entity state and return the first matching rule
 */
export function matchRule(
  state: string,
  attributes: Record<string, unknown>,
  rules: StateRule[]
): StateRule | null {
  for (const rule of rules) {
    if (ruleMatches(rule, state, attributes)) {
      return rule;
    }
  }
  return null;
}

/**
 * Check if a single rule matches the current state and attributes
 */
function ruleMatches(
  rule: StateRule,
  state: string,
  attributes: Record<string, unknown>
): boolean {
  // Check state condition
  if (rule.state !== undefined) {
    if (rule.state.startsWith('/') && rule.state.endsWith('/')) {
      // Regex pattern
      const pattern = new RegExp(rule.state.slice(1, -1));
      if (!pattern.test(state)) return false;
    } else {
      // Exact match (case-insensitive option with ~ prefix)
      if (rule.state.startsWith('~')) {
        if (rule.state.slice(1).toLowerCase() !== state.toLowerCase()) return false;
      } else {
        if (rule.state !== state) return false;
      }
    }
  }

  // Check attribute condition
  if (rule.attribute) {
    const attrValue = String(attributes[rule.attribute.name] ?? '');
    if (rule.attribute.value.startsWith('/') && rule.attribute.value.endsWith('/')) {
      // Regex pattern
      const pattern = new RegExp(rule.attribute.value.slice(1, -1));
      if (!pattern.test(attrValue)) return false;
    } else {
      if (attrValue !== rule.attribute.value) return false;
    }
  }

  return true;
}

/**
 * Resolve display data from matched rule or default configuration
 */
export function resolveDisplayData(
  hass: HomeAssistantFixed,
  entityId: string,
  rules: StateRule[] | undefined,
  defaultConfig: Partial<DisplayConfig> | undefined,
  colorMap: Record<string, string> | undefined,
  statusLabelConfig?: string
): DisplayData {
  const entity = hass.states[entityId];

  // Entity not found
  if (!entity) {
    return {
      ...ERROR_DISPLAY,
      subtitle: entityId,
      statusLabel: statusLabelConfig || 'Status',
    };
  }

  const state = entity.state;
  const attributes = entity.attributes;

  // Create template context
  const context: TemplateContext = {
    hass,
    entity: entityId,
    state,
    attr: attributes,
    colorMap,
  };

  // Find matching rule
  const matchedRule = rules ? matchRule(state, attributes, rules) : null;

  // Use matched rule, default, or fallback
  const source = matchedRule || defaultConfig || FALLBACK_DISPLAY;

  // Resolve templates
  return {
    title: parseTemplate(source.title || state, context),
    subtitle: parseTemplate(source.subtitle || '', context),
    icon: parseTemplate(source.icon || 'mdi:information', context),
    color: parseTemplate(source.color || '#9E9E9E', context),
    statusText: parseTemplate(source.status_text || '', context),
    statusLabel: parseTemplate(statusLabelConfig || 'Status', context),
  };
}