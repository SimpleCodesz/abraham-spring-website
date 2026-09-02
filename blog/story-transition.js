(() => {
  const STORAGE_KEY = 'abraham-story-transition';
  const CARD_SELECTOR = '.insight-card[href^="/blog/"]';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeCard = null;
  let transitionNodes = [];

  const safeStorage = {
    read() {
      try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY)); }
      catch (_) { return null; }
    },
    write(value) {
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value)); }
      catch (_) { /* Navigation still works when storage is unavailable. */ }
    },
    clear() {
      try { sessionStorage.removeItem(STORAGE_KEY); }
      catch (_) { /* Nothing to clear. */ }
    }
  };

  function transitionRecordFor(url) {
    return {
      path: url.pathname.replace(/\/$/, ''),
      createdAt: Date.now()
    };
  }

  function isFresh(record) {
    return record && Date.now() - record.createdAt < 8000;
  }

  function resetIndex() {
    if (activeCard) {
      activeCard.style.opacity = '';
      activeCard.classList.remove('story-pressed');
      activeCard = null;
    }
    transitionNodes.forEach((node) => node.remove());
    transitionNodes = [];
    document.documentElement.classList.remove('story-leaving');
  }

  function prepareNativeNames(card) {
    document.querySelectorAll(`${CARD_SELECTOR} img, ${CARD_SELECTOR} h2`).forEach((element) => {
      element.style.viewTransitionName = '';
    });
    const image = card.querySelector('img');
    const title = card.querySelector('h2');
    if (image) image.style.viewTransitionName = 'story-image';
    if (title) title.style.viewTransitionName = 'story-title';
  }

  function navigateFromCard(card, url) {
    if (!card.animate || reducedMotion.matches) {
      window.location.assign(url.href);
      return;
    }

    const rect = card.getBoundingClientRect();
    const clone = card.cloneNode(true);
    const backdrop = document.createElement('div');
    const image = clone.querySelector('img');
    const upwardTravel = Math.min(Math.max(rect.top - 18, 28), 210);
    const availableScale = (window.innerWidth - 32) / rect.width;
    const scale = Math.min(Math.max(availableScale, 1.018), 1.045);

    backdrop.className = 'story-transition-backdrop';
    clone.classList.add('story-transition-card');
    clone.removeAttribute('href');
    Object.assign(clone.style, {
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`
    });

    document.body.append(backdrop, clone);
    transitionNodes = [backdrop, clone];
    activeCard = card;
    card.style.opacity = '0';
    document.documentElement.classList.add('story-leaving');

    backdrop.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 360, easing: 'ease-out', fill: 'forwards' }
    );
    clone.animate(
      [
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1 },
        { transform: `translate3d(0, -${upwardTravel}px, 0) scale(${scale})`, opacity: 1 }
      ],
      { duration: 430, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'forwards' }
    );
    if (image) {
      image.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.035)' }],
        { duration: 430, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'forwards' }
      );
    }

    window.setTimeout(() => window.location.assign(url.href), 350);
  }

  function initialiseIndex() {
    const cards = [...document.querySelectorAll(CARD_SELECTOR)];
    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener('pointerdown', () => {
        if (!reducedMotion.matches) card.classList.add('story-pressed');
      }, { passive: true });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach((eventName) => {
        card.addEventListener(eventName, () => card.classList.remove('story-pressed'), { passive: true });
      });
    });

    document.addEventListener('click', (event) => {
      const card = event.target.closest(CARD_SELECTOR);
      if (!card || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const url = new URL(card.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      safeStorage.write(transitionRecordFor(url));
      prepareNativeNames(card);
      event.preventDefault();
      navigateFromCard(card, url);
    });

    window.addEventListener('pageshow', resetIndex);
  }

  function initialiseArticle() {
    if (!document.body.classList.contains('editorial-page')) return;
    const record = safeStorage.read();
    const currentPath = window.location.pathname.replace(/\/$/, '');
    if (!isFresh(record) || record.path !== currentPath) {
      if (record && !isFresh(record)) safeStorage.clear();
      return;
    }

    safeStorage.clear();
    const image = document.querySelector('.article > .hero-img');
    const title = document.querySelector('.article > h1');
    if (image) image.style.viewTransitionName = 'story-image';
    if (title) title.style.viewTransitionName = 'story-title';
    if (reducedMotion.matches || !Element.prototype.animate) return;

    const elements = [
      document.querySelector('.article-nav'),
      document.querySelector('.article > .article-tag'),
      document.querySelector('.article > .eyebrow'),
      title,
      document.querySelector('.article > .article-deck'),
      document.querySelector('.article > .article-meta'),
      image
    ].filter(Boolean);

    elements.forEach((element, index) => {
      const distance = element === image ? 22 : 14;
      element.animate(
        [
          { opacity: 0, transform: `translate3d(0, ${distance}px, 0)` },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' }
        ],
        {
          duration: element === image ? 640 : 520,
          delay: Math.min(index * 34, 170),
          easing: 'cubic-bezier(.16, 1, .3, 1)',
          fill: 'both'
        }
      );
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initialiseIndex();
    initialiseArticle();
  }, { once: true });
})();
