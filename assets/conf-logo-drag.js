/**
 * Logo Drag & Resize - Déplacer et redimensionner les logos sur le produit.
 * Positions et tailles en % du canvas (.cv-single-view) pour rester cohérent
 * quel que soit le zoom ou la taille de l'écran. Le logo ne peut pas sortir du canvas.
 */
(function () {
  let mode = null;       // 'drag' ou 'resize'
  let active = null;     // logo manipulé
  let startX = 0, startY = 0;
  let startLeft = 0, startTop = 0, startW = 0;
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
    const logo = e.target.closest('.design-logo');
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

    if (handle) {
      mode = 'resize';
      logo.classList.add('resizing');
    } else {
      mode = 'drag';
      logo.classList.add('dragging');
    }
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!active || !bounds) return;
    const point = e.touches ? e.touches[0] : e;
    const dx = point.clientX - startX;
    const dy = point.clientY - startY;

    // Le patch autorise le logo à dépasser (bornes élargies)
    const isPatch = active.classList.contains('patch-logo');
    const MIN_POS = isPatch ? -60 : 0;
    const maxPos = (sizePct) => isPatch ? (160 - sizePct) : (100 - sizePct);
    const maxW = isPatch ? 160 : MAX_W;

    if (mode === 'resize') {
      // Nouvelle largeur en % selon le déplacement horizontal
      let newW = startW + (dx / bounds.width) * 100;
      newW = Math.max(MIN_W, Math.min(maxW, newW));
      active.style.width = newW + '%';
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
      // Sauvegarder la taille/position pour la retrouver après un rechargement
      const zone = LOGO_ZONE[active.id];
      if (zone && typeof window.saveUploadGeo === 'function') {
        window.saveUploadGeo(zone, {
          left: active.style.left,
          top: active.style.top,
          width: active.style.width
        });
      }
      active.classList.remove('dragging', 'resizing');
      active = null;
      mode = null;
    }
  }

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
