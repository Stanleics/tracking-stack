/* ============================================================
   Astec — UI Interactions
   Navbar · Mobile menu · FAQ · Scroll reveal · Active nav
   ============================================================ */

// ── Navbar & floating button on scroll ──────────────────────
const navbar   = document.getElementById('navbar');
const floatBtn = document.getElementById('whatsapp-float');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 20;
  navbar?.classList.toggle('scrolled', scrolled);
  floatBtn?.classList.toggle('visible', window.scrollY > 200);
}, { passive: true });

// ── Mobile menu ──────────────────────────────────────────────
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu    = document.getElementById('mobile-menu');

mobileMenuBtn?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  mobileMenuBtn.setAttribute('aria-expanded', String(open));
  const icon = mobileMenuBtn.querySelector('iconify-icon');
  if (icon) icon.setAttribute('icon', open ? 'solar:close-circle-linear' : 'solar:hamburger-menu-linear');
});

document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu?.classList.remove('open');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    const icon = mobileMenuBtn?.querySelector('iconify-icon');
    if (icon) icon.setAttribute('icon', 'solar:hamburger-menu-linear');
  });
});

document.addEventListener('click', e => {
  if (!navbar?.contains(e.target)) {
    mobileMenu?.classList.remove('open');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
  }
});

// ── Smooth scroll for anchor links (atualiza a URL pro #hash,
//    pra poder usar essas URLs como sitelinks no Google Ads) ───
const NAV_OFFSET = 80;

function scrollToHash(hash, behavior) {
  const target = document.querySelector(hash);
  if (!target) return false;
  const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top, behavior: behavior || 'smooth' });
  return true;
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    if (!scrollToHash(href)) return;
    e.preventDefault();
    history.pushState(null, '', href);
  });
});

// Chegou direto numa URL com #hash (ex: clique num sitelink do Google
// Ads)? Corrige a posição considerando a navbar fixa — o navegador já
// pulou pro alvo sem esse desconto antes do nosso JS rodar.
if (window.location.hash) {
  document.addEventListener('DOMContentLoaded', () => {
    scrollToHash(window.location.hash, 'auto');
  });
}

// ── Scroll reveal (IntersectionObserver) ────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Solution cards entrance animation ───────────────────────
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.solution-card');
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 80);
      });
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

const solutionGrid = document.getElementById('solucoes-grid');
if (solutionGrid) cardObserver.observe(solutionGrid);

// ── Active nav link on scroll ────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
    }
  });
}, { threshold: 0.25 });

sections.forEach(s => navObserver.observe(s));

// ── FAQ Accordion ────────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const trigger = item.querySelector('.faq-trigger');
  const content = item.querySelector('.faq-content');

  if (!trigger || !content) return;

  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach(open => {
      open.classList.remove('open');
      open.querySelector('.faq-content')?.classList.remove('open');
      open.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      content.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });

  trigger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger.click(); }
    if (e.key === 'Escape') {
      item.classList.remove('open');
      content.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
});
