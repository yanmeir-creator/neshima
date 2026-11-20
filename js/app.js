/* HADVA / חדוה (working name) — app shell, screens and local-first state.
   No accounts, no analytics, no network requests. Everything lives in localStorage. */
(function () {
  'use strict';

  var STR = window.NESHIMA_STRINGS, CFG = window.NESHIMA_CONFIG || {}, B = window.NeshimaBreath;
  var KEY = 'neshima.v1', DAYS = 14, PER_DAY = 3, TOTAL = DAYS * PER_DAY, MIN_LOG = 30;
  // The word is the breath: each letter is a phase, its value is the count.
  var LETTERS = [['ח', 8, 'in'], ['ד', 4, 'linger'], ['ו', 6, 'out'], ['ה', 5, 'rest']];
  var LETTER_OF = { in: 'ח', linger: 'ד', out: 'ו', rest: 'ה' };
  var main = document.getElementById('main'), top = document.getElementById('top'), toastEl = document.getElementById('toast');
  var invitedBy = '';
  var invitedWord = '';
  try { var qs0 = new URLSearchParams(location.search); invitedBy = (qs0.get('from') || '').trim().slice(0, 24); invitedWord = (qs0.get('w') || '').trim().slice(0, 140); } catch (e) { /* old browser */ }

  /* ---------- State ---------- */
  function fresh() {
    return {
      v: 1,
      lang: (navigator.language || 'en').toLowerCase().indexOf('he') === 0 ? 'he' : 'en',
      settings: { sound: 'guide', cue: false, motion: 'system', large: false, rhythm: CFG.offerHadvaRhythm === false ? 'inout' : 'hadva', unit: 0.5, breaths: 7, gateSound: true, level: '', measured: 0, snd2: true },
      challenge: null,          // { start: 'YYYY-MM-DD', times: ['07:30', ...], on: [true, ...] }
      sessions: [],             // { d, t, kind: 'full'|'moment', secs, feel? }
      reflection: '',           // private; never leaves the device unless the person exports it
      team: { note: '', agg: false, pub: false, name: '' },
      inviteName: '',
      chain: 0,                 // hands the leaf passed through before reaching this device (carried in the link)
      from: '',                 // the name it came from, if the link carried one
      fromWord: '',             // the sentence that person chose to send with it
      vavs: 0,                  // times this person passed it on from here
      testimony: '',            // one sentence the person chooses to put on the leaf they pass on
      lastSeen: null
    };
  }
  var state = load();
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return fresh();
      var s = JSON.parse(raw), f = fresh();
      for (var k in f) if (!(k in s)) s[k] = f[k];
      var old = !('snd2' in s.settings);
      for (var j in f.settings) if (!(j in s.settings)) s.settings[j] = f.settings[j];
      if (old) s.settings.gateSound = true;
      if (CFG.offerHadvaRhythm === false && s.settings.rhythm === 'hadva') s.settings.rhythm = 'inout';
      return s;
    } catch (e) { return fresh(); }
  }
  // The chain of hesed lives only in the link: ?n= is the number of hands so far, ?from= a name.
  // A new visitor adopts it once; nothing is sent anywhere.
  (function () {
    try {
      var n = parseInt(new URLSearchParams(location.search).get('n'), 10) || 0;
      n = Math.max(0, Math.min(999, n)); if (invitedBy && !n) n = 1;
      if (n && !state.sessions.length && !state.vavs) { state.chain = n; state.from = invitedBy; state.fromWord = invitedWord; setTimeout(save, 0); }
    } catch (e) { /* old browser */ }
    if (!invitedBy) invitedBy = state.from || '';
    if (!invitedWord) invitedWord = state.fromWord || '';
  })();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable: keep working in memory */ } }
  function t() { return STR[state.lang]; }

  /* ---------- Helpers ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dateKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseKey(k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function diffDays(a, b) { return Math.round((new Date(a.getFullYear(), a.getMonth(), a.getDate()) - new Date(b.getFullYear(), b.getMonth(), b.getDate())) / 864e5); }
  function clock(sec) { sec = Math.max(0, Math.ceil(sec)); return Math.floor(sec / 60) + ':' + pad(sec % 60); }
  function reducedMotion() {
    var m = state.settings.motion;
    if (m === 'reduced') return true;
    if (m === 'full') return false;
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function siteUrl() {
    if (CFG.siteUrl) return CFG.siteUrl;
    return /^https?:$/.test(location.protocol) ? location.origin + location.pathname : '';
  }
  function inviteUrl() {
    var u = siteUrl(), n = state.inviteName.trim();
    var w = (state.testimony || '').trim().slice(0, 140);
    return u ? u + '?n=' + ((state.chain || 0) + 1) + (n ? '&from=' + encodeURIComponent(n) : '') + (w ? '&w=' + encodeURIComponent(w) : '') : u;
  }
  function waUrl() { return 'https://wa.me/?text=' + encodeURIComponent(shareMessage());
  }
  var toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 4200);
  }
  function download(name, mime, text) {
    var url = URL.createObjectURL(text instanceof Blob ? text : new Blob([text], { type: mime }));
    var a = document.createElement('a'); a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  function countable(s) { return s.kind !== 'moment'; }
  function sessionsOn(key) { return state.sessions.filter(function (s) { return s.d === key && countable(s); }).length; }
  function challengeDay() { return state.challenge ? diffDays(new Date(), parseKey(state.challenge.start)) + 1 : 0; }
  // Per-day counts for the fourteen days (capped at three), or today's count alone before the challenge starts.
  function dayCounts() {
    var out = [], start = state.challenge ? parseKey(state.challenge.start) : new Date();
    for (var i = 0; i < DAYS; i++) out.push(state.challenge || i === 0 ? Math.min(sessionsOn(dateKey(addDays(start, i))), PER_DAY) : 0);
    return out;
  }
  function stats() {
    var c = dayCounts(), total = 0, days = 0;
    c.forEach(function (n) { total += n; if (n) days++; });
    return { counts: c, total: total, days: days };
  }
  function seg(name, opts, current, label) {
    return '<div class="seg" role="group" aria-label="' + esc(label) + '">' + opts.map(function (o) {
      return '<button type="button" data-set="' + name + ':' + o[0] + '" aria-pressed="' + (String(current) === String(o[0])) + '">' + esc(o[1]) + '</button>';
    }).join('') + '</div>';
  }
  function wordmark(cls) {
    return '<div class="word ' + cls + '" dir="rtl" lang="he" aria-hidden="true">' + LETTERS.map(function (l) {
      return '<span class="lt lt-' + l[2] + '"><b>' + l[0] + '</b><i>' + l[1] + '</i></span>';
    }).join('') + '</div>';
  }

  /* ---------- The seal: 14 days x 3 pauses = 42 points on a wheel ---------- */
  function dayColor(i) { // saffron -> coral -> rose across the fourteen days
    var stops = [[124, 35, 19], [96, 26, 14], [52, 24, 12]], x = i / (DAYS - 1) * 2, a = Math.min(1, Math.floor(x)), f = x - a;
    return 'rgb(' + stops[a].map(function (v, k) { return Math.round(v + (stops[a + 1][k] - v) * f); }).join(',') + ')';
  }
  function sealPoint(i, j, cx, cy, scale) {
    var ang = (i / DAYS * 360 - 90 + 360 / DAYS / 2) * Math.PI / 180, r = (86 + j * 23) * scale;
    return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
  }
  function sealSvg(counts, todayIdx, label, total) {
    var dots = '';
    for (var i = 0; i < DAYS; i++) for (var j = 0; j < PER_DAY; j++) {
      var p = sealPoint(i, j, 160, 160, 1), on = j < counts[i];
      dots += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (on ? 8.5 : 6) + '" class="' + (on ? 'sd on' : 'sd') + (i === todayIdx ? ' now' : '') + '"' + (on ? ' fill="' + dayColor(i) + '"' : '') + '/>';
    }
    return '<svg class="seal" viewBox="0 0 320 320" role="img" aria-label="' + esc(label) + '"><g filter="url(#ink)">' +
      '<circle class="seal-ring" cx="160" cy="160" r="62"/><circle class="seal-ring" cx="160" cy="160" r="152"/>' + dots + '</g>' +
      '<text class="seal-n" x="160" y="168" text-anchor="middle">' + total + '</text>' +
      '<text class="seal-of" x="160" y="192" text-anchor="middle">/ ' + TOTAL + '</text></svg>';
  }

  /* ---------- Chrome ---------- */
  function applyPrefs() {
    var s = t(), h = document.documentElement;
    h.lang = state.lang; h.dir = s.dir;
    h.dataset.motion = reducedMotion() ? 'reduced' : 'full';
    h.dataset.large = state.settings.large ? '1' : '0';
    document.getElementById('skip').textContent = s.skip;
  }
  function renderTop(route) {
    var s = t(), inSession = route === '/practice' || route === '/moment' || route === '/gate' || route === '/hesed' || route === '/invite' || route === '/measure' || route === '/length' || route === '/challenge' || (route === '/' && !state.challenge);
    top.hidden = inSession;
    top.innerHTML =
      '<a class="brand" href="#/" aria-label="NESHIMA — ' + esc(s.home) + '"><span class="brand-he" lang="he" dir="rtl">נשימה</span><span class="brand-en">NESHIMA</span></a>' +
      '<button type="button" class="lang" data-act="lang" lang="' + s.switchLang + '">' + esc(s.switchTo) + '</button>';
  }

  /* ---------- Views ---------- */
  var views = {};
  views['/'] = function () { return state.challenge ? homeView() : landingView(); };

  function footLinks() {
    var s = t();
    return '<nav class="foot" aria-label="' + esc(s.home) + '">' +
      '<button type="button" class="linkish" data-act="enter">' + esc(s.pathLink) + '</button>' +
      '<a href="#/sources">' + esc(s.sourcesLink) + '</a>' +
      '<a href="#/share">' + esc(s.shareLink) + '</a>' +
      '<a href="#/settings">' + esc(s.settingsLink) + '</a></nav>';
  }
  function startHref() { return state.sessions.some(countable) ? null : '#/intro'; } // first time goes through the safety note

  /* ---------- Manuscript diagrams ---------- */
  // The tree of the ten sefirot, as drawn in old ilanot. The seven lower ones are the seven gates.
  var SEF = [['כתר', 100, 24], ['חכמה', 160, 64], ['בינה', 40, 64], ['חסד', 160, 124], ['גבורה', 40, 124], ['תפארת', 100, 154], ['נצח', 160, 214], ['הוד', 40, 214], ['יסוד', 100, 244], ['מלכות', 100, 292]];
  var SEF_PATHS = [[0, 1], [0, 2], [0, 5], [1, 2], [1, 3], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5], [3, 6], [4, 5], [4, 7], [5, 6], [5, 7], [5, 8], [6, 7], [6, 8], [6, 9], [7, 8], [7, 9], [8, 9]];
  function treeSvg(step) {
    var lines = SEF_PATHS.map(function (p) { return '<line x1="' + SEF[p[0]][1] + '" y1="' + SEF[p[0]][2] + '" x2="' + SEF[p[1]][1] + '" y2="' + SEF[p[1]][2] + '"/>'; }).join('');
    var nodes = SEF.map(function (s, i) {
      var g = i - 3, cls = i < 3 ? 'hid' : g < step ? 'past' : g === step ? 'here' : '';
      return '<g class="' + cls + '"><circle cx="' + s[1] + '" cy="' + s[2] + '" r="19"/><text x="' + s[1] + '" y="' + (s[2] + 3.4) + '">' + s[0] + '</text></g>';
    }).join('');
    return '<svg class="tree" viewBox="-4 0 208 316" aria-hidden="true" lang="he"><g filter="url(#ink)">' + lines + nodes + '</g></svg>';
  }
  // Verses written in rings, as scribes wrote them around the circles of a diagram.
  var RING_1 = 'נעוץ סופן בתחלתן ותחלתן בסופן כשלהבת קשורה בגחלת ✦ ויפח באפיו נשמת חיים ויהי האדם לנפש חיה ✦ ';
  var RING_2 = 'כל הנשמה תהלל ✦ על כל נשימה ונשימה ✦ והאנחה הוא אריכת הנשימה ✦ ';
  function circlePath(r) { return 'M150,150 m-' + r + ',0 a' + r + ',' + r + ' 0 1,1 ' + (2 * r) + ',0 a' + r + ',' + r + ' 0 1,1 -' + (2 * r) + ',0'; }
  function ringsSvg(eyeWord, prog) {
    var rays = '';
    for (var a = 0; a < 360; a += 15) { var c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); rays += '<line class="ray" x1="' + (150 + 84 * c).toFixed(1) + '" y1="' + (150 + 84 * s).toFixed(1) + '" x2="' + (150 + 92 * c).toFixed(1) + '" y2="' + (150 + 92 * s).toFixed(1) + '"/>'; }
    return '<svg class="rings" viewBox="0 0 300 300" aria-hidden="true" lang="he">' +
      '<defs><path id="rp1" d="' + circlePath(131) + '"/><path id="rp2" d="' + circlePath(107) + '"/></defs>' +
      '<g filter="url(#ink)"><circle cx="150" cy="150" r="146"/><circle class="thin" cx="150" cy="150" r="142"/><circle cx="150" cy="150" r="122"/><circle cx="150" cy="150" r="98"/><circle class="thin" cx="150" cy="150" r="94"/>' + rays + '</g>' +
      '<g class="turn"><text class="ring-t" direction="rtl"><textPath href="#rp1" startOffset="100%" textLength="816" lengthAdjust="spacing">' + RING_1 + RING_1 + '</textPath></text></g>' +
      '<g class="turn back"><text class="ring-t" direction="rtl"><textPath href="#rp2" startOffset="100%" textLength="666" lengthAdjust="spacing">' + RING_2 + '</textPath></text></g>' +
      (eyeWord ? '<g filter="url(#ink)"><path class="lid" d="M72 150 Q150 92 228 150 Q150 208 72 150 Z"/><path class="lid thin" d="M80 150 Q150 102 220 150 Q150 198 80 150 Z"/><circle class="iris" cx="150" cy="150" r="40"/><circle class="pupil" cx="150" cy="150" r="33"/></g><text class="eye-word"' + (prog ? ' id="eyeWord"' : '') + ' x="150" y="157">' + eyeWord + '</text>' : '') +
      (prog ? '<circle class="prog" id="prog" cx="150" cy="150" r="146" pathLength="100" stroke-dasharray="0 100" transform="rotate(-90 150 150)"/>' : '') +
      '</svg>';
  }

  // Rows of ringed signs, in the manner of the charaktêres of old amulets and magical notebooks.
  // They are generated at random from a seed: decoration only. They are not copied from any
  // manuscript, spell no name, and mean nothing.
  function signs(seed, rows, per) {
    var x = seed * 9301 + 49297;
    function rnd() { x = (x * 9301 + 49297) % 233280; return x / 233280; }
    var W = 22, H = 30, out = '';
    for (var r = 0; r < rows; r++) for (var c = 0; c < per; c++) {
      var ox = c * W + 4, oy = r * H + 4, strokes = 1 + Math.floor(rnd() * 2.4), g = '';
      for (var k = 0; k < strokes; k++) {
        var n = 2 + Math.floor(rnd() * 3), pts = [];
        for (var i = 0; i < n; i++) pts.push([ox + Math.round(rnd() * 2) * 7, oy + Math.round(rnd() * 3) * 7]);
        g += '<polyline points="' + pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' ') + '"/>';
        [pts[0], pts[n - 1]].forEach(function (p) { if (rnd() < 0.82) g += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.1"/>'; });
      }
      if (rnd() < 0.16) g += '<rect x="' + (ox + 2) + '" y="' + (oy + 6) + '" width="10" height="10"/>';
      out += g;
    }
    return '<svg class="signs" viewBox="0 0 ' + (per * W + 4) + ' ' + (rows * H) + '" aria-hidden="true"><g filter="url(#ink)">' + out + '</g></svg>';
  }

  /* ---------- The rite: threshold, seven gates opened by hand, the whisper ---------- */
  var gateStep = 0, gateCtl = null, gateAuto = false;   // gateAuto: the rite has been set going; gates start by themselves
  try { gateStep = Math.max(0, Math.min(4, parseInt(sessionStorage.getItem('hadva.gate'), 10) || 0)); } catch (e) { /* private mode */ }
  // The title page of an old book is itself called a gate (sha'ar): pediment above, plinth below.
  function pediment() {
    return '<svg class="pediment" viewBox="0 0 300 80" aria-hidden="true" lang="he"><g filter="url(#ink)">' +
      '<path d="M12 58 L150 8 L288 58 Z"/><path class="thin" d="M32 55 L150 16 L268 55 Z"/>' +
      '<path class="thin" d="M128 41 Q150 27 172 41 Q150 55 128 41 Z"/><circle cx="150" cy="41" r="8"/><circle class="dot" cx="150" cy="41" r="3.2"/>' +
      '<path d="M4 58 H296 M4 78 H296 M4 58 V78 M296 58 V78"/>' +
      '<path class="thin" d="M12 58 q-10 -3 -9 -12 q2 -7 9 -4 M288 58 q10 -3 9 -12 q-2 -7 -9 -4"/></g>' +
      '<text x="150" y="72" text-anchor="middle" direction="rtl">' + esc(t().portalVerse) + '</text></svg>';
  }
  function plinth() {
    return '<svg class="plinth" viewBox="0 0 300 30" aria-hidden="true"><g filter="url(#ink)"><path d="M8 4 H292 M8 4 V12 M292 4 V12 M2 12 H298 M2 12 V26 M298 12 V26 M2 26 H298"/><path class="thin" d="M14 8 H286 M10 19 H290"/></g></svg>';
  }
  /* ---------- The ilan: every screen is a station on one old tree-scroll ----------
     Stations are double circles; a double line (the channel) joins them; small script runs
     round the circles; the one red thing on a leaf is what is alive now. There are no
     buttons, only stations. The foot of each leaf carries a catchword, as old books did:
     the first word of the leaf that follows. */
  var MICRO_1 = 'נעוץ סופן בתחלתן ותחלתן בסופן כשלהבת קשורה בגחלת · ויפח באפיו נשמת חיים ויהי האדם לנפש חיה · ';
  var MICRO_2 = 'על כל נשימה ונשימה · והאנחה הוא אריכת הנשימה · כל הנשמה תהלל · ';
  function ringPath(id, cx, cy, r) { return '<path id="' + id + '" d="M' + (cx - r) + ' ' + cy + ' a' + r + ' ' + r + ' 0 1 1 ' + (2 * r) + ' 0 a' + r + ' ' + r + ' 0 1 1 -' + (2 * r) + ' 0"/>'; }
  function micro(id, r, txt, size) { return '<text class="micro" direction="rtl" font-size="' + size + '"><textPath href="#' + id + '" startOffset="100%" textLength="' + Math.round(2 * Math.PI * r - 6) + '" lengthAdjust="spacing">' + txt + '</textPath></text>'; }
  function folio(n) { return '<p class="folio">' + esc(t().folio(n)) + '</p>'; }
  function catchword(w) { return '<p class="catch" aria-hidden="true">' + esc(w) + '</p>'; }
  function chan(cls) { return '<i class="chan' + (cls ? ' ' + cls : '') + '" aria-hidden="true"></i>'; }
  function eyeIlan() {
    var s = t();
    return '<svg class="ilan eye" viewBox="0 0 390 360" aria-hidden="true" lang="he"><defs>' + ringPath('em1', 195, 116, 100) + ringPath('em2', 195, 116, 87) + '</defs>' +
      '<g class="il" filter="url(#ink)"><path d="M120 194 L74 282 M125 197 L79 285 M270 194 L316 282 M265 197 L311 285"/>' +
      '<circle class="thick" cx="195" cy="116" r="112"/><circle class="thin" cx="195" cy="116" r="106"/><circle cx="195" cy="116" r="78"/>' +
      '<path class="thick paperfill" d="M124 116 Q195 50 266 116 Q195 182 124 116 Z"/>' +
      '<path class="hatch thin" d="M124 116 Q160 86 195 83 A33 33 0 0 0 195 149 Q160 146 124 116 Z M266 116 Q230 86 195 83 A33 33 0 0 1 195 149 Q230 146 266 116 Z"/>' +
      '<circle class="paperfill" cx="195" cy="116" r="33"/><circle class="thin" cx="195" cy="116" r="26"/><circle class="solid" cx="195" cy="116" r="9"/>' +
      '<circle cx="66" cy="316" r="36"/><circle class="thin" cx="66" cy="316" r="31"/><circle cx="324" cy="316" r="36"/><circle class="thin" cx="324" cy="316" r="31"/></g>' +
      micro('em1', 100, MICRO_1 + MICRO_1, 8.5) + micro('em2', 87, MICRO_2 + MICRO_2, 7.5) +
      '<text class="rashi" x="66" y="322" text-anchor="middle">' + esc(s.cueOut) + '</text><text class="rashi" x="324" y="322" text-anchor="middle">' + esc(s.cueIn) + '</text></svg>';
  }
  function gateNode(k, letter) {
    return '<svg class="ilan gnode" viewBox="0 0 300 300" aria-hidden="true" lang="he"><defs>' + ringPath('gm' + k, 150, 150, 126) + '</defs>' +
      '<g class="il" filter="url(#ink)"><circle class="thick paperfill" cx="150" cy="150" r="146"/><circle class="thin" cx="150" cy="150" r="138"/><circle cx="150" cy="150" r="112"/></g>' +
      micro('gm' + k, 126, MICRO_1 + MICRO_1, 9.5) +
      '<text class="eye-letter" x="150" y="200" text-anchor="middle">' + letter + '</text>' +
      '<circle class="prog" cx="150" cy="150" r="146" pathLength="100" stroke-dasharray="0 100" transform="rotate(-90 150 150)"/></svg>';
  }
  function wordNodes() {
    var s = t(), labs = [s.cueIn, s.cueLinger, s.cueOut, s.cueRest];
    return '<div class="wordnodes" dir="rtl" lang="he">' + LETTERS.map(function (l, i) { return '<span class="wn"><b>' + l[0] + '</b><i>' + l[1] + '</i><em lang="' + state.lang + '">' + esc(labs[i]) + '</em></span>'; }).join('') + '</div>';
  }
  // The opening leaf is the book's title page: where the visitor has arrived, what is kept
  // here, the dare, the terms, and one station that opens it.
  // The wheel: rings of small script, the twenty-two letters with their numbers, and an ember
  // at the centre that breathes in the proportion 8 · 4 · 6 · 5. The four letters of the
  // rhythm are the only red ones. Nothing here is explained on the page.
  var ALEF = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'];
  var GEM = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400];
  function wheelSvg(p, rich) {
    var tk = '', cells = '', lt = '', nm = '', i, a, hot;
    for (i = 0; i < 72; i++) tk += '<line x1="300" y1="' + (i % 3 ? 13 : 10) + '" x2="300" y2="20" transform="rotate(' + i * 5 + ' 300 300)"/>';
    for (i = 0; i < 22; i++) {
      a = i * 360 / 22; hot = 'חדוה'.indexOf(ALEF[i]) >= 0 ? ' hot' : '';
      cells += '<line x1="300" y1="92" x2="300" y2="172" transform="rotate(' + (a + 180 / 22).toFixed(2) + ' 300 300)"/>';
      lt += '<text class="wl' + hot + '" x="300" y="131" transform="rotate(' + a.toFixed(2) + ' 300 300)">' + ALEF[i] + '</text>';
      nm += '<text class="wg' + hot + '" x="300" y="164" transform="rotate(' + a.toFixed(2) + ' 300 300)">' + GEM[i] + '</text>';
    }
    return '<svg class="wheel" viewBox="0 0 600 600" aria-hidden="true" lang="he"><defs>' +
      '<linearGradient id="' + p + 'g" x1="0" y1="0" x2="600" y2="600" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3dfae"/><stop offset=".5" stop-color="#c39a52"/><stop offset="1" stop-color="#7d5b28"/></linearGradient>' +
      '<radialGradient id="' + p + 'e"><stop offset="0" stop-color="#ffd09a"/><stop offset=".25" stop-color="#ef7a3c"/><stop offset=".6" stop-color="#a02c14" stop-opacity=".75"/><stop offset="1" stop-color="#5a1206" stop-opacity="0"/></radialGradient>' +
      (rich ? ringPath(p + 'a', 300, 300, 257) + ringPath(p + 'b', 300, 300, 224) : '') + '</defs>' +
      '<g fill="none" stroke="url(#' + p + 'g)"><circle cx="300" cy="300" r="290" stroke-width="2.2"/><circle cx="300" cy="300" r="280" stroke-width=".8"/><g stroke-width="1">' + tk + '</g>' +
        '<circle cx="300" cy="300" r="246" stroke-width=".8"/><circle cx="300" cy="300" r="212" stroke-width="1.6"/><circle cx="300" cy="300" r="208" stroke-width=".6"/>' +
        '<g stroke-width=".7">' + cells + '</g><circle cx="300" cy="300" r="152" stroke-width=".7"/><circle cx="300" cy="300" r="128" stroke-width="1.6"/><circle cx="300" cy="300" r="122" stroke-width=".6"/></g>' +
      (rich ? '<g class="w-spin"><text class="w-micro" direction="rtl" font-size="13"><textPath href="#' + p + 'a" startOffset="100%" textLength="' + Math.round(2 * Math.PI * 257 - 8) + '" lengthAdjust="spacing">' + MICRO_1 + MICRO_1 + MICRO_2 + '</textPath></text></g>' +
        '<g class="w-spin back"><text class="w-micro" direction="rtl" font-size="12"><textPath href="#' + p + 'b" startOffset="100%" textLength="' + Math.round(2 * Math.PI * 224 - 8) + '" lengthAdjust="spacing">' + MICRO_2 + MICRO_2 + MICRO_1 + '</textPath></text></g>' : '') +
      '<g class="w-letters" text-anchor="middle">' + lt + nm + '</g>' +
      '<circle class="w-ember" cx="300" cy="300" r="96" fill="url(#' + p + 'e)"/>' +
      '<g fill="none" stroke="url(#' + p + 'g)"><path d="M204 300 Q300 226 396 300 Q300 374 204 300 Z" stroke-width="1.8" fill="#0b0806" fill-opacity=".5"/><circle cx="300" cy="300" r="40" stroke-width="1.4"/><circle cx="300" cy="300" r="31" stroke-width=".7"/></g>' +
      '<circle cx="300" cy="300" r="12" fill="#f6e3b6"/></svg>';
  }
  function icoSvg(k) {
    var g = 'fill="none" stroke="#c9a35a" stroke-width="1.6" stroke-linecap="round"', body;
    if (k === 0) body = '<path d="M60 16 L94 38 L94 72 L60 92 L26 72 L26 38 Z M60 16 V108 M26 38 L94 72 M94 38 L26 72"/>' +
      [[60, 16], [94, 38], [26, 38], [94, 72], [26, 72], [60, 55], [60, 92], [60, 108]].map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="7" fill="#0f0b08"/>'; }).join('');
    else if (k === 1) body = '<path d="M6 60 C12 60 14 52 20 52 S28 68 34 68 S42 40 50 40 S58 80 66 80 S74 24 84 24 S94 96 104 96 S110 60 114 60"/><path d="M6 108 H114" stroke-width=".8"/><circle cx="84" cy="24" r="4" fill="#e8603a" stroke="none"/>';
    else body = '<circle cx="60" cy="60" r="6" fill="#e8603a" stroke="none"/><circle cx="60" cy="60" r="18"/><circle cx="60" cy="60" r="30" opacity=".75"/><circle cx="60" cy="60" r="42" opacity=".5"/><circle cx="60" cy="60" r="54" opacity=".28"/>';
    return '<svg class="ico" viewBox="0 0 120 120" aria-hidden="true"><g ' + g + '>' + body + '</g></svg>';
  }
  // The opening makes the case before anyone is asked to walk the gates: where you are, what
  // is offered, three witnesses, what the fourteen days ask, the kindness, and the gate.
  function thresholdView() {
    var s = t(), L = s.land, rtl = s.dir === 'rtl', inv = invitedBy || state.chain;
    var marks = rtl ? ['א', 'ב', 'ג', 'ד'] : ['I', 'II', 'III', 'IV'];
    function cta(txt, cls) { return '<button type="button" class="cta' + (cls ? ' ' + cls : '') + '" data-act="enter"><span>' + esc(txt) + '</span><i aria-hidden="true">' + (rtl ? '←' : '→') + '</i></button>'; }
    function head(n, tag, h) { return '<p class="sec-num" aria-hidden="true">' + n + '</p><div class="sec-head"><p class="sec-tag rv">' + esc(tag) + '</p><h2 class="sec-h rv">' + esc(h) + '</h2></div>'; }
    var terms = '<p class="terms2">' + L.terms.map(esc).join('<i aria-hidden="true">·</i>') + '</p>';
    return '<section class="land" id="land">' +
      '<nav class="spine" id="spine" aria-label="' + esc(s.home) + '">' + L.spine.map(function (n, i) { return '<button type="button" data-jump="l' + i + '" aria-label="' + esc(n) + '"><span>' + esc(n) + '</span></button>'; }).join('') + '</nav>' +
      '<div class="lsec hero" id="l0"><div class="hero-wheel" aria-hidden="true">' + wheelSvg('hw', true) + '</div><div class="hero-txt">' +
        (inv ? '<div class="hero-inv"><p>' + esc(s.invitedBy(invitedBy, state.chain)) + '</p>' + (invitedWord ? '<blockquote>' + esc('״' + invitedWord + '״') + '</blockquote>' : '') + '</div>' : '') +
        '<p class="kicker2">' + esc(L.kicker) + '</p>' +
        '<h1 class="hero-h" tabindex="-1"><span>' + esc(L.h1a) + '</span><span class="gold">' + esc(L.h1b) + '</span></h1>' +
        '<p class="hero-sub">' + esc(L.sub) + '</p>' +
        '<div class="hero-act">' + cta(L.cta) + '<button type="button" class="why" data-jump="l1">' + esc(L.why) + ' <i aria-hidden="true">↓</i></button></div>' + terms +
      '</div></div>' +
      '<div class="lsec about" id="l1">' + head(marks[0], L.s1tag, L.s1h) + '<div class="about-p">' + L.s1p.map(function (p) { return '<p class="rv">' + esc(p) + '</p>'; }).join('') + '</div></div>' +
      '<div class="lsec why-sec" id="l2">' + head(marks[1], L.s2tag, L.s2h) + '<p class="sec-sub rv">' + esc(L.s2sub) + '</p>' +
        '<div class="pillars">' + L.pillars.map(function (P, i) {
          return '<article class="pillar rv">' + icoSvg(i) + '<p class="p-tag">' + esc(P.tag) + '</p><h3>' + esc(P.h) + '</h3>' +
            (P.q ? '<blockquote lang="he" dir="rtl">' + esc(P.q) + '</blockquote>' : '') +
            (P.stat ? '<p class="p-stat"><b>' + esc(P.stat) + '</b><span>' + esc(P.statL) + '</span></p>' : '') +
            '<p class="p-body">' + esc(P.p) + '</p><p class="p-cite">' + esc(P.c) + '</p></article>';
        }).join('') + '</div>' +
        '<p class="sec-foot rv"><b>' + esc(L.s2foot) + '</b><a href="#/sources">' + esc(L.s2more) + '</a></p><div class="mid-cta rv">' + cta(L.cta) + '</div></div>' +
      '<div class="lsec chal-sec" id="l3">' + head(marks[2], L.s3tag, L.s3h) + '<p class="sec-sub rv">' + esc(L.s3sub) + '</p>' +
        '<ol class="steps">' + L.steps.map(function (st, i) { return '<li class="rv"><b aria-hidden="true">' + (rtl ? marks[i] : i + 1) + '</b><h3>' + esc(st[0]) + '</h3><p>' + esc(st[1]) + '</p></li>'; }).join('') + '</ol></div>' +
      '<div class="lsec hesed-sec" id="l4">' + head(marks[3], L.s4tag, L.s4h) + '<p class="sec-sub wide rv">' + esc(L.s4p) + '</p>' +
        '<p class="vavline rv" lang="he" dir="rtl" aria-hidden="true"><i>ו</i><i>ו</i><i>ו</i><i>ו</i><i class="me">ו</i></p></div>' +
      '<div class="lsec final" id="l5"><div class="final-wheel" aria-hidden="true">' + wheelSvg('fw', false) + '</div>' +
        '<p class="final-h rv"><span>' + esc(L.s5a) + '</span> <span class="red">' + esc(L.s5b) + '</span></p>' +
        '<div class="rv">' + cta(L.cta2, 'big') + '</div>' + terms +
        '<p class="fine2">' + esc(L.fine) + '</p>' +
        '<nav class="land-links"><a href="#/sources">' + esc(s.srcTitle) + '</a><button type="button" class="linkish" data-act="skipGate">' + esc(s.thSkip) + '</button><button type="button" class="linkish" data-act="lang" lang="' + s.switchLang + '">' + esc(s.switchTo) + '</button></nav></div>' +
      '<div class="stick" id="stick">' + cta(L.cta) + '</div></section>';
  }
  function startLanding() {
    var land = document.getElementById('land'), secs = land.querySelectorAll('.lsec'), spine = document.getElementById('spine').children, stick = document.getElementById('stick');
    var rv = land.querySelectorAll('.rv'), io = null, alive = true, i;
    if ('IntersectionObserver' in window && !reducedMotion()) {
      io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      for (i = 0; i < rv.length; i++) io.observe(rv[i]);
    } else for (i = 0; i < rv.length; i++) rv[i].classList.add('in');
    function onScroll() {
      if (!alive) return;
      var mid = window.innerHeight * 0.5, cur = 0, k;
      for (k = 0; k < secs.length; k++) if (secs[k].getBoundingClientRect().top <= mid) cur = k;
      for (k = 0; k < spine.length; k++) spine[k].classList.toggle('on', k === cur);
      stick.classList.toggle('on', window.scrollY > window.innerHeight * 0.7 && cur < secs.length - 1);
    }
    land.addEventListener('click', function (e) {
      var j = e.target.closest('[data-jump]'); if (!j) return;
      var el = document.getElementById(j.dataset.jump); if (el) el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    });
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    gateCtl = { stop: function () { alive = false; window.removeEventListener('scroll', onScroll); if (io) io.disconnect(); } };
  }
  views['/gate'] = function () {
    var s = t(), g = s.gates[gateStep];
    if (g.spell) {
      // The naming of the whisper: the four stations that were gathered, their numbers, one action.
      return '<section class="gate leaf is-spell">' +
        '<div class="leafhead">' + folio(6) + '</div>' +
        '<h1 class="gate-label" tabindex="-1">' + esc(g.label) + '</h1>' +
        '<p class="line">' + esc(g.lines[0]) + '</p>' +
        wordNodes() +
        '<p class="names">' + esc(g.after[0]) + '</p>' +
        '<p class="lead">' + esc(g.after[1]) + '</p>' +
        '<p class="line">' + esc(g.after[2]) + '</p>' +
        '<p class="glossline">' + esc(g.safety) + '</p>' +
        chan('dash') +
        '<button type="button" class="node" data-act="spell">' + esc(state.challenge ? g.cta : s.next) + '</button>' +
        '<nav class="margin links"><a href="#/sources">' + esc(s.whence) + '</a><a href="#/intro">' + esc(s.tune) + '</a></nav>' +
        catchword(state.challenge ? s.cueIn : s.measT) + '</section>';
    }
    // Each gate is a leaf, and one touch turns it. (Gates that advanced by themselves were
    // tried twice and did not hold up on a real phone.)
    var n = 0, items = g.items.map(function (it) {
      var c = ' shown rise" data-i="' + (n++);
      if (it[0] === 'names') return '<p class="v names' + c + '" lang="he" dir="rtl">' + esc(it[1]) + '</p>' + (it[2] ? '<p class="v gloss shown">' + esc(it[2]) + '</p>' : '');
      if (it[0] === 'verse') return '<blockquote class="v verse' + c + '"><span lang="he" dir="rtl">' + esc(it[1]) + '</span><cite>' + esc(it[2]) + '</cite></blockquote>';
      if (it[0] === 'huge') return '<p class="v huge' + c + '">' + esc(it[1]) + '</p>';
      return '<p class="v line' + c + '">' + esc(it[1]) + '</p>';
    }).join('');
    return '<section class="gate leaf gpage g' + gateStep + '">' +
      '<div class="leafhead">' + folio(2 + gateStep) + '</div>' +
      '<p class="slots stations" dir="rtl" lang="he" aria-hidden="true">' + LETTERS.map(function (l, j) { return '<span class="' + (j < gateStep ? 'in' : j === gateStep ? 'live' : '') + '">' + (j <= gateStep ? l[0] : '') + '</span>'; }).join('') + '</p>' +
      chan('short') +
      '<h1 class="gate-label" tabindex="-1">' + esc(g.label) + '</h1>' + (g.gloss ? '<p class="gate-gloss">' + esc(g.gloss) + '</p>' : '') +
      '<div class="veiled">' + items + '</div>' + chan() +
      '<button type="button" class="node" data-act="deeper">' + esc(s.next) + '</button>' +
      catchword(s.gates[gateStep + 1].label) + '</section>';
  };
  function startDescent() {
    var s = t(), sec = document.getElementById('gate'), alive = true, raf = 0, timer = 0, started = false;
    document.documentElement.style.setProperty('--light', '1');
    function box(i) { return sec.querySelector('.dgate[data-i="' + i + '"]'); }
    // No scrolling: the four gates sit on one tall track inside a fixed frame, and the track
    // slides. The darkness is one layer whose strength follows the gate.
    var DARK = [0, 0.3, 0.62, 0.92], tap = null;
    function place(i) { sec.style.setProperty('--at', String(i)); sec.style.setProperty('--dk', String(DARK[i])); }
    function run(i) {
      gateStep = i; try { sessionStorage.setItem('hadva.gate', String(i)); } catch (e) { /* private mode */ }
      // Gate one is also the measure. Its lines are read first; then the in-breath begins on the
      // cue and one touch marks its end. An eighth of that in-breath is the person's unit, and
      // the three gates that follow already move at their pace (a little shorter, growing).
      var b = box(i), measuring = i === 0, PRE = measuring ? 3.4 : 0, tin = null;
      var U = measuring ? 0.45 : Math.min(state.settings.unit, 0.5) * [1, 0.8, 0.9, 1][i];
      var IN = 8 * U, LIN = 4 * U, OUT = 6 * U, REST = 5 * U, ALL = IN + LIN + OUT + REST, DWELL = 0.8;
      function fix(sec, keep) {
        tin = sec; U = Math.max(0.35, Math.min(0.8, sec / 8));
        IN = 8 * U; LIN = 4 * U; OUT = 6 * U; REST = 5 * U; ALL = IN + LIN + OUT + REST;
        var set = state.settings; if (keep) { set.unit = Math.round(U * 1000) / 1000; set.measured = Math.round(sec * 10) / 10; }
        if (!set.level) set.level = 'nefesh'; save();
      }
      tap = measuring ? function () { var sec = (performance.now() - t0) / 1000 - PRE; if (tin === null && sec > 1.2) fix(sec, true); } : null;
      var prog = b.querySelector('.prog'), hint = b.querySelector('.gate-hint'), eye = b.querySelector('.eye-letter'), vs = b.querySelectorAll('.v');
      var cue = '', inked = false, t0 = performance.now();
      b.classList.add('holding'); b.querySelector('.sealbtn').classList.remove('teach');
      if (state.settings.gateSound) B.sound.droneStart();
      function show(n) { for (var j = 0; j < vs.length; j++) vs[j].classList.toggle('shown', j < n); }
      function say(key) { if (cue !== key) { cue = key; hint.textContent = s[key]; b.dataset.phase = key; eye.textContent = EYE[key]; } }
      function ring(e, lv) { prog.setAttribute('stroke-dasharray', (Math.min(1, e / ALL) * 100).toFixed(1) + ' 100'); B.sound.droneLevel(lv); }
      function ink() {   // the station keeps its letter, and every station below now carries it
        if (inked) return; inked = true; eye.textContent = LETTERS[i][0]; b.classList.add('done'); delete b.dataset.phase;
        var all = sec.querySelectorAll('.dgate');
        for (var n = i; n < all.length; n++) { var sp = all[n].querySelectorAll('.slots span')[i]; if (sp) { sp.textContent = LETTERS[i][0]; sp.classList.remove('live'); sp.classList.add('in'); if (n === i) sp.classList.add('fresh'); } }
      }
      function tick(now) {
        if (!alive) return;
        var e = (now - t0) / 1000 - PRE;
        if (e < 0) { show(Math.ceil((e + PRE) / PRE * vs.length)); if (cue !== 'ready') { cue = 'ready'; hint.textContent = s.measReady; b.dataset.phase = 'ready'; } raf = requestAnimationFrame(tick); return; }
        if (measuring && tin === null) {
          // the ring creeps toward the mark of a full in-breath and waits there for the touch
          if (cue !== 'meas') { cue = 'meas'; hint.textContent = s.measNow; b.dataset.phase = 'meas'; eye.textContent = EYE.cueIn; show(vs.length); }
          prog.setAttribute('stroke-dasharray', ((8 / 23) * (1 - Math.exp(-e / 2.6)) * 100).toFixed(1) + ' 100'); B.sound.droneLevel(Math.min(1, e / 4));
          if (e > 10) fix(3.6, false);
          raf = requestAnimationFrame(tick); return;
        }
        if (measuring) e = IN + (e - tin);
        if (e < IN) { var p = e / IN; say('cueIn'); ring(e, p); show(Math.ceil(p * vs.length)); }
        else if (e < IN + LIN) { say('cueLinger'); ring(e, 1); show(vs.length); }
        else if (e < IN + LIN + OUT) { say('cueOut'); ring(e, 1 - (e - IN - LIN) / OUT); }
        else if (e < ALL) { say('cueRest'); ring(e, 0); }
        else if (e < ALL + DWELL) { ring(ALL, 0); hint.textContent = ''; ink(); }
        else {
          B.sound.droneStop();
          tap = null;
          if (i < 3) { place(i + 1); timer = setTimeout(function () { if (alive) run(i + 1); }, 1250); }
          else { sec.classList.add('opening'); timer = setTimeout(function () { if (alive) acts.deeper(); }, 900); }
          return;
        }
        raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
    }
    function begin() { if (started || !alive) return; started = true; gateAuto = true; run(gateStep); }
    place(gateStep);
    sec.addEventListener('click', function (e) { if (!e.target.closest('.sealbtn')) return; if (!started) begin(); else if (tap) tap(); });
    timer = setTimeout(function () {
      if (!alive) return;
      if (gateAuto) timer = setTimeout(begin, 900);
    }, 60);
    gateCtl = { stop: function () { alive = false; cancelAnimationFrame(raf); clearTimeout(timer); B.sound.droneStop(); } };
  }
  function slots(done) {
    return '<p class="slots stations" dir="rtl" lang="he" aria-hidden="true">' + LETTERS.map(function (l, i) { return '<span class="' + (i < done ? 'in' : i === done ? 'live' : '') + '">' + (i < done ? l[0] : '') + '</span>'; }).join('') + '</p>';
  }
  function soundChip() {
    var s = t(), on = !!state.settings.gateSound;
    return '<button type="button" class="linkish bypass" data-act="gateSound" aria-pressed="' + on + '">' + esc(on ? s.soundOn : s.soundOff) + '</button>';
  }
  // A gate opens to one breath. The red ring closes once over the whole breath (in 8, linger 4,
  // out 6, rest 5 — the proportion of the whisper) while the writing inks in, and the next gate
  // then begins by itself: "Open" on the threshold is the only touch. The eye still answers a
  // touch when the page is entered mid-way (after a reload). Each breath is a little longer
  // than the last.
  var GATE_UNITS = [0.3, 0.33, 0.36, 0.4];
  var EYE = { cueIn: 'ח', cueLinger: 'ד', cueOut: 'ו', cueRest: 'ה' };
  function startGate() {
    var s = t(), U = GATE_UNITS[Math.min(gateStep, 3)];
    var IN = 8 * U, LIN = 4 * U, OUT = 6 * U, REST = 5 * U, DWELL = 2, ALL = IN + LIN + OUT + REST;
    var btn = document.getElementById('sealBtn'), prog = document.getElementById('prog'), cnt = document.getElementById('gCount'), hint = document.getElementById('gHint');
    var eye = document.getElementById('eyeWord'), inked = false;
    var vs = document.querySelectorAll('#veiled .v'), root = document.documentElement, sec = document.getElementById('gate');
    var mode = 'idle', t0 = 0, raf = 0, alive = true, cue = '';
    function light(v) { root.style.setProperty('--light', v.toFixed(3)); }
    function show(k) { for (var i = 0; i < vs.length; i++) vs[i].classList.toggle('shown', i < k); }
    function say(k) { if (cue !== k) { cue = k; hint.textContent = s[k]; sec.dataset.phase = k; eye.textContent = EYE[k]; } }
    function inkSlot() {
      if (inked) return; inked = true; eye.textContent = '';
      var sl = document.querySelectorAll('.slots span')[gateStep];
      if (sl) { sl.textContent = LETTERS[gateStep][0]; sl.classList.add('in', 'fresh'); }
    }
    function ring(e, b) { prog.setAttribute('stroke-dasharray', (Math.min(1, e / ALL) * 100).toFixed(1) + ' 100'); B.sound.droneLevel(b); }
    function num() { /* the letters in the eye count the breath; no numerals */ }
    function tick(now) {
      if (!alive) return;
      var e = (now - t0) / 1000;
      if (e < IN) { var p = e / IN; say('cueIn'); ring(e, p); num(e, 8); show(Math.ceil(p * vs.length)); light(0.22 + 0.78 * p); }
      else if (e < IN + LIN) { say('cueLinger'); ring(e, 1); num(e - IN, 4); show(vs.length); light(1); }
      else if (e < IN + LIN + OUT) { say('cueOut'); ring(e, 1 - (e - IN - LIN) / OUT); num(e - IN - LIN, 6); }
      else if (e < IN + LIN + OUT + REST) { say('cueRest'); ring(e, 0); num(e - IN - LIN - OUT, 5); }
      else if (e < IN + LIN + OUT + REST + DWELL) { ring(ALL, 0); cnt.textContent = ''; hint.textContent = ''; inkSlot(); }
      else { mode = 'done'; B.sound.droneStop(); sec.classList.add('opening'); setTimeout(function () { if (alive) acts.deeper(); }, 900); return; }
      raf = requestAnimationFrame(tick);
    }
    function begin() {
      if (mode !== 'idle' || !alive) return;
      mode = 'run'; gateAuto = true; t0 = performance.now(); btn.classList.remove('teach'); sec.classList.add('holding');
      if (state.settings.gateSound) B.sound.droneStart();
      raf = requestAnimationFrame(tick);
    }
    btn.addEventListener('click', begin);
    if (gateAuto) setTimeout(begin, 1300);   // a moment to take in the gate's name, then it starts
    light(0.22); root.style.setProperty('--ly', '70%');
    gateCtl = { stop: function () { alive = false; cancelAnimationFrame(raf); B.sound.droneStop(); } };
  }

  function landingView() {
    var s = t(), tried = state.sessions.some(countable);
    return thresholdView();   // whoever has not begun the fourteen days sees the opening
    return '<section class="landing">' +
      (invitedBy || state.chain ? '<p class="invited">' + esc(s.invitedBy(invitedBy, state.chain)) + '</p>' : '') +
      '<p class="kicker">' + esc(s.heroKicker) + '</p>' +
      wordmark('hero-word live') +
      '<h1 class="hero" tabindex="-1">' + esc(s.heroTitle) + '</h1>' +
      '<p class="lead">' + esc(s.heroSub) + '</p>' +
      '<p class="pitch">' + s.pitch.map(function (p) { return '<span><b>' + p[0] + '</b>' + esc(p[1]) + '</span>'; }).join('') + '</p>' +
      '<p class="dare">' + esc(s.heroDare) + '</p>' +
      '<div class="actions">' +
        (tried ? '<button type="button" class="btn primary" data-act="breathe">' + esc(s.pauseNow) + '</button><a class="btn" href="#/setup">' + esc(s.setup) + '</a>'
          : '<a class="btn primary" href="#/intro">' + esc(s.start) + '</a>') +
        '<a class="btn quiet" href="#/moment">' + esc(s.moment) + '</a>' +
      '</div>' +
      '<p class="fine">' + esc(s.privacyLine) + '</p>' +
      '<ol class="how">' + s.how.map(function (h) { return '<li><h2>' + esc(h[0]) + '</h2><p>' + esc(h[1]) + '</p></li>'; }).join('') + '</ol>' +
      '<p class="promise">' + esc(s.noPromise) + '</p>' + footLinks() + '</section>';
  }

  var IL14 = [[195, 36], [285, 96], [105, 96], [195, 156], [285, 216], [105, 216], [195, 276], [285, 336], [105, 336], [195, 396], [285, 456], [105, 456], [195, 516], [195, 590]];
  function ilan14(counts, todayIdx, label) {
    var s = t(), nodes = '', txt = '', dots = '';
    IL14.forEach(function (p, i) {
      var c = counts[i], today = i === todayIdx, full = c >= PER_DAY, r = i === 13 ? 28 : today ? 26 : 22;
      nodes += '<circle class="' + (full ? 'hatch thick' : 'paperfill') + (today ? ' now' : '') + '" cx="' + p[0] + '" cy="' + p[1] + '" r="' + r + '"/>' + (full ? '<circle class="paperfill thin" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (r - 7) + '"/>' : '');
      txt += '<text class="daylt' + (today ? ' now' : c ? '' : ' dim') + '" x="' + p[0] + '" y="' + (p[1] + 6) + '" text-anchor="middle">' + s.dayMark(i) + '</text>';
      if ((c > 0 && !full) || (today && !full)) for (var j = 0; j < PER_DAY; j++) dots += '<circle class="pd' + (j < c ? ' on' : '') + '" cx="' + (p[0] - 11 + j * 11) + '" cy="' + (p[1] + r + 9) + '" r="3.2"/>';
    });
    return '<svg class="ilan i14" viewBox="0 0 390 640" role="img" aria-label="' + esc(label) + '" lang="he">' +
      '<g class="il" filter="url(#ink)"><path d="M195 36 V590"/><path d="M195 36 L285 96 L195 156 L105 96 Z M195 156 L285 216 L195 276 L105 216 Z M195 276 L285 336 L195 396 L105 336 Z M195 396 L285 456 L195 516 L105 456 Z M105 96 V456 M285 96 V456"/>' + nodes + '</g>' + dots + txt +
      '<text class="rashi sm" x="195" y="636" text-anchor="middle">' + esc(s.lastLeaf) + '</text></svg>';
  }
  function homeView() {
    var s = t(), day = challengeDay(), st = stats();
    var todayIdx = day >= 1 && day <= DAYS ? day - 1 : -1, todayCount = sessionsOn(dateKey(new Date()));
    var away = state.lastSeen && diffDays(new Date(), parseKey(state.lastSeen)) > 1;
    return '<section class="home leaf">' +
      (away ? '<p class="welcome">' + esc(s.welcomeBack) + '</p>' : '') +
      '<p class="kicker">' + esc(day > DAYS ? s.dayBeyond(day) : s.day(day, DAYS)) + '</p>' +
      '<h1 class="sr-only" tabindex="-1">' + esc(s.sealLabel(st.total, day)) + '</h1>' +
      ilan14(st.counts, todayIdx, s.sealLabel(st.total, day)) +
      '<p class="today-line">' + esc(todayCount >= PER_DAY ? s.todayFull : s.today(todayCount)) + '</p>' +
      (day >= DAYS ? '<a class="card-cta" href="#/reflect"><strong>' + esc(s.doneTitle) + '</strong><span>' + esc(s.doneCta) + '</span></a>' : '') +
      chan('short') + '<button type="button" class="node" data-act="breathe">' + esc(s.gates[4].cta) + '</button>' +
      (day >= 3 && !state.vavs ? '<div class="turn"><h2>' + esc(s.turnT) + '</h2><p>' + esc(s.turnBody) + '</p>' +
        '<div class="actions"><a class="btn primary" data-wa href="' + esc(waUrl()) + '" target="_blank" rel="noopener">' + esc(s.waBtn) + '</a><a class="btn" href="#/share">' + esc(s.moreWays) + '</a></div></div>' : '') +
      '<div class="manage"><h2 class="sect">' + esc(s.manT) + '</h2>' +
        '<a href="#/length"><span>' + esc(s.manLen) + '</span><b>' + esc(s.levelNow(state.settings.level || 'nefesh')) + '</b></a>' +
        '<a href="#/setup"><span>' + esc(s.manRem) + '</span><b dir="ltr">' + esc(state.challenge.times.filter(function (x, i) { return state.challenge.on[i]; }).join(' · ') || '—') + '</b></a>' +
        '<a href="#/measure"><span>' + esc(s.manPace) + '</span><b>' + esc(s.manPaceVal((23 * state.settings.unit).toFixed(1))) + '</b></a></div>' +
      '<nav class="margin links"><a href="#/leaf">' + esc(s.leafToday) + '</a><a href="#/share">' + esc(s.shareDay) + '</a><a href="#/moment">' + esc(s.moment) + '</a></nav>' +
      '<p class="fine">' + esc(s.shortNote) + '</p>' +
      '<nav class="foot"><a href="#/intro">' + esc(s.practiceSettings) + '</a><a href="#/reflect">' + esc(s.reflectLink) + '</a><a href="#/setup">' + esc(s.remEdit) + '</a></nav>' +
      footLinks() + '</section>';
  }

  var pendingBreaths = null; // one-off length for the next session
  // Hesed is 72 in gematria. A whisper lasts three, five or ten times 72 seconds, and the three
  // lengths carry the three names of the soul, each of which also means breath.
  var LEVELS = { nefesh: 216, ruach: 360, neshama: 720 };
  // The length is kept exact: the count of breaths is rounded, and the pace is then adjusted by
  // a few percent so that whole breaths fill the time precisely.
  function plan(rhythm, unit, level) {
    var per = B.cycleSeconds(B.phasesFor(rhythm, 1)), S = LEVELS[level];
    if (!S || !per) return null;
    var n = Math.max(1, Math.round(S / (per * unit)));
    return { breaths: n, unit: S / (per * n), seconds: S };
  }
  function mmss(sec) { return Math.floor(sec / 60) + ':' + pad(Math.round(sec % 60)); }

  views['/intro'] = function () {
    var s = t(), set = state.settings, phases = B.phasesFor(set.rhythm, set.unit);
    var rh = [];
    if (CFG.offerHadvaRhythm !== false) rh.push(['hadva', s.rHadva, s.rHadvaD]);
    rh.push(['inout', s.rInout, s.rInoutD], ['own', s.rOwn, s.rOwnD]);
    return '<section class="intro">' +
      '<h1 tabindex="-1">' + esc(s.introTitle) + '</h1>' +
      '<ul class="safety"><li>' + esc(s.safe1) + '</li><li>' + esc(s.safe2) + '</li><li>' + esc(s.safe3) + '</li></ul>' +
      '<details class="more"><summary>' + esc(s.safeMoreT) + '</summary><p>' + esc(s.safeMore) + '</p></details>' +
      '<div class="actions"><button type="button" class="btn primary" data-act="begin">' + esc(s.begin) + '</button></div>' +
      '<fieldset class="choices"><legend>' + esc(s.rhythm) + '</legend>' + rh.map(function (r) {
        return '<label class="choice"><input type="radio" name="rhythm" value="' + r[0] + '"' + (set.rhythm === r[0] ? ' checked' : '') + '>' +
          '<span><strong>' + esc(r[1]) + '</strong><small>' + esc(r[2]) + '</small></span></label>';
      }).join('') +
      (CFG.offerHadvaRhythm !== false ? '<a class="inline-link" href="#/sources">' + esc(s.aboutRhythm) + '</a>' : '') + '</fieldset>' +
      (set.rhythm !== 'own' ? '<div class="row"><span class="row-label">' + esc(s.pace) + '</span>' +
        '<div class="stepper"><button type="button" data-act="quicker">' + esc(s.quicker) + '</button>' +
        '<output>' + esc(s.oneBreath(B.cycleSeconds(phases).toFixed(1).replace(/\.0$/, ''))) + '</output>' +
        '<button type="button" data-act="slower">' + esc(s.slower) + '</button></div></div>' +
        (set.unit >= 1 ? '<p class="fine warn">' + esc(s.fullCountNote) + '</p>' : '') +
        '<div class="row"><span class="row-label">' + esc(s.length) + '</span>' + seg('breaths', [[7, s.lFull], [21, s.l21]], pendingBreaths || set.breaths, s.length) + '</div>' : '') +
      '<div class="row"><span class="row-label">' + esc(s.sound) + '</span>' + seg('sound', [['guide', s.sGuide], ['water', s.sWater], ['off', s.sOff]], set.sound, s.sound) + '</div>' +
      (set.sound === 'water' ? '<p class="fine">' + esc(s.sWaterNote) + '</p>' : '') +
      (set.sound === 'guide' ? '<p class="fine">' + esc(s.sGuideNote) + '</p>' : '') +
      '<label class="check"><input type="checkbox" data-toggle="cue"' + (set.cue ? ' checked' : '') + '><span>' + esc(s.cue) + '</span></label>' +
      '</section>';
  };

  /* ---------- Practice: the letters are the guide ---------- */
  var session = null, pendingKind = null, muted = false, lastDone = null;
  function ease(x) { return 0.5 - 0.5 * Math.cos(Math.PI * x); }

  function practiceView(kind) {
    var s = t(), moment = kind === 'moment';
    return '<section class="practice' + (moment ? ' is-moment' : '') + '" id="practice">' +
      (moment ? '<p class="moment-lead">' + esc(s.momentLead) + '</p>' : '') +
      (!moment && state.settings.sound === 'guide' ? '<p class="listen"><svg viewBox="0 0 24 26" aria-hidden="true"><path d="M2 16 V12 a10 10 0 0 1 20 0 V16"/><rect x="0.8" y="15" width="5" height="9" rx="2"/><rect x="18.2" y="15" width="5" height="9" rx="2"/></svg>' + esc(s.listenHint) + '</p>' : '') +
      '<div class="stage" id="stage" aria-hidden="true" lang="he"><div class="stage-rings">' + ringsSvg('') + '</div>' +
        '<svg class="sessring" viewBox="0 0 100 100"><circle class="track" cx="50" cy="50" r="48.5"/><circle class="done" id="sessProg" cx="50" cy="50" r="48.5" pathLength="100" stroke-dasharray="0 100"/></svg>' +
        '<div class="ember" id="ember"></div><span class="big ghost" id="bigGhost"></span><span class="big fill" id="bigFill"></span></div>' +
      '<p class="phase" id="phase" aria-hidden="true"></p>' +
      '<p class="count" aria-hidden="true"><bdi id="count"></bdi></p>' +
      '<p class="sr-only" id="live" aria-live="polite"></p>' +
      '<div class="word mini" id="mini" dir="rtl" lang="he" aria-hidden="true"></div>' +
      (moment ? '' : '<p class="countdown" aria-hidden="true"><bdi id="cdown" dir="ltr"></bdi></p>') +
      '<p class="timeleft" id="left"></p>' +
      (!moment && state.settings.rhythm !== 'own' && state.settings.sound !== 'guide' ? '<div class="pace-row"><button type="button" class="chip" data-act="quicker">' + esc(s.quicker) + '</button><button type="button" class="chip" data-act="slower">' + esc(s.slower) + '</button></div>' : '') +
      '<div class="controls">' +
        (moment ? '<button type="button" class="btn primary" data-act="end">' + esc(s.momentDone) + '</button>'
          : '<button type="button" class="btn" data-act="pause" id="pauseBtn">' + esc(s.pause) + '</button><button type="button" class="btn" data-act="end">' + esc(s.end) + '</button>') +
        '<button type="button" class="chip" data-act="mute" id="muteBtn" aria-pressed="' + (state.settings.sound !== 'off' || state.settings.cue) + '">' + esc(state.settings.sound !== 'off' || state.settings.cue ? s.soundOn : s.soundOff) + '</button>' +
      '</div>' +
      (moment ? '<details class="more support"><summary>' + esc(s.supportT) + '</summary><p>' + esc(s.support) + '</p></details>' : '') +
      '</section>';
  }
  views['/practice'] = function () { return practiceView(pendingKind || 'full'); };
  views['/moment'] = function () { return practiceView('moment'); };

  function startSession(kind) {
    var s = t(), set = state.settings, moment = kind === 'moment';
    var pl = !moment && !pendingBreaths ? plan(set.rhythm, set.unit, set.level) : null;
    var phases = B.phasesFor(moment ? 'moment' : set.rhythm, pl ? pl.unit : set.unit);
    var target = pendingBreaths || (pl ? pl.breaths : set.breaths), breath = 0;
    var labels = { in: s.pIn, linger: s.pLinger, out: s.pOut, rest: s.pRest };
    var phaseEl = document.getElementById('phase'), liveEl = document.getElementById('live');
    var countEl = document.getElementById('count'), leftEl = document.getElementById('left');
    var stage = document.getElementById('stage'), ghost = document.getElementById('bigGhost'), fill = document.getElementById('bigFill');
    var mini = document.getElementById('mini'), root = document.getElementById('practice');
    var reduced = reducedMotion(), lastCount = '', lastLeft = '';
    muted = false;
    // Listening mode: the session follows a rendered track, so it carries on with the screen off.
    var guide = set.sound === 'guide' && phases.length > 0 && !moment, gAudio = null, cyc = B.cycleSeconds(phases);
    var cdEl = document.getElementById('cdown'), lastRem = '';
    var ember = document.getElementById('ember'), sessProg = moment ? null : document.getElementById('sessProg'), syncAt = null, syncBase = 0;
    root.dataset.rhythm = phases.length ? 'paced' : 'own';
    mini.innerHTML = phases.map(function (p) { return '<span class="lt lt-' + p.key + '" data-k="' + p.key + '"><b>' + LETTER_OF[p.key] + '</b></span>'; }).join('');
    if (!phases.length) {
      ghost.textContent = fill.textContent = 'חדוה'; stage.classList.add('whole'); stage.style.setProperty('--f', '1');
      phaseEl.textContent = s.pOwn; liveEl.textContent = s.pOwn;
    }
    if (reduced) stage.style.setProperty('--f', '1');

    var engine = B.createEngine({
      phases: phases, total: phases.length ? null : 120,
      // The sound is the master clock, but an audio element reports its time in coarse steps,
      // which made the picture stutter. So the picture runs on the screen's own clock and is
      // only re-aligned to the sound when the two drift apart.
      clock: function () {
        if (!guide) return null; if (!gAudio) return -1;
        var el = gAudio.el, now = performance.now() / 1000;
        if (el.paused) { syncAt = null; return el.currentTime - gAudio.lead; }
        if (syncAt === null || Math.abs(syncBase + (now - syncAt) - el.currentTime) > 0.3) { syncAt = now; syncBase = el.currentTime; }
        return syncBase + (now - syncAt) - gAudio.lead;
      },
      onPhase: function (key, seconds) {
        if (guide && engine.elapsed() >= cyc * target - 0.05) { phaseEl.textContent = ''; liveEl.textContent = ''; return; }
        if (key === phases[0].key) {
          breath = guide ? Math.floor(engine.elapsed() / cyc + 0.01) + 1 : breath + 1;
          if (!moment) {
            if (breath > target) { finishSession(engine.elapsed(), true); return; }
            leftEl.textContent = s.breathOf(breath, target);
          }
        }
        ghost.textContent = fill.textContent = LETTER_OF[key];
        phaseEl.textContent = labels[key]; liveEl.textContent = labels[key];
        root.dataset.phase = key;
        var lts = mini.children;
        for (var i = 0; i < lts.length; i++) lts[i].classList.toggle('on', lts[i].dataset.k === key);
        if (set.cue && !muted) B.sound.cue(key, seconds);
      },
      onFrame: function (f) {
        if (!session) return;
        if (guide && f.elapsed >= cyc * target) { stage.style.setProperty('--f', '0'); countEl.textContent = ''; return; }
        if (f.phase !== 'own') {
          if (cdEl && cyc && !moment) { var rem = clock(Math.max(0, cyc * target - f.elapsed)); if (rem !== lastRem) { cdEl.textContent = rem; lastRem = rem; } }
          var c = String(Math.max(1, Math.ceil(f.phaseLeft)));
          if (c !== lastCount) { countEl.textContent = c; lastCount = c; }
          if (!reduced) {
            var v = f.phase === 'in' ? ease(f.progress) : f.phase === 'linger' ? 1 : f.phase === 'out' ? 1 - ease(f.progress) : 0;
            stage.style.setProperty('--f', v.toFixed(3));
            // The ember: it grows and brightens as the breath comes in, glows steady while it is
            // held, sinks as it goes out, and rests as a coal. Only transform and opacity move.
            var glow = f.phase === 'linger' ? 1 + 0.012 * Math.sin(f.elapsed * 2.4) : v;
            ember.style.transform = 'scale(' + (0.3 + 0.7 * glow).toFixed(4) + ')';
            ember.style.opacity = (0.32 + 0.68 * v).toFixed(3);
            if (cyc && sessProg) sessProg.setAttribute('stroke-dasharray', (Math.min(1, f.elapsed / (cyc * target)) * 100).toFixed(2) + ' 100');
          }
        } else if (f.remaining !== null) {
          var l = s.left(clock(f.remaining));
          if (l !== lastLeft) { leftEl.textContent = l; lastLeft = l; }
        }
      },
      onDone: function (elapsed) { finishSession(elapsed, true); }
    });
    session = { engine: engine, kind: kind, labels: labels };
    B.sound.unlock();
    if (set.sound === 'water') B.sound.startWater();
    B.keepAwake(true);
    if (guide) {
      var mine = session; phaseEl.textContent = '…';
      B.sound.guide(phases, target, s.calTitle).then(function (a) {
        if (session !== mine) { a.stop(); return; }
        gAudio = a; mine.audio = a;
        a.el.onended = function () { if (session === mine) finishSession(cyc * target, true); };
        return a.el.play();
      }).catch(function () { guide = false; gAudio = null; mine.audio = null; }).then(function () { if (session === mine) engine.start(); });
    } else engine.start();
  }

  function finishSession(elapsed, natural) {
    if (!session) return;
    var kind = session.kind, secs = Math.round(elapsed), idx = -1;
    session.engine.stop(); if (session.audio) session.audio.stop(); session = null;
    B.sound.stopWater(); B.keepAwake(false);
    if (secs >= (kind === 'moment' ? 20 : MIN_LOG)) {
      state.sessions.push({ d: dateKey(new Date()), t: Date.now(), kind: kind === 'moment' ? 'moment' : 'full', secs: secs });
      idx = state.sessions.length - 1; save();
    }
    lastDone = { kind: kind, secs: secs, idx: idx, natural: natural, feel: null };
    pendingBreaths = null; pendingKind = null;
    go('/after');
  }

  // Hesed: the leaf was a kindness done to the visitor; they are asked for one in return —
  // one person. Each passing-on is a vav (a hook, and the third letter of the whisper).
  function vavRow(n) {
    var o = ''; for (var i = 0; i < Math.min(n, 14); i++) o += '<i>ו</i>';
    return '<p class="vavs" lang="he" dir="rtl" aria-hidden="true">' + o + '<i class="me">ו</i></p>';
  }
  function hesedBlock() {
    var s = t();
    return '<div class="hesed">' + vavRow(state.chain) + '<h2>' + esc(s.hesedT) + '</h2><p>' + esc(s.hesedFrom(invitedBy)) + '</p><p>' + esc(s.hesedAsk) + '</p>' +
      '<p class="fine">' + esc(s.hesedVav) + '</p><div class="actions"><a class="btn" href="#/share">' + esc(s.shareLink) + '</a></div></div>';
  }
  function passed() { state.vavs = (state.vavs || 0) + 1; save(); }

  function vavChain() {
    var s = t(), n = Math.min(state.chain || 0, 3), y = 30, out = '', txt = '';
    for (var i = 0; i < n; i++) {
      out += '<circle class="hatch thick" cx="195" cy="' + y + '" r="24"/><circle class="paperfill thin" cx="195" cy="' + y + '" r="17"/><path d="M192 ' + (y + 24) + ' V' + (y + 46) + ' M198 ' + (y + 24) + ' V' + (y + 46) + '"/>';
      txt += '<text class="vlt" x="195" y="' + (y + 10) + '" text-anchor="middle">ו</text>';
      if (i === n - 1 && invitedBy) txt += '<text class="rashi sm" x="160" y="' + (y + 5) + '" text-anchor="end">' + esc(invitedBy) + '</text>';
      y += 70;
    }
    var me = y + 9;
    out += '<circle class="paperfill now" cx="195" cy="' + me + '" r="33"/><path class="dash" d="M195 ' + (me + 33) + ' V' + (me + 59) + '"/><circle class="paperfill dash" cx="195" cy="' + (me + 83) + '" r="24"/>';
    txt += '<text class="vlt big" x="195" y="' + (me + 15) + '" text-anchor="middle">ו</text>' +
      '<text class="rashi sm" x="150" y="' + (me + 5) + '" text-anchor="end">' + esc(s.vavYou) + '</text><text class="rashi sm" x="160" y="' + (me + 88) + '" text-anchor="end">' + esc(s.vavWho) + '</text>';
    return '<svg class="ilan chain" viewBox="0 0 390 ' + (me + 112) + '" aria-hidden="true" lang="he"><g class="il" filter="url(#ink)">' + out + '</g>' + txt + '</svg>';
  }
  views['/after'] = function () {
    var s = t(), d = lastDone;
    if (!d) { setTimeout(function () { go('/'); }, 0); return ''; }
    if (d.kind === 'moment') {
      return '<section class="after leaf"><h1 tabindex="-1">' + esc(s.momentAfter) + '</h1>' + chan() +
        '<a class="node" href="#/">' + esc(s.next) + '</a>' +
        '<details class="more support"><summary>' + esc(s.supportT) + '</summary><p>' + esc(s.support) + '</p></details></section>';
    }
    var logged = d.idx >= 0, today = Math.min(sessionsOn(dateKey(new Date())), PER_DAY), pips = '';
    for (var p = 0; p < PER_DAY; p++) pips += '<i class="bigpip' + (p < today ? ' on' : '') + '"></i>';
    var feel = '';
    if (logged) {
      feel = d.feel
        ? '<p class="note">' + esc(d.feel === 'less' ? s.feelLess : s.feelThanks) + '</p>'
        : '<div class="feel"><p class="feel-q">' + esc(s.feelQ) + '</p>' +
          '<div class="feel-opts"><button type="button" class="chip" data-feel="more">' + esc(s.fMore) + '</button><button type="button" class="chip" data-feel="same">' + esc(s.fSame) + '</button><button type="button" class="chip" data-feel="less">' + esc(s.fLess) + '</button></div>' +
          '<p class="fine">' + esc(s.feelOpt) + '</p></div>';
    }
    // One thing on each leaf: this one closes the whisper; kindness and the fourteen days follow.
    var onward = logged && !state.vavs ? '#/hesed' : !state.challenge ? '#/invite' : logged ? '#/leaf' : '#/';
    return '<section class="after leaf">' + (logged ? wordmark('done-word') + '<p class="bigpips" aria-hidden="true">' + pips + '</p>' : '') +
      '<h1 tabindex="-1">' + esc(logged ? s.afterTitle : s.afterShort) + '</h1>' + feel + chan() +
      '<a class="node" href="' + onward + '">' + esc(s.next) + '</a>' +
      catchword(onward === '#/hesed' ? s.hesedCatch : onward === '#/invite' ? s.inviteCatch : onward === '#/leaf' ? s.leafCatch : '') + '</section>';
  };
  views['/hesed'] = function () {
    var s = t(), onward = !state.challenge ? '#/invite' : '#/';
    return '<section class="hesedleaf leaf"><div class="leafhead">' + folio(8) + '</div>' + vavChain() +
      '<h1 tabindex="-1">' + esc(s.hesedT) + '</h1>' +
      '<p class="lead">' + esc(s.hesedFrom(invitedBy)) + '</p>' +
      '<p class="line">' + esc(s.hesedAsk) + '</p>' +
      '<p class="glossline">' + esc(s.hesedVav) + '</p>' + chan() +
      '<a class="node" href="' + onward + '">' + esc(s.next) + '</a>' +
      '<nav class="margin links"><a href="#/share">' + esc(s.hesedNow) + '</a></nav>' +
      catchword(!state.challenge ? s.inviteCatch : '') + '</section>';
  };
  views['/invite'] = function () {
    var s = t();
    return '<section class="inviteleaf leaf"><div class="leafhead">' + folio(9) + '</div>' + chan() +
      '<h1 tabindex="-1">' + esc(s.inviteQ) + '</h1>' +
      '<p class="lead">' + esc(s.inviteBody) + '</p>' +
      '<p class="glossline"><b>' + esc(s.sciT) + '.</b> ' + esc(s.sciBody) + ' <a href="#/sources">' + esc(s.sciMore) + '</a></p>' + chan() +
      '<button type="button" class="node" data-act="joinNow">' + esc(s.inviteGo) + '</button>' +
      '<nav class="margin links"><a href="#/">' + esc(s.notNow) + '</a><a href="#/setup">' + esc(s.remEdit) + '</a></nav></section>';
  };

  /* ---------- The book of days: a leaf for each day, opened in three parts by the day's whispers ---------- */
  var leafDay = -1;
  views['/leaf'] = function () {
    var s = t();
    if (!state.challenge) { setTimeout(function () { go('/'); }, 0); return ''; }
    var day = Math.max(1, Math.min(DAYS, challengeDay())), i = leafDay >= 0 && leafDay < day ? leafDay : day - 1;
    var L = s.leaves[i], n = Math.min(3, dayCounts()[i] || 0), nav = '';
    function part(k, html) { return k < n ? '<div class="lpart">' + html + '</div>' : '<p class="lveil">' + esc(s.leafVeil[k]) + '</p>'; }
    for (var d = 0; d < day; d++) nav += '<button type="button" data-leaf="' + d + '" aria-pressed="' + (d === i) + '">' + s.dayMark(d) + '</button>';
    var first = L.q ? '<blockquote class="verse"><span lang="he" dir="rtl">' + esc(L.q) + '</span><cite>' + esc(L.src) + '</cite></blockquote>' + (L.tr ? '<p class="glossline">' + esc(L.tr) + '</p>' : '') : '<p class="line">' + esc(L.o) + '</p>';
    var onward = i === day - 1 && n < 3 ? '<button type="button" class="node" data-act="breathe">' + esc(s.gates[4].cta) + '</button>'
      : i === DAYS - 1 ? '<a class="node" href="#/reflect">' + esc(s.leafWrite) + '</a>' : '<a class="node" href="#/">' + esc(s.next) + '</a>';
    return '<section class="leafpage leaf"><div class="leafhead"><p class="folio">' + esc(s.leafOf(s.dayMark(i))) + '</p></div>' +
      '<h1 class="gate-label" tabindex="-1">' + esc(L.t) + '</h1>' + chan('short') +
      part(0, first) + part(1, '<p class="line">' + esc(L.a) + '</p>') + part(2, '<p class="line strong">' + esc(L.b) + '</p>') +
      chan() + onward +
      (day > 1 ? '<nav class="leafnav" aria-label="' + esc(s.leafNav) + '">' + nav + '</nav>' : '') + '</section>';
  };

  /* ---------- The measure: one calm in-breath sets the pace ----------
     Two touches, not a held finger: one as the in-breath begins, one as it ends. While it
     runs the ring fills and the seconds are counted in the station, so it is plain that
     something is being measured. */
  views['/measure'] = function () {
    var s = t(), set = state.settings;
    return '<section class="measure leaf"><div class="leafhead">' + folio(7) + '</div>' +
      '<h1 tabindex="-1">' + esc(s.measT) + '</h1>' +
      '<p class="lead">' + esc(s.measBody) + '</p>' + chan() +
      '<button type="button" class="sealbtn meas" id="measBtn" aria-label="' + esc(s.measTap) + '">' + gateNode('m', '') + '</button>' +
      '<p class="gate-hint" id="measOut" aria-live="polite">' + esc(set.measured ? s.measRes(set.measured.toFixed(1), (23 * set.unit).toFixed(1)) : s.measTap) + '</p>' +
      (set.measured ? chan() + '<a class="node" href="' + (state.challenge ? '#/' : '#/challenge') + '">' + esc(s.next) + '</a>' : chan('dash')) +
      (state.challenge ? '' : catchword(s.chalCatch)) + '</section>';
  };
  function startMeasure() {
    var s = t(), btn = document.getElementById('measBtn'), out = document.getElementById('measOut');
    var prog = btn.querySelector('.prog'), num = btn.querySelector('.eye-letter'), t0 = 0, raf = 0, alive = true;
    function draw(sec) { prog.setAttribute('stroke-dasharray', (Math.min(1, sec / 8) * 100).toFixed(1) + ' 100'); num.textContent = sec.toFixed(1); }
    function tick() {
      if (!alive || !t0) return;
      var sec = (performance.now() - t0) / 1000; draw(sec);
      if (sec >= 12) { stop(); return; }
      raf = requestAnimationFrame(tick);
    }
    function stop() {
      var sec = (performance.now() - t0) / 1000; t0 = 0; cancelAnimationFrame(raf); btn.classList.remove('holding');
      if (sec < 1.2) { out.textContent = s.measShort; draw(0); num.textContent = s.measIn; num.classList.add('word'); return; }
      var set = state.settings;
      set.unit = Math.round(Math.max(0.35, Math.min(0.8, sec / 8)) * 1000) / 1000; set.measured = Math.round(sec * 10) / 10;
      if (!set.level) set.level = 'nefesh';
      save(); render(true);
    }
    btn.addEventListener('click', function () {
      if (t0) { stop(); return; }
      t0 = performance.now(); btn.classList.add('holding'); num.classList.remove('word'); out.textContent = s.measRun; raf = requestAnimationFrame(tick);
    });
    if (state.settings.measured) draw(state.settings.measured); else { num.textContent = s.measIn; num.classList.add('word'); }
    gateCtl = { stop: function () { alive = false; cancelAnimationFrame(raf); } };
  }
  function levRows() {
    var s = t(), set = state.settings;
    return '<div class="levrows" role="group" aria-label="' + esc(s.levT) + '">' + s.levels.map(function (l, k) {
      return '<button type="button" class="levrow r' + k + '" data-set="level:' + l[0] + '" aria-pressed="' + (set.level === l[0]) + '"><b>' + esc(l[1]) + '</b><span>' + esc(l[2]) + '</span><i dir="ltr">' + mmss(LEVELS[l[0]]) + '</i></button>';
    }).join('') + '</div>';
  }
  /* ---------- The challenge: fourteen days, three times a day, a length, three reminders ---------- */
  var chDraft = null;
  function grabTimes() {
    if (!document.getElementById('tm0')) return null;
    var g = { times: [], on: [] };
    for (var i = 0; i < PER_DAY; i++) { g.times.push(document.getElementById('tm' + i).value || ['07:30', '13:00', '21:30'][i]); g.on.push(document.getElementById('on' + i).checked); }
    return g;
  }
  views['/challenge'] = function () {
    var s = t(), set = state.settings, ch = chDraft || state.challenge || { times: ['07:30', '13:00', '21:30'], on: [true, true, true] }, names = [s.t1, s.t2, s.t3];
    if (!set.level) { set.level = 'nefesh'; save(); }
    return '<section class="challengeleaf leaf"><div class="leafhead">' + folio(8) + '</div>' +
      '<h1 tabindex="-1">' + esc(s.inviteQ) + '</h1>' +
      '<p class="lead">' + esc(s.chalBody) + '</p>' +
      '<h2 class="sect">' + esc(s.chalLen) + '</h2>' + levRows() +
      '<h2 class="sect">' + esc(s.chalRem) + '</h2>' +
      '<div class="times">' + names.map(function (n, i) {
        return '<div class="time-row"><label class="check"><input type="checkbox" id="on' + i + '"' + (ch.on[i] ? ' checked' : '') + '><span>' + esc(n) + '</span></label>' +
          '<input type="time" id="tm' + i + '" value="' + esc(ch.times[i]) + '" aria-label="' + esc(n) + '"></div>';
      }).join('') + '</div>' +
      '<p class="glossline">' + esc(s.chalRemNote) + '</p>' +
      '<button type="button" class="btn" data-act="calOnly">' + esc(s.addCal) + '</button>' +
      chan('short') +
      '<button type="button" class="node" data-act="startChallenge">' + esc(s.chalGo) + '</button>' +
      catchword(s.cueIn) + '</section>';
  };
  // The length: three stations, one for each name of the soul, measured in hesed (72).
  views['/length'] = function () {
    var s = t(), set = state.settings, tried = state.sessions.some(countable);
    return '<section class="lengthleaf leaf"><div class="leafhead">' + folio(8) + '</div>' +
      '<h1 tabindex="-1">' + esc(s.levT) + '</h1>' +
      '<p class="glossline">' + esc(s.levBody) + '</p>' +
      levRows() +
      '<p class="glossline">' + esc(s.levNote) + '</p>' + chan('short') +
      '<a class="node" href="' + (state.challenge ? '#/' : '#/challenge') + '">' + esc(s.next) + '</a>' +
      '<nav class="margin links"><a href="#/measure">' + esc(s.measAgain) + '</a></nav></section>';
  };

  /* ---------- Reminders ---------- */
  views['/setup'] = function () {
    var s = t(), ch = state.challenge || { times: ['07:30', '13:00', '21:30'], on: [true, true, true] };
    var names = [s.t1, s.t2, s.t3];
    return '<section class="setup"><h1 tabindex="-1">' + esc(s.setupTitle) + '</h1><p class="lead">' + esc(s.setupBody) + '</p>' +
      '<div class="times">' + names.map(function (n, i) {
        return '<div class="time-row"><label class="check"><input type="checkbox" id="on' + i + '"' + (ch.on[i] ? ' checked' : '') + '><span>' + esc(n) + '</span></label>' +
          '<input type="time" id="tm' + i + '" value="' + esc(ch.times[i]) + '" aria-label="' + esc(n) + '"></div>';
      }).join('') + '</div>' +
      '<div class="actions"><button type="button" class="btn primary" data-act="cal">' + esc(s.addCal) + '</button>' +
      '<button type="button" class="btn quiet" data-act="noCal">' + esc(s.ownAlarm) + '</button></div>' +
      '<details class="more"><summary>' + esc(s.remHow) + '</summary><p>' + esc(s.remBody) + '</p></details></section>';
  };
  function readSetup() {
    var times = [], on = [];
    for (var i = 0; i < PER_DAY; i++) {
      times.push(document.getElementById('tm' + i).value || ['07:30', '13:00', '21:30'][i]);
      on.push(document.getElementById('on' + i).checked);
    }
    if (!state.challenge) state.challenge = { start: dateKey(new Date()) };
    state.challenge.times = times; state.challenge.on = on; save();
  }
  function fold(line) { // RFC 5545 folding at 75 octets; 36 characters is safe for Hebrew
    var out = [];
    while (line.length > 36) { out.push(line.slice(0, 36)); line = ' ' + line.slice(36); }
    out.push(line); return out.join('\r\n');
  }
  function icsEscape(x) { return String(x).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
  function buildIcs() {
    var s = t(), ch = state.challenge, start = parseKey(ch.start), url = siteUrl(), now = new Date();
    var stamp = now.getUTCFullYear() + pad(now.getUTCMonth() + 1) + pad(now.getUTCDate()) + 'T' + pad(now.getUTCHours()) + pad(now.getUTCMinutes()) + pad(now.getUTCSeconds()) + 'Z';
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Hadva working prototype//EN', 'CALSCALE:GREGORIAN'];
    // Remaining days of the fourteen, counted from today, so nothing is scheduled in the past.
    var left = Math.max(1, DAYS - Math.max(0, diffDays(now, start)));
    var first = diffDays(now, start) > 0 ? now : start;
    ch.times.forEach(function (tm, i) {
      if (!ch.on[i]) return;
      var hm = tm.split(':');
      lines.push('BEGIN:VEVENT',
        'UID:hadva-' + ch.start + '-' + i + '-' + Date.now() + '@local',
        'DTSTAMP:' + stamp,
        // Floating local time: fires at this wall-clock time wherever the person is.
        'DTSTART:' + first.getFullYear() + pad(first.getMonth() + 1) + pad(first.getDate()) + 'T' + pad(+hm[0]) + pad(+hm[1]) + '00',
        'DURATION:PT' + Math.max(2, Math.ceil((LEVELS[state.settings.level] || 90) / 60)) + 'M',
        'RRULE:FREQ=DAILY;COUNT=' + left,
        fold('SUMMARY:' + icsEscape(s.calTitle)),
        fold('DESCRIPTION:' + icsEscape(s.calDesc + (url ? ' ' + url : ''))));
      if (url) lines.push(fold('URL:' + url));
      lines.push('TRANSP:TRANSPARENT', 'BEGIN:VALARM', 'ACTION:DISPLAY', fold('DESCRIPTION:' + icsEscape(s.calTitle)), 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.join('\r\n') + '\r\n';
  }

  /* ---------- Reflection ---------- */
  views['/reflect'] = function () {
    var s = t(), ch = state.challenge, day = challengeDay(), st = ch ? stats() : null;
    return '<section class="reflect"><h1 tabindex="-1">' + esc(s.refTitle) + '</h1>' +
      (st ? '<p class="lead">' + esc(s.refSummary(st.total, st.days)) + '</p>' : '') +
      (!ch || day < DAYS ? '<p class="fine">' + esc(s.refEarly) + '</p>' : '') +
      '<label class="field"><span class="field-label">' + esc(s.refLabel) + '</span><span class="field-hint">' + esc(s.refPrompt) + '</span>' +
      '<textarea id="reflection" rows="7" dir="auto">' + esc(state.reflection) + '</textarea></label>' +
      '<p class="fine lock">' + esc(s.refSaved) + '</p>' +
      '<div class="actions"><button type="button" class="btn" data-act="saveCopy">' + esc(s.refCopy) + '</button></div>' +
      // The testimony: one sentence, chosen separately from the private writing above, that
      // goes on the leaf the person passes on.
      '<div class="hesed"><h2>' + esc(s.testT) + '</h2><p>' + esc(s.testBody) + '</p>' +
        '<label class="field"><span class="field-label">' + esc(s.testLabel) + '</span><textarea id="testimony" rows="3" maxlength="140" dir="auto">' + esc(state.testimony) + '</textarea></label>' +
        '<p class="fine">' + esc(s.testFine) + '</p><div class="actions"><a class="btn" href="#/share">' + esc(s.testGo) + '</a></div></div>' +
      '<details class="more team"><summary>' + esc(s.teamT) + '</summary><p>' + esc(s.teamBody) + '</p>' +
        '<label class="field"><span class="field-label">' + esc(s.teamLabel) + '</span><textarea id="teamNote" rows="4" dir="auto">' + esc(state.team.note) + '</textarea></label>' +
        '<label class="check"><input type="checkbox" data-team="agg"' + (state.team.agg ? ' checked' : '') + '><span>' + esc(s.cAgg) + '</span></label>' +
        '<label class="check"><input type="checkbox" data-team="pub"' + (state.team.pub ? ' checked' : '') + '><span>' + esc(s.cPub) + '</span></label>' +
        '<label class="field"><span class="field-label">' + esc(s.cName) + '</span><input type="text" id="teamName" dir="auto" value="' + esc(state.team.name) + '" autocomplete="off"></label>' +
        '<div class="actions"><button type="button" class="btn" data-act="teamPrep">' + esc(s.teamPrep) + '</button></div></details>' +
      '<div class="actions"><a class="btn primary" href="#/">' + esc(ch && day >= DAYS ? s.keep : s.finish) + '</a><a class="btn" href="#/share">' + esc(s.shareLink) + '</a></div></section>';
  };
  function teamMessage() {
    var s = t(), tm = state.team, yes = state.lang === 'he' ? 'כן' : 'yes', no = state.lang === 'he' ? 'לא' : 'no';
    return tm.note.trim() + '\n\n— ' + s.cAgg + ' ' + (tm.agg ? yes : no) + '\n— ' + s.cPub + ' ' + (tm.pub ? yes : no) +
      (tm.pub && tm.name.trim() ? '\n— ' + s.cName + ': ' + tm.name.trim() : '');
  }

  /* ---------- Share: the seal card and the daily message ---------- */
  function shareMessage() {
    var s = t(), url = inviteUrl(), tx = (state.testimony || '').trim();
    if (tx) return s.testMsg(tx, url);
    if (!state.challenge) return s.shareInviteMsg(url);
    var c = Math.min(sessionsOn(dateKey(new Date())), PER_DAY), dots = '';
    for (var i = 0; i < PER_DAY; i++) dots += i < c ? '🟠' : '⚪';
    return s.shareMsg(Math.min(challengeDay(), DAYS), dots, url);
  }
  views['/share'] = function () {
    var s = t(), url = siteUrl();
    return '<section class="share"><h1 tabindex="-1">' + esc(s.shareTitle) + '</h1><p class="lead">' + esc(s.shareBody) + '</p>' +
      vavRow((state.chain || 0) + (state.vavs || 0)) + (state.vavs ? '<p class="fine">' + esc(s.vavCount(state.vavs)) + '</p>' : '') +
      ((state.testimony || '').trim() ? '<p class="fine">' + esc(s.testOn) + ' <a href="#/reflect">' + esc(s.testEdit) + '</a></p>' : '') +
      '<canvas id="card" class="card" width="1080" height="1350" role="img" aria-label="' + esc(state.challenge ? s.cardTitle(Math.min(challengeDay(), DAYS)) : s.cardInvite) + '"></canvas>' +
      '<pre class="msg" id="msg" dir="auto">' + esc(shareMessage()) + '</pre>' +
      (url ? '<label class="field"><span class="field-label">' + esc(s.inviteName) + '</span><input type="text" id="inviteName" dir="auto" maxlength="24" value="' + esc(state.inviteName) + '" autocomplete="off"></label>'
        : '<p class="fine warn">' + esc(s.noLink) + '</p>') +
      '<div class="actions"><a class="btn primary" id="waBtn" data-wa href="' + esc(waUrl()) + '" target="_blank" rel="noopener">' + esc(s.waBtn) + '</a>' +
      (navigator.share ? '<button type="button" class="btn" data-act="share">' + esc(s.shareBtn) + '</button>' : '') +
      '<button type="button" class="btn" data-act="copyText">' + esc(s.copyText) + '</button>' +
      '<button type="button" class="btn" data-act="saveImg">' + esc(s.saveImg) + '</button></div></section>';
  };
  function drawCard() {
    var c = document.getElementById('card'); if (!c) return;
    var s = t(), x = c.getContext('2d'), W = 1080, H = 1350, st = stats();
    var url = siteUrl().replace(/^https?:\/\//, '').replace(/\/$/, '');
    var sans = '"Frank Ruhl Libre","David Libre",David,Georgia,"Times New Roman",serif';
    var g = x.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#e3d3ad'); g.addColorStop(1, '#c7b488');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    var glow = x.createRadialGradient(W / 2, 520, 40, W / 2, 520, 560);
    glow.addColorStop(0, 'rgba(124,35,19,.10)'); glow.addColorStop(1, 'rgba(255,106,77,0)');
    x.fillStyle = glow; x.fillRect(0, 0, W, H);

    // The testimony leaf: the person's own sentence, their seal beneath it.
    var tx = (state.testimony || '').trim();
    if (tx) {
      x.textAlign = 'center'; x.direction = s.dir; x.fillStyle = '#7c2313'; x.font = '700 44px ' + sans;
      x.fillText(s.testCard(state.challenge ? Math.min(challengeDay(), DAYS) : 0), W / 2, 120);
      x.direction = /[\u0590-\u05FF]/.test(tx) ? 'rtl' : 'ltr'; x.fillStyle = '#23150b';
      var size = tx.length > 90 ? 56 : 68; x.font = '700 ' + size + 'px ' + sans;
      var rows = [], cur = '';
      tx.split(/\s+/).forEach(function (w) { var nx = cur ? cur + ' ' + w : w; if (cur && x.measureText(nx).width > 860) { rows.push(cur); cur = w; } else cur = nx; });
      if (cur) rows.push(cur);
      var lh = size * 1.45, y0 = 470 - (rows.length - 1) * lh / 2;
      rows.forEach(function (ln, k) { x.fillText(ln, W / 2, y0 + k * lh); });
      var nm = state.inviteName.trim();
      if (nm) { x.fillStyle = '#523f29'; x.font = '500 44px ' + sans; x.fillText('— ' + nm, W / 2, y0 + rows.length * lh + 16); }
      for (var a = 0; a < DAYS; a++) for (var b = 0; b < PER_DAY; b++) {
        var q = sealPoint(a, b, W / 2, 990, 1.0), lit = b < st.counts[a];
        x.beginPath(); x.arc(q[0], q[1], lit ? 9 : 6, 0, Math.PI * 2);
        if (lit) { x.fillStyle = dayColor(a); x.fill(); } else { x.strokeStyle = 'rgba(35,21,11,.5)'; x.lineWidth = 2; x.stroke(); }
      }
      x.direction = s.dir; x.fillStyle = '#523f29'; x.font = '500 40px ' + sans; x.fillText(s.testFoot, W / 2, 1215);
      if (url) { x.direction = 'ltr'; x.fillStyle = '#7c2313'; x.font = '600 38px ' + sans; x.fillText(url, W / 2, 1285); }
      return;
    }

    x.textAlign = 'center'; x.direction = s.dir;
    x.fillStyle = '#23150b'; x.font = '700 46px ' + sans;
    x.fillText(state.challenge ? s.cardTitle(Math.min(challengeDay(), DAYS)) : s.cardInvite, W / 2, 110);

    for (var i = 0; i < DAYS; i++) for (var j = 0; j < PER_DAY; j++) {
      var p = sealPoint(i, j, W / 2, 520, 2.45), on = j < st.counts[i];
      x.beginPath(); x.arc(p[0], p[1], on ? 21 : 14, 0, Math.PI * 2);
      if (on) { x.fillStyle = dayColor(i); x.fill(); }
      else { x.strokeStyle = 'rgba(35,21,11,.55)'; x.lineWidth = 3; x.stroke(); }
    }
    x.direction = 'ltr'; x.fillStyle = '#23150b'; x.font = '900 150px ' + sans;
    x.fillText(String(st.total), W / 2, 560);
    x.fillStyle = '#523f29'; x.font = '500 44px ' + sans; x.fillText('/ ' + TOTAL, W / 2, 620);

    // The word and its numbers, right to left.
    x.direction = 'rtl';
    var lg = x.createLinearGradient(760, 0, 320, 0);
    lg.addColorStop(0, '#7c2313'); lg.addColorStop(0.5, '#7c2313'); lg.addColorStop(1, '#4e140a');
    LETTERS.forEach(function (l, k) {
      var lx = 795 - k * 170;
      x.fillStyle = lg; x.font = '900 170px ' + sans; x.fillText(l[0], lx, 1060);
      x.fillStyle = '#23150b'; x.font = '700 44px ' + sans; x.fillText(String(l[1]), lx, 1125);
    });
    x.direction = s.dir; x.fillStyle = '#523f29'; x.font = '500 40px ' + sans; x.fillText(s.cardFoot, W / 2, 1215);
    if (url) { x.direction = 'ltr'; x.fillStyle = '#7c2313'; x.font = '600 38px ' + sans; x.fillText(url, W / 2, 1285); }
  }
  function cardBlob(cb) { document.getElementById('card').toBlob(cb, 'image/png'); }

  /* ---------- Sources & settings ---------- */
  views['/sources'] = function () {
    var s = t(), tags = { text: s.tagText, interp: s.tagInterp, method: s.tagMethod, science: s.tagScience };
    return '<section class="sources"><h1 tabindex="-1">' + esc(s.srcTitle) + '</h1><p class="lead">' + esc(s.srcLead) + '</p>' +
      s.src.map(function (it) {
        return '<article class="source k-' + it.tag + '"><p class="tag">' + esc(tags[it.tag]) + '</p><h2>' + esc(it.ref) + '</h2>' +
          (it.he ? '<blockquote lang="he" dir="rtl">' + esc(it.he) + '</blockquote>' : '') +
          '<p>' + esc(it.body) + '</p>' +
          (it.url ? '<a class="inline-link" href="' + esc(it.url) + '" target="_blank" rel="noopener noreferrer">' + esc(it.urlKind === 'at' ? s.readAt : s.readOn) + '</a>' : '') + '</article>';
      }).join('') + '<p class="fine">' + esc(s.srcNote) + '</p>' +
      '<div class="actions"><a class="btn" href="#/">' + esc(s.back) + '</a></div></section>';
  };

  views['/settings'] = function () {
    var s = t(), set = state.settings;
    return '<section class="settings"><h1 tabindex="-1">' + esc(s.setTitle) + '</h1>' +
      '<div class="row"><span class="row-label">' + esc(s.language) + '</span>' + seg('lang', [['he', 'עברית'], ['en', 'English']], state.lang, s.language) + '</div>' +
      '<div class="row"><span class="row-label">' + esc(s.motion) + '</span>' + seg('motion', [['system', s.mSystem], ['reduced', s.mReduced], ['full', s.mFull]], set.motion, s.motion) + '</div>' +
      '<div class="row"><span class="row-label">' + esc(s.textSize) + '</span>' + seg('large', [['0', s.tsRegular], ['1', s.tsLarge]], set.large ? '1' : '0', s.textSize) + '</div>' +
      '<div class="row"><span class="row-label">' + esc(s.sound) + '</span>' + seg('sound', [['guide', s.sGuide], ['water', s.sWater], ['off', s.sOff]], set.sound, s.sound) + '</div>' +
      '<label class="check"><input type="checkbox" data-toggle="cue"' + (set.cue ? ' checked' : '') + '><span>' + esc(s.cue) + '</span></label>' +
      '<div class="panel"><h2>' + esc(s.privacyT) + '</h2><p>' + esc(s.privacyBody) + '</p>' +
        '<div class="actions"><button type="button" class="btn" data-act="export">' + esc(s.exportBtn) + '</button>' +
        '<button type="button" class="btn danger" data-act="wipe">' + esc(s.deleteBtn) + '</button></div></div>' +
      '<div class="panel"><h2>' + esc(s.aboutT) + '</h2><p>' + esc(s.aboutBody) + '</p><a class="inline-link" href="#/sources">' + esc(s.sourcesLink) + '</a></div>' +
      '<div class="actions"><a class="btn" href="#/">' + esc(s.back) + '</a></div></section>';
  };

  /* ---------- Router ---------- */
  function route() { var h = location.hash.replace(/^#/, ''); return views[h] ? h : '/'; }
  function go(path) { if (route() === path && location.hash) render(); else location.hash = '#' + path; }
  function render(keepFocus) {
    var r = route();
    if (session && r !== '/practice' && r !== '/moment') { session.engine.stop(); if (session.audio) session.audio.stop(); session = null; B.sound.stopWater(); B.keepAwake(false); }
    if (r === '/practice' && !pendingKind) { location.replace('#/'); return; }
    applyPrefs(); renderTop(r);
    main.dataset.view = r;
    var bd = document.getElementById('backdrop'); if (bd && !bd.firstChild) bd.innerHTML = wheelSvg('bd', false);
    if (r !== '/leaf') leafDay = -1;
    if (gateCtl) { gateCtl.stop(); gateCtl = null; }
    // How much candlelight falls on the page: dim at the threshold, raised by the hand inside a gate.
    var onDoor = r === '/' && !state.challenge && !state.sessions.some(countable);
    document.documentElement.style.setProperty('--light', onDoor ? '0.5' : '1');
    document.documentElement.style.setProperty('--ly', '30%');
    if (r === '/gate') { try { sessionStorage.setItem('hadva.gate', String(gateStep)); } catch (e) { /* private mode */ } }
    main.innerHTML = views[r]();
    var rises = main.querySelectorAll('.rise');
    for (var ri = 0; ri < rises.length; ri++) rises[ri].style.setProperty('--i', rises[ri].dataset.i || String(ri));
    if (r === '/practice') startSession(pendingKind);
    else if (r === '/moment') startSession('moment');
    else if (r === '/share') drawCard();
    else if (r === '/measure') startMeasure();
    else if (r === '/' && document.getElementById('land')) startLanding();
    if (r === '/' && state.challenge) { state.lastSeen = dateKey(new Date()); save(); }
    if (!keepFocus) { window.scrollTo(0, 0); var h1 = main.querySelector('h1'); if (h1 && r !== '/') h1.focus({ preventScroll: true }); }
  }
  window.addEventListener('hashchange', function () { render(); });

  /* ---------- Events ---------- */
  function stepUnit(dir) {
    var i = 0, u = state.settings.unit; B.UNITS.forEach(function (x, k) { if (Math.abs(x - u) < Math.abs(B.UNITS[i] - u)) i = k; });
    i = Math.max(0, Math.min(B.UNITS.length - 1, i + dir));
    state.settings.unit = B.UNITS[i]; save();
    if (session && session.kind !== 'moment') session.engine.setPhases(B.phasesFor(state.settings.rhythm, state.settings.unit));
    else render(true);
  }
  function beginNow(n) {
    pendingBreaths = n || null;
    if (startHref()) { go('/intro'); return; }
    B.sound.prime(); pendingKind = 'full'; go('/practice');
  }
  var acts = {
    lang: function () { state.lang = t().switchLang; save(); render(true); },
    enter: function () { gateStep = 0; gateAuto = true; B.sound.unlock(); go('/gate'); },
    gateSound: function () { state.settings.gateSound = !state.settings.gateSound; save(); if (state.settings.gateSound) B.sound.unlock(); render(true); },
    deeper: function () { gateStep = Math.min(gateStep + 1, t().gates.length - 1); render(); },
    skipGate: function () { gateStep = t().gates.length - 1; go('/gate'); },
    spell: function () {
      // First the person's own breath is measured and a length chosen; then the whisper.
      if (!state.challenge) { go('/measure'); return; }
      B.sound.prime(); pendingBreaths = null; pendingKind = 'full'; go('/practice');
    },
    breathe: function () { beginNow(state.settings.level ? null : 7); },
    breatheLong: function () { beginNow(21); },
    quicker: function () { stepUnit(-1); },
    slower: function () { stepUnit(1); },
    begin: function () { B.sound.prime(); pendingKind = 'full'; go('/practice'); },
    pause: function () {
      if (!session) return; var s = t(), btn = document.getElementById('pauseBtn'), root = document.getElementById('practice');
      if (session.engine.isRunning()) {
        session.engine.pause(); if (session.audio) session.audio.el.pause(); B.sound.stopWater(); btn.textContent = s.resume;
        document.getElementById('phase').textContent = s.paused; document.getElementById('live').textContent = s.paused;
        root.dataset.paused = '1';
      } else {
        delete root.dataset.paused;
        btn.textContent = s.pause; document.getElementById('phase').textContent = session.labels[root.dataset.phase] || s.pOwn;
        if (state.settings.sound === 'water' && !muted) B.sound.startWater();
        if (session.audio) session.audio.el.play();
        session.engine.resume();
      }
    },
    end: function () { if (session) finishSession(session.engine.elapsed(), false); },
    mute: function () {
      var s = t(), btn = document.getElementById('muteBtn'), set = state.settings;
      var wasOn = btn.getAttribute('aria-pressed') === 'true';
      if (session && session.audio) { session.audio.el.muted = wasOn; btn.setAttribute('aria-pressed', String(!wasOn)); btn.textContent = wasOn ? s.soundOff : s.soundOn; return; }
      if (wasOn) { muted = true; B.sound.stopWater(); }
      else {
        muted = false;
        if (set.sound === 'off' && !set.cue) { set.sound = 'water'; save(); } // turning sound on with nothing chosen picks the one soundscape
        if (set.sound === 'water' && (!session || session.engine.isRunning())) B.sound.startWater();
      }
      btn.setAttribute('aria-pressed', String(!wasOn)); btn.textContent = wasOn ? s.soundOff : s.soundOn;
    },
    cal: function () { readSetup(); download('hadva-reminders.ics', 'text/calendar;charset=utf-8', buildIcs()); toast(t().calDone); go('/'); },
    noCal: function () { readSetup(); go('/'); },
    startChallenge: function () {
      readSetup(); chDraft = null;
      if (!state.settings.level) state.settings.level = 'nefesh';
      save(); B.sound.prime(); pendingBreaths = null; pendingKind = 'full'; go('/practice');
    },
    calOnly: function () { var keep = grabTimes(); readSetup(); chDraft = keep; download('neshima-reminders.ics', 'text/calendar;charset=utf-8', buildIcs()); toast(t().calDone); },
    joinNow: function () {
      if (!state.challenge) { state.challenge = { start: dateKey(new Date()), times: ['07:30', '13:00', '21:30'], on: [true, true, true] }; save(); }
      go('/');
    },
    saveCopy: function () { download('hadva-reflection.txt', 'text/plain;charset=utf-8', state.reflection); },
    teamPrep: function () {
      var s = t(); if (!state.team.note.trim()) { toast(s.teamEmpty); return; }
      var msg = teamMessage();
      if (CFG.feedbackEmail) { location.href = 'mailto:' + CFG.feedbackEmail + '?subject=' + encodeURIComponent('NESHIMA') + '&body=' + encodeURIComponent(msg); return; }
      if (navigator.share) { navigator.share({ text: msg }).catch(function () { /* cancelled */ }); return; }
      if (navigator.clipboard) navigator.clipboard.writeText(msg).then(function () { toast(s.teamCopied); });
    },
    share: function () {
      var msg = shareMessage();
      cardBlob(function (blob) {
        var file = blob && window.File ? new File([blob], 'hadva.png', { type: 'image/png' }) : null;
        var data = { text: msg };
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) data.files = [file];
        navigator.share(data).then(passed).catch(function () { /* cancelled */ });
      });
    },
    copyText: function () { if (navigator.clipboard) navigator.clipboard.writeText(shareMessage()).then(function () { passed(); toast(t().copied); }); },
    saveImg: function () { cardBlob(function (blob) { if (blob) download('hadva.png', 'image/png', blob); }); },
    export: function () { download('hadva-my-data.json', 'application/json', JSON.stringify(state, null, 2)); },
    wipe: function () {
      if (!window.confirm(t().deleteConfirm)) return;
      var lang = state.lang;
      try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
      state = fresh(); state.lang = lang; save(); lastDone = null;
      toast(t().deleted); go('/');
    }
  };

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-wa]')) { passed(); return; }   // a send was opened: one more vav
    var el = e.target.closest('[data-act],[data-set],[data-feel],[data-leaf]');
    if (!el) return;
    if (el.dataset.leaf) { leafDay = +el.dataset.leaf; render(true); return; }
    if (el.dataset.act) { acts[el.dataset.act](); return; }
    if (el.dataset.feel) {
      if (lastDone && lastDone.idx >= 0) { lastDone.feel = el.dataset.feel; state.sessions[lastDone.idx].feel = el.dataset.feel; save(); render(true); }
      return;
    }
    var kv = el.dataset.set.split(':'), k = kv[0], v = kv[1];
    var gt = grabTimes(); if (gt) chDraft = gt;
    if (k === 'lang') state.lang = v;
    else if (k === 'breaths') { state.settings.breaths = +v; pendingBreaths = null; }
    else if (k === 'large') state.settings.large = v === '1';
    else state.settings[k] = v;
    save(); render(true);
  });
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el.name === 'rhythm') { state.settings.rhythm = el.value; save(); render(true); var again = main.querySelector('input[name="rhythm"]:checked'); if (again) again.focus(); }
    else if (el.dataset.toggle) { state.settings[el.dataset.toggle] = el.checked; save(); }
    else if (el.dataset.team) { state.team[el.dataset.team] = el.checked; save(); }
  });
  document.addEventListener('input', function (e) {
    var el = e.target;
    if (el.id === 'reflection') { state.reflection = el.value; save(); }
    else if (el.id === 'testimony') { state.testimony = el.value; save(); }
    else if (el.id === 'teamNote') { state.team.note = el.value; save(); }
    else if (el.id === 'teamName') { state.team.name = el.value; save(); }
    else if (el.id === 'inviteName') { state.inviteName = el.value; save(); document.getElementById('msg').textContent = shareMessage(); var wb = document.getElementById('waBtn'); if (wb) wb.href = waUrl(); }
  });
  document.addEventListener('visibilitychange', function () {
    if (!session) return;
    if (document.hidden) { if (session.engine.isRunning() && session.kind !== 'moment') acts.pause(); else if (session.kind === 'moment') session.engine.pause(); }
    else { B.keepAwake(true); if (session.kind === 'moment') session.engine.resume(); }
  });
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.addEventListener) mq.addEventListener('change', applyPrefs);
  }

  render();
})();
