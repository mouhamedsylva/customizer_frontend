# Palette couleurs textiles — Custom Textile

40 couleurs actives pour les produits textiles (Sweatshirt, T-shirt coton, T-shirt polyester).

## Table des couleurs

| # | Nom affiché | Slug (fichier) | Hex |
|---|-------------|----------------|-----|
| 1 | Apricot | `apricot` | `#f5a623` |
| 2 | Ash | `ash` | `#eff1f0` |
| 3 | Atoll | `atoll` | `#3bb9e0` |
| 4 | Black | `black` | `#0a0a0a` |
| 5 | Bottle Green | `bottle-green` | `#143f2e` |
| 6 | Brown | `brown` | `#3a3130` |
| 7 | Burgundy | `burgundy` | `#3d1f35` |
| 8 | Chocolate | `chocolate` | `#4a3830` |
| 9 | Cobalt Blue | `cobalt-blue` | `#1e32e6` |
| 10 | Dark Grey | `dark-grey` | `#2e3944` |
| 11 | Diva Blue | `diva-blue` | `#1e6b78` |
| 12 | Fire Red | `fire-red` | `#e01e1e` |
| 13 | Gold | `gold` | `#f5c518` |
| 14 | Kelly Green | `kelly-green` | `#2fa84f` |
| 15 | Millennial Lilac | `millennial-lilac` | `#6e7bd8` |
| 16 | Millennial Mint | `millennial-mint` | `#9ee5c4` |
| 17 | Natural | `natural` | `#e8e2d0` |
| 18 | Navy | `navy` | `#1a2438` |
| 19 | Navy Blue | `navy-blue` | `#1b2a5b` |
| 20 | Orange | `orange` | `#f0500a` |
| 21 | Orchid Green | `orchid-green` | `#7de01e` |
| 22 | Orchid Pink | `orchid-pink` | `#f5c8dc` |
| 23 | Pacific Grey | `pacific-grey` | `#8a8d91` |
| 24 | Pixel Lime | `pixel-lime` | `#a8e020` |
| 25 | Radiant Purple | `radiant-purple` | `#3a1e9e` |
| 26 | Red | `red` | `#a81e32` |
| 27 | Royal Blue | `royal-blue` | `#1e4be0` |
| 28 | Sand | `sand` | `#c4b49a` |
| 29 | Sky | `sky` | `#9ed8f0` |
| 30 | Solar Yellow | `solar-yellow` | `#f5e518` |
| 31 | Sorbet | `sorbet` | `#b01e78` |
| 32 | Sport Grey | `sport-grey` | `#8a9499` |
| 33 | Stone Blue | `stone-blue` | `#3e6b85` |
| 34 | Sunset Orange | `sunset-orange` | `#f5455e` |
| 35 | Swimming Pool | `swimming-pool` | `#5ed0c4` |
| 36 | Urban Khaki | `urban-khaki` | `#3a4130` |
| 37 | Urban Orange | `urban-orange` | `#c43418` |
| 38 | Urban Purple | `urban-purple` | `#1e1e6e` |
| 39 | Used Black | `used-black` | `#2e3438` |
| 40 | White | `white` | `#ffffff` |

> Les hex sont approximés depuis la palette fournie. Ajuste-les si besoin (dans
> `sections/configurateur.liquid` : bloc `.cg` + `COLOR_SLUGS`).

## Images produit à fournir

Pour que la couleur choisie s'affiche (canvas, vignette, checkout), chaque produit
a besoin d'une image **par couleur** et **par vue** (`face`, `dos`, `cote`).

Format du nom de fichier :

```
{produit}-{slug}-{vue}.png
```

Produits (`{produit}`) :
- `sweatshirt`
- `tshirt`
- `tshirt-polyester`

Vues (`{vue}`) : `face`, `dos`, `cote`

### Exemples

```
sweatshirt-apricot-face.png
sweatshirt-apricot-dos.png
sweatshirt-apricot-cote.png
tshirt-black-face.png
tshirt-polyester-navy-blue-face.png
...
```

### Volume total

- 40 couleurs × 3 vues = **120 images par produit**
- 3 produits × 120 = **360 images au total** pour couvrir toutes les couleurs.

> Repli automatique : si une image `{produit}-{slug}-{vue}.png` est absente,
> le configurateur utilise l'image générique du produit (`{produit}-{vue}.png`).
> Tu peux donc fournir les images progressivement.

## Où sont utilisés ces noms/slugs dans le code

- **`sections/configurateur.liquid`**
  - Grille de pastilles `.cg` (les 40 `.cs` avec `title` = nom + `onclick=selColor`).
  - `COLOR_SLUGS` (nom affiché → slug de fichier).
  - `PRODUCT_IMAGE_URLS` (liste `tx_colors` en Liquid).
- **`sections/recapitulatif.liquid`**
  - `CONF_COLOR_VARIANTS` (nom → variant Shopify) — **à recréer** (voir ci-dessous).

## ⚠️ Variants Shopify (à recréer)

Les anciens 15 variants couleur (par produit) doivent être **remplacés** par ces 40.
Utilise les scripts backend :

```bash
# 1. Créer l'option Couleur + 40 variants + images (par produit)
node --env-file=.env scripts/create-color-variants.mjs --apply --only=sweatshirt

# 2. (Ré)assigner les bonnes images couleur aux variants
node --env-file=.env scripts/reassign-variant-images.mjs --apply --only=sweatshirt
```

> Avant de lancer : mettre à jour la liste des couleurs (nom → slug) dans
> `customizer-backend/scripts/create-color-variants.mjs` (constante `COLORS`).
> Puis récupérer les nouveaux mappings couleur→variant et les injecter dans
> `CONF_COLOR_VARIANTS` (recapitulatif.liquid).
