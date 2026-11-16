/* Herramientas de la guía PWA: filtro de tres capas y formulario */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  function render(root, route) {
    const activeTab = route.tab === 'contacto' ? 'contacto' : 'filtros';
    const categoryOptions = PC.data.CATEGORIES
      .map((category) => `<option value="${category.id}">${category.name}</option>`)
      .join('');

    root.innerHTML = `
      <section class="page-view tools-page" aria-label="Herramientas PWA">
        <div class="tools-content">
          <header class="tools-heading">
            <h1>Herramientas</h1>
            <p>Explora el menú o escríbenos.</p>
          </header>
          <nav class="tools-tabs" aria-label="Herramientas disponibles">
            <button type="button" class="tools-tab ${activeTab === 'filtros' ? 'is-active' : ''}" data-tools-tab="filtros" aria-pressed="${activeTab === 'filtros'}">Filtro de 3 capas</button>
            <button type="button" class="tools-tab ${activeTab === 'contacto' ? 'is-active' : ''}" data-tools-tab="contacto" aria-pressed="${activeTab === 'contacto'}">Contacto</button>
          </nav>
          <section class="home-tool-card tools-panel" id="filtros" aria-labelledby="filter-section-title" ${activeTab === 'filtros' ? '' : 'hidden'}>
            <h2 id="filter-section-title">Filtro dinámico de 3 capas</h2>
            <p>Selecciona categoría, subcategoría y producto.</p>
            <label for="capa1">1. Categoría</label>
            <select id="capa1"><option value="">-- Elige una categoría --</option>${categoryOptions}</select>
            <label for="capa2">2. Subcategoría</label>
            <select id="capa2" disabled><option value="">-- Primero elige una categoría --</option></select>
            <div id="resultadoFiltro" class="filter-result-panel" aria-live="polite">3. Elige una subcategoría para ver los productos.</div>
          </section>
          <section class="home-tool-card tools-panel" id="contacto" aria-labelledby="contact-section-title" ${activeTab === 'contacto' ? '' : 'hidden'}>
            <h2 id="contact-section-title">Contáctanos</h2>
            <p>Déjanos tu consulta y validaremos tus datos.</p>
            <form id="pwaForm" novalidate>
              <label for="nombre">Nombre</label>
              <input id="nombre" name="nombre" type="text" autocomplete="name" maxlength="80" />
              <small class="form-inline-error" id="errNombre" role="alert">Escribe tu nombre.</small>
              <label for="correo">Correo electrónico</label>
              <input id="correo" name="correo" type="email" autocomplete="email" maxlength="120" />
              <small class="form-inline-error" id="errCorreo" role="alert">Escribe un correo válido.</small>
              <label for="mensaje">Mensaje</label>
              <textarea id="mensaje" name="mensaje" rows="2" maxlength="500" placeholder="¿En qué podemos ayudarte?"></textarea>
              <small class="form-inline-error" id="errMensaje" role="alert">Escribe tu consulta.</small>
              <button class="btn-primary-red contact-submit" type="submit">Enviar consulta</button>
              <p id="successAlert" class="contact-success" role="status">Datos validados. Gracias por escribir a Planet Chicken.</p>
            </form>
          </section>
        </div>
      </section>
    `;

    PC.pages.inicio.bindTools();
  }

  function setTab(tab, root, route) {
    const nextTab = tab === 'contacto' ? 'contacto' : 'filtros';
    const $filter = $('#filtros');
    const $contact = $('#contacto');
    const $show = nextTab === 'contacto' ? $contact : $filter;
    const $hide = nextTab === 'contacto' ? $filter : $contact;
    $hide.stop(true, true).attr('hidden', true).hide();
    $show.removeAttr('hidden');
    $show.stop(true, true).fadeIn(180);
    root.querySelectorAll('[data-tools-tab]').forEach((button) => {
      const isActive = button.getAttribute('data-tools-tab') === nextTab;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  PC.pages = PC.pages || {};
  PC.pages.herramientas = { render, setTab };
})(window);
