window.ArconEnquiry = (function () {
  "use strict";

  var REQUIREMENTS = ["Funding", "CA Services", "Marketing (PLSTC)", "Technology", "Multiple Services", "Other"];

  function markup() {
    var checkboxes = REQUIREMENTS.map(function (r, i) {
      var id = "req-" + i;
      return '<label><input type="checkbox" name="requirement" value="' + r + '" id="' + id + '"> ' + r + "</label>";
    }).join("");

    return (
      '<div class="drawer-scrim" id="drawer-scrim"></div>' +
      '<aside class="drawer" id="enquiry-drawer" aria-hidden="true">' +
        '<div class="drawer__head">' +
          "<div><h3>Start a conversation</h3><p>Tell us where the business is going — we’ll help build what it needs to get there.</p></div>" +
          '<button class="drawer__close" id="drawer-close" type="button" aria-label="Close">✕</button>' +
        "</div>" +
        '<div class="drawer__success" id="drawer-success" role="status">' +
          '<div class="drawer__success-mark">✓</div>' +
          "<h4>Received.</h4>" +
          "<p>Someone from ARCON will be in touch shortly.</p>" +
        "</div>" +
        '<form id="enquiry-form" novalidate>' +
          '<div class="field-row"><div class="field"><label for="ef-name">Full Name</label><input id="ef-name" name="fullName" type="text" autocomplete="name" required><span class="form-error" id="ef-name-err">Please enter your name.</span></div><div class="field"><label for="ef-email">Email</label><input id="ef-email" name="email" type="email" autocomplete="email" required><span class="form-error" id="ef-email-err">Please enter a valid email.</span></div></div>' +
          '<div class="field-row"><div class="field"><label for="ef-phone">Phone</label><input id="ef-phone" name="phone" type="tel" autocomplete="tel" required><span class="form-error" id="ef-phone-err">Please enter a valid phone number.</span></div><div class="field"><label for="ef-company">Company / Business Name</label><input id="ef-company" name="company" type="text" autocomplete="organization"></div></div>' +
          '<div class="field-row"><div class="field"><label for="ef-website">Website</label><input id="ef-website" name="website" type="text" autocomplete="url"></div><div class="field"><label for="ef-city">City / Location</label><input id="ef-city" name="city" type="text" autocomplete="address-level2"></div></div>' +
          '<div class="field"><label for="ef-type">Business Type</label><input id="ef-type" name="businessType" type="text" placeholder="e.g. Startup, SME, Enterprise"></div>' +
          '<div class="field"><label>Requirement</label><div class="checkbox-grid">' + checkboxes + "</div></div>" +
          '<div class="field"><label for="ef-funding">Funding Requirement (optional)</label><input id="ef-funding" name="fundingRequirement" type="text" placeholder="e.g. ₹50L for working capital"></div>' +
          '<div class="field"><label for="ef-info">Additional Information</label><textarea id="ef-info" name="additionalInfo"></textarea></div>' +
          '<div class="field"><label for="ef-contact">Preferred Contact Method</label><select id="ef-contact" name="preferredContact"><option>Phone Call</option><option>WhatsApp</option><option>Email</option></select></div>' +
          '<div class="field field-honeypot" aria-hidden="true"><label for="ef-hp">Leave this field empty</label><input id="ef-hp" name="hpCompanyWebsite" type="text" tabindex="-1" autocomplete="off"></div>' +
          '<button class="drawer__submit magnetic" type="submit" id="ef-submit">Send Enquiry <span>↗</span></button>' +
        "</form>" +
      "</aside>"
    );
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_RE = /^[+()\d][\d()+\-.\s]{6,}$/;

  function validate(form) {
    var ok = true;
    var checks = [
      { field: "fullName", test: function (v) { return v.trim().length > 0; } },
      { field: "email", test: function (v) { return EMAIL_RE.test(v.trim()); } },
      { field: "phone", test: function (v) { return PHONE_RE.test(v.trim()); } }
    ];
    checks.forEach(function (c) {
      var input = form.querySelector('[name="' + c.field + '"]');
      if (!input) return;
      var fieldWrap = input.closest(".field");
      var passed = c.test(input.value || "");
      if (fieldWrap) fieldWrap.classList.toggle("has-error", !passed);
      var err = fieldWrap && fieldWrap.querySelector(".form-error");
      if (err) err.classList.toggle("is-visible", !passed);
      if (!passed) ok = false;
    });
    return ok;
  }

  function open(drawer, scrim) {
    drawer.classList.add("is-open");
    scrim.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close(drawer, scrim) {
    drawer.classList.remove("is-open");
    scrim.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function init() {
    if (document.getElementById("enquiry-drawer")) return;
    var mount = document.createElement("div");
    mount.innerHTML = markup();
    document.body.appendChild(mount);

    var drawer = document.getElementById("enquiry-drawer");
    var scrim = document.getElementById("drawer-scrim");
    var form = document.getElementById("enquiry-form");
    var success = document.getElementById("drawer-success");

    document.addEventListener("click", function (e) {
      if (e.target.closest('[data-open-enquiry]')) {
        open(drawer, scrim);
      }
    });
    form.querySelectorAll(".field input, .field select, .field textarea").forEach(function (el) {
      el.addEventListener("input", function () {
        var fieldWrap = el.closest(".field");
        if (fieldWrap) fieldWrap.classList.remove("has-error");
        var err = fieldWrap && fieldWrap.querySelector(".form-error");
        if (err) err.classList.remove("is-visible");
      });
    });

    document.getElementById("drawer-close").addEventListener("click", function () { close(drawer, scrim); });
    scrim.addEventListener("click", function () { close(drawer, scrim); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close(drawer, scrim);
    });

    var isSubmitting = false;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (isSubmitting) return;
      if (!validate(form)) return;

      var honeypot = form.querySelector('[name="hpCompanyWebsite"]');
      if (honeypot && honeypot.value) {
        // Silently accept-looking response for bots without sending anything.
        success.classList.add("is-visible");
        form.reset();
        return;
      }

      isSubmitting = true;
      var submitBtn = document.getElementById("ef-submit");
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      var formData = new FormData(form);
      var payload = {
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        company: formData.get("company"),
        website: formData.get("website"),
        city: formData.get("city"),
        businessType: formData.get("businessType"),
        requirement: formData.getAll("requirement"),
        fundingRequirement: formData.get("fundingRequirement"),
        additionalInfo: formData.get("additionalInfo"),
        preferredContact: formData.get("preferredContact"),
        sourcePage: window.location.pathname
      };

      var endpoint = window.ARCON_CONFIG && window.ARCON_CONFIG.enquiryEndpoint;
      var finish = function () {
        success.classList.add("is-visible");
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Send Enquiry <span>↗</span>";
        isSubmitting = false;
      };

      if (!endpoint || endpoint.indexOf("REPLACE_WITH") === 0) {
        console.warn("ARCON enquiry endpoint not configured — payload logged instead of sent.", payload);
        setTimeout(finish, 500);
        return;
      }

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      }).then(finish).catch(function (err) {
        console.error("Enquiry submission failed", err);
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Send Enquiry <span>↗</span>";
        isSubmitting = false;
        alert("Something went wrong sending your enquiry. Please try calling +91 96709 23985.");
      });
    });
  }

  return { init: init };
})();
