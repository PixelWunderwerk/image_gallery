import React, { useState, useMemo } from 'react';
import { Image, Gallery } from '../types';
import ImageDetail from './ImageDetail';
import { Search, SortAsc, SortDesc } from 'lucide-react';

interface ImageGridProps {
  gallery: Gallery;
}

interface SortConfig {
  attribute: string;
  direction: 'asc' | 'desc';
}

const ImageGrid: React.FC<ImageGridProps> = ({ gallery }) => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    attribute: 'created_at', 
    direction: 'desc' 
  });
  const [filters, setFilters] = useState<Record<string, string>>({});

  const visibleAttributes = useMemo(() => 
    gallery.attributes.filter(attr => attr.isVisible),
    [gallery.attributes]
  );

  const filteredAndSortedImages = useMemo(() => {
    let result = [...(gallery.images || [])];

    // Filtering
    result = result.filter(image => {
      // Search across all attributes
      const searchMatch = Object.values(image.attributes)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Apply individual filters
      const filterMatch = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const imageValue = String(image.attributes[key] || '').toLowerCase();
        return imageValue.includes(value.toLowerCase());
      });

      return searchMatch && filterMatch;
    });

    // Sorting
    result.sort((a, b) => {
      const aValue = a.attributes[sortConfig.attribute] || '';
      const bValue = b.attributes[sortConfig.attribute] || '';

      if (sortConfig.direction === 'asc') {
        return String(aValue).localeCompare(String(bValue));
      } else {
        return String(bValue).localeCompare(String(aValue));
      }
    });

    return result;
  }, [gallery.images, searchTerm, filters, sortConfig]);

  const handleSort = (attribute: string) => {
    setSortConfig(current => ({
      attribute,
      direction: current.attribute === attribute && current.direction === 'asc' 
        ? 'desc' 
        : 'asc'
    }));
  };

  const handleFilterChange = (attribute: string, value: string) => {
    setFilters(current => ({
      ...current,
      [attribute]: value
    }));
  };

  return (
    <div className="p-4">
      {/* Search and Filter Bar */}
      <div className="mb-4 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4">
          {visibleAttributes.map(attr => (
            <div key={attr.id} className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                {attr.name}:
              </label>
              <input
                type="text"
                value={filters[attr.name] || ''}
                onChange={(e) => handleFilterChange(attr.name, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
                placeholder={`Filter ${attr.name}...`}
              />
              <button 
                onClick={() => handleSort(attr.name)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {sortConfig.attribute === attr.name ? (
                  sortConfig.direction === 'asc' ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  )
                ) : (
                  <SortAsc className="w-4 h-4 text-gray-300" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAndSortedImages.map((image) => (
          <div
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className="cursor-pointer group"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/${image.filename}`}
                alt=""
                className="object-cover w-full h-full group-hover:opacity-90 transition-opacity"
              />
            </div>
            <div className="mt-2 space-y-1">
              {visibleAttributes.map(attr => (
                <div key={attr.id} className="text-sm">
                  <span className="font-medium">{attr.name}:</span>{' '}
                  <span className="text-gray-600">
                    {image.attributes[attr.name] || '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <ImageDetail
          image={selectedImage}
          gallery={gallery}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default ImageGrid;