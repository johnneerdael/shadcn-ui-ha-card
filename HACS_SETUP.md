# HACS Repository Setup Guide

**For Repository Maintainers**

---

## Overview

This guide explains the HACS (Home Assistant Community Store) repository structure requirements and how to publish updates.

---

## Repository Structure

HACS requires the following structure for **plugin** (Lovelace card) repositories:

```
shadcdn-template-card/
├── shadcdn-template-card.js  ← Built file (REQUIRED in root)
├── hacs.json                  ← HACS manifest (REQUIRED)
├── README.md                  ← Documentation (REQUIRED)
├── LICENSE                    ← License file (REQUIRED)
├── src/                       ← Source code
├── package.json
└── vite.config.ts
```

### Key Requirements

1. **Built JavaScript file MUST be in repository root** - `shadcdn-template-card.js`
2. **`hacs.json` with `content_in_root: true`** - Tells HACS where to find the file
3. **Filename in `hacs.json` must match actual file** - `shadcdn-template-card.js`
4. **File must be committed to Git** - Not in `.gitignore`

---

## Build Configuration

### Current Setup

The project is configured to build directly to the repository root:

**`vite.config.ts`**:
```typescript
build: {
  outDir: '.',              // Build to root directory
  emptyOutDir: false,       // Don't delete source files
  rollupOptions: {
    output: {
      entryFileNames: 'shadcdn-template-card.js',  // Output filename
    },
  },
  sourcemap: false,         // No .map files in root
}
```

**`hacs.json`**:
```json
{
  "name": "Shadcn Template Card",
  "content_in_root": true,           // File is in root
  "render_readme": true,
  "filename": "shadcdn-template-card.js",  // Exact filename
  "homeassistant": "2023.11.0"
}
```

**`.gitignore`**:
```
node_modules/
# dist/ - Commented out so built file is committed
.build/
```

---

## Build & Release Process

### 1. Make Code Changes

Edit source files in `src/`:
- `src/card.ts`
- `src/lib/template.ts`
- `src/lib/theme.ts`
- etc.

### 2. Build Production Bundle

```bash
npm run build
```

This creates `shadcdn-template-card.js` in the repository root.

### 3. Verify Build Output

```bash
# Check file exists
ls -lh shadcdn-template-card.js

# Should show file size (typically 50-100KB)
```

### 4. Test Locally

Copy to Home Assistant:
```bash
cp shadcdn-template-card.js /path/to/homeassistant/config/www/
```

Add to Lovelace:
```yaml
# configuration.yaml
lovelace:
  resources:
    - url: /local/shadcdn-template-card.js
      type: module
```

Test the card in a dashboard.

### 5. Commit Changes

```bash
git add shadcdn-template-card.js  # Include built file
git add src/                       # Include source changes
git commit -m "feat: description of changes"
```

### 6. Create Git Tag

```bash
# Version bump
npm version patch  # or minor, or major

# This creates a Git tag automatically
# Or manually:
git tag -a v0.2.1 -m "Release v0.2.1"
git push origin v0.2.1
```

### 7. Push to GitHub

```bash
git push origin main
git push --tags
```

### 8. HACS Will Auto-Update

Users with the repository installed in HACS will see the update automatically.

---

## HACS Validation

### GitHub Action (Optional)

Add `.github/workflows/validate.yml`:

```yaml
name: Validate HACS

on:
  push:
  pull_request:

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: HACS Validation
        uses: hacs/action@main
        with:
          category: plugin
```

This validates the repository structure on every commit.

### Manual Validation

Check HACS compliance:

1. **File exists**: `shadcdn-template-card.js` in root ✓
2. **hacs.json present**: With correct `content_in_root` and `filename` ✓
3. **README.md present**: Documentation ✓
4. **LICENSE present**: Open source license ✓

---

## Troubleshooting HACS Issues

### Error: "Repository structure not compliant"

**Cause**: HACS cannot find the JavaScript file.

**Solutions**:
1. Ensure `shadcdn-template-card.js` is in repository root
2. Check `hacs.json` has `"content_in_root": true`
3. Verify `"filename"` in `hacs.json` matches actual file
4. Confirm file is committed and pushed to GitHub

