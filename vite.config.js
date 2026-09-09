import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      {
        name: 'api-chat-dev-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url && req.url.startsWith('/api/chat')) {
              try {
                const { default: handler } = await import('./api/chat.js');
                const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
                req.query = Object.fromEntries(url.searchParams.entries());

                res.status = (code) => {
                  res.statusCode = code;
                  return res;
                };
                res.json = (data) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                };

                if (req.method === 'POST') {
                  let body = '';
                  req.on('data', (chunk) => { body += chunk; });
                  req.on('end', async () => {
                    try {
                      req.body = body ? JSON.parse(body) : {};
                    } catch {
                      req.body = {};
                    }
                    await handler(req, res);
                  });
                  return;
                } else {
                  req.body = {};
                  await handler(req, res);
                  return;
                }
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message }));
                return;
              }
            }
            next();
          });
        },
      },
    ],
  };
});
