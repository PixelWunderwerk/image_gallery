import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import galleryRoutes from './routes/galleries';
import imageRoutes from './routes/images';
import path from 'path';

const app = express();
const port = process.env.PORT || 4000;

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/galleries', galleryRoutes);
app.use('/api/images', imageRoutes);

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});