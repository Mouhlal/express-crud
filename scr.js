const apiUrl = "https://localhost:3000/userss"; 
const usersTable = document.querySelector("#usersTable tbody");
const userForm = document.querySelector("#userForm");
const userIdInput = document.querySelector("#userId");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");

async function fetchUsers() {
    try {
        const response = await fetch(apiUrl);
        const users = await response.json();

        usersTable.innerHTML = ""; 
        users.forEach((user) => {
            const row = `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <button onclick="editUser('${user.name}', '${user.email}')">Modifier</button>
                        <button onclick="deleteUser(${user.id})">Supprimer</button>
                    </td>
                </tr>
            `;
            usersTable.innerHTML += row;
        });
    } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
    }
}

userForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = userIdInput.value;
    const name = nameInput.value;
    const email = emailInput.value;

    const payload = { name, email };

    try {
        const method = id ? "PUT" : "POST";
        const url = id ? `${apiUrl}/${id}` : apiUrl;

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        userForm.reset();
        fetchUsers(); 
    } catch (error) {
        console.error("Erreur lors de l'enregistrement:", error);
    }
});

function editUser(id, name, email) {
    userIdInput.value = id;
    nameInput.value = name;
    emailInput.value = email;
}

async function deleteUser(id) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;

    try {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        fetchUsers();
    } catch (error) {
        console.error("Erreur lors de la suppression:", error);
    }
}

fetchUsers();
