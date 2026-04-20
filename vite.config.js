import { defineConfig } from 'vite'
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // server: {
  //   host: 'tma.internal',
  //   https: {
  //     cert: readFileSync(resolve('certs/tma.internal.pem')),
  //     key: readFileSync(resolve('certs/tma.internal-key.pem')),
  //   },
  // },
  plugins: [react(), basicSsl()],
  optimizeDeps: {
    include: ['@mui/icons-material'],
  },
  resolve: {
    alias: mode === 'profiling' ? {
      'react-dom/client': 'react-dom/profiling',
    } : {},
  },
  build: {
    minify: mode !== 'profiling',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['motion'],
          'vendor-mui':    ['@mui/icons-material', '@mui/material'],
        },
      },
    },
  },
}))