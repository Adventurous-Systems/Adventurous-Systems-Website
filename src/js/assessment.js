/**
 * AI Readiness Assessment — Form Logic
 * Migrated from Webflow inline script to ES module.
 */

/* ============================================================================
   CONFIGURATION
   ============================================================================ */

const FORM_SUBMIT_URL = 'https://script.google.com/macros/s/AKfycbwyvNqSngQKRH76AGf70xj6jTNQvJkvUQbfmHZotG7TOz-k5KJ-BuyTlcXKcPYA_cmu/exec';
const TOTAL_SECTIONS = 7;
const LOCAL_STORAGE_KEY = 'aiReadinessFormData';

/* ============================================================================
   STATE
   ============================================================================ */

let currentSection = 1;
let formData = {};

/* ============================================================================
   INITIALIZATION
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    loadFormProgress();
    showFormSection(currentSection);
    updateProgressIndicator(currentSection, TOTAL_SECTIONS);
    setupPmToolsOtherToggle();
    setupNavigationButtons();
    console.log('Assessment form initialized');
});

function setupNavigationButtons() {
    const backBtn = document.getElementById('formBackBtn');
    const nextBtn = document.getElementById('formNextBtn');
    const submitBtn = document.getElementById('formSubmitBtn');

    if (backBtn) backBtn.addEventListener('click', previousFormSection);
    if (nextBtn) nextBtn.addEventListener('click', nextFormSection);
    if (submitBtn) submitBtn.addEventListener('click', submitFinalForm);
}

/* ============================================================================
   NAVIGATION
   ============================================================================ */

function showFormSection(sectionNum) {
    document.querySelectorAll('.as-form-section').forEach(s => s.classList.remove('active'));

    const target = document.querySelector(`.as-form-section[data-section="${sectionNum}"]`);
    if (target) target.classList.add('active');

    updateNavigationButtons(sectionNum);
    updateProgressIndicator(sectionNum, TOTAL_SECTIONS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    currentSection = sectionNum;
}

function nextFormSection() {
    if (!validateSection(currentSection)) return;
    saveFormProgress();
    submitSectionToSheets(currentSection, false);
    if (currentSection < TOTAL_SECTIONS) showFormSection(currentSection + 1);
}

function previousFormSection() {
    saveFormProgress();
    if (currentSection > 1) showFormSection(currentSection - 1);
}

function updateNavigationButtons(sectionNum) {
    const backBtn = document.getElementById('formBackBtn');
    const nextBtn = document.getElementById('formNextBtn');
    const submitBtn = document.getElementById('formSubmitBtn');

    backBtn.style.display = sectionNum === 1 ? 'none' : 'block';

    if (sectionNum === TOTAL_SECTIONS) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
        generateReviewContent();
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

function updateProgressIndicator(current, total) {
    const fill = document.getElementById('formProgressFill');
    const text = document.getElementById('formProgressText');
    const pct = (current / total) * 100;

    if (fill) fill.style.width = pct + '%';
    if (text) {
        const names = [
            'Company Information',
            'Technology Landscape',
            'Challenges & Pain Points',
            'AI & Automation Interest',
            'Decision Making & Timeline',
            'Assessment Goals',
            'Review & Submit'
        ];
        text.textContent = `Step ${current} of ${total}: ${names[current - 1] || ''}`;
    }
}

/* ============================================================================
   VALIDATION
   ============================================================================ */

function validateSection(sectionNum) {
    const section = document.querySelector(`.as-form-section[data-section="${sectionNum}"]`);
    if (!section) return true;

    let isValid = true;
    section.querySelectorAll('.as-form-error').forEach(e => e.classList.remove('show'));

    // Required text/select/textarea
    section.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
        if (field.type === 'radio') return; // handled below
        if (!field.value.trim()) {
            showValidationError(field);
            isValid = false;
        }
    });

    // Required radio groups
    const checkedRadioNames = new Set();
    section.querySelectorAll('input[type="radio"][required]').forEach(radio => {
        const name = radio.getAttribute('name');
        if (checkedRadioNames.has(name)) return;
        checkedRadioNames.add(name);
        if (!section.querySelector(`input[name="${name}"]:checked`)) {
            showValidationError(radio);
            isValid = false;
        }
    });

    // Required checkbox groups
    ['topChallenges', 'aiPriorities', 'assessmentGoals'].forEach(name => {
        const first = section.querySelector(`input[name="${name}"]`);
        if (first && section.querySelectorAll(`input[name="${name}"]:checked`).length === 0) {
            showValidationError(first);
            isValid = false;
        }
    });

    return isValid;
}

