import { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { calculateGridLayout, GridLayout } from '../utils/gridCalculator';
import { shouldRenderItem as checkItemVisibility } from '../utils/visibilityDetector';
import { useScroll } from '../context/ScrollContext';
import { debounce } from '../utils/debounce';
import type { Photo } from '../utils/imgClient';

interface UseGridLayoutProps {
  photos: Photo[];
}

export function useGridLayout({ photos }: UseGridLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  
  const [gridState, setGridState] = useState<{
    height: number;
    layout: GridLayout;
  }>({
    height: 0,
    layout: {
      columnWidth: 0,
      columns: 3,
      columnHeights: [0, 0, 0],
      itemPositions: new Map()
    }
  });
  
  const { height: gridHeight, layout: gridLayout } = gridState;
  
  const { gridScrollPosition } = useScroll();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const photoRefs = useRef<Map<number, HTMLAnchorElement | null>>(new Map());
  const hasRestoredScroll = useRef<boolean>(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const computeGridLayout = useCallback(() => {
    if (!containerRef.current || photos.length === 0) return;
    
    const containerWidth = containerRef.current.clientWidth - 40;
    const { layout, gridHeight: newGridHeight } = calculateGridLayout(containerWidth, photos);
    
    setGridState({
      height: newGridHeight,
      layout
    });
  }, [photos]);
  
  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    const handleVisibilityChange = (entries: IntersectionObserverEntry[]) => {
      setVisibleItems(prev => {
        const next = new Set(prev);
        
        entries.forEach(entry => {
          const index = Number(entry.target.getAttribute('data-index'));
          
          if (!isNaN(index)) {
            if (entry.isIntersecting) {
              next.add(index);
            } else {
              next.delete(index);
            }
          }
        });
        
        return next;
      });
    };
    
    observerRef.current = new IntersectionObserver(
      handleVisibilityChange,
      {
        root: containerRef.current,
        rootMargin: '175% 0px',
        threshold: 0.01
      }
    );
    
    photoRefs.current.forEach((element, index) => {
      if (element) {
        observerRef.current?.observe(element);
      }
    });
  }, []);
  
  const registerPhotoRef = (index: number, element: HTMLAnchorElement | null) => {
    if (element !== photoRefs.current.get(index)) {
      photoRefs.current.set(index, element);
      
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    }
  };
  
  useEffect(() => {
    computeGridLayout();
    
    const debouncedResize = debounce(() => {
      computeGridLayout();
    }, 200);
    
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, [computeGridLayout]);
  
  useEffect(() => {
    if (gridLayout.itemPositions.size > 0) {
      requestAnimationFrame(() => {
        setupObserver();
      });
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [gridState, setupObserver]);
  
  useEffect(() => {
    if (photos.length > 0 && visibleItems.size === 0) {
      const initialItems = new Set<number>();
      const initialCount = Math.min(photos.length, 30);
      for (let i = 0; i < initialCount; i++) {
        initialItems.add(i);
      }
      setVisibleItems(initialItems);
    }
  }, [photos.length, visibleItems.size]);

  useLayoutEffect(() => {
    if (containerRef.current && gridScrollPosition > 0 && gridLayout.itemPositions.size > 0 && !hasRestoredScroll.current) {
      containerRef.current.scrollTop = gridScrollPosition;
      hasRestoredScroll.current = true;
      
      setTimeout(() => {
        setInitialLoad(false);
      }, 50);
    } else if (gridLayout.itemPositions.size > 0 && !hasRestoredScroll.current) {
      setInitialLoad(false);
    }
  }, [gridScrollPosition, gridState]);

  const shouldRenderItem = useCallback((index: number) => {
    if (!containerRef.current) return visibleItems.has(index);
    
    return checkItemVisibility(
      index,
      visibleItems,
      gridLayout,
      containerRef.current.scrollTop,
      containerRef.current.clientHeight
    );
  }, [visibleItems, gridLayout]);

  return {
    containerRef,
    gridHeight,
    gridLayout,
    initialLoad,
    shouldRenderItem,
    registerPhotoRef
  };
} 