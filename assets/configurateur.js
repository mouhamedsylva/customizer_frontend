/**
 * Configurateur - JavaScript principal
 * Version: 1.0.0
 */

class Configurateur {
  constructor() {
    this.currentProductType = 'textile';
    this.currentView = '3d';
    this.currentDesign = {};
    this.quantity = 1;
    this.pricing = {};
    this.apiEndpoint = window.CONF_API_ENDPOINT || 'http://localhost:3000/api';
    
    this.init();
  }
  
  /**
   * Initialisation
   */
  init() {
    console.log('🎨 Configurateur initialisé');
    
    this.cacheElements();
    this.bindEvents();
    this.loadProductConfig('textile');
    this.updatePricing();
  }
  
  /**
   * Mise en cache des éléments DOM
   */
  cacheElements() {
    this.elements = {
      // Header
      productTitle: document.querySelector('[data-product-title]'),
      productSubtitle: document.querySelector('[data-product-subtitle]'),
      productIcon: document.querySelector('[data-product-icon]'),
      productTypes: document.querySelectorAll('[data-product-type]'),
      
      // Canvas
      canvasTitle: document.querySelector('[data-canvas-title]'),
      viewTabs: document.querySelectorAll('[data-view]'),
      canvasViews: document.querySelectorAll('[data-view-angle]'),
      zoomLevel: document.querySelector('[data-zoom-level]'),
      
      // Sidebar
      sidebarContent: document.querySelector('[data-sidebar-content]'),
      
      // Récapitulatif
      recapPreview: document.querySelector('[data-recap-preview]'),
      recapProductName: document.querySelector('[data-recap-product-name]'),
      recapSpecs: document.querySelector('[data-recap-specs]'),
      recapCustomizations: document.querySelector('[data-recap-customizations]'),
      quantityInput: document.querySelector('[data-quantity-input]'),
      unitPrice: document.querySelector('[data-unit-price]'),
      totalHT: document.querySelector('[data-total-ht]'),
      totalTTC: document.querySelector('[data-total-ttc]'),
      discountInfo: document.querySelector('[data-discount-info]'),
      discountPercent: document.querySelector('[data-discount-percent]'),
      discountAmount: document.querySelector('[data-discount-amount]'),
    };
  }
  
