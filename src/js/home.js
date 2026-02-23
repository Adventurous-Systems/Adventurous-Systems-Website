/**
 * Home Page JavaScript
 * Renders project cards and handles credential counter animations.
 */

import projectsData from '../components/data/projects.json';
import { initNetworkAnimation } from './network-animation.js';

document.addEventListener('DOMContentLoaded', () => {
    initNetworkAnimation();
    renderProjectCards();
    initContactForm();
});

/**
 * Render project cards from JSON data.
 * Shows the first 4 projects on the home page.
 */
function renderProjectCards() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    const projects = projectsData.projects.slice(0, 4);

    grid.innerHTML = projects.map((project, index) => {
        const statusClass = getStatusClass(project.status);
        const imgSrc = `${import.meta.env.BASE_URL}${project.image.replace(/^\//, '')}`;
        return `
      <div class="card fade-in ${index > 0 ? `fade-in-delay-${Math.min(index, 3)}` : ''}">
        <img
          src="${imgSrc}"
          alt="${project.title}"
          class="card__image"
          loading="lazy"
        >
        <span class="badge ${statusClass}">${project.statusLabel}</span>
        <h3 class="card__title" style="margin-top: var(--space-3);">${project.title}</h3>
        <p class="card__subtitle">${project.subtitle}</p>
        <p class="card__body">${project.description}</p>
        <div class="card__tags">
          ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
    `;
    }).join('');

    // Re-initialize scroll animations for dynamically added elements
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    grid.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/**
 * Map project status to CSS badge class.
 */
function getStatusClass(status) {
    const map = {
        active: 'badge--active',
        partners: 'badge--open',
        discovery: 'badge--discovery',
    };
    return map[status] || 'badge--active';
}

/**
 * Initialize the home page contact form.
 * Posts to the existing Google Apps Script endpoint.
 */
function initContactForm() {
    const form = document.getElementById('homeContactForm');
    if (!form) return;

    const submitBtn = document.getElementById('homeContactSubmit');
    const statusEl = document.getElementById('homeContactStatus');

    // Google Apps Script URL (same as community signup)
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxLB-1QDEyjeTE9sCttRewkMPTFAOvKC7dF7_ZqxfRabHFzKwzmXt43i6Qyz9yNcLHa/exec';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Gather form data
        const formData = {
            name: form.querySelector('[name="name"]').value.trim(),
            organisation: form.querySelector('[name="organisation"]').value.trim(),
            email: form.querySelector('[name="email"]').value.trim(),
            message: form.querySelector('[name="message"]').value.trim(),
        };

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            showStatus(statusEl, 'Please fill in all required fields.', 'error');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            // With no-cors we can't read the response, assume success
            showStatus(statusEl, 'Thank you! We\'ll be in touch soon.', 'success');
            form.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            showStatus(statusEl, 'Something went wrong. Please try again or email us directly.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}

/**
 * Show a status message below the form.
 */
function showStatus(el, message, type) {
    el.textContent = message;
    el.className = `contact-form__status show ${type}`;
    setTimeout(() => {
        el.classList.remove('show');
    }, 6000);
}
