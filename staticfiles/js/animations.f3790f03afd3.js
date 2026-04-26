// ===== LEARNERS TRACK — PREMIUM ANIMATIONS =====

/* ── 1. CUSTOM CURSOR ── */
(function initCursor() {
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

  const hoverTargets = 'a, button, .btn, .course-card, .feature-card, .job-card, .filter-chip, .quick-chip';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) glow.classList.add('expanded');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) glow.classList.remove('expanded');
  });
})();

/* ── 2. NAVBAR SCROLL ── */
(function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });
})();

/* ── 3. NAV DROPDOWN ── */
(function initNavDropdown() {
  const btn      = document.getElementById('navMenuBtn');
  const dropdown = document.getElementById('navDropdown');
  if (!btn || !dropdown) return;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const open = dropdown.classList.toggle('open');
    btn.innerHTML = open
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });
  document.addEventListener('click', () => {
    dropdown.classList.remove('open');
    btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
})();

/* ── 4. PAGE TRANSITION ── */
(function initPageTransition() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.35s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });

  document.querySelectorAll('a[href^="/"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || link.target === '_blank') return;
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 300);
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
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ── 6. STAGGER CARDS ── */
function staggerCards(selector, baseDelay = 80) {
  const cards = document.querySelectorAll(selector);
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(28px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * baseDelay + 60);
  });
}
window.staggerCards = staggerCards;

/* ── 7. MAGNETIC HOVER ── */
(function initMagnetic() {
  const magneticEls = document.querySelectorAll(
    '.btn-primary, .btn-outline, .btn-white, .apply-btn, .btn-whatsapp, .btn-phone'
  );

  magneticEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const dx   = (e.clientX - rect.left - rect.width  / 2) * 0.28;
      const dy   = (e.clientY - rect.top  - rect.height / 2) * 0.28;
      el.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)';
    });
    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform 0.15s ease';
    });
  });
})();

/* ── 8. 3D CARD TILT ── */
(function init3DTilt() {
  const tiltEls = document.querySelectorAll(
    '.feature-card, .course-card, .enrolled-card, .about-mini-card'
  );

  tiltEls.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const rotX = ((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)) * -7;
      const rotY = ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) *  7;
      card.style.transform  = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.02)`;
      card.style.transition = 'transform 0.08s ease';
      card.style.boxShadow  = `${-rotY * 1.5}px ${rotX * 1.5}px 40px rgba(232,53,122,0.22)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.55s ease';
      card.style.boxShadow  = '';
    });
  });
})();

/* ── 9. PARALLAX SCROLLING ── */
(function initParallax() {
  const blobs = document.querySelectorAll('.hero-blob');
  if (!blobs.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        blobs.forEach((blob, i) => {
          const speed = [0.18, 0.28, 0.22][i] || 0.2;
          blob.style.transform = `translateY(${sy * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ── 10. RIPPLE ── */
(function initRipple() {
  document.querySelectorAll('.btn, .apply-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute; border-radius:50%; background:rgba(255,255,255,0.3);
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top  - size/2}px;
        transform:scale(0); animation:rippleAnim 0.6s ease-out forwards;
        pointer-events:none;
      `;
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  if (!document.getElementById('rippleStyle')) {
    const s = document.createElement('style');
    s.id = 'rippleStyle';
    s.textContent = `@keyframes rippleAnim{to{transform:scale(1);opacity:0;}}`;
    document.head.appendChild(s);
  }
})();

/* ── 11. ICON TILT ── */
(function initIconTilt() {
  document.querySelectorAll('.feature-icon, .about-mini-card .icon').forEach(icon => {
    const parent = icon.closest('.feature-card, .about-mini-card');
    if (!parent) return;
    parent.addEventListener('mouseenter', () => {
      icon.style.transition = 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), filter 0.35s ease';
      icon.style.transform  = 'rotate(-10deg) scale(1.18) translateY(-4px)';
      icon.style.filter     = 'drop-shadow(0 12px 18px rgba(232,53,122,0.42))';
    });
    parent.addEventListener('mouseleave', () => {
      icon.style.transform = '';
      icon.style.filter    = '';
    });
  });
})();

/* ── 12. NAV UNDERLINE ── */
(function initUnderline() {
  document.querySelectorAll('.nav-dropdown a').forEach(link => {
    link.style.backgroundImage    = 'linear-gradient(var(--pink), var(--pink))';
    link.style.backgroundSize     = '0% 2px';
    link.style.backgroundRepeat   = 'no-repeat';
    link.style.backgroundPosition = 'left bottom';
    link.style.transition         = 'background-size 0.3s ease, padding-left 0.2s ease, color 0.2s';
    link.addEventListener('mouseenter', () => { link.style.backgroundSize = '80% 2px'; });
    link.addEventListener('mouseleave', () => { link.style.backgroundSize = '0% 2px'; });
  });
})();

/* ── 13. SUBTLE HUE SHIFT ON SCROLL ── */
(function initBodyGrad() {
  window.addEventListener('scroll', () => {
    const prog = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);
    document.body.style.filter = `hue-rotate(${prog * 12}deg)`;
  }, { passive: true });
})();