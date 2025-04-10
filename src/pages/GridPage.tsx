import { usePhotos } from '../context/PhotosContext';
import { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { 
  Container, 
  Grid, 
  LoadingMessage, 
  PageWrapper 
} from './styles/GridPage.styles';
import { calculateGridLayout, GridLayout } from '../utils/gridCalculator';
import { createIntersectionObserver, shouldRenderItem as checkItemVisibility } from '../utils/visibilityDetector';
import PhotoItem from '../components/PhotoItem';
import { useScroll } from '../context/ScrollContext';

function GridPage() {
  const { photos, loading, error } = usePhotos();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [gridHeight, setGridHeight] = useState(0);
  const [gridLayout, setGridLayout] = useState<GridLayout>({
    columnWidth: 0,
    columns: 3,
    columnHeights: [0, 0, 0],
    itemPositions: new Map()
  });
  
  const { gridScrollPosition, setGridScrollPosition } = useScroll();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const photoRefs = useRef<Map<number, HTMLAnchorElement | null>>(new Map());
  const scrollTimeoutRef = useRef<number | null>(null);
  const hasRestoredScroll = useRef<boolean>(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const computeGridLayout = useCallback(() => {
    if (!containerRef.current || photos.length === 0) return;
    
    const containerWidth = containerRef.current.clientWidth - 40;
    const { layout, gridHeight: newGridHeight } = calculateGridLayout(containerWidth, photos);
    
    setGridHeight(newGridHeight);
    setGridLayout(layout);
  }, [photos]);
  
  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    const handleVisibilityChange = (index: number, isVisible: boolean) => {
      setVisibleItems(prev => {
        const next = new Set(prev);
        
        if (isVisible) {
          next.add(index);
        } else {
          next.delete(index);
        }
        
        return next;
      });
    };
    
    observerRef.current = createIntersectionObserver(
      containerRef.current,
      handleVisibilityChange
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
    
    const handleResize = () => {
      computeGridLayout();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
  }, [gridLayout, setupObserver]);
  
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
  }, [gridScrollPosition, gridLayout.itemPositions.size]);

  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current !== null) {
      window.cancelAnimationFrame(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = window.requestAnimationFrame(() => {
      if (containerRef.current) {
        setGridScrollPosition(containerRef.current.scrollTop);
      }
      scrollTimeoutRef.current = null;
    });
  }, [setGridScrollPosition]);

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
  
  if (loading) {
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  if (error) {
    return <LoadingMessage>Error: {error}</LoadingMessage>;
  }

  return (
    <PageWrapper>
      <Container 
        ref={containerRef} 
        onScroll={handleScroll} 
        className={`grid-container ${initialLoad ? 'instant-scroll' : ''}`}
        style={initialLoad ? { scrollBehavior: 'auto', overflowY: 'hidden' } : undefined}
      >
        <Grid height={gridHeight}>
          {photos.map((photo, index) => {
            if (!shouldRenderItem(index)) return null;
            
            return (
              <PhotoItem
                key={photo.id}
                photo={photo}
                index={index}
                gridLayout={gridLayout}
                registerPhotoRef={registerPhotoRef}
              />
            );
          })}
        </Grid>
      </Container>
    </PageWrapper>
  );
}

export default GridPage;
