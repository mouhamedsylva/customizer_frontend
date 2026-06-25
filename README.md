# Configurateur Frontend - Shopify Theme

Frontend Shopify pour le configurateur de produits personnalisés (textile, drapeaux, patches, coins).

## 📁 Structure

```
customizer_frontend/
├── assets/                          # Fichiers JS et CSS
│   ├── configurateur.css           # Styles principaux
│   ├── configurateur.js            # Logique principale
│   ├── conf-sidebar.css            # Styles sidebar
│   ├── conf-recap.css              # Styles récapitulatif
│   ├── conf-canvas.css             # Styles canvas
│   ├── conf-recap.js               # Gestion récapitulatif
│   ├── visa.svg                    # Logo Visa
│   ├── mastercard.svg              # Logo Mastercard
│   ├── paypal.svg                  # Logo PayPal
│   ├── applepay.svg                # Logo Apple Pay
│   └── products/                    # Modules par produit
│       ├── textile.js              # Configuration textile
│       ├── drapeaux.js             # Configuration drapeaux
│       ├── patches.js              # Configuration patches
│       └── coins.js                # Configuration coins
├── sections/                        # Sections Shopify
│   └── configurateur.liquid        # Section principale
├── snippets/                        # Snippets réutilisables
│   ├── conf-recap.liquid           # Récapitulatif
│   ├── conf-color-picker.liquid    # Sélecteur couleur
│   ├── conf-size-selector.liquid   # Sélecteur taille
│   ├── conf-upload-zone.liquid     # Zone upload
│   └── conf-stepper.liquid         # Étapes
└── templates/                       # Templates de page
    └── page.configurateur.liquid   # Template page
```

⚠️ **Note importante sur les assets:**
Dans Shopify, tous les fichiers dans `assets/` doivent être au même niveau (pas de sous-dossiers). 
Les fichiers JavaScript des produits doivent donc être nommés :
- `products-textile.js`
- `products-drapeaux.js`
- `products-patches.js`
- `products-coins.js`

Ou uploadés directement sans préfixe si votre theme le permet.

## 🚀 Installation

### 1. Créer une page dans Shopify

1. Aller dans **Pages** > **Ajouter une page**
2. Titre : `Configurateur`
3. Template : Sélectionner `page.configurateur`
4. Publier la page

### 2. Configurer l'API

Dans la section configurateur, ajouter les paramètres :

```liquid
{% schema %}
{
  "settings": [
    {
      "type": "text",
      "id": "api_endpoint",
      "label": "API Endpoint",
      "default": "http://localhost:3000/api"
    }
  ]
}
{% endschema %}
```

### 3. Inclure les assets

Dans votre `theme.liquid`, ajouter :

```liquid
<!-- CSS -->
{{ 'configurateur.css' | asset_url | stylesheet_tag }}
{{ 'conf-sidebar.css' | asset_url | stylesheet_tag }}
{{ 'conf-recap.css' | asset_url | stylesheet_tag }}

<!-- JavaScript -->
<script src="{{ 'configurateur.js' | asset_url }}" defer></script>

<!-- Variable globale API -->
<script>
  window.CONF_API_ENDPOINT = "{{ section.settings.api_endpoint }}";
</script>
```

## 🧩 Snippets Liquid réutilisables

### 1. Color Picker (`conf-color-picker.liquid`)
Sélecteur de couleurs avec grille de couleurs prédéfinies.

**Usage:**
```liquid
{% render 'conf-color-picker', 
  colors: colors_array, 
  selected: '#000000',
  label: 'Choisissez une couleur' 
%}
```

