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
    const lastCat = (PC.state && PC.state.lastCategory) || 'hamburguesas';

    const items = [
      { id: 'inicio', label: 'Inicio', hash: '#/inicio', icon: PC.icons.navHome(), active: route.page === 'inicio' },
      { id: 'menu', label: 'Menú', hash: `#/catalogo/${lastCat}`, icon: PC.icons.navMenu(), active: route.page === 'catalogo' },
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
