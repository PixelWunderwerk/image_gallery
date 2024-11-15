import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { Gallery, Attribute } from '../types';

interface GalleryContextType {
  galleries: Gallery[];
  currentGallery: Gallery | null;
  loadGalleries: () => Promise<void>;
  setCurrentGallery: (gallery: Gallery | null) => void;
  updateGalleryAttributes: (galleryId: number, attributes: Attribute[]) => Promise<void>;
  uploadImages: (galleryId: number, files: FileList) => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [currentGallery, setCurrentGallery] = useState<Gallery | null>(null);

  const loadGalleries = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/galleries`);
      setGalleries(response.data);
    } catch (error) {
      console.error('Error loading galleries:', error);
    }
  }, []);

  const updateGalleryAttributes = useCallback(async (galleryId: number, attributes: Attribute[]) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/galleries/${galleryId}`, { attributes });
      await loadGalleries();
    } catch (error) {
      console.error('Error updating gallery attributes:', error);
    }
  }, [loadGalleries]);

  const uploadImages = useCallback(async (galleryId: number, files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/galleries/${galleryId}/images`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      await loadGalleries();
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  }, [loadGalleries]);

  return (
    <GalleryContext.Provider value={{
      galleries,
      currentGallery,
      loadGalleries,
      setCurrentGallery,
      updateGalleryAttributes,
      uploadImages
    }}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};