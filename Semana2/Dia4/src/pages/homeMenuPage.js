/* ==========================================================================
   PÁGINA 3: MENÚ PRINCIPAL (CATEGORÍAS RESPONSIVAS Y DESPLAZABLES)
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  function render(root) {
    const filterCategoryOptions = PC.data.CATEGORIES
      .map((cat) => `<option value="${cat.id}">${cat.name}</option>`)
      .join('');

    const cardsHtml = PC.data.CATEGORIES.map((cat) => {
      const variantClass =
        cat.variant === 'hero'
          ? 'cat-splash-card--hero'
          : cat.variant === 'gold'
          ? 'cat-splash-card--gold'
          : '';
      const iconFn = PC.icons[cat.icon] || PC.icons.foodBurger;

      return `
        <button
          type="button"
          class="cat-splash-card ${variantClass}"
          data-category-nav="${cat.id}"
          aria-label="Explorar ${cat.name}"
        >
          <span class="cat-blob-bg" aria-hidden="true"></span>
          <span class="cat-drumstick s1" aria-hidden="true">${PC.icons.chickenLeg()}</span>
          <span class="cat-drumstick s2" aria-hidden="true">${PC.icons.chickenLeg()}</span>
          <span class="cat-drumstick s3" aria-hidden="true">${PC.icons.chickenLeg()}</span>

          <span class="cat-icon-badge" aria-hidden="true">${iconFn()}</span>

          <div class="cat-photo-wrap">
            ${PC.renderImage({ src: cat.image, alt: cat.name, preset: 'category', className: 'cat-photo' })}
          </div>

          <span class="cat-label-pill">
            <span>${cat.name}</span>
            ${PC.icons.chevronRight()}
          </span>
        </button>
      `;
    }).join('');

    root.innerHTML = `
      <section class="page-view" aria-label="Menú Principal de Categorías">
        <div class="page-container home-menu-container">
          <div class="home-categories-grid">
            ${cardsHtml}
          </div>

          <div class="home-planet-wave" aria-hidden="true">
            ${PC.icons.planetMini()}
            <span>Elige una categoría para descubrir el menú</span>
          </div>

          <section class="home-tool-card filter-section" id="filtros" aria-labelledby="filter-section-title">
            <h2 id="filter-section-title">Filtro dinámico de 3 capas</h2>
            <p>Elige una categoría, luego una subcategoría y descubre sus productos.</p>
            <label for="capa1">1. Categoría</label>
            <select id="capa1">
              <option value="">-- Elige una categoría --</option>
              ${filterCategoryOptions}
            </select>
            <label for="capa2">2. Subcategoría</label>
            <select id="capa2" disabled>
              <option value="">-- Primero elige una categoría --</option>
            </select>
            <div id="resultadoFiltro" class="filter-result-panel" aria-live="polite">
              3. Los productos aparecerán aquí después de elegir una subcategoría.
            </div>
          </section>

          <section class="home-tool-card contact-section" id="contacto" aria-labelledby="contact-section-title">
            <h2 id="contact-section-title">Contáctanos</h2>
            <p>Déjanos tu consulta. El formulario valida los datos en esta demostración.</p>
            <form id="pwaForm" novalidate>
              <label for="nombre">Nombre</label>
              <input id="nombre" name="nombre" type="text" autocomplete="name" maxlength="80" />
              <small class="form-inline-error" id="errNombre" role="alert">Escribe tu nombre.</small>

              <label for="correo">Correo electrónico</label>
              <input id="correo" name="correo" type="email" autocomplete="email" maxlength="120" />
              <small class="form-inline-error" id="errCorreo" role="alert">Escribe un correo válido.</small>

              <label for="mensaje">Mensaje</label>
              <textarea id="mensaje" name="mensaje" rows="3" maxlength="500" placeholder="¿En qué podemos ayudarte?"></textarea>
              <small class="form-inline-error" id="errMensaje" role="alert">Escribe tu consulta.</small>

              <button class="btn-primary-red contact-submit" type="submit">Validar consulta</button>
              <p id="successAlert" class="contact-success" role="status">Datos validados. Gracias por escribir a Planet Chicken.</p>
            </form>
          </section>
        </div>
      </section>
    `;

    bindHomeTools();
  }

  function bindHomeTools() {
    const $category = $('#capa1');
    const $subcategory = $('#capa2');
    const $results = $('#resultadoFiltro');

    $category.off('change.pwaFilter').on('change.pwaFilter', function () {
      const category = PC.data.getCategory($(this).val());
      $subcategory.html('<option value="">-- Elige una subcategoría --</option>');
      if (!$(this).val()) {
        $subcategory.prop('disabled', true);
        $results.text('3. Los productos aparecerán aquí después de elegir una subcategoría.');
        return;
      }
      category.subcategories.forEach((item) => {
        $subcategory.append(`<option value="${item.id}">${item.name}</option>`);
      });
      $subcategory.prop('disabled', false);
      $results.text('3. Ahora elige una subcategoría para ver sus productos.');
    });

    $subcategory.off('change.pwaFilter').on('change.pwaFilter', function () {
      const categoryId = $category.val();
      const subcategoryId = $(this).val();
      if (!categoryId || !subcategoryId) {
        $results.text('3. Elige una subcategoría para ver sus productos.');
        return;
      }

      const products = PC.data.PRODUCTS.filter((product) =>
        product.category === categoryId && (subcategoryId === 'todas' || product.subcategory === subcategoryId)
      );
      if (!products.length) {
        $results.text('No hay productos en esta subcategoría por el momento.');
        return;
      }

      $results.html(`
        <strong class="filter-result-heading">3. Productos disponibles (${products.length})</strong>
        <div class="filter-result-grid">
          ${products.map((product) => `
            <button type="button" class="filter-result-item" data-open-product="${product.id}">
              ${PC.renderImage({ src: product.image, alt: product.name, preset: 'card', className: 'filter-result-img' })}
              <span>${product.name}</span>
              <strong>${PC.data.formatBs(product.price)}</strong>
            </button>
          `).join('')}
        </div>
      `);
    });

    const $form = $('#pwaForm');
    const contactRules = {
      nombre: { error: '#errNombre', valid: (value) => value.trim().length > 0 },
      correo: { error: '#errCorreo', valid: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) },
      mensaje: { error: '#errMensaje', valid: (value) => value.trim().length > 0 },
    };

    $form.off('.pwaContact');
    $form.on('input.pwaContact blur.pwaContact', '#nombre, #correo, #mensaje', function (event) {
      const field = contactRules[this.id];
      if (!field) return;
      const $input = $(this);
      if (event.type === 'blur') $input.data('pwaTouched', true);
      if (!$input.data('pwaTouched')) return;
      $(field.error).stop(true, true)[field.valid($input.val()) ? 'fadeOut' : 'fadeIn'](180);
    });

    $form.on('submit.pwaContact', function (event) {
      event.preventDefault();
      Object.keys(contactRules).forEach((fieldId) => $(`#${fieldId}`).data('pwaTouched', true));
      const nameOk = contactRules.nombre.valid($('#nombre').val());
      const emailOk = contactRules.correo.valid($('#correo').val());
      const messageOk = contactRules.mensaje.valid($('#mensaje').val());

      $('#errNombre').stop(true, true)[nameOk ? 'fadeOut' : 'fadeIn'](180);
      $('#errCorreo').stop(true, true)[emailOk ? 'fadeOut' : 'fadeIn'](180);
      $('#errMensaje').stop(true, true)[messageOk ? 'fadeOut' : 'fadeIn'](180);
      if (!(nameOk && emailOk && messageOk)) return;

      const form = this;
      const payload = {
        nombre: $('#nombre').val().trim(),
        correo: $('#correo').val().trim(),
        mensaje: $('#mensaje').val().trim(),
      };
      const $submit = $(form).find('[type="submit"]').prop('disabled', true);
      PC.syncQueue.enqueue('contact', payload).then((result) => {
        $('#successAlert')
          .text(result.synced ? 'Consulta enviada. Gracias por escribir a Planet Chicken.' : 'Consulta guardada localmente. Pendiente de sincronización.')
          .stop(true, true).slideDown(250).delay(4000).slideUp(250);
        form.reset();
      }).catch(() => {
        PC.toast.show('No se pudo guardar la consulta en este dispositivo.');
      }).finally(() => $submit.prop('disabled', false));
    });
  }

  PC.pages = PC.pages || {};
  PC.pages.inicio = { render, bindTools: bindHomeTools };
})(window);
