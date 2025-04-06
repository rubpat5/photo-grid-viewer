import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

function GridPage() {

  return (
    <Container>
      <Grid>
      </Grid>
    </Container>
  );
}

export default GridPage;
