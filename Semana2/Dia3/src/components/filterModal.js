/* ==========================================================================
   FILTER MODAL COMPONENT (DUAL PRICE SLIDER, SIZE, SORT BY)
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});
  const PRICE_ABS_MIN = 10;
  const PRICE_ABS_MAX = 160;

  let isOpen = false;
  let draft = null;
  let onApplyCallback = null;
  let sliderController = null;

  function cleanupSliderEvents() {
    if (sliderController) sliderController.abort();
    sliderController = null;
  }

  function open(currentFilters, onApply) {
    draft = { ...currentFilters };
    onApplyCallback = onApply;
    isOpen = true;
    render();
  }

  function close() {
    isOpen = false;
    render();
  }

  function render() {
    const root = document.getElementById('app-modal');
    if (!root) return;

    if (!isOpen || !draft) {
      cleanupSliderEvents();
      root.innerHTML = '';
      return;
    }

    const minPct = ((draft.minPrice - PRICE_ABS_MIN) / (PRICE_ABS_MAX - PRICE_ABS_MIN)) * 100;
    const maxPct = ((draft.maxPrice - PRICE_ABS_MIN) / (PRICE_ABS_MAX - PRICE_ABS_MIN)) * 100;

    const sizes = [
      { id: 'todos', label: 'Todos' },
      { id: 'Personal', label: 'Personal' },
      { id: 'Mediano', label: 'Mediano' },
      { id: 'Grande', label: 'Grande' },
      { id: 'Familiar', label: 'Familiar' },
    ];

    const sorts = [
      { id: 'popularidad', label: 'Popularidad' },
      { id: 'precio_asc', label: 'Menor precio' },
      { id: 'recientes', label: 'Más recientes' },
    ];

    root.innerHTML = `
      <div class="modal-backdrop is-open" data-action="close-filters-backdrop">
        <div class="filter-sheet" role="dialog" aria-modal="true" aria-labelledby="filter-modal-title">
          <div class="filter-header">
            <div class="filter-title" id="filter-modal-title">
              ${PC.icons.sliders()}
              <span>Filtros</span>
            </div>
            <button type="button" class="icon-circle-btn" data-action="close-filters" aria-label="Cerrar filtros">
              ${PC.icons.close()}
            </button>
          </div>

          <div class="filter-group">
            <div class="filter-label">
              <span>Precio</span>
              <span class="range-readout" id="filter-price-readout">Bs ${draft.minPrice} – Bs ${draft.maxPrice}</span>
            </div>
            <div class="dual-slider">
              <div class="dual-slider-track">
                <div class="dual-slider-fill" id="filter-slider-fill" style="left:${minPct}%; width:${Math.max(4, maxPct - minPct)}%;"></div>
              </div>
              <input type="range" id="filter-range-min" min="${PRICE_ABS_MIN}" max="${PRICE_ABS_MAX}" value="${draft.minPrice}" aria-label="Precio mínimo" />
              <input type="range" id="filter-range-max" min="${PRICE_ABS_MIN}" max="${PRICE_ABS_MAX}" value="${draft.maxPrice}" aria-label="Precio máximo" />
            </div>
            <div class="range-bounds">
              <span>Bs ${PRICE_ABS_MIN}</span>
              <span>Bs ${PRICE_ABS_MAX}</span>
            </div>
          </div>

          <div class="filter-group">
            <div class="filter-label"><span>Tamaño</span></div>
            <div class="chip-grid" style="grid-template-columns: repeat(5, minmax(0, 1fr));">
              ${sizes
                .map(
                  (s) => `
                <button type="button" class="filter-chip ${draft.size === s.id ? 'is-active' : ''}" data-filter-size="${s.id}">
                  ${s.label}
                </button>`
                )
                .join('')}
            </div>
          </div>

          <div class="filter-group">
            <div class="filter-label"><span>Ordenar por</span></div>
            <div class="chip-grid">
              ${sorts
                .map(
                  (s) => `
                <button type="button" class="filter-chip ${draft.sort === s.id ? 'is-active' : ''}" data-filter-sort="${s.id}">
                  ${s.label}
                </button>`
                )
                .join('')}
            </div>
          </div>

          <button type="button" class="btn-primary-red" data-action="apply-filters">
            Aplicar filtros
          </button>
          <button type="button" class="btn-ghost-reset" data-action="reset-filters">
            ↺ Limpiar
          </button>
        </div>
      </div>
    `;

    bindSliderEvents();
  }

  function bindSliderEvents() {
    const minInput = document.getElementById('filter-range-min');
    const maxInput = document.getElementById('filter-range-max');
    const fill = document.getElementById('filter-slider-fill');
    const readout = document.getElementById('filter-price-readout');
    if (!minInput || !maxInput) return;
    cleanupSliderEvents();
    sliderController = new AbortController();
    const listenerOptions = { signal: sliderController.signal };

    const updateUI = () => {
      const minPct = ((draft.minPrice - PRICE_ABS_MIN) / (PRICE_ABS_MAX - PRICE_ABS_MIN)) * 100;
      const maxPct = ((draft.maxPrice - PRICE_ABS_MIN) / (PRICE_ABS_MAX - PRICE_ABS_MIN)) * 100;
      if (fill) {
        fill.style.left = `${minPct}%`;
        fill.style.width = `${Math.max(4, maxPct - minPct)}%`;
      }
      if (readout) {
        readout.textContent = `Bs ${draft.minPrice} – Bs ${draft.maxPrice}`;
      }
    };

    minInput.addEventListener('input', () => {
      let val = Number(minInput.value);
      if (val > draft.maxPrice - 4) {
        val = draft.maxPrice - 4;
        minInput.value = val;
      }
      draft.minPrice = val;
      updateUI();
    }, listenerOptions);

    maxInput.addEventListener('input', () => {
      let val = Number(maxInput.value);
      if (val < draft.minPrice + 4) {
        val = draft.minPrice + 4;
        maxInput.value = val;
      }
      draft.maxPrice = val;
      updateUI();
    }, listenerOptions);
  }

  function setSize(size) {
    if (!draft) return;
    draft.size = size;
    render();
  }

  function setSort(sort) {
    if (!draft) return;
    draft.sort = sort;
    render();
  }

  function apply() {
    if (onApplyCallback && draft) {
      onApplyCallback({ ...draft });
    }
    close();
  }

  function reset() {
    draft = { minPrice: PRICE_ABS_MIN, maxPrice: PRICE_ABS_MAX, size: 'todos', sort: 'popularidad' };
    if (onApplyCallback) {
      onApplyCallback({ ...draft });
    }
    close();
  }

  PC.components = PC.components || {};
  PC.components.filterModal = {
    PRICE_ABS_MIN,
    PRICE_ABS_MAX,
    cleanup: cleanupSliderEvents,
    open,
    close,
    render,
    setSize,
    setSort,
    apply,
    reset,
  };
})(window);
