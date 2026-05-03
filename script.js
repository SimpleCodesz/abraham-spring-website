// ===== MOBILE MENU =====
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');

mobileToggle?.addEventListener('click', () => {
  const isOpen = mobileMenu.style.display === 'flex';
  mobileMenu.style.display = isOpen ? 'none' : 'flex';
  mobileToggle.classList.toggle('open', !isOpen);
  mobileToggle.setAttribute('aria-expanded', !isOpen);
  mobileMenu.setAttribute('aria-hidden', isOpen);
});

mobileMenu?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.style.display = 'none';
    mobileToggle.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    item.closest('.faq-list').querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ===== STATS COUNT-UP ANIMATION =====
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Animate count-up numbers
      entry.target.querySelectorAll('.stat-number[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1600;
        const start = performance.now();

        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          const current = Math.round(eased * target);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      });

      // Fade in "British Triathlon" text
      entry.target.querySelectorAll('.stat-number:not([data-count])').forEach(el => {
        el.style.opacity = '1';
      });

      // Stagger fade-in for each stat item
      entry.target.querySelectorAll('.stat-item').forEach((item, i) => {
        setTimeout(() => {
          item.classList.add('stat-visible');
        }, i * 150);
      });

      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== CAROUSEL ARROWS =====
document.querySelectorAll('.carousel-wrap').forEach(wrap => {
  const track = wrap.querySelector('.carousel-track');
  const prev = wrap.querySelector('.carousel-prev');
  const next = wrap.querySelector('.carousel-next');
  if (!track || !prev || !next) return;

  const scrollAmount = () => {
    const card = track.querySelector(':scope > *');
    return card ? card.offsetWidth + 20 : 360;
  };

  const updateArrows = () => {
    prev.classList.toggle('hidden', track.scrollLeft <= 10);
    next.classList.toggle('hidden', track.scrollLeft >= track.scrollWidth - track.clientWidth - 10);
  };

  prev.addEventListener('click', () => {
    track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
  });

  next.addEventListener('click', () => {
    track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
  });

  track.addEventListener('scroll', updateArrows, { passive: true });
  updateArrows();
  // Re-check after layout settles
  setTimeout(updateArrows, 100);
});

// ===== APPLE-STYLE SCROLL REVEAL (STAGGERED) =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // For cards inside carousels, stagger by sibling index
      const parent = entry.target.parentElement;
      const isCard = entry.target.classList.contains('problem-card') ||
                     entry.target.classList.contains('race-card') ||
                     entry.target.classList.contains('coaching-card') ||
                     entry.target.classList.contains('testimonial-card') ||
                     entry.target.classList.contains('blog-card');

      if (isCard && parent) {
        const siblings = Array.from(parent.children).filter(c =>
          c.classList.contains('scroll-reveal'));
        const idx = siblings.indexOf(entry.target);
        const delay = idx * 80; // 80ms stagger per card
        entry.target.style.transitionDelay = delay + 'ms';
      }

      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

const revealElements = document.querySelectorAll('section:not(.hero):not(.stats-bar), .philosophy-quote, .problem-card, .race-card, .coaching-card, .testimonial-card, .blog-card, .faq-group, .about-grid, .apply-card, .form-card, .sarah-hook-card');
revealElements.forEach(el => {
  el.classList.add('scroll-reveal');
  revealObserver.observe(el);
});

// Reveal elements already above viewport (handles anchor link jumps)
const revealAbove = () => {
  revealElements.forEach(el => {
    if (el.classList.contains('revealed')) return;
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0) {
      el.style.transition = 'none';
      el.classList.add('revealed');
      revealObserver.unobserve(el);
    }
  });
};
window.addEventListener('scroll', revealAbove, { passive: true });
// Run once on load for pages loaded at scroll position
revealAbove();

