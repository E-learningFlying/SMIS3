# Solutions des Exercices - Cours Assembleur 8086 (emu8086)

Ce document contient les solutions complètes et commentées de tous les exercices du cours.

---

## Chapitre 1 : Introduction et emu8086

### Exercice 1 : Installation (Conceptuel)
**Objectif** : Installer emu8086 et tester l'environnement.

**Solution** :
1. Télécharger emu8086 depuis le site officiel
2. Installer avec les paramètres par défaut
3. Lancer emu8086
4. Créer un nouveau fichier (`.asm`)
5. Taper et exécuter le Hello World fourni dans le chapitre

---

### Exercice 2 : Premier programme
**Objectif** : Afficher "Bonjour" à l'écran.

**Solution** :
```asm
.MODEL SMALL
.STACK 100h

.DATA
    msg DB 'Bonjour$'

.CODE
MAIN PROC
    ; Initialiser segment de données
    MOV AX, @DATA
    MOV DS, AX
    
    ; Afficher le message
    LEA DX, msg
    MOV AH, 09h
    INT 21h
    
    ; Terminer le programme
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN
```

**Explication** :
- `.MODEL SMALL` : Modèle de mémoire
- `.DATA` : Section des données avec le message terminé par `$`
- `LEA DX, msg` : Charge l'adresse du message dans DX
- `MOV AH, 09h` : Service 09h = afficher chaîne
- `INT 21h` : Appel DOS
- `MOV AH, 4Ch` puis `INT 21h` : Terminer proprement

---

### Exercice 3 : Modifier le message
**Objectif** : Afficher votre nom.

**Solution** :
```asm
.MODEL SMALL
.STACK 100h

.DATA
    nom DB 'Je m', 27h, 'appelle Jean$'  ; 27h = apostrophe
    ; Ou avec saut de ligne :
    msg1 DB 'Nom: $'
    msg2 DB 'Jean Dupont$'

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX
    
    ; Afficher le nom
    LEA DX, nom
    MOV AH, 09h
    INT 21h
    
    ; Terminer
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN
```

**Astuce** : Pour l'apostrophe, utiliser `27h` (code ASCII).

---

## Chapitre 2 : Architecture 8086

### Exercice 1 : Calcul d'adresse physique
**Objectif** : Calculer l'adresse physique pour CS=1000h, IP=0050h.

**Solution** :
```
Formule : Adresse physique = Segment × 16 + Offset
        = Segment × 10h + Offset (en hexa)

CS = 1000h, IP = 0050h

Adresse physique = 1000h × 10h + 0050h
                 = 10000h + 0050h
                 = 10050h
```

**Réponse** : `10050h` (65616 en décimal)

**Vérification dans emu8086** :
```asm
.MODEL SMALL
.CODE
MAIN PROC
    ; Observer CS et IP dans la fenêtre des registres
    ; CS:IP pointe sur l'instruction actuelle
    NOP  ; Mettre un breakpoint ici
    NOP
MAIN ENDP
END MAIN
```

---

### Exercice 2 : Observer les flags
**Objectif** : Observer CF, ZF, SF lors d'opérations.

**Solution** :
```asm
.MODEL SMALL
.CODE
MAIN PROC
    ; Test 1 : Addition avec débordement
    MOV AL, 255
    ADD AL, 1
    ; Résultat : AL = 0, CF = 1 (débordement), ZF = 1 (zéro)
    
    ; Test 2 : Soustraction négative
    MOV AL, 10
    SUB AL, 20
    ; Résultat : AL = 246 (-10 en complément), CF = 1, SF = 1 (négatif)
    
    ; Test 3 : Résultat zéro
    MOV AX, 100
    SUB AX, 100
    ; Résultat : AX = 0, ZF = 1, CF = 0, SF = 0
    
    ; Terminer
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN
```

**Observations** :
- **CF** (Carry Flag) : Mis à 1 lors d'un débordement
- **ZF** (Zero Flag) : Mis à 1 si résultat = 0
- **SF** (Sign Flag) : Mis à 1 si bit de poids fort = 1 (négatif)

---

