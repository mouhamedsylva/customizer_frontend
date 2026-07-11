/**
 * conf-bg-removal.js
 * Suppression d'arrière-plan côté client (gratuit, IA locale).
 *
 * API publique :
 *   window.ConfBgRemoval.ask(dataUrl) -> Promise<string>
 *     Affiche une modale « Voulez-vous supprimer l'arrière-plan ? ».
 *     - « Non »  -> résout avec le dataUrl ORIGINAL.
 *     - « Oui »  -> détoure l'image (spinner), résout avec le PNG transparent.
 *       Un bouton « Remettre le fond » permet de revenir à l'original.
 *
 * Le moteur est @imgly/background-removal, chargé à la demande depuis un CDN
 * ESM. Le modèle (~10 Mo) est téléchargé une seule fois puis mis en cache par
 * le navigateur.
 */
(function () {
  'use strict';

  // URL du module ESM (chargé dynamiquement à la première utilisation).
  // esm.sh transforme le paquet npm en module 100% navigateur (résout les
  // dépendances Node, supprime les `require`). `?bundle` embarque tout.
  var IMGLY_ESM = 'https://esm.sh/@imgly/background-removal@1.6.0?bundle';

  var _imglyPromise = null;   // cache du chargement du module
  var _lastOriginal = null;   // dernier dataUrl original (pour « Remettre le fond »)
  var _lastCutout = null;     // dernier dataUrl détouré (cache)

  /* Charge le module IA une seule fois. */
  function loadImgly() {
    if (_imglyPromise) return _imglyPromise;
    _imglyPromise = import(/* webpackIgnore: true */ IMGLY_ESM)
      .then(function (mod) {
        return mod.removeBackground
          || (mod.default && mod.default.removeBackground)
          || mod.default;
      })
      .catch(function (err) {
        _imglyPromise = null; // permet de réessayer plus tard
        throw err;
      });
    return _imglyPromise;
  }

  /* Injecte les styles de la modale (une seule fois). */
  function ensureStyles() {
    if (document.getElementById('conf-bgr-styles')) return;
    var css = ''
      + '.conf-bgr-overlay{position:fixed;inset:0;z-index:100000;display:flex;'
      + 'align-items:center;justify-content:center;background:rgba(15,18,22,.55);'
      + 'backdrop-filter:blur(2px);animation:conf-bgr-fade .18s ease;}'
      + '@keyframes conf-bgr-fade{from{opacity:0}to{opacity:1}}'
      + '.conf-bgr-card{background:#fff;border-radius:16px;width:min(92vw,420px);'
      + 'padding:22px 22px 18px;box-shadow:0 24px 60px rgba(0,0,0,.28);'
      + 'font-family:inherit;text-align:center;}'
      + '.conf-bgr-title{font-size:16px;font-weight:800;color:#14181c;margin:0 0 6px;}'
      + '.conf-bgr-sub{font-size:12.5px;color:#5b636c;line-height:1.5;margin:0 0 16px;}'
      + '.conf-bgr-preview{width:150px;height:150px;margin:0 auto 16px;border-radius:12px;'
      + 'background-color:#f4f5f7;'
      + 'background-image:conic-gradient(#e9ebee 25%,transparent 0 50%,#e9ebee 0 75%,transparent 0);'
      + 'background-size:22px 22px;display:flex;align-items:center;justify-content:center;'
      + 'overflow:hidden;border:1px solid #eceef1;}'
      + '.conf-bgr-preview img{max-width:100%;max-height:100%;object-fit:contain;display:block;}'
      + '.conf-bgr-actions{display:flex;gap:10px;}'
      + '.conf-bgr-btn{flex:1;padding:11px 12px;border-radius:10px;font-size:13px;'
      + 'font-weight:700;cursor:pointer;border:1.5px solid transparent;transition:.15s;}'
      + '.conf-bgr-btn.secondary{background:#f2f3f5;color:#333;border-color:#e5e7ea;}'
      + '.conf-bgr-btn.secondary:hover{background:#e9ebee;}'
      + '.conf-bgr-btn.primary{background:#14181c;color:#fff;}'
      + '.conf-bgr-btn.primary:hover{background:#000;}'
      + '.conf-bgr-btn:disabled{opacity:.5;cursor:not-allowed;}'
      + '.conf-bgr-spinner{width:46px;height:46px;border-radius:50%;border:4px solid #e5e7ea;'
      + 'border-top-color:#14181c;animation:conf-bgr-spin .8s linear infinite;margin:0 auto;}'
      + '@keyframes conf-bgr-spin{to{transform:rotate(360deg)}}'
      + '.conf-bgr-progress{font-size:12px;color:#5b636c;margin-top:12px;min-height:16px;}'
      + '.conf-bgr-err{font-size:12px;color:#c0392b;margin-top:10px;}';
    var style = document.createElement('style');
    style.id = 'conf-bgr-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* Construit l'overlay + carte. Renvoie {overlay, card, close}. */
  function buildModal() {
    ensureStyles();
    var overlay = document.createElement('div');
    overlay.className = 'conf-bgr-overlay';
    var card = document.createElement('div');
    card.className = 'conf-bgr-card';
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    function close() {
      overlay.style.opacity = '0';
      setTimeout(function () { overlay.remove(); }, 160);
    }
    return { overlay: overlay, card: card, close: close };
  }

  /* Convertit un Blob en dataURL. */
  function blobToDataUrl(blob) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(r.result); };
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  }

  /**
   * Point d'entrée : pose la question et renvoie le src final.
   * @param {string} dataUrl - image uploadée (dataURL).
   * @returns {Promise<string>} src final (original ou détouré).
   */
  function ask(dataUrl) {
    return new Promise(function (resolve) {
      var m = buildModal();
      var settled = false;
      function finish(src) {
        if (settled) return;
        settled = true;
        m.close();
        resolve(src);
      }

      // --- Écran 1 : la question ---
      function renderQuestion() {
        m.card.innerHTML = ''
          + '<div class="conf-bgr-preview"><img src="' + dataUrl + '" alt="Aperçu"></div>'
          + '<h3 class="conf-bgr-title">Supprimer l\'arrière-plan ?</h3>'
          + '<p class="conf-bgr-sub">Nous pouvons rendre le fond de votre image transparent, '
          + 'automatiquement. Vous pourrez revenir en arrière.</p>'
          + '<div class="conf-bgr-actions">'
          + '  <button class="conf-bgr-btn secondary" data-act="no">Non, garder le fond</button>'
          + '  <button class="conf-bgr-btn primary" data-act="yes">Oui, enlever le fond</button>'
          + '</div>';
        m.card.querySelector('[data-act="no"]').onclick = function () { finish(dataUrl); };
        m.card.querySelector('[data-act="yes"]').onclick = function () { runRemoval(); };
      }

      // --- Écran 2 : traitement (spinner) ---
      function renderLoading() {
        m.card.innerHTML = ''
          + '<div class="conf-bgr-spinner"></div>'
          + '<h3 class="conf-bgr-title" style="margin-top:16px;">Traitement en cours…</h3>'
          + '<p class="conf-bgr-progress" id="conf-bgr-progress">Préparation…</p>';
      }
      function setProgress(txt) {
        var el = document.getElementById('conf-bgr-progress');
        if (el) el.textContent = txt;
      }

      // --- Écran 3 : résultat (avec « Remettre le fond ») ---
      function renderResult(cutoutUrl) {
        m.card.innerHTML = ''
          + '<div class="conf-bgr-preview"><img src="' + cutoutUrl + '" alt="Détouré"></div>'
          + '<h3 class="conf-bgr-title">Arrière-plan supprimé</h3>'
          + '<p class="conf-bgr-sub">Voici le résultat. Vous pouvez le garder ou remettre '
          + 'l\'image d\'origine.</p>'
          + '<div class="conf-bgr-actions">'
          + '  <button class="conf-bgr-btn secondary" data-act="revert">Remettre le fond</button>'
          + '  <button class="conf-bgr-btn primary" data-act="keep">Garder</button>'
          + '</div>';
        m.card.querySelector('[data-act="revert"]').onclick = function () { finish(dataUrl); };
        m.card.querySelector('[data-act="keep"]').onclick = function () { finish(cutoutUrl); };
      }

      // --- Erreur : on retombe sur l'original ---
      function renderError(msg) {
        m.card.innerHTML = ''
          + '<h3 class="conf-bgr-title">Traitement impossible</h3>'
          + '<p class="conf-bgr-err">' + (msg || 'Une erreur est survenue.') + '</p>'
          + '<p class="conf-bgr-sub" style="margin-top:8px;">Votre image d\'origine sera '
          + 'utilisée telle quelle.</p>'
          + '<div class="conf-bgr-actions">'
          + '  <button class="conf-bgr-btn primary" data-act="ok">OK</button>'
          + '</div>';
        m.card.querySelector('[data-act="ok"]').onclick = function () { finish(dataUrl); };
      }

      // Lance le détourage.
      function runRemoval() {
        renderLoading();
        // Réutilise le cache si on retraite exactement la même image.
        if (_lastOriginal === dataUrl && _lastCutout) {
          renderResult(_lastCutout);
          return;
        }
        loadImgly().then(function (removeBackground) {
          if (typeof removeBackground !== 'function') {
            throw new Error('Module de détourage indisponible.');
          }
          setProgress('Analyse de l\'image…');
          return removeBackground(dataUrl, {
            progress: function (key, current, total) {
              if (total) {
                var pct = Math.round((current / total) * 100);
                setProgress('Chargement du modèle… ' + pct + '%');
              }
            }
          });
        }).then(function (blob) {
          return blobToDataUrl(blob);
        }).then(function (cutoutUrl) {
          _lastOriginal = dataUrl;
          _lastCutout = cutoutUrl;
          renderResult(cutoutUrl);
        }).catch(function (err) {
          console.warn('[bg-removal] échec :', err);
          renderError(err && err.message);
        });
      }

      renderQuestion();
    });
  }

  window.ConfBgRemoval = { ask: ask };
})();
