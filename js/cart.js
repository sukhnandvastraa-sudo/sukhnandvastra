// js/cart.js

// ---------------- QR Popup Handling ----------------
document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  const popup = document.getElementById("qrPaymentPopup");
  const closeBtn = document.getElementById("closeQrPopup");
  const confirmBtn = document.getElementById("confirmOnlinePaymentBtn");

  // Close QR popup
  if (closeBtn) {
    closeBtn.addEventListener("click", () => popup.classList.add("hidden"));
  }

  // Confirm payment button
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      popup.classList.add("hidden");
      alert("Thank you! Your payment has been recorded.");
    });
  }
});

// ✅ Unique cart key for each logged-in user
function getCartKey() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user && user.email) return `cart_${user.email}`;
  return "cart_guest"; // for not logged in users
}

// ---------------- Render Cart ----------------
function renderCart() {
  const cartKey = getCartKey();
  const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
  const container = document.getElementById("cartContainer");

  if (!container) return;

  if (!cart.length) {
    container.innerHTML = `<p class="text-center text-gray-300 py-8">
      Your cart is empty. <a href="shop.html" class="text-[#C6A766] underline">Shop now</a>
    </p>`;
    return;
  }

  const rows = cart.map((item, idx) => `
    <div class="flex items-center gap-4 border-b border-white/5 py-4">
      <img src="${item.image}" class="w-20 h-20 object-cover rounded" alt="${item.name}">
      <div class="flex-1">
        <div class="font-semibold text-[#C6A766]">${item.name}</div>
        <div class="text-sm text-gray-300">Size: ${item.size || "N/A"} • Price: ₹${item.price}</div>
      </div>
      <div class="flex items-center gap-2">
        <button class="qty-minus px-3 py-1 bg-gray-800 rounded" data-idx="${idx}">-</button>
        <span class="qty-val" data-idx="${idx}">${item.qty}</span>
        <button class="qty-plus px-3 py-1 bg-gray-800 rounded" data-idx="${idx}">+</button>
      </div>
      <div class="w-24 text-right">₹${item.price * item.qty}</div>
      <div><button class="remove-item text-sm text-red-500" data-idx="${idx}">Remove</button></div>
    </div>
  `).join("");

  const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);

  container.innerHTML = `
    <div>${rows}</div>
    <div class="flex justify-between items-center mt-6">
      <div class="text-lg font-semibold">Grand Total:
        <span class="text-[#C6A766]">₹${total}</span>
      </div>
      <div class="flex gap-3">
        <button id="checkoutBtn" class="bg-[#C6A766] text-black px-5 py-2 rounded">Checkout</button>
        <a href="shop.html" class="text-sm text-gray-300 self-center underline">Continue Shopping</a>
      </div>
    </div>
  `;

  // quantity & remove handlers
  document.querySelectorAll(".qty-plus").forEach(b =>
    b.addEventListener("click", e => {
      const idx = +e.currentTarget.dataset.idx;
      const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
      cart[idx].qty++;
      localStorage.setItem(cartKey, JSON.stringify(cart));
      renderCart();
    })
  );

  document.querySelectorAll(".qty-minus").forEach(b =>
    b.addEventListener("click", e => {
      const idx = +e.currentTarget.dataset.idx;
      const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
      if (cart[idx].qty > 1) cart[idx].qty--;
      localStorage.setItem(cartKey, JSON.stringify(cart));
      renderCart();
    })
  );

  document.querySelectorAll(".remove-item").forEach(b =>
    b.addEventListener("click", e => {
      const idx = +e.currentTarget.dataset.idx;
      const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
      cart.splice(idx, 1);
      localStorage.setItem(cartKey, JSON.stringify(cart));
      renderCart();
    })
  );

  document.getElementById("checkoutBtn").onclick = checkoutCart;
}

// ---------------- Checkout Flow ----------------
function checkoutCart() {
  const cartKey = getCartKey();
  const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
  if (!cart.length) return alert("Cart is empty.");
  const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);

  const name = prompt("Enter your full name:");
  const email = prompt("Enter your email:");
  const address = prompt("Enter your address:");
  const phone = prompt("Enter your phone number:");
  if (!name || !email) return alert("Name & Email required.");

  const payOnline = confirm(`Total ₹${total}\nPress OK to Pay Online or Cancel for Cash on Delivery`);
  if (payOnline) {
    document.getElementById("qrPaymentPopup").classList.remove("hidden");
    document.getElementById("confirmOnlinePaymentBtn").onclick = () => {
      document.getElementById("qrPaymentPopup").classList.add("hidden");
      finalizeOrder("Online", "Paid", { name, email, address, phone }, cart, total, cartKey);
    };
  } else {
    finalizeOrder("Cash on Delivery", "Not Paid", { name, email, address, phone }, cart, total, cartKey);
  }
}

// ---------------- Save Order + Send Email ----------------
function finalizeOrder(paymentMode, paymentStatus, customer, cart, total, cartKey) {
  const order = {
    id: "ORD-" + Date.now(),
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    customerAddress: customer.address,
    items: cart,
    totalPrice: total,
    paymentMode,
    paymentStatus,
    deliveryStatus: "Sent",
    date: new Date().toLocaleString()
  };

  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  localStorage.removeItem(cartKey); // clear that specific user's cart

  // ✅ Wait for mail to be sent before redirecting
  sendOrderMail(order).then(() => {
    alert("Order placed successfully!");
    window.location.href = "shop.html";
  }).catch(() => {
    alert("Order placed, but failed to send confirmation email.");
    window.location.href = "shop.html";
  });
}


// ---------------- EmailJS Integration ----------------
function sendOrderMail(order) {
  const orderItems = order.items.map(i => 
    `${i.name} (Size: ${i.size || "N/A"}, Qty: ${i.qty}, ₹${i.price * i.qty})`
  ).join("\n");

  return emailjs.send("service_uci4kud", "template_1jcxqzx", {
    to_email: "sukhnandvastraa@gmail.com",
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress,
    paymentMode: order.paymentMode,
    paymentStatus: order.paymentStatus,
    totalPrice: order.totalPrice,
    date: order.date,
    orderItems
  });
}

