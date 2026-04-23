const loginForm = document.getElementById('login');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    //console.log(`Tentative de connexion avec email: ${email} et mot de passe: ${password}`); // Log pour vérifier les valeurs

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            //console.log('Connexion réussie, token stocké dans localStorage : ', data.token); // Log pour vérifier le token
            window.location.href = 'index.html'; // Redirige vers la page d'accueil
        } else {
            const errorData = await response.json();
            console.error('Erreur de connexion:', errorData.message);
            alert('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
    } finally {
        document.getElementById('email').value = ''; // Efface le champ email
        document.getElementById('password').value = ''; // Efface le champ mot de passe
    }
});