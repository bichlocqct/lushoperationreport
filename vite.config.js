import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-report-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.method === 'POST' && req.url === '/api/save-report') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const { fileName, htmlContent } = JSON.parse(body);
                if (!fileName || !htmlContent) {
                  throw new Error('Missing fileName or htmlContent');
                }
                const reportsDir = path.resolve(__dirname, 'reports');
                if (!fs.existsSync(reportsDir)) {
                  fs.mkdirSync(reportsDir, { recursive: true });
                }
                const filePath = path.join(reportsDir, fileName);
                fs.writeFileSync(filePath, htmlContent, 'utf-8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, path: `reports/${fileName}` }));
              } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
})