// ===== STAGGERED CHILD REVEAL =====
const staggerConfig = {
  '.for-you':       { children: '.section-tag, .section-title-lg, .for-you-col', stagger: 150 },
  '.pricing':       { children: '.section-tag, .section-title-lg, .section-desc, .pricing-card-v2', stagger: 100 },
  '.about':         { children: '.section-tag, .section-title-lg, .about-detail', stagger: 80 },
  '.faq':           { children: '.section-title-lg, .faq-group', stagger: 120 },
  '.method':        { children: '.section-tag, .section-title-lg, .section-desc', stagger: 80 },
  '.coaching':      { children: '.section-tag, .section-title-lg', stagger: 80 },
  '.testimonials':  { children: '.section-tag, .section-title-lg, .section-desc', stagger: 80 },
  '.problems':      { children: '.section-tag, .section-title-lg, .section-desc', stagger: 80 },
  '.blog-section':  { children: '.section-tag, .section-title-lg, .blog-subtitle', stagger: 80 },
};

const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const section = entry.target;

    for (const [selector, { children: childSel, stagger }] of Object.entries(staggerConfig)) {
      if (!section.matches(selector)) continue;
      const kids = section.querySelectorAll(childSel);
      kids.forEach((child, i) => {
        child.style.transitionDelay = (i * stagger) + 'ms';
        requestAnimationFrame(() => child.classList.add('revealed'));
      });
      break;
    }
    staggerObserver.unobserve(section);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

// Nested stagger for For-You list items (slide from left)
const nestedStaggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const items = entry.target.querySelectorAll('h3, li');
    items.forEach((item, i) => {
      item.style.transitionDelay = (i * 60) + 'ms';
      requestAnimationFrame(() => item.classList.add('revealed'));
    });
    nestedStaggerObserver.unobserve(entry.target);
  });
}, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

// Initialize stagger targets
Object.entries(staggerConfig).forEach(([parentSel, { children: childSel }]) => {
  const parent = document.querySelector(parentSel);
  if (!parent) return;
  parent.querySelectorAll(childSel).forEach(child => child.classList.add('stagger-reveal'));
  staggerObserver.observe(parent);
});

// Initialize nested For-You column stagger
document.querySelectorAll('.for-you-col').forEach(col => {
  col.querySelectorAll('h3, li').forEach(el => el.classList.add('stagger-reveal'));
  nestedStaggerObserver.observe(col);
});

// Reveal stagger elements already above viewport
const revealStaggerAbove = () => {
  document.querySelectorAll('.stagger-reveal:not(.revealed)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0) {
      el.style.transition = 'none';
      el.classList.add('revealed');
    }
  });
};
window.addEventListener('scroll', revealStaggerAbove, { passive: true });
revealStaggerAbove();

// ===== HERO LOAD ORCHESTRATION =====
window.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero-content');
  if (!hero) return;

  const h1 = hero.querySelector('h1');
  const sub = hero.querySelector('.hero-sub');
  const ctas = hero.querySelector('.hero-ctas');

  // Remove the blanket animation and stagger individually
  hero.style.animation = 'none';
  hero.style.opacity = '1';

  [h1, sub, ctas].forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 300 + (i * 200)); // 300ms initial delay, 200ms between elements
  });
});

// ===== RESEARCH QUESTIONNAIRE — AJAX SUBMISSION =====
const applicationForm = document.getElementById('applicationForm');
const formSuccess = document.getElementById('formSuccess');

if (applicationForm) {
  applicationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const submitBtn = this.querySelector('.form-submit');
    if (submitBtn) {
      submitBtn.textContent = 'Submitting…';
      submitBtn.disabled = true;
    }

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })
    .then(function(response) {
      if (response.ok) {
        if (typeof gtag === 'function') {
          gtag('event', 'questionnaire_submit', {});
        }
        window.location.href = '/thank-you';
      } else {
        if (submitBtn) {
          submitBtn.innerHTML = 'Send my answers <span class="btn-arrow">&rsaquo;</span>';
          submitBtn.disabled = false;
        }
        alert('There was an issue sending your answers. Please try again or email welcome@unbrokenclub.com directly.');
      }
    })
    .catch(function() {
      if (submitBtn) {
        submitBtn.innerHTML = 'Send my answers <span class="btn-arrow">&rsaquo;</span>';
        submitBtn.disabled = false;
      }
      alert('There was an issue sending your answers. Please try again or email welcome@unbrokenclub.com directly.');
    });
  });
}

