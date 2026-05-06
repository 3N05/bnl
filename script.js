/* ============================================================================
   BRIDGEWORKS NETWORK LIMITED — script.js
   ============================================================================
   01. Page Switcher    — show/hide Home vs About
   02. Navigation       — scroll shadow + hamburger
   03. Scroll-To Helper — smooth scroll to section by ID
   04. Scroll Reveal    — animate elements into view
   05. Slideshow        — prev/next, dots, auto-play, swipe, keyboard
   06. Contact Form     — submit button feedback
   ============================================================================ */


/* ============================================================================
   01. PAGE SWITCHER
   ============================================================================ */
function showPage(name) {
  document.querySelectorAll('.page').forEach(function (p) {
    p.classList.remove('active');
  });

  var target = document.getElementById('page-' + name);
  if (target) target.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-check reveals after the new page appears
  setTimeout(checkReveals, 100);
}


/* ============================================================================
   02. NAVIGATION
   ============================================================================ */
var mainNav    = document.getElementById('main-nav');
var hamburger  = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', function () {
  mainNav.classList.toggle('scrolled', window.scrollY > 20);
});

function toggleMobileMenu() {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
}

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}


/* ============================================================================
   03. SCROLL-TO HELPER
   ============================================================================ */
function scrollToSection(id) {
  setTimeout(function () {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 60);
}


/* ============================================================================
   04. SCROLL REVEAL
   Elements with class="reveal" animate in when they enter the viewport.
   ============================================================================ */
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


/* ============================================================================
   05. SLIDESHOW
   Clean implementation with no positioning bugs:
   - The track moves by translateX(-currentIndex * 100%)
   - Arrow buttons are inside .slideshow (overflow:hidden) → clipped correctly
   - Dots are outside .slideshow → never clipped
   ============================================================================ */
(function () {

  var track   = document.getElementById('slides-track');
  var prevBtn = document.getElementById('slide-prev');
  var nextBtn = document.getElementById('slide-next');
  var dotsEl  = document.getElementById('slide-dots');

  // Exit gracefully if slideshow isn't on the page
  if (!track || !prevBtn || !nextBtn || !dotsEl) return;

  var slides  = track.querySelectorAll('.slide');
  var total   = slides.length;
  var current = 0;
  var timer   = null;

  /* Build dot buttons */
  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.className   = 'slide-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', function () { goTo(i); resetTimer(); });
    dotsEl.appendChild(dot);
  });

  /* Move to slide n */
  function goTo(n) {
    current = ((n % total) + total) % total;   // wrap safely
    track.style.transform = 'translateX(-' + current * 100 + '%)';
    dotsEl.querySelectorAll('.slide-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  /* Arrow buttons */
  prevBtn.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); resetTimer(); });

  /* Auto-play */
  function startTimer() {
    timer = setInterval(function () { goTo(current + 1); }, 5000);
  }

  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  /* Pause on hover */
  var slideshow = track.closest('.slideshow');
  slideshow.addEventListener('mouseenter', function () { clearInterval(timer); });
  slideshow.addEventListener('mouseleave', function () { startTimer(); });

  /* Touch / swipe support */
  var touchX = 0;
  slideshow.addEventListener('touchstart', function (e) {
    touchX = e.changedTouches[0].screenX;
  }, { passive: true });

  slideshow.addEventListener('touchend', function (e) {
    var diff = touchX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetTimer(); }
  }, { passive: true });

  /* Keyboard arrow support */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); resetTimer(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetTimer(); }
  });

  startTimer();

})();


/* ============================================================================
   06. CONTACT FORM — Submit feedback
   Replace the contents of this handler with your real form submission
   (e.g. Formspree, EmailJS, or your own backend).
   ============================================================================ */
var submitBtn = document.getElementById('submit-btn');

if (submitBtn) {
  submitBtn.addEventListener('click', function () {
    submitBtn.textContent = 'Message Sent ✓';
    submitBtn.style.background = '#3a7d44';
    submitBtn.disabled = true;

    setTimeout(function () {
      submitBtn.textContent = 'Send Message';
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 3000);

    /*
     * FORMSPREE EXAMPLE (uncomment and add your form ID):
     *
     * fetch('https://formspree.io/f/YOUR_FORM_ID', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify({
     *     name:    document.getElementById('contact-name').value,
     *     email:   document.getElementById('contact-email').value,
     *     reason:  document.getElementById('contact-reason').value,
     *     message: document.getElementById('contact-message').value,
     *   })
     * });
     */
  });
}
