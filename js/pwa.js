/* Registers the offline shell, and keeps an open page up to date.
   A phone keeps a tab alive for days and shows it again without loading anything, so a person
   could go on seeing the site as it was before it was last published. Each published copy
   carries a build mark; when the page comes back into view it asks the server for the current
   mark, and if that differs it loads the new version. It never does this in the middle of a
   breath. The local copy carries no mark, so none of this runs there. */
(function () {
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { /* not available here */ }); });
  }
  var meta = document.querySelector('meta[name="build"]'), mine = meta && meta.content, last = 0;
  if (!mine || !window.fetch || !window.URL) return;
  function busy() { return /^#\/(practice|moment|first|measure)/.test(location.hash); }
  function check() {
    var now = Date.now();
    if (busy() || now - last < 30000) return;
    last = now;
    fetch('version.txt?t=' + now, { cache: 'no-store' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (v) {
      v = (v || '').trim();
      if (!v || v === mine || busy()) return;
      var u = new URL(location.href);
      u.searchParams.set('b', v);   // a new address, so that no kept copy of the page is used
      location.replace(u.toString());
    }).catch(function () { /* offline: stay as we are */ });
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); });
  window.addEventListener('pageshow', function (e) { if (e.persisted) check(); });
  window.addEventListener('focus', check);
  setTimeout(check, 3000);   // also soon after loading, in case the browser itself served a kept copy
})();
