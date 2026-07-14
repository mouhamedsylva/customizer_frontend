# Images des drapeaux — convention de nommage

> Liste des fichiers image à fournir pour que chaque **couleur** de drapeau
> s'affiche avec sa vraie image (au lieu d'une teinte CSS).
>
> Les fichiers vont dans **`customizer_frontend/assets/`**.

---

## 1. La convention

```
flag-{anneaux}-{couleur}-{face}-{orientation}.png
```

| Segment | Valeurs | Exemple |
|---|---|---|
| `{anneaux}` | `2an` · `4an` | `2an` |
| `{couleur}` | slug (voir §2) | `rouge` |
| `{face}` | `recto` · `verso` | `recto` |
| `{orientation}` | `paysage` · `portrait` | `paysage` |

**Exemple complet :** `flag-2an-rouge-recto-paysage.png`

### Contraintes techniques

- **Format :** PNG avec **fond transparent** (le drapeau seul, sans arrière-plan).
- **Le mât et les anneaux** doivent être visibles sur l'image (comme les images actuelles).
- **Dimensions cohérentes** entre toutes les images d'une même orientation
  (ex. toutes les paysage au même format, ex. 1200 × 800).
- Le drapeau doit occuper **la même zone** d'une image à l'autre : le design du
  client est positionné en pourcentage, donc un décalage entre deux images
  décalerait le logo.

---

## 2. Les 16 couleurs

| # | Nom affiché | Slug (dans le nom de fichier) | Hex |
|---|---|---|---|
| 1 | Blanc | `blanc` | `#ffffff` |
| 2 | Noir | `noir` | `#1a1a1a` |
| 3 | Blanc cassé | `blanc-casse` | `#f5f2ed` |
| 4 | Gris | `gris` | `#9e9e9e` |
| 5 | Gris foncé | `gris-fonce` | `#555555` |
| 6 | Gris ardoise | `gris-ardoise` | `#607d8b` |
| 7 | Bleu marine | `bleu-marine` | `#1e3a5f` |
| 8 | Bleu ciel | `bleu-ciel` | `#5bb8e8` |
| 9 | Vert foncé | `vert-fonce` | `#2e6b45` |
| 10 | Rose clair | `rose-clair` | `#f0c8d8` |
| 11 | Rose | `rose` | `#e8729a` |
| 12 | Rouge | `rouge` | `#c0392b` |
| 13 | Orange | `orange` | `#e8842a` |
| 14 | Jaune | `jaune` | `#f5c842` |
| 15 | Violet | `violet` | `#9b6bb5` |
| 16 | Marron | `marron` | `#7d4e2d` |

---

## 3. Les 8 variantes par couleur

Pour **chaque** couleur, il faut ces 8 fichiers :

| Anneaux | Face | Orientation | Nom (exemple : rouge) |
|---|---|---|---|
| 2 | recto | paysage | `flag-2an-rouge-recto-paysage.png` |
| 2 | verso | paysage | `flag-2an-rouge-verso-paysage.png` |
| 2 | recto | portrait | `flag-2an-rouge-recto-portrait.png` |
| 2 | verso | portrait | `flag-2an-rouge-verso-portrait.png` |
| 4 | recto | paysage | `flag-4an-rouge-recto-paysage.png` |
| 4 | verso | paysage | `flag-4an-rouge-verso-paysage.png` |
| 4 | recto | portrait | `flag-4an-rouge-recto-portrait.png` |
| 4 | verso | portrait | `flag-4an-rouge-verso-portrait.png` |

**Total : 16 couleurs × 8 = 128 images.**

---

## 4. Liste complète des 128 fichiers

### Blanc
```
flag-2an-blanc-recto-paysage.png
flag-2an-blanc-verso-paysage.png
flag-2an-blanc-recto-portrait.png
flag-2an-blanc-verso-portrait.png
flag-4an-blanc-recto-paysage.png
flag-4an-blanc-verso-paysage.png
flag-4an-blanc-recto-portrait.png
flag-4an-blanc-verso-portrait.png
```

### Noir
```
flag-2an-noir-recto-paysage.png
flag-2an-noir-verso-paysage.png
flag-2an-noir-recto-portrait.png
flag-2an-noir-verso-portrait.png
flag-4an-noir-recto-paysage.png
flag-4an-noir-verso-paysage.png
flag-4an-noir-recto-portrait.png
flag-4an-noir-verso-portrait.png
```

### Blanc cassé
```
flag-2an-blanc-casse-recto-paysage.png
flag-2an-blanc-casse-verso-paysage.png
flag-2an-blanc-casse-recto-portrait.png
flag-2an-blanc-casse-verso-portrait.png
flag-4an-blanc-casse-recto-paysage.png
flag-4an-blanc-casse-verso-paysage.png
flag-4an-blanc-casse-recto-portrait.png
flag-4an-blanc-casse-verso-portrait.png
```

### Gris
```
flag-2an-gris-recto-paysage.png
flag-2an-gris-verso-paysage.png
flag-2an-gris-recto-portrait.png
flag-2an-gris-verso-portrait.png
flag-4an-gris-recto-paysage.png
flag-4an-gris-verso-paysage.png
flag-4an-gris-recto-portrait.png
flag-4an-gris-verso-portrait.png
```

### Gris foncé
```
flag-2an-gris-fonce-recto-paysage.png
flag-2an-gris-fonce-verso-paysage.png
flag-2an-gris-fonce-recto-portrait.png
flag-2an-gris-fonce-verso-portrait.png
flag-4an-gris-fonce-recto-paysage.png
flag-4an-gris-fonce-verso-paysage.png
flag-4an-gris-fonce-recto-portrait.png
flag-4an-gris-fonce-verso-portrait.png
```

