import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

const SCROLL_POSITION_KEY = 'picsart_grid_scroll_position';

interface ScrollContextType {
  gridScrollPosition: number;
  setGridScrollPosition: (position: number) => void;
  resetScrollPosition: () => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

interface ScrollProviderProps {
  children: ReactNode;
}

export const ScrollProvider: React.FC<ScrollProviderProps> = ({ children }) => {
  const [gridScrollPosition, setGridScrollPositionState] = useState<number>(() => {
    try {
      const storedPosition = localStorage.getItem(SCROLL_POSITION_KEY);
      return storedPosition ? parseInt(storedPosition, 10) : 0;
    } catch (e) {
      return 0;
    }
  });
  
  const setGridScrollPosition = (position: number) => {
    setGridScrollPositionState(position);
    try {
      localStorage.setItem(SCROLL_POSITION_KEY, position.toString());
    } catch (e) {
      console.error('Failed to save scroll position to localStorage', e);
    }
  };
  
  const resetScrollPosition = () => {
    setGridScrollPositionState(0);
    try {
      localStorage.removeItem(SCROLL_POSITION_KEY);
    } catch (e) {
      console.error('Failed to reset scroll position', e);
    }
  };

  return (
    <ScrollContext.Provider
      value={{
        gridScrollPosition,
        setGridScrollPosition,
        resetScrollPosition
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = (): ScrollContextType => {
  const context = useContext(ScrollContext);
  
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  
  return context;
}; 