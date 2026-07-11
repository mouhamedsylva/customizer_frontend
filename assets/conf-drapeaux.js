/**
 * Drapeaux - Layout et fonctions spécifiques
 */

// Template HTML pour la sidebar des Drapeaux
const DRAPEAUX_SIDEBAR_TEMPLATE = `
  <!-- 1. Type d'impression -->
  <div class="sec">
    <div class="sec-title">1. Type d'impression</div>
    <div class="sec-sub">Choisissez le type d'impression de votre drapeau</div>
    
    <div class="flag-type-options">
      <div class="flag-type-card active" data-type="recto-verso" onclick="selectFlagType(this)">
        <div class="flag-type-icon">
          <svg width="46" height="40" viewBox="0 0 46 40" fill="none" stroke="currentColor" stroke-width="1.6">
            <!-- Drapeau 1 -->
            <line x1="4" y1="6" x2="4" y2="34"/>
            <rect x="4" y="7" width="16" height="13" rx="1"/>
            <path d="M9 11 l2.5 2.5 L14 11" stroke-width="1.4"/>
            <!-- Drapeau 2 -->
            <line x1="26" y1="6" x2="26" y2="34"/>
            <rect x="26" y="7" width="16" height="13" rx="1"/>
            <path d="M31 11 l2.5 2.5 L36 11" stroke-width="1.4"/>
          </svg>
        </div>
        <div class="flag-type-info">
          <strong>Recto verso</strong>
          <span>Impression sublimée<br>sur les deux faces.</span>
        </div>
        <div class="flag-type-check">✓</div>
      </div>

      <div class="flag-type-card" data-type="recto-simple" onclick="selectFlagType(this)">
        <div class="flag-type-icon">
          <svg width="46" height="40" viewBox="0 0 46 40" fill="none" stroke="currentColor" stroke-width="1.6">
            <!-- Drapeau unique -->
            <line x1="8" y1="6" x2="8" y2="34"/>
            <rect x="8" y="7" width="22" height="15" rx="1"/>
            <path d="M15 12 l3 3 L21 12" stroke-width="1.4"/>
          </svg>
        </div>
        <div class="flag-type-info">
          <strong>Recto simple</strong>
          <span>Impression sublimée<br>sur une seule face.</span>
        </div>
        <div class="flag-type-check">✓</div>
      </div>
    </div>
  </div>

  <!-- 2. Orientation -->
  <div class="sec">
    <div class="sec-title">2. Orientation</div>
    <div class="sec-sub">Choisissez l'orientation de votre drapeau</div>
    
    <div class="flag-orientation-row">
      <div class="flag-orientation-card active" data-orientation="paysage" onclick="selectFlagOrientation(this)">
        <svg width="64" height="48" viewBox="0 0 64 48" fill="none">
          <!-- Mât -->
          <line x1="8" y1="6" x2="8" y2="44" stroke="#1a2b4a" stroke-width="2.4" stroke-linecap="round"/>
          <!-- Drapeau paysage rempli -->
          <rect x="8" y="9" width="44" height="26" rx="1.5" fill="#1f3a5f" stroke="#1f3a5f" stroke-width="1.5"/>
        </svg>
        <span>Paysage</span>
        <span class="flag-ori-sub">(horizontal)</span>
        <div class="flag-orientation-check">✓</div>
      </div>

      <div class="flag-orientation-card" data-orientation="portrait" onclick="selectFlagOrientation(this)">
        <svg width="48" height="56" viewBox="0 0 48 56" fill="none">
          <!-- Mât -->
          <line x1="8" y1="4" x2="8" y2="52" stroke="#9aa0aa" stroke-width="2.4" stroke-linecap="round"/>
          <!-- Drapeau portrait en contour -->
          <rect x="8" y="7" width="30" height="40" rx="1.5" fill="#fff" stroke="#9aa0aa" stroke-width="1.8"/>
        </svg>
        <span>Portrait</span>
        <span class="flag-ori-sub">(vertical)</span>
        <div class="flag-orientation-check">✓</div>
      </div>
    </div>
  </div>

  <!-- 2b. Couleur du fond -->
  <div class="sec">
    <div class="sec-title">Couleur du fond</div>
    <div class="sec-sub">Choisissez la couleur de fond du drapeau</div>

    <div class="flag-color-grid">
      <button class="flag-color-swatch active" title="Blanc" style="background:#ffffff;border:1.5px solid #ddd" onclick="selFlagColor(this,'#ffffff')"></button>
      <button class="flag-color-swatch" title="Noir" style="background:#1a1a1a" onclick="selFlagColor(this,'#1a1a1a')"></button>
      <button class="flag-color-swatch" title="Blanc cassé" style="background:#f5f2ed;border:1.5px solid #ddd" onclick="selFlagColor(this,'#f5f2ed')"></button>
      <button class="flag-color-swatch" title="Gris" style="background:#9e9e9e" onclick="selFlagColor(this,'#9e9e9e')"></button>
      <button class="flag-color-swatch" title="Gris foncé" style="background:#555555" onclick="selFlagColor(this,'#555555')"></button>
      <button class="flag-color-swatch" title="Gris ardoise" style="background:#607d8b" onclick="selFlagColor(this,'#607d8b')"></button>
      <button class="flag-color-swatch" title="Bleu marine" style="background:#1e3a5f" onclick="selFlagColor(this,'#1e3a5f')"></button>
      <button class="flag-color-swatch" title="Bleu ciel" style="background:#5bb8e8" onclick="selFlagColor(this,'#5bb8e8')"></button>
      <button class="flag-color-swatch" title="Vert foncé" style="background:#2e6b45" onclick="selFlagColor(this,'#2e6b45')"></button>
      <button class="flag-color-swatch" title="Rose clair" style="background:#f0c8d8;border:1.5px solid #e0afc4" onclick="selFlagColor(this,'#f0c8d8')"></button>
      <button class="flag-color-swatch" title="Rose" style="background:#e8729a" onclick="selFlagColor(this,'#e8729a')"></button>
      <button class="flag-color-swatch" title="Rouge" style="background:#c0392b" onclick="selFlagColor(this,'#c0392b')"></button>
      <button class="flag-color-swatch" title="Orange" style="background:#e8842a" onclick="selFlagColor(this,'#e8842a')"></button>
      <button class="flag-color-swatch" title="Jaune" style="background:#f5c842;border:1.5px solid #d4aa20" onclick="selFlagColor(this,'#f5c842')"></button>
      <button class="flag-color-swatch" title="Violet" style="background:#9b6bb5" onclick="selFlagColor(this,'#9b6bb5')"></button>
      <button class="flag-color-swatch" title="Marron" style="background:#7d4e2d" onclick="selFlagColor(this,'#7d4e2d')"></button>
    </div>
  </div>

  <!-- 3. Taille -->
  <div class="sec">
    <div class="sec-title">3. Taille</div>
    <div class="sec-sub">Choisissez la taille de votre drapeau</div>
    
    <div class="flag-size-options">
      <div class="flag-size-card active" data-size="90x150" onclick="selectFlagSize(this)">
        <strong>90 x 150 cm</strong>
        <span>Format standard</span>
        <div class="flag-size-check">✓</div>
      </div>
      
      <div class="flag-size-card" data-size="100x100" onclick="selectFlagSize(this)">
        <strong>1 x 1 m</strong>
        <span>Format carré</span>
        <div class="flag-size-check">✓</div>
      </div>
      
      <div class="flag-size-card" data-size="custom" onclick="selectFlagSize(this)">
        <strong>Personnalisé</strong>
        <span>Sur mesure</span>
        <div class="flag-size-check">✓</div>
      </div>
    </div>
    
    <div class="flag-custom-note">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#999"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
      Pour une taille personnalisée, contactez-nous afin de voir ensemble les possibilités.
    </div>
    
    <button class="flag-contact-btn" onclick="contactForCustomSize()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
      CONTACTEZ-NOUS
    </button>
  </div>

  <!-- 4. Ajoutez vos designs -->
  <div class="sec">
    <div class="sec-title">4. Ajoutez vos designs</div>
    <div class="sec-sub">Ajoutez vos logos, textes ou visuels</div>
    
    <div class="flag-upload-zones">
      <div class="flag-upload-zone">
        <div class="flag-upload-label">Design recto</div>
        <div class="flag-upload-box-small" onclick="document.getElementById('uf-recto').click()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#999">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          <p><strong>Télécharger<br>un fichier</strong></p>
          <span>PNG, JPG, SVG ou PDF<br>Taille max. 50 Mo</span>
        </div>
        <input type="file" id="uf-recto" style="display:none" accept="image/*,.pdf" onchange="doUpload(event,'flag-recto')">
        <button class="flag-remove-btn" id="flag-remove-recto" style="display:none" onclick="removeFlagDesign('recto')">🗑 Supprimer</button>
      </div>

      <div class="flag-upload-zone">
        <div class="flag-upload-label">Design verso</div>
        <div class="flag-upload-box-small" onclick="document.getElementById('uf-verso').click()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#999">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          <p><strong>Télécharger<br>un fichier</strong></p>
          <span>PNG, JPG, SVG ou PDF<br>Taille max. 50 Mo</span>
        </div>
        <input type="file" id="uf-verso" style="display:none" accept="image/*,.pdf" onchange="doUpload(event,'flag-verso')">
        <button class="flag-remove-btn" id="flag-remove-verso" style="display:none" onclick="removeFlagDesign('verso')">🗑 Supprimer</button>
      </div>
    </div>
    
    <div class="flag-design-tips">
      <p><svg width="12" height="12" viewBox="0 0 24 24" fill="#666"><path d="M13 7h-2v2h2V7zm0 4h-2v6h2v-6z"/><circle cx="12" cy="12" r="10" fill="none" stroke="#666" stroke-width="2"/></svg> Conseils pour un rendu optimal</p>
      <ul>
        <li>Utilisez des fichiers en haute résolution</li>
        <li>Les couleurs vives rendent mieux en sublimation</li>
      </ul>
    </div>
  </div>

  <!-- 5. Options -->
  <div class="sec">
    <div class="sec-title">5. Options</div>
    <div class="sec-sub">Personnalisez la finition de votre drapeau</div>
    
    <div class="flag-options-section">
      <div class="flag-option-item active" data-anneaux="2" onclick="selectAnneaux(this)">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="8" cy="12" r="2.6"/>
          <circle cx="16" cy="12" r="2.6"/>
        </svg>
        <div>
          <strong>2 anneaux</strong>
          <span>Finition par 2 anneaux</span>
        </div>
        <div class="flag-option-check">✓</div>
      </div>
      
      <div class="flag-option-item" data-anneaux="4" onclick="selectAnneaux(this)">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="7" cy="8" r="2.2"/>
          <circle cx="17" cy="8" r="2.2"/>
          <circle cx="7" cy="16" r="2.2"/>
          <circle cx="17" cy="16" r="2.2"/>
        </svg>
        <div>
          <strong>4 anneaux</strong>
          <span>Finition par 4 anneaux</span>
        </div>
        <div class="flag-option-check">✓</div>
      </div>
    </div>
    
    <div class="flag-material-section">
      <div class="flag-material-label">Matière</div>
      <div class="flag-material-card active">
        <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="13" fill="#e9ebee" stroke="#c2c7cf" stroke-width="1.5"/>
          <path d="M8 12h16M8 16h16M8 20h16" stroke="#b3b9c2" stroke-width="1.3"/>
          <path d="M12 8v16M16 8v16M20 8v16" stroke="#b3b9c2" stroke-width="1.3"/>
        </svg>
        <div>
          <strong>Maille polyester 110g/m²</strong>
          <span>Tissu léger, parfait pour usage intérieur et extérieur</span>
        </div>
      </div>
    </div>
  </div>
`;

