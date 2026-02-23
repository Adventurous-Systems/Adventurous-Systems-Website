/**
 * Shared Footer Component
 * Injects the site footer with company info, social links, and legal.
 */

export function initFooter() {
    const footerEl = document.getElementById('site-footer');
    if (!footerEl) return;

    const currentYear = new Date().getFullYear();

    footerEl.innerHTML = `
    <footer class="footer">
      <div class="footer__inner container">
        <div class="footer__grid">
          <!-- Brand column -->
          <div class="footer__brand">
            <a href="/" class="footer__logo" aria-label="Adventurous Systems Home">
              <img src="/images/logo_3_adventurous_systems_cropped.jpg" alt="Adventurous Systems" class="footer__logo-img">
            </a>
            <p class="footer__tagline">Research-led digital transformation for construction.</p>
            <div class="footer__social">
              <a href="https://www.linkedin.com/company/adventurous-systems/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="footer__social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://adventuroussystems.substack.com/" target="_blank" rel="noopener noreferrer" aria-label="Substack" class="footer__social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Navigation column -->
          <div class="footer__nav-col">
            <h4 class="footer__heading">Navigate</h4>
            <ul class="footer__links">
              <li><a href="/what-we-do.html">What We Do</a></li>
              <li><a href="/our-work.html">Our Work</a></li>
              <li><a href="/about.html">About Us</a></li>
              <li><a href="/contact.html">Contact</a></li>
            </ul>
          </div>

          <!-- Services column -->
          <div class="footer__nav-col">
            <h4 class="footer__heading">Services</h4>
            <ul class="footer__links">
              <li><a href="/what-we-do.html#digital-twins">Digital Twin Integration</a></li>
              <li><a href="/what-we-do.html#blockchain">Blockchain for AEC</a></li>
              <li><a href="/what-we-do.html#ai-readiness">AI Readiness Assessment</a></li>
              <li><a href="/what-we-do.html#research-advisory">Research & Advisory</a></li>
            </ul>
          </div>

          <!-- Company column -->
          <div class="footer__nav-col">
            <h4 class="footer__heading">Company</h4>
            <ul class="footer__links">
              <li>Adventurous Systems Ltd</li>
              <li><a href="https://find-and-update.company-information.service.gov.uk/company/15359850" target="_blank" rel="noopener noreferrer">Company No: 15359850</a></li>
              <li><a href="mailto:systems@adventurous.systems">systems@adventurous.systems</a></li>
            </ul>
          </div>
        </div>

        <div class="footer__bottom">
          <p class="footer__copyright">© ${currentYear} Adventurous Systems Ltd — Established 2023</p>
          <div class="footer__legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
