/**
 * Product Switch - Gestion du changement de type de produit
 * Basé sur le mockup fourni
 */

class ProductSwitcher {
  constructor() {
    this.currentProduct = 'sweatshirt';
    this.productConfig = null;
    this.init();
  }
  
  init() {
    console.log('🔄 ProductSwitcher initialisé');
    this.loadProductConfig();
    this.bindEvents();
  }
  
  loadProductConfig() {
    // Configuration chargée depuis products-textile.js
    if (typeof TEXTILE_CONFIG !== 'undefined') {
      this.productConfig = TEXTILE_CONFIG;
      console.log('✅ Configuration textile chargée', this.productConfig);
    } else {
      console.warn('⚠️ TEXTILE_CONFIG non trouvé');
    }
  }
  
  bindEvents() {
    // Changement de type de produit
    document.querySelectorAll('[data-product]').forEach(card => {
      card.addEventListener('click', (e) => {
        const productType = e.currentTarget.dataset.product;
        this.switchProduct(productType);
      });
    });
    
    // Changement de couleur
    document.querySelectorAll('[data-color]').forEach(colorBtn => {
      colorBtn.addEventListener('click', (e) => {
        this.selectColor(e.currentTarget.dataset.color);
      });
    });
    
    // Changement de taille
    document.querySelectorAll('[data-size]').forEach(sizeBtn => {
      sizeBtn.addEventListener('click', (e) => {
        this.selectSize(e.currentTarget.dataset.size);
      });
    });
    
    // Upload zones
    document.querySelectorAll('[data-upload-zone]').forEach(zone => {
      const zoneId = zone.dataset.uploadZone;
      const input = document.getElementById(`upload-${zoneId}`);
      
      zone.addEventListener('click', () => {
        input.click();
      });
      
      input.addEventListener('change', (e) => {
        this.handleFileUpload(e, zoneId);
      });
      
      // Drag & drop
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragging');
      });
      
      zone.addEventListener('dragleave', () => {
        zone.classList.remove('dragging');
      });
      
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragging');
        
        if (e.dataTransfer.files.length) {
          input.files = e.dataTransfer.files;
          this.handleFileUpload({ target: input }, zoneId);
        }
      });
    });
    
    // Toggle personnalisation manches
    const manchesToggle = document.querySelector('[data-toggle="manches-enabled"]');
    const manchesOptions = document.querySelector('[data-manches-options]');
    
    if (manchesToggle && manchesOptions) {
      manchesToggle.addEventListener('click', () => {
        manchesToggle.classList.toggle('active');
        const isActive = manchesToggle.classList.contains('active');
        manchesOptions.style.display = isActive ? 'flex' : 'none';
        
        // Dispatch event pour mise à jour du prix
        document.dispatchEvent(new CustomEvent('conf:option-changed', {
          detail: { option: 'manches', enabled: isActive, price: 5.00 }
        }));
      });
    }
    
    // Polices texte manches
    document.querySelectorAll('[data-font]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-font]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });
  }
  
  switchProduct(productType) {
    console.log('🔄 Switch vers:', productType);
    
    // Mise à jour UI
    document.querySelectorAll('[data-product]').forEach(card => {
      card.classList.remove('active');
    });
    document.querySelector(`[data-product="${productType}"]`)?.classList.add('active');
    
    this.currentProduct = productType;
    
    // Mise à jour titre header
    const titles = {
      'sweatshirt': 'CUSTOM TEXTILE - Sweatshirt',
      'tshirt': 'CUSTOM TEXTILE - T-shirt coton',
      'tshirt_polyester': 'CUSTOM TEXTILE - T-shirt polyester',
      'extra': 'CUSTOM EXTRA',
      'drapeaux': 'CUSTOM DRAPEAUX',
      'patches': 'CUSTOM PATCHES'
    };
    
    const titleEl = document.querySelector('[data-product-title]');
    if (titleEl) titleEl.textContent = titles[productType] || 'CUSTOM TEXTILE';
    
    // Dispatch event pour autres composants
    document.dispatchEvent(new CustomEvent('conf:product-changed', {
      detail: { productType, config: this.productConfig?.[productType] }
    }));
  }
  
  selectColor(colorId) {
    console.log('🎨 Couleur sélectionnée:', colorId);
    
    document.querySelectorAll('[data-color]').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-color="${colorId}"]`)?.classList.add('active');
    
    document.dispatchEvent(new CustomEvent('conf:color-changed', {
      detail: { colorId }
    }));
  }
  
  selectSize(sizeId) {
    console.log('📏 Taille sélectionnée:', sizeId);
    
    document.querySelectorAll('[data-size]').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-size="${sizeId}"]`)?.classList.add('active');
    
    document.dispatchEvent(new CustomEvent('conf:size-changed', {
      detail: { sizeId }
    }));
  }
  
  handleFileUpload(event, zoneId) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('📁 Fichier uploadé:', file.name, 'pour zone:', zoneId);
    
    // Vérification taille (10MB max)
    if (file.size > 10485760) {
      alert('Fichier trop volumineux. Maximum 10 MB.');
      return;
    }
    
    // Vérification type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image (PNG, JPG, SVG).');
      return;
    }
    
    // Lecture et prévisualisation
    const reader = new FileReader();
    reader.onload = (e) => {
      this.displayUploadPreview(zoneId, e.target.result, file.name);
      
      document.dispatchEvent(new CustomEvent('conf:file-uploaded', {
        detail: { zone: zoneId, file, dataUrl: e.target.result }
      }));
    };
    reader.readAsDataURL(file);
  }
  
  displayUploadPreview(zoneId, dataUrl, fileName) {
    const container = document.querySelector(`[data-upload-container="${zoneId}"]`);
    if (!container) return;
    
    // Remplacer la zone d'upload par la préview
    container.innerHTML = `
      <div class="conf-upload-preview">
        <img src="${dataUrl}" alt="${fileName}">
        <button class="conf-upload-remove" data-remove="${zoneId}" title="Supprimer">
          ×
        </button>
      </div>
      <div class="conf-upload-actions">
        <button data-change="${zoneId}">Changer</button>
        <button data-delete="${zoneId}">Supprimer</button>
      </div>
    `;
    
    // Bind events pour les boutons
    container.querySelector(`[data-remove="${zoneId}"]`)?.addEventListener('click', () => {
      this.removeUpload(zoneId);
    });
    
    container.querySelector(`[data-change="${zoneId}"]`)?.addEventListener('click', () => {
      document.getElementById(`upload-${zoneId}`).click();
    });
    
    container.querySelector(`[data-delete="${zoneId}"]`)?.addEventListener('click', () => {
      this.removeUpload(zoneId);
    });
  }
  
  removeUpload(zoneId) {
    const container = document.querySelector(`[data-upload-container="${zoneId}"]`);
    if (!container) return;
    
    // Remettre la zone d'upload
    container.innerHTML = `
      <div class="conf-upload-zone" data-upload-zone="${zoneId}">
        <input type="file" id="upload-${zoneId}" accept="image/*" style="display:none;">
        <div class="conf-upload-icon">📁</div>
        <p class="conf-upload-text"><strong>Cliquez</strong> ou déposez votre fichier</p>
        <p class="conf-upload-hint">PNG, JPG, SVG (Max. 10 MB)</p>
      </div>
    `;
    
    // Re-bind events
    const zone = container.querySelector('[data-upload-zone]');
    const input = document.getElementById(`upload-${zoneId}`);
    
    zone.addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => this.handleFileUpload(e, zoneId));
    
    document.dispatchEvent(new CustomEvent('conf:file-removed', {
      detail: { zone: zoneId }
    }));
  }
}

// Initialisation au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.productSwitcher = new ProductSwitcher();
  });
} else {
  window.productSwitcher = new ProductSwitcher();
}
