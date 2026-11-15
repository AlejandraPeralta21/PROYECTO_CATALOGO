/* ==========================================================================
   PLANET CHICKEN – WINGS & CHICKEN
   Application State, Event Delegation & Bootstrap
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  const STORAGE_KEYS = {
    user: 'planet_chicken_user',
    favorites: 'planet_chicken_favorites',
    selections: 'planet_chicken_selections',
    prefs: 'planet_chicken_prefs',
  };

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  function createDefaultCategoryFilter() {
    return {
      subcategory: 'todas',
      search: '',
      minPrice: PC.components.filterModal.PRICE_ABS_MIN,
      maxPrice: PC.components.filterModal.PRICE_ABS_MAX,
      size: 'todos',
      sort: 'popularidad',
      page: 1,
    };
  }

  const catalogState = {};
  PC.data.CATEGORIES.forEach((c) => {
    catalogState[c.id] = createDefaultCategoryFilter();
  });

  PC.state = {
    lastCategory: 'hamburguesas',
    userName: readJson(STORAGE_KEYS.user, 'Explorador Espacial'),
    favorites: readJson(STORAGE_KEYS.favorites, ['burg-clasica', 'pollo-alitas-bbq']),
    selections: readJson(STORAGE_KEYS.selections, []),
    preferences: readJson(STORAGE_KEYS.prefs, {
      promoAlerts: true,
      spaceAnimations: true,
    }),
    catalog: catalogState,

    isFavorite(productId) {
      return this.favorites.includes(productId);
    },

    toggleFavorite(productId) {
      if (this.favorites.includes(productId)) {
        this.favorites = this.favorites.filter((id) => id !== productId);
      } else {
        this.favorites = [productId, ...this.favorites];
      }
      writeJson(STORAGE_KEYS.favorites, this.favorites);
      return this.favorites.includes(productId);
    },

    addSelection(entry) {
      this.selections = [entry, ...this.selections].slice(0, 12);
      writeJson(STORAGE_KEYS.selections, this.selections);
    },

    clearSelections() {
      this.selections = [];
      writeJson(STORAGE_KEYS.selections, []);
    },

    setUserName(name) {
      this.userName = name.trim() || 'Explorador Espacial';
      writeJson(STORAGE_KEYS.user, this.userName);
    },

    togglePref(key) {
      this.preferences[key] = !this.preferences[key];
      writeJson(STORAGE_KEYS.prefs, this.preferences);
    },

    getActiveFilterCount(categoryId = this.lastCategory) {
      const f = this.catalog[categoryId];
      if (!f) return 0;
      let count = 0;
      if (f.minPrice > PC.components.filterModal.PRICE_ABS_MIN || f.maxPrice < PC.components.filterModal.PRICE_ABS_MAX) {
        count++;
      }
      if (f.size !== 'todos') count++;
      if (f.sort !== 'popularidad') count++;
      return count;
    },

    resetCategoryFilters(categoryId = this.lastCategory) {
      this.catalog[categoryId] = createDefaultCategoryFilter();
    },
  };

  function renderCurrentView() {
    const route = PC.router.current();
    const pageRoot = document.getElementById('page-root');
    if (!pageRoot) return;

    if (route.page !== 'splash' && PC.pages.splash) {
      PC.pages.splash.cleanup();
    }

    PC.components.header.render(route);
    PC.components.bottomNav.render(route);
    PC.components.sideDrawer.render();

    const pageModule = PC.pages[route.page] || PC.pages.inicio;
    pageModule.render(pageRoot, route);
  }

  function handleActionClick(action, target) {
    const route = PC.router.current();
    const pageRoot = document.getElementById('page-root');

    switch (action) {
      case 'toggle-theme': {
        const next = PC.theme.toggle();
        PC.toast.show(next === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado');
        break;
      }
      case 'open-drawer':
        PC.components.sideDrawer.open();
        break;
      case 'close-drawer':
        PC.components.sideDrawer.close();
        break;
      case 'go-home':
        PC.router.navigate('#/inicio');
        break;
      case 'go-welcome':
        PC.router.navigate('#/bienvenida');
        break;
      case 'enter-menu':
        PC.router.navigate('#/inicio');
        break;
      case 'go-back':
        if (route.page === 'producto') {
          PC.router.goBack(`#/catalogo/${PC.state.lastCategory}`);
        } else {
          PC.router.navigate('#/inicio');
        }
        break;
      case 'open-filters': {
        const catId = route.category || PC.state.lastCategory;
        PC.components.filterModal.open(PC.state.catalog[catId], (nextFilters) => {
          PC.state.catalog[catId] = { ...PC.state.catalog[catId], ...nextFilters, page: 1 };
          renderCurrentView();
        });
        break;
      }
      case 'close-filters':
        PC.components.filterModal.close();
        break;
      case 'close-filters-backdrop':
        if (target.classList.contains('modal-backdrop')) {
          PC.components.filterModal.close();
        }
        break;
      case 'apply-filters':
        PC.components.filterModal.apply();
        break;
      case 'reset-filters':
        PC.components.filterModal.reset();
        break;
      case 'reset-catalog-filters':
        PC.state.resetCategoryFilters(route.category || PC.state.lastCategory);
        renderCurrentView();
        break;
      case 'clear-search':
        if (route.category && PC.state.catalog[route.category]) {
          PC.state.catalog[route.category].search = '';
          PC.state.catalog[route.category].page = 1;
          renderCurrentView();
        }
        break;
      case 'select-product':
        PC.pages.producto.confirmSelection(route);
        break;
      case 'share-product':
        PC.pages.producto.shareCurrent(route);
        break;
      case 'clear-selections':
        PC.state.clearSelections();
        PC.pages.perfil.render(pageRoot);
        PC.toast.show('Historial de selecciones limpiado');
        break;
      default:
        break;
    }
  }

  function bindGlobalEvents() {
    document.addEventListener('click', (e) => {
      // 1. Favorite Heart Toggle (prevent opening card behind it)
      const favBtn = e.target.closest('[data-toggle-fav]');
      if (favBtn) {
        e.stopPropagation();
        const pid = favBtn.getAttribute('data-toggle-fav');
        const nowFav = PC.state.toggleFavorite(pid);
        PC.toast.show(nowFav ? 'Guardado en favoritos' : 'Eliminado de favoritos');
        renderCurrentView();
        return;
      }

      // 2. Quick "+" Circle on Product Cards (opens detail or records quick selection)
      const quickBtn = e.target.closest('[data-quick-select]');
      if (quickBtn) {
        e.stopPropagation();
        const pid = quickBtn.getAttribute('data-quick-select');
        PC.router.navigate(`#/producto/${pid}`);
        return;
      }

      // 3. Open Product Detail Card
      const productCard = e.target.closest('[data-open-product]');
      if (productCard) {
        const pid = productCard.getAttribute('data-open-product');
        PC.router.navigate(`#/producto/${pid}`);
        return;
      }

      // 4. Category Card Splash Animation + Navigate
      const catBtn = e.target.closest('[data-category-nav]');
      if (catBtn) {
        const catId = catBtn.getAttribute('data-category-nav');
        catBtn.classList.add('is-selecting');
        setTimeout(() => {
          PC.router.navigate(`#/catalogo/${catId}`);
        }, 160);
        return;
      }

      // 5. Drawer Navigation
      const drawerNav = e.target.closest('[data-drawer-nav]');
      if (drawerNav) {
        const hash = drawerNav.getAttribute('data-drawer-nav');
        PC.components.sideDrawer.close();
        PC.router.navigate(hash);
        return;
      }

      // 6. Standard Navigation Buttons
      const navBtn = e.target.closest('[data-nav]');
      if (navBtn) {
        PC.router.navigate(navBtn.getAttribute('data-nav'));
        return;
      }

      // 7. Welcome Dots
      const dotBtn = e.target.closest('[data-welcome-dot]');
      if (dotBtn) {
        PC.pages.bienvenida.setSlide(Number(dotBtn.getAttribute('data-welcome-dot')));
        return;
      }

      // 8. Catalog Subcategory & Pagination
      const subBtn = e.target.closest('[data-subcat]');
      if (subBtn) {
        const route = PC.router.current();
        const catId = route.category || PC.state.lastCategory;
        PC.state.catalog[catId].subcategory = subBtn.getAttribute('data-subcat');
        PC.state.catalog[catId].page = 1;
        renderCurrentView();
        return;
      }

      const catPageBtn = e.target.closest('[data-catalog-page]');
      if (catPageBtn && !catPageBtn.disabled) {
        const route = PC.router.current();
        const catId = route.category || PC.state.lastCategory;
        PC.state.catalog[catId].page = Number(catPageBtn.getAttribute('data-catalog-page'));
        renderCurrentView();
        return;
      }

      // 9. Filter Modal Chips
      const sizeChip = e.target.closest('[data-filter-size]');
      if (sizeChip) {
        PC.components.filterModal.setSize(sizeChip.getAttribute('data-filter-size'));
        return;
      }

      const sortChip = e.target.closest('[data-filter-sort]');
      if (sortChip) {
        PC.components.filterModal.setSort(sortChip.getAttribute('data-filter-sort'));
        return;
      }

      // 10. Product Detail Controls
      const detailSize = e.target.closest('[data-detail-size]');
      if (detailSize) {
        PC.pages.producto.setSize(Number(detailSize.getAttribute('data-detail-size')), document.getElementById('page-root'), PC.router.current());
        return;
      }

      const detailQty = e.target.closest('[data-detail-qty]');
      if (detailQty) {
        PC.pages.producto.adjustQty(Number(detailQty.getAttribute('data-detail-qty')), document.getElementById('page-root'), PC.router.current());
        return;
      }

      const detailTab = e.target.closest('[data-detail-tab]');
      if (detailTab) {
        PC.pages.producto.setInfoTab(detailTab.getAttribute('data-detail-tab'), document.getElementById('page-root'), PC.router.current());
        return;
      }

      // 11. Promotions Filter & Pagination
      const promoFilter = e.target.closest('[data-promo-filter]');
      if (promoFilter) {
        PC.pages.promociones.setFilter(promoFilter.getAttribute('data-promo-filter'), document.getElementById('page-root'));
        return;
      }

      const promoPage = e.target.closest('[data-promo-page]');
      if (promoPage && !promoPage.disabled) {
        PC.pages.promociones.setPage(Number(promoPage.getAttribute('data-promo-page')), document.getElementById('page-root'));
        return;
      }

      // 12. Profile Tabs, Theme Cards & Preferences
      const profileTab = e.target.closest('[data-profile-tab]');
      if (profileTab) {
        PC.pages.perfil.setTab(profileTab.getAttribute('data-profile-tab'), document.getElementById('page-root'));
        return;
      }

      const setThemeBtn = e.target.closest('[data-set-theme]');
      if (setThemeBtn) {
        const chosen = setThemeBtn.getAttribute('data-set-theme');
        PC.theme.set(chosen, true);
        PC.toast.show(chosen === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado');
        return;
      }

      const prefToggle = e.target.closest('[data-toggle-pref]');
      if (prefToggle) {
        PC.state.togglePref(prefToggle.getAttribute('data-toggle-pref'));
        PC.pages.perfil.render(document.getElementById('page-root'));
        return;
      }

      // 13. Named Actions
      const actionEl = e.target.closest('[data-action]');
      if (actionEl) {
        handleActionClick(actionEl.getAttribute('data-action'), actionEl);
      }
    });

    // Keyboard accessibility for clickable cards
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        PC.components.sideDrawer.close();
        PC.components.filterModal.close();
      }
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-open-product]')) {
        e.preventDefault();
        PC.router.navigate(`#/producto/${e.target.getAttribute('data-open-product')}`);
      }
    });

    // Recompute paginated grids cleanly on viewport resize so zero scroll stays intact
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const page = PC.router.current().page;
        if (page === 'catalogo' || page === 'promociones') {
          renderCurrentView();
        }
      }, 150);
    });
  }

  function init() {
    PC.theme.init();
    PC.theme.subscribe(() => {
      const route = PC.router.current();
      PC.components.header.render(route);
      if (route.page === 'perfil') {
        PC.pages.perfil.render(document.getElementById('page-root'));
      }
    });
    PC.router.subscribe(renderCurrentView);
    bindGlobalEvents();
    PC.router.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
