import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import { apiRouter } from './server/apiRouter.js';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function backendApiPlugin(): Plugin {
  return {
    name: 'backend-api-plugin',
    configureServer(server) {
      const app = express();
      app.use('/api', apiRouter);
      server.middlewares.use(app);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    backendApiPlugin(),
  ],
  server: {
    port: 3000,
    host: true,
  },
});
