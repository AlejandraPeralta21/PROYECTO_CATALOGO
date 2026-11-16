/* ============================================================================
   CARRITO DE COMPRA (ACCESIBLE SIN REGISTRO; LOGIN SOLO AL CONFIRMAR PEDIDO)
   ============================================================================ */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  function render(root) {
    const cart = PC.state.cart;
    root.innerHTML = `
      <section class="page-view cart-page" aria-label="Carrito de compras">
        <div class="cart-content">
          <p class="cart-intro">Agrega productos mientras exploras el menú. Inicia sesión solo para confirmar tu pedido.</p>
          ${cart.length ? `
            <div class="cart-list" role="list" aria-label="Productos y combos agregados al carrito">
              ${cart.map((item) => {
                const key = PC.escapeHTML(PC.state.getCartItemKey(item));
                const safeOptions = Object.values(item.options || {}).map(PC.escapeHTML).join(' · ');
                return `
                  <article class="cart-item" role="listitem">
                    ${PC.renderImage({ src: item.image, alt: item.name, preset: 'thumb', className: 'cart-item-img' })}
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
            <div class="cart-summary">
              <span>Total</span>
              <strong>${PC.data.formatBs(PC.state.getCartTotal())}</strong>
            </div>
            <button type="button" class="btn-primary-red cart-checkout-btn" data-action="checkout">Continuar para pedir</button>
          ` : `
            <div class="cart-empty">
              <span class="cart-empty-icon">${PC.icons.cart()}</span>
              <strong>Tu carrito está vacío</strong>
              <span>Explora el menú y agrega tus favoritos.</span>
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
