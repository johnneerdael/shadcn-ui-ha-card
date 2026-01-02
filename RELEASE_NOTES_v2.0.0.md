# Shadcn Template Card v2.0.0 - Complete Rewrite 🎉

## 🌟 Highlights

This is a **complete rewrite** that transforms the Shadcn Template Card into a professional visual editor for Home Assistant with complete shadcn/ui core component coverage.

### Visual Editor
- **Drag & Drop**: Intuitive component palette with 29 components (75+ variants)
- **Live Preview**: See changes instantly with real entity data
- **Grid Positioning**: Precise 12-column grid with drag-to-resize
- **Tree View**: Hierarchical component structure for complex layouts
- **Properties Panel**: Edit props, bindings, actions, and styling

### Theme System
- **Per-Card Themes**: Each card can have unique styling
- **5 Key Controls**: Primary, Secondary, Radius, Background/Foreground, Spacing
- **Quick Presets**: Material, Apple, Corporate, Playful
- **Live Updates**: Changes apply instantly via CSS Variables
- **Shadcn Philosophy**: "Adjust the DNA of components" directly

### 29 Components (75+ Variants)

**Interactive Forms:**
Button, Switch, Slider, Checkbox, RadioGroup, Toggle, Select, Input, Textarea

**Display & Feedback:**
Alert, Badge, Progress, Skeleton, Separator, Avatar, Label

**Layout Containers:**
Card, Tabs, Accordion, Collapsible, AspectRatio

**Advanced UI (NEW):**
Dialog, AlertDialog, Sheet, Popover, HoverCard, Tooltip

**Data:**
Chart, RawHTML

## 🚀 What's New

### New in v2.0.0

1. **Complete Visual Editor**
   - Component palette with search
   - Split canvas (preview + grid)
   - Properties panel with tabs
   - Theme editor with color pickers
   - Tree view for hierarchy

2. **10 New Components**
   - AspectRatio: Maintain aspect ratios
   - Chart: Simple bar charts
   - Collapsible: Show/hide transitions
   - Accordion: Exclusive expansion
   - Tooltip: CSS-only hover tips
   - Popover: Click floating content
   - HoverCard: Hover previews
   - Dialog: Modal dialogs
   - AlertDialog: Confirmations
   - Sheet: Side drawers

3. **Theme System**
   - Per-card theme configuration
   - 5 core controls with visual UI
   - 4 quick presets
   - CSS Variables injection
   - Shadow DOM compatibility

4. **Documentation**
   - Complete README rewrite
   - Visual Editor Guide (30+ pages)
   - Theme System Guide
   - New Components Reference
   - Real-world examples

## 📦 Installation

### HACS (Recommended)
1. Add custom repository: `https://github.com/johnneerdael/shadcn-template-card`
2. Search for "Shadcn Template Card"
3. Click Download
4. Restart Home Assistant

### Manual
```bash
npm install
npm run build
cp dist/shadcn-template-card.js /config/www/shadcn-template-card/
cp dist/shadcn-template-card.css /config/www/shadcn-template-card/
```

## 🔄 Breaking Changes

⚠️ **This is a complete rewrite** - not compatible with v1.x configurations

**What Changed:**
- Removed Twind runtime CSS (now bundled Tailwind)
- New visual editor replaces code-first approach
- Theme system replaces inline styling
- All components follow shadcn/ui patterns
- New component naming (UiButton, UiCard, etc.)

**Migration Steps:**
1. Open old card in editor
2. Recreate layout using visual editor
3. Apply theme via theme editor
4. Bind entities via properties panel
5. Configure actions via properties panel

See `docs/visual-editor.md` for complete workflow.

## 📊 Bundle Size

```
CSS:  30.60 kB │ gzip:  5.39 kB
JS:  331.76 kB │ gzip: 74.70 kB
```

Includes 29 components (75+ variants) + visual editor + theme system!

## 📚 Documentation

- **[User Guide](docs/USER_GUIDE.md)** - Complete usage guide
- **[Visual Editor](docs/visual-editor.md)** - Editor features and tips
- **[Theme System](docs/theme-system.md)** - Theming and customization
- **[Component Reference](docs/components/)** - All 29 components documented
- **[New Components](docs/new-components.md)** - Documentation for 10 new components

## 🏗️ Technical Stack

- **Preact** - Lightweight React alternative (3KB)
- **Vite** - Lightning-fast build tool
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling (bundled)
- **React Grid Layout** - Drag-and-drop positioning

## 🙏 Credits

- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Home Assistant](https://www.home-assistant.io/) - Smart home platform
- [Preact](https://preactjs.com/) - Fast React alternative

## 🐛 Known Issues

- Focus trap not implemented in dialogs (Shadow DOM limitation)
- Portals not used (Shadow DOM compatibility)

## 🤝 Contributing

Contributions welcome! Please check existing issues and follow TypeScript/Preact conventions.

---

**Built with ❤️ for the Home Assistant community**

*Need help? Open an issue or check the [Visual Editor Guide](docs/visual-editor.md)*
