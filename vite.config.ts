import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

const saveMetadataPlugin = () => ({
  name: 'save-metadata',
  configureServer(server: any) {
    server.middlewares.use('/api/save-metadata', (req: any, res: any) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => body += chunk.toString());
        req.on('end', () => {
          try {
            const { index, data } = JSON.parse(body);
            const memesPath = path.resolve(__dirname, 'src/data/memes.ts');
            let content = fs.readFileSync(memesPath, 'utf-8');
            
            // Extract the metadata list
            const match = content.match(/const memeMetadataList = (\[[\s\S]*?\]);/);
            if (!match) throw new Error("Could not find memeMetadataList");
            
            // Safely evaluate the array
            const currentList = new Function('return ' + match[1])();
            
            // Update the item
            currentList[index] = data;
            
            // Reconstruct the array string
            const newListStr = JSON.stringify(currentList, null, 2).replace(/"([^"]+)":/g, '$1:');
            
            // Replace the old array
            content = content.replace(/const memeMetadataList = \[[\s\S]*?\];/, `const memeMetadataList = ${newListStr};`);
            
            fs.writeFileSync(memesPath, content);
            
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true }));
          } catch (e: any) {
            console.error('Failed to save metadata:', e);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      } else {
        res.statusCode = 404;
        res.end();
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    saveMetadataPlugin(),
  ],
  server: {
    proxy: {
      '/api/gdrive': {
        target: 'https://drive.usercontent.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gdrive/, '/download'),
      },
      '/api/r2': {
        target: 'https://pub-fed721a1f3e744b88927e20d43934fae.r2.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/r2/, ''),
      }
    }
  }
})
