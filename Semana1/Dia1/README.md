# PLANET CHICKEN – Wings & Chicken

Aplicación web de catálogo gastronómico para **PLANET CHICKEN – Wings & Chicken**, desarrollada con arquitectura modular en HTML5, CSS3 y JavaScript.

## Estructura del Proyecto

- `index.html`: Shell principal de la aplicación sin scroll (`100dvh`).
- `assets/brand/`: Logotipo oficial de Planet Chicken.
- `assets/images/products/`: Fotografías de productos (hamburguesas, pollos, combos, acompañamientos y bebidas).
- `styles/`: Design tokens (`#ED101F`, `#B90016`, `#FFFFFF`, `#101114`, `#F3F3F3`), temas Claro/Oscuro y estilos por página.
- `src/config/theme.js`: Cambio de tema con persistencia en `localStorage`.
- `src/data/catalogData.js`: Catálogo de categorías, subcategorías, precios en Bolivianos (`Bs`), ingredientes y promociones.
- `src/icons/brandIcons.js`: Ilustraciones SVG espaciales y de comida.
- `src/router/router.js`: Navegación por rutas hash entre todas las pantallas independientes.
- `src/components/`: Header, Barra de navegación inferior fija, Menú lateral, Modal de filtros y Notificaciones.
- `src/pages/`: Páginas independientes (`Splash`, `Bienvenida`, `Menú Principal`, `Catálogo`, `Detalle del Producto`, `Promociones` y `Perfil`).
