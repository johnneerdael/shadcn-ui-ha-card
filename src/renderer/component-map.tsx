/**
 * Component Map
 *
 * Maps component names from the registry to actual Preact component implementations.
 * This is the bridge between the component registry (metadata) and the renderer (UI).
 *
 * **Shadow DOM Compliance:**
 * All 34 components in this map are Shadow DOM compatible and production-ready:
 * - ✅ No Radix UI portals (all overlay components use custom implementations)
 * - ✅ Fixed/absolute positioning within shadow root (not portaled to document.body)
 * - ✅ Proper event cleanup (all useEffect returns remove listeners)
 * - ✅ CSS scoping via .shc- prefixes (no style leakage)
 * - ✅ Z-index strategy (z-50 for overlays, scoped within shadow root)
 *
 * **Overlay Components (Custom Implementations):**
 * The following components would normally use Radix UI with portals,
 * but have been reimplemented for Shadow DOM compatibility:
 * - Dialog, AlertDialog - Fixed center positioning with backdrop
 * - Popover - Absolute positioning relative to trigger
 * - Sheet - Fixed positioning with slide animations
 * - Combobox - Absolute dropdown positioning
 * - Command - Fixed center positioning (Cmd+K palette)
 * - Tooltip, HoverCard - CSS-only with absolute positioning
 *
 * **Event Handling Pattern:**
 * Overlay components use `document.addEventListener` for:
 * - Escape key (close on Escape)
 * - Click-outside detection
 * This is SAFE in Shadow DOM because events bubble from shadow root → document.
 * All listeners are properly cleaned up in useEffect returns.
 *
 * **Architecture Decision:**
 * We chose to avoid Radix UI primitives entirely because:
 * 1. Portals break in Shadow DOM (cannot append to document.body)
 * 2. Floating UI positioning doesn't work across shadow boundaries
 * 3. Focus trap and accessibility features need shadow-aware implementation
 * 4. Custom implementations give us full control over Shadow DOM behavior
 *
 * @see src/lib/component-registry.ts for component metadata
 * @see src/components/ui/ for component implementations
 * @see https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card
 */

import type { FunctionComponent } from 'preact'

// Import Preact component implementations
// Phase 1 components (Priority - core functionality)
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { Switch } from '../components/ui/switch'
import { Slider } from '../components/ui/slider'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'
import { RawHTML } from '../components/ui/raw-html'

// Phase 2 components (Container components for nesting)
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'

// Phase 3 components (Remaining UI components)
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Progress } from '../components/ui/progress'
import { Badge } from '../components/ui/badge'

// Tier 1: Interactive form components (NEW)
import { Checkbox } from '../components/ui/checkbox'
import { Select, SelectOption } from '../components/ui/select'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import { Toggle } from '../components/ui/toggle'
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert'

// Tier 2: Visual polish components (NEW)
import { Separator } from '../components/ui/separator'
import { Skeleton } from '../components/ui/skeleton'
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar'

// Final 10: Complete coverage components (NEW)
import { AspectRatio } from '../components/ui/aspect-ratio'
import { Chart } from '../components/ui/chart'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../components/ui/collapsible'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion'
import { Tooltip } from '../components/ui/tooltip'
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../components/ui/hover-card'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '../components/ui/alert-dialog'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '../components/ui/sheet'

// v2.1.0: Critical components for power users (NEW)
import { ScrollArea } from '../components/ui/scroll-area'
import { ToastProvider } from '../components/ui/toast'
import { Combobox } from '../components/ui/combobox'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table'
import { Command } from '../components/ui/command'

/**
 * Type for any Preact component that can be rendered
 */
type PreactComponent = FunctionComponent<any>

/**
 * Fallback component for unimplemented or unknown components
 *
 * This provides a helpful visual indicator during development
 * and prevents the renderer from crashing
 */
const UnknownComponent: PreactComponent = ({ children, ...props }) => (
  <div
    class="shc-unknown-component"
    style={{
      padding: '1rem',
      border: '2px dashed var(--warning-color, orange)',
      borderRadius: '0.5rem',
      backgroundColor: 'var(--warning-background, rgba(255, 165, 0, 0.1))',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
      <ha-icon icon="mdi:alert-circle-outline" style={{ color: 'var(--warning-color, orange)' }}></ha-icon>
      <strong>Component Not Implemented</strong>
    </div>
    <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text-color)' }}>
      Component: {props['data-component-name'] || 'Unknown'}
    </div>
    {children && (
      <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--divider-color)' }}>
        {children}
      </div>
    )}
  </div>
)

/**
 * Component registry map
 *
 * Maps component names (from componentRegistry) to Preact component classes
 *
 * Structure:
 * - Key: Component name from registry (e.g., 'UiButton')
 * - Value: Preact component class
 *
 * Phase 1 components are uncommented as they're implemented
 */
