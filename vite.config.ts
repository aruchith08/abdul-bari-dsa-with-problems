import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// Check if local fallback environment exists (for Windows virtual G: drive development)
const fallbackEnv = 'C:/Users/aruch/.arh_env/node_modules';
const hasFallback = fs.existsSync(fallbackEnv);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: hasFallback
      ? [
          { find: /^@firebase\/(.*)/, replacement: 'C:/Users/aruch/.arh_env/node_modules/@firebase/$1' },
          { find: /^firebase\/(.*)/, replacement: 'C:/Users/aruch/.arh_env/node_modules/firebase/$1' },
          { find: 'firebase', replacement: 'C:/Users/aruch/.arh_env/node_modules/firebase' },
        ]
      : [],
  },
  server: {
    fs: {
      allow: hasFallback ? ['..', fallbackEnv] : ['..'],
    },
  },
});
