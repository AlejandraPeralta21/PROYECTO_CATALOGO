import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];
const checks = [];

function check(condition, message) {
  if (condition) checks.push(message);
  else errors.push(message);
}

function listJavaScript(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return listJavaScript(path);
    return entry.isFile() && path.endsWith('.js') ? [path] : [];
  });
}

const indexPath = join(projectRoot, 'index.html');
const index = readFileSync(indexPath, 'utf8');
check(/<html\s+lang="es"/i.test(index), 'HTML declares Spanish language');
check(/name="viewport"[^>]*width=device-width/i.test(index), 'responsive viewport is configured');
check(/<main\b/i.test(index) && /class="skip-link"/.test(index), 'main landmark and skip link are present');
check(/rel="manifest"\s+href="\.\/manifest\.json"/.test(index), 'PWA manifest is linked');

const localRefs = [...index.matchAll(/\b(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((url) => !/^(?:https?:|data:|#|\/\/)/i.test(url));
for (const resource of localRefs) {
  check(existsSync(join(projectRoot, decodeURIComponent(resource.split(/[?#]/)[0]))), `HTML resource exists: ${resource}`);
}

const manifestPath = join(projectRoot, 'manifest.json');
let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  check(manifest.display === 'standalone' && manifest.orientation === 'any', 'manifest enables installable portrait and landscape use');
  for (const icon of manifest.icons || []) check(existsSync(join(projectRoot, icon.src)), `PWA icon exists: ${icon.src}`);
} catch (error) {
  errors.push(`manifest.json is valid JSON: ${error.message}`);
}

const worker = readFileSync(join(projectRoot, 'service-worker.js'), 'utf8');
const precache = worker.match(/const PRECACHE_URLS = \[([\s\S]*?)\]\.map/);
check(Boolean(precache), 'service worker declares a precache list');
if (precache) {
  const paths = [...precache[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
  for (const resource of paths) check(existsSync(join(projectRoot, resource)), `pre-cached resource exists: ${resource}`);
}

for (const file of [...listJavaScript(join(projectRoot, 'src')), join(projectRoot, 'service-worker.js')]) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  check(result.status === 0, `JavaScript syntax: ${relative(projectRoot, file)}${result.status === 0 ? '' : ` — ${result.stderr.trim()}`}`);
}

const storage = new Map();
const fallbackProduct = { id: 'demo-product', name: 'Producto de prueba', category: 'pollos', price: 1, image: 'assets/original.png' };
const dataContext = {
  window: { PC_PRODUCTS_FALLBACK: [fallbackProduct] },
  localStorage: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
  },
  URL,
};
vm.runInNewContext(readFileSync(join(projectRoot, 'src/data/catalogData.js'), 'utf8'), dataContext);
const catalog = dataContext.window.PlanetChicken.data;
const normalizedDropbox = catalog.normalizeDropboxImageUrl('https://www.dropbox.com/s/example/product.jpg?dl=0');
check(normalizedDropbox === 'https://www.dropbox.com/s/example/product.jpg?raw=1', 'Dropbox sharing links normalize to a direct image preview');
check(!catalog.normalizeDropboxImageUrl('https://example.com/product.jpg'), 'non-Dropbox image links are rejected');
check(catalog.setProductImageOverride('demo-product', normalizedDropbox) && catalog.getProduct('demo-product').image === normalizedDropbox, 'a product image can be saved and applied');
check(catalog.clearProductImageOverride('demo-product') && catalog.getProduct('demo-product').image === fallbackProduct.image, 'the original product image can be restored');

const adminContext = {
  window: { PlanetChicken: dataContext.window.PlanetChicken },
  localStorage: dataContext.localStorage,
  Date,
  Intl,
};
vm.runInNewContext(readFileSync(join(projectRoot, 'src/pages/adminDashboardPage.js'), 'utf8'), adminContext);
const adminRoot = { innerHTML: '', querySelector: () => null };
adminContext.window.PlanetChicken.pages.admin.render(adminRoot);
check(adminRoot.innerHTML.includes('id="admin-product-images"') && adminRoot.innerHTML.includes('Enlace de Dropbox'), 'admin dashboard renders the Dropbox image editor');
check(adminRoot.innerHTML.includes('data-save-product-image="demo-product"') && adminRoot.innerHTML.includes('data-reset-product-image="demo-product"'), 'each product row can save or restore its image');

console.log(`Smoke Test ${errors.length ? 'REVISAR' : 'OK'} · ${checks.length} verificaciones correctas · ${errors.length} problema(s).`);
checks.forEach((message) => console.log(`✓ ${message}`));
errors.forEach((message) => console.error(`✗ ${message}`));
if (errors.length) process.exitCode = 1;
