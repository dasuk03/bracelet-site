"use strict";

const STORAGE_KEYS = {
  products: "litopsProductsV2",
  cart: "litopsCartV2",
  favorites: "litopsFavoritesV2",
  orders: "litopsCustomOrdersV2",
  subscribers: "litopsSubscribersV2"
};

const DEFAULT_PRODUCTS = [
  {
    id: "prehnite",
    name: "Пренит",
    material: "Натуральный пренит · нержавеющая сталь",
    description: "Мягкий светло-зелёный минерал с прозрачной глубиной. Универсальный акцент для спокойных образов.",
    price: 5490,
    image: "assets/products/prehnite.webp",
    categories: ["light", "rare", "steel", "gift"],
    badge: "Выбор мастера",
    stock: 8,
    featured: true,
    color: "green",
    colorLabel: "Зелёный",
    hardware: "steel",
    hardwareLabel: "Высококачественная нержавеющая сталь",
    clasp: true,
    claspLabel: "С магнитным замком",
    braceletCountry: "Россия",
    stoneCountry: "Южная Африка",
    set: ["бирка", "мешочек для хранения", "подарочная упаковка", "браслет"]
  },
  {
    id: "tourmaline",
    name: "Турмалин",
    material: "Натуральный турмалин · нержавеющая сталь",
    description: "Яркий мультиколор с розовыми, зелёными и золотистыми нюансами. Каждый браслет выглядит по-своему.",
    price: 4890,
    image: "assets/products/tourmaline.webp",
    categories: ["color", "rare", "steel", "gift"],
    badge: "Новинка",
    stock: 6,
    featured: true,
    color: "multi",
    colorLabel: "Мультиколор",
    hardware: "steel",
    hardwareLabel: "Высококачественная нержавеющая сталь",
    clasp: true,
    claspLabel: "С магнитным замком",
    braceletCountry: "Россия",
    stoneCountry: "Бразилия",
    set: ["бирка", "мешочек для хранения", "браслет"]
  },
  {
    id: "rutilated-quartz",
    name: "Кварц рутиловый",
    material: "Натуральный кварц · нержавеющая сталь",
    description: "Прозрачный кварц с золотистыми включениями рутила. Выразительный и тёплый по настроению камень.",
    price: 4690,
    image: "assets/products/rutilated-quartz.webp",
    categories: ["light", "rare", "steel", "gift"],
    badge: "Редкий камень",
    stock: 5,
    featured: true,
    color: "gold",
    colorLabel: "Золотистый",
    hardware: "steel",
    hardwareLabel: "Высококачественная нержавеющая сталь",
    clasp: false,
    claspLabel: "Без замка",
    braceletCountry: "Россия",
    stoneCountry: "Бразилия",
    set: ["бирка", "мешочек для хранения", "подарочная упаковка", "браслет"]
  },
  {
    id: "larimar",
    name: "Ларимар",
    material: "Натуральный ларимар · нержавеющая сталь",
    description: "Голубой минерал с облачным рисунком. Чистая палитра и лёгкое ощущение морского воздуха.",
    price: 6290,
    image: "assets/products/larimar.webp",
    categories: ["light", "color", "rare", "steel", "gift"],
    badge: "Хит",
    stock: 4,
    featured: true,
    color: "blue",
    colorLabel: "Голубой",
    hardware: "steel",
    hardwareLabel: "Высококачественная нержавеющая сталь",
    clasp: true,
    claspLabel: "С замком",
    braceletCountry: "Россия",
    stoneCountry: "Доминиканская Республика",
    set: ["бирка", "мешочек для хранения", "браслет"]
  },
  {
    id: "labradorite",
    name: "Лабрадор",
    material: "Натуральный лабрадорит · нержавеющая сталь",
    description: "Глубокий серо-синий камень с переливами. Особенно эффектно раскрывается при живом освещении.",
    price: 6790,
    image: "assets/products/labradorite.webp",
    categories: ["color", "rare", "steel", "gift", "dark"],
    badge: "Бестселлер",
    stock: 7,
    featured: true,
    color: "dark",
    colorLabel: "Тёмный с переливом",
    hardware: "steel",
    hardwareLabel: "Высококачественная нержавеющая сталь",
    clasp: true,
    claspLabel: "С замком",
    braceletCountry: "Россия",
    stoneCountry: "Мадагаскар",
    set: ["бирка", "мешочек для хранения", "подарочная упаковка", "браслет"]
  },
  {
    id: "charoite",
    name: "Чароит",
    material: "Натуральный чароит · нержавеющая сталь",
    description: "Плотный фиолетовый тон с волокнистой фактурой. Самостоятельный и очень характерный акцент.",
    price: 5990,
    image: "assets/products/charoite.webp",
    categories: ["color", "rare", "steel", "gift"],
    badge: "Новинка",
    stock: 5,
    featured: true,
    color: "purple",
    colorLabel: "Фиолетовый",
    hardware: "steel",
    hardwareLabel: "Высококачественная нержавеющая сталь",
    clasp: false,
    claspLabel: "Без замка",
    braceletCountry: "Россия",
    stoneCountry: "Россия",
    set: ["бирка", "мешочек для хранения", "браслет"]
  }
];

