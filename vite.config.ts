import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

function ensureCharsetFirstPlugin(): Plugin {
  return {
    name: 'ensure-charset-first',
    enforce: 'post',
    transformIndexHtml(html) {
      const cleaned = html.replace(/^\uFEFF/, '');
      const withoutCharset = cleaned.replace(/<meta\s+charset=["']?[^"'>\s]+["']?\s*\/?>\s*/gi, '');
      return withoutCharset.replace(/<head(\s[^>]*)?>\s*/i, '<head$1>\n    <meta charset="utf-8">\n    ');
    },
  };
}

function autoBuildVersionPlugin(buildId: string): Plugin {
  return {
    name: 'auto-build-version',
    transformIndexHtml(html) {
      return html.replace(/__ARKY_BUILD_VERSION__/g, buildId);
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ version: buildId, builtAt: new Date().toISOString() }, null, 2),
      });
    },
  };
}

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';
  const buildId = isBuild
    ? new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
    : 'dev';

  return {
    define: {
      __APP_VERSION__: JSON.stringify(buildId),
    },
    plugins: [
      react(),
      tailwindcss(),
      autoBuildVersionPlugin(buildId),
      ensureCharsetFirstPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          name: 'ArkyEdu: Platformă Interactivă TIC & Coding',
          short_name: 'ArkyEdu',
          description: 'Platformă educativă și interactivă de TIC pentru elevii de gimnaziu: Sisteme de calcul, Sisteme de Operare, Securitate Web, Arcade Retro și Dueluri 1v1.',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          orientation: 'any',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          navigateFallback: null,
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          globPatterns: ['assets/**/*.{js,css}', 'icon.svg', 'favicon.ico', 'apple-touch-icon.png', 'pwa-*.png'],
          globIgnores: ['**/assets/aistudio/**', '**/version.json'],
          runtimeCaching: [
            {
              urlPattern: /\/version\.json/,
              handler: 'NetworkOnly',
            },
            {
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'arky-pages-cache',
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 7,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          // Keep dev SW disabled so vite-plugin-pwa does not call import.meta.hot.send() before Vite 6 WS connects
          enabled: false,
          type: 'module',
        },
      }),
    ],
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('motion') || id.includes('framer-motion')) {
                return 'vendor-motion';
              }
              if (id.includes('react') || id.includes('scheduler')) {
                return 'vendor-react';
              }
            }
          },
        },
      },
    },
  };
});
