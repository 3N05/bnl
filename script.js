/* ============================================================================
   BRIDGEWORKS NETWORK LIMITED — script.js   (Final Polish)
   ============================================================================
   01. Page Switcher
   02. Navigation — scroll shadow + hamburger
   03. Scroll-To Helper
   04. Scroll Reveal
   05. Slideshow — fully rebuilt to sync captions with new HTML structure
   06. Contact Form — submit feedback
   ============================================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ==========================================================================
     01. PAGE SWITCHER
     ========================================================================== */
  function showPage(name) {
    document.querySelectorAll('.page').forEach(function (p) {
      p.classList.remove('active');
    });

    var target = document.getElementById('page-' + name);
    if (target) target.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-run reveals for the newly visible page
    setTimeout(checkReveals, 100);
  }

  // Expose globally so onclick attributes in HTML can call it
  window.showPage = showPage;


  /* ==========================================================================
     02. NAVIGATION
     ========================================================================== */
  var mainNav    = document.getElementById('main-nav');
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', function () {
    if (mainNav) mainNav.classList.toggle('scrolled', window.scrollY > 20);
  });

  window.toggleMobileMenu = function () {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  };

  window.closeMobileMenu = function () {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  };

  // Close mobile menu when clicking outside
  document.addEventListener('click', function (e) {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      if (!mainNav.contains(e.target)) {
        window.closeMobileMenu();
      }
    }
  });


  /* ==========================================================================
     03. SCROLL-TO HELPER
     ========================================================================== */
  window.scrollToSection = function (id) {
    setTimeout(function () {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };


  /* ==========================================================================
     04. SCROLL REVEAL
     ========================================================================== */
  function checkReveals() {
    var threshold = window.innerHeight - 60;
    document.querySelectorAll('.reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top < threshold) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkReveals);
  checkReveals(); // run once on load


  /* ==========================================================================
     05. SLIDESHOW  — fade based, bullet-proof
     ========================================================================== */
  (function () {

    var slides   = document.querySelectorAll('.bnl-slide');
    var captions = document.querySelectorAll('.bnl-caption');
    var dotsWrap = document.getElementById('bnl-dots');
    var prevBtn  = document.getElementById('bnl-prev');
    var nextBtn  = document.getElementById('bnl-next');

    if (!slides.length || !dotsWrap || !prevBtn || !nextBtn) return;

    var total   = slides.length;
    var current = 0;
    var timer   = null;

    /* Build dots */
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className   = 'bnl-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', onDotClick);
      dotsWrap.appendChild(dot);
    }

    function onDotClick() {
      goTo(parseInt(this.getAttribute('data-index')));
      resetTimer();
    }

    /* Show slide n, hide all others */
    function goTo(n) {
      current = ((n % total) + total) % total;

      slides.forEach(function (s, i) {
        s.classList.toggle('active', i === current);
      });

      captions.forEach(function (c, i) {
        c.classList.toggle('active', i === current);
      });

      dotsWrap.querySelectorAll('.bnl-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    prevBtn.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); resetTimer(); });

    /* Auto-play */
    function startTimer() { timer = setInterval(function () { goTo(current + 1); }, 5000); }
    function resetTimer()  { clearInterval(timer); startTimer(); }

    /* Pause on hover */
    var card = document.querySelector('.bnl-slider');
    if (card) {
      card.addEventListener('mouseenter', function () { clearInterval(timer); });
      card.addEventListener('mouseleave', startTimer);
    }

    /* Touch swipe on image area */
    var imgArea = document.querySelector('.bnl-slider__images');
    if (imgArea) {
      var tx = 0;
      imgArea.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].screenX; }, { passive: true });
      imgArea.addEventListener('touchend', function (e) {
        var diff = tx - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetTimer(); }
      }, { passive: true });
    }

    /* Keyboard */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { goTo(current - 1); resetTimer(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); resetTimer(); }
    });

    goTo(0);
    startTimer();

  })();


}); // end DOMContentLoaded
