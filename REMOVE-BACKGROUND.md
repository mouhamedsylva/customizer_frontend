# Suppression d'arrière-plan (Remove Background)

Fonctionnalité qui, **à chaque upload d'image**, propose au client de rendre le
fond de son image transparent — automatiquement, gratuitement, et de façon
réversible.

---

## 1. Vue d'ensemble

| Aspect | Choix |
|---|---|
| **Méthode** | Côté client (dans le navigateur), IA locale |
| **Moteur** | [`@imgly/background-removal`](https://www.npmjs.com/package/@imgly/background-removal) |
| **Coût** | Gratuit (aucune API payante, aucune donnée envoyée à un tiers) |
| **Portée** | Tous les produits : Textiles, Patchs, Coins, Drapeaux |
| **Déclenchement** | À chaque upload d'image |
| **Réversible** | Oui — bouton « Remettre le fond » |

Le traitement se fait **entièrement dans le navigateur du client**. L'image
n'est envoyée à aucun serveur pour le détourage. Un modèle d'IA (~10 Mo) est
téléchargé **une seule fois** depuis un CDN, puis mis en cache par le navigateur.

---

## 2. Parcours utilisateur (UX)

```
Upload d'une image
        │
        ▼
┌─────────────────────────────────────────┐
│  Écran 1 — Question                      │
│  Aperçu de l'image                       │
│  « Supprimer l'arrière-plan ? »          │
│  [Non, garder le fond] [Oui, enlever]    │
└─────────────────────────────────────────┘
   │                          │
  Non                        Oui
   │                          ▼
   │              ┌───────────────────────────┐
   │              │  Écran 2 — Traitement      │
   │              │  🔄 Spinner                │
   │              │  « Traitement en cours… »  │
   │              │  Chargement du modèle… %   │
   │              └───────────────────────────┘
   │                          │
   │                          ▼
   │              ┌───────────────────────────┐
   │              │  Écran 3 — Résultat        │
   │              │  Aperçu détouré (damier)   │
   │              │  [Remettre le fond] [Garder]│
   │              └───────────────────────────┘
   │                    │              │
   │              Remettre le fond   Garder
   │                    │              │
   ▼                    ▼              ▼
 Image             Image           Image
 originale         originale       détourée (PNG transparent)
        \             |             /
         ▼            ▼            ▼
     Le src final est appliqué au produit + persisté + uploadé Cloudinary
```

En cas d'erreur (CDN inaccessible, image non traitable…), un écran d'erreur
s'affiche et **l'image d'origine est utilisée telle quelle** — l'upload n'est
jamais bloqué.

---

## 3. Fichiers concernés

### `assets/conf-bg-removal.js` (nouveau — le module)

Expose une seule API publique :

```js
window.ConfBgRemoval.ask(dataUrl)  // -> Promise<string>
```

- Reçoit le `dataUrl` de l'image uploadée.
- Affiche la modale (question → spinner → résultat).
- **Résout avec le `src` final** :
  - image **originale** si le client répond « Non » ou « Remettre le fond » ;
  - **PNG transparent** (dataURL) si le client garde le détourage.

Responsabilités internes :
- `loadImgly()` — charge le module ESM à la demande (import dynamique), une
  seule fois, avec cache. Réessaie si le chargement échoue.
- `ensureStyles()` — injecte le CSS de la modale/spinner une seule fois.
- `buildModal()` — crée l'overlay + la carte.
- Cache `_lastOriginal` / `_lastCutout` — si on re-traite exactement la même
  image, on réaffiche le résultat sans relancer l'IA.

### `sections/configurateur.liquid` (branchement)

Le point d'entrée **unique** de tous les uploads est la fonction
`doUpload(e, zone)`. C'est le seul endroit modifié pour brancher le détourage.

```js
reader.onload = ev => {
  const original = ev.target.result;

  // Pose la question (ou passe tout droit si le module est absent).
  const decide = (window.ConfBgRemoval && window.ConfBgRemoval.ask)
    ? window.ConfBgRemoval.ask(original)
    : Promise.resolve(original);

  decide.then(function (src) {
    saveUpload(zone, src);   // persistance (sessionStorage)
    applyUpload(zone, src);  // affichage dans le canvas

    // Upload backend de l'image RÉELLEMENT retenue.
    if (window.ConfAPI) {
      const uploadFile = (src === original)
        ? file                              // inchangée
        : dataUrlToFile(src, file.name);    // détourée -> File PNG
      window.ConfAPI.uploadLogo(uploadFile).then(/* … */);
    }
  });
};
```

Helper ajouté : `dataUrlToFile(dataUrl, name)` — convertit le dataURL détouré
en objet `File` (`.png`) pour l'upload Cloudinary.

Chargement du script dans le `<head>` :

```liquid
<script src="{{ 'conf-bg-removal.js' | asset_url }}" defer></script>
```

### Pourquoi un seul point de branchement ?

Tous les inputs `type="file"` du configurateur appellent `doUpload(event, zone)` :

| Produit | Zones (`zone`) |
|---|---|
| Textiles | `f` (cœur), `b` (dos), `sl` / `sr` (manches) |
| Patchs | `c` |
| Coins | `coin-recto`, `coin-verso` |
| Drapeaux | `flag-recto`, `flag-verso` |

Modifier `doUpload` couvre donc **automatiquement tous les produits**.

> Note : `restoreUploads()` (restauration après un rechargement de page)
> appelle `applyUpload` **directement**, sans repasser par `doUpload`. La
> question n'est donc **pas** reposée au rechargement — c'est voulu.

---

## 4. Le moteur : `@imgly/background-removal`

- Chargé dynamiquement en ESM depuis **esm.sh** (qui transforme le paquet npm
  en module 100 % navigateur — résout les dépendances Node et supprime les
  `require`, sinon on obtient l'erreur « require is not defined ») :
  ```
  https://esm.sh/@imgly/background-removal@1.6.0?bundle
  ```
- Télécharge un modèle de segmentation (~10 Mo) au **premier** détourage,
  ensuite servi depuis le cache du navigateur.
- Fonction utilisée : `removeBackground(dataUrl, { progress })` → renvoie un
  `Blob` PNG transparent (converti ensuite en dataURL).
- Le callback `progress(key, current, total)` alimente le pourcentage affiché
  pendant le chargement du modèle.

### Prérequis réseau

Le CDN esm.sh doit être joignable. Le thème Shopify n'impose **aucune**
Content-Security-Policy restrictive, donc l'import fonctionne. Si un
pare-feu/extension bloque le CDN, le module bascule proprement sur l'image
d'origine (écran d'erreur, upload non bloqué).

---

## 5. Persistance & réversibilité

- **Réversibilité immédiate** : dans la modale de résultat, « Remettre le fond »
  renvoie l'image d'origine ; « Garder » renvoie la version transparente.
- **Après application** : le `src` retenu est stocké dans `sessionStorage`
  (`conf_uploads`) comme n'importe quelle image. Si le client veut re-changer,
  il ré-uploade — la question est reposée.
- **Cache intra-session** : re-détourer la même image ne relance pas l'IA
  (`_lastCutout`).

---

## 6. Points de personnalisation

| Élément | Où |
|---|---|
| Textes de la modale | `conf-bg-removal.js` → `renderQuestion` / `renderResult` / `renderError` |
| Style (couleurs, tailles, spinner) | `conf-bg-removal.js` → `ensureStyles()` (CSS inline) |
| Version du moteur | `conf-bg-removal.js` → constante `IMGLY_ESM` |
| Activer/désactiver globalement | Retirer/commenter le `<script>` dans `configurateur.liquid` — `doUpload` retombe alors sur l'image d'origine sans poser de question |

---

## 7. Évolutions possibles

Si un jour la qualité client ne suffit pas (photos complexes, cheveux, etc.),
on peut remplacer le **moteur** sans toucher à l'UX (la modale et le flux
restent identiques) :

- **Cloudinary Background Removal** (add-on payant) — via le backend existant.
- **remove.bg** (API tierce, payante au crédit) — meilleure qualité du marché.

Il suffirait de remplacer l'appel `removeBackground(...)` par un appel backend
qui renvoie l'URL/dataURL détourée.
