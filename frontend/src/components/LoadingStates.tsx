import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

export const ImagePlaceholder: React.FC = () => (
  <div className="aspect-square bg-gray-100 rounded-lg animate-pulse"></div>
);

export const LoadingGrid: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <ImagePlaceholder />
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3"></div>
        </div>
      </div>
    ))}
  </div>
);

export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full p-4">
    <div className="text-red-600 text-lg mb-2">Ein Fehler ist aufgetreten</div>
    <div className="text-gray-600">{message}</div>
  </div>
);