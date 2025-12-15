# Script de correction finale - toutes les balises restantes

import re
import os

html_dir = r"S:\Anti\LearningSite\courses\web-development\html"

def escape_all_html_tags(text):
    """Échappe TOUTES les balises HTML dans une chaîne (même les fausses balises)"""
    # Remplacer toutes les balises <...> par &lt;...&gt;
    text = re.sub(r'<([^>]+)>', r'&lt;\1&gt;', text)
    return text

chapters_to_fix = [
    'ch03-balises-essentielles.html',
    'ch04-texte-formatage.html',
    'ch06-images-medias.html',
    'ch07-listes.html',
    'ch08-tableaux.html'
]

print("Correction finale des balises HTML restantes...\n")

for chapter_file in chapters_to_fix:
    filepath = os.path.join(html_dir, chapter_file)
    
    if not os.path.exists(filepath):
        print(f"❌ {chapter_file} : FICHIER NON TROUVÉ")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern pour trouver la section quizData
    quiz_pattern = r'(const quizData = \{[^}]*?questions: \[)(.*?)(\]\s*\};)'
    
    def fix_quiz_section(match):
        prefix = match.group(1)
        quiz_content = match.group(2)
        suffix = match.group(3)
        
        # Corriger TOUTES les balises restantes
        fixed_content = escape_all_html_tags(quiz_content)
        
        return prefix + fixed_content + suffix
    
    new_content = re.sub(quiz_pattern, fix_quiz_section, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ {chapter_file} : Toutes balises échappées")

print("\nCorrection finale terminée!")
