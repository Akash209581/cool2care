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
      (function(){if(typeof Request==="undefined"){window.Request=function(i,o){o=o||{};this.url=typeof i==="string"?i:(i&&i.url)||String(i);this.method=(o.method||"GET").toUpperCase();this.headers=o.headers||{};this.body=o.body||null;};window.Response=function(b,o){o=o||{};this.body=b;this.status=o.status||200;this.ok=this.status>=200&&this.status<300;this.headers=o.headers||{};};window.Headers=function(i){this._h={};if(i){for(var k in i)this._h[k.toLowerCase()]=i[k]}};Headers.prototype.get=function(n){return this._h[n.toLowerCase()]||null};Headers.prototype.set=function(n,v){this._h[n.toLowerCase()]=v};}if(typeof global==="undefined"){window.global=window;}if(typeof process==="undefined"){window.process={env:{},browser:true};}})();
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