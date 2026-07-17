/**
 * Logo Drag & Resize - Déplacer et redimensionner les logos sur le produit.
 * Positions et tailles en % du canvas (.cv-single-view) pour rester cohérent
 * quel que soit le zoom ou la taille de l'écran. Le logo ne peut pas sortir du canvas.
 */
(function () {
  let mode = null;       // 'drag' ou 'resize'
  let grip = null;       // poignée saisie : 'nw','n','ne','e','se','s','sw','w'
  let active = null;     // logo manipulé
  let startX = 0, startY = 0;
  let startLeft = 0, startTop = 0, startW = 0, startH = 0;
  let startFont = 0;     // taille de police au début d'un resize de texte
  let bounds = null;

  const MIN_W = 4;       // largeur min du logo en % du canvas
  const MAX_W = 100;     // largeur max

  // Conteneur de référence selon le type de logo :
  //  - .coin-disc  pour les coins
  //  - .flag-img-3d pour les drapeaux
  //  - .cv-single-view pour les textiles
  function getCanvas(logo) {
    if (logo) {
      const coinDisc = logo.closest('.coin-disc');
      if (coinDisc) return coinDisc;
      const flagWrap = logo.closest('.flag-img-3d');
      if (flagWrap) return flagWrap;
      // Patch : le logo est positionné DIRECTEMENT dans #coins-canvas (l'image
      // du patch). Ses % sont relatifs à ce conteneur. Aucune contrainte de zone :
      // le client le place librement (voir onPointerMove).
      const patchCanvas = logo.closest('#coins-canvas');
      if (patchCanvas) return patchCanvas;
      const patchStage = logo.closest('.patch-stage');
      if (patchStage) return patchStage;
    }
    return document.querySelector('.cv-single-view');
  }

  // Largeur/hauteur actuelles du logo en % du canvas
  function logoSizePct(logo) {
    const wPct = parseFloat(logo.style.width) || 18;
    const r = logo.getBoundingClientRect();
    const b = bounds || getCanvas(logo).getBoundingClientRect();
    const hPct = b.height ? (r.height / b.height) * 100 : wPct;
    return { wPct, hPct };
  }

  // Paires de logos manches à synchroniser en miroir (vue de face)
  const MIRROR_PAIRS = {
    'logo-sl-face': 'logo-sr-face',
    'logo-sr-face': 'logo-sl-face'
  };

  // Le logo de la vue de côté suit la taille du logo recto de la pièce
  function syncCoinCote(logo) {
    if (!logo || logo.id !== 'coin-logo-recto') return;
    const cote = document.getElementById('coin-cote-logo');
    if (!cote) return;
    const width = parseFloat(logo.style.width) || 44;
    // largeur recto par défaut = 44% -> scale 1 ; proportionnel ensuite
    const scale = width / 44;
    cote.style.setProperty('--coin-logo-scale', scale.toFixed(3));
  }

  // Applique la position/taille miroir (par rapport au centre horizontal 50%)
  function mirrorSleeve(logo) {
    const twinId = MIRROR_PAIRS[logo.id];
    if (!twinId) return;
    const twin = document.getElementById(twinId);
    if (!twin) return;

    const left = parseFloat(logo.style.left) || 0;
    const top = parseFloat(logo.style.top) || 0;
    const width = parseFloat(logo.style.width) || 8;

    // Miroir horizontal : le bord droit du jumeau = symétrique du bord gauche
    twin.style.left = (100 - left - width) + '%';
    twin.style.top = top + '%';      // même hauteur
    twin.style.width = width + '%';  // même taille
  }

  function onPointerDown(e) {
    const handle = e.target.closest('.logo-resize');
    // Le texte déplaçable se comporte comme un logo (drag simple).
    const logo = e.target.closest('.design-logo') || e.target.closest('.design-text');
    if (!logo) return;

    const canvas = getCanvas(logo);
    if (!canvas) return;

    active = logo;
    bounds = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    startX = point.clientX;
    startY = point.clientY;
    startLeft = parseFloat(logo.style.left) || 0;
    startTop = parseFloat(logo.style.top) || 0;
    startW = parseFloat(logo.style.width) || 18;
    // Hauteur en % du canvas (height:auto -> on la mesure), pour que les poignées
    // du HAUT puissent garder le bord bas en place.
    startH = bounds.height
      ? (logo.getBoundingClientRect().height / bounds.height) * 100
      : startW;
    startFont = parseFloat(logo.style.fontSize) || parseFloat(getComputedStyle(logo).fontSize) || 20;

    if (handle) {
      mode = 'resize';
      // Quelle poignée ? 'se' par défaut (ancien comportement : coin bas-droit).
      grip = handle.getAttribute('data-pos') || 'se';
      logo.classList.add('resizing');
    } else {
      mode = 'drag';
      grip = null;
      logo.classList.add('dragging');
    }
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!active || !bounds) return;
    const point = e.touches ? e.touches[0] : e;
    const dx = point.clientX - startX;
    const dy = point.clientY - startY;

    // PATCH : aucune contrainte de zone — le client place et dimensionne son logo
    // librement (il peut même déborder du patch). Les autres pièces restent
    // bornées à leur canvas (0..100 %).
    const isPatchLogo = active && active.id === 'patch-logo';
    const inset = 0;
    const MIN_POS = isPatchLogo ? -Infinity : inset;
    const maxPos = (sizePct) =>
      isPatchLogo ? Infinity : (100 - inset - sizePct);
    const maxW = MAX_W;

    if (mode === 'resize') {
      /* Redimensionnement depuis les 8 poignées (4 coins + 4 côtés).
         Le logo garde son ratio (height:auto) : c'est donc la LARGEUR qui pilote.
         - poignées est (e, ne, se)  : tirer à droite agrandit  -> +dx
         - poignées ouest (w, nw, sw): tirer à gauche agrandit  -> -dx
         - poignée sud (s)           : tirer vers le bas agrandit -> +dy
         - poignée nord (n)          : tirer vers le haut agrandit -> -dy
         Les poignées ouest/nord déplacent aussi le logo, sinon son bord opposé
         « fuirait » au lieu de rester en place. */
      var g = grip || 'se';
      var delta;
      if (g === 'n' || g === 's') {
        // Côtés haut/bas : le geste vertical pilote la taille.
        delta = (g === 's' ? dy : -dy) / bounds.height * 100 * (bounds.height / bounds.width);
      } else {
        // Coins et côtés gauche/droite : le geste horizontal pilote la taille.
        delta = (g.indexOf('w') !== -1 ? -dx : dx) / bounds.width * 100;
      }

      let newW = startW + delta;
      newW = Math.max(MIN_W, Math.min(maxW, newW));

      // Bord opposé fixe : on compense le décalage de largeur/hauteur.
      var grown = newW - startW;                       // variation en % de largeur
      if (g.indexOf('w') !== -1) {
        active.style.left = (startLeft - grown) + '%';  // le bord droit ne bouge pas
      }
      if (g === 'n' || g === 'nw' || g === 'ne') {
        // Hauteur en % du canvas : la largeur % est relative à la LARGEUR du canvas.
        var ratioH = (startH || 0) / (startW || 1);     // hauteur/largeur du logo
        active.style.top = (startTop - grown * ratioH) + '%'; // le bord bas ne bouge pas
      }

      active.style.width = newW + '%';
      // Pour un TEXTE simple : la taille de police suit la largeur (proportionnel).
      if (active.classList.contains('design-text') && !active.classList.contains('is-shaped')) {
        var ratio = newW / (startW || newW);
        if (!startFont) startFont = parseFloat(getComputedStyle(active).fontSize) || 20;
        var newFont = Math.max(8, Math.min(120, startFont * ratio));
        active.style.fontSize = newFont + 'px';
        // La taille visée par l'utilisateur = ce qu'il tire ; clampTextToZone
        // la respecte tant qu'elle tient dans la zone, sinon la borne.
        active.setAttribute('data-wanted-size', newFont);
        var tz = active.id === 'text-f' ? 'f' : (active.id === 'text-b' ? 'b' : null);
        if (tz && typeof window.clampTextToZone === 'function') window.clampTextToZone(tz);
      }
    } else {
      // Déplacement
      let newLeft = startLeft + (dx / bounds.width) * 100;
      let newTop = startTop + (dy / bounds.height) * 100;

      const { wPct, hPct } = logoSizePct(active);
      newLeft = Math.max(MIN_POS, Math.min(maxPos(wPct), newLeft));
      newTop = Math.max(MIN_POS, Math.min(maxPos(hPct), newTop));

      active.style.left = newLeft + '%';
      active.style.top = newTop + '%';
    }

    // Synchronise le logo manche opposé en miroir (si applicable)
    mirrorSleeve(active);
    // Synchronise le logo de la vue de côté avec la taille du recto (coins)
    syncCoinCote(active);
    // Aperçu temps réel de la vignette récap (logo cœur déplacé/redimensionné)
    if (active.id === 'logo-f' && typeof window.updateRecapThumbLogo === 'function') {
      window.updateRecapThumbLogo();
    }
    // Contrainte : le logo textile reste DANS sa zone pointillée.
    var TEXTILE_ZONE = {
      'logo-f': 'f', 'logo-b': 'b',
      'logo-sl': 'sl'
    };
    if (TEXTILE_ZONE[active.id] && typeof window.clampLogoToZone === 'function') {
      window.clampLogoToZone(TEXTILE_ZONE[active.id]);
    }
    // Le texte reste DANS sa zone horizontale (pas de sortie).
    if (active.classList.contains('design-text') && typeof window.clampTextToZone === 'function') {
      var tz = active.id === 'text-f' ? 'f' : (active.id === 'text-b' ? 'b' : null);
      if (tz) window.clampTextToZone(tz);
    }

    // Idem pour le drapeau recto (vignette récap drapeau)
    if (active.id === 'flag-logo-recto' && typeof window.updateFlagRecapThumb === 'function') {
      window.updateFlagRecapThumb();
    }
    // Idem pour le patch (vignette récap patch)
    if (active.id === 'patch-logo' && typeof window.updatePatchRecapThumb === 'function') {
      window.updatePatchRecapThumb();
    }
    // Idem pour le coin recto (vignette récap coin)
    if (active.id === 'coin-logo-recto' && typeof window.updateCoinRecapThumb === 'function') {
      window.updateCoinRecapThumb();
    }

    e.preventDefault();
  }

  // Map l'id d'un logo -> sa zone de persistance (pour sauvegarder taille/position)
  const LOGO_ZONE = {
    'logo-f': 'f',
    'logo-b': 'b',
    'logo-sl': 'sl', 'logo-sl-face': 'sl',
    'logo-sr': 'sr', 'logo-sr-face': 'sr',
    'patch-logo': 'c',
    'coin-logo-recto': 'coin-recto',
    'coin-logo-verso': 'coin-verso',
    'flag-logo-recto': 'flag-recto',
    'flag-logo-verso': 'flag-verso'
  };

  function onPointerUp() {
    if (active) {
      // Texte déplaçable : sauvegarder position + taille via le hook dédié.
      if (active.classList.contains('design-text') && typeof window.saveTextGeo === 'function') {
        var tzone = active.id === 'text-f' ? 'f' : (active.id === 'text-b' ? 'b' : null);
        if (tzone) window.saveTextGeo(tzone, {
          left: active.style.left, top: active.style.top,
          width: active.style.width, fontSize: active.style.fontSize
        });
      } else {
        // Sauvegarder la taille/position pour la retrouver après un rechargement
        const zone = LOGO_ZONE[active.id];
        if (zone && typeof window.saveUploadGeo === 'function') {
          window.saveUploadGeo(zone, {
            left: active.style.left,
            top: active.style.top,
            width: active.style.width
          });
        }
      }
      active.classList.remove('dragging', 'resizing');
      active = null;
      mode = null;
    }
  }

  /* ── Poignées : 4 coins + 4 côtés ──────────────────────────────────────
     Les templates ne posent qu'UNE poignée (coin bas-droit historique). On
     complète ici pour tous les éléments manipulables, y compris ceux injectés
     dynamiquement (voir l'observateur plus bas). */
  const GRIPS = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

  function ensureGrips(el) {
    if (!el) return;
    const existing = el.querySelectorAll('.logo-resize');
    // Déjà complété ? (on marque l'élément pour ne pas repasser dessus)
    if (el.dataset.gripsReady === '1') return;

    // Récupère le data-resize d'origine (utilisé ailleurs dans le code).
    const zone =
      (existing[0] && existing[0].getAttribute('data-resize')) ||
      el.getAttribute('data-zone') ||
      '';

    existing.forEach((h) => h.remove());
    GRIPS.forEach((pos) => {
      const h = document.createElement('span');
      h.className = 'logo-resize pos-' + pos;
      h.setAttribute('data-pos', pos);
      if (zone) h.setAttribute('data-resize', zone);
      el.appendChild(h);
    });
    el.dataset.gripsReady = '1';
  }

  function refreshGrips() {
    document
      .querySelectorAll('.design-logo, .design-text')
      .forEach(ensureGrips);
  }

  // Au chargement, puis à chaque injection de layout (produit, vue, upload…).
  document.addEventListener('DOMContentLoaded', refreshGrips);
  refreshGrips();
  new MutationObserver(function () {
    refreshGrips();
  }).observe(document.documentElement, { childList: true, subtree: true });

  // Souris
  document.addEventListener('mousedown', onPointerDown);
  document.addEventListener('mousemove', onPointerMove);
  document.addEventListener('mouseup', onPointerUp);

  // Tactile
  document.addEventListener('touchstart', onPointerDown, { passive: false });
  document.addEventListener('touchmove', onPointerMove, { passive: false });
  document.addEventListener('touchend', onPointerUp);

  console.log('🎯 Logo drag & resize initialisé');
})();
