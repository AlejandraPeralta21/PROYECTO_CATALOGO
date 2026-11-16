/* ==========================================================================
   FIXED BOTTOM NAVIGATION BAR (4 TABS: INICIO, MENÚ, PROMOCIONES, PERFIL)
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  function render(route) {
    const root = document.getElementById('app-bottom-nav');
    if (!root) return;

    const hiddenOn = ['splash', 'bienvenida', 'producto'];
    if (hiddenOn.includes(route.page)) {
      root.innerHTML = '';
      root.className = 'bottom-nav-wrap is-hidden';
      return;
    }

    root.className = 'bottom-nav-wrap';
    const lastCat = (PC.state && PC.state.lastCategory) || 'pollos';

    const items = [
      { id: 'inicio', label: 'Inicio', hash: '#/inicio', icon: PC.icons.navHome(), active: route.page === 'inicio' },
      { id: 'menu', label: 'Menú', hash: `#/catalogo/${lastCat}`, icon: PC.icons.navMenu(), active: route.page === 'catalogo' },
      { id: 'delivery', label: 'Delivery', hash: '#/delivery', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h12v11H3zM15 10h4l3 3v4h-7z"/><circle cx="7.5" cy="18" r="1.8"/><circle cx="18.5" cy="18" r="1.8"/></svg>`, active: route.page === 'delivery' },
      { id: 'promociones', label: 'Promociones', hash: '#/promociones', icon: PC.icons.navPromos(), active: route.page === 'promociones' },
      { id: 'perfil', label: 'Perfil', hash: '#/perfil', icon: PC.icons.navProfile(), active: route.page === 'perfil' },
    ];

    root.innerHTML = `
      <nav class="bottom-nav" aria-label="Navegación principal">
        ${items
          .map(
            (item) => `
          <button
            type="button"
            class="bottom-nav-item ${item.active ? 'is-active' : ''}"
            data-nav="${item.hash}"
            aria-current="${item.active ? 'page' : 'false'}"
          >
            ${item.icon}
            <span>${item.label}</span>
          </button>`
          )
          .join('')}
      </nav>
    `;
  }

  PC.components = PC.components || {};
  PC.components.bottomNav = { render };
})(window);
