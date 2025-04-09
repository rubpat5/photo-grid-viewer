import styled from 'styled-components';
import { usePhotos } from '../hooks/usePhotos';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import type { Photo } from '../utils/imgClient';

const Container = styled.div`
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
`;

const Grid = styled.div<{ height: number }>`
  position: relative;
  height: ${props => `${props.height}px`};
`;

const PhotoLink = styled(Link)<{ column: number; top: number; width: number; aspectRatio: number }>`
  position: absolute;
  left: ${props => props.column * (props.width + 20)}px;
  top: ${props => props.top}px;
  width: ${props => props.width}px;
  display: block;
  break-inside: avoid;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
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

function GridPage() {
  const { photos, loading, error } = usePhotos();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleIndices, setVisibleIndices] = useState<number[]>([]);
  const [gridHeight, setGridHeight] = useState(0);
  const [gridLayout, setGridLayout] = useState<{
    columnWidth: number;
    columns: number;
    columnHeights: number[];
    itemPositions: Map<number, { column: number; top: number }>;
  }>({
    columnWidth: 0,
    columns: 3,
    columnHeights: [0, 0, 0],
    itemPositions: new Map()
  });
  
  const calculateGridLayout = useCallback(() => {
    if (!containerRef.current || photos.length === 0) return;
    
    const containerWidth = containerRef.current.clientWidth - 40;
    let columns = 3;
    
    if (window.innerWidth <= 768) {
      columns = 1;
    } else if (window.innerWidth <= 1200) {
      columns = 2;
    }
    
    const gapSpace = (columns - 1) * 20;
    const columnWidth = (containerWidth - gapSpace) / columns;
    
    const columnHeights = Array(columns).fill(0);
    const itemPositions = new Map<number, { column: number; top: number }>();
    
    photos.forEach((photo, index) => {
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
      
      const aspectRatio = photo.width / photo.height;
      const itemHeight = columnWidth / aspectRatio;
      
      itemPositions.set(index, {
        column: shortestColumn,
        top: columnHeights[shortestColumn]
      });
      
      columnHeights[shortestColumn] += itemHeight + 20;
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
  
  const updateVisibleItems = useCallback(() => {
    if (!containerRef.current || !gridLayout.itemPositions.size) return;
    
    const scrollTop = containerRef.current.scrollTop;
    const viewportHeight = containerRef.current.clientHeight;
    const buffer = viewportHeight;
    
    const newVisibleIndices: number[] = [];
    
    photos.forEach((_, index) => {
      const position = gridLayout.itemPositions.get(index);
      if (!position) return;
      
      const aspectRatio = photos[index].width / photos[index].height;
      const itemHeight = gridLayout.columnWidth / aspectRatio;
      const itemTop = position.top;
      const itemBottom = itemTop + itemHeight;
      
      if (
        (itemTop >= scrollTop - buffer && itemTop <= scrollTop + viewportHeight + buffer) ||
        (itemBottom >= scrollTop - buffer && itemBottom <= scrollTop + viewportHeight + buffer) ||
        (itemTop <= scrollTop - buffer && itemBottom >= scrollTop + viewportHeight + buffer)
      ) {
        newVisibleIndices.push(index);
      }
    });
    
    setVisibleIndices(newVisibleIndices);
  }, [photos, gridLayout]);
  
  useEffect(() => {
    calculateGridLayout();
    
    const handleResize = () => {
      calculateGridLayout();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateGridLayout]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    updateVisibleItems();
    
    const handleScroll = () => {
      updateVisibleItems();
    };
    
    containerRef.current.addEventListener('scroll', handleScroll);
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [updateVisibleItems, gridLayout]);
  
  if (loading) {
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  if (error) {
    return <LoadingMessage>Error: {error}</LoadingMessage>;
  }

  return (
    <Container ref={containerRef}>
      <Grid height={gridHeight}>
        {photos.map((photo, index) => {
          if (!visibleIndices.includes(index)) return null;
          
          const position = gridLayout.itemPositions.get(index);
          if (!position) return null;
          
          const aspectRatio = photo.width / photo.height;
          
          return (
            <PhotoLink 
              key={photo.id} 
              to={`/photo/${photo.id}`}
              column={position.column}
              top={position.top}
              width={gridLayout.columnWidth}
              aspectRatio={aspectRatio}
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
  );
}

export default GridPage;
