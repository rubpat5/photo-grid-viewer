import { usePhotos } from '../context/PhotosContext';
import { 
  Container, 
  Grid, 
  LoadingMessage, 
  PageWrapper 
} from './styles/GridStyles';
import PhotoItem from '../components/PhotoItem';
import { useGridLayout } from '../hooks/useGridLayout';

function GridPage() {
  const { photos, loading, error } = usePhotos();
  
  const {
    containerRef,
    gridHeight,
    gridLayout,
    initialLoad,
    shouldRenderItem,
    registerPhotoRef
  } = useGridLayout({ photos });

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
