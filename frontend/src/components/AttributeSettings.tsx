import React, { useState } from 'react';
import { Gallery, Attribute } from '../types';
import { useGallery } from '../context/GalleryContext';
import { Plus, GripVertical, X } from 'lucide-react';

interface AttributeSettingsProps {
  gallery: Gallery;
}

const AttributeSettings: React.FC<AttributeSettingsProps> = ({ gallery }) => {
  const { updateGalleryAttributes } = useGallery();
  const [attributes, setAttributes] = useState<Attribute[]>(gallery.attributes);
  const [newAttributeName, setNewAttributeName] = useState('');

  const handleVisibilityChange = (attributeId: string) => {
    setAttributes(current =>
      current.map(attr =>
        attr.id === attributeId
          ? { ...attr, isVisible: !attr.isVisible }
          : attr
      )
    );
  };

  const handleAddAttribute = () => {
    if (newAttributeName.trim()) {
      const newAttribute: Attribute = {
        id: Date.now().toString(),
        name: newAttributeName.trim(),
        type: 'text',
        isVisible: true
      };
      setAttributes(current => [...current, newAttribute]);
      setNewAttributeName('');
    }
  };

  const handleRemoveAttribute = (attributeId: string) => {
    setAttributes(current =>
      current.filter(attr => attr.id !== attributeId)
    );
  };

  const handleSave = async () => {
    await updateGalleryAttributes(gallery.id, attributes);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Attribute verwalten
        </h3>
        
        <div className="space-y-4">
          {attributes.map((attr, index) => (
            <div
              key={attr.id}
              className="flex items-center space-x-3 bg-white p-3 rounded-lg border"
            >
              <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
              
              <div className="flex-1">
                <input
                  type="text"
                  value={attr.name}
                  onChange={(e) => {
                    const newAttributes = [...attributes];
                    newAttributes[index] = {
                      ...attr,
                      name: e.target.value
                    };
                    setAttributes(newAttributes);
                  }}
                  className="w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <select
                value={attr.type}
                onChange={(e) => {
                  const newAttributes = [...attributes];
                  newAttributes[index] = {
                    ...attr,
                    type: e.target.value as Attribute['type']
                  };
                  setAttributes(newAttributes);
                }}
                className="border-gray-300 rounded-md shadow-sm"
              >
                <option value="text">Text</option>
                <option value="number">Nummer</option>
                <option value="date">Datum</option>
                <option value="tags">Tags</option>
              </select>

              <button
                onClick={() => handleVisibilityChange(attr.id)}
                className={`px-3 py-1 rounded-md text-sm ${
                  attr.isVisible
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {attr.isVisible ? 'Sichtbar' : 'Versteckt'}
              </button>

              <button
                onClick={() => handleRemoveAttribute(attr.id)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            value={newAttributeName}
            onChange={(e) => setNewAttributeName(e.target.value)}
            placeholder="Neues Attribut"
            className="flex-1 border-gray-300 rounded-md shadow-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddAttribute();
              }
            }}
          />
          <button
            onClick={handleAddAttribute}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Hinzufügen
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSave}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Änderungen speichern
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttributeSettings;