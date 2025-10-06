// js/products.js

// Default product sets (same as before)
const defaultShop = [
  { id: 1, name: "Silk Saree", desc: "Elegant handwoven silk saree", price: 2499, image: "assets/product1.jpg" },
  { id: 2, name: "Women's Kurta Set", desc: "Stylish kurta set with minimal embroidery", price: 1999, image: "assets/product2.jpg" },
  { id: 3, name: "Designer Lehenga", desc: "Handcrafted lehenga with mirror work", price: 4499, image: "assets/product3.jpg" },
  { id: 4, name: "Classic Blazer", desc: "Smart-fit women’s blazer", price: 3299, image: "assets/product4.jpg" }
];
const defaultRent = [
  { id: 101, name: "Wedding Lehenga", desc: "Premium embroidered Lehenga", price: 1299, image: "assets/rent1.jpg" },
  { id: 102, name: "Designer Gown", desc: "Luxury evening gown", price: 999, image: "assets/rent2.jpg" },
  { id: 103, name: "Ethnic Lehenga", desc: "Traditional bridal lehenga", price: 1499, image: "assets/rent3.jpg" },
  { id: 104, name: "Tuxedo Suit", desc: "Women modern-fit tuxedo", price: 1199, image: "assets/rent4.jpg" }
];

if (!localStorage.getItem("shopProducts")) localStorage.setItem("shopProducts", JSON.stringify(defaultShop));
if (!localStorage.getItem("rentProducts")) localStorage.setItem("rentProducts", JSON.stringify(defaultRent));

// Render products for a page (shop or rent)
function renderProducts(type = "shop") {
  const container = document.getElementById("productGrid");
  if (!container) return;
  const products = JSON.parse(localStorage.getItem(type === "shop" ? "shopProducts" : "rentProducts") || "[]");
  container.innerHTML = products.map(p => productCardHtml(p, type)).join("");
}

// Return HTML for a product card — card is clickable and opens product-detail.html with id & type
function productCardHtml(p, type) {
  const priceLabel = type === "shop" ? `₹${p.price}` : `₹${p.price} / day`;
  // link to product-detail.html?id={id}&type={type}
  return `
  <div onclick="window.location.href='product-detail.html?id=${p.id}&type=${type}'"
       class="product-card bg-black/60 rounded-2xl overflow-hidden transform hover:scale-105 transition cursor-pointer border border-transparent hover:border-[#C6A766]">
    <img src="${p.image}" alt="${p.name}" class="w-full h-56 object-cover">
    <div class="p-5">
      <h3 class="text-lg font-semibold mb-1 text-[#C6A766]">${p.name}</h3>
      <p class="text-sm text-gray-300 mb-3">${p.desc}</p>
      <p class="font-semibold mb-3 text-white">${priceLabel}</p>
    </div>
  </div>
  `;
}

/* Cart helpers used throughout the site */
function getCart() {
  return JSON.parse(localStorage.getItem(getCartKey()) || "[]");
}
function saveCart(cart) {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
}


function addToCartItem(item) {
  // item: {id,name,price,qty,size,type,image}
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id && i.size === item.size && i.type === item.type);
  if (existing) existing.qty += item.qty;
  else cart.push(item);
  saveCart(cart);
}
function removeCartItem(index) {
  const cart = getCart();
  cart.splice(index,1);
  saveCart(cart);
}
function updateCartQty(index, qty) {
  const cart = getCart();
  if (!cart[index]) return;
  cart[index].qty = qty;
  saveCart(cart);
}

function getCartKey() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user && user.email) return `cart_${user.email}`;
  return "cart_guest";
}

// --- Unique Cart Per User ---
function getCartKey() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user && user.email) return `cart_${user.email}`;
  return "cart_guest";
}

// Override default getCart/saveCart to use unique key
function getCart() {
  return JSON.parse(localStorage.getItem(getCartKey()) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
}
