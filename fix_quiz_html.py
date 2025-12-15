# Script de correction automatique des balises HTML dans les quiz

import re
import os

# Chemin vers les fichiers
html_dir = r"S:\Anti\LearningSite\courses\web-development\html"

def escape_html_in_string(text):
    """Échappe les balises HTML dans une chaîne JavaScript"""
    # Remplacer < par &lt; et > par &gt; SEULEMENT dans les balises
    text = re.sub(r'<(!DOCTYPE|!--|html|head|body|h[1-6]|p|div|span|a|img|link|meta|title|script|style|ul|ol|li|dl|dt|dd|table|thead|tbody|tfoot|tr|th|td|caption|form|input|label|select|option|textarea|button|fieldset|legend|br|hr|strong|em|b|i|u|code|pre|blockquote|cite|q|abbr|mark|small|sub|sup|del|ins|time|address|article|aside|footer|header|main|nav|section|figure|figcaption|audio|video|source|canvas|svg|picture|iframe|object|embed)([^>]*)>', r'&lt;\1\2&gt;', text)
    
    # Remplacer les balises fermantes
    text = re.sub(r'</([a-z0-9!-]+)>', r'&lt;/\1&gt;', text)
    
    return text

chapters_to_fix = {
    'ch02-structure.html': True,
    'ch03-balises-essentielles.html': True,
    'ch04-texte-formatage.html': True,
    'ch05-liens-navigation.html': True,
    'ch06-images-medias.html': True,
    'ch07-listes.html': True,
    'ch08-tableaux.html': True,
    'ch11-html-semantique.html': True
}

print("Correction des balises HTML dans les quiz...\n")

for chapter_file, should_fix in chapters_to_fix.items():
    if not should_fix:
        continue
        
    filepath = os.path.join(html_dir, chapter_file)
    
    if not os.path.exists(filepath):
        print(f"❌ {chapter_file} : FICHIER NON TROUVÉ")
        continue
    
    # Lire le fichier
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Sauvegarder l'original
    backup_path = filepath + '.backup'
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Trouver la section quizData
    quiz_pattern = r'(const quizData = \{[^}]*?questions: \[)(.*?)(\]\s*\};)'
    
    def fix_quiz_section(match):
        prefix = match.group(1)
        quiz_content = match.group(2)
        suffix = match.group(3)
        
        # Corriger les balises HTML dans options et explanations
        fixed_content = escape_html_in_string(quiz_content)
        
        return prefix + fixed_content + suffix
    
    # Appliquer les corrections
    new_content = re.sub(quiz_pattern, fix_quiz_section, content, flags=re.DOTALL)
    
    # Écrire le fichier corrigé
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ {chapter_file} : Corrigé (backup créé)")

print("\nCorrection terminée. Les fichiers originaux sont sauvegardés avec l'extension .backup")
