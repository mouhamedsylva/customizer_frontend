/**
 * Patchs / Coins métalliques - Layout et fonctions spécifiques
 * Interface "CUSTOM COINS" : pièce métallique avec 3 vues (recto / verso / côté)
 */

// ========================================
// Sidebar gauche
// ========================================
const PATCHES_SIDEBAR_TEMPLATE = `
  <!-- 1. Type de personnalisation -->
  <div class="sec">
    <div class="sec-title">1. Type de personnalisation</div>
    <div class="sec-sub">Choisissez le type de coin</div>

    <div class="coin-type-options">
      <div class="coin-type-card active" data-type="recto-verso" onclick="selectCoinType(this)">
        <div class="coin-type-icon">
          <svg width="44" height="26" viewBox="0 0 44 26" fill="none">
            <circle cx="13" cy="13" r="11" fill="#f0f1f3" stroke="#c2c7cf" stroke-width="1.5"/>
            <text x="13" y="17" font-size="9" font-weight="700" fill="#8a909a" text-anchor="middle">B</text>
            <circle cx="31" cy="13" r="11" fill="#f0f1f3" stroke="#c2c7cf" stroke-width="1.5"/>
            <circle cx="31" cy="13" r="5" fill="none" stroke="#8a909a" stroke-width="1.3"/>
          </svg>
        </div>
        <div class="coin-type-info">
          <strong>Recto verso</strong>
          <span>Personnalisez les deux faces de votre coin.</span>
        </div>
        <div class="coin-type-check">✓</div>
      </div>

      <div class="coin-type-card" data-type="recto-simple" onclick="selectCoinType(this)">
        <div class="coin-type-icon">
          <svg width="44" height="26" viewBox="0 0 44 26" fill="none">
            <circle cx="22" cy="13" r="11" fill="#f0f1f3" stroke="#c2c7cf" stroke-width="1.5"/>
            <circle cx="22" cy="13" r="5" fill="none" stroke="#8a909a" stroke-width="1.3"/>
          </svg>
        </div>
        <div class="coin-type-info">
          <strong>Recto simple</strong>
          <span>Personnalisez uniquement le recto.</span>
        </div>
        <div class="coin-type-check">✓</div>
      </div>

      <div class="coin-type-card" data-type="recto-verso-num" onclick="selectCoinType(this)">
        <div class="coin-type-icon">
          <svg width="44" height="26" viewBox="0 0 44 26" fill="none">
            <circle cx="14" cy="14" r="10" fill="#e7e9ed" stroke="#c2c7cf" stroke-width="1.4"/>
            <circle cx="19" cy="11" r="10" fill="#f0f1f3" stroke="#c2c7cf" stroke-width="1.4"/>
            <text x="19" y="15" font-size="8" font-weight="700" fill="#8a909a" text-anchor="middle">001</text>
          </svg>
        </div>
        <div class="coin-type-info">
          <strong>Recto verso numéroté</strong>
          <span>Personnalisez les deux faces, le verso sera numéroté.</span>
        </div>
        <div class="coin-type-check">✓</div>
      </div>
    </div>
  </div>

  <!-- Numérotation -->
  <div class="sec" id="coin-numbering-sec" style="display:none;">
    <div class="sec-title">Numérotation</div>
    <div class="sec-sub">Définissez la quantité et le numéro de départ</div>

    <div class="coin-numbering-row">
      <div class="coin-num-field">
        <label>Quantité (min. 50)</label>
        <div class="coin-num-qty">
          <button class="coin-num-btn" onclick="changeCoinQty(-10)">−</button>
          <input type="number" id="coin-num-qty-input" value="50" min="50" onchange="handleCoinQtyInput()">
          <button class="coin-num-btn" onclick="changeCoinQty(10)">+</button>
        </div>
        <span class="coin-num-note">Minimum 50 unités</span>
      </div>
      <div class="coin-num-field">
        <label>Numéro de départ</label>
        <input type="text" id="coin-num-start" class="coin-num-start" value="001">
      </div>
    </div>
  </div>

  <!-- Ajouter vos logos -->
  <div class="sec">
    <div class="sec-title">Ajouter vos logos</div>
    <div class="sec-sub">Téléchargez vos fichiers ou ajoutez votre design pour chaque face.</div>

    <div class="coin-upload-zones">
      <div class="coin-upload-zone">
        <div class="coin-upload-label">Logo recto</div>
        <div class="coin-upload-box" onclick="document.getElementById('uc-recto').click()">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">
            <path d="M12 16V4M7 9l5-5 5 5"/>
            <path d="M5 20h14"/>
          </svg>
          <p><strong>Télécharger un fichier</strong></p>
          <span>PNG, JPG, SVG ou PDF<br>Taille max. 10 Mo</span>
        </div>
        <input type="file" id="uc-recto" style="display:none" accept="image/*,.pdf" onchange="doUpload(event,'coin-recto')">
        <button class="coin-remove-btn" id="coin-remove-recto" style="display:none" onclick="removeCoinLogo('recto')">🗑 Supprimer</button>
      </div>

      <div class="coin-upload-zone" id="coin-upload-verso">
        <div class="coin-upload-label">Logo verso</div>
        <div class="coin-upload-box" onclick="document.getElementById('uc-verso').click()">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">
            <path d="M12 16V4M7 9l5-5 5 5"/>
            <path d="M5 20h14"/>
          </svg>
          <p><strong>Télécharger un fichier</strong></p>
          <span>PNG, JPG, SVG ou PDF<br>Taille max. 10 Mo</span>
        </div>
        <input type="file" id="uc-verso" style="display:none" accept="image/*,.pdf" onchange="doUpload(event,'coin-verso')">
        <button class="coin-remove-btn" id="coin-remove-verso" style="display:none" onclick="removeCoinLogo('verso')">🗑 Supprimer</button>
      </div>
    </div>
  </div>

  <!-- 2. Forme & Taille -->
  <div class="sec">
    <div class="sec-title">2. Forme & Taille</div>
    <div class="sec-sub">Choisissez la forme et la taille de votre coin</div>

    <div class="coin-shape-row">
      <div class="coin-shape-card active" data-shape="rond" onclick="selectCoinShape(this)">
        <span class="coin-shape-dot"></span>
        <span>Rond</span>
      </div>
      <div class="coin-shape-card" data-shape="decoupe" onclick="selectCoinShape(this)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <path d="M12 2l2 2 3-1 1 3 3 1-1 3 2 2-2 2 1 3-3 1-1 3-3-1-2 2-2-2-3 1-1-3-3-1 1-3-2-2 2-2-1-3 3-1 1-3 3 1z"/>
        </svg>
        <span>Découpé à la forme</span>
      </div>
    </div>

    <div class="coin-size-row">
      <div class="coin-size-card" data-size="25mm" onclick="selectCoinSize(this)">25 mm</div>
      <div class="coin-size-card active" data-size="30mm" onclick="selectCoinSize(this)">30 mm</div>
      <div class="coin-size-card" data-size="38mm" onclick="selectCoinSize(this)">38 mm</div>
      <div class="coin-size-card" data-size="50mm" onclick="selectCoinSize(this)">50 mm</div>
    </div>
  </div>

  <!-- 3. Finition métallique -->
  <div class="sec">
    <div class="sec-title">3. Finition métallique</div>
    <div class="sec-sub">Choisissez la finition de votre coin</div>

    <div class="coin-finish-row">
      <div class="coin-finish-card" data-finish="or" data-color="#d4af37" onclick="selectCoinFinish(this)">
        <span class="coin-finish-swatch" style="background:linear-gradient(135deg,#f5d76e,#c9a227);"></span>
        <span>Or brillant</span>
      </div>
      <div class="coin-finish-card" data-finish="argent" data-color="#c8ccd0" onclick="selectCoinFinish(this)">
        <span class="coin-finish-swatch" style="background:linear-gradient(135deg,#eef0f2,#b4b9be);"></span>
        <span>Argent brillant</span>
      </div>
      <div class="coin-finish-card" data-finish="nickel" data-color="#3a3d42" onclick="selectCoinFinish(this)">
        <span class="coin-finish-swatch" style="background:linear-gradient(135deg,#5a5e64,#2b2d31);"></span>
        <span>Nickel noir</span>
      </div>
      <div class="coin-finish-card" data-finish="bronze" data-color="#a97142" onclick="selectCoinFinish(this)">
        <span class="coin-finish-swatch" style="background:linear-gradient(135deg,#c98a4f,#8a5a2b);"></span>
        <span>Bronze antique</span>
      </div>
      <div class="coin-finish-card" data-finish="cuivre" data-color="#b87333" onclick="selectCoinFinish(this)">
        <span class="coin-finish-swatch" style="background:linear-gradient(135deg,#d98c4a,#a35a25);"></span>
        <span>Cuivre antique</span>
      </div>
    </div>
  </div>

  <!-- 4. Surface -->
  <div class="sec">
    <div class="sec-title">4. Surface</div>
    <div class="sec-sub">Choisissez le type de surface de votre coin</div>

    <div class="coin-surface-row">
      <div class="coin-surface-card active" data-surface="plat" onclick="selectCoinSurface(this)">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <circle cx="12" cy="12" r="9"/>
          <circle cx="12" cy="12" r="4"/>
        </svg>
        <div>
          <strong>Imprimé sans relief</strong>
          <span>Impression plate, sans relief.</span>
        </div>
      </div>
      <div class="coin-surface-card" data-surface="relief" onclick="selectCoinSurface(this)">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18"/>
        </svg>
        <div>
          <strong>Relief 3D</strong>
          <span>Motifs en relief avec profondeur.</span>
        </div>
      </div>
    </div>
  </div>
`;

