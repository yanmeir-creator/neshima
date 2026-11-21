/* Breath engine and sound. No dependencies.
   - Engine: a clock over a list of phases, driven by requestAnimationFrame.
   - Sound: everything is synthesised in the browser with Web Audio. There are no
     audio files, no recordings, and no verbal or hidden content of any kind. */
(function () {
  'use strict';

  // The proportion 8·4·6·5 (in, linger, out, rest). `unit` scales it to seconds.
  var PROPORTION = { in: 8, linger: 4, out: 6, rest: 5 };
  var UNITS = [0.35, 0.42, 0.5, 0.6, 0.7, 0.85, 1];

  function phasesFor(rhythm, unit) {
    if (rhythm === 'own') return [];
    if (rhythm === 'moment') return [{ key: 'in', seconds: 4 }, { key: 'out', seconds: 6 }];
    var p = [{ key: 'in', seconds: PROPORTION.in * unit }];
    if (rhythm === 'hadva') p.push({ key: 'linger', seconds: PROPORTION.linger * unit });
    p.push({ key: 'out', seconds: PROPORTION.out * unit });
    if (rhythm === 'hadva') p.push({ key: 'rest', seconds: PROPORTION.rest * unit });
    return p;
  }

  function cycleSeconds(phases) {
    return phases.reduce(function (a, p) { return a + p.seconds; }, 0);
  }

  /* opts: { phases, total (seconds or null for open-ended), onFrame(state), onPhase(key), onDone(elapsed) } */
  function createEngine(opts) {
    var phases = opts.phases, total = opts.total;
    var elapsed = 0, last = 0, raf = 0, running = false, finished = false;
    var cyclePos = 0, phaseIdx = -1, finishing = false;

    function locate() {
      var acc = 0;
      for (var i = 0; i < phases.length; i++) {
        if (cyclePos < acc + phases[i].seconds) return { i: i, into: cyclePos - acc };
        acc += phases[i].seconds;
      }
      return { i: 0, into: 0 };
    }

    function frame(now) {
      if (!running) return;
      var dt, ext = opts.clock ? opts.clock() : null;
      if (ext !== null) {
        // Driven by an outside clock (the guided track): wait while it has not started.
        if (ext < 0) { raf = requestAnimationFrame(frame); return; }
        dt = Math.max(0, ext - elapsed);
      } else dt = Math.min((now - last) / 1000, 1.5); // tolerate slow frames, but never jump after a long stall
      last = now;
      elapsed += dt;
      var state = { elapsed: elapsed, total: total, remaining: total ? Math.max(0, total - elapsed) : null };
      if (phases.length) {
        var cyc = cycleSeconds(phases);
        cyclePos += dt;
        var wrapped = false;
        while (cyclePos >= cyc) { cyclePos -= cyc; wrapped = true; }
        // Finish on a completed breath, never in the middle of one.
        if (total && elapsed >= total) finishing = true;
        if (finishing && wrapped) { done(); return; }
        var loc = locate();
        if (loc.i !== phaseIdx) { phaseIdx = loc.i; if (opts.onPhase) opts.onPhase(phases[loc.i].key, phases[loc.i].seconds); }
        var ph = phases[loc.i];
        state.phase = ph.key;
        state.phaseIndex = loc.i;
        state.progress = ph.seconds ? loc.into / ph.seconds : 1;
        state.phaseLeft = ph.seconds - loc.into;
        state.cycleProgress = cyclePos / cyc;
      } else {
        state.phase = 'own';
        if (total && elapsed >= total) { done(); return; }
      }
      if (opts.onFrame) opts.onFrame(state);
      raf = requestAnimationFrame(frame);
    }

    function done() {
      running = false; finished = true;
      cancelAnimationFrame(raf);
      if (opts.onDone) opts.onDone(elapsed);
    }

    return {
      start: function () { if (finished) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); },
      pause: function () { running = false; cancelAnimationFrame(raf); },
      resume: function () { if (finished || running) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); },
      stop: function () { running = false; finished = true; cancelAnimationFrame(raf); return elapsed; },
      isRunning: function () { return running; },
      elapsed: function () { return elapsed; },
      // Change pace mid-session: keep the place within the current phase.
      setPhases: function (next) {
        var loc = phases.length ? locate() : { i: 0, into: 0 };
        var frac = phases.length && phases[loc.i].seconds ? loc.into / phases[loc.i].seconds : 0;
        var key = phases.length ? phases[loc.i].key : null;
        phases = next;
        var acc = 0, found = false;
        for (var i = 0; i < phases.length; i++) {
          if (phases[i].key === key) { cyclePos = acc + frac * phases[i].seconds; phaseIdx = i; found = true; break; }
          acc += phases[i].seconds;
        }
        if (!found) { cyclePos = 0; phaseIdx = -1; }
      }
    };
  }

  /* ---------- Sound ---------- */
  var ctx = null, master = null, waterNodes = null;

  function ensureCtx() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function noiseBuffer(seconds, brown) {
    var len = Math.floor(ctx.sampleRate * seconds);
    var buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var ch = 0; ch < 2; ch++) {
      var d = buf.getChannelData(ch), lastV = 0;
      for (var i = 0; i < len; i++) {
        var w = Math.random() * 2 - 1;
        if (brown) { lastV = (lastV + 0.02 * w) / 1.02; d[i] = lastV * 3.2; }
        else d[i] = w;
      }
      // Crossfade the loop seam so it does not click.
      var fade = Math.floor(ctx.sampleRate * 0.25);
      for (var j = 0; j < fade; j++) {
        var t = j / fade;
        d[j] = d[j] * t + d[len - fade + j] * (1 - t);
      }
    }
    return buf;
  }

  function lfo(freq, depth, param) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = freq; g.gain.value = depth;
    o.connect(g); g.connect(param); o.start();
    return o;
  }

  // "Soft water": a low, steady wash plus a faint, slowly drifting trickle. No pulse, no melody.
  function startWater() {
    if (!ensureCtx() || waterNodes) return;
    var out = ctx.createGain();
    out.gain.value = 0;
    out.connect(master);

    var wash = ctx.createBufferSource();
    wash.buffer = noiseBuffer(7, true); wash.loop = true;
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 620; lp.Q.value = 0.3;
    var washGain = ctx.createGain(); washGain.gain.value = 0.5;
    wash.connect(lp); lp.connect(washGain); washGain.connect(out);

    var trickle = ctx.createBufferSource();
    trickle.buffer = noiseBuffer(5, false); trickle.loop = true;
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2100; bp.Q.value = 0.9;
    var trickleGain = ctx.createGain(); trickleGain.gain.value = 0.035;
    trickle.connect(bp); bp.connect(trickleGain); trickleGain.connect(out);

    var oscs = [
      lfo(0.07, 0.12, washGain.gain),
      lfo(0.11, 0.018, trickleGain.gain),
      lfo(0.05, 420, bp.frequency),
      lfo(0.031, 90, lp.frequency)
    ];
    wash.start(); trickle.start();
    out.gain.setTargetAtTime(0.5, ctx.currentTime, 1.2); // slow fade in
    waterNodes = { out: out, sources: [wash, trickle], oscs: oscs };
  }

  function stopWater() {
    if (!waterNodes || !ctx) return;
    var n = waterNodes; waterNodes = null;
    n.out.gain.setTargetAtTime(0, ctx.currentTime, 0.35);
    setTimeout(function () {
      n.sources.concat(n.oscs).forEach(function (s) { try { s.stop(); } catch (e) { /* already stopped */ } });
      try { n.out.disconnect(); } catch (e) { /* ignore */ }
    }, 1600);
  }

  // A soft swell that rises on the in-breath and falls on the out-breath. No clicks.
  function cue(kind, seconds) {
    if (!ensureCtx()) return;
    if (kind !== 'in' && kind !== 'out') return;
    var dur = Math.max(1.2, Math.min(seconds || 3, 6));
    var now = ctx.currentTime;
    var from = kind === 'in' ? 196 : 261.6, to = kind === 'in' ? 261.6 : 196;
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(from, now);
    o.frequency.linearRampToValueAtTime(to, now + dur);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.07, now + dur * 0.35);
    g.gain.linearRampToValueAtTime(0.0001, now + dur);
    o.connect(g); g.connect(master);
    o.start(now); o.stop(now + dur + 0.05);
  }

  var drone = null;
  function droneStart() {
    if (!ensureCtx() || drone) return;
    var g = ctx.createGain(); g.gain.value = 0; g.connect(master);
    var o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = 110;
    var o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 164.8;
    var g2 = ctx.createGain(); g2.gain.value = 0.4;
    var n = ctx.createBufferSource(); n.buffer = noiseBuffer(4, true); n.loop = true;
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 300;
    var gn = ctx.createGain(); gn.gain.value = 0.55;
    o1.connect(g); o2.connect(g2); g2.connect(g); n.connect(lp); lp.connect(gn); gn.connect(g);
    o1.start(); o2.start(); n.start();
    drone = { g: g, nodes: [o1, o2, n, lfo(0.5, 2.5, o2.frequency)] };
  }
  function droneLevel(v) { if (drone) drone.g.gain.setTargetAtTime(Math.max(0, Math.min(1, v)) * 0.42, ctx.currentTime, 0.18); }
  function droneStop() {
    if (!drone || !ctx) return;
    var d = drone; drone = null;
    d.g.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
    setTimeout(function () { d.nodes.forEach(function (x) { try { x.stop(); } catch (e) { /* already stopped */ } }); try { d.g.disconnect(); } catch (e) { /* ignore */ } }, 1900);
  }

  /* ---------- The guided track ----------
     One whole session rendered ahead of time and played through an <audio> element, so it
     carries on with the screen off or the phone in a pocket. Per breath: a brighter hiss
     rising (in, through the nose), silence, a lower, wider hiss falling (out, through the
     mouth), silence — over a very quiet held chord, with a soft tone at the start and end.
     Everything is synthesised here; no recording, no words. */
  var guideEl = null, guideUrl = null, LEAD = 2, TAIL = 4;
  function wavBlob(data, rate) {
    var n = data.length, b = new ArrayBuffer(44 + n * 2), v = new DataView(b);
    function str(o, s) { for (var i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); }
    str(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); str(8, 'WAVE'); str(12, 'fmt '); v.setUint32(16, 16, true);
    v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true);
    v.setUint16(32, 2, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, n * 2, true);
    for (var i = 0; i < n; i++) { var x = Math.max(-1, Math.min(1, data[i])); v.setInt16(44 + i * 2, x * 32767, true); }
    return new Blob([b], { type: 'audio/wav' });
  }
  function setSrc(blob) {
    if (guideUrl) URL.revokeObjectURL(guideUrl);
    guideUrl = URL.createObjectURL(blob); guideEl.src = guideUrl;
  }
  // Call inside a tap: phones only let an audio element play later if it was first played by a touch.
  function prime() {
    try {
      if (!guideEl) { guideEl = new Audio(); guideEl.preload = 'auto'; }
      guideEl.onended = null; guideEl.muted = false;
      setSrc(wavBlob(new Float32Array(2205), 22050));
      var p = guideEl.play(); if (p && p.catch) p.catch(function () { /* not allowed yet */ });
    } catch (e) { /* no audio element */ }
  }
  function guide(phases, breaths, title, withCue) {
    var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OAC || !phases.length) return Promise.reject(new Error('no offline audio'));
    if (!guideEl) { guideEl = new Audio(); guideEl.preload = 'auto'; }
    var cyc = cycleSeconds(phases), len = LEAD + cyc * breaths + TAIL, rate = len > 400 ? 16000 : 22050;
    var oc = new OAC(1, Math.ceil(len * rate), rate);
    var nb = oc.createBuffer(1, rate * 3, rate), d = nb.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    var src = oc.createBufferSource(); src.buffer = nb; src.loop = true;
    // in, through the nose: narrow and bright
    var bi = oc.createBiquadFilter(); bi.type = 'bandpass'; bi.Q.value = 0.9; bi.frequency.value = 1100;
    var hi = oc.createBiquadFilter(); hi.type = 'highpass'; hi.frequency.value = 500;
    var gi = oc.createGain(); gi.gain.value = 0;
    src.connect(bi); bi.connect(hi); hi.connect(gi); gi.connect(oc.destination);
    // out, through the mouth: wide and low
    var be = oc.createBiquadFilter(); be.type = 'bandpass'; be.Q.value = 0.5; be.frequency.value = 800;
    var le = oc.createBiquadFilter(); le.type = 'lowpass'; le.frequency.value = 1800;
    var ge = oc.createGain(); ge.gain.value = 0;
    src.connect(be); be.connect(le); le.connect(ge); ge.connect(oc.destination);
    // the held chord
    var pad = oc.createGain(); pad.gain.value = 0; pad.connect(oc.destination);
    [146.83, 220, 293.66, 329.63].forEach(function (f, k) {
      var o = oc.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      var g = oc.createGain(), base = [0.5, 0.34, 0.2, 0.1][k]; g.gain.value = base;
      var l = oc.createOscillator(); l.frequency.value = 0.05 + 0.023 * k;
      var lg = oc.createGain(); lg.gain.value = base * 0.45;
      l.connect(lg); lg.connect(g.gain); o.connect(g); g.connect(pad); o.start(0); l.start(0);
    });
    function bell(at) {
      var o = oc.createOscillator(); o.type = 'sine'; o.frequency.value = 587.33;
      var g = oc.createGain(); g.gain.setValueAtTime(0.0001, at); g.gain.linearRampToValueAtTime(0.11, at + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 2.6);
      o.connect(g); g.connect(oc.destination); o.start(at); o.stop(at + 2.7);
    }
    // The soft tone at each turn of the breath: rising as it comes in, falling as it goes out.
    function tone(at, s, up) {
      var dur = Math.max(1.2, Math.min(s, 6)), o = oc.createOscillator(), g = oc.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(up ? 196 : 261.6, at); o.frequency.linearRampToValueAtTime(up ? 261.6 : 196, at + dur);
      g.gain.setValueAtTime(0.0001, at); g.gain.linearRampToValueAtTime(0.07, at + dur * 0.35); g.gain.linearRampToValueAtTime(0.0001, at + dur);
      o.connect(g); g.connect(oc.destination); o.start(at); o.stop(at + dur + 0.05);
    }
    var t = LEAD, padNow = 0.08;
    pad.gain.setValueAtTime(0, 0); pad.gain.linearRampToValueAtTime(padNow, LEAD);
    for (var b = 0; b < breaths; b++) {
      for (var p = 0; p < phases.length; p++) {
        var ph = phases[p], s = ph.seconds;
        pad.gain.setValueAtTime(padNow, t);
        if (withCue && (ph.key === 'in' || ph.key === 'out')) tone(t, s, ph.key === 'in');
        if (ph.key === 'in') {
          gi.gain.setValueAtTime(0.0001, t); gi.gain.linearRampToValueAtTime(0.17, t + s * 0.6); gi.gain.linearRampToValueAtTime(0.0001, t + s);
          bi.frequency.setValueAtTime(900, t); bi.frequency.linearRampToValueAtTime(2000, t + s);
          padNow = 0.12; pad.gain.linearRampToValueAtTime(padNow, t + s);
        } else if (ph.key === 'out') {
          ge.gain.setValueAtTime(0.0001, t); ge.gain.linearRampToValueAtTime(0.21, t + Math.min(0.5, s * 0.15)); ge.gain.linearRampToValueAtTime(0.0001, t + s);
          be.frequency.setValueAtTime(1100, t); be.frequency.linearRampToValueAtTime(450, t + s);
          padNow = 0.07; pad.gain.linearRampToValueAtTime(padNow, t + s);
        }
        t += s;
      }
    }
    pad.gain.setValueAtTime(padNow, t); pad.gain.linearRampToValueAtTime(0, len - 0.2);
    bell(0.3); bell(t + 0.3);
    src.start(0);
    return oc.startRendering().then(function (buf) {
      guideEl.onended = null; guideEl.muted = false;
      setSrc(wavBlob(buf.getChannelData(0), rate));
      if ('mediaSession' in navigator && window.MediaMetadata) {
        try { navigator.mediaSession.metadata = new MediaMetadata({ title: title || '' }); } catch (e) { /* ignore */ }
      }
      return { el: guideEl, lead: LEAD, seconds: len, stop: function () { guideEl.onended = null; try { guideEl.pause(); } catch (e) { /* ignore */ } } };
    });
  }

  /* ---------- Screen wake lock (best effort) ---------- */
  var wake = null;
  function keepAwake(on) {
    if (!('wakeLock' in navigator)) return;
    if (on) {
      navigator.wakeLock.request('screen').then(function (w) { wake = w; }).catch(function () { /* not granted */ });
    } else if (wake) {
      wake.release().catch(function () { /* ignore */ });
      wake = null;
    }
  }

  window.NeshimaBreath = {
    UNITS: UNITS,
    phasesFor: phasesFor,
    cycleSeconds: cycleSeconds,
    createEngine: createEngine,
    sound: { unlock: ensureCtx, startWater: startWater, stopWater: stopWater, cue: cue, droneStart: droneStart, droneLevel: droneLevel, droneStop: droneStop, prime: prime, guide: guide },
    keepAwake: keepAwake
  };
})();