function showValidationError(field) {
    const container = field.closest('.as-form-field');
    if (container) {
        const err = container.querySelector('.as-form-error');
        if (err) err.classList.add('show');
    }
    field.style.borderColor = '#dc2626';
    setTimeout(() => { field.style.borderColor = ''; }, 3000);
}

/* ============================================================================
   DATA COLLECTION & PERSISTENCE
   ============================================================================ */

function collectFormData() {
    const form = document.getElementById('aiReadinessForm');
    const data = {};

    form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"], textarea, select').forEach(f => {
        const name = f.getAttribute('name');
        if (name) data[name] = f.value;
    });

    form.querySelectorAll('input[type="radio"]:checked').forEach(r => {
        const name = r.getAttribute('name');
        if (name) data[name] = r.value;
    });

    ['designSoftware', 'pmTools', 'dataStorage', 'topChallenges', 'aiPriorities', 'assessmentGoals'].forEach(name => {
        data[name] = Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);
    });

    // Handle PM Tools "Other"
    const pmOther = form.querySelector('input[name="pmTools"][value="Other"]');
    const pmOtherText = form.querySelector('input[name="pmToolsOther"]');
    if (pmOther?.checked && pmOtherText?.value.trim()) {
        const arr = data.pmTools || [];
        const idx = arr.indexOf('Other');
        if (idx !== -1) arr[idx] = `Other: ${pmOtherText.value.trim()}`;
        data.pmTools = arr;
    }

    return data;
}

function saveFormProgress() {
    formData = collectFormData();
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
            currentSection,
            formData,
            lastSaved: new Date().toISOString()
        }));
    } catch (e) {
        console.error('Save error:', e);
    }
}

function loadFormProgress() {
    try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            const p = JSON.parse(saved);
            formData = p.formData || {};
            currentSection = 1; // Always start at step 1 on page load
            restoreFormFields(formData);
        }
    } catch (e) {
        console.error('Load error:', e);
    }
}

function restoreFormFields(data) {
    const form = document.getElementById('aiReadinessForm');

    Object.keys(data).forEach(name => {
        const field = form.querySelector(`[name="${name}"]`);
        if (!field) return;

        if (field.type === 'radio') {
            const r = form.querySelector(`input[name="${name}"][value="${data[name]}"]`);
            if (r) r.checked = true;
        } else if (field.type === 'checkbox') {
            if (Array.isArray(data[name])) {
                data[name].forEach(value => {
                    if (name === 'pmTools' && value.startsWith('Other: ')) {
                        const cb = form.querySelector(`input[name="${name}"][value="Other"]`);
                        const txt = form.querySelector('input[name="pmToolsOther"]');
                        if (cb && txt) {
                            cb.checked = true;
                            txt.value = value.replace('Other: ', '');
                            const otherField = document.getElementById('pmOtherField');
                            if (otherField) otherField.style.display = 'block';
                        }
                    } else {
                        const cb = form.querySelector(`input[name="${name}"][value="${value}"]`);
                        if (cb) cb.checked = true;
                    }
                });
            }
        } else {
            field.value = data[name];
        }
    });
}

function clearFormProgress() {
    try { localStorage.removeItem(LOCAL_STORAGE_KEY); } catch (e) { /* noop */ }
}

/* ============================================================================
   SUBMISSION
   ============================================================================ */

function submitSectionToSheets(sectionNum, isComplete) {
    const submission = {
        ...collectFormData(),
        status: isComplete ? 'complete' : 'partial',
        currentSection: sectionNum,
        timestamp: new Date().toISOString()
    };

    fetch(FORM_SUBMIT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
    }).catch(err => console.error('Sheet submit error:', err));
}

