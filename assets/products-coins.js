/**
 * Configuration pour les pièces/médailles personnalisées
 */

export function generateSidebar() {
  return `
    <!-- Section 1: Type de personnalisation -->
    <div class="conf-section">
      <div class="conf-section-header">
        <h3 class="conf-section-title">1. TYPE DE PERSONNALISATION</h3>
      </div>
      <div class="conf-section-content">
        <p class="conf-section-subtitle">Choisissez le type de coin</p>
        
        <div class="conf-coin-type-grid">
          <button class="conf-coin-type-option active" data-option="coinType" data-value="rectoVerso">
            <div class="conf-coin-visual">
              <div class="conf-coin-double">
                <div class="conf-coin-face"></div>
                <div class="conf-coin-face"></div>
              </div>
            </div>
            <div>
              <strong>Recto verso</strong>
              <p>Personnalisez les deux faces de votre coin</p>
            </div>
          </button>
          
          <button class="conf-coin-type-option" data-option="coinType" data-value="rectoSimple">
            <div class="conf-coin-visual">
              <div class="conf-coin-single"></div>
            </div>
            <div>
              <strong>Recto simple</strong>
              <p>Personnalisez uniquement le recto</p>
            </div>
          </button>
          
          <button class="conf-coin-type-option" data-option="coinType" data-value="versoNumerote">
            <div class="conf-coin-visual">
              <div class="conf-coin-numbered">
                <span>001</span>
              </div>
            </div>
            <div>
              <strong>Recto verso numéroté</strong>
              <p>Personnalisez les deux faces, le verso numéroté</p>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Section 2: Numérotation (si verso numéroté) -->
    <div class="conf-section" data-section="numeration" style="display: none;">
      <div class="conf-section-header">
        <h3 class="conf-section-title">NUMÉROTATION</h3>
      </div>
      <div class="conf-section-content">
        <p class="conf-section-subtitle">Définissez la quantité et le numéro de départ</p>
        
        <div class="conf-numeration-controls">
          <div class="conf-input-group">
            <label>Quantité (min. 50)</label>
            <div class="conf-quantity-selector">
              <button class="conf-qty-btn" data-action="decrease-numeration">−</button>
              <input type="number" value="50" min="50" data-numeration-qty>
              <button class="conf-qty-btn" data-action="increase-numeration">+</button>
            </div>
          </div>
          
          <div class="conf-input-group" style="margin-top: 16px;">
            <label>Numéro de départ</label>
            <input type="number" value="1" min="1" class="conf-input" data-numeration-start>
          </div>
        </div>
        
        <p class="conf-help-text">Minimum 50 unités</p>
      </div>
    </div>

    <!-- Section 3: Ajoutez vos logos -->
    <div class="conf-section">
      <div class="conf-section-header">
        <h3 class="conf-section-title">AJOUTEZ VOS LOGOS</h3>
      </div>
      <div class="conf-section-content">
        <p class="conf-section-subtitle">Téléchargez vos fichiers pour le recto et le verso</p>
        
        <div class="conf-logo-grid">
          <div class="conf-logo-section">
            <h4>Logo recto</h4>
            ${generateUploadZone('recto', 'Télécharger un fichier', 'PNG, JPG, SVG, ou PDF - Taille max: 10 Mo')}
            <div class="conf-upload-preview" data-preview="recto" style="display: none;"></div>
          </div>
          
          <div class="conf-logo-section">
            <h4>Logo verso</h4>
            ${generateUploadZone('verso', 'Télécharger un fichier', 'PNG, JPG, SVG, ou PDF - Taille max: 10 Mo')}
            <div class="conf-upload-preview" data-preview="verso" style="display: none;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 4: Forme et taille -->
    <div class="conf-section">
      <div class="conf-section-header">
        <h3 class="conf-section-title">2. FORME ET TAILLE</h3>
      </div>
      <div class="conf-section-content">
        <p class="conf-section-subtitle">Choisissez la forme et la taille de votre coin</p>
        
        <div class="conf-shape-selector">
          <button class="conf-shape-btn active" data-option="shape" data-value="rond">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Rond</span>
          </button>
          
          <button class="conf-shape-btn" data-option="shape" data-value="decoupe">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <path d="M24 2L6 14L14 32L32 38L46 24L38 8L24 2Z" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Découpe à la forme</span>
          </button>
        </div>

        <div class="conf-diameter-selector" style="margin-top: 24px;">
          <label>Diamètre</label>
          <div class="conf-diameter-grid">
            <button class="conf-diameter-btn" data-option="diameter" data-value="25">
              <div class="conf-coin-preview" style="width: 25px; height: 25px;"></div>
              <span>25 mm</span>
            </button>
            
            <button class="conf-diameter-btn active" data-option="diameter" data-value="30">
              <div class="conf-coin-preview" style="width: 30px; height: 30px;"></div>
              <span>30 mm</span>
            </button>
            
            <button class="conf-diameter-btn" data-option="diameter" data-value="38">
              <div class="conf-coin-preview" style="width: 38px; height: 38px;"></div>
              <span>38 mm</span>
            </button>
            
            <button class="conf-diameter-btn" data-option="diameter" data-value="50">
              <div class="conf-coin-preview" style="width: 50px; height: 50px;"></div>
              <span>50 mm</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 5: Finition métallique -->
    <div class="conf-section">
      <div class="conf-section-header">
        <h3 class="conf-section-title">3. FINITION MÉTALLIQUE</h3>
      </div>
      <div class="conf-section-content">
        <p class="conf-section-subtitle">Choisissez la finition de votre coin</p>
        
        <div class="conf-finish-grid">
          <button class="conf-finish-option active" data-option="finish" data-value="orBrillant">
            <div class="conf-finish-sample" style="background: linear-gradient(135deg, #ffd700, #ffed4e);"></div>
            <span>Or brillant</span>
          </button>
          
          <button class="conf-finish-option" data-option="finish" data-value="argentBrillant">
            <div class="conf-finish-sample" style="background: linear-gradient(135deg, #c0c0c0, #e8e8e8);"></div>
            <span>Argent brillant</span>
          </button>
          
          <button class="conf-finish-option" data-option="finish" data-value="bronzeAntique">
            <div class="conf-finish-sample" style="background: linear-gradient(135deg, #8b4513, #cd853f);"></div>
            <span>Bronze antique</span>
          </button>
          
          <button class="conf-finish-option" data-option="finish" data-value="cuivreAntique">
            <div class="conf-finish-sample" style="background: linear-gradient(135deg, #b87333, #d4956c);"></div>
            <span>Cuivre antique</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Section 6: Surface -->
    <div class="conf-section">
      <div class="conf-section-header">
        <h3 class="conf-section-title">4. SURFACE</h3>
      </div>
      <div class="conf-section-content">
        <p class="conf-section-subtitle">Choisissez le type de surface de votre coin</p>
        
        <div class="conf-surface-options">
          <label class="conf-surface-option active">
            <input type="radio" name="surface" value="relief3D" checked data-option="surface">
            <div class="conf-surface-visual">
              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="currentColor" opacity="0.2"/>
                <circle cx="24" cy="24" r="16" fill="currentColor" opacity="0.4"/>
                <circle cx="24" cy="24" r="12" fill="currentColor" opacity="0.6"/>
                <circle cx="24" cy="24" r="8" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <strong>Imprimé sans relief</strong>
              <p>Surface plane sans relief, effet lisse</p>
            </div>
          </label>
          
          <label class="conf-surface-option">
            <input type="radio" name="surface" value="imprime" data-option="surface">
            <div class="conf-surface-visual">
              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="2"/>
                <circle cx="24" cy="24" r="18" fill="currentColor" opacity="0.3"/>
              </svg>
            </div>
            <div>
              <strong>Relief 3D</strong>
              <p>Effet relief 3D, résultat premium</p>
            </div>
          </label>
        </div>
        
        <div class="conf-info-note" style="margin-top: 16px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
          </svg>
          <span>Le rendu 3D est une approximation. Le rendu final peut présenter de légères variations de couleurs et de positionnement.</span>
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
        id="upload-coin-${id}" 
        data-upload="${id}"
        accept="image/*,.pdf"
        style="display: none;"
      >
      <label for="upload-coin-${id}" class="conf-upload-label">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M9 16V10H5L12 3L19 10H15V16H9ZM5 20V18H19V20H5Z" fill="currentColor"/>
        </svg>
        <span class="conf-upload-text">${buttonText}</span>
        <span class="conf-upload-formats">${acceptText}</span>
      </label>
    </div>
  `;
}

export const config = {
  productType: 'coins',
  minQuantity: 50,
  options: {
    coinTypes: ['rectoVerso', 'rectoSimple', 'versoNumerote'],
    shapes: ['rond', 'decoupe'],
    diameters: [25, 30, 38, 50],
    finishes: ['orBrillant', 'argentBrillant', 'bronzeAntique', 'cuivreAntique'],
    surfaces: ['relief3D', 'imprime']
  }
};
