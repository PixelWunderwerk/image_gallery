import express from 'express';
import { Pool } from 'pg';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

const router = express.Router();
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Multer Konfiguration für Bildupload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Ungültiger Dateityp. Nur JPEG, PNG und WebP sind erlaubt.'));
    }
  }
});

// Galerien abrufen
router.get('/', async (req, res) => {
  try {
    const { rows: galleries } = await db.query(`
      SELECT g.*, 
             json_agg(
               json_build_object(
                 'id', i.id,
                 'filename', i.filename,
                 'attributes', i.attributes,
                 'created_at', i.created_at
               )
             ) FILTER (WHERE i.id IS NOT NULL) as images
      FROM galleries g
      LEFT JOIN images i ON g.id = i.gallery_id
      GROUP BY g.id
      ORDER BY g.created_at DESC
    `);
    
    res.json(galleries.map(gallery => ({
      ...gallery,
      images: gallery.images || []
    })));
  } catch (error) {
    console.error('Error fetching galleries:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Neue Galerie erstellen
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  
  try {
    const { rows } = await db.query(
      'INSERT INTO galleries (name, description, attributes) VALUES ($1, $2, $3) RETURNING *',
      [name, description, JSON.stringify([])]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating gallery:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Galerie aktualisieren
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, attributes } = req.body;
  
  try {
    const { rows } = await db.query(
      'UPDATE galleries SET name = COALESCE($1, name), description = COALESCE($2, description), attributes = COALESCE($3, attributes) WHERE id = $4 RETURNING *',
      [name, description, attributes ? JSON.stringify(attributes) : null, id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Galerie nicht gefunden' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating gallery:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Bilder zu Galerie hinzufügen
router.post('/:id/images', upload.array('images'), async (req, res) => {
  const { id } = req.params;
  const files = req.files as Express.Multer.File[];
  
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'Keine Bilder hochgeladen' });
  }

  try {
    const processedImages = [];
    
    for (const file of files) {
      // Bild verarbeiten und Metadaten extrahieren
      const imageInfo = await sharp(file.path).metadata();
      
      // Standardattribute für das Bild
      const attributes = {
        dimensions: `${imageInfo.width}x${imageInfo.height}`,
        size: file.size,
        originalName: file.originalname,
        mimeType: file.mimetype
      };

      // Bild in die Datenbank einfügen
      const { rows } = await db.query(
        'INSERT INTO images (gallery_id, filename, attributes) VALUES ($1, $2, $3) RETURNING *',
        [id, file.filename, JSON.stringify(attributes)]
      );
      
      processedImages.push(rows[0]);
    }
    
    res.status(201).json(processedImages);
  } catch (error) {
    console.error('Error uploading images:', error);
    // Bei Fehler die hochgeladenen Dateien wieder löschen
    files.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
    res.status(500).json({ error: 'Fehler beim Hochladen der Bilder' });
  }
});

export default router;