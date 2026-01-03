/**
 * Aspect Ratio Component
 * 
 * Maintains a consistent aspect ratio for responsive media containers.
 * Uses CSS aspect-ratio property with fallback for older browsers.
 * 
 * @example
 * ```yaml
 * content: |
 *   <div class="shc-aspect-ratio" style="--aspect-ratio: 16/9;">
 *     <img src="/image.jpg" alt="Image" style="object-fit: cover;" />
 *   </div>
 * ```
 * 
 * @see https://ui.shadcn.com/docs/components/aspect-ratio
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const aspectRatioStyles = `
  /* Aspect ratio container */
  .shc-aspect-ratio {
    position: relative;
    width: 100%;
    aspect-ratio: var(--aspect-ratio, 1/1);
  }

  /* Child elements fill container */
  .shc-aspect-ratio > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  /* Common aspect ratio presets */
  .shc-aspect-ratio-square {
    aspect-ratio: 1/1;
  }

  .shc-aspect-ratio-video {
    aspect-ratio: 16/9;
  }

  .shc-aspect-ratio-portrait {
    aspect-ratio: 3/4;
  }

  .shc-aspect-ratio-landscape {
    aspect-ratio: 4/3;
  }

  .shc-aspect-ratio-ultrawide {
    aspect-ratio: 21/9;
  }

  /* Fallback for browsers without aspect-ratio support */
  @supports not (aspect-ratio: 1/1) {
    .shc-aspect-ratio {
      position: relative;
      padding-bottom: calc(100% / (var(--aspect-ratio, 1)));
      height: 0;
    }

    .shc-aspect-ratio-square {
      padding-bottom: 100%;
    }

    .shc-aspect-ratio-video {
      padding-bottom: 56.25%; /* 9/16 */
    }

    .shc-aspect-ratio-portrait {
      padding-bottom: 133.33%; /* 4/3 */
    }

    .shc-aspect-ratio-landscape {
      padding-bottom: 75%; /* 3/4 */
    }

    .shc-aspect-ratio-ultrawide {
      padding-bottom: 42.857%; /* 9/21 */
    }
  }
`

/**
 * Aspect ratio component definition
 */
export const aspectRatioComponent: ComponentDefinition = {
  name: 'aspect-ratio',
  styles: aspectRatioStyles,
}

/**
 * Helper function to generate aspect ratio class names
 * @param ratio - 'square', 'video', 'portrait', 'landscape', 'ultrawide', or custom
 */
export function aspectRatio(
  ratio: 'square' | 'video' | 'portrait' | 'landscape' | 'ultrawide' | 'custom' = 'square'
): string {
  return ratio === 'custom' ? 'shc-aspect-ratio' : `shc-aspect-ratio shc-aspect-ratio-${ratio}`
}

/**
 * Generate inline style for custom aspect ratio
 * @param width - Width value
 * @param height - Height value
 * @returns CSS style object
 */
export function customAspectRatio(width: number, height: number): string {
  return `--aspect-ratio: ${width}/${height};`
}