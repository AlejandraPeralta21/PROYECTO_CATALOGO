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
          <header class="home-welcome">
            <div class="home-welcome-copy">
              <span class="home-welcome-eyebrow">WINGS &amp; CHICKEN · PLANET CHICKEN</span>
              <h1>Tu próximo antojo <span>empieza aquí.</span></h1>
              <p>Pollo crujiente, hamburguesas y sabores para compartir. Elige algo rico y disfruta.</p>
              <div class="home-welcome-actions">
                <button type="button" class="home-welcome-primary" data-category-nav="pollos">Explorar el menú <span aria-hidden="true">→</span></button>
                <button type="button" class="home-welcome-secondary" data-nav="#/promociones">Ver promociones</button>
              </div>
            </div>
            <div class="home-welcome-note" aria-hidden="true">
              <span class="home-welcome-note-icon">✦</span>
              <span><strong>Hecho para disfrutar</strong><small>Un buen sabor cambia el día</small></span>
            </div>
          </header>

          <div class="home-section-head">
            <div>
              <span class="home-section-kicker">EXPLORA POR CATEGORÍA</span>
              <h2 id="home-categories-title">Elige qué te antojas hoy</h2>
            </div>
            <span class="home-section-count">6 categorías</span>
          </div>

          <div class="home-categories-grid" aria-labelledby="home-categories-title">
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
    const offensiveNameWords = new Set([
      'puta', 'puto', 'putas', 'putos', 'mierda', 'pendejo', 'pendeja', 'pendejos', 'pendejas',
      'cabron', 'cabrona', 'cabrones', 'cabronas', 'cojudo', 'cojuda', 'cojones', 'culero', 'culera',
      'huevon', 'huevona', 'maricon', 'maricona', 'verga', 'vergas', 'gonorrea', 'joder', 'jodido',
      'jodida', 'chingar', 'chingada', 'chingado', 'hijueputa', 'malparido', 'malparida', 'hdp', 'csm',
    ]);
    function containsOffensiveNameWord(value) {
      const words = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(/[^a-z]+/);
      return words.some((word) => offensiveNameWords.has(word));
    }
    function getNameError(value) {
      const name = value.trim();
      if (!name) return 'Escribe tu nombre.';
      if (/\d/.test(name)) return 'El nombre no puede contener números.';
      if (containsOffensiveNameWord(name)) return 'Usa un nombre sin palabras ofensivas.';
      return '';
    }
    const contactRules = {
      nombre: { error: '#errNombre', message: getNameError, valid: (value) => !getNameError(value) },
      correo: { error: '#errCorreo', message: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Escribe un correo válido.', valid: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) },
      mensaje: { error: '#errMensaje', message: (value) => value.trim() ? '' : 'Escribe tu consulta.', valid: (value) => value.trim().length > 0 },
    };

    $form.off('.pwaContact');
    $form.on('input.pwaContact blur.pwaContact', '#nombre, #correo, #mensaje', function (event) {
      const field = contactRules[this.id];
      if (!field) return;
      const $input = $(this);
      if (this.id === 'nombre' && event.type === 'input') {
        const typedValue = this.value;
        if (/\d/.test(typedValue)) {
          const caret = this.selectionStart == null ? typedValue.length : this.selectionStart;
          const digitsBeforeCaret = (typedValue.slice(0, caret).match(/\d/g) || []).length;
          this.value = typedValue.replace(/\d/g, '');
          const nextCaret = Math.max(0, caret - digitsBeforeCaret);
          this.setSelectionRange(nextCaret, nextCaret);
          $input.data('pwaTouched', true);
          $input.attr('aria-invalid', 'true');
          $(field.error).text('No se permiten números en el nombre.').stop(true, true).fadeIn(180);
          return;
        }
        if (containsOffensiveNameWord(typedValue)) {
          this.value = $input.data('lastCleanName') || '';
          this.setSelectionRange(this.value.length, this.value.length);
          $input.data('pwaTouched', true);
          $input.attr('aria-invalid', 'true');
          $(field.error).text('No se permiten palabras ofensivas en el nombre.').stop(true, true).fadeIn(180);
          return;
        }
        $input.data('lastCleanName', typedValue);
      }
      if (event.type === 'blur') $input.data('pwaTouched', true);
      if (!$input.data('pwaTouched')) return;
      const error = field.message($input.val());
      $input.attr('aria-invalid', String(Boolean(error)));
      $(field.error).text(error).stop(true, true)[error ? 'fadeIn' : 'fadeOut'](180);
    });

    $form.on('submit.pwaContact', function (event) {
      event.preventDefault();
      Object.keys(contactRules).forEach((fieldId) => $(`#${fieldId}`).data('pwaTouched', true));
      const nameError = contactRules.nombre.message($('#nombre').val());
      const emailError = contactRules.correo.message($('#correo').val());
      const messageError = contactRules.mensaje.message($('#mensaje').val());
      const nameOk = !nameError;
      const emailOk = !emailError;
      const messageOk = !messageError;

      $('#errNombre').text(nameError).stop(true, true)[nameOk ? 'fadeOut' : 'fadeIn'](180);
      $('#errCorreo').text(emailError).stop(true, true)[emailOk ? 'fadeOut' : 'fadeIn'](180);
      $('#errMensaje').text(messageError).stop(true, true)[messageOk ? 'fadeOut' : 'fadeIn'](180);
      $('#nombre').attr('aria-invalid', String(!nameOk));
      $('#correo').attr('aria-invalid', String(!emailOk));
      $('#mensaje').attr('aria-invalid', String(!messageOk));
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
        $('#nombre').data('lastCleanName', '').data('pwaTouched', false);
      }).catch(() => {
        PC.toast.show('No se pudo guardar la consulta en este dispositivo.');
      }).finally(() => $submit.prop('disabled', false));
    });
  }

  PC.pages = PC.pages || {};
  PC.pages.inicio = { render, bindTools: bindHomeTools };
})(window);
