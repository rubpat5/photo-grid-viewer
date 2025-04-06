import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

function DetailsPage() {
  const { id } = useParams();

  return (
    <Container>
      <h1>Photo Details</h1>
      <p>Photo ID: {id}</p>
    </Container>
  );
}

export default DetailsPage;
