import { useParams, useNavigate } from 'react-router-dom';
import { usePhotoDetails } from '../hooks/usePhotoDetails';
import {
  Container,
  PhotoPane,
  ImgPage,
  InfoSection,
  Title,
  Photographer,
  ViewOnPexelsText,
  GoBack,
  LoadingMessage,
  ContentWrapper
} from './styles/DetailsStyles';

function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { photo, loading, error } = usePhotoDetails(id);

  if (loading) {
    return <LoadingMessage>Loading photo details...</LoadingMessage>;
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
        
        <ContentWrapper>
          <ImgPage>
            <img 
              src={photo.src.large2x} 
              alt={photo.alt || `Photo by ${photo.photographer}`} 
            />
          </ImgPage>
          
          <InfoSection>
            <Title>{photo.alt || 'Untitled Photo'}</Title>
            <Photographer>By: {photo.photographer}</Photographer>
            <ViewOnPexelsText>
              <a href={photo.url} target="_blank" rel="noopener noreferrer">
                View original on Pexels
              </a>
            </ViewOnPexelsText>
          </InfoSection>
        </ContentWrapper>
      </PhotoPane>
    </Container>
  );
}

export default DetailsPage;
