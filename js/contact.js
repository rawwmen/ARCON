document.addEventListener("arcon:chrome-ready", function () {
  "use strict";

  var form = document.getElementById("full-enquiry-form");
  var success = document.getElementById("full-form-success");
  if (!form || !success) return;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_RE = /^[+()\d][\d()+\-.\s]{6,}$/;

  function validate() {
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

  form.querySelectorAll(".field input, .field select, .field textarea").forEach(function (el) {
    el.addEventListener("input", function () {
      var fieldWrap = el.closest(".field");
      if (fieldWrap) fieldWrap.classList.remove("has-error");
      var err = fieldWrap && fieldWrap.querySelector(".form-error");
      if (err) err.classList.remove("is-visible");
    });
  });

  var isSubmitting = false;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;

    var honeypot = form.querySelector('[name="hpCompanyWebsite"]');
    if (honeypot && honeypot.value) {
      success.classList.add("is-visible");
      form.reset();
      return;
    }

    isSubmitting = true;
    var btn = document.getElementById("ff-submit");
    btn.disabled = true;
    btn.textContent = "Sending…";

    var fd = new FormData(form);
    var payload = {
      fullName: fd.get("fullName"), email: fd.get("email"), phone: fd.get("phone"),
      company: fd.get("company"), website: fd.get("website"), city: fd.get("city"),
      businessType: fd.get("businessType"), requirement: fd.getAll("requirement"),
      fundingRequirement: fd.get("fundingRequirement"), additionalInfo: fd.get("additionalInfo"),
      preferredContact: fd.get("preferredContact"), sourcePage: window.location.pathname
    };

    var endpoint = window.ARCON_CONFIG && window.ARCON_CONFIG.enquiryEndpoint;
    var finish = function () {
      success.classList.add("is-visible");
      form.reset();
      isSubmitting = false;
    };

    if (!endpoint || endpoint.indexOf("REPLACE_WITH") === 0) {
      console.warn("ARCON enquiry endpoint not configured — payload logged instead of sent.", payload);
      setTimeout(finish, 400);
      return;
    }

    fetch(endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) })
      .then(finish)
      .catch(function () {
        btn.disabled = false;
        btn.innerHTML = "Send Enquiry <span>↗</span>";
        isSubmitting = false;
        alert("Something went wrong sending your enquiry. Please try calling +91 96709 23985.");
      });
  });
});
