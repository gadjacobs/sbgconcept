/* ============================================================
   SBG CONCEPT — generative poster art
   Draws the covers for projects that don't have a real photo yet.
   Deterministic per project (seeded), so a cover never changes between visits.
   ============================================================ */
(function () {
  "use strict";

  var W = 900, H = 1125; // internal resolution, 4:5

  var PALETTES = {
    gold:  { bg: "#FFB400", fg: "#07142E", hi: "#F3ECDC", pop: "#FF4B1F" },
    flare: { bg: "#FF4B1F", fg: "#07142E", hi: "#F3ECDC", pop: "#FFB400" },
    paper: { bg: "#F3ECDC", fg: "#07142E", hi: "#FFB400", pop: "#FF4B1F" },
    navy:  { bg: "#07142E", fg: "#FFB400", hi: "#F3ECDC", pop: "#FF4B1F" }
  };

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    var a = seed;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- helpers ---------- */
  function halftone(ctx, x0, y0, x1, y1, step, color, valueFn) {
    ctx.fillStyle = color;
    var row = 0;
    for (var y = y0; y < y1; y += step * 0.866, row++) {
      var off = (row % 2) * step * 0.5;
      for (var x = x0 + off; x < x1; x += step) {
        var v = valueFn(x, y);
        if (v <= 0.04) continue;
        ctx.beginPath();
        ctx.arc(x, y, Math.min(v, 1) * step * 0.52, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  function pt(cx, cy, r, a) { return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; }
  function grain(ctx, rand, n, color) {
    ctx.fillStyle = color;
    for (var i = 0; i < n; i++) {
      ctx.globalAlpha = 0.06 + rand() * 0.14;
      ctx.fillRect(rand() * W, rand() * H, 1 + rand() * 2, 1 + rand() * 2);
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- styles ---------- */
  var styles = {
    /* retro halftone sun, slatted */
    sun: function (ctx, P, rand) {
      var cx = W * 0.5, cy = H * 0.44, R = W * 0.36;
      halftone(ctx, 0, 0, W, H, 30, P.hi, function (x, y) {
        var d = Math.hypot(x - cx, y - cy) / (R * 2.3);
        return Math.max(0, 0.9 - d) * 0.9;
      });
      ctx.fillStyle = P.fg;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
      // slats cut into lower half
      ctx.fillStyle = P.bg;
      for (var i = 0; i < 7; i++) {
        var y = cy + R * 0.12 + i * R * 0.15;
        ctx.fillRect(cx - R - 4, y, R * 2 + 8, 5 + i * 3);
      }
      // inner glow disc
      ctx.fillStyle = P.pop;
      ctx.beginPath(); ctx.arc(cx - R * 0.28, cy - R * 0.3, R * 0.2, 0, Math.PI * 2); ctx.fill();
      // ground stripes
      for (var j = 0; j < 9; j++) {
        ctx.fillStyle = j % 2 ? P.fg : P.hi;
        ctx.fillRect(0, H * 0.78 + j * 26, W, 10 + j * 1.5);
      }
    },

    /* market umbrella, seen from above */
    umbrella: function (ctx, P, rand) {
      var cx = W * 0.5, cy = H * 0.46, R = W * 0.43, N = 12, s = (Math.PI * 2) / N;
      halftone(ctx, 0, 0, W, H, 26, P.pop, function (x, y) {
        return Math.max(0, (y / H - 0.55)) * 1.4 * (0.5 + 0.5 * Math.sin(x * 0.02));
      });
      // shadow
      ctx.fillStyle = "rgba(0,0,0,.28)";
      ctx.beginPath(); ctx.arc(cx + 26, cy + 30, R * 0.98, 0, Math.PI * 2); ctx.fill();
      for (var i = 0; i < N; i++) {
        var a0 = i * s - Math.PI / 2, a1 = a0 + s, am = a0 + s / 2;
        var p0 = pt(cx, cy, R, a0), p1 = pt(cx, cy, R, a1), c = pt(cx, cy, R * 0.84, am);
        ctx.fillStyle = i % 2 ? P.hi : P.pop;
        if (i % 4 === 0) ctx.fillStyle = P.fg;
        ctx.beginPath();
        ctx.moveTo(cx, cy); ctx.lineTo(p0[0], p0[1]);
        ctx.quadraticCurveTo(c[0], c[1], p1[0], p1[1]);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = P.fg; ctx.lineWidth = 3; ctx.stroke();
      }
      ctx.fillStyle = P.bg; ctx.strokeStyle = P.fg; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(cx, cy, 34, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = P.fg;
      ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fill();
    },

    /* textile-inspired tile pattern */
    blocks: function (ctx, P, rand) {
      var cols = 4, rows = 5, cw = W / cols, ch = H / rows;
      var cols3 = [P.fg, P.hi, P.pop, P.bg];
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var x = c * cw, y = r * ch, cx = x + cw / 2, cy = y + ch / 2;
          var m = Math.floor(rand() * 5);
          var bgc = cols3[(r + c) % 2 ? 3 : 1];
          ctx.fillStyle = bgc; ctx.fillRect(x, y, cw, ch);
          var a = cols3[Math.floor(rand() * 3)], b = cols3[Math.floor(rand() * 4)];
          if (a === bgc) a = P.fg;
          if (b === a) b = P.bg;
          var rad = Math.min(cw, ch) * 0.42;
          if (m === 0) { // concentric
            for (var k = 4; k >= 1; k--) { ctx.fillStyle = k % 2 ? a : b; ctx.beginPath(); ctx.arc(cx, cy, rad * k / 4, 0, 6.3); ctx.fill(); }
          } else if (m === 1) { // diamond
            ctx.fillStyle = a; ctx.beginPath(); ctx.moveTo(cx, cy - rad); ctx.lineTo(cx + rad, cy); ctx.lineTo(cx, cy + rad); ctx.lineTo(cx - rad, cy); ctx.fill();
            ctx.fillStyle = b; ctx.beginPath(); ctx.arc(cx, cy, rad * 0.35, 0, 6.3); ctx.fill();
          } else if (m === 2) { // quarter fans
            for (var q = 0; q < 4; q++) {
              ctx.fillStyle = q % 2 ? a : b;
              ctx.beginPath(); ctx.moveTo(x + (q % 2) * cw, y + (q > 1 ? ch : 0));
              ctx.arc(x + (q % 2) * cw, y + (q > 1 ? ch : 0), cw * 0.5, 0, 6.3); ctx.fill();
            }
          } else if (m === 3) { // bars
            for (var i = 0; i < 5; i++) { ctx.fillStyle = i % 2 ? a : b; ctx.fillRect(x + (i * cw) / 5, y, cw / 5 + 1, ch); }
            ctx.fillStyle = bgc; ctx.beginPath(); ctx.arc(cx, cy, rad * 0.5, 0, 6.3); ctx.fill();
          } else { // dots
            ctx.fillStyle = a;
            for (var i2 = 0; i2 < 3; i2++) for (var j2 = 0; j2 < 3; j2++) { ctx.beginPath(); ctx.arc(x + cw * (0.2 + i2 * 0.3), y + ch * (0.2 + j2 * 0.3), cw * 0.07, 0, 6.3); ctx.fill(); }
          }
        }
      }
    },

    /* sound / engagement waveform */
    wave: function (ctx, P, rand) {
      var n = 21, gap = W / (n + 1), bw = gap * 0.56, cy = H * 0.5;
      var f1 = 0.6 + rand() * 0.6, f2 = 1.4 + rand() * 1.1, ph = rand() * 6;
      halftone(ctx, 0, 0, W, H, 34, P.hi, function (x, y) {
        return Math.max(0, 1 - Math.abs(y - cy) / (H * 0.55)) * 0.55;
      });
      for (var i = 0; i < n; i++) {
        var t = (i + 1) / (n + 1);
        var amp = (Math.sin(t * Math.PI) * 0.55 + 0.12) * (0.55 + 0.45 * Math.abs(Math.sin(i * f1 + ph) * Math.cos(i * f2)));
        var h = amp * H * 0.78, x = gap * (i + 1);
        ctx.fillStyle = i % 5 === 2 ? P.pop : P.fg;
        var r = bw / 2;
        ctx.beginPath();
        ctx.moveTo(x - r, cy - h / 2 + r); ctx.arc(x, cy - h / 2 + r, r, Math.PI, 0);
        ctx.lineTo(x + r, cy + h / 2 - r); ctx.arc(x, cy + h / 2 - r, r, 0, Math.PI);
        ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = P.pop;
      ctx.beginPath(); ctx.arc(W * 0.84, H * 0.14, 38, 0, 6.3); ctx.fill();
    },

    /* broadcast rings — the brand's signal */
    rings: function (ctx, P, rand) {
      var cx = W * 0.22, cy = H * 0.72;
      halftone(ctx, 0, 0, W, H, 28, P.fg, function (x, y) {
        var d = Math.hypot(x - cx, y - cy) / (W * 1.15);
        return Math.max(0, d - 0.18) * 0.8;
      });
      for (var i = 9; i >= 1; i--) {
        var r = i * 108;
        ctx.lineWidth = 3 + (10 - i) * 2.2;
        ctx.strokeStyle = i % 3 === 0 ? P.pop : P.fg;
        if (i % 2 === 0) ctx.setLineDash([r * 0.5, 22 + i * 4]); else ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI * 0.92, -Math.PI * 0.02); ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.fillStyle = P.fg; ctx.beginPath(); ctx.arc(cx, cy, 42, 0, 6.3); ctx.fill();
      ctx.fillStyle = P.bg; ctx.beginPath(); ctx.arc(cx, cy, 16, 0, 6.3); ctx.fill();
    },

    /* data / field-map grid */
    grid: function (ctx, P, rand) {
      var cols = 12, rows = 15, g = W / cols, ox = rand() * 10, oy = rand() * 10;
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var x = g * (c + 0.5), y = g * (r + 0.5) + 18;
          var v = 0.5 + 0.5 * Math.sin((c + ox) * 0.7) * Math.cos((r + oy) * 0.55) + (rand() - 0.5) * 0.25;
          v = Math.max(0.08, Math.min(1, v));
          ctx.fillStyle = v > 0.86 ? P.pop : P.fg;
          ctx.beginPath(); ctx.arc(x, y, g * 0.46 * v, 0, 6.3); ctx.fill();
        }
      }
      // crosshair on a "hot" cell
      var hx = g * 6.5, hy = g * 7.5 + 18;
      ctx.strokeStyle = P.hi; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(hx, hy, g * 1.1, 0, 6.3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hx - g * 1.7, hy); ctx.lineTo(hx + g * 1.7, hy); ctx.moveTo(hx, hy - g * 1.7); ctx.lineTo(hx, hy + g * 1.7); ctx.stroke();
      ctx.fillStyle = P.hi; ctx.font = "500 22px 'DM Mono', monospace";
      ctx.fillText("9.0765°N  7.3986°E", 36, H - 40);
    }
  };

  /* ---------- public API ---------- */
  function draw(canvas, project) {
    var P = PALETTES[project.accent] || PALETTES.gold;
    var rand = rng(hash(project.slug || project.title || "sbg"));
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
    (styles[project.art] || styles.rings)(ctx, P, rand);
    grain(ctx, rand, 2600, P.fg === "#FFB400" ? "#F3ECDC" : "#07142E");
    return canvas;
  }

  /* a looser tile for gallery fillers (crops/zooms of the cover art) */
  function tile(canvas, project, variant) {
    var base = document.createElement("canvas");
    draw(base, project);
    var w = 900, h = 700;
    canvas.width = w; canvas.height = h;
    var ctx = canvas.getContext("2d");
    var rand = rng(hash(project.slug + ":" + variant));
    var sw = W * (0.45 + rand() * 0.3), sh = sw * (h / w);
    var sx = rand() * (W - sw), sy = rand() * (H - sh);
    ctx.drawImage(base, sx, sy, sw, sh, 0, 0, w, h);
    return canvas;
  }

  window.SBGArt = { draw: draw, tile: tile, palettes: PALETTES };
})();
