import styled from 'styled-components';
import { usePhotos } from '../hooks/usePhotos';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';

const Container = styled.div`
  padding: 20px;
  height: calc(100vh - 40px);
  overflow-y: auto;
`;

const Grid = styled.div<{ height: number }>`
  position: relative;
  height: ${props => `${props.height}px`};
  width: 100%;
`;

const PhotoLink = styled(Link)<{ transform: string; width: number; aspectRatio: number; 'data-index'?: number }>`
  position: absolute;
  width: ${props => props.width}px;
  transform: ${props => props.transform};
  display: block;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
  will-change: transform;

  &:hover {
    z-index: 1;
    transform: ${props => props.transform} scale(1.02);
  }

  img {
    width: 100%;
    aspect-ratio: ${props => props.aspectRatio};
    height: auto;
    display: block;
    background-color: #f0f0f0;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
`;

const PageWrapper = styled.div`
  height: 100vh;
  overflow: hidden;
`;

function GridPage() {
  const { photos, loading, error } = usePhotos();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [gridHeight, setGridHeight] = useState(0);
  const [gridLayout, setGridLayout] = useState<{
    columnWidth: number;
    columns: number;
    columnHeights: number[];
    itemPositions: Map<number, { column: number; top: number; height: number }>;
  }>({
    columnWidth: 0,
    columns: 3,
    columnHeights: [0, 0, 0],
    itemPositions: new Map()
  });
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const photoRefs = useRef<Map<number, HTMLAnchorElement | null>>(new Map());
  
  const calculateGridLayout = useCallback(() => {
    if (!containerRef.current || photos.length === 0) return;
    
    const containerWidth = containerRef.current.clientWidth - 40;
    let columns = 3;
    
    if (window.innerWidth <= 768) {
      columns = 1;
    } else if (window.innerWidth <= 1200) {
      columns = 2;
    }
    
    const gapSize = 20;
    const gapSpace = (columns - 1) * gapSize;
    const columnWidth = (containerWidth - gapSpace) / columns;
    
    const columnHeights = Array(columns).fill(0);
    const itemPositions = new Map<number, { column: number; top: number; height: number }>();
    
    photos.forEach((photo, index) => {
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
      
      const aspectRatio = photo.width / photo.height;
      const itemHeight = columnWidth / aspectRatio;
      
      itemPositions.set(index, {
        column: shortestColumn,
        top: columnHeights[shortestColumn],
        height: itemHeight
      });
      
      columnHeights[shortestColumn] += itemHeight + gapSize;
    });
    
    const maxHeight = Math.max(...columnHeights);
    setGridHeight(maxHeight);
    
    setGridLayout({
      columnWidth,
      columns,
      columnHeights,
      itemPositions
    });
    
  }, [photos]);
  
  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const index = Number(entry.target.getAttribute('data-index'));
          
          if (!isNaN(index)) {
            setVisibleItems(prev => {
              const next = new Set(prev);
              
              if (entry.isIntersecting) {
                next.add(index);
              } else {
                next.delete(index);
              }
              
              return next;
            });
          }
        });
      },
      {
        root: containerRef.current,
        rootMargin: '200% 0px',
        threshold: 0
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
    calculateGridLayout();
    
    const handleResize = () => {
      calculateGridLayout();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateGridLayout]);
  
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
    if (visibleItems.has(index)) return true;
    
    const position = gridLayout.itemPositions.get(index);
    if (!position || !containerRef.current) return false;
    
    const containerTop = containerRef.current.scrollTop;
    const containerBottom = containerTop + containerRef.current.clientHeight;
    const bufferSize = containerRef.current.clientHeight * 1.5;
    
    const itemTop = position.top;
    const itemBottom = position.top + position.height;
    
    return (
      (itemTop >= containerTop - bufferSize && itemTop <= containerBottom + bufferSize) ||
      (itemBottom >= containerTop - bufferSize && itemBottom <= containerBottom + bufferSize)
    );
  }, [visibleItems, gridLayout.itemPositions]);
  
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
            const position = gridLayout.itemPositions.get(index);
            if (!position) return null;
            
            if (!shouldRenderItem(index)) return null;
            
            const aspectRatio = photo.width / photo.height;
            const x = position.column * (gridLayout.columnWidth + 20);
            const y = position.top;
            
            const transform = `translate3d(${x}px, ${y}px, 0)`;
            
            return (
              <PhotoLink 
                key={photo.id} 
                to={`/photo/${photo.id}`}
                transform={transform}
                width={gridLayout.columnWidth}
                aspectRatio={aspectRatio}
                data-index={index}
                ref={el => registerPhotoRef(index, el)}
              >
                <img
                  src={photo.src.large}
                  alt={`Photo by ${photo.photographer}`}
                  loading="lazy"
                />
              </PhotoLink>
            );
          })}
        </Grid>
      </Container>
    </PageWrapper>
  );
}

export default GridPage;
