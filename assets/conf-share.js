/**
 * conf-share.js — Menu de partage du design + liste dépliable de la
 * section « Personnalisation ».
 *
 * Extrait de configurateur.liquid : ce fichier frôlait la limite Shopify de
 * 256 Ko par template, ce qui bloquait tout déploiement. Un asset n'a pas
 * cette limite et est mis en cache séparément.
 */
(function () {
  'use strict';
    function openShareMenu(url, text, mode) {
      const old = document.getElementById('share-menu');
      if (old) old.remove();

      var isSave = (mode === 'save');
      var isInvite = (mode === 'invite') || isSave; // save = même flux (lien de reprise)
      const enc = encodeURIComponent;
      var subject = isSave ? 'Mon design sauvegardé' : (isInvite ? 'Personnalisez ce design avec moi' : 'Mon design personnalisé');
      const waHref = 'https://wa.me/?text=' + enc(text + ' ' + url);
      const mailHref = 'https://mail.google.com/mail/?view=cm&fs=1&su=' +
        enc(subject) + '&body=' + enc(text + '\n' + url);

      var title = isSave ? 'Design sauvegardé' : (isInvite ? 'Inviter à éditer' : 'Partager mon design');
      var copyLabel = isInvite ? 'Copier le lien' : 'Copier le lien de l\'image';
      // Bloc "Inviter" (mode image) OU bouton "retour" (mode invite, pas save).
      var extraBlock = isInvite
        ? (isSave ? '' : '<button id="share-back-btn" style="display:flex;align-items:center;gap:12px;width:100%;padding:10px;border:none;border-radius:10px;background:#f0f0f0;cursor:pointer;color:#333;font-weight:600;font-family:inherit;margin-top:4px;"><span style="font-size:18px;">←</span> Retour au partage d\'image</button>')
        : '<div style="border-top:1px solid #eee;margin:6px 0 12px;"></div>' +
          '<button id="share-invite-btn" style="display:flex;align-items:center;gap:12px;width:100%;padding:12px;border:none;border-radius:10px;background:#1a1a1a;cursor:pointer;color:#fff;font-weight:700;font-family:inherit;"><span style="font-size:20px;">✉️</span> Inviter une personne à éditer</button>' +
          '<p style="font-size:11px;color:#888;margin-top:8px;line-height:1.4;">La personne invitée ouvrira le configurateur avec votre design en cours (modifiable).</p>';

      const overlay = document.createElement('div');
      overlay.id = 'share-menu';
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10000;display:flex;align-items:center;justify-content:center;';
      overlay.innerHTML = `
        <div style="background:#fff;border-radius:14px;padding:24px;max-width:380px;width:90%;font-family:inherit;box-shadow:0 20px 60px rgba(0,0,0,.3);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <strong style="font-size:16px;">${title}</strong>
            <button onclick="document.getElementById('share-menu').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#888;">✕</button>
          </div>
          ${isInvite ? ('<p style="font-size:12px;color:#16a34a;margin:0 0 14px;font-weight:600;">✓ ' + (isSave ? 'Lien de reprise prêt (envoyez-le-vous)' : 'Lien d\'invitation prêt à envoyer') + '</p>') : '<div style="margin-bottom:10px;"></div>'}
          <a href="${waHref}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid #e8e8e8;border-radius:10px;text-decoration:none;color:#1a1a1a;margin-bottom:10px;font-weight:600;">
            <span style="font-size:20px;">🟢</span> WhatsApp
          </a>
          <a href="${mailHref}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid #e8e8e8;border-radius:10px;text-decoration:none;color:#1a1a1a;margin-bottom:10px;font-weight:600;">
            <span style="font-size:20px;">✉️</span> Gmail
          </a>
          <button id="share-copy-btn" style="display:flex;align-items:center;gap:12px;width:100%;padding:12px;border:1px solid #e8e8e8;border-radius:10px;background:#fff;cursor:pointer;color:#1a1a1a;font-weight:600;font-family:inherit;margin-bottom:10px;">
            <span style="font-size:20px;">🔗</span> ${copyLabel}
          </button>
          ${extraBlock}
        </div>`;
      overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
      document.body.appendChild(overlay);

      const copyBtn = document.getElementById('share-copy-btn');
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(url);
          copyBtn.innerHTML = '<span style="font-size:20px;">✅</span> Lien copié !';
        } catch (e) {
          confPrompt('Copiez le lien ci-dessous :', { defaultValue: url, icon: 'info', title: 'Lien', confirmText: 'Fermer' });
        }
      });

      if (isInvite) {
        // Retour au menu image.
        var backBtn = document.getElementById('share-back-btn');
        if (backBtn) backBtn.addEventListener('click', function () { openShareMenu(window.__lastImageUrl || url, "Découvrez mon design personnalisé :", 'image'); });
      } else {
        // Mémorise l'URL image pour le retour, et branche le bouton Inviter.
        window.__lastImageUrl = url;
        var inviteBtn = document.getElementById('share-invite-btn');
        inviteBtn.addEventListener('click', async () => {
          var orig = inviteBtn.innerHTML;
          inviteBtn.disabled = true;
          inviteBtn.innerHTML = '<span style="font-size:20px;">⏳</span> Génération du lien…';
          try {
            var inviteUrl = await createInviteLink();
            // Rouvre le menu en mode INVITE : WhatsApp/Gmail/Copier -> lien d'invitation.
            openShareMenu(inviteUrl, "Personnalisez ce design avec moi :", 'invite');
          } catch (err) {
            inviteBtn.disabled = false;
            inviteBtn.innerHTML = orig;
            confAlert('Impossible de générer le lien d\'invitation.\n' + (err && err.message ? err.message : err), { icon: 'error', title: 'Invitation' });
          }
        });
      }
    }

    function textZoneImage(zoneId, imgBox, layerBox, canReproject) {
      var el = document.getElementById(zoneId);
      if (!el || el.style.display === 'none') return null;
      var content = el.querySelector('.dt-content');
      if (!content) return null;
      var raw = (content.textContent || '').trim();
      if (!raw) return null;

      return new Promise(function (resolve) {
        // Dimensions écran de la zone de texte (pour reprojeter comme un logo).
        var pct = function (v) {
          if (typeof v !== 'string') return null;
          var m = v.trim().match(/^([\d.]+)%$/);
          return m ? parseFloat(m[1]) / 100 : null;
        };
        var geo;
        if (canReproject) {
          var r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            geo = {
              x: (r.left - imgBox.left) / imgBox.width,
              y: (r.top - imgBox.top) / imgBox.height,
              w: r.width / imgBox.width
            };
          }
        }
        if (!geo) {
          var lx = pct(el.style.left), ly = pct(el.style.top), lw = pct(el.style.width);
          if (lx == null || ly == null || lw == null) { resolve(null); return; }
          geo = { x: lx, y: ly, w: lw };
        }

        var cs = window.getComputedStyle(el);
        var color = cs.color || '#111';
        var fontFamily = cs.fontFamily || 'sans-serif';
        var shaped = el.classList.contains('is-shaped');

        // Texte courbé : on rasterise le SVG déjà rendu dans .dt-content.
        var svg = content.querySelector('svg');
        if (shaped && svg) {
          var clone = svg.cloneNode(true);
          // Fige une taille de rendu nette.
          clone.setAttribute('width', '600');
          clone.setAttribute('height', '180');
          var xml = new XMLSerializer().serializeToString(clone);
          var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
          var im = new Image();
          im.onload = function () {
            var cv = document.createElement('canvas');
            cv.width = 600; cv.height = 180;
            cv.getContext('2d').drawImage(im, 0, 0, 600, 180);
            try { resolve({ src: cv.toDataURL('image/png'), x: geo.x, y: geo.y, w: geo.w }); }
            catch (e) { resolve(null); }
          };
          im.onerror = function () { resolve(null); };
          im.src = url;
          return;
        }

        // Texte simple : dessin canvas 2D haute résolution.
        var fontSize = 160;
        var font = '700 ' + fontSize + 'px ' + fontFamily;
        var meas = document.createElement('canvas').getContext('2d');
        meas.font = font;
        var tw = Math.max(1, meas.measureText(raw).width);
        var padX = fontSize * 0.15, padY = fontSize * 0.35;
        var cv = document.createElement('canvas');
        cv.width = Math.ceil(tw + padX * 2);
        cv.height = Math.ceil(fontSize + padY * 2);
        var ctx = cv.getContext('2d');
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(raw, cv.width / 2, cv.height / 2);
        try { resolve({ src: cv.toDataURL('image/png'), x: geo.x, y: geo.y, w: geo.w }); }
        catch (e) { resolve(null); }
      });
    }

  window.textZoneImage = textZoneImage;
  window.openShareMenu = openShareMenu;
})();

