/**
 * Privacy-conscious Umami analytics wrapper.
 * No-ops when VITE_UMAMI_SCRIPT_URL or VITE_UMAMI_WEBSITE_ID is missing.
 */

const config = {
    scriptUrl: import.meta.env.VITE_UMAMI_SCRIPT_URL || '',
    websiteId: import.meta.env.VITE_UMAMI_WEBSITE_ID || '',
    hostUrl: import.meta.env.VITE_UMAMI_HOST_URL || '',
    domains: import.meta.env.VITE_UMAMI_DOMAINS || 'www.adventurous.systems,adventurous.systems',
};

let delegatedEventsReady = false;

export function initAnalytics() {
    installDelegatedTracking();

    if (!config.scriptUrl || !config.websiteId) return;
    if (document.querySelector('script[data-adventurous-analytics]')) return;

    const script = document.createElement('script');
    script.defer = true;
    script.src = config.scriptUrl;
    script.dataset.websiteId = config.websiteId;
    script.dataset.domains = config.domains;
    script.dataset.doNotTrack = 'true';
    script.dataset.excludeSearch = 'true';
    script.dataset.adventurousAnalytics = 'true';

    if (config.hostUrl) {
        script.dataset.hostUrl = config.hostUrl;
    }

    document.head.appendChild(script);
}

export function trackEvent(eventName, eventData = {}) {
    if (!eventName || typeof window.umami?.track !== 'function') return;

    try {
        const data = sanitizeEventData(eventData);
        window.umami.track(eventName, Object.keys(data).length ? data : undefined);
    } catch (error) {
        if (import.meta.env.DEV) {
            console.warn('Analytics event skipped:', error);
        }
    }
}

function installDelegatedTracking() {
    if (delegatedEventsReady) return;
    delegatedEventsReady = true;

    document.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target : null;
        if (!target) return;

        const tracked = target.closest('[data-analytics-event]');
        if (tracked) {
            trackEvent(tracked.getAttribute('data-analytics-event'), datasetEventData(tracked));
        }

        const link = target.closest('a[href]');
        if (!link) return;

        if (link.classList.contains('btn')) {
            trackEvent('cta_click', {
                label: link.textContent,
                path: safePath(link.getAttribute('href')),
                page: window.location.pathname,
            });
        }

        const url = toUrl(link.getAttribute('href'));
        if (url && url.origin !== window.location.origin && !['mailto:', 'tel:'].includes(url.protocol)) {
            trackEvent('outbound_click', {
                destination: url.hostname,
                label: link.textContent,
                page: window.location.pathname,
            });
        }
    });
}

function datasetEventData(el) {
    const data = { page: window.location.pathname };
    Object.entries(el.dataset).forEach(([key, value]) => {
        if (key === 'analyticsEvent') return;
        data[key] = value;
    });
    return data;
}

function sanitizeEventData(eventData) {
    const blockedKeys = /email|phone|name|message|organisation|organization|company|url|website|role|title/i;
    const clean = {};

    Object.entries(eventData || {}).forEach(([key, value]) => {
        if (blockedKeys.test(key)) return;
        if (value === null || value === undefined) return;

        if (typeof value === 'string') {
            clean[key] = value.replace(/\s+/g, ' ').trim().slice(0, 80);
        } else if (typeof value === 'number' || typeof value === 'boolean') {
            clean[key] = value;
        } else if (Array.isArray(value)) {
            clean[key] = value.map((item) => String(item).slice(0, 40)).slice(0, 8).join(',');
        }
    });

    return clean;
}

function safePath(href) {
    const url = toUrl(href);
    if (!url) return '';
    return url.origin === window.location.origin ? `${url.pathname}${url.hash}` : url.hostname;
}

function toUrl(href) {
    if (!href) return null;
    try {
        return new URL(href, window.location.href);
    } catch (_) {
        return null;
    }
}
