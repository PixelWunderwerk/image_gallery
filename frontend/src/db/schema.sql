CREATE TABLE galleries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    attributes JSONB DEFAULT '[]'
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    gallery_id INTEGER REFERENCES galleries(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    attributes JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexe für bessere Performance
CREATE INDEX idx_images_gallery_id ON images(gallery_id);
CREATE INDEX idx_galleries_created_at ON galleries(created_at);
CREATE INDEX idx_images_created_at ON images(created_at);