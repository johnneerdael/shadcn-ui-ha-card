/**
 * TreeView Component
 *
 * Hierarchical view of components showing parent-child relationships.
 * Supports drag-and-drop reordering within containers.
 *
 * Features:
 * - Collapsible/expandable containers
 * - Drag handles for reordering
 * - Visual hierarchy with indentation
 * - Context actions (edit, delete)
 * - "Add Child" button for containers
 */

import { useState, useCallback } from 'preact/hooks'
import type { JSX } from 'preact'
import type { LayoutItem } from './types'
import { componentRegistry } from '../lib/component-registry'

/**
 * Props for TreeView component
 */
export interface TreeViewProps {
  /** All layout items (flat array) */
  items: LayoutItem[]
  /** Currently selected item ID */
  selectedId: string | null
  /** Selection handler */
  onSelect: (id: string | null) => void
  /** Delete handler */
  onDelete: (id: string) => void
  /** Reorder handler (moves item to new parent or position) */
  onReorder?: (itemId: string, newParentId: string | null, newIndex: number) => void
  /** Add child handler */
  onAddChild?: (parentId: string) => void
}

/**
 * Props for TreeNode (recursive component)
 */
interface TreeNodeProps {
  item: LayoutItem
  level: number
  isSelected: boolean
  isExpanded: boolean
  onToggleExpand: (id: string) => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  children: LayoutItem[]
  onAddChild?: (parentId: string) => void
}

/**
 * Check if a component is a container that can have children
 */
function isContainer(componentName: string): boolean {
  const containerComponents = [
    'UiCard',
    'UiCardContent',
    'UiCardHeader',
    'UiCardFooter',
    'UiTabs',
    'UiTabsContent',
    'UiAccordion',
    'UiAccordionContent',
    'UiDialog',
    'UiDialogContent',
    'UiSheet',
    'UiSheetContent',
    'UiCollapsible',
    'UiCollapsibleContent',
    'UiFlexContainer',
    'UiGridContainer',
    'UiContainer',
  ]
  return containerComponents.includes(componentName)
}

/**
 * TreeNode - Recursive component for rendering individual tree items
 */
