/* Offline shell. Network first, so a newer version always wins when there is a connection;
   the cached copy is used only when there is none. Nothing is fetched from anywhere else. */
var CACHE = 'neshima-shell-6';
var SHELL = ['./', 'index.html', 'styles.css', 'landing.css', 'app.css', 'icon.svg', 'icon-192.png', 'icon-512.png', 'manifest.webmanifest',
  'fonts/fonts.css', 'fonts/FrankRuhlLibre-hebrew.woff2', 'fonts/FrankRuhlLibre-latin.woff2', 'fonts/NotoRashiHebrew-hebrew.woff2', 'fonts/NotoRashiHebrew-latin.woff2',
  'js/config.js', 'js/strings.js', 'js/brand.js', 'js/path.js', 'js/rite.js', 'js/leaves.js', 'js/final.js', 'js/breath.js', 'js/app.js', 'js/pwa.js'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) {
    var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); return r;
  }).catch(function () { return caches.match(e.request, { ignoreSearch: true }).then(function (m) { return m || caches.match('index.html'); }); }));
});
