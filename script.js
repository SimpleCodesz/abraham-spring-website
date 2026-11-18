(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // Mini rings: the app's four rings (Protocol, Recovery, Sleep, Load), outside to inside
  var RING_COLOURS = ['#FFE814', '#00FF88', '#BF5FFF', '#FC4C02'];
  var RING_RADII = [92, 74, 56, 38];
  $$('.mini.ringfig').forEach(function (el) {
    var v = el.getAttribute('data-v').split(',');
    var s = '<svg class="rings" viewBox="0 0 200 200" aria-hidden="true">';
    RING_RADII.forEach(function (r, i) {
      s += '<circle class="trk" cx="100" cy="100" r="' + r + '" style="--c:' + RING_COLOURS[i] + '"/>' +
           '<circle class="rg r' + (i + 1) + '" cx="100" cy="100" r="' + r + '" pathLength="100" style="--c:' + RING_COLOURS[i] + ';--v:' + v[i] + '"/>';
    });
    el.innerHTML = s + '</svg>';
  });

  // Nav: solid bar after scrolling, mobile menu
  var nav = $('#nav'), burger = $('#burger'), links = $('#navLinks');
  function onScroll() { nav.classList.toggle('stuck', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    if (open) nav.classList.add('stuck');
  });
  $$('a', links).forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      onScroll();
    });
  });

  // Explore menu
  var exBtn = $('#exploreBtn'), exPanel = $('#explore');
  if (exBtn && exPanel) {
    var closeEx = function () { exPanel.hidden = true; exBtn.setAttribute('aria-expanded', 'false'); };
    exBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = exPanel.hidden;
      exPanel.hidden = !open;
      exBtn.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function (e) { if (!exPanel.contains(e.target)) closeEx(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeEx(); });
  }

  // Reveal on scroll
  var revealTargets = $$('.rv').concat($$('.ringfig'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  // Package stage tabs (home page only)
  var tabs = $$('.stage-tabs [role=tab]'), bar = $('.tab-bar');
  if (!tabs.length) return;
  function moveBar(t) {
    bar.style.width = t.offsetWidth + 'px';
    bar.style.transform = 'translateX(' + (t.offsetLeft - 5) + 'px)';
  }
  function select(i) {
    tabs.forEach(function (t, n) {
      var on = n === i;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      var panel = $('#' + t.getAttribute('aria-controls'));
      panel.hidden = !on;
      var mini = $('.mini', panel);
      if (mini) {
        mini.classList.remove('in');
        if (on) { void mini.offsetWidth; setTimeout(function () { mini.classList.add('in'); }, 60); }
      }
    });
    moveBar(tabs[i]);
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(i); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') n = (i + tabs.length - 1) % tabs.length;
      if (n !== null) { e.preventDefault(); select(n); tabs[n].focus(); }
    });
  });
  moveBar(tabs[0]);
  window.addEventListener('resize', function () {
    var cur = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0];
    moveBar(cur);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveBar(tabs[0]); });

  // Shape your package: chips feed the booking form
  var chips = $$('.chip'), out = $('#builderText'), field = $('#focusField');
  function update() {
    var picked = chips.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; })
      .map(function (c) { return c.textContent.trim(); });
    if (!picked.length) {
      out.textContent = 'Choose a focus to see where your package begins.';
      return;
    }
    var list = picked.length > 1 ? picked.slice(0, -1).join(', ').toLowerCase() + ' and ' + picked[picked.length - 1].toLowerCase() : picked[0].toLowerCase();
    out.textContent = 'Your package begins with the Read stage, focused on: ' + list + '.';
    field.value = 'Focus: ' + picked.join('; ');
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') !== 'true');
      update();
    });
  });
})();
