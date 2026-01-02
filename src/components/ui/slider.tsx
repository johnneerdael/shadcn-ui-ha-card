/**
 * Slider Component (Preact)
 *
 * Range slider component for numeric controls (brightness, volume, temperature, etc.).
 * Based on shadcn/ui Slider with Home Assistant entity binding.
 *
 * @see https://ui.shadcn.com/docs/components/slider
 */

import { useState, useEffect, useRef } from 'preact/hooks'
import { cn } from '../../lib/utils'

/**
 * Slider component props
 */
export interface SliderProps {
  /** Current value (controlled) */
  value?: number
  /** Default value (uncontrolled) */
  defaultValue?: number
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
  /** Change handler (fires during drag) */
  onValueChange?: (value: number) => void
  /** Commit handler (fires on mouse up) */
  onValueCommit?: (value: number) => void
  /** Click handler (for entity actions) */
  onClick?: (event: MouseEvent) => void
  /** Disabled state */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** ARIA label for accessibility */
  'aria-label'?: string
  /** Orientation */
  orientation?: 'horizontal' | 'vertical'
}

/**
 * Slider Component
 *
 * Usage:
 * ```tsx
 * // Controlled
 * <Slider value={brightness} min={0} max={100} onValueCommit={setBrightness} />
 *
 * // With entity binding (via LayoutRenderer)
 * <Slider value={entityBrightness} min={0} max={255} onValueCommit={updateBrightness} />
 * ```
 */
export function Slider({
  value: valueProp,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  onValueCommit,
  onClick,
  disabled = false,
  className,
  orientation = 'horizontal',
  ...props
}: SliderProps) {
  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [isDragging, setIsDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  // Use controlled value if provided, otherwise use internal state
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : internalValue

  // Clamp value to min/max
  const clampedValue = Math.max(min, Math.min(max, value))

  // Calculate percentage for visual display
  const percentage = ((clampedValue - min) / (max - min)) * 100

  // Sync internal state with prop changes
  useEffect(() => {
    if (isControlled && valueProp !== internalValue) {
      setInternalValue(valueProp)
    }
  }, [valueProp, isControlled])

  // Calculate value from mouse position
  const calculateValueFromPosition = (clientX: number, clientY: number): number => {
    if (!trackRef.current) return value

    const rect = trackRef.current.getBoundingClientRect()
    const isVertical = orientation === 'vertical'

    let percentage: number
    if (isVertical) {
      percentage = 1 - (clientY - rect.top) / rect.height
    } else {
      percentage = (clientX - rect.left) / rect.width
    }

    // Clamp percentage
    percentage = Math.max(0, Math.min(1, percentage))

    // Convert to value with step
    const rawValue = min + percentage * (max - min)
    const steppedValue = Math.round(rawValue / step) * step

    return Math.max(min, Math.min(max, steppedValue))
  }

  // Handle mouse/touch down
  const handlePointerDown = (event: PointerEvent) => {
    if (disabled) return

    event.preventDefault()
    setIsDragging(true)

    const newValue = calculateValueFromPosition(event.clientX, event.clientY)

    if (!isControlled) {
      setInternalValue(newValue)
    }

    onValueChange?.(newValue)
    onClick?.(event as unknown as MouseEvent)

    // Capture pointer for smooth dragging
    ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
  }

  // Handle mouse/touch move
  const handlePointerMove = (event: PointerEvent) => {
    if (!isDragging || disabled) return

    event.preventDefault()

    const newValue = calculateValueFromPosition(event.clientX, event.clientY)

    if (!isControlled) {
      setInternalValue(newValue)
    }

    onValueChange?.(newValue)
  }

  // Handle mouse/touch up
  const handlePointerUp = (event: PointerEvent) => {
    if (!isDragging) return

    setIsDragging(false)

    const finalValue = calculateValueFromPosition(event.clientX, event.clientY)

    if (!isControlled) {
      setInternalValue(finalValue)
    }

    onValueCommit?.(finalValue)

    // Release pointer capture
    ;(event.target as HTMLElement).releasePointerCapture(event.pointerId)
  }

  // Track container styles
  const trackClasses = cn(
    'relative',
    'w-full',
    'touch-none',
    'select-none',
    orientation === 'vertical' ? 'h-full w-2' : 'h-2',
    className
  )

  // Track background styles
  const trackBgClasses = cn(
    'relative',
    'w-full',
    'grow',
    'overflow-hidden',
    'rounded-full',
    'bg-[var(--secondary)]',
    orientation === 'vertical' ? 'h-full' : 'h-full'
  )

  // Range (filled portion) styles
  const rangeClasses = cn(
    'absolute',
    'bg-[var(--primary)]',
    orientation === 'vertical' ? 'w-full bottom-0' : 'h-full'
  )

  // Thumb styles
  const thumbClasses = cn(
    'absolute',
    'block',
    'h-5',
    'w-5',
    'rounded-full',
    'border-2',
    'border-[var(--primary)]',
    'bg-[var(--background)]',
    'ring-offset-background',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    isDragging ? 'cursor-grabbing' : 'cursor-grab'
  )

  // Position calculations
  const rangeStyle = orientation === 'vertical'
    ? { height: `${percentage}%` }
    : { width: `${percentage}%` }

  const thumbStyle = orientation === 'vertical'
    ? { bottom: `calc(${percentage}% - 0.625rem)` }
    : { left: `calc(${percentage}% - 0.625rem)` }

  return (
    <div
      class={trackClasses}
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      data-disabled={disabled}
      {...props}
    >
      <div class={trackBgClasses}>
        <div class={rangeClasses} style={rangeStyle} />
      </div>
      <div
        class={thumbClasses}
        style={thumbStyle}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={clampedValue}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      />
    </div>
  )
}

/**
 * Export default for convenience
 */
export default Slider
