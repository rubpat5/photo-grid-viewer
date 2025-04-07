import styled from 'styled-components';
import { usePhotos } from '../hooks/usePhotos';

const Container = styled.div`
  padding: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
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
          <img
            key={photo.id}
            src={photo.src.medium}
            alt={`Photo by ${photo.photographer}`}
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
        ))}
      </Grid>
    </Container>
  );
}

export default GridPage;
