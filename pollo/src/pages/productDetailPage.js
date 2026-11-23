/* ==========================================================================
   PÁGINA 5: DETALLE DEL PRODUCTO (OPCIONES Y PRECIO DESTACADO)
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  let activeProductId = null;
  let selectedSizeIdx = 0;
  let selectedOptions = {};
  let quantity = 1;
  let activeInfoTab = 'ingredientes'; // 'ingredientes' | 'nutricion'
  let optionValidationMessage = '';

  function render(root, route) {
    const product = PC.data.getProduct(route.productId) || PC.data.PRODUCTS[0];

    if (activeProductId !== product.id) {
      activeProductId = product.id;
      selectedSizeIdx = 0;
      selectedOptions = Object.fromEntries((product.optionGroups || []).map((group) => [group.id, group.multiple ? [] : group.choices[0]]));
      quantity = 1;
      activeInfoTab = 'ingredientes';
      optionValidationMessage = '';
    }

    const sizeObj = product.sizes[selectedSizeIdx] || product.sizes[0];
    const totalPrice = sizeObj.price * quantity;
    const isFav = PC.state.isFavorite(product.id);
    const category = PC.data.getCategory(product.category);

    const hasNutrition = product.nutrition && Number.parseInt(product.nutrition.kcal, 10) >= 0;
    const infoPanelHtml =
      activeInfoTab === 'nutricion'
        ? hasNutrition ? `
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
              <strong>${product.nutrition.carbs || '—'}</strong>
              <span>Carbohidratos</span>
            </div>
            <div class="nutrition-cell">
              <strong>${product.nutrition.fat || '—'}</strong>
              <span>Grasas</span>
            </div>
            <div class="nutrition-cell">
              <strong>${product.nutrition.sodium || '—'}</strong>
              <span>Sodio</span>
            </div>
            <div class="nutrition-cell">
              <strong>${product.nutrition.time}</strong>
              <span>Preparación</span>
            </div>
          </div>
          <p class="nutrition-disclaimer">${product.nutrition.basis || 'Por producto · estimado'}. Puede variar según la preparación.</p>` : `<p class="nutrition-unavailable">Información nutricional no disponible.</p>`
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
                ${PC.state.getCartCount() ? `<span class="detail-cart-count">${PC.state.getCartCount() > 9 ? '9+' : PC.state.getCartCount()}</span>` : ''}
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
            ${PC.renderImage({ src: product.image, alt: product.name, preset: 'hero', className: 'detail-hero-img', loading: 'lazy' })}
            <div class="detail-hero-caption"><span aria-hidden="true">✦</span><span>${category.name} · Preparado al momento</span></div>
          </div>

          <div class="detail-body">
            <div>
              <span class="detail-category-kicker">PLANET CHICKEN · ${category.name}</span>
              <div class="detail-title-row">
                <h1 class="detail-title">${product.name}</h1>
                <div class="detail-price" id="detail-price-display">${PC.data.formatBs(totalPrice)}</div>
              </div>
              <p class="detail-desc">${product.description}</p>
            </div>

            ${product.sizes.length > 1 ? `<div>
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
            </div>` : ''}

            ${(product.optionGroups || []).map((group) => `
              <div>
                <div class="detail-section-label">${group.label}${group.multiple ? ' · elige 2 o 3' : ''}</div>
                <div class="size-pills-row">
                  ${group.choices.map((choice) => `
                    <button type="button" class="size-pill ${(group.multiple ? selectedOptions[group.id].includes(choice) : selectedOptions[group.id] === choice) ? 'is-active' : ''}"
                      data-detail-option-group="${group.id}" data-detail-option="${choice}"
                      aria-pressed="${group.multiple ? selectedOptions[group.id].includes(choice) : selectedOptions[group.id] === choice}">
                      <span>${choice}</span>
                    </button>
                  `).join('')}
                </div>
                ${group.multiple ? `<p class="sauce-selection-hint ${optionValidationMessage ? 'is-error' : ''}" aria-live="polite">${optionValidationMessage || `${selectedOptions[group.id].length} seleccionada(s). Escoge mínimo 2 y máximo 3.`}</p>` : ''}
              </div>
            `).join('')}

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

  function setOption(groupId, value, root, route) {
    optionValidationMessage = '';
    const product = PC.data.getProduct(route.productId);
    const group = (product?.optionGroups || []).find((item) => item.id === groupId);
    if (group?.multiple) {
      const current = selectedOptions[groupId] || [];
      selectedOptions[groupId] = current.includes(value)
        ? current.filter((choice) => choice !== value)
        : current.length < (group.maxChoices || 3) ? [...current, value] : current;
    } else {
      selectedOptions[groupId] = value;
    }
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
    const incompleteGroup = (product.optionGroups || []).find((group) => group.multiple && (selectedOptions[group.id] || []).length < (group.minChoices || 2));
    if (incompleteGroup) {
      optionValidationMessage = `Elige al menos 2 opciones para “${incompleteGroup.label}”.`;
      const root = document.getElementById('page-root');
      if (root) render(root, route);
      return;
    }
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
      options: { ...selectedOptions },
      selectedAt: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }),
    });

    const root = document.getElementById('page-root');
    if (root) render(root, route);
    if (PC.components.header) PC.components.header.render(route);
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
    setOption,
    adjustQty,
    setInfoTab,
    confirmSelection,
    shareCurrent,
  };
})(window);
