import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f9f9f9;
  min-height: 100vh;
  box-sizing: border-box;
  
  @media (max-width: 900px) {
    padding: 10px;
    overflow-y: auto;
    height: 100vh;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
  }
`;

export const PhotoPane = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  
  @media (max-width: 900px) {
    padding: 20px;
    gap: 20px;
    max-height: 100%;
    overflow-y: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  width: 100%;
  
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 20px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
  }
`;

export const ImgPage = styled.div`
  flex: 3;
  position: relative;
  
  img {
    display: block;
    width: 100%;
    max-height: 70vh;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    object-fit: contain;
    
    &:hover {
      transform: scale(1.01);
    }
  }
  
  @media (max-width: 900px) {
    img {
      max-height: 50vh;
    }
  }
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 12px;
  flex: 2;
  align-self: flex-start;
  
  @media (max-width: 900px) {
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
  }
`;

export const Title = styled.h1`
  font-size: 2.2rem;
  margin: 0;
  color: #222;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

export const Photographer = styled.p`
  font-size: 1.3rem;
  color: #555;
  margin: 0;
  font-weight: 500;
`;

export const ViewOnPexelsText = styled.p`
  font-size: 1.1rem;
  color: #777;
  margin: 0;
  
  a {
    color: #0066cc;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    
    &:hover {
      color: #004499;
      text-decoration: underline;
    }
  }
`;

export const GoBack = styled.button`
  padding: 12px 24px;
  background: #4a6cf7;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  align-self: flex-start;
  
  &:hover {
    background: #3451c6;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
  
  @media (max-width: 900px) {
    padding: 10px 20px;
    font-size: 1rem;
  }
`;

export const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.4rem;
  color: #555;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`; 