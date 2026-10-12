/* ============================================================
   SBG CONCEPT — shared behaviour (all pages)
   smooth scroll · header theme · menu · cursor · progress · text helpers
   ============================================================ */
(function () {
  "use strict";

  var html = document.documentElement;
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (/[?&]motion=1/.test(location.search)) reduce = false; // testing override: ?motion=1
  var fine = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  if (reduce) html.classList.add("reduce");
  // If the animation library failed to load, never leave content hidden.
  if (!window.gsap) html.classList.remove("js");

  var S = (window.SBG = { reduce: reduce, fine: fine, lenis: null });

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Abuja clock ---------- */
  var clockEl = document.getElementById("clock");
  if (clockEl) {
    var fmt = null;
    try { fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", hour: "2-digit", minute: "2-digit", hour12: false }); } catch (e) {}
    var tick = function () { clockEl.textContent = "Abuja " + (fmt ? fmt.format(new Date()) : "") + " WAT"; };
    tick(); setInterval(tick, 20000);
  }

  /* ---------- smooth scroll ---------- */
  if (window.Lenis && !reduce) {
    var lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    S.lenis = lenis;
    if (window.gsap && window.ScrollTrigger) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  S.scrollTo = function (target, opts) {
    opts = opts || {};
    if (S.lenis) S.lenis.scrollTo(target, { offset: opts.offset || 0, duration: opts.duration || 1.3, immediate: !!opts.immediate });
    else {
      var y = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY + (opts.offset || 0);
      window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    }
  };
  S.lock = function () { if (S.lenis) S.lenis.stop(); else html.style.overflow = "hidden"; };
  S.unlock = function () { if (S.lenis) S.lenis.start(); else html.style.overflow = ""; };

  /* ---------- in-page anchors ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var href = a.getAttribute("href");
    if (href.length < 2 || href.indexOf("/") !== -1) return; // #work/slug is handled by the router
    var target = document.getElementById(href.slice(1));
    if (!target) return;
    e.preventDefault();
    closeMenu();
    S.scrollTo(href === "#home" ? 0 : target, { offset: 0 });
    if (history.replaceState) history.replaceState(null, "", href);
  });

  /* ---------- header: scrolled state + theme under the bar ---------- */
  var header = document.getElementById("siteHeader");
  var themed = Array.prototype.slice.call(document.querySelectorAll("main [data-theme], footer[data-theme]"));
  var progress = document.getElementById("progress");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".main-nav a"));
  var navTargets = navLinks.map(function (a) { return document.getElementById((a.getAttribute("href") || "").slice(1)); });
  var ticking = false;

  function onScroll() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    if (header) {
      header.classList.toggle("is-scrolled", y > 24);
      var probe = (header.offsetHeight || 76) / 2, theme = header.getAttribute("data-theme");
      for (var i = 0; i < themed.length; i++) {
        var r = themed[i].getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) { theme = themed[i].getAttribute("data-theme"); break; }
      }
      if (header.getAttribute("data-theme") !== theme) header.setAttribute("data-theme", theme);
    }
    if (progress) {
      var max = html.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    }
    navLinks.forEach(function (a, i) {
      var t = navTargets[i]; if (!t) return;
      var r = t.getBoundingClientRect();
      a.classList.toggle("is-current", r.top < window.innerHeight * 0.45 && r.bottom > window.innerHeight * 0.45);
    });
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- mobile menu ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var menu = document.getElementById("menu");
  function closeMenu() {
    if (!menu || !menu.classList.contains("is-open")) return;
    menu.classList.remove("is-open"); menu.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("aria-expanded", "false"); menuBtn.setAttribute("aria-label", "Open menu");
    S.unlock();
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      var open = !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", open); menu.setAttribute("aria-hidden", String(!open));
      menuBtn.setAttribute("aria-expanded", String(open)); menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open) S.lock(); else S.unlock();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    window.addEventListener("resize", function () { if (window.innerWidth > 980) closeMenu(); });
  }

  /* ---------- cursor ---------- */
  var cursor = document.getElementById("cursor");
  if (cursor && fine && !reduce) {
    html.classList.add("has-cursor");
    var label = document.getElementById("cursorLabel");
    var cx = -100, cy = -100, tx = -100, ty = -100;
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY; cursor.classList.add("is-on");
    }, { passive: true });
    document.addEventListener("mouseleave", function () { cursor.classList.remove("is-on"); });
    document.addEventListener("mouseover", function (e) {
      var el = e.target.closest && e.target.closest("[data-cursor]");
      if (el) { label.textContent = el.getAttribute("data-cursor"); cursor.classList.add("has-label"); }
      else cursor.classList.remove("has-label");
    });
    (function loop() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cursor.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      requestAnimationFrame(loop);
    })();
    // the dialog lives in the browser's top layer, so the cursor has to move in with it
    S.cursorHost = function (parent) { parent.appendChild(cursor); };
  } else S.cursorHost = function () {};

  /* ============================================================
     TEXT HELPERS
     ============================================================ */
  function walkText(node, fn) {
    Array.prototype.slice.call(node.childNodes).forEach(function (n) {
      if (n.nodeType === 3) fn(n);
      else if (n.nodeType === 1 && n.nodeName !== "BR" && n.nodeName !== "SVG") walkText(n, fn);
    });
  }
  /* split into single characters (for the variable-font wave) */
  S.splitChars = function (el) {
    var out = [];
    walkText(el, function (n) {
      var frag = document.createDocumentFragment();
      n.nodeValue.split("").forEach(function (c) {
        var s = document.createElement("span"); s.className = "ch"; s.setAttribute("aria-hidden", "true"); s.textContent = c;
        frag.appendChild(s); out.push(s);
      });
      n.parentNode.replaceChild(frag, n);
    });
    return out;
  };
  /* split into words. mode "mask" = overflow-hidden rise (headings); "plain" = inline spans (scroll-read text) */
  S.splitWords = function (el, mode) {
    var out = [];
    walkText(el, function (n) {
      var frag = document.createDocumentFragment();
      n.nodeValue.split(/([ \t\n]+)/).forEach(function (part) {
        if (!part) return;
        if (/^[ \t\n]+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
        var w = document.createElement("span");
        if (mode === "mask") {
          w.className = "wd"; var i = document.createElement("i"); i.textContent = part; w.appendChild(i); out.push(i);
        } else { w.className = "w"; w.textContent = part; out.push(w); }
        frag.appendChild(w);
      });
      n.parentNode.replaceChild(frag, n);
    });
    if (mode === "mask") el.classList.add("split-words");
    return out;
  };

  /* pointer-driven width wave across a set of character spans.
     base/peak are the font's `wdth` axis values. */
  S.wave = function (chars, host, o) {
    if (!fine || reduce || !chars.length) return;
    o = o || {};
    var base = o.base || 72, peak = o.peak || 140, radius = o.radius || 190, wght = o.wght || 900;
    var cur = chars.map(function () { return base; });
    var px = -9999, py = -9999, active = false, running = false;

    function frame() {
      var rects = chars.map(function (c) { return c.getBoundingClientRect(); }); // all reads first
      var moving = false;
      chars.forEach(function (c, i) {
        var r = rects[i], dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2);
        var d = Math.sqrt(dx * dx + dy * dy);
        var target = active ? base + (peak - base) * Math.exp(-(d * d) / (2 * (radius * 0.55) * (radius * 0.55))) : base;
        var next = cur[i] + (target - cur[i]) * 0.14;
        if (Math.abs(next - base) < 0.4 && !active) next = base;
        if (Math.abs(next - cur[i]) > 0.05) moving = true;
        cur[i] = next;
      });
      chars.forEach(function (c, i) {
        c.style.fontVariationSettings = '"wdth" ' + cur[i].toFixed(1) + ', "wght" ' + wght;
      });
      if (moving || active) requestAnimationFrame(frame); else running = false;
    }
    function kick() { if (!running) { running = true; requestAnimationFrame(frame); } }
    host.addEventListener("pointermove", function (e) { px = e.clientX; py = e.clientY; active = true; kick(); }, { passive: true });
    host.addEventListener("pointerleave", function () { active = false; kick(); });
  };
})();
