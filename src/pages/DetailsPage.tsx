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
  LoadingMessage
} from './styles/DetailsStyles';

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
