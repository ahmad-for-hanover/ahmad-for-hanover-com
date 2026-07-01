/* ==========================================================================
   Ahmad for Hanover  —  script.js
   Minimal: mobile nav toggle only.
   ========================================================================== */
(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  // Close the menu after tapping a link (mobile)
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A" && nav.classList.contains("open")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
  });
})();
/* ---- Issues overlay: open/close, prev/next, swipe, keyboard, dots ---- */
(function () {
  var overlay = document.getElementById('issue-overlay');
  if (!overlay) return;

  var tpl = document.getElementById('issue-data');
  var entries = Array.prototype.slice.call(tpl.content.querySelectorAll('[data-title]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.issue-card'));

  var elCount = document.getElementById('overlay-count');
  var elTitle = document.getElementById('overlay-title');
  var elBody = document.getElementById('overlay-body');
  var elDots = document.getElementById('overlay-dots');
  var btnPrev = document.getElementById('overlay-prev');
  var btnNext = document.getElementById('overlay-next');
  var panel = overlay.querySelector('.issue-overlay-panel');

  var current = 0;
  var lastFocused = null;

  entries.forEach(function () {
    var dot = document.createElement('span');
    elDots.appendChild(dot);
  });
  var dots = Array.prototype.slice.call(elDots.children);

  function render(i) {
    current = (i + entries.length) % entries.length;
    var entry = entries[current];
    elCount.textContent = 'Issue ' + (current + 1) + ' of ' + entries.length;
    elTitle.textContent = entry.getAttribute('data-title');
    elBody.innerHTML = entry.innerHTML;
    dots.forEach(function (d, di) {
      d.className = di === current ? 'active' : '';
    });
    panel.scrollTop = 0;
  }

  function open(i) {
    lastFocused = document.activeElement;
    render(i);
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    btnNext.focus();
  }

  function close() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  function next() { render(current + 1); }
  function prev() { render(current - 1); }

  cards.forEach(function (card) {
    var idx = parseInt(card.getAttribute('data-issue'), 10);
    card.addEventListener('click', function () { open(idx); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(idx);
      }
    });
  });

  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);

  overlay.querySelectorAll('[data-close]').forEach(function (el) {
    el.addEventListener('click', close);
  });

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  });

  var touchX = null;
  panel.addEventListener('touchstart', function (e) {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });
  panel.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    touchX = null;
  }, { passive: true });
})();