// ========================================
// Fonctions pour les interactions Drapeaux
// ========================================

// Sélection du type d'impression
function selectFlagType(element) {
  document.querySelectorAll('.flag-type-card').forEach(card => {
    card.classList.remove('active');
  });
  element.classList.add('active');

  const type = element.getAttribute('data-type');
  console.log('📄 Type d\'impression:', type);

  // Afficher/masquer la zone verso (sidebar)
  const versoZone = document.querySelector('.flag-upload-zone:nth-child(2)');
  if (versoZone) {
    versoZone.style.display = type === 'recto-verso' ? 'flex' : 'none';
  }

  // Afficher/masquer le mock VERSO dans le canvas
  const versoMock = document.getElementById('flag-verso');
  if (versoMock) {
    versoMock.style.display = type === 'recto-verso' ? '' : 'none';
  }

  // Mettre à jour le récap
  const recapType = document.getElementById('flag-recap-type');
  if (recapType) {
    recapType.textContent = type === 'recto-verso' ? 'Recto verso' : 'Recto simple';
  }
}

// Sélection de l'orientation
function selectFlagOrientation(element) {
  document.querySelectorAll('.flag-orientation-card').forEach(card => {
    card.classList.remove('active');
  });
  element.classList.add('active');

  const orientation = element.getAttribute('data-orientation');
  window.__flagOrientation = orientation;
  changeFlagOrientation(orientation);

  // Échange les images du drapeau (paysage <-> portrait).
  refreshFlagImages();

  // Mettre à jour le récap
  const recapOri = document.getElementById('flag-recap-orientation');
  if (recapOri) {
    recapOri.textContent = orientation === 'portrait' ? 'Portrait' : 'Paysage';
  }

  console.log('🔄 Orientation:', orientation);
}

