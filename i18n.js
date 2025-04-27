let translations = {};
let locale = 'en';

function detectLocale() {
    console.log(navigator.language)
    const nav = (navigator.language || 'en').toLowerCase();
    if (nav === 'pt-br' || nav === 'pt') return 'pt';
    return 'en';
}

async function loadTranslations() {
    locale = detectLocale();
    try {
        const response = await fetch(`locales/${locale}.json`)
        translations = await response.json();
    } catch (e) {
        if (locale !== 'en') {
            const response = await fetch('locales/en.json');
            translations = await response.json();
        }
    }
    applyTranslations();
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
            el.innerHTML = t(key);
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[key]) {
            el.placeholder = t(key);
        }
    });
    if (window.updateTypewriter) window.updateTypewriter();
}

function t(key, vars = {}) {
    let text = translations[key] || key;
    for (const [k, v] of Object.entries(vars)) {
        text = text.replace(`{{${k}}}`, v);
    }
    return text;
}
window.addEventListener('DOMContentLoaded', loadTranslations);