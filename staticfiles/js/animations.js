// ===== LEARNERS TRACK - ANIMATIONS & INTERACTIONS =====

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initReveal();
  initNavDropdown();
  initPageTransition();
  initRipple();
});

// Navbar scroll effect
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// Intersection Observer for reveal animations
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Nav dropdown toggle
function initNavDropdown() {
  const btn = document.getElementById('navMenuBtn');
  const dropdown = document.getElementById('navDropdown');
  if (!btn || !dropdown) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
    const isOpen = dropdown.classList.contains('open');
    btn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('open');
    btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
}

// Page transition fade
function initPageTransition() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

  document.querySelectorAll('a[href^="/"], a[href^="./"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && link.target !== '_blank') {
        e.preventDefault();
        document.body.style.opacity = '0';
        setTimeout(() => window.location.href = href, 250);
      }
    });
  });
}

// Ripple on buttons
function initRipple() {
  document.querySelectorAll('.btn, .apply-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;
        border-radius:50%;background:rgba(255,255,255,0.25);
        transform:translate(-50%,-50%) scale(0);
        left:${e.clientX - rect.left}px;top:${e.clientY - rect.top}px;
        animation:rippleAnim 0.55s ease-out forwards;pointer-events:none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// Global ripple keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleAnim {
    to { transform: translate(-50%,-50%) scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Staggered card animations
function staggerCards(selector) {
  document.querySelectorAll(selector).forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 80);
  });
}

window.staggerCards = staggerCards;
