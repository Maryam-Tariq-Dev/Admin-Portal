/***************************************************************
 * GLOBAL VARIABLES
 ***************************************************************/
let isLoggedIn = true;

// Updated admin credentials
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "password";

// Dummy properties array (in-memory)
let properties = [
  {
    id: 1,
    name: "Hostel A",
    location: "Gulshan",
    type: "Hostel",
    price: 5000,
    description: "Basic hostel in Gulshan",
  },
  {
    id: 2,
    name: "Flat B",
    location: "Clifton",
    type: "Flat",
    price: 25000,
    description: "2-bedroom flat in Clifton",
  },
];

let editPropertyId = null; // Track which property is being edited

/***************************************************************
 * ON PAGE LOAD
 ***************************************************************/
document.addEventListener("DOMContentLoaded", () => {
  // Identify current page based on URL
  const page = window.location.pathname.split("/").pop();

  // If on index.html (Login page)
  if (page === "index.html" || page === "") {
    initLoginPage();
  } else {
    // For all other pages, ensure user is logged in
    if (!isLoggedIn) {
      window.location.href = "index.html";
      return;
    }

    switch (page) {
      case "dashboard.html":
        initDashboardPage();
        break;
      case "add-property.html":
        initAddPropertyPage();
        break;
      case "manage-properties.html":
        initManagePropertiesPage();
        break;
      default:
        break;
    }
  }
});

/***************************************************************
 * LOGIN PAGE LOGIC
 ***************************************************************/
function initLoginPage() {
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      // Basic validation against hardcoded credentials
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        isLoggedIn = true;
        window.location.href = "dashboard.html";
      } else {
        loginError.textContent = "Invalid email or password";
      }
    });
  }
}

/***************************************************************
 * DASHBOARD PAGE LOGIC
 ***************************************************************/
function initDashboardPage() {
  // Display total properties
  const totalPropertiesElem = document.getElementById("totalProperties");
  if (totalPropertiesElem) {
    totalPropertiesElem.textContent = properties.length;
  }

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
}

/***************************************************************
 * ADD PROPERTY PAGE LOGIC
 ***************************************************************/
function initAddPropertyPage() {
  // Check if we're editing
  const urlParams = new URLSearchParams(window.location.search);
  editPropertyId = urlParams.get("id") ? parseInt(urlParams.get("id")) : null;

  if (editPropertyId) {
    prefillEditData(editPropertyId);
  }

  const propertyForm = document.getElementById("propertyForm");
  const successMessage = document.getElementById("successMessage");
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  if (propertyForm) {
    propertyForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("propertyName").value.trim();
      const location = document.getElementById("location").value;
      const type = document.querySelector(
        'input[name="propertyType"]:checked'
      )?.value;
      const price = document.getElementById("price").value;
      const description = document.getElementById("description").value;

      if (editPropertyId) {
        // Edit existing
        const propIndex = properties.findIndex((p) => p.id === editPropertyId);
        if (propIndex !== -1) {
          properties[propIndex].name = name;
          properties[propIndex].location = location;
          properties[propIndex].type = type;
          properties[propIndex].price = parseInt(price);
          properties[propIndex].description = description;
        }
        successMessage.textContent = "Property updated successfully!";
      } else {
        // Add new property
        const newProperty = {
          id: properties.length ? properties[properties.length - 1].id + 1 : 1,
          name,
          location,
          type,
          price: parseInt(price),
          description,
        };
        properties.push(newProperty);
        successMessage.textContent = "Property added successfully!";
      }

      // Clear form and edit ID
      editPropertyId = null;
      propertyForm.reset();

      // Optionally redirect after a short delay
      setTimeout(() => {
        successMessage.textContent = "";
        window.location.href = "manage-properties.html";
      }, 1500);
    });
  }
}

function prefillEditData(propId) {
  const property = properties.find((p) => p.id === propId);
  if (!property) return;

  document.getElementById("propertyName").value = property.name;
  document.getElementById("location").value = property.location;
  const radioToCheck = document.querySelector(
    `input[name="propertyType"][value="${property.type}"]`
  );
  if (radioToCheck) {
    radioToCheck.checked = true;
  }
  document.getElementById("price").value = property.price;
  document.getElementById("description").value = property.description;
}

/***************************************************************
 * MANAGE PROPERTIES PAGE LOGIC
 ***************************************************************/
function initManagePropertiesPage() {
  renderPropertiesTable();

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
}

function renderPropertiesTable() {
  const tableBody = document.querySelector("#propertiesTable tbody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  properties.forEach((property) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${property.name}</td>
      <td>${property.location}</td>
      <td>${property.type}</td>
      <td>${property.price}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-warning me-2" onclick="editProperty(${property.id})">
          Edit
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteProperty(${property.id})">
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function editProperty(propId) {
  // Navigate to add-property.html with query param
  window.location.href = `add-property.html?id=${propId}`;
}

function deleteProperty(propId) {
  properties = properties.filter((p) => p.id !== propId);
  renderPropertiesTable(); // re-render the updated table
}

/***************************************************************
 * LOGOUT LOGIC
 ***************************************************************/
function handleLogout() {
  isLoggedIn = false;
  window.location.href = "index.html";
}
