# PLANET CHICKEN – Wings & Chicken

Aplicación web de catálogo gastronómico para **PLANET CHICKEN – Wings & Chicken**, desarrollada con arquitectura modular en HTML5, CSS3 y JavaScript.

## Estructura del Proyecto

- `index.html`: Shell principal de la aplicación sin scroll (`100dvh`).
- `assets/brand/`: Logotipo oficial de Planet Chicken.
- `assets/images/products/`: Fotografías de productos (hamburguesas, pollos, combos, acompañamientos y bebidas).
- `styles/`: Design tokens (`#ED101F`, `#B90016`, `#FFFFFF`, `#101114`, `#F3F3F3`), temas Claro/Oscuro y estilos por página.
- `src/config/theme.js`: Cambio de tema con persistencia en `localStorage`.
- `src/data/catalogData.js`: Catálogo de categorías, subcategorías, precios en Bolivianos (`Bs`), ingredientes y promociones.
- `src/data/products.json`: catálogo de 33 productos consumido asincrónicamente con Fetch API; valida la respuesta HTTP y el JSON, y mantiene un respaldo local.
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
- `src/pages/reservationPage.js`: solicitud para reservar combos del catálogo, con selección de producto, opciones, cantidad, nombre, teléfono, fecha y horario; conserva el historial local, encola la solicitud para sincronización y conserva los 12 combos disponibles como respaldo si no carga el JSON.
- La responsividad crítica escucha el foco y `visualViewport` para liberar espacio al teclado móvil; oculta temporalmente las barras, permite desplazar el formulario enfocado y compacta la interfaz en landscape. Los controles táctiles tienen área mínima de 44×44 px y los nombres largos usan truncado seguro.
- La lista dinámica del ejemplo Karaoke se adapta al carrito: productos y combos se agregan desde el catálogo, cantidades y eliminación se atienden con delegación de eventos y sus nombres se escapan/renderizan como texto seguro.
- Responsividad crítica: el teclado virtual oculta temporalmente las barras superior e inferior y permite desplazar el contenido enfocado; los controles táctiles miden al menos 44×44 px, los textos largos se truncan de forma segura y el modo horizontal compacto ajusta el contenido.
- El bloque de lista dinámica del ejemplo Karaoke se aplica al carrito de productos y combos: las filas se agregan desde el catálogo, los botones de cantidad/quitar usan delegación de eventos, y el contenido generado se presenta sin inyectar HTML del usuario.

## Seguridad y optimización

- Las reservas crean los elementos del historial con `textContent`; el nombre se muestra como texto, incluso si contiene etiquetas HTML. Las notificaciones también usan nodos de texto y el nombre editable del perfil se pinta con `textContent`.
- El proyecto carga scripts clásicos IIFE desde `index.html` y no tiene módulos ES ni empaquetador; por eso no puede ejecutar Tree Shaking automático. La auditoría manual no encontró librerías externas JavaScript sin uso: jQuery se usa en validaciones y efectos, y las fuentes enlazadas se usan en los estilos. No se añadió otra dependencia.
- Para activar Tree Shaking de empaquetado, habría que migrar los módulos globales a `import`/`export` y agregar una etapa de build (por ejemplo, esbuild o Rollup). La implementación de reservas y XSS queda operativa sin cambiar la arquitectura actual.

## PWA Offline-First

- `manifest.json` declara nombre, inicio, alcance, modo standalone, colores e icono de la marca.
- `service-worker.js` precachea el shell y el JSON del catálogo; las imágenes de productos se guardan bajo demanda al solicitarse, para respetar el lazy loading. Sirve desde Cache Storage sin red y puede vaciar la cola local con Background Sync.
- jQuery se distribuye en `vendor/` para que los controles no dependan del CDN al estar offline. Las fuentes de Google se guardan en caché en el primer uso con conexión; si no están disponibles, se usan las fuentes de respaldo del sistema.
- Las imágenes de tarjetas, miniaturas y categorías usan `loading="lazy"` y `decoding="async"`; logo y contenido protagonista conservan carga prioritaria para la primera vista.
- Catálogo, tema, perfil, favoritos y carrito ya persisten en el dispositivo. Contactos y pedidos nuevos se guardan en IndexedDB (con respaldo en localStorage) y quedan indicados como pendientes.
- Para enviar la cola a un servidor, configura `content` de `<meta name="pc-sync-endpoint">` con una API que acepte `POST` JSON e Idempotency-Key. Este proyecto no contiene backend; mientras el endpoint esté vacío, la cola se conserva localmente y no se marca falsamente como enviada.
- Prueba el service worker desde `localhost` o GitHub Pages/HTTPS; los navegadores no lo habilitan cuando se abre `index.html` como `file://`.
- `diagnostico.html` ofrece la herramienta autónoma de la guía para revisar clases susceptibles a bloqueadores y alturas rígidas `100vh`.

## Entrega para celular

- Las imágenes están organizadas por tipo en `assets/images/products/`: `chicken`, `burgers`, `wings`, `combos`, `drinks` y `sides`.
- Se corrigieron las imágenes de los combos para que las porciones de pollo usen pollo, las variantes Five Burger usen hamburguesas y los combos Wings muestren alitas.
- El service worker ahora precarga las 12 imágenes del catálogo, con caché `v8`, para que también estén disponibles sin conexión una vez instalada la PWA.
- `LEEME-PARA-CELULAR.txt` explica cómo abrir la vista en un teléfono y cómo instalarla desde HTTPS para usarla offline.
- El ZIP `PLANET_CHICKEN_CELULAR.zip` contiene el sitio listo para extraer y publicar. La PWA requiere HTTPS; abrir `index.html` directamente como archivo no activa el service worker.

- `src/data/products-fallback.js` incluye el respaldo integrado del catálogo: los 33 productos se muestran incluso si se abre `index.html` localmente y el navegador bloquea `fetch` a `products.json`. La instalación PWA y el service worker todavía requieren `localhost` o HTTPS.

## Vista en laptop

- A partir de 1025 px el shell ocupa el ancho y alto disponibles, manteniendo el mismo tema, navegación y componentes. El contenido conserva un ancho máximo legible de 1400 px y el catálogo distribuye sus tarjetas en la cuadrícula existente. En tablet y celular siguen aplicando las mismas reglas responsive.
- La caché del service worker se actualizó a v11 para refrescar los estilos y el respaldo del catálogo\.

- En laptop, la portada distribuye las seis categorías en tres columnas y dos filas, con tarjetas proporcionadas y las mismas imágenes y colores del diseño original.

- En laptops la portada usa el alto disponible del área central, amplía las fotos y lleva las tarjetas a un ancho máximo de 1680 px para evitar márgenes vacíos en pantallas grandes.

- En celulares hasta 520 px el encabezado compacta tipografía y controles; la última categoría queda centrada y se separan mejor las tarjetas.

- Se añadieron reglas diferenciadas para teléfonos, tablets, orientación horizontal y pantallas de poca altura; se habilitó el zoom de accesibilidad del navegador.

- El desplazamiento vertical se activa solo en orientación horizontal con altura de hasta 640 px; en vertical se mantiene el shell sin scroll global.
