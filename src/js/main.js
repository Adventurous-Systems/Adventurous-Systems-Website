/**
 * Main JavaScript — runs on every page.
 * Initializes shared header, footer, and scroll animations.
 */

/** @type {IntersectionObserver|null} */
let fadeObserver = null;

// CSS imports — Vite processes and injects these into the page
import '../styles/main.css';
import '../styles/components.css';
import '../styles/layout.css';
import '../styles/home.css';
import '../styles/services.css';
import '../styles/our-work.css';
import '../styles/about.css';
import '../styles/contact.css';
import '../styles/assessment.css';

import { initHeader } from '../components/header.js';
import { initFooter } from '../components/footer.js';

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initFooter();
    initScrollAnimations();
    initSmoothScroll();
    initBackToTop();
});

/**
 * Scroll-triggered fade-in animations using IntersectionObserver.
 */
function initScrollAnimations() {
    fadeObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.fade-in').forEach((el) => fadeObserver.observe(el));
}

/**
 * Call this after injecting new .fade-in elements into the DOM.
 * Dynamically rendered content (partners, publications, team) needs this.
 */
export function observeNewElements(container) {
    if (!fadeObserver) return;
    const els = container
        ? container.querySelectorAll('.fade-in:not(.is-visible)')
        : document.querySelectorAll('.fade-in:not(.is-visible)');
    els.forEach((el) => fadeObserver.observe(el));
}

/**
 * Smooth scrolling for anchor links (e.g. #section-id).
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = targetEl.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                });
            }
        });
    });
}

/**
 * Back to top button functionality
 */
function initBackToTop() {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.className = 'back-to-top';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('is-visible');
        } else {
            btn.classList.remove('is-visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
