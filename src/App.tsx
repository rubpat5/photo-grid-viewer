import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const GridPage = lazy(() => import('./pages/GridPage'));
const DetailsPage = lazy(() => import('./pages/DetailsPage'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<GridPage />} />
          <Route path="/photo/:id" element={<DetailsPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
