/* Save for offline. Pages a visitor opens are kept on the device; online visitors always get the newest copy first. */
var CACHE = 'mys-v1';
var CORE = ['./', 'site.css', 'site.js', 'data/manifest.json', 'favicon.ico', 'favicon-32.png', 'icon-192.png', 'app.webmanifest'];

function key(u) {
  var url = new URL(u, self.location.href);
  var p = url.pathname;
  if (/\/index\.html$/.test(p)) p = p.slice(0, -10) || '/';
  else if (/\.html$/.test(p)) p = p.slice(0, -5);
  return url.origin + p;
}
function clean(r) {
  /* A redirected response cannot answer a page request, so store a fresh copy of it. */
  if (!r.redirected) return Promise.resolve(r);
  return r.blob().then(function (b) { return new Response(b, { status: r.status, statusText: r.statusText, headers: r.headers }); });
}
function store(req, res) {
  if (!res || !res.ok || res.type === 'opaque') return Promise.resolve();
  return clean(res.clone()).then(function (c) { return caches.open(CACHE).then(function (cache) { return cache.put(key(req.url || req), c); }); });
}

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (cache) {
    return Promise.all(CORE.map(function (u) { return fetch(u).then(function (r) { return store(u, r); }).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  var page = req.mode === 'navigate' || (req.headers.get('accept') || '').indexOf('text/html') !== -1;
  if (page) {
    /* Pages: newest copy from the network, the saved copy when there is no signal. */
    e.respondWith(fetch(req).then(function (res) { store(req, res); return res; }).catch(function () {
      return caches.match(key(req.url)).then(function (hit) {
        return hit || new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Not saved yet</title><body style="font-family:Georgia,serif;max-width:34rem;margin:3rem auto;padding:0 1rem;color:#1b2630;background:#eef1f1"><h1>Not saved yet</h1><p>This page was not saved on this device, and there is no connection right now.</p><p><a href="./">Go to the home page</a> or go back to a page you have already opened.</p></body>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      });
    }));
    return;
  }
  /* Styles, scripts, data, and pictures: the saved copy at once, refreshed in the background. */
  e.respondWith(caches.match(key(req.url)).then(function (hit) {
    var net = fetch(req).then(function (res) { store(req, res); return res; });
    return hit || net;
  }));
});

/* "Save this book offline": the page sends a list of addresses, and each one is saved in turn. */
self.addEventListener('message', function (e) {
  var d = e.data || {};
  if (d.type !== 'save-list' || !d.urls) return;
  var urls = d.urls, done = 0, failed = 0, src = e.source;
  function tell() { if (src) src.postMessage({ type: 'save-progress', list: d.list, done: done, failed: failed, total: urls.length }); }
  var queue = urls.slice();
  function next() {
    var u = queue.shift();
    if (!u) return Promise.resolve();
    return fetch(u).then(function (r) { if (!r.ok) throw 0; return store(u, r); }).catch(function () { failed++; })
      .then(function () { done++; tell(); return next(); });
  }
  e.waitUntil(Promise.all([next(), next(), next(), next()]));
});
