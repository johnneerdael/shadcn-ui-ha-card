only. 
2. **HA Aesthetic**: Use the 'ha-card' and 'ha-blue' tokens defined in `tailwind.config.js`.
3. **Builder Pattern**: All UI cards must support an `isEditable` prop.
4. **Logic Separation**: Keep UI components in `admin/` and billing logic in `lib/`.

## Development Workflow (Required)
- **Formatting**: You must run `make fmt` before suggesting a PR.
- **Testing**: New functionality requires unit tests. Use table-driven tests for Go logic.
- **Version Control**: If you touch `ruby/`, you MUST increment the version in `ruby/lib/billing-platform/version.rb`.

## Copilot Specific Behavior
- When asked to build a "Card," always use the `SmartCard` compound component pattern.
- Refer to `docs/` for API schemas before writing fetch requests.
