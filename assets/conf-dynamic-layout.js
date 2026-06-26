/**
 * Dynamic Layout - Change l'interface selon le type de produit
 */

// Configuration des layouts pour chaque catégorie de produit
const PRODUCT_LAYOUTS = {
  // Textiles (Sweatshirt, T-shirt, T-shirt polyester)
  textile: {
    sidebar: 'textile',
    showProductTypeSelector: true,
    canvasShape: 'default'
  },
  
  // Coins/Médailles
  coins: {
    sidebar: 'coins',
    showProductTypeSelector: true,  // ← Garde la section Type de produit
    canvasShape: 'circle'
  },
  
  // Drapeaux
  drapeaux: {
    sidebar: 'drapeaux',
    showProductTypeSelector: true,  // ← Garde la section Type de produit
    canvasShape: 'flag'
  },
  
  // Patches
  patches: {
    sidebar: 'patches',
    showProductTypeSelector: true,  // ← Garde la section Type de produit
    canvasShape: 'circle'
  }
};

// Template HTML pour la sidebar des Coins
const COINS_SIDEBAR_TEMPLATE = `
  <!-- 1. Upload Logo -->
  <div class="sec">
    <div class="sec-title">1. Ajoutez votre logo</div>
    <div class="sec-sub">Téléchargez votre logo ou visuel (une seule face)</div>
    
    <div class="coins-upload-box" onclick="document.getElementById('uc').click()">
      <div class="coins-upload-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#999">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          <circle cx="12" cy="12" r="10" fill="none" stroke="#999" stroke-width="1.5"/>
        </svg>
      </div>
      <p class="coins-upload-title"><strong>Télécharger votre fichier</strong></p>
      <p class="coins-upload-hint">PNG, JPG, SVG ou PDF<br>Taille max. 50 Mo</p>
    </div>
    <input type="file" id="uc" style="display:none" accept="image/*,.pdf" onchange="doUpload(event,'c')">
    
    <div class="uprev" id="pc" style="margin-top:8px">
      <img id="ic" src="" alt="" style="height:60px">
    </div>
    <div class="uprev-lbl" id="lc">
      <span>Aperçu du logo</span>
      <button class="rmv" onclick="rmUp('c')">🗑 Supprimer</button>
    </div>
    
    <div class="coins-upload-tips">
      <p class="coins-tip-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="#999"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg> Conseils pour un rendu optimal :</p>
      <ul class="coins-tips-list">
        <li><svg width="10" height="10" viewBox="0 0 24 24" fill="#2c5aa0"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg> Utilisez des fichiers en haute résolution</li>
        <li><svg width="10" height="10" viewBox="0 0 24 24" fill="#2c5aa0"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg> Les contours simples fonctionnent mieux</li>
        <li><svg width="10" height="10" viewBox="0 0 24 24" fill="#2c5aa0"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg> Évitez les dégradés trop fins</li>
      </ul>
    </div>
  </div>

  <!-- 2. Forme -->
  <div class="sec">
    <div class="sec-title">2. Choisissez la forme</div>
    <div class="sec-sub">Choisissez la forme de votre patch</div>
    <div class="coins-shape-row">
      <div class="coins-shape-card active" data-shape="rond" onclick="selectShape(this)">
        <svg viewBox="0 0 50 50" width="36" height="36">
          <circle cx="25" cy="25" r="22" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span>Rond</span>
        <div class="coins-shape-check">✓</div>
      </div>
      <div class="coins-shape-card" data-shape="carre" onclick="selectShape(this)">
        <svg viewBox="0 0 50 50" width="36" height="36">
          <rect x="3" y="3" width="44" height="44" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span>Carré</span>
        <div class="coins-shape-check">✓</div>
      </div>
      <div class="coins-shape-card" data-shape="rectangle" onclick="selectShape(this)">
        <svg viewBox="0 0 50 50" width="36" height="36">
          <rect x="3" y="12" width="44" height="26" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span>Rectangle</span>
        <div class="coins-shape-check">✓</div>
      </div>
      <div class="coins-shape-card" data-shape="blason" onclick="selectShape(this)">
        <svg viewBox="0 0 50 50" width="36" height="36">
          <path d="M25 3 L46 9 L46 22 Q46 35 25 47 Q4 35 4 22 L4 9 Z" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span>Blason</span>
        <div class="coins-shape-check">✓</div>
      </div>
    </div>
  </div>

  <!-- 3. Taille -->
  <div class="sec">
    <div class="sec-title">3. Choisissez la taille</div>
    <div class="sec-sub">Sélectionnez la taille de votre patch</div>
    <div class="coins-size-grid">
      <div class="coins-size-card circle" data-size="6cm" onclick="selectCoinSize(this)">
        <div class="coins-size-shape"></div>
        <p>6 cm</p>
      </div>
      <div class="coins-size-card circle" data-size="7cm" onclick="selectCoinSize(this)">
        <div class="coins-size-shape"></div>
        <p>7 cm</p>
      </div>
      <div class="coins-size-card circle active" data-size="8cm" onclick="selectCoinSize(this)">
        <div class="coins-size-shape"></div>
        <p>8 cm</p>
        <div class="coins-size-check">✓</div>
      </div>
      <div class="coins-size-card circle" data-size="9cm" onclick="selectCoinSize(this)">
        <div class="coins-size-shape"></div>
        <p>9 cm</p>
      </div>
      <div class="coins-size-card circle" data-size="10cm" onclick="selectCoinSize(this)">
        <div class="coins-size-shape"></div>
        <p>10 cm</p>
      </div>
      <div class="coins-size-card rect" data-size="8x6cm" onclick="selectCoinSize(this)">
        <p>8 x 6 cm</p>
        <div class="coins-size-shape"></div>
      </div>
      <div class="coins-size-card rect" data-size="10x7.5cm" onclick="selectCoinSize(this)">
        <p>10 x 7.5 cm</p>
        <div class="coins-size-shape"></div>
      </div>
    </div>
    <p class="coins-size-note"><svg width="12" height="12" viewBox="0 0 24 24" fill="#999"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg> Les dimensions indiquées sont approximatives</p>
  </div>

  <!-- 4. Fabrication -->
  <div class="sec">
    <div class="sec-title">4. Options de fabrication</div>
    <div class="sec-sub">Choisissez le type de patch</div>
    <div class="conf-fabrication-options">
      
      <div class="conf-fabrication-option active" data-fabrication="sublime" onclick="selectFabrication(this)">
        <input type="radio" name="fabrication" id="fab-sublime" checked>
        <label for="fab-sublime">
          <div class="fab-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67 0 1.38-1.12 2.5-2.5 2.5zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5 0-.16-.08-.28-.14-.35-.41-.46-.63-1.05-.63-1.65 0-1.38 1.12-2.5 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z"/>
              <circle cx="6.5" cy="11.5" r="1.5"/>
              <circle cx="9.5" cy="7.5" r="1.5"/>
              <circle cx="14.5" cy="7.5" r="1.5"/>
              <circle cx="17.5" cy="11.5" r="1.5"/>
            </svg>
          </div>
          <div class="fab-info">
            <strong>Sublimé</strong>
            <span>Impression de haute qualité<br>aux couleurs éclatantes</span>
          </div>
          <div class="fab-check">✓</div>
        </label>
      </div>
      
      <div class="conf-fabrication-option" data-fabrication="pvc" onclick="selectFabrication(this)">
        <input type="radio" name="fabrication" id="fab-pvc">
        <label for="fab-pvc">
          <div class="fab-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
              <path d="M7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
            </svg>
          </div>
          <div class="fab-info">
            <strong>PVC</strong>
            <span>Patch en PVC souple et résistant.<br>Contactez-nous en envoyant votre design.</span>
          </div>
          <div class="fab-check">✓</div>
        </label>
      </div>
      
      <div class="conf-fabrication-option" data-fabrication="tissu" onclick="selectFabrication(this)">
        <input type="radio" name="fabrication" id="fab-tissu">
        <label for="fab-tissu">
          <div class="fab-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23 5.5V20c0 .55-.45 1-1 1h-1.5v-2h-2v2h-2v-2h-2v2h-2v-2h-2v2h-2v-2h-2v2H3c-.55 0-1-.45-1-1V5.5C2 4.12 3.12 3 4.5 3S7 4.12 7 5.5h2c0-1.38 1.12-2.5 2.5-2.5S14 4.12 14 5.5h2c0-1.38 1.12-2.5 2.5-2.5S21 4.12 21 5.5h2z"/>
              <circle cx="9" cy="13" r="1"/>
              <circle cx="15" cy="13" r="1"/>
              <circle cx="12" cy="10" r="1"/>
              <circle cx="12" cy="16" r="1"/>
            </svg>
          </div>
          <div class="fab-info">
            <strong>Tissé</strong>
            <span>Finition tissée fine et détaillée.<br>Contactez-nous en envoyant votre design.</span>
          </div>
          <div class="fab-check">✓</div>
        </label>
      </div>
      
    </div>
    
    <!-- Bouton contact pour PVC/Tissé -->
    <button class="conf-contact-btn" onclick="contactForCustom()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
      <div>
        <strong>CONTACTEZ-NOUS POUR</strong>
        <span>PVC OU TISSÉ</span>
      </div>
    </button>
    
    <!-- Section besoin d'aide -->
    <div class="conf-help-section">
      <div class="conf-help-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#666">
          <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.1.9 2 2 2h1v-8H5c0-3.87 3.13-7 7-7s7 3.13 7 7h-1v8h1c1.1 0 2-.9 2-2v-7c0-4.97-4.03-9-9-9z"/>
        </svg>
      </div>
      <div class="conf-help-text">
        <strong>Besoin d'aide ?</strong>
        <p>Contactez-nous, nous sommes là pour vous accompagner.</p>
      </div>
    </div>
    
  </div>
`;

