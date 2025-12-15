
import os
import re

# Base directory
base_dir = r"S:\Anti\LearningSite\courses\programmation\assembly-x86-64"

# Solution Data (Copied from previous turn)
solutions_data = {
    'ch02': [
        {
            'id': 'sol-ch02-ex1',
            'title': 'Solution - Calcul d\'adresses',
            'content': '''<p><strong>Formule :</strong> Adresse physique = Segment × 16 + Offset</p>
<ol>
<li><strong>DS = 2000h, Offset = 0100h</strong>
<pre><code class="language-asm">= 2000h × 10h + 0100h
= 20000h + 0100h
= 20100h</code></pre>
</li>
<li><strong>CS = 1234h, Offset = 5678h</strong>
<pre><code class="language-asm">= 1234h × 10h + 5678h
= 12340h + 5678h
= 179B8h</code></pre>
</li>
<li><strong>SS = FFFFh, Offset = 000Fh</strong>
<pre><code class="language-asm">= FFFFh × 10h + 000Fh
= FFFF0h + 000Fh
= FFFFFh (dernière adresse)</code></pre>
</li>
</ol>'''
        },
        {
            'id': 'sol-ch02-ex2',
            'title': 'Solution - Observer les flags',
            'content': '''<pre><code class="language-asm">.MODEL SMALL
.CODE
MAIN PROC
    ; Test 1 : Débordement
    MOV AL, 255
    ADD AL, 1
    ; AL = 0, CF = 1, ZF = 1
    
    ; Test 2 : Résultat zéro
    MOV AX, 100
    SUB AX, 100
    ; AX = 0, ZF = 1, CF = 0, SF = 0
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN</code></pre>
<p><strong>Observations :</strong></p>
<ul>
<li><strong>CF = 1</strong> : Lors du débordement (255 + 1)</li>
<li><strong>ZF = 1</strong> : Résultat = 0</li>
<li><strong>SF = 0/1</strong> : Selon le signe du résultat</li>
</ul>'''
        },
        {
            'id': 'sol-ch02-ex3',
            'title': 'Solution - Segmentation pratique',
            'content': '''<pre><code class="language-asm">.MODEL SMALL
.STACK 100h

.DATA
    valeur DW 1234h

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX
    
    ; Observer DS dans emu8086
    ; Puis Memory view pour voir la variable
    
    MOV BX, valeur
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN</code></pre>
<p><strong>Dans emu8086 :</strong></p>
<ol>
<li>Lancez le debugger (F8)</li>
<li>Regardez la valeur de DS</li>
<li>Calculez : DS × 10h + offset de valeur</li>
<li>Vérifiez dans Memory View</li>
</ol>'''
        }
    ],
    'ch03': [
        {
            'id': 'sol-ch03-ex1',
            'title': 'Solution - Manipulation registres',
            'content': '''<pre><code class="language-asm">.MODEL SMALL
.STACK 100h

.DATA
    resultat DW ?

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX
    
    MOV AX, 100
    MOV BX, 50
    
    MOV CX, AX
    ADD CX, BX      ; CX = 150
    
    MOV resultat, CX
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN</code></pre>
<p><strong>Résultat :</strong> CX = 150 (96h en hexadécimal)</p>'''
        },
        {
            'id': 'sol-ch03-ex2',
            'title': 'Solution - AH et AL',
            'content': '''<pre><code class="language-asm">.MODEL SMALL
.CODE
MAIN PROC
    MOV AX, 1234h
    ; AX = 1234h, AH = 12h, AL = 34h
    
    MOV AH, 56h
    ; AX = 5634h, AH = 56h, AL = 34h
    
    MOV AL, 78h
    ; AX = 5678h, AH = 56h, AL = 78h
    
    MOV BX, AX    ; BX = 5678h
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN</code></pre>
<p><strong>Notes :</strong></p>
<ul>
<li>AX = 1234h → AH = 12h, AL = 34h</li>
<li>Après MOV AH, 56h → AX = 5634h</li>
<li>Après MOV AL, 78h → AX = 5678h</li>
</ul>'''
        },
        {
            'id': 'sol-ch03-ex3',
            'title': 'Solution - Observer flags',
            'content': '''<pre><code class="language-asm">.MODEL SMALL
.CODE
MAIN PROC
    ; Test débordement 8-bit
    MOV AL, 255
    ADD AL, 1
    ; AL = 0, CF = 1, ZF = 1
    
    ; Test zéro
    MOV AX, 100
    SUB AX, 100
    ; AX = 0, ZF = 1, CF = 0
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN</code></pre>
<p><strong>Explication :</strong></p>
<ul>
<li>255 + 1 = 256 → débordement 8-bit → CF = 1, résultat = 0 → ZF = 1</li>
<li>100 - 100 = 0 → ZF = 1, pas de débordement → CF = 0</li>
</ul>'''
        }
    ],
    'ch04': [
        {
            'id': 'sol-ch04-ex1',
            'title': 'Solution - Calculatrice simple',
            'content': '''<pre><code class="language-asm">.MODEL SMALL
.STACK 100h

.DATA
    num1 DW 50
    num2 DW 30
  somme DW ?
    difference DW ?

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX
    
    MOV AX, num1
    MOV BX, num2
    
    ; Addition
    MOV CX, AX
    ADD CX, BX      ; CX = 80
    MOV somme, CX
    
    ; Soustraction
    MOV DX, AX
    SUB DX, BX      ; DX = 20
    MOV difference, DX
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN</code></pre>
<p><strong>Résultats :</strong> CX = 80, DX = 20</p>'''
        },
        {
            'id': 'sol-ch04-ex2',
            'title': 'Solution - MUL et DIV',
            'content': '''<pre><code class="language-asm">.MODEL SMALL
.CODE
MAIN PROC
    ; 12 × 7
    MOV AL, 12
    MOV BL, 7
    MUL BL          ; AX = 84
    
    MOV CX, AX
    
    ; 84 ÷ 4
    MOV AX, CX
    MOV BL, 4
    DIV BL          ; AL = 21, AH = 0
    
    ; AL = 21 (15h), AH = 0
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN</code></pre>
<p><strong>Vérification :</strong></p>
<ul>
<li>12 × 7 = 84 ✓</li>
<li>84 ÷ 4 = 21 reste 0 ✓</li>
</ul>'''
        },
        {
            'id': 'sol-ch04-ex3',
            'title': 'Solution - Opérations bit à bit',
            'content': '''<pre><code class="language-asm">.MODEL SMALL
.CODE
MAIN PROC
    MOV AL, 10101100b    ; ACh
    MOV BL, AL           ; Sauve original
    
    ; Mettre 4 bits bas à 0
    AND AL, 11110000b    ; AL = 10100000b (A0h)
    MOV CL, AL
    
    ; Mettre bit 0 à 1
    OR AL, 00000001b     ; AL = 10100001b (A1h)
    MOV DL, AL
    
    ; Inverser
    NOT AL               ; AL = 01011110b (5Eh)
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN</code></pre>
<p><strong>Résultats :</strong></p>
<ul>
<li>BL = ACh (original)</li>
<li>CL = A0h (après AND)</li>
<li>DL = A1h (après OR)</li>
<li>AL = 5Eh (après NOT)</li>
</ul>'''
        }
    ],
    'ch05': [
        {
            'id': 'sol-ch05-ex1',
            'title': 'Solution - Accès tableau',
            'content': '''<pre><code class="language-asm">.MODEL SMALL
.STACK 100h

.DATA
    tableau DB 10, 20, 30, 40, 50

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX
    
    LEA BX, tableau
    
    MOV AL, [BX]         ; AL = 10 (1er)
    MOV CL, [BX + 2]     ; CL = 30 (3ème)
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN</code></pre>
<p><strong>Résultats :</strong> AL = 10, CL = 30</p>'''
        },
        {
            'id': 'sol-ch05-ex2',
            'title': 'Solution - Parcours et somme',
            'content': '''<pre><code class="language-asm">.MODEL SMALL
.STACK 100h

.DATA
    tableau DB 5, 10, 15, 20, 25, 30, 35, 40, 45, 50
    taille EQU 10

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX
    
    LEA SI, tableau
    MOV CX, taille
    XOR AX, AX

parcours:
    MOV BL, [SI]
    ADD AL, BL
    INC SI
    LOOP parcours
    
    ; AX = 275 (113h)
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN</code></pre>
<p><strong>Résultat :</strong> AX = 275 (113h)</p>
<p>5+10+15+20+25+30+35+40+45+50 = 275</p>'''
        },
        {
            'id': 'sol-ch05-ex3',
            'title': 'Solution - Matrice 2D',
            'content': '''<pre><code class="language-asm">.MODEL SMALL
.STACK 100h

.DATA
    matrice DB 1, 2, 3
            DB 4, 5, 6
            DB 7, 8, 9
    largeur EQU 3

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX
    
    LEA BX, matrice
    
    ; matrice[1][2]
    MOV AL, 1           ; ligne
    MOV CL, largeur
    MUL CL              ; AX = 3
    ADD AL, 2           ; AX = 5
    
    MOV SI, AX
    MOV DL, [BX + SI]   ; DL = 6
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN</code></pre>
<p><strong>Explication :</strong></p>
<ul>
<li>Ligne 1, colonne 2 (index 0-based)</li>
<li>Offset = 1 × 3 + 2 = 5</li>
<li>Élément à offset 5 = 6 ✓</li>
</ul>'''
        }
    ],
    'ch06': [
        {
            'id': 'sol-ch06-ex1',
            'title': 'Solution - if-else',
            'content': '''<pre><code class="language-asm">.MODEL SMALL
.STACK 100h

.CODE
MAIN PROC
    ; Test 1 : AX = 60
    MOV AX, 60
    CMP AX, 50
    JLE sinon
        MOV BX, 1
        JMP fin
    sinon:
        MOV BX, 0
    fin:
    ; BX = 1 (car 60 > 50)
    
    ; Test 2 : AX = 30
    MOV AX, 30
    CMP AX, 50
    JLE sinon2
        MOV CX, 1
        JMP fin2
    sinon2:
        MOV CX, 0
    fin2:
    ; CX = 0 (car 30 ≤ 50)
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN</code></pre>
<p><strong>Résultats :</strong> BX = 1, CX = 0</p>'''
        },
        {
            'id': 'sol-ch06-ex2',
            'title': 'Solution - Somme 1 à 100',
            'content': '''<pre><code class="language-asm">.MODEL SMALL
.STACK 100h

.DATA
    somme DW ?

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX
    
    MOV CX, 100
    XOR AX, AX
    MOV BX, 1

boucle:
    ADD AX, BX
    INC BX
    LOOP boucle
    
    ; AX = 5050 (13BAh)
    MOV somme, AX
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN</code></pre>
<p><strong>Résultat :</strong> 5050 (13BAh)</p>
<p><strong>Formule :</strong> n(n+1)/2 = 100×101/2 = 5050</p>'''
        },
        {
            'id': 'sol-ch06-ex3',
            'title': 'Solution - Recherche',
            'content': '''<pre><code class="language-asm">.MODEL SMALL
.STACK 100h

.DATA
    tableau DB 10, 25, 42, 18, 99, 42, 7, 33, 50, 12
    taille EQU 10
    cherche DB 42

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX
    
    LEA SI, tableau
    MOV CX, taille
    MOV AL, cherche
    XOR BX, BX

recherche:
    CMP AL, [SI]
    JE trouve
    INC SI
    INC BX
    LOOP recherche
    
    MOV BX, -1
    JMP fin

trouve:
    ; BX = position

fin:
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN</code></pre>
<p><strong>Résultat :</strong> BX = 2 (42 trouvé à l'index 2)</p>'''
        }
    ]
}


