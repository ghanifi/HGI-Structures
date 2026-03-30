// HGI Structures — main.js

// MANUAL TESTS (run in browser console after page loads):
// 1. window.scrollY === 0 → document.querySelector('.navbar').classList.contains('at-top') === true
// 2. Scroll down 100px → navbar has class 'scrolled', not 'at-top'
// 3. Click hamburger → mobile-nav has class 'open', hamburger has class 'open'
// 4. Click hamburger again → both classes removed

// ═══════════════════════════════════════════
// NAVBAR — scroll state
// ═══════════════════════════════════════════
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  function updateNavbar() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('at-top');
    } else {
      navbar.classList.add('at-top');
      navbar.classList.remove('scrolled');
    }
  }

  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });
}

// ═══════════════════════════════════════════
// HAMBURGER MENU
// ═══════════════════════════════════════════
function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!btn || !mobileNav) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

// ═══════════════════════════════════════════
// STATS COUNTER (IntersectionObserver)
// ═══════════════════════════════════════════
function initStatsCounter() {
  const statsBar = document.querySelector('.hero-stats');
  if (!statsBar) return;

  const counters = statsBar.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  let fired = false;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * ease);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !fired) {
        fired = true;
        counters.forEach(animateCounter);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsBar);
}

// ═══════════════════════════════════════════
// AOS INIT
// ═══════════════════════════════════════════
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 600, once: true, offset: 60 });
  }
}

// ═══════════════════════════════════════════
// GSAP HERO ANIMATIONS
// ═══════════════════════════════════════════
function initHeroAnimations() {
  if (typeof gsap === 'undefined') return;
  if (!document.querySelector('.hero')) return;

  // Set initial states before animating
  gsap.set(['.hero-label', '.hero-title', '.hero-desc', '.hero-ctas'], { y: 30 });
  gsap.set('.divider-blue', { scaleX: 0 });
  gsap.set('.hero-line', { scaleY: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.hero-label',   { opacity: 1, y: 0, duration: 0.7, delay: 0.2 })
    .to('.hero-title',   { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
    .to('.divider-blue', { opacity: 1, scaleX: 1, duration: 0.4, transformOrigin: 'left' }, '-=0.3')
    .to('.hero-desc',    { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
    .to('.hero-ctas',    { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
    .to('.hero-line',    { opacity: 1, scaleY: 1, duration: 0.8, transformOrigin: 'top', ease: 'power2.inOut' }, '-=0.6');
}

// ═══════════════════════════════════════════
// CONTACT FORM — WhatsApp
// ═══════════════════════════════════════════
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.querySelector('[name="name"]').value.trim();
    const phone   = form.querySelector('[name="phone"]').value.trim();
    const address = form.querySelector('[name="address"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    const text =
      'Hi HGI Structures, I would like to enquire about your services.\n\n' +
      'Name: ' + name + '\n' +
      'Phone: ' + phone + '\n' +
      'Address: ' + address + '\n' +
      'Email: ' + email + '\n\n' +
      'Message:\n' + message;

    const url = 'https://wa.me/447810406669?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
  });
}

// ═══════════════════════════════════════════
// INIT ON DOM READY
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initAOS();
  initHeroAnimations();
  initStatsCounter();
  initContactForm();
});
