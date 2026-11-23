/* ==========================================================================
   HEADER COMPONENT (LOGO, SLOGAN, BACK, FILTER, MENU BUTTON, THEME SWITCH)
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  function renderThemeSwitch() {
    const isDark = PC.theme.get() === 'dark';
    return `
      <button
        type="button"
        class="theme-switch"
        data-action="toggle-theme"
        role="switch"
        aria-checked="${isDark}"
        aria-label="${isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}"
        title="${isDark ? 'Modo oscuro activo' : 'Modo claro activo'}"
      >
        <span class="theme-switch-thumb" aria-hidden="true"></span>
        <span class="theme-switch-icon sun">${PC.icons.sun()}</span>
        <span class="theme-switch-icon moon">${PC.icons.moon()}</span>
      </button>
    `;
  }

  function render(route) {
    const root = document.getElementById('app-header');
    if (!root) return;

    const hiddenOn = ['splash', 'bienvenida', 'producto'];
    if (hiddenOn.includes(route.page)) {
      root.innerHTML = '';
      root.className = 'site-header is-hidden';
      return;
    }

    root.className = 'site-header';
    let leftHtml = '';
    let extraActionHtml = '';

    if (route.page === 'inicio') {
      leftHtml = `
        <button type="button" class="header-brand-btn" data-action="go-welcome" aria-label="Ver bienvenida Planet Chicken">
          ${PC.renderImage({ src: PC.media.BRAND_LOGO, alt: 'Logo Planet Chicken', preset: 'logo', className: 'header-logo' })}
          <span class="header-brand-copy">
            <span class="header-slogan">El mejor sabor<br/>en cada bocado</span>
            <span class="header-sub-slogan">Wings &amp; Chicken</span>
          </span>
        </button>
      `;
    } else if (route.page === 'admin') {
      leftHtml = `
        <div class="header-brand-btn admin-header-brand">
          ${PC.renderImage({ src: PC.media.BRAND_LOGO, alt: 'Logo Planet Chicken', preset: 'logo', className: 'header-logo' })}
          <span class="header-brand-copy">
            <h1 class="header-page-title">Panel administrador</h1>
            <span class="header-sub-slogan">Gestión del negocio</span>
          </span>
        </div>
      `;
    } else if (route.page === 'catalogo') {
      const cat = PC.data.getCategory(route.category);
      const activeFiltersCount = PC.state ? PC.state.getActiveFilterCount() : 0;
      leftHtml = `
        <button type="button" class="icon-circle-btn" data-action="go-back" aria-label="Regresar">
          ${PC.icons.arrowLeft()}
        </button>
        <h1 class="header-page-title">${cat.name}</h1>
      `;
      extraActionHtml = `
        <button type="button" class="icon-circle-btn" data-action="open-filters" aria-label="Abrir filtros">
          ${PC.icons.sliders()}
          ${activeFiltersCount > 0 ? `<span class="badge-dot">${activeFiltersCount}</span>` : ''}
        </button>
      `;
    } else if (route.page === 'promociones') {
      leftHtml = `
        <button type="button" class="header-brand-btn" data-action="go-home" aria-label="Ir al inicio">
          ${PC.renderImage({ src: PC.media.BRAND_LOGO, alt: 'Logo Planet Chicken', preset: 'logo', className: 'header-logo' })}
          <span class="header-brand-copy">
            <h1 class="header-page-title">Promociones</h1>
            <span class="header-sub-slogan">Ofertas de otro planeta</span>
          </span>
        </button>
      `;
    } else if (route.page === 'delivery') {
      leftHtml = `
        <button type="button" class="header-brand-btn" data-action="go-home" aria-label="Planet Chicken Delivery, volver al menú">
          ${PC.renderImage({ src: PC.media.BRAND_LOGO, alt: 'Logo Planet Chicken', preset: 'logo', className: 'header-logo' })}
          <span class="header-brand-copy">
            <h1 class="header-page-title">Delivery</h1>
            <span class="header-sub-slogan">Planet Chicken · Pide y disfruta en casa</span>
          </span>
        </button>
      `;
    } else if (route.page === 'perfil') {
      leftHtml = `
        <button type="button" class="header-brand-btn" data-action="go-home" aria-label="Ir al inicio">
          ${PC.renderImage({ src: PC.media.BRAND_LOGO, alt: 'Logo Planet Chicken', preset: 'logo', className: 'header-logo' })}
          <span class="header-brand-copy">
            <h1 class="header-page-title">Mi Perfil</h1>
            <span class="header-sub-slogan">Planet Chicken · Wings &amp; Chicken</span>
          </span>
        </button>
      `;
    } else if (route.page === 'herramientas') {
      leftHtml = `
        <button type="button" class="header-brand-btn" data-action="go-home" aria-label="Volver al menú principal">
          ${PC.renderImage({ src: PC.media.BRAND_LOGO, alt: 'Logo Planet Chicken', preset: 'logo', className: 'header-logo' })}
          <span class="header-brand-copy">
            <h1 class="header-page-title">${route.tab === 'contacto' ? 'Contacto' : 'Herramientas'}</h1>
            <span class="header-sub-slogan">${route.tab === 'contacto' ? 'Estamos para ayudarte' : 'Filtro y contacto'}</span>
          </span>
        </button>
      `;
    } else if (route.page === 'carrito') {
      leftHtml = `
        <button type="button" class="icon-circle-btn" data-action="go-back" aria-label="Regresar">
          ${PC.icons.arrowLeft()}
        </button>
        <h1 class="header-page-title">Mi carrito</h1>
      `;
    } else if (route.page === 'reserva') {
      leftHtml = `
        <button type="button" class="header-brand-btn" data-action="go-home" aria-label="Volver al menú principal">
          ${PC.renderImage({ src: PC.media.BRAND_LOGO, alt: 'Logo Planet Chicken', preset: 'logo', className: 'header-logo' })}
          <span class="header-brand-copy">
            <h1 class="header-page-title">Reservar combo</h1>
            <span class="header-sub-slogan">Planet Chicken · Wings &amp; Chicken</span>
          </span>
        </button>
      `;
    }

    const cartCount = PC.state ? PC.state.getCartCount() : 0;
    const cartActionHtml = ['carrito', 'admin'].includes(route.page) ? '' : `
      <button type="button" class="icon-circle-btn cart-header-btn" data-action="open-cart" aria-label="Abrir carrito, ${cartCount} productos">
        ${PC.icons.cart()}
        ${cartCount ? `<span class="badge-dot cart-count-badge">${cartCount > 9 ? '9+' : cartCount}</span>` : ''}
      </button>
    `;

    root.innerHTML = `
      <header class="header-inner">
        <div class="header-left">${leftHtml}</div>
        <div class="header-actions">
          ${extraActionHtml}
          <button type="button" class="pwa-install-btn" id="installAppBtn" data-action="install-app" hidden aria-label="Instalar Planet Chicken">
            <span aria-hidden="true">↓</span><span>Instalar</span>
          </button>
          <span id="estadoRed" class="network-indicator is-online" role="status" aria-live="polite" aria-label="En línea" title="En línea">
            <span class="network-indicator-dot" aria-hidden="true"></span>
            <span class="network-indicator-label">En línea</span>
          </span>
          ${cartActionHtml}
          ${renderThemeSwitch()}
          <button type="button" class="icon-circle-btn" id="hamburgerBtn" aria-label="Abrir menú de navegación" aria-controls="navMenu" aria-expanded="false">
            ${PC.icons.menuBurger()}
          </button>
        </div>
      </header>
    `;
    if (PC.pwa) PC.pwa.syncInstallButton();
    if (PC.pwa) PC.pwa.updateNetworkStatus();
  }

  PC.components = PC.components || {};
  PC.components.header = { render };
})(window);
