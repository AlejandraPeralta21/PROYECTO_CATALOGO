/* ==========================================================================
   CATALOG DATA: CATEGORIES, SUBCATEGORIES, PRODUCTS & PROMOTIONS (Bs)
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  function escapeHTML(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  const CATEGORIES = [
    {
      id: 'pollos',
      name: 'Chicken',
      subtitle: 'Pollo dorado al spiedo y crujiente',
      image: 'assets/images/products/chicken/chicken-platter.png',
      icon: 'foodChicken',
      variant: 'hero',
      searchPlaceholder: 'Buscar pollo...',
      subcategories: [
        { id: 'todas', name: 'Todos', icon: 'navMenu' },
        { id: 'porciones', name: 'Porciones', icon: 'foodChicken' },
        { id: 'familiares', name: 'Familiares', icon: 'foodBurgerDouble' },
      ],
    },
    {
      id: 'hamburguesas',
      name: 'Hamburguesas',
      subtitle: 'Crujientes por fuera, jugosas por dentro',
      image: 'assets/images/products/burgers/burger-classic.png',
      icon: 'foodBurger',
      variant: 'red',
      searchPlaceholder: 'Buscar hamburguesas...',
      subcategories: [
        { id: 'todas', name: 'Todas', icon: 'navMenu' },
        { id: 'clasicas', name: 'Clásicas', icon: 'foodBurger' },
        { id: 'especiales', name: 'Especiales', icon: 'foodBurgerSpecial' },
        { id: 'combos', name: 'Combos', icon: 'foodCombo' },
      ],
    },
    {
      id: 'wings',
      name: 'Wings',
      subtitle: 'Alitas crocantes con salsa galáctica',
      image: 'assets/images/products/wings/chicken-wings.png',
      icon: 'foodChicken',
      variant: 'gold',
      searchPlaceholder: 'Buscar wings y alitas...',
      subcategories: [
        { id: 'todas', name: 'Todas', icon: 'navMenu' },
        { id: 'porciones', name: 'Porciones', icon: 'foodChicken' },
        { id: 'combos', name: 'Combos', icon: 'foodCombo' },
      ],
    },
    {
      id: 'combos',
      name: 'Combos',
      subtitle: 'Tu menú completo en un solo paquete',
      image: 'assets/images/products/combos/combo-classic.png',
      icon: 'foodCombo',
      variant: 'red',
      searchPlaceholder: 'Buscar combos...',
      subcategories: [
        { id: 'todas', name: 'Todos', icon: 'navMenu' },
        { id: 'pollo', name: 'Chicken', icon: 'foodChicken' },
        { id: 'especiales', name: 'Especiales', icon: 'foodBurgerSpecial' },
      ],
    },
    {
      id: 'bebidas',
      name: 'Bebidas',
      subtitle: 'Refrescantes bien heladas',
      image: 'assets/images/products/drinks/drink-soda.png',
      icon: 'foodDrink',
      variant: 'red',
      searchPlaceholder: 'Buscar bebidas...',
      subcategories: [
        { id: 'todas', name: 'Todas', icon: 'navMenu' },
        { id: 'gaseosas', name: 'Gaseosas', icon: 'foodDrink' },
        { id: 'naturales', name: 'Jugos naturales', icon: 'foodDrink' },
      ],
    },
    {
      id: 'acompanamientos',
      name: 'Acompañamientos',
      subtitle: 'Papas doradas, nuggets y aros',
      image: 'assets/images/products/sides/sides-fries.png',
      icon: 'foodFries',
      variant: 'red',
      searchPlaceholder: 'Buscar acompañamientos...',
      subcategories: [
        { id: 'todas', name: 'Todos', icon: 'navMenu' },
        { id: 'papas', name: 'Papas', icon: 'foodFries' },
        { id: 'extras', name: 'Nuggets & Aros', icon: 'foodChicken' },
      ],
    },
  ];

  // El respaldo incluido permite mostrar el menú cuando fetch no está disponible, como al abrir index.html desde file://.
  let PRODUCTS = Array.isArray(global.PC_PRODUCTS_FALLBACK) ? global.PC_PRODUCTS_FALLBACK.map((product) => ({ ...product })) : [];
  const PRODUCT_IMAGE_OVERRIDES_KEY = 'planet_chicken_product_images';
  const BUSINESS_INFO = {
    name: 'PLANET CHICKEN',
    slogan: 'Wings & Chicken',
    tagline: 'El mejor sabor en cada bocado',
    hours: 'Lunes a Domingo · 11:00 a 23:00',
    phone: '+591 700-48290',
    branches: [
      'Santa Cruz · Av. San Martín, Equipetrol #420',
      'La Paz · Av. Montenegro #815, San Miguel',
      'Cochabamba · Av. América Oeste #1120',
    ],
  };

  function formatBs(amount) {
    return `Bs ${Number(amount).toFixed(2).replace('.', ',')}`;
  }

  function getCategory(id) {
    return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
  }

  function getProduct(id) {
    return PRODUCTS.find((p) => p.id === id) || null;
  }

  function getProductImageOverrides() {
    try {
      const value = JSON.parse(localStorage.getItem(PRODUCT_IMAGE_OVERRIDES_KEY) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch (error) {
      return {};
    }
  }

  function normalizeDropboxImageUrl(value) {
    let url;
    try { url = new URL(String(value || '').trim()); } catch (error) { return ''; }
    const host = url.hostname.toLowerCase();
    const isDropbox = host === 'dropbox.com' || host.endsWith('.dropbox.com') || host === 'dropboxusercontent.com' || host.endsWith('.dropboxusercontent.com');
    if (url.protocol !== 'https:' || !isDropbox) return '';
    if (host === 'dropbox.com' || host.endsWith('.dropbox.com')) {
      url.searchParams.delete('dl');
      url.searchParams.set('raw', '1');
    }
    return url.href;
  }

  function applyProductImageOverrides(products) {
    const overrides = getProductImageOverrides();
    products.forEach((product) => {
      const normalized = normalizeDropboxImageUrl(overrides[product.id]);
      if (normalized) product.image = normalized;
    });
  }

  function getOriginalProductImage(productId) {
    const original = (Array.isArray(global.PC_PRODUCTS_FALLBACK) ? global.PC_PRODUCTS_FALLBACK : []).find((item) => item.id === productId);
    return original ? original.image : (getProduct(productId) || {}).image || '';
  }

  function setProductImageOverride(productId, value) {
    const product = getProduct(productId);
    const normalized = normalizeDropboxImageUrl(value);
    if (!product || !normalized) return false;
    const overrides = getProductImageOverrides();
    overrides[productId] = normalized;
    try { localStorage.setItem(PRODUCT_IMAGE_OVERRIDES_KEY, JSON.stringify(overrides)); } catch (error) { return false; }
    product.image = normalized;
    return true;
  }

  function clearProductImageOverride(productId) {
    const product = getProduct(productId);
    if (!product) return false;
    const overrides = getProductImageOverrides();
    delete overrides[productId];
    try { localStorage.setItem(PRODUCT_IMAGE_OVERRIDES_KEY, JSON.stringify(overrides)); } catch (error) { return false; }
    product.image = getOriginalProductImage(productId);
    return true;
  }

  applyProductImageOverrides(PRODUCTS);

  function getPromotions() {
    return PRODUCTS.filter((p) => p.previousPrice !== null || p.promoType !== null);
  }

  let catalogRequest = null;
  const CATALOG_STORAGE_KEY = 'planet_chicken_catalog_cache_v2';

  function loadCatalog() {
    if (catalogRequest) return catalogRequest;

    const catalogUrl = new URL('src/data/products.json', document.baseURI);
    catalogRequest = fetch(catalogUrl, { headers: { Accept: 'application/json' } })
      .then((response) => {
        if (!response.ok) throw new Error(`No se pudo cargar el catálogo (${response.status}).`);
        return response.json();
      })
      .catch((networkError) => {
        // El service worker normalmente responde desde Cache Storage; este respaldo
        // permite abrir el menú si el navegador aún no controla la página.
        try {
          const saved = JSON.parse(localStorage.getItem(CATALOG_STORAGE_KEY) || 'null');
          if (Array.isArray(saved) && saved.length >= 15) return saved;
        } catch (error) {}
        throw networkError;
      })
      .then((products) => {
        if (!Array.isArray(products) || products.length < 15) {
          throw new Error('El catálogo recibido no contiene al menos 15 productos válidos.');
        }
        const validProducts = products.every((product) =>
          product && typeof product.id === 'string' && typeof product.name === 'string' &&
          typeof product.category === 'string' && Number.isFinite(Number(product.price)) &&
          typeof product.image === 'string'
        );
        if (!validProducts) throw new Error('El catálogo tiene productos incompletos.');

        PRODUCTS = products;
        PC.data.PRODUCTS = PRODUCTS;
        try { localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(PRODUCTS)); } catch (error) {}
        applyProductImageOverrides(PRODUCTS);
        global.dispatchEvent(new CustomEvent('pc:catalog-loaded', {
          detail: { productCount: PRODUCTS.length },
        }));
        return PRODUCTS;
      })
      .catch((error) => {
        catalogRequest = null;
        throw error;
      });

    return catalogRequest;
  }

  PC.data = {
    CATEGORIES,
    PRODUCTS,
    BUSINESS_INFO,
    loadCatalog,
    formatBs,
    getCategory,
    getProduct,
    getPromotions,
    getProductImageOverrides,
    getOriginalProductImage,
    normalizeDropboxImageUrl,
    setProductImageOverride,
    clearProductImageOverride,
  };
  PC.escapeHTML = escapeHTML;
})(window);
