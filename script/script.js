  let passwords = JSON.parse(localStorage.getItem("passwords")) || [];
  let editIndex = -1;

  const user = JSON.parse(localStorage.getItem("user"));
  const currentUser = localStorage.getItem("loggedIn");

  window.onload = () => {
    if (!user) {
      setAuthMode("signup");
    } else if (!currentUser) {
      setAuthMode("login");
    } else {
      showSection("appSection");
      renderTable();
    }
  };

  function showSection(id) {
    document.getElementById("authSection").classList.add("hidden");
    document.getElementById("appSection").classList.add("hidden");
    document.getElementById(id).classList.remove("hidden");
  }

  function setAuthMode(mode) {
    showSection("authSection");
    const title = document.getElementById("authTitle");
    const btn = document.getElementById("authBtn");
    title.textContent = mode === "login" ? "🔐 Login to Your Account" : "📝 Create Your Master Account";
    btn.textContent = mode === "login" ? "Login" : "Sign Up";
    btn.dataset.mode = mode;
  }

  function toggleAuthMode() {
    const mode = document.getElementById("authBtn").dataset.mode;
    setAuthMode(mode === "login" ? "signup" : "login");
  }

  function toggleUpdateForm() {
    document.getElementById("updateUserForm").classList.toggle("hidden");
  }

  document.getElementById("authForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("authName").value;
    const password = document.getElementById("authPassword").value;
    const mode = document.getElementById("authBtn").dataset.mode;

    if (mode === "signup") {
      localStorage.setItem("user", JSON.stringify({ name, password }));
      localStorage.setItem("loggedIn", "true");
      showSection("appSection");
      renderTable();
    } else {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && name === user.name && password === user.password) {
        localStorage.setItem("loggedIn", "true");
        showSection("appSection");
        renderTable();
      } else {
        alert("❌ Invalid name or password!");
      }
    }
  });

  function updateUser() {
    const name = document.getElementById("updateName").value.trim();
    const password = document.getElementById("updatePassword").value.trim();
    const current = JSON.parse(localStorage.getItem("user"));
    if (name || password) {
      localStorage.setItem("user", JSON.stringify({
        name: name || current.name,
        password: password || current.password
      }));
      alert("✅ User info updated.");
    } else {
      alert("⚠️ Enter new name or password.");
    }
  }

  function logout() {
    localStorage.removeItem("loggedIn");
    location.reload();
  }

  document.getElementById("passwordForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const app = document.getElementById("appName").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const entry = { app, username, password };

    if (editIndex === -1) {
      passwords.push(entry);
      alert("✅ Password Saved!");
    } else {
      passwords[editIndex] = entry;
      alert("✏️ Password Updated!");
      editIndex = -1;
    }

    localStorage.setItem("passwords", JSON.stringify(passwords));
    renderTable();
    document.getElementById("passwordForm").reset();
  });

  function deletePassword(index) {
    if (confirm("Are you sure to delete?")) {
      passwords.splice(index, 1);
      localStorage.setItem("passwords", JSON.stringify(passwords));
      renderTable();
    }
  }

  function editPassword(index) {
    const data = passwords[index];
    document.getElementById("appName").value = data.app;
    document.getElementById("username").value = data.username;
    document.getElementById("password").value = data.password;
    editIndex = index;
  }

  function togglePassword(index) {
    const span = document.getElementById(`pw-${index}`);
    const isHidden = span.textContent === "********";
    span.textContent = isHidden ? passwords[index].password : "********";
  }

  document.getElementById("searchInput").addEventListener("input", function () {
    renderTable(this.value);
  });

  function renderTable(filter = "") {
    const tbody = document.querySelector("#passwordTable tbody");
    tbody.innerHTML = "";
    passwords.forEach((item, index) => {
      if (item.app.toLowerCase().includes(filter.toLowerCase())) {
        tbody.innerHTML += `
          <tr>
            <td>${item.app}</td>
            <td>${item.username}</td>
            <td>
              <span id="pw-${index}">********</span>
              <div class="actions">
                <button class="toggle" onclick="togglePassword(${index})">Show</button>
                <button class="update" onclick="editPassword(${index})">Update</button>
                <button class="delete" onclick="deletePassword(${index})">Delete</button>
              </div>
            </td>
          </tr>`;
      }
    });
  }