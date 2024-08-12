document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío predeterminado del formulario

    grecaptcha.ready(function() {
        grecaptcha.execute('6Le3QyUqAAAAANU3gm110CvjRwby4lp1a4Y_yizi', {action: 'submit'}).then(function(token) {
            // Llama a la función para enviar el formulario después de obtener el token
            onSubmit(token);
        });
    });
});

function onSubmit(token) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password,
            recaptchaToken: token
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/dashboard';
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}
