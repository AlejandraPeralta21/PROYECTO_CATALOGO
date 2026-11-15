/* ==========================================================================
   IMAGE LAYOUT MODULE – renderImage()
   Función reutilizable que define el layout de TODAS las imágenes de la app:
   - Tamaño intrínseco (width/height) + aspect-ratio → evita saltos de layout (CLS)
   - object-fit / object-position según el rol de la imagen (preset)
   - Estrategia de carga: lazy / eager, decoding y fetchpriority
   - Fade-in suave al terminar de cargar
   - Fallback automático si la imagen falla (y placeholder si también falla)
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  const BRAND_LOGO = 'assets/brand/logo-planet-chicken.png';
  const BRAND_LOGO_ALT = 'assets/brand/logo-original.jpg';

  /* Dimensiones reales de cada archivo (px). Permiten reservar el espacio
     exacto antes de que la imagen descargue. */
  const INTRINSIC_SIZES = {
    'logo-planet-chicken.png': [480, 480],
    'logo-original.jpg': [659, 508],
    'combo-classic.png': [640, 478],
    'combo-family.png': [640, 478],
  };
  const DEFAULT_PRODUCT_SIZE = [640, 640];

  /* Presets de layout: uno por cada rol que cumple una imagen en la interfaz. */
  const PRESETS = {
    // Logo circular pequeño: header, menú lateral, tarjeta de perfil
    logo: { fit: 'cover', position: 'center', ratio: '1 / 1', loading: 'eager', priority: 'auto', fallback: BRAND_LOGO_ALT },
    // Logo protagonista: splash y bienvenida (primer pintado de la app)
    brand: { fit: 'cover', position: 'center', ratio: '1 / 1', loading: 'eager', priority: 'high', fallback: BRAND_LOGO_ALT },
    // Foto de categoría en el menú principal (visible sin scroll)
    category: { fit: 'contain', position: 'center bottom', ratio: null, loading: 'eager', priority: 'auto', fallback: BRAND_LOGO },
    // Foto de producto dentro de tarjetas del catálogo / promociones
    card: { fit: 'contain', position: 'center', ratio: null, loading: 'lazy', priority: 'low', fallback: BRAND_LOGO },
    // Imagen principal del detalle de producto
    hero: { fit: 'contain', position: 'center', ratio: null, loading: 'eager', priority: 'high', fallback: BRAND_LOGO },
    // Imagen destacada del banner de promociones
    promo: { fit: 'contain', position: 'center', ratio: null, loading: 'eager', priority: 'auto', fallback: BRAND_LOGO },
    // Miniatura en listas (selecciones / favoritos del perfil)
    thumb: { fit: 'contain', position: 'center', ratio: '1 / 1', loading: 'lazy', priority: 'low', fallback: BRAND_LOGO },
  };

  function escapeAttr(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function getIntrinsicSize(src) {
    const file = String(src || '').split('/').pop();
    return INTRINSIC_SIZES[file] || DEFAULT_PRODUCT_SIZE;
  }

  /**
   * Genera el HTML de una imagen con su layout aplicado.
   * @param {Object} opts
   * @param {string} opts.src        Ruta de la imagen
   * @param {string} [opts.alt]      Texto alternativo ('' = decorativa)
   * @param {string} [opts.preset]   logo | brand | category | card | hero | promo | thumb
   * @param {string} [opts.className] Clases propias del componente (se conservan)
   * @param {string} [opts.loading]  Sobrescribe lazy/eager del preset
   * @param {string} [opts.fallback] Sobrescribe la imagen de respaldo
   * @returns {string} HTML del <img>
   */
  function renderImage(opts) {
    const o = opts || {};
    const presetName = PRESETS[o.preset] ? o.preset : 'card';
    const preset = PRESETS[presetName];
    const [w, h] = getIntrinsicSize(o.src);
    const alt = o.alt == null ? '' : o.alt;

    const classes = ['pc-img', `pc-img--${presetName}`, o.className || ''].join(' ').trim();
    const styleVars = [
      `--pc-img-fit:${preset.fit}`,
      `--pc-img-position:${preset.position}`,
      preset.ratio ? `--pc-img-ratio:${preset.ratio}` : '',
    ]
      .filter(Boolean)
      .join(';');

    return `<img
      class="${escapeAttr(classes)}"
      src="${escapeAttr(o.src)}"
      alt="${escapeAttr(alt)}"
      width="${w}"
      height="${h}"
      loading="${escapeAttr(o.loading || preset.loading)}"
      decoding="${preset.loading === 'eager' ? 'sync' : 'async'}"
      fetchpriority="${preset.priority}"
      data-layout="${presetName}"
      data-fallback="${escapeAttr(o.fallback || preset.fallback)}"
      ${alt === '' ? 'aria-hidden="true"' : ''}
      style="${styleVars}"
      draggable="false"
    />`;
  }

  /* ---------- Comportamiento: fade-in y fallback ---------- */

  function markLoaded(img) {
    img.classList.add('is-loaded');
    img.classList.remove('is-broken');
  }

  function handleError(img) {
    const fallback = img.getAttribute('data-fallback');
    if (fallback && !img.dataset.fallbackApplied && !img.src.endsWith(fallback)) {
      img.dataset.fallbackApplied = 'true';
      img.classList.add('is-fallback');
      img.src = fallback;
      return;
    }
    // El respaldo también falló: mostrar placeholder visual
    img.classList.add('is-broken', 'is-loaded');
  }

  /* Revisa imágenes ya renderizadas (p. ej. servidas desde caché) */
  function hydrate(scope) {
    (scope || document).querySelectorAll('img.pc-img:not(.is-loaded)').forEach((img) => {
      if (img.complete) {
        if (img.naturalWidth > 0) markLoaded(img);
        else handleError(img);
      }
    });
  }

  function init() {
    document.documentElement.classList.add('pc-media-ready');

    // Los eventos load/error no burbujean: se escuchan en fase de captura
    document.addEventListener(
      'load',
      (e) => {
        if (e.target instanceof HTMLImageElement && e.target.classList.contains('pc-img')) markLoaded(e.target);
      },
      true
    );
    document.addEventListener(
      'error',
      (e) => {
        if (e.target instanceof HTMLImageElement && e.target.classList.contains('pc-img')) handleError(e.target);
      },
      true
    );

    // Cada vez que una página/componente inyecta HTML nuevo, se hidratan sus imágenes
    const app = document.getElementById('app') || document.body;
    new MutationObserver(() => hydrate(app)).observe(app, { childList: true, subtree: true });
    hydrate(app);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  PC.media = { renderImage, hydrate, PRESETS, BRAND_LOGO };
  PC.renderImage = renderImage;
})(window);
