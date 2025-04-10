import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  const [gridScrollPosition, setGridScrollPositionState] = useState<number>(0);
  
  const setGridScrollPosition = (position: number) => {
    setGridScrollPositionState(position);
  };
  
  const resetScrollPosition = () => {
    setGridScrollPositionState(0);
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
