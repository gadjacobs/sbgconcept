/* ============================================================
   SBG CONCEPT — home page choreography
   ============================================================ */
(function () {
  "use strict";
  var S = window.SBG;
  if (!S || !window.gsap) return;

  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  var reduce = S.reduce;
  var plugins = [ScrollTrigger];
  if (window.Draggable) plugins.push(window.Draggable);
  if (window.InertiaPlugin) plugins.push(window.InertiaPlugin);
  gsap.registerPlugin.apply(gsap, plugins);

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var projects = (window.SBG_PROJECTS || []).filter(function (p) { return !p.hidden; });
  var cfg = window.SBG_CONFIG || {};
  var mm = gsap.matchMedia();

  /* ============================================================
     HERO
     ============================================================ */
  (function hero() {
    var heroEl = $("#home"); if (!heroEl) return;
    var lines = $$(".hl-text", heroEl);
    var groups = lines.map(function (l) { return S.splitChars(l); });
    var all = [].concat.apply([], groups);

    // dot field — pulses start from the stamp
    var canvas = $("#heroField");
    if (canvas && window.SBGDotfield) {
      window.SBGDotfield.init(canvas, {
        host: heroEl,
        source: function () {
          var st = $("#stamp"), cr = canvas.getBoundingClientRect();
          if (!st) return [cr.width * 0.8, cr.height * 0.3];
          var r = st.getBoundingClientRect();
          return [r.left + r.width / 2 - cr.left, r.top + r.height / 2 - cr.top];
        }
      });
    }

    // intro
    if (!reduce) {
      gsap.set(all, { yPercent: 115 });
      gsap.set($$("[data-hero='fade']"), { opacity: 0, y: 24 });
      gsap.set("#stamp", { scale: 0, opacity: 0 });
      var tl = gsap.timeline({ delay: 0.15, defaults: { ease: "expo.out" } });
      tl.to($$("[data-hero='fade']")[0], { opacity: 1, y: 0, duration: 1 }, 0)
        .to(groups[0], { yPercent: 0, duration: 1.3, stagger: 0.022 }, 0.1)
        .to(groups[1], { yPercent: 0, duration: 1.3, stagger: 0.022 }, 0.22)
        .to(groups[2], { yPercent: 0, duration: 1.5, stagger: 0.045 }, 0.34)
        .to($$("#home .strike"), { "--strike": 1, duration: 1.1, ease: "power3.inOut" }, 1.25)
        .to($$("[data-hero='fade']").slice(1), { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, 1)
        .to("#stamp", { scale: 1, opacity: 1, duration: 1.2, ease: "elastic.out(1,.55)" }, 1.1);
    }

    // type wave under the pointer
    S.wave(groups[2], heroEl, { base: 72, peak: 122, radius: 230, wght: 900 });
    S.wave(groups[0].concat(groups[1]), heroEl, { base: 120, peak: 150, radius: 200, wght: 500 });

    // scroll: hero drifts away
    if (!reduce) {
      gsap.to(".hero-inner", { yPercent: -10, opacity: 0.15, ease: "none", scrollTrigger: { trigger: heroEl, start: "top top", end: "bottom top", scrub: true } });
      gsap.to("#stamp", { yPercent: 60, rotate: 60, ease: "none", scrollTrigger: { trigger: heroEl, start: "top top", end: "bottom top", scrub: true } });
    }
  })();

  /* ============================================================
     TAPES (marquees that react to scroll speed)
     ============================================================ */
  (function tapes() {
    var tracks = $$(".tape-track");
    if (!tracks.length) return;
    tracks.forEach(function (t) { t.innerHTML += t.innerHTML; });
    if (reduce) return;
    var tweens = tracks.map(function (t) {
      var dir = parseFloat(t.getAttribute("data-dir")) || -1;
      return gsap.fromTo(t, { xPercent: dir < 0 ? 0 : -50 }, { xPercent: dir < 0 ? -50 : 0, duration: 46, ease: "none", repeat: -1 });
    });
    var vel = 0;
    ScrollTrigger.create({ onUpdate: function (self) { vel = self.getVelocity(); } });
    gsap.ticker.add(function () {
      vel *= 0.92;
      var boost = 1 + Math.min(Math.abs(vel) / 260, 7);
      tweens.forEach(function (t) { t.timeScale(boost); });
    });
  })();

  /* ============================================================
     MANIFESTO — words light up as you read
     ============================================================ */
  (function manifesto() {
    var el = $("#manifestoText"); if (!el) return;
    var words = S.splitWords(el, "plain");
    if (reduce) return;
    gsap.to(words, {
      opacity: 1, ease: "none", stagger: 0.12,
      scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 62%", scrub: 0.4 }
    });
  })();

  /* ============================================================
     GENERIC REVEALS
     ============================================================ */
  $$("h2.display").forEach(function (h) {
    var words = S.splitWords(h, "mask");
    if (reduce) return;
    ScrollTrigger.create({
      trigger: h, start: "top 88%", once: true,
      onEnter: function () { gsap.to(words, { y: 0, yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.07 }); }
    });
    gsap.set(words, { yPercent: 110 });
  });
  if (!reduce) {
    $$("[data-reveal]").forEach(function (el) {
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: function () { gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" }); }
      });
    });
  }

  /* ============================================================
     SERVICES accordion
     ============================================================ */
  (function services() {
    var list = $("#svcList"); if (!list) return;
    var refresh = (function () { var t; return function () { clearTimeout(t); t = setTimeout(function () { ScrollTrigger.refresh(); }, 700); }; })();
    list.addEventListener("click", function (e) {
      var btn = e.target.closest(".svc-btn"); if (!btn) return;
      var item = btn.closest(".svc"), open = !item.classList.contains("is-open");
      $$(".svc", list).forEach(function (s) {
        s.classList.remove("is-open"); $(".svc-btn", s).setAttribute("aria-expanded", "false");
      });
      if (open) { item.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); }
      refresh();
    });
  })();

  /* ============================================================
     WORK — poster rail + case-study dialog
     ============================================================ */
  var caseApi = (function work() {
    var track = $("#workTrack"), pin = $("#workPin"), vp = $("#workViewport");
    if (!track) return {};

    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var anySample = projects.some(function (p) { return p.sample; });
    var noteEl = $("#workNote");
    if (noteEl) {
      var dev = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || /[?&]edit\b/.test(location.search);
      noteEl.textContent = (anySample && dev) ? "Sample projects — replace them in js/projects.js" : "Scroll, then open anything.";
    }

    function cover(p, host, cls) {
      if (p.cover) {
        host.classList.add("is-photo");
        if (p.duotone !== false) host.classList.add("duo");
        var img = document.createElement("img");
        img.src = p.cover; img.alt = p.title; img.loading = "lazy"; img.decoding = "async";
        host.appendChild(img);
      } else if (window.SBGArt) {
        var c = document.createElement("canvas");
        window.SBGArt.draw(c, p); c.setAttribute("role", "img"); c.setAttribute("aria-label", p.title + " artwork");
        host.appendChild(c);
      }
    }

    track.innerHTML = "";
    projects.forEach(function (p, i) {
      var a = document.createElement("a");
      a.className = "card"; a.href = "#work/" + p.slug; a.setAttribute("data-cursor", "View"); a.setAttribute("data-slug", p.slug); a.setAttribute("data-accent", p.accent || "gold");
      var media = document.createElement("div"); media.className = "card-media";
      cover(p, media);
      media.insertAdjacentHTML("beforeend",
        '<span class="card-idx">' + pad(i + 1) + "</span>" +
        (p.sample ? '<span class="card-flag mono">Sample</span>' : "") +
        '<span class="card-plus" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>');
      var body = document.createElement("div"); body.className = "card-body";
      body.innerHTML = '<div class="card-tags mono">' + (p.services || []).slice(0, 2).map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("<span>·</span>") + "</div>" +
        '<h3 class="card-title">' + esc(p.title) + '</h3><p class="card-tag">' + esc(p.tagline) + "</p>";
      a.appendChild(media); a.appendChild(body); track.appendChild(a);
    });
    var totalEl = $("#workTotal"); if (totalEl) totalEl.textContent = pad(projects.length);

    var bar = $("#workBar"), idx = $("#workIdx");
    function setProgress(p) {
      if (bar) bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
      if (idx) idx.textContent = pad(Math.round(p * (projects.length - 1)) + 1);
    }

    // desktop: pin and scroll sideways. mobile: native swipe rail.
    mm.add("(min-width: 901px)", function () {
      if (reduce) { vp.style.overflowX = "auto"; return function () { vp.style.overflowX = ""; }; }
      var dist = function () { return Math.max(0, track.scrollWidth - vp.clientWidth); };
      gsap.to(track, {
        x: function () { return -dist(); }, ease: "none",
        scrollTrigger: {
          trigger: pin, start: "top top+=96", end: function () { return "+=" + dist(); },
          pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: function (self) { setProgress(self.progress); }
        }
      });
    });
    vp.addEventListener("scroll", function () {
      if (window.innerWidth > 900) return;
      var max = vp.scrollWidth - vp.clientWidth; setProgress(max > 0 ? vp.scrollLeft / max : 0);
    }, { passive: true });
    setProgress(0);

    return { cover: cover, pad: pad };
  })();

  /* ---------- case study dialog ---------- */
  (function caseStudy() {
    var dlg = $("#case"), body = $("#caseBody"), scroller = $("#caseScroll"), lb = $("#lightbox");
    if (!dlg || !body || !projects.length) return;
    var current = null, lastCard = null, lastPt = [window.innerWidth / 2, window.innerHeight / 2], busy = false;

    document.addEventListener("pointerdown", function (e) {
      var c = e.target.closest && e.target.closest(".card");
      if (c) { lastCard = c; lastPt = [e.clientX, e.clientY]; }
    }, true);

    function tile(p, variant, cls) {
      var d = document.createElement("div"); d.className = "g-item " + (cls || "");
      var c = document.createElement("canvas"); window.SBGArt.tile(c, p, variant); d.appendChild(c);
      d.insertAdjacentHTML("beforeend", '<span class="g-slot mono">Photo slot</span>');
      return d;
    }

    function render(p, i) {
      var next = projects[(i + 1) % projects.length], pad = caseApi.pad;
      var hero = document.createElement("div");
      var cvHost = document.createElement("div"); cvHost.className = "case-cover";
      caseApi.cover(p, cvHost);
      if (p.coverVideo) { cvHost.innerHTML = '<video src="' + esc(p.coverVideo) + '" autoplay muted loop playsinline' + (p.cover ? ' poster="' + esc(p.cover) + '"' : "") + "></video>"; }

      var html =
        '<header class="case-hero" data-accent="' + esc(p.accent || "gold") + '"><div class="wrap">' +
        '<div class="case-kicker"><span class="mono">' + pad(i + 1) + " / " + pad(projects.length) + "</span>" +
        (p.services || []).map(function (s) { return '<span class="mono">' + esc(s) + "</span>"; }).join("") + "</div>" +
        '<h2 class="case-title" id="caseTitle">' + esc(p.title) + "</h2>" +
        '<p class="case-tagline">' + esc(p.tagline) + "</p></div>" +
        '<div class="case-cover-slot"></div></header>';
      body.innerHTML = html;
      $(".case-cover-slot", body).replaceWith(cvHost);

      var frag = '';
      if (p.sample) frag += '<div class="case-sample"><div class="wrap mono"><span>✺</span> Sample project — a format we run, not a past client. Real work lands here soon.</div></div>';
      frag += '<div class="wrap"><dl class="case-meta mono">' +
        '<div><dt>Client</dt><dd>' + esc(p.client || "—") + "</dd></div>" +
        '<div><dt>Location</dt><dd>' + esc(p.location || "—") + "</dd></div>" +
        '<div><dt>Year</dt><dd>' + esc(p.year || "—") + "</dd></div>" +
        '<div><dt>Services</dt><dd>' + esc((p.services || []).join(", ") || "—") + "</dd></div></dl>" +
        '<div class="case-story">' +
        (p.brief ? '<div class="story-row"><h3 class="mono">The brief</h3><p>' + esc(p.brief) + "</p></div>" : "") +
        (p.play ? '<div class="story-row"><h3 class="mono">The play</h3><p>' + esc(p.play) + "</p></div>" : "") +
        (p.measure ? '<div class="story-row"><h3 class="mono">How we measure it</h3><p>' + esc(p.measure) + "</p></div>" : "") +
        "</div>" +
        ((p.stats && p.stats.length) ? '<div class="case-stats">' + p.stats.map(function (s) { return '<div class="case-stat"><b>' + esc(s.value) + '</b><span class="mono">' + esc(s.label) + "</span></div>"; }).join("") + "</div>" : "") +
        "</div>";
      if (p.deliverables && p.deliverables.length) {
        frag += '<section class="case-deliver"><div class="wrap"><p class="mono" style="opacity:.6">What you get</p><ul>' +
          p.deliverables.map(function (d, k) { return '<li><span class="mono">' + pad(k + 1) + "</span>" + esc(d) + "</li>"; }).join("") +
          '</ul><a class="btn btn-solid btn-lg" href="#contact" data-prefill="' + esc((p.services || []).join("|")) + '">Start a campaign like this <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></a></div></section>';
      }
      var wrap = document.createElement("div"); wrap.innerHTML = frag; body.appendChild(wrap);

      // gallery: real media if provided, otherwise art tiles for sample projects
      var gal = document.createElement("div"); gal.className = "case-gallery";
      if (p.media && p.media.length) {
        p.media.forEach(function (m) {
          var d = document.createElement("div"); d.className = "g-item " + (m.span || "");
          if (m.type === "video") {
            d.style.cursor = "default";
            d.innerHTML = '<video src="' + esc(m.src) + '" controls playsinline preload="metadata"' + (m.poster ? ' poster="' + esc(m.poster) + '"' : "") + "></video>";
          } else d.innerHTML = '<img src="' + esc(m.src) + '" alt="' + esc(m.alt || p.title) + '" loading="lazy">';
          gal.appendChild(d);
        });
      } else if (p.sample && window.SBGArt) {
        gal.appendChild(tile(p, 1, "wide")); gal.appendChild(tile(p, 2)); gal.appendChild(tile(p, 3)); gal.appendChild(tile(p, 4, "wide"));
      }
      if (gal.children.length) body.appendChild(gal);

      var nx = document.createElement("a"); nx.className = "case-next"; nx.href = "#work/" + next.slug; nx.setAttribute("data-cursor", "Next");
      nx.innerHTML = '<div class="wrap"><span class="mono">Next project →</span><b>' + esc(next.title) + "</b></div>";
      body.appendChild(nx);
      scroller.scrollTop = 0;
    }

    function openCase(slug, instant) {
      var i = projects.findIndex(function (p) { return p.slug === slug; });
      if (i < 0) return;
      var p = projects[i];
      if (dlg.open) { // swapping project while open
        current = slug;
        gsap.to(scroller, { opacity: 0, duration: 0.25, onComplete: function () { render(p, i); gsap.to(scroller, { opacity: 1, duration: 0.5 }); intro(); } });
        return;
      }
      if (busy) return;
      current = slug; render(p, i);
      dlg.showModal(); S.lock(); S.cursorHost(dlg);
      scroller.setAttribute("data-lenis-prevent", "");
      if (instant || reduce) { intro(); return; }
      busy = true;
      var r = Math.hypot(window.innerWidth, window.innerHeight);
      gsap.fromTo(dlg, { clipPath: "circle(0px at " + lastPt[0] + "px " + lastPt[1] + "px)" },
        { clipPath: "circle(" + r + "px at " + lastPt[0] + "px " + lastPt[1] + "px)", duration: 1, ease: "power3.inOut", onComplete: function () { dlg.style.clipPath = ""; busy = false; } });
      intro(0.35);
    }
    function intro(delay) {
      if (reduce) return;
      var t = $(".case-title", body);
      if (t) gsap.fromTo(t, { "--tw": 150, yPercent: 30, opacity: 0 }, { "--tw": 70, yPercent: 0, opacity: 1, duration: 1.4, ease: "expo.out", delay: delay || 0 });
      gsap.from($$(".case-kicker, .case-tagline", body), { y: 26, opacity: 0, duration: 1, stagger: 0.12, ease: "power3.out", delay: (delay || 0) + 0.1 });
      gsap.from($(".case-cover", body), { clipPath: "inset(12% 8% 12% 8%)", duration: 1.4, ease: "expo.out", delay: (delay || 0) + 0.15 });
    }
    function closeCase() {
      if (!dlg.open || busy) return;
      current = null;
      if (history.replaceState) history.replaceState(null, "", location.pathname + location.search + "#work");
      var done = function () {
        dlg.close(); dlg.style.clipPath = ""; busy = false; S.cursorHost(document.body); S.unlock();
        if (lastCard) { try { lastCard.focus({ preventScroll: true }); } catch (e) {} }
      };
      if (reduce) return done();
      busy = true;
      gsap.to(dlg, { clipPath: "circle(0px at " + lastPt[0] + "px " + lastPt[1] + "px)", duration: 0.8, ease: "power3.inOut", onComplete: done });
    }

    $("#caseClose").addEventListener("click", closeCase);
    dlg.addEventListener("cancel", function (e) { e.preventDefault(); if (lb.classList.contains("is-open")) closeLb(); else closeCase(); });

    // "start a campaign like this" — closes the dialog and pre-selects the matching services
    body.addEventListener("click", function (e) {
      var a = e.target.closest("[data-prefill]");
      if (a) {
        e.preventDefault();
        var wanted = (a.getAttribute("data-prefill") || "").split("|");
        $$("#needChips input").forEach(function (inp) { inp.checked = wanted.indexOf(inp.value) !== -1; });
        $("#needChips").dispatchEvent(new Event("change"));
        closeCase();
        setTimeout(function () { S.scrollTo($("#contact"), { duration: 1.4 }); }, 700);
        return;
      }
      var g = e.target.closest(".g-item");
      if (g && !g.querySelector("video")) openLb(g);
    });

    function openLb(g) {
      lb.innerHTML = "";
      var src = g.querySelector("img, canvas"); if (!src) return;
      var node;
      if (src.tagName === "CANVAS") { node = document.createElement("canvas"); node.width = src.width; node.height = src.height; node.getContext("2d").drawImage(src, 0, 0); }
      else { node = document.createElement("img"); node.src = src.currentSrc || src.src; node.alt = src.alt || ""; }
      lb.appendChild(node); lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false");
    }
    function closeLb() { lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); lb.innerHTML = ""; }
    lb.addEventListener("click", closeLb);

    // routing: #work/<slug>
    function route(first) {
      var m = location.hash.match(/^#work\/([\w-]+)/);
      if (m) {
        if (first) { // deep link — scroll to the section behind it, then open
          var w = $("#work"); if (w && S.scrollTo) S.scrollTo(w, { immediate: true });
        }
        openCase(m[1], !!first);
      } else if (dlg.open && !busy) { closeCase(); }
    }
    window.addEventListener("hashchange", function () { route(false); });
    setTimeout(function () { route(true); }, 60);
  })();

  /* ============================================================
     PROCESS — pinned, three beats
     ============================================================ */
  (function process() {
    var section = $("#process"); if (!section) return;
    var steps = $$("#pSteps li"), words = $$("#pWords .p-word"), viz = $$(".pv");
    function set(i) {
      steps.forEach(function (n, k) { n.classList.toggle("is-active", k === i); });
      words.forEach(function (n, k) { n.classList.toggle("is-active", k === i); });
      viz.forEach(function (n, k) { n.classList.toggle("is-active", k === i); });
    }
    set(0);
    mm.add("(min-width: 901px)", function () {
      if (reduce) return;
      var last = 0;
      ScrollTrigger.create({
        trigger: section, start: "top top", end: function () { return "+=" + window.innerHeight * 2.1; },
        pin: "#processPin", anticipatePin: 1, scrub: true,
        onUpdate: function (self) {
          var i = Math.min(2, Math.floor(self.progress * 3));
          if (i !== last) { last = i; set(i); }
        }
      });
    });
    mm.add("(max-width: 900px)", function () { viz.forEach(function (n) { n.classList.add("is-active"); }); });
  })();

  /* ============================================================
     VALUES — draggable wall
     ============================================================ */
  (function values() {
    var wall = $("#wall"); if (!wall) return;
    var cards = $$(".vcard", wall);

    // star-burst outline for the "burst" sticker
    var burst = $(".v-burst", wall);
    if (burst) {
      var pts = [], n = 22;
      for (var i = 0; i < n * 2; i++) {
        var a = (Math.PI * i) / n, r = i % 2 ? 43 : 50;
        pts.push((50 + Math.cos(a) * r).toFixed(2) + "% " + (50 + Math.sin(a) * r).toFixed(2) + "%");
      }
      burst.style.clipPath = "polygon(" + pts.join(",") + ")";
    }

    var z = 10, hint = $("#dragHint");
    mm.add("(min-width: 901px)", function () {
      if (!window.Draggable) return;
      if (!reduce) {
        gsap.from(cards, {
          y: -260, opacity: 0, duration: 1.1, ease: "bounce.out", stagger: 0.12,
          scrollTrigger: { trigger: wall, start: "top 75%", once: true }
        });
      }
      var drags = window.Draggable.create(cards, {
        type: "x,y", bounds: wall, inertia: !!window.InertiaPlugin, edgeResistance: 0.8, zIndexBoost: false,
        onPress: function () { this.target.style.zIndex = ++z; gsap.to(this.target, { scale: 1.06, duration: 0.25 }); if (hint) hint.style.opacity = 0; },
        onRelease: function () { gsap.to(this.target, { scale: 1, duration: 0.5, ease: "elastic.out(1,.5)" }); }
      });
      return function () { drags.forEach(function (d) { d.kill(); }); gsap.set(cards, { clearProps: "all" }); };
    });
  })();

  /* ============================================================
     WHY — ticket
     ============================================================ */
  (function why() {
    var t = $("#ticket"); if (!t) return;
    $$(".ticket-list li", t).forEach(function (li, i) { li.style.setProperty("--i", i); });
    if (reduce) return;
    ScrollTrigger.create({ trigger: t, start: "top 78%", once: true, onEnter: function () { t.classList.add("is-in"); } });
    gsap.from(t, { y: 80, rotate: -6, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: t, start: "top 90%", once: true } });
  })();

  /* ============================================================
     CONTACT — brief builder → WhatsApp / email
     ============================================================ */
  (function contact() {
    var form = $("#brief"); if (!form) return;
    var chipsHost = $("#needChips"), bubble = $("#bubbleText"), err = $("#formError");
    var needs = $$(".svc-name").map(function (n) { return n.textContent.trim(); });
    needs.forEach(function (n) {
      var l = document.createElement("label"); l.className = "chip";
      l.innerHTML = '<input type="checkbox" name="need" value="' + esc(n) + '"><span>' + esc(n) + "</span>";
      chipsHost.appendChild(l);
    });

    function list(a) { return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
    function message() {
      var f = form.elements, chosen = $$("input[name=need]:checked", form).map(function (i) { return i.value; });
      var name = (f.name.value || "").trim(), brand = (f.brand.value || "").trim(), note = (f.note.value || "").trim();
      var scale = (form.querySelector("input[name=scale]:checked") || {}).value;
      var m = "Hi SBG Concept, I'm " + (name || "[your name]") + (brand ? " from " + brand : "") + ". ";
      m += chosen.length ? "I'm looking for help with " + list(chosen) : "I'd like to talk about a campaign";
      m += ".";
      if (scale) m += " We're " + scale + ".";
      if (note) m += " " + note.replace(/\s+/g, " ");
      m += " Can we talk?";
      return m;
    }
    function update() { bubble.textContent = message(); err.textContent = ""; }
    form.addEventListener("input", update); form.addEventListener("change", update);
    chipsHost.addEventListener("change", update);
    update();

    function guard() {
      if (!form.elements.name.value.trim()) { err.textContent = "↑ Add your name first so we know who's calling."; form.elements.name.focus(); return false; }
      return true;
    }
    $("#sendWa").addEventListener("click", function () {
      if (!guard()) return;
      window.open("https://wa.me/" + (cfg.whatsapp || "2347065597039") + "?text=" + encodeURIComponent(message()), "_blank", "noopener");
    });
    $("#sendMail").addEventListener("click", function () {
      if (!guard()) return;
      var who = form.elements.brand.value.trim() || form.elements.name.value.trim();
      window.location.href = "mailto:" + (cfg.email || "info@sbgconcept.ng") + "?subject=" + encodeURIComponent("Campaign enquiry — " + who) + "&body=" + encodeURIComponent(message());
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); });
  })();

  /* ============================================================
     FOOTER wordmark — fit to width, then wave
     ============================================================ */
  (function wordmark() {
    var wm = $("#wordmark"); if (!wm) return;
    var chars = S.splitChars(wm);
    function fit() {
      wm.style.fontSize = "100px";
      var target = wm.parentElement.clientWidth - parseFloat(getComputedStyle(wm.parentElement).paddingLeft) * 2;
      var w = wm.scrollWidth || 1;
      wm.style.fontSize = Math.floor(100 * (target * 0.9) / w) + "px";
    }
    var run = function () { fit(); };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(run);
    window.addEventListener("resize", run);
    S.wave(chars, $(".site-footer"), { base: 100, peak: 150, radius: 260, wght: 900 });
    if (!reduce) {
      gsap.from(chars, { yPercent: 60, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.04, scrollTrigger: { trigger: wm, start: "top 95%", once: true } });
    }
  })();

  // fonts change text metrics — re-measure once they're in
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
