/**
 * PostCSS Configuration for Shadcn Template Card
 *
 * This config:
 * 1. Processes Tailwind CSS at build time
 * 2. Adds vendor prefixes via autoprefixer
 * 3. Prefixes all classes with 'shadcn-' to prevent style bleeding in HA
 */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-prefix-selector': {
      prefix: '.shadcn-root',
      transform: function (prefix, selector, prefixedSelector, filePath) {
        // Don't prefix :root, :host, html, or body selectors
        if (selector.match(/^(:root|:host|html|body)/)) {
          return selector;
        }
        // Don't prefix keyframes
        if (selector.match(/^@keyframes/)) {
          return selector;
        }
        // For everything else, scope it under .shadcn-root
        return prefixedSelector;
      },
    },
  },
}
