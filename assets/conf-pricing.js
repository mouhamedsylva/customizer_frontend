/**
 * Gestion du pricing dynamique
 */

class PricingManager {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint || window.CONF_API_ENDPOINT || 'http://localhost:3000/api';
    this.currentPricing = null;
    this.cache = new Map();
  }
  
  /**
   * Calculer le prix
   */
  async calculatePrice(productType, quantity, options = {}) {
    // Créer une clé de cache
    const cacheKey = this.generateCacheKey(productType, quantity, options);
    
    // Vérifier le cache
    if (this.cache.has(cacheKey)) {
      console.log('💰 Prix depuis le cache');
      return this.cache.get(cacheKey);
    }
    
    try {
      const response = await fetch(`${this.apiEndpoint}/pricing/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productType,
          quantity,
          options
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur calcul prix');
      }
      
      const data = await response.json();
      
      if (data.success) {
        this.currentPricing = data.data.pricing;
        
        // Mettre en cache
        this.cache.set(cacheKey, this.currentPricing);
        
        return this.currentPricing;
      } else {
        throw new Error(data.error || 'Erreur calcul prix');
      }
      
    } catch (error) {
      console.error('❌ Erreur calcul prix:', error);
      
      // Retourner un prix par défaut en cas d'erreur
      return this.getDefaultPricing(quantity);
    }
  }
  
  /**
   * Obtenir les paliers de prix
   */
  async getPriceTiers(productType, options = {}) {
    try {
      const params = new URLSearchParams(options);
      const response = await fetch(
        `${this.apiEndpoint}/pricing/tiers/${productType}?${params}`
      );
      
      if (!response.ok) {
        throw new Error('Erreur récupération paliers');
      }
      
      const data = await response.json();
      
      return data.success ? data.data : [];
      
    } catch (error) {
      console.error('❌ Erreur paliers prix:', error);
      return [];
    }
  }
  
  /**
   * Obtenir la configuration de pricing
   */
  async getPricingConfig(productType) {
    try {
      const response = await fetch(
        `${this.apiEndpoint}/pricing/config/${productType}`
      );
      
      if (!response.ok) {
        throw new Error('Erreur récupération config');
      }
      
      const data = await response.json();
      
      return data.success ? data.data : null;
      
    } catch (error) {
      console.error('❌ Erreur config prix:', error);
      return null;
    }
  }
  
  /**
   * Formater un prix
   */
  formatPrice(price, currency = '€') {
    return `${price.toFixed(2)} ${currency}`;
  }
  
  /**
   * Formater un prix avec séparateur de milliers
   */
  formatPriceWithSeparator(price, currency = '€') {
    return `${price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  }
  
  /**
   * Obtenir le prix unitaire
   */
  getUnitPrice() {
    return this.currentPricing?.unitPrice || 0;
  }
  
  /**
   * Obtenir le total HT
   */
  getTotalHT() {
    return this.currentPricing?.total || 0;
  }
  
  /**
   * Obtenir le total TTC
   */
  getTotalTTC() {
    return this.currentPricing?.totalTTC || 0;
  }
  
  /**
   * Obtenir la TVA
   */
  getVAT() {
    return this.currentPricing?.vat || 0;
  }
  
  /**
   * Obtenir la remise
   */
  getDiscount() {
    return {
      percent: this.currentPricing?.discount || 0,
      amount: this.currentPricing?.discountAmount || 0
    };
  }
  
  /**
   * Vérifier si une remise est appliquée
   */
  hasDiscount() {
    return this.currentPricing?.discount > 0;
  }
  
  /**
   * Obtenir le détail complet du pricing
   */
  getPricingDetails() {
    if (!this.currentPricing) {
      return null;
    }
    
    return {
      unitPrice: this.formatPrice(this.currentPricing.unitPrice),
      quantity: this.currentPricing.quantity,
      subtotal: this.formatPrice(this.currentPricing.subtotal),
      discount: {
        percent: this.currentPricing.discount,
        amount: this.formatPrice(this.currentPricing.discountAmount)
      },
      total: this.formatPrice(this.currentPricing.total),
      vat: this.formatPrice(this.currentPricing.vat),
      totalTTC: this.formatPrice(this.currentPricing.totalTTC)
    };
  }
  
  /**
   * Générer une clé de cache
   */
  generateCacheKey(productType, quantity, options) {
    return `${productType}_${quantity}_${JSON.stringify(options)}`;
  }
  
  /**
   * Vider le cache
   */
  clearCache() {
    this.cache.clear();
  }
  
  /**
   * Pricing par défaut en cas d'erreur
   */
  getDefaultPricing(quantity) {
    const unitPrice = 10.00;
    const subtotal = unitPrice * quantity;
    const total = subtotal;
    const vat = total * 0.20;
    const totalTTC = total + vat;
    
    return {
      unitPrice,
      quantity,
      subtotal,
      discount: 0,
      discountAmount: 0,
      total,
      vat,
      totalTTC
    };
  }
  
  /**
   * Calculer le prix estimé d'un supplément
   */
  calculateSupplement(basePrice, supplementPercent) {
    return basePrice * (supplementPercent / 100);
  }
  
  /**
   * Obtenir le message de remise
   */
  getDiscountMessage() {
    if (!this.hasDiscount()) {
      return null;
    }
    
    const discount = this.getDiscount();
    return `Remise de ${discount.percent}% appliquée (-${this.formatPrice(discount.amount)})`;
  }
  
  /**
   * Obtenir les économies réalisées
   */
  getSavings() {
    if (!this.hasDiscount()) {
      return 0;
    }
    
    return this.currentPricing.discountAmount;
  }
  
  /**
   * Afficher un résumé de pricing
   */
  getPricingSummary() {
    if (!this.currentPricing) {
      return '';
    }
    
    let summary = `Prix unitaire: ${this.formatPrice(this.currentPricing.unitPrice)}\n`;
    summary += `Quantité: ${this.currentPricing.quantity}\n`;
    summary += `Sous-total: ${this.formatPrice(this.currentPricing.subtotal)}\n`;
    
    if (this.hasDiscount()) {
      summary += `Remise (${this.currentPricing.discount}%): -${this.formatPrice(this.currentPricing.discountAmount)}\n`;
    }
    
    summary += `Total HT: ${this.formatPrice(this.currentPricing.total)}\n`;
    summary += `TVA (20%): ${this.formatPrice(this.currentPricing.vat)}\n`;
    summary += `Total TTC: ${this.formatPrice(this.currentPricing.totalTTC)}`;
    
    return summary;
  }
}

// Export
window.PricingManager = PricingManager;
