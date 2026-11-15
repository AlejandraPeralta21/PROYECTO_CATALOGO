/* ==========================================================================
   PÁGINA 1: SPLASH SCREEN (2s COSMIC ANIMATION -> AUTO BIENVENIDA)
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});
  let animFrame = null;
  let timeoutId = null;

  function buildStars(count) {
    const stars = [];
    for (let i = 0; i < count; i++) {
      const top = (11 + i * 17) % 76;
      const left = (7 + i * 23) % 92;
      const size = 10 + (i % 3) * 6;
      const delay = ((i * 0.35) % 2).toFixed(2);
      stars.push(`
        <span class="space-star" style="top:${top}%; left:${left}%; width:${size}px; height:${size}px; animation-delay:${delay}s;">
          ${PC.icons.sparkleStar()}
        </span>
      `);
    }
    return stars.join('');
  }

  function render(root) {
    cleanup();

    root.innerHTML = `
      <section class="page-view splash-screen" aria-label="Pantalla de carga Planet Chicken">
        <div class="space-stars">${buildStars(12)}</div>
        <div class="splash-rocket">${PC.icons.rocketShip()}</div>

        <div class="splash-center">
          <div class="orbit-logo-stage">
            ${PC.icons.orbitRing()}
            <img class="orbit-logo-img" src="assets/brand/logo-planet-chicken.png" alt="PLANET CHICKEN – Wings & Chicken" />
          </div>

          <div class="splash-loader-wrap">
            <div class="splash-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="splash-progressbar">
              <div class="splash-progress-fill" id="splash-progress-fill"></div>
            </div>
            <p class="splash-text">Cargando el mejor sabor...</p>
          </div>
        </div>

        <div class="splash-planets">${PC.icons.splashPlanets()}</div>
      </section>
    `;

    const fillEl = document.getElementById('splash-progress-fill');
    const barEl = document.getElementById('splash-progressbar');
    const duration = 2000;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      if (fillEl) fillEl.style.width = `${pct}%`;
      if (barEl) barEl.setAttribute('aria-valuenow', String(pct));

      if (elapsed < duration) {
        animFrame = requestAnimationFrame(step);
      }
    }

    animFrame = requestAnimationFrame(step);
    timeoutId = setTimeout(() => {
      if (PC.router.current().page === 'splash') {
        PC.router.navigate('#/bienvenida', { replace: true });
      }
    }, duration + 120);
  }

  function cleanup() {
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  PC.pages = PC.pages || {};
  PC.pages.splash = { render, cleanup };
})(window);