### Exercice 3 : Segmentation
**Objectif** : Comprendre DS, CS, SS.

**Solution** :
```asm
.MODEL SMALL
.STACK 100h

.DATA
    valeur DW 1234h

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX
    
    ; Observer dans emu8086 :
    ; CS = segment du code
    ; DS = segment des données
    ; SS = segment de la pile
    
    ; Accéder à la donnée
    MOV BX, valeur    ; Utilise DS par défaut
    
    PUSH AX           ; Utilise SS
    POP CX
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN
```

**Explication** :
- **CS** : Pointe vers le segment de code
- **DS** : Pointe vers le segment de données (`.DATA`)
- **SS** : Pointe vers le segment de pile (`.STACK`)

---

## Chapitre 3 : Registres 16-bit

### Exercice 1 : Manipulation de registres
**Objectif** : Opérations arithmétiques de base.

**Solution** :
```asm
.MODEL SMALL
.STACK 100h

.DATA
    resultat DW ?

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX
    
    ; Étape 1 : AX = 100
    MOV AX, 100
    
    ; Étape 2 : BX = 50
    MOV BX, 50
    
    ; Étape 3 : CX = AX + BX
    MOV CX, AX
    ADD CX, BX          ; CX = 150
    
    ; Sauvegarder le résultat
    MOV resultat, CX
    
    ; Afficher (avec conversion en ASCII - avancé)
    ; Pour l'instant, observer CX dans emu8086
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN
```

**Résultat attendu** : CX = 150 (96h en hexadécimal)

---

### Exercice 2 : Parties haute et basse
**Objectif** : Comprendre AH et AL.

**Solution** :
```asm
.MODEL SMALL
.CODE
MAIN PROC
    ; Test 1
    MOV AX, 1234h
    ; Observer : AX = 1234h, AH = 12h, AL = 34h
    
    ; Test 2
    MOV AH, 56h
    ; Observer : AX = 5634h, AH = 56h, AL = 34h (inchangé)
    
    ; Test 3
    MOV AL, 78h
    ; Observer : AX = 5678h, AH = 56h (inchangé), AL = 78h
    
    ; Vérification
    MOV BX, AX    ; BX = 5678h
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN
```

**Notes à prendre** :
- AX initial = `1234h` → AH = `12h`, AL = `34h`
- Après MOV AH, 56h → AX = `5634h`
- Après MOV AL, 78h → AX = `5678h`

---

### Exercice 3 : Observer les flags
**Objectif** : Comprendre CF et ZF.

**Solution** :
```asm
.MODEL SMALL
.CODE
MAIN PROC
    ; Test 1 : Débordement 8-bit
    MOV AL, 255
    ADD AL, 1
    ; AL = 0, CF = 1 (débordement), ZF = 1 (résultat zéro)
    
    ; Test 2 : Résultat zéro
    MOV AX, 100
    SUB AX, 100
    ; AX = 0, ZF = 1, CF = 0, SF = 0
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN
```

**Explication** :
- **Test 1** : 255 + 1 = 256, mais AL ne peut contenir que 0-255 → débordement, AL = 0
- **Test 2** : 100 - 100 = 0, pas de débordement

---

## Chapitre 4 : Instructions de base

### Exercice 1 : Calculatrice simple
**Objectif** : Addition, soustraction.

**Solution** :
```asm
.MODEL SMALL
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
    
    ; Charger les valeurs
    MOV AX, num1    ; AX = 50
    MOV BX, num2    ; BX = 30
    
    ; Addition : CX = AX + BX
    MOV CX, AX
    ADD CX, BX      ; CX = 80
    MOV somme, CX
    
    ; Soustraction : DX = AX - BX
    MOV DX, AX
    SUB DX, BX      ; DX = 20
    MOV difference, DX
    
    ; Observer CX et DX dans emu8086
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN
```

**Résultats attendus** :
- CX (somme) = 80 (50h)
- DX (différence) = 20 (14h)

---

### Exercice 2 : Multiplication et division
**Objectif** : Tester MUL et DIV.

