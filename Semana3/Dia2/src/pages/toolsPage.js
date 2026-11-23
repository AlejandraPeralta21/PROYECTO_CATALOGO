/* Herramientas de la guía PWA: filtro de tres capas y formulario */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  function render(root, route) {
    const activeTab = ['contacto', 'auditoria'].includes(route.tab) ? route.tab : 'filtros';
    const categoryOptions = PC.data.CATEGORIES
      .map((category) => `<option value="${category.id}">${category.name}</option>`)
      .join('');

    root.innerHTML = `
      <section class="page-view tools-page ${activeTab === 'contacto' ? 'tools-page--contact' : ''} ${activeTab === 'auditoria' ? 'tools-page--audit' : ''}" aria-label="${activeTab === 'contacto' ? 'Contacto Planet Chicken' : activeTab === 'auditoria' ? 'Accesibilidad y pruebas' : 'Herramientas Planet Chicken'}">
        <div class="tools-content">
          <header class="tools-heading ${activeTab === 'contacto' ? 'contact-page-heading' : ''}">
            <h1>${activeTab === 'contacto' ? 'Contacto' : 'Herramientas'}</h1>
            <p>${activeTab === 'contacto' ? 'Escríbenos y te ayudaremos con tu pedido.' : 'Explora el menú o escríbenos.'}</p>
          </header>
          <nav class="tools-tabs" role="tablist" aria-label="Herramientas disponibles" ${activeTab === 'contacto' ? 'hidden' : ''}>
            <button type="button" role="tab" class="tools-tab ${activeTab === 'filtros' ? 'is-active' : ''}" id="tools-tab-filtros" aria-controls="filtros" data-tools-tab="filtros" aria-selected="${activeTab === 'filtros'}">Filtro de 3 capas</button>
            <button type="button" role="tab" class="tools-tab ${activeTab === 'auditoria' ? 'is-active' : ''}" id="tools-tab-auditoria" aria-controls="auditoria" data-tools-tab="auditoria" aria-selected="${activeTab === 'auditoria'}">Accesibilidad</button>
            <button type="button" role="tab" class="tools-tab ${activeTab === 'contacto' ? 'is-active' : ''}" id="tools-tab-contacto" aria-controls="contacto" data-tools-tab="contacto" aria-selected="${activeTab === 'contacto'}">Contacto</button>
          </nav>
          <section class="home-tool-card tools-panel" role="tabpanel" id="filtros" aria-labelledby="tools-tab-filtros" ${activeTab === 'filtros' ? '' : 'hidden'}>
            <h2 id="filter-section-title">Filtro dinámico de 3 capas</h2>
            <p>Selecciona categoría, subcategoría y producto.</p>
            <label for="capa1">1. Categoría</label>
            <select id="capa1"><option value="">-- Elige una categoría --</option>${categoryOptions}</select>
            <label for="capa2">2. Subcategoría</label>
            <select id="capa2" disabled><option value="">-- Primero elige una categoría --</option></select>
            <div id="resultadoFiltro" class="filter-result-panel" aria-live="polite">3. Elige una subcategoría para ver los productos.</div>
          </section>
          <section class="home-tool-card tools-panel" role="tabpanel" id="auditoria" aria-labelledby="tools-tab-auditoria" ${activeTab === 'auditoria' ? '' : 'hidden'}>
            <h2 id="audit-section-title">Calidad y accesibilidad</h2>
            <p>Revisa la vista actual y prueba los controles accesibles.</p>
            <div class="quality-actions">
              <button type="button" class="btn-primary-red" id="btnSmokeTest">Ejecutar Smoke Test DOM</button>
              <button type="button" class="btn-outline-red" id="btnContrast" aria-pressed="false">Simular alto contraste</button>
              <button type="button" class="btn-outline-red" data-nav="#/catalogo/pollos">Probar vista adaptable del menú</button>
            </div>
            <p id="salidaSmokeTest" class="quality-report" role="status" aria-live="polite">Estado: listo para revisar esta pantalla.</p>
            <section class="live-demo-card" aria-labelledby="live-demo-title">
              <h3 id="live-demo-title">Componente de demostración</h3>
              <p id="live-demo-state">Versión inicial · disponible</p>
              <button type="button" class="btn-outline-red" id="btnLiveUpdate">Simular actualización en vivo</button>
            </section>
          </section>
          <section class="home-tool-card tools-panel" role="tabpanel" id="contacto" aria-labelledby="tools-tab-contacto" ${activeTab === 'contacto' ? '' : 'hidden'}>
            <div class="contact-layout">
              <aside class="contact-intro-card">
                <span class="contact-intro-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="m3 7 9 7 9-7"/></svg></span>
                <span class="contact-intro-kicker">ESTAMOS PARA AYUDARTE</span>
                <h2 id="contact-section-title">Hablemos de algo rico.</h2>
                <p>Déjanos tu mensaje y cuéntanos cómo podemos ayudarte.</p>
                <ul class="contact-topic-list">
                  <li><span aria-hidden="true">✓</span> Consultas sobre el menú</li>
                  <li><span aria-hidden="true">✓</span> Dudas sobre tu pedido</li>
                  <li><span aria-hidden="true">✓</span> Sugerencias y comentarios</li>
                </ul>
                <span class="contact-intro-stamp" aria-hidden="true">Planet Chicken<br /><b>Wings &amp; Chicken</b></span>
              </aside>
              <form id="pwaForm" class="contact-form" novalidate>
                <div class="contact-form-heading"><span>FORMULARIO</span><h3>Envíanos un mensaje</h3><p>Completa tus datos y nos pondremos en contacto.</p></div>
                <div class="contact-field"><label for="nombre">Tu nombre</label><input id="nombre" name="nombre" type="text" autocomplete="name" maxlength="80" aria-describedby="errNombre" aria-invalid="false" placeholder="¿Cómo te llamas?" /><small class="form-inline-error" id="errNombre" role="alert">Escribe tu nombre.</small></div>
                <div class="contact-field"><label for="correo">Correo electrónico</label><input id="correo" name="correo" type="email" autocomplete="email" maxlength="120" aria-describedby="errCorreo" aria-invalid="false" placeholder="tu@correo.com" /><small class="form-inline-error" id="errCorreo" role="alert">Escribe un correo válido.</small></div>
                <div class="contact-field"><label for="mensaje">¿En qué podemos ayudarte?</label><textarea id="mensaje" name="mensaje" rows="4" maxlength="500" aria-describedby="errMensaje" aria-invalid="false" placeholder="Escribe aquí tu consulta o sugerencia..."></textarea><small class="form-inline-error" id="errMensaje" role="alert">Escribe tu consulta.</small></div>
                <button class="btn-primary-red contact-submit" type="submit">Enviar mensaje <span aria-hidden="true">→</span></button>
                <p id="successAlert" class="contact-success" role="status">Gracias por escribir a Planet Chicken.</p>
              </form>
            </div>
          </section>
        </div>
      </section>
    `;

    PC.pages.inicio.bindTools();
    bindAudit(root);
  }

  function bindAudit(root) {
    const tabList = root.querySelector('.tools-tabs');
    if (tabList) tabList.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const tabs = [...tabList.querySelectorAll('[role="tab"]')].filter((tab) => !tab.hidden);
      const currentIndex = tabs.indexOf(document.activeElement);
      if (currentIndex < 0) return;
      event.preventDefault();
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      setTab(tabs[nextIndex].getAttribute('data-tools-tab'), root, {});
    });
    const smokeButton = root.querySelector('#btnSmokeTest');
    const report = root.querySelector('#salidaSmokeTest');
    if (smokeButton && report) {
      smokeButton.addEventListener('click', () => {
        const app = document.getElementById('app');
        const issues = [];
        const imagesWithoutAlt = app.querySelectorAll('img:not([alt])').length;
        const emptyLinks = app.querySelectorAll('a[href=""], a:not([href])').length;
        const unnamedButtons = [...app.querySelectorAll('button')].filter((button) => !button.textContent.trim() && !button.getAttribute('aria-label')).length;
        const namedLandmarks = [...app.querySelectorAll('main, nav')].filter((landmark) => landmark.tagName === 'MAIN' || landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby')).length;
        const unlabeledControls = [...app.querySelectorAll('input, select, textarea')].filter((control) => {
          if (control.type === 'hidden') return false;
          return !control.labels?.length && !control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby');
        }).length;
        const semanticNodes = app.querySelectorAll('header, nav, main, article, footer').length;
        if (imagesWithoutAlt) issues.push(`${imagesWithoutAlt} imagen(es) sin atributo alt`);
        if (emptyLinks) issues.push(`${emptyLinks} enlace(s) sin destino`);
        if (unnamedButtons) issues.push(`${unnamedButtons} botón(es) sin nombre accesible`);
        if (unlabeledControls) issues.push(`${unlabeledControls} campo(s) sin etiqueta accesible`);
        if (!namedLandmarks) issues.push('No se encontraron puntos de navegación accesibles');
        const buttons = app.querySelectorAll('button').length;
        report.textContent = issues.length
          ? `Smoke Test: revisar · ${issues.join(' · ')}`
          : `Smoke Test OK · ${buttons} botones · ${semanticNodes} regiones semánticas · imágenes con alt y etiquetas accesibles.`;
        report.classList.toggle('has-issues', issues.length > 0);
      });
    }

    const contrast = root.querySelector('#btnContrast');
    if (contrast) contrast.addEventListener('click', () => {
      const enabled = document.body.classList.toggle('high-contrast');
      contrast.setAttribute('aria-pressed', String(enabled));
      contrast.textContent = enabled ? 'Restaurar contraste normal' : 'Simular alto contraste';
    });

    const liveUpdate = root.querySelector('#btnLiveUpdate');
    if (liveUpdate) liveUpdate.addEventListener('click', () => {
      const state = root.querySelector('#live-demo-state');
      const nextVersion = Number(state.dataset.version || 1) + 1;
      state.dataset.version = String(nextVersion);
      state.textContent = `Actualizado en vivo · versión ${nextVersion}`;
      state.classList.toggle('is-updated');
    });
  }

  function setTab(tab, root, route) {
    const nextTab = ['contacto', 'auditoria'].includes(tab) ? tab : 'filtros';
    root.querySelectorAll('.tools-panel').forEach((panel) => { panel.hidden = panel.id !== nextTab; });
    const tabList = root.querySelector('.tools-tabs');
    if (tabList) tabList.hidden = nextTab === 'contacto';
    root.querySelectorAll('[data-tools-tab]').forEach((button) => {
      const isActive = button.getAttribute('data-tools-tab') === nextTab;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });
    const page = root.querySelector('.tools-page');
    if (page) {
      page.classList.toggle('tools-page--contact', nextTab === 'contacto');
      page.classList.toggle('tools-page--audit', nextTab === 'auditoria');
      page.setAttribute('aria-label', nextTab === 'contacto' ? 'Contacto Planet Chicken' : nextTab === 'auditoria' ? 'Accesibilidad y pruebas' : 'Herramientas Planet Chicken');
    }
  }

  PC.pages = PC.pages || {};
  PC.pages.herramientas = { render, setTab };
})(window);
