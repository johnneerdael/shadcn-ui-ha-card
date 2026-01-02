/**
 * Shadcn Component Library for Home Assistant Cards
 *
 * This module exports all shadcn/ui components adapted for use in Home Assistant
 * custom cards with shadow DOM support.
 */

import { componentRegistry } from '../lib/component-registry'

// Import Tier 1 components (CSS-only)
import { separatorComponent, separator } from './separator'
import { skeletonComponent, skeleton } from './skeleton'
import { avatarComponent, avatar } from './avatar'
import { alertComponent, alert } from './alert'
import { progressComponent, progress, progressTransform } from './progress'
import { aspectRatioComponent, aspectRatio, customAspectRatio } from './aspect-ratio'
import { labelComponent, label } from './label'
import { textareaComponent, textarea } from './textarea'

// Import Tier 2 components (Interactive)
import { accordionComponent, accordion } from './accordion'
import { collapsibleComponent, collapsible } from './collapsible'
import { toggleComponent, toggle } from './toggle'
import { switchComponent, switchClass } from './switch'
import { radioGroupComponent, radioGroup } from './radio-group'
import { checkboxComponent, checkbox } from './checkbox'
import { selectComponent, select } from './select'
import { sliderComponent, slider } from './slider'

// Import Phase 2 components (CSS-only overlays & navigation)
import { badgeComponent, badge } from './badge'
import { inputComponent, input } from './input'
import { tabsComponent, tabs, tabsList, initTabs } from './tabs'
import { tooltipComponent } from './tooltip'
import { popoverComponent } from './popover'
import { hoverCardComponent } from './hover-card'
import { dialogComponent } from './dialog'
import { sheetComponent } from './sheet'
import { alertDialogComponent } from './alert-dialog'

// Import Phase 1 components (New CSS-only utilities)
import { spinnerComponent, spinner } from './spinner'
import { breadcrumbComponent, breadcrumb, breadcrumbList, breadcrumbItem, breadcrumbLink, breadcrumbPage, breadcrumbSeparator } from './breadcrumb'
import { paginationComponent, pagination, paginationContent, paginationItem, paginationEllipsis } from './pagination'
import { scrollAreaComponent, scrollArea, scrollAreaViewport } from './scroll-area'
import { toggleGroupComponent, toggleGroup, toggleGroupItem } from './toggle-group'

// Import Phase 2 components (Interactive navigation)
import { dropdownMenuComponent, dropdownMenu, dropdownMenuContent, dropdownMenuItem, dropdownMenuSeparator, dropdownMenuLabel, initDropdownMenu } from './dropdown-menu'
import { contextMenuComponent, contextMenu, contextMenuTrigger, contextMenuContent, contextMenuItem, contextMenuSeparator, contextMenuLabel, contextMenuShortcut, initContextMenu } from './context-menu'
import { drawerComponent, drawer, drawerContent, drawerHandle, drawerHeader, drawerTitle, drawerDescription, drawerBody, drawerFooter, initDrawer } from './drawer'

// Import Phase 3 components (Advanced inputs)
import { inputOTPComponent, inputOTP, inputOTPSlot, inputOTPSeparator, initInputOTP, getOTPValue, clearOTP } from './input-otp'
import { comboboxComponent, initCombobox } from './combobox'
import { formComponent, form, formField, formLabel, formDescription, formMessage, formActions, initForm } from './form'

// Import Phase 4 components (Data display)
import { tableComponent, initTable } from './table'
import { calendarComponent } from './calendar'
import { carouselComponent, initCarousel } from './carousel'

// Register all components
componentRegistry.registerAll([
  // Tier 1: CSS-only components
  separatorComponent,
  skeletonComponent,
  avatarComponent,
  alertComponent,
  progressComponent,
  aspectRatioComponent,
  labelComponent,
  textareaComponent,
  // Tier 2: Interactive components
  accordionComponent,
  collapsibleComponent,
  toggleComponent,
  switchComponent,
  radioGroupComponent,
  checkboxComponent,
  selectComponent,
  sliderComponent,
  // Phase 2: CSS-only overlays & navigation
  badgeComponent,
  inputComponent,
  tabsComponent,
  tooltipComponent,
  popoverComponent,
  hoverCardComponent,
  dialogComponent,
  sheetComponent,
  alertDialogComponent,
  // Phase 1: New CSS-only utilities
  spinnerComponent,
  breadcrumbComponent,
  paginationComponent,
  scrollAreaComponent,
  toggleGroupComponent,
  // Phase 2: Interactive navigation
  dropdownMenuComponent,
  contextMenuComponent,
  drawerComponent,
  // Phase 3: Advanced inputs
  inputOTPComponent,
  comboboxComponent,
  formComponent,
  // Phase 4: Data display
  tableComponent,
  calendarComponent,
  carouselComponent,
])

