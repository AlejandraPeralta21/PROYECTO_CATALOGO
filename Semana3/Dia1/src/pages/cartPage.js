/* ============================================================================
   CARRITO DE COMPRA (ACCESIBLE SIN REGISTRO; LOGIN SOLO AL CONFIRMAR PEDIDO)
   ============================================================================ */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  function render(root) {
    const cart = PC.state.cart;
    const suggestedCategories = ['acompanamientos', 'bebidas', 'wings']
      .map((id) => PC.data.getCategory(id));
    root.innerHTML = `
      <section class="page-view cart-page" aria-label="Carrito de compras">
        <div class="cart-content">
          ${cart.length ? `
            <header class="cart-heading">
              <span class="cart-heading-icon" aria-hidden="true">${PC.icons.cart()}</span>
              <div class="cart-heading-copy">
                <span class="cart-heading-kicker">REVISIÓN DEL PEDIDO</span>
                <h2>¡Ya casi está!</h2>
                <p>Revisa tus productos y ajusta las cantidades.</p>
              </div>
              <span class="cart-item-count">${PC.state.getCartCount()} ${PC.state.getCartCount() === 1 ? 'producto' : 'productos'}</span>
            </header>
            <div class="cart-list" role="list" aria-label="Productos y combos agregados al carrito">
              ${cart.map((item) => {
                const key = PC.escapeHTML(PC.state.getCartItemKey(item));
                const safeOptions = Object.values(item.options || {})
                  .flatMap((value) => Array.isArray(value) ? value : [value])
                  .filter(Boolean).map(PC.escapeHTML).join(' · ');
                const currentProduct = PC.data.getProduct(item.id);
                return `
                  <article class="cart-item" role="listitem">
                    ${PC.renderImage({ src: currentProduct ? currentProduct.image : item.image, alt: item.name, preset: 'thumb', className: 'cart-item-img' })}
                    <div class="cart-item-info">
                      <strong>${PC.escapeHTML(item.name)}</strong>
                      <span>${PC.escapeHTML(item.size)} · ${PC.data.formatBs(item.unitPrice)} c/u</span>
                      ${safeOptions ? `<span class="cart-item-options">${safeOptions}</span>` : ''}
                      <div class="cart-item-controls">
                        <button type="button" class="qty-btn" data-action="cart-quantity" data-cart-key="${key}" data-cart-delta="-1" aria-label="Quitar uno">−</button>
                        <span>${PC.escapeHTML(item.quantity)}</span>
                        <button type="button" class="qty-btn" data-action="cart-quantity" data-cart-key="${key}" data-cart-delta="1" aria-label="Agregar uno">+</button>
                        <button type="button" class="cart-remove-btn" data-action="remove-cart-item" data-cart-key="${key}">Quitar</button>
                      </div>
                    </div>
                    <strong class="cart-item-total">${PC.data.formatBs(item.unitPrice * item.quantity)}</strong>
                  </article>
                `;
              }).join('')}
            </div>
            <section class="cart-suggestions" aria-labelledby="cart-suggestions-title">
              <div class="cart-suggestions-heading">
                <div>
                  <span>UN EXTRA PARA DISFRUTAR</span>
                  <h2 id="cart-suggestions-title">¿Algo para acompañar?</h2>
                </div>
                <button type="button" data-nav="#/inicio">Ver todo el menú <span aria-hidden="true">→</span></button>
              </div>
              <div class="cart-suggestion-list">
                ${suggestedCategories.map((category) => `
                  <button type="button" class="cart-suggestion-card" data-category-nav="${PC.escapeHTML(category.id)}" aria-label="Explorar ${PC.escapeHTML(category.name)}">
                    ${PC.renderImage({ src: category.image, alt: '', preset: 'category', className: 'cart-suggestion-image' })}
                    <span class="cart-suggestion-name">${PC.escapeHTML(category.name)}</span>
                    <span class="cart-suggestion-arrow" aria-hidden="true">↗</span>
                  </button>
                `).join('')}
              </div>
            </section>
            <div class="cart-footer">
              <div class="cart-footer-info">
                <div class="cart-summary">
                  <span>Total del pedido</span>
                  <strong>${PC.data.formatBs(PC.state.getCartTotal())}</strong>
                </div>
                <button type="button" class="cart-add-more" data-nav="#/inicio"><span aria-hidden="true">＋</span> Agregar algo más</button>
              </div>
              <div class="cart-footer-action">
                <button type="button" class="btn-primary-red cart-checkout-btn" data-action="checkout">Continuar para pedir <span aria-hidden="true">→</span></button>
                <p>Puedes pedir sin crear una cuenta ni iniciar sesión.</p>
              </div>
            </div>
          ` : `
            <div class="cart-empty">
              <span class="cart-empty-icon">${PC.icons.cart()}</span>
              <span class="cart-empty-kicker">TU PRÓXIMA COMIDA TE ESPERA</span>
              <strong>Tu carrito está vacío</strong>
              <span>Descubre algo rico y vuelve aquí cuando quieras.</span>
              <button type="button" class="btn-primary-red" data-nav="#/inicio">Explorar menú</button>
            </div>
          `}
        </div>
      </section>
    `;
  }

  PC.pages = PC.pages || {};
  PC.pages.carrito = { render };
})(window);
