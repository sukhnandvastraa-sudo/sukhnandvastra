// js/dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  renderSubmissions();
  handleAddProduct(); // ensure product handler runs
});

/* -------------------------------------------------
   RENDER ALL SUBMISSIONS
---------------------------------------------------*/
function renderSubmissions() {
  // ----- CONTACTS -----
  const contactTable = document.getElementById("contactTableBody");
  const contacts = JSON.parse(localStorage.getItem("contacts") || "[]");

  if (contactTable) {
    contactTable.innerHTML = "";
    if (contacts.length === 0) {
      contactTable.innerHTML = `<tr><td colspan="5" class="text-center text-gray-500">No contact messages yet.</td></tr>`;
    } else {
      contacts.forEach((c, i) => {
        contactTable.innerHTML += `
          <tr class="border-b hover:bg-gray-50">
            <td class="p-2">${i + 1}</td>
            <td class="p-2">${c.name}</td>
            <td class="p-2">${c.email}</td>
            <td class="p-2">${c.subject || "-"}</td>
            <td class="p-2">${c.message}</td>
            <td class="p-2 text-sm text-gray-500">${c.time}</td>
            <td class="p-2 text-center">
              <button onclick="deleteContact(${c.id})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
            </td>
          </tr>
        `;
      });
    }
  }

  // ----- PARTNERS (Now before Collaborations) -----
  const partnerTable = document.getElementById("partnerTableBody");
  const partners = JSON.parse(localStorage.getItem("partners") || "[]");

  if (partnerTable) {
    partnerTable.innerHTML = "";
    if (partners.length === 0) {
      partnerTable.innerHTML = `<tr><td colspan="6" class="text-center text-gray-500">No partner requests yet.</td></tr>`;
    } else {
      partners.forEach((p, i) => {
        partnerTable.innerHTML += `
          <tr class="border-b hover:bg-gray-50">
            <td class="p-2">${i + 1}</td>
            <td class="p-2">${p.name}</td>
            <td class="p-2">${p.email}</td>
            <td class="p-2">${p.brand || "-"}</td>
            <td class="p-2">${p.message}</td>
            <td class="p-2 text-sm text-gray-500">${p.time}</td>
            <td class="p-2 text-center">
              <button onclick="deletePartner(${p.id})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
            </td>
          </tr>
        `;
      });
    }
  }

  // ----- COLLABORATIONS (Now after Partners) -----
  const collabTable = document.getElementById("collabTableBody");
  const collabs = JSON.parse(localStorage.getItem("collaborations") || "[]");

  if (collabTable) {
    collabTable.innerHTML = "";
    if (collabs.length === 0) {
      collabTable.innerHTML = `<tr><td colspan="6" class="text-center text-gray-500">No collaboration requests yet.</td></tr>`;
    } else {
      collabs.forEach((c, i) => {
        collabTable.innerHTML += `
          <tr class="border-b hover:bg-gray-50">
            <td class="p-2">${i + 1}</td>
            <td class="p-2">${c.name}</td>
            <td class="p-2">${c.email}</td>
            <td class="p-2">${c.brand || "-"}</td>
            <td class="p-2">${c.message}</td>
            <td class="p-2 text-sm text-gray-500">${c.time}</td>
            <td class="p-2 text-center">
              <button onclick="deleteCollab(${c.id})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
            </td>
          </tr>
        `;
      });
    }
  }
}

/* -------------------------------------------------
   DELETE FUNCTIONS
---------------------------------------------------*/
function deleteContact(id) {
  let contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
  contacts = contacts.filter((c) => c.id !== id);
  localStorage.setItem("contacts", JSON.stringify(contacts));
  renderSubmissions();
}

function deleteCollab(id) {
  let collabs = JSON.parse(localStorage.getItem("collaborations") || "[]");
  collabs = collabs.filter((c) => c.id !== id);
  localStorage.setItem("collaborations", JSON.stringify(collabs));
  renderSubmissions();
}

function deletePartner(id) {
  let partners = JSON.parse(localStorage.getItem("partners") || "[]");
  partners = partners.filter((p) => p.id !== id);
  localStorage.setItem("partners", JSON.stringify(partners));
  renderSubmissions();
}

/* -------------------------------------------------
   ADD PRODUCT SECTION - Upload Image from Device
---------------------------------------------------*/
function handleAddProduct() {
  const form = document.getElementById("adminAddProduct");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("ap_name").value.trim();
    const price = document.getElementById("ap_price").value.trim();
    const type = document.getElementById("ap_type").value.trim();
    const desc = document.getElementById("ap_desc").value.trim();
    const imageFile = document.getElementById("ap_image").files[0];

    if (!name || !price || !imageFile) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    const imageBase64 = await toBase64(imageFile);

    const newProduct = {
      id: Date.now(),
      name,
      price,
      type,
      desc,
      image: imageBase64,
    };

    const products = JSON.parse(localStorage.getItem("products") || "[]");
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));

    alert("✅ Product added successfully!");
    form.reset();
  });
}

/* -------------------------------------------------
   🔹 Partner Form Handler (Now before Collaboration)
---------------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const partnerForm = document.getElementById("adminAddPartner");
  if (partnerForm) {
    partnerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("partner_name").value.trim();
      const email = document.getElementById("partner_email").value.trim();
      const brand = document.getElementById("partner_brand").value.trim();
      const message = document.getElementById("partner_message").value.trim();
      const fileInput = document.getElementById("partner_image");
      const file = fileInput?.files[0];

      if (!name || !email || !message) {
        alert("Please fill in all required fields.");
        return;
      }

      let imageBase64 = "";
      if (file) {
        imageBase64 = await toBase64(file);
      }

      const partner = {
        id: Date.now(),
        name,
        email,
        brand,
        message,
        image: imageBase64,
        time: new Date().toLocaleString(),
        source: "admin", // ✅ Added
      };

      const partners = JSON.parse(localStorage.getItem("partners") || "[]");
      partners.push(partner);
      localStorage.setItem("partners", JSON.stringify(partners));

      alert("✅ Partner request added!");
      partnerForm.reset();
      renderSubmissions();
    });
  }
});

/* -------------------------------------------------
   🔹 Collaboration Form Handler (Now after Partner)
---------------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const collabForm = document.getElementById("adminAddCollaboration");
  if (collabForm) {
    collabForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("collab_name").value.trim();
      const email = document.getElementById("collab_email").value.trim();
      const brand = document.getElementById("collab_brand").value.trim();
      const message = document.getElementById("collab_message").value.trim();
      const fileInput = document.getElementById("collab_image");
      const file = fileInput?.files[0];

      if (!name || !email || !message) {
        alert("Please fill in all required fields.");
        return;
      }

      let imageBase64 = "";
      if (file) {
        imageBase64 = await toBase64(file);
      }

      const collab = {
        id: Date.now(),
        name,
        email,
        brand,
        message,
        image: imageBase64,
        time: new Date().toLocaleString(),
        source: "admin", // ✅ Added
      };

      const collabs = JSON.parse(localStorage.getItem("collaborations") || "[]");
      collabs.push(collab);
      localStorage.setItem("collaborations", JSON.stringify(collabs));

      alert("✅ Collaboration request added!");
      collabForm.reset();
      renderSubmissions();
    });
  }
});

/* -------------------------------------------------
   Helper: Convert uploaded file → Base64
---------------------------------------------------*/
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}
