# React Component Guidelines
Our UI components must be modular, performant, and consistent with SDDC (Software-Defined Design Components).

## Standards
* **Functional Components:** Use Hooks (`useState`, `useEffect`) exclusively. No Class components.
* **Prop Typing:** All components must have TypeScript interfaces or PropTypes defined.
* **Atomic Design:** * `components/atoms`: Buttons, Inputs.
    * `components/molecules`: Search bars, Card headers.
    * `components/organisms`: Usage Dashboards, Admin Panels.
* **Tailwind Integration:** Use the `clsx` or `tailwind-merge` utility for conditional classes.