### Gris ardoise
```
flag-2an-gris-ardoise-recto-paysage.png
flag-2an-gris-ardoise-verso-paysage.png
flag-2an-gris-ardoise-recto-portrait.png
flag-2an-gris-ardoise-verso-portrait.png
flag-4an-gris-ardoise-recto-paysage.png
flag-4an-gris-ardoise-verso-paysage.png
flag-4an-gris-ardoise-recto-portrait.png
flag-4an-gris-ardoise-verso-portrait.png
```

### Bleu marine
```
flag-2an-bleu-marine-recto-paysage.png
flag-2an-bleu-marine-verso-paysage.png
flag-2an-bleu-marine-recto-portrait.png
flag-2an-bleu-marine-verso-portrait.png
flag-4an-bleu-marine-recto-paysage.png
flag-4an-bleu-marine-verso-paysage.png
flag-4an-bleu-marine-recto-portrait.png
flag-4an-bleu-marine-verso-portrait.png
```

### Bleu ciel
```
flag-2an-bleu-ciel-recto-paysage.png
flag-2an-bleu-ciel-verso-paysage.png
flag-2an-bleu-ciel-recto-portrait.png
flag-2an-bleu-ciel-verso-portrait.png
flag-4an-bleu-ciel-recto-paysage.png
flag-4an-bleu-ciel-verso-paysage.png
flag-4an-bleu-ciel-recto-portrait.png
flag-4an-bleu-ciel-verso-portrait.png
```

### Vert foncé
```
flag-2an-vert-fonce-recto-paysage.png
flag-2an-vert-fonce-verso-paysage.png
flag-2an-vert-fonce-recto-portrait.png
flag-2an-vert-fonce-verso-portrait.png
flag-4an-vert-fonce-recto-paysage.png
flag-4an-vert-fonce-verso-paysage.png
flag-4an-vert-fonce-recto-portrait.png
flag-4an-vert-fonce-verso-portrait.png
```

### Rose clair
```
flag-2an-rose-clair-recto-paysage.png
flag-2an-rose-clair-verso-paysage.png
flag-2an-rose-clair-recto-portrait.png
flag-2an-rose-clair-verso-portrait.png
flag-4an-rose-clair-recto-paysage.png
flag-4an-rose-clair-verso-paysage.png
flag-4an-rose-clair-recto-portrait.png
flag-4an-rose-clair-verso-portrait.png
```

### Rose
```
flag-2an-rose-recto-paysage.png
flag-2an-rose-verso-paysage.png
flag-2an-rose-recto-portrait.png
flag-2an-rose-verso-portrait.png
flag-4an-rose-recto-paysage.png
flag-4an-rose-verso-paysage.png
flag-4an-rose-recto-portrait.png
flag-4an-rose-verso-portrait.png
```

### Rouge
```
flag-2an-rouge-recto-paysage.png
flag-2an-rouge-verso-paysage.png
flag-2an-rouge-recto-portrait.png
flag-2an-rouge-verso-portrait.png
flag-4an-rouge-recto-paysage.png
flag-4an-rouge-verso-paysage.png
flag-4an-rouge-recto-portrait.png
flag-4an-rouge-verso-portrait.png
```

### Orange
```
flag-2an-orange-recto-paysage.png
flag-2an-orange-verso-paysage.png
flag-2an-orange-recto-portrait.png
flag-2an-orange-verso-portrait.png
flag-4an-orange-recto-paysage.png
flag-4an-orange-verso-paysage.png
flag-4an-orange-recto-portrait.png
flag-4an-orange-verso-portrait.png
```

### Jaune
```
flag-2an-jaune-recto-paysage.png
flag-2an-jaune-verso-paysage.png
flag-2an-jaune-recto-portrait.png
flag-2an-jaune-verso-portrait.png
flag-4an-jaune-recto-paysage.png
flag-4an-jaune-verso-paysage.png
flag-4an-jaune-recto-portrait.png
flag-4an-jaune-verso-portrait.png
```

### Violet
```
flag-2an-violet-recto-paysage.png
flag-2an-violet-verso-paysage.png
flag-2an-violet-recto-portrait.png
flag-2an-violet-verso-portrait.png
flag-4an-violet-recto-paysage.png
flag-4an-violet-verso-paysage.png
flag-4an-violet-recto-portrait.png
flag-4an-violet-verso-portrait.png
```

### Marron
```
flag-2an-marron-recto-paysage.png
flag-2an-marron-verso-paysage.png
flag-2an-marron-recto-portrait.png
flag-2an-marron-verso-portrait.png
flag-4an-marron-recto-paysage.png
flag-4an-marron-verso-paysage.png
flag-4an-marron-recto-portrait.png
flag-4an-marron-verso-portrait.png
```

---

## 5. Comportement si une image manque

Le configurateur cherche l'image de la couleur choisie. **Si elle n'existe pas,
il affiche le drapeau blanc** (image générique actuelle) — sans planter.

Vous pouvez donc **livrer les images progressivement** : chaque couleur devient
active dès que ses 8 fichiers sont en place.

---

## 6. Images actuelles (à conserver)

Ces fichiers servent de **repli** quand une couleur n'a pas encore ses images :

```
flag-recto.png              flag-verso.png
flag-4an-recto.png          flag-4an-verso.png
flag-recto-portrait.png     flag-verso-portrait.png
flag-4an-recto-portrait.png flag-4an-verso-portrait.png
```

---

## 7. Récapitulatif

| | |
|---|---|
| Couleurs | **16** |
| Variantes par couleur | **8** (2an/4an × recto/verso × paysage/portrait) |
| **Total à fournir** | **128 images** |
| Emplacement | `customizer_frontend/assets/` |
| Format | PNG, fond transparent |
| Repli si absente | Drapeau blanc générique |
