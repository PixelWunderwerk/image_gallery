import React from 'react';
import { X } from 'lucide-react';

interface UploadProgress {
  filename: string;
  progress: number;
  error?: string;
}

interface ImageUploadProgressProps {
  uploads: UploadProgress[];
  onCancel: (filename: string) => void;
}

const ImageUploadProgress: React.FC<ImageUploadProgressProps> = ({ uploads, onCancel }) => {
  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg border">
      <div className="p-3 border-b">
        <h3 className="font-medium">Uploads ({uploads.length})</h3>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {uploads.map((upload) => (
          <div key={upload.filename} className="p-3 border-b last:border-b-0">
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm truncate flex-1 mr-2">
                {upload.filename}
              </div>
              <button
                onClick={() => onCancel(upload.filename)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {upload.error ? (
              <div className="text-red-600 text-sm">{upload.error}</div>
            ) : (
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${upload.progress}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploadProgress;