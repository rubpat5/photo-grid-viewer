import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PhotosProvider } from './context/PhotosContext';
import { ScrollProvider } from './context/ScrollContext';

const GridPage = lazy(() => import('./pages/GridPage'));
const DetailsPage = lazy(() => import('./pages/DetailsPage'));

function App() {
  return (
    <BrowserRouter>
      <PhotosProvider>
        <ScrollProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<GridPage />} />
              <Route path="/photo/:id" element={<DetailsPage />} />
            </Routes>
          </Suspense>
        </ScrollProvider>
      </PhotosProvider>
    </BrowserRouter>
  );
}

export default App;
