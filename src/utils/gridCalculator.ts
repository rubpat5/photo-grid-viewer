export interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

export interface GridLayout {
  columnWidth: number;
  columns: number;
  columnHeights: number[];
  itemPositions: Map<number, { column: number; top: number; height: number }>;
}

export function calculateGridLayout(
  containerWidth: number,
  photos: Photo[]
): { layout: GridLayout; gridHeight: number } {
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
  
  return {
    layout: {
      columnWidth,
      columns,
      columnHeights,
      itemPositions
    },
    gridHeight: maxHeight
  };
} 