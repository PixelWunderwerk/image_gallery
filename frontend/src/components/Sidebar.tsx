import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGallery } from '../context/GalleryContext';
import { Dialog } from '@headlessui/react';
import { Plus } from 'lucide-react';
import axios from 'axios';

const Sidebar: React.FC = () => {
  const { galleries, loadGalleries } = useGallery();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGalleryName, setNewGalleryName] = useState('');
  const [newGalleryDescription, setNewGalleryDescription] = useState('');

  const handleCreateGallery = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/galleries`, {
        name: newGalleryName,
        description: newGalleryDescription
      });
      await loadGalleries();
      setIsCreateModalOpen(false);
      setNewGalleryName('');
      setNewGalleryDescription('');
    } catch (error) {
      console.error('Error creating gallery:', error);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Galerien</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {galleries.map((gallery) => (
          <button
            key={gallery.id}
            onClick={() => navigate(`/gallery/${gallery.id}`)}
            className="w-full text-left p-2 hover:bg-gray-100 rounded-md mb-1"
          >
            {gallery.name}
          </button>
        ))}
      </div>

      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="m-4 p-2 bg-blue-600 text-white rounded-md flex items-center justify-center"
      >
        <Plus className="w-4 h-4 mr-2" />
        Neue Galerie
      </button>

      <Dialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 w-96">
            <Dialog.Title className="text-lg font-medium mb-4">
              Neue Galerie erstellen
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={newGalleryName}
                  onChange={(e) => setNewGalleryName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Beschreibung
                </label>
                <textarea
                  value={newGalleryDescription}
                  onChange={(e) => setNewGalleryDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleCreateGallery}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Erstellen
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Sidebar;