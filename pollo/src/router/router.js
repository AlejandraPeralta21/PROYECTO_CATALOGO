/* ==========================================================================
   HASH ROUTER & PAGE NAVIGATION LOGIC
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  const listeners = new Set();
  const historyStack = [];
  let initialized = false;

  function parseHash() {
    const raw = (window.location.hash || '#/splash').replace(/^#\/?/, '');
    const parts = raw.split('/').filter(Boolean);
    const page = parts[0] || 'splash';

    if (page === 'catalogo') {
      return { page: 'catalogo', category: parts[1] || 'pollos' };
    }
    if (page === 'producto') {
      return { page: 'producto', productId: parts[1] || 'five-burger-clasica' };
    }
    if (page === 'herramientas') {
      return { page: 'herramientas', tab: ['contacto', 'auditoria'].includes(parts[1]) ? parts[1] : 'filtros' };
    }
    if (['login', 'admin', 'carrito', 'splash', 'bienvenida', 'inicio', 'promociones', 'perfil', 'delivery', 'reserva'].includes(page)) {
      return { page };
    }
    return { page: 'inicio' };
  }

  function navigate(path, { replace = false } = {}) {
    const targetHash = path.startsWith('#') ? path : `#/${path.replace(/^\//, '')}`;
    if (window.location.hash === targetHash) {
      emit();
      return;
    }

    if (!replace && window.location.hash) {
      historyStack.push(window.location.hash);
    }

    if (replace) {
      window.location.replace(targetHash);
    } else {
      window.location.hash = targetHash;
    }
  }

  function goBack(fallback = '#/inicio') {
    if (historyStack.length > 0) {
      const prev = historyStack.pop();
      window.location.hash = prev;
      return;
    }
    navigate(fallback, { replace: true });
  }

  function emit() {
    const route = parseHash();
    listeners.forEach((fn) => fn(route));
  }

  function init() {
    if (initialized) return;
    initialized = true;
    window.addEventListener('hashchange', emit);
    if (!window.location.hash) {
      window.location.replace('#/splash');
    } else {
      emit();
    }
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  PC.router = {
    init,
    navigate,
    goBack,
    current: parseHash,
    subscribe,
  };
})(window);
