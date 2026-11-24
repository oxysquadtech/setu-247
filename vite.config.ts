import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function backendApiPlugin(): Plugin {
  return {
    name: 'backend-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        try {
          const { apiRouter } = await import('./server/apiRouter.js');
          apiRouter(req as any, res as any, next);
        } catch (err) {
          console.error('[API Plugin Error]', err);
          next(err);
        }
      });
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