function submitFinalForm() {
    if (!validateSection(currentSection)) {
        alert('Please review and complete all required fields.');
        return;
    }

    const submitBtn = document.getElementById('formSubmitBtn');
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    const submission = {
        ...collectFormData(),
        status: 'complete',
        currentSection: TOTAL_SECTIONS,
        timestamp: new Date().toISOString()
    };

    fetch(FORM_SUBMIT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
    }).then(() => {
        clearFormProgress();
        showSuccessMessage();
    }).catch(() => {
        alert('There was an error. Please try again or contact us directly.');
        submitBtn.textContent = 'Submit Assessment';
        submitBtn.disabled = false;
    });
}

function showSuccessMessage() {
    const container = document.querySelector('.as-form-container');
    container.innerHTML = `
        <div class="as-form-success">
            <div class="as-form-success-icon">✓</div>
            <h3>Thank You for Your Submission!</h3>
            <p>Your AI Readiness Assessment has been received. We'll review your information and contact you within 24 hours to schedule your discovery call.</p>
            <p><strong>What happens next:</strong></p>
            <ul style="text-align: left; display: inline-block; margin: 24px auto">
                <li style="margin-bottom: 12px">We'll send you a confirmation email</li>
                <li style="margin-bottom: 12px">Our team will review your assessment</li>
                <li style="margin-bottom: 12px">See you in the strategy session</li>
            </ul>
            <a href="/" class="as-form-btn as-form-btn-next" style="display: inline-block; text-decoration: none;">Return to Home</a>
        </div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================================
   REVIEW CONTENT
   ============================================================================ */

function generateReviewContent() {
    const container = document.getElementById('formReviewContent');
    if (!container) return;

    const data = collectFormData();
    const sections = [
        {
            title: 'Company Information',
            fields: [
                { label: 'Company Name', key: 'companyName' },
                { label: 'Your Name', key: 'yourName' },
                { label: 'Role/Title', key: 'roleTitle' },
                { label: 'Email', key: 'email' },
                { label: 'Phone', key: 'phone' },
                { label: 'Company Website', key: 'companyWebsite' },
                { label: 'Primary Sector', key: 'primarySector' },
                { label: 'Company Size', key: 'companySize' },
                { label: 'Annual Revenue', key: 'annualRevenue' }
            ]
        },
        {
            title: 'Technology & Integration',
            fields: [
                { label: 'Design Software', key: 'designSoftware' },
                { label: 'PM Tools', key: 'pmTools' },
                { label: 'Data Storage', key: 'dataStorage' },
                { label: 'Integration Level', key: 'integrationLevel' }
            ]
        },
        {
            title: 'Challenges & Goals',
            fields: [
                { label: 'Top Challenges', key: 'topChallenges' },
                { label: 'Where You Lose Time/Money', key: 'timeMoneyLoss' },
                { label: 'AI Priorities', key: 'aiPriorities' },
                { label: 'Assessment Goals', key: 'assessmentGoals' }
            ]
        },
        {
            title: 'Timeline & Decision Making',
            fields: [
                { label: 'Budget Range', key: 'budgetRange' },
                { label: 'Implementation Timeline', key: 'implementationTimeline' },
                { label: 'Decision Making', key: 'decisionMaking' }
            ]
        }
    ];

    let html = '';
    sections.forEach(s => {
        html += `<div class="as-form-review-section"><h4 class="as-form-review-title">${s.title}</h4>`;
        s.fields.forEach(f => {
            let val = data[f.key];
            if (Array.isArray(val)) val = val.length > 0 ? val.join(', ') : 'Not specified';
            if (!val || val === '') val = 'Not specified';
            if (typeof val === 'string' && val.length > 150) val = val.substring(0, 150) + '...';
            html += `<div class="as-form-review-item"><div class="as-form-review-label">${f.label}:</div><div class="as-form-review-value">${val}</div></div>`;
        });
        html += `</div>`;
    });

    container.innerHTML = html;
}

/* ============================================================================
   PM TOOLS "OTHER" TOGGLE
   ============================================================================ */

function setupPmToolsOtherToggle() {
    const cb = document.getElementById('pm-other');
    const field = document.getElementById('pmOtherField');
    if (cb && field) {
        cb.addEventListener('change', function () {
            field.style.display = this.checked ? 'block' : 'none';
            if (!this.checked) {
                const txt = field.querySelector('input[name="pmToolsOther"]');
                if (txt) txt.value = '';
            }
        });
    }
}
