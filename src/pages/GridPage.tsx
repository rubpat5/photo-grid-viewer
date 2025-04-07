import styled from 'styled-components';
import { usePhotos } from '../hooks/usePhotos';

const Container = styled.div`
  padding: 20px;
`;

const Grid = styled.div`
  column-count: 3;
  column-gap: 20px;
  
  @media (max-width: 1200px) {
    column-count: 2;
  }
  
  @media (max-width: 768px) {
    column-count: 1;
  }
`;

const PhotoItem = styled.div`
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

function GridPage() {
  const { photos, loading, error } = usePhotos();

  if (loading) {
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  if (error) {
    return <LoadingMessage>Error: {error}</LoadingMessage>;
  }

  return (
    <Container>
      <Grid>
        {photos.map((photo) => (
          <PhotoItem key={photo.id}>
            <img
              src={photo.src.medium}
              alt={`Photo by ${photo.photographer}`}
            />
          </PhotoItem>
        ))}
      </Grid>
    </Container>
  );
}

export default GridPage;
