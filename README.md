# Learn2succeed - Plateforme d'apprentissage en ligne

Bienvenue sur **Learn2succeed**, une plateforme d'apprentissage académique offrant des cours complets et structurés dans les domaines du développement web, de la programmation, de l'IA et plus encore.

## 🎯 Caractéristiques principales

- ✅ **Cours académiques et structurés** du niveau débutant à avancé
- 📚 **9 cours initiaux** dont HTML (complet avec 15 chapitres)
- 💡 **Système de progression** avec localStorage pour suivre votre avancement
- 🎓 **Quiz et QCM interactifs** avec feedback immédiat
- 🔍 **Recherche performante** avec filtres par catégorie
- 📊 **Tableau de bord personnalisé** avec statistiques de progression
- ♿ **Accessible** et conforme aux standards WCAG
- 📱 **Responsive** - s'adapte à tous les écrans
- 🌐 **Multilingue ready** (actuellement en français)

## 🚀 Technologies utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Design système moderne avec variables CSS
- **JavaScript Vanilla** - Sans frameworks, code pur
- **Bootstrap 5.3** - Grille responsive
- **Prism.js** - Coloration syntaxique du code
- **LocalStorage API** - Sauvegarde de la progression

## 📁 Structure du projet

```
LearningSite/
├── index.html                      # Page d'accueil
├── dashboard.html                  # Tableau de bord étudiant
├── search.html                     # Page de recherche
├── css/
│   ├── main.css                    # Design system global
│   ├── components.css              # Composants réutilisables
│   └── courses.css                 # Styles spécifiques aux cours
├── js/
│   ├── main.js                     # Fonctions globales
│   ├── progress-tracker.js         # Système de progression
│   ├── quiz.js                     # Système de quiz
│   └── search.js                   # Moteur de recherche
├── data/
│   └── courses.json                # Métadonnées des cours
├── courses/
│   └── web-development/
│       └── html/
│           ├── index.html          # Page du cours HTML
│           ├── ch01-introduction.html
│           ├── ch02-structure.html
│           └── ...                 # Autres chapitres
└── assets/
    └── images/                     # Images et ressources
```

## 🎓 Cours disponibles

### Développement Web
- ✅ **HTML** (15 chapitres) - Disponible
- ⏳ **CSS** - À venir
- ⏳ **Bootstrap** - À venir

### Programmation
- ⏳ **PHP** - À venir
- ⏳ **Langage C** - À venir
- ⏳ **Assembleur** - À venir

### Autres domaines
- ⏳ **Linux** (Systèmes d'exploitation) - À venir
- ⏳ **IoT** (Technologie embarquée) - À venir
- ⏳ **Probabilités et statistiques** (Mathématiques) - À venir

## 🛠️ Installation et utilisation

### Prérequis
Aucun ! Le site est entièrement statique et fonctionne sans serveur.

### Utilisation locale

1. **Cloner ou télécharger** le projet
2. **Ouvrir** le fichier `index.html` dans votre navigateur
3. **C'est tout !** Le site fonctionne immédiatement

### Déploiement sur Netlify

1. **Créer un compte** sur [Netlify](https://www.netlify.com/)
2. **Connecter votre dépôt Git** (GitHub, GitLab, Bitbucket)
3. **Configurer le build** :
   - Build command: (laisser vide)
   - Publish directory: `.` (racine du projet)
4. **Déployer** !

Le fichier `netlify.toml` est déjà configuré pour un déploiement optimal.

## 📖 Fonctionnalités pédagogiques

Chaque chapitre de cours inclut :

- 📝 **Explications théoriques** claires et progressives
- 💻 **Exemples de code** commentés et réalistes
- 💡 **Section "Astuces"** avec conseils pratiques
- ⚠️ **Section "Erreurs fréquentes"** à éviter
- 🎯 **Quiz de révision** (5-10 questions par chapitre)
- 🏋️ **Exercices pratiques** classés par difficulté (facile/moyen/difficile)
- 🚀 **Mini-projets** pour appliquer les connaissances

## 📊 Système de progression

Le site utilise le **localStorage** du navigateur pour :

- ✅ Marquer les chapitres comme complétés
- 📈 Calculer votre progression par cours
- 💯 Sauvegarder vos scores de quiz
- 📅 Tracker votre dernière activité
- 💾 **Exporter/Importer** votre progression (fichier JSON)

**Note** : Les données sont stockées localement dans votre navigateur. Vider le cache supprime la progression.

## 🔍 Système de recherche

- 🚀 **Recherche en temps réel** avec debouncing (300ms)
- 🎯 **Score de pertinence** pour trier les résultats
- 📂 **Filtres par catégorie**
- 📚 Recherche dans les **cours, chapitres et catégories**
- 💡 **Suggestions populaires** pour guider les utilisateurs

## ♿ Accessibilité

- ✅ **Navigation au clavier** complète
- ✅ **Attributs ARIA** appropriés
- ✅ **Contraste** conforme WCAG AA (minimum 4.5:1)
- ✅ **Structure sémantique** HTML5
- ✅ **Skip links** pour accès rapide au contenu
- ✅ **Textes alternatifs** pour les images
- ✅ **Labels** pour tous les formulaires

## 🎨 Design

Le design s'inspire de **web.dev/learn/html** avec :

- 🎨 **Variables CSS** pour une personnalisation facile
- 🌈 **Palette de couleurs** moderne et accessible
- 📐 **Grille responsive** Bootstrap
- ✨ **Animations subtiles** pour améliorer l'UX
- 🔤 **Typographie** claire (Google Fonts: Inter + Fira Code)

## 📝 Licence et crédits

### Inspiration pédagogique

Le contenu s'inspire des meilleures ressources en ligne :
- [web.dev/learn](https://web.dev/learn/html)
- [W3Schools](https://www.w3schools.com)
- [MDN Web Docs](https://developer.mozilla.org/)
- [freeCodeCamp](https://www.freecodecamp.org)
- [Codecademy](https://www.codecademy.com)

### Licence

© 2024 Learn2succeed. Projet éducatif à but non lucratif.

## 🤝 Contribution

Ce projet est ouvert aux contributions ! Pour ajouter du contenu ou améliorer le site :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/nouveau-cours`)
3. Committez vos changements (`git commit -m 'Ajout du cours CSS'`)
4. Push vers la branche (`git push origin feature/nouveau-cours`)
5. Ouvrez une Pull Request

## 📧 Contact

Pour toute question ou suggestion : [votre-email@exemple.com]

---

**Bon apprentissage ! 🚀📚**