  /**
   * Liaison des événements
   */
  bindEvents() {
    // Changement de type de produit
    this.elements.productTypes.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.productType;
        this.changeProductType(type);
      });
    });
    
    // Changement de vue
    this.elements.viewTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        this.changeView(view);
      });
    });
    
    // Actions du bouton
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        this.handleAction(action);
      });
    });
    
    // Quantité
    if (this.elements.quantityInput) {
      this.elements.quantityInput.addEventListener('change', (e) => {
        this.updateQuantity(parseInt(e.target.value));
      });
    }
  }
  
  /**
   * Changer de type de produit
   */
  changeProductType(type) {
    console.log(`🔄 Changement vers: ${type}`);
    
    this.currentProductType = type;
    
    // Mettre à jour l'UI
    this.elements.productTypes.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.productType === type);
    });
    
    // Charger la configuration du produit
    this.loadProductConfig(type);
    
    // Réinitialiser le design
    this.currentDesign = {
      productType: type,
      options: {},
      logos: [],
      quantity: this.quantity
    };
    
    // Mettre à jour le pricing
    this.updatePricing();
  }
  
  /**
   * Charger la configuration d'un produit
   */
  async loadProductConfig(type) {
    const configs = {
      textile: {
        title: 'CUSTOM TEXTILE',
        subtitle: 'Créez votre style',
        icon: 'textile',
        canvasTitle: 'Personnalisez votre article'
      },
      drapeaux: {
        title: 'CUSTOM FLAGS',
        subtitle: 'Créez votre drapeau unique',
        icon: 'drapeaux',
        canvasTitle: 'Visualisez votre drapeau'
      },
      patches: {
        title: 'CUSTOM PATCHES',
        subtitle: 'Créez votre patch personnalisé',
        icon: 'patches',
        canvasTitle: 'Aperçu de votre patch'
      },
      coins: {
        title: 'CUSTOM COINS',
        subtitle: 'Créez votre pièce unique',
        icon: 'coins',
        canvasTitle: 'Visualisez votre coin'
      }
    };
    
    const config = configs[type] || configs.textile;
    
    // Mettre à jour le header
    if (this.elements.productTitle) {
      this.elements.productTitle.textContent = config.title;
    }
    if (this.elements.productSubtitle) {
      this.elements.productSubtitle.textContent = config.subtitle;
    }
    if (this.elements.productIcon) {
      this.elements.productIcon.dataset.icon = config.icon;
    }
    if (this.elements.canvasTitle) {
      this.elements.canvasTitle.textContent = config.canvasTitle;
    }
    
    // Charger le contenu de la sidebar
    await this.loadSidebarContent(type);
  }
  
  /**
   * Charger le contenu de la sidebar selon le type
   */
  async loadSidebarContent(type) {
    if (!this.elements.sidebarContent) return;
    
    // Import dynamique du module produit
    try {
      const module = await import(`./products/${type}.js`);
      const content = module.generateSidebar();
      this.elements.sidebarContent.innerHTML = content;
      
      // Réattacher les événements
      this.bindSidebarEvents();
    } catch (error) {
      console.error(`Erreur chargement module ${type}:`, error);
    }
  }
  
  /**
   * Liaison des événements de la sidebar
   */
  bindSidebarEvents() {
    // Color picker
    document.querySelectorAll('[data-color]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const color = e.currentTarget.dataset.color;
        this.updateOption('color', color);
      });
    });
    
    // Size selector
    document.querySelectorAll('[data-size]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const size = e.currentTarget.dataset.size;
        this.updateOption('size', size);
      });
    });
    
    // Upload
    document.querySelectorAll('[data-upload]').forEach(input => {
      input.addEventListener('change', (e) => {
        const placement = e.currentTarget.dataset.upload;
        this.handleUpload(e.target.files[0], placement);
      });
    });
  }
  
  /**
   * Mettre à jour une option
   */
  updateOption(key, value) {
    console.log(`✏️ Option ${key} = ${value}`);
    
    this.currentDesign.options = this.currentDesign.options || {};
    this.currentDesign.options[key] = value;
    
    // Mettre à jour le récapitulatif
    this.updateRecap();
    
    // Mettre à jour le pricing
    this.updatePricing();
  }
  
  /**
   * Gérer l'upload d'un fichier
   */
  async handleUpload(file, placement) {
    if (!file) return;
    
    console.log(`📤 Upload ${file.name} pour ${placement}`);
    
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('productType', this.currentProductType);
    formData.append('placement', placement);
    
    try {
      const response = await fetch(`${this.apiEndpoint}/upload/logo`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Upload réussi:', data.data.url);
        
        // Ajouter le logo au design
        this.currentDesign.logos = this.currentDesign.logos || [];
        this.currentDesign.logos.push({
          placement,
          url: data.data.url,
          publicId: data.data.publicId
        });
        
        // Mettre à jour le canvas
        this.updateCanvas();
        
        // Mettre à jour le récapitulatif
        this.updateRecap();
      } else {
        console.error('❌ Erreur upload:', data.error);
        alert(`Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      alert('Erreur lors de l\'upload du fichier');
    }
  }
  
  /**
   * Changer de vue
   */
  changeView(view) {
    this.currentView = view;
    
    // Mettre à jour les onglets
    this.elements.viewTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.view === view);
    });
    
    // Mettre à jour les vues
    this.elements.canvasViews.forEach(viewEl => {
      viewEl.classList.toggle('active', viewEl.dataset.viewAngle === view);
    });
  }
  
  /**
   * Mettre à jour le canvas
   */
  updateCanvas() {
    // À implémenter avec Fabric.js ou Three.js
    console.log('🎨 Mise à jour du canvas');
  }
  
  /**
   * Mettre à jour le récapitulatif
   */
  updateRecap() {
    if (!this.elements.recapCustomizations) return;
    
    const customizations = [];
    
    // Ajouter les options
    if (this.currentDesign.options) {
      Object.entries(this.currentDesign.options).forEach(([key, value]) => {
        customizations.push({
          label: this.getOptionLabel(key),
          value: value
        });
      });
    }
    
    // Ajouter les logos
    if (this.currentDesign.logos && this.currentDesign.logos.length > 0) {
      customizations.push({
        label: 'Logos',
        value: `${this.currentDesign.logos.length} logo(s)`
      });
    }
    
    // Générer le HTML
    const html = customizations.map(item => `
      <li>
        <span>${item.label}</span>
        <strong>${item.value}</strong>
      </li>
    `).join('');
    
    this.elements.recapCustomizations.innerHTML = html || '<li>Aucune personnalisation</li>';
  }
  
  /**
   * Obtenir le label d'une option
   */
  getOptionLabel(key) {
    const labels = {
      color: 'Couleur',
      size: 'Taille',
      productType: 'Type',
      material: 'Matière',
      finish: 'Finition'
    };
    return labels[key] || key;
  }
  
  /**
   * Mettre à jour la quantité
   */
  updateQuantity(newQuantity) {
    if (newQuantity < 1) newQuantity = 1;
    
    this.quantity = newQuantity;
    this.currentDesign.quantity = newQuantity;
    
    if (this.elements.quantityInput) {
      this.elements.quantityInput.value = newQuantity;
    }
    
    this.updatePricing();
  }
  
  /**
   * Mettre à jour le pricing
   */
  async updatePricing() {
    try {
      const response = await fetch(`${this.apiEndpoint}/pricing/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productType: this.currentProductType,
          quantity: this.quantity,
          options: this.currentDesign.options || {}
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.pricing = data.data.pricing;
        this.displayPricing();
      }
    } catch (error) {
      console.error('❌ Erreur calcul prix:', error);
    }
  }
  
  /**
   * Afficher le pricing
   */
  displayPricing() {
    if (this.elements.unitPrice) {
      this.elements.unitPrice.textContent = `${this.pricing.unitPrice?.toFixed(2) || '0.00'} €`;
    }
    
    if (this.elements.totalHT) {
      this.elements.totalHT.textContent = `${this.pricing.total?.toFixed(2) || '0.00'} €`;
    }
    
    if (this.elements.totalTTC) {
      this.elements.totalTTC.textContent = `${this.pricing.totalTTC?.toFixed(2) || '0.00'} €`;
    }
    
    // Remise
    if (this.pricing.discount > 0) {
      if (this.elements.discountInfo) {
        this.elements.discountInfo.style.display = 'flex';
      }
      if (this.elements.discountPercent) {
        this.elements.discountPercent.textContent = this.pricing.discount;
      }
      if (this.elements.discountAmount) {
        this.elements.discountAmount.textContent = `-${this.pricing.discountAmount?.toFixed(2) || '0.00'} €`;
      }
    } else {
      if (this.elements.discountInfo) {
        this.elements.discountInfo.style.display = 'none';
      }
    }
  }
  
  /**
   * Gérer les actions
   */
  async handleAction(action) {
    console.log(`🎬 Action: ${action}`);
    
    switch (action) {
      case 'increase-qty':
        this.updateQuantity(this.quantity + 1);
        break;
        
      case 'decrease-qty':
        this.updateQuantity(this.quantity - 1);
        break;
        
      case 'add-to-cart':
        await this.addToCart();
        break;
        
      case 'save-design':
        await this.saveDesign();
        break;
        
      case 'share':
        this.shareDesign();
        break;
        
      case 'reset':
        this.resetDesign();
        break;
        
      case 'zoom-in':
        if (window.canvasManager) window.canvasManager.zoomIn();
        this.updateZoomDisplay();
        break;
        
      case 'zoom-out':
        if (window.canvasManager) window.canvasManager.zoomOut();
        this.updateZoomDisplay();
        break;

      case 'zoom-reset':
        if (window.canvasManager) window.canvasManager.resetZoom();
        this.updateZoomDisplay();
        break;
        
      default:
        console.warn(`Action inconnue: ${action}`);
    }
  }
  
  /**
   * Ajouter au panier
   */
  async addToCart() {
    console.log('🛒 Ajout au panier');
    
    // Sauvegarder le design d'abord
    const designId = await this.saveDesign();
    
    if (!designId) {
      alert('Erreur lors de la sauvegarde du design');
      return;
    }
    
    // Ajouter au panier Shopify
    // À implémenter selon l'API Shopify
    alert('Produit ajouté au panier !');
  }
  
  /**
   * Sauvegarder le design
   */
  async saveDesign() {
    console.log('💾 Sauvegarde du design');
    
    try {
      const response = await fetch(`${this.apiEndpoint}/designs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productType: this.currentProductType,
          designData: this.currentDesign
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Design sauvegardé:', data.data.id);
        return data.data.id;
      }
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
    }
    
    return null;
  }
  
  /**
   * Partager le design
   */
  shareDesign() {
    console.log('📤 Partage du design');
    
    if (navigator.share) {
      navigator.share({
        title: 'Mon design personnalisé',
        text: 'Découvrez mon design créé avec le configurateur',
        url: window.location.href
      });
    } else {
      // Copier le lien
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  }
  
  /**
   * Réinitialiser le design
   */
  resetDesign() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser votre design ?')) {
      console.log('🔄 Réinitialisation');
      
      this.currentDesign = {
        productType: this.currentProductType,
        options: {},
        logos: [],
        quantity: 1
      };
      
      this.quantity = 1;
      
      this.updateRecap();
      this.updatePricing();
      this.updateCanvas();
    }
  }
  
  /**
   * Zoom
   */
  updateZoomDisplay() {
    const level = window.canvasManager?.zoom || 1;
    if (this.elements.zoomLevel) {
      this.elements.zoomLevel.textContent = Math.round(level * 100) + '%';
    }
  }
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', () => {
  window.configurateur = new Configurateur();
});
