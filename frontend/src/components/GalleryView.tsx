import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGallery } from '../context/GalleryContext';
import ImageGrid from './ImageGrid';
import AttributeSettings from './AttributeSettings';
import { Settings } from 'lucide-react';

const GalleryView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { galleries, loadGalleries, uploadImages } = useGallery();
  const [showSettings, setShowSettings] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const gallery = galleries.find(g => g.id === Number(id));

  useEffect(() => {
    loadGalleries();
  }, [id, loadGalleries]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && gallery) {
      await uploadImages(gallery.id, e.dataTransfer.files);
    }
  };

  if (!gallery) {
    return <div>Galerie nicht gefunden</div>;
  }

  return (
    <div
      className="h-full"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{gallery.name}</h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="flex">
        <div className="flex-1">
          <ImageGrid gallery={gallery} />
        </div>
        
        {showSettings && (
          <div className="w-80 border-l border-gray-200 p-4">
            <AttributeSettings gallery={gallery} />
          </div>
        )}
      </div>

      {isDragging && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-10 pointer-events-none flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg">Bilder hier ablegen zum Hochladen</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryView;