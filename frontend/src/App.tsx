import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import GalleryView from './components/GalleryView';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/gallery/:id" element={<GalleryView />} />
            <Route path="/" element={<div className="p-4">Wählen Sie eine Galerie aus</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;