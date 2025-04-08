import { usePhotos } from '../hooks/usePhotos';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Container, Grid, PhotoItem, LoadingMessage } from './styles/GridStyles';

const throttle = (fn: Function, delay: number) => {
  let lastCall = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    return fn(...args);
  };
};

function GridPage() {
  const { photos, loading, error } = usePhotos();
  const gridRef = useRef<HTMLDivElement>(null);
  const [visiblePhotos, setVisiblePhotos] = useState<number[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);
  const [photoPositions, setPhotoPositions] = useState<{ [key: number]: { top: number; left: number; height: number } }>({});
  const [renderedPhotos, setRenderedPhotos] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!gridRef.current || photos.length === 0) return;

    const container = gridRef.current;
    const containerWidth = container.clientWidth;
    const columnCount = window.innerWidth >= 1200 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    const columnWidth = (containerWidth - (columnCount - 1) * 20) / columnCount;
    const columnHeights = new Array(columnCount).fill(0);
    const positions: { [key: number]: { top: number; left: number; height: number } } = {};

    photos.forEach((photo, index) => {
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      const left = shortestColumnIndex * (columnWidth + 20);
      const top = columnHeights[shortestColumnIndex];
      const aspectRatio = photo.width / photo.height;
      const height = columnWidth / aspectRatio;

      positions[index] = { top, left, height };
      columnHeights[shortestColumnIndex] = top + height + 20;
    });

    setPhotoPositions(positions);
    setContainerHeight(Math.max(...columnHeights));
  }, [photos]);

  const updateVisiblePhotos = useCallback(() => {
    if (!gridRef.current) return;

    const container = gridRef.current;
    const containerRect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const buffer = viewportHeight * 2;

    const visibleStart = Math.max(0, -containerRect.top - buffer);
    const visibleEnd = Math.min(
      containerHeight,
      -containerRect.top + viewportHeight + buffer
    );

    const visibleIndices = Object.entries(photoPositions)
      .filter(([_, pos]) => {
        const itemTop = pos.top;
        const itemBottom = itemTop + pos.height;
        return (itemTop >= visibleStart && itemTop <= visibleEnd) ||
               (itemBottom >= visibleStart && itemBottom <= visibleEnd);
      })
      .map(([index]) => parseInt(index));

    setVisiblePhotos(visibleIndices);
    
    setTimeout(() => {
      setRenderedPhotos(new Set(visibleIndices));
    }, 100);
  }, [photos, containerHeight, photoPositions]);

  useEffect(() => {
    const throttledUpdate = throttle(updateVisiblePhotos, 100);
    window.addEventListener('scroll', throttledUpdate);
    window.addEventListener('resize', throttledUpdate);

    updateVisiblePhotos();

    return () => {
      window.removeEventListener('scroll', throttledUpdate);
      window.removeEventListener('resize', throttledUpdate);
    };
  }, [updateVisiblePhotos]);

  useEffect(() => {
    if (photos.length > 0 && visiblePhotos.length === 0) {
      const initialVisibleCount = Math.min(photos.length, 12);
      const initialVisible = Array.from({ length: initialVisibleCount }, (_, i) => i);
      setVisiblePhotos(initialVisible);
      setRenderedPhotos(new Set(initialVisible));
    }
  }, [photos, visiblePhotos.length]);

  if (loading) {
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  if (error) {
    return <LoadingMessage>Error: {error}</LoadingMessage>;
  }

  return (
    <Container>
      <Grid ref={gridRef} style={{ height: containerHeight }}>
        {photos.map((photo, index) => {
          const position = photoPositions[index];
          if (!position) return null;

          const isVisible = visiblePhotos.includes(index);
          const shouldRender = renderedPhotos.has(index);

          if (!shouldRender) return null;

          return (
            <PhotoItem
              key={photo.id}
              $isPlaceholder={!isVisible}
              style={{
                position: 'absolute',
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${position.height * (photo.width / photo.height)}px`,
                height: `${position.height}px`,
              }}
            >
              <Link to={`/photo/${photo.id}`} style={{ textDecoration: 'none' }}>
                <img
                  src={photo.src.medium}
                  alt={`Photo by ${photo.photographer}`}
                  width={photo.width}
                  height={photo.height}
                  loading={index < 6 ? "eager" : "lazy"}
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.opacity = '1';
                  }}
                  style={{
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                />
              </Link>
            </PhotoItem>
          );
        })}
      </Grid>
    </Container>
  );
}

export default GridPage;
