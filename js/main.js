(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Header shadow / condense on scroll
  var header = document.getElementById("siteHeader");
  var lastY = window.scrollY;
  window.addEventListener(
    "scroll",
    function () {
      var y = window.scrollY;
      if (header) {
        header.style.boxShadow =
          y > 8 ? "0 8px 30px -20px rgba(7,26,61,.35)" : "none";
      }
      lastY = y;
    },
    { passive: true }
  );

  // Scroll reveal
  var revealTargets = document.querySelectorAll(".reveal, [data-animate]");
  if ("IntersectionObserver" in window && revealTargets.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // Auto-tag scroll-animated groups that don't already use .reveal
  document
    .querySelectorAll(
      ".value-card, .bento-card, .step, .mv-card, .contact-list li"
    )
    .forEach(function (el, i) {
      el.setAttribute("data-animate", "");
      el.style.transitionDelay = Math.min(i % 4, 3) * 0.08 + "s";
    });

  // Re-run observer for newly tagged elements
  if ("IntersectionObserver" in window) {
    var io2 = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io2.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    document.querySelectorAll("[data-animate]").forEach(function (el) {
      io2.observe(el);
    });
  }

  // Safety net: never let content stay permanently hidden
  window.addEventListener("load", function () {
    setTimeout(function () {
      document.querySelectorAll(".reveal, [data-animate]").forEach(function (el) {
        el.classList.add("is-visible");
      });
    }, 3000);
  });
})();
