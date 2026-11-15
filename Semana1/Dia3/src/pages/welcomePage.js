/* ==========================================================================
   PÁGINA 2: BIENVENIDA (HOLOGRAPHIC PEDESTAL & SPACE ENTRANCE)
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});
  const TAGLINES = [
    'Hamburguesas crujientes, pollos y combos galácticos',
    'Ingredientes frescos preparados al instante',
    'Wings & Chicken · Calidad de otro planeta',
  ];
  let slideIdx = 0;

  function buildStars() {
    const coords = [
      [10, 14], [18, 82], [28, 18], [34, 86], [52, 10],
      [58, 90], [68, 20], [74, 78], [14, 48], [84, 45],
    ];
    return coords
      .map(
        ([top, left], i) => `
      <span class="space-star" style="top:${top}%; left:${left}%; width:${10 + (i % 2) * 5}px; height:${10 + (i % 2) * 5}px; color:${i % 3 === 0 ? '#ED101F' : '#FFFFFF'}; animation-delay:${(i * 0.3).toFixed(1)}s;">
        ${PC.icons.sparkleStar()}
      </span>`
      )
      .join('');
  }

  function render(root) {
    root.innerHTML = `
      <section class="page-view welcome-screen" aria-label="Bienvenida a Planet Chicken">
        <div class="space-stars">${buildStars()}</div>

        <div class="welcome-stage">
          <div class="welcome-halo-wrap">
            <div class="welcome-logo-glow">
              ${PC.icons.orbitRing()}
              ${PC.renderImage({ src: PC.media.BRAND_LOGO, alt: 'Logo Planet Chicken', preset: 'brand', className: 'welcome-logo-img' })}
            </div>
            <div class="holo-beam" aria-hidden="true"></div>
            <div class="holo-pedestal" aria-hidden="true"></div>
          </div>
        </div>

        <div class="welcome-copy">
          <h1 class="welcome-title">¡Bienvenido al sabor<br/>de otro planeta!</h1>

          <div class="welcome-dots" role="tablist" aria-label="Destacados Planet Chicken">
            ${TAGLINES.map(
              (_, idx) => `
              <button
                type="button"
                class="welcome-dot ${idx === slideIdx ? 'is-active' : ''}"
                data-welcome-dot="${idx}"
                aria-label="Mensaje ${idx + 1}"
              ></button>`
            ).join('')}
          </div>

          <p class="welcome-tagline" id="welcome-tagline-text">${TAGLINES[slideIdx]}</p>

          <button type="button" class="welcome-cta" data-action="enter-menu">
            EXPLORAR MENÚ
          </button>
        </div>
      </section>
    `;
  }

  function setSlide(idx) {
    slideIdx = idx % TAGLINES.length;
    const textEl = document.getElementById('welcome-tagline-text');
    if (textEl) textEl.textContent = TAGLINES[slideIdx];
    document.querySelectorAll('.welcome-dot').forEach((btn, i) => {
      btn.classList.toggle('is-active', i === slideIdx);
    });
  }

  PC.pages = PC.pages || {};
  PC.pages.bienvenida = { render, setSlide };
})(window);