// Export component helper functions
export {
  // Tier 1
  separator,
  skeleton,
  avatar,
  alert,
  progress,
  progressTransform,
  aspectRatio,
  customAspectRatio,
  label,
  textarea,
  // Tier 2
  accordion,
  collapsible,
  toggle,
  switchClass,
  radioGroup,
  checkbox,
  select,
  slider,
  // Phase 2
  badge,
  input,
  tabs,
  tabsList,
  initTabs,
  // Phase 1
  spinner,
  breadcrumb,
  breadcrumbList,
  breadcrumbItem,
  breadcrumbLink,
  breadcrumbPage,
  breadcrumbSeparator,
  pagination,
  paginationContent,
  paginationItem,
  paginationEllipsis,
  scrollArea,
  scrollAreaViewport,
  toggleGroup,
  toggleGroupItem,
  // Phase 2
  dropdownMenu,
  dropdownMenuContent,
  dropdownMenuItem,
  dropdownMenuSeparator,
  dropdownMenuLabel,
  initDropdownMenu,
  contextMenu,
  contextMenuTrigger,
  contextMenuContent,
  contextMenuItem,
  contextMenuSeparator,
  contextMenuLabel,
  contextMenuShortcut,
  initContextMenu,
  drawer,
  drawerContent,
  drawerHandle,
  drawerHeader,
  drawerTitle,
  drawerDescription,
  drawerBody,
  drawerFooter,
  initDrawer,
  // Phase 3
  inputOTP,
  inputOTPSlot,
  inputOTPSeparator,
  initInputOTP,
  getOTPValue,
  clearOTP,
  initCombobox,
  form,
  formField,
  formLabel,
  formDescription,
  formMessage,
  formActions,
  initForm,
  // Phase 4
  initTable,
  initCarousel,
}

// Export component registry
export { componentRegistry }

// Legacy shadcn utility classes (maintained for backward compatibility)
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:opacity-50 disabled:pointer-events-none px-3 py-2 shadow-sm'
const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[color:var(--primary)] hover:opacity-90',
  secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)] border-[color:var(--border)] hover:bg-[color:var(--muted)]',
  outline: 'bg-transparent text-[var(--foreground)] border-[color:var(--border)] hover:bg-[color:var(--muted)]',
  ghost: 'bg-transparent text-[var(--foreground)] border-transparent hover:bg-[color:var(--muted)]',
  destructive: 'bg-[var(--destructive)] text-[var(--destructive-foreground)] border-[color:var(--destructive)] hover:opacity-90',
}

const inputBase =
  'flex h-10 w-full rounded-md border border-[color:var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] placeholder:text-[color:var(--muted-foreground)] disabled:opacity-50 disabled:pointer-events-none'

const badgeBase =
  'inline-flex items-center rounded-full border border-[color:var(--border)] px-2.5 py-0.5 text-xs font-semibold transition-colors'

export const shadcn = {
  button: (variant: ButtonVariant = 'primary') => `${buttonBase} ${buttonVariants[variant]}`,
  badge: (tone: 'primary' | 'secondary' | 'outline' | 'muted' = 'primary') => {
    const map: Record<string, string> = {
      primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[color:var(--primary)]',
      secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)]',
      outline: 'bg-transparent text-[var(--foreground)]',
      muted: 'bg-[var(--muted)] text-[var(--muted-foreground)]',
    }
    return `${badgeBase} ${map[tone]}`
  },
  card: 'shc-surface flex flex-col gap-3',
  input: inputBase,
  select: `${inputBase} pr-10`,
  checkbox: 'shc-checkbox',
  switch: 'shc-switch',
  tabsList:
    'inline-flex h-10 items-center justify-center rounded-md bg-[var(--muted)] p-1 text-[var(--muted-foreground)] border border-[color:var(--border)]',
  tabsTrigger:
    'inline-flex min-w-[80px] items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[var(--background)] data-[state=active]:text-[var(--foreground)] data-[state=active]:shadow-sm',
  tabsContent: 'mt-2 rounded-md border border-[color:var(--border)] bg-[var(--card)] p-3 text-[var(--card-foreground)]',
  code: 'rounded-md bg-[var(--muted)] px-1.5 py-0.5 text-[12px] font-mono text-[var(--muted-foreground)]',
  kbd: 'inline-flex items-center gap-1 rounded border border-[color:var(--border)] bg-[var(--muted)] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]',
}