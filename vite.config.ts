import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  PATH CONFIGURATION FOR ESM MODULE COMPATIBILITY                         ║
// ║  Modern ES modules don't have __dirname, so we recreate it               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
const projectRootDirectory = process.cwd()

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  HELPER FUNCTION: CONSTRUCT ABSOLUTE FILE SYSTEM PATHS                   ║
// ║  Creates platform-independent paths relative to project root             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
function createAbsolutePath(...pathSegments: string[]): string {
  return resolve(projectRootDirectory, ...pathSegments)
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  ENVIRONMENT DETECTION AND VERSION EXTRACTION                            ║
// ║  Safely extracts build metadata from process environment                 ║
// ╚══════════════════════════════════════════════════════════════════════════╝
function getEnvironmentMode(): string {
  return process.env.NODE_ENV ?? 'production'
}

function getPackageVersionNumber(): string {
  return process.env.npm_package_version ?? '0.1.0'
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  MAIN VITE CONFIGURATION EXPORT                                          ║
// ║  Transforms shadcn components into single Home Assistant card bundle     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
export default defineConfig({
  // ┌────────────────────────────────────────────────────────────────────────┐
  // │ PLUGIN ECOSYSTEM: Preact transformation + CSS inline injection         │
  // └────────────────────────────────────────────────────────────────────────┘
  plugins: [
    preact(),
    cssInjectedByJsPlugin(),
  ],

  // ┌────────────────────────────────────────────────────────────────────────┐
  // │ PATH ALIAS RESOLUTION: Match tsconfig.json path mappings              │
  // └────────────────────────────────────────────────────────────────────────┘
  resolve: {
    alias: {
      '@': createAbsolutePath('src'),
      '@components': createAbsolutePath('src', 'components'),
      '@lib': createAbsolutePath('src', 'lib'),
      '@types': createAbsolutePath('src', 'types'),
      // Preact compatibility layer for React libraries (e.g., Radix UI)
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },

  // ┌────────────────────────────────────────────────────────────────────────┐
  // │ DEVELOPMENT SERVER: Hot reload with Home Assistant API proxying       │
  // └────────────────────────────────────────────────────────────────────────┘
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://homeassistant.local:8123',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ┌────────────────────────────────────────────────────────────────────────┐
  // │ COMPILE-TIME CONSTANT INJECTION                                        │
  // └────────────────────────────────────────────────────────────────────────┘
  define: {
    'process.env.NODE_ENV': JSON.stringify(getEnvironmentMode()),
    CARD_VERSION: JSON.stringify(getPackageVersionNumber()),
  },

  // ┌────────────────────────────────────────────────────────────────────────┐
  // │ PRODUCTION BUILD CONFIGURATION: Single ES Module Output               │
  // │ Critical: Home Assistant requires exactly ONE JavaScript file         │
  // └────────────────────────────────────────────────────────────────────────┘
  build: {
    // Output directory and file structure
    // HACS requires the file in repository root when content_in_root: true
    outDir: '.',
    emptyOutDir: false, // Don't delete source files

    // ╭──────────────────────────────────────────────────────────────────────╮
    // │ CRITICAL ROLLUP OPTIONS: Force single-file bundle                    │
    // ╰──────────────────────────────────────────────────────────────────────╯
    rollupOptions: {
      input: createAbsolutePath('src', 'main.ts'),
      output: {
        entryFileNames: 'shadcdn-template-card.js',
        // Prevent code splitting - everything in one file
        inlineDynamicImports: true,
        manualChunks: undefined,
        
        // Asset file naming patterns
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'shadcn-template-card.css'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },

    // ╭──────────────────────────────────────────────────────────────────────╮
    // │ MINIFICATION SETTINGS: Terser with console preservation             │
    // ╰──────────────────────────────────────────────────────────────────────╯
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },

    // Source map generation for debugging production builds
    sourcemap: false, // Disabled to keep root clean

    // Browser target compatibility
    target: 'es2015',

    // CSS code splitting prevention
    cssCodeSplit: false,
  },
})