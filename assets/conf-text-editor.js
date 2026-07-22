/**
 * conf-text-editor.js — Éditeur de texte façon CustomInk (textiles).
 *
 * Flux :
 *  1) Bouton « Ajouter un texte » -> champ inline (Insérer / Annuler).
 *  2) « Insérer » -> le sidebar est masqué et le PANNEAU d'édition s'ouvre
 *     (police avec aperçu, couleur, forme de texte). « Enregistrer » -> ferme.
 *  3) Le texte s'affiche dans la zone pointillée (horizontale) et NE PEUT PAS
 *     en sortir (clamp). Formes courbes rendues en SVG.
 *
 * Zones : 'f' (face), 'b' (dos). En face, texte et logo cœur sont exclusifs.
 */
(function () {
  'use strict';

  // ── Catalogue de polices (Google Fonts + quelques system) ──
  var FONTS = [
    { name: 'Arial',            css: 'Arial, sans-serif' },
    { name: 'Impact',           css: "'Anton', Impact, sans-serif" },
    { name: 'Bebas Neue',       css: "'Bebas Neue', sans-serif" },
    { name: 'Oswald',           css: "'Oswald', sans-serif" },
    { name: 'Teko',             css: "'Teko', sans-serif" },
    { name: 'Montserrat',       css: "'Montserrat', sans-serif" },
    { name: 'Poppins',          css: "'Poppins', sans-serif" },
    { name: 'Righteous',        css: "'Righteous', cursive" },
    { name: 'Fredoka',          css: "'Fredoka One', cursive" },
    { name: 'Bangers',          css: "'Bangers', cursive" },
    { name: 'Luckiest Guy',     css: "'Luckiest Guy', cursive" },
    { name: 'Shrikhand',        css: "'Shrikhand', cursive" },
    { name: 'Lobster',          css: "'Lobster', cursive" },
    { name: 'Pacifico',         css: "'Pacifico', cursive" },
    { name: 'Dancing Script',   css: "'Dancing Script', cursive" },
    { name: 'Great Vibes',      css: "'Great Vibes', cursive" },
    { name: 'Sacramento',       css: "'Sacramento', cursive" },
    { name: 'Satisfy',          css: "'Satisfy', cursive" },
    { name: 'Yellowtail',       css: "'Yellowtail', cursive" },
    { name: 'Caveat',           css: "'Caveat', cursive" },
    { name: 'Permanent Marker', css: "'Permanent Marker', cursive" },
    { name: 'Rock Salt',        css: "'Rock Salt', cursive" },
    { name: 'Special Elite',    css: "'Special Elite', monospace" },
    { name: 'Playfair',         css: "'Playfair Display', serif" },
    { name: 'Merriweather',     css: "'Merriweather', serif" },
    { name: 'Roboto Slab',      css: "'Roboto Slab', serif" },
    { name: 'Georgia',          css: "Georgia, serif" },
    { name: 'Times',            css: "'Times New Roman', serif" },
    { name: 'Courier',          css: "'Courier New', monospace" },
    { name: 'Verdana',          css: "Verdana, sans-serif" }
  ];

  // ── Palette de couleurs (mêmes 16 que patchs/drapeaux) ──
  var COLORS = [
    '#ffffff', '#000000', '#f5f2ed', '#9e9e9e', '#555555', '#607d8b',
    '#1e3a5f', '#5bb8e8', '#2e6b45', '#f0c8d8', '#e8729a', '#c0392b',
    '#e8842a', '#f5c842', '#9b6bb5', '#7d4e2d'
  ];

  // ── Formes de texte (SVG path pour les courbes) ──
  // 'normal' = pas de courbe. Les autres définissent une trajectoire.
  var SHAPES = [
    { id: 'normal',  name: 'Normal' },
    { id: 'curve',   name: 'Curve'  },
    { id: 'arch',    name: 'Arch'   },
    { id: 'bridge',  name: 'Bridge' },
    { id: 'valley',  name: 'Valley' }
  ];

  // État courant de l'édition.
  var state = {
    zone: null,          // 'f' | 'b'
    text: '',
    font: 'Arial, sans-serif',
    fontName: 'Arial',
    color: '#ffffff',
    shape: 'normal'
  };

  // ─────────────────────── Persistance ───────────────────────
  function store() {
    try { return JSON.parse(sessionStorage.getItem('conf_texts')) || {}; }
    catch (e) { return {}; }
  }
  function productKey() { return window.currentProductType || 'sweatshirt'; }
  function getState(zone) {
    var all = store(); return (all[productKey()] || {})[zone] || null;
  }
  function saveState(zone, data) {
    var all = store();
    if (!all[productKey()]) all[productKey()] = {};
    all[productKey()][zone] = data;
    try { sessionStorage.setItem('conf_texts', JSON.stringify(all)); } catch (e) {}
  }
  function clearState(zone) {
    var all = store();
    if (all[productKey()]) delete all[productKey()][zone];
    try { sessionStorage.setItem('conf_texts', JSON.stringify(all)); } catch (e) {}
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }

  // ─────────────── Champ inline (bouton -> saisie) ───────────────
  /* Zone visée par la saisie en cours. Renseignée par startTextInline() quand
     l'appelant la précise (boutons « texte gauche / droite » en vue de face) ;
     null = on retombe sur la déduction par la vue courante. */
  var pendingZone = null;

  /* Sélection de l'emplacement dans le panneau de saisie. */
  window.setTextZoneChoice = function (btn) {
    pendingZone = btn.getAttribute('data-zone');
    var wrap = document.getElementById('txt-where');
    if (wrap) {
      wrap.querySelectorAll('.txt-where-opt').forEach(function (b) {
        b.classList.toggle('on', b === btn);
      });
    }
  };

  window.startTextInline = function (zone) {
    // Emplacement par défaut : celui de la vue affichée, pour que le choix
    // proposé corresponde à ce que le client regarde.
    var layer = document.getElementById('logo-layer');
    var view = layer ? layer.getAttribute('data-view') : 'face';
    pendingZone = zone || (view === 'dos' ? 'b' : 'f');
    var wrap = document.getElementById('txt-where');
    if (wrap) {
      wrap.querySelectorAll('.txt-where-opt').forEach(function (b) {
        b.classList.toggle('on', b.getAttribute('data-zone') === pendingZone);
      });
    }
    var addBtns = document.getElementById('txt-add-btns');
    if (addBtns) addBtns.style.display = 'none';
    var single = document.getElementById('txt-add-btn');
    if (single) single.style.display = 'none';
    var box = document.getElementById('txt-inline');
    box.style.display = 'block';
    var input = document.getElementById('txt-inline-input');
    input.value = '';
    setTimeout(function () { input.focus(); }, 30);
    input.onkeydown = function (e) { if (e.key === 'Enter') window.confirmTextInline(); };
  };
  window.cancelTextInline = function () {
    document.getElementById('txt-inline').style.display = 'none';
    var addBtns = document.getElementById('txt-add-btns');
    if (addBtns) addBtns.style.display = '';
    var single = document.getElementById('txt-add-btn');
    if (single) single.style.display = '';
    pendingZone = null;
  };
  window.confirmTextInline = function () {
    var text = (document.getElementById('txt-inline-input').value || '').trim();
    if (!text) { window.cancelTextInline(); return; }
    // Zone explicite (bouton gauche/droite) sinon déduite de la vue courante.
    var zone = pendingZone;
    if (!zone) {
      var layer = document.getElementById('logo-layer');
      var view = layer ? layer.getAttribute('data-view') : 'face';
      zone = (view === 'dos') ? 'b' : 'f';
    }
    // Chaque emplacement porte SOIT un logo SOIT un texte : poser un texte
    // retire le logo de la même zone (et pas des autres).
    if (zone !== 'b' && typeof window.rmUp === 'function') window.rmUp(zone);
    // Prépare l'état et ouvre le panneau d'édition.
    var prev = getState(zone);
    state.zone = zone;
    state.text = text;
    state.font = prev ? prev.font : 'Arial, sans-serif';
    state.fontName = prev ? prev.fontName : 'Arial';
    state.color = prev ? prev.color : '#ffffff';
    state.shape = prev ? prev.shape : 'normal';
    state.bold = prev ? !!prev.bold : false;
    state.italic = prev ? !!prev.italic : false;
    state.underline = prev ? !!prev.underline : false;
    state.size = Math.min(prev && prev.size ? prev.size : 20, maxSize());
    window.cancelTextInline();
    openPanel();
  };

  // Édition d'un texte existant (depuis un chip).
  window.editText = function (zone) {
    var st = getState(zone);
    if (!st) return;
    state.zone = zone; state.text = st.text; state.font = st.font;
    state.fontName = st.fontName || 'Police'; state.color = st.color; state.shape = st.shape || 'normal';
    state.bold = !!st.bold; state.italic = !!st.italic; state.underline = !!st.underline;
    // Borne aussi à la réouverture : un design sauvegardé avant l'ajout du
    // plafond peut porter une taille supérieure.
    state.size = Math.min(st.size || 20, maxSize());
    openPanel();
  };

  // Suppression.
  window.removeText = function (zone) {
    renderTextOnCanvas(zone, null);
    var chip = document.getElementById('txt-chip-' + zone);
    if (chip) chip.style.display = 'none';
    clearState(zone);
    if (zone === 'f' && typeof window.refreshTextButton === 'function') window.refreshTextButton();
    if (typeof window.setTextZoneMode === 'function') window.setTextZoneMode(zone, false);
  };

  // ─────────────── Panneau d'édition (remplace sidebar) ───────────────
  function openPanel() {
    var panel = document.getElementById('txt-panel');
    var sbInner = document.getElementById('sidebar-content');
    if (sbInner) sbInner.style.display = 'none';
    panel.style.display = 'flex';

    document.getElementById('txt-panel-input').value = state.text;
    document.getElementById('txt-panel-font-val').textContent = state.fontName;
    document.getElementById('txt-panel-font-val').style.fontFamily = state.font;
    document.getElementById('txt-panel-shape-val').textContent =
      (SHAPES.filter(function (s) { return s.id === state.shape; })[0] || SHAPES[0]).name;

    // Compteur, taille, et boutons de style (reflètent l'état courant).
    syncTextCount();
    var range = document.getElementById('txt-size-range');
    if (range) range.value = state.size;
    var sizeVal = document.getElementById('txt-size-val');
    if (sizeVal) sizeVal.textContent = state.size;
    syncStyleButtons();

    buildColorSwatches();
    buildFontList();
    buildShapeGrid();
    hideFontPicker(); hideShapePicker();

    // Bascule vers la vue concernée + zone horizontale + rendu live.
    // Seul le dos est en vue « dos » : 'f' ET 'fr' sont deux emplacements de
    // la vue de face (un test sur 'f' seul envoyait 'fr' vers le dos).
    var view = (state.zone === 'b') ? 'dos' : 'face';
    var vb = document.querySelector('.vt[onclick*="' + view + '"]');
    if (vb && typeof window.selView === 'function') window.selView(vb, view);
    if (typeof window.setTextZoneMode === 'function') window.setTextZoneMode(state.zone, true);
    renderLive();
  }

  // Ferme le panneau. save=true -> conserve, false -> annule les modifs.
  window.closeTextPanel = function (save) {
    var panel = document.getElementById('txt-panel');
    var sbInner = document.getElementById('sidebar-content');
    panel.style.display = 'none';
    if (sbInner) sbInner.style.display = '';

    if (save) {
      saveState(state.zone, {
        text: state.text, font: state.font, fontName: state.fontName,
        color: state.color, shape: state.shape,
        bold: state.bold, italic: state.italic, underline: state.underline,
        size: state.size
      });
      // Chip récap dans le sidebar.
      var chip = document.getElementById('txt-chip-' + state.zone);
      var val = document.getElementById('txt-chip-val-' + state.zone);
      if (chip && val) { val.textContent = state.text; val.style.fontFamily = state.font; chip.style.display = 'flex'; }
      if (state.zone === 'f' && typeof window.refreshTextButton === 'function') window.refreshTextButton();
    } else {
      // Annulé : on restaure l'état sauvegardé (ou on retire si aucun).
      var prev = getState(state.zone);
      if (prev) { renderTextOnCanvas(state.zone, prev); }
      else { renderTextOnCanvas(state.zone, null);
             if (typeof window.setTextZoneMode === 'function') window.setTextZoneMode(state.zone, false); }
    }
  };

  window.onPanelTextChange = function () {
    state.text = document.getElementById('txt-panel-input').value;
    syncTextCount();
    buildFontList();  // les aperçus suivent le texte
    renderLive();
  };

  // Compteur de caractères (limite pour éviter le débordement du vêtement).
  function syncTextCount() {
    var input = document.getElementById('txt-panel-input');
    var out = document.getElementById('txt-panel-count');
    if (input && out) out.textContent = (input.value || '').length;
  }

  // ── Style : gras / italique / souligné ──
  window.toggleTextStyle = function (kind) {
    if (kind === 'bold') state.bold = !state.bold;
    else if (kind === 'italic') state.italic = !state.italic;
    else if (kind === 'underline') state.underline = !state.underline;
    syncStyleButtons();
    renderLive();
  };
  function syncStyleButtons() {
    var b = document.getElementById('txt-style-b');
    var i = document.getElementById('txt-style-i');
    var u = document.getElementById('txt-style-u');
    if (b) b.classList.toggle('on', !!state.bold);
    if (i) i.classList.toggle('on', !!state.italic);
    if (u) u.classList.toggle('on', !!state.underline);
  }

  /* Plafond de taille (px). Défini par configurateur.liquid ; la valeur ici
     n'est qu'un repli si le script est chargé hors du configurateur. */
  function maxSize() { return window.MAX_TEXT_SIZE || 28; }

  // ── Taille du texte ──
  window.onTextSizeChange = function () {
    var range = document.getElementById('txt-size-range');
    if (!range) return;
    state.size = Math.min(parseInt(range.value, 10) || 20, maxSize());
    // La taille choisie au panneau prime : on efface une taille figée par un
    // ancien redimensionnement manuel, sinon le slider n'aurait aucun effet.
    state.fontSize = null;
    var out = document.getElementById('txt-size-val');
    if (out) out.textContent = state.size;
    renderLive();
  };

  // ── Couleurs ──
  function buildColorSwatches() {
    var wrap = document.getElementById('txt-color-swatches');
    wrap.innerHTML = COLORS.map(function (c) {
      var active = (c.toLowerCase() === state.color.toLowerCase()) ? ' active' : '';
      var border = (c === '#ffffff' || c === '#f5f2ed') ? ';border:1px solid #ddd' : '';
      return '<button type="button" class="txt-color-sw' + active + '" style="background:' + c + border + '" '
        + 'onclick="pickTextColor(\'' + c + '\')"></button>';
    }).join('');
  }
  window.pickTextColor = function (c) {
    state.color = c;
    buildColorSwatches(); buildFontList(); renderLive();
  };

  // ── Polices (liste avec aperçu du texte saisi) ──
  function buildFontList() {
    var scroll = document.getElementById('txt-font-scroll');
    if (!scroll) return;
    var q = (document.getElementById('txt-font-search').value || '').toLowerCase();
    var sample = state.text || 'Votre texte';
    scroll.innerHTML = FONTS.filter(function (f) {
      return !q || f.name.toLowerCase().indexOf(q) !== -1;
    }).map(function (f) {
      var active = (f.css === state.font) ? ' active' : '';
      return '<div class="txt-font-item' + active + '" onclick="pickTextFont(\'' + esc(f.name) + '\',\''
        + f.css.replace(/'/g, '\\x27').replace(/"/g, '&quot;') + '\')">'
        + '<div class="txt-font-sample" style="font-family:' + f.css.replace(/"/g, '&quot;') + '">'
        + esc(sample) + '</div>'
        + '<div class="txt-font-nm">' + esc(f.name) + '</div>'
        + '</div>';
    }).join('');
  }
  window.filterFonts = function () { buildFontList(); };
  window.pickTextFont = function (name, css) {
    state.font = css; state.fontName = name;
    document.getElementById('txt-panel-font-val').textContent = name;
    document.getElementById('txt-panel-font-val').style.fontFamily = css;
    buildFontList(); renderLive();
    hideFontPicker();
  };
  window.toggleFontPicker = function () {
    var p = document.getElementById('txt-font-picker');
    var open = p.style.display !== 'none';
    hideShapePicker();
    p.style.display = open ? 'none' : 'block';
    if (!open) { buildFontList(); document.getElementById('txt-font-search').focus(); }
  };
  function hideFontPicker() { document.getElementById('txt-font-picker').style.display = 'none'; }

  // ── Formes ──
  function buildShapeGrid() {
    var grid = document.getElementById('txt-shape-grid');
    grid.innerHTML = SHAPES.map(function (s) {
      var active = (s.id === state.shape) ? ' active' : '';
      return '<div class="txt-shape-cell' + active + '" onclick="pickTextShape(\'' + s.id + '\')">'
        + shapeThumb(s.id) + '<span>' + s.name + '</span></div>';
    }).join('');
  }
  // Petit aperçu SVG de la forme.
  function shapeThumb(id) {
    var path = shapePath(id, 80, 34);
    if (id === 'normal') {
      return '<svg viewBox="0 0 80 34" width="72" height="30"><text x="40" y="24" font-size="15" font-weight="700" text-anchor="middle" fill="#333">Abc</text></svg>';
    }
    return '<svg viewBox="0 0 80 34" width="72" height="30"><defs><path id="tp-' + id + '" d="' + path + '"/></defs>'
      + '<text font-size="14" font-weight="700" fill="#333"><textPath href="#tp-' + id + '" startOffset="50%" text-anchor="middle">Abc</textPath></text></svg>';
  }
  window.pickTextShape = function (id) {
    state.shape = id;
    document.getElementById('txt-panel-shape-val').textContent =
      (SHAPES.filter(function (s) { return s.id === id; })[0] || SHAPES[0]).name;
    buildShapeGrid(); renderLive();
    hideShapePicker();
  };
  window.toggleShapePicker = function () {
    var p = document.getElementById('txt-shape-picker');
    var open = p.style.display !== 'none';
    hideFontPicker();
    p.style.display = open ? 'none' : 'block';
    if (!open) buildShapeGrid();
  };
  function hideShapePicker() { document.getElementById('txt-shape-picker').style.display = 'none'; }

  // Trajectoire SVG d'une forme, dans une boîte WxH.
  function shapePath(id, W, H) {
    var m = 6;                    // marge
    var midY = H / 2;
    switch (id) {
      case 'curve':  // léger sourire
        return 'M ' + m + ' ' + (midY + 4) + ' Q ' + (W/2) + ' ' + (H + 4) + ' ' + (W - m) + ' ' + (midY + 4);
      case 'arch':   // arc vers le haut
        return 'M ' + m + ' ' + (H - m) + ' Q ' + (W/2) + ' ' + (-m) + ' ' + (W - m) + ' ' + (H - m);
      case 'bridge': // haut plat, bords qui descendent
        return 'M ' + m + ' ' + (midY) + ' Q ' + (W/2) + ' ' + (m) + ' ' + (W - m) + ' ' + (midY);
      case 'valley': // creux (frown)
        return 'M ' + m + ' ' + (m + 2) + ' Q ' + (W/2) + ' ' + (H - 2) + ' ' + (W - m) + ' ' + (m + 2);
      default:
        return 'M ' + m + ' ' + midY + ' L ' + (W - m) + ' ' + midY;
    }
  }

  // ─────────────── Rendu du texte dans le canvas ───────────────
  // Rendu live pendant l'édition (utilise `state`).
  function renderLive() { renderTextOnCanvas(state.zone, state); }

  // Rend (ou masque si data=null) le texte de la zone dans son élément canvas.
  // Le contenu va dans .dt-content (la poignée de resize reste intacte).
  function renderTextOnCanvas(zone, data) {
    var el = document.getElementById('text-' + zone);
    if (!el) return;
    var content = el.querySelector('.dt-content');
    if (!content) { content = document.createElement('span'); content.className = 'dt-content'; el.insertBefore(content, el.firstChild); }
    if (!data || !data.text) {
      el.style.display = 'none'; content.innerHTML = '';
      el.classList.remove('is-shaped');
      if (typeof window.refreshZoneGuides === 'function') window.refreshZoneGuides();
      return;
    }
    el.style.display = 'block';
    el.style.color = data.color;
    el.style.fontFamily = data.font;
    // Style : gras / italique / souligné.
    el.style.fontWeight = data.bold ? '800' : '400';
    el.style.fontStyle = data.italic ? 'italic' : 'normal';
    el.style.textDecoration = data.underline ? 'underline' : 'none';
    // Taille : priorité à une géométrie mémorisée (drag/resize), sinon la
    // taille choisie au panneau (data.size, en px).
    // data-wanted-size = taille SOUHAITÉE : clampTextToZone réduit si le texte
    // déborde, puis regrossit jusqu'à cette valeur si la place le permet.
    if (data.fontSize) {
      el.style.fontSize = data.fontSize;
      el.setAttribute('data-wanted-size', parseFloat(data.fontSize) || 20);
    } else if (data.size) {
      el.style.fontSize = data.size + 'px';
      el.setAttribute('data-wanted-size', data.size);
    }
    // Autres géométries mémorisées (largeur/position).
    if (data.width) el.style.width = data.width;
    if (data.left) el.style.left = data.left;
    if (data.top) el.style.top = data.top;

    if (data.shape && data.shape !== 'normal') {
      content.innerHTML = buildShapeSVG(data);
      el.classList.add('is-shaped');
    } else {
      el.classList.remove('is-shaped');
      content.textContent = data.text;
    }
    /* Contrainte : rester dans la zone.
       Rejouée après le chargement de la police : la première mesure se fait
       sur la police de repli (les Google Fonts arrivent en différé), donc sur
       des dimensions fausses — le texte pouvait déborder une fois la vraie
       police appliquée. */
    if (typeof window.clampTextToZone === 'function') {
      window.clampTextToZone(zone);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { window.clampTextToZone(zone); });
      }
      setTimeout(function () { window.clampTextToZone(zone); }, 120);
    }
    if (typeof window.refreshZoneGuides === 'function') window.refreshZoneGuides();
  }

  // Construit le SVG d'un texte courbé qui remplit la largeur de l'élément.
  function buildShapeSVG(data) {
    var W = 300, H = 90;
    var path = shapePath(data.shape, W, H);
    var id = 'shp-' + Math.abs(hash(data.text + data.shape));
    var weight = data.bold ? '800' : '700';
    var fstyle = data.italic ? 'italic' : 'normal';
    var deco = data.underline ? 'underline' : 'none';
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="overflow:visible">'
      + '<defs><path id="' + id + '" d="' + path + '"/></defs>'
      + '<text font-size="42" font-weight="' + weight + '" fill="' + data.color + '" '
      + 'font-style="' + fstyle + '" text-decoration="' + deco + '" '
      + 'style="font-family:' + esc(data.font) + '">'
      + '<textPath href="#' + id + '" startOffset="50%" text-anchor="middle">'
      + esc(data.text) + '</textPath></text></svg>';
  }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; } return h; }

  // ─────────────── Restauration (reload / switch produit) ───────────────
  window.restoreTexts = function () {
    ['f', 'fr', 'b'].forEach(function (zone) {
      var st = getState(zone);
      var chip = document.getElementById('txt-chip-' + zone);
      var val = document.getElementById('txt-chip-val-' + zone);
      if (st) {
        renderTextOnCanvas(zone, st);
        if (chip && val) { val.textContent = st.text; val.style.fontFamily = st.font; chip.style.display = 'flex'; }
        if (typeof window.setTextZoneMode === 'function') window.setTextZoneMode(zone, true);
      } else {
        renderTextOnCanvas(zone, null);
        if (chip) chip.style.display = 'none';
        if (typeof window.setTextZoneMode === 'function') window.setTextZoneMode(zone, false);
      }
    });
    if (typeof window.refreshTextButton === 'function') window.refreshTextButton();
  };

  // Sauvegarde la géométrie (position/taille) après un drag/resize du texte.
  window.saveTextGeo = function (zone, geo) {
    var st = getState(zone);
    if (!st) return;
    if (geo.left) st.left = geo.left;
    if (geo.top) st.top = geo.top;
    if (geo.width) st.width = geo.width;
    if (geo.fontSize) st.fontSize = geo.fontSize;
    saveState(zone, st);
  };

  // Expose l'accès à l'état sauvegardé (utilisé par le clamp / autres modules).
  window.getSavedText = getState;
})();