const state = {
  products: loadJson(STORAGE_KEYS.products, DEFAULT_PRODUCTS),
  cart: loadJson(STORAGE_KEYS.cart, {}),
  favorites: new Set(loadJson(STORAGE_KEYS.favorites, [])),
  quickFilter: "all",
  sort: "featured",
  heroIndex: 0,
  advanced: {
    minPrice: 0,
    maxPrice: 0,
    colors: new Set(),
    hardware: "all",
    clasp: "all"
  },
  draftAdvanced: null
};

const els = {};
let toastTimer = 0;

function loadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : structuredClone(fallback);
  } catch (error) {
    console.warn(`Не удалось прочитать ${key}`, error);
    return structuredClone(fallback);
  }
}

function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Не удалось сохранить ${key}`, error);
  }
}

function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(Number(value) || 0) + " ₽";
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function refreshIcons() {
  window.lucide?.createIcons({ attrs: { "stroke-width": 1.8 } });
}

function cacheElements() {
  [
    "siteHeader", "mainNav", "menuButton", "searchButton", "searchPanel", "searchInput", "searchResults", "searchClose",
    "favoritesButton", "favoriteCount", "favoriteItems", "favoritesDrawer", "cartButton", "cartSummary", "cartCount", "cartDrawer",
    "cartItems", "cartTotal", "drawerBackdrop", "categoryBar", "sortSelect", "productGrid", "emptyState", "heroImage", "featuredName",
    "featuredMaterial", "featuredPrice", "featuredImage", "featuredBadge", "featuredCard", "heroPrev", "heroNext", "heroPager",
    "spotlightCard", "dialogImage", "dialogName", "dialogMaterial", "dialogDescription", "dialogPrice", "dialogFacts", "dialogSpecs",
    "dialogAddToCart", "productDialog", "dialogClose", "openOrderButton", "orderDialog", "orderDialogClose", "customOrderForm",
    "orderFormStatus", "newsletterForm", "newsletterMessage", "toast", "openFeaturedDialog", "filterDialog", "filterOpenButton",
    "filterCloseButton", "filterForm", "filterResetButton", "filterResultCount", "averagePriceLabel", "selectedRangeLabel",
    "activeFilterCount", "pricePeaks", "rangeFill", "priceMinRange", "priceMaxRange", "priceMinInput", "priceMaxInput"
  ].forEach(id => {
    els[id] = document.getElementById(id);
  });
}

function getCatalogBounds(products = state.products) {
  const prices = products.map(product => Number(product.price) || 0);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return { min, max };
}

function normalizeProducts() {
  if (!Array.isArray(state.products) || !state.products.length) {
    state.products = structuredClone(DEFAULT_PRODUCTS);
  }

  state.products = state.products.map((product, index) => {
    const fallback = DEFAULT_PRODUCTS[index % DEFAULT_PRODUCTS.length];
    const categories = Array.isArray(product.categories) ? product.categories : ["steel", "gift"];
    if (!categories.includes("steel")) categories.push("steel");

    return {
      id: product.id || fallback.id,
      name: product.name || fallback.name,
      material: product.material || product.stoneMaterial || fallback.material,
      description: product.description || fallback.description,
      price: Number(product.price) || fallback.price,
      image: product.image || product.images?.[0] || product.mainImage || fallback.image,
      categories,
      badge: product.badge || fallback.badge,
      stock: Math.max(0, Number(product.stock) || 0),
      featured: product.featured ?? fallback.featured,
      color: product.color || fallback.color,
      colorLabel: product.colorLabel || fallback.colorLabel,
      hardware: product.hardware || "steel",
      hardwareLabel: product.hardwareLabel || product.materialHardware || "Высококачественная нержавеющая сталь",
      clasp: typeof product.clasp === "boolean" ? product.clasp : fallback.clasp,
      claspLabel: product.claspLabel || (product.clasp ? "С замком" : "Без замка") || fallback.claspLabel,
      braceletCountry: product.braceletCountry || fallback.braceletCountry,
      stoneCountry: product.stoneCountry || fallback.stoneCountry,
      set: Array.isArray(product.set) && product.set.length ? product.set : fallback.set
    };
  });

  const bounds = getCatalogBounds();
  state.advanced.minPrice = bounds.min;
  state.advanced.maxPrice = bounds.max;
  saveJson(STORAGE_KEYS.products, state.products);
}

function getProduct(id) {
  return state.products.find(product => product.id === id);
}

function productMatchesAdvanced(product, filter = state.advanced) {
  const inPriceRange = product.price >= filter.minPrice && product.price <= filter.maxPrice;
  const inColor = !filter.colors.size || filter.colors.has(product.color);
  const inHardware = filter.hardware === "all" || product.hardware === filter.hardware;
  const inClasp = filter.clasp === "all" || (filter.clasp === "yes" ? product.clasp : !product.clasp);
  return inPriceRange && inColor && inHardware && inClasp;
}

function productMatchesQuick(product) {
  return state.quickFilter === "all" || product.categories.includes(state.quickFilter);
}

function getVisibleProducts() {
  const products = state.products.filter(product => productMatchesQuick(product) && productMatchesAdvanced(product));

  products.sort((a, b) => {
    switch (state.sort) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "name": return a.name.localeCompare(b.name, "ru");
      default:
        return Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name, "ru");
    }
  });

  return products;
}

function getHeroProducts() {
  return state.products.filter(product => product.featured);
}

function setHeroProduct(index) {
  const products = getHeroProducts();
  if (!products.length) return;

  state.heroIndex = (index + products.length) % products.length;
  const product = products[state.heroIndex];

  els.heroImage.src = product.image;
  els.heroImage.alt = `Браслет ${product.name}`;
  els.featuredName.textContent = product.name;
  els.featuredMaterial.textContent = product.material;
  els.featuredPrice.textContent = formatPrice(product.price);
  els.featuredImage.src = product.image;
  els.featuredImage.alt = product.name;
  els.featuredBadge.textContent = product.badge;
  els.heroPager.textContent = `${state.heroIndex + 1} / ${products.length}`;

  els.featuredCard.querySelectorAll("[data-product-id]").forEach(button => {
    button.dataset.productId = product.id;
    if (button.classList.contains("favorite-toggle")) {
      button.classList.toggle("is-active", state.favorites.has(product.id));
    }
  });
}

function productCardTemplate(product) {
  const isFavorite = state.favorites.has(product.id);
  return `
    <article class="product-card reveal is-visible" data-product-id="${escapeHtml(product.id)}">
      <div class="product-card__media open-product" role="button" tabindex="0" aria-label="Открыть ${escapeHtml(product.name)}">
        <span class="tiny-badge product-card__badge">${escapeHtml(product.badge)}</span>
        <button class="product-card__favorite ${isFavorite ? "is-active" : ""}" type="button" data-action="favorite" aria-label="${isFavorite ? "Убрать из избранного" : "Добавить в избранное"}">
          <i data-lucide="heart"></i>
        </button>
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
      </div>
      <div class="product-card__content">
        <p class="product-card__meta">${escapeHtml(product.material)}</p>
        <h3>${escapeHtml(product.name)}</h3>
        <p class="product-card__description">${escapeHtml(product.description)}</p>
        <div class="product-card__footer">
          <div>
            <strong class="product-card__price">${formatPrice(product.price)}</strong>
            <p class="product-card__stock">${product.stock > 0 ? `В наличии: ${product.stock}` : "Под заказ"}</p>
          </div>
          <div class="product-card__actions">
            <button class="open-product" type="button">Подробнее</button>
            <button class="add-to-cart" type="button" data-action="cart" aria-label="Добавить в корзину ${escapeHtml(product.name)}"><i data-lucide="shopping-bag"></i></button>
          </div>
        </div>
      </div>
    </article>`;
}

function renderProducts() {
  const products = getVisibleProducts();
  els.productGrid.innerHTML = products.map(productCardTemplate).join("");
  els.emptyState.hidden = products.length > 0;
  renderSpotlight(products);
  refreshIcons();
}

function renderSpotlight(products = getVisibleProducts()) {
  const product = products[0] || state.products[0];
  if (!product) return;

  els.spotlightCard.innerHTML = `
    <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
    <div class="spotlight-product__info">
      <span class="tiny-badge">${escapeHtml(product.badge)}</span>
      <h3>${escapeHtml(product.name)}</h3>
      <p>${escapeHtml(product.description)}</p>
      <div class="spotlight-product__price">
        <strong>${formatPrice(product.price)}</strong>
        <button class="main-button main-button--gold" type="button" data-product-open="${escapeHtml(product.id)}">Подробнее</button>
      </div>
    </div>`;
}

function updateCartSummary() {
  const entries = Object.entries(state.cart).filter(([id, quantity]) => getProduct(id) && quantity > 0);
  const count = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const total = entries.reduce((sum, [id, quantity]) => sum + getProduct(id).price * quantity, 0);
  els.cartCount.textContent = count;
  els.cartSummary.textContent = formatPrice(total);
  els.cartTotal.textContent = formatPrice(total);
}

function renderCart() {
  const entries = Object.entries(state.cart).filter(([id, quantity]) => getProduct(id) && quantity > 0);

  if (!entries.length) {
    els.cartItems.innerHTML = `<div class="drawer-empty"><i data-lucide="shopping-bag"></i><p>В корзине пока нет изделий.</p></div>`;
    updateCartSummary();
    refreshIcons();
    return;
  }

  els.cartItems.innerHTML = entries.map(([id, quantity]) => {
    const product = getProduct(id);
    return `
      <article class="drawer-item" data-product-id="${escapeHtml(product.id)}">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
        <div>
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.material)}</p>
          <strong>${formatPrice(product.price * quantity)}</strong>
        </div>
        <div class="drawer-item__controls">
          <button type="button" data-cart-action="remove" aria-label="Удалить"><i data-lucide="trash-2"></i></button>
          <div class="quantity-control">
            <button type="button" data-cart-action="decrease" aria-label="Уменьшить">−</button>
            <span>${quantity}</span>
            <button type="button" data-cart-action="increase" aria-label="Увеличить">+</button>
          </div>
        </div>
      </article>`;
  }).join("");

  updateCartSummary();
  refreshIcons();
}

function updateFavoritesSummary() {
  els.favoriteCount.textContent = state.favorites.size;
}

function renderFavorites() {
  const products = state.products.filter(product => state.favorites.has(product.id));

  if (!products.length) {
    els.favoriteItems.innerHTML = `<div class="drawer-empty"><i data-lucide="heart"></i><p>Добавляйте изделия в избранное, чтобы вернуться к ним позже.</p></div>`;
    updateFavoritesSummary();
    refreshIcons();
    return;
  }

  els.favoriteItems.innerHTML = products.map(product => `
    <article class="drawer-item" data-product-id="${escapeHtml(product.id)}">
      <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
      <div>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.material)}</p>
        <strong>${formatPrice(product.price)}</strong>
      </div>
      <div class="drawer-item__controls">
        <button type="button" data-favorite-action="remove" aria-label="Удалить из избранного"><i data-lucide="heart-off"></i></button>
        <button type="button" data-favorite-action="cart" aria-label="Добавить в корзину"><i data-lucide="shopping-bag"></i></button>
      </div>
    </article>`).join("");

  updateFavoritesSummary();
  refreshIcons();
}

function addToCart(id, quantity = 1) {
  const product = getProduct(id);
  if (!product) return;

  state.cart[id] = Math.max(0, Number(state.cart[id]) || 0) + quantity;
  saveJson(STORAGE_KEYS.cart, state.cart);
  renderCart();
  showToast(`${product.name} добавлен в корзину`);
}

function changeCartQuantity(id, delta) {
  if (!state.cart[id]) return;
  state.cart[id] += delta;
  if (state.cart[id] <= 0) delete state.cart[id];
  saveJson(STORAGE_KEYS.cart, state.cart);
  renderCart();
}

function toggleFavorite(id, force) {
  const product = getProduct(id);
  if (!product) return;

  const shouldAdd = typeof force === "boolean" ? force : !state.favorites.has(id);
  if (shouldAdd) state.favorites.add(id); else state.favorites.delete(id);
  saveJson(STORAGE_KEYS.favorites, [...state.favorites]);
  renderProducts();
  renderFavorites();
  updateFavoritesSummary();
  setHeroProduct(state.heroIndex);
  showToast(shouldAdd ? `${product.name} добавлен в избранное` : `${product.name} удалён из избранного`);
}

function openDrawer(drawer) {
  closeAllDrawers(false);
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  els.drawerBackdrop.classList.add("is-visible");
  document.body.classList.add("is-locked");
}

function closeAllDrawers(unlock = true) {
  [els.cartDrawer, els.favoritesDrawer].forEach(drawer => {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
  });
  els.drawerBackdrop.classList.remove("is-visible");
  if (unlock) document.body.classList.remove("is-locked");
}

function renderSearchResults(query = "") {
  const normalized = query.trim().toLocaleLowerCase("ru");
  const products = state.products.filter(product => !normalized || `${product.name} ${product.material} ${product.description}`.toLocaleLowerCase("ru").includes(normalized)).slice(0, 8);

  els.searchResults.innerHTML = products.length
    ? products.map(product => `
      <article class="search-result" data-product-id="${escapeHtml(product.id)}" tabindex="0">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
        <div>
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.material)}</p>
          <strong>${formatPrice(product.price)}</strong>
        </div>
      </article>`).join("")
    : `<div class="drawer-empty"><p>Ничего не найдено.</p></div>`;
}

function openSearch() {
  els.searchPanel.classList.add("is-open");
  els.searchPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
  renderSearchResults("");
  requestAnimationFrame(() => els.searchInput.focus());
}

function closeSearch() {
  els.searchPanel.classList.remove("is-open");
  els.searchPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

function openProductDialog(id) {
  const product = getProduct(id);
  if (!product) return;

  els.dialogImage.src = product.image;
  els.dialogImage.alt = product.name;
  els.dialogName.textContent = product.name;
  els.dialogMaterial.textContent = product.material;
  els.dialogDescription.textContent = product.description;
  els.dialogPrice.textContent = formatPrice(product.price);
  els.dialogAddToCart.dataset.productId = product.id;

  els.dialogFacts.innerHTML = [product.badge, product.colorLabel, product.clasp ? "С замком" : "Без замка"]
    .map(item => `<span>${escapeHtml(item)}</span>`).join("");

  const specList = [
    ["Материал фурнитуры", product.hardwareLabel],
    ["Страна изготовления", product.braceletCountry],
    ["Происхождение камня", product.stoneCountry],
    ["Комплектация", product.set.join(", ")],
    ["Наличие замка", product.clasp ? "Да" : "Нет"],
    ["Остаток", product.stock > 0 ? `${product.stock} шт.` : "Под заказ"]
  ];

  els.dialogSpecs.innerHTML = specList.map(([title, value]) => `
    <div>
      <dt>${escapeHtml(title)}</dt>
      <dd>${escapeHtml(value)}</dd>
    </div>`).join("");

  els.productDialog.showModal();
  refreshIcons();
}

function closeDialogOnBackdrop(event) {
  if (event.target === event.currentTarget) event.currentTarget.close();
}

function submitCustomOrder(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const orders = loadJson(STORAGE_KEYS.orders, []);
  orders.unshift({
    id: `request-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "Новая",
    ...data
  });
  saveJson(STORAGE_KEYS.orders, orders);
  event.currentTarget.reset();
  els.orderFormStatus.textContent = "Заявка сохранена и доступна в демо-панели администратора.";
  showToast("Заявка сохранена");
  setTimeout(() => {
    els.orderDialog.close();
    els.orderFormStatus.textContent = "";
  }, 1700);
}

