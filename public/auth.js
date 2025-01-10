
   
    document.getElementById('registerForm').addEventListener('submit', function (e) {
        e.preventDefault();
  
        const user = {
          username: document.getElementById('username').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value
        };
  
        fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Inscription réussie !');
            window.location.href = '/login';  
          } else {
            window.location.href = '/login'; 
          }
        });
      });
  
  
    document.addEventListener('DOMContentLoaded', function () {
      fetch('/auth-status', { credentials: 'include' }) 
        .then(response => response.json())
        .then(data => {
          const loginLink = document.getElementById('loginLink');
          const logoutLink = document.getElementById('logoutLink');
  
          if (data.authenticated) {
            loginLink.style.display = 'none'; 
            logoutLink.style.display = 'inline'; 
          } else {
            loginLink.style.display = 'inline'; 
            logoutLink.style.display = 'none';
          }
        })
        .catch(err => console.error('Erreur lors de la vérification de l\'authentification :', err));
    });
  
    document.getElementById('logoutLink').addEventListener('click', function (e) {
      e.preventDefault();
  
      fetch('/logout', {
        method: 'POST',
        credentials: 'include',
      })
        .then(response => {
          if (response.ok) {
            alert('Déconnexion réussie');
            window.location.href = '/login'; 
          } else {
            alert('Erreur lors de la déconnexion');
          }
        })
        .catch(err => console.error('Erreur lors de la requête de déconnexion :', err));
    });
  
  
  