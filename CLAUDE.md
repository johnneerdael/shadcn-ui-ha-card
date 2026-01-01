# Shadcn Template Card - Development & Migration Guidelines

## 1. Project Context & Mission
**Goal:** Migrate a Home Assistant Custom Card from Preact/Twind to a robust **React/Bundled-Tailwind** architecture with a drag-and-drop Visual Editor.
**Core Philosophy:** "Figma for Home Assistant" — Professional UI (Shadcn) with easy customization.

### Key Reference Files
* **Master Plan:** [`react-migration-architecture.md`](./react-migration-architecture.md) - The source of truth for the migration roadmap.
* **Reference Implementation:** [`shadcn-sourcecode/`](./shadcn-sourcecode/) - Contains the raw, original Shadcn UI component code. **Always** refer to this folder when porting components to ensure fidelity.
* **Current Source:** [`src/`](./src/) - The active development codebase (Vite + React).
* **Manifest:** [`hacs.json`](./hacs.json) & [`package.json`](./package.json) - metadata and dependencies.

---

## 2. 🚨 Critical Architecture Rules (Non-Negotiable)
1.  **Entry Point:** `src/main.ts` MUST use `customElements.define` **synchronously**.
    * *Bad:* `if (!customElements.get(...)) { ... }` (Race condition)
    * *Good:* `try { customElements.define(...) } catch (e) {}`
2.  **CSS Handling:**
    * **NO** runtime CSS generation (Twind is BANNED).
    * **MUST** use `vite-plugin-css-injected-by-js`.
    * **MUST** prefix all Tailwind classes with `shadcn-` (configured in PostCSS).
3.  **Component Registry:**
    * UI components are **not** imported directly by the Renderer.
    * They MUST be registered in `src/lib/component-registry.ts` to be visible to the JSON config engine.
4.  **Data Binding:**
    * Use `BindingEngine` for entity state.
    * Jinja templates use `hass.callWS('render_template')` with debounce.

---

## 3. The AI Workforce (Agents & Skills)
Do not try to do everything yourself. Delegate specialized tasks to the appropriate Subagent or Skill.

### 🤖 Subagent Roster
| Agent Name | Trigger | specialized Domain | Key Tools |
| :--- | :--- | :--- | :--- |
| **`ha-core`** | "Setup build", "Fix CSS", "Entry point" | Vite config, PostCSS, Runtime container, Shadow DOM injection | `zread` (Repo Structure), `context7` (HA Docs) |
| **`shadcn-porter`** | "Port Button", "Add Slider" | Converting `shadcn-sourcecode` components to `src/components/ui` and registering them | `vision` (UI replication), `jina` (Specs) |
| **`ha-binder`** | "Fix data binding", "Jinja logic" | WebSocket APIs, Entity state logic, Action handling | `context7` (WS API), `webSearch` (Examples) |
| **`visual-editor`** | "Editor UI", "Drag and drop" | `react-grid-layout`, Form generation, Editor CSS scoping | `vision` (Diffs), `webReader` (Grid docs) |

### 🛠️ Skill Library
| Skill Name | When to use | Action |
| :--- | :--- | :--- |
| **`generate-registry-entry`** | "Register component", "Add to config" | Generates the TypeScript `ComponentDefinition` block automatically. |
| **`ha-validate`** | "Check code", "Verify architecture" | Runs a QA check against the Critical Architecture Rules (Sync define, CSS prefixing). |

---

## 4. Developer Workflow
* **Build:** `npm run build` (Outputs single `.js` file)
* **Dev:** `npm run dev` (Mocked HA environment)
* **New Component Flow:**
    1.  Read reference: `shadcn-sourcecode/components/ui/xyz.tsx`
    2.  Agent: `shadcn-porter` -> Port to `src/components/ui/xyz.tsx`
    3.  Skill: `generate-registry-entry` -> Add to `src/lib/component-registry.ts`
    4.  Skill: `ha-validate` -> Ensure CSS prefixes are applied.