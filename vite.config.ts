import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';
import { join } from 'path';

// Copy PDF.js worker to public folder during build
const copyPDFWorker = () => {
  return {
    name: 'copy-pdf-worker',
    buildStart() {
      try {
        const workerSource = join(process.cwd(), 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs');
        const workerDest = join(process.cwd(), 'public', 'pdf.worker.min.mjs');
        copyFileSync(workerSource, workerDest);
        console.log('✓ Copied PDF.js worker to public folder');
      } catch (error) {
        console.warn('⚠ Could not copy PDF.js worker:', error);
      }
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyPDFWorker()],
  build: {
    // Copy public directory as-is
    copyPublicDir: true,
    // Use esnext for better WASM support (still good for other things)
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('browser-image-compression')) {
              return 'lib-compression';
            }
            if (id.includes('heic2any')) {
              return 'lib-heic';
            }
            if (id.includes('@mediapipe')) {
              return 'lib-mediapipe';
            }
            // Image libs will be auto-split since they are dynamic imports
            if (id.includes('jspdf') || id.includes('pdf-lib') || id.includes('pdfjs-dist')) {
              return 'vendor-pdf';
            }
            // Other node_modules
            return 'vendor';
          }
          // Page chunks for code splitting
          if (id.includes('/pages/')) {
            const pageName = id.split('/pages/')[1].split('.')[0];
            return `page-${pageName}`;
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild', // Using esbuild (built-in) instead of terser
    cssCodeSplit: true,
    sourcemap: false,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [
      'browser-image-compression',
      'heic2any',
      'file-saver',
      'jspdf',
      'pdf-lib',
      'pdfjs-dist',
      'react',
      'react-dom',
      'react-router-dom',
      'pako',
      'fast-png',
    ],
  },
  server: {
    fs: {
      strict: false,
    },
  },
  resolve: {
    alias: {
      pako: 'pako/dist/pako.js',
    },
  },
});

