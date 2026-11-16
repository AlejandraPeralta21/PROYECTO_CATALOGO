/* ==========================================================================
   THEME CONFIGURATION & LOCALSTORAGE PERSISTENCE
   ========================================================================== */
(function (global) {
  const THEME_KEY = 'planet_chicken_theme';
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  const listeners = new Set();

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme, persist = true) {
    const resolved = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', resolved);

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', resolved === 'dark' ? '#101114' : '#ED101F');
    }

    if (persist) {
      try {
        localStorage.setItem(THEME_KEY, resolved);
      } catch (e) {}
    }

    listeners.forEach((fn) => fn(resolved));
    return resolved;
  }

  function toggleTheme() {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    return applyTheme(next, true);
  }

  function initTheme() {
    let saved = 'light';
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'dark' || stored === 'light') {
        saved = stored;
      }
    } catch (e) {}
    return applyTheme(saved, false);
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  PC.theme = {
    init: initTheme,
    get: getTheme,
    set: applyTheme,
    toggle: toggleTheme,
    subscribe,
  };
})(window);
