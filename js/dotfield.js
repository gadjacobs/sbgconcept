/* ============================================================
   SBG CONCEPT — hero dot field
   A grid of dots that behaves like a broadcast: pulses radiate from a
   source point (visibility), the pointer pushes and lights dots (engagement),
   clicking fires your own pulse.
   ============================================================ */
(function () {
  "use strict";

  function init(canvas, opts) {
    opts = opts || {};
    var ctx = canvas.getContext("2d");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, step = 26, cols = 0, rows = 0;
    var pulses = [];
    var pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    var running = false, visible = true, raf = 0, lastAuto = 0, t0 = performance.now();

    var GOLD = [255, 180, 0], PAPER = [243, 236, 220], DIM = [120, 150, 220];

    function resize() {
      var r = canvas.getBoundingClientRect();
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      step = w < 640 ? 20 : w < 1100 ? 24 : 28;
      cols = Math.ceil(w / step) + 1; rows = Math.ceil(h / step) + 1;
      if (!running) frame(performance.now());
    }

    function source() {
      return opts.source ? opts.source(w, h) : [w * 0.74, h * 0.5];
    }
    function pulse(x, y, strong) {
      pulses.push({ x: x, y: y, t: performance.now(), s: strong ? 1 : 0.7 });
      if (pulses.length > 6) pulses.shift();
    }

    function frame(now) {
      ctx.clearRect(0, 0, w, h);
      var i, j, p;

      // auto-broadcast from the source
      if (!reduce && now - lastAuto > 3600) {
        var s = source(); pulse(s[0], s[1], false); lastAuto = now;
      }
      // ease pointer
      pointer.x += (pointer.tx - pointer.x) * 0.16;
      pointer.y += (pointer.ty - pointer.y) * 0.16;

      // prune dead pulses
      for (i = pulses.length - 1; i >= 0; i--) {
        if (now - pulses[i].t > 3800) pulses.splice(i, 1);
      }

      var px = pointer.x, py = pointer.y, pr = 170;
      var speed = 0.26; // px per ms
      var band = 70;

      for (j = 0; j < rows; j++) {
        var by = j * step + ((j % 2) ? step * 0.5 : 0) * 0;
        for (i = 0; i < cols; i++) {
          var bx = i * step + ((j % 2) ? step * 0.5 : 0);
          var inten = 0, dx = 0, dy = 0;

          for (var k = 0; k < pulses.length; k++) {
            p = pulses[k];
            var age = now - p.t;
            var ddx = bx - p.x, ddy = by - p.y;
            var d = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
            var rad = age * speed;
            var e = (d - rad) / band;
            var amt = Math.exp(-e * e) * (1 - age / 3800) * p.s;
            if (amt > 0.001) {
              inten += amt;
              dx += (ddx / d) * amt * 7; dy += (ddy / d) * amt * 7;
            }
          }

          var near = 0;
          if (pointer.active || px > -999) {
            var cx = bx - px, cy = by - py, cd = Math.sqrt(cx * cx + cy * cy);
            if (cd < pr) {
              near = 1 - cd / pr; near *= near;
              dx += (cx / (cd || 1)) * near * 16; dy += (cy / (cd || 1)) * near * 16;
            }
          }

          var lvl = Math.min(1, inten + near * 0.9);
          var r = 1.15 + inten * 2.6 + near * 2.4;
          var col = lvl > 0.5 ? PAPER : GOLD;
          var a = 0.14 + lvl * 0.86;
          var rr = DIM[0] + (col[0] - DIM[0]) * Math.min(1, lvl * 1.4);
          var gg = DIM[1] + (col[1] - DIM[1]) * Math.min(1, lvl * 1.4);
          var bb = DIM[2] + (col[2] - DIM[2]) * Math.min(1, lvl * 1.4);
          ctx.fillStyle = "rgba(" + (rr | 0) + "," + (gg | 0) + "," + (bb | 0) + "," + a.toFixed(3) + ")";
          ctx.beginPath();
          ctx.arc(bx + dx, by + dy, r, 0, 6.2832);
          ctx.fill();
        }
      }
    }

    function loop(now) {
      if (!running) return;
      frame(now);
      raf = requestAnimationFrame(loop);
    }
    function start() { if (running || reduce || !visible) return; running = true; raf = requestAnimationFrame(loop); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    // events
    var host = opts.host || canvas.parentElement;
    host.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - r.left; pointer.ty = e.clientY - r.top;
      if (!pointer.active) { pointer.x = pointer.tx; pointer.y = pointer.ty; }
      pointer.active = true;
    }, { passive: true });
    host.addEventListener("pointerleave", function () {
      pointer.active = false; pointer.tx = pointer.ty = -9999;
    });
    host.addEventListener("pointerdown", function (e) {
      if (e.target.closest("a, button, input, textarea, select")) return;
      var r = canvas.getBoundingClientRect();
      pulse(e.clientX - r.left, e.clientY - r.top, true);
    });

    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas); else window.addEventListener("resize", resize);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
        if (visible) start(); else stop();
      }, { threshold: 0 }).observe(canvas);
    }
    document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });

    resize();
    if (reduce) { pulse(source()[0], source()[1], true); pulses[0].t = performance.now() - 1400; frame(performance.now()); }
    else { var s0 = source(); pulse(s0[0], s0[1], true); start(); }

    return { pulse: pulse };
  }

  window.SBGDotfield = { init: init };
})();
