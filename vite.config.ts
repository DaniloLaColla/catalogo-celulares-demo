import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { extractAllImagesFromBackend } from './api/extract-photos';

// Plugin de desarrollo para simular la Serverless Function en localhost:3000/api/extract-photos
function apiExtractionPlugin(): Plugin {
  return {
    name: 'api-extraction-plugin',
    configureServer(server) {
      server.middlewares.use('/api/extract-photos', async (req, res) => {
        try {
          const urlObj = new URL(req.url || '', `http://${req.headers.host}`);
          const targetUrl = urlObj.searchParams.get('url');

          if (!targetUrl) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Falta el parámetro url.' }));
            return;
          }

          const images = await extractAllImagesFromBackend(targetUrl);

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, count: images.length, images }));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: err.message || 'Error al extraer fotos.' }));
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), apiExtractionPlugin()],
  server: {
    port: 3000,
    open: false,
    host: true
  }
});