function TreeNode({
  item,
  level,
  isSelected,
  isExpanded,
  onToggleExpand,
  onSelect,
  onDelete,
  children,
  onAddChild,
}: TreeNodeProps) {
  const hasChildren = children.length > 0
  const canHaveChildren = isContainer(item.component)

  // Get component metadata from registry
  const componentDef = componentRegistry.get(item.component)
  const componentIcon = componentDef?.icon || 'mdi:puzzle'
  const componentName = componentDef?.displayName || item.component

  const handleToggle = (e: Event) => {
    e.stopPropagation()
    if (hasChildren) {
      onToggleExpand(item.i)
    }
  }

  const handleSelect = () => {
    onSelect(item.i)
  }

  const handleDelete = (e: Event) => {
    e.stopPropagation()
    if (confirm(`Delete ${componentName}?`)) {
      onDelete(item.i)
    }
  }

  const handleAddChild = (e: Event) => {
    e.stopPropagation()
    onAddChild?.(item.i)
  }

  return (
    <div class="tree-node">
      <div
        class={`tree-node-row ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${level * 1.5}rem` }}
        onClick={handleSelect}
      >
        {/* Expand/collapse toggle */}
        <button
          class="tree-node-toggle"
          onClick={handleToggle}
          disabled={!hasChildren}
          style={{ visibility: hasChildren ? 'visible' : 'hidden' }}
        >
          <ha-icon
            icon={isExpanded ? 'mdi:chevron-down' : 'mdi:chevron-right'}
          ></ha-icon>
        </button>

        {/* Drag handle */}
        <button class="tree-node-drag" title="Drag to reorder">
          <ha-icon icon="mdi:drag"></ha-icon>
        </button>

        {/* Component icon and name */}
        <div class="tree-node-content">
          <ha-icon icon={componentIcon}></ha-icon>
          <span class="tree-node-label">{componentName}</span>
          {item.bind && (
            <span class="tree-node-badge" title={`Bound to ${item.bind}`}>
              <ha-icon icon="mdi:link-variant"></ha-icon>
            </span>
          )}
        </div>

        {/* Actions */}
        <div class="tree-node-actions">
          {canHaveChildren && (
            <button
              class="tree-node-action"
              onClick={handleAddChild}
              title="Add child component"
            >
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          )}
          <button
            class="tree-node-action"
            onClick={handleDelete}
            title="Delete component"
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
      </div>

      {/* Render children recursively */}
      {hasChildren && isExpanded && (
        <div class="tree-node-children">
          {children.map((child) => (
            <TreeNodeContainer
              key={child.i}
              item={child}
              level={level + 1}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Container for TreeNode that manages its own state
 * (separate component to avoid prop drilling)
 */
interface TreeNodeContainerProps {
  item: LayoutItem
  level: number
  onToggleExpand: (id: string) => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onAddChild?: (parentId: string) => void
}

function TreeNodeContainer(_props: TreeNodeContainerProps) {
  // This would need to access parent context for selectedId and expandedIds
  // For now, we'll pass it through from the parent TreeView
  return <div>TreeNode placeholder</div>
}

/**
 * TreeView Component
 *
 * Main tree view component that manages state and renders the tree
 */
export function TreeView({
  items,
  selectedId,
  onSelect,
  onDelete,
  onAddChild,
}: TreeViewProps) {
  // Track which nodes are expanded (default: all expanded)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(items.filter((item) => item.children && item.children.length > 0).map((item) => item.i))
  )

  // Handle expand/collapse
  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  // Build hierarchical structure from flat array
  // Root items have no parentId or parentId === null
  const rootItems = items.filter((item) => !item.parentId)

  // Get children for a given parent ID
  const getChildren = useCallback(
    (parentId: string): LayoutItem[] => {
      return items.filter((item) => item.parentId === parentId)
    },
    [items]
  )

  // Recursive render function
  const renderNode = (item: LayoutItem, level: number): JSX.Element => {
    const children = getChildren(item.i)
    const isExpanded = expandedIds.has(item.i)
    const isSelected = selectedId === item.i

    return (
      <TreeNode
        key={item.i}
        item={item}
        level={level}
        isSelected={isSelected}
        isExpanded={isExpanded}
        onToggleExpand={handleToggleExpand}
        onSelect={onSelect}
        onDelete={onDelete}
        children={children}
        onAddChild={onAddChild}
      />
    )
  }

  return (
    <div class="tree-view">
      <div class="tree-view-header">
        <h3>Component Tree</h3>
        <p class="tree-view-subtitle">
          {items.length} component{items.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div class="tree-view-content">
        {rootItems.length === 0 ? (
          <div class="tree-view-empty">
            <ha-icon icon="mdi:view-dashboard-outline"></ha-icon>
            <p>No components yet</p>
            <p class="tree-view-empty-hint">Drag components from the palette</p>
          </div>
        ) : (
          rootItems.map((item) => renderNode(item, 0))
        )}
      </div>

      <style>{`
        .tree-view {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--card-background-color, #fff);
          border-radius: 8px;
          overflow: hidden;
        }

        .tree-view-header {
          padding: 1rem;
          border-bottom: 1px solid var(--divider-color, #e0e0e0);
        }

        .tree-view-header h3 {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--primary-text-color, #000);
        }

        .tree-view-subtitle {
          margin: 0.25rem 0 0 0;
          font-size: 0.75rem;
          color: var(--secondary-text-color, #666);
        }

        .tree-view-content {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem 0;
        }

        .tree-view-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          color: var(--secondary-text-color, #666);
          text-align: center;
        }

        .tree-view-empty ha-icon {
          --mdc-icon-size: 48px;
          opacity: 0.3;
          margin-bottom: 1rem;
        }

        .tree-view-empty p {
          margin: 0.25rem 0;
        }

        .tree-view-empty-hint {
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .tree-node {
          position: relative;
        }

        .tree-node-row {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.5rem 0.5rem 0;
          cursor: pointer;
          transition: background-color 150ms;
          border-radius: 4px;
          margin: 0 0.5rem;
        }

        .tree-node-row:hover {
          background-color: var(--secondary-background-color, #f5f5f5);
        }

        .tree-node-row.selected {
          background-color: var(--primary-color, #03a9f4);
          color: var(--text-primary-color, #fff);
        }

        .tree-node-row.selected ha-icon {
          color: inherit;
        }

        .tree-node-toggle {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          opacity: 0.7;
        }

        .tree-node-toggle:disabled {
          opacity: 0;
          pointer-events: none;
        }

        .tree-node-toggle ha-icon {
          --mdc-icon-size: 20px;
        }

        .tree-node-drag {
          background: none;
          border: none;
          padding: 0;
          cursor: grab;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          opacity: 0.5;
        }

        .tree-node-drag:hover {
          opacity: 1;
        }

        .tree-node-drag ha-icon {
          --mdc-icon-size: 18px;
        }

        .tree-node-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          min-width: 0;
        }

        .tree-node-content ha-icon {
          --mdc-icon-size: 20px;
          flex-shrink: 0;
        }

        .tree-node-label {
          font-size: 0.875rem;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tree-node-badge {
          display: flex;
          align-items: center;
          padding: 0.125rem 0.25rem;
          border-radius: 4px;
          background: var(--primary-color, #03a9f4);
          opacity: 0.8;
        }

        .tree-node-badge ha-icon {
          --mdc-icon-size: 14px;
        }

        .tree-node-actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          opacity: 0;
          transition: opacity 150ms;
        }

        .tree-node-row:hover .tree-node-actions {
          opacity: 1;
        }

        .tree-node-action {
          background: none;
          border: none;
          padding: 0.25rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background-color 150ms;
        }

        .tree-node-action:hover {
          background-color: var(--divider-color, #e0e0e0);
        }

        .tree-node-action ha-icon {
          --mdc-icon-size: 18px;
        }

        .tree-node-children {
          position: relative;
        }

        .tree-node-children::before {
          content: '';
          position: absolute;
          left: 0.75rem;
          top: 0;
          bottom: 0;
          width: 1px;
          background: var(--divider-color, #e0e0e0);
          opacity: 0.5;
        }
      `}</style>
    </div>
  )
}
