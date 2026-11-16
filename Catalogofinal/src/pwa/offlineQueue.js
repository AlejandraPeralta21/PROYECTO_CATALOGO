/* Durable local outbox for contact forms and orders; syncs only to a configured API. */
(function (global) {
  const DB_NAME = 'planet-chicken-offline';
  const DB_VERSION = 1;
  const OUTBOX_STORE = 'outbox';
  const FALLBACK_KEY = 'planet_chicken_offline_outbox';
  let databasePromise = null;

  function endpoint() {
    const meta = document.querySelector('meta[name="pc-sync-endpoint"]');
    return String(global.PC_SYNC_ENDPOINT || (meta && meta.content) || '').trim();
  }

  function openDatabase() {
    if (!('indexedDB' in global)) return Promise.reject(new Error('IndexedDB unavailable'));
    if (!databasePromise) {
      databasePromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(OUTBOX_STORE)) db.createObjectStore(OUTBOX_STORE, { keyPath: 'id' });
          if (!db.objectStoreNames.contains('config')) db.createObjectStore('config', { keyPath: 'key' });
        };
        request.onsuccess = () => {
          const db = request.result;
          db.onversionchange = () => db.close();
          resolve(db);
        };
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error('Offline database upgrade is blocked'));
      }).catch((error) => {
        databasePromise = null;
        throw error;
      });
    }
    return databasePromise;
  }

  async function readRecords() {
    try {
      const db = await openDatabase();
      return await new Promise((resolve, reject) => {
        const transaction = db.transaction(OUTBOX_STORE, 'readonly');
        const request = transaction.objectStore(OUTBOX_STORE).getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      try { return JSON.parse(localStorage.getItem(FALLBACK_KEY) || '[]'); } catch (e) { return []; }
    }
  }

  async function storeRecord(record) {
    try {
      const db = await openDatabase();
      await new Promise((resolve, reject) => {
        const transaction = db.transaction(OUTBOX_STORE, 'readwrite');
        transaction.objectStore(OUTBOX_STORE).put(record);
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error || new Error('Could not save offline record'));
      });
    } catch (error) {
      const records = await readRecords();
      const position = records.findIndex((item) => item.id === record.id);
      if (position >= 0) records[position] = record;
      else records.push(record);
      localStorage.setItem(FALLBACK_KEY, JSON.stringify(records));
    }
  }

  async function deleteRecord(id) {
    try {
      const db = await openDatabase();
      await new Promise((resolve, reject) => {
        const transaction = db.transaction(OUTBOX_STORE, 'readwrite');
        transaction.objectStore(OUTBOX_STORE).delete(id);
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (error) {
      const records = (await readRecords()).filter((item) => item.id !== id);
      localStorage.setItem(FALLBACK_KEY, JSON.stringify(records));
    }
  }

  function notifyQueueChanged() {
    global.dispatchEvent(new CustomEvent('pc:sync-queue-change'));
  }

  function makeId() {
    return global.crypto && typeof global.crypto.randomUUID === 'function'
      ? global.crypto.randomUUID()
      : `pc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  async function registerBackgroundSync() {
    const target = endpoint();
    if (!target || !('serviceWorker' in navigator)) return;
    try {
      const registration = await navigator.serviceWorker.ready;
      const worker = registration.active || navigator.serviceWorker.controller;
      if (worker) worker.postMessage({ type: 'PC_SYNC_CONFIG', endpoint: target });
      if (registration.sync) await registration.sync.register('planet-chicken-outbox');
    } catch (error) {
      // Foreground online events remain the fallback when Background Sync is unavailable.
    }
  }

  async function enqueue(type, payload) {
    const record = {
      id: makeId(),
      type: String(type),
      payload,
      status: 'pending',
      createdAt: new Date().toISOString(),
      attempts: 0,
    };
    await storeRecord(record);
    notifyQueueChanged();
    if (navigator.onLine) {
      const result = await flush();
      return { record, synced: result.synced, pending: result.pending };
    }
    await registerBackgroundSync();
    return { record, synced: false, pending: await getPendingCount() };
  }

  async function getPendingCount() {
    const records = await readRecords();
    return records.filter((record) => record.status === 'pending').length;
  }

  async function flush() {
    const target = endpoint();
    if (!navigator.onLine || !target) {
      return { synced: 0, pending: await getPendingCount(), configured: Boolean(target) };
    }

    await registerBackgroundSync();
    const records = (await readRecords()).filter((record) => record.status === 'pending');
    let synced = 0;
    for (const record of records) {
      try {
        const response = await fetch(target, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Idempotency-Key': record.id },
          body: JSON.stringify(record),
          credentials: 'same-origin',
        });
        if (!response.ok) throw new Error(`Sync endpoint returned ${response.status}`);
        await deleteRecord(record.id);
        synced += 1;
      } catch (error) {
        record.attempts = (record.attempts || 0) + 1;
        await storeRecord(record);
      }
    }
    notifyQueueChanged();
    return { synced, pending: await getPendingCount(), configured: true };
  }

  global.PlanetChicken = global.PlanetChicken || {};
  global.PlanetChicken.syncQueue = { enqueue, flush, getPendingCount, registerBackgroundSync };
})(window);
