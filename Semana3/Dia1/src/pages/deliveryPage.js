/* DELIVERY: opciones de entrega y acceso a las plataformas de pedido. */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  function render(root) {
    root.innerHTML = `
      <section class="page-view delivery-page" aria-label="Pedir por delivery">
        <div class="delivery-content">
          <header class="delivery-hero">
            <div class="delivery-hero-copy">
              <span class="delivery-eyebrow"><span aria-hidden="true">●</span> PLANET CHICKEN A TU PUERTA</span>
              <h1>Tu antojo<br />va en <em>camino.</em></h1>
              <p>Elige tu app favorita, busca Planet Chicken y disfruta wings y chicken sin salir de casa.</p>
              <div class="delivery-hero-points"><span><i aria-hidden="true">✓</i> Fácil de pedir</span><span><i aria-hidden="true">✓</i> Para compartir</span></div>
              <button class="delivery-menu-cta" type="button" data-nav="#/inicio">Explorar el menú <span aria-hidden="true">→</span></button>
            </div>
            <div class="delivery-illustration-wrap">
              <span class="delivery-illustration-spark delivery-spark-one" aria-hidden="true">✦</span>
              <span class="delivery-illustration-spark delivery-spark-two" aria-hidden="true">✦</span>
              <img class="delivery-moto" src="assets/images/delivery-moto.svg" alt="Ilustración de una moto llevando un pedido de Planet Chicken" />
              <span class="delivery-illustration-caption">¡Recién hecho y rumbo a ti!</span>
            </div>
          </header>

          <section class="delivery-platform-section" aria-labelledby="delivery-platform-title">
            <div class="delivery-section-heading"><div><span>ESCOGE TU APP</span><h2 id="delivery-platform-title">Pide en tu plataforma favorita</h2></div><p>Busca <strong>Planet Chicken</strong> en la app.</p></div>
            <div class="delivery-options">
              <article class="delivery-card delivery-card--yango">
                <div class="delivery-brand-row"><span class="delivery-app-mark delivery-app-mark--yango">Y</span><div><div class="delivery-brand delivery-brand--yango">Yango Food</div><small>Comida que te mueve</small></div><span class="delivery-platform-arrow" aria-hidden="true">↗</span></div>
                <p>Encuentra tus favoritos y pide directamente desde la aplicación.</p>
                <div class="delivery-links"><a class="delivery-link" href="https://play.google.com/store/apps/details?id=com.yango.eats" target="_blank" rel="noopener noreferrer">Descargar para Android <span aria-hidden="true">→</span></a><a class="delivery-link delivery-link--secondary" href="https://apps.apple.com/bo/app/yango-food-delivery-de-comida/id6444406396" target="_blank" rel="noopener noreferrer">Descargar para iPhone <span aria-hidden="true">→</span></a></div>
              </article>
              <article class="delivery-card delivery-card--pedidos">
                <div class="delivery-brand-row"><span class="delivery-app-mark delivery-app-mark--pedidos">P!</span><div><div class="delivery-brand delivery-brand--pedidos">PedidosYa</div><small>Tu comida, en camino</small></div><span class="delivery-platform-arrow" aria-hidden="true">↗</span></div>
                <p>Abre PedidosYa, busca Planet Chicken y arma tu pedido.</p>
                <div class="delivery-links"><a class="delivery-link delivery-link--pedidos" href="https://www.pedidosya.com.bo/" target="_blank" rel="noopener noreferrer">Abrir PedidosYa <span aria-hidden="true">→</span></a></div>
              </article>
            </div>
          </section>

          <section class="delivery-howto" aria-label="Cómo pedir">
            <div class="delivery-howto-heading"><span>EN TRES PASOS</span><h2>Así de fácil llega tu pedido</h2></div>
            <div class="delivery-steps"><article><b>01</b><span>Abre tu app de delivery</span></article><article><b>02</b><span>Busca Planet Chicken</span></article><article><b>03</b><span>Elige, confirma y disfruta</span></article></div>
          </section>
          <p class="delivery-footnote">La disponibilidad, cobertura y costo de envío dependen de la plataforma y de tu ubicación.</p>
        </div>
      </section>
    `;
  }

  PC.pages = PC.pages || {};
  PC.pages.delivery = { render };
})(window);
