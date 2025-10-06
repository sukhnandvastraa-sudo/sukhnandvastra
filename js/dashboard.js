// js/dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  renderSubmissions();
});

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

  // ----- COLLABORATIONS -----
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
