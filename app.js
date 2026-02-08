const API_URL = "https://script.google.com/macros/s/AKfycbwaFsPr9icZiHeXlGj31CAMJ0aZ0tbBdDPP0kxIM_nSEyfE-UcOZz5YsqcvZm8zTy5i6g/exec";

let editMode = false;

function loadData() {
  fetch(API_URL + "?action=read")
    .then(res => res.json())
    .then(data => renderTable(data));
}

function renderTable(data) {
  const tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  data.forEach(row => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td align="center">${row.ID}</td>
      <td align="center">${row.Name}</td>
      <td align="center">${row.Age}</td>
      <td align="center">
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">🗑️</button>
      </td>
    `;

    tr.querySelector(".edit-btn").onclick = () => editRow(row);
    tr.querySelector(".delete-btn").onclick = () => deleteRow(row.ID);

    tbody.appendChild(tr);
  });
}


function showAddForm() {
  editMode = false;
  document.getElementById("formTitle").innerText = "Add Student";
  document.getElementById("id").value = "";
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.getElementById("formContainer").classList.remove("hidden");
}

function editRow(row) {
  editMode = true;
  document.getElementById("formTitle").innerText = "Update Student";
  document.getElementById("id").value = row.ID;
  document.getElementById("name").value = row.Name;
  document.getElementById("age").value = row.Age;
  document.getElementById("formContainer").classList.remove("hidden");
}

function hideForm() {
  document.getElementById("formContainer").classList.add("hidden");
}

function submitForm() {
  const id = document.getElementById("id").value;
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;

  const action = editMode ? "update" : "create";

  fetch(API_URL + "?action=" + action, {
    method: "POST",
    body: JSON.stringify({ id, name, age })
  })
  .then(res => res.json())
  .then(() => {
    hideForm();
    loadData();
  });
}

function deleteRow(id) {
  if (!confirm("Are you sure?")) return;

  fetch(API_URL + "?action=delete", {
    method: "POST",
    body: JSON.stringify({ id })
  })
  .then(res => res.json())
  .then(() => loadData());
}

function searchData() {
  const keyword = document.getElementById("search").value.toLowerCase();

  fetch(API_URL + "?action=read")
    .then(res => res.json())
    .then(data => {
      const filtered = data.filter(row =>
        row.Name.toLowerCase().includes(keyword) ||
        row.ID.toString().includes(keyword)
      );
      renderTable(filtered);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  loadData();
  document.getElementById("addBtn").addEventListener("click", showAddForm);
  document.getElementById("searchBtn").addEventListener("click", searchData);
  loadData();
});
