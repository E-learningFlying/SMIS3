# Script de détection des balises HTML non échappées dans les quiz

import re
import os

# Chemin vers les fichiers
html_dir = r"S:\Anti\LearningSite\courses\web-development\html"

# Pattern pour trouver les questions de quiz
quiz_pattern = r'const quizData = \{.*?questions: \[(.*?)\]\s*\};'

# Pattern pour les balises HTML non échappées dans les options et explanations
html_tag_pattern = r'<[a-z/!][^>]*>'

chapters_to_check = [
    'ch02-structure.html',
    'ch03-balises-essentielles.html',
    'ch04-texte-formatage.html',
    'ch05-liens-navigation.html',
    'ch06-images-medias.html',
    'ch07-listes.html',
    'ch08-tableaux.html',
    'ch09-formulaires-1.html',
    'ch10-formulaires-2.html',
    'ch11-html-semantique.html',
    'ch12-metadonnees-seo.html',
    'ch13-accessibilite.html',
    'ch14-html5-apis.html',
    'ch15-bonnes-pratiques.html'
]

print("Vérification des balises HTML non échappées dans les quiz...\n")

for chapter_file in chapters_to_check:
    filepath = os.path.join(html_dir, chapter_file)
    
    if not os.path.exists(filepath):
        print(f"❌ {chapter_file} : FICHIER NON TROUVÉ")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extraire la section quizData
    quiz_match = re.search(quiz_pattern, content, re.DOTALL)
    
    if quiz_match:
        quiz_section = quiz_match.group(1)
        
        # Chercher les balises HTML non échappées
        html_tags = re.findall(html_tag_pattern, quiz_section)
        
        # Filtrer les faux positifs (comme des <code> dans des explications HTML déjà échappées)
        problematic_tags = [tag for tag in html_tags if not tag.startswith('&')]
        
        if problematic_tags:
            print(f"⚠️  {chapter_file} : {len(problematic_tags)} balise(s) non échappée(s)")
            print(f"    Exemples : {problematic_tags[:5]}")
        else:
            print(f"✅ {chapter_file} : OK")
    else:
        print(f"❓ {chapter_file} : Pas de quizData trouvé")

print("\nVérification terminée.")
