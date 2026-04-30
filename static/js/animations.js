// ===== SKILSTATION — animations.js =====

/* ── 1. CUSTOM CURSOR ── */
(function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;
  const glow  = document.createElement('div');
  const trail = document.createElement('div');
  glow.className  = 'cursor-glow';
  trail.className = 'cursor-trail';
  document.body.appendChild(glow);
  document.body.appendChild(trail);

  let mx = 0, my = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    glow.style.left = mx + 'px';
    glow.style.top  = my + 'px';
  });
  function animateTrail() {
    tx += (mx - tx) * 0.14;
    ty += (my - ty) * 0.14;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
  const hoverTargets = 'a, button, .btn, .course-card, .feature-card, .job-card, .filter-chip, .quick-chip, .chatbot-fab-btn';
  document.addEventListener('mouseover', e => { if (e.target.closest(hoverTargets)) glow.classList.add('expanded'); });
  document.addEventListener('mouseout',  e => { if (e.target.closest(hoverTargets)) glow.classList.remove('expanded'); });
})();

/* ── 2. HAMBURGER MENU ── */
(function initHamburger() {
  const btn      = document.getElementById('hamburgerBtn');
  const drawer   = document.getElementById('navDrawer');
  const overlay  = document.getElementById('navOverlay');
  const closeBtn = document.getElementById('navDrawerClose');
  if (!btn || !drawer) return;

  function openMenu() {
    btn.classList.add('is-open');
    drawer.classList.add('is-open');
    overlay.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    btn.classList.remove('is-open');
    drawer.classList.remove('is-open');
    overlay.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', e => {
    e.stopPropagation();
    btn.classList.contains('is-open') ? closeMenu() : openMenu();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  drawer.querySelectorAll('.nav-drawer-link').forEach(link => {
    link.addEventListener('click', () => setTimeout(closeMenu, 120));
  });
})();

/* ── 3. NAVBAR SCROLL ── */
(function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });
})();

/* ── 4. PAGE TRANSITION ── */
(function initPageTransition() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.32s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });

  document.querySelectorAll('a[href^="/"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || link.target === '_blank') return;
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 280);
    });
  });
})();

/* ── 5. SCROLL REVEAL ── */
(function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -48px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ── 6. STAGGER CARDS ── */
function staggerCards(selector, baseDelay = 80) {
  const cards = document.querySelectorAll(selector);
  cards.forEach((card, i) => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(28px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.52s cubic-bezier(0.34,1.56,0.64,1)';
      card.style.opacity    = '1';
      card.style.transform  = 'translateY(0)';
    }, i * baseDelay + 60);
  });
}
window.staggerCards = staggerCards;

/* ── 7. MAGNETIC HOVER ── */
(function initMagnetic() {
  if (window.matchMedia('(hover: none)').matches) return;
  const els = document.querySelectorAll('.btn-primary, .btn-outline, .btn-white, .apply-btn, .btn-whatsapp, .btn-phone, .btn-about-cta');
  els.forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.26;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.26;
      el.style.transform = `translate(${dx}px,${dy}px) scale(1.04)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform  = '';
      el.style.transition = 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)';
    });
    el.addEventListener('mouseenter', () => { el.style.transition = 'transform 0.14s ease'; });
  });
})();

/* ── 8. 3D CARD TILT ── */
(function init3DTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  const cards = document.querySelectorAll('.feature-card, .course-card, .enrolled-card, .about-mini-card, .job-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r    = card.getBoundingClientRect();
      const rotX = ((e.clientY - r.top  - r.height/2) / (r.height/2)) * -6;
      const rotY = ((e.clientX - r.left - r.width /2) / (r.width /2)) *  6;
      card.style.transform  = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.02)`;
      card.style.transition = 'transform 0.08s ease';
      card.style.boxShadow  = `${-rotY}px ${rotX}px 36px rgba(232,53,122,0.20)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.52s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.52s ease';
      card.style.boxShadow  = '';
    });
  });
})();

/* ── 9. PARALLAX BLOBS ── */
(function initParallax() {
  const blobs = document.querySelectorAll('.hero-blob');
  if (!blobs.length) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        blobs.forEach((b, i) => {
          b.style.transform = `translateY(${sy * ([0.18,0.26,0.20][i]||0.2)}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ── 10. BUTTON RIPPLE ── */
(function initRipple() {
  document.querySelectorAll('.btn, .apply-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const r    = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2;
      const rpl  = document.createElement('span');
      rpl.style.cssText = `position:absolute;border-radius:50%;
        background:rgba(255,255,255,0.28);
        width:${size}px;height:${size}px;
        left:${e.clientX-r.left-size/2}px;
        top:${e.clientY-r.top-size/2}px;
        transform:scale(0);animation:__rpl 0.6s ease-out forwards;
        pointer-events:none;z-index:10;`;
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(rpl);
      setTimeout(() => rpl.remove(), 680);
    });
  });
  if (!document.getElementById('__rplStyle')) {
    const s = document.createElement('style');
    s.id = '__rplStyle';
    s.textContent = `@keyframes __rpl{to{transform:scale(1);opacity:0;}}`;
    document.head.appendChild(s);
  }
})();

/* ── 11. ICON TILT ── */
(function initIconTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.feature-icon, .about-mini-card .icon').forEach(icon => {
    const p = icon.closest('.feature-card, .about-mini-card');
    if (!p) return;
    p.addEventListener('mouseenter', () => {
      icon.style.transition = 'transform 0.32s cubic-bezier(0.34,1.56,0.64,1), filter 0.32s ease';
      icon.style.transform  = 'rotate(-9deg) scale(1.18) translateY(-4px)';
      icon.style.filter     = 'drop-shadow(0 10px 16px rgba(232,53,122,0.40))';
    });
    p.addEventListener('mouseleave', () => {
      icon.style.transform = '';
      icon.style.filter    = '';
    });
  });
})();

/* ── 12. SUBTLE HUE DRIFT ON SCROLL ── */
(function initBodyHue() {
  window.addEventListener('scroll', () => {
    const prog = Math.min(window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1), 1);
    document.body.style.filter = `hue-rotate(${prog * 10}deg)`;
  }, { passive: true });
})();