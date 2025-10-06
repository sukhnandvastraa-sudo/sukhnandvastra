// js/auth.js
// Admin credentials (as requested)
const ADMIN_EMAIL = "sukhnandvastraa@gmail.com";
const ADMIN_PASS = "admin@sukh";

// Helper: redirect to login if not authenticated (on protected pages)
document.addEventListener("DOMContentLoaded", () => {
  const publicPages = ["login.html"];
  const current = (window.location.pathname.split("/").pop() || "index.html");
  if (!publicPages.includes(current)) {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      // force login page
      window.location.href = "login.html";
    }
  }
});

// LOGIN / SIGNUP page behavior
// Expect login.html to include the forms with ids used below
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const pass = document.getElementById("loginPassword").value;

      // admin check
      if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
        localStorage.setItem("user", JSON.stringify({ role: "admin", email }));
        window.location.href = "index.html";
        return;
      }

      // check customers stored in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const found = users.find(u => u.email === email && u.password === pass);
      if (found) {
        localStorage.setItem("user", JSON.stringify({ role: "customer", email }));
        window.location.href = "index.html";
      } else {
        alert("Invalid credentials. If you don't have an account, please sign up.");
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const pass = document.getElementById("signupPassword").value;

      if (!name || !email || !pass) { alert("Please fill all fields."); return; }
      // prevent using admin email
      if (email === ADMIN_EMAIL) { alert("This email is reserved."); return; }

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.find(u => u.email === email)) { alert("User already exists."); return; }
      users.push({ name, email, password: pass });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Signup successful. Please login.");
      // clear and switch to login
      signupForm.reset();
      // optional: switch view to login form
    });
  }
});