### Error: "File not found"

**Cause**: Filename mismatch between `hacs.json` and actual file.

**Solution**: 
```json
// hacs.json
{
  "filename": "shadcdn-template-card.js"  // Must match exactly
}
```

### Error: "Invalid hacs.json"

**Cause**: JSON syntax error or invalid field.

**Solution**: Validate JSON:
```bash
cat hacs.json | jq .
```

---

## Repository Naming Convention

HACS recognizes plugins with the `lovelace-` prefix:

- **Repository name**: `lovelace-shadcdn-template-card` (on GitHub)
- **File name**: `shadcdn-template-card.js` (strip `lovelace-` prefix)

**Current Setup**:
- Repository: `shadcn-ui-ha-card` (or similar)
- File: `shadcdn-template-card.js`

This works fine, but consider renaming repository to `lovelace-shadcdn-template-card` for consistency.

---

## Version Management

### Semantic Versioning

Follow [SemVer](https://semver.org/):
- **Major** (v1.0.0 → v2.0.0): Breaking changes
- **Minor** (v0.1.0 → v0.2.0): New features, backward compatible
- **Patch** (v0.1.0 → v0.1.1): Bug fixes

### npm version Command

```bash
npm version patch  # 0.2.0 → 0.2.1
npm version minor  # 0.2.1 → 0.3.0
npm version major  # 0.3.0 → 1.0.0
```

This updates `package.json` and creates a Git tag automatically.

---

## Publishing to HACS

### Initial Submission

1. Ensure repository meets all requirements
2. Go to [HACS GitHub](https://github.com/hacs/default)
3. Fork the repository
4. Add your repository to `data/plugins.json`:
   ```json
   "shadcn-ui-ha-card": {
     "name": "Shadcn Template Card",
     "description": "Home Assistant custom card with shadcn/ui components"
   }
   ```
5. Create pull request
6. Wait for HACS team review

### After Acceptance

All future updates are automatic. Users install via HACS UI:
1. HACS → Frontend
2. Search "Shadcn Template Card"
3. Install
4. Restart Home Assistant

---

## Development Workflow

### 1. Development Mode

```bash
npm run dev
```

Vite dev server runs on http://localhost:5173

### 2. Type Check

```bash
npm run type-check
```

### 3. Lint

```bash
npm run lint
```

### 4. Build

```bash
npm run build
```

### 5. Preview Build

```bash
npm run preview
```

---

## File Checklist Before Release

- [ ] `shadcdn-template-card.js` built and in root
- [ ] `package.json` version updated
- [ ] `README.md` updated with changes
- [ ] `CHANGELOG.md` updated (if exists)
- [ ] Git tag created
- [ ] Changes pushed to GitHub
- [ ] Build artifact committed

---

## Common Mistakes to Avoid

1. ❌ **Building to `dist/` instead of root** - HACS won't find it
2. ❌ **Forgetting to commit built file** - It's in `.gitignore`
3. ❌ **Filename mismatch** - `hacs.json` vs actual file
4. ❌ **Missing `content_in_root`** - HACS looks in wrong place
5. ❌ **Not creating Git tags** - Users can't select versions
6. ❌ **Source maps in root** - Keep root clean, disable sourcemaps

---

## Additional Resources

- [HACS Documentation](https://hacs.xyz/docs/publish/start)
- [HACS Plugin Requirements](https://hacs.xyz/docs/publish/plugin)
- [HACS Action (CI/CD)](https://hacs.xyz/docs/publish/action)
- [Home Assistant Frontend Dev](https://developers.home-assistant.io/docs/frontend/)

---

## Support

**Issues with HACS integration?**
1. Check this guide
2. Validate with HACS action
3. Review HACS documentation
4. Ask in Home Assistant Community forums

**Build issues?**
1. Check `vite.config.ts` output settings
2. Verify Node.js version (16+)
3. Clear `node_modules` and reinstall
4. Check TypeScript errors

---

**Last Updated**: 2025-12-31  
**Version**: 0.2.0