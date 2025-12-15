/**
 * Learn2succeed - Main JavaScript
 * Fonctions globales et utilitaires
 */

// ==========================================
// MENU MOBILE (Burger Menu)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
        });
        
        // Fermer le menu en cliquant en dehors
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.site-header')) {
                mainNav.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

// ==========================================
// SMOOTH SCROLL pour les ancres
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#!') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==========================================
// ACTIVE LINK HIGHLIGHTING
// ==========================================
function updateActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = new URL(link.href).pathname;
        if (currentPath === linkPath) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', updateActiveLink);

// ==========================================
// UTILITAIRES
// ==========================================

/**
 * Formater une durée en format lisible
 */
function formatDuration(duration) {
    return duration.replace('h', ' heure').replace('min', ' minutes');
}

/**
 * Générer un ID unique
 */
function generateId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Debounce function pour optimiser les performances
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Sauvegarder dans localStorage
 */
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Erreur localStorage:', e);
        return false;
    }
}

/**
 * Charger depuis localStorage
 */
function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error('Erreur localStorage:', e);
        return defaultValue;
    }
}

// ==========================================
// ANALYTICS (Track page views)
// ==========================================
function trackPageView() {
    const pageData = {
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString()
    };
    
    // Sauvegarder l'historique de navigation
    const history = loadFromLocalStorage('page_history', []);
    history.push(pageData);
    
    // Garder seulement les 50 dernières pages
    if (history.length > 50) {
        history.shift();
    }
    
    saveToLocalStorage('page_history', history);
}

document.addEventListener('DOMContentLoaded', trackPageView);

// ==========================================
// EXPORT des fonctions utilitaires
// ==========================================
window.Learn2succeed = {
    formatDuration,
    generateId,
    debounce,
    saveToLocalStorage,
    loadFromLocalStorage,
    trackPageView
};
