/* RESERVA DE COMBOS: solicitud local, validada y renderizada sin HTML dinámico. */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});
  const STORAGE_KEY = 'planet_chicken_combo_reservations';
  const MAX_LOCAL_RESERVATIONS = 12;
  const OFFLINE_COMBO_FALLBACK = [
    { id: 'combo-pollo-1', name: 'Combo Chicken 1 - 1 presa', category: 'combos', price: 33, optionGroups: [{ id: 'presa', label: 'Elige tu presa', choices: ['Ala', 'Pierna', 'Entrepierna'] }] },
    { id: 'combo-pollo-2', name: 'Combo Chicken 2 - 2 presas', category: 'combos', price: 43 },
    { id: 'combo-pollo-2-0', name: 'Combo Chicken 2.0 - Pecho + presa', category: 'combos', price: 45, optionGroups: [{ id: 'segunda-presa', label: 'Elige la segunda presa', choices: ['Ala', 'Pierna', 'Entrepierna'] }] },
    { id: 'combo-pollo-3', name: 'Combo Chicken 3 - 3 presas', category: 'combos', price: 59 },
    { id: 'combo-pipocas', name: 'Combo Pipocas', category: 'combos', price: 35 },
    { id: 'combo-planet-sandwich', name: 'Combo Planet Sandwich Chicken', category: 'combos', price: 59 },
    { id: 'five-combo-1', name: 'Combo 1 Five Burger', category: 'hamburguesas', subcategory: 'combos', price: 34 },
    { id: 'five-combo-2', name: 'Combo 2 Five Burger Clásica', category: 'hamburguesas', subcategory: 'combos', price: 25 },
    { id: 'five-combo-3', name: 'Combo 3 Five Burger Cheese', category: 'hamburguesas', subcategory: 'combos', price: 31 },
    { id: 'five-combo-4', name: 'Combo 4 Five Burger Bacon', category: 'hamburguesas', subcategory: 'combos', price: 31 },
    { id: 'wings-combo-6', name: 'Combo Wings 1 - 6 piezas', category: 'wings', subcategory: 'combos', price: 45, optionGroups: [{ id: 'salsa', label: 'Elige la salsa', choices: ['Miel y mostaza', 'Barbacoa', 'Picante'] }, { id: 'bebida', label: 'Elige la bebida', choices: ['Refresco', 'Jugo'] }] },
    { id: 'wings-combo-9', name: 'Combo Wings 2 - 9 piezas', category: 'wings', subcategory: 'combos', price: 55, optionGroups: [{ id: 'salsa', label: 'Elige la salsa', choices: ['Miel y mostaza', 'Barbacoa', 'Picante'] }, { id: 'bebida', label: 'Elige la bebida', choices: ['Refresco', 'Jugo'] }] },
  ];

  function getLocalDate() {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  function getReservationProducts() {
    const catalogProducts = (PC.data.PRODUCTS || []).filter((product) => product.category === 'combos' || product.subcategory === 'combos');
    return catalogProducts.length ? catalogProducts : OFFLINE_COMBO_FALLBACK;
  }

  function findReservationProduct(id) {
    return getReservationProducts().find((product) => product.id === id) || null;
  }

  function readReservations() {
    try {
      const entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(entries) ? entries.slice(0, MAX_LOCAL_RESERVATIONS) : [];
    } catch (error) {
      return [];
    }
  }

  function renderLocalReservations(list) {
    const entries = readReservations();
    list.replaceChildren();

    if (!entries.length) {
      const empty = document.createElement('li');
      empty.className = 'reservation-empty';
      empty.textContent = 'Tus solicitudes de combos aparecerán aquí.';
      list.append(empty);
      return;
    }

    entries.slice(0, 2).forEach((entry) => {
      const item = document.createElement('li');
      item.className = 'reservation-history-item';
      const name = document.createElement('strong');
      const details = document.createElement('span');
      name.textContent = `${String(entry.quantity || 1)} × ${String(entry.productName || 'Combo')}`;
      details.textContent = `${String(entry.date || '')} · ${String(entry.time || '')} · Bs ${Number(entry.total || 0).toFixed(2)}`;
      item.append(name, details);
      list.append(item);
    });
  }

  function getProductPrice(product) {
    const firstSize = product && Array.isArray(product.sizes) ? product.sizes[0] : null;
    return Number(firstSize && firstSize.price != null ? firstSize.price : product && product.price) || 0;
  }

  function updateProductOptions(productId, optionsRoot) {
      const product = findReservationProduct(productId);
    optionsRoot.replaceChildren();
    (product && product.optionGroups || []).forEach((group) => {
      const label = document.createElement('label');
      label.className = 'reservation-field';
      const title = document.createElement('span');
      title.textContent = group.label;
      const select = document.createElement('select');
      select.dataset.reservationOption = group.id;
      (group.choices || []).forEach((choice) => {
        const option = document.createElement('option');
        option.value = choice;
        option.textContent = choice;
        select.append(option);
      });
      label.append(title, select);
      optionsRoot.append(label);
    });
  }

  function render(root) {
    const today = getLocalDate();
    const reservationProducts = getReservationProducts();
    const productOptions = reservationProducts.map((product) =>
      `<option value="${PC.escapeHTML(product.id)}">${PC.escapeHTML(product.name)} · ${PC.data.formatBs(getProductPrice(product))}</option>`
    ).join('');
    const times = Array.from({ length: 12 }, (_, index) => {
      const hour = String(index + 11).padStart(2, '0');
      return `<option value="${hour}:00">${hour}:00</option>`;
    }).join('');

    root.innerHTML = `
      <section class="page-view reservation-page" aria-label="Reserva de combos">
        <div class="reservation-content">
          <header class="reservation-heading">
            <span class="reservation-mark" aria-hidden="true">${PC.icons.foodCombo()}</span>
            <h1>Reserva tu combo</h1>
            <p>Elige tu combo, la cantidad y cuándo pasarás a recogerlo.</p>
          </header>
          <form id="formReserva" class="reservation-form" novalidate>
            <label class="reservation-field reservation-field--wide" for="productoReserva">
              <span>Producto o combo</span>
              <select id="productoReserva" name="producto" aria-describedby="error-producto" required>
                <option value="" disabled selected>${reservationProducts.length ? 'Selecciona un combo' : 'No hay combos disponibles'}</option>
                ${productOptions}
              </select>
              <small class="reservation-error" id="error-producto" hidden></small>
            </label>
            <div class="reservation-options reservation-field--wide" id="opcionesReserva"></div>
            <label class="reservation-field reservation-field--wide" for="clienteNombre">
              <span>Nombre del cliente</span>
              <input type="text" id="clienteNombre" name="nombre" maxlength="60" autocomplete="name" aria-describedby="error-nombre" required placeholder="¿A nombre de quién?" />
              <small class="reservation-error" id="error-nombre" hidden></small>
            </label>
            <label class="reservation-field" for="clienteTelefono">
              <span>Teléfono</span>
              <input type="tel" id="clienteTelefono" name="telefono" maxlength="20" autocomplete="tel" aria-describedby="error-telefono" required placeholder="Número de contacto" />
              <small class="reservation-error" id="error-telefono" hidden></small>
            </label>
            <label class="reservation-field" for="cantidadCombo">
              <span>Cantidad</span>
              <input type="number" id="cantidadCombo" name="cantidad" min="1" max="20" value="1" aria-describedby="error-cantidad" required />
              <small class="reservation-error" id="error-cantidad" hidden></small>
            </label>
            <label class="reservation-field" for="fechaReserva">
              <span>Fecha para recoger</span>
              <input type="date" id="fechaReserva" name="fecha" min="${today}" value="${today}" aria-describedby="error-fecha" required />
              <small class="reservation-error" id="error-fecha" hidden></small>
            </label>
            <label class="reservation-field" for="horaReserva">
              <span>Horario</span>
              <select id="horaReserva" name="hora" aria-describedby="error-hora" required>${times}</select>
              <small class="reservation-error" id="error-hora" hidden></small>
            </label>
            <p class="reservation-summary reservation-field--wide" id="resumenCombo" aria-live="polite"></p>
            <button type="submit" class="btn-primary-red reservation-submit" ${reservationProducts.length ? '' : 'disabled'}>Enviar solicitud</button>
            <p class="reservation-status" id="reservaEstado" role="status" aria-live="polite" hidden></p>
          </form>
          <section class="reservation-history" aria-label="Solicitudes recientes guardadas en este dispositivo">
            <h2>Solicitudes recientes</h2>
            <ul id="listaReservas" class="reservation-history-list"></ul>
          </section>
        </div>
      </section>
    `;

    const form = root.querySelector('#formReserva');
    const list = root.querySelector('#listaReservas');
    const status = root.querySelector('#reservaEstado');
    const productSelect = root.querySelector('#productoReserva');
    const quantityInput = root.querySelector('#cantidadCombo');
    const optionsRoot = root.querySelector('#opcionesReserva');
    const summary = root.querySelector('#resumenCombo');
    const updateSummary = () => {
      const product = findReservationProduct(productSelect.value);
      const quantity = Math.max(1, Number(quantityInput.value) || 1);
      const total = getProductPrice(product) * quantity;
      summary.textContent = product ? `${product.name} · ${PC.data.formatBs(getProductPrice(product))} c/u · Total ${PC.data.formatBs(total)}` : reservationProducts.length ? 'Elige un combo para ver el total.' : 'No hay combos disponibles.';
    };
    const updateSelection = () => {
      updateProductOptions(productSelect.value, optionsRoot);
      updateSummary();
    };
    renderLocalReservations(list);
    updateSelection();

    const fieldChecks = {
      productoReserva: () => findReservationProduct(productSelect.value) ? '' : 'Selecciona un combo de la lista.',
      clienteNombre: () => {
        const value = root.querySelector('#clienteNombre').value.trim();
        return value.length >= 2 ? '' : 'Escribe tu nombre (mínimo 2 caracteres).';
      },
      clienteTelefono: () => {
        const digits = root.querySelector('#clienteTelefono').value.replace(/\D/g, '');
        return digits.length >= 7 && digits.length <= 15 ? '' : 'Ingresa un teléfono válido de 7 a 15 dígitos.';
      },
      cantidadCombo: () => {
        const value = Number(quantityInput.value);
        return Number.isInteger(value) && value >= 1 && value <= 20 ? '' : 'La cantidad debe ser de 1 a 20.';
      },
      fechaReserva: () => {
        const value = root.querySelector('#fechaReserva').value;
        return value && value >= getLocalDate() ? '' : 'Elige hoy o una fecha futura.';
      },
      horaReserva: () => root.querySelector('#horaReserva').value ? '' : 'Selecciona un horario.',
    };
    const fieldErrorIds = {
      productoReserva: 'error-producto',
      clienteNombre: 'error-nombre',
      clienteTelefono: 'error-telefono',
      cantidadCombo: 'error-cantidad',
      fechaReserva: 'error-fecha',
      horaReserva: 'error-hora',
    };
    const validateField = (fieldId) => {
      const check = fieldChecks[fieldId];
      if (!check) return true;
      const control = root.querySelector(`#${fieldId}`);
      const errorNode = root.querySelector(`#${fieldErrorIds[fieldId]}`);
      const message = check();
      if (errorNode) {
        errorNode.textContent = message;
        errorNode.hidden = !message;
      }
      if (control) {
        control.setAttribute('aria-invalid', String(Boolean(message)));
        control.closest('.reservation-field')?.classList.toggle('has-error', Boolean(message));
      }
      return !message;
    };

    const $form = $(form);
    $form.off('.planetReservation').on('change.planetReservation', '#productoReserva', updateSelection);
    $form.on('input.planetReservation change.planetReservation', '#cantidadCombo', updateSummary);
    $form.on('input.planetReservation change.planetReservation blur.planetReservation', '#productoReserva, #clienteNombre, #clienteTelefono, #cantidadCombo, #fechaReserva, #horaReserva', function () {
      validateField(this.id);
      if (status.classList.contains('is-error') && Object.keys(fieldChecks).every(validateField)) {
        status.hidden = true;
        status.classList.remove('is-error');
      }
    });
    $form.on('submit.planetReservation', async function (event) {
      event.preventDefault();
      const invalidFields = Object.keys(fieldChecks).filter((fieldId) => !validateField(fieldId));
      if (invalidFields.length) {
        status.hidden = false;
        status.classList.add('is-error');
        status.textContent = 'Corrige los campos marcados para continuar.';
        root.querySelector(`#${invalidFields[0]}`).focus();
        return;
      }
      const name = root.querySelector('#clienteNombre').value.trim();
      const phone = root.querySelector('#clienteTelefono').value.trim();
      const phoneDigits = phone.replace(/\D/g, '');
      const date = root.querySelector('#fechaReserva').value;
      const time = root.querySelector('#horaReserva').value;
      const quantity = Number(quantityInput.value);
      const product = findReservationProduct(productSelect.value);

      status.hidden = false;
      status.classList.remove('is-error');

      const options = Object.fromEntries(Array.from(optionsRoot.querySelectorAll('[data-reservation-option]'), (select) => [select.dataset.reservationOption, select.value]));
      const unitPrice = getProductPrice(product);
      const payload = {
        name, phone, date, time, productId: product.id, productName: product.name,
        category: product.category, quantity, unitPrice, total: unitPrice * quantity,
        options, createdAt: new Date().toISOString(),
      };
      const submit = root.querySelector('.reservation-submit');
      submit.disabled = true;
      try {
        const result = await PC.syncQueue.enqueue('combo_reservation', payload);
        const reservations = [payload, ...readReservations()].slice(0, MAX_LOCAL_RESERVATIONS);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations)); } catch (storageError) {}
        renderLocalReservations(list);
        this.reset();
        root.querySelector('#fechaReserva').min = getLocalDate();
        root.querySelector('#fechaReserva').value = getLocalDate();
        updateSelection();
        status.textContent = result.synced
          ? 'Solicitud enviada; el local confirmará tu pedido.'
          : 'Solicitud guardada en este dispositivo, pendiente de confirmación del local.';
      } catch (error) {
        status.classList.add('is-error');
        status.textContent = 'No se pudo guardar la solicitud. Inténtalo nuevamente.';
      } finally {
        submit.disabled = false;
      }
    });
  }

  PC.pages = PC.pages || {};
  PC.pages.reserva = { render };
})(window);
