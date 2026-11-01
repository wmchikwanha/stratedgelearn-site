/* Stratedge Learning — navigation and carousel. No dependencies. */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  var subs = Array.prototype.slice.call(document.querySelectorAll('.sub-toggle'));
  function closeAll(except) {
    subs.forEach(function (b) {
      if (b === except) return;
      b.setAttribute('aria-expanded', 'false');
      var p = document.getElementById(b.getAttribute('aria-controls'));
      if (p) p.classList.remove('open');
    });
  }
  subs.forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      var p = document.getElementById(b.getAttribute('aria-controls'));
      var open = b.getAttribute('aria-expanded') !== 'true';
      closeAll(b);
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (p) p.classList.toggle('open', open);
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.has-sub')) closeAll();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var openBtn = subs.filter(function (b) { return b.getAttribute('aria-expanded') === 'true'; })[0];
      closeAll();
      if (openBtn) openBtn.focus();
      if (nav && nav.classList.contains('open') && !openBtn) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
    }
  });

  // Carousels: prev/next buttons + gentle autoplay (paused on hover/focus, off for reduced motion)
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  Array.prototype.forEach.call(document.querySelectorAll('[data-carousel]'), function (c) {
    var track = c.querySelector('.track');
    var step = function () { var s = track.querySelector('.slide'); return s ? s.getBoundingClientRect().width + 18 : 200; };
    var prev = c.querySelector('[data-prev]'), next = c.querySelector('[data-next]');
    function go(dir) {
      var max = track.scrollWidth - track.clientWidth - 2;
      if (dir > 0 && track.scrollLeft >= max) track.scrollTo({ left: 0, behavior: 'smooth' });
      else track.scrollBy({ left: dir * step(), behavior: 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    if (!reduce && c.hasAttribute('data-autoplay')) {
      var paused = false;
      ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) { c.addEventListener(ev, function () { paused = true; }, { passive: true }); });
      ['mouseleave', 'focusout'].forEach(function (ev) { c.addEventListener(ev, function () { paused = false; }); });
      setInterval(function () { if (!paused && !document.hidden) go(1); }, 5000);
    }
  });
})();