// ========================================
// Fonctions d'interaction
// ========================================

// Type de personnalisation
function selectCoinType(el) {
  document.querySelectorAll('.coin-type-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');

  const type = el.getAttribute('data-type');
  window.__coinType = type;

  // Numérotation visible uniquement pour "recto verso numéroté"
  const numSec = document.getElementById('coin-numbering-sec');
  if (numSec) numSec.style.display = (type === 'recto-verso-num') ? 'block' : 'none';

  // Logo verso visible sauf en "recto simple"
  const versoUpload = document.getElementById('coin-upload-verso');
  if (versoUpload) versoUpload.style.display = (type === 'recto-simple') ? 'none' : 'flex';

  // Vue verso/côté dans le canvas selon le type
  const versoView = document.querySelector('.coin-view[data-view="verso"]');
  if (versoView) versoView.style.display = (type === 'recto-simple') ? 'none' : 'flex';

  // Numéro sur le verso : visible uniquement en "recto verso numéroté"
  updateCoinNumber();

  // Récap
  const recapType = document.getElementById('coin-recap-type');
  if (recapType) {
    const labels = {
      'recto-verso': 'Recto verso',
      'recto-simple': 'Recto simple',
      'recto-verso-num': 'Recto verso numéroté'
    };
    recapType.textContent = labels[type] || 'Recto verso';
  }
}

