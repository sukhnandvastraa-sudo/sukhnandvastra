// js/forms.js

document.addEventListener("DOMContentLoaded", () => {
  // ---------- CONTACT FORM ----------
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("contactName").value.trim();
      const email = document.getElementById("contactEmail").value.trim();
      const subject = document.getElementById("contactSubject")?.value.trim() || "No subject";
      const message = document.getElementById("contactMessage").value.trim();

      if (!name || !email || !message) return alert("Please fill all required fields.");

      const contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
      contacts.push({
        id: Date.now(),
        name,
        email,
        subject,
        message,
        time: new Date().toLocaleString()
      });
      localStorage.setItem("contacts", JSON.stringify(contacts));

      // --- EmailJS send mail ---
      emailjs.send("service_xxxxx", "template_contact_us", {
        to_email: "sukhnandvastraa@gmail.com",
        name,
        email,
        subject,
        message,
      }).then(() => {
        alert("✅ Message sent successfully!");
      }).catch(() => {
        alert("⚠️ Message saved, but email could not be sent.");
      });

      contactForm.reset();
    });
  }

  // ---------- COLLABORATION FORM ----------
  const collabForm = document.getElementById("collabForm");
  if (collabForm) {
    collabForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("collabName").value.trim();
      const email = document.getElementById("collabEmail").value.trim();
      const phone = document.getElementById("collabPhone").value.trim();
      const brand = document.getElementById("collabBrand").value.trim();
      const message = document.getElementById("collabMessage").value.trim();

      if (!name || !email || !message) return alert("Please fill all required fields.");

      const collabs = JSON.parse(localStorage.getItem("collaborations") || "[]");
      collabs.push({
        id: Date.now(),
        name,
        email,
        phone,
        brand,
        message,
        time: new Date().toLocaleString()
      });
      localStorage.setItem("collaborations", JSON.stringify(collabs));

      // --- EmailJS send mail ---
      emailjs.send("service_uci4kud", "template_cykzx2b", {
        to_email: "sukhnandvastraa@gmail.com",
        name,
        email,
        brand,
        message
      }).then(() => {
        alert("✅ Collaboration request sent successfully!");
      }).catch(() => {
        alert("⚠️ Request saved, but email could not be sent.");
      });

      collabForm.reset();
    });
  }
});
