(function () {
  "use strict";

  var NAV_LINKS = [
    { key: "about", label: "About", href: "/about/" },
    { key: "companies", label: "Ecosystem", href: "/companies/" },
    { key: "plastic", label: "PLSTC", href: "/plastic/" },
    { key: "funding", label: "Funding", href: "/funding/" },
    { key: "technology", label: "Technology", href: "/technology/" },
    { key: "clients", label: "Clients", href: "/clients/" },
    { key: "contact", label: "Contact", href: "/contact/" }
  ];

  var FOOTER_LINKS = [
    { key: "about", label: "About", href: "/about/" },
    { key: "companies", label: "Ecosystem", href: "/companies/" },
    { key: "ca-services", label: "CA Services", href: "/ca-services/" },
    { key: "plastic", label: "PLSTC", href: "/plastic/" },
    { key: "funding", label: "Funding", href: "/funding/" },
    { key: "technology", label: "Technology", href: "/technology/" },
    { key: "clients", label: "Clients", href: "/clients/" },
    { key: "partners", label: "Partners", href: "/partners/" },
    { key: "contact", label: "Contact", href: "/contact/" }
  ];

  var page = document.body.dataset.page || "home";
  var headerTheme = document.body.dataset.headerTheme || "light";
  if (headerTheme === "dark") document.body.setAttribute("data-header-theme", "dark");

  function navLinkHTML(link, active) {
    return '<a href="' + link.href + '"' + (active ? ' class="is-active" aria-current="page"' : "") + ">" + link.label + "</a>";
  }

  function logoSrc() {
    return headerTheme === "dark" ? "/assets/logo-mark-light.png" : "/assets/logo-mark-dark.png";
  }

  function buildHeader() {
    var root = document.getElementById("header-root");
    if (!root) return;
    var links = NAV_LINKS.map(function (l) { return navLinkHTML(l, l.key === page); }).join("");
    root.innerHTML =
      '<header class="site-header" id="site-header">' +
        '<a class="brand" href="/" aria-label="Arcon Growth home"><img class="brand__mark-img" src="' + logoSrc() + '" alt="" width="28" height="22"><span>Arcon <small>Growth</small></span></a>' +
        '<nav class="nav" aria-label="Main navigation">' + links + "</nav>" +
        '<div class="header__cta">' +
          '<a class="header__cta-link" href="tel:+919670923985">Talk to Expert</a>' +
          '<button class="pill pill--dark magnetic" type="button" data-open-enquiry>Let’s Talk <span class="pill__arrow">↗</span></button>' +
        "</div>" +
        '<button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false"><i></i><i></i></button>' +
      "</header>" +
      '<div class="nav-overlay" id="nav-overlay">' +
        NAV_LINKS.map(function (l) { return '<a href="' + l.href + '">' + l.label + "</a>"; }).join("") +
        '<div class="nav-overlay__foot"><a href="tel:+919670923985">+91 96709 23985</a><a href="mailto:hello@arcongrowth.com">hello@arcongrowth.com</a></div>' +
      "</div>";
  }

  function buildFooter() {
    var root = document.getElementById("footer-root");
    if (!root) return;
    var cols = FOOTER_LINKS;
    var half = Math.ceil(cols.length / 2);
    var colA = cols.slice(0, half), colB = cols.slice(half);
    var linkHTML = function (l) { return '<a href="' + l.href + '">' + l.label + "</a>"; };
    root.innerHTML =
      '<footer class="footer">' +
        '<div class="footer__brand"><a class="brand" href="/"><img class="brand__mark-img" src="/assets/logo-mark-light.png" alt="" width="28" height="22"><span>Arcon <small>Growth</small></span></a>' +
        "<p>ARCON GROWTH is the parent brand behind a growing ecosystem of specialist businesses — CA Services, PLSTC, Funding, and Technology.</p></div>" +
        '<div class="footer__col"><h4>Business Enquiries</h4><a href="mailto:hello@arcongrowth.com">hello@arcongrowth.com</a><a href="tel:+917009536458">+91 70095 36458</a><a href="tel:+917217787501">+91 721 778 7501</a></div>' +
        '<div class="footer__col"><h4>Menu</h4>' + colA.map(linkHTML).join("") + "</div>" +
        '<div class="footer__col"><h4>&nbsp;</h4>' + colB.map(linkHTML).join("") + '<h4 style="margin-top:20px">Socials</h4><a href="https://instagram.com/arcongrowth" target="_blank" rel="noreferrer noopener">Instagram ↗</a><a href="https://linkedin.com/company/arcongrowth" target="_blank" rel="noreferrer noopener">LinkedIn ↗</a></div>' +
        '<div class="footer__bottom"><span>© 2026 Arcon Growth</span><span>Capital. Growth. Design. Technology.</span></div>' +
      "</footer>";
  }

  function initHeaderScroll() {
    var header = document.getElementById("site-header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initMobileMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var overlay = document.getElementById("nav-overlay");
    if (!toggle || !overlay) return;
    toggle.addEventListener("click", function () {
      var isOpen = overlay.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    overlay.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        overlay.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  function initReveals() {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var els = document.querySelectorAll(".reveal");
    if (reduced) {
      els.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { observer.observe(el); });
  }

  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = Number(el.dataset.count);
        var start = performance.now();
        var duration = 1400;
        var tick = function (now) {
          var progress = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { observer.observe(el); });
  }

  var MAGNET_RADIUS = 60;
  function initMagnetic() {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    document.addEventListener("pointermove", function (e) {
      document.querySelectorAll(".magnetic").forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = e.clientX - cx;
        var dy = e.clientY - cy;
        var dist = Math.hypot(dx, dy);
        if (dist < rect.width / 2 + MAGNET_RADIUS) {
          var pull = Math.min(1, (rect.width / 2 + MAGNET_RADIUS - dist) / MAGNET_RADIUS);
          el.style.transform = "translate(" + (dx * 0.28 * pull) + "px," + (dy * 0.28 * pull) + "px)";
        } else {
          el.style.transform = "";
        }
      });
    });
  }

  function initTiltCards() {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    document.querySelectorAll(".tilt-card").forEach(function (card) {
      var layer = card.querySelector(".tilt-card__layer");
      card.addEventListener("pointermove", function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = "perspective(900px) rotateX(" + (-py * 8) + "deg) rotateY(" + (px * 10) + "deg) translateY(-6px)";
        if (layer) layer.style.transform = "translate(" + (px * -14) + "px," + (py * -14) + "px) scale(1.04)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
        if (layer) layer.style.transform = "";
      });
    });
  }

  var TRANSITION_KEY = "arcon-transitioning";
  function initPageTransition() {
    var wipe = document.createElement("div");
    wipe.className = "page-wipe";
    document.body.appendChild(wipe);

    if (sessionStorage.getItem(TRANSITION_KEY) === "1") {
      wipe.classList.add("is-covering");
      requestAnimationFrame(function () {
        wipe.classList.add("is-active");
        requestAnimationFrame(function () {
          wipe.classList.remove("is-covering");
        });
      });
      sessionStorage.removeItem(TRANSITION_KEY);
    }

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    document.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (!link) return;
      var href = link.getAttribute("href");
      if (!href || href.charAt(0) === "#") return;
      if (link.target === "_blank") return;
      if (/^(mailto:|tel:|https?:)/i.test(href)) return;
      if (href.charAt(0) !== "/" || href.charAt(1) === "/") return;
      e.preventDefault();
      wipe.classList.add("is-active", "is-covering");
      sessionStorage.setItem(TRANSITION_KEY, "1");
      setTimeout(function () { window.location.href = href; }, 480);
    });
  }

  function initLoader() {
    var loader = document.querySelector(".loader");
    if (!loader) return;
    document.body.classList.add("is-loading");
    var percent = loader.querySelector(".loader__percent");
    var progress = 0;
    var timer = setInterval(function () {
      progress += Math.floor(Math.random() * 18) + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        setTimeout(function () {
          loader.classList.add("done");
          document.body.classList.remove("is-loading");
        }, 250);
      }
      percent.textContent = progress + "%";
    }, 90);
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildHeader();
    buildFooter();
    initLoader();
    initHeaderScroll();
    initMobileMenu();
    initReveals();
    initCounters();
    initMagnetic();
    initTiltCards();
    initPageTransition();
    if (window.ArconEnquiry) window.ArconEnquiry.init();
    if (window.gsap && window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
    document.dispatchEvent(new CustomEvent("arcon:chrome-ready"));
  });
})();
