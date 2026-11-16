/* ==========================================================================
   CATALOG DATA: CATEGORIES, SUBCATEGORIES, PRODUCTS & PROMOTIONS (Bs)
   ========================================================================== */
(function (global) {
  const PC = (global.PlanetChicken = global.PlanetChicken || {});

  const CATEGORIES = [
    {
      id: 'pollos',
      name: 'Chicken',
      subtitle: 'Pollo dorado al spiedo y crujiente',
      image: 'assets/images/products/chicken-platter.png',
      icon: 'foodChicken',
      variant: 'hero',
      searchPlaceholder: 'Buscar pollo...',
      subcategories: [
        { id: 'todas', name: 'Todos', icon: 'navMenu' },
        { id: 'porciones', name: 'Porciones', icon: 'foodChicken' },
        { id: 'familiares', name: 'Familiares', icon: 'foodBurgerDouble' },
      ],
    },
    {
      id: 'hamburguesas',
      name: 'Hamburguesas',
      subtitle: 'Crujientes por fuera, jugosas por dentro',
      image: 'assets/images/products/burger-classic.png',
      icon: 'foodBurger',
      variant: 'red',
      searchPlaceholder: 'Buscar hamburguesas...',
      subcategories: [
        { id: 'todas', name: 'Todas', icon: 'navMenu' },
        { id: 'clasicas', name: 'Clásicas', icon: 'foodBurger' },
        { id: 'especiales', name: 'Especiales', icon: 'foodBurgerSpecial' },
        { id: 'combos', name: 'Combos', icon: 'foodCombo' },
      ],
    },
    {
      id: 'wings',
      name: 'Wings',
      subtitle: 'Alitas crocantes con salsa galáctica',
      image: 'assets/images/products/chicken-wings.png',
      icon: 'foodChicken',
      variant: 'gold',
      searchPlaceholder: 'Buscar wings y alitas...',
      subcategories: [
        { id: 'todas', name: 'Todas', icon: 'navMenu' },
        { id: 'porciones', name: 'Porciones', icon: 'foodChicken' },
        { id: 'combos', name: 'Combos', icon: 'foodCombo' },
      ],
    },
    {
      id: 'combos',
      name: 'Combos',
      subtitle: 'Tu menú completo en un solo paquete',
      image: 'assets/images/products/combo-classic.png',
      icon: 'foodCombo',
      variant: 'red',
      searchPlaceholder: 'Buscar combos...',
      subcategories: [
        { id: 'todas', name: 'Todos', icon: 'navMenu' },
        { id: 'pollo', name: 'Chicken', icon: 'foodChicken' },
        { id: 'especiales', name: 'Especiales', icon: 'foodBurgerSpecial' },
      ],
    },
    {
      id: 'bebidas',
      name: 'Bebidas',
      subtitle: 'Refrescantes bien heladas',
      image: 'assets/images/products/drink-soda.png',
      icon: 'foodDrink',
      variant: 'red',
      searchPlaceholder: 'Buscar bebidas...',
      subcategories: [
        { id: 'todas', name: 'Todas', icon: 'navMenu' },
        { id: 'gaseosas', name: 'Gaseosas', icon: 'foodDrink' },
        { id: 'batidos', name: 'Batidos & Fruta', icon: 'foodBurgerSpecial' },
      ],
    },
    {
      id: 'acompanamientos',
      name: 'Acompañamientos',
      subtitle: 'Papas doradas, nuggets y aros',
      image: 'assets/images/products/sides-fries.png',
      icon: 'foodFries',
      variant: 'red',
      searchPlaceholder: 'Buscar acompañamientos...',
      subcategories: [
        { id: 'todas', name: 'Todos', icon: 'navMenu' },
        { id: 'papas', name: 'Papas', icon: 'foodFries' },
        { id: 'extras', name: 'Nuggets & Aros', icon: 'foodChicken' },
      ],
    },
  ];

  const PRODUCTS = [
    /* ---------- CHICKEN: PORCIONES ---------- */
    {
      id: 'chicken-porcion-1', category: 'pollos', subcategory: 'porciones',
      name: 'Porción 1 - 1 presa + papas',
      description: 'Una presa de pollo a elección entre ala, pierna o entrepierna, acompañada de papas fritas.',
      price: 28, previousPrice: null, image: 'assets/images/products/chicken-platter.png',
      sizes: [{ label: 'Porción', price: 28 }],
      optionGroups: [{ id: 'presa', label: 'Elige tu presa', choices: ['Ala', 'Pierna', 'Entrepierna'] }],
      ingredients: ['1 presa de pollo', 'Papas fritas'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 100, recency: 30, promoTag: null, promoType: null,
    },
    {
      id: 'chicken-porcion-2', category: 'pollos', subcategory: 'porciones',
      name: 'Porción 2 - 2 presas + papas',
      description: 'Dos presas de pollo acompañadas de papas fritas.',
      price: 38, previousPrice: null, image: 'assets/images/products/chicken-platter.png',
      sizes: [{ label: 'Porción', price: 38 }], ingredients: ['2 presas de pollo', 'Papas fritas'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 99, recency: 29, promoTag: null, promoType: null,
    },
    {
      id: 'chicken-porcion-2-0', category: 'pollos', subcategory: 'porciones',
      name: 'Porción 2.0 - Pecho y ala + papas',
      description: 'Dos presas específicas: pecho y ala, acompañadas de papas fritas.',
      price: 40, previousPrice: null, image: 'assets/images/products/chicken-platter.png',
      sizes: [{ label: 'Porción', price: 40 }], ingredients: ['1 presa de pecho', '1 ala', 'Papas fritas'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 98, recency: 28, promoTag: null, promoType: null,
    },
    {
      id: 'chicken-porcion-3', category: 'pollos', subcategory: 'porciones',
      name: 'Porción 3 - 3 presas + papas',
      description: 'Tres presas de pollo acompañadas de papas fritas.',
      price: 55, previousPrice: null, image: 'assets/images/products/chicken-platter.png',
      sizes: [{ label: 'Porción', price: 55 }], ingredients: ['3 presas de pollo', 'Papas fritas'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 97, recency: 27, promoTag: null, promoType: null,
    },
    {
      id: 'chicken-familiar', category: 'pollos', subcategory: 'familiares',
      name: 'Porción Familiar - 8 presas',
      description: 'Ocho presas de pollo con papas fritas y un jugo de 2 litros.',
      price: 152, previousPrice: null, image: 'assets/images/products/combo-family.png',
      sizes: [{ label: 'Familiar', price: 152 }], ingredients: ['8 presas de pollo', 'Papas fritas', 'Jugo de 2 L'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 96, recency: 26, promoTag: null, promoType: null,
    },

    /* ---------- COMBOS DE POLLO ---------- */
    {
      id: 'combo-pollo-1', category: 'combos', subcategory: 'pollo',
      name: 'Combo Chicken 1 - 1 presa',
      description: 'Una presa a elección (ala, pierna o entrepierna), papas fritas y refresco de 250 ml.',
      price: 33, previousPrice: null, image: 'assets/images/products/combo-classic.png',
      sizes: [{ label: 'Combo', price: 33 }],
      optionGroups: [{ id: 'presa', label: 'Elige tu presa', choices: ['Ala', 'Pierna', 'Entrepierna'] }],
      ingredients: ['1 presa de pollo', 'Papas fritas', 'Refresco 250 ml'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 100, recency: 25, promoTag: null, promoType: null,
    },
    {
      id: 'combo-pollo-2', category: 'combos', subcategory: 'pollo',
      name: 'Combo Chicken 2 - 2 presas',
      description: 'Dos presas de pollo, papas fritas y refresco de 250 ml.',
      price: 43, previousPrice: null, image: 'assets/images/products/combo-classic.png',
      sizes: [{ label: 'Combo', price: 43 }], ingredients: ['2 presas de pollo', 'Papas fritas', 'Refresco 250 ml'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 99, recency: 24, promoTag: null, promoType: null,
    },
    {
      id: 'combo-pollo-2-0', category: 'combos', subcategory: 'pollo',
      name: 'Combo Chicken 2.0 - Pecho + presa',
      description: 'Una presa de pecho y una segunda presa a elección, con papas fritas y refresco de 250 ml.',
      price: 45, previousPrice: null, image: 'assets/images/products/combo-classic.png',
      sizes: [{ label: 'Combo', price: 45 }],
      optionGroups: [{ id: 'segunda-presa', label: 'Elige la segunda presa', choices: ['Ala', 'Pierna', 'Entrepierna'] }],
      ingredients: ['1 presa de pecho', '1 presa a elección', 'Papas fritas', 'Refresco 250 ml'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 98, recency: 23, promoTag: null, promoType: null,
    },
    {
      id: 'combo-pollo-3', category: 'combos', subcategory: 'pollo',
      name: 'Combo Chicken 3 - 3 presas',
      description: 'Tres presas de pollo, papas fritas y refresco de 250 ml.',
      price: 59, previousPrice: null, image: 'assets/images/products/combo-family.png',
      sizes: [{ label: 'Combo', price: 59 }], ingredients: ['3 presas de pollo', 'Papas fritas', 'Refresco 250 ml'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 97, recency: 22, promoTag: null, promoType: null,
    },
    {
      id: 'combo-pipocas', category: 'combos', subcategory: 'especiales',
      name: 'Combo Pipocas',
      description: 'Pipocas de pollo acompañadas de papas fritas.',
      price: 35, previousPrice: null, image: 'assets/images/products/sides-nuggets.png',
      sizes: [{ label: 'Combo', price: 35 }], ingredients: ['Pipocas de pollo', 'Papas fritas'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 96, recency: 21, promoTag: null, promoType: null,
    },
    {
      id: 'combo-planet-sandwich', category: 'combos', subcategory: 'especiales',
      name: 'Combo Planet Sandwich Chicken',
      description: 'Sándwich de pollo con papas fritas y jugo de 500 ml.',
      price: 59, previousPrice: null, image: 'assets/images/products/combo-classic.png',
      sizes: [{ label: 'Combo', price: 59 }], ingredients: ['Sándwich de pollo', 'Papas fritas', 'Jugo 500 ml'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 95, recency: 20, promoTag: null, promoType: null,
    },

    /* ---------- HAMBURGUESAS FIVE BURGER ---------- */
    {
      id: 'five-burger', category: 'hamburguesas', subcategory: 'especiales',
      name: 'Five Burger',
      description: 'Dos carnes con queso cheddar, tocino, tomate, cebolla, lechuga, pepinillos y papas fritas.',
      price: 29, previousPrice: null, image: 'assets/images/products/burger-bbq.png',
      sizes: [{ label: 'Personal', price: 29 }],
      ingredients: ['2 carnes', 'Queso cheddar', 'Tocino', 'Tomate', 'Cebolla', 'Lechuga', 'Pepinillos', 'Papas fritas'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 100, recency: 19, promoTag: null, promoType: null,
    },
    {
      id: 'five-burger-cheese', category: 'hamburguesas', subcategory: 'especiales',
      name: 'Five Burger Cheese',
      description: 'Dos carnes con queso cheddar, tomate, cebolla, lechuga, pepinillos y papas fritas.',
      price: 26, previousPrice: null, image: 'assets/images/products/burger-classic.png',
      sizes: [{ label: 'Personal', price: 26 }],
      ingredients: ['2 carnes', 'Queso cheddar', 'Tomate', 'Cebolla', 'Lechuga', 'Pepinillos', 'Papas fritas'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 99, recency: 18, promoTag: null, promoType: null,
    },
    {
      id: 'five-burger-clasica', category: 'hamburguesas', subcategory: 'clasicas',
      name: 'Five Burger Clásica',
      description: 'Dos carnes con tomate, cebolla, lechuga, pepinillos y papas fritas.',
      price: 23, previousPrice: null, image: 'assets/images/products/burger-classic.png',
      sizes: [{ label: 'Personal', price: 23 }],
      ingredients: ['2 carnes', 'Tomate', 'Cebolla', 'Lechuga', 'Pepinillos', 'Papas fritas'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 98, recency: 17, promoTag: null, promoType: null,
    },
    {
      id: 'five-burger-bacon', category: 'hamburguesas', subcategory: 'especiales',
      name: 'Five Burger Bacon',
      description: 'Dos carnes con tocino, tomate, cebolla, lechuga, pepinillos y papas fritas.',
      price: 26, previousPrice: null, image: 'assets/images/products/burger-bbq.png',
      sizes: [{ label: 'Personal', price: 26 }],
      ingredients: ['2 carnes', 'Tocino', 'Tomate', 'Cebolla', 'Lechuga', 'Pepinillos', 'Papas fritas'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 97, recency: 16, promoTag: null, promoType: null,
    },
    {
      id: 'five-combo-1', category: 'hamburguesas', subcategory: 'combos',
      name: 'Combo 1 Five Burger',
      description: 'Five Burger con dos carnes, queso cheddar, tocino, vegetales, pepinillos, papas fritas y refresco de 300 ml.',
      price: 34, previousPrice: null, image: 'assets/images/products/combo-classic.png',
      sizes: [{ label: 'Combo', price: 34 }],
      ingredients: ['Five Burger', '2 carnes', 'Queso cheddar', 'Tocino', 'Tomate', 'Cebolla', 'Lechuga', 'Pepinillos', 'Papas fritas', 'Refresco 300 ml'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 96, recency: 15, promoTag: null, promoType: null,
    },
    {
      id: 'five-combo-2', category: 'hamburguesas', subcategory: 'combos',
      name: 'Combo 2 Five Burger Clásica',
      description: 'Five Burger Clásica con dos carnes, vegetales, pepinillos, papas fritas y refresco de 300 ml.',
      price: 25, previousPrice: null, image: 'assets/images/products/combo-classic.png',
      sizes: [{ label: 'Combo', price: 25 }],
      ingredients: ['Five Burger Clásica', '2 carnes', 'Tomate', 'Cebolla', 'Lechuga', 'Pepinillos', 'Papas fritas', 'Refresco 300 ml'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 95, recency: 14, promoTag: null, promoType: null,
    },
    {
      id: 'five-combo-3', category: 'hamburguesas', subcategory: 'combos',
      name: 'Combo 3 Five Burger Cheese',
      description: 'Five Burger Cheese con dos carnes, queso cheddar, vegetales, pepinillos, papas fritas y refresco de 300 ml.',
      price: 31, previousPrice: null, image: 'assets/images/products/combo-classic.png',
      sizes: [{ label: 'Combo', price: 31 }],
      ingredients: ['Five Burger Cheese', '2 carnes', 'Queso cheddar', 'Tomate', 'Cebolla', 'Lechuga', 'Pepinillos', 'Papas fritas', 'Refresco 300 ml'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 94, recency: 13, promoTag: null, promoType: null,
    },
    {
      id: 'five-combo-4', category: 'hamburguesas', subcategory: 'combos',
      name: 'Combo 4 Five Burger Bacon',
      description: 'Five Burger Bacon con dos carnes, tocino, vegetales, pepinillos, papas fritas y refresco de 300 ml.',
      price: 31, previousPrice: null, image: 'assets/images/products/combo-classic.png',
      sizes: [{ label: 'Combo', price: 31 }],
      ingredients: ['Five Burger Bacon', '2 carnes', 'Tocino', 'Tomate', 'Cebolla', 'Lechuga', 'Pepinillos', 'Papas fritas', 'Refresco 300 ml'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 93, recency: 12, promoTag: null, promoType: null,
    },

    /* ---------- WINGS: PORCIONES Y COMBOS ---------- */
    {
      id: 'wings-combo-6', category: 'wings', subcategory: 'combos',
      name: 'Combo Wings 1 - 6 piezas',
      description: 'Seis piezas de wings con papas fritas y refresco o jugo. Elige la salsa y la bebida.',
      price: 45, previousPrice: null, image: 'assets/images/products/chicken-wings.png',
      sizes: [{ label: 'Combo', price: 45 }],
      optionGroups: [
        { id: 'salsa', label: 'Elige la salsa', choices: ['Miel y mostaza', 'Barbacoa', 'Picante'] },
        { id: 'bebida', label: 'Elige la bebida', choices: ['Refresco', 'Jugo'] },
      ],
      ingredients: ['6 piezas de wings', 'Papas fritas', 'Refresco o jugo'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 100, recency: 11, promoTag: null, promoType: null,
    },
    {
      id: 'wings-combo-9', category: 'wings', subcategory: 'combos',
      name: 'Combo Wings 2 - 9 piezas',
      description: 'Nueve piezas de wings con papas fritas y refresco o jugo. Elige la salsa y la bebida.',
      price: 55, previousPrice: null, image: 'assets/images/products/chicken-wings.png',
      sizes: [{ label: 'Combo', price: 55 }],
      optionGroups: [
        { id: 'salsa', label: 'Elige la salsa', choices: ['Miel y mostaza', 'Barbacoa', 'Picante'] },
        { id: 'bebida', label: 'Elige la bebida', choices: ['Refresco', 'Jugo'] },
      ],
      ingredients: ['9 piezas de wings', 'Papas fritas', 'Refresco o jugo'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 99, recency: 10, promoTag: null, promoType: null,
    },
    {
      id: 'wings-6', category: 'wings', subcategory: 'porciones',
      name: 'Wings - 6 piezas',
      description: 'Seis piezas de wings con salsa a elección: miel y mostaza, barbacoa o picante.',
      price: 35, previousPrice: null, image: 'assets/images/products/chicken-wings.png',
      sizes: [{ label: 'Porción', price: 35 }],
      optionGroups: [{ id: 'salsa', label: 'Elige la salsa', choices: ['Miel y mostaza', 'Barbacoa', 'Picante'] }],
      ingredients: ['6 piezas de wings', 'Salsa a elección'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 98, recency: 9, promoTag: null, promoType: null,
    },
    {
      id: 'wings-9', category: 'wings', subcategory: 'porciones',
      name: 'Wings - 9 piezas',
      description: 'Nueve piezas de wings con salsa a elección: miel y mostaza, barbacoa o picante.',
      price: 46, previousPrice: null, image: 'assets/images/products/chicken-wings.png',
      sizes: [{ label: 'Porción', price: 46 }],
      optionGroups: [{ id: 'salsa', label: 'Elige la salsa', choices: ['Miel y mostaza', 'Barbacoa', 'Picante'] }],
      ingredients: ['9 piezas de wings', 'Salsa a elección'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 97, recency: 8, promoTag: null, promoType: null,
    },
    {
      id: 'wings-12', category: 'wings', subcategory: 'porciones',
      name: 'Wings - 12 piezas',
      description: 'Doce piezas de wings con salsa a elección: miel y mostaza, barbacoa o picante.',
      price: 58, previousPrice: null, image: 'assets/images/products/chicken-wings.png',
      sizes: [{ label: 'Porción', price: 58 }],
      optionGroups: [{ id: 'salsa', label: 'Elige la salsa', choices: ['Miel y mostaza', 'Barbacoa', 'Picante'] }],
      ingredients: ['12 piezas de wings', 'Salsa a elección'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 96, recency: 7, promoTag: null, promoType: null,
    },
    {
      id: 'wings-24', category: 'wings', subcategory: 'porciones',
      name: 'Wings - 24 piezas',
      description: 'Veinticuatro piezas de wings con salsa a elección: miel y mostaza, barbacoa o picante.',
      price: 104, previousPrice: null, image: 'assets/images/products/chicken-wings.png',
      sizes: [{ label: 'Porción', price: 104 }],
      optionGroups: [{ id: 'salsa', label: 'Elige la salsa', choices: ['Miel y mostaza', 'Barbacoa', 'Picante'] }],
      ingredients: ['24 piezas de wings', 'Salsa a elección'],
      nutrition: { kcal: '—', protein: '—', time: '—' }, popularity: 95, recency: 6, promoTag: null, promoType: null,
    },

    /* ---------- ACOMPAÑAMIENTOS ---------- */
    {
      id: 'side-papas-planet', category: 'acompanamientos', subcategory: 'papas',
      name: 'Papas Planet Doradas', description: 'Bastones de papa seleccionados con doble fritura crujiente y pizca de sal marina.',
      price: 12, previousPrice: null, image: 'assets/images/products/sides-fries.png',
      sizes: [{ label: 'Personal', price: 12 }, { label: 'Mediano', price: 16 }, { label: 'Grande', price: 22 }],
      ingredients: ['Papa seleccionada', 'Sal marina', 'Salsa Planet'],
      nutrition: { kcal: '340 kcal', protein: '5 g', time: '5 min' }, popularity: 96, recency: 11, promoTag: null, promoType: null,
    },
    {
      id: 'side-nuggets-aros', category: 'acompanamientos', subcategory: 'extras',
      name: 'Nuggets & Aros Mix', description: 'Nuggets de pechuga crujientes y aros de cebolla dorados con salsa BBQ.',
      price: 20, previousPrice: 25, image: 'assets/images/products/sides-nuggets.png',
      sizes: [{ label: 'Personal', price: 20 }, { label: 'Grande', price: 29 }],
      ingredients: ['6 Nuggets de pollo', '6 Aros de cebolla', 'Salsa BBQ / Ketchup'],
      nutrition: { kcal: '490 kcal', protein: '21 g', time: '7 min' }, popularity: 91, recency: 22, promoTag: '-20%', promoType: 'especial',
    },
    {
      id: 'side-papas-cheddar', category: 'acompanamientos', subcategory: 'papas',
      name: 'Papas Bravas Espaciales', description: 'Porción generosa de papas crocantes con especias paprika y salsa especial.',
      price: 15, previousPrice: null, image: 'assets/images/products/sides-fries.png',
      sizes: [{ label: 'Personal', price: 15 }, { label: 'Grande', price: 24 }],
      ingredients: ['Papas crujientes', 'Especias paprika', 'Mayonesa ajo'],
      nutrition: { kcal: '390 kcal', protein: '6 g', time: '6 min' }, popularity: 85, recency: 19, promoTag: null, promoType: null,
    },
    {
      id: 'side-nuggets-10', category: 'acompanamientos', subcategory: 'extras',
      name: 'Box Nuggets x10', description: 'Diez nuggets de pechuga dorados al instante con dos salsas a elección.',
      price: 24, previousPrice: null, image: 'assets/images/products/sides-nuggets.png',
      sizes: [{ label: 'Personal', price: 24 }, { label: 'Grande', price: 36 }],
      ingredients: ['10 Nuggets de pechuga', 'Salsa BBQ', 'Salsa miel mostaza'],
      nutrition: { kcal: '540 kcal', protein: '29 g', time: '7 min' }, popularity: 87, recency: 13, promoTag: null, promoType: null,
    },

    /* ---------- BEBIDAS ---------- */
    {
      id: 'drink-cola-planet', category: 'bebidas', subcategory: 'gaseosas',
      name: 'Gaseosa Helada Planet', description: 'Vaso rojo Planet Chicken bien helado con hielo cristalino y bombilla ecológica.',
      price: 10, previousPrice: null, image: 'assets/images/products/drink-soda.png',
      sizes: [{ label: 'Personal', price: 10 }, { label: 'Mediano', price: 13 }, { label: 'Grande', price: 16 }],
      ingredients: ['Refresco gasificado frío', 'Hielo cristalino'],
      nutrition: { kcal: '180 kcal', protein: '0 g', time: '1 min' }, popularity: 95, recency: 8, promoTag: null, promoType: null,
    },
    {
      id: 'drink-shake-fresa', category: 'bebidas', subcategory: 'batidos',
      name: 'Milkshake Frutilla Lunar', description: 'Batido cremoso de frutilla natural coronado con crema chantilly y salsa berry.',
      price: 18, previousPrice: 22, image: 'assets/images/products/drink-shake.png',
      sizes: [{ label: 'Personal', price: 18 }, { label: 'Grande', price: 24 }],
      ingredients: ['Frutilla natural', 'Helado crema', 'Chantilly', 'Salsa de frutos rojos'],
      nutrition: { kcal: '320 kcal', protein: '7 g', time: '4 min' }, popularity: 93, recency: 27, promoTag: '-18%', promoType: 'destacado',
    },
    {
      id: 'drink-cola-zero', category: 'bebidas', subcategory: 'gaseosas',
      name: 'Gaseosa Zero Azúcar', description: 'Todo el sabor burbujeante sin azúcar agregada, servida bien fría.',
      price: 10, previousPrice: null, image: 'assets/images/products/drink-soda.png',
      sizes: [{ label: 'Personal', price: 10 }, { label: 'Grande', price: 15 }],
      ingredients: ['Refresco sin azúcar', 'Hielo cristalino'],
      nutrition: { kcal: '0 kcal', protein: '0 g', time: '1 min' }, popularity: 84, recency: 15, promoTag: null, promoType: null,
    },
    {
      id: 'drink-berry-ice', category: 'bebidas', subcategory: 'batidos',
      name: 'Frappé Rojo Estelar', description: 'Bebida granizada de frutos rojos con crema ligera y menta fresca.',
      price: 16, previousPrice: null, image: 'assets/images/products/drink-shake.png',
      sizes: [{ label: 'Personal', price: 16 }, { label: 'Grande', price: 21 }],
      ingredients: ['Frutos rojos', 'Hielo frappé', 'Menta fresca'],
      nutrition: { kcal: '240 kcal', protein: '3 g', time: '4 min' }, popularity: 86, recency: 21, promoTag: null, promoType: null,
    },
  ];
  const BUSINESS_INFO = {
    name: 'PLANET CHICKEN',
    slogan: 'Wings & Chicken',
    tagline: 'El mejor sabor en cada bocado',
    hours: 'Lunes a Domingo · 11:00 a 23:00',
    phone: '+591 700-48290',
    branches: [
      'Santa Cruz · Av. San Martín, Equipetrol #420',
      'La Paz · Av. Montenegro #815, San Miguel',
      'Cochabamba · Av. América Oeste #1120',
    ],
  };

  function formatBs(amount) {
    return `Bs ${Number(amount).toFixed(2).replace('.', ',')}`;
  }

  function getCategory(id) {
    return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
  }

  function getProduct(id) {
    return PRODUCTS.find((p) => p.id === id) || null;
  }

  function getPromotions() {
    return PRODUCTS.filter((p) => p.previousPrice !== null || p.promoType !== null);
  }

  PC.data = {
    CATEGORIES,
    PRODUCTS,
    BUSINESS_INFO,
    formatBs,
    getCategory,
    getProduct,
    getPromotions,
  };
})(window);
