/**
 * Gestion des uploads de fichiers
 */

class UploadManager {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint || window.CONF_API_ENDPOINT || 'http://localhost:3000/api';
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.acceptedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf'];
    this.uploads = new Map();
  }
  
  /**
   * Uploader un fichier
   */
  async uploadFile(file, productType, placement) {
    // Valider le fichier
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    
    // Créer le FormData
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('productType', productType);
    formData.append('placement', placement);
    
    try {
      // Afficher le loader
      this.showUploadProgress(placement, 0);
      
      const response = await fetch(`${this.apiEndpoint}/upload/logo`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Erreur upload');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Sauvegarder dans le cache
        this.uploads.set(placement, {
          file: file,
          url: data.data.url,
          publicId: data.data.publicId,
          dimensions: data.data.dimensions,
          uploadedAt: new Date()
        });
        
        // Masquer le loader
        this.hideUploadProgress(placement);
        
        return data.data;
      } else {
        throw new Error(data.error || 'Erreur upload');
      }
      
    } catch (error) {
      this.hideUploadProgress(placement);
      console.error('❌ Erreur upload:', error);
      throw error;
    }
  }
  
  /**
   * Uploader plusieurs fichiers
   */
  async uploadMultiple(files, productType) {
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.uploadFile(
          files[i],
          productType,
          `upload_${i}`
        );
        results.push({ success: true, ...result });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }
    
    return results;
  }
  
  /**
   * Valider un fichier
   */
  validateFile(file) {
    // Vérifier le type
    if (!this.acceptedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Type de fichier non accepté. Formats acceptés: ${this.acceptedTypes.join(', ')}`
      };
    }
    
    // Vérifier la taille
    if (file.size > this.maxFileSize) {
      return {
        isValid: false,
        error: `Fichier trop volumineux. Taille max: ${this.formatFileSize(this.maxFileSize)}`
      };
    }
    
    return { isValid: true };
  }
  
  /**
   * Valider les dimensions d'une image
   */
  async validateImageDimensions(file, requirements = {}) {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        const errors = [];
        
        if (requirements.minWidth && img.width < requirements.minWidth) {
          errors.push(`Largeur minimale: ${requirements.minWidth}px`);
        }
        
        if (requirements.minHeight && img.height < requirements.minHeight) {
          errors.push(`Hauteur minimale: ${requirements.minHeight}px`);
        }
        
        if (requirements.maxWidth && img.width > requirements.maxWidth) {
          errors.push(`Largeur maximale: ${requirements.maxWidth}px`);
        }
        
        if (requirements.maxHeight && img.height > requirements.maxHeight) {
          errors.push(`Hauteur maximale: ${requirements.maxHeight}px`);
        }
        
        URL.revokeObjectURL(url);
        
        resolve({
          isValid: errors.length === 0,
          errors,
          dimensions: {
            width: img.width,
            height: img.height
          }
        });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          isValid: false,
          errors: ['Impossible de lire l\'image']
        });
      };
      
      img.src = url;
    });
  }
  
  /**
   * Prévisualiser une image
   */
  previewImage(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Le fichier n\'est pas une image'));
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = () => {
        reject(new Error('Erreur lecture du fichier'));
      };
      
      reader.readAsDataURL(file);
    });
  }
  
  /**
   * Obtenir les informations d'un fichier
   */
  getFileInfo(file) {
    return {
      name: file.name,
      size: file.size,
      sizeFormatted: this.formatFileSize(file.size),
      type: file.type,
      lastModified: new Date(file.lastModified)
    };
  }
  
  /**
   * Formater la taille d'un fichier
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
  
  /**
   * Supprimer un upload
   */
  async deleteUpload(publicId) {
    try {
      const response = await fetch(`${this.apiEndpoint}/upload/${publicId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Erreur suppression');
      }
      
      const data = await response.json();
      
      // Retirer du cache
      for (const [key, value] of this.uploads.entries()) {
        if (value.publicId === publicId) {
          this.uploads.delete(key);
          break;
        }
      }
      
      return data.success;
      
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
      throw error;
    }
  }
  
  /**
   * Récupérer un upload du cache
   */
  getUpload(placement) {
    return this.uploads.get(placement);
  }
  
  /**
   * Récupérer tous les uploads
   */
  getAllUploads() {
    return Array.from(this.uploads.entries()).map(([placement, data]) => ({
      placement,
      ...data
    }));
  }
  
  /**
   * Vider le cache des uploads
   */
  clearUploads() {
    this.uploads.clear();
  }
  
  /**
   * Afficher la progression
   */
  showUploadProgress(placement, progress) {
    const event = new CustomEvent('upload:progress', {
      detail: { placement, progress }
    });
    window.dispatchEvent(event);
  }
  
  /**
   * Masquer la progression
   */
  hideUploadProgress(placement) {
    const event = new CustomEvent('upload:complete', {
      detail: { placement }
    });
    window.dispatchEvent(event);
  }
  
  /**
   * Compresser une image avant upload
   */
  async compressImage(file, maxWidth = 2000, quality = 0.9) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Redimensionner si nécessaire
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          }, 'image/jpeg', quality);
        };
        
        img.src = e.target.result;
      };
      
      reader.readAsDataURL(file);
    });
  }
}

// Export
window.UploadManager = UploadManager;
