/* ==========================================================================
   TOAST NOTIFICATION COMPONENT
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});
  let timer = null;

  function show(message) {
    const region = document.getElementById('app-toast');
    if (!region) return;

    region.innerHTML = `
      <div class="toast-pill" role="status">
        <span class="toast-badge" aria-hidden="true">✓</span>
        <span>${message}</span>
      </div>
    `;

    clearTimeout(timer);
    timer = setTimeout(() => {
      region.innerHTML = '';
    }, 2600);
  }

  PC.toast = { show };
})(window);
