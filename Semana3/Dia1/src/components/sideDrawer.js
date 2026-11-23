/* ==========================================================================
   SIDE DRAWER MENU COMPONENT
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});
  let isOpen = false;

  function render() {
    const root = document.getElementById('app-drawer');
    if (!root) return;

    if (PC.auth && PC.auth.isAdmin()) {
      root.innerHTML = `
        <div class="drawer-backdrop ${isOpen ? 'is-open' : ''}" data-action="close-drawer"></div>
        <aside class="side-drawer ${isOpen ? 'is-open' : ''}" aria-hidden="${!isOpen}" ${isOpen ? '' : 'inert'} aria-label="Menú de administración">
          <div class="drawer-header">
            <div class="drawer-brand">
              ${PC.renderImage({ src: PC.media.BRAND_LOGO, alt: 'Planet Chicken', preset: 'logo' })}
              <div><strong>ADMINISTRACIÓN</strong><span>Panel de control</span></div>
            </div>
            <button type="button" class="icon-circle-btn" data-action="close-drawer" aria-label="Cerrar menú">${PC.icons.close()}</button>
          </div>
          <nav class="drawer-menu-content" id="navMenu" aria-label="Administración">
            <div class="drawer-section-label">Administración</div>
            <div class="drawer-links">
              <button type="button" class="drawer-link" data-drawer-nav="#/admin"><span class="drawer-link-left"><span class="drawer-link-dot" aria-hidden="true"></span><span>Panel de control</span></span>${PC.icons.chevronRight()}</button>
            </div>
          </nav>
          <div class="drawer-footer">
            <button type="button" class="btn-outline-red" data-action="admin-return-home">Volver a la página principal</button>
          </div>
        </aside>`;
      return;
    }

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
    const adminLink = PC.auth && PC.auth.isAdmin()
      ? '<button type="button" class="drawer-link" data-drawer-nav="#/admin"><span class="drawer-link-left"><span class="drawer-link-dot" aria-hidden="true"></span><span>Panel administrador</span></span></button>'
      : '';

    root.innerHTML = `
      <div class="drawer-backdrop ${isOpen ? 'is-open' : ''}" data-action="close-drawer"></div>
      <aside class="side-drawer ${isOpen ? 'is-open' : ''}" aria-hidden="${!isOpen}" ${isOpen ? '' : 'inert'} aria-label="Menú rápido">
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

        <nav class="drawer-menu-content" id="navMenu" aria-label="Navegación y categorías">
          <div class="drawer-section-label">Categorías del menú</div>
          <div class="drawer-links">${categoryLinks}</div>

          <div class="drawer-section-label">Navegación</div>
          <div class="drawer-links">
          ${adminLink}
          <button type="button" class="drawer-link" data-drawer-nav="#/inicio">
            <span class="drawer-link-left">${PC.icons.navHome()}<span>Menú Principal</span></span>
            ${PC.icons.chevronRight()}
          </button>
          <button type="button" class="drawer-link" data-drawer-nav="#/promociones">
            <span class="drawer-link-left">${PC.icons.navPromos()}<span>Promociones</span></span>
            ${PC.icons.chevronRight()}
          </button>
          <button type="button" class="drawer-link" data-drawer-nav="#/delivery">
            <span class="drawer-link-left">${PC.icons.foodDrink()}<span>Delivery</span></span>
            ${PC.icons.chevronRight()}
          </button>
          <button type="button" class="drawer-link" data-drawer-nav="#/reserva">
            <span class="drawer-link-left">${PC.icons.foodCombo()}<span>Reservar combo</span></span>
            ${PC.icons.chevronRight()}
          </button>
          <button type="button" class="drawer-link" data-drawer-nav="#/perfil">
            <span class="drawer-link-left">${PC.icons.navProfile()}<span>Mi Perfil &amp; Negocio</span></span>
            ${PC.icons.chevronRight()}
          </button>
          <button type="button" class="drawer-link" data-drawer-nav="#/herramientas/filtros">
            <span class="drawer-link-left">${PC.icons.sliders()}<span>Filtro de 3 capas</span></span>
            ${PC.icons.chevronRight()}
          </button>
          <button type="button" class="drawer-link" data-drawer-nav="#/herramientas/auditoria">
            <span class="drawer-link-left">${PC.icons.sliders()}<span>Accesibilidad y pruebas</span></span>
            ${PC.icons.chevronRight()}
          </button>
          <button type="button" class="drawer-link" data-drawer-nav="#/herramientas/contacto">
            <span class="drawer-link-left">${PC.icons.share()}<span>Formulario de contacto</span></span>
            ${PC.icons.chevronRight()}
          </button>
          </div>
        </nav>

        <div class="drawer-footer">
          ${PC.auth && PC.auth.isAdmin() ? '' : '<button type="button" class="btn-outline-red" data-drawer-nav="#/login">Acceso administrador</button>'}
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
    const menuButton = document.getElementById('hamburgerBtn');
    if (menuButton) {
      menuButton.classList.add('is-menu-open');
      menuButton.setAttribute('aria-expanded', 'true');
    }
    // Expand the drawer navigation with the jQuery slide effect from the guide.
    if (global.jQuery) $('#navMenu').stop(true, true).hide().slideToggle(300);
  }

  function close() {
    isOpen = false;
    render();
    const menuButton = document.getElementById('hamburgerBtn');
    if (menuButton) {
      menuButton.classList.remove('is-menu-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  }

  PC.components = PC.components || {};
  PC.components.sideDrawer = { render, open, close };
})(window);