/* Choisit et applique les images recto/verso du drapeau selon l'état courant :
   orientation (paysage/portrait) + nombre d'anneaux (2/4). Repli sur paysage si
   une image portrait manque. */
function refreshFlagImages() {
  const A = window.ASSET_URLS || {};
  const isPortrait = (window.__flagOrientation === 'portrait');
  const is4 = (window.__flagAnneaux === '4');

  var recto, verso;
  if (isPortrait) {
    recto = is4 ? (A.flag4anRectoPortrait || A.flagRectoPortrait) : A.flagRectoPortrait;
    verso = is4 ? (A.flag4anVersoPortrait || A.flagVersoPortrait) : A.flagVersoPortrait;
    // Repli paysage si portrait indisponible.
    recto = recto || (is4 ? (A.flag4anRecto || A.flagRecto) : A.flagRecto);
    verso = verso || (is4 ? (A.flag4anVerso || A.flagVerso) : A.flagVerso);
  } else {
    recto = is4 ? (A.flag4anRecto || A.flagRecto) : A.flagRecto;
    verso = is4 ? (A.flag4anVerso || A.flagVerso) : A.flagVerso;
  }

  var baseRecto = document.getElementById('flag-base-recto');
  var baseVerso = document.getElementById('flag-base-verso');
  if (baseRecto && recto) swapFlagImage(baseRecto, recto);
  if (baseVerso && verso) swapFlagImage(baseVerso, verso);

  // Réapplique le format (proportions) après un éventuel changement d'image.
  if (typeof applyFlagSizeToImages === 'function') {
    setTimeout(applyFlagSizeToImages, 60);
  }
  // Met à jour la vignette du récap (fond recto + logo).
  if (typeof window.updateFlagRecapThumb === 'function') {
    setTimeout(window.updateFlagRecapThumb, 80);
  }
  // Réapplique la couleur de fond (le masque suit la nouvelle image).
  setTimeout(applyFlagColorToLayers, 90);
}

