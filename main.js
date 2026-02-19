/* ═══════════════════════════════════════════════════════
   SamaSemaProjects — main.js
   Particles · Scroll Reveal · Navbar · Counter · Tilt
═══════════════════════════════════════════════════════ */

'use strict';

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

/* ── Particle Canvas ── */
(function initParticles() {
  const canvas  = document.getElementById('particleCanvas');
  const ctx     = canvas.getContext('2d');
  let W, H, particles;

  const COLORS = ['#FFD60A', '#FFD60A', '#1D4ED8', '#3B82F6', '#FFAA00', '#60A5FA'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = canvas.closest('section').offsetHeight;
  }

  function createParticles() {
    const count = Math.floor((W * H) / 14000);
    particles = Array.from({ length: count }, () => ({
      x:   Math.random() * W,
      y:   Math.random() * H,
      r:   Math.random() * 2.2 + 0.5,
      dx:  (Math.random() - 0.5) * 0.35,
      dy:  (Math.random() - 0.5) * 0.35,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.15,
    }));
  }

  function drawConnections() {
    const threshold = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < threshold) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 214, 10, ${0.06 * (1 - dist / threshold)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); createParticles(); }, 200);
  });
})();

/* ── Scroll Reveal ── */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling reveals
        const siblings = entry.target.parentElement.querySelectorAll('.reveal-up');
        let delay = 0;
        siblings.forEach((sib, idx) => {
          if (sib === entry.target) delay = idx * 80;
        });
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
})();

/* ── Counter Animation ── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const step   = target / (duration / 16);
        let current  = 0;
        const timer  = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current);
        }, 16);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ── Package Card Tilt ── */
(function initTilt() {
  const cards = document.querySelectorAll('.pkg-card, .why-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -6;
      const tiltY  = dx *  6;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Don't tilt featured card (it has scale override)
  const featured = document.querySelector('.pkg-featured');
  if (featured) {
    featured.addEventListener('mousemove', e => {
      const rect  = featured.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -5;
      const tiltY = dx *  5;
      featured.style.transform = `scale(1.04) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
    });
    featured.addEventListener('mouseleave', () => {
      featured.style.transform = 'scale(1.04)';
    });
  }
})();

/* ── Smooth active nav link ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => observer.observe(sec));
})();

/* ── WhatsApp float — hide on hero CTA visible ── */
(function initWaFloat() {
  const waFloat  = document.getElementById('waFloat');
  const heroCta  = document.getElementById('heroWaBtn');
  const mainCta  = document.getElementById('mainWaBtn');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target === heroCta || entry.target === mainCta) {
        waFloat.style.opacity = entry.isIntersecting ? '0' : '1';
        waFloat.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
      }
    });
  }, { threshold: 0.5 });

  if (heroCta) observer.observe(heroCta);
  if (mainCta) observer.observe(mainCta);
})();

/* ── Hero text typewriter shimmer ── */
(function initHeroShimmer() {
  const headline = document.querySelector('.hero-headline');
  if (!headline) return;
  headline.style.opacity = '1';
  headline.style.animation = 'none';
    // Add a subtle shimmer to gradient text every 4s
  const gradients = headline.querySelectorAll('.text-gradient, .text-gradient-blue');
  setInterval(() => {
    gradients.forEach(g => {
      g.style.filter = 'brightness(1.3)';
      setTimeout(() => { g.style.filter = ''; }, 600);
    });
  }, 4000);
})();
