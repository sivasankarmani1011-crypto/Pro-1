const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// Mobile hamburger menu
const menuBtn = $('#menuBtn');
const navLinks = $('#navLinks');
function closeMenu() {
  navLinks.classList.remove('open');
  menuBtn.classList.remove('active');
  menuBtn.setAttribute('aria-expanded', 'false');
}
menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.classList.toggle('active', open);
  menuBtn.setAttribute('aria-expanded', open);
});
$$('#navLinks a').forEach(a => a.addEventListener('click', closeMenu));

// Scroll-triggered fade-in (Intersection Observer)
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
$$('.reveal').forEach(el => observer.observe(el));

// Add to Cart counter with bounce
let count = 0;
const badge = $('#cartCount');
function bump(el) {
  el.classList.remove('bump');
  void el.offsetWidth; // restart animation
  el.classList.add('bump');
}
$$('.add-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    count++;
    badge.textContent = count;
    bump(badge);
    bump(btn);
    btn.textContent = 'Added ✓';
    setTimeout(() => (btn.textContent = 'Add to Cart'), 1200);
  });
});

// Parallax depth + navbar shadow on scroll
const layers = $$('[data-speed]');
const nav = $('#nav');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let ticking = false;
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 20);
  if (!reduce) {
    layers.forEach(l => {
      const rect = l.parentElement.getBoundingClientRect();
      if (rect.bottom > -200 && rect.top < innerHeight + 200) {
        l.style.transform = `translateY(${y * l.dataset.speed}px)`;
      }
    });
  }
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

// If an Unsplash image fails to load, remove it so the emoji placeholder shows
$$('img').forEach(img => {
  const fail = () => img.remove();
  img.addEventListener('error', fail);
  if (img.complete && img.naturalWidth === 0) fail();
});

// Footer year
$('#year').textContent = new Date().getFullYear();