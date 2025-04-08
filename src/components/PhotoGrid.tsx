import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Grid, PhotoItem } from '../pages/styles/GridStyles';

interface Photo {
  id: number;
  src: {
    medium: string;
  };
  photographer: string;
  width: number;
  height: number;
}

interface PhotoPosition {
  top: number;
  left: number;
  height: number;
}

interface PhotoGridProps {
  photos: Photo[];
  containerHeight: number;
  photoPositions: { [key: number]: PhotoPosition };
  visiblePhotos: number[];
  renderedPhotos: Set<number>;
  gridRef: React.RefObject<HTMLDivElement>;
  onMount: () => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  containerHeight,
  photoPositions,
  visiblePhotos,
  renderedPhotos,
  gridRef,
  onMount,
}) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      console.log('PhotoGrid mounted');
      isMounted.current = true;
      onMount();
    }

    console.log('PhotoGrid updated:', {
      photosLength: photos.length,
      containerHeight,
      positionsLength: Object.keys(photoPositions).length,
      visiblePhotosLength: visiblePhotos.length,
      renderedPhotosSize: renderedPhotos.size
    });
  }, [photos, containerHeight, photoPositions, visiblePhotos, renderedPhotos, onMount]);

  if (!photos.length) {
    console.log('No photos to render');
    return null;
  }

  if (!containerHeight) {
    console.log('No container height');
    return null;
  }

  if (Object.keys(photoPositions).length === 0) {
    console.log('No photo positions');
    return null;
  }

  const renderedPhotosArray = Array.from(renderedPhotos);
  console.log('Rendering photos:', renderedPhotosArray.length);

  return (
    <Grid 
      ref={gridRef} 
      style={{ 
        height: containerHeight,
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      {renderedPhotosArray.map((index) => {
        const photo = photos[index];
        const position = photoPositions[index];
        
        if (!photo || !position) {
          console.log('Missing photo or position for index:', index);
          return null;
        }

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
  );
};

export default PhotoGrid; 