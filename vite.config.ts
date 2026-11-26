import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function localOrderApiPlugin(): Plugin {
  return {
    name: 'local-order-api',
    configureServer(server) {
      server.middlewares.use('/api/order', async (req, res) => {
        const env = loadEnv('development', process.cwd(), '');
        if (env.TELEGRAM_BOT_TOKEN) process.env.TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
        if (env.TELEGRAM_CHAT_ID) process.env.TELEGRAM_CHAT_ID = env.TELEGRAM_CHAT_ID;

        const { default: handler } = await import('./api/order.js');
        await handler(req, res);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localOrderApiPlugin()],
  base: '/',
});
