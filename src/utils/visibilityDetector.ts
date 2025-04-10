import { GridLayout } from './gridCalculator';

export function shouldRenderItem(
  index: number,
  visibleItems: Set<number>,
  gridLayout: GridLayout,
  containerScrollTop: number,
  containerHeight: number
): boolean {
  if (visibleItems.has(index)) return true;
  
  const position = gridLayout.itemPositions.get(index);
  if (!position) return false;
  
  const containerTop = containerScrollTop;
  const containerBottom = containerTop + containerHeight;
  const bufferSize = containerHeight * 2;
  
  const itemTop = position.top;
  const itemBottom = position.top + position.height;
  
  return (
    (itemTop >= containerTop - bufferSize && itemTop <= containerBottom + bufferSize) ||
    (itemBottom >= containerTop - bufferSize && itemBottom <= containerBottom + bufferSize)
  );
}

export function createIntersectionObserver(
  containerElement: HTMLElement | null,
  onVisibilityChange: (index: number, isVisible: boolean) => void
): IntersectionObserver {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const index = Number(entry.target.getAttribute('data-index'));
        
        if (!isNaN(index)) {
          onVisibilityChange(index, entry.isIntersecting);
        }
      });
    },
    {
      root: containerElement,
      rootMargin: '300% 0px',
      threshold: 0.01
    }
  );
} 