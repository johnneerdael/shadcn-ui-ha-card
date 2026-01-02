/**
 * Component Generators
 *
 * Auto-generation logic for complex components that require
 * multiple child components with specific structure.
 *
 * Examples:
 * - Tabs: Generates TabsList + TabsTrigger + TabsContent
 * - Accordion: Generates AccordionItem + AccordionTrigger + AccordionContent
 * - Grid: Generates N column containers with flex layout
 */

import type { LayoutItem } from './types'

/**
 * Generate a unique ID for layout items
 */
function generateId(prefix: string = 'item'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate Tabs component with TabsList, Triggers, and Content
 *
 * Structure:
 * ```
 * Tabs
 * ├── TabsList
 * │   ├── TabsTrigger (tab 1)
 * │   ├── TabsTrigger (tab 2)
 * │   └── TabsTrigger (tab 3)
 * ├── TabsContent (tab 1)
 * ├── TabsContent (tab 2)
 * └── TabsContent (tab 3)
 * ```
 *
 * @param tabNames - Array of tab labels (e.g., ["Living", "Kitchen", "Bedroom"])
 * @param x - X position in grid
 * @param y - Y position in grid
 * @returns Root Tabs LayoutItem with all children
 */
export function generateTabs(
  tabNames: string[],
  x: number = 0,
  y: number = 0
): LayoutItem {
  const tabsId = generateId('tabs')
  const tabsListId = generateId('tabs-list')

  // Generate TabsTrigger items
  const triggers = tabNames.map((_name, index) => ({
    i: generateId('tabs-trigger'),
    component: 'UiTabsTrigger',
    props: {
      value: `tab-${index}`,
      label: name,
    },
    bind: undefined,
    action: undefined,
    x: 0,
    y: 0,
    w: 12,
    h: 1,
    layoutMode: 'flow-horizontal' as const,
    parentId: tabsListId,
    children: [],
  }))

  // Generate TabsContent items
  const contents = tabNames.map((_name, index) => ({
    i: generateId('tabs-content'),
    component: 'UiTabsContent',
    props: {
      value: `tab-${index}`,
    },
    bind: undefined,
    action: undefined,
    x: 0,
    y: 0,
    w: 12,
    h: 4,
    layoutMode: 'flow-vertical' as const,
    parentId: tabsId,
    children: [],
  }))

  // Generate TabsList
  const tabsList: LayoutItem = {
    i: tabsListId,
    component: 'UiTabsList',
    props: {},
    bind: undefined,
    action: undefined,
    x: 0,
    y: 0,
    w: 12,
    h: 1,
    layoutMode: 'flow-horizontal',
    parentId: tabsId,
    children: triggers,
  }

  // Generate root Tabs component
  const tabs: LayoutItem = {
    i: tabsId,
    component: 'UiTabs',
    props: {
      defaultValue: 'tab-0',
    },
    bind: undefined,
    action: undefined,
    x,
    y,
    w: 12,
    h: 6,
    layoutMode: 'flow-vertical',
    parentId: null,
    children: [tabsList, ...contents],
  }

  return tabs
}

/**
 * Generate Accordion component with items
 *
 * Structure:
 * ```
 * Accordion
 * ├── AccordionItem (item 1)
 * │   ├── AccordionTrigger
 * │   └── AccordionContent
 * ├── AccordionItem (item 2)
 * │   ├── AccordionTrigger
 * │   └── AccordionContent
 * └── ...
 * ```
 *
 * @param itemTitles - Array of accordion section titles
 * @param x - X position in grid
 * @param y - Y position in grid
 * @returns Root Accordion LayoutItem with all children
 */
export function generateAccordion(
  itemTitles: string[],
  x: number = 0,
  y: number = 0
): LayoutItem {
  const accordionId = generateId('accordion')

  // Generate AccordionItem + Trigger + Content for each section
  const items = itemTitles.map((title, index) => {
    const itemId = generateId('accordion-item')
    const triggerId = generateId('accordion-trigger')
    const contentId = generateId('accordion-content')

    const trigger: LayoutItem = {
      i: triggerId,
      component: 'UiAccordionTrigger',
      props: {
        title,
      },
      bind: undefined,
      action: undefined,
      x: 0,
      y: 0,
      w: 12,
      h: 1,
      layoutMode: 'flow-horizontal',
      parentId: itemId,
      children: [],
    }

    const content: LayoutItem = {
      i: contentId,
      component: 'UiAccordionContent',
      props: {},
      bind: undefined,
      action: undefined,
      x: 0,
      y: 0,
      w: 12,
      h: 4,
      layoutMode: 'flow-vertical',
      parentId: itemId,
      children: [],
    }

    const item: LayoutItem = {
      i: itemId,
      component: 'UiAccordionItem',
      props: {
        value: `item-${index}`,
      },
      bind: undefined,
      action: undefined,
      x: 0,
      y: 0,
      w: 12,
      h: 5,
      layoutMode: 'flow-vertical',
      parentId: accordionId,
      children: [trigger, content],
    }

    return item
  })

  // Generate root Accordion component
  const accordion: LayoutItem = {
    i: accordionId,
    component: 'UiAccordion',
    props: {
      type: 'single',
      collapsible: true,
    },
    bind: undefined,
    action: undefined,
    x,
    y,
    w: 12,
    h: items.length * 5,
    layoutMode: 'flow-vertical',
    parentId: null,
    children: items,
  }

  return accordion
}

/**
 * Generate Grid Row with N columns
 *
 * Structure:
 * ```
 * FlexContainer (row)
 * ├── Container (column 1, width: 100/N%)
 * ├── Container (column 2, width: 100/N%)
 * └── Container (column N, width: 100/N%)
 * ```
 *
 * @param columns - Number of columns
 * @param x - X position in grid
 * @param y - Y position in grid
 * @returns Root FlexContainer LayoutItem with column children
 */
export function generateGridRow(
  columns: number,
  x: number = 0,
  y: number = 0
): LayoutItem {
  const rowId = generateId('grid-row')
  const columnWidth = `${100 / columns}%`

  // Generate column containers
  const cols = Array.from({ length: columns }, (_) => ({
    i: generateId('grid-col'),
    component: 'UiContainer',
    props: {},
    bind: undefined,
    action: undefined,
    x: 0,
    y: 0,
    w: Math.floor(12 / columns),
    h: 4,
    layoutMode: 'flow-vertical' as const,
    parentId: rowId,
    children: [],
    style: {
      width: columnWidth,
    },
  }))

  // Generate root FlexContainer
  const row: LayoutItem = {
    i: rowId,
    component: 'UiFlexContainer',
    props: {},
    bind: undefined,
    action: undefined,
    x,
    y,
    w: 12,
    h: 4,
    layoutMode: 'flow-horizontal',
    parentId: null,
    children: cols,
    style: {
      gap: '1rem',
    },
  }

  return row
}

/**
 * Generate Card with optional sections
 *
 * Structure:
 * ```
 * Card
 * ├── CardHeader (optional)
 * │   ├── CardTitle
 * │   └── CardDescription
 * ├── CardContent
 * └── CardFooter (optional)
 * ```
 *
 * @param options - Configuration for card sections
 * @param x - X position in grid
 * @param y - Y position in grid
 * @returns Root Card LayoutItem with section children
 */
export function generateCard(
  options: {
    title?: string
    description?: string
    hasHeader?: boolean
    hasFooter?: boolean
  } = {},
  x: number = 0,
  y: number = 0
): LayoutItem {
  const cardId = generateId('card')
  const children: LayoutItem[] = []

  // Add header if requested
  if (options.hasHeader || options.title || options.description) {
    const headerId = generateId('card-header')
    const headerChildren: LayoutItem[] = []

    if (options.title) {
      headerChildren.push({
        i: generateId('card-title'),
        component: 'UiCardTitle',
        props: {
          children: options.title,
        },
        bind: undefined,
        action: undefined,
        x: 0,
        y: 0,
        w: 12,
        h: 1,
        layoutMode: 'flow-vertical',
        parentId: headerId,
        children: [],
      })
    }

    if (options.description) {
      headerChildren.push({
        i: generateId('card-description'),
        component: 'UiCardDescription',
        props: {
          children: options.description,
        },
        bind: undefined,
        action: undefined,
        x: 0,
        y: 0,
        w: 12,
        h: 1,
        layoutMode: 'flow-vertical',
        parentId: headerId,
        children: [],
      })
    }

    children.push({
      i: headerId,
      component: 'UiCardHeader',
      props: {},
      bind: undefined,
      action: undefined,
      x: 0,
      y: 0,
      w: 12,
      h: headerChildren.length,
      layoutMode: 'flow-vertical',
      parentId: cardId,
      children: headerChildren,
    })
  }

  // Add content section (always included)
  children.push({
    i: generateId('card-content'),
    component: 'UiCardContent',
    props: {},
    bind: undefined,
    action: undefined,
    x: 0,
    y: 0,
    w: 12,
    h: 4,
    layoutMode: 'flow-vertical',
    parentId: cardId,
    children: [],
  })

  // Add footer if requested
  if (options.hasFooter) {
    children.push({
      i: generateId('card-footer'),
      component: 'UiCardFooter',
      props: {},
      bind: undefined,
      action: undefined,
      x: 0,
      y: 0,
      w: 12,
      h: 1,
      layoutMode: 'flow-horizontal',
      parentId: cardId,
      children: [],
    })
  }

  // Generate root Card component
  const card: LayoutItem = {
    i: cardId,
    component: 'UiCard',
    props: {},
    bind: undefined,
    action: undefined,
    x,
    y,
    w: 12,
    h: children.reduce((sum, child) => sum + (child.h || 0), 0) + 1,
    layoutMode: 'flow-vertical',
    parentId: null,
    children,
  }

  return card
}

/**
 * Flatten a hierarchical LayoutItem tree into a flat array
 * (Helper for converting generated structures to flat config format)
 *
 * @param root - Root LayoutItem with nested children
 * @returns Flat array of all LayoutItems
 */
export function flattenLayoutTree(root: LayoutItem): LayoutItem[] {
  const result: LayoutItem[] = []

  function traverse(item: LayoutItem) {
    // Add current item (without children property in the flat version)
    const { children, ...itemWithoutChildren } = item
    result.push(itemWithoutChildren as LayoutItem)

    // Recursively traverse children
    if (children && children.length > 0) {
      children.forEach(traverse)
    }
  }

  traverse(root)
  return result
}
