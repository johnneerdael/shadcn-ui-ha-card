# Debugging and Deployment Guide

This guide provides comprehensive debugging steps and deployment instructions for the shadcn-template-card in Home Assistant.

## Table of Contents

1. [Quick Diagnosis Checklist](#quick-diagnosis-checklist)
2. [Common Issues and Solutions](#common-issues-and-solutions)
3. [Browser Console Debugging](#browser-console-debugging)
4. [Deployment Checklist](#deployment-checklist)
5. [Build Troubleshooting](#build-troubleshooting)

---

## Quick Diagnosis Checklist

Follow these steps to verify if the card is loading correctly:

### 1. Check Custom Element Registration

Open your browser's developer console (F12) and run:

```javascript
customElements.get('shadcdn-template-card')
```

**Expected result**: Should return the card's class definition (not `undefined`)

### 2. Verify HACS Registration

Check if the card is registered with HACS:

```javascript
console.log(window.customCards);
```

**Expected result**: Should include an entry for `shadcdn-template-card` with type and description

### 3. Check File Loading

In the Network tab of your browser's developer console:
- Look for `shadcdn-template-card.js` being loaded
- Verify the file size is approximately **111KB**
- Check that the HTTP status is **200 OK**

### 4. Verify Card Appears in UI

1. Enter edit mode on a dashboard
2. Click "Add Card"
3. Search for "shadcn" or "template"
4. The card should appear in the list with its description

### 5. Check Console for Errors

Look for any error messages in the browser console related to:
- Custom element registration
- Module loading
- JavaScript execution errors

---

## Common Issues and Solutions

### Issue 1: Card Doesn't Appear in UI (No Errors)

**Symptoms:**
- Card is not visible in the "Add Card" picker
- No error messages in browser console
- File loads successfully (200 OK in Network tab)

**Root Cause:** IIFE wrapper preventing custom element registration

**Solution:**

Ensure your [`vite.config.ts`](vite.config.ts:1) has the correct format setting:

```typescript
export default defineConfig({
  build: {
    lib: {
      entry: './src/main.ts',
      formats: ['es'], // ← Must be 'es', NOT 'iife'
      fileName: 'shadcdn-template-card',
    },
    // ...
  },
});
```

**Verification:**

1. Rebuild the card: `npm run build`
2. Open the generated [`shadcdn-template-card.js`](shadcdn-template-card.js:1)
3. Check that `customElements.define()` is NOT wrapped in an IIFE like `(function(){...})()`
4. The file should start with ES module syntax (import/export)

### Issue 2: Card Initialization Failures

**Symptoms:**
- Card appears in the picker
- Card renders blank or shows generic error
- May see placeholder content but no actual components

**Root Cause:** Configuration errors or component initialization failures

**Solution:**

Check the browser console for error messages from the card's try-catch blocks:

```javascript
// Look for these debug messages
"[DEBUG] setConfig() called"
"[DEBUG] Card rendered"
"Failed to initialize card"
```

**Common fixes:**

1. **Invalid configuration**: Verify your YAML configuration is valid
2. **Missing required properties**: Check that all required config properties are provided
3. **Template syntax errors**: Validate Jinja2 template syntax in your config

**Enable verbose logging:**

Add this to your card configuration temporarily:

```yaml
type: custom:shadcdn-template-card
debug: true  # Enable debug logging
```

### Issue 3: Twind CSS Not Loading

**Symptoms:**
- Card appears but has no styling
- Elements are visible but unstyled (raw HTML appearance)
- Layout is broken or missing

**Root Cause:** Twind initialization failure

**Solution:**

1. Check console for Twind initialization messages:
   ```javascript
   // Look for: "Twind initialized" or Twind errors
   ```

2. Verify Twind configuration in [`twind.config.js`](twind.config.js:1) is correct

3. Check that Twind is properly imported in [`src/main.ts`](src/main.ts:1)

4. Clear browser cache and hard reload (Ctrl+F5 or Cmd+Shift+R)

**Verification:**

Inspect an element and check if Twind classes are applied:

```javascript
// In console, select a card element
$0.className // Should show Twind-generated classes
```

### Issue 4: Card Appears but Components Don't Render

**Symptoms:**
- Card shows basic structure
- Interactive components (buttons, inputs, etc.) don't appear or work
- Console shows "Component not found" errors

**Root Cause:** Component registration issues

**Solution:**

1. Check component registry initialization:
   ```javascript
   // All components should be registered on load
   console.log(customElements.get('shadcdn-button'));
   console.log(customElements.get('shadcdn-input'));
   ```

2. Verify component imports in [`src/components/index.ts`](src/components/index.ts:1)

3. Check for TypeScript compilation errors during build

### Issue 5: Source Maps Not Loading

**Symptoms:**
- Difficult to debug because stack traces point to minified code
- Can't see original TypeScript source in debugger

**Solution:**

Ensure source maps are generated:

```typescript
// In vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true, // ← Enable source maps
    // ...
  },
});
```

Rebuild and verify [`shadcdn-template-card.js.map`](shadcdn-template-card.js.map:1) is generated.

---

## Browser Console Debugging

### Essential Console Commands

#### 1. Check Custom Element Registration

```javascript
// Check if the main card is registered
customElements.get('shadcdn-template-card');

// Check if specific components are registered
customElements.get('shadcdn-button');
customElements.get('shadcdn-input');
customElements.get('shadcdn-select');
customElements.get('shadcdn-slider');
customElements.get('shadcdn-switch');
customElements.get('shadcdn-checkbox');
customElements.get('shadcdn-radio-group');
customElements.get('shadcdn-textarea');
customElements.get('shadcdn-label');
customElements.get('shadcdn-accordion');
customElements.get('shadcdn-collapsible');
customElements.get('shadcdn-toggle');
customElements.get('shadcdn-separator');
customElements.get('shadcdn-progress');
customElements.get('shadcdn-skeleton');
customElements.get('shadcdn-avatar');
customElements.get('shadcdn-alert');
customElements.get('shadcdn-aspect-ratio');
```

#### 2. Verify HACS Registration

```javascript
// Check if card is registered with HACS
window.customCards;

// Find the shadcn card specifically
window.customCards?.find(card => card.type === 'shadcdn-template-card');
```

#### 3. Inspect Card Instance

```javascript
// Get the card element from the DOM
const card = document.querySelector('shadcdn-template-card');

// Check card properties
console.log(card._config);  // Current configuration
console.log(card._hass);    // Home Assistant object

// Manually trigger setConfig (for testing)
card.setConfig({ type: 'custom:shadcdn-template-card' });
```

#### 4. Monitor Custom Events

```javascript
// Listen for card events
document.addEventListener('ll-custom', (event) => {
  console.log('Card event:', event.detail);
});
```

#### 5. Check Twind Status

```javascript
// Verify Twind is loaded and working
const element = document.querySelector('shadcdn-template-card');
const shadowRoot = element?.shadowRoot;

if (shadowRoot) {
  // Check if styles are applied
  const sheet = shadowRoot.styleSheets[0];
  console.log('Style rules:', sheet.cssRules.length);
}
```

### Enable Verbose Logging

Add this script to your browser console for detailed logging:

```javascript
// Save original console methods
const originalLog = console.log;
const originalError = console.error;

// Override with tagged versions
console.log = function(...args) {
  originalLog('[LOG]', new Date().toISOString(), ...args);
};

console.error = function(...args) {
  originalError('[ERROR]', new Date().toISOString(), ...args);
};

// Now reload the page
```

### Debug Card Rendering

```javascript
// Get all shadcn cards on the page
const cards = document.querySelectorAll('shadcdn-template-card');

cards.forEach((card, index) => {
  console.log(`Card ${index}:`, {
    hasConfig: !!card._config,
    hasHass: !!card._hass,
    hasShadowRoot: !!card.shadowRoot,
    childCount: card.shadowRoot?.children.length,
  });
});
```

---

## Deployment Checklist

Follow these steps for a successful deployment:

### Step 1: Build the Card

```bash
cd shadcdn-template-card
npm run build
```

**Expected output:**
- ✓ Build completes without errors
- ✓ Creates [`shadcdn-template-card.js`](shadcdn-template-card.js:1) (~111KB)
- ✓ Creates [`shadcdn-template-card.js.map`](shadcdn-template-card.js.map:1) (source map)

**Verification:**

```bash
# Check file exists and size
ls -lh shadcdn-template-card.js

# Should show approximately 111KB
```

### Step 2: Copy to Home Assistant

#### Option A: HACS Installation (Recommended)

1. Ensure HACS is installed and configured
2. Add this repository as a custom repository in HACS
3. Install "shadcn Template Card" from HACS
4. HACS will automatically place files in the correct location

#### Option B: Manual Installation

```bash
# Copy to Home Assistant www directory
cp shadcdn-template-card.js /config/www/shadcdn-template-card/
cp shadcdn-template-card.js.map /config/www/shadcdn-template-card/

# Or use scp for remote installation
scp shadcdn-template-card.js* user@homeassistant:/config/www/shadcdn-template-card/
```

### Step 3: Register the Card

Add to your Lovelace resources (Configuration → Dashboards → Resources):

```yaml
url: /hacsfiles/shadcdn-template-card/shadcdn-template-card.js
type: module
```

Or for manual installation:

```yaml
url: /local/shadcdn-template-card/shadcdn-template-card.js
type: module
```

### Step 4: Clear Browser Cache

**Important:** Always clear cache after updates!

- **Chrome/Edge**: Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
- **Firefox**: Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
- **Safari**: Cmd+Option+E

Or hard reload: **Ctrl+F5** (Cmd+Shift+R on Mac)

### Step 5: Restart Home Assistant (if needed)

```bash
# SSH into Home Assistant or use the UI
ha core restart
```

**When to restart:**
- First time installing the card
- After updating Lovelace resources
- If card doesn't appear after cache clear

### Step 6: Add Card to Dashboard

1. Open a dashboard in edit mode
2. Click "Add Card"
3. Search for "shadcn" or scroll to find "shadcn Template Card"
4. Configure the card using the visual editor or YAML

### Step 7: Verify in Browser Console

Open browser console (F12) and run:

```javascript
// Check registration
customElements.get('shadcdn-template-card');

// Check HACS registration
window.customCards?.find(c => c.type === 'shadcdn-template-card');

// Check for errors
console.log('No errors should appear above');
```

**Expected results:**
- ✓ `customElements.get()` returns class definition
- ✓ Card appears in `window.customCards`
- ✓ No console errors

---

## Build Troubleshooting

### TypeScript Compilation Errors

**Symptom:** Build fails with TypeScript errors

**Common errors and solutions:**

1. **"Cannot find module" errors:**
   ```bash
   npm install
   ```

2. **Type definition errors:**
   ```bash
   # Install missing type definitions
   npm install --save-dev @types/node
   ```

3. **"Property does not exist" errors:**
   - Check [`tsconfig.json`](tsconfig.json:1) configuration
   - Ensure all type definitions are up to date
   - Verify import paths are correct

### Vite Build Errors

**Symptom:** Vite fails to bundle the application

**Common issues:**

1. **"Failed to resolve entry" error:**
   - Verify [`src/main.ts`](src/main.ts:1) exists
   - Check [`vite.config.ts`](vite.config.ts:1) entry path is correct

2. **"Cannot resolve dependency" error:**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **"Out of memory" error:**
   ```bash
   # Increase Node memory limit
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run build
   ```

### Missing Dependencies

**Symptom:** Build fails due to missing packages

**Solution:**

```bash
# Install all dependencies
npm install

# Or install specific missing dependency
npm install <package-name>

# Verify package.json is correct
cat package.json
```

**Critical dependencies:**
- `vite` - Build tool
- `typescript` - TypeScript compiler
- `@twind/core` - CSS-in-JS solution
- `lit` - Web components library

### Source Map Issues

**Symptom:** Source maps not generated or not working

**Solution:**

1. Enable source maps in [`vite.config.ts`](vite.config.ts:1):
   ```typescript
   export default defineConfig({
     build: {
       sourcemap: true,
     },
   });
   ```

2. Verify source map is generated:
   ```bash
   ls -la shadcdn-template-card.js.map
   ```

3. Check source map reference in JS file:
   ```bash
   tail -n 1 shadcdn-template-card.js
   # Should show: //# sourceMappingURL=shadcdn-template-card.js.map
   ```

### Build Output Verification

After a successful build, verify the output:

```bash
# Check file size (should be ~111KB)
ls -lh shadcdn-template-card.js

# Check that it's ES module format (not IIFE)
head -n 20 shadcdn-template-card.js

# Should see ES module syntax (import/export)
# Should NOT see IIFE wrapper like: (function(){...})()
```

---

## Getting Help

If you're still experiencing issues:

1. **Check existing issues**: [GitHub Issues](https://github.com/yourusername/shadcdn-template-card/issues)
2. **Browser console logs**: Include full console output when reporting issues
3. **Build output**: Include any error messages from the build process
4. **Configuration**: Share your card YAML configuration (remove sensitive data)
5. **Environment**: Specify Home Assistant version, browser, and OS

### Useful Information to Include

When reporting issues, include:

```yaml
Environment:
  Home Assistant: 2024.1.0
  Browser: Chrome 120.0
  OS: macOS Sonoma 14.0
  Installation: HACS / Manual
  Card Version: 1.0.0

Error Message:
  # Paste console error here

Configuration:
  # Paste your card YAML here (sanitized)
```

---

## Additional Resources

- [README.md](README.md) - Installation and basic usage
- [TUTORIAL.md](TUTORIAL.md) - Step-by-step component usage guide
- [COMPONENTS.md](COMPONENTS.md) - Complete component reference
- [COMPONENT_REFERENCE.md](COMPONENT_REFERENCE.md) - Detailed API documentation
- [HACS_SETUP.md](HACS_SETUP.md) - HACS installation instructions