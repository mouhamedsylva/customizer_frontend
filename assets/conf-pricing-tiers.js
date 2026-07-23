/**
 * Prix DÉGRESSIF par quantité, PAR PRODUIT (TTC sauf mention).
 * Source de vérité unique, partagée par le configurateur ET le récapitulatif
 * (évite la duplication et libère de la marge dans les templates Liquid, proches
 * de la limite Shopify de 256 Ko).
 *
 * Table : { productType: [ {min, price}, … ] }, paliers du plus grand min au
 * plus petit. Seuls les produits listés sont dégressifs ; les autres gardent
 * leur prix unitaire fixe (window.PRICES).
 *
 * ┌─ PAIEMENT (à faire dans Shopify, PAS dans le code) ──────────────────────┐
 * │ Ceci est un AFFICHAGE. Le panier natif facture le prix du variant. Pour  │
 * │ que le CLIENT PAIE ces paliers, créer des réductions automatiques        │
 * │ « montant fixe par article », ciblées par produit, conditionnées sur la  │
 * │ quantité. Si une grille change ici, mettre à jour les remises Shopify.    │
 * │                                                                          │
 * │ SWEATSHIRT (base 60 €) :   ≥5 −3,50   ≥15 −6,10   ≥40 −8,00              │
 * │ T-SHIRT coton & polyester (base 29,50 €) :                               │
 * │        ≥5 −0,60   ≥10 −3,00   ≥20 −3,60   ≥50 −5,00                       │
 * │ PATCHS : prix unitaires HT du tableau atelier (voir grille ci-dessous).  │
 * └──────────────────────────────────────────────────────────────────────────┘
 */
(function () {
  window.QTY_TIERS = {
    sweatshirt: [
      { min: 40, price: 52.00 },
      { min: 15, price: 53.90 },
      { min: 5,  price: 56.50 },
      { min: 1,  price: 60.00 }
    ],
    // T-shirt coton ET polyester : même grille tarifaire (TTC).
    // 1-4 → 29,50 €, 5-9 → 28,90 €, 10-19 → 26,50 €, 20-49 → 25,90 €, 50+ → 24,50 €.
    tshirt: [
      { min: 50, price: 24.50 },
      { min: 20, price: 25.90 },
      { min: 10, price: 26.50 },
      { min: 5,  price: 28.90 },
      { min: 1,  price: 29.50 }
    ],
    tshirt_polyester: [
      { min: 50, price: 24.50 },
      { min: 20, price: 25.90 },
      { min: 10, price: 26.50 },
      { min: 5,  price: 28.90 },
      { min: 1,  price: 29.50 }
    ],
    // PATCHS : prix unitaire HT selon la quantité (grille atelier).
    // 10 → 20 €, 20 → 12,50 €, 30 → 9 €, 50 → 5 €, 100 → 3,50 €.
    // Au-delà de 100 : « sur demande » (bascule en devis, géré côté UI).
    patches: [
      { min: 100, price: 3.50 },
      { min: 50,  price: 5.00 },
      { min: 30,  price: 9.00 },
      { min: 20,  price: 12.50 },
      { min: 10,  price: 20.00 }
    ]
    // coins : pas de grille dégressive (ajout au panier au prix de base).
  };

  /**
   * Prix unitaire dégressif d'un produit pour une quantité totale.
   * @returns {number|null} prix du palier, ou null si le produit n'est pas dégressif.
   */
  window.tierUnitPrice = function (productType, totalQty) {
    var tiers = (window.QTY_TIERS || {})[productType];
    if (!tiers || !tiers.length) return null;
    var q = Math.max(0, parseInt(totalQty, 10) || 0);
    for (var i = 0; i < tiers.length; i++) {
      if (q >= tiers[i].min) return tiers[i].price;
    }
    return tiers[tiers.length - 1].price;
  };

  /**
   * Prix unitaire effectif d'un article selon la quantité totale de son type.
   * @param item          { productType, price, … }
   * @param totalsByType  { productType: quantité totale }
   * Produit dégressif → prix du palier ; sinon → prix stocké de la ligne.
   */
  window.effectiveUnitPrice = function (item, totalsByType) {
    if (!item) return 0;
    var tier = window.tierUnitPrice(item.productType, (totalsByType || {})[item.productType] || 0);
    return tier != null ? tier : (Number(item.price) || 0);
  };

  /** Quantité minimale de commande d'un produit dégressif (plus petit palier). */
  window.tierMinQty = function (productType) {
    var tiers = (window.QTY_TIERS || {})[productType];
    if (!tiers || !tiers.length) return 1;
    return tiers.reduce(function (m, t) { return Math.min(m, t.min); }, Infinity) || 1;
  };
})();
