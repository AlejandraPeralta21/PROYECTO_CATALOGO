/* ==========================================================================
   PÁGINA 6: PROMOCIONES (BANNERS, COMBOS PROMOCIONALES & PRECIOS ANTES/AHORA)
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});
  let activeFilter = 'todas';
  let currentPage = 1;

  function getPromoPageSize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w >= 1024) return h >= 780 ? 4 : 4;
    if (w >= 680) return h >= 760 ? 3 : 3;
    return h >= 700 ? 4 : 2;
  }

  function render(root) {
    const allPromos = PC.data.getPromotions();
    const heroDeal = PC.data.getProduct('combo-familiar-galactico') || allPromos[0];

    const filtered =
      activeFilter === 'todas'
        ? allPromos
        : allPromos.filter((p) => p.promoType === activeFilter);

    const pageSize = getPromoPageSize();
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const filters = [
      { id: 'todas', label: 'Todas' },
      { id: 'combo', label: 'Combos Promo' },
      { id: 'especial', label: 'Ofertas' },
      { id: 'destacado', label: 'Destacados' },
    ];

    root.innerHTML = `
      <section class="page-view" aria-label="Promociones Planet Chicken">
        <div class="page-container promos-container">
          <article class="promo-hero-banner">
            <div class="promo-hero-copy">
              <span class="promo-hero-kicker">Promo Galáctica · ${heroDeal.promoTag || 'OFERTA'}</span>
              <h2 class="promo-hero-title"><button type="button" data-open-product="${heroDeal.id}" aria-label="Ver promoción destacada ${heroDeal.name}">${heroDeal.name}</button></h2>
              <div class="promo-hero-prices">
                ${heroDeal.previousPrice ? `<span class="promo-hero-old">${PC.data.formatBs(heroDeal.previousPrice)}</span>` : ''}
                <span class="promo-hero-now">${PC.data.formatBs(heroDeal.price)}</span>
              </div>
            </div>
            ${PC.renderImage({ src: heroDeal.image, alt: heroDeal.name, preset: 'promo', className: 'promo-hero-img' })}
          </article>

          <div class="subcat-strip subcat-strip--pills" role="tablist" aria-label="Filtrar promociones">
            ${filters
              .map(
                (f) => `
              <button type="button" role="tab" aria-selected="${activeFilter === f.id}" class="subcat-pill ${activeFilter === f.id ? 'is-active' : ''}" data-promo-filter="${f.id}">
                ${f.label}
              </button>`
              )
              .join('')}
          </div>

          <div class="products-grid">
            ${visible
              .map((p) => {
                const isFav = PC.state.isFavorite(p.id);
                return `
                  <article class="product-card">
                    ${p.promoTag ? `<span class="product-card-badge">${p.promoTag}</span>` : ''}
                    <button
                      type="button"
                      class="product-card-fav ${isFav ? 'is-fav' : ''}"
                      data-toggle-fav="${p.id}"
                      aria-pressed="${isFav}"
                      aria-label="${isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}"
                    >
                      ${PC.icons.heart(isFav)}
                    </button>

                    <div class="product-card-img-wrap">
                      ${PC.renderImage({ src: p.image, alt: p.name, preset: 'card', className: 'product-card-img' })}
                    </div>

                    <div class="product-card-info">
                      <h3 class="product-card-title"><button type="button" data-open-product="${p.id}" aria-label="Ver promoción ${p.name}">${p.name}</button></h3>
                      <div class="product-card-footer">
                        <div>
                          ${p.previousPrice ? `<span class="product-card-old-price">${PC.data.formatBs(p.previousPrice)}</span>` : ''}
                          <span class="product-card-price">${PC.data.formatBs(p.price)}</span>
                        </div>
                        <button type="button" class="product-add-circle" data-quick-select="${p.id}" aria-label="Seleccionar ${p.name}">+</button>
                      </div>
                    </div>
                  </article>`;
              })
              .join('')}
          </div>

          <div class="pagination-bar">
            <button type="button" class="page-btn" data-promo-page="${currentPage - 1}" ${currentPage <= 1 ? 'disabled' : ''}>
              ‹ Anterior
            </button>
            <div class="page-dots">
              ${Array.from({ length: totalPages })
                .map(
                  (_, i) => `
                <button type="button" class="page-dot ${i + 1 === currentPage ? 'is-active' : ''}" data-promo-page="${i + 1}" aria-label="Página ${i + 1}"></button>`
                )
                .join('')}
            </div>
            <button type="button" class="page-btn" data-promo-page="${currentPage + 1}" ${currentPage >= totalPages ? 'disabled' : ''}>
              Siguiente ›
            </button>
          </div>
        </div>
      </section>
    `;
  }

  function setFilter(filterId, root) {
    activeFilter = filterId;
    currentPage = 1;
    render(root);
  }

  function setPage(page, root) {
    currentPage = Math.max(1, page);
    render(root);
  }

  PC.pages = PC.pages || {};
  PC.pages.promociones = { render, setFilter, setPage };
})(window);
