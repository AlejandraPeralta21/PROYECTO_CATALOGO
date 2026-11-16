/* DELIVERY: acceso a las plataformas externas de pedido */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  function render(root) {
    root.innerHTML = `
      <section class="page-view delivery-page" aria-label="Pedir por delivery">
        <div class="delivery-content">
          <header class="delivery-heading">
            <span class="delivery-mark" aria-hidden="true">${PC.icons.foodDrink()}</span>
            <h1>Pide por Delivery</h1>
            <p>Encuentra Planet Chicken en tu aplicación favorita y recibe tu pedido.</p>
          </header>
          <div class="delivery-options">
            <article class="delivery-card">
              <div class="delivery-brand delivery-brand--yango" aria-label="Yango Food">Yango Food</div>
              <p>Abre Yango Food en tu celular y busca Planet Chicken.</p>
              <div class="delivery-links">
                <a class="delivery-link" href="https://play.google.com/store/apps/details?id=com.yango.eats" target="_blank" rel="noopener noreferrer">Android · Google Play</a>
                <a class="delivery-link delivery-link--secondary" href="https://apps.apple.com/bo/app/yango-food-delivery-de-comida/id6444406396" target="_blank" rel="noopener noreferrer">iPhone · App Store</a>
              </div>
            </article>
            <article class="delivery-card">
              <div class="delivery-brand delivery-brand--pedidos" aria-label="PedidosYa">PedidosYa</div>
              <p>Ingresa a PedidosYa y busca Planet Chicken para pedir.</p>
              <div class="delivery-links">
                <a class="delivery-link" href="https://www.pedidosya.com.bo/" target="_blank" rel="noopener noreferrer">Abrir PedidosYa</a>
              </div>
            </article>
          </div>
          <p class="delivery-footnote">La disponibilidad puede variar según tu ubicación.</p>
        </div>
      </section>
    `;
  }

  PC.pages = PC.pages || {};
  PC.pages.delivery = { render };
})(window);
