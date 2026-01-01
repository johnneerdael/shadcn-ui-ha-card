---
name: generate-registry-entry
description: Generates the ComponentRegistry entry for a Shadcn UI component. Use when the user asks to "register" a component or "add it to the config".
allowed-tools: Read
---

# Generate Registry Entry

When asked to register a component, analyze the React component file (props, variants, and event handlers) and generate a TypeScript object that matches the `ComponentDefinition` interface.

## Output Format

Return **only** the code block for the registry entry. Do not return the full file unless asked.

```typescript
// Example Output Structure
UiComponentName: {
  name: 'UiComponentName', // PascalCase
  displayName: 'Friendly Name', // Space separated
  description: 'Short description of what it does',
  category: 'input', // Options: 'layout' | 'input' | 'feedback' | 'data'
  icon: 'mdi:icon-name', // Pick a relevant Material Design Icon
  component: ComponentName,
  props: [
    // Extract props from the React Component
    { 
      name: 'variant', 
      type: 'select', 
      options: ['default', 'outline', 'ghost'], 
      default: 'default',
      description: 'Visual style of the component'
    },
    { 
      name: 'disabled', 
      type: 'boolean', 
      default: false 
    }
  ],
  // If the component has a clickable action (like a button)
  defaultAction: { type: 'call-service' },
  // If the component reflects state (like a switch)
  binding: {
    supportedDomains: ['light', 'switch']
  }
}