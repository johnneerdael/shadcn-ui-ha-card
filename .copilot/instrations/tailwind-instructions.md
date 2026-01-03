# Tailwind CSS Standards
This project is migrating all legacy styles to Tailwind CSS to match the Home Assistant design language.

## Core Rules
* **Zero Custom CSS:** Do not add new `.css` files. Use utility classes directly in your HTML/templates.
* **Design Tokens:** Use the pre-defined theme in `tailwind.config.js` for colors (e.g., `text-ha-blue`, `bg-ha-gray`).
* **Responsive Design:** Use prefix modifiers (`md:`, `lg:`) for all layouts. Mobile-first is required.

## Workflow
1.  **Modify:** Add Tailwind classes to files in `admin/` or `ruby/`.
2.  **Verify:** Run `make build-ui` to trigger the Tailwind JIT compiler.
3.  **Lint:** Ensure no "smells" like `!important` are added via utility overrides.
