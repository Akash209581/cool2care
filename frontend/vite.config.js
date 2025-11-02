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

// Plugin to create a standalone polyfill script file
const createPolyfillPlugin = () => {
  return {
    name: 'create-polyfill',
    transformIndexHtml: {
      enforce: 'pre',
      transform(html) {
        // Inject polyfill script tag BEFORE any other scripts
        // Use a blocking synchronous script to ensure polyfills load first
        const polyfillScript = '<script>' +
          '(function() {' +
          'if (typeof Request === "undefined") {' +
          'window.Request = function(url, options) {' +
          'this.url = url;' +
          'this.method = (options && options.method) || "GET";' +
          'this.headers = (options && options.headers) || {};' +
          'this.body = options && options.body;' +
          '};' +
          '}' +
          'if (typeof Response === "undefined") {' +
          'window.Response = function(body, options) {' +
          'this.body = body;' +
          'this.status = (options && options.status) || 200;' +
          'this.ok = this.status >= 200 && this.status < 300;' +
          'this.json = function() { return Promise.resolve(JSON.parse(body)); };' +
          'this.text = function() { return Promise.resolve(body); };' +
          '};' +
          '}' +
          'if (typeof Headers === "undefined") {' +
          'window.Headers = function(init) {' +
          'this.map = {};' +
          'if (init) {' +
          'for (var key in init) {' +
          'this.map[key] = init[key];' +
          '}' +
          '}' +
          '};' +
          'Headers.prototype.get = function(name) { return this.map[name]; };' +
          'Headers.prototype.set = function(name, value) { this.map[name] = value; };' +
          '}' +
          'if (typeof global === "undefined") {' +
          'window.global = window;' +
          '}' +
          'if (typeof globalThis === "undefined") {' +
          'window.globalThis = window;' +
          '}' +
          'if (typeof process === "undefined") {' +
          'window.process = { env: { NODE_ENV: "production" } };' +
          '}' +
          '})();' +
          '<' + '/script>';
        
        // Replace <head> with <head> + polyfill script
        return html.replace('<head>', '<head>' + polyfillScript);
      }
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createPolyfillPlugin(),
    react()
  ],
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