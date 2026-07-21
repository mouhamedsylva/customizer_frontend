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
  /* Marge de la zone imprimable des drapeaux, en % de la largeur.
     0 = la zone couvre tout le drapeau, bord à bord : le design peut être
     placé sur toute la surface, mais ne peut plus en sortir (avant, le logo
     n'était borné par rien et débordait de l'aperçu).
     Relever cette valeur réserverait une marge pour l'ourlet et les œillets ;
     garder alors `.flag-safe-zone { inset }` (conf-drapeaux.css) identique. */
  const FLAG_INSET = 4;
  window.FLAG_INSET = FLAG_INSET;
  /* Marge VERTICALE, plus généreuse : le haut et le bas du drapeau portent
     l'ourlet de fixation, et l'aperçu y montre l'ondulation du tissu — un
     visuel qui s'en approche paraît déborder. */
  const FLAG_INSET_Y = 9;
  window.FLAG_INSET_Y = FLAG_INSET_Y;
  /* Marge des pièces (coins), en % du disque. Le pourtour est occupé par le
     listel — bord relevé de la frappe — où le motif ne s'imprime pas.
     Garder égal à `.coin-safe-zone { inset }` (conf-patches.css). */
  const COIN_INSET = 8;
  window.COIN_INSET = COIN_INSET;
  /* Décalage vertical de la zone, en % du disque. Positif = vers le bas.
     La pièce est centrée dans son image, mais le rendu 3D lui donne une
     épaisseur visible en partie basse : sans ce décalage, le motif paraît
     trop haut sur la frappe.
     Garder égal au `top`/`bottom` de `.coin-safe-zone` (conf-patches.css). */
  const COIN_OFFSET_Y = 1.5;
  window.COIN_OFFSET_Y = COIN_OFFSET_Y;
  /* Hauteur réservée au numéro en bas du verso, en % du disque. Le logo ne
     descend pas plus bas quand la numérotation est active, sinon il le
     recouvrirait. Doit couvrir le `bottom` de .coin-verso-number + sa hauteur. */
  const COIN_NUMBER_RESERVE = 22;
  window.COIN_NUMBER_RESERVE = COIN_NUMBER_RESERVE;
  /* Marge de la zone imprimable des patchs, en % du canvas. L'image du patch
     porte déjà un padding de 13% (.patch-shape-img) : la zone doit donc
     commencer plus bas, sinon elle tomberait hors du visuel.
     Garder égal à  (conf-coins.css). */
  const PATCH_INSET = 14;
  window.PATCH_INSET = PATCH_INSET;
  /* Rectangle : plus large que haut -> bornes verticales plus serrées. */
  const PATCH_INSET_RECT_Y = 27;
  window.PATCH_INSET_RECT_Y = PATCH_INSET_RECT_Y;

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
      // du patch). Ses % sont relatifs à ce conteneur, et il est borné à la
      // zone imprimable de la forme choisie (voir onPointerMove).
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
  // Exposé : clampCoinLogo() doit resynchroniser la tranche après un upload,
  // sinon la vue de côté garde l'échelle du visuel précédent.
  window.syncCoinCote = syncCoinCote;

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

    // PATCH : le logo reste dans la zone imprimable, comme les autres pièces.
    // Les marges suivent la forme choisie : le rectangle est plus large que
    // haut, ses bornes verticales sont donc plus serrées (cf. .patch-safe-zone
    // dans conf-coins.css — garder les deux jeux de valeurs alignés).
    const isPatchLogo = active && active.id === 'patch-logo';
    let pX0 = PATCH_INSET, pX1 = 100 - PATCH_INSET;
    let pY0 = PATCH_INSET, pY1 = 100 - PATCH_INSET;
    if (isPatchLogo && active.closest('.shape-rectangle')) {
      pY0 = PATCH_INSET_RECT_Y;
      pY1 = 100 - PATCH_INSET_RECT_Y;
    }

    // DRAPEAUX : le logo est positionné en % de .flag-img-3d, un conteneur
    // flex PLUS LARGE que le drapeau (l'image y est centrée). Se borner à
    // 0..100 % laissait donc le visuel sortir de l'image. On calcule les
    // bornes réelles de l'image dans son conteneur, puis on y ajoute la marge
    // de sécurité (ourlet de couture + œillets).
    const isFlagLogo = active && /^flag-logo-/.test(active.id || '');
    // Bornes par axe : en portrait l'image est contrainte par la HAUTEUR, donc
    // ses marges horizontales et verticales diffèrent — un jeu de bornes unique
    // serait faux sur l'un des deux axes.
    let fX0 = 0, fX1 = 100, fY0 = 0, fY1 = 100, flagMaxW = MAX_W;
    if (isFlagLogo) {
      const img = active.closest('.flag-img-3d')?.querySelector('.flag-base-img');
      if (img && bounds.width && bounds.height && img.offsetWidth && img.offsetHeight) {
        const xPct = (img.offsetLeft / bounds.width) * 100;
        const wPctImg = (img.offsetWidth / bounds.width) * 100;
        const yPct = (img.offsetTop / bounds.height) * 100;
        const hPctImg = (img.offsetHeight / bounds.height) * 100;
        fX0 = xPct + FLAG_INSET;
        fX1 = xPct + wPctImg - FLAG_INSET;
        fY0 = yPct + FLAG_INSET_Y;
        fY1 = yPct + hPctImg - FLAG_INSET_Y;
        flagMaxW = wPctImg - 2 * FLAG_INSET;
      } else {
        fX0 = FLAG_INSET;   fX1 = 100 - FLAG_INSET;
        fY0 = FLAG_INSET_Y; fY1 = 100 - FLAG_INSET_Y;
        flagMaxW = 100 - 2 * FLAG_INSET;
      }
    }

    // PIÈCES (coins) : le motif reste dans la zone frappée, le pourtour étant
    // occupé par le listel. Le disque est carré, la marge est donc symétrique.
    const isCoinLogo = active && /^coin-logo-/.test(active.id || '');
    const coinMin = COIN_INSET;
    const coinMax = 100 - COIN_INSET;
    // Bornes verticales décalées vers le bas (voir COIN_OFFSET_Y).
    const coinMinY = COIN_INSET + COIN_OFFSET_Y;
    // Verso numéroté : le bas est réservé au numéro.
    const coinHasNumber = isCoinLogo &&
      !!active.closest('.coin-disc.has-number');
    const coinMaxY = coinHasNumber
      ? Math.min(100 - COIN_INSET + COIN_OFFSET_Y, 100 - COIN_NUMBER_RESERVE)
      : (100 - COIN_INSET + COIN_OFFSET_Y);

    const MIN_POS = isPatchLogo ? pX0
      : (isFlagLogo ? fX0 : (isCoinLogo ? coinMin : 0));
    const MIN_POS_Y = isPatchLogo ? pY0
      : (isFlagLogo ? fY0 : (isCoinLogo ? coinMinY : 0));
    const maxPos = (sizePct) =>
      isPatchLogo ? (pX1 - sizePct)
        : (isFlagLogo ? (fX1 - sizePct) : ((isCoinLogo ? coinMax : 100) - sizePct));
    const maxPosY = (sizePct) =>
      isPatchLogo ? (pY1 - sizePct)
        : (isFlagLogo ? (fY1 - sizePct) : ((isCoinLogo ? coinMaxY : 100) - sizePct));
    // Le logo ne peut pas être plus large que la zone imprimable.
    const maxW = isFlagLogo ? flagMaxW
      : (isCoinLogo ? (coinMax - coinMin) : (isPatchLogo ? (pX1 - pX0) : MAX_W));

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

      /* DRAPEAUX : maxW ne borne que la LARGEUR. Un visuel très haut (ou tiré
         depuis une poignée nord/ouest, qui déplace aussi le logo) sortait donc
         encore de la zone en hauteur ou par un bord. On revérifie ici les trois
         dimensions — largeur, hauteur et position — après application. */
      if (isFlagLogo || isCoinLogo || isPatchLogo) {
        // Bornes de la zone selon la pièce en cours.
        var zX0 = isFlagLogo ? fX0 : (isPatchLogo ? pX0 : coinMin);
        var zX1 = isFlagLogo ? fX1 : (isPatchLogo ? pX1 : coinMax);
        var zY0 = isFlagLogo ? fY0 : (isPatchLogo ? pY0 : coinMinY);
        var zY1 = isFlagLogo ? fY1 : (isPatchLogo ? pY1 : coinMaxY);

        var wNow = parseFloat(active.style.width) || newW;
        var hNow = (active.offsetHeight / bounds.height) * 100;
        var zoneH = zY1 - zY0;
        if (hNow > zoneH && hNow > 0) {
          // Trop haut : on réduit la largeur d'autant, ratio conservé.
          wNow = wNow * (zoneH / hNow);
          active.style.width = wNow + '%';
          hNow = (active.offsetHeight / bounds.height) * 100;
        }
        var lNow = parseFloat(active.style.left);
        var tNow = parseFloat(active.style.top);
        if (isNaN(lNow)) lNow = zX0;
        if (isNaN(tNow)) tNow = zY0;
        active.style.left = Math.max(zX0, Math.min(zX1 - wNow, lNow)) + '%';
        active.style.top = Math.max(zY0, Math.min(zY1 - hNow, tNow)) + '%';
      }

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
      newTop = Math.max(MIN_POS_Y, Math.min(maxPosY(hPct), newTop));

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
    // Calque -> zone de contrainte. Toute zone absente d'ici n'est PAS bornée :
    // son logo peut sortir du gabarit d'impression.
    var TEXTILE_ZONE = {
      'logo-f': 'f', 'logo-fr': 'fr', 'logo-b': 'b',
      'logo-sl': 'sl', 'logo-sr': 'sr'
    };
    if (TEXTILE_ZONE[active.id] && typeof window.clampLogoToZone === 'function') {
      window.clampLogoToZone(TEXTILE_ZONE[active.id]);
    }
    // Le texte reste DANS sa zone horizontale (pas de sortie).
    if (active.classList.contains('design-text') && typeof window.clampTextToZone === 'function') {
      // id « text-<zone> » -> zone ; couvre f, fr et b sans énumération.
      var tz = (active.id || '').indexOf('text-') === 0 ? active.id.slice(5) : null;
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
    'logo-fr': 'fr',
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
        // id « text-<zone> » -> zone ; couvre f, fr et b sans énumération.
        var tzone = (active.id || '').indexOf('text-') === 0 ? active.id.slice(5) : null;
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
