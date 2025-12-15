/**
 * Learn2succeed - Search System
 * Système de recherche performant avec suggestions
 */

let searchIndex = [];
let searchTimeout = null;

/**
 * Initialiser l'index de recherche
 */
async function initializeSearchIndex() {
    try {
        const response = await fetch('data/courses.json');
        const data = await response.json();

        searchIndex = [];

        // Indexer les cours
        data.courses.forEach(course => {
            searchIndex.push({
                type: 'course',
                id: course.id,
                title: course.title,
                description: course.description,
                category: course.categoryLabel,
                categoryId: course.category,
                keywords: course.keywords.join(' '),
                url: course.chapters > 0 ? `courses/${course.category}/${course.id}/index.html` : null,
                available: course.chapters > 0
            });

            // Indexer les chapitres du cours
            course.chapterList.forEach(chapter => {
                searchIndex.push({
                    type: 'chapter',
                    id: `${course.id}-${chapter.id}`,
                    courseId: course.id,
                    courseTitle: course.title,
                    title: chapter.title,
                    category: course.categoryLabel,
                    categoryId: course.category,
                    duration: chapter.duration,
                    url: course.chapters > 0 ? `courses/${course.category}/${course.id}/${chapter.id}.html` : null,
                    available: course.chapters > 0
                });
            });
        });

        // Indexer les catégories
        data.categories.forEach(category => {
            searchIndex.push({
                type: 'category',
                id: category.id,
                title: category.name,
                description: category.description,
                icon: category.icon,
                url: `index.html#${category.id}`
            });
        });

        return searchIndex;
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la recherche:', error);
        return [];
    }
}

/**
 * Rechercher dans l'index
 */
function search(query) {
    if (!query || query.trim().length < 2) {
        return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    const queryWords = normalizedQuery.split(/\s+/);

    // Recherche avec score de pertinence
    const results = searchIndex.map(item => {
        let score = 0;

        // Recherche dans le titre (poids élevé)
        if (item.title && item.title.toLowerCase().includes(normalizedQuery)) {
            score += 100;
            // Bonus si le titre commence par la requête
            if (item.title.toLowerCase().startsWith(normalizedQuery)) {
                score += 50;
            }
        }

        // Recherche par mots individuels dans le titre
        queryWords.forEach(word => {
            if (item.title && item.title.toLowerCase().includes(word)) {
                score += 30;
            }
        });

        // Recherche dans la description
        if (item.description && item.description.toLowerCase().includes(normalizedQuery)) {
            score += 50;
        }

        // Recherche dans les mots-clés
        if (item.keywords && item.keywords.toLowerCase().includes(normalizedQuery)) {
            score += 75;
        }

        // Recherche dans la catégorie
        if (item.category && item.category.toLowerCase().includes(normalizedQuery)) {
            score += 40;
        }

        return { ...item, score };
    })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 20); // Limiter à 20 résultats

    return results;
}

/**
 * Afficher les résultats de recherche
 */
function displayResults(results, container) {
    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = `
            <div class="search-result-item" style="text-align: center; padding: var(--spacing-lg);">
                <p class="text-secondary">Aucun résultat trouvé</p>
            </div>
        `;
        return;
    }

    // Grouper par type
    const grouped = {
        course: results.filter(r => r.type === 'course'),
        chapter: results.filter(r => r.type === 'chapter'),
        category: results.filter(r => r.type === 'category')
    };

    // Afficher par type
    Object.entries(grouped).forEach(([type, items]) => {
        if (items.length === 0) return;

        const typeLabel = {
            course: 'Cours',
            chapter: 'Chapitres',
            category: 'Catégories'
        }[type];

        const header = document.createElement('div');
        header.style.padding = 'var(--spacing-sm) var(--spacing-md)';
        header.style.backgroundColor = 'var(--surface)';
        header.style.fontWeight = 'var(--font-weight-semibold)';
        header.style.fontSize = 'var(--font-size-sm)';
        header.style.color = 'var(--text-secondary)';
        header.textContent = typeLabel;
        container.appendChild(header);

        items.forEach(item => {
            const resultItem = createResultItem(item);
            container.appendChild(resultItem);
        });
    });
}

/**
 * Créer un élément de résultat
 */
function createResultItem(item) {
    const div = document.createElement('div');
    div.className = 'search-result-item';

    let icon = '';
    switch (item.type) {
        case 'course':
            icon = '📚';
            break;
        case 'chapter':
            icon = '📖';
            break;
        case 'category':
            icon = item.icon || '📂';
            break;
    }

    let content = `
        <div class="search-result-title">${icon} ${item.title}</div>
    `;

    if (item.description) {
        content += `<div class="search-result-description">${item.description}</div>`;
    }

    if (item.courseTitle) {
        content += `<div class="search-result-category">Cours : ${item.courseTitle}</div>`;
    } else if (item.category) {
        content += `<div class="search-result-category">${item.category}</div>`;
    }

    if (item.duration) {
        content += `<div class="search-result-category">⏱️ ${item.duration}</div>`;
    }

    if (!item.available) {
        content += `<div class="badge badge-warning" style="margin-top: 0.5rem;">À venir</div>`;
    }

    div.innerHTML = content;

    // Ajouter le lien si disponible
    if (item.url && item.available !== false) {
        div.style.cursor = 'pointer';
        div.onclick = () => {
            window.location.href = item.url;
        };
    } else if (!item.available) {
        div.style.opacity = '0.6';
        div.style.cursor = 'not-allowed';
        div.onclick = () => {
            alert('Ce contenu sera bientôt disponible !');
        };
    }

    return div;
}

/**
 * Recherche avec debouncing
 */
function performSearch(query, resultsContainer) {
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
        const results = search(query);
        displayResults(results, resultsContainer);
    }, 300); // Debounce de 300ms
}

/**
 * Filtrer les résultats par catégorie
 */
function filterByCategory(results, categoryId) {
    if (!categoryId || categoryId === 'all') {
        return results;
    }

    return results.filter(item => item.categoryId === categoryId);
}

// Export des fonctions
window.SearchSystem = {
    initializeSearchIndex,
    search,
    displayResults,
    performSearch,
    filterByCategory
};
