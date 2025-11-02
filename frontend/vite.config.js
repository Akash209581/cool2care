import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin to inject polyfills at the very start
const injectPolyfills = () => {
  return {
    name: 'inject-polyfills',
    transformIndexHtml(html) {
      return html.replace(
        '<head>',
        `<head>
    <script>
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Inject polyfills at the START of every chunk
        banner: '(function(){if(typeof Request==="undefined"){window.Request=function(e,t){this.url=e;this.method=(t&&t.method)||"GET";this.headers=t&&t.headers||{};this.body=t&&t.body}};if(typeof Response==="undefined"){window.Response=function(e,t){this.body=e;this.status=(t&&t.status)||200;this.ok=this.status>=200&&this.status<300;this.json=function(){return Promise.resolve(JSON.parse(e))};this.text=function(){return Promise.resolve(e)}}};if(typeof Headers==="undefined"){window.Headers=function(e){this.map={};if(e){for(var t in e)this.map[t]=e[t]}};Headers.prototype.get=function(e){return this.map[e]};Headers.prototype.set=function(e,t){this.map[e]=t}};if(typeof global==="undefined"){window.global=window};if(typeof globalThis==="undefined"){window.globalThis=window};if(typeof process==="undefined"){window.process={env:{NODE_ENV:"production"}}}})();'
      }
    }
  },
  define: {
    'global': 'globalThis',
    'process.env': {}
  }
})
    </script>`
      );
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [injectPolyfills(), react()],
  server: {
    port: 3000,
    host: true,
    watch: {
      usePolling: true,
      interval: 1000,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    target: 'es2015',
    minify: 'esbuild',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
  define: {
    global: 'globalThis',
    'process.env': '{}',
    'process.browser': 'true',
  },
  base: '/',
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
})