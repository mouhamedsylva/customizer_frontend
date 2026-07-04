/**
 * Client API - appels vers le backend NestJS (customizer-backend)
 * L'URL de base est définie par window.API_BASE (voir configurateur.liquid).
 */
window.ConfAPI = (function () {
  function base() {
    return (window.API_BASE || '').replace(/\/$/, '');
  }

  // Requête JSON générique
  async function jsonRequest(path, method, body) {
    const res = await fetch(base() + path, {
      method: method || 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || ('Erreur ' + res.status);
      throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
    }
    return data;
  }

  return {
    // Créer une commande
    createOrder(payload) {
      return jsonRequest('/orders', 'POST', payload);
    },
    // Lister les commandes
    listOrders() {
      return jsonRequest('/orders', 'GET');
    },
    // Envoyer une demande de devis (coins)
    createQuote(payload) {
      return jsonRequest('/quotes', 'POST', payload);
    },
    // Upload d'un logo (fichier) -> renvoie { url, publicId, ... }
    async uploadLogo(file) {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(base() + '/uploads/logo', { method: 'POST', body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data && data.message) || 'Échec upload');
      return data;
    },
    // Partager un design -> { shareId, shareUrl }
    shareDesign(designData) {
      return jsonRequest('/export/share', 'POST', { designData: designData });
    },
    // Vérifier la disponibilité du backend
    health() {
      return jsonRequest('/health', 'GET');
    }
  };
})();
