document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío predeterminado del formulario

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/dash-bca/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            window.location.href = '/dash-bca/dashboard';
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});
