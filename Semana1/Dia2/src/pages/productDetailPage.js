/* ==========================================================================
   PÁGINA 5: DETALLE DEL PRODUCTO (SIN CARRITO - PRECIO DESTACADO EN ROJO)
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  let activeProductId = null;
  let selectedSizeIdx = 0;
  let quantity = 1;
  let activeInfoTab = 'ingredientes'; // 'ingredientes' | 'nutricion'

  function render(root, route) {
    const product = PC.data.getProduct(route.productId) || PC.data.PRODUCTS[0];

    if (activeProductId !== product.id) {
      activeProductId = product.id;
      selectedSizeIdx = 0;
      quantity = 1;
      activeInfoTab = 'ingredientes';
    }

    const sizeObj = product.sizes[selectedSizeIdx] || product.sizes[0];
    const totalPrice = sizeObj.price * quantity;
    const isFav = PC.state.isFavorite(product.id);

    const infoPanelHtml =
      activeInfoTab === 'nutricion'
        ? `
          <div class="nutrition-grid">
            <div class="nutrition-cell">
              <strong>${product.nutrition.kcal}</strong>
              <span>Energía</span>
            </div>
            <div class="nutrition-cell">
              <strong>${product.nutrition.protein}</strong>
              <span>Proteína</span>
            </div>
            <div class="nutrition-cell">
              <strong>${product.nutrition.time}</strong>
              <span>Preparación</span>
            </div>
          </div>`
        : `
          <div class="ingredients-chips">
            ${product.ingredients.map((ing) => `<span class="ingredient-chip">${ing}</span>`).join('')}
          </div>`;

    root.innerHTML = `
      <section class="page-view detail-view" aria-label="Detalle de ${product.name}">
        <div class="detail-view-inner">
          <div class="detail-hero">
            <div class="detail-hero-controls">
              <button type="button" class="detail-float-btn" data-action="go-back" aria-label="Regresar al catálogo">
                ${PC.icons.arrowLeft()}
              </button>
              <button type="button" class="detail-float-btn" data-action="open-cart" aria-label="Abrir carrito, ${PC.state.getCartCount()} productos">
                ${PC.icons.cart()}
              </button>
              <button
                type="button"
                class="detail-float-btn ${isFav ? 'is-fav' : ''}"
                data-toggle-fav="${product.id}"
                aria-label="${isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}"
              >
                ${PC.icons.heart(isFav)}
              </button>
            </div>
            ${PC.renderImage({ src: product.image, alt: product.name, preset: 'hero', className: 'detail-hero-img' })}
          </div>

          <div class="detail-body">
            <div>
              <div class="detail-title-row">
                <h1 class="detail-title">${product.name}</h1>
                <div class="detail-price" id="detail-price-display">${PC.data.formatBs(totalPrice)}</div>
              </div>
              <p class="detail-desc">${product.description}</p>
            </div>

            <div>
              <div class="detail-section-label">Tamaño</div>
              <div class="size-pills-row">
                ${product.sizes
                  .map(
                    (s, idx) => `
                  <button
                    type="button"
                    class="size-pill ${idx === selectedSizeIdx ? 'is-active' : ''}"
                    data-detail-size="${idx}"
                  >
                    <span>${s.label}</span>
                    <span>· ${PC.data.formatBs(s.price)}</span>
                  </button>`
                  )
                  .join('')}
              </div>
            </div>

            <div>
              <div class="detail-section-label">${activeInfoTab === 'nutricion' ? 'Información nutricional' : 'Ingredientes'}</div>
              <div class="detail-info-panel">${infoPanelHtml}</div>
            </div>

            <div class="detail-cta-row">
              <div class="qty-stepper" aria-label="Cantidad">
                <button type="button" class="qty-btn" data-detail-qty="-1" aria-label="Disminuir cantidad">−</button>
                <span class="qty-val">${quantity}</span>
                <button type="button" class="qty-btn" data-detail-qty="1" aria-label="Aumentar cantidad">+</button>
              </div>
              <button type="button" class="btn-primary-red" data-action="select-product">
                Añadir al carrito
              </button>
            </div>

            <div class="detail-bottom-utils">
              <button type="button" class="detail-util-btn ${activeInfoTab === 'ingredientes' ? 'is-active' : ''}" data-detail-tab="ingredientes">
                ${PC.icons.ingredients()}
                <span>Ingredientes</span>
              </button>
              <button type="button" class="detail-util-btn ${activeInfoTab === 'nutricion' ? 'is-active' : ''}" data-detail-tab="nutricion">
                ${PC.icons.nutrition()}
                <span>Nutrición</span>
              </button>
              <button type="button" class="detail-util-btn" data-action="share-product">
                ${PC.icons.share()}
                <span>Compartir</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function setSize(idx, root, route) {
    selectedSizeIdx = idx;
    render(root, route);
  }

  function adjustQty(delta, root, route) {
    quantity = Math.max(1, Math.min(20, quantity + delta));
    render(root, route);
  }

  function setInfoTab(tab, root, route) {
    activeInfoTab = tab;
    render(root, route);
  }

  function confirmSelection(route) {
    const product = PC.data.getProduct(route.productId);
    if (!product) return;
    const sizeObj = product.sizes[selectedSizeIdx] || product.sizes[0];
    const totalPrice = sizeObj.price * quantity;

    PC.state.addToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      size: sizeObj.label,
      quantity,
      unitPrice: sizeObj.price,
      totalPrice,
      selectedAt: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }),
    });

    PC.toast.show(`Añadido al carrito: ${quantity}× ${product.name} · ${PC.data.formatBs(totalPrice)}`);
  }

  function shareCurrent(route) {
    const product = PC.data.getProduct(route.productId);
    if (!product) return;
    const text = `${product.name} (${PC.data.formatBs(product.price)}) en PLANET CHICKEN – Wings & Chicken`;

    if (navigator.share) {
      navigator.share({ title: product.name, text, url: window.location.href }).catch(() => {});
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(`${text} - ${window.location.href}`).catch(() => {});
    }
    PC.toast.show(`Enlace de "${product.name}" listo para compartir`);
  }

  PC.pages = PC.pages || {};
  PC.pages.producto = {
    render,
    setSize,
    adjustQty,
    setInfoTab,
    confirmSelection,
    shareCurrent,
  };
})(window);