css_js_content = """
    <script>
        // Solution toggle function
        function toggleSolution(id) {
            const solution = document.getElementById(id);
            const button = event.target;
            
            if (solution.style.display === 'none') {
                solution.style.display = 'block';
                button.textContent = '🙈 Masquer la solution';
                button.classList.remove('btn-outline-primary');
                button.classList.add('btn-primary');
            } else {
                solution.style.display = 'none';
                button.textContent = '👁️ Voir la solution';
                button.classList.remove('btn-primary');
                button.classList.add('btn-outline-primary');
            }
        }
    </script>
    
    <style>
        .solution-box {
            margin-top: 1rem;
            padding: 1.5rem;
            background-color: #f8f9fa;
            border-left: 4px solid #0d6efd;
            border-radius: 0.375rem;
            animation: slideDown 0.3s ease-out;
        }
        
        .solution-box h4 {
            color: #0d6efd;
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }
        
        .solution-box pre {
            background-color: #ffffff;
            border: 1px solid #dee2e6;
            border-radius: 0.25rem;
            padding: 1rem;
            margin-top: 0.5rem;
        }
        
        .solution-toggle {
            transition: all 0.2s ease;
        }
        
        .solution-toggle:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
"""

def generate_solution_html(solution_data):
    return f'''
                                <button class="btn btn-sm btn-outline-primary mt-3 solution-toggle" onclick="toggleSolution('{solution_data['id']}')">
                                    👁️ Voir la solution
                                </button>
                                <div id="{solution_data['id']}" class="solution-box" style="display: none;">
                                    <h4>{solution_data['title']}</h4>
                                    {solution_data['content']}
                                </div>'''