/* Applique la couleur de fond courante à tous les calques .flag-color-layer.
   - background = couleur choisie (teinte via mix-blend-mode: multiply)
   - mask = image de base du drapeau (le calque épouse la silhouette).
   Couleur blanche (#ffffff) = pas de teinte visible (drapeau blanc d'origine). */
function applyFlagColorToLayers() {
  var color = window.__flagColor || '#ffffff';
  document.querySelectorAll('.flag-color-layer').forEach(function (layer) {
    layer.style.background = color;
    // Masque : image de base correspondant à la face (recto/verso).
    var face = layer.getAttribute('data-face') || 'recto';
    var baseImg = document.getElementById('flag-base-' + face);
    var src = baseImg ? baseImg.getAttribute('src') : '';
    if (src) {
      var maskUrl = 'url("' + src + '")';
      layer.style.webkitMaskImage = maskUrl;
      layer.style.maskImage = maskUrl;
    }
  });
}

// Sélection de la couleur de fond du drapeau
function selFlagColor(element, hex) {
  document.querySelectorAll('.flag-color-swatch').forEach(function (s) {
    s.classList.remove('active');
  });
  if (element) element.classList.add('active');

  window.__flagColor = hex;
  applyFlagColorToLayers();

  // Persistance (récupérée au rechargement / partage).
  try { sessionStorage.setItem('conf_flag_color', hex); } catch (e) {}

  // Vignette récap : la couleur doit s'y refléter aussi.
  if (typeof window.updateFlagRecapThumb === 'function') {
    setTimeout(window.updateFlagRecapThumb, 40);
  }
  console.log('🎨 Couleur drapeau:', hex);
}