**Événements JavaScript:**
- `colorChange` - Déclenché quand une couleur est sélectionnée
  - `detail.color` - Code hexadécimal (#000000)
  - `detail.colorName` - Nom de la couleur

### 2. Size Selector (`conf-size-selector.liquid`)
Sélecteur de tailles avec guide des mesures intégré.

**Usage:**
```liquid
{% render 'conf-size-selector', 
  sizes: sizes_array, 
  selected: 'M',
  label: 'Choisissez une taille',
  show_guide: true 
%}
```

**Fonctionnalités:**
- Grille de tailles (XS à XXXL par défaut)
- Modal avec guide des mesures détaillé
- Support des tailles indisponibles
- Navigation responsive

**Événements JavaScript:**
- `sizeChange` - Déclenché quand une taille est sélectionnée
  - `detail.size` - Taille sélectionnée (ex: 'M')

### 3. Upload Zone (`conf-upload-zone.liquid`)
Zone d'upload avec drag & drop et prévisualisation d'image.

**Usage:**
```liquid
{% render 'conf-upload-zone', 
  id: 'front',
  label: 'Logo cœur',
  accept: 'image/*',
  max_size: '5MB',
  formats: 'PNG, JPG, SVG',
  description: 'Zone de personnalisation',
  show_preview: true 
%}
```

**Fonctionnalités:**
- Drag & drop de fichiers
- Prévisualisation d'image automatique
- Barre de progression d'upload
- Validation de taille et format de fichier
- Boutons éditer/supprimer
- Messages d'erreur intégrés

**Événements JavaScript:**
- `fileUploaded` - Déclenché après upload réussi
  - `detail.file` - Objet File JavaScript
  - `detail.dataUrl` - URL de données base64
- `fileRemoved` - Déclenché après suppression
  - `detail.zoneId` - ID de la zone d'upload

### 4. Stepper (`conf-stepper.liquid`)
Indicateur de progression par étapes avec navigation.

**Usage:**
```liquid
{% render 'conf-stepper', 
  current_step: 1,
  steps: steps_array 
%}
```

**Exemple avec étapes personnalisées:**
```liquid
{% assign custom_steps = 'Personnalisation,Récapitulatif,Commande' | split: ',' %}
{% render 'conf-stepper', current_step: 2, steps: custom_steps %}
```

**Fonctionnalités:**
- Navigation entre étapes (précédent/suivant)
- Étapes complétées avec checkmark animé
- Navigation par clic sur les étapes
- Mode horizontal (défaut) ou vertical
- Boutons de navigation optionnels

**Événements JavaScript:**
- `stepChange` - Déclenché au changement d'étape
  - `detail.step` - Numéro de l'étape actuelle
  - `detail.totalSteps` - Nombre total d'étapes
- `stepperComplete` - Déclenché à la dernière étape

### 5. Recap (`conf-recap.liquid`)
Panneau récapitulatif avec prix, quantité et actions.

**Inclus automatiquement** dans `sections/configurateur.liquid`.

**Fonctionnalités:**
- Aperçu miniature du produit
- Détails de personnalisation
- Sélecteur de quantité avec min/max
- Calcul prix unitaire et total
- Remises automatiques par palier
- Prix HT et TTC
- Boutons "Ajouter au panier" et "Sauvegarder"
- Informations de réassurance (paiement, livraison, etc.)
- Logos méthodes de paiement

## 🎨 Fonctionnalités

### Sélecteur de produit dynamique

Le configurateur affiche un sélecteur en haut à gauche permettant de changer de type de produit :

- **Sweatshirt** (textile)
- **T-shirt** (textile)
- **T-shirt polyester** (textile)
- **Extra** (drapeaux)
- **Drapeaux**
- **Patches**

Chaque sélection charge dynamiquement :
- Les options de personnalisation dans la sidebar
- Le canvas de visualisation
- Les calculs de prix

### Page unique dynamique

Une seule page qui change de contenu selon le produit sélectionné, exactement comme dans les maquettes fournies.

### Options par produit

#### Textile
- Type de produit (Sweatshirt, T-shirt, Polo)
- Couleur (14 couleurs)
- Taille (XS à XXL)
- Logo cœur
- Logo dos
- Personnalisation manches

#### Drapeaux
- Type d'impression (Recto/verso ou simple)
- Orientation (Paysage/Portrait)
- Taille (Standard ou personnalisé)
- Upload designs recto/verso
- Finition (Œillets, fourreau)
- Matière (Polyester 110g/115g)

#### Patches
- Upload logo
- Forme (Rond, Carré, Rectangle, Blason)
- Taille (7cm à 10cm)
- Type de fabrication (Sublimé, PVC, Tissé)

#### Coins
- Type (Recto/verso, Simple, Numéroté)
- Forme (Rond, Découpe)
- Diamètre (25mm à 50mm)
- Finition métallique (Or, Argent, Bronze, Cuivre)
- Surface (Relief 3D, Imprimé)
- Upload logos recto/verso

### Canvas de visualisation

- 3 vues : Aperçu 3D, 2D, Vue réelle
- Zoom in/out
- Rotation
- Preview en temps réel

### Récapitulatif dynamique

- Aperçu miniature
- Liste des personnalisations
- Sélecteur de quantité
- Prix unitaire
- Remises automatiques
- Total HT/TTC
- Bouton "Ajouter au panier"
- Bouton "Sauvegarder le design"

### Intégration API

Toutes les actions communiquent avec le backend Node.js :

```javascript
// Upload
POST /api/upload/logo

// Calcul prix
POST /api/pricing/calculate

// Sauvegarde design
POST /api/designs

// Devis
POST /api/export/quote
```

## 🎯 Utilisation

### Changer de produit

```javascript
// Automatique via les boutons
document.querySelector('[data-product-type="drapeaux"]').click();

// Programmatique
window.configurateur.changeProductType('patches');
```

### Mettre à jour une option

```javascript
window.configurateur.updateOption('color', '#000000');
window.configurateur.updateOption('size', 'L');
```

### Upload un fichier

```javascript
// Géré automatiquement via input file
// Ou programmatique :
const file = document.querySelector('input[type="file"]').files[0];
window.configurateur.handleUpload(file, 'front');
```

### Récupérer le design actuel

```javascript
const design = window.configurateur.currentDesign;
console.log(design);
// {
//   productType: 'textile',
//   options: { color: '#000000', size: 'M', ... },
//   logos: [...],
//   quantity: 50
// }
```

## 🎨 Personnalisation CSS

### Variables CSS

```css
:root {
  --conf-primary: #1a1a1a;
  --conf-secondary: #2c5aa0;
  --conf-accent: #f97316;
  --conf-text: #333;
  --conf-border: #e5e5e5;
  --conf-bg: #ffffff;
  --conf-radius: 8px;
}
```

### Classes utilitaires

- `.conf-hidden` - Masquer un élément
- `.conf-loading` - État de chargement
- `.conf-error` - État d'erreur
- `.conf-success` - État de succès

## 📱 Responsive

Le configurateur est entièrement responsive :

- **Desktop** (>1200px) : Layout 3 colonnes (sidebar + canvas + recap)
- **Tablet** (768px - 1200px) : Layout 2 colonnes
- **Mobile** (<768px) : Layout 1 colonne avec sections empilées

## 🔧 Configuration avancée

### Changer l'URL de l'API

Dans Shopify Admin > Theme > Customize > Section Configurateur :
```
API Endpoint: https://your-api.com/api
```

### Ajouter un nouveau type de produit

1. Créer le fichier module : `assets/products/nouveau-produit.js`
2. Exporter la fonction `generateSidebar()` et le `config`
3. Ajouter le bouton dans `configurateur.liquid`
4. Mettre à jour le backend avec le nouveau type

## 🐛 Debug

### Activer les logs

```javascript
// Dans la console navigateur
localStorage.setItem('conf_debug', 'true');
location.reload();
```

### Vérifier l'état

```javascript
console.log(window.configurateur.currentDesign);
console.log(window.configurateur.pricing);
```

## 📞 Support

Pour toute question sur l'intégration frontend :
- Consulter les exemples dans chaque fichier produit
- Vérifier la console navigateur pour les erreurs
- S'assurer que l'API backend est accessible

---

**Version :** 1.0.0  
**Dernière mise à jour :** 23 juin 2026
