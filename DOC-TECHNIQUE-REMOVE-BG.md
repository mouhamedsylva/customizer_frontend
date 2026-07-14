# Suppression d'arrière-plan — Documentation technique

> Référence d'implémentation pour réutiliser ou faire évoluer la fonctionnalité
> de détourage automatique. Public : développeurs.
>
> Version implémentée : **onnxruntime-web + RMBG-1.4**, 100 % navigateur, gratuit.
> Pour l'explication non technique destinée au client, voir `REMOVE-BACKGROUND.md`.

---

## Sommaire

1. [Architecture](#1-architecture)
2. [Le flux complet](#2-le-flux-complet)
3. [API publique du module](#3-api-publique-du-module)
4. [Le pipeline de détourage](#4-le-pipeline-de-détourage)
5. [Post-traitement du masque](#5-post-traitement-du-masque)
6. [Intégration à l'upload](#6-intégration-à-lupload)
7. [Pièges Shopify (à connaître absolument)](#7-pièges-shopify-à-connaître-absolument)
8. [Paramètres de réglage](#8-paramètres-de-réglage)
9. [Limites et performances](#9-limites-et-performances)
10. [Faire évoluer : changer de moteur](#10-faire-évoluer--changer-de-moteur)
11. [Checklist de réimplémentation](#11-checklist-de-réimplémentation)
12. [Références](#12-références)

---

## 1. Architecture

| Aspect | Choix |
|---|---|
| Lieu d'exécution | Navigateur du client (aucun serveur sollicité) |
| Runtime IA | `onnxruntime-web` 1.20.1 (WebAssembly, Microsoft) |
| Modèle | **RMBG-1.4** (BRIA AI), ONNX, ~176 Mo (non quantifié) |
| Coût | 0 € — pas d'API payante, pas de clé |
| Confidentialité | L'image ne quitte pas l'appareil pour le détourage |
| Fichier module | `assets/conf-bgremoval2.js` |
| Point de branchement | `doUpload()` dans `sections/configurateur.liquid` |

**Pourquoi ce choix.** Les librairies « tout-en-un » (`@imgly/background-removal`,
`@huggingface/transformers`) échouent dans ce contexte : leurs builds CDN
contiennent du code Node (`require`, `fs`, `onnxruntime-node`) qui casse dans le
navigateur. `onnxruntime-web` est conçu **pour** le navigateur — on pilote
nous-mêmes le pré/post-traitement, ce qui donne aussi un contrôle fin sur la
qualité du détourage.

---

## 2. Le flux complet

```
Client choisit un fichier
        │
        ▼
doUpload(e, zone)                          [configurateur.liquid]
   FileReader → dataURL (image brute)
        │
        ▼
ConfBgRemoval.ask(dataURL)                 [conf-bgremoval2.js]
   ┌──────────────────────────────┐
   │ Écran 1 — « Enlever le fond ?»│
   └──────────────────────────────┘
        │                       │
      « Non »                 « Oui »
        │                       ▼
        │            loadOrt()             → <script> onnxruntime-web (UMD)
        │            fetchWithProgress()   → télécharge RMBG-1.4 (% en direct)
        │            InferenceSession      → session ONNX (WASM)
        │                       │
        │            removeBg()            → prétraitement → inférence →
        │                                    masque → PNG transparent
        │                       │
        │            ┌────────────────────────────┐
        │            │ Écran 3 — Résultat          │
        │            │ [Remettre le fond] [Garder] │
        │            └────────────────────────────┘
        │                  │                │
        │             (original)        (détouré)
        ▼                  ▼                ▼
        └──── La Promise résout avec le `src` FINAL ────┘
                            │
                            ▼
             saveUpload(zone, src)     → sessionStorage
             applyUpload(zone, src)    → rendu canvas
             ConfAPI.uploadLogo(...)   → Cloudinary (image réellement retenue)
```

En cas d'erreur (CDN injoignable, image illisible…), un **écran d'erreur** s'affiche
et la Promise résout avec l'**original** : l'upload n'est jamais bloqué.

---

## 3. API publique du module

Le module expose **un seul point d'entrée** :

```js
window.ConfBgRemoval.ask(dataUrl)   // → Promise<string>
```

**Contrat** : résout **toujours** avec un `src` utilisable.

| Cas | Valeur résolue |
|---|---|
| « Non, garder le fond » | `dataUrl` original |
| « Oui » puis « Garder » | PNG transparent (dataURL) |
| « Oui » puis « Remettre le fond » | `dataUrl` original |
| Erreur (CDN, modèle, image) | `dataUrl` original |

Cette garantie rend le branchement trivial et sans risque de régression.

### Structure interne

| Fonction | Rôle |
|---|---|
| `ask(dataUrl)` | Orchestre la modale et résout le `src` final |
| `loadOrt()` | Charge `onnxruntime-web` via `<script>` (cache : `window.ort`) |
| `loadSession(onProgress)` | Charge le modèle + crée la session ONNX (cache) |
| `fetchWithProgress(url, cb)` | Télécharge le `.onnx` en streaming avec % |
| `removeBg(dataUrl, onProgress)` | Le pipeline complet → PNG transparent |
| `ensureStyles()` | Injecte le CSS de la modale (une seule fois) |
| `renderQuestion / renderLoading / renderResult / renderError` | Les 4 écrans |

Caches : `_ortPromise`, `_sessionPromise` (runtime + modèle chargés une fois),
`_lastOriginal` / `_lastCutout` (ne pas retraiter deux fois la même image).

---

## 4. Le pipeline de détourage

### 4.1 Chargement du runtime — **la subtilité critique**

```js
var ORT_SCRIPT = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/ort.min.js';

function loadOrt() {
  if (window.ort) return Promise.resolve(window.ort);
  return new Promise(function (resolve, reject) {
    var s = document.createElement('script');
    s.src = ORT_SCRIPT;            // URL en CHAÎNE — voir section 7
    s.async = true;
    s.onload  = function () { window.ort ? resolve(window.ort) : reject(new Error('ort absent')); };
    s.onerror = function () { reject(new Error('Chargement du moteur impossible.')); };
    document.head.appendChild(s);
  });
}
```

> **Ne jamais utiliser `import()` ici.** Voir [§7](#7-pièges-shopify-à-connaître-absolument).

### 4.2 Téléchargement du modèle avec progression

```js
function fetchWithProgress(url, onProgress) {
  return fetch(url).then(function (resp) {
    var total = parseInt(resp.headers.get('content-length') || '0', 10);
    if (!resp.body || !total) return resp.arrayBuffer();   // repli sans %
    var reader = resp.body.getReader(), received = 0, chunks = [];
    return (function pump() {
      return reader.read().then(function (r) {
        if (r.done) {
          var out = new Uint8Array(received), pos = 0;
          chunks.forEach(function (c) { out.set(c, pos); pos += c.length; });
          return out.buffer;
        }
        chunks.push(r.value);
        received += r.value.length;
        if (onProgress) onProgress(Math.round((received / total) * 100));
        return pump();
      });
    })();
  });
}
```

### 4.3 Création de la session ONNX

```js
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/';
var session = await ort.InferenceSession.create(modelBuffer, {
  executionProviders: ['wasm']
});
```

`wasmPaths` est **obligatoire** : sans lui, le runtime cherche ses `.wasm` en local
et échoue.

### 4.4 Prétraitement — image → tenseur

RMBG-1.4 attend : **1024×1024, format CHW, float32, normalisé (mean 0.5, std 1.0)**.

```js
// 1) Redimensionne l'image en 1024×1024 sur un canvas
var rc = document.createElement('canvas');
rc.width = rc.height = 1024;
var rctx = rc.getContext('2d');
rctx.drawImage(img, 0, 0, 1024, 1024);
var rgba = rctx.getImageData(0, 0, 1024, 1024).data;   // [R,G,B,A, R,G,B,A, …]

// 2) RGBA entrelacé (HWC) → CHW normalisé
var area = 1024 * 1024;
var input = new Float32Array(3 * area);
for (var i = 0; i < area; i++) {
  input[i]              = (rgba[i * 4]     / 255 - 0.5);  // canal R
  input[i + area]       = (rgba[i * 4 + 1] / 255 - 0.5);  // canal G
  input[i + area * 2]   = (rgba[i * 4 + 2] / 255 - 0.5);  // canal B
}
var tensor = new ort.Tensor('float32', input, [1, 3, 1024, 1024]);
```

**Deux points à ne pas rater :**
- **HWC → CHW** : le canvas donne les pixels entrelacés, le modèle veut les canaux
  séparés (tous les R, puis tous les G, puis tous les B).
- **Normalisation** : spécifique au modèle. RMBG-1.4 = `mean 0.5, std 1.0`.
  Un autre modèle aura d'autres valeurs (souvent ImageNet).

### 4.5 Inférence

```js
var feeds = {};
feeds[session.inputNames[0]] = tensor;               // nom d'entrée lu dynamiquement
var results = await session.run(feeds);
var mask = results[session.outputNames[0]].data;     // 1×1×1024×1024, ≈ [0..1]
```

Lire `inputNames[0]` / `outputNames[0]` évite de coder en dur des noms qui
changent d'un modèle à l'autre.

### 4.6 Composition finale

```js
// Masque 1024×1024 → canvas → interpolé à la taille RÉELLE (W×H)
mrctx.drawImage(maskCanvas, 0, 0, W, H);
var alphaData = mrctx.getImageData(0, 0, W, H).data;

// Image d'origine pleine résolution + alpha = masque
octx.drawImage(img, 0, 0, W, H);
var px = octx.getImageData(0, 0, W, H);
for (var p = 0; p < W * H; p++) {
  px.data[p * 4 + 3] = alphaData[p * 4];   // canal alpha ← masque
}
octx.putImageData(px, 0, 0);
return out.toDataURL('image/png');          // PNG transparent
```

> Le détourage est appliqué à la **résolution native** de l'image. Seul le masque
> est calculé en 1024 puis interpolé : on ne dégrade pas l'image du client.

---

## 5. Post-traitement du masque

**C'est ici que se joue la qualité perçue.** Un masque brut laisse un voile de
fond résiduel (les valeurs intermédiaires ~0.4–0.6).

```js
// 1) Normalisation min-max du masque sur [0..1]
var mn = Infinity, mx = -Infinity;
for (var k = 0; k < mask.length; k++) {
  if (mask[k] < mn) mn = mask[k];
  if (mask[k] > mx) mx = mask[k];
}
var range = (mx - mn) || 1;

// 2) Courbe de contraste (smoothstep)
var LOW = 0.35, HIGH = 0.65;
function refine(v01) {
  if (v01 <= LOW)  return 0;                 // fond  → transparent net
  if (v01 >= HIGH) return 1;                 // sujet → opaque
  var t = (v01 - LOW) / (HIGH - LOW);
  return t * t * (3 - 2 * t);                // smoothstep : bords lisses
}

// 3) Application
var alpha = Math.round(refine((mask[j] - mn) / range) * 255);
```

| Réglage | Effet |
|---|---|
| ↑ `LOW` (ex. 0.45) | Coupe plus agressivement — élimine plus de fond, risque de manger le sujet |
| ↓ `HIGH` (ex. 0.55) | Sujet opaque plus tôt — bords plus francs, moins de dégradé |
| `HIGH − LOW` étroit | Bords durs (dentelure possible) |
| `HIGH − LOW` large | Bords doux (halo possible) |

Le `smoothstep` (`3t² − 2t³`) donne une transition **C¹-continue** : pas de
cassure visible sur les bords, contrairement à un seuil binaire.

---

## 6. Intégration à l'upload

### Le point de branchement unique

Tous les inputs fichier du configurateur appellent `doUpload(event, zone)` :

| Produit | zones |
|---|---|
| Textiles | `f` (cœur), `b` (dos), `sl` / `sr` (manches) |
| Patchs | `c` |
| Coins | `coin-recto`, `coin-verso` |
| Drapeaux | `flag-recto`, `flag-verso` |

**Modifier `doUpload` suffit donc à couvrir tous les produits.**

```js
function doUpload(e, zone) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => {
    const original = ev.target.result;

    // Dégradation propre : si le module n'est pas chargé, on passe tout droit.
    const decide = (window.ConfBgRemoval && window.ConfBgRemoval.ask)
      ? window.ConfBgRemoval.ask(original)
      : Promise.resolve(original);

    decide.then(function (src) {
      saveUpload(zone, src);     // persistance sessionStorage
      applyUpload(zone, src);    // rendu canvas

      // Upload backend de l'image RÉELLEMENT retenue (détourée ou non)
      if (window.ConfAPI) {
        const uploadFile = (src === original)
          ? file
          : dataUrlToFile(src, file.name);
        window.ConfAPI.uploadLogo(uploadFile).then(/* … */);
      }
    });
  };
  reader.readAsDataURL(file);
}
```

### Helper : dataURL → File (pour l'upload backend)

```js
function dataUrlToFile(dataUrl, name) {
  const parts = dataUrl.split(',');
  const mime  = (parts[0].match(/:(.*?);/) || [null, 'image/png'])[1];
  const bin   = atob(parts[1]);
  const arr   = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  const baseName = (name || 'design').replace(/\.[^.]+$/, '') + '.png';
  return new File([arr], baseName, { type: mime });
}
```

> **Important** : sans ça, Cloudinary recevrait l'image **originale** (avec fond)
> alors que le client a choisi la version détourée — les aperçus composés côté
> serveur seraient incohérents avec ce qu'il voit.

### Ce qui n'est PAS branché (volontairement)

`restoreUploads()` (restauration après rechargement de page) appelle `applyUpload`
**directement**, sans passer par `doUpload`. La question n'est donc **pas reposée**
au reload — c'est le comportement attendu.

---

## 7. Pièges Shopify (à connaître absolument)

### 7.1 Shopify transforme `import()` en `require()`

**Symptôme** : `ReferenceError: require is not defined`

**Cause** : Shopify **minifie/transpile les assets `.js`** au déploiement. Un
`import()` dynamique est réécrit en `require(...)` — inexistant dans un navigateur.

Vérification sur le fichier réellement servi :

```bash
curl -s "https://VOTRE-STORE.myshopify.com/cdn/shop/t/5/assets/mon-module.js" \
  | grep -c "require("
# doit renvoyer 0
```

**Solution** : charger toute dépendance externe via une **balise `<script>`** dont
l'URL est une **chaîne de caractères** (build **UMD**, variable globale), jamais
via `import()`.

```js
// ❌ Cassé après déploiement Shopify
const ort = await import('https://cdn.../ort.min.mjs');

// ✅ Robuste
const s = document.createElement('script');
s.src = 'https://cdn.../ort.min.js';   // UMD → window.ort
document.head.appendChild(s);
```

### 7.2 Le cache CDN de Shopify peut figer un asset

**Symptôme** : les corrections ne sont jamais servies, l'ancien code persiste
malgré des `theme push` réussis.

**Solution** : **renommer le fichier** (ex. `conf-bg-removal.js` →
`conf-bgremoval2.js`) et mettre à jour le `<script src>` dans le Liquid. Nouvelle
URL = nouveau cache.

### 7.3 Les CDN npm servent souvent des builds Node

`jsdelivr`, `esm.sh` et consorts résolvent le champ `main` du `package.json`, qui
pointe fréquemment vers un build **Node** (avec `fs`, `path`, `onnxruntime-node`).

**Toujours pointer le fichier navigateur explicitement** :

| ❌ | ✅ |
|---|---|
| `.../onnxruntime-web@1.20.1` | `.../onnxruntime-web@1.20.1/dist/ort.min.js` |
| `.../@huggingface/transformers@3.0.2` | (pas de build navigateur direct utilisable) |

**Méthode de vérification** avant d'intégrer :

```bash
curl -s "<URL_CDN>" | head -c 300
# Cherche : import "fs" / require( / __webpack_require__  → build Node, à éviter
```

---

## 8. Paramètres de réglage

Tous en tête de `conf-bgremoval2.js` :

```js
var ORT_SCRIPT = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/ort.min.js';
var ORT_WASM   = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/';
var MODEL_URL  = 'https://huggingface.co/briaai/RMBG-1.4/resolve/main/onnx/model.onnx';
var MODEL_SIZE = 1024;
```

| Paramètre | Où | Effet |
|---|---|---|
| `MODEL_URL` | en-tête | `model.onnx` (176 Mo, précis) vs `model_quantized.onnx` (44 Mo, plus rapide, moins net) |
| `MODEL_SIZE` | en-tête | Résolution d'inférence — **imposée par le modèle** (1024 pour RMBG-1.4) |
| `LOW` / `HIGH` | `removeBg()` | Agressivité du détourage — voir [§5](#5-post-traitement-du-masque) |
| Textes des écrans | `renderQuestion` / `renderResult` / `renderError` | UI |
| Styles | `ensureStyles()` | CSS de la modale |
| Désactiver la fonctionnalité | Retirer le `<script>` du Liquid | `doUpload` retombe sur l'original, sans poser de question |

---

## 9. Limites et performances

| Aspect | Réalité |
|---|---|
| **1er usage** | ~176 Mo à télécharger (le modèle) — 30 à 60 s selon la connexion |
| **Usages suivants** | Modèle en cache navigateur → quelques secondes |
| **Inférence** | WASM sur le **thread principal** → un appareil ancien peut ramer |
| **Qualité** | Excellente sur logos / fonds unis · Correcte sur photos · Perfectible sur cheveux, dégradés fins |
| **Dépendance réseau** | CDN jsDelivr + Hugging Face requis au 1er usage |
| **Confidentialité** | ✅ L'image ne quitte jamais l'appareil |

### Optimisations envisageables

- **Web Worker** : sortir l'inférence du thread principal (UI plus fluide).
- **Modèle quantifié** : `model_quantized.onnx` (44 Mo) — 4× plus léger, qualité
  un peu inférieure. Bon compromis sur mobile.
- **WebGPU** : `executionProviders: ['webgpu', 'wasm']` — nettement plus rapide sur
  navigateurs compatibles, repli automatique sur WASM sinon.
- **Auto-hébergement du modèle** : servir le `.onnx` depuis votre propre CDN pour
  ne pas dépendre de Hugging Face.

---

## 10. Faire évoluer : changer de moteur

L'UX (modale, écrans, réversibilité) est **découplée** du moteur. Pour basculer sur
un service serveur, seule `removeBg()` change :

```js
// Remplace tout le pipeline ONNX par un appel backend.
function removeBg(dataUrl, onProgress) {
  if (onProgress) onProgress(50);
  return fetch('/api/remove-background', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: dataUrl })
  })
  .then(function (r) {
    if (!r.ok) throw new Error('Détourage serveur indisponible.');
    return r.json();
  })
  .then(function (res) {
    if (onProgress) onProgress(100);
    return res.url || res.dataUrl;   // PNG transparent
  });
}
```

Tout le reste (`ask`, les 4 écrans, le cache, le branchement dans `doUpload`)
reste **inchangé**.

### Comparatif des moteurs

| Moteur | Coût | Qualité | Complexité | Confidentialité |
|---|---|---|---|---|
| **onnxruntime-web + RMBG-1.4** (actuel) | Gratuit | Bonne | Moyenne (pré/post-traitement à écrire) | ✅ Locale |
| Cloudinary `e_background_removal` | Payant (add-on) | Très bonne | Faible (déjà intégré au projet) | ❌ Envoi tiers |
| remove.bg API | Payant (au crédit) | Excellente | Faible | ❌ Envoi tiers |
| RMBG-2.0 / BiRefNet en ONNX | Gratuit | Excellente | Moyenne (même code, autre `MODEL_URL` + normalisation) | ✅ Locale |

> **Piste la plus rentable** : garder l'architecture actuelle et remplacer
> simplement `MODEL_URL` par **RMBG-2.0** ou **BiRefNet** (vérifier la
> normalisation et la taille d'entrée attendues par le nouveau modèle).

---

## 11. Checklist de réimplémentation

Pour porter cette fonctionnalité sur un autre projet :

- [ ] **Vérifier le build CDN** : `curl <URL> | head -c 300` — refuser tout build
      contenant `require(`, `import "fs"`, `onnxruntime-node`.
- [ ] **Charger le runtime via `<script>`** (UMD, variable globale), pas `import()`,
      si la plateforme minifie les assets (Shopify, certains CMS).
- [ ] **Définir `ort.env.wasm.wasmPaths`** vers le dossier `dist/` du CDN.
- [ ] **Respecter le prétraitement du modèle** : taille d'entrée, format CHW,
      normalisation (mean/std). Une erreur ici → masque incohérent.
- [ ] **Lire `session.inputNames[0]` / `outputNames[0]`** plutôt que de coder les
      noms en dur.
- [ ] **Post-traiter le masque** (normalisation min-max + smoothstep), sinon
      résidus de fond.
- [ ] **Composer à la résolution native** de l'image, pas à celle du modèle.
- [ ] **Garantir un repli** : toute erreur doit résoudre avec l'image d'origine.
- [ ] **Envoyer au backend l'image réellement retenue** (helper `dataUrlToFile`).
- [ ] **Ne pas rejouer la question** lors de la restauration d'un design sauvegardé.
- [ ] **Prévoir un cache** (runtime, modèle, dernier détourage).

---

## 12. Références

### 12.1 Le modèle utilisé

| Ressource | Lien | Note |
|---|---|---|
| **RMBG-1.4 (BRIA AI)** | https://huggingface.co/briaai/RMBG-1.4 | **Le modèle de cette implémentation.** Lire l'onglet *Files* pour les fichiers `.onnx` |
| Fichier ONNX (précis, ~176 Mo) | https://huggingface.co/briaai/RMBG-1.4/resolve/main/onnx/model.onnx | Celui utilisé ici |
| Fichier ONNX quantifié (~44 Mo) | https://huggingface.co/briaai/RMBG-1.4/resolve/main/onnx/model_quantized.onnx | Plus léger, un peu moins net |
| Licence RMBG-1.4 | https://huggingface.co/briaai/RMBG-1.4#license | ⚠️ **Gratuit pour usage non commercial.** Un usage commercial nécessite un accord BRIA |

> **Point de vigilance juridique** : RMBG-1.4 est distribué sous licence
> *bria-rmbg-1.4* — libre pour la recherche/usage non commercial, **accord requis
> pour un usage commercial**. Pour une boutique en production, vérifier ce point ou
> se tourner vers un modèle sous licence permissive (voir 12.2).

### 12.2 Modèles alternatifs (pour faire évoluer la qualité)

| Modèle | Lien | Intérêt |
|---|---|---|
| **RMBG-2.0** | https://huggingface.co/briaai/RMBG-2.0 | Successeur, nettement plus précis. Même contrainte de licence |
| **BiRefNet** | https://huggingface.co/ZhengPeng7/BiRefNet | État de l'art sur le détourage. Licence MIT |
| BiRefNet (dépôt GitHub) | https://github.com/ZhengPeng7/BiRefNet | Code, poids, variantes (léger / haute résolution) |
| **U²-Net** | https://github.com/xuebinqin/U-2-Net | Le classique historique (base de `rembg`). Licence Apache 2.0 |
| **IS-Net / DIS** | https://github.com/xuebinqin/DIS | Segmentation très fine (bords, détails) |
| ONNX Model Zoo | https://github.com/onnx/models | Catalogue de modèles ONNX prêts à l'emploi |

> Pour changer de modèle : modifier `MODEL_URL`, **et vérifier** la taille d'entrée
> attendue (`MODEL_SIZE`) ainsi que la **normalisation** (mean/std) — elles diffèrent
> d'un modèle à l'autre. Voir §4.4.

### 12.3 Le runtime (ONNX Runtime Web)

| Ressource | Lien |
|---|---|
| Documentation générale | https://onnxruntime.ai/docs/ |
| **Tutoriels Web** | https://onnxruntime.ai/docs/tutorials/web/ |
| Démarrage rapide (navigateur) | https://onnxruntime.ai/docs/get-started/with-javascript/web.html |
| **API JavaScript (référence)** | https://onnxruntime.ai/docs/api/js/index.html |
| `InferenceSession` | https://onnxruntime.ai/docs/api/js/interfaces/InferenceSession-1.html |
| `Tensor` | https://onnxruntime.ai/docs/api/js/classes/Tensor-1.html |
| Execution Providers (WASM, WebGPU, WebNN) | https://onnxruntime.ai/docs/execution-providers/ |
| **Provider WebGPU** (accélération) | https://onnxruntime.ai/docs/tutorials/web/ep-webgpu.html |
| Paquet npm | https://www.npmjs.com/package/onnxruntime-web |
| Dépôt GitHub (JS) | https://github.com/microsoft/onnxruntime/tree/main/js/web |
| Exemples officiels | https://github.com/microsoft/onnxruntime-inference-examples/tree/main/js |

### 12.4 Concepts sous-jacents

| Sujet | Lien | Pourquoi c'est utile ici |
|---|---|---|
| **Format ONNX** | https://onnx.ai/ | Le format d'échange de modèles |
| Spécification ONNX | https://github.com/onnx/onnx/blob/main/docs/IR.md | Comprendre entrées/sorties d'un modèle |
| **Netron** (visualiseur de modèle) | https://netron.app/ | **Très utile** : ouvrir un `.onnx` pour lire les noms/formes d'entrée-sortie |
| Formats mémoire NCHW / NHWC | https://oneapi-src.github.io/oneDNN/dev_guide_understanding_memory_formats.html | Le piège du prétraitement (§4.4) |
| **Smoothstep** | https://en.wikipedia.org/wiki/Smoothstep | La courbe du post-traitement (§5) |
| Segmentation d'image (vue d'ensemble) | https://en.wikipedia.org/wiki/Image_segmentation | Le principe du masque |
| Salient Object Detection | https://paperswithcode.com/task/salient-object-detection | La famille de modèles utilisée (classement, état de l'art) |
| Alpha compositing | https://en.wikipedia.org/wiki/Alpha_compositing | La composition finale image + masque |

### 12.5 APIs navigateur employées

| API | Lien MDN |
|---|---|
| `Canvas` / `CanvasRenderingContext2D` | https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D |
| **`ImageData`** (accès pixel + canal alpha) | https://developer.mozilla.org/fr/docs/Web/API/ImageData |
| `getImageData` / `putImageData` | https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/getImageData |
| `drawImage` (redimensionnement) | https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/drawImage |
| **Streams API** (téléchargement par chunks) | https://developer.mozilla.org/fr/docs/Web/API/Streams_API |
| `ReadableStream.getReader()` | https://developer.mozilla.org/fr/docs/Web/API/ReadableStream/getReader |
| `Fetch API` | https://developer.mozilla.org/fr/docs/Web/API/Fetch_API |
| `FileReader` | https://developer.mozilla.org/fr/docs/Web/API/FileReader |
| `File` / `Blob` | https://developer.mozilla.org/fr/docs/Web/API/File |
| `Float32Array` (tenseur) | https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Float32Array |
| `WebAssembly` | https://developer.mozilla.org/fr/docs/WebAssembly |
| `Web Workers` (optimisation §9) | https://developer.mozilla.org/fr/docs/Web/API/Web_Workers_API |
| `WebGPU` (optimisation §9) | https://developer.mozilla.org/fr/docs/Web/API/WebGPU_API |

### 12.6 Alternatives serveur (si la qualité locale ne suffit pas)

| Solution | Lien | Modèle économique |
|---|---|---|
| **Cloudinary — Background Removal** | https://cloudinary.com/documentation/cloudinary_ai_background_removal_addon | Add-on payant · **déjà intégré au projet** (Cloudinary est utilisé pour les aperçus) |
| Cloudinary — transformation `e_background_removal` | https://cloudinary.com/documentation/transformation_reference#e_background_removal | Référence de la transformation |
| **remove.bg — API** | https://www.remove.bg/api | Payant au crédit · meilleure qualité du marché |
| remove.bg — documentation | https://www.remove.bg/api#api-reference | Référence complète |
| **rembg** (self-hosted, Python) | https://github.com/danielgatis/rembg | Gratuit · à héberger soi-même (U²-Net / IS-Net) |
| Photoroom API | https://www.photoroom.com/api | Payant · orienté e-commerce |
| Clipdrop API (Stability AI) | https://clipdrop.co/apis/docs/remove-background | Payant |

### 12.7 Approches testées et écartées

| Librairie | Lien | Pourquoi écartée |
|---|---|---|
| `@imgly/background-removal` | https://github.com/imgly/background-removal-js | Le build CDN contient du code Node → `require is not defined` dans le navigateur |
| `@huggingface/transformers` (Transformers.js) | https://huggingface.co/docs/transformers.js | Le build `.mjs` importe `fs`, `path`, `sharp`, `onnxruntime-node` → inutilisable côté navigateur via CDN |
| Transformers.js — dépôt | https://github.com/huggingface/transformers.js | (Fonctionne très bien avec un bundler ; le problème est spécifique au chargement via CDN sur Shopify) |

> **Leçon** : sur une plateforme qui minifie les assets et interdit les bundlers
> (Shopify), privilégier une librairie qui publie un **build UMD navigateur**
> autonome. Voir §7.

### 12.8 Shopify (contraintes de la plateforme)

| Sujet | Lien |
|---|---|
| Assets d'un thème | https://shopify.dev/docs/storefronts/themes/architecture/assets |
| Filtre Liquid `asset_url` | https://shopify.dev/docs/api/liquid/filters/asset_url |
| Bonnes pratiques performance thème | https://shopify.dev/docs/storefronts/themes/best-practices/performance |
| Shopify CLI — `theme push` | https://shopify.dev/docs/api/shopify-cli/theme/theme-push |
| Content Security Policy (thèmes) | https://shopify.dev/docs/storefronts/themes/best-practices/security |

### 12.9 Outils pratiques

| Outil | Lien | Usage |
|---|---|---|
| **Netron** | https://netron.app/ | Ouvrir un `.onnx` pour lire les **noms et formes** d'entrée/sortie — indispensable avant d'intégrer un nouveau modèle |
| jsDelivr (CDN) | https://www.jsdelivr.com/ | Servir `onnxruntime-web` |
| Hugging Face — Hub | https://huggingface.co/models?pipeline_tag=image-segmentation | Chercher d'autres modèles de segmentation |
| Can I Use — WebAssembly | https://caniuse.com/wasm | Compatibilité navigateurs |
| Can I Use — WebGPU | https://caniuse.com/webgpu | Vérifier avant d'activer le provider WebGPU |

---

## Historique des décisions

| Décision | Raison |
|---|---|
| Traitement **client** plutôt que serveur | Gratuit, confidentiel, pas de dépendance à un service payant |
| `onnxruntime-web` plutôt qu'une librairie tout-en-un | Les builds CDN des librairies tout-en-un contiennent du code Node (§7.3) |
| Chargement par **`<script>` UMD** plutôt qu'`import()` | Shopify transforme `import()` en `require()` (§7.1) |
| Fichier renommé `conf-bgremoval2.js` | Contourner le cache CDN figé de Shopify (§7.2) |
| Modèle **non quantifié** (176 Mo) | Le quantifié laissait des résidus de fond |
| **Smoothstep** sur le masque | Un masque brut laisse un voile de fond (§5) |
| Composition à la **résolution native** | Ne pas dégrader l'image du client |
| Repli systématique sur l'original | Ne jamais bloquer un upload à cause du détourage |
