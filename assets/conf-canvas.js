/**
 * Gestion du canvas de visualisation
 * Utilise Fabric.js pour le rendu 2D
 */

class CanvasManager {
  constructor(canvasElement) {
    this.canvas = new fabric.Canvas(canvasElement, {
      width: 800,
      height: 800,
      backgroundColor: '#f5f5f5'
    });
    
    this.currentView = 'front';
    this.productType = 'textile';
    this.zoom = 1;
    
    this.init();
  }
  
  init() {
    console.log('🎨 Canvas Manager initialisé');
    
    // Charger les templates de produits
    this.loadProductTemplates();
    
    // Bind events
    this.bindCanvasEvents();
  }
  
  /**
   * Charger les templates de produits de base
   */
  async loadProductTemplates() {
    this.templates = {
      textile: {
        front: '/assets/templates/textile-front.png',
        back: '/assets/templates/textile-back.png',
        side: '/assets/templates/textile-side.png'
      },
      drapeaux: {
        front: '/assets/templates/flag-front.png',
        back: '/assets/templates/flag-back.png'
      },
      patches: {
        front: '/assets/templates/patch-front.png'
      },
      coins: {
        front: '/assets/templates/coin-front.png',
        back: '/assets/templates/coin-back.png',
        side: '/assets/templates/coin-side.png'
      }
    };
  }
  
  /**
   * Bind des événements canvas
   */
  bindCanvasEvents() {
    // Selection d'objet
    this.canvas.on('selection:created', (e) => {
      console.log('Objet sélectionné:', e.selected[0]);
    });
    
    // Modification d'objet
    this.canvas.on('object:modified', (e) => {
      console.log('Objet modifié:', e.target);
      this.saveState();
    });
  }
  
  /**
   * Changer le type de produit
   */
  async setProductType(type) {
    this.productType = type;
    await this.loadProductBase();
  }
  
  /**
   * Charger le produit de base
   */
  async loadProductBase() {
    this.canvas.clear();
    
    const templateUrl = this.templates[this.productType]?.[this.currentView];
    
    if (templateUrl) {
      fabric.Image.fromURL(templateUrl, (img) => {
        img.set({
          selectable: false,
          evented: false
        });
        
        // Centrer et adapter
        const scale = Math.min(
          this.canvas.width / img.width,
          this.canvas.height / img.height
        ) * 0.8;
        
        img.scale(scale);
        img.center();
        
        this.canvas.add(img);
        this.canvas.sendToBack(img);
        this.canvas.renderAll();
      });
    }
  }
  