**Solution** :
```asm
.MODEL SMALL
.CODE
MAIN PROC
    ; Multiplication : 12 × 7
    MOV AL, 12
    MOV BL, 7
    MUL BL          ; AX = 84 (54h)
    
    ; Sauvegarder résultat
    MOV CX, AX      ; CX = 84
    
    ; Division : 84 ÷ 4
    MOV AX, CX      ; AX = 84
    MOV BL, 4
    DIV BL          ; AL = 21 (quotient), AH = 0 (reste)
    
    ; Vérification
    ; AL devrait être 21 (15h)
    ; AH devrait être 0
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN
```

**Vérification** :
- 12 × 7 = 84 ✓
- 84 ÷ 4 = 21 reste 0 ✓

---

### Exercice 3 : Opérations bit à bit
**Objectif** : Manipulations de bits.

**Solution** :
```asm
.MODEL SMALL
.CODE
MAIN PROC
    ; Étape 1 : AL = 10101100b
    MOV AL, 10101100b    ; ACh
    MOV BL, AL           ; Sauvegarder original
    
    ; Étape 2 : Mettre 4 bits bas à 0
    AND AL, 11110000b    ; AL = 10100000b (A0h)
    MOV CL, AL           ; Sauvegarder
    
    ; Étape 3 : Mettre bit 0 à 1
    OR AL, 00000001b     ; AL = 10100001b (A1h)
    MOV DL, AL           ; Sauvegarder
    
    ; Étape 4 : Inverser tous les bits
    NOT AL               ; AL = 01011110b (5Eh)
    
    ; Résultats :
    ; BL = ACh (original)
    ; CL = A0h (après AND)
    ; DL = A1h (après OR)
    ; AL = 5Eh (après NOT)
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN
```

**Résultats** :
1. Original : `10101100b`
2. AND avec `11110000b` : `10100000b`
3. OR avec `00000001b` : `10100001b`
4. NOT : `01011110b`

---

## Chapitre 5 : Modes d'adressage

### Exercice 1 : Accéder à un tableau
**Objectif** : Utiliser BX pour accès tableau.

**Solution** :
```asm
.MODEL SMALL
.STACK 100h

.DATA
    tableau DB 10, 20, 30, 40, 50

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX
    
    ; Charger adresse du tableau
    LEA BX, tableau
    
    ; Accéder au 1er élément
    MOV AL, [BX]         ; AL = 10
    
    ; Accéder au 3ème élément (index 2)
    MOV CL, [BX + 2]     ; CL = 30
    
    ; Observer AL et CL dans emu8086
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN
```

**Résultats** :
- AL = 10 (0Ah)
- CL = 30 (1Eh)

---

### Exercice 2 : Parcourir avec SI
**Objectif** : Somme d'un tableau.

**Solution** :
```asm
.MODEL SMALL
.STACK 100h

.DATA
    tableau DB 5, 10, 15, 20, 25, 30, 35, 40, 45, 50
    taille EQU 10

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX
    
    ; Initialisation
    LEA SI, tableau
    MOV CX, taille
    XOR AX, AX          ; AX = 0 (somme)
    
parcours:
    MOV BL, [SI]        ; Charger élément
    ADD AL, BL          ; Ajouter à la somme
    INC SI              ; Passer au suivant
    LOOP parcours
    
    ; AX contient la somme
    ; 5+10+15+20+25+30+35+40+45+50 = 275 (113h)
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN
```

**Résultat attendu** : AX = 275 (113h)

---

### Exercice 3 : Matrice 2D
**Objectif** : Accéder à matrice[1][2].

**Solution** :
```asm
.MODEL SMALL
.STACK 100h

.DATA
    ; Matrice 3×3
    matrice DB 1, 2, 3
            DB 4, 5, 6
            DB 7, 8, 9
    largeur EQU 3

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX
    
    ; Accès à matrice[1][2]
    ; Formule : offset = ligne × largeur + colonne
    LEA BX, matrice     ; Base de la matrice
    
    MOV AL, 1           ; Ligne
    MOV CL, largeur
    MUL CL              ; AX = 1 × 3 = 3
    ADD AL, 2           ; AX = 3 + 2 = 5 (colonne)
    
    MOV SI, AX
    MOV DL, [BX + SI]   ; DL = matrice[1][2] = 6
    
    ; Vérification : DL = 6
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN
```

