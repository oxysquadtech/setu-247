import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiRouter } from './apiRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 5000;

app.use(cors());

// Mount API router under /api
app.use('/api', apiRouter);

// Serve static frontend in production if built
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      res.status(200).send('Setu247 Backend Server is running. Frontend dist not built yet.');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Setu247 Server] API running on http://localhost:${PORT}/api/health`);
  console.log(`[Setu247 Server] Notifications configured for oxysquadtechnologies@gmail.com`);
});
