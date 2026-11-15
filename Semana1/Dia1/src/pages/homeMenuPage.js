/* ==========================================================================
   PÁGINA 3: MENÚ PRINCIPAL (5 ILLUSTRATED CATEGORY SPLASH CARDS - NO SCROLL)
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  function render(root) {
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
          <span class="cat-splatter s1" aria-hidden="true"></span>
          <span class="cat-splatter s2" aria-hidden="true"></span>
          <span class="cat-splatter s3" aria-hidden="true"></span>

          <span class="cat-icon-badge" aria-hidden="true">${iconFn()}</span>

          <div class="cat-photo-wrap">
            <img class="cat-photo" src="${cat.image}" alt="${cat.name}" loading="eager" />
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
          <div class="home-categories-grid">
            ${cardsHtml}
          </div>

          <div class="home-planet-wave" aria-hidden="true">
            ${PC.icons.planetMini()}
            <span>Elige una categoría para descubrir el menú</span>
          </div>
        </div>
      </section>
    `;
  }

  PC.pages = PC.pages || {};
  PC.pages.inicio = { render };
})(window);
