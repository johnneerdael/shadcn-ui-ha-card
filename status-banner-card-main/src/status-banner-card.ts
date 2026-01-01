import { LitElement, html, nothing, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  StatusBannerCardConfig,
  DisplayData,
  HomeAssistantFixed,
  ButtonAction,
  TemplateContext,
} from './types';
import { resolveDisplayData } from './rules/matcher';
import { parseTemplate } from './template/parser';
import { styles } from './styles';
import { DEFAULT_CONFIG, CARD_INFO } from './constants';

// Declare the customCards array on window
declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}

@customElement('status-banner-card')
export class StatusBannerCard extends LitElement {
  // ─────────────────────────────────────────────────────────────
  // Properties
  // ─────────────────────────────────────────────────────────────

  @property({ attribute: false })
  public hass!: HomeAssistantFixed;

  @state()
  private _config!: StatusBannerCardConfig;

  // ─────────────────────────────────────────────────────────────
  // Styles
  // ─────────────────────────────────────────────────────────────

  static styles = styles;

  // ─────────────────────────────────────────────────────────────
  // Lifecycle
  // ─────────────────────────────────────────────────────────────

  public setConfig(config: StatusBannerCardConfig): void {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }

    // Merge with defaults
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      color_map: {
        ...DEFAULT_CONFIG.color_map,
        ...config.color_map,
      },
    };
  }

  public getCardSize(): number {
    if (this._config?.variant === 'compact') return 2;
    if (this._config?.variant === 'header-only') return 2;
    return 3;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has('_config')) {
      return true;
    }

    if (changedProps.has('hass')) {
      const oldHass = changedProps.get('hass') as HomeAssistantFixed | undefined;
      if (!oldHass) return true;

      // Check if relevant entities changed
      const entityId = this._config.entity;
      if (oldHass.states[entityId] !== this.hass.states[entityId]) {
        return true;
      }

      // Check timestamp entity
      if (this._config.timestamp_entity) {
        if (
          oldHass.states[this._config.timestamp_entity] !==
          this.hass.states[this._config.timestamp_entity]
        ) {
          return true;
        }
      }

      // Check secondary info entity
      if (this._config.secondary_info_entity) {
        if (
          oldHass.states[this._config.secondary_info_entity] !==
          this.hass.states[this._config.secondary_info_entity]
        ) {
          return true;
        }
      }

      return false;
    }

    return true;
  }

  // ─────────────────────────────────────────────────────────────
  // Editor Integration
  // ─────────────────────────────────────────────────────────────

  public static getConfigElement(): HTMLElement {
    return document.createElement('status-banner-card-editor');
  }

  public static getStubConfig(): Partial<StatusBannerCardConfig> {
    return {
      entity: '',
      rules: [
        {
          state: 'on',
          title: 'Active',
          subtitle: 'System is running',
          icon: 'mdi:check-circle',
          color: '#4CAF50',
        },
        {
          state: 'off',
          title: 'Inactive',
          subtitle: 'System is idle',
          icon: 'mdi:power-standby',
          color: '#9E9E9E',
        },
      ],
      default: {
        title: '{{ state | upper }}',
        subtitle: '',
        icon: 'mdi:information',
        color: '#2196F3',
      },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // Rendering
  // ─────────────────────────────────────────────────────────────

  protected render(): TemplateResult {
    if (!this._config || !this.hass) {
      return html``;
    }

    const display = resolveDisplayData(
      this.hass,
      this._config.entity,
      this._config.rules,
      this._config.default,
      this._config.color_map,
      this._config.status_label
    );

    const variant = this._config.variant || 'full';
    const showStatus = this._config.show_status !== false && variant !== 'header-only';
    const showFooter = this._config.show_footer !== false && variant !== 'header-only';

    return html`
      <ha-card @click=${this._handleCardClick}>
        <div
          class="card-container ${variant}"
          style="--border-radius: ${this._config.border_radius}"
        >
          ${this._renderHeader(display)}
          ${showStatus && display.statusText ? this._renderStatusBox(display) : nothing}
          ${showFooter ? this._renderFooter(display) : nothing}
        </div>
      </ha-card>
    `;
  }

  private _renderHeader(display: DisplayData): TemplateResult {
    const showPattern = this._config.show_pattern !== false;

    return html`
      <div class="header" style="--header-height: ${this._config.header_height}">
        <div
          class="header-accent ${showPattern ? 'with-pattern' : ''}"
          style="--accent-color: ${display.color}"
        ></div>

        <div class="header-content">
          <div class="header-text">
            <div class="title">${display.title}</div>
            ${display.subtitle ? html`<div class="subtitle">${display.subtitle}</div>` : nothing}
          </div>

          <ha-icon
            class="header-icon"
            .icon=${display.icon}
            style="--mdc-icon-size: ${this._config.icon_size}; color: ${display.color}"
          ></ha-icon>
        </div>
      </div>
    `;
  }

  private _renderStatusBox(display: DisplayData): TemplateResult {
    return html`
      <div class="body">
        <div class="status-box">
          <span class="status-label" style="color: ${display.color}">${display.statusLabel}:</span>
          <span class="status-text">${display.statusText}</span>
        </div>
      </div>
    `;
  }

  private _renderFooter(display: DisplayData): TemplateResult {
    const timestamp = this._getTimestamp();
    const buttonAction = this._config.button_actions?.[0];

    if (!timestamp && !buttonAction) {
      return html``;
    }

    return html`
      <div class="footer">
        ${timestamp
          ? html` <div class="timestamp">Last Check: ${timestamp}</div> `
          : html`<div></div>`}
        ${buttonAction ? this._renderButton(buttonAction, display) : nothing}
      </div>
    `;
  }

  private _renderButton(action: ButtonAction, display: DisplayData): TemplateResult {
    // Create template context for button label
    const entity = this.hass.states[this._config.entity];
    const context: TemplateContext = {
      hass: this.hass,
      entity: this._config.entity,
      state: entity?.state || '',
      attr: entity?.attributes || {},
      colorMap: this._config.color_map,
    };

    const label = action.label ? parseTemplate(action.label, context) : 'Update';

    return html`
      <button
        class="action-btn ${action.selector?.replace('.', '') || 'update-btn'}"
        style="background-color: ${display.color}"
        @click=${(e: Event) => this._handleButtonClick(e, action)}
      >
        ${action.icon ? html`<ha-icon icon="${action.icon}"></ha-icon>` : nothing}
        <span>${label}</span>
      </button>
    `;
  }

  private _getTimestamp(): string | null {
    if (!this._config.timestamp_entity) return null;

    const entity = this.hass.states[this._config.timestamp_entity];
    if (!entity) return null;

    const attr = this._config.timestamp_attribute || 'last_triggered';
    const value = (entity.attributes[attr] as string) || entity.state;

    if (!value || value === 'unknown' || value === 'unavailable') {
      return null;
    }

    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return null;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────

  private _handleCardClick(): void {
    if (!this._config.tap_action || this._config.tap_action.action === 'more-info') {
      this._showMoreInfo();
      return;
    }
    this._executeAction(this._config.tap_action);
  }

  private _handleButtonClick(e: Event, action: ButtonAction): void {
    e.stopPropagation();
    if (action.tap_action) {
      this._executeAction(action.tap_action);
    }
  }

  private _executeAction(action: StatusBannerCardConfig['tap_action']): void {
    if (!action) return;

    switch (action.action) {
      case 'more-info':
        this._showMoreInfo();
        break;

      case 'call-service': {
        if (!action.service) break;
        const [domain, service] = action.service.split('.');
        this.hass.callService(domain, service, {
          ...action.service_data,
          ...(action.target || {}),
        });
        break;
      }

      case 'navigate':
        if (action.navigation_path) {
          window.history.pushState(null, '', action.navigation_path);
          window.dispatchEvent(new Event('location-changed'));
        }
        break;

      case 'url':
        if (action.url_path) {
          window.open(action.url_path, '_blank');
        }
        break;

      case 'none':
        break;
    }
  }

  private _showMoreInfo(): void {
    const event = new CustomEvent('hass-more-info', {
      bubbles: true,
      composed: true,
      detail: { entityId: this._config.entity },
    });
    this.dispatchEvent(event);
  }
}

// ─────────────────────────────────────────────────────────────
// Register Card
// ─────────────────────────────────────────────────────────────

window.customCards = window.customCards || [];
window.customCards.push({
  type: CARD_INFO.type,
  name: CARD_INFO.name,
  description: CARD_INFO.description,
  preview: true,
  documentationURL: CARD_INFO.documentationURL,
});

// Log version info
console.info(
  `%c  STATUS-BANNER-CARD  %c  v1.0.0  `,
  'color: white; background: #2196F3; font-weight: bold;',
  'color: #2196F3; background: white; font-weight: bold;'
);