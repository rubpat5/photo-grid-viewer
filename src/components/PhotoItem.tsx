import React from 'react';
import { PhotoLink } from '../pages/styles/GridPage.styles';
import { GridLayout } from '../utils/gridCalculator';
import type { Photo } from '../utils/imgClient';

interface PhotoItemProps {
  photo: Photo;
  index: number;
  gridLayout: GridLayout;
  registerPhotoRef: (index: number, element: HTMLAnchorElement | null) => void;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, index, gridLayout, registerPhotoRef }) => {
  const position = gridLayout.itemPositions.get(index);
  if (!position) return null;
  
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
      $aspectRatio={aspectRatio}
      data-index={index}
      ref={el => registerPhotoRef(index, el)}
    >
      <img
        src={photo.src.large}
        alt={`Photo by ${photo.photographer}`}
        loading="lazy"
        decoding="async"
        style={{ 
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
    </PhotoLink>
  );
};

export default PhotoItem; 