import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';

export default defineConfig({
  base: '/photo-grid-viewer/',
  plugins: [
    react(),
    splitVendorChunkPlugin()
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('react-router-dom')) {
              return 'vendor-router';
            }
            if (id.includes('styled-components')) {
              return 'vendor-styled';
            }
            return 'vendor';
          }
          if (id.includes('src/components') && id.match(/[\\/]components[\\/].*\.(js|jsx|ts|tsx)$/)) {
            const match = id.match(/[\\/]components[\\/](.*?)[\\/]/);
            if (match) {
              return `components-${match[1]}`;
            }
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    sourcemap: false,
    target: 'esnext',
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'styled-components'],
    exclude: []
  },
  esbuild: {
    treeShaking: true,
    target: 'esnext'
  }
}); 