/* ==========================================================================
   CUSTOM BRAND, SPACE & FOOD ILLUSTRATIONS (SVG)
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  const icons = {
    /* Space Elements */
    orbitRing: () => `
      <svg class="orbit-ring-svg" viewBox="0 0 300 300" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="pcRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
            <stop offset="55%" stop-color="#FFE0E3" stop-opacity="0.75"/>
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.95"/>
          </linearGradient>
        </defs>
        <ellipse cx="150" cy="150" rx="134" ry="44" transform="rotate(-16 150 150)"
          stroke="url(#pcRingGrad)" stroke-width="10" stroke-linecap="round"
          stroke-dasharray="280 185" stroke-dashoffset="-20"/>
        <circle cx="38" cy="182" r="5" fill="#FFFFFF" opacity="0.9"/>
        <circle cx="264" cy="116" r="4" fill="#FFD100" opacity="0.95"/>
      </svg>`,

    rocketShip: () => `
      <svg viewBox="0 0 120 120" fill="none" aria-hidden="true">
        <path d="M26 94C18 102 10 110 8 112C15 112 24 106 32 98L26 94Z" fill="#FFD100"/>
        <path d="M31 89C23 99 17 104 14 106C22 104 30 98 37 92L31 89Z" fill="#FF6B2B"/>
        <g transform="rotate(45 60 60)">
          <path d="M60 12C76 28 80 54 76 80H44C40 54 44 28 60 12Z" fill="#FFFFFF"/>
          <path d="M60 12C69 21 73 32 75 42H45C47 32 51 21 60 12Z" fill="#ED101F"/>
          <path d="M44 62L30 78L44 80V62Z" fill="#B90016"/>
          <path d="M76 62L90 78L76 80V62Z" fill="#B90016"/>
          <circle cx="60" cy="54" r="10" fill="#101114" stroke="#ED101F" stroke-width="3"/>
          <circle cx="57" cy="51" r="3" fill="#FFFFFF" opacity="0.8"/>
          <rect x="49" y="80" width="22" height="7" rx="3" fill="#3B3E47"/>
        </g>
      </svg>`,

    splashPlanets: () => `
      <svg viewBox="0 0 420 160" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <radialGradient id="planetLeft" cx="40%" cy="30%" r="68%">
            <stop offset="0%" stop-color="#FF3D4B"/>
            <stop offset="60%" stop-color="#C90014"/>
            <stop offset="100%" stop-color="#6F000B"/>
          </radialGradient>
          <radialGradient id="planetRight" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#B90016"/>
            <stop offset="70%" stop-color="#78000E"/>
            <stop offset="100%" stop-color="#3F0006"/>
          </radialGradient>
        </defs>
        <circle cx="330" cy="148" r="96" fill="url(#planetRight)"/>
        <ellipse cx="305" cy="112" rx="16" ry="8" fill="#5A000A" opacity="0.5"/>
        <ellipse cx="362" cy="128" rx="11" ry="6" fill="#5A000A" opacity="0.45"/>
        <circle cx="115" cy="164" r="118" fill="url(#planetLeft)"/>
        <ellipse cx="80" cy="108" rx="22" ry="11" transform="rotate(-14 80 108)" fill="#9E0011" opacity="0.65"/>
        <ellipse cx="148" cy="124" rx="16" ry="8" transform="rotate(10 148 124)" fill="#9E0011" opacity="0.55"/>
        <circle cx="54" cy="138" r="9" fill="#9E0011" opacity="0.5"/>
      </svg>`,

    sparkleStar: () => `
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"/>
      </svg>`,

    planetMini: () => `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="6" fill="currentColor"/>
        <ellipse cx="12" cy="12" rx="11" ry="3.8" transform="rotate(-20 12 12)" stroke="currentColor" stroke-width="1.8"/>
      </svg>`,

    /* Custom Food Illustrations for Categories & Subcategories */
    foodBurger: () => `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 10C4 6.5 7.6 4 12 4C16.4 4 20 6.5 20 10H4Z"/>
        <path d="M3.5 13C5 14 6.5 12 8 13C9.5 14 11 12 12.5 13C14 14 15.5 12 17 13C18.5 14 19.5 12.5 20.5 13"/>
        <rect x="4" y="15.5" width="16" height="3" rx="1.5"/>
        <circle cx="9.5" cy="7" r="0.6" fill="currentColor"/>
        <circle cx="14.5" cy="7" r="0.6" fill="currentColor"/>
      </svg>`,

    foodBurgerDouble: () => `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 8.5C4 5.5 7.5 3.5 12 3.5C16.5 3.5 20 5.5 20 8.5H4Z"/>
        <rect x="3.5" y="10.5" width="17" height="2.4" rx="1.2"/>
        <rect x="3.5" y="14.5" width="17" height="2.4" rx="1.2"/>
        <path d="M4.5 19H19.5C19.5 20.2 18.5 21 17 21H7C5.5 21 4.5 20.2 4.5 19Z"/>
      </svg>`,

    foodBurgerSpecial: () => `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 2L13.1 4.2L15.5 4.5L13.8 6.2L14.2 8.5L12 7.4L9.8 8.5L10.2 6.2L8.5 4.5L10.9 4.2L12 2Z" fill="currentColor" stroke="none"/>
        <path d="M4.5 12.5C4.5 10.5 7.8 9 12 9C16.2 9 19.5 10.5 19.5 12.5H4.5Z"/>
        <path d="M3.5 15H20.5"/>
        <path d="M4.5 17.5H19.5V18.5C19.5 19.8 18.4 20.8 17 20.8H7C5.6 20.8 4.5 19.8 4.5 18.5V17.5Z"/>
      </svg>`,

    foodVeggie: () => `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M19 5C11 5 6 9.5 6 17C13.5 17 19 12.5 19 5Z"/>
        <path d="M5 19C8 15 12 12 16 9"/>
      </svg>`,

    foodChicken: () => `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M15.5 4.5C18.5 4.5 20.5 7 19.5 10.2C18.8 12.5 16.5 14 14 14.5L10.2 18.3C9.4 19.1 8 19.1 7.2 18.3L5.7 16.8C4.9 16 4.9 14.6 5.7 13.8L9.5 10C10 7.5 12.5 4.5 15.5 4.5Z"/>
        <circle cx="5.2" cy="18.8" r="1.4"/>
        <circle cx="7.4" cy="20.4" r="1.1"/>
      </svg>`,

    foodCombo: () => `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M14 4H20L19 19H15L14 4Z"/>
        <path d="M17 4L18.5 1.5"/>
        <path d="M3 13C3 10.5 5.4 9 8.2 9C11 9 13.2 10.5 13.2 13H3Z"/>
        <path d="M3 15.5H13.2V17C13.2 18.2 12.2 19 11 19H5.2C4 19 3 18.2 3 17V15.5Z"/>
      </svg>`,

    foodFries: () => `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M7 9V4M10.5 9V3M14 9V4.5M17 9V5.5"/>
        <path d="M5 9H19L17.5 20H6.5L5 9Z"/>
        <circle cx="12" cy="14.5" r="1.8"/>
      </svg>`,

    foodDrink: () => `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 7L14.5 2.5H17"/>
        <path d="M6.5 7H17.5L16 20.5H8L6.5 7Z"/>
        <path d="M5.5 7H18.5"/>
      </svg>`,

    /* Navigation & Utility Icons (Strictly NO Cart Icons!) */
    navHome: () => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 10.5L12 3L21 10.5V20A1 1 0 0 1 20 21H15V14.5H9V21H4A1 1 0 0 1 3 20V10.5Z"/>
      </svg>`,

    navMenu: () => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="2"/>
        <rect x="13" y="3" width="8" height="8" rx="2"/>
        <rect x="3" y="13" width="8" height="8" rx="2"/>
        <rect x="13" y="13" width="8" height="8" rx="2"/>
      </svg>`,

    navPromos: () => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20.59 13.41L13.42 20.58A2 2 0 0 1 10.59 20.58L3 13V3H13L20.59 10.59A2 2 0 0 1 20.59 13.41Z"/>
        <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor"/>
      </svg>`,

    navProfile: () => `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4.5 20C5.8 16.6 8.6 15 12 15C15.4 15 18.2 16.6 19.5 20"/>
      </svg>`,

    sun: () => `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>`,

    moon: () => `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>
      </svg>`,

    menuBurger: () => `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
        <path d="M4 6h16M4 12h16M4 18h10"/>
      </svg>`,

    arrowLeft: () => `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>`,

    chevronRight: () => `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M9 18l6-6-6-6"/>
      </svg>`,

    search: () => `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>`,

    sliders: () => `
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="4" y1="6" x2="20" y2="6"/><circle cx="9" cy="6" r="2" fill="var(--bg-app)"/>
        <line x1="4" y1="12" x2="20" y2="12"/><circle cx="16" cy="12" r="2" fill="var(--bg-app)"/>
        <line x1="4" y1="18" x2="20" y2="18"/><circle cx="11" cy="18" r="2" fill="var(--bg-app)"/>
      </svg>`,

    heart: (filled = false) => `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/>
      </svg>`,

    share: () => `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>`,

    nutrition: () => `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 2v4M4.93 7.93l2.83 2.83M19.07 7.93l-2.83 2.83"/>
        <circle cx="12" cy="14" r="6"/>
        <path d="M12 11v3l2 1"/>
      </svg>`,

    ingredients: () => `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 12h16M7 7h10M9 17h6"/>
      </svg>`,

    close: () => `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" aria-hidden="true">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>`,

    mapPin: () => `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0Z"/><circle cx="12" cy="10" r="3"/>
      </svg>`,

    clock: () => `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
      </svg>`,
  };

  PC.icons = icons;
})(window);
