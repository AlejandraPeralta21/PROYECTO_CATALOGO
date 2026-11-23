/* PANEL DE ADMINISTRACIÓN: resumen local de ventas y bitácora de pedidos. */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});
  const STORAGE_KEY = 'planet_chicken_admin_orders';
  const MAX_ORDERS = 500;

  function readOrders() {
    try {
      const rows = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      return [];
    }
  }

  function writeOrders(rows) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(rows.slice(0, MAX_ORDERS))); } catch (error) {}
  }

  function recordOrder(order) {
    const rows = readOrders();
    rows.unshift({ ...order, status: 'pendiente' });
    writeOrders(rows);
  }

  function updateOrderStatus(id, status) {
    writeOrders(readOrders().map((order) => order.id === id ? { ...order, status } : order));
  }

  function dateLabel(value, options = {}) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Fecha no disponible' : new Intl.DateTimeFormat('es-BO', options).format(date);
  }

  function renderProductImageManager() {
    const overrides = PC.data.getProductImageOverrides();
    const products = PC.data.PRODUCTS || [];
    return `
      <section class="admin-panel admin-image-manager" id="admin-product-images" aria-labelledby="admin-image-title">
        <div class="admin-panel-heading admin-image-heading">
          <div><span>PERSONALIZA EL MENÚ</span><h2 id="admin-image-title">Imágenes de productos</h2><p>Pega el enlace compartido de Dropbox y guarda una foto para cada producto.</p></div>
          <span class="admin-log-count">${products.length} productos</span>
        </div>
        <div class="admin-image-note">Las imágenes se guardan en este dispositivo. Usa el enlace público para que se vean al compartir tu menú.</div>
        <div class="admin-image-filters">
          <div><label for="adminImageSearch">Buscar producto</label><input type="search" id="adminImageSearch" placeholder="Ej. Wings, hamburguesa..." /></div>
          <div><label for="adminImageCategory">Categoría</label><select id="adminImageCategory"><option value="todas">Todas las categorías</option>${PC.data.CATEGORIES.map((category) => `<option value="${PC.escapeHTML(category.id)}">${PC.escapeHTML(category.name)}</option>`).join('')}</select></div>
        </div>
        <div class="admin-image-grid" id="adminImageGrid" aria-live="polite">
          ${products.map((product) => {
            const category = PC.data.getCategory(product.category);
            const savedUrl = PC.data.normalizeDropboxImageUrl(overrides[product.id]) || '';
            const imageUrl = savedUrl || product.image;
            return `
              <article class="admin-image-item" data-admin-image-product="${PC.escapeHTML(product.id)}" data-category="${PC.escapeHTML(product.category)}" data-name="${PC.escapeHTML(`${product.name} ${category.name}`.toLowerCase())}">
                <div class="admin-image-preview-wrap"><img class="admin-image-preview" data-admin-image-preview src="${PC.escapeHTML(imageUrl)}" alt="Vista previa: ${PC.escapeHTML(product.name)}" loading="lazy" /><span class="admin-image-category">${PC.escapeHTML(category.name)}</span></div>
                <div class="admin-image-details">
                  <h3>${PC.escapeHTML(product.name)}</h3>
                  <label for="imageUrl-${PC.escapeHTML(product.id)}">Enlace de Dropbox</label>
                  <input class="admin-image-url" id="imageUrl-${PC.escapeHTML(product.id)}" type="url" inputmode="url" autocomplete="url" placeholder="https://www.dropbox.com/..." value="${PC.escapeHTML(savedUrl)}" data-admin-image-url />
                  <div class="admin-image-actions">
                    <button type="button" class="btn-primary-red" data-save-product-image="${PC.escapeHTML(product.id)}">Guardar imagen</button>
                    <button type="button" class="admin-image-reset" data-reset-product-image="${PC.escapeHTML(product.id)}">Restaurar original</button>
                  </div>
                  <p class="admin-image-status" data-admin-image-status role="status">${savedUrl ? 'Enlace personalizado guardado.' : 'Se usa la imagen original.'}</p>
                </div>
              </article>`;
          }).join('')}
        </div>
        <p class="admin-image-empty" id="adminImageEmpty" hidden>No hay productos que coincidan con la búsqueda.</p>
      </section>`;
  }

  function bindProductImageManager(root) {
    const grid = root.querySelector('#adminImageGrid');
    if (!grid) return;
    const search = root.querySelector('#adminImageSearch');
    const category = root.querySelector('#adminImageCategory');
    const empty = root.querySelector('#adminImageEmpty');

    const filterRows = () => {
      const query = (search.value || '').trim().toLowerCase();
      let visible = 0;
      grid.querySelectorAll('[data-admin-image-product]').forEach((row) => {
        const matches = (!query || row.dataset.name.includes(query)) && (category.value === 'todas' || row.dataset.category === category.value);
        row.hidden = !matches;
        if (matches) visible += 1;
      });
      empty.hidden = visible > 0;
    };
    search.addEventListener('input', filterRows);
    category.addEventListener('change', filterRows);

    grid.addEventListener('input', (event) => {
      const input = event.target.closest('[data-admin-image-url]');
      if (!input) return;
      const row = input.closest('[data-admin-image-product]');
      const product = PC.data.getProduct(row.dataset.adminImageProduct);
      const preview = row.querySelector('[data-admin-image-preview]');
      const status = row.querySelector('[data-admin-image-status]');
      const normalized = PC.data.normalizeDropboxImageUrl(input.value);
      if (normalized) {
        preview.src = normalized;
        status.textContent = 'Vista previa del enlace. Guarda para aplicarlo al menú.';
        status.classList.remove('has-error');
      } else {
        preview.src = PC.data.getOriginalProductImage(product.id);
        status.textContent = input.value.trim() ? 'Pega un enlace HTTPS compartido de Dropbox.' : 'Se usa la imagen original.';
        status.classList.toggle('has-error', Boolean(input.value.trim()));
      }
    });

    grid.addEventListener('click', (event) => {
      const saveButton = event.target.closest('[data-save-product-image]');
      const resetButton = event.target.closest('[data-reset-product-image]');
      const button = saveButton || resetButton;
      if (!button) return;
      const row = button.closest('[data-admin-image-product]');
      const product = PC.data.getProduct(row.dataset.adminImageProduct);
      const input = row.querySelector('[data-admin-image-url]');
      const preview = row.querySelector('[data-admin-image-preview]');
      const status = row.querySelector('[data-admin-image-status]');

      if (saveButton) {
        const normalized = PC.data.normalizeDropboxImageUrl(input.value);
        if (!normalized) {
          status.textContent = 'Pega un enlace HTTPS compartido de Dropbox antes de guardar.';
          status.classList.add('has-error');
          input.focus();
          return;
        }
        if (!PC.data.setProductImageOverride(product.id, normalized)) {
          status.textContent = 'No se pudo guardar en este dispositivo. Revisa el espacio disponible.';
          status.classList.add('has-error');
          return;
        }
        input.value = normalized;
        preview.src = normalized;
        status.textContent = 'Imagen guardada. Se aplicará en las tarjetas y detalles del menú.';
        status.classList.remove('has-error');
        return;
      }

      if (!PC.data.clearProductImageOverride(product.id)) {
        status.textContent = 'No se pudo restaurar la imagen en este dispositivo.';
        status.classList.add('has-error');
        return;
      }
      input.value = '';
      preview.src = product.image;
      status.textContent = 'Imagen original restaurada.';
      status.classList.remove('has-error');
    });
  }

  function render(root) {
    const orders = readOrders();
    const totalSales = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const totalUnits = orders.reduce((sum, order) => sum + (order.items || []).reduce((count, item) => count + Number(item.quantity || 0), 0), 0);
    const products = {};
    orders.forEach((order) => (order.items || []).forEach((item) => {
      const name = item.name || 'Producto';
      products[name] = (products[name] || 0) + Number(item.quantity || 0);
    }));
    const bestSellers = Object.entries(products).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - (6 - index));
      const sales = orders.filter((order) => {
        const created = new Date(order.createdAt);
        return !Number.isNaN(created.getTime()) && created.toDateString() === day.toDateString();
      }).reduce((sum, order) => sum + Number(order.total || 0), 0);
      return { label: dateLabel(day, { weekday: 'short' }).replace('.', ''), sales };
    });
    const maxSales = Math.max(...lastSevenDays.map((day) => day.sales), 1);

    root.innerHTML = `
      <section class="page-view admin-dashboard" aria-label="Panel de administración">
        <header class="admin-welcome">
          <div>
            <span class="admin-kicker">PLANET CHICKEN · ADMINISTRACIÓN</span>
            <h1>Panel de control</h1>
            <p>Resumen del negocio y actividad reciente.</p>
          </div>
          <div class="admin-welcome-actions"><button class="admin-manage-images" type="button" data-action="admin-images">Cambiar imágenes</button><button class="admin-logout" type="button" data-action="admin-return-home">Volver a la página principal</button></div>
        </header>

        <div class="admin-stat-grid">
          <article class="admin-stat-card"><span>Importe de pedidos</span><strong>${PC.data.formatBs(totalSales)}</strong><small>Acumulado en este dispositivo</small></article>
          <article class="admin-stat-card"><span>Pedidos</span><strong>${orders.length}</strong><small>En la bitácora local</small></article>
          <article class="admin-stat-card"><span>Productos vendidos</span><strong>${totalUnits}</strong><small>Unidades en pedidos</small></article>
          <article class="admin-stat-card admin-best-stat"><span>Más vendido</span><strong>${bestSellers.length ? PC.escapeHTML(bestSellers[0][0]) : '—'}</strong><small>${bestSellers.length ? `${bestSellers[0][1]} unidades` : 'Aún sin ventas'}</small></article>
        </div>

        <div class="admin-insights-grid">
          <section class="admin-panel admin-sales-panel">
            <div class="admin-panel-heading"><div><span>ÚLTIMOS 7 DÍAS</span><h2>Pedidos por día</h2></div><strong>${PC.data.formatBs(lastSevenDays.reduce((sum, day) => sum + day.sales, 0))}</strong></div>
            <div class="admin-chart" role="img" aria-label="Ventas de los últimos siete días">
              ${lastSevenDays.map((day) => `<div class="admin-chart-day"><span>${day.sales ? PC.data.formatBs(day.sales) : '—'}</span><div class="admin-chart-track"><i style="height:${day.sales ? Math.max(8, Math.round(day.sales / maxSales * 100)) : 3}%"></i></div><small>${PC.escapeHTML(day.label)}</small></div>`).join('')}
            </div>
          </section>
          <section class="admin-panel admin-products-panel">
            <div class="admin-panel-heading"><div><span>RENDIMIENTO</span><h2>Lo más vendido</h2></div></div>
            ${bestSellers.length ? `<ol class="admin-best-list">${bestSellers.map(([name, quantity], index) => `<li><span class="admin-rank">${index + 1}</span><span class="admin-product-name">${PC.escapeHTML(name)}</span><strong>${quantity}<small> uds.</small></strong></li>`).join('')}</ol>` : '<p class="admin-empty">Cuando ingresen pedidos, aquí verás tus productos más vendidos.</p>'}
          </section>
        </div>

        ${renderProductImageManager()}

        <section class="admin-panel admin-log-panel">
          <div class="admin-panel-heading"><div><span>BITÁCORA</span><h2>Actividad de pedidos</h2></div><span class="admin-log-count">${orders.length} registros</span></div>
          ${orders.length ? `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Pedido</th><th>Fecha y hora</th><th>Cliente</th><th>Detalle</th><th>Total</th><th>Estado</th></tr></thead><tbody>${orders.slice(0, 30).map((order) => {
            const detail = (order.items || []).map((item) => `${Number(item.quantity || 0)}× ${PC.escapeHTML(item.name || 'Producto')}`).join(', ');
            const status = order.status === 'recibido' ? 'Recibido por servidor' : 'Pendiente de sincronizar';
            return `<tr><td class="admin-order-id">${PC.escapeHTML(order.id || 'Pedido')}</td><td>${dateLabel(order.createdAt, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td><td>${PC.escapeHTML(order.customer && order.customer.name || 'Cliente invitado')}</td><td class="admin-order-detail">${detail || '—'}</td><td class="admin-order-total">${PC.data.formatBs(Number(order.total || 0))}</td><td><span class="admin-status ${order.status === 'recibido' ? 'is-received' : ''}">${status}</span></td></tr>`;
          }).join('')}</tbody></table></div>` : '<div class="admin-empty admin-log-empty">Todavía no hay pedidos. Los nuevos pedidos aparecerán aquí con su fecha, detalle y estado.</div>'}
          <p class="admin-data-note">La bitácora y las métricas se guardan en este navegador. Para ver pedidos de otros dispositivos se necesita conectar un servidor.</p>
        </section>
      </section>`;
    bindProductImageManager(root);
  }

  PC.pages = PC.pages || {};
  PC.pages.admin = { render, recordOrder, updateOrderStatus };
})(window);
