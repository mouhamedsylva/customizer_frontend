/**
 * View Switcher - Gestion du changement de vue (face/dos/côté)
 */

function selView(btn, viewName) {
  // Retirer la classe 'on' de tous les boutons
  document.querySelectorAll('.vt').forEach(b => b.classList.remove('on'));
  
  // Ajouter 'on' au bouton cliqué
  btn.classList.add('on');
  
  // Retirer 'on' de toutes les images
  document.querySelectorAll('.product-img-single').forEach(img => {
    img.classList.remove('on');
  });

  // Afficher l'image correspondante
  const imageId = 'view-' + viewName;
  const targetImage = document.getElementById(imageId);

  if (targetImage) {
    targetImage.classList.add('on');
    console.log('✅ Vue changée vers:', viewName);
  } else {
    console.warn('⚠️ Image non trouvée:', imageId);
  }

  // Mettre à jour la couche des logos (n'affiche que les logos de la vue active)
  const logoLayer = document.getElementById('logo-layer');
  if (logoLayer) logoLayer.setAttribute('data-view', viewName);

  // La bascule gauche/droite n'a de sens qu'en vue de côté.
  if (typeof window.syncSideToggle === 'function') window.syncSideToggle(viewName);

  // Réévalue le bouton « Ajouter un texte » selon la vue (face/dos/côté).
  if (typeof refreshTextButton === 'function') refreshTextButton();
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  console.log('🖼️ View Switcher initialisé');
  
  // S'assurer que la vue de face est affichée par défaut
  const faceView = document.getElementById('view-face');
  if (faceView) {
    faceView.classList.add('on');
  }
});
