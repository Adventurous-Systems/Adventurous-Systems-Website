/**
 * Shared Header Component
 * Injects a sticky navigation header with logo, nav links, and mobile hamburger.
 */

export function initHeader() {
    const headerEl = document.getElementById('site-header');
    if (!headerEl) return;

    // Determine current page for active nav highlighting
    const path = window.location.pathname;
    const getActiveClass = (href) => {
        if (href === '/' && (path === '/' || path === '/index.html')) return 'nav__link--active';
        if (href !== '/' && path.includes(href)) return 'nav__link--active';
        return '';
    };

    headerEl.innerHTML = `
    <header class="header">
      <div class="header__inner container">
        <a href="/" class="header__logo" aria-label="Adventurous Systems Home">
          <img src="/images/logo_3_adventurous_systems_cropped.jpg" alt="Adventurous Systems" class="header__logo-img">
          <span class="header__logo-text">adventurous systems</span>
        </a>

        <nav class="nav" id="main-nav" aria-label="Main navigation">
          <a href="/what-we-do.html" class="nav__link ${getActiveClass('/what-we-do')}">What We Do</a>
          <a href="/our-work.html" class="nav__link ${getActiveClass('/our-work')}">Our Work</a>
          <a href="/about.html" class="nav__link ${getActiveClass('/about')}">About</a>
          <a href="/contact.html" class="nav__link ${getActiveClass('/contact')}">Contact</a>
        </nav>

        <a href="/contact.html" class="btn btn--primary btn--sm header__cta">Work With Us</a>

        <button class="hamburger" id="hamburger" aria-label="Toggle navigation" aria-expanded="false">
          <span class="hamburger__line"></span>
          <span class="hamburger__line"></span>
          <span class="hamburger__line"></span>
        </button>
      </div>

      <!-- Mobile navigation overlay -->
      <div class="mobile-nav" id="mobile-nav" aria-hidden="true">
        <nav class="mobile-nav__inner">
          <a href="/" class="mobile-nav__link ${getActiveClass('/')}">Home</a>
          <a href="/what-we-do.html" class="mobile-nav__link ${getActiveClass('/what-we-do')}">What We Do</a>
          <a href="/our-work.html" class="mobile-nav__link ${getActiveClass('/our-work')}">Our Work</a>
          <a href="/about.html" class="mobile-nav__link ${getActiveClass('/about')}">About</a>
          <a href="/contact.html" class="mobile-nav__link ${getActiveClass('/contact')}">Contact</a>
          <a href="/contact.html" class="btn btn--primary btn--lg mobile-nav__cta">Work With Us</a>
        </nav>
      </div>
    </header>
  `;

    // Hamburger toggle
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');

    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('is-open');
        mobileNav.classList.toggle('is-open');
        hamburger.setAttribute('aria-expanded', isOpen);
        mobileNav.setAttribute('aria-hidden', !isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('.mobile-nav__link, .mobile-nav__cta').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('is-open');
            mobileNav.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
            mobileNav.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    });

    // Shrink header on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        lastScroll = window.scrollY;
    }, { passive: true });
}
