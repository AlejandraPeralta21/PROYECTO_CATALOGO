/* ==========================================================================
   TOAST NOTIFICATION COMPONENT
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  // El usuario pidió desactivar todos los avisos emergentes de la aplicación.
  function show() {}

  function cleanup() {}

  PC.toast = { show, cleanup };
})(window);
