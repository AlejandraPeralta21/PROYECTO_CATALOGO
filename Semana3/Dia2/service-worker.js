/* Offline-first shell, static cache and Background Sync outbox. */
const APP_VERSION = 'v62';
const SHELL_CACHE = `planet-chicken-shell-${APP_VERSION}`;
const RUNTIME_CACHE = `planet-chicken-runtime-${APP_VERSION}`;
const DB_NAME = 'planet-chicken-offline';
const DB_VERSION = 1;
const OUTBOX_STORE = 'outbox';
const CONFIG_STORE = 'config';
const APP_BASE = new URL('./', self.location.href);
const APP_INDEX = new URL('index.html', APP_BASE).href;
const PRECACHE_URLS = [
  'index.html', 'manifest.json', 'diagnostico.html', 'service-worker.js', 'vendor/jquery-3.7.1.min.js',
  'styles/tokens.css', 'styles/base.css', 'styles/media.css', 'styles/components.css', 'styles/pages.css',
  'src/config/theme.js', 'src/icons/brandIcons.js', 'src/layout/imageLayout.js', 'src/data/products-fallback.js', 'src/data/catalogData.js', 'src/data/products.json',
  'src/router/router.js', 'src/components/toast.js', 'src/components/header.js', 'src/components/bottomNav.js',
  'src/components/sideDrawer.js', 'src/components/filterModal.js', 'src/pages/splashPage.js',
  'src/pages/welcomePage.js', 'src/pages/homeMenuPage.js', 'src/pages/catalogPage.js',
  'src/pages/productDetailPage.js', 'src/pages/cartPage.js', 'src/pages/promotionsPage.js',
  'src/pages/profilePage.js', 'src/pages/adminDashboardPage.js', 'src/pages/deliveryPage.js', 'src/pages/reservationPage.js', 'src/pages/toolsPage.js',
  'src/pages/loginPage.js', 'src/auth/auth.js', 'src/pwa/offlineQueue.js', 'src/pwa/pwa.js', 'src/app.js',
  'assets/brand/logo-planet-chicken.png', 'assets/brand/pwa-icon.svg', 'assets/brand/pwa-192.png', 'assets/brand/pwa-512.png', 'assets/brand/logo-original.jpg',
  'assets/images/category-patterns/pollos.svg', 'assets/images/category-patterns/hamburguesas.svg',
  'assets/images/category-patterns/wings.svg', 'assets/images/category-patterns/combos.svg',
  'assets/images/delivery-moto.svg',
  'assets/images/category-patterns/bebidas.svg', 'assets/images/category-patterns/acompanamientos.svg',
  // Se precargan las fotos del catálogo para que todo el menú siga visible sin red.
  'assets/images/products/sides/sides-nuggets.png', 'assets/images/products/sides/sides-fries.png',
  'assets/images/products/drinks/drink-soda.png', 'assets/images/products/drinks/drink-shake.png',
  'assets/images/products/combos/combo-family.png', 'assets/images/products/combos/combo-classic.png',
  'assets/images/products/wings/chicken-wings.png', 'assets/images/products/chicken/chicken-platter.png',
  'assets/images/products/burgers/burger-veggie.png', 'assets/images/products/burgers/burger-double.png',
  'assets/images/products/burgers/burger-classic.png', 'assets/images/products/burgers/burger-bbq.png'
].map((path) => new URL(path, APP_BASE).href);

function openOfflineDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(OUTBOX_STORE)) db.createObjectStore(OUTBOX_STORE, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(CONFIG_STORE)) db.createObjectStore(CONFIG_STORE, { keyPath: 'key' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readSyncConfig() {
  const db = await openOfflineDb();
  const endpoint = await new Promise((resolve, reject) => {
    const transaction = db.transaction(CONFIG_STORE, 'readonly');
    const request = transaction.objectStore(CONFIG_STORE).get('syncEndpoint');
    request.onsuccess = () => resolve(request.result ? request.result.value : '');
    request.onerror = () => reject(request.error);
  });
  db.close();
  return endpoint;
}

async function saveSyncConfig(endpoint) {
  const db = await openOfflineDb();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction(CONFIG_STORE, 'readwrite');
    transaction.objectStore(CONFIG_STORE).put({ key: 'syncEndpoint', value: endpoint });
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}

async function syncOfflineOutbox() {
  if (!self.navigator.onLine) throw new Error('Offline; Background Sync will retry later.');
  const endpoint = await readSyncConfig();
  if (!endpoint) return;

  const db = await openOfflineDb();
  const records = await new Promise((resolve, reject) => {
    const transaction = db.transaction(OUTBOX_STORE, 'readonly');
    const request = transaction.objectStore(OUTBOX_STORE).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });

  try {
    for (const record of records) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': record.id },
        body: JSON.stringify(record),
        credentials: 'same-origin',
      });
      if (!response.ok) throw new Error(`Sync endpoint returned ${response.status}`);
      await new Promise((resolve, reject) => {
        const transaction = db.transaction(OUTBOX_STORE, 'readwrite');
        transaction.objectStore(OUTBOX_STORE).delete(record.id);
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
      });
    }
  } finally {
    db.close();
  }

  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  windows.forEach((client) => client.postMessage({ type: 'PC_SYNC_QUEUE_UPDATED' }));
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('planet-chicken-') && ![SHELL_CACHE, RUNTIME_CACHE].includes(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const requestUrl = new URL(request.url);
  const isAppAsset = requestUrl.origin === self.location.origin;
  const isProductImage = isAppAsset && requestUrl.pathname.includes('/assets/images/products/');
  const isGoogleFont = requestUrl.hostname === 'fonts.googleapis.com' || requestUrl.hostname === 'fonts.gstatic.com';
  const hostname = requestUrl.hostname.toLowerCase();
  const isDropboxHost = hostname === 'dropbox.com' || hostname.endsWith('.dropbox.com') || hostname === 'dropboxusercontent.com' || hostname.endsWith('.dropboxusercontent.com');
  const isDropboxImage = isDropboxHost && request.destination === 'image';
  const isUnsplashImage = hostname === 'images.unsplash.com' && request.destination === 'image';
  if (!isAppAsset && !isGoogleFont && !isDropboxImage && !isUnsplashImage) return;

  event.respondWith((async () => {
    const cache = await caches.open(isProductImage || isDropboxImage || isUnsplashImage || !isAppAsset ? RUNTIME_CACHE : SHELL_CACHE);
    const cached = await cache.match(request, { ignoreSearch: isAppAsset });
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response && (response.ok || (isDropboxImage && response.type === 'opaque'))) await cache.put(request, response.clone());
      return response;
    } catch (error) {
      if (request.mode === 'navigate') {
        const shell = await caches.match(APP_INDEX);
        if (shell) return shell;
      }
      return new Response('', { status: 503, statusText: 'Offline resource unavailable' });
    }
  })());
});

self.addEventListener('message', (event) => {
  const message = event.data || {};
  if (message.type === 'PC_SYNC_CONFIG') {
    event.waitUntil(saveSyncConfig(String(message.endpoint || '')));
  }
  if (message.type === 'PC_SYNC_NOW') {
    event.waitUntil(syncOfflineOutbox());
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'planet-chicken-outbox') event.waitUntil(syncOfflineOutbox());
});