// Changer l'orientation des drapeaux du canvas
function changeFlagOrientation(orientation) {
  document.querySelectorAll('.flag-wave').forEach(wave => {
    wave.classList.remove('orientation-paysage', 'orientation-portrait');
    wave.classList.add('orientation-' + orientation);
  });
  // Marque aussi la SCÈNE 3D pour contraindre l'image réelle (portrait = hauteur
  // limitée, sinon l'image verticale déborde et se coupe en bas).
  var stage = document.querySelector('.flag-stage');
  if (stage) {
    stage.classList.remove('orientation-paysage', 'orientation-portrait');
    stage.classList.add('orientation-' + orientation);
  }
}

// Sélection de la taille
function selectFlagSize(element) {
  document.querySelectorAll('.flag-size-card').forEach(card => {
    card.classList.remove('active');
  });
  element.classList.add('active');

  const size = element.getAttribute('data-size');
  const sizeLabels = {
    '90x150': '90 x 150 cm',
    '100x100': '1 x 1 m',
    'custom': 'Sur mesure'
  };
  const recapSize = document.getElementById('flag-recap-size');
  if (recapSize) {
    recapSize.textContent = sizeLabels[size] || size;
  }

  // Appliquer le format au canvas (change le ratio des drapeaux)
  changeFlagSize(size);

  console.log('📏 Taille:', size);
}

// Changer le format/ratio des drapeaux du canvas
function changeFlagSize(size) {
  window.__flagSize = size;
  document.querySelectorAll('.flag-wave').forEach(wave => {
    wave.classList.remove('size-90x150', 'size-100x100', 'size-custom');
    wave.classList.add('size-' + size);
  });
  // Applique aussi le format à l'image 3D (change ses proportions).
  applyFlagSizeToImages();
}

/* Ajuste la TAILLE (échelle uniforme) de l'image du drapeau selon le format
   choisi. Scale uniforme -> pas de déformation de l'image réelle. Chaque format
   a son facteur : 1x1m plus compact, 90x150 standard, custom plus grand. */
function applyFlagSizeToImages() {
  var size = window.__flagSize || '90x150';
  // Facteur d'échelle par format (uniforme, sans déformer).
  var scales = { '90x150': 1.0, '100x100': 0.88, 'custom': 1.12 };
  var scale = scales[size] || 1.0;

  document.querySelectorAll('.flag-base-img').forEach(function (img) {
    img.style.transform = 'scale(' + scale.toFixed(3) + ')';
    img.style.transformOrigin = 'top left';
    img.style.transition = 'transform .25s ease';
  });
}

// Bouton contact taille personnalisée
function contactForCustomSize() {
  var msg = 'Email : contact@exemple.com\nTél : 01 XX XX XX XX';
  if (window.confAlert) window.confAlert(msg, { icon: 'info', title: 'Taille personnalisée' });
  else alert('Contactez-nous pour une taille personnalisée.\n' + msg);
}

