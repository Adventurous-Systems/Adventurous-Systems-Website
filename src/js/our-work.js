/**
 * Our Work Page JavaScript
 * Renders publications with tag filtering and partners grid.
 */

import partnersData from '../components/data/partners.json';

/* ---------- Publications Data (extracted from webflow embed) ---------- */
const publications = [
    { title: 'Classification of AI Techniques for Early Architectural Design Stages', summary: 'Survey and classification of AI approaches to support early-stage design decisions.', tags: ['AI', 'Architecture'], links: [{ label: 'Read', url: 'https://www.researchgate.net/publication/382564221' }] },
    { title: 'Textual & Visual Interpretation in a Text-to-Image Accelerated Architectural Design Process', summary: 'Explores text+image prompting for speed and fidelity in concept design workflows.', tags: ['AI', 'TextToImage'], links: [{ label: 'Read', url: 'https://www.researchgate.net/publication/391064641' }] },
    { title: 'Spatial Interpretation in a Diffusion-powered Architectural Design Process', summary: 'Investigates diffusion models for spatial reasoning in architectural proposals.', tags: ['AI', 'Diffusion'], links: [{ label: 'Read', url: 'https://www.researchgate.net/publication/391451019' }] },
    { title: 'Blockchain Weaving as Architecture', summary: 'Framework for transforming nomadic weaving heritage into immutable digital memory.', tags: ['Blockchain', 'Heritage'], links: [{ label: 'Read', url: 'https://www.researchgate.net/publication/396186043' }] },
    { title: 'Decentralising Architectural Design Through Data Governance', summary: 'Data-governance patterns for decentralising architectural decision-making.', tags: ['Blockchain', 'Governance'], links: [{ label: 'Read', url: 'https://www.researchgate.net/publication/391590351' }] },
    { title: 'Digital Building Logbooks on the Blockchain', summary: 'Concept and research pathways for blockchain-anchored building logbooks.', tags: ['Blockchain', 'BIM'], links: [{ label: 'Read', url: 'https://www.researchgate.net/publication/391584150' }] },
    { title: 'Application of SBTs for DAOs in Architecture', summary: 'Soulbound token primitives for identity and governance in design DAOs.', tags: ['Blockchain', 'DAO'], links: [{ label: 'Read', url: 'https://www.researchgate.net/publication/395124725' }] },
    { title: 'Potential Value of Tokens & Token Engineering for AEC', summary: 'Token engineering as a lever for incentives and transparency in AEC.', tags: ['Blockchain', 'AEC'], links: [{ label: 'Read', url: 'https://www.researchgate.net/publication/372244319' }] },
    { title: 'Design Dimensions for Blockchain Oracles in AEC', summary: 'Oracle patterns to bring real-world data into AEC smart contracts.', tags: ['Blockchain', 'AEC'], links: [{ label: 'Read', url: 'https://www.researchgate.net/publication/372244225' }] },
    { title: 'Blockchain for Construction (Springer Book)', summary: 'Comprehensive treatment of blockchain applications across construction.', tags: ['Blockchain', 'Book'], links: [{ label: 'Book', url: 'https://link.springer.com/book/10.1007/978-981-19-3759-0' }] },
    { title: 'The Promise of Blockchain for the Construction Industry', summary: 'Frames blockchain adoption through governance structures and incentives.', tags: ['Blockchain', 'Governance'], links: [{ label: 'Read', url: 'https://www.researchgate.net/publication/363711482' }] },
    { title: 'BIM & Blockchain Integration', summary: 'Integrates BIM processes with blockchain for trustable coordination.', tags: ['BIM', 'Blockchain'], links: [{ label: 'Read', url: 'https://www.researchgate.net/publication/344646823' }] },
    { title: 'Smart Contracts for Decentralised BIM', summary: 'Smart-contract primitives enabling decentralised BIM collaboration.', tags: ['BIM', 'SmartContracts'], links: [{ label: 'Read', url: 'https://www.researchgate.net/publication/343509689' }] },
    { title: 'Non-Fungible Building Components (TRACE)', summary: 'Smart contracts to track and trade reclaimed building components.', tags: ['TRACE', 'CircularEconomy'], links: [{ label: 'Read', url: 'https://www.researchgate.net/publication/358607327' }] },
    { title: 'Topology-Generated NFTs for Circular Design (TRACE)', summary: 'Topology-driven NFTs as infrastructure for circularity.', tags: ['TRACE', 'NFT'], links: [{ label: 'Read', url: 'https://www.researchgate.net/publication/367695586' }] },
    { title: 'The Architecture DAO', summary: 'Stigmergy & DAO mechanisms for collaborative design work.', tags: ['DAO', 'Collaboration'], links: [{ label: 'Read', url: 'https://www.researchgate.net/publication/362404374' }] },
    { title: 'Invoice Smart Contracts for Design SMEs', summary: 'Smart-contract invoicing patterns tailored to SME design practices.', tags: ['SmartContracts', 'AEC'], links: [{ label: 'Read', url: 'https://www.researchgate.net/publication/354413081' }] },
    { title: 'Collective Digital Factories for Buildings', summary: 'Stigmergic collaboration & cryptoeconomic coordination for building delivery.', tags: ['Cryptoeconomics', 'Construction'], links: [{ label: 'Read', url: 'https://www.researchgate.net/publication/363695488' }] },
];

