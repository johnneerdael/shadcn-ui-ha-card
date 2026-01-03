/**
 * Carousel Component
 *
 * Image/content slider with navigation.
 * Based on shadcn/ui Carousel (CSS scroll-snap).
 *
 * Useful for: Camera feed cycling, dashboard pages, image galleries.
 *
 * @example
 * ```html
 * <div class="shc-carousel">
 *   <div class="shc-carousel-viewport">
 *     <div class="shc-carousel-container">
 *       <div class="shc-carousel-item">
 *         <img src="camera1.jpg" alt="Front Door" />
 *       </div>
 *       <div class="shc-carousel-item">
 *         <img src="camera2.jpg" alt="Backyard" />
 *       </div>
 *     </div>
 *   </div>
 *   <button class="shc-carousel-prev"><ha-icon icon="mdi:chevron-left"></ha-icon></button>
 *   <button class="shc-carousel-next"><ha-icon icon="mdi:chevron-right"></ha-icon></button>
 *   <div class="shc-carousel-dots">
 *     <button class="shc-carousel-dot shc-carousel-dot-active"></button>
 *     <button class="shc-carousel-dot"></button>
 *   </div>
 * </div>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/carousel
 */

import type { ComponentDefinition } from '../lib/component-registry'

export const carouselStyles = `
  .shc-carousel { position: relative; width: 100%; }
  .shc-carousel-viewport { overflow: hidden; border-radius: var(--radius, 0.5rem); }

  .shc-carousel-container {
    display: flex; scroll-snap-type: x mandatory; overflow-x: auto; scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .shc-carousel-container::-webkit-scrollbar { display: none; }

  .shc-carousel-item {
    flex: 0 0 100%; scroll-snap-align: start; scroll-snap-stop: always;
  }

  .shc-carousel-item img { width: 100%; height: 100%; object-fit: cover; }

  /* Navigation buttons */
  .shc-carousel-prev,
  .shc-carousel-next {
    position: absolute; top: 50%; transform: translateY(-50%); z-index: 10;
    display: inline-flex; align-items: center; justify-content: center;
    width: 2.5rem; height: 2.5rem; background-color: var(--background);
    border: 1px solid var(--border); border-radius: 50%;
    cursor: pointer; transition: all 150ms ease; opacity: 0.8;
  }

  .shc-carousel-prev:hover,
  .shc-carousel-next:hover { opacity: 1; background-color: var(--muted); }

  .shc-carousel-prev { left: 1rem; }
  .shc-carousel-next { right: 1rem; }

  /* Dots indicator */
  .shc-carousel-dots {
    position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%);
    display: flex; gap: 0.5rem; z-index: 10;
  }

  .shc-carousel-dot {
    width: 0.5rem; height: 0.5rem; background-color: var(--muted-foreground);
    border: none; border-radius: 50%; cursor: pointer; transition: all 150ms ease;
    opacity: 0.5;
  }

  .shc-carousel-dot:hover { opacity: 0.8; }
  .shc-carousel-dot-active { opacity: 1; background-color: var(--primary); }

  /* Vertical variant */
  .shc-carousel-vertical .shc-carousel-container {
    flex-direction: column; scroll-snap-type: y mandatory; overflow-y: auto; overflow-x: hidden;
  }

  .shc-carousel-vertical .shc-carousel-item { flex: 0 0 100%; scroll-snap-align: start; }
`

export const carouselComponent: ComponentDefinition = {
  name: 'carousel',
  styles: carouselStyles,
  description: 'Image/content slider with navigation',
}

export function initCarousel(container: HTMLElement): () => void {
  const scrollContainer = container.querySelector('.shc-carousel-container') as HTMLElement
  const prevBtn = container.querySelector('.shc-carousel-prev')
  const nextBtn = container.querySelector('.shc-carousel-next')
  const dots = Array.from(container.querySelectorAll('.shc-carousel-dot'))

  if (!scrollContainer) return () => {}

  const items = Array.from(scrollContainer.children)
  let currentIndex = 0

  const updateDots = () => {
    dots.forEach((dot, i) => {
      dot.classList.toggle('shc-carousel-dot-active', i === currentIndex)
    })
  }

  const scrollToIndex = (index: number) => {
    currentIndex = Math.max(0, Math.min(index, items.length - 1))
    const item = items[currentIndex] as HTMLElement
    scrollContainer.scrollTo({ left: item.offsetLeft, behavior: 'smooth' })
    updateDots()
  }

  prevBtn?.addEventListener('click', () => scrollToIndex(currentIndex - 1))
  nextBtn?.addEventListener('click', () => scrollToIndex(currentIndex + 1))
  dots.forEach((dot, i) => dot.addEventListener('click', () => scrollToIndex(i)))

  return () => {}
}