function submitNewsletter(event) {
  event.preventDefault();
  const email = new FormData(event.currentTarget).get("email").trim().toLowerCase();
  if (!email) return;
  const subscribers = loadJson(STORAGE_KEYS.subscribers, []);
  if (!subscribers.includes(email)) subscribers.push(email);
  saveJson(STORAGE_KEYS.subscribers, subscribers);
  event.currentTarget.reset();
  els.newsletterMessage.textContent = "Спасибо! Адрес сохранён в локальной демо-базе.";
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  toastTimer = setTimeout(() => els.toast.classList.remove("is-visible"), 2600);
}

function cloneAdvancedFilter(source = state.advanced) {
  return {
    minPrice: source.minPrice,
    maxPrice: source.maxPrice,
    colors: new Set(source.colors),
    hardware: source.hardware,
    clasp: source.clasp
  };
}

function getActiveFilterCount(filter = state.advanced) {
  let count = 0;
  const bounds = getCatalogBounds();
  if (filter.minPrice !== bounds.min || filter.maxPrice !== bounds.max) count += 1;
  if (filter.colors.size) count += filter.colors.size;
  if (filter.hardware !== "all") count += 1;
  if (filter.clasp !== "all") count += 1;
  return count;
}

function updateActiveFilterBadge() {
  const count = getActiveFilterCount();
  els.activeFilterCount.hidden = count === 0;
  els.activeFilterCount.textContent = count;
}

