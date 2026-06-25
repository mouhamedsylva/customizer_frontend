/**
 * Configuration pour les patches brodés
 */

export function generateSidebar() {
  return `
    <!-- Section 1: Ajoutez votre logo -->
    <div class="conf-section">
      <div class="conf-section-header">
        <h3 class="conf-section-title">1. AJOUTEZ VOTRE LOGO</h3>
      </div>
      <div class="conf-section-content">
        <p class="conf-section-subtitle">Téléchargez votre logo ou visuel pour créer votre patch</p>
        
        ${generateUploadZone('main', 'Télécharger votre fichier', 'PNG, JPG, SVG, ou PDF - Taille max: 50 Mo')}
        
        <div class="conf-upload-preview" data-preview="main" style="display: none;">
          <img src="" alt="Logo patch">
          <button class="conf-remove-btn" data-remove="main">×</button>
        </div>

        <div class="conf-info-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
          </svg>
          <div>
            <strong>Conseils pour un rendu optimal :</strong>
            <ul>
              <li>Utilisez des fichiers en haute résolution (300 DPI)</li>
              <li>Les couleurs blanches ne rendent pas sur patches blancs</li>
              <li>Évitez les dégradés très fins</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 2: Choisissez la forme -->
    <div class="conf-section">
      <div class="conf-section-header">
        <h3 class="conf-section-title">2. CHOISISSEZ LA FORME</h3>
      </div>
      <div class="conf-section-content">
        <p class="conf-section-subtitle">Choisissez la forme de votre patch</p>
        
        <div class="conf-shape-grid">
          <button class="conf-shape-option active" data-option="shape" data-value="rond">
            <div class="conf-shape-icon">
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" stroke-width="2"/>
                <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.1"/>
              </svg>
            </div>
            <span>Rond</span>
          </button>
          
          <button class="conf-shape-option" data-option="shape" data-value="carre">
            <div class="conf-shape-icon">
              <svg width="64" height="64" viewBox="0 0 64 64">
                <rect x="2" y="2" width="60" height="60" fill="none" stroke="currentColor" stroke-width="2"/>
                <rect x="4" y="4" width="56" height="56" fill="currentColor" opacity="0.1"/>
              </svg>
            </div>
            <span>Carré</span>
          </button>
          
          <button class="conf-shape-option" data-option="shape" data-value="rectangle">
            <div class="conf-shape-icon">
              <svg width="80" height="64" viewBox="0 0 80 64">
                <rect x="2" y="12" width="76" height="40" fill="none" stroke="currentColor" stroke-width="2"/>
                <rect x="4" y="14" width="72" height="36" fill="currentColor" opacity="0.1"/>
              </svg>
            </div>
            <span>Rectangle</span>
          </button>
          
          <button class="conf-shape-option" data-option="shape" data-value="blason">
            <div class="conf-shape-icon">
              <svg width="64" height="64" viewBox="0 0 64 64">
                <path d="M32 2L6 14V32C6 45 14 56 32 62C50 56 58 45 58 32V14L32 2Z" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M32 4L8 15V32C8 44 15 54 32 60C49 54 56 44 56 32V15L32 4Z" fill="currentColor" opacity="0.1"/>
              </svg>
            </div>
            <span>Blason</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Section 3: Choisissez la taille -->
    <div class="conf-section">
      <div class="conf-section-header">
        <h3 class="conf-section-title">3. CHOISISSEZ LA TAILLE</h3>
      </div>
      <div class="conf-section-content">
        <p class="conf-section-subtitle">Sélectionnez la taille de votre patch</p>
        
        <div class="conf-patch-size-grid">
          <button class="conf-patch-size-option" data-option="size" data-value="7cm">
            <div class="conf-size-visual">
              <div class="conf-size-circle" style="width: 56px; height: 56px;"></div>
            </div>
            <div>
              <strong>7 cm</strong>
              <span>7 cm</span>
            </div>
          </button>
          
          <button class="conf-patch-size-option active" data-option="size" data-value="8cm">
            <div class="conf-size-visual">
              <div class="conf-size-circle" style="width: 64px; height: 64px;"></div>
            </div>
            <div>
              <strong>8 cm</strong>
              <span>8 cm</span>
            </div>
          </button>
          
          <button class="conf-patch-size-option" data-option="size" data-value="9cm">
            <div class="conf-size-visual">
              <div class="conf-size-circle" style="width: 72px; height: 72px;"></div>
            </div>
            <div>
              <strong>9 cm</strong>
              <span>9 cm</span>
            </div>
          </button>
          
          <button class="conf-patch-size-option" data-option="size" data-value="10cm">
            <div class="conf-size-visual">
              <div class="conf-size-circle" style="width: 80px; height: 80px;"></div>
            </div>
            <div>
              <strong>10 cm</strong>
              <span>10 cm</span>
            </div>
          </button>
          
          <button class="conf-patch-size-option" data-option="size" data-value="8x6cm">
            <div class="conf-size-visual">
              <div class="conf-size-rect" style="width: 64px; height: 48px;"></div>
            </div>
            <div>
              <strong>8 x 6 cm</strong>
              <span>Rectangle</span>
            </div>
          </button>
          
          <button class="conf-patch-size-option" data-option="size" data-value="10x7.5cm">
            <div class="conf-size-visual">
              <div class="conf-size-rect" style="width: 80px; height: 60px;"></div>
            </div>
            <div>
              <strong>10 x 7,5 cm</strong>
              <span>10 x 7.5 cm</span>
            </div>
          </button>
        </div>

        <div class="conf-info-note">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
          </svg>
          <span>Les dimensions indiquées sont approximatives</span>
        </div>
      </div>
    </div>

    <!-- Section 4: Options de fabrication -->
    <div class="conf-section">
      <div class="conf-section-header">
        <h3 class="conf-section-title">4. OPTIONS DE FABRICATION</h3>
      </div>
      <div class="conf-section-content">
        <p class="conf-section-subtitle">Choisissez le type de patch</p>
        
        <div class="conf-fabrication-list">
          <label class="conf-fabrication-option active">
            <input type="radio" name="fabrication" value="sublime" checked data-option="fabricationType">
            <div class="conf-fabrication-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" stroke-width="2" fill="currentColor" opacity="0.1"/>
              </svg>
            </div>
            <div class="conf-fabrication-content">
              <strong>Sublimé</strong>
              <p>Impression en couleur qualité supérieure, haute résolution</p>
              <div class="conf-fabrication-specs">
                <span>✓ Matière haute qualité</span>
                <span>✓ Résistance aux UV et intempéries</span>
              </div>
            </div>
          </label>
          
          <label class="conf-fabrication-option">
            <input type="radio" name="fabrication" value="pvc" data-option="fabricationType">
            <div class="conf-fabrication-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="currentColor" opacity="0.1"/>
              </svg>
            </div>
            <div class="conf-fabrication-content">
              <strong>PVC</strong>
              <p>PVC en couleur souple et résistant, idéal extérieur</p>
              <div class="conf-fabrication-specs">
                <span>✓ 100% PVC</span>
                <span>✓ Très résistant</span>
              </div>
            </div>
          </label>
          
          <label class="conf-fabrication-option">
            <input type="radio" name="fabrication" value="tisse" data-option="fabricationType">
            <div class="conf-fabrication-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M3 3H21V21H3V3Z" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M3 8H21M3 13H21M3 18H21M8 3V21M13 3V21M18 3V21" stroke="currentColor" stroke-width="1"/>
              </svg>
            </div>
            <div class="conf-fabrication-content">
              <strong>Tissé</strong>
              <p>Fil tissé en couleur, effet brodé très résistant</p>
              <div class="conf-fabrication-specs">
                <span>✓ Effet brodé haut de gamme</span>
                <span>✓ Très résistant</span>
              </div>
            </div>
          </label>
        </div>

        <button class="conf-btn-secondary conf-btn-full" style="margin-top: 16px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
          </svg>
          CONTACTEZ-NOUS POUR PVC OU TISSU
        </button>
      </div>
    </div>

    <!-- Section 5: Bande d'aide -->
    <div class="conf-section">
      <div class="conf-section-header">
        <h3 class="conf-section-title">BANDE D'AIDE ?</h3>
      </div>
      <div class="conf-section-content">
        <p class="conf-help-text">Contactez-nous, nous sommes là pour vous aider !</p>
        <button class="conf-btn-secondary conf-btn-full">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 15.5C18.75 15.5 17.55 15.3 16.43 14.93C16.33 14.9 16.22 14.88 16.12 14.88C15.86 14.88 15.61 14.98 15.41 15.17L13.21 17.37C10.38 15.93 8.06 13.62 6.62 10.79L8.82 8.58C9.1 8.31 9.18 7.92 9.07 7.57C8.7 6.45 8.5 5.25 8.5 4C8.5 3.45 8.05 3 7.5 3H4C3.45 3 3 3.45 3 4C3 13.39 10.61 21 20 21C20.55 21 21 20.55 21 20V16.5C21 15.95 20.55 15.5 20 15.5Z" fill="currentColor"/>
          </svg>
          Contactez-nous
        </button>
        <p class="conf-help-info">À votre écoute 5j/7</p>
      </div>
    </div>
  `;
}

function generateUploadZone(id, buttonText, acceptText) {
  return `
    <div class="conf-upload-zone conf-upload-zone-large" data-upload-zone="${id}">
      <input 
        type="file" 
        id="upload-${id}" 
        data-upload="${id}"
        accept="image/*,.pdf"
        style="display: none;"
      >
      <label for="upload-${id}" class="conf-upload-label">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <path d="M9 16V10H5L12 3L19 10H15V16H9ZM5 20V18H19V20H5Z" fill="currentColor"/>
        </svg>
        <span class="conf-upload-text">${buttonText}</span>
        <span class="conf-upload-formats">${acceptText}</span>
      </label>
    </div>
  `;
}

export const config = {
  productType: 'patches',
  minQuantity: 20,
  options: {
    shapes: ['rond', 'carre', 'rectangle', 'blason'],
    sizes: ['7cm', '8cm', '9cm', '10cm', '8x6cm', '10x7.5cm'],
    fabricationTypes: ['sublime', 'pvc', 'tisse']
  }
};