// ===== SPECULAR HIGHLIGHT (cursor-tracking, Stripe pattern) =====
document.querySelectorAll('.specular').forEach(function(card) {
  card.addEventListener('mousemove', function(e) {
    var r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
  });
});

// ===== WORD-BY-WORD REVEAL (Apple Intelligence pattern) =====
(function() {
  var paras = document.querySelectorAll('.reveal-words');
  if (!paras.length) return;
  paras.forEach(function(p) {
    var words = p.textContent.trim().split(/\s+/);
    p.innerHTML = words.map(function(w) {
      return '<span class="word-reveal">' + w + '</span>';
    }).join(' ');
  });
  var spans = document.querySelectorAll('.word-reveal');
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) e.target.classList.add('lit');
    });
  }, { rootMargin: '-30% 0px -30% 0px', threshold: 0 });
  spans.forEach(function(s) { io.observe(s); });
})();

// ===== EMAIL SIGNUP POPUP (15s delay) =====
(function() {
  var popup = document.getElementById('emailPopup');
  var closeBtn = document.getElementById('popupClose');
  var popupForm = document.getElementById('newsletterPopupForm');
  var popupSuccess = document.getElementById('popupSuccess');
  if (!popup) return;

  // Don't show if already dismissed within 7 days
  var dismissed = localStorage.getItem('popup_dismissed');
  if (dismissed && (Date.now() - parseInt(dismissed, 10)) < 7 * 24 * 60 * 60 * 1000) return;

  // Don't show if already subscribed
  if (localStorage.getItem('popup_subscribed')) return;

  // Show after 15 seconds
  setTimeout(function() {
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
  }, 15000);

  function closePopup() {
    popup.classList.remove('active');
    document.body.style.overflow = '';
    localStorage.setItem('popup_dismissed', Date.now().toString());
  }

  // Close on X button
  closeBtn.addEventListener('click', closePopup);

  // Close on overlay click (not card)
  popup.addEventListener('click', function(e) {
    if (e.target === popup) closePopup();
  });

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popup.classList.contains('active')) closePopup();
  });

  // AJAX form submission
  if (popupForm) {
    popupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var formData = new FormData(this);
      var submitBtn = this.querySelector('.popup-submit-btn');
      if (submitBtn) {
        submitBtn.textContent = 'Subscribing…';
        submitBtn.disabled = true;
      }

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      .then(function(response) {
        if (response.ok) {
          if (typeof gtag === 'function') {
            gtag('event', 'popup_subscribe');
          }
          popupForm.style.display = 'none';
          popupSuccess.style.display = 'block';
          localStorage.setItem('popup_subscribed', '1');
          setTimeout(closePopup, 3000);
        } else {
          if (submitBtn) {
            submitBtn.innerHTML = 'Subscribe <span class="btn-arrow">&rsaquo;</span>';
            submitBtn.disabled = false;
          }
          alert('There was an issue. Please try again.');
        }
      })
      .catch(function() {
        if (submitBtn) {
          submitBtn.innerHTML = 'Subscribe <span class="btn-arrow">&rsaquo;</span>';
          submitBtn.disabled = false;
        }
        alert('There was an issue. Please try again.');
      });
    });
  }
})();

// ===== STICKY CTA BAR =====
(function() {
  var stickyCta = document.getElementById('stickyCta');
  var hero = document.querySelector('.hero');
  var applyForm = document.getElementById('research');
  if (!stickyCta || !hero) return;

  var stickyObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.target === hero) {
        // Show sticky when hero is NOT visible
        if (!entry.isIntersecting) {
          stickyCta.classList.add('visible');
          stickyCta.setAttribute('aria-hidden', 'false');
        } else {
          stickyCta.classList.remove('visible');
          stickyCta.setAttribute('aria-hidden', 'true');
        }
      }
    });
  }, { threshold: 0 });

  stickyObserver.observe(hero);

  // Hide when user reaches the application form
  if (applyForm) {
    var formObserver = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        stickyCta.classList.remove('visible');
        stickyCta.setAttribute('aria-hidden', 'true');
      }
    }, { threshold: 0.1 });
    formObserver.observe(applyForm);
  }
})();

