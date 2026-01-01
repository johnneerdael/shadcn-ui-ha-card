import { LitElement, html, css, TemplateResult, CSSResultGroup, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  StatusBannerCardConfig,
  StateRule,
  HomeAssistantFixed,
  DisplayConfig,
  ButtonAction,
} from './types';
import { DEFAULT_CONFIG } from './constants';

@customElement('status-banner-card-editor')
export class StatusBannerCardEditor extends LitElement {
  @property({ attribute: false })
  public hass!: HomeAssistantFixed;

  @state()
  private _config!: StatusBannerCardConfig;

  @state()
  private _expandedRule: number | null = null;

  public setConfig(config: StatusBannerCardConfig): void {
    this._config = config;
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <div class="editor-container">
        ${this._renderEntitySection()} ${this._renderRulesSection()} ${this._renderDefaultSection()}
        ${this._renderColorMapSection()} ${this._renderFooterSection()}
        ${this._renderLayoutSection()}
      </div>
    `;
  }

  // ─────────────────────────────────────────────────────────────
  // Entity Section
  // ─────────────────────────────────────────────────────────────

  private _renderEntitySection(): TemplateResult {
    return html`
      <div class="section">
        <div class="section-header">
          <ha-icon icon="mdi:database"></ha-icon>
          <span>Entity</span>
        </div>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.entity || ''}
          .label=${'Primary Entity (required)'}
          @value-changed=${(e: CustomEvent) => this._valueChanged('entity', e.detail.value)}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.timestamp_entity || ''}
          .label=${'Timestamp Entity (optional)'}
          .includeDomains=${['automation', 'script', 'sensor']}
          @value-changed=${(e: CustomEvent) =>
            this._valueChanged('timestamp_entity', e.detail.value)}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-textfield
          .value=${this._config.timestamp_attribute || 'last_triggered'}
          .label=${'Timestamp Attribute'}
          @input=${(e: Event) =>
            this._valueChanged('timestamp_attribute', (e.target as HTMLInputElement).value)}
        ></ha-textfield>
      </div>
    `;
  }

  // ─────────────────────────────────────────────────────────────
  // Rules Section
  // ─────────────────────────────────────────────────────────────

  private _renderRulesSection(): TemplateResult {
    const rules = this._config.rules || [];

    return html`
      <div class="section">
        <div class="section-header">
          <ha-icon icon="mdi:format-list-checks"></ha-icon>
          <span>State Rules</span>
        </div>

        <div class="rules-list">
          ${rules.map((rule, index) => this._renderRule(rule, index))}
        </div>

        <button class="add-btn" @click=${this._addRule}>
          <ha-icon icon="mdi:plus"></ha-icon>
          Add Rule
        </button>
      </div>
    `;
  }

  private _renderRule(rule: StateRule, index: number): TemplateResult {
    const isExpanded = this._expandedRule === index;

    return html`
      <div class="rule-card ${isExpanded ? 'expanded' : ''}">
        <div class="rule-header" @click=${() => this._toggleRule(index)}>
          <div class="rule-summary">
            <span class="rule-state">${rule.state || 'Any State'}</span>
            <span class="rule-title">${rule.title || 'No title'}</span>
          </div>
          <div class="rule-actions">
            <ha-icon-button
              .path=${'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'}
              @click=${(e: Event) => this._removeRule(e, index)}
            ></ha-icon-button>
            <ha-icon icon="mdi:chevron-${isExpanded ? 'up' : 'down'}"></ha-icon>
          </div>
        </div>

        ${isExpanded ? this._renderRuleDetails(rule, index) : nothing}
      </div>
    `;
  }

  private _renderRuleDetails(rule: StateRule, index: number): TemplateResult {
    return html`
      <div class="rule-details">
        <ha-textfield
          .value=${rule.state || ''}
          .label=${'State Value (exact or /regex/)'}
          @input=${(e: Event) =>
            this._updateRule(index, 'state', (e.target as HTMLInputElement).value)}
        ></ha-textfield>

        <ha-textfield
          .value=${rule.title || ''}
          .label=${'Title (supports {{ templates }})'}
          @input=${(e: Event) =>
            this._updateRule(index, 'title', (e.target as HTMLInputElement).value)}
        ></ha-textfield>

        <ha-textfield
          .value=${rule.subtitle || ''}
          .label=${'Subtitle (supports {{ templates }})'}
          @input=${(e: Event) =>
            this._updateRule(index, 'subtitle', (e.target as HTMLInputElement).value)}
        ></ha-textfield>

        <ha-icon-picker
          .hass=${this.hass}
          .value=${rule.icon || ''}
          .label=${'Icon'}
          @value-changed=${(e: CustomEvent) => this._updateRule(index, 'icon', e.detail.value)}
        ></ha-icon-picker>

        <div class="color-input">
          <label>Color</label>
          <div class="color-input-row">
            <input
              type="color"
              .value=${rule.color?.startsWith('#') ? rule.color : '#9E9E9E'}
              @input=${(e: Event) =>
                this._updateRule(index, 'color', (e.target as HTMLInputElement).value)}
            />
            <ha-textfield
              .value=${rule.color || ''}
              .label=${'Color or template'}
              @input=${(e: Event) =>
                this._updateRule(index, 'color', (e.target as HTMLInputElement).value)}
            ></ha-textfield>
          </div>
        </div>

        <ha-textfield
          .value=${rule.status_text || ''}
          .label=${'Status Text (supports {{ templates }})'}
          @input=${(e: Event) =>
            this._updateRule(index, 'status_text', (e.target as HTMLInputElement).value)}
        ></ha-textfield>
      </div>
    `;
  }

  // ─────────────────────────────────────────────────────────────
  // Default Section
  // ─────────────────────────────────────────────────────────────

  private _renderDefaultSection(): TemplateResult {
    const defaultConfig: Partial<DisplayConfig> = this._config.default || {};

    return html`
      <div class="section">
        <div class="section-header">
          <ha-icon icon="mdi:cog-outline"></ha-icon>
          <span>Default Display</span>
        </div>
        <p class="section-description">Used when no rules match</p>

        <ha-textfield
          .value=${defaultConfig.title ?? ''}
          .label=${'Default Title'}
          @input=${(e: Event) =>
            this._updateDefault('title', (e.target as HTMLInputElement).value)}
        ></ha-textfield>

        <ha-textfield
          .value=${defaultConfig.subtitle ?? ''}
          .label=${'Default Subtitle'}
          @input=${(e: Event) =>
            this._updateDefault('subtitle', (e.target as HTMLInputElement).value)}
        ></ha-textfield>

        <ha-icon-picker
          .hass=${this.hass}
          .value=${defaultConfig.icon ?? ''}
          .label=${'Default Icon'}
          @value-changed=${(e: CustomEvent) => this._updateDefault('icon', e.detail.value)}
        ></ha-icon-picker>

        <div class="color-input">
          <label>Default Color</label>
          <input
            type="color"
            .value=${defaultConfig.color?.startsWith('#') ? defaultConfig.color : '#9E9E9E'}
            @input=${(e: Event) =>
              this._updateDefault('color', (e.target as HTMLInputElement).value)}
          />
        </div>

        <ha-textfield
          .value=${defaultConfig.status_text ?? ''}
          .label=${'Default Status Text'}
          @input=${(e: Event) =>
            this._updateDefault('status_text', (e.target as HTMLInputElement).value)}
        ></ha-textfield>
      </div>
    `;
  }

  // ─────────────────────────────────────────────────────────────
  // Color Map Section
  // ─────────────────────────────────────────────────────────────

  private _renderColorMapSection(): TemplateResult {
    const colorMap = this._config.color_map || DEFAULT_CONFIG.color_map || {};

    return html`
      <div class="section">
        <div class="section-header">
          <ha-icon icon="mdi:palette"></ha-icon>
          <span>Color Mapping</span>
        </div>
        <p class="section-description">Use with {{ attr.name | color_map }}</p>

        <div class="color-map-list">
          ${Object.entries(colorMap).map(
            ([key, value]) => html`
              <div class="color-map-item">
                <ha-textfield
                  .value=${key}
                  .label=${'Key'}
                  @input=${(e: Event) =>
                    this._updateColorMapKey(key, (e.target as HTMLInputElement).value, value)}
                ></ha-textfield>
                <input
                  type="color"
                  .value=${value}
                  @input=${(e: Event) =>
                    this._updateColorMap(key, (e.target as HTMLInputElement).value)}
                />
                <ha-icon-button
                  .path=${'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'}
                  @click=${() => this._removeColorMap(key)}
                ></ha-icon-button>
              </div>
            `
          )}
        </div>

        <button class="add-btn" @click=${this._addColorMap}>
          <ha-icon icon="mdi:plus"></ha-icon>
          Add Color
        </button>
      </div>
    `;
  }

  // ─────────────────────────────────────────────────────────────
  // Footer Section
  // ─────────────────────────────────────────────────────────────

  private _renderFooterSection(): TemplateResult {
    const buttonAction = this._config.button_actions?.[0];

    return html`
      <div class="section">
        <div class="section-header">
          <ha-icon icon="mdi:gesture-tap-button"></ha-icon>
          <span>Button Action</span>
        </div>

        <ha-textfield
          .value=${buttonAction?.label || ''}
          .label=${'Button Label'}
          @input=${(e: Event) =>
            this._updateButtonAction('label', (e.target as HTMLInputElement).value)}
        ></ha-textfield>

        <ha-icon-picker
          .hass=${this.hass}
          .value=${buttonAction?.icon || ''}
          .label=${'Button Icon'}
          @value-changed=${(e: CustomEvent) => this._updateButtonAction('icon', e.detail.value)}
        ></ha-icon-picker>

        <ha-textfield
          .value=${(buttonAction?.tap_action as any)?.service || ''}
          .label=${'Service (e.g., input_button.press)'}
          @input=${(e: Event) =>
            this._updateButtonTapAction('service', (e.target as HTMLInputElement).value)}
        ></ha-textfield>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${(buttonAction?.tap_action as any)?.target?.entity_id || ''}
          .label=${'Target Entity'}
          @value-changed=${(e: CustomEvent) => this._updateButtonTapAction('target', e.detail.value)}
          allow-custom-entity
        ></ha-entity-picker>
      </div>
    `;
  }

  // ─────────────────────────────────────────────────────────────
  // Layout Section
  // ─────────────────────────────────────────────────────────────

  private _renderLayoutSection(): TemplateResult {
    return html`
      <div class="section">
        <div class="section-header">
          <ha-icon icon="mdi:page-layout-body"></ha-icon>
          <span>Layout Options</span>
        </div>

        <div class="toggle-row">
          <span>Show Diagonal Pattern</span>
          <ha-switch
            .checked=${this._config.show_pattern !== false}
            @change=${(e: Event) =>
              this._valueChanged('show_pattern', (e.target as HTMLInputElement).checked)}
          ></ha-switch>
        </div>

        <div class="toggle-row">
          <span>Show Status Box</span>
          <ha-switch
            .checked=${this._config.show_status !== false}
            @change=${(e: Event) =>
              this._valueChanged('show_status', (e.target as HTMLInputElement).checked)}
          ></ha-switch>
        </div>

        <ha-textfield
          .value=${this._config.status_label || 'Status'}
          .label=${'Status Label (Status/Strategy/Whatever)'}
          @input=${(e: Event) =>
            this._valueChanged('status_label', (e.target as HTMLInputElement).value)}
        ></ha-textfield>

        <div class="toggle-row">
          <span>Show Footer</span>
          <ha-switch
            .checked=${this._config.show_footer !== false}
            @change=${(e: Event) =>
              this._valueChanged('show_footer', (e.target as HTMLInputElement).checked)}
          ></ha-switch>
        </div>

        <ha-textfield
          .value=${this._config.header_height || '120px'}
          .label=${'Header Height'}
          @input=${(e: Event) =>
            this._valueChanged('header_height', (e.target as HTMLInputElement).value)}
        ></ha-textfield>

        <ha-textfield
          .value=${this._config.icon_size || '54px'}
          .label=${'Icon Size'}
          @input=${(e: Event) =>
            this._valueChanged('icon_size', (e.target as HTMLInputElement).value)}
        ></ha-textfield>

        <ha-textfield
          .value=${this._config.border_radius || '16px'}
          .label=${'Border Radius'}
          @input=${(e: Event) =>
            this._valueChanged('border_radius', (e.target as HTMLInputElement).value)}
        ></ha-textfield>

        <ha-select
          .value=${this._config.variant || 'full'}
          .label=${'Card Variant'}
          @selected=${(e: CustomEvent) =>
            this._valueChanged('variant', (e.target as HTMLSelectElement).value)}
        >
          <mwc-list-item value="full">Full</mwc-list-item>
          <mwc-list-item value="header-only">Header Only</mwc-list-item>
          <mwc-list-item value="compact">Compact</mwc-list-item>
        </ha-select>
      </div>
    `;
  }

  // ─────────────────────────────────────────────────────────────
  // Value Change Handlers
  // ─────────────────────────────────────────────────────────────

  private _valueChanged(key: string, value: unknown): void {
    if (!this._config) return;

    const newConfig = { ...this._config, [key]: value };
    this._fireConfigChanged(newConfig);
  }

  private _updateRule(index: number, key: keyof StateRule, value: string): void {
    const rules = [...(this._config.rules || [])];
    rules[index] = { ...rules[index], [key]: value };
    this._fireConfigChanged({ ...this._config, rules });
  }

  private _addRule(): void {
    const rules = [...(this._config.rules || [])];
    rules.push({
      state: '',
      title: '',
      subtitle: '',
      icon: 'mdi:information',
      color: '#9E9E9E',
    });
    this._fireConfigChanged({ ...this._config, rules });
    this._expandedRule = rules.length - 1;
  }

  private _removeRule(e: Event, index: number): void {
    e.stopPropagation();
    const rules = [...(this._config.rules || [])];
    rules.splice(index, 1);
    this._fireConfigChanged({ ...this._config, rules });
    if (this._expandedRule === index) {
      this._expandedRule = null;
    }
  }

  private _toggleRule(index: number): void {
    this._expandedRule = this._expandedRule === index ? null : index;
  }

  private _updateDefault(key: string, value: string): void {
    const defaultConfig: Partial<DisplayConfig> = { ...(this._config.default || {}), [key]: value };
    this._fireConfigChanged({ ...this._config, default: defaultConfig });
  }

  private _updateColorMap(key: string, value: string): void {
    const colorMap = { ...(this._config.color_map || {}), [key]: value };
    this._fireConfigChanged({ ...this._config, color_map: colorMap });
  }

  private _updateColorMapKey(oldKey: string, newKey: string, value: string): void {
    if (oldKey === newKey) return;
    const colorMap = { ...(this._config.color_map || {}) };
    delete colorMap[oldKey];
    colorMap[newKey] = value;
    this._fireConfigChanged({ ...this._config, color_map: colorMap });
  }

  private _addColorMap(): void {
    const colorMap = { ...(this._config.color_map || {}), new_color: '#9E9E9E' };
    this._fireConfigChanged({ ...this._config, color_map: colorMap });
  }

  private _removeColorMap(key: string): void {
    const colorMap = { ...(this._config.color_map || {}) };
    delete colorMap[key];
    this._fireConfigChanged({ ...this._config, color_map: colorMap });
  }

  private _updateButtonAction(key: string, value: string): void {
    const buttonActions: ButtonAction[] = [...(this._config.button_actions || [
      { selector: '.update-btn', tap_action: { action: 'none' } as any },
    ])];

    if (!buttonActions[0]) {
      buttonActions[0] = { selector: '.update-btn', tap_action: { action: 'none' } as any };
    }

    (buttonActions[0] as any)[key] = value;
    this._fireConfigChanged({ ...this._config, button_actions: buttonActions });
  }

  private _updateButtonTapAction(key: string, value: string): void {
    const buttonActions: ButtonAction[] = [...(this._config.button_actions || [])];

    if (!buttonActions[0]) {
      buttonActions[0] = {
        selector: '.update-btn',
        tap_action: { action: 'call-service', service: '', target: {} } as any,
      };
    }

    if (!buttonActions[0].tap_action) {
      buttonActions[0].tap_action = { action: 'call-service', service: '', target: {} } as any;
    }

    if (key === 'target') {
      buttonActions[0].tap_action = {
        ...(buttonActions[0].tap_action as any),
        target: { entity_id: value },
      };
    } else {
      const tap = buttonActions[0].tap_action as any;
      tap[key] = value;
      if (key === 'service') {
        tap.action = 'call-service';
      }
    }

    this._fireConfigChanged({ ...this._config, button_actions: buttonActions });
  }

  private _fireConfigChanged(config: StatusBannerCardConfig): void {
    const event = new CustomEvent('config-changed', {
      detail: { config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  // ─────────────────────────────────────────────────────────────
  // Styles
  // ─────────────────────────────────────────────────────────────

  static get styles(): CSSResultGroup {
    return css`
      .editor-container {
        padding: 16px;
      }

      .section {
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--divider-color);
      }

      .section:last-child {
        border-bottom: none;
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .section-header ha-icon {
        color: var(--primary-color);
      }

      .section-description {
        font-size: 0.875rem;
        color: var(--secondary-text-color);
        margin: -8px 0 12px 0;
      }

      ha-entity-picker,
      ha-textfield,
      ha-icon-picker,
      ha-select {
        display: block;
        margin-bottom: 12px;
      }

      /* Rules */
      .rules-list {
        margin-bottom: 12px;
      }

      .rule-card {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        margin-bottom: 8px;
        overflow: hidden;
      }

      .rule-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        cursor: pointer;
        background: var(--secondary-background-color);
      }

      .rule-header:hover {
        background: var(--primary-background-color);
      }

      .rule-summary {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .rule-state {
        font-weight: 500;
        font-size: 0.875rem;
      }

      .rule-title {
        font-size: 0.75rem;
        color: var(--secondary-text-color);
      }

      .rule-actions {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .rule-details {
        padding: 16px;
        background: var(--card-background-color);
        border-top: 1px solid var(--divider-color);
      }

      /* Color Input */
      .color-input {
        margin-bottom: 12px;
      }

      .color-input label {
        display: block;
        font-size: 0.875rem;
        color: var(--secondary-text-color);
        margin-bottom: 8px;
      }

      .color-input-row {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .color-input input[type='color'] {
        width: 48px;
        height: 48px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        padding: 0;
      }

      .color-input-row ha-textfield {
        flex: 1;
        margin-bottom: 0;
      }

      /* Color Map */
      .color-map-list {
        margin-bottom: 12px;
      }

      .color-map-item {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 8px;
      }

      .color-map-item ha-textfield {
        flex: 1;
        margin-bottom: 0;
      }

      .color-map-item input[type='color'] {
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        padding: 0;
      }

      /* Toggle Row */
      .toggle-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
      }

      /* Add Button */
      .add-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border: 1px dashed var(--divider-color);
        border-radius: 8px;
        background: transparent;
        color: var(--primary-color);
        cursor: pointer;
        font-size: 0.875rem;
        width: 100%;
        justify-content: center;
      }

      .add-btn:hover {
        background: var(--secondary-background-color);
      }
    `;
  }
}