import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { usePhotoDetails } from '../hooks/usePhotoDetails';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PhotoPane = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ImgPage = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Photographer = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin: 0;
`;

const ViewOnPexelsText = styled.p`
  font-size: 1rem;
  color: #888;
  margin: 0;
`;

const GoBack = styled.button`
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
  align-self: flex-start;
  
  &:hover {
    background: #0056b3;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
`;

function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { photo, loading, error } = usePhotoDetails(id);

  if (loading) {
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  if (error) {
    return <LoadingMessage>Error: {error}</LoadingMessage>;
  }

  if (!photo) {
    return <LoadingMessage>Photo not found</LoadingMessage>;
  }

  return (
    <Container>
      <PhotoPane>
        <GoBack onClick={() => navigate(-1)}>← Back to Grid</GoBack>
        <ImgPage>
          <img src={photo.src.large} alt={photo.alt || `Photo by ${photo.photographer}`} />
        </ImgPage>
        <InfoSection>
          <Title>{photo.alt || 'Untitled'}</Title>
          <Photographer>Photographer: {photo.photographer}</Photographer>
          <ViewOnPexelsText>View on Pexels: <a href={photo.url} target="_blank" rel="noopener noreferrer">Original Photo</a></ViewOnPexelsText>
        </InfoSection>
      </PhotoPane>
    </Container>
  );
}

export default DetailsPage;
