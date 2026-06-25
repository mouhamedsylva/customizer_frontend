/**
 * Gestion du panier Shopify
 * Integration avec l'API Cart de Shopify
 */

class CartManager {
  constructor() {
    this.cartEndpoint = '/cart';
  }
  
  /**
   * Ajouter un produit au panier
   */
  async addToCart(designId, quantity, productData) {
    try {
      // Créer les line item properties pour Shopify
      const properties = {
        'Design ID': designId,
        'Type': productData.productType,
        'Configuration': JSON.stringify(productData.options),
        '_design_data': JSON.stringify(productData) // Préfixe _ pour caché dans la commande
      };
      
      // Ajouter l'aperçu si disponible
      if (productData.previewUrl) {
        properties['Aperçu'] = productData.previewUrl;
      }
      
      // Données pour l'API Cart
      const formData = {
        items: [{
          id: productData.variantId || this.getVariantIdByType(productData.productType),
          quantity: quantity,
          properties: properties
        }]
      };
      
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Erreur ajout au panier');
      }
      
      const data = await response.json();
      
      // Mettre à jour le compteur du panier
      await this.updateCartCount();
      
      // Afficher notification
      this.showNotification('✅ Produit ajouté au panier !', 'success');
      
      return data;
      
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      this.showNotification('❌ Erreur lors de l\'ajout au panier', 'error');
      throw error;
    }
  }
  
  /**
   * Obtenir le variant ID selon le type de produit
   */
  getVariantIdByType(productType) {
    // À configurer selon vos produits Shopify
    const variantMap = {
      'textile': window.CONF_VARIANT_TEXTILE || '0',
      'drapeaux': window.CONF_VARIANT_FLAGS || '0',
      'patches': window.CONF_VARIANT_PATCHES || '0',
      'coins': window.CONF_VARIANT_COINS || '0'
    };
    
    return variantMap[productType] || '0';
  }
  
  /**
   * Récupérer le contenu du panier
   */
  async getCart() {
    try {
      const response = await fetch('/cart.js');
      
      if (!response.ok) {
        throw new Error('Erreur récupération panier');
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('Erreur récupération panier:', error);
      return null;
    }
  }
  
  /**
   * Mettre à jour le compteur du panier
   */
  async updateCartCount() {
    try {
      const cart = await this.getCart();
      
      if (cart) {
        const count = cart.item_count;
        
        // Mettre à jour tous les compteurs de panier
        document.querySelectorAll('[data-cart-count]').forEach(el => {
          el.textContent = count;
          el.style.display = count > 0 ? 'block' : 'none';
        });
      }
      
    } catch (error) {
      console.error('Erreur MAJ compteur panier:', error);
    }
  }
  
  /**
   * Vider le panier
   */
  async clearCart() {
    try {
      const response = await fetch('/cart/clear.js', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Erreur vidage panier');
      }
      
      await this.updateCartCount();
      this.showNotification('Panier vidé', 'info');
      
    } catch (error) {
      console.error('Erreur vidage panier:', error);
      throw error;
    }
  }
  
  /**
   * Mettre à jour la quantité d'un item
   */
  async updateQuantity(lineItemKey, quantity) {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: lineItemKey,
          quantity: quantity
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur MAJ quantité');
      }
      
      const data = await response.json();
      await this.updateCartCount();
      
      return data;
      
    } catch (error) {
      console.error('Erreur MAJ quantité:', error);
      throw error;
    }
  }
  
  /**
   * Supprimer un item du panier
   */
  async removeItem(lineItemKey) {
    return this.updateQuantity(lineItemKey, 0);
  }
  
  /**
   * Obtenir le total du panier
   */
  async getCartTotal() {
    const cart = await this.getCart();
    
    if (cart) {
      return {
        total: cart.total_price / 100, // Shopify utilise des centimes
        itemCount: cart.item_count,
        currency: cart.currency
      };
    }
    
    return null;
  }
  
  /**
   * Afficher une notification
   */
  showNotification(message, type = 'info') {
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `conf-notification conf-notification-${type}`;
    notification.innerHTML = `
      <div class="conf-notification-content">
        <span>${message}</span>
        <button class="conf-notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Auto-suppression après 5s
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }
  
  /**
   * Ouvrir le panier
   */
  openCart() {
    // Déclencher l'événement pour ouvrir le drawer/modal du panier
    window.dispatchEvent(new CustomEvent('cart:open'));
    
    // Ou rediriger vers la page panier
    // window.location.href = '/cart';
  }
  
  /**
   * Rediriger vers le checkout
   */
  goToCheckout() {
    window.location.href = '/checkout';
  }
}

// Styles pour les notifications
const notificationStyles = `
  .conf-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    transform: translateX(400px);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 400px;
  }
  
  .conf-notification.show {
    transform: translateX(0);
  }
  
  .conf-notification-success {
    border-left: 4px solid #16a34a;
  }
  
  .conf-notification-error {
    border-left: 4px solid #dc2626;
  }
  
  .conf-notification-info {
    border-left: 4px solid #2563eb;
  }
  
  .conf-notification-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  
  .conf-notification-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .conf-notification-close:hover {
    color: #000;
  }
`;

// Injecter les styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Export
window.CartManager = CartManager;
