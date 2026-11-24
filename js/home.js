document.addEventListener("arcon:chrome-ready", function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);

  /* ---- Hero: cursor parallax + scroll recede ---- */
  var heroVisual = document.querySelector(".hero__visual");
  if (heroVisual && !reduced) {
    document.querySelector(".hero").addEventListener("pointermove", function (e) {
      var rect = this.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      heroVisual.style.transform = "translate(" + (px * -14) + "px," + (py * -14) + "px)";
    });
  }

  if (!hasGSAP || reduced) {
    document.querySelectorAll(".ambition__words span").forEach(function (s) { s.classList.add("is-lit"); });
    var ambitionFallback = document.querySelector(".ambition");
    if (ambitionFallback) ambitionFallback.style.minHeight = "auto";
    return;
  }

  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;

  /* ---- Hero recede on scroll ---- */
  gsap.to(".hero__stage", {
    scale: 0.97,
    opacity: 0.55,
    y: -30,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.5 }
  });

  /* ---- Ambition: pinned scrub — lead line, then word ignition ---- */
  var leadSpans = document.querySelectorAll(".ambition__lead .split-line span");
  var wordSpans = document.querySelectorAll(".ambition__words span");

  var ambitionTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".ambition",
      start: "top top",
      end: "+=90%",
      scrub: 0.5,
      pin: ".ambition__lockup"
    }
  });
  if (leadSpans.length) {
    ambitionTl.fromTo(leadSpans, { yPercent: 110 }, { yPercent: 0, stagger: 0.08, ease: "none" }, 0);
  }
  wordSpans.forEach(function (span, i) {
    ambitionTl.to(span, { opacity: 1, color: "#7ed957", ease: "none" }, 0.5 + i * 0.15);
  });

  /* ---- Role: rises in as ambition settles ---- */
  gsap.fromTo(".role", { opacity: 0.2, y: 60 }, {
    opacity: 1, y: 0, ease: "none",
    scrollTrigger: { trigger: ".role", start: "top 90%", end: "top 30%", scrub: 0.5 }
  });

  /* ---- Ecosystem cards: staggered entrance ---- */
  gsap.from(".eco-card", {
    y: 70, opacity: 0, stagger: 0.12, ease: "power3.out", duration: 0.9,
    scrollTrigger: { trigger: ".eco-rail", start: "top 80%" }
  });

  /* ---- Experience: scroll-scrubbed counters ---- */
  document.querySelectorAll(".experience__row strong").forEach(function (el) {
    var target = Number(el.dataset.count || 0);
    var proxy = { val: 0 };
    gsap.to(proxy, {
      val: target, ease: "none",
      scrollTrigger: { trigger: el, start: "top 85%", end: "top 35%", scrub: 0.5 },
      onUpdate: function () { el.textContent = Math.round(proxy.val); }
    });
  });

  /* ---- Approach: pinned clip-path reveal ---- */
  var approachLines = document.querySelectorAll(".statement .split-line");
  if (approachLines.length) {
    gsap.set(approachLines, { clipPath: "inset(0 100% 0 0)" });
    gsap.to(approachLines, {
      clipPath: "inset(0 0% 0 0)",
      stagger: 0.15,
      ease: "none",
      scrollTrigger: { trigger: ".approach", start: "top 70%", end: "top 10%", scrub: 0.5 }
    });
  }
});
