// Comprehensive browser polyfills for deployment environments
(function() {
  'use strict';
  
  // Global object polyfill
  if (typeof global === 'undefined') {
    if (typeof globalThis !== 'undefined') {
      window.global = globalThis;
    } else {
      window.global = window;
    }
  }

  // Process object polyfill
  if (typeof process === 'undefined') {
    window.process = {
      env: {},
      browser: true,
      version: '',
      versions: { node: '16.0.0' },
      platform: 'browser',
      nextTick: function(fn) {
        setTimeout(fn, 0);
      },
      cwd: function() { return '/'; },
      chdir: function() {},
      umask: function() { return 0; }
    };
  }

  // Buffer polyfill
  if (typeof Buffer === 'undefined') {
    window.Buffer = {
      isBuffer: function() { return false; },
      from: function(data) { return new Uint8Array(data); }
    };
  }

  // Request polyfill with more complete implementation
  if (typeof Request === 'undefined') {
    window.Request = function Request(input, init) {
      init = init || {};
      this.url = typeof input === 'string' ? input : input.url;
      this.method = init.method || 'GET';
      this.headers = new Headers(init.headers || {});
      this.body = init.body || null;
      this.mode = init.mode || 'cors';
      this.credentials = init.credentials || 'same-origin';
      this.cache = init.cache || 'default';
      this.redirect = init.redirect || 'follow';
      this.referrer = init.referrer || '';
      this.referrerPolicy = init.referrerPolicy || '';
      this.integrity = init.integrity || '';
      this.keepalive = init.keepalive || false;
      this.signal = init.signal || null;
      
      // Methods
      this.clone = function() {
        return new Request(this.url, {
          method: this.method,
          headers: this.headers,
          body: this.body,
          mode: this.mode,
          credentials: this.credentials,
          cache: this.cache,
          redirect: this.redirect,
          referrer: this.referrer,
          referrerPolicy: this.referrerPolicy,
          integrity: this.integrity,
          keepalive: this.keepalive,
          signal: this.signal
        });
      };
    };
  }

  // Response polyfill with more complete implementation
  if (typeof Response === 'undefined') {
    window.Response = function Response(body, init) {
      init = init || {};
      this.body = body;
      this.status = init.status || 200;
      this.statusText = init.statusText || 'OK';
      this.headers = new Headers(init.headers || {});
      this.ok = this.status >= 200 && this.status < 300;
      this.redirected = false;
      this.type = 'default';
      this.url = '';
      
      // Methods
      this.clone = function() {
        return new Response(this.body, {
          status: this.status,
          statusText: this.statusText,
          headers: this.headers
        });
      };
      
      this.json = function() {
        return Promise.resolve(JSON.parse(this.body));
      };
      
      this.text = function() {
        return Promise.resolve(this.body);
      };
      
      this.blob = function() {
        return Promise.resolve(new Blob([this.body]));
      };
    };
  }

  // Headers polyfill
  if (typeof Headers === 'undefined') {
    window.Headers = function Headers(init) {
      this._headers = {};
      
      if (init) {
        if (typeof init.forEach === 'function') {
          init.forEach(function(value, name) {
            this.set(name, value);
          }, this);
        } else {
          Object.keys(init).forEach(function(name) {
            this.set(name, init[name]);
          }, this);
        }
      }
    };
    
    Headers.prototype.append = function(name, value) {
      this._headers[name.toLowerCase()] = value;
    };
    
    Headers.prototype.delete = function(name) {
      delete this._headers[name.toLowerCase()];
    };
    
    Headers.prototype.get = function(name) {
      return this._headers[name.toLowerCase()] || null;
    };
    
    Headers.prototype.has = function(name) {
      return name.toLowerCase() in this._headers;
    };
    
    Headers.prototype.set = function(name, value) {
      this._headers[name.toLowerCase()] = value;
    };
    
    Headers.prototype.forEach = function(callback, thisArg) {
      Object.keys(this._headers).forEach(function(name) {
        callback.call(thisArg, this._headers[name], name, this);
      }, this);
    };
  }

  // URL polyfill if needed
  if (typeof URL === 'undefined') {
    window.URL = function URL(url, base) {
      this.href = url;
      this.origin = '';
      this.protocol = '';
      this.hostname = '';
      this.port = '';
      this.pathname = '';
      this.search = '';
      this.hash = '';
    };
  }

  // URLSearchParams polyfill if needed
  if (typeof URLSearchParams === 'undefined') {
    window.URLSearchParams = function URLSearchParams(init) {
      this._params = {};
      
      if (typeof init === 'string') {
        init.split('&').forEach(function(pair) {
          var parts = pair.split('=');
          if (parts.length === 2) {
            this._params[parts[0]] = parts[1];
          }
        }, this);
      }
    };
    
    URLSearchParams.prototype.get = function(name) {
      return this._params[name] || null;
    };
    
    URLSearchParams.prototype.set = function(name, value) {
      this._params[name] = value;
    };
  }

  // Ensure fetch is available (basic implementation)
  if (typeof fetch === 'undefined') {
    window.fetch = function(url, options) {
      return Promise.reject(new Error('fetch is not available in this environment. Please use a fetch polyfill.'));
    };
  }

  // Node.js modules polyfills
  if (typeof module === 'undefined') {
    window.module = { exports: {} };
  }
  
  if (typeof exports === 'undefined') {
    window.exports = {};
  }

  // Console polyfill for older environments
  if (typeof console === 'undefined') {
    window.console = {
      log: function() {},
      error: function() {},
      warn: function() {},
      info: function() {},
      debug: function() {}
    };
  }

})();