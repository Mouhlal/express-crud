const API_URL = 'http://localhost:3000/tasks';

function displayTasks() {
  fetch(API_URL)
    .then(response => response.json())
    .then(tasks => {
      const taskList = document.getElementById('taskList');
      taskList.innerHTML = tasks.map(task => `
        <div id="task-${task.id}" style="margin: 10px; border: 1px solid #ddd; padding: 10px;">
          <p>${task.name}</p>
          <p>${task.status}</p>
          <button onclick="editTask(${task.id})">Modifier</button>
          <button onclick="deleteTask(${task.id})">Supprimer</button>
        </div>
      `).join('');
    })
    .catch(error => console.error('Erreur:', error));
}

// Récupérer les tâches à afficher lors du chargement de la page
document.addEventListener('DOMContentLoaded', displayTasks);

// Fonction pour modifier une tâche
function editTask(id) {
  const newTaskName = prompt('Modifier la tâche :');
  if (newTaskName) {
    fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: newTaskName, status: 'à faire' }) // Vous pouvez ajuster la logique ici pour choisir le statut
    })
    .then(() => displayTasks())
    .catch(error => console.error('Erreur lors de la modification de la tâche:', error));
  }
}

// Fonction pour supprimer une tâche
function deleteTask(id) {
  fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    .then(() => displayTasks())
    .catch(error => console.error('Erreur lors de la suppression de la tâche:', error));
}

// Ajouter une nouvelle tâche
document.getElementById('taskForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const taskName = document.getElementById('taskName').value;
  const taskStatus = document.getElementById('taskStatus').value;
  
  const task = { name: taskName, status: taskStatus };

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  .then(() => {
    displayTasks();
    document.getElementById('taskForm').reset();
  })
  .catch(error => console.error('Erreur lors de l\'ajout de la tâche:', error));
});
