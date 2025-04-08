import styled from 'styled-components';
import { usePhotos } from '../hooks/usePhotos';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';

const Container = styled.div`
  padding: 20px;
`;

const Grid = styled.div`
  position: relative;
  column-count: 3;
  column-gap: 20px;
  
  @media (max-width: 1200px) {
    column-count: 2;
  }
  
  @media (max-width: 768px) {
    column-count: 1;
  }
`;

const PhotoItem = styled.div<{ $isPlaceholder?: boolean }>`
  break-inside: avoid;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  opacity: ${props => props.$isPlaceholder ? 0 : 1};

  &:hover {
    transform: scale(1.02);
  }

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
`;

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

    const isNearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500;
    if (isNearBottom && visibleIndices.length < photos.length) {
      const lastVisibleIndex = Math.max(...visibleIndices);
      const additionalPhotos = Math.min(12, photos.length - lastVisibleIndex - 1);
      if (additionalPhotos > 0) {
        const newIndices = Array.from(
          { length: additionalPhotos },
          (_, i) => lastVisibleIndex + i + 1
        );
        const combinedIndices = [...visibleIndices, ...newIndices].filter((value, index, self) => 
          self.indexOf(value) === index
        );
        setVisiblePhotos(combinedIndices);
        return;
      }
    }

    setVisiblePhotos(visibleIndices);
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
      setVisiblePhotos(Array.from({ length: initialVisibleCount }, (_, i) => i));
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
              {isVisible && (
                <Link to={`/photo/${photo.id}`} style={{ textDecoration: 'none' }}>
                  <img
                    src={photo.src.medium}
                    alt={`Photo by ${photo.photographer}`}
                    loading="lazy"
                  />
                </Link>
              )}
            </PhotoItem>
          );
        })}
      </Grid>
    </Container>
  );
}

export default GridPage;
