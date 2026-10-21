# Updating the SBG Concept site

No build step. Edit a file, refresh, push. Hosting stays static.

## 1. Add a real project (the main job)

1. Make a folder: `assets/projects/<slug>/` (e.g. `assets/projects/zest-campus-tour/`) and drop your photos and videos in it.
2. Open `js/projects.js`, copy any entry, change the fields, and **delete `sample: true`**.
3. Set `cover` to your best photo and list the rest under `media`:

```js
{
  slug: "zest-campus-tour",
  title: "Zest Campus Tour",
  tagline: "12,000 samples in 9 days.",
  client: "Zest Drinks",
  location: "Abuja",
  year: "2026",
  services: ["Market Activations", "Event Staffing"],
  cover: "assets/projects/zest-campus-tour/cover.jpg",
  accent: "gold",
  brief: "…", play: "…", measure: "…",
  deliverables: ["…", "…"],
  stats: [{ label: "Samples", value: "12,000" }],   // real numbers only
  media: [
    { type: "image", src: "assets/projects/zest-campus-tour/1.jpg", alt: "Tent at UniAbuja", span: "wide" },
    { type: "image", src: "assets/projects/zest-campus-tour/2.jpg" },
    { type: "video", src: "assets/projects/zest-campus-tour/reel.mp4", poster: "assets/projects/zest-campus-tour/reel.jpg" }
  ]
}
```

Photos are shown in a navy + gold duotone and turn to full colour on hover. Set `duotone: false` to always show colour.
Image tips: ~1600px on the long edge, JPG/WebP, under ~300 KB each. Videos: MP4 (H.264), short, under ~8 MB.

Every project gets its own link (`/#work/zest-campus-tour`) you can share.

Besides AHS, the built-in projects are hidden samples (`hidden: true` in `js/projects.js`). Delete the flag to show one, or replace it with real work.

## 2. Turn on the live Instagram feed

`js/config.js` → `instagram`. Pick one:

- **Live feed (recommended, free, ~5 min):** sign up at <https://behold.so>, connect `@sbgconcept`, create a feed, copy its JSON feed URL into `feedUrl`. New posts show up automatically, styled to match the site.
- **Manual (no signup):** put post shortcodes in `posts` (`instagram.com/p/ABC123xyz/` → `"ABC123xyz"`). Instagram's own embeds render them.

With neither set, a "follow along" panel shows. Note: Instagram doesn't allow key-free scraping, which is why one of the two steps above is needed.

## 3. Everything else

- Contact details, WhatsApp number: `js/config.js` (the contact section's visible text is in `index.html`).
- Service copy: the `svc` list in `index.html`.
- Colours: the `:root` block at the top of `css/style.css`.
- After a deploy, bump the `?v=` number on the CSS/JS links in `index.html` so visitors don't get stale files.

Testing tip: `?motion=1` on the URL forces animations on even if your OS has "reduce motion" enabled.
