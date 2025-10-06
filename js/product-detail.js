document.addEventListener("DOMContentLoaded", () => {
  const detail = document.getElementById("productDetail");
  const selected = JSON.parse(localStorage.getItem("selectedProduct") || "{}");

  if (!selected.id) {
    detail.innerHTML = "<p class='text-center text-gray-300'>No product found.</p>";
    return;
  }

  const products = JSON.parse(localStorage.getItem(selected.type === "shop" ? "shopProducts" : "rentProducts") || "[]");
  const product = products.find(p => p.id == selected.id);
  if (!product) {
    detail.innerHTML = "<p class='text-center text-gray-300'>Product not found.</p>";
    return;
  }

  detail.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <img src="${product.image}" alt="${product.name}" class="rounded-2xl shadow-lg w-full h-96 object-cover">
      <div>
        <h2 class="text-3xl font-semibold text-[#C6A766] mb-4">${product.name}</h2>
        <p class="text-gray-300 mb-4">${product.desc}</p>
        <p class="text-xl font-bold mb-4">₹${product.price}</p>

        <div class="mb-4">
          <p class="font-semibold mb-2">Select Size:</p>
          <div class="flex gap-2">
            ${["S", "M", "L", "XL"].map(s => `<button class="size-btn px-3 py-1 border border-gray-600 rounded hover:bg-[#C6A766] hover:text-black" data-size="${s}">${s}</button>`).join("")}
          </div>
        </div>

        <div class="flex items-center gap-4 mb-6">
          <button id="minus" class="px-3 py-1 bg-gray-800 rounded">-</button>
          <span id="qty" class="text-lg">1</span>
          <button id="plus" class="px-3 py-1 bg-gray-800 rounded">+</button>
        </div>

        <div class="flex gap-4">
          <button id="addToCart" class="bg-[#C6A766] text-black px-5 py-2 rounded font-semibold">Add to Cart</button>
          <button id="buyNow" class="bg-green-600 px-5 py-2 rounded font-semibold">Buy Now</button>
        </div>
      </div>
    </div>
  `;

  let qty = 1, size = "";
  document.getElementById("plus").onclick = () => { qty++; document.getElementById("qty").textContent = qty; };
  document.getElementById("minus").onclick = () => { if (qty > 1) qty--; document.getElementById("qty").textContent = qty; };
  document.querySelectorAll(".size-btn").forEach(b => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".size-btn").forEach(x => x.classList.remove("bg-[#C6A766]", "text-black"));
      b.classList.add("bg-[#C6A766]", "text-black");
      size = b.dataset.size;
    });
  });

  document.getElementById("addToCart").onclick = () => {
  if (!size) return alert("Please select size");
  const key = getCartKey();
  const cart = JSON.parse(localStorage.getItem(key) || "[]");
  const existing = cart.find(i => i.id === product.id && i.size === size && i.type === product.type);
  if (existing) existing.qty += qty;
  else cart.push({ ...product, size, qty });
  localStorage.setItem(key, JSON.stringify(cart));
  alert("Added to your cart!");
};


  document.getElementById("buyNow").onclick = () => {
    if (!size) return alert("Please select size");
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const order = { ...product, size, qty, payment: "COD", status: "Send", date: new Date().toLocaleString() };
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    alert("Order placed successfully!");
    window.location.href = "shop.html";
  };

  // ---------------- QR Payment Popup Handling for Buy Now ----------------
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("qrPaymentPopup");
  const closeBtn = document.getElementById("closeQrPopup");
  const confirmBtn = document.getElementById("confirmOnlinePaymentBtn");

  if (closeBtn) closeBtn.addEventListener("click", () => popup.classList.add("hidden"));
  if (confirmBtn) confirmBtn.addEventListener("click", () => popup.classList.add("hidden"));
});

// ---------------- Updated Buy Now Flow ----------------
function buyNow(product) {
  const name = prompt("Enter your full name:");
  const email = prompt("Enter your email:");
  const address = prompt("Enter your address:");
  const phone = prompt("Enter your phone number:");
  if (!name || !email) return alert("Name & Email required.");

  const payOnline = confirm(`Price ₹${product.price}\nPress OK to Pay Online or Cancel for Cash on Delivery`);
  if (payOnline) {
    document.getElementById("qrPaymentPopup").classList.remove("hidden");
    document.getElementById("confirmOnlinePaymentBtn").onclick = () => {
      document.getElementById("qrPaymentPopup").classList.add("hidden");
      finalizeOrder("Online", "Paid", { name, email, address, phone }, [product], product.price);
    };
  } else {
    finalizeOrder("Cash on Delivery", "Not Paid", { name, email, address, phone }, [product], product.price);
  }
}

function getCartKey() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user && user.email) return `cart_${user.email}`;
  return "cart_guest";
}


});
