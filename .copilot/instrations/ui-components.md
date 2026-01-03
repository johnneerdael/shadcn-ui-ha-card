---
applyTo: "admin/components/builder/**/*.tsx"
---

## UI Builder Component Standards
When generating or modifying UI Builder cards:
1. **Tailwind Only**: Use utility classes. Refer to `tailwind-instructions.md`.
2. **Compound Pattern**: Always export a `SmartCard` base with `Header`, `Content`, and `Footer` sub-components.
3. **Builder Hooks**: Components must accept an `isEditable` prop to toggle drag-and-drop handles.
4. **Framer Motion**: Use `framer-motion` for transitions between "Home Assistant" states (e.g., toggling a switch).