  /**
   * Ajouter un logo
   */
  async addLogo(imageUrl, placement, options = {}) {
    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(imageUrl, (img) => {
        if (!img) {
          reject(new Error('Impossible de charger l\'image'));
          return;
        }
        
        // Configuration par défaut
        const config = {
          left: options.left || this.canvas.width / 2,
          top: options.top || this.canvas.height / 2,
          originX: 'center',
          originY: 'center',
          selectable: true,
          hasControls: true,
          hasBorders: true,
          cornerSize: 12,
          transparentCorners: false,
          cornerColor: '#2c5aa0',
          cornerStrokeColor: '#fff',
          borderColor: '#2c5aa0',
          ...options
        };
        
        // Adapter la taille
        const maxSize = 300;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        img.scale(scale);
        
        img.set(config);
        img.set('placement', placement);
        img.set('logoId', Date.now());
        
        this.canvas.add(img);
        this.canvas.setActiveObject(img);
        this.canvas.renderAll();
        
        this.saveState();
        
        resolve(img);
      }, { crossOrigin: 'anonymous' });
    });
  }
  
  /**
   * Ajouter du texte
   */
  addText(text, options = {}) {
    const textObj = new fabric.IText(text, {
      left: this.canvas.width / 2,
      top: this.canvas.height / 2,
      originX: 'center',
      originY: 'center',
      fontFamily: 'Arial',
      fontSize: 40,
      fill: '#000000',
      selectable: true,
      ...options
    });
    
    this.canvas.add(textObj);
    this.canvas.setActiveObject(textObj);
    this.canvas.renderAll();
    
    this.saveState();
    
    return textObj;
  }
  
  /**
   * Supprimer l'objet sélectionné
   */
  deleteSelected() {
    const activeObject = this.canvas.getActiveObject();
    
    if (activeObject) {
      this.canvas.remove(activeObject);
      this.canvas.renderAll();
      this.saveState();
    }
  }
  
  /**
   * Changer de vue
   */
  async changeView(view) {
    this.currentView = view;
    
    // Sauvegarder l'état actuel
    const currentState = this.getDesignData();
    
    // Recharger avec la nouvelle vue
    await this.loadProductBase();
    
    // Restaurer les logos pour cette vue
    if (currentState.logos) {
      for (const logo of currentState.logos) {
        if (logo.view === view) {
          await this.addLogo(logo.url, logo.placement, logo.options);
        }
      }
    }
  }
  
  /**
   * Zoom
   */
  setZoom(level) {
    this.zoom = Math.max(0.5, Math.min(3, level));
    this.canvas.setZoom(this.zoom);
    this.canvas.renderAll();
    
    return this.zoom;
  }
  
  zoomIn() {
    return this.setZoom(this.zoom * 1.2);
  }
  
  zoomOut() {
    return this.setZoom(this.zoom / 1.2);
  }
  
  /**
   * Réinitialiser le zoom
   */
  resetZoom() {
    return this.setZoom(1);
  }
  
  /**
   * Changer la couleur du produit
   */
  setProductColor(color) {
    // Trouver l'image de base
    const baseImage = this.canvas.getObjects().find(obj => !obj.selectable);
    
    if (baseImage) {
      // Appliquer un filtre de couleur
      baseImage.filters = [
        new fabric.Image.filters.BlendColor({
          color: color,
          mode: 'multiply',
          alpha: 0.5
        })
      ];
      
      baseImage.applyFilters();
      this.canvas.renderAll();
    }
  }
  
  /**
   * Obtenir les données du design
   */
  getDesignData() {
    const objects = this.canvas.getObjects().filter(obj => obj.selectable);
    
    return {
      productType: this.productType,
      view: this.currentView,
      zoom: this.zoom,
      logos: objects.map(obj => ({
        type: obj.type,
        placement: obj.placement || 'custom',
        view: this.currentView,
        url: obj.type === 'image' ? obj.getSrc() : null,
        text: obj.type === 'i-text' ? obj.text : null,
        options: {
          left: obj.left,
          top: obj.top,
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
          angle: obj.angle,
          fill: obj.fill,
          fontSize: obj.fontSize,
          fontFamily: obj.fontFamily
        }
      }))
    };
  }
  
  /**
   * Charger des données de design
   */
  async loadDesignData(data) {
    this.productType = data.productType;
    this.currentView = data.view || 'front';
    
    await this.loadProductBase();
    
    if (data.logos) {
      for (const logo of data.logos) {
        if (logo.type === 'image') {
          await this.addLogo(logo.url, logo.placement, logo.options);
        } else if (logo.type === 'i-text') {
          this.addText(logo.text, logo.options);
        }
      }
    }
    
    if (data.zoom) {
      this.setZoom(data.zoom);
    }
  }
  
  /**
   * Exporter en image
   */
  exportAsImage(format = 'png', quality = 1) {
    return this.canvas.toDataURL({
      format: format,
      quality: quality,
      multiplier: 2 // Pour haute résolution
    });
  }
  
  /**
   * Exporter en SVG
   */
  exportAsSVG() {
    return this.canvas.toSVG();
  }
  
  /**
   * Sauvegarder l'état
   */
  saveState() {
    const state = this.getDesignData();
    
    // Déclencher un événement personnalisé
    window.dispatchEvent(new CustomEvent('canvas:changed', {
      detail: state
    }));
  }
  
  /**
   * Obtenir les dimensions du canvas
   */
  getDimensions() {
    return {
      width: this.canvas.width,
      height: this.canvas.height
    };
  }
  
  /**
   * Redimensionner le canvas
   */
  resize(width, height) {
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    this.canvas.renderAll();
  }
  
  /**
   * Nettoyer le canvas
   */
  clear() {
    this.canvas.clear();
    this.canvas.renderAll();
  }
  
  /**
   * Destroy
   */
  destroy() {
    this.canvas.dispose();
  }
}

// Export
window.CanvasManager = CanvasManager;
