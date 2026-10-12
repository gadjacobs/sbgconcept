/* ============================================================
   SBG CONCEPT — site settings. Edit this file; no build step.
   ============================================================ */
window.SBG_CONFIG = {
  phone1: "+2347065597039",
  phone2: "+2349070048606",
  email: "info@sbgconcept.ng",
  whatsapp: "2347065597039",          // international format, no + or spaces
  location: "Abuja, Nigeria",
  coords: [9.0765, 7.3986],           // lat, lng — used for the live Abuja clock/label

  /* ---------------- Instagram ----------------
     Instagram has no public, key-free feed API, so there are two ways to show
     the real feed. Pick ONE (the first one that is filled in wins):

     A) LIVE FEED (recommended, ~5 minutes, free tier):
        1. Go to https://behold.so and sign up. Connect the @sbgconcept account.
        2. Create a feed, copy its "JSON feed URL"
           (looks like https://feeds.behold.so/XXXXXXXX).
        3. Paste it into feedUrl below. New posts then appear automatically.

     B) MANUAL (no signup): paste the post shortcodes — the bit after /p/ or /reel/
        in a post's URL (instagram.com/p/ABC123xyz/ -> "ABC123xyz").
        Instagram's own embed renders each one. New posts need a manual add.

     If both are empty, the section shows a designed "follow us" panel instead. */
  instagram: {
    username: "sbgconcept",
    feedUrl: "",
    posts: [],      // e.g. ["ABC123xyz", "DEF456uvw"]
    limit: 9
  }
};
