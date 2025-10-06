// js/main.js
// Loads navbar partial and initializes UI behaviors: mobile menu, active link highlight, dashboard/logout visibility.

document.addEventListener("DOMContentLoaded", async () => {
  const placeholder = document.getElementById("navbar-placeholder");
  if (!placeholder) return;

  try {
    const res = await fetch("partials/navbar.html");
    const html = await res.text();
    placeholder.innerHTML = html;

    // Wait until navbar HTML is loaded, then attach all handlers
    setupMobileToggle();
    setupDashboardLogoutButtons();
    highlightActiveNav();
    applyUserBasedUi();
  } catch (err) {
    console.error("Error loading navbar:", err);
  }
});

function setupMobileToggle() {
  const btn = document.getElementById("mobile-menu-btn");
  const mobile = document.getElementById("mobile-menu");
  if (!btn || !mobile) return;
  btn.addEventListener("click", () => mobile.classList.toggle("hidden"));
}

function setupDashboardLogoutButtons() {
  const dashBtns = document.querySelectorAll("#dashboard-btn, #dashboard-btn-mobile");
  const logoutBtns = document.querySelectorAll("#logout-btn, #logout-btn-mobile");

  // Dashboard navigation
  dashBtns.forEach(b => {
    b.addEventListener("click", () => window.location.href = "dashboard.html");
  });

  // ✅ Fix: make sure logout buttons always work
  logoutBtns.forEach(b => {
    b.addEventListener("click", (e) => {
      e.preventDefault();
      try {
        localStorage.removeItem("user");
      } catch (err) {
        console.warn("Couldn't remove user from localStorage:", err);
      }
      // Force redirect to login page
      window.location.href = "login.html";
    });
  });
}

// Highlight active nav link (gold and underline)
function highlightActiveNav() {
  const current = (window.location.pathname.split("/").pop() || "index.html");
  const links = document.querySelectorAll(".nav-link");
  links.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;
    const linkFile = href.split("/").pop();
    if (linkFile === current) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Show/hide Dashboard button depending on logged-in user role
function applyUserBasedUi() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const dashBtns = document.querySelectorAll("#dashboard-btn, #dashboard-btn-mobile");
  const logoutBtns = document.querySelectorAll("#logout-btn, #logout-btn-mobile");

  if (!user) {
    // 🧍‍♂️ No one logged in → hide dashboard & logout
    dashBtns.forEach(b => b.style.display = "none");
    logoutBtns.forEach(b => b.style.display = "none");
    return;
  }

  if (user.role === "admin") {
    // 👑 Admin → show dashboard & logout
    dashBtns.forEach(b => b.style.display = "inline-block");
    logoutBtns.forEach(b => b.style.display = "inline-block");
  } else if (user.role === "customer") {
    // 🛍️ Customer → hide dashboard, show logout
    dashBtns.forEach(b => b.style.display = "none");
    logoutBtns.forEach(b => b.style.display = "inline-block");
  }
}