**Explication** :
- Matrice[1][2] = 2ème ligne, 3ème colonne
- Offset = 1 × 3 + 2 = 5
- Élément à l'offset 5 = 6 ✓

---

## Chapitre 6 : Instructions de contrôle

### Exercice 1 : Structure if-else
**Objectif** : Comparer AX à 50.

**Solution** :
```asm
.MODEL SMALL
.STACK 100h

.DATA
    resultat DB ?

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX
    
    ; Test 1 : AX = 60
    MOV AX, 60
    CMP AX, 50
    JLE sinon          ; Si AX <= 50, aller à sinon
        ; AX > 50
        MOV BX, 1
        JMP fin
    sinon:
        ; AX <= 50
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
    ; CX = 0 (car 30 <= 50)
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN
```

**Résultats** :
- Test 1 (AX=60) : BX = 1
- Test 2 (AX=30) : CX = 0

---

### Exercice 2 : Somme 1 à 100
**Objectif** : Calculer 1 + 2 + ... + 100.

**Solution** :
```asm
.MODEL SMALL
.STACK 100h

.DATA
    somme DW ?

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX
    
    ; Méthode 1 : Boucle avec LOOP
    MOV CX, 100         ; Compteur
    XOR AX, AX          ; Somme = 0
    MOV BX, 1           ; Valeur courante
    
boucle:
    ADD AX, BX          ; Ajouter valeur courante
    INC BX              ; Passer à la suivante
    LOOP boucle
    
    ; AX = 5050 (13BAh)
    MOV somme, AX
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN
```

**Méthode alternative (formule mathématique)** :
```asm
    ; Formule : n(n+1)/2 = 100×101/2 = 5050
    MOV AX, 100
    MOV BX, 101
    MUL BX              ; DX:AX = 10100
    MOV BX, 2
    DIV BX              ; AX = 5050
```

**Résultat attendu** : 5050 (13BAh)

---

### Exercice 3 : Recherche dans tableau
**Objectif** : Trouver 42 dans un tableau.

**Solution** :
```asm
.MODEL SMALL
.STACK 100h

.DATA
    tableau DB 10, 25, 42, 18, 99, 42, 7, 33, 50, 12
    taille EQU 10
    valeur_recherche DB 42
    position DW -1      ; -1 = non trouvé

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX
    
    ; Initialisation
    LEA SI, tableau
    MOV CX, taille
    MOV AL, valeur_recherche
    XOR BX, BX          ; Index = 0
    
recherche:
    CMP AL, [SI]        ; Comparer avec élément actuel
    JE trouve           ; Si égal, trouvé !
    INC SI              ; Passer au suivant
    INC BX              ; Incrémenter index
    LOOP recherche
    
    ; Non trouvé
    MOV BX, -1
    JMP fin
    
trouve:
    ; Trouvé à la position BX
    ; (première occurrence = position 2)
    
fin:
    MOV position, BX
    
    MOV AH, 4Ch
    INT 21h
MAIN ENDP
END MAIN
```

**Résultat attendu** : BX = 2 (42 est à l'index 2)

---

## Notes générales

### Compilation et exécution dans emu8086
1. Ouvrir emu8086
2. Cliquer sur "New"
3. Copier-coller le code
4. Cliquer sur "Emulate" (ou F5)
5. Cliquer sur "Run" (ou F9) ou utiliser "Step" (F8) pour pas-à-pas
6. Observer les registres dans la fenêtre "Registers"

### Debugging
- **F8** : Exécution pas-à-pas
- **F9** : Exécution continue
- **Breakpoints** : Cliquer sur la ligne de code
- **Memory view** : Voir le contenu de la mémoire
- **Flags** : Observer CF, ZF, SF, OF en temps réel

### Astuces
- Toujours initialiser DS avec `MOV AX, @DATA` / `MOV DS, AX`
- Observer les registres à chaque étape
- Utiliser des commentaires pour suivre les valeurs
- Tester avec différentes valeurs d'entrée

---

**Bon apprentissage ! 🚀**