// ===== CLEAN URL ROUTING =====
(function() {
  // Map section IDs to clean URL paths
  var sectionToPath = {
    'problems':   '/the-problem',
    'method':     '/method',
    'coaching':   '/coaching',
    'about':      '/about',
    'for-you':    '/for-you',
    'pricing':    '/pricing',
    'insights':   '/insights'
  };

  // Reverse map: path → section ID (for page load scroll)
  var pathToSection = {};
  Object.keys(sectionToPath).forEach(function(id) {
    pathToSection[sectionToPath[id]] = id;
  });

  // On page load: if URL is a section path, scroll to that section instantly
  var initialPath = window.location.pathname;
  var initialSectionId = pathToSection[initialPath];
  if (initialSectionId) {
    // Hide page until positioned — prevents flash of hero before scroll
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.visibility = 'hidden';
    window.addEventListener('DOMContentLoaded', function() {
      var target = document.getElementById(initialSectionId);
      if (target) {
        var navHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
        window.scrollTo(0, target.offsetTop - navHeight);
      }
      document.body.style.visibility = '';
      document.documentElement.style.scrollBehavior = '';
    });
  }

  // Active nav highlighting + URL update on scroll
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  var sections = [];
  navLinks.forEach(function(link) {
    var target = document.querySelector(link.getAttribute('href'));
    if (target) sections.push({ el: target, link: link });
  });

  var currentPath = window.location.pathname;

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;
    var activeSection = null;
    sections.forEach(function(s) {
      if (s.el.offsetTop <= scrollPos) activeSection = s;
    });

    navLinks.forEach(function(l) { l.classList.remove('nav-active'); });

    if (activeSection) {
      activeSection.link.classList.add('nav-active');
      var newPath = sectionToPath[activeSection.el.id] || '/';
      if (newPath !== currentPath) {
        currentPath = newPath;
        history.replaceState(null, '', newPath);
      }
    } else if (window.scrollY < 80 && currentPath !== '/') {
      currentPath = '/';
      history.replaceState(null, '', '/');
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
})();

// ===== EXIT-INTENT TRIGGER =====
(function() {
  var popup = document.getElementById('emailPopup');
  if (!popup) return;
  var exitTriggered = false;

  document.addEventListener('mouseout', function(e) {
    if (exitTriggered) return;
    if (localStorage.getItem('popup_dismissed')) return;
    if (localStorage.getItem('popup_subscribed')) return;
    if (popup.classList.contains('active')) return;

    if (e.clientY <= 5 && e.relatedTarget === null) {
      exitTriggered = true;
      popup.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
})();

// ===== POPUP FOCUS TRAP =====
(function() {
  var popup = document.getElementById('emailPopup');
  if (!popup) return;

  popup.addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;
    var focusable = popup.querySelectorAll('button, input, [href], [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();

// ===== GA4 CONVERSION EVENTS =====
(function() {
  if (typeof gtag !== 'function') return;

  // Track "Book a Discovery Call" / "Apply Now" CTA clicks
  document.querySelectorAll('.nav-cta, .sticky-cta-btn, .btn-primary[href="#research"], .hero-ctas .btn-primary').forEach(function(btn) {
    btn.addEventListener('click', function() {
      gtag('event', 'cta_click', {
        cta_text: this.textContent.trim(),
        cta_location: this.closest('nav') ? 'navbar' : this.closest('.sticky-cta') ? 'sticky_bar' : this.closest('.hero') ? 'hero' : 'page'
      });
    });
  });

  // Track blog article clicks
  document.querySelectorAll('.blog-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var title = this.querySelector('.blog-card-title');
      gtag('event', 'blog_click', { article: title ? title.textContent.trim() : 'unknown' });
    });
  });

  // Track scroll depth milestones (25%, 50%, 75%, 100%)
  var milestones = [25, 50, 75, 100];
  var fired = {};
  window.addEventListener('scroll', function() {
    var scrollPct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    milestones.forEach(function(m) {
      if (scrollPct >= m && !fired[m]) {
        fired[m] = true;
        gtag('event', 'scroll_depth', { depth: m + '%' });
      }
    });
  }, { passive: true });
})();
