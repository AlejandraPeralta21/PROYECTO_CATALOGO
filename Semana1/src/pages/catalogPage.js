/* ==========================================================================
   PÁGINA 4: CATÁLOGO DE PRODUCTOS (INDEPENDIENTE POR CATEGORÍA + FILTROS)
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  function getCatalogPageSize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w >= 1024) {
      return h >= 760 ? 8 : 4;
    }
    if (w >= 680) {
      return h >= 760 ? 6 : 3;
    }
    return h >= 640 ? 4 : 2;
  }

  function getFilteredProducts(categoryId) {
    const f = PC.state.catalog[categoryId];
    const query = (f.search || '').trim().toLowerCase();

    let list = PC.data.PRODUCTS.filter((p) => p.category === categoryId);

    if (f.subcategory && f.subcategory !== 'todas') {
      list = list.filter((p) => p.subcategory === f.subcategory);
    }

    if (query) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(query))
      );
    }

    list = list.filter((p) => p.price >= f.minPrice && p.price <= f.maxPrice);

    if (f.size && f.size !== 'todos') {
      list = list.filter((p) => p.sizes.some((s) => s.label === f.size));
    }

    if (f.sort === 'precio_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (f.sort === 'recientes') {
      list.sort((a, b) => b.recency - a.recency);
    } else {
      list.sort((a, b) => b.popularity - a.popularity);
    }

    return list;
  }

  function renderSubcategories(cat, activeSub) {
    if (cat.id === 'hamburguesas') {
      return `
        <div class="subcat-strip" role="tablist" aria-label="Subcategorías de ${cat.name}">
          ${cat.subcategories
            .map((sub) => {
              const iconFn = PC.icons[sub.icon] || PC.icons.foodBurger;
              return `
                <button
                  type="button"
                  role="tab"
                  aria-selected="${activeSub === sub.id}"
                  class="subcat-tile ${activeSub === sub.id ? 'is-active' : ''}"
                  data-subcat="${sub.id}"
                >
                  <span class="subcat-icon">${iconFn()}</span>
                  <span>${sub.name}</span>
                </button>`;
            })
            .join('')}
        </div>
      `;
    }

    return `
      <div class="subcat-strip subcat-strip--pills" role="tablist" aria-label="Subcategorías de ${cat.name}">
        ${cat.subcategories
          .map(
            (sub) => `
          <button
            type="button"
            role="tab"
            aria-selected="${activeSub === sub.id}"
            class="subcat-pill ${activeSub === sub.id ? 'is-active' : ''}"
            data-subcat="${sub.id}"
          >
            ${sub.name}
          </button>`
          )
          .join('')}
      </div>
    `;
  }

  function buildGridMarkup(visibleProducts, cat) {
    if (visibleProducts.length === 0) {
      return `
        <div class="empty-state">
          <p>No encontramos productos con esos filtros en ${cat.name}.</p>
          <button type="button" class="btn-primary-red" data-action="reset-catalog-filters">
            Restablecer filtros
          </button>
        </div>`;
    }

    return visibleProducts
      .map((p) => {
        const isFav = PC.state.isFavorite(p.id);
        return `
          <article class="product-card" data-open-product="${p.id}" tabindex="0" role="button" aria-label="Ver ${p.name}">
            ${p.promoTag ? `<span class="product-card-badge">${p.promoTag}</span>` : ''}
            <button
              type="button"
              class="product-card-fav ${isFav ? 'is-fav' : ''}"
              data-toggle-fav="${p.id}"
              aria-label="${isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
            >
              ${PC.icons.heart(isFav)}
            </button>

            <div class="product-card-img-wrap">
              <img class="product-card-img" src="${p.image}" alt="${p.name}" loading="lazy" />
            </div>

            <div class="product-card-info">
              <h3 class="product-card-title">${p.name}</h3>
              <div class="product-card-footer">
                <div>
                  ${
                    p.previousPrice
                      ? `<span class="product-card-old-price">${PC.data.formatBs(p.previousPrice)}</span>`
                      : ''
                  }
                  <span class="product-card-price">${PC.data.formatBs(p.price)}</span>
                </div>
                <button
                  type="button"
                  class="product-add-circle"
                  data-quick-select="${p.id}"
                  aria-label="Seleccionar ${p.name}"
                >+</button>
              </div>
            </div>
          </article>`;
      })
      .join('');
  }

  function buildPaginationMarkup(f, totalPages) {
    return `
      <button type="button" class="page-btn" data-catalog-page="${f.page - 1}" ${f.page <= 1 ? 'disabled' : ''}>
        ‹ Anterior
      </button>
      <div class="page-dots">
        ${Array.from({ length: totalPages })
          .map(
            (_, i) => `
          <button type="button" class="page-dot ${i + 1 === f.page ? 'is-active' : ''}" data-catalog-page="${i + 1}" aria-label="Página ${i + 1}"></button>`
          )
          .join('')}
      </div>
      <button type="button" class="page-btn" data-catalog-page="${f.page + 1}" ${f.page >= totalPages ? 'disabled' : ''}>
        Siguiente ›
      </button>`;
  }

  function updateCatalogResults(cat) {
    const f = PC.state.catalog[cat.id];
    const allFiltered = getFilteredProducts(cat.id);
    const pageSize = getCatalogPageSize();
    const totalPages = Math.max(1, Math.ceil(allFiltered.length / pageSize));
    if (f.page > totalPages) f.page = totalPages;
    if (f.page < 1) f.page = 1;

    const startIdx = (f.page - 1) * pageSize;
    const visibleProducts = allFiltered.slice(startIdx, startIdx + pageSize);
    const activeFilterCount = PC.state.getActiveFilterCount(cat.id);

    const gridEl = document.getElementById('catalog-products-grid');
    if (gridEl) gridEl.innerHTML = buildGridMarkup(visibleProducts, cat);

    const pagerEl = document.getElementById('catalog-pagination');
    if (pagerEl) pagerEl.innerHTML = buildPaginationMarkup(f, totalPages);

    const countEl = document.getElementById('catalog-filter-count');
    if (countEl) {
      countEl.textContent = activeFilterCount > 0 ? `${activeFilterCount} filtro(s)` : `${allFiltered.length} productos`;
    }

    const clearWrap = document.getElementById('catalog-clear-wrap');
    if (clearWrap) {
      clearWrap.innerHTML = f.search
        ? `<button type="button" class="search-clear-btn" data-action="clear-search" aria-label="Limpiar búsqueda">×</button>`
        : '';
    }
  }

  function render(root, route) {
    const categoryId = route.category || 'hamburguesas';
    const cat = PC.data.getCategory(categoryId);
    PC.state.lastCategory = cat.id;

    const f = PC.state.catalog[cat.id];
    const allFiltered = getFilteredProducts(cat.id);
    const pageSize = getCatalogPageSize();
    const totalPages = Math.max(1, Math.ceil(allFiltered.length / pageSize));
    if (f.page > totalPages) f.page = totalPages;
    if (f.page < 1) f.page = 1;

    const startIdx = (f.page - 1) * pageSize;
    const visibleProducts = allFiltered.slice(startIdx, startIdx + pageSize);
    const activeSubObj = cat.subcategories.find((s) => s.id === f.subcategory) || cat.subcategories[0];
    const sectionTitle =
      activeSubObj.id === 'todas' ? cat.name : `${cat.name} · ${activeSubObj.name}`;
    const activeFilterCount = PC.state.getActiveFilterCount(cat.id);

    root.innerHTML = `
      <section class="page-view" aria-label="Catálogo de ${cat.name}">
        <div class="page-container catalog-container">
          <div class="category-tabs-strip" aria-label="Cambiar de categoría">
            ${PC.data.CATEGORIES.map(
              (c) => `
              <button type="button" class="cat-switch-pill ${c.id === cat.id ? 'is-active' : ''}" data-nav="#/catalogo/${c.id}">
                ${c.name}
              </button>`
            ).join('')}
          </div>

          <div class="search-filter-row">
            <div class="search-box">
              <span class="search-icon">${PC.icons.search()}</span>
              <input
                type="search"
                id="catalog-search-input"
                class="search-input"
                placeholder="${cat.searchPlaceholder}"
                value="${(f.search || '').replace(/"/g, '&quot;')}"
                aria-label="${cat.searchPlaceholder}"
              />
              <span id="catalog-clear-wrap">
                ${
                  f.search
                    ? `<button type="button" class="search-clear-btn" data-action="clear-search" aria-label="Limpiar búsqueda">×</button>`
                    : ''
                }
              </span>
            </div>
          </div>

          ${renderSubcategories(cat, f.subcategory)}

          <div class="catalog-section-head">
            <h2 class="catalog-section-title">${sectionTitle}</h2>
            <button type="button" class="active-filter-summary" data-action="open-filters">
              ${PC.icons.sliders()}
              <span id="catalog-filter-count">${activeFilterCount > 0 ? `${activeFilterCount} filtro(s)` : `${allFiltered.length} productos`}</span>
            </button>
          </div>

          <div class="products-grid" id="catalog-products-grid">
            ${buildGridMarkup(visibleProducts, cat)}
          </div>

          <div class="pagination-bar" id="catalog-pagination">
            ${buildPaginationMarkup(f, totalPages)}
          </div>
        </div>
      </section>
    `;

    const searchInput = document.getElementById('catalog-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        PC.state.catalog[cat.id].search = e.target.value;
        PC.state.catalog[cat.id].page = 1;
        updateCatalogResults(cat);
      });
    }
  }

  PC.pages = PC.pages || {};
  PC.pages.catalogo = { render };
})(window);
