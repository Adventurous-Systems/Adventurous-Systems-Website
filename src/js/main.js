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
    initCounters();
    initMagneticButtons();
    initParallax();
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

/**
 * Animated number counters
 */
function initCounters() {
    const counters = document.querySelectorAll('[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10);
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';

                animateValue(el, 0, target, 2000, prefix, suffix);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateValue(obj, start, end, duration, prefix, suffix) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // easeOutQuart
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(ease * (end - start) + start);
        obj.innerHTML = `${prefix}${current}${suffix}`;

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = `${prefix}${end}${suffix}`;
        }
    };
    window.requestAnimationFrame(step);
}

/**
 * Magnetic button hover effect
 */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

/**
 * Parallax scrolling for background layers
 */
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const elements = document.querySelectorAll('.parallax');
        elements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0.4;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, { passive: true });
}