/* ── Section « Personnalisation » : liste dépliable ──────────────────────
   Ouvre une ligne et referme les autres : une seule zone de travail à la
   fois, ce qui garde la barre latérale courte et lisible. */
(function () {
  'use strict';
  window.togglePerso = function (id) {
    var el = document.getElementById('pi-' + id);
    if (!el) return;
    var open = el.classList.contains('open');
    document.querySelectorAll('.perso-item.open').forEach(function (n) {
      if (n !== el) n.classList.remove('open');
    });
    el.classList.toggle('open', !open);
  };

  /* -- Application d'un design dans l'interface (upload + restauration) --
     Extrait de configurateur.liquid (limite Shopify de 256 Ko par template).
     Ne lit aucun etat du template : ses seules dependances sont des fonctions
     exposees sur window (clamps, thumbs, placeLogoInZone, setTextEnabled...). */
    function applyUpload(zone, src) {
      {

        // Si c'est un upload de coin
        if (zone === 'c') {
          // Preview dans la sidebar
          const prev = document.getElementById('pc');
          const img  = document.getElementById('ic');
          const lbl  = document.getElementById('lc');
          if (prev && img) { img.src = src; prev.style.display = 'block'; }
          if (lbl) lbl.style.display = 'flex';
          
          // Afficher dans le canvas circulaire (logo déplaçable/redimensionnable)
          const coinsCanvas = document.getElementById('coins-canvas');
          const coinsPreviewImg = document.getElementById('coins-preview-img');
          const patchLogo = document.getElementById('patch-logo');
          if (coinsPreviewImg) coinsPreviewImg.src = src;
          if (patchLogo) patchLogo.style.display = 'block';
          if (coinsCanvas) {
            coinsCanvas.classList.add('has-image');
            // Masquer le placeholder
            const ph = coinsCanvas.querySelector('.coins-placeholder');
            if (ph) ph.style.display = 'none';
          }
          // Le visuel uploadé garde sa taille par défaut (70 %) : on le ramène
          // dans la zone imprimable de la forme. Différé jusqu'au 'load' :
          // la hauteur réelle — donc le ratio — n'est connue qu'ensuite.
          if (typeof window.clampPatchLogo === 'function') {
            setTimeout(function () { window.clampPatchLogo(true); }, 80);
          }
          if (coinsPreviewImg) {
            coinsPreviewImg.addEventListener('load', function onceLoaded() {
              coinsPreviewImg.removeEventListener('load', onceLoaded);
              if (typeof window.clampPatchLogo === 'function') window.clampPatchLogo(true);
              if (typeof window.updatePatchRecapThumb === 'function') window.updatePatchRecapThumb();
            });
          }
          // Recap - miniature : image du patch (forme + couleur) + logo positionné.
          window.updatePatchRecapThumb();

          return;
        }

        // Si c'est un upload de coin métallique (recto / verso)
        if (zone === 'coin-recto' || zone === 'coin-verso') {
          const face = zone === 'coin-recto' ? 'recto' : 'verso';

          // Logo déplaçable/redimensionnable sur la pièce
          const logo = document.getElementById('coin-logo-' + face);
          if (logo) {
            const limg = logo.querySelector('img');
            if (limg) limg.src = src;
            logo.style.display = 'block';
            // À l'upload, le visuel remplit toute la zone frappée et se centre.
            // À la RESTAURATION, on se contente de le borner : sa géométrie
            // sauvegardée doit être respectée. Le drapeau est capturé ici, car
            // il est remis à false avant que les callbacks différés ne partent.
            if (typeof window.clampCoinLogo === 'function') {
              const fillZone = !window.__restoringUploads;
              setTimeout(function () { window.clampCoinLogo(face, fillZone); }, 80);
              if (limg) limg.addEventListener('load', function () { window.clampCoinLogo(face, fillZone); }, { once: true });
            }
            // Mode « découpé à la forme » déjà actif : le nouveau visuel doit
            // être détouré, sinon la pièce prendrait la forme de son rectangle.
            const inDecoupe = document.querySelector('.coin-disc.shape-decoupe');
            if (inDecoupe && !window.__restoringUploads &&
                typeof window.applyDecoupeShape === 'function') {
              setTimeout(function () { window.applyDecoupeShape(); }, 120);
            }
          }

          // Afficher le logo recto aussi sur la vue de côté (aperçu)
          if (face === 'recto') {
            const coteLogo = document.getElementById('coin-cote-logo');
            if (coteLogo) { coteLogo.src = src; coteLogo.style.display = 'block'; }
          }

          // Afficher le bouton Supprimer
          const removeBtn = document.getElementById('coin-remove-' + face);
          if (removeBtn) removeBtn.style.display = 'inline-block';

          // Vignette du récap : recto composé (disque + logo), temps réel.
          window.updateCoinRecapThumb();
          return;
        }

        // Si c'est un upload de drapeau (recto / verso)
        if (zone === 'flag-recto' || zone === 'flag-verso') {
          const wrap = document.getElementById(zone);
          if (wrap) {
            // Masquer les placeholders (3D + 2D)
            wrap.querySelectorAll('.flag-canvas-placeholder').forEach(ph => ph.style.display = 'none');
            // Mettre l'image dans toutes les zones design (3D déplaçable + 2D codé)
            wrap.querySelectorAll('.flag-design-img').forEach(img => { img.src = src; img.style.display = 'block'; });
          }
          // Afficher le logo déplaçable (vue 3D)
          const face = zone === 'flag-recto' ? 'recto' : 'verso';
          const dragLogo = document.getElementById('flag-logo-' + face);
          if (dragLogo) dragLogo.style.display = 'block';
          // Le visuel uploadé garde sa taille par défaut : on le ramène dans la
          // zone imprimable (la contrainte du drag ne joue qu'au déplacement).
          // Différé : l'image doit être décodée pour connaître sa hauteur réelle.
          if (typeof clampFlagLogo === 'function') {
            setTimeout(function () { clampFlagLogo(face); }, 80);
            const fimg = dragLogo && dragLogo.querySelector('.flag-design-img');
            if (fimg) fimg.addEventListener('load', function () { clampFlagLogo(face); }, { once: true });
          }

          // Afficher le bouton Supprimer
          const flagRemoveBtn = document.getElementById('flag-remove-' + face);
          if (flagRemoveBtn) flagRemoveBtn.style.display = 'inline-block';
          // Miniature du récap (recto uniquement) : drapeau + logo positionné.
          if (zone === 'flag-recto') {
            window.updateFlagRecapThumb();
          }
          return;
        }

        // FACE : logo cœur et texte sont exclusifs. Ajouter un logo retire le texte.
        if (zone === 'f' || zone === 'fr') {
          if (typeof removeText === 'function') removeText(zone);
          if (typeof window.setTextEnabled === 'function') window.setTextEnabled(zone, false);
        }

        // Sidebar preview (textiles)
        const prev = document.getElementById('p' + zone);
        const img  = document.getElementById('i' + zone);
        const lbl  = document.getElementById('l' + zone);
        if (prev && img) { img.src = src; prev.style.display = 'block'; }
        if (lbl)          lbl.style.display = 'flex';

        // SVG overlay
        const ov = document.getElementById('ov-' + zone);
        if (ov) { ov.setAttribute('href', src); ov.style.display = 'block'; }

        // Logos manches déplaçables. Chaque manche a désormais SA vue : le
        // profil est le même retourné en miroir, et [data-side] n'affiche que
        // le côté courant. La manche droite n'était pas rendue du tout
        // auparavant — un upload dessus restait invisible.
        if (zone === 'sl' || zone === 'sr') {
          const logo = document.getElementById('logo-' + zone);
          if (logo) {
            const limg = logo.querySelector('img');
            if (limg) limg.src = src;
            logo.style.display = 'block';
          }
          // Le logo "-face" conserve l'asset (compat récap/export) mais reste
          // masqué : les manches ne s'affichent plus en vue de face.
          const logoFace = document.getElementById('logo-' + zone + '-face');
          if (logoFace) {
            const limg2 = logoFace.querySelector('img');
            if (limg2) limg2.src = src;
            logoFace.style.display = 'none';
          }
          const rcS = document.getElementById('rc-sleeves');
          if (rcS) rcS.style.display = 'flex';
          if (typeof window.updateSleeveSurcharge === 'function') window.updateSleeveSurcharge();

          // Placement auto dans la zone de la manche concernée.
          window.placeLogoInZone(zone);

          // La rotation vers la bonne manche est déclenchée par doUpload
          // (showSleeve), qui passe en vue de côté puis pivote. On ne bascule
          // pas ici : applyUpload sert aussi à la RESTAURATION au rechargement,
          // et le vêtement se mettrait à tourner tout seul.
        }

        // Logos poitrine déplaçables (vue de face) + bascule auto vers la face.
        // 'f' = cœur (gauche du porteur), 'fr' = poitrine droite : même
        // traitement, seul l'id du calque change.
        if (zone === 'f' || zone === 'fr') {
          const logo = document.getElementById('logo-' + zone);
          if (logo) {
            const limg = logo.querySelector('img');
            if (limg) {
              limg.src = src;
              // Placement auto dans la zone dès que l'image est chargée (ratio connu).
              limg.onload = function () { window.placeLogoInZone(zone); };
            }
            logo.style.display = 'block';
          }
          window.placeLogoInZone(zone);
          // Aperçu temps réel dans la vignette récap
          window.updateRecapThumbLogo();
          // Basculer vers la vue de face pour positionner le logo
          const faceBtn = document.querySelector('.vt[onclick*="face"]');
          if (faceBtn && typeof selView === 'function') {
            selView(faceBtn, 'face');
          }
        }

        // Logo dos déplaçable sur le produit + bascule automatique vers la vue de dos
        if (zone === 'b') {
          const logo = document.getElementById('logo-b');
          if (logo) {
            const limg = logo.querySelector('img');
            if (limg) {
              limg.src = src;
              limg.onload = function () { window.placeLogoInZone('b'); };
            }
            logo.style.display = 'block';
          }
          window.placeLogoInZone('b');
          // Basculer vers la vue de dos pour que le client positionne le logo
          const dosBtn = document.querySelector('.vt[onclick*="dos"]');
          if (dosBtn && typeof selView === 'function') {
            selView(dosBtn, 'dos');
          }
        }

        // Recap rows
        if (zone === 'f') {
          document.getElementById('rc-img-f').src = src;
          document.getElementById('rc-front').style.display = 'flex';
        }
        if (zone === 'b') {
          document.getElementById('rc-img-b').src = src;
          document.getElementById('rc-back').style.display = 'flex';
        }
      }
    }
  window.applyUpload = applyUpload;

})();
