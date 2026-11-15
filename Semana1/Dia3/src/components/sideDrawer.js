/* ==========================================================================
   SIDE DRAWER MENU COMPONENT
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});
  let isOpen = false;

  function render() {
    const root = document.getElementById('app-drawer');
    if (!root) return;

    const categoryLinks = PC.data.CATEGORIES.map(
      (cat) => `
      <button type="button" class="drawer-link" data-drawer-nav="#/catalogo/${cat.id}">
        <span class="drawer-link-left">
          <span class="drawer-link-dot" aria-hidden="true"></span>
          <span>${cat.name}</span>
        </span>
        ${PC.icons.chevronRight()}
      </button>`
    ).join('');

    root.innerHTML = `
      <div class="drawer-backdrop ${isOpen ? 'is-open' : ''}" data-action="close-drawer"></div>
      <aside class="side-drawer ${isOpen ? 'is-open' : ''}" aria-hidden="${!isOpen}" aria-label="Menú rápido">
        <div class="drawer-header">
          <div class="drawer-brand">
            ${PC.renderImage({ src: PC.media.BRAND_LOGO, alt: 'Planet Chicken', preset: 'logo' })}
            <div>
              <strong>PLANET CHICKEN</strong>
              <span>Wings &amp; Chicken</span>
            </div>
          </div>
          <button type="button" class="icon-circle-btn" data-action="close-drawer" aria-label="Cerrar menú">
            ${PC.icons.close()}
          </button>
        </div>

        <div class="drawer-section-label">Categorías del menú</div>
        <div class="drawer-links">${categoryLinks}</div>

        <div class="drawer-section-label">Navegación</div>
        <div class="drawer-links">
          <button type="button" class="drawer-link" data-drawer-nav="#/inicio">
            <span class="drawer-link-left">${PC.icons.navHome()}<span>Menú Principal</span></span>
            ${PC.icons.chevronRight()}
          </button>
          <button type="button" class="drawer-link" data-drawer-nav="#/promociones">
            <span class="drawer-link-left">${PC.icons.navPromos()}<span>Promociones</span></span>
            ${PC.icons.chevronRight()}
          </button>
          <button type="button" class="drawer-link" data-drawer-nav="#/perfil">
            <span class="drawer-link-left">${PC.icons.navProfile()}<span>Mi Perfil &amp; Negocio</span></span>
            ${PC.icons.chevronRight()}
          </button>
        </div>

        <div class="drawer-footer">
          <button type="button" class="btn-outline-red" data-drawer-nav="#/bienvenida">
            Pantalla de Bienvenida
          </button>
          <button type="button" class="btn-ghost-reset" data-drawer-nav="#/splash">
            Reproducir Splash Espacial
          </button>
        </div>
      </aside>
    `;
  }

  function open() {
    isOpen = true;
    render();
  }

  function close() {
    isOpen = false;
    render();
  }

  PC.components = PC.components || {};
  PC.components.sideDrawer = { render, open, close };
})(window);
