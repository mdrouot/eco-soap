/* Front-end domain model: move these fields to an API/database when a server is added. */
class ShippingOrigin { constructor(country, exportCountry, fulfilmentCentre) { this.country = country; this.exportCountry = exportCountry; this.fulfilmentCentre = fulfilmentCentre; } }
class Product { constructor(id, name, price, description, origin, image = "") { Object.assign(this, { id, name, price, description, origin, image }); } }
class ShippingAddress { constructor(fields) { ["firstName", "lastName", "line1", "line2", "city", "postalCode"].forEach(key => this[key] = fields[key].trim()); this.country = fields.country; } }

const products = [
    new Product("coffee", "Coffee Soap", 7.90, "Refreshing coffee-inspired soap for a simple daily routine.", new ShippingOrigin("France", "France", "Lyon"), "images/coffee.jpg"),
    new Product("aloe", "Aloe Vera Soap", 8.50, "Gentle aloe vera-inspired soap with a fresh botanical character.", new ShippingOrigin("France", "France", "Lyon")),
    new Product("rose", "Rose Soap", 9.90, "Delicate floral soap inspired by the classic fragrance of roses.", new ShippingOrigin("France", "France", "Lyon"), "images/rose.jpg"),
    new Product("lavender", "Lavender Soap", 8.90, "Relaxing lavender-inspired soap for a calmer ritual.", new ShippingOrigin("France", "France", "Lyon")),
    new Product("olive", "Olive Oil Soap", 7.50, "Gentle soap inspired by Mediterranean olive oil traditions.", new ShippingOrigin("Italy", "Italy", "Bari")),
    new Product("matcha", "Matcha Soap", 9.50, "Refreshing soap with the fresh green character of matcha tea.", new ShippingOrigin("Japan", "Japan", "Osaka"))
];
const cartStorageKey = "ecobrand-cart", addressStorageKey = "ecobrand-shipping-address";
const euro = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });
const productImage = product => product.image ? `<img src="${product.image}" alt="${product.name}">` : `<div class="placeholder product-image-placeholder">${product.name}</div>`;
function getCart() { try { return JSON.parse(localStorage.getItem(cartStorageKey)) || []; } catch { return []; } }
function saveCart(cart) { localStorage.setItem(cartStorageKey, JSON.stringify(cart)); }
function addToCart(id) { const cart = getCart(), item = cart.find(entry => entry.id === id); item ? item.quantity += 1 : cart.push({ id, quantity: 1 }); saveCart(cart); window.location.href = "cart.html"; }

