/**
 * Configuration pour les drapeaux personnalisés
 */

export function generateSidebar() {
  return `
    <!-- Section 1: Type d'impression -->
    <div class="conf-section">
      <div class="conf-section-header">
        <h3 class="conf-section-title">1. TYPE D'IMPRESSION</h3>
      </div>
      <div class="conf-section-content">
        <p class="conf-section-subtitle">Choisissez le type d'impression de votre drapeau</p>
        <div class="conf-option-grid">
          <button class="conf-option-card active" data-option="printType" data-value="rectoVerso">
            <div class="conf-option-icon">
              <div class="conf-flag-double">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path d="M12 4V20" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </div>
            <div>
              <strong>Recto verso</strong>
              <p>Impression recto & verso, faces différentes</p>
            </div>
          </button>
          
          <button class="conf-option-card" data-option="printType" data-value="rectoSimple">
            <div class="conf-option-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="4" width="20" height="16" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <div>
              <strong>Recto simple</strong>
              <p>Impression recto, verso vide (50% du prix)</p>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Section 2: Orientation -->
    <div class="conf-section">
      <div class="conf-section-header">
        <h3 class="conf-section-title">2. ORIENTATION</h3>
      </div>
      <div class="conf-section-content">
        <p class="conf-section-subtitle">Choisissez l'orientation de votre drapeau</p>
        <div class="conf-orientation-grid">
          <button class="conf-option-card active" data-option="orientation" data-value="paysage">
            <svg width="64" height="48" viewBox="0 0 64 48" fill="none">
              <rect x="2" y="8" width="60" height="32" stroke="currentColor" stroke-width="2" fill="var(--conf-bg-light)"/>
              <path d="M4 10H62V38H4V10Z" fill="currentColor" opacity="0.1"/>
            </svg>
            <span>Paysage (Horizontal)</span>
          </button>
          
          <button class="conf-option-card" data-option="orientation" data-value="portrait">
            <svg width="48" height="64" viewBox="0 0 48 64" fill="none">
              <rect x="8" y="2" width="32" height="60" stroke="currentColor" stroke-width="2" fill="var(--conf-bg-light)"/>
              <path d="M10 4H38V62H10V4Z" fill="currentColor" opacity="0.1"/>
            </svg>
            <span>Portrait (Vertical)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Section 3: Taille -->
    <div class="conf-section">
      <div class="conf-section-header">
        <h3 class="conf-section-title">3. TAILLE</h3>
      </div>
      <div class="conf-section-content">
        <p class="conf-section-subtitle">Sélectionnez la taille de votre drapeau</p>
        <div class="conf-size-list">
          <button class="conf-size-option active" data-option="size" data-value="90x150">
            <span class="conf-size-check">✓</span>
            <div>
              <strong>90 x 150 cm</strong>
              <span>Format standard</span>
            </div>
          </button>
          
          <button class="conf-size-option" data-option="size" data-value="100x150">
            <span class="conf-size-check">✓</span>
            <div>
              <strong>1 x 1.5 m</strong>
              <span>Format carré</span>
            </div>
          </button>
          
          <button class="conf-size-option" data-option="size" data-value="150x225">
            <span class="conf-size-check">✓</span>
            <div>
              <strong>150 x 225 cm</strong>
              <span>Grand format</span>
            </div>
          </button>
          
          <button class="conf-size-option" data-option="size" data-value="custom">
            <span class="conf-size-check">✓</span>
            <div>
              <strong>Personnalisé</strong>
              <span>Sur mesure</span>
            </div>
          </button>
        </div>

        <div class="conf-custom-size" data-custom-size style="display: none;">
          <label>Dimensions personnalisées</label>
          <div class="conf-dimension-inputs">
            <div class="conf-input-group">
              <input type="number" placeholder="Largeur" data-custom-width>
              <span>cm</span>
            </div>
            <span>×</span>
            <div class="conf-input-group">
              <input type="number" placeholder="Hauteur" data-custom-height>
              <span>cm</span>
            </div>
          </div>
          <p class="conf-info-note" style="margin-top: 12px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
            </svg>
            <small>Pour une taille personnalisée, contactez-nous avec vos dimensions via le bouton ci-dessous.</small>
          </p>
          <button class="conf-btn-secondary conf-btn-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
            </svg>
            CONTACTEZ-NOUS POUR PVC OU TISSU
          </button>
        </div>
      </div>
    </div>

    <!-- Section 4: Ajouter vos designs -->
    <div class="conf-section">
      <div class="conf-section-header">
        <h3 class="conf-section-title">4. AJOUTEZ VOS DESIGNS</h3>
      </div>
      <div class="conf-section-content">
        <p class="conf-section-subtitle">Ajoutez vos logos, textes ou visuels</p>
        
        <div class="conf-design-tabs">
          <button class="conf-tab active" data-tab="recto">Design recto</button>
          <button class="conf-tab" data-tab="verso">Design verso</button>
        </div>

        <div class="conf-tab-content active" data-content="recto">
          ${generateUploadZone('recto', 'Télécharger un fichier', 'PNG, JPG, SVG, ou PDF - Taille max: 50 Mo')}
          <div class="conf-upload-preview" data-preview="recto" style="display: none;"></div>
        </div>

        <div class="conf-tab-content" data-content="verso">
          ${generateUploadZone('verso', 'Télécharger un fichier', 'PNG, JPG, SVG, ou PDF - Taille max: 50 Mo')}
          <div class="conf-upload-preview" data-preview="verso" style="display: none;"></div>
        </div>

        <div class="conf-info-note">
          <strong>Conseils pour un rendu optimal :</strong>
          <ul style="margin: 8px 0 0 0; padding-left: 20px;">
            <li>Utilisez des fichiers en haute résolution (300 DPI)</li>
            <li>Les couleurs blanches ne rendent pas sur drapeaux blancs</li>
            <li>Évitez les dégradés très fins</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Section 5: Options -->
    <div class="conf-section">
      <div class="conf-section-header">
        <h3 class="conf-section-title">5. OPTIONS</h3>
      </div>
      <div class="conf-section-content">
        <p class="conf-section-subtitle">Personnalisez la finition de votre drapeau</p>
        
        <div class="conf-option-group">
          <label class="conf-radio-option active">
            <input type="radio" name="finish" value="2oeillets" checked data-option="finish">
            <div class="conf-radio-content">
              <strong>2 œillets</strong>
              <p>Finition par 2 œillets</p>
            </div>
          </label>
          
          <label class="conf-radio-option">
            <input type="radio" name="finish" value="4oeillets" data-option="finish">
            <div class="conf-radio-content">
              <strong>4 œillets</strong>
              <p>Finition par 4 œillets (+2,00 €)</p>
            </div>
          </label>
          
          <label class="conf-radio-option">
            <input type="radio" name="finish" value="fourreauBois" data-option="finish">
            <div class="conf-radio-content">
              <strong>Fourreau avec bois</strong>
              <p>Avec support en bois (+5,00 €)</p>
            </div>
          </label>
        </div>

        <div class="conf-material-select" style="margin-top: 16px;">
          <label>Matière</label>
          <select data-option="material" class="conf-select">
            <option value="polyester110g">Polyester 110g/m² (Standard)</option>
            <option value="polyester115g">Polyester 115g/m² (+10%)</option>
          </select>
        </div>
      </div>
    </div>
  `;
}

function generateUploadZone(id, buttonText, acceptText) {
  return `
    <div class="conf-upload-zone" data-upload-zone="${id}">
      <input 
        type="file" 
        id="upload-${id}" 
        data-upload="${id}"
        accept="image/*,.pdf"
        style="display: none;"
      >
      <label for="upload-${id}" class="conf-upload-label">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M9 16V10H5L12 3L19 10H15V16H9ZM5 20V18H19V20H5Z" fill="currentColor"/>
        </svg>
        <span class="conf-upload-text">${buttonText}</span>
        <span class="conf-upload-formats">${acceptText}</span>
      </label>
    </div>
  `;
}

export const config = {
  productType: 'drapeaux',
  minQuantity: 1,
  options: {
    printTypes: ['rectoVerso', 'rectoSimple'],
    orientations: ['paysage', 'portrait'],
    sizes: ['90x150', '100x150', '150x225', 'custom'],
    finishes: ['2oeillets', '4oeillets', 'fourreauBois'],
    materials: ['polyester110g', 'polyester115g']
  }
};
