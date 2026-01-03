# CSS & PostCSS Strategy
This file governs the remaining legacy styles and the transition period.

## The "Sunset" Policy
* **Deprecated:** No new styles should be added to `admin/legacy.css`.
* **Refactoring:** If you touch a legacy component, you are encouraged to "Tailwind-ify" it and delete the corresponding CSS block.
* **Global Variables:** Only use CSS variables for theme-wide settings (e.g., `--primary-bg`) that are mapped into the `tailwind.config.js`.
* **Nesting:** Use PostCSS nesting syntax only if strictly necessary for 3rd-party library overrides.
