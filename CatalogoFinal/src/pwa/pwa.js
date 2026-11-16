/* PWA registration and small persistent connectivity state in the header. */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});
  let initialized = false;
  let statusRevision = 0;

  function updateNetworkStatus() {
    const currentRevision = ++statusRevision;
    const indicator = document.getElementById('estadoRed');
    if (!indicator) return;

    const online = navigator.onLine;
    const updateLabel = (pendingCount) => {
      if (currentRevision !== statusRevision) return;
      const pending = Number(pendingCount) || 0;
      const label = !online
        ? pending ? `${pending} local · offline` : 'Sin conexión'
        : pending ? `${pending} pendiente${pending === 1 ? '' : 's'}` : 'En línea';
      const accessibleLabel = !online
        ? pending ? `Sin conexión. ${pending} registro${pending === 1 ? '' : 's'} guardado${pending === 1 ? '' : 's'} localmente.` : 'Sin conexión. Datos locales disponibles.'
        : pending ? `En línea. ${pending} registro${pending === 1 ? '' : 's'} pendiente${pending === 1 ? '' : 's'} de sincronización.` : 'En línea';

      indicator.classList.toggle('is-online', online);
      indicator.classList.toggle('is-offline', !online);
      indicator.classList.toggle('has-pending', pending > 0);
      indicator.querySelector('.network-indicator-label').textContent = label;
      indicator.setAttribute('aria-label', accessibleLabel);
      indicator.title = accessibleLabel;
    };

    if (PC.syncQueue) PC.syncQueue.getPendingCount().then(updateLabel).catch(() => updateLabel(0));
    else updateLabel(0);
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator) || !/^https?:$/.test(global.location.protocol)) return;
    navigator.serviceWorker.register('./service-worker.js', { scope: './' })
      .then(() => {
        if (PC.syncQueue) PC.syncQueue.registerBackgroundSync();
      })
      .catch((error) => console.warn('No se pudo registrar la PWA:', error));
  }

  function handleOnline() {
    updateNetworkStatus();
    if (PC.syncQueue) PC.syncQueue.flush().finally(updateNetworkStatus);
  }

  function init() {
    if (initialized) return;
    initialized = true;
    $(global)
      .off('.planetChickenPwa')
      .on('online.planetChickenPwa offline.planetChickenPwa', updateNetworkStatus)
      .on('pc:sync-queue-change.planetChickenPwa', updateNetworkStatus);

    if ('serviceWorker' in navigator) {
      $(navigator.serviceWorker)
        .off('message.planetChickenPwa')
        .on('message.planetChickenPwa', (event) => {
          if (event.originalEvent.data && event.originalEvent.data.type === 'PC_SYNC_QUEUE_UPDATED') updateNetworkStatus();
        });
      const loadRegistration = () => registerServiceWorker();
      if (document.readyState === 'complete') loadRegistration();
      else global.addEventListener('load', loadRegistration, { once: true });
    }
    updateNetworkStatus();
  }

  PC.pwa = { init, updateNetworkStatus };
})(window);
