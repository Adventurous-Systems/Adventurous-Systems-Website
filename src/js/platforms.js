/**
 * Featured Platforms renderer.
 * Renders the AFlow / DataHardHats showcase cards from featured.json.
 * Shared by the home page and the Our Work page.
 *
 * Each card is a whole-card external link, so the delegated analytics
 * listener in analytics.js auto-fires `outbound_click`, and the
 * `data-analytics-event="showcase_card_click"` attribute fires the
 * declarative event with `{ platformId }`.
 */

import featured from '../components/data/featured.json';
import { observeNewElements } from './main.js';

/**
 * Render the featured platform cards into the given container id.
 * @param {string} containerId
 */
export function renderPlatformCards(containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    grid.innerHTML = featured.platforms.map((platform, index) => {
        const badgeClass = platform.status === 'open' ? 'badge--open' : 'badge--active';
        const imgSrc = `${import.meta.env.BASE_URL}${platform.image.replace(/^\//, '')}`;
        return `
      <a
        class="card card--platform fade-in ${index > 0 ? `fade-in-delay-${Math.min(index, 3)}` : ''}"
        href="${platform.href}"
        target="_blank"
        rel="noopener"
        data-analytics-event="showcase_card_click"
        data-platform-id="${platform.id}"
      >
        <img
          src="${imgSrc}"
          alt="${platform.title}"
          class="card__image"
          loading="lazy"
        >
        <span class="badge ${badgeClass}">${platform.statusLabel}</span>
        <h3 class="card__title" style="margin-top: var(--space-3);">${platform.title}</h3>
        <p class="card__subtitle">${platform.subtitle}</p>
        <p class="card__body">${platform.description}</p>
        <div class="card__tags">
          ${platform.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <span class="card__cta">${platform.cta} →</span>
      </a>
    `;
    }).join('');

    observeNewElements(grid);
}
