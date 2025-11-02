// Critical polyfills that MUST run before any other code
(function() {
  'use strict';
  
  // Request polyfill
  if (typeof Request === 'undefined') {
    window.Request = function Request(input, init) {
      init = init || {};
      this.url = typeof input === 'string' ? input : (input && input.url) || String(input);
      this.method = (init.method || 'GET').toUpperCase();
      this.headers = init.headers || {};
      this.body = init.body || null;
      this.mode = init.mode || 'cors';
      this.credentials = init.credentials || 'same-origin';
    };
  }
  
  // Response polyfill
  if (typeof Response === 'undefined') {
    window.Response = function Response(body, init) {
      init = init || {};
      this.body = body;
      this.status = init.status || 200;
      this.statusText = init.statusText || 'OK';
      this.ok = this.status >= 200 && this.status < 300;
      this.headers = init.headers || {};
    };
  }
  
  // Headers polyfill
  if (typeof Headers === 'undefined') {
    window.Headers = function Headers(init) {
      this._headers = {};
      if (init) {
        for (var key in init) {
          if (init.hasOwnProperty(key)) {
            this._headers[key.toLowerCase()] = init[key];
          }
        }
      }
    };
    Headers.prototype.get = function(name) {
      return this._headers[name.toLowerCase()] || null;
    };
    Headers.prototype.set = function(name, value) {
      this._headers[name.toLowerCase()] = value;
    };
    Headers.prototype.append = function(name, value) {
      this._headers[name.toLowerCase()] = value;
    };
    Headers.prototype.has = function(name) {
      return name.toLowerCase() in this._headers;
    };
    Headers.prototype.delete = function(name) {
      delete this._headers[name.toLowerCase()];
    };
  }
  
  // Global polyfill
  if (typeof global === 'undefined') {
    window.global = window;
  }
  
  // Process polyfill
  if (typeof process === 'undefined') {
    window.process = {
      env: {},
      browser: true,
      version: '',
      versions: {},
      nextTick: function(fn) { setTimeout(fn, 0); }
    };
  }
})();
