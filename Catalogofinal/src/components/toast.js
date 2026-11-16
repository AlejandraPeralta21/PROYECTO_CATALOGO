/* ==========================================================================
   TOAST NOTIFICATION COMPONENT
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});
  let timer = null;

  function show(message) {
    const region = document.getElementById('app-toast');
    if (!region) return;

    const pill = document.createElement('div');
    pill.className = 'toast-pill';
    pill.setAttribute('role', 'status');
    const badge = document.createElement('span');
    badge.className = 'toast-badge';
    badge.setAttribute('aria-hidden', 'true');
    badge.textContent = '✓';
    const text = document.createElement('span');
    text.textContent = String(message == null ? '' : message);
    pill.append(badge, text);
    region.replaceChildren(pill);

    clearTimeout(timer);
    timer = setTimeout(() => {
      region.innerHTML = '';
    }, 2600);
  }

  function cleanup() {
    clearTimeout(timer);
    timer = null;
    const region = document.getElementById('app-toast');
    if (region) region.innerHTML = '';
  }

  PC.toast = { show, cleanup };
})(window);