def process_file(chapter_key, filename):
    filepath = os.path.join(base_dir, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    print(f"Processing {filename}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by exercise description closing tag
    parts = re.split(r'(<div class="exercise-description">[\s\S]*?</div>)', content)
    
    new_content = ""
    solution_idx = 0
    chapter_solutions = solutions_data.get(chapter_key, [])
    
    for i, part in enumerate(parts):
        new_content += part
        # If this part is an exercise description (it matches the split pattern)
        if '<div class="exercise-description">' in part:
            if solution_idx < len(chapter_solutions):
                # Inject solution immediately after
                new_content += generate_solution_html(chapter_solutions[solution_idx])
                solution_idx += 1
    
    # Inject CSS/JS before body close if not present
    if "function toggleSolution" not in new_content:
        new_content = new_content.replace('</body>', css_js_content + '\n</body>')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Updated {filename} with {solution_idx} solutions.")

# Run for all chapters
chapter_files = {
    'ch02': 'ch02-architecture.html',
    'ch03': 'ch03-registres.html',
    'ch04': 'ch04-instructions-base.html',
    'ch05': 'ch05-adressage.html',
    'ch06': 'ch06-controle.html'
}

for key, filename in chapter_files.items():
    process_file(key, filename)

print("Done! All chapters updated.")
