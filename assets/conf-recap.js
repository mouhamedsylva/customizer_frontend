/**
 * RecapManager - Gestion du panneau récapitulatif
 * Affiche le résumé du produit, prix, quantité et actions
 */

class RecapManager {
  constructor(configurator) {
    this.configurator = configurator;
    this.quantity = 1;
    this.minQuantity = 1;
    this.maxQuantity = 10000;
    
    this.elements = {
      preview: null,
      productName: null,
      specs: null,
      customizations: null,
      quantityInput: null,
      decreaseBtn: null,
      increaseBtn: null,
      unitPrice: null,
      discountInfo: null,
      discountPercent: null,
      discountAmount: null,
      totalHT: null,
      totalTTC: null,
      addToCartBtn: null,
      saveDesignBtn: null
    };
    
    this.init();
  }

  /**
   * Initialisation
   */
  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.updateDisplay();
  }

  /**
   * Mettre en cache les éléments DOM
   */
  cacheElements() {
    this.elements.preview = document.querySelector('[data-recap-preview]');
    this.elements.productName = document.querySelector('[data-recap-product-name]');
    this.elements.specs = document.querySelector('[data-recap-specs]');
    this.elements.customizations = document.querySelector('[data-recap-customizations]');
    this.elements.quantityInput = document.querySelector('[data-quantity-input]');
    this.elements.decreaseBtn = document.querySelector('[data-action="decrease-qty"]');
    this.elements.increaseBtn = document.querySelector('[data-action="increase-qty"]');
    this.elements.unitPrice = document.querySelector('[data-unit-price]');
    this.elements.discountInfo = document.querySelector('[data-discount-info]');
    this.elements.discountPercent = document.querySelector('[data-discount-percent]');
    this.elements.discountAmount = document.querySelector('[data-discount-amount]');
    this.elements.totalHT = document.querySelector('[data-total-ht]');
    this.elements.totalTTC = document.querySelector('[data-total-ttc]');
    this.elements.addToCartBtn = document.querySelector('[data-action="add-to-cart"]');
    this.elements.saveDesignBtn = document.querySelector('[data-action="save-design"]');
    this.elements.minQuantity = document.querySelector('[data-min-quantity]');
  }

  /**
   * Configuration des écouteurs d'événements
   */
  setupEventListeners() {
    // Boutons quantité
    if (this.elements.decreaseBtn) {
      this.elements.decreaseBtn.addEventListener('click', () => this.decreaseQuantity());
    }

    if (this.elements.increaseBtn) {
      this.elements.increaseBtn.addEventListener('click', () => this.increaseQuantity());
    }

    // Input quantité
    if (this.elements.quantityInput) {
      this.elements.quantityInput.addEventListener('change', (e) => {
        this.setQuantity(parseInt(e.target.value) || 1);
      });

      this.elements.quantityInput.addEventListener('blur', (e) => {
        this.validateQuantity();
      });
    }

    // Bouton ajouter au panier
    if (this.elements.addToCartBtn) {
      this.elements.addToCartBtn.addEventListener('click', () => this.addToCart());
    }

    // Bouton sauvegarder design
    if (this.elements.saveDesignBtn) {
      this.elements.saveDesignBtn.addEventListener('click', () => this.saveDesign());
    }

    // Écouter les changements de prix
    document.addEventListener('priceUpdated', (e) => {
      this.updatePricing(e.detail);
    });

    // Écouter les changements de design
    document.addEventListener('designUpdated', () => {
      this.updateDisplay();
    });
  }

  /**
   * Diminuer la quantité
   */
  decreaseQuantity() {
    if (this.quantity > this.minQuantity) {
      this.setQuantity(this.quantity - 1);
    }
  }

  /**
   * Augmenter la quantité
   */
  increaseQuantity() {
    if (this.quantity < this.maxQuantity) {
      this.setQuantity(this.quantity + 1);
    }
  }

  /**
   * Définir la quantité
   */
  setQuantity(value) {
    const newQuantity = Math.max(this.minQuantity, Math.min(this.maxQuantity, value));
    
    if (newQuantity !== this.quantity) {
      this.quantity = newQuantity;
      
      if (this.elements.quantityInput) {
        this.elements.quantityInput.value = this.quantity;
      }

      // Mettre à jour l'état des boutons
      this.updateQuantityButtons();

      // Déclencher recalcul du prix
      if (this.configurator.pricingManager) {
        this.configurator.pricingManager.updatePrice();
      }

      // Événement personnalisé
      document.dispatchEvent(new CustomEvent('quantityChanged', {
        detail: { quantity: this.quantity }
      }));
    }
  }

  /**
   * Valider la quantité saisie
   */
  validateQuantity() {
    const value = parseInt(this.elements.quantityInput?.value) || this.minQuantity;
    this.setQuantity(value);
  }

  /**
   * Mettre à jour l'état des boutons de quantité
   */
  updateQuantityButtons() {
    if (this.elements.decreaseBtn) {
      this.elements.decreaseBtn.disabled = this.quantity <= this.minQuantity;
    }

    if (this.elements.increaseBtn) {
      this.elements.increaseBtn.disabled = this.quantity >= this.maxQuantity;
    }
  }

  /**
   * Mettre à jour l'affichage général
   */
  updateDisplay() {
    this.updatePreview();
    this.updateProductInfo();
    this.updateCustomizations();
    this.updateQuantityButtons();
  }

  /**
   * Mettre à jour l'aperçu du produit
   */
  updatePreview() {
    if (!this.elements.preview) return;

    // Récupérer l'image du canvas
    if (this.configurator.canvasManager) {
      try {
        const dataUrl = this.configurator.canvasManager.exportToImage();
        this.elements.preview.src = dataUrl;
      } catch (error) {
        console.error('Erreur lors de l\'export de l\'aperçu:', error);
      }
    }
  }

  /**
   * Mettre à jour les informations du produit
   */
  updateProductInfo() {
    const designData = this.configurator.designData || {};
    const productType = designData.productType || 'textile';
    const options = designData.options || {};

    // Nom du produit
    if (this.elements.productName) {
      const productNames = {
        'textile': 'Sweatshirt Personnalisé',
        'textile-tshirt': 'T-shirt Personnalisé',
        'textile-polo': 'T-shirt Polyester Personnalisé',
        'drapeaux': 'Drapeau Personnalisé',
        'patches': 'Patch Brodé Personnalisé',
        'coins': 'Pièce Personnalisée'
      };
      this.elements.productName.textContent = productNames[productType] || 'Produit Personnalisé';
    }

    // Spécifications
    if (this.elements.specs) {
      const specs = this.generateSpecs(productType, options);
      this.elements.specs.innerHTML = specs;
    }
  }

  /**
   * Générer les spécifications du produit
   */
  generateSpecs(productType, options) {
    let html = '';

    switch (productType) {
      case 'textile':
      case 'textile-tshirt':
      case 'textile-polo':
        if (options.color) {
          html += `<p><strong>Couleur:</strong> ${this.getColorName(options.color)}</p>`;
        }
        if (options.size) {
          html += `<p><strong>Taille:</strong> ${options.size}</p>`;
        }
        break;

      case 'drapeaux':
        if (options.size) {
          html += `<p><strong>Taille:</strong> ${options.size}</p>`;
        }
        if (options.printType) {
          html += `<p><strong>Impression:</strong> ${options.printType}</p>`;
        }
        if (options.finish) {
          html += `<p><strong>Finition:</strong> ${options.finish}</p>`;
        }
        break;

      case 'patches':
        if (options.shape) {
          html += `<p><strong>Forme:</strong> ${options.shape}</p>`;
        }
        if (options.size) {
          html += `<p><strong>Taille:</strong> ${options.size}</p>`;
        }
        if (options.type) {
          html += `<p><strong>Type:</strong> ${options.type}</p>`;
        }
        break;

      case 'coins':
        if (options.diameter) {
          html += `<p><strong>Diamètre:</strong> ${options.diameter}</p>`;
        }
        if (options.finish) {
          html += `<p><strong>Finition:</strong> ${options.finish}</p>`;
        }
        if (options.surface) {
          html += `<p><strong>Surface:</strong> ${options.surface}</p>`;
        }
        break;
    }

    return html || '<p>Aucune spécification</p>';
  }

  /**
   * Obtenir le nom d'une couleur depuis son code hex
   */
  getColorName(hex) {
    const colorNames = {
      '#000000': 'Noir',
      '#ffffff': 'Blanc',
      '#4a4a4a': 'Gris foncé',
      '#9ca3af': 'Gris',
      '#d1d5db': 'Gris clair',
      '#1e3a8a': 'Bleu marine',
      '#3b82f6': 'Bleu',
      '#38bdf8': 'Bleu ciel',
      '#065f46': 'Vert foncé',
      '#22c55e': 'Vert',
      '#ec4899': 'Rose',
      '#fbcfe8': 'Rose clair',
      '#dc2626': 'Rouge',
      '#f97316': 'Orange',
      '#facc15': 'Jaune',
      '#a855f7': 'Violet',
      '#92400e': 'Marron'
    };
    return colorNames[hex?.toLowerCase()] || hex;
  }

  /**
   * Mettre à jour la liste des personnalisations
   */
  updateCustomizations() {
    if (!this.elements.customizations) return;

    const designData = this.configurator.designData || {};
    const customizations = designData.customizations || [];

    if (customizations.length === 0) {
      this.elements.customizations.innerHTML = '<li class="conf-recap-list-empty">Aucune personnalisation</li>';
      return;
    }

    let html = '';
    customizations.forEach(custom => {
      html += `
        <li>
          <span>${custom.label}</span>
          <span>${custom.value}</span>
        </li>
      `;
    });

    this.elements.customizations.innerHTML = html;
  }

  /**
   * Mettre à jour l'affichage des prix
   */
  updatePricing(pricingData) {
    if (!pricingData) return;

    // Prix unitaire
    if (this.elements.unitPrice) {
      this.elements.unitPrice.textContent = this.formatPrice(pricingData.unitPrice);
    }

    // Remise
    if (pricingData.discount > 0) {
      if (this.elements.discountInfo) {
        this.elements.discountInfo.style.display = 'flex';
      }
      if (this.elements.discountPercent) {
        this.elements.discountPercent.textContent = pricingData.discountPercent;
      }
      if (this.elements.discountAmount) {
        this.elements.discountAmount.textContent = `-${this.formatPrice(pricingData.discount)}`;
      }
    } else {
      if (this.elements.discountInfo) {
        this.elements.discountInfo.style.display = 'none';
      }
    }

    // Total HT
    if (this.elements.totalHT) {
      this.elements.totalHT.textContent = this.formatPrice(pricingData.totalHT);
    }

    // Total TTC
    if (this.elements.totalTTC) {
      this.elements.totalTTC.textContent = this.formatPrice(pricingData.totalTTC);
      
      // Animation
      this.elements.totalTTC.classList.add('updating');
      setTimeout(() => {
        this.elements.totalTTC.classList.remove('updating');
      }, 300);
    }
  }

  /**
   * Formater un prix
   */
  formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  /**
   * Ajouter au panier Shopify
   */
  async addToCart() {
    try {
      // Désactiver le bouton
      if (this.elements.addToCartBtn) {
        this.elements.addToCartBtn.disabled = true;
        this.elements.addToCartBtn.classList.add('loading');
      }

      // Préparer les données
      const designData = this.configurator.designData || {};
      const pricingData = this.configurator.pricingManager?.getCurrentPricing() || {};

      // Obtenir le variant ID selon le type de produit
      const variantId = this.getVariantId(designData.productType);

      if (!variantId) {
        throw new Error('Variant ID introuvable pour ce type de produit');
      }

      // Préparer les propriétés du produit
      const properties = {
        'Type de produit': designData.productType,
        'Prix unitaire': this.formatPrice(pricingData.unitPrice || 0),
        'Quantité': this.quantity
      };

      // Ajouter les options
      if (designData.options) {
        Object.keys(designData.options).forEach(key => {
          properties[key] = designData.options[key];
        });
      }

      // Ajouter au panier via Ajax API
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: variantId,
          quantity: this.quantity,
          properties: properties
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout au panier');
      }

      const result = await response.json();

      // Succès
      this.showSuccess('Produit ajouté au panier !');

      // Rediriger vers le panier après 1 seconde
      setTimeout(() => {
        window.location.href = '/cart';
      }, 1000);

    } catch (error) {
      console.error('Erreur addToCart:', error);
      this.showError('Impossible d\'ajouter au panier. Veuillez réessayer.');
    } finally {
      // Réactiver le bouton
      if (this.elements.addToCartBtn) {
        this.elements.addToCartBtn.disabled = false;
        this.elements.addToCartBtn.classList.remove('loading');
      }
    }
  }

  /**
   * Obtenir le variant ID selon le type de produit
   */
  getVariantId(productType) {
    // Ces IDs doivent correspondre aux variants créés dans Shopify Admin
    // À configurer selon vos IDs réels
    const VARIANT_IDS = {
      'textile': window.CONF_VARIANT_TEXTILE || null,
      'textile-tshirt': window.CONF_VARIANT_TSHIRT || null,
      'textile-polo': window.CONF_VARIANT_POLO || null,
      'drapeaux': window.CONF_VARIANT_DRAPEAUX || null,
      'patches': window.CONF_VARIANT_PATCHES || null,
      'coins': window.CONF_VARIANT_COINS || null
    };

    return VARIANT_IDS[productType];
  }

  /**
   * Sauvegarder le design
   */
  async saveDesign() {
    try {
      // Désactiver le bouton
      if (this.elements.saveDesignBtn) {
        this.elements.saveDesignBtn.disabled = true;
        this.elements.saveDesignBtn.classList.add('loading');
      }

      // Préparer les données
      const designData = {
        ...this.configurator.designData,
        quantity: this.quantity,
        pricing: this.configurator.pricingManager?.getCurrentPricing()
      };

      // Ajouter l'aperçu
      if (this.configurator.canvasManager) {
        designData.preview = this.configurator.canvasManager.exportToImage();
      }

      // Envoyer à l'API
      const apiEndpoint = window.CONF_API_ENDPOINT || 'http://localhost:3000/api';
      const apiKey = window.CONF_API_KEY || '';

      const response = await fetch(`${apiEndpoint}/designs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify(designData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      const result = await response.json();

      // Succès
      this.showSuccess('Design sauvegardé avec succès !');

      // Sauvegarder l'ID du design
      if (result.data && result.data.id) {
        localStorage.setItem('last_design_id', result.data.id);
      }

    } catch (error) {
      console.error('Erreur saveDesign:', error);
      this.showError('Impossible de sauvegarder le design. Veuillez réessayer.');
    } finally {
      // Réactiver le bouton
      if (this.elements.saveDesignBtn) {
        this.elements.saveDesignBtn.disabled = false;
        this.elements.saveDesignBtn.classList.remove('loading');
      }
    }
  }

  /**
   * Afficher un message de succès
   */
  showSuccess(message) {
    // Créer une notification
    const notification = document.createElement('div');
    notification.className = 'conf-notification conf-notification-success';
    notification.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
      </svg>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // Retirer après 3 secondes
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  /**
   * Afficher un message d'erreur
   */
  showError(message) {
    // Créer une notification
    const notification = document.createElement('div');
    notification.className = 'conf-notification conf-notification-error';
    notification.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
      </svg>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // Retirer après 5 secondes
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }

  /**
   * Obtenir la quantité actuelle
   */
  getQuantity() {
    return this.quantity;
  }

  /**
   * Définir les limites de quantité
   */
  setQuantityLimits(min, max) {
    this.minQuantity = min;
    this.maxQuantity = max;

    if (this.elements.minQuantity) {
      this.elements.minQuantity.textContent = min;
    }

    // Valider la quantité actuelle
    if (this.quantity < min) {
      this.setQuantity(min);
    } else if (this.quantity > max) {
      this.setQuantity(max);
    }
  }

  /**
   * Réinitialiser le récapitulatif
   */
  reset() {
    this.quantity = 1;
    
    if (this.elements.quantityInput) {
      this.elements.quantityInput.value = 1;
    }

    this.updateDisplay();
    this.updateQuantityButtons();
  }
}

// Export
export default RecapManager;