function renderProducts() {
    const grid = document.getElementById("productGrid"); if (!grid) return;
    grid.innerHTML = products.map(product => `<article class="product">${productImage(product)}<h3>${product.name}</h3><p>${product.description}</p><p class="price">${euro.format(product.price)}</p><a href="product.html?id=${product.id}" class="button">View product</a></article>`).join("");
}
function renderProductDetail() {
    const container = document.getElementById("productDetail"); if (!container) return;
    const product = products.find(item => item.id === new URLSearchParams(window.location.search).get("id"));
    if (!product) { container.innerHTML = "<div class=\"detail\"><h2>Product not found</h2><p>Please return to the shop and choose a product.</p></div>"; return; }
    document.title = `EcoBrand - ${product.name}`;
    container.innerHTML = `<article class="product-detail"><div class="product-detail-image">${productImage(product)}</div><div class="product-detail-info"><p class="eyebrow">EcoBrand handmade collection</p><h2>${product.name}</h2><p class="price">${euro.format(product.price)}</p><p>${product.description}</p><dl class="product-meta"><dt>Ships from</dt><dd>${product.origin.fulfilmentCentre}, ${product.origin.exportCountry}</dd><dt>Country of origin</dt><dd>${product.origin.country}</dd></dl><button type="button" data-product-id="${product.id}" class="add-to-cart">Add to cart</button></div></article>`;
}
function renderCart() {
    const container = document.getElementById("cartItems"); if (!container) return;
    const entries = getCart().map(entry => ({ ...entry, product: products.find(item => item.id === entry.id) })).filter(entry => entry.product);
    if (!entries.length) { container.innerHTML = "<section class=\"empty-cart\"><h3>Your cart is empty</h3><p>Add a soap from the shop to begin your order.</p><a class=\"button\" href=\"products.html\">Browse products</a></section>"; return; }
    const total = entries.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);
    container.innerHTML = `<section class="cart-items"><h3>Items</h3>${entries.map(entry => `<article class="cart-item"><div><h4>${entry.product.name}</h4><p>${euro.format(entry.product.price)} each</p></div><div class="cart-item-actions"><label>Quantity <input class="quantity-input" type="number" min="1" value="${entry.quantity}" data-product-id="${entry.product.id}"></label><strong>${euro.format(entry.product.price * entry.quantity)}</strong><button type="button" class="link-button remove-item" data-product-id="${entry.product.id}">Remove</button></div></article>`).join("")}<div class="cart-total"><span>Subtotal</span><strong>${euro.format(total)}</strong></div></section>`;
}
function updateQuantity(id, value) { const quantity = Number(value), cart = getCart(), item = cart.find(entry => entry.id === id); if (!item || !Number.isInteger(quantity) || quantity < 1) return; item.quantity = quantity; saveCart(cart); renderCart(); }
function removeFromCart(id) { saveCart(getCart().filter(item => item.id !== id)); renderCart(); }
function loadShippingAddress() { const form = document.getElementById("shippingForm"); if (!form) return; try { const address = JSON.parse(localStorage.getItem(addressStorageKey)); if (address) Object.entries(address).forEach(([key, value]) => { if (form.elements[key]) form.elements[key].value = value; }); } catch {} }
function saveShippingAddress(form) { localStorage.setItem(addressStorageKey, JSON.stringify(new ShippingAddress(Object.fromEntries(new FormData(form))))); document.getElementById("shippingResult").textContent = "Delivery address saved for this browser."; }

function loginUser() { const role = document.getElementById("role").value, username = document.getElementById("username").value, password = document.getElementById("password").value, result = document.getElementById("loginResult"); if (!username || !password) result.textContent = "Please complete all fields."; else if (role === "employee") result.innerHTML = "Employee demo login successful. <a href=\"employee.html\">Open Dashboard</a>"; else result.innerHTML = "Customer demo login successful. <a href=\"products.html\">Start Shopping</a>"; return false; }
function calculateStock() { const price = Number(document.getElementById("stockPrice").value), quantity = Number(document.getElementById("stockQuantity").value), result = document.getElementById("stockResult"); result.textContent = (!Number.isFinite(price) || price <= 0 || !Number.isInteger(quantity) || quantity < 0) ? "Please enter valid values." : `Total Stock Value: ${euro.format(price * quantity)}`; return false; }
function calculatePackaging() { const soaps = Number(document.getElementById("soapCount").value), result = document.getElementById("packagingResult"); result.textContent = (!Number.isInteger(soaps) || soaps <= 0) ? "Please enter a valid number of soaps." : `Estimated Plastic Savings: ${soaps * 15} grams.`; return false; }

document.addEventListener("DOMContentLoaded", () => {
    renderProducts(); renderProductDetail(); renderCart(); loadShippingAddress();
    document.addEventListener("click", event => { const add = event.target.closest(".add-to-cart"), remove = event.target.closest(".remove-item"); if (add) addToCart(add.dataset.productId); if (remove) removeFromCart(remove.dataset.productId); });
    document.addEventListener("change", event => { if (event.target.matches(".quantity-input")) updateQuantity(event.target.dataset.productId, event.target.value); });
    const form = document.getElementById("shippingForm"); if (form) form.addEventListener("submit", event => { event.preventDefault(); saveShippingAddress(form); });
});
