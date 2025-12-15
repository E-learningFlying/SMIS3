/**
 * Learn2succeed - Quiz System
 * Système de quiz et QCM interactifs
 */

/**
 * Créer un quiz à partir des données JSON
 */
function createQuiz(quizData, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return null;
    }

    const quiz = {
        data: quizData,
        currentQuestion: 0,
        answers: {},
        score: 0,
        completed: false
    };

    // Mélanger les questions (optionnel)
    if (quizData.shuffle) {
        quiz.data.questions = shuffleArray([...quizData.questions]);
    }

    renderQuiz(quiz, container);
    return quiz;
}

/**
 * Afficher le quiz
 */
function renderQuiz(quiz, container) {
    container.innerHTML = '';
    container.className = 'quiz-container';

    // Header du quiz
    const header = document.createElement('div');
    header.className = 'quiz-header mb-4';
    header.innerHTML = `
        <h3>${quiz.data.title || 'Quiz de révision'}</h3>
        <p class="text-secondary">${quiz.data.description || ''}</p>
    `;
    container.appendChild(header);

    // Questions
    quiz.data.questions.forEach((question, index) => {
        const questionEl = createQuestionElement(question, index, quiz);
        container.appendChild(questionEl);
    });

    // Bouton de soumission
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn-primary btn-lg mt-4';
    submitBtn.textContent = 'Vérifier mes réponses';
    submitBtn.onclick = () => submitQuiz(quiz, container);
    container.appendChild(submitBtn);

    // Zone de résultat
    const resultEl = document.createElement('div');
    resultEl.id = 'quiz-result';
    resultEl.className = 'quiz-score mt-4';
    resultEl.style.display = 'none';
    container.appendChild(resultEl);
}

/**
 * Créer un élément de question
 */
function createQuestionElement(question, index, quiz) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'quiz-question';
    questionDiv.id = `question-${index}`;

    const questionTitle = document.createElement('h4');
    questionTitle.innerHTML = `${index + 1}. ${question.question}`;
    questionDiv.appendChild(questionTitle);

    const optionsList = document.createElement('ul');
    optionsList.className = 'quiz-options';

    question.options.forEach((option, optIndex) => {
        const optionItem = document.createElement('li');
        optionItem.className = 'quiz-option';

        const inputType = question.type === 'multiple' ? 'checkbox' : 'radio';
        const inputName = `question-${index}`;
        const inputId = `question-${index}-option-${optIndex}`;

        optionItem.innerHTML = `
            <label for="${inputId}">
                <input 
                    type="${inputType}" 
                    name="${inputName}" 
                    id="${inputId}" 
                    value="${optIndex}"
                    ${inputType === 'radio' ? 'required' : ''}
                >
                <span>${option}</span>
            </label>
        `;

        optionsList.appendChild(optionItem);
    });

    questionDiv.appendChild(optionsList);

    // Zone de feedback (cachée initialement)
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'quiz-feedback';
    feedbackDiv.style.display = 'none';
    questionDiv.appendChild(feedbackDiv);

    return questionDiv;
}

/**
 * Soumettre le quiz
 */
function submitQuiz(quiz, container) {
    let score = 0;
    const totalQuestions = quiz.data.questions.length;

    quiz.data.questions.forEach((question, index) => {
        const questionEl = document.getElementById(`question-${index}`);
        const inputs = questionEl.querySelectorAll('input');
        const feedbackEl = questionEl.querySelector('.quiz-feedback');

        // Récupérer les réponses de l'utilisateur
        const userAnswers = [];
        inputs.forEach(input => {
            if (input.checked) {
                userAnswers.push(parseInt(input.value));
            }
        });

        // Vérifier la réponse
        const isCorrect = checkAnswer(question, userAnswers);

        if (isCorrect) {
            score++;
        }

        // Afficher le feedback
        showFeedback(questionEl, feedbackEl, question, userAnswers, isCorrect);
    });

    // Afficher le score
    const percentage = Math.round((score / totalQuestions) * 100);
    displayScore(container, score, totalQuestions, percentage);

    // Sauvegarder le score si contexte de cours disponible
    if (quiz.data.course_id && quiz.data.chapter_id) {
        window.ProgressTracker.updateQuizScore(
            quiz.data.course_id,
            quiz.data.chapter_id,
            percentage
        );
    }

    quiz.completed = true;
    quiz.score = percentage;

    // Désactiver le bouton de soumission
    const submitBtn = container.querySelector('button');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Quiz terminé';
    }

    return { score, totalQuestions, percentage };
}

/**
 * Vérifier une réponse
 */
function checkAnswer(question, userAnswers) {
    if (question.type === 'multiple') {
        // Pour les QCM multiples, vérifier que toutes les bonnes réponses sont sélectionnées
        const correctAnswers = question.correct.sort();
        const sortedUserAnswers = userAnswers.sort();

        return JSON.stringify(correctAnswers) === JSON.stringify(sortedUserAnswers);
    } else {
        // Pour les QCM simples, vérifier la réponse unique
        return userAnswers.length === 1 && userAnswers[0] === question.correct;
    }
}

/**
 * Afficher le feedback pour une question
 */
function showFeedback(questionEl, feedbackEl, question, userAnswers, isCorrect) {
    // Marquer les options
    const options = questionEl.querySelectorAll('.quiz-option');

    options.forEach((option, index) => {
        const isUserAnswer = userAnswers.includes(index);
        const isCorrectAnswer = question.type === 'multiple'
            ? question.correct.includes(index)
            : question.correct === index;

        if (isCorrectAnswer) {
            option.classList.add('correct');
        } else if (isUserAnswer && !isCorrectAnswer) {
            option.classList.add('incorrect');
        }

        // Désactiver les inputs
        const input = option.querySelector('input');
        if (input) {
            input.disabled = true;
        }
    });

    // Afficher l'explication
    feedbackEl.style.display = 'block';
    feedbackEl.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackEl.innerHTML = `
        <strong>${isCorrect ? '✓ Correct !' : '✗ Incorrect'}</strong><br>
        ${question.explanation || ''}
    `;
}

/**
 * Afficher le score final
 */
function displayScore(container, score, total, percentage) {
    const resultEl = container.querySelector('#quiz-result');

    let message = '';
    let emoji = '';

    if (percentage >= 90) {
        message = 'Excellent travail ! 🎉';
        emoji = '🏆';
    } else if (percentage >= 70) {
        message = 'Bien joué ! 👏';
        emoji = '✨';
    } else if (percentage >= 50) {
        message = 'Pas mal, continuez ! 💪';
        emoji = '📚';
    } else {
        message = 'Revoyez le chapitre et réessayez !';
        emoji = '📖';
    }

    resultEl.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: var(--spacing-sm);">${emoji}</div>
        <h3>Score : ${score}/${total} (${percentage}%)</h3>
        <p class="text-secondary">${message}</p>
    `;

    resultEl.style.display = 'block';

    // Scroll vers le résultat
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Utilitaire : mélanger un tableau
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Réinitialiser un quiz
 */
function resetQuiz(quiz, container) {
    quiz.currentQuestion = 0;
    quiz.answers = {};
    quiz.score = 0;
    quiz.completed = false;

    renderQuiz(quiz, container);
}

// Export des fonctions
window.QuizSystem = {
    createQuiz,
    submitQuiz,
    resetQuiz,
    checkAnswer
};