// Affiche/masque et met à jour le numéro gravé sur le VERSO du coin.
function updateCoinNumber() {
  const numEl = document.getElementById('coin-verso-number');
  if (!numEl) return;
  const type = window.__coinType || 'recto-verso';
  const input = document.getElementById('coin-num-start');
  const val = input ? String(input.value || '').trim() : '';

  if (type === 'recto-verso-num' && val) {
    numEl.textContent = val;
    numEl.style.display = 'block';
  } else {
    numEl.style.display = 'none';
  }
}

// Met à jour le numéro en temps réel quand on modifie le champ "Numéro de départ".
document.addEventListener('input', function (e) {
  if (e.target && e.target.id === 'coin-num-start') updateCoinNumber();
});

// Forme
function selectCoinShape(el) {
  document.querySelectorAll('.coin-shape-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');

  const shape = el.getAttribute('data-shape');
  document.querySelectorAll('.coin-disc').forEach(d => {
    d.classList.toggle('shape-decoupe', shape === 'decoupe');
  });

  const recapShape = document.getElementById('coin-recap-shape');
  if (recapShape) recapShape.textContent = (shape === 'decoupe') ? 'Découpé à la forme' : 'Rond';
}

// Taille
function selectCoinSize(el) {
  document.querySelectorAll('.coin-size-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');

  const size = el.getAttribute('data-size');
  const mm = parseInt(String(size).replace('mm', ''), 10) || 30;

  const recapSize = document.getElementById('coin-recap-size');
  if (recapSize) recapSize.textContent = mm + ' mm';

  // Redimensionne visuellement les disques (recto/verso/côté) selon le diamètre.
  applyCoinDiameterScale(mm);
}

/* Échelle visuelle des coins selon le diamètre en mm.
   Référence 38mm = 1.0 ; 25mm ~0.78, 30mm ~0.86, 50mm ~1.18 (bornée). */
function applyCoinDiameterScale(mm) {
  var scale = Math.max(0.72, Math.min(1.25, mm / 38));
  document.querySelectorAll('.coin-disc, .coin-edge').forEach(function (elm) {
    elm.style.transform = 'scale(' + scale.toFixed(3) + ')';
    elm.style.transformOrigin = 'center center';
    elm.style.transition = 'transform .2s ease';
  });
}

// Mapping finition → slug d'image
const FINISH_IMAGE_SLUGS = {
  'or':     'or',
  'argent': 'argent',
  'nickel': 'nickel',
  'bronze': 'bronze',
  'cuivre': 'cuivre'
};

// Finition métallique
function selectCoinFinish(el) {
  document.querySelectorAll('.coin-finish-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');

  const finish = el.getAttribute('data-finish');

  const labels = {
    'or': 'Or brillant', 'argent': 'Argent brillant', 'nickel': 'Nickel noir',
    'bronze': 'Bronze antique', 'cuivre': 'Cuivre antique'
  };

  // Swap des images pour les 3 vues
  ['recto', 'verso', 'cote'].forEach(view => {
    const imgEl = document.getElementById('coin-base-' + view);
    if (!imgEl) return;

    const key = 'patch-' + view + '-' + finish;
    const url = window.COIN_IMAGE_URLS?.[key];

    if (url) {
      imgEl.src = url;
    } else {
      console.warn('Image introuvable pour la clé :', key);
    }
  });

  // Mise à jour du récap
  const recapFinish = document.getElementById('coin-recap-finish');
  if (recapFinish) recapFinish.textContent = labels[finish] || finish;

  // Vignette du récap (disque + logo) : la finition change l'image du disque.
  if (typeof window.updateCoinRecapThumb === 'function') window.updateCoinRecapThumb();
}