// Sélection des anneaux
function selectAnneaux(element) {
  document.querySelectorAll('.flag-option-item').forEach(item => {
    item.classList.remove('active');
  });
  element.classList.add('active');

  const anneaux = element.getAttribute('data-anneaux');
  window.__flagAnneaux = anneaux;
  console.log('⭕ Anneaux:', anneaux);

  // Afficher 2 ou 4 anneaux sur les drapeaux codés (vue 2D)
  document.querySelectorAll('.flag-wave').forEach(wave => {
    wave.classList.toggle('grommets-4', anneaux === '4');
  });

  // Échanger les images réelles selon anneaux + orientation courante.
  refreshFlagImages();

  // Mettre à jour le récap
  const recapAnneaux = document.getElementById('flag-recap-anneaux');
  if (recapAnneaux) {
    recapAnneaux.textContent = anneaux + ' anneaux';
  }
}

// Change l'image d'un drapeau avec une transition (fondu + zoom)
function swapFlagImage(imgEl, newSrc) {
  if (!imgEl || !newSrc) return;

  // Déjà la bonne image : ne rien faire
  if (imgEl.src && imgEl.src.indexOf(newSrc) !== -1) return;

  // Fondu sortant
  imgEl.classList.add('swapping');

  // Précharger la nouvelle image puis l'afficher en fondu entrant
  const preload = new Image();
  preload.onload = () => {
    imgEl.src = newSrc;
    // Laisser le navigateur appliquer la nouvelle src avant de retirer la classe
    requestAnimationFrame(() => {
      requestAnimationFrame(() => imgEl.classList.remove('swapping'));
    });
  };
  preload.onerror = () => imgEl.classList.remove('swapping');
  preload.src = newSrc;
}

// Changement de vue Aperçu 3D / Aperçu 2D
function switchFlagView(view) {
  document.querySelectorAll('.flag-view-btn').forEach(btn => btn.classList.remove('active'));
  if (typeof event !== 'undefined' && event.target) {
    event.target.classList.add('active');
  }

  const stage = document.getElementById('flag-stage');
  if (stage) {
    stage.classList.toggle('view-2d', view === '2d');
  }

  console.log('👁️ Vue:', view);
}


// Changement de quantité
function changeFlagQty(delta) {
  const input = document.getElementById('flag-qty-input');
  if (!input) return;
  
  let qty = parseInt(input.value) || 1;
  qty += delta;
  
  // Minimum 1
  if (qty < 1) qty = 1;
  
  input.value = qty;
  console.log('📦 Quantité:', qty);
}

// Gestion de l'input quantité
function handleFlagQtyInput() {
  const input = document.getElementById('flag-qty-input');
  if (!input) return;

  let qty = parseInt(input.value) || 1;

  // Minimum 1
  if (qty < 1) {
    qty = 1;
    input.value = qty;
  }

  console.log('📦 Quantité:', qty);
}

// Supprime le design uploadé d'une face du drapeau (recto / verso)
function removeFlagDesign(face) {
  // Retirer de la persistance
  if (typeof removeUpload === 'function') removeUpload('flag-' + face);

  const wrap = document.getElementById('flag-' + face);
  if (wrap) {
    // Vider les images design (3D + 2D) et réafficher les placeholders
    wrap.querySelectorAll('.flag-design-img').forEach(img => { img.src = ''; img.style.display = 'none'; });
    wrap.querySelectorAll('.flag-canvas-placeholder').forEach(ph => ph.style.display = '');
  }

  // Cacher + réinitialiser le logo déplaçable (vue 3D)
  const dragLogo = document.getElementById('flag-logo-' + face);
  if (dragLogo) {
    dragLogo.style.display = 'none';
    dragLogo.style.left = '28%';
    dragLogo.style.top = '32%';
    dragLogo.style.width = '44%';
  }

  // Réinitialiser l'input fichier + cacher le bouton supprimer
  const input = document.getElementById('uf-' + face);
  if (input) input.value = '';
  const removeBtn = document.getElementById('flag-remove-' + face);
  if (removeBtn) removeBtn.style.display = 'none';

  // Réinitialiser la miniature du récap (recto uniquement)
  if (face === 'recto') {
    const recapThumb = document.getElementById('flag-recap-thumb');
    if (recapThumb) {
      recapThumb.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 24 24" fill="#ccc">
          <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
        </svg>`;
    }
  }
}