class DynamicLayoutManager {
  constructor() {
    this.currentCategory = 'textile';
    this.init();
  }
  
  init() {
    console.log('🎨 DynamicLayoutManager initialisé');
    this.restorePendingProduct();
  }

  // Après un rechargement (retour vers un textile), resélectionne le produit choisi
  restorePendingProduct() {
    let pending = null;
    try {
      pending = sessionStorage.getItem('pendingProduct');
      sessionStorage.removeItem('pendingProduct');
    } catch (e) {}

    if (!pending || pending === 'sweatshirt') return;

    // Clique sur la carte produit correspondante une fois le DOM prêt
    const apply = () => {
      const card = document.querySelector('.pt[data-product="' + pending + '"]');
      if (card && typeof selProd === 'function') {
        selProd(card);
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', apply);
    } else {
      apply();
    }
  }
  
  handleProductChange(productType) {
    console.log('🔄 Changement vers:', productType);
    
    // Déterminer la catégorie
    let category = 'textile';
    
    // Mapping des produits vers catégories
    const categoryMap = {
      'sweatshirt': 'textile',
      'tshirt': 'textile',
      'tshirt_polyester': 'textile',
      'coins': 'patches',     // ← Coins affiche désormais le contenu Patchs (pièce métallique)
      'drapeaux': 'drapeaux',
      'patches': 'coins'      // ← Patchs affiche désormais l'ancien contenu Coins
    };
    
    category = categoryMap[productType] || 'textile';
    
    console.log('📂 Catégorie:', category);
    
    if (category !== this.currentCategory) {
      this.currentCategory = category;
      this.switchLayout(category, productType);
    }
  }

  switchLayout(category, productType) {
    console.log('🎨 Switch layout vers:', category);
    
    const layout = PRODUCT_LAYOUTS[category];
    
    // La Type Bar reste toujours visible maintenant
    const typeBar = document.querySelector('.type-bar');
    if (typeBar) {
      typeBar.style.display = 'flex';
    }
    
    // Mettre à jour le header global
    this.updateGlobalHeader(category);
    
    // Changer la sidebar selon la catégorie
    if (category === 'coins') {
      this.loadCoinsSidebar();
      this.loadCoinsCanvas();
      this.loadCoinsRecap();
    } else if (category === 'drapeaux') {
      this.loadDrapeauxSidebar();
      this.loadDrapeauxCanvas();
      this.loadDrapeauxRecap();
    } else if (category === 'patches') {
      this.loadPatchesSidebar();
      this.loadPatchesCanvas();
      this.loadPatchesRecap();
    } else if (category === 'textile') {
      this.loadTextileSidebar(productType);
    }
  }
  
  updateGlobalHeader(category) {
    const brandName = document.querySelector('.hdr-name');
    const brandSub = document.querySelector('.hdr-sub');
    const brandIcon = document.querySelector('.hdr-icon');
    
    if (!brandName || !brandSub || !brandIcon) return;
    
    if (category === 'coins') {
      brandName.textContent = 'CUSTOM PATCHES';
      brandSub.textContent = 'Créez votre patch personnalisé';
      brandIcon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      `;
    } else if (category === 'drapeaux') {
      brandName.textContent = 'CUSTOM FLAGS';
      brandSub.textContent = 'Créez votre drapeau personnalisé';
      brandIcon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
        </svg>
      `;
    } else if (category === 'patches') {
      brandName.textContent = 'CUSTOM COINS';
      brandSub.textContent = 'Créez votre pièce unique';
      brandIcon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <circle cx="12" cy="12" r="9"/>
          <circle cx="12" cy="12" r="4"/>
        </svg>
      `;
    } else {
      // Textile par défaut
      brandName.textContent = 'CUSTOM TEXTILE';
      brandSub.textContent = 'Créez votre style';
      brandIcon.textContent = '👕';
    }
  }
  
  loadCoinsSidebar() {
    const sidebarContent = document.getElementById('sidebar-content');
    if (sidebarContent) {
      sidebarContent.innerHTML = COINS_SIDEBAR_TEMPLATE;
      console.log('✅ Sidebar Coins chargée');
    } else {
      console.error('❌ Élément #sidebar-content introuvable');
    }
  }
  
  loadCoinsCanvas() {
    const cvWrap = document.querySelector('.cv-wrap');
    if (!cvWrap) return;
    
    // Remplacer tout le contenu du canvas
    const canvasParent = cvWrap.parentElement;
    
    canvasParent.innerHTML = `
      <div class="cv-hdr">
        <h2 class="cv-title">Aperçu de votre patch</h2>
        <p class="cv-sub">Visualisez votre patch personnalisé</p>
        <div class="vtabs">
          <button class="vt on" onclick="switchCoinsView('2d')">Aperçu 2D</button>
          <button class="vt" onclick="switchCoinsView('3d')">Aperçu réel</button>
        </div>
      </div>
      
      <div class="cv-wrap">
        <div class="coins-canvas-container">
          <div class="coins-canvas-circle shape-rond size-8cm" id="coins-canvas">
            <div class="coins-placeholder">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="#ccc">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              <p>Téléchargez votre logo<br>pour voir l'aperçu</p>
            </div>
            <img id="coins-preview-img" style="display:none;" alt="Aperçu">
          </div>
          
          <div class="coins-canvas-controls">
            <button class="cbtn" onclick="zoom(-10)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>
            </button>
            <span class="zlvl" id="zlvl">100%</span>
            <button class="cbtn" onclick="zoom(10)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </button>
            <div class="cdiv"></div>
            <button class="cbtn" onclick="resetZoom()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
            </button>
          </div>
          
          <div class="cv-info">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#999"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            Le rendu est une approximation. Les couleurs et proportions peuvent légèrement varier sur le produit final.
          </div>
        </div>
      </div>
    `;
    
    console.log('✅ Canvas Coins chargé');
  }
  
  loadCoinsRecap() {
    // Modifier le contenu du récap complètement
    const recap = document.querySelector('.recap');
    if (!recap) return;
    
    recap.innerHTML = `
      <div class="rp-section">
        <div class="rp-section-title">RÉCAPITULATIF</div>
        
        <div class="rp-patch-preview">
          <div class="rp-patch-thumb" id="coins-recap-thumb">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="#ccc">
              <circle cx="12" cy="12" r="10" fill="none" stroke="#ccc" stroke-width="2"/>
              <path d="M12 8v8M8 12h8" stroke="#ccc" stroke-width="2"/>
            </svg>
          </div>
          <div class="rp-patch-info">
            <h3 class="rp-patch-title">Patch personnalisé</h3>
            <div class="rp-patch-details">
              <p>Face : Une seule face (sublimé)</p>
              <p>Taille : <span id="coins-recap-size">8 cm</span></p>
              <p>Format : <span id="coins-recap-shape">Rond</span></p>
              <p>Type : <span id="coins-recap-type">Sublimé</span></p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="rp-section">
        <div class="rp-qty-section">
          <div class="rp-qty-title">QUANTITÉ</div>
          <div class="rp-qty-subtitle">Minimum de commande : 20 unités</div>
          <div class="rp-qty-controls">
            <button class="rp-qty-btn" onclick="changeQty(-5)">−</button>
            <input type="number" id="coin-qty-input" class="rp-qty-input" value="20" min="20" onchange="handleQtyInput()">
            <button class="rp-qty-btn" onclick="changeQty(5)">+</button>
          </div>
        </div>
      </div>
      
      <div class="rp-section">
        <div class="rp-unit-title">PRIX UNITAIRE</div>
        <div class="rp-unit-price-big">2,45 € <span class="rp-unit-ht">HT</span></div>
        <div class="rp-unit-price-ttc">2,84 € TTC</div>
      </div>
      
      <div class="rp-section rp-total-section">
        <div class="rp-total-title">PRIX TOTAL</div>
        <div class="rp-total-subtitle" id="coins-qty-display">à partir de (20 unités)</div>
        <div class="rp-total-price-line">
          <span class="rp-total-price" id="coins-total-price">49,00 €</span> 
          <span class="rp-total-ht" id="coins-total-ht">HT</span>
        </div>
        <div class="rp-total-ttc" id="coins-total-ttc">58,80 € TTC</div>
      </div>
      
      <div class="rp-actions-coins">
        <button class="rp-btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM2.73 5.15L4 12h12.55c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 21 3H5.21l-.94-2H1v2h2l3.6 7.59z"/></svg>
          AJOUTER AU PANIER
        </button>
        <button class="rp-btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
          SAUVEGARDER LE DESIGN
        </button>
        <button class="rp-btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          CONTACTEZ-NOUS
        </button>
      </div>
      
      <div class="rp-trust-coins">
        <div class="rp-trust-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
          <div>
            <strong>Fabrication de qualité</strong>
            <p>Matériaux durables et finitions soignées</p>
          </div>
        </div>
        <div class="rp-trust-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm13.5-9l1.96 2.5H17V9h2.5zm-1.5 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
          <div>
            <strong>Livraison rapide</strong>
            <p>Expédition sous 5 à 7 jours ouvrés</p>
          </div>
        </div>
        <div class="rp-trust-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          <div>
            <strong>Service client réactif</strong>
            <p>Notre équipe est à votre écoute</p>
          </div>
        </div>
      </div>
    `;
    
    // Mettre à jour le prix initial
    if (window.updateCoinPrice) {
      window.updateCoinPrice(20);
    }
    
    console.log('✅ Récap Coins mis à jour');
  }
  
  loadTextileSidebar(productType) {
    // On revient à un textile depuis une catégorie spéciale : il faut restaurer
    // le markup d'origine de la page. On recharge en mémorisant le produit choisi
    // pour ne pas retomber par défaut sur le sweatshirt.
    try {
      sessionStorage.setItem('pendingProduct', productType || 'sweatshirt');
    } catch (e) {}
    location.reload();
  }
  
  loadDrapeauxSidebar() {
    const sidebarContent = document.getElementById('sidebar-content');
    if (sidebarContent && typeof DRAPEAUX_SIDEBAR_TEMPLATE !== 'undefined') {
      sidebarContent.innerHTML = DRAPEAUX_SIDEBAR_TEMPLATE;
      console.log('✅ Sidebar Drapeaux chargée');
    } else {
      console.error('❌ Template Drapeaux introuvable');
    }
  }
  
  loadDrapeauxCanvas() {
    const cvWrap = document.querySelector('.cv-wrap');
    if (!cvWrap) return;
    
    const canvasParent = cvWrap.parentElement;
    
    canvasParent.innerHTML = `
      <div class="cv-hdr">
        <h2 class="cv-title">Visualisez votre drapeau</h2>
        <p class="cv-sub">Aperçu 3D interactif de votre design</p>
        <div class="flag-view-tabs">
          <button class="flag-view-btn active" onclick="switchFlagView('3d')">Aperçu 3D</button>
          <button class="flag-view-btn" onclick="switchFlagView('2d')">Aperçu 2D</button>
        </div>
      </div>
      
      <div class="cv-wrap">
        <div class="flag-canvas-container">
          <div class="flag-stage" id="flag-stage">

            <!-- RECTO -->
            <figure class="flag-mock" id="flag-recto">
              <figcaption class="flag-face-label">RECTO</figcaption>

              <!-- Vue 3D : image réelle du drapeau -->
              <div class="flag-img-3d" data-face="recto">
                <img class="flag-base-img" id="flag-base-recto" src="${(window.ASSET_URLS && window.ASSET_URLS.flagRecto) || ''}" alt="Drapeau recto">
                <div class="flag-img-overlay">
                  <div class="flag-canvas-placeholder">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="#dfe3ea">
                      <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
                    </svg>
                    <p>Téléchargez votre design<br>pour voir l'aperçu</p>
                  </div>
                  <img class="flag-design-img" id="flag-recto-img" style="display:none;" alt="Design recto">
                </div>
              </div>

              <!-- Vue 2D : drapeau codé à plat -->
              <div class="flag-mock-inner">
                <div class="flag-pole"></div>
                <div class="flag-wave orientation-paysage size-90x150" data-face="recto">
                  <div class="flag-design">
                    <div class="flag-canvas-placeholder">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="#dfe3ea">
                        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
                      </svg>
                      <p>Téléchargez votre design<br>pour voir l'aperçu</p>
                    </div>
                    <img class="flag-design-img" id="flag-recto-img-2d" style="display:none;" alt="Design recto">
                  </div>
                  <span class="flag-grommet g2 top"></span>
                  <span class="flag-grommet g2 bottom"></span>
                  <span class="flag-grommet g4 tl"></span>
                  <span class="flag-grommet g4 tr"></span>
                  <span class="flag-grommet g4 bl"></span>
                  <span class="flag-grommet g4 br"></span>
                </div>
              </div>
            </figure>

            <!-- VERSO -->
            <figure class="flag-mock" id="flag-verso">
              <figcaption class="flag-face-label">VERSO</figcaption>

              <!-- Vue 3D : image réelle du drapeau -->
              <div class="flag-img-3d" data-face="verso">
                <img class="flag-base-img" id="flag-base-verso" src="${(window.ASSET_URLS && window.ASSET_URLS.flagVerso) || ''}" alt="Drapeau verso">
                <div class="flag-img-overlay">
                  <div class="flag-canvas-placeholder">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="#dfe3ea">
                      <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
                    </svg>
                    <p>Téléchargez votre design verso<br>pour voir l'aperçu</p>
                  </div>
                  <img class="flag-design-img" id="flag-verso-img" style="display:none;" alt="Design verso">
                </div>
              </div>

              <!-- Vue 2D : drapeau codé à plat -->
              <div class="flag-mock-inner">
                <div class="flag-pole"></div>
                <div class="flag-wave orientation-paysage size-90x150" data-face="verso">
                  <div class="flag-design">
                    <div class="flag-canvas-placeholder">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="#dfe3ea">
                        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
                      </svg>
                      <p>Téléchargez votre design verso<br>pour voir l'aperçu</p>
                    </div>
                    <img class="flag-design-img" id="flag-verso-img-2d" style="display:none;" alt="Design verso">
                  </div>
                  <span class="flag-grommet g2 top"></span>
                  <span class="flag-grommet g2 bottom"></span>
                  <span class="flag-grommet g4 tl"></span>
                  <span class="flag-grommet g4 tr"></span>
                  <span class="flag-grommet g4 bl"></span>
                  <span class="flag-grommet g4 br"></span>
                </div>
              </div>
            </figure>

          </div>

          <div class="coins-canvas-controls">
            <button class="cbtn" onclick="zoom(-10)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>
            </button>
            <span class="zlvl" id="zlvl">100%</span>
            <button class="cbtn" onclick="zoom(10)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </button>
            <div class="cdiv"></div>
            <button class="cbtn" onclick="resetZoom()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
            </button>
          </div>

          <div class="cv-info">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#999"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            Le rendu 3D est une approximation. Le rendu final peut présenter de légères variations de couleurs et de positionnement.
          </div>
        </div>
      </div>
    `;
    
    console.log('✅ Canvas Drapeaux chargé');
  }
  
  loadDrapeauxRecap() {
    const recap = document.querySelector('.recap');
    if (!recap) return;
    
    recap.innerHTML = `
      <div class="rp-section">
        <div class="rp-section-title">RÉCAPITULATIF</div>
        
        <div class="rp-patch-preview">
          <div class="rp-patch-thumb" style="border-radius:4px;" id="flag-recap-thumb">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#ccc">
              <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
            </svg>
          </div>
          <div class="rp-patch-info">
            <h3 class="rp-patch-title">Drapeau sublimé</h3>
            <div class="rp-patch-details">
              <p>Type : <span id="flag-recap-type">Recto verso</span></p>
              <p>Taille : <span id="flag-recap-size">90 x 150 cm</span></p>
              <p>Orientation : <span id="flag-recap-orientation">Paysage</span></p>
              <p>Matière : <span>Polyester 110g/m²</span></p>
              <p>Finition : <span id="flag-recap-anneaux">2 anneaux</span></p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="rp-section">
        <div class="rp-qty-section">
          <div class="rp-qty-title">QUANTITÉ</div>
          <div class="rp-qty-subtitle">Minimum de commande : 1 unité</div>
          <div class="rp-qty-controls">
            <button class="rp-qty-btn" onclick="changeFlagQty(-1)">−</button>
            <input type="number" id="flag-qty-input" class="rp-qty-input" value="1" min="1" onchange="handleFlagQtyInput()">
            <button class="rp-qty-btn" onclick="changeFlagQty(1)">+</button>
          </div>
        </div>
      </div>
      
      <div class="rp-section">
        <div class="rp-unit-title">PRIX UNITAIRE</div>
        <div class="rp-unit-price-big">19,90 € <span class="rp-unit-ht">HT</span></div>
        <div class="rp-unit-price-ttc">23,88 € TTC</div>
      </div>
      
      <div class="rp-actions-coins">
        <button class="rp-btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM2.73 5.15L4 12h12.55c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 21 3H5.21l-.94-2H1v2h2l3.6 7.59z"/></svg>
          AJOUTER AU PANIER
        </button>
        <button class="rp-btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
          SAUVEGARDER LE DESIGN
        </button>
        <button class="rp-btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          CONTACTEZ-NOUS
        </button>
      </div>
      
      <div class="rp-section rp-payment-section">
        <div class="rp-section-title">PAIEMENT SÉCURISÉ</div>
        <p class="rp-payment-sub">Vos paiements sont 100% sécurisés</p>
        <div class="rp-payment-logos">
          <img src="${(window.ASSET_URLS && window.ASSET_URLS.visa) || ''}" alt="Visa">
          <img src="${(window.ASSET_URLS && window.ASSET_URLS.mastercard) || ''}" alt="Mastercard">
          <img src="${(window.ASSET_URLS && window.ASSET_URLS.applepay) || ''}" alt="Apple Pay">
          <img src="${(window.ASSET_URLS && window.ASSET_URLS.paypal) || ''}" alt="PayPal">
        </div>
      </div>

      <div class="rp-trust-coins">
        <div class="rp-trust-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#666"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
          <div>
            <strong>Impression de qualité</strong>
            <p>Sublimation haute définition</p>
          </div>
        </div>
        <div class="rp-trust-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#666"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>
          <div>
            <strong>Couleurs éclatantes</strong>
            <p>Rendu durable et résistant aux UV</p>
          </div>
        </div>
        <div class="rp-trust-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#666"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm13.5-9l1.96 2.5H17V9h2.5zm-1.5 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
          <div>
            <strong>Livraison rapide</strong>
            <p>Expédition sous 5 à 7 jours ouvrés</p>
          </div>
        </div>
      </div>
    `;

    console.log('✅ Récap Drapeaux chargé');
  }

  // ========================================
  // PATCHS / COINS métalliques (CUSTOM COINS)
  // ========================================
  loadPatchesSidebar() {
    const sidebarContent = document.getElementById('sidebar-content');
    if (sidebarContent && typeof PATCHES_SIDEBAR_TEMPLATE !== 'undefined') {
      sidebarContent.innerHTML = PATCHES_SIDEBAR_TEMPLATE;
      console.log('✅ Sidebar Patchs chargée');
    } else {
      console.error('❌ Template Patchs introuvable');
    }
  }

  loadPatchesCanvas() {
    const cvWrap = document.querySelector('.cv-wrap');
    if (!cvWrap) return;
    const canvasParent = cvWrap.parentElement;

    const placeholder = (label) => `
      <div class="coin-placeholder">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
          <path d="M12 16V4M7 9l5-5 5 5"/>
          <path d="M5 20h14"/>
        </svg>
        <p>${label}</p>
      </div>`;

    const A = window.ASSET_URLS || {};

    canvasParent.innerHTML = `
      <div class="cv-hdr">
        <h2 class="cv-title">Visualisez votre coin</h2>
        <p class="cv-sub">Aperçu 3D interactif de votre design</p>
        <div class="coin-view-tabs">
          <button class="coin-view-btn active" onclick="switchCoinView('3d')">Aperçu 3D</button>
          <button class="coin-view-btn" onclick="switchCoinView('2d')">Aperçu 2D</button>
        </div>
      </div>

      <div class="cv-wrap">
        <div class="coin-canvas-container">
          <div class="coin-stage" id="coin-stage">

            <!-- RECTO -->
            <div class="coin-view" data-view="recto">
              <div class="coin-view-label">RECTO</div>
              <div class="coin-disc" id="coin-disc-recto">
                <img class="coin-base-img" src="${A.patchRecto || ''}" alt="Pièce recto">
                ${placeholder('Téléchargez votre logo recto')}
                <img class="coin-design-img" id="coin-recto-img" style="display:none;" alt="Recto">
              </div>
            </div>

            <!-- VERSO -->
            <div class="coin-view" data-view="verso">
              <div class="coin-view-label">VERSO</div>
              <div class="coin-disc" id="coin-disc-verso">
                <img class="coin-base-img" src="${A.patchVerso || ''}" alt="Pièce verso">
                ${placeholder('Téléchargez votre logo verso')}
                <img class="coin-design-img" id="coin-verso-img" style="display:none;" alt="Verso">
              </div>
            </div>

            <!-- VUE DE CÔTÉ -->
            <div class="coin-view" data-view="cote">
              <div class="coin-view-label">VUE DE CÔTÉ</div>
              <div class="coin-edge" id="coin-disc-edge">
                <img class="coin-base-img" src="${A.patchCote || ''}" alt="Pièce côté">
              </div>
            </div>

          </div>

          <div class="coins-canvas-controls">
            <button class="cbtn" onclick="zoom(-10)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>
            </button>
            <span class="zlvl" id="zlvl">100%</span>
            <button class="cbtn" onclick="zoom(10)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </button>
            <div class="cdiv"></div>
            <button class="cbtn" onclick="resetZoom()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
            </button>
          </div>

          <div class="cv-info">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#999"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            Les rendus 3D sont une approximation. Le rendu final peut présenter de légères variations.
          </div>
        </div>
      </div>
    `;

    console.log('✅ Canvas Patchs chargé');
  }

  loadPatchesRecap() {
    const recap = document.querySelector('.recap');
    if (!recap) return;

    const coinThumb = `
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#9a9ea3" stroke-width="1.2">
        <circle cx="12" cy="12" r="9"/>
        <circle cx="12" cy="12" r="4"/>
      </svg>`;

    recap.innerHTML = `
      <div class="rp-section">
        <div class="rp-section-title">RÉCAPITULATIF</div>

        <div class="rp-patch-preview">
          <div class="rp-patch-thumb coin-thumb" id="coin-recap-thumb-main">${coinThumb}</div>
          <div class="rp-patch-info">
            <h3 class="rp-patch-title">Coin métal</h3>
            <div class="rp-patch-details">
              <p>Type : <span id="coin-recap-type">Recto verso</span></p>
              <p>Forme : <span id="coin-recap-shape">Rond</span></p>
              <p>Taille : <span id="coin-recap-size">30 mm</span></p>
              <p>Finition : <span id="coin-recap-finish">À choisir</span></p>
            </div>
          </div>
        </div>

        <div class="rp-coin-faces">
          <div class="rp-coin-face">
            <div class="rp-patch-thumb coin-thumb" id="coin-recap-thumb-recto">${coinThumb}</div>
            <div>
              <strong>Recto</strong>
              <span>Personnalisé</span>
            </div>
          </div>
          <div class="rp-coin-face" id="coin-recap-face-verso">
            <div class="rp-patch-thumb coin-thumb" id="coin-recap-thumb-verso">${coinThumb}</div>
            <div>
              <strong>Verso</strong>
              <span>Personnalisé</span>
            </div>
          </div>
        </div>
      </div>

      <div class="rp-section">
        <div class="rp-qty-section">
          <div class="rp-qty-title">QUANTITÉ</div>
          <div class="rp-qty-subtitle">Minimum de commande : 50 unités</div>
          <div class="rp-qty-controls">
            <button class="rp-qty-btn" onclick="changeCoinRecapQty(-10)">−</button>
            <input type="number" id="coin-recap-qty-input" class="rp-qty-input" value="50" min="50" onchange="handleCoinRecapQtyInput()">
            <button class="rp-qty-btn" onclick="changeCoinRecapQty(10)">+</button>
          </div>
        </div>
      </div>

      <div class="rp-actions-coins">
        <button class="rp-btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>
          FAIRE UNE DEMANDE DE DEVIS
        </button>
        <button class="rp-btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
          SAUVEGARDER LE DESIGN
        </button>
        <button class="rp-btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          CONTACTEZ-NOUS
        </button>
      </div>

      <div class="rp-trust-coins">
        <div class="rp-trust-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#666"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
          <div>
            <strong>Paiement sécurisé</strong>
            <p>Transactions 100% sécurisées</p>
          </div>
        </div>
        <div class="rp-trust-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#666"><path d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h2v-8H5v-2a7 7 0 0 1 14 0v2h-3v8h2c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9z"/></svg>
          <div>
            <strong>Service client</strong>
            <p>À votre écoute 7j/7</p>
          </div>
        </div>
        <div class="rp-trust-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#666"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
          <div>
            <strong>Fabrication de qualité</strong>
            <p>Finitions haut de gamme</p>
          </div>
        </div>
      </div>
    `;

    console.log('✅ Récap Patchs chargé');
  }
}

// ========================================
// Fonctions globales pour les interactions Coins
// ========================================

// Sélection de forme
function selectShape(element) {
  // Retirer l'active des autres
  document.querySelectorAll('.coins-shape-card').forEach(card => {
    card.classList.remove('active');
  });
  
  // Ajouter active à celle cliquée
  element.classList.add('active');
  
  // Récupérer la forme sélectionnée
  const shape = element.getAttribute('data-shape');
  
  // Changer la forme du canvas
  changeCanvasShape(shape);
  
  // Mettre à jour le récap
  updateCoinsRecapShape(shape);
}

// Changer la forme du canvas
function changeCanvasShape(shape) {
  const canvas = document.getElementById('coins-canvas');
  if (!canvas) return;
  
  // Retirer toutes les classes de forme
  canvas.classList.remove('shape-rond', 'shape-carre', 'shape-rectangle', 'shape-blason');
  
  // Ajouter la nouvelle classe
  canvas.classList.add('shape-' + shape);
  
  console.log('🔷 Forme changée:', shape);
}

// Mettre à jour la forme dans le récap
function updateCoinsRecapShape(shape) {
  const recapShape = document.getElementById('coins-recap-shape');
  if (recapShape) {
    const shapeNames = {
      'rond': 'Rond',
      'carre': 'Carré',
      'rectangle': 'Rectangle',
      'blason': 'Blason'
    };
    recapShape.textContent = shapeNames[shape] || 'Rond';
  }
}

// Sélection de taille
function selectCoinSize(element) {
  // Retirer l'active des autres
  document.querySelectorAll('.coins-size-card').forEach(card => {
    card.classList.remove('active');
  });
  
  // Ajouter active à celle cliquée
  element.classList.add('active');
  
  // Récupérer la taille
  const size = element.getAttribute('data-size');
  
  // Changer la taille du canvas
  changeCanvasSize(size);
  
  // Mettre à jour le récap
  const recapSize = document.getElementById('coins-recap-size');
  if (recapSize) {
    recapSize.textContent = size;
  }
  
  console.log('📏 Taille changée:', size);
}

// Changer la taille du canvas
function changeCanvasSize(size) {
  const canvas = document.getElementById('coins-canvas');
  if (!canvas) return;
  
  // Retirer toutes les classes de taille
  canvas.classList.remove('size-6cm', 'size-7cm', 'size-8cm', 'size-9cm', 'size-10cm', 'size-8x6cm', 'size-10x7-5cm');
  
  // Ajouter la nouvelle classe (remplacer les caractères spéciaux)
  const sizeClass = 'size-' + size.replace('.', '-').replace('x', 'x');
  canvas.classList.add(sizeClass);
  
  console.log('📐 Classe de taille ajoutée:', sizeClass);
}

// Sélection du type de fabrication
function selectFabrication(element) {
  // Retirer l'active des autres
  document.querySelectorAll('.conf-fabrication-option').forEach(option => {
    option.classList.remove('active');
  });
  
  // Ajouter active à celle cliquée
  element.classList.add('active');
  
  // Cocher le radio
  const radio = element.querySelector('input[type="radio"]');
  if (radio) radio.checked = true;
  
  // Récupérer le type
  const fabrication = element.getAttribute('data-fabrication');
  
  // Mettre à jour le récap
  const recapType = document.getElementById('coins-recap-type');
  if (recapType) {
    const fabricationNames = {
      'sublime': 'Sublimé',
      'pvc': 'PVC',
      'tissu': 'Tissé'
    };
    recapType.textContent = fabricationNames[fabrication] || 'Sublimé';
  }
  
  console.log('🎨 Fabrication changée:', fabrication);
}

// Bouton contact
function contactForCustom() {
  alert('Contactez-nous pour les options PVC et Tissé.\nEmail: contact@exemple.com\nTél: 01 XX XX XX XX');
}

// Changement de quantité
function changeQty(delta) {
  const input = document.getElementById('coin-qty-input');
  if (!input) return;
  
  let qty = parseInt(input.value) || 20;
  qty += delta;
  
  // Minimum 20
  if (qty < 20) qty = 20;
  
  input.value = qty;
  updateCoinPrice(qty);
}

// Gestion de l'input quantité
function handleQtyInput() {
  const input = document.getElementById('coin-qty-input');
  if (!input) return;
  
  let qty = parseInt(input.value) || 20;
  
  // Minimum 20
  if (qty < 20) {
    qty = 20;
    input.value = qty;
  }
  
  updateCoinPrice(qty);
}

// Mise à jour du prix
function updateCoinPrice(qty) {
  const unitPrice = 2.45;
  const totalHT = (qty * unitPrice).toFixed(2);
  const totalTTC = (totalHT * 1.20).toFixed(2);
  
  // Mise à jour de l'affichage
  const totalPriceEl = document.getElementById('coins-total-price');
  const totalTTCEl = document.getElementById('coins-total-ttc');
  const qtyDisplayEl = document.getElementById('coins-qty-display');
  
  if (totalPriceEl) totalPriceEl.textContent = totalHT.replace('.', ',') + ' €';
  if (totalTTCEl) totalTTCEl.textContent = totalTTC.replace('.', ',') + ' € TTC';
  if (qtyDisplayEl) qtyDisplayEl.textContent = `à partir de (${qty} unités)`;
}

// Changement de vue (2D/3D)
function switchCoinsView(view) {
  document.querySelectorAll('.vt').forEach(btn => btn.classList.remove('on'));
  event.target.classList.add('on');
  console.log('👁️ Vue changée:', view);
}

// Initialisation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.dynamicLayoutManager = new DynamicLayoutManager();
  });
} else {
  window.dynamicLayoutManager = new DynamicLayoutManager();
}
