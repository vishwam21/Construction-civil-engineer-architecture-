(function () {
  "use strict";

  /* =========================================================
     CONFIG
     Replace CONSULTATION_ENDPOINT with your deployed Google
     Apps Script Web App URL (see /apps-script/Code.gs and
     README.md). No credentials belong in this file.
     ========================================================= */
  var CONSULTATION_ENDPOINT = ""; // e.g. "https://script.google.com/macros/s/XXXXXXXX/exec"

  /* =========================================================
     Mobile navigation
     ========================================================= */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* =========================================================
     Back to top button
     ========================================================= */
  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 500) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    });
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =========================================================
     Service + project card data (line-icons drawn as inline SVG
     to match the blueprint linework aesthetic)
     ========================================================= */
  var icons = {
    plan: '<path d="M4 26 L4 4 L26 4 L26 26 Z" /><path d="M4 14 H26 M14 4 V26" />',
    design: '<path d="M4 26 L18 4 L26 8 L12 26 Z" /><path d="M15 8 L22 12" />',
    civil: '<circle cx="15" cy="10" r="5" /><path d="M15 15 V26 M8 26 H22" />',
    floor2d: '<path d="M4 8 H26 V24 H4 Z" /><path d="M4 16 H14 V24 M14 16 V8" />',
    build3d: '<path d="M15 3 L27 9 V21 L15 27 L3 21 V9 Z" /><path d="M3 9 L15 15 L27 9 M15 15 V27" />',
    construction: '<path d="M4 26 L26 26" /><path d="M8 26 V16 L15 6 L22 16 V26" /><path d="M11 26 V20 H19 V26" />',
    estimate: '<path d="M6 4 H24 V26 H6 Z" /><path d="M10 10 H20 M10 15 H20 M10 20 H16" />',
    renovate: '<path d="M5 20 L14 11 L19 16 L10 25 Z" /><path d="M17 8 L22 13 M20 5 L25 10" />'
  };

  var services = [
    { icon: "plan", no: "S-01", title: "Home Planning", desc: "Layout and space planning that fits your site, budget and how you plan to live in the home." },
    { icon: "design", no: "S-02", title: "Architectural Design", desc: "Design development that balances appearance, function and buildability." },
    { icon: "civil", no: "S-03", title: "Civil Engineering Consultation", desc: "Guidance on load paths, foundations and site conditions before construction begins." },
    { icon: "floor2d", no: "S-04", title: "2D Floor Plans", desc: "Clear, dimensioned floor plans for approvals, contractors and your own reference." },
    { icon: "build3d", no: "S-05", title: "3D Building Design", desc: "Three-dimensional views to help you visualize the finished building before it is built." },
    { icon: "construction", no: "S-06", title: "Construction Planning", desc: "Sequencing and site logistics guidance to keep a build organized from start to finish." },
    { icon: "estimate", no: "S-07", title: "Building Estimation", desc: "Estimation support to help you understand the scope of work involved in your project." },
    { icon: "renovate", no: "S-08", title: "Renovation & Remodeling", desc: "Planning support for extending, renovating or reconfiguring an existing property." }
  ];

  var projectTypes = [
    { icon: "plan", no: "P-01", title: "New Residential Construction", desc: "Ground-up home building projects, from planning through construction guidance." },
    { icon: "renovate", no: "P-02", title: "Renovation & Remodeling", desc: "Updating, extending or reconfiguring existing residential properties." },
    { icon: "civil", no: "P-03", title: "Site Development", desc: "Site planning and civil engineering input for new construction sites." },
    { icon: "construction", no: "P-04", title: "Structural Planning Projects", desc: "Structural consultation as part of a wider planning or construction project." }
  ];

  function renderCards(containerId, items) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var html = items.map(function (item) {
      return (
        '<article class="service-card reveal">' +
          '<span class="sheet-no">' + item.no + '</span>' +
          '<svg class="service-icon" viewBox="0 0 30 30" aria-hidden="true">' + icons[item.icon] + '</svg>' +
          '<h3>' + item.title + '</h3>' +
          '<p>' + item.desc + '</p>' +
        '</article>'
      );
    }).join("");
    container.innerHTML = html;
  }

  renderCards("serviceGrid", services);
  renderCards("projectGrid", projectTypes);

  /* =========================================================
     Scroll reveal — subtle single-style fade/rise, observed once
     ========================================================= */
  var revealTargets = document.querySelectorAll(
    ".reveal, .about-grid, .titleblock-card, .plan-cta-inner, .consultation-grid, .contact-inner"
  );

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
      observer.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* =========================================================
     Consultation form validation + submission
     ========================================================= */
  var form = document.getElementById("consultationForm");
  var statusEl = document.getElementById("formStatus");
  var submitBtn = document.getElementById("submitBtn");

  var validators = {
    name: function (v) { return v.trim().length > 1; },
    number: function (v) { return /^[+\d][\d\s\-()]{6,}$/.test(v.trim()); },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
    description: function (v) { return v.trim().length > 4; }
  };

  var messages = {
    name: "Please enter your name.",
    number: "Please enter a valid contact number.",
    email: "Please enter a valid email address.",
    description: "Please describe what you need help with."
  };

  function validateField(field) {
    var input = form.elements[field];
    var errorEl = document.getElementById("err-" + field);
    var valid = validators[field](input.value);
    input.setAttribute("data-touched", "true");
    if (errorEl) errorEl.textContent = valid ? "" : messages[field];
    return valid;
  }

  if (form) {
    ["name", "number", "email", "description"].forEach(function (field) {
      var input = form.elements[field];
      if (!input) return;
      input.addEventListener("blur", function () { validateField(field); });
      input.addEventListener("input", function () {
        if (input.getAttribute("data-touched") === "true") validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // honeypot: if filled, silently drop (bot submission)
      if (form.elements["company"] && form.elements["company"].value) {
        return;
      }

      var fields = ["name", "number", "email", "description"];
      var allValid = fields.map(validateField).every(Boolean);

      if (!allValid) {
        statusEl.textContent = "Please correct the highlighted fields and try again.";
        statusEl.className = "form-status error";
        return;
      }

      var payload = {
        name: form.elements["name"].value.trim(),
        number: form.elements["number"].value.trim(),
        email: form.elements["email"].value.trim(),
        description: form.elements["description"].value.trim()
      };

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      submitConsultation(payload)
        .then(function () {
          statusEl.textContent = "Thank you! Your consultation request has been submitted. We will contact you soon.";
          statusEl.className = "form-status success";
          form.reset();
          fields.forEach(function (f) {
            form.elements[f].removeAttribute("data-touched");
            var errorEl = document.getElementById("err-" + f);
            if (errorEl) errorEl.textContent = "";
          });
        })
        .catch(function () {
          statusEl.textContent =
            "We could not submit your request automatically. Please email patelharsha680@gmail.com directly, or try again shortly.";
          statusEl.className = "form-status error";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit Consultation Request";
        });
    });
  }

  function submitConsultation(payload) {
    if (!CONSULTATION_ENDPOINT) {
      // No backend configured yet — see README.md for setup instructions.
      return Promise.reject(new Error("Consultation endpoint not configured."));
    }
    return fetch(CONSULTATION_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error("Request failed");
      return res;
    });
  }
})();