function buildDistribution(filter = state.draftAdvanced || state.advanced) {
  const { min, max } = getCatalogBounds();
  const bins = 24;
  const span = Math.max(max - min, 1);
  const counts = Array.from({ length: bins }, (_, index) => {
    const binStart = min + span * (index / bins);
    const binCenter = binStart + span / bins / 2;
    let count = 0;
    state.products.forEach(product => {
      const distance = Math.abs(product.price - binCenter);
      const influence = Math.max(0, 1 - distance / (span / 5));
      count += influence;
    });
    return count;
  });

  const maxCount = Math.max(...counts, 1);
  return counts.map((count, index) => {
    const height = 18 + (count / maxCount) * 62;
    const pointPrice = min + span * (index / (bins - 1));
    const active = pointPrice >= filter.minPrice && pointPrice <= filter.maxPrice;
    return { height, active };
  });
}

function renderPriceGraph() {
  const filter = state.draftAdvanced || state.advanced;
  const points = buildDistribution(filter);
  els.pricePeaks.innerHTML = points.map(point => `
    <span class="price-peak ${point.active ? "is-active" : "is-muted"}" style="height:${point.height}px"></span>`).join("");
}

function updateFilterInputs() {
  const bounds = getCatalogBounds();
  const filter = state.draftAdvanced;
  if (!filter) return;

  els.priceMinRange.min = String(bounds.min);
  els.priceMinRange.max = String(bounds.max);
  els.priceMaxRange.min = String(bounds.min);
  els.priceMaxRange.max = String(bounds.max);
  els.priceMinRange.value = String(filter.minPrice);
  els.priceMaxRange.value = String(filter.maxPrice);
  els.priceMinInput.value = String(filter.minPrice);
  els.priceMaxInput.value = String(filter.maxPrice);
  els.averagePriceLabel.textContent = formatPrice(Math.round(state.products.reduce((sum, item) => sum + item.price, 0) / state.products.length));
  els.selectedRangeLabel.textContent = `${formatPrice(filter.minPrice)} — ${formatPrice(filter.maxPrice)}`;

  const start = ((filter.minPrice - bounds.min) / Math.max(bounds.max - bounds.min, 1)) * 100;
  const end = ((filter.maxPrice - bounds.min) / Math.max(bounds.max - bounds.min, 1)) * 100;
  els.rangeFill.style.left = `${start}%`;
  els.rangeFill.style.right = `${100 - end}%`;

  document.querySelectorAll('#colorFilterGroup input[type="checkbox"]').forEach(input => {
    input.checked = filter.colors.has(input.value);
  });
  document.querySelectorAll('input[name="hardware"]').forEach(input => {
    input.checked = input.value === filter.hardware;
  });
  document.querySelectorAll('input[name="clasp"]').forEach(input => {
    input.checked = input.value === filter.clasp;
  });

  renderPriceGraph();
  updateFilterResultCount();
}