export const COMPONENT_MAP: Record<string, PreactComponent> = {
  // Phase 1: Core components (IMPLEMENTED)
  'UiButton': Button,
  'UiLabel': Label,
  'UiSwitch': Switch,
  'UiSlider': Slider,
  'UiCard': Card,
  'UiCardHeader': CardHeader,
  'UiCardTitle': CardTitle,
  'UiCardDescription': CardDescription,
  'UiCardContent': CardContent,
  'UiCardFooter': CardFooter,
  'UiRawHTML': RawHTML,

  // Phase 2: Container components for nesting (IMPLEMENTED)
  'UiTabs': Tabs,
  'UiTabsList': TabsList,
  'UiTabsTrigger': TabsTrigger,
  'UiTabsContent': TabsContent,

  // Phase 3: Interactive UI components (IMPLEMENTED)
  'UiInput': Input,
  'UiTextarea': Textarea,
  'UiProgress': Progress,
  'UiBadge': Badge,

  // Tier 1: Interactive form components (IMPLEMENTED)
  'UiCheckbox': Checkbox,
  'UiSelect': Select,
  'UiSelectOption': SelectOption,
  'UiRadioGroup': RadioGroup,
  'UiRadioGroupItem': RadioGroupItem,
  'UiToggle': Toggle,
  'UiAlert': Alert,
  'UiAlertTitle': AlertTitle,
  'UiAlertDescription': AlertDescription,

  // Tier 2: Visual polish components (IMPLEMENTED)
  'UiSeparator': Separator,
  'UiSkeleton': Skeleton,
  'UiAvatar': Avatar,
  'UiAvatarImage': AvatarImage,
  'UiAvatarFallback': AvatarFallback,

  // Final 10: Complete coverage (IMPLEMENTED)
  'UiAspectRatio': AspectRatio,
  'UiChart': Chart,
  'UiCollapsible': Collapsible,
  'UiCollapsibleTrigger': CollapsibleTrigger,
  'UiCollapsibleContent': CollapsibleContent,
  'UiAccordion': Accordion,
  'UiAccordionItem': AccordionItem,
  'UiAccordionTrigger': AccordionTrigger,
  'UiAccordionContent': AccordionContent,
  'UiTooltip': Tooltip,
  'UiPopover': Popover,
  'UiPopoverTrigger': PopoverTrigger,
  'UiPopoverContent': PopoverContent,
  'UiHoverCard': HoverCard,
  'UiHoverCardTrigger': HoverCardTrigger,
  'UiHoverCardContent': HoverCardContent,
  'UiDialog': Dialog,
  'UiDialogTrigger': DialogTrigger,
  'UiDialogContent': DialogContent,
  'UiDialogHeader': DialogHeader,
  'UiDialogTitle': DialogTitle,
  'UiDialogDescription': DialogDescription,
  'UiDialogFooter': DialogFooter,
  'UiAlertDialog': AlertDialog,
  'UiAlertDialogTrigger': AlertDialogTrigger,
  'UiAlertDialogContent': AlertDialogContent,
  'UiAlertDialogHeader': AlertDialogHeader,
  'UiAlertDialogTitle': AlertDialogTitle,
  'UiAlertDialogDescription': AlertDialogDescription,
  'UiAlertDialogFooter': AlertDialogFooter,
  'UiAlertDialogAction': AlertDialogAction,
  'UiAlertDialogCancel': AlertDialogCancel,
  'UiSheet': Sheet,
  'UiSheetTrigger': SheetTrigger,
  'UiSheetContent': SheetContent,
  'UiSheetHeader': SheetHeader,
  'UiSheetTitle': SheetTitle,
  'UiSheetDescription': SheetDescription,
  'UiSheetFooter': SheetFooter,

  // v2.1.0: Critical components for power users (IMPLEMENTED)
  'UiScrollArea': ScrollArea,
  'UiToastProvider': ToastProvider,
  'UiCombobox': Combobox,
  'UiTable': Table,
  'UiTableHeader': TableHeader,
  'UiTableBody': TableBody,
  'UiTableRow': TableRow,
  'UiTableHead': TableHead,
  'UiTableCell': TableCell,
  'UiCommand': Command,

  // Container primitives (for grid/flex layouts)
  // These are simple wrapper divs for layout purposes
  'UiContainer': ({ children, ...props }: any) => (
    <div class="shc-container" {...props}>
      {children}
    </div>
  ),
  'UiFlexContainer': ({ children, ...props }: any) => (
    <div class="shc-flex-container" style={{ display: 'flex' }} {...props}>
      {children}
    </div>
  ),
  'UiGridContainer': ({ children, ...props }: any) => (
    <div class="shc-grid-container" style={{ display: 'grid' }} {...props}>
      {children}
    </div>
  ),
}

/**
 * Get component by name from the registry
 *
 * Returns the component class if found, otherwise returns UnknownComponent fallback
 *
 * @param name - Component name from registry (e.g., 'UiButton')
 * @returns Preact component class
 */
export function getComponentByName(name: string): PreactComponent {
  const component = COMPONENT_MAP[name]

  if (!component) {
    console.warn(`[ComponentMap] Component not found: ${name}. Using fallback.`)
    // Return a wrapper that passes the component name to UnknownComponent
    return (props: any) => <UnknownComponent data-component-name={name} {...props} />
  }

  return component
}

/**
 * Check if a component is implemented
 *
 * Useful for the editor to show warnings about unimplemented components
 *
 * @param name - Component name from registry
 * @returns true if implemented, false otherwise
 */
export function isComponentImplemented(name: string): boolean {
  return name in COMPONENT_MAP && COMPONENT_MAP[name] !== UnknownComponent
}

/**
 * Get all implemented component names
 *
 * Useful for editor component picker to filter out unimplemented components
 *
 * @returns Array of implemented component names
 */
export function getImplementedComponents(): string[] {
  return Object.keys(COMPONENT_MAP)
}

/**
 * Register a new component dynamically
 *
 * Useful for plugins or extensions that want to add custom components
 *
 * @param name - Component name
 * @param component - Preact component class
 */
export function registerComponent(name: string, component: PreactComponent): void {
  if (COMPONENT_MAP[name]) {
    console.warn(`[ComponentMap] Overwriting existing component: ${name}`)
  }
  COMPONENT_MAP[name] = component
}
