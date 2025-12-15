document.addEventListener('DOMContentLoaded', function() {
    // --- 1. Bouton "Haut de page" ---
    const btnTop = document.createElement('button');
    btnTop.innerHTML = '⬆️ Haut';
    btnTop.className = 'btn btn-primary shadow';
    
    // Styles inline pour garantir l'affichage
    Object.assign(btnTop.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'none',
        zIndex: '1000',
        borderRadius: '50px',
        padding: '10px 20px'
    });

    btnTop.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
    document.body.appendChild(btnTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) btnTop.style.display = 'block';
        else btnTop.style.display = 'none';
    });

    // --- 2. Lien "Quitter" dans la Nav ---
    const nav = document.querySelector('.main-nav');
    if (nav) {
        // Optionnel : ajouter un séparateur
        const separator = document.createElement('span');
        separator.innerHTML = '&nbsp;|&nbsp;';
        separator.style.color = 'rgba(255,255,255,0.5)';
        nav.appendChild(separator);

        const quitLink = document.createElement('a');
        quitLink.href = '../../../index.html'; // Retour racine du site
        quitLink.innerHTML = '🚪 Quitter';
        quitLink.className = 'text-danger fw-bold'; 
        quitLink.title = "Retour à l'accueil";
        
        // Petit effet hover
        quitLink.onmouseover = () => quitLink.style.textDecoration = 'underline';
        quitLink.onmouseout = () => quitLink.style.textDecoration = 'none';

        nav.appendChild(quitLink);
    }
});
