import React, { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';

interface DragDropZoneProps {
  onDrop: (files: FileList) => void;
  className?: string;
}

const DragDropZone: React.FC<DragDropZoneProps> = ({ onDrop, className = '' }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      onDrop(e.dataTransfer.files);
    }
  }, [onDrop]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative ${className}`}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Upload className="w-12 h-12 mx-auto text-blue-500 mb-2" />
            <p className="text-lg text-blue-700">Bilder hier ablegen zum Hochladen</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DragDropZone;