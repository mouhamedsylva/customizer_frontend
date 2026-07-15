/* ─────────────────────────────────────────────────────────────────────────
   Bascule manche gauche / manche droite (vue de côté, textiles).

   Il n'existe qu'UNE image de profil par couleur : le côté droit est le côté
   gauche retourné en miroir (le vêtement est symétrique). L'image seule est
   retournée — pas la couche des logos, sinon le design du client apparaîtrait
   inversé. La zone de la manche droite est donc placée en miroir dans le
   liquid (46% = 100 - 48 - 6).

   Deux entrées :
     - setSleeveSide('l' | 'r')  : clic sur la bascule
     - showSleeve('sl' | 'sr')   : appelé à l'upload, fait pivoter vers la
                                   bonne manche automatiquement.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var current = 'l';

  function layer() { return document.getElementById('logo-layer'); }
  function stage() { return document.querySelector('.cv-single-view'); }

  /** Affiche le côté demandé, avec l'animation de rotation. */
  function setSide(side, animate) {
    side = (side === 'r') ? 'r' : 'l';

    var lay = layer();
    var st = stage();
    if (!lay || !st) return;

    var changed = (side !== current);
    current = side;

    // Les zones/logos du côté masqué disparaissent (CSS [data-side]).
    lay.setAttribute('data-side', side);
    st.classList.toggle('side-r', side === 'r');
    // scaleX de destination, pour que l'animation parte du bon état.
    st.style.setProperty('--flip', side === 'r' ? -1 : 1);

    // Boutons de la bascule.
    var bl = document.getElementById('st-l');
    var br = document.getElementById('st-r');
    if (bl) bl.classList.toggle('on', side === 'l');
    if (br) br.classList.toggle('on', side === 'r');

    // Rotation : uniquement si le côté change vraiment.
    if (changed && animate !== false) {
      st.classList.remove('flipping');
      void st.offsetWidth;            // relance l'animation
      st.classList.add('flipping');
      setTimeout(function () { st.classList.remove('flipping'); }, 600);
    }

    // Les pointillés dépendent du contenu de la zone affichée.
    if (typeof window.refreshZoneGuides === 'function') {
      window.refreshZoneGuides();
    }
  }

  /** Clic sur la bascule. */
  window.setSleeveSide = function (side) { setSide(side, true); };

  /**
   * Bascule vers la manche concernée par un upload, en passant d'abord en vue
   * de côté si nécessaire. C'est ce qui donne l'effet « le vêtement tourne
   * tout seul pour montrer la manche qu'on vient de personnaliser ».
   */
  window.showSleeve = function (zone) {
    if (zone !== 'sl' && zone !== 'sr') return;

    var side = (zone === 'sr') ? 'r' : 'l';
    var lay = layer();
    var alreadyCote = lay && lay.getAttribute('data-view') === 'cote';

    if (!alreadyCote) {
      // Passe en vue de côté (le bouton d'onglet porte la logique existante).
      var tabs = document.querySelectorAll('.vt');
      var coteTab = tabs[2];
      if (coteTab && typeof window.selView === 'function') {
        window.selView(coteTab, 'cote');
      }
      // Laisse la vue s'afficher avant de pivoter, sinon les deux animations
      // se télescopent.
      setTimeout(function () { setSide(side, true); }, 60);
      return;
    }
    setSide(side, true);
  };

  /** Le sélecteur n'a de sens qu'en vue de côté : on le montre/cache. */
  window.syncSideToggle = function (view) {
    var box = document.getElementById('side-toggle');
    if (!box) return;
    box.style.display = (view === 'cote') ? 'inline-flex' : 'none';
  };

  /** Côté actuellement affiché (utilisé à la capture des vues). */
  window.currentSleeveSide = function () { return current; };
})();
