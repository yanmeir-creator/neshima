/* Registers the offline shell. Works only over https or on localhost. */
(function () {
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { /* not available here */ }); });
  }
})();
