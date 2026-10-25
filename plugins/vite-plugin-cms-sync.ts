import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

export function vitePluginCmsSync(): Plugin {
  return {
    name: 'vite-plugin-cms-sync',
    configureServer(server) {
      const rootDir = server.config.root || process.cwd();
      const profilesDir = path.resolve(rootDir, 'src/profiles');
      const uploadsDir = path.resolve(rootDir, 'public/assets/uploads');

      // Ensure directories exist
      if (!fs.existsSync(profilesDir)) fs.mkdirSync(profilesDir, { recursive: true });
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      server.middlewares.use((req, res, next) => {
        const url = req.url || '';

        // 1. GET /api/cms/profiles - List all available profiles
        if (req.method === 'GET' && url === '/api/cms/profiles') {
          try {
            const files = fs.readdirSync(profilesDir).filter(f => f.endsWith('.json'));
            const list = files.map(filename => {
              const filePath = path.join(profilesDir, filename);
              const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
              return {
                id: content.id || filename.replace('.json', ''),
                filename,
                title: content.title || 'Untitled Profile',
                version: content.version || 'v1.0',
                status: content.status || 'draft',
                updatedAt: content.updatedAt || new Date().toISOString()
              };
            });

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, profiles: list }));
            return;
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
            return;
          }
        }

        // 2. POST /api/cms/profiles/save - Save or update profile JSON on disk
        if (req.method === 'POST' && url === '/api/cms/profiles/save') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const profile = JSON.parse(body);
              if (!profile || !profile.id) {
                throw new Error('Profile must contain an "id" field');
              }

              profile.updatedAt = new Date().toISOString();
              const safeId = profile.id.replace(/[^a-zA-Z0-9_-]/g, '_');
              const filePath = path.join(profilesDir, `${safeId}.json`);
              fs.writeFileSync(filePath, JSON.stringify(profile, null, 2), 'utf-8');

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: `Profile saved to ${filePath}`, profile }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        // 3. POST /api/cms/upload - Save asset to public/assets/uploads
        if (req.method === 'POST' && url === '/api/cms/upload') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const { filename, base64 } = data;
              if (!filename || !base64) {
                throw new Error('Upload requires filename and base64 string');
              }

              // Extract actual base64 content
              const cleanBase64 = base64.replace(/^data:([A-Za-z-+\/]+);base64,/, '');
              const buffer = Buffer.from(cleanBase64, 'base64');
              const cleanName = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
              const filePath = path.join(uploadsDir, cleanName);

              fs.writeFileSync(filePath, buffer);

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                url: `/assets/uploads/${cleanName}`,
                filename: cleanName
              }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}
