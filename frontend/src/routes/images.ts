import express from 'express';
import { Pool } from 'pg';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const router = express.Router();
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Bild aktualisieren
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { attributes } = req.body;
  
  try {
    // Aktuelle Bildattribute abrufen
    const { rows: [currentImage] } = await db.query(
      'SELECT attributes FROM images WHERE id = $1',
      [id]
    );
    
    if (!currentImage) {
      return res.status(404).json({ error: 'Bild nicht gefunden' });
    }
    
    // Neue Attribute mit den vorhandenen technischen Attributen zusammenführen
    const updatedAttributes = {
      ...currentImage.attributes,
      ...attributes
    };
    
    // Bild aktualisieren
    const { rows } = await db.query(
      'UPDATE images SET attributes = $1 WHERE id = $2 RETURNING *',
      [JSON.stringify(updatedAttributes), id]
    );
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Bild löschen
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Bildinformationen abrufen
    const { rows } = await db.query(
      'SELECT filename FROM images WHERE id = $1',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bild nicht gefunden' });
    }
    
    // Datei aus dem Dateisystem löschen
    const filePath = path.join('uploads', rows[0].filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Bild aus der Datenbank löschen
    await db.query('DELETE FROM images WHERE id = $1', [id]);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Vorschaubild generieren
router.get('/:id/thumbnail', async (req, res) => {
  const { id } = req.params;
  const { width, height } = req.query;
  
  try {
    // Bildinformationen abrufen
    const { rows } = await db.query(
      'SELECT filename FROM images WHERE id = $1',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bild nicht gefunden' });
    }
    
    const filePath = path.join('uploads', rows[0].filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Bilddatei nicht gefunden' });
    }
    
    // Vorschaubild generieren
    const image = sharp(filePath);
    
    if (width || height) {
      image.resize(
        width ? parseInt(width as string) : null,
        height ? parseInt(height as string) : null,
        { fit: 'contain' }
      );
    }
    
    // Als WebP senden
    res.type('image/webp');
    image.webp().pipe(res);
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    res.status(500).json({ error: 'Fehler beim Generieren des Vorschaubildes' });
  }
});

// Batch-Update für Bilder
router.post('/batch-update', async (req, res) => {
  const { updates } = req.body;
  
  try {
    const results = [];
    
    for (const update of updates) {
      const { id, attributes } = update;
      
      const { rows } = await db.query(
        'UPDATE images SET attributes = attributes || $1 WHERE id = $2 RETURNING *',
        [JSON.stringify(attributes), id]
      );
      
      if (rows.length > 0) {
        results.push(rows[0]);
      }
    }
    
    res.json(results);
  } catch (error) {
    console.error('Error batch updating images:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Bilder' });
  }
});

export default router;