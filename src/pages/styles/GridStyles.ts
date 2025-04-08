import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const Grid = styled.div`
  position: relative;
  column-count: 3;
  column-gap: 20px;
  
  @media (max-width: 1200px) {
    column-count: 2;
  }
  
  @media (max-width: 768px) {
    column-count: 1;
  }
`;

export const PhotoItem = styled.div<{ $isPlaceholder?: boolean }>`
  break-inside: avoid;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  opacity: ${props => props.$isPlaceholder ? 0 : 1};

  &:hover {
    transform: scale(1.02);
  }

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

export const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
`; 