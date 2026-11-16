# PLANET CHICKEN – Wings & Chicken

Aplicación web de catálogo gastronómico para **PLANET CHICKEN – Wings & Chicken**, desarrollada con arquitectura modular en HTML5, CSS3 y JavaScript.

## Estructura del Proyecto

- `index.html`: Shell principal de la aplicación sin scroll (`100dvh`).
- `assets/brand/`: Logotipo oficial de Planet Chicken.
- `assets/images/products/`: Fotografías de productos (hamburguesas, pollos, combos, acompañamientos y bebidas).
- `styles/`: Design tokens (`#ED101F`, `#B90016`, `#FFFFFF`, `#101114`, `#F3F3F3`), temas Claro/Oscuro y estilos por página.
- `src/config/theme.js`: Cambio de tema con persistencia en `localStorage`.
- `src/data/catalogData.js`: Catálogo de categorías, subcategorías, precios en Bolivianos (`Bs`), ingredientes y promociones.
- El catálogo incluye porciones Chicken, combos de pollo, Five Burger y sus combos, y Wings con opciones de salsa/bebida. Los precios corresponden a la lista original proporcionada.
- Categorías en orden: Chicken, Hamburguesas, Wings, Combos, Bebidas y Acompañamientos. Wings tiene sus productos de alitas separados del pollo entero/crujiente.
- `src/icons/brandIcons.js`: Ilustraciones SVG espaciales y de comida.
- `src/layout/imageLayout.js` + `styles/media.css`: Función `PC.renderImage()` que aplica el layout a todas las imágenes (presets `logo`, `brand`, `category`, `card`, `hero`, `promo`, `thumb`): tamaño intrínseco/aspect-ratio, object-fit, lazy/eager, fade-in y fallback.
- `src/router/router.js`: Navegación por rutas hash entre todas las pantallas independientes.
- `src/components/`: Header, Barra de navegación inferior fija, Menú lateral, Modal de filtros y Notificaciones.
- `src/pages/`: Páginas independientes (`Splash`, `Bienvenida`, `Menú Principal`, `Catálogo`, `Detalle del Producto`, `Promociones` y `Perfil`).
- La guía PWA se aplica con detección móvil/tablet, viewport, marco centrado en escritorio, navegación hamburguesa con efecto jQuery, filtro en cascada de categoría/subcategoría/productos y formulario de contacto validado en el cliente.
- `src/pages/loginPage.js` + `src/auth/auth.js`: Inicio de sesión opcional. El menú y carrito son públicos; se solicita login solo al confirmar un pedido. Incluye selección de Usuario/Administrador, validaciones y efectos jQuery (`slideDown`, `slideUp`, `fadeIn`, `fadeOut`, `fadeTo`, `animate`, `addClass` y `removeClass`). Las cuentas de demostración están indicadas en la pantalla de acceso.
- `src/pages/cartPage.js`: Carrito persistente con controles de cantidad, eliminación de productos y acceso al login en el momento de confirmar el pedido.

## PWA Offline-First

- `manifest.json` declara nombre, inicio, alcance, modo standalone, colores e icono de la marca.
- `service-worker.js` precachea la app y sus imágenes, sirve las vistas desde Cache Storage cuando no hay red y puede vaciar la cola local con Background Sync.
- jQuery se distribuye en `vendor/` para que los controles no dependan del CDN al estar offline. Las fuentes de Google se guardan en caché en el primer uso con conexión; si no están disponibles, se usan las fuentes de respaldo del sistema.
- Catálogo, tema, perfil, favoritos y carrito ya persisten en el dispositivo. Contactos y pedidos nuevos se guardan en IndexedDB (con respaldo en localStorage) y quedan indicados como pendientes.
- Para enviar la cola a un servidor, configura `content` de `<meta name="pc-sync-endpoint">` con una API que acepte `POST` JSON e Idempotency-Key. Este proyecto no contiene backend; mientras el endpoint esté vacío, la cola se conserva localmente y no se marca falsamente como enviada.
- Prueba el service worker desde `localhost` o GitHub Pages/HTTPS; los navegadores no lo habilitan cuando se abre `index.html` como `file://`.
- `diagnostico.html` ofrece la herramienta autónoma de la guía para revisar clases susceptibles a bloqueadores y alturas rígidas `100vh`.