function updateDraftPrice(type, value) {
  const filter = state.draftAdvanced;
  const bounds = getCatalogBounds();
  const numeric = Math.max(bounds.min, Math.min(bounds.max, Number(value) || bounds.min));

  if (type === "min") {
    filter.minPrice = Math.min(numeric, filter.maxPrice);
  } else {
    filter.maxPrice = Math.max(numeric, filter.minPrice);
  }
  updateFilterInputs();
}

function updateFilterResultCount() {
  const count = state.products.filter(product => {
    const filter = state.draftAdvanced;
    const inQuick = state.quickFilter === "all" || product.categories.includes(state.quickFilter);
    return inQuick && productMatchesAdvanced(product, filter);
  }).length;
  els.filterResultCount.textContent = count;
}

function openFilterDialog() {
  state.draftAdvanced = cloneAdvancedFilter();
  updateFilterInputs();
  els.filterDialog.showModal();
  refreshIcons();
}

function applyFilterDialog(event) {
  event.preventDefault();
  if (!state.draftAdvanced) return;
  state.advanced = cloneAdvancedFilter(state.draftAdvanced);
  updateActiveFilterBadge();
  renderProducts();
  els.filterDialog.close();
}

function resetDraftFilters() {
  const bounds = getCatalogBounds();
  state.draftAdvanced = {
    minPrice: bounds.min,
    maxPrice: bounds.max,
    colors: new Set(),
    hardware: "all",
    clasp: "all"
  };
  updateFilterInputs();
}

