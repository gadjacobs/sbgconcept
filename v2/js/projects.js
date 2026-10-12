/* ============================================================
   SBG CONCEPT — PROJECTS
   ------------------------------------------------------------
   Every entry becomes a poster card in "Selected work" and a full
   case-study page. The six below are SAMPLE formats (sample: true) so the
   site has something real-looking from day one. Replace them as you win
   and shoot real work — nothing else in the site needs touching.

   HOW TO ADD A REAL PROJECT
   1. Make a folder:  assets/projects/<slug>/   and drop your photos/videos in.
   2. Copy an entry below, change the fields, and delete  sample: true
   3. Point `cover` at your best photo and list the rest in `media`.

   FIELDS
     slug      url-safe id (shows up as  #work/<slug>)
     title     big name
     tagline   one punchy line shown on the card
     client    client or brand name
     location  where it ran
     year      "2025"
     services  list of tags (match the nine service names if you like)
     art       generative cover used until a real `cover` is set:
               "sun" | "umbrella" | "blocks" | "wave" | "rings" | "grid"
     accent    card colour for the generative art: "gold" | "flare" | "paper" | "navy"
     cover     (optional) "assets/projects/<slug>/cover.jpg" — replaces the art
     duotone   (optional, default true) navy+gold treatment on photos; colour on hover.
               set false to always show full colour.
     brief / play / measure   the three story blocks
     deliverables             bullet list of what was delivered
     stats     (optional) [{ label: "Reach", value: "12,400" }, ...] — only use real numbers
     media     (optional) gallery, any mix of:
                 { type: "image", src: "assets/projects/x/1.jpg", alt: "…", span: "wide" | "tall" }
                 { type: "video", src: "assets/projects/x/reel.mp4", poster: "…jpg" }
   ============================================================ */
window.SBG_PROJECTS = [
  {
    slug: "campus-sampling-tour",
    sample: true,
    title: "Campus Sampling Tour",
    tagline: "Free samples are easy. Making students stop, talk and remember isn't.",
    client: "Your brand here",
    location: "Abuja campuses",
    year: "2025",
    services: ["Market Activations", "Brand Promotions", "Event Staffing"],
    art: "sun",
    accent: "gold",
    brief: "A product launch that needs to land with 18–25s fast, on a budget that rules out billboards. The audience is already on campus — the job is to be the most interesting thing between lectures.",
    play: "Branded tents at the busiest walkways, a rotating crew of trained reps, a simple hook (sample, selfie, share) and a sign-up that turns a handshake into a lead. Short daily scripts so every conversation is on-brand and none of them sounds rehearsed.",
    measure: "Samples out, sign-ups collected, social tags earned and a daily wrap-up so the next day gets sharper. You get the numbers, not an adjective.",
    deliverables: ["Activation concept & booth design", "Trained brand ambassadors", "Daily lead capture", "End-of-tour results report"]
  },
  {
    slug: "market-women-loyalty-drive",
    sample: true,
    title: "Market Women Loyalty Drive",
    tagline: "The best sales team is the one that already sells in the market.",
    client: "Your brand here",
    location: "Abuja markets",
    year: "2025",
    services: ["Referral & Loyalty Programs", "Customer Engagement"],
    art: "blocks",
    accent: "flare",
    brief: "A consumer product that lives or dies on trader recommendation. Traders are loyal to what moves, pays on time and treats them with respect.",
    play: "A card-and-credit loyalty scheme run stall to stall: every restock earns, every referral earns more, and a field team shows up in person so the programme feels like a relationship and not a flyer.",
    measure: "Active traders, repeat orders and referral chains — tracked per market so you can see exactly which ones are worth doubling down on.",
    deliverables: ["Programme design & mechanics", "Printed loyalty kit", "Field team & onboarding", "Monthly performance read-out"]
  },
  {
    slug: "mall-pop-up-takeover",
    sample: true,
    title: "Mall Pop-Up Takeover",
    tagline: "A weekend where the whole floor knows your name.",
    client: "Your brand here",
    location: "Abuja",
    year: "2025",
    services: ["Market Activations", "Brand Promotions", "Lead Generation"],
    art: "umbrella",
    accent: "navy",
    brief: "A new brand with one weekend and a lot of foot traffic it hasn't earned yet. Shoppers walk past a hundred stands; you need them to walk up to one.",
    play: "A pop-up built around a participation moment — a game, a reveal, a prize — with staff who read the crowd, a clear offer and a capture point that doesn't feel like a form. Designed to be photographed, because that's the second audience.",
    measure: "Footfall to engagement rate, leads captured, offers redeemed and the content your visitors made for you.",
    deliverables: ["Concept, build & branding", "Staffing & crowd management", "Lead capture flow", "Photo/video coverage brief"]
  },
  {
    slug: "follow-back",
    sample: true,
    title: "Follow-Back",
    tagline: "A bigger number is easy. An audience that shows up is the job.",
    client: "Your brand here",
    location: "Nigeria-wide",
    year: "2025",
    services: ["Social Followership Campaigns", "Customer Engagement"],
    art: "wave",
    accent: "paper",
    brief: "A brand with great product and a quiet page. The goal isn't followers for the sake of followers — it's people who comment, share and buy.",
    play: "Real-world prompts that send people online (and online prompts that send them to the stall), creator and community seeding, and a posting rhythm built around what your audience actually answers to.",
    measure: "Follower quality — engagement per post, saves, shares, DMs and referral traffic — not just the headline count.",
    deliverables: ["Audience & content plan", "On-ground + online campaign", "Community management", "Monthly growth report"]
  },
  {
    slug: "launch-day-street-team",
    sample: true,
    title: "Launch Day Street Team",
    tagline: "Fifty trained faces. One brand. Every corner covered.",
    client: "Your brand here",
    location: "Abuja",
    year: "2025",
    services: ["Event Support & Staffing", "Brand Promotions"],
    art: "rings",
    accent: "gold",
    brief: "Launch day is a one-shot. The brand needs a visible, coordinated presence across multiple points in the city — and every person representing it has to get it right.",
    play: "Recruit, train and brief a street team the week before; route them across high-traffic points with a clear script, uniforms and a live check-in so you can see the whole operation in real time.",
    measure: "Coverage by location, contacts made, materials distributed and incident-free delivery — reported the same day.",
    deliverables: ["Recruitment & training", "Uniforms & materials", "Route planning & supervision", "Same-day field report"]
  },
  {
    slug: "ground-truth-market-insight",
    sample: true,
    title: "Ground Truth",
    tagline: "Know the market before you spend a naira on it.",
    client: "Your brand here",
    location: "Abuja & environs",
    year: "2025",
    services: ["Market & Business Insight", "Lead Generation", "Business Development Support"],
    art: "grid",
    accent: "navy",
    brief: "A business weighing a new product, price or location with more opinions than evidence. They need what real buyers and sellers say, in the places they say it.",
    play: "Structured street-level interviews and observation, mystery-shop style checks on competitors and pricing, then a clear read-out: what's true, what's assumed and what to do next.",
    measure: "Decisions made faster and with less guesswork — plus a clean dataset you can reuse.",
    deliverables: ["Research design", "Field interviews & observation", "Competitor & price audit", "Insight deck with recommendations"]
  }
];
