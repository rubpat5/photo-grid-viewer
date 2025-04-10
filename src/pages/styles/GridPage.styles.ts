import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  will-change: scroll-position;
`;

export const Grid = styled.div<{ height: number }>`
  position: relative;
  height: ${props => `${props.height}px`};
  width: 100%;
`;

export const PhotoLink = styled(Link)<{ transform: string; width: number; $aspectRatio: number; 'data-index'?: number }>`
  position: absolute;
  width: ${props => props.width}px;
  transform: ${props => props.transform};
  display: block;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
  will-change: transform;

  &:hover {
    z-index: 1;
    transform: ${props => props.transform} scale(1.02);
  }

  img {
    width: 100%;
    aspect-ratio: ${props => props.$aspectRatio};
    height: auto;
    display: block;
    background-color: #f0f0f0;
  }
`;

export const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
`;

export const PageWrapper = styled.div`
  height: 100vh;
  overflow: hidden;
`; 