function setupReveal() {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(item => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });

  document.querySelectorAll(".reveal").forEach(item => observer.observe(item));
}

function bindEvents() {
  window.addEventListener("scroll", () => {
    els.siteHeader.classList.toggle("is-scrolled", window.scrollY > 18);
  }, { passive: true });

  window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEYS.products) {
      state.products = loadJson(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
      normalizeProducts();
      renderProducts();
      setHeroProduct(state.heroIndex);
      renderCart();
      renderFavorites();
      updateActiveFilterBadge();
    }
  });

  els.menuButton.addEventListener("click", () => {
    const open = els.mainNav.classList.toggle("is-open");
    els.menuButton.setAttribute("aria-expanded", String(open));
  });

  els.mainNav.addEventListener("click", event => {
    if (event.target.closest("a")) {
      els.mainNav.classList.remove("is-open");
      els.menuButton.setAttribute("aria-expanded", "false");
    }
  });

  els.searchButton.addEventListener("click", openSearch);
  els.searchClose.addEventListener("click", closeSearch);
  els.searchInput.addEventListener("input", event => renderSearchResults(event.target.value));
  els.searchResults.addEventListener("click", event => {
    const result = event.target.closest(".search-result");
    if (!result) return;
    closeSearch();
    openProductDialog(result.dataset.productId);
  });

  els.categoryBar.addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    state.quickFilter = button.dataset.filter;
    els.categoryBar.querySelectorAll("[data-filter]").forEach(item => item.classList.toggle("is-active", item === button));
    renderProducts();
    if (state.draftAdvanced) updateFilterResultCount();
  });

  els.sortSelect.addEventListener("change", event => {
    state.sort = event.target.value;
    renderProducts();
  });

  els.heroPrev.addEventListener("click", () => setHeroProduct(state.heroIndex - 1));
  els.heroNext.addEventListener("click", () => setHeroProduct(state.heroIndex + 1));

  els.featuredCard.addEventListener("click", event => {
    const favoriteButton = event.target.closest(".favorite-toggle");
    const cartButton = event.target.closest(".add-to-cart");
    if (favoriteButton) toggleFavorite(favoriteButton.dataset.productId);
    if (cartButton) addToCart(cartButton.dataset.productId);
  });

  els.openFeaturedDialog.addEventListener("click", () => {
    const featuredProducts = getHeroProducts();
    openProductDialog(featuredProducts[state.heroIndex]?.id || featuredProducts[0]?.id || state.products[0].id);
  });

  els.productGrid.addEventListener("click", event => {
    const card = event.target.closest(".product-card");
    if (!card) return;
    const id = card.dataset.productId;
    if (event.target.closest('[data-action="favorite"]')) toggleFavorite(id);
    else if (event.target.closest('[data-action="cart"]')) addToCart(id);
    else if (event.target.closest(".open-product")) openProductDialog(id);
  });

  els.productGrid.addEventListener("keydown", event => {
    const target = event.target.closest(".open-product");
    if (!target) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProductDialog(target.closest(".product-card").dataset.productId);
    }
  });

  els.spotlightCard.addEventListener("click", event => {
    const button = event.target.closest("[data-product-open]");
    if (button) openProductDialog(button.dataset.productOpen);
  });

  els.cartButton.addEventListener("click", () => { renderCart(); openDrawer(els.cartDrawer); });
  els.favoritesButton.addEventListener("click", () => { renderFavorites(); openDrawer(els.favoritesDrawer); });
  document.querySelectorAll("[data-close-drawer]").forEach(button => button.addEventListener("click", () => closeAllDrawers()));
  els.drawerBackdrop.addEventListener("click", () => closeAllDrawers());

  els.cartItems.addEventListener("click", event => {
    const item = event.target.closest(".drawer-item");
    const action = event.target.closest("[data-cart-action]")?.dataset.cartAction;
    if (!item || !action) return;
    const id = item.dataset.productId;
    if (action === "increase") changeCartQuantity(id, 1);
    if (action === "decrease") changeCartQuantity(id, -1);
    if (action === "remove") { delete state.cart[id]; saveJson(STORAGE_KEYS.cart, state.cart); renderCart(); }
  });

  els.favoriteItems.addEventListener("click", event => {
    const item = event.target.closest(".drawer-item");
    const action = event.target.closest("[data-favorite-action]")?.dataset.favoriteAction;
    if (!item || !action) return;
    if (action === "remove") toggleFavorite(item.dataset.productId, false);
    if (action === "cart") addToCart(item.dataset.productId);
  });

  els.dialogClose.addEventListener("click", () => els.productDialog.close());
  els.productDialog.addEventListener("click", closeDialogOnBackdrop);
  els.dialogAddToCart.addEventListener("click", event => addToCart(event.currentTarget.dataset.productId));

  els.openOrderButton.addEventListener("click", () => els.orderDialog.showModal());
  els.orderDialogClose.addEventListener("click", () => els.orderDialog.close());
  els.orderDialog.addEventListener("click", closeDialogOnBackdrop);
  els.customOrderForm.addEventListener("submit", submitCustomOrder);
  els.newsletterForm.addEventListener("submit", submitNewsletter);

  els.filterOpenButton.addEventListener("click", openFilterDialog);
  els.filterCloseButton.addEventListener("click", () => els.filterDialog.close());
  els.filterDialog.addEventListener("click", closeDialogOnBackdrop);
  els.filterForm.addEventListener("submit", applyFilterDialog);
  els.filterResetButton.addEventListener("click", resetDraftFilters);

  els.priceMinRange.addEventListener("input", event => updateDraftPrice("min", event.target.value));
  els.priceMaxRange.addEventListener("input", event => updateDraftPrice("max", event.target.value));
  els.priceMinInput.addEventListener("input", event => updateDraftPrice("min", event.target.value));
  els.priceMaxInput.addEventListener("input", event => updateDraftPrice("max", event.target.value));

  document.querySelectorAll('#colorFilterGroup input[type="checkbox"]').forEach(input => {
    input.addEventListener("change", () => {
      if (!state.draftAdvanced) return;
      if (input.checked) state.draftAdvanced.colors.add(input.value); else state.draftAdvanced.colors.delete(input.value);
      updateFilterInputs();
    });
  });

  document.querySelectorAll('input[name="hardware"]').forEach(input => {
    input.addEventListener("change", () => {
      if (!state.draftAdvanced) return;
      state.draftAdvanced.hardware = input.value;
      updateFilterResultCount();
    });
  });

  document.querySelectorAll('input[name="clasp"]').forEach(input => {
    input.addEventListener("change", () => {
      if (!state.draftAdvanced) return;
      state.draftAdvanced.clasp = input.value;
      updateFilterResultCount();
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    closeAllDrawers();
    closeSearch();
    els.mainNav.classList.remove("is-open");
  });
}

function init() {
  cacheElements();
  normalizeProducts();
  renderProducts();
  renderCart();
  renderFavorites();
  updateFavoritesSummary();
  setHeroProduct(0);
  updateActiveFilterBadge();
  bindEvents();
  setupReveal();
  refreshIcons();
}

document.addEventListener("DOMContentLoaded", init);