// Surface
function selectCoinSurface(el) {
  document.querySelectorAll('.coin-surface-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// Quantité (numérotation)
function changeCoinQty(delta) {
  const input = document.getElementById('coin-num-qty-input');
  if (!input) return;
  let qty = parseInt(input.value) || 50;
  qty += delta;
  if (qty < 50) qty = 50;
  input.value = qty;
  syncCoinRecapQty(qty);
}

function handleCoinQtyInput() {
  const input = document.getElementById('coin-num-qty-input');
  if (!input) return;
  let qty = parseInt(input.value) || 50;
  if (qty < 50) { qty = 50; input.value = qty; }
  syncCoinRecapQty(qty);
}

// Synchronise la quantité avec le récap à droite
function syncCoinRecapQty(qty) {
  const recapQty = document.getElementById('coin-recap-qty-input');
  if (recapQty) recapQty.value = qty;
}

// Quantité côté récap
function changeCoinRecapQty(delta) {
  const input = document.getElementById('coin-recap-qty-input');
  if (!input) return;
  let qty = parseInt(input.value) || 50;
  qty += delta;
  if (qty < 50) qty = 50;
  input.value = qty;
  const sideQty = document.getElementById('coin-num-qty-input');
  if (sideQty) sideQty.value = qty;
}

function handleCoinRecapQtyInput() {
  const input = document.getElementById('coin-recap-qty-input');
  if (!input) return;
  let qty = parseInt(input.value) || 50;
  if (qty < 50) { qty = 50; input.value = qty; }
  const sideQty = document.getElementById('coin-num-qty-input');
  if (sideQty) sideQty.value = qty;
}

// Changement de vue 3D / 2D
function switchCoinView(view) {
  document.querySelectorAll('.coin-view-btn').forEach(b => b.classList.remove('active'));
  if (typeof event !== 'undefined' && event.target) event.target.classList.add('active');

  const stage = document.getElementById('coin-stage');
  if (stage) stage.classList.toggle('view-2d', view === '2d');
}


// ← AJOUT : initialise les images du canvas avec les neutres au chargement
function initCoinBaseImages() {
  const neutrals = {
    'recto': window.ASSET_URLS?.patchRecto,
    'verso': window.ASSET_URLS?.patchVerso,
    'cote':  window.ASSET_URLS?.patchCote
  };
  ['recto', 'verso', 'cote'].forEach(view => {
    const imgEl = document.getElementById('coin-base-' + view);
    if (imgEl && neutrals[view]) imgEl.src = neutrals[view];
  });
}

document.addEventListener('DOMContentLoaded', initCoinBaseImages);

// Supprime le logo uploadé d'une face du coin (recto / verso)
function removeCoinLogo(face) {
  // Retirer de la persistance
  if (typeof removeUpload === 'function') removeUpload('coin-' + face);

  // Cacher le logo déplaçable sur la pièce
  const logo = document.getElementById('coin-logo-' + face);
  if (logo) {
    const limg = logo.querySelector('img');
    if (limg) limg.src = '';
    logo.style.display = 'none';
    // réinitialiser position/taille par défaut
    logo.style.left = '28%';
    logo.style.top = '28%';
    logo.style.width = '44%';
  }

  // Si recto : retirer aussi le logo de la vue de côté
  if (face === 'recto') {
    const coteLogo = document.getElementById('coin-cote-logo');
    if (coteLogo) { coteLogo.src = ''; coteLogo.style.display = 'none'; }
  }

  // Réinitialiser l'input fichier + cacher le bouton supprimer
  const input = document.getElementById('uc-' + face);
  if (input) input.value = '';
  const removeBtn = document.getElementById('coin-remove-' + face);
  if (removeBtn) removeBtn.style.display = 'none';

  // Réinitialiser la miniature du récap
  const neutralThumb = `
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#9a9ea3" stroke-width="1.2">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="4"/>
    </svg>`;
  const thumbFace = document.getElementById('coin-recap-thumb-' + face);
  if (thumbFace) thumbFace.innerHTML = neutralThumb;
  if (face === 'recto') {
    const thumbMain = document.getElementById('coin-recap-thumb-main');
    if (thumbMain) thumbMain.innerHTML = neutralThumb;
  }
}