/**
 * Learn2succeed - Progress Tracker
 * Système de suivi de progression des cours
 */

// Structure de données de progression
const PROGRESS_KEY = 'learn2succeed_progress';

/**
 * Récupérer les données de progression
 */
function getProgressData() {
    return window.Learn2succeed.loadFromLocalStorage(PROGRESS_KEY, {
        courses: {},
        last_activity: null,
        total_time: 0
    });
}

/**
 * Sauvegarder les données de progression
 */
function saveProgressData(data) {
    data.last_activity = new Date().toISOString();
    return window.Learn2succeed.saveToLocalStorage(PROGRESS_KEY, data);
}

/**
 * Initialiser un cours si pas déjà fait
 */
function initializeCourse(courseId) {
    const data = getProgressData();

    if (!data.courses[courseId]) {
        data.courses[courseId] = {
            started: true,
            completed: false,
            progress: 0,
            chapters: {},
            started_at: new Date().toISOString(),
            completed_at: null
        };
        saveProgressData(data);
    }

    return data.courses[courseId];
}

/**
 * Marquer un chapitre comme complété
 */
function markChapterComplete(courseId, chapterId, quizScore = null) {
    const data = getProgressData();
    initializeCourse(courseId);

    if (!data.courses[courseId].chapters[chapterId]) {
        data.courses[courseId].chapters[chapterId] = {};
    }

    data.courses[courseId].chapters[chapterId] = {
        completed: true,
        completed_at: new Date().toISOString(),
        quiz_score: quizScore,
        last_viewed: new Date().toISOString()
    };

    // Recalculer la progression du cours
    updateCourseProgress(courseId, data);
    saveProgressData(data);

    return data.courses[courseId];
}

/**
 * Marquer un chapitre comme visité (mais pas complété)
 */
function markChapterViewed(courseId, chapterId) {
    const data = getProgressData();
    initializeCourse(courseId);

    if (!data.courses[courseId].chapters[chapterId]) {
        data.courses[courseId].chapters[chapterId] = {
            completed: false,
            last_viewed: new Date().toISOString()
        };
    } else {
        data.courses[courseId].chapters[chapterId].last_viewed = new Date().toISOString();
    }

    saveProgressData(data);
}

/**
 * Mettre à jour le score d'un quiz
 */
function updateQuizScore(courseId, chapterId, score) {
    const data = getProgressData();
    initializeCourse(courseId);

    if (!data.courses[courseId].chapters[chapterId]) {
        data.courses[courseId].chapters[chapterId] = {
            completed: false
        };
    }

    data.courses[courseId].chapters[chapterId].quiz_score = score;
    data.courses[courseId].chapters[chapterId].quiz_completed_at = new Date().toISOString();

    saveProgressData(data);
    return score;
}

/**
 * Calculer et mettre à jour la progression d'un cours
 */
function updateCourseProgress(courseId, data) {
    const courseData = data.courses[courseId];
    if (!courseData) return 0;

    const totalChapters = Object.keys(courseData.chapters).length;
    if (totalChapters === 0) {
        courseData.progress = 0;
        return 0;
    }

    const completedChapters = Object.values(courseData.chapters)
        .filter(chapter => chapter.completed).length;

    const progress = Math.round((completedChapters / totalChapters) * 100);
    courseData.progress = progress;

    // Marquer le cours comme complété si 100%
    if (progress === 100) {
        courseData.completed = true;
        courseData.completed_at = new Date().toISOString();
    }

    return progress;
}

/**
 * Obtenir la progression d'un cours spécifique
 */
function getCourseProgress(courseId) {
    const data = getProgressData();
    return data.courses[courseId] || {
        started: false,
        completed: false,
        progress: 0,
        chapters: {}
    };
}

/**
 * Obtenir la progression globale (tous les cours)
 */
function getOverallProgress() {
    const data = getProgressData();
    const courses = Object.values(data.courses);

    if (courses.length === 0) {
        return {
            total_courses: 0,
            started_courses: 0,
            completed_courses: 0,
            overall_progress: 0,
            total_chapters: 0,
            completed_chapters: 0
        };
    }

    const stats = {
        total_courses: courses.length,
        started_courses: courses.filter(c => c.started).length,
        completed_courses: courses.filter(c => c.completed).length,
        total_chapters: 0,
        completed_chapters: 0
    };

    courses.forEach(course => {
        const totalChapters = Object.keys(course.chapters).length;
        const completedChapters = Object.values(course.chapters)
            .filter(ch => ch.completed).length;

        stats.total_chapters += totalChapters;
        stats.completed_chapters += completedChapters;
    });

    stats.overall_progress = stats.total_chapters > 0
        ? Math.round((stats.completed_chapters / stats.total_chapters) * 100)
        : 0;

    return stats;
}

/**
 * Obtenir tous les cours en cours
 */
function getCoursesInProgress() {
    const data = getProgressData();
    return Object.entries(data.courses)
        .filter(([_, course]) => course.started && !course.completed)
        .map(([id, course]) => ({
            id,
            ...course
        }));
}

/**
 * Obtenir tous les cours complétés
 */
function getCompletedCourses() {
    const data = getProgressData();
    return Object.entries(data.courses)
        .filter(([_, course]) => course.completed)
        .map(([id, course]) => ({
            id,
            ...course
        }));
}

/**
 * Vérifier si un chapitre est complété
 */
function isChapterCompleted(courseId, chapterId) {
    const data = getProgressData();
    return data.courses[courseId]?.chapters[chapterId]?.completed || false;
}

/**
 * Obtenir le prochain chapitre à étudier
 */
function getNextChapter(courseId, allChapters) {
    const progress = getCourseProgress(courseId);

    // Trouver le premier chapitre non complété
    for (const chapter of allChapters) {
        if (!progress.chapters[chapter.id]?.completed) {
            return chapter;
        }
    }

    // Si tous sont complétés, retourner null
    return null;
}

/**
 * Réinitialiser la progression d'un cours
 */
function resetCourseProgress(courseId) {
    const data = getProgressData();

    if (data.courses[courseId]) {
        delete data.courses[courseId];
        saveProgressData(data);
        return true;
    }

    return false;
}

/**
 * Réinitialiser toute la progression
 */
function resetAllProgress() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toute votre progression ?')) {
        localStorage.removeItem(PROGRESS_KEY);
        return true;
    }
    return false;
}

/**
 * Exporter la progression (pour sauvegarde)
 */
function exportProgress() {
    const data = getProgressData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `learn2succeed_progress_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
}

/**
 * Importer la progression
 */
function importProgress(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (confirm('Cela va écraser votre progression actuelle. Continuer ?')) {
                saveProgressData(data);
                alert('Progression importée avec succès !');
                window.location.reload();
            }
        } catch (error) {
            alert('Erreur lors de l\'importation du fichier');
            console.error(error);
        }
    };

    reader.readAsText(file);
}

// Export des fonctions
window.ProgressTracker = {
    getProgressData,
    saveProgressData,
    initializeCourse,
    markChapterComplete,
    markChapterViewed,
    updateQuizScore,
    getCourseProgress,
    getOverallProgress,
    getCoursesInProgress,
    getCompletedCourses,
    isChapterCompleted,
    getNextChapter,
    resetCourseProgress,
    resetAllProgress,
    exportProgress,
    importProgress
};
