import { usePhotos } from '../hooks/usePhotos';
import { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Grid, 
  LoadingMessage, 
  PageWrapper 
} from './styles/GridPage.styles';
import { calculateGridLayout, GridLayout } from '../utils/gridCalculator';
import { createIntersectionObserver, shouldRenderItem as checkItemVisibility } from '../utils/visibilityDetector';
import PhotoItem from '../components/PhotoItem';

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
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const photoRefs = useRef<Map<number, HTMLAnchorElement | null>>(new Map());
  
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
      <Container ref={containerRef}>
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
