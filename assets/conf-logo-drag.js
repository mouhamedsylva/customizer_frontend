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

  const MIN_W = 6;       // largeur min du logo en % du canvas
  const MAX_W = 60;      // largeur max

  function getCanvas() {
    return document.querySelector('.cv-single-view');
  }

  // Largeur/hauteur actuelles du logo en % du canvas
  function logoSizePct(logo) {
    const wPct = parseFloat(logo.style.width) || 18;
    const r = logo.getBoundingClientRect();
    const b = bounds || getCanvas().getBoundingClientRect();
    const hPct = b.height ? (r.height / b.height) * 100 : wPct;
    return { wPct, hPct };
  }

  function onPointerDown(e) {
    const handle = e.target.closest('.logo-resize');
    const logo = e.target.closest('.design-logo');
    if (!logo) return;

    const canvas = getCanvas();
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

    if (mode === 'resize') {
      // Nouvelle largeur en % selon le déplacement horizontal
      let newW = startW + (dx / bounds.width) * 100;
      newW = Math.max(MIN_W, Math.min(MAX_W, newW));

      // Empêcher de dépasser le bord droit / bas
      const left = parseFloat(active.style.left) || 0;
      newW = Math.min(newW, 100 - left);
      active.style.width = newW + '%';

      // Si le logo dépasse en bas après agrandissement, on le remonte
      const { hPct } = logoSizePct(active);
      let top = parseFloat(active.style.top) || 0;
      if (top + hPct > 100) {
        active.style.top = Math.max(0, 100 - hPct) + '%';
      }
    } else {
      // Déplacement
      let newLeft = startLeft + (dx / bounds.width) * 100;
      let newTop = startTop + (dy / bounds.height) * 100;

      // Limites strictes : le logo (avec sa taille réelle) reste dans le canvas
      const { wPct, hPct } = logoSizePct(active);
      newLeft = Math.max(0, Math.min(100 - wPct, newLeft));
      newTop = Math.max(0, Math.min(100 - hPct, newTop));

      active.style.left = newLeft + '%';
      active.style.top = newTop + '%';
    }
    e.preventDefault();
  }

  function onPointerUp() {
    if (active) {
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
