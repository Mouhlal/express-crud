const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json'); 
require('dotenv').config();
app.set("view engine", "ejs");



app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 

}));

app.use(express.static('public'));
app.use(bodyParser.json());


app.get('/tasks', checkAuth, (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la lecture des tâches' });
    }

    const users = JSON.parse(data).users;
    const user = users.find(u => u.id === req.session.userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user.tasks);
  });
});



app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la lecture des utilisateurs' });
    }

    const users = JSON.parse(data).users;
    const user = users.find(u => (u.email === email) && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    req.session.userId = user.id;
    res.json({ message: 'Connexion réussie', userId: user.id }); 
  });
});



app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
    }
    return res.json({ message: 'Déconnexion réussie' });
  });
});

app.get('/auth-status', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ authenticated: true });
    console.log(req.session.user);
  } else {
    res.json({ authenticated: false });
    
  }
});


app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la lecture des utilisateurs' });
    }

    const users = JSON.parse(data).users;
    const existingUser = users.find(u => u.username === username || u.email === email);

    if (existingUser) {
      return res.status(400).json({ error: 'Nom d\'utilisateur ou email déjà pris' });
    }

    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
      tasks: []
    };

    users.push(newUser);
    fs.writeFile(DATA_FILE, JSON.stringify({ users }, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur' });
      }

      return res.status(201).json(newUser);
    });
  });
});

function checkAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Utilisateur non connecté' });
  }
  next();
}

app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  res.render("dashboard", { user: req.session.user });
});

app.post('/tasks', checkAuth, (req, res) => {
  const newTask = req.body;
  newTask.status = newTask.status || "à faire"; 

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la lecture des tâches' });
    }

    const users = JSON.parse(data).users;
    const user = users.find(u => u.id === req.session.userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    newTask.id = Date.now();
    user.tasks.push(newTask);

    fs.writeFile(DATA_FILE, JSON.stringify({ users }, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de l\'ajout de la tâche' });
      }

      return res.status(201).json(newTask); 
    });
  });
});

app.put('/tasks/:id', checkAuth, (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const updatedTask = req.body;

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la lecture des tâches' });
    }

    const users = JSON.parse(data).users;
    const user = users.find(u => u.id === req.session.userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const taskIndex = user.tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    user.tasks[taskIndex] = { ...user.tasks[taskIndex], ...updatedTask };

    fs.writeFile(DATA_FILE, JSON.stringify({ users }, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de l\'écriture des tâches' });
      }

      return res.json(user.tasks[taskIndex]);
    });
  });
});

app.delete('/tasks/:id', checkAuth, (req, res) => {
  const taskId = parseInt(req.params.id, 10);

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la lecture des tâches' });
    }

    let users = JSON.parse(data).users;
    const user = users.find(u => u.id === req.session.userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    user.tasks = user.tasks.filter(task => task.id !== taskId);

    fs.writeFile(DATA_FILE, JSON.stringify({ users }, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de l\'écriture des tâches' });
      }

      return res.status(204).end();  
    });
  });
});


app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