const priorityTags = ['Blockchain', 'AI', 'TRACE', 'BIM', 'DAO', 'Governance', 'AEC', 'SmartContracts'];

let activeTag = null;

document.addEventListener('DOMContentLoaded', () => {
    renderPublicationFilters();
    renderPublications();
    renderPartners();
});

/* ---------- Publication Filters ---------- */
function renderPublicationFilters() {
    const container = document.getElementById('pub-filters');
    if (!container) return;

    const allBtn = document.createElement('button');
    allBtn.className = 'filter-pill is-active';
    allBtn.textContent = 'All';
    allBtn.addEventListener('click', () => {
        activeTag = null;
        updateActiveFilter(container, allBtn);
        renderPublications();
    });
    container.appendChild(allBtn);

    priorityTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'filter-pill';
        btn.textContent = tag;
        btn.addEventListener('click', () => {
            activeTag = tag;
            updateActiveFilter(container, btn);
            renderPublications();
        });
        container.appendChild(btn);
    });
}

function updateActiveFilter(container, activeBtn) {
    container.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('is-active'));
    activeBtn.classList.add('is-active');
}

/* ---------- Publications Grid ---------- */
function renderPublications() {
    const grid = document.getElementById('pub-grid');
    const countEl = document.getElementById('pub-count');
    if (!grid) return;

    const filtered = activeTag
        ? publications.filter(p => p.tags.includes(activeTag))
        : publications;

    if (countEl) {
        const filterLabel = activeTag ? `#${activeTag}` : 'All';
        countEl.textContent = `${filtered.length} publication${filtered.length !== 1 ? 's' : ''} · ${filterLabel}`;
    }

    grid.innerHTML = filtered.map(pub => `
    <article class="pub-card">
      <h3 class="pub-card__title">${pub.title}</h3>
      <p class="pub-card__summary">${pub.summary}</p>
      <div class="pub-card__tags">
        ${pub.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="pub-card__actions">
        ${pub.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="btn btn--outline btn--sm">${l.label} ↗</a>`).join('')}
      </div>
    </article>
  `).join('');

    // Animate
    grid.querySelectorAll('.pub-card').forEach((card, i) => {
        card.style.animationDelay = `${i * 0.05}s`;
    });
}

/* ---------- Partners Grid ---------- */
function renderPartners() {
    const grid = document.getElementById('partners-grid');
    if (!grid) return;

    const partners = partnersData.partners;
    grid.innerHTML = partners.map(partner => `
    <a href="${partner.url}" target="_blank" rel="noopener noreferrer" class="partner-card fade-in"
       title="${partner.name} — ${partner.role}">
      <img src="${partner.logo}" alt="${partner.name}" class="partner-card__logo" loading="lazy">
      <span class="partner-card__name">${partner.name}</span>
      <span class="partner-card__role">${partner.role}</span>
    </a>
  `).join('');
}
