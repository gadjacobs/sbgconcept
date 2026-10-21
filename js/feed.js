/* ============================================================
   SBG CONCEPT — Instagram feed
   Reads window.SBG_CONFIG.instagram (see js/config.js).
     feedUrl  → live JSON feed (Behold.so)  → custom-styled tiles
     posts    → post shortcodes             → Instagram's own embeds
     neither  → designed "follow along" panel
   ============================================================ */
(function () {
  "use strict";
  var grid = document.getElementById("feedGrid");
  if (!grid) return;

  var cfg = (window.SBG_CONFIG && window.SBG_CONFIG.instagram) || {};
  var user = cfg.username || "sbgconcept";
  var limit = cfg.limit || 9;
  var profile = "https://www.instagram.com/" + user + "/";

  var follow = document.getElementById("feedFollow");
  if (follow) follow.href = profile;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function empty() {
    grid.setAttribute("data-state", "empty");
    grid.className = "feed-grid";
    grid.innerHTML = "";
    var box = el("div", "feed-empty");
    var left = el("div");
    left.appendChild(el("p", "mono", "Instagram · @" + user));
    left.appendChild(el("h3", null, "The feed is warming up."));
    left.appendChild(el("p", null, "We share what happens on the ground — activations, behind-the-scenes and the occasional win. Follow along so you catch the next one as it happens."));
    var cta = el("a", "btn btn-solid btn-lg", "Follow @" + user);
    cta.href = profile; cta.target = "_blank"; cta.rel = "noopener";
    left.appendChild(cta);
    var art = el("div", "feed-empty-art");
    if (window.SBGArt) {
      var c = document.createElement("canvas");
      window.SBGArt.draw(c, { slug: "sbg-feed", art: "rings", accent: "flare" });
      art.appendChild(c);
    }
    box.appendChild(left); box.appendChild(art);
    grid.appendChild(box);
  }

  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    return isNaN(d) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function live(posts) {
    grid.setAttribute("data-state", "live");
    grid.innerHTML = "";
    grid.classList.toggle("is-sparse", posts.length < 4);
    posts.slice(0, limit).forEach(function (p) {
      var a = el("a", "ig-tile");
      a.href = p.permalink || profile; a.target = "_blank"; a.rel = "noopener";
      a.setAttribute("data-cursor", "Open");
      var caption = (p.prunedCaption || p.caption || "").replace(/\s+/g, " ").trim();
      a.setAttribute("aria-label", caption ? caption.slice(0, 120) : "View post on Instagram");

      var type = p.mediaType || "IMAGE";
      var thumb = (p.sizes && p.sizes.medium && p.sizes.medium.mediaUrl) || p.thumbnailUrl || p.mediaUrl;
      if (type === "VIDEO" && !p.thumbnailUrl && p.mediaUrl) {
        var v = document.createElement("video"); v.src = p.mediaUrl; v.muted = true; v.playsInline = true; v.preload = "metadata"; a.appendChild(v);
      } else if (thumb) {
        var img = document.createElement("img"); img.src = thumb; img.alt = caption.slice(0, 100); img.loading = "lazy"; img.decoding = "async"; a.appendChild(img);
      }
      if (type === "VIDEO") a.appendChild(el("span", "ig-badge mono", "Reel"));
      else if (type === "CAROUSEL_ALBUM") a.appendChild(el("span", "ig-badge mono", "Album"));

      var cap = el("div", "ig-cap");
      cap.appendChild(document.createTextNode(caption.length > 110 ? caption.slice(0, 107) + "…" : caption));
      var t = el("time", "mono", fmtDate(p.timestamp));
      if (t.textContent) cap.appendChild(t);
      a.appendChild(cap);
      grid.appendChild(a);
    });
  }

  function embeds(codes) {
    grid.setAttribute("data-state", "embed");
    grid.innerHTML = "";
    grid.classList.toggle("is-sparse", codes.length < 4);
    codes.slice(0, limit).forEach(function (code) {
      var path = /^(reel|p|tv)\//.test(code) ? code : "p/" + code;
      var wrap = el("div", "ig-embed");
      var f = document.createElement("iframe");
      f.src = "https://www.instagram.com/" + path.replace(/\/$/, "") + "/embed";
      f.loading = "lazy"; f.title = "Instagram post by @" + user; f.setAttribute("allowtransparency", "true"); f.setAttribute("scrolling", "no");
      wrap.appendChild(f); grid.appendChild(wrap);
    });
  }

  if (cfg.feedUrl) {
    fetch(cfg.feedUrl)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var posts = Array.isArray(data) ? data : (data && data.posts) || [];
        if (posts.length) live(posts); else empty();
      })
      .catch(empty);
  } else if (cfg.posts && cfg.posts.length) {
    embeds(cfg.posts);
  } else {
    empty();
  }
})();
