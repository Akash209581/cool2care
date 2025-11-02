// Browser polyfills for deployment environments
if (typeof global === 'undefined') {
  var global = globalThis;
}

if (typeof process === 'undefined') {
  var process = {
    env: {},
    browser: true,
    version: '',
    versions: {},
    platform: 'browser',
    nextTick: function(fn) {
      setTimeout(fn, 0);
    }
  };
}

// Mock Request and Response for environments that don't have them
if (typeof Request === 'undefined') {
  global.Request = function Request(input, init) {
    this.url = input;
    this.method = (init && init.method) || 'GET';
    this.headers = (init && init.headers) || {};
    this.body = (init && init.body) || null;
  };
}

if (typeof Response === 'undefined') {
  global.Response = function Response(body, init) {
    this.body = body;
    this.status = (init && init.status) || 200;
    this.statusText = (init && init.statusText) || 'OK';
    this.headers = (init && init.headers) || {};
    this.ok = this.status >= 200 && this.status < 300;
  };
}

// Ensure fetch is available
if (typeof fetch === 'undefined') {
  global.fetch = function() {
    throw new Error('fetch is not available in this environment');
  };
}