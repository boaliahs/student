const API_URL = "https://script.google.com/macros/s/AKfycbwaFsPr9icZiHeXlGj31CAMJ0aZ0tbBdDPP0kxIM_nSEyfE-UcOZz5YsqcvZm8zTy5i6g/exec";

function loadData() {
  fetch(API_URL + "?action=read")
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#table tbody");
      tbody.innerHTML = "";

      data.forEach(row => {
        tbody.innerHTML += `
          <tr>
            <td>${row.ID}</td>
            <td>${row.Name}</td>
            <td>${row.Age}</td>
          </tr>
        `;
      });
    });
}

function createData() {
  sendData("create");
}

function updateData() {
  sendData("update");
}

function deleteData() {
  const id = document.getElementById("id").value;

  fetch(API_URL + "?action=delete", {
    method: "POST",
    body: JSON.stringify({ id })
  }).then(() => loadData());
}

function sendData(action) {
  const id = document.getElementById("id").value;
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;

  fetch(API_URL + "?action=" + action, {
    method: "POST",
    body: JSON.stringify({ id, name, age })
  }).then(() => loadData());
}

window.onload = loadData;
