🎨 UI & Home Assistant Developer Guidelines
This repository manages GitHub’s metered usage ingestion. While the core logic is Go-based, the frontend and admin interfaces are being standardized using Tailwind CSS to provide a sleek, "Home Assistant" dashboard experience.

🛠 UI Development Standards
When working on the UI or admin components, follow these specific styling requirements:

Tailwind-First: Do not write custom CSS in the admin/ or ruby/ folders. Use Tailwind utility classes for all styling.

Design Tokens: Adhere to the Home Assistant design language—prioritize high-contrast data visualizations, "card" based layouts, and responsive grids.

Purge & Build: When adding new Tailwind classes, ensure the build pipeline picks them up by running make build-ui (if applicable) or checking the config/ for Tailwind's content paths.

📂 Revised Repository Structure (UI Focus)
admin/: The primary workspace for UI specialists. Contains the dashboard components being migrated to Tailwind.

ruby/: Contains the client-side implementation. If you change UI components here, you must increment the version in ruby/lib/billing-platform/version.rb using SemVer.

config/: Contains tailwind.config.js and other theme-related templates.

docs/: Documentation for the design system and component library.

proto/: If you need new data fields for the UI, you may need to update these definitions and run make proto.

🚀 Required Workflow
Before you commit any UI or Logic changes, you must run the following sequence:

Format Code: make fmt (Ensures Go and styling files meet repo standards).

Test UI & Logic: make test (Validates that styling changes didn't break data rendering).

CI Validation: make ci (The "Golden Gate" check: builds, lints, and tests everything).

💡 Key UI Guidelines
Component Consistency: Use existing Home Assistant-style patterns found in admin/.

Table-Driven UI Testing: When adding new data views, use table-driven tests in Go to ensure the UI handles various data states (empty, loading, error).

Dependency Injection: If your UI needs a new data provider, inject it through the internal/ service layer rather than hardcoding endpoints.
