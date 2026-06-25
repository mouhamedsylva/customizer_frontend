/**
 * Configuration des produits Textile
 * Basé sur le mockup fourni
 */

const TEXTILE_CONFIG = {
  sweatshirt: {
    id: 'sweatshirt',
    name: 'Sweatshirt',
    icon: '👕',
    basePrice: 45.00,
    
    colors: [
      { id: 'noir', name: 'Noir', hex: '#000000', class: 'conf-color-noir' },
      { id: 'blanc', name: 'Blanc', hex: '#FFFFFF', class: 'conf-color-blanc' },
      { id: 'gris', name: 'Gris', hex: '#808080', class: 'conf-color-gris' },
      { id: 'gris-fonce', name: 'Gris foncé', hex: '#404040', class: 'conf-color-gris-fonce' },
      { id: 'bleu-marine', name: 'Bleu marine', hex: '#001f3f', class: 'conf-color-bleu-marine' },
      { id: 'bleu-ciel', name: 'Bleu ciel', hex: '#7FDBFF', class: 'conf-color-bleu-ciel' },
      { id: 'bleu-roi', name: 'Bleu roi', hex: '#0074D9', class: 'conf-color-bleu-roi' },
      { id: 'vert', name: 'Vert', hex: '#2ECC40', class: 'conf-color-vert' },
      { id: 'rose', name: 'Rose', hex: '#FF69B4', class: 'conf-color-rose' },
      { id: 'violet', name: 'Violet', hex: '#B10DC9', class: 'conf-color-violet' },
      { id: 'orange', name: 'Orange', hex: '#FF851B', class: 'conf-color-orange' },
      { id: 'jaune', name: 'Jaune', hex: '#FFDC00', class: 'conf-color-jaune' },
      { id: 'rouge', name: 'Rouge', hex: '#FF4136', class: 'conf-color-rouge' },
      { id: 'bordeaux', name: 'Bordeaux', hex: '#85144b', class: 'conf-color-bordeaux' }
    ],
    
    sizes: [
      { id: 'xs', name: 'XS', label: 'XS' },
      { id: 's', name: 'S', label: 'S' },
      { id: 'm', name: 'M', label: 'M', default: true },
      { id: 'l', name: 'L', label: 'L' },
      { id: 'xl', name: 'XL', label: 'XL' },
      { id: 'xxl', name: 'XXL', label: 'XXL' }
    ],
    
    options: [
      {
        id: 'logo-coeur',
        type: 'upload',
        title: 'LOGO CŒUR',
        subtitle: 'Ajoutez un logo au centre du vêtement',
        description: 'Cliquez ou déposez votre fichier',
        formats: 'PNG, JPG, SVG (Max. 10 MB)',
        maxSize: 10485760, // 10MB
        position: 'center',
        price: 0
      },
      {
        id: 'logo-dos',
        type: 'upload',
        title: 'LOGO DOS',
        subtitle: 'Ajoutez un logo sur le dos (Facultatif)',
        description: 'Cliquez ou déposez votre fichier',
        formats: 'PNG, JPG, SVG (Max. 10 MB)',
        maxSize: 10485760,
        position: 'back',
        price: 0
      },
      {
        id: 'personnalisation-manches',
        type: 'toggle',
        title: 'PERSONNALISATION MANCHES',
        subtitle: 'Ajoutez un logo ou texte sur les manches (facultatif)',
        options: [
          {
            id: 'texte-manches',
            type: 'text',
            label: 'Texte manches',
            placeholder: 'Ex: ADVENTURE',
            maxLength: 50
          },
          {
            id: 'police-manches',
            type: 'select',
            label: 'Police',
            options: [
              { value: 'arial', label: 'Arial' },
              { value: 'impact', label: 'Impact' },
              { value: 'times', label: 'Times New Roman' }
            ]
          }
        ],
        price: 5.00
      }
    ]
  },
  
  tshirt: {
    id: 'tshirt',
    name: 'T-shirt coton',
    icon: '👕',
    basePrice: 25.00,
    
    colors: [
      { id: 'noir', name: 'Noir', hex: '#000000', class: 'conf-color-noir' },
      { id: 'blanc', name: 'Blanc', hex: '#FFFFFF', class: 'conf-color-blanc' },
      { id: 'gris', name: 'Gris', hex: '#808080', class: 'conf-color-gris' },
      { id: 'bleu-marine', name: 'Bleu marine', hex: '#001f3f', class: 'conf-color-bleu-marine' },
      { id: 'rouge', name: 'Rouge', hex: '#FF4136', class: 'conf-color-rouge' },
      { id: 'vert', name: 'Vert', hex: '#2ECC40', class: 'conf-color-vert' }
    ],
    
    sizes: [
      { id: 'xs', name: 'XS', label: 'XS' },
      { id: 's', name: 'S', label: 'S' },
      { id: 'm', name: 'M', label: 'M', default: true },
      { id: 'l', name: 'L', label: 'L' },
      { id: 'xl', name: 'XL', label: 'XL' },
      { id: 'xxl', name: 'XXL', label: 'XXL' }
    ],
    
    options: [
      {
        id: 'logo-principal',
        type: 'upload',
        title: 'LOGO PRINCIPAL',
        subtitle: 'Ajoutez votre design',
        description: 'Cliquez ou déposez votre fichier',
        formats: 'PNG, JPG, SVG (Max. 10 MB)',
        maxSize: 10485760,
        position: 'center',
        price: 0
      }
    ]
  },
  
  tshirt_polyester: {
    id: 'tshirt_polyester',
    name: 'T-shirt polyester',
    icon: '👕',
    basePrice: 28.00,
    
    colors: [
      { id: 'noir', name: 'Noir', hex: '#000000', class: 'conf-color-noir' },
      { id: 'blanc', name: 'Blanc', hex: '#FFFFFF', class: 'conf-color-blanc' },
      { id: 'bleu-roi', name: 'Bleu roi', hex: '#0074D9', class: 'conf-color-bleu-roi' },
      { id: 'rouge', name: 'Rouge', hex: '#FF4136', class: 'conf-color-rouge' }
    ],
    
    sizes: [
      { id: 'xs', name: 'XS', label: 'XS' },
      { id: 's', name: 'S', label: 'S' },
      { id: 'm', name: 'M', label: 'M', default: true },
      { id: 'l', name: 'L', label: 'L' },
      { id: 'xl', name: 'XL', label: 'XL' },
      { id: 'xxl', name: 'XXL', label: 'XXL' }
    ],
    
    options: [
      {
        id: 'logo-principal',
        type: 'upload',
        title: 'LOGO PRINCIPAL',
        subtitle: 'Ajoutez votre design',
        description: 'Cliquez ou déposez votre fichier',
        formats: 'PNG, JPG, SVG (Max. 10 MB)',
        maxSize: 10485760,
        position: 'center',
        price: 0
      }
    ]
  }
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TEXTILE_CONFIG;
}
