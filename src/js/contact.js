/**
 * Contact Page JavaScript
 * Handles the contact form submission via Google Apps Script.
 */

document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
});

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = document.getElementById('contact-submit');
    const statusEl = document.getElementById('contact-status');

    // Google Apps Script endpoint (same as home page)
    const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: form.querySelector('[name="name"]').value.trim(),
            organisation: form.querySelector('[name="organisation"]').value.trim(),
            email: form.querySelector('[name="email"]').value.trim(),
            message: form.querySelector('[name="message"]').value.trim(),
        };

        if (!formData.name || !formData.email || !formData.message) {
            showStatus(statusEl, 'Please fill in all required fields.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            showStatus(statusEl, "Thank you! We'll be in touch within 48 hours.", 'success');
            form.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            showStatus(statusEl, 'Something went wrong. Please email us directly at systems@adventurous.systems', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}

function showStatus(el, message, type) {
    el.textContent = message;
    el.className = `form-status show ${type}`;
    setTimeout(() => {
        el.classList.remove('show');
    }, 8000);
}
