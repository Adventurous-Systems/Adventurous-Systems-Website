/**
 * Main JavaScript — runs on every page.
 * Initializes shared header, footer, and scroll animations.
 */

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
});

/**
 * Scroll-triggered fade-in animations using IntersectionObserver.
 */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
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
