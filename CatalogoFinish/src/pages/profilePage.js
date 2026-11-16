/* ==========================================================================
   PÁGINA 7: PERFIL (USUARIO, PREFERENCIAS, TEMA E INFORMACIÓN DEL NEGOCIO)
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});
  let activeTab = 'cuenta'; // 'cuenta' | 'selecciones' | 'negocio'

  function renderAccountTab() {
    const theme = PC.theme.get();
    const prefs = PC.state.preferences;

    return `
      <div class="profile-panel">
        <div class="settings-card">
          <label class="settings-row-label" for="profile-username-input">
            <strong>Nombre de usuario</strong>
            <span>Personaliza tu experiencia en Planet Chicken</span>
          </label>
          <input
            type="text"
            id="profile-username-input"
            class="profile-name-input"
            value="${PC.escapeHTML(PC.state.userName)}"
            maxlength="36"
            placeholder="Tu nombre"
          />
        </div>

        <div class="settings-card">
          <div class="settings-row-label">
            <strong>Apariencia (Modo Claro / Oscuro)</strong>
            <span>Se guarda automáticamente en este dispositivo</span>
          </div>
          <div class="theme-cards-grid">
            <button type="button" class="theme-choice-card ${theme === 'light' ? 'is-active' : ''}" data-set-theme="light">
              ${PC.icons.sun()}
              <span>Modo Claro</span>
            </button>
            <button type="button" class="theme-choice-card ${theme === 'dark' ? 'is-active' : ''}" data-set-theme="dark">
              ${PC.icons.moon()}
              <span>Modo Oscuro</span>
            </button>
          </div>
        </div>

        <div class="settings-card">
          <div class="settings-row">
            <div class="settings-row-label">
              <strong>Alertas de promociones</strong>
              <span>Destacar combos y descuentos</span>
            </div>
            <button
              type="button"
              class="toggle-pill ${prefs.promoAlerts ? 'is-on' : ''}"
              data-toggle-pref="promoAlerts"
              role="switch"
              aria-checked="${prefs.promoAlerts}"
              aria-label="Alternar alertas de promociones"
            ></button>
          </div>
          <div class="settings-row">
            <div class="settings-row-label">
              <strong>Animaciones espaciales</strong>
              <span>Efectos visuales al navegar</span>
            </div>
            <button
              type="button"
              class="toggle-pill ${prefs.spaceAnimations ? 'is-on' : ''}"
              data-toggle-pref="spaceAnimations"
              role="switch"
              aria-checked="${prefs.spaceAnimations}"
              aria-label="Alternar animaciones espaciales"
            ></button>
          </div>
        </div>
      </div>
    `;
  }

  function renderSelectionsTab() {
    const selections = PC.state.selections.slice(0, 4);
    const favProducts = PC.state.favorites
      .map((id) => PC.data.getProduct(id))
      .filter(Boolean)
      .slice(0, 4);

    return `
      <div class="profile-panel">
        <div class="settings-card">
          <div class="settings-row">
            <div class="settings-row-label">
              <strong>Productos seleccionados (${PC.state.selections.length})</strong>
              <span>Historial de tus últimas selecciones</span>
            </div>
            ${
              PC.state.selections.length > 0
                ? `<button type="button" class="btn-outline-red" data-action="clear-selections">Limpiar</button>`
                : ''
            }
          </div>
          <div class="saved-list-grid">
            ${
              selections.length > 0
                ? selections
                    .map(
                      (s) => `
                  <div class="saved-mini-item" data-open-product="${PC.escapeHTML(s.id)}" role="button" tabindex="0">
                    <div class="saved-mini-left">
                      ${PC.renderImage({ src: s.image, alt: s.name, preset: 'thumb' })}
                      <div>
                        <strong>${PC.escapeHTML(s.quantity)}× ${PC.escapeHTML(s.name)}</strong>
                        <span>${PC.escapeHTML(s.size)} · ${PC.escapeHTML(s.selectedAt)}</span>
                      </div>
                    </div>
                    <strong style="color:var(--pc-red); font-size:0.84rem;">${PC.data.formatBs(s.totalPrice)}</strong>
                  </div>`
                    )
                    .join('')
                : `<p style="font-size:0.8rem; color:var(--text-secondary);">Aún no seleccionaste productos. Explora el menú y pulsa "Seleccionar producto".</p>`
            }
          </div>
        </div>

        <div class="settings-card">
          <div class="settings-row-label">
            <strong>Favoritos (${PC.state.favorites.length})</strong>
            <span>Tus platos guardados</span>
          </div>
          <div class="saved-list-grid">
            ${
              favProducts.length > 0
                ? favProducts
                    .map(
                      (p) => `
                  <div class="saved-mini-item" data-open-product="${PC.escapeHTML(p.id)}" role="button" tabindex="0">
                    <div class="saved-mini-left">
                      ${PC.renderImage({ src: p.image, alt: p.name, preset: 'thumb' })}
                      <div>
                        <strong>${PC.escapeHTML(p.name)}</strong>
                        <span>${PC.escapeHTML(PC.data.getCategory(p.category).name)}</span>
                      </div>
                    </div>
                    <strong style="color:var(--pc-red); font-size:0.84rem;">${PC.data.formatBs(p.price)}</strong>
                  </div>`
                    )
                    .join('')
                : `<p style="font-size:0.8rem; color:var(--text-secondary);">Toca el corazón en cualquier producto para guardarlo aquí.</p>`
            }
          </div>
        </div>
      </div>
    `;
  }

  function renderBusinessTab() {
    const info = PC.data.BUSINESS_INFO;
    return `
      <div class="profile-panel">
        <div class="settings-card">
          <div class="settings-row-label">
            <strong>${info.name} – ${info.slogan}</strong>
            <span>${info.tagline}</span>
          </div>
          <div class="business-info-grid">
            <div style="display:flex; align-items:center; gap:8px; font-size:0.8rem; color:var(--text-secondary);">
              ${PC.icons.clock()}
              <span>${info.hours}</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px; font-size:0.8rem; color:var(--text-secondary);">
              ${PC.icons.planetMini()}
              <span>Pedidos y consultas: ${info.phone}</span>
            </div>
          </div>
        </div>

        <div class="settings-card">
          <div class="settings-row-label">
            <strong>Sucursales</strong>
            <span>Atención en salón y para llevar</span>
          </div>
          ${info.branches
            .map(
              (b) => `
            <div style="display:flex; align-items:center; gap:8px; font-size:0.78rem; color:var(--text-primary); font-weight:600;">
              <span style="color:var(--pc-red);">${PC.icons.mapPin()}</span>
              <span>${b}</span>
            </div>`
            )
            .join('')}
        </div>

        <div class="quick-action-row">
          <button type="button" class="btn-outline-red" data-nav="#/bienvenida">Ver Bienvenida</button>
          <button type="button" class="btn-outline-red" data-nav="#/splash">Ver Intro Espacial</button>
        </div>
      </div>
    `;
  }

  function render(root) {
    const bodyHtml =
      activeTab === 'selecciones'
        ? renderSelectionsTab()
        : activeTab === 'negocio'
        ? renderBusinessTab()
        : renderAccountTab();

    root.innerHTML = `
      <section class="page-view" aria-label="Perfil y configuración">
        <div class="page-container profile-container">
          <div class="profile-user-card">
            <div class="profile-user-left">
              <div class="profile-avatar">${PC.icons.navProfile()}</div>
              <div class="profile-user-meta">
                <h2 class="profile-user-name"></h2>
                <p>Explorador Planet Chicken · ${PC.state.favorites.length} favoritos</p>
              </div>
            </div>
            ${PC.renderImage({ src: PC.media.BRAND_LOGO, alt: '', preset: 'logo', className: 'profile-brand-logo' })}
          </div>

          <div class="profile-tabs" role="tablist" aria-label="Secciones de perfil">
            <button type="button" role="tab" aria-selected="${activeTab === 'cuenta'}" class="profile-tab-btn ${activeTab === 'cuenta' ? 'is-active' : ''}" data-profile-tab="cuenta">
              Preferencias
            </button>
            <button type="button" role="tab" aria-selected="${activeTab === 'selecciones'}" class="profile-tab-btn ${activeTab === 'selecciones' ? 'is-active' : ''}" data-profile-tab="selecciones">
              Selecciones
            </button>
            <button type="button" role="tab" aria-selected="${activeTab === 'negocio'}" class="profile-tab-btn ${activeTab === 'negocio' ? 'is-active' : ''}" data-profile-tab="negocio">
              Negocio
            </button>
          </div>

          ${bodyHtml}
        </div>
      </section>
    `;

    const nameHeading = root.querySelector('.profile-user-name');
    if (nameHeading) nameHeading.textContent = PC.state.userName;

    const nameInput = document.getElementById('profile-username-input');
    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        PC.state.setUserName(e.target.value || 'Explorador Planet');
        const heading = root.querySelector('.profile-user-name');
        if (heading) heading.textContent = PC.state.userName;
      });
    }
  }

  function setTab(tab, root) {
    activeTab = tab;
    render(root);
  }

  PC.pages = PC.pages || {};
  PC.pages.perfil = { render, setTab };
})(window);
