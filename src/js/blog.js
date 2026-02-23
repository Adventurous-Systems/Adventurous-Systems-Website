/**
 * Blog Page JavaScript
 * Renders curated list of blog posts from blog.json.
 */

import blogData from '../components/data/blog.json';
import { observeNewElements } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    // Simulate slight network delay to show off skeleton loaders
    setTimeout(() => {
        renderBlogPosts();
        observeNewElements();
    }, 400); // 400ms delay
});

function renderBlogPosts() {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;

    const posts = blogData.posts;

    // Replace skeleton with real HTML
    grid.innerHTML = posts.map((post, index) => {
        // Format date: "March 12, 2024"
        const dateObj = new Date(post.date);
        const formattedDate = !isNaN(dateObj) ? dateObj.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : post.date;

        return `
            <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="card card--article fade-in ${index > 0 ? `fade-in-delay-${Math.min(index, 3)}` : ''}" style="display: flex; flex-direction: column; text-decoration: none; color: inherit;">
                <img src="${post.image}" alt="${post.title}" class="card__image" loading="lazy" onerror="this.src='./images/og-image.png'">
                <div style="flex: 1;">
                    <div class="card__tags" style="margin-bottom: var(--space-2);">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <p style="font-size: var(--text-xs); color: var(--color-text-muted); margin-bottom: var(--space-2);">${formattedDate}</p>
                    <h3 class="card__title" style="margin-bottom: var(--space-3);">${post.title}</h3>
                    <p class="card__body" style="margin-bottom: 0;">${post.summary}</p>
                </div>
                <div style="margin-top: var(--space-5); display: inline-flex; align-items: center; font-size: var(--text-sm); font-weight: 600; color: var(--color-accent);">
                    Read Article <span style="margin-left: 4px;">→</span>
                </div>
            </a>
        `;
    }).join('');
}
