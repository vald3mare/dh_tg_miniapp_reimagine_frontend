import { defineConfig } from 'vite'
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: 'tma.internal',
    https: {
      cert: readFileSync(resolve('certs/tma.internal.pem')),
      key: readFileSync(resolve('certs/tma.internal-key.pem')),
    },
  },
  plugins: [react(), basicSsl()],
})