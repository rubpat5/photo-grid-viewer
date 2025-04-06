import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GridPage from './pages/GridPage';
import DetailsPage from './pages/DetailsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GridPage />} />
        <Route path="/photo/:id" element={<DetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
