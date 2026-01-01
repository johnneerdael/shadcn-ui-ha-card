# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.3] - 2026-01-01

### Fixed
- Fixed IIFE wrapper preventing custom element registration in Home Assistant
- Resolved card loading failures by switching to ES module format in build configuration
- Added proper error handling for initialization and rendering failures
- Fixed custom element registration issues that caused card to not appear in UI

### Changed
- Modified [`vite.config.ts`](vite.config.ts:1) to use `format: 'es'` instead of default IIFE
- Enhanced error messages with detailed console logging for easier debugging
- Added try-catch blocks in [`card.ts`](src/card.ts:1) for graceful failure handling
- Preserved debug logging for production troubleshooting

### Added
- Comprehensive [`DEBUGGING.md`](DEBUGGING.md:1) guide with console commands and troubleshooting steps
- Error boundaries in card initialization (ensureTwind(), update())
- Detailed console logging for card lifecycle events
- Troubleshooting section in [`README.md`](README.md:354) with quick fixes

### Documentation
- Updated [`README.md`](README.md:1) with troubleshooting section and essential console commands
- Created comprehensive debugging guide with deployment checklist
- Documented all fixes and verification procedures
- Added before/after comparisons for build configuration changes

### Technical Details
- Build format changed from IIFE to ES modules for proper custom element registration
- Verified HACS configuration compatibility with new build format
- Source maps properly generated for debugging support
- All component registrations verified and tested

## [1.1.2] - 2025-12-31

### Added
- Complete Tier 1 and Tier 2 component implementation (16 new components)
- Interactive components: Accordion, Collapsible, Toggle, Switch, RadioGroup, Checkbox, Select, Slider
- CSS-only components: Separator, Skeleton, Avatar, Alert, Progress, AspectRatio, Label, Textarea
- Full accessibility support with ARIA attributes and keyboard navigation
- Centralized component registry system

### Documentation
- Complete component reference documentation
- Progressive tutorial from beginner to advanced
- Component API documentation with code examples
- Quick reference guide with copy-paste snippets

## [1.1.0] - 2025-12-30

### Added
- Initial release with shadcn/ui integration
- Jinja2-style templating support
- Theme integration with Home Assistant
- Shadow DOM scoped styling with Twind
- Basic component library (Card, Button, Badge, Input)
- HACS integration support

[1.1.3]: https://github.com/yourusername/shadcdn-template-card/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/yourusername/shadcdn-template-card/compare/v1.1.0...v1.1.2
[1.1.0]: https://github.com/yourusername/shadcdn-template-card/releases/tag/v1.1.0