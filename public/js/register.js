function loadContent(url) {
    // Cerrar todos los modales antes de cargar contenido nuevo
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            const contentElement = document.getElementById('content');
            if (contentElement) {
                contentElement.innerHTML = html;

                // Aquí registramos el evento de submit del formulario después de que se haya cargado
                const registerForm = document.getElementById('registerForm');

                if (registerForm) {
                    registerForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        const fullName = document.getElementById('fullName').value;
                        const username = document.getElementById('username').value;
                        const password = document.getElementById('password').value;
                        const role = document.getElementById('role').value;
                    
                        fetch('/dash-bca/register', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ fullName, username, password, role })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.message) {
                                alert(data.message);
                            }
                        })
                        .catch(error => console.error('Error al registrar el usuario:', error));
                    });
                } else {
                    console.error('Formulario de registro no encontrado en el DOM');
                }
            } else {
                console.error('Elemento con id "content" no encontrado en el DOM');
            }
        })
        .catch(error => console.error('Error al cargar el contenido:', error));
}


// Cargar el formulario de registro cuando se haga clic en "Registrar Usuario"
document.getElementById('registerLink').addEventListener('click', function(e) {
    e.preventDefault();  // Prevenir que el enlace haga una redirección completa
    loadContent('/dash-bca/register');
});

// Cerrar el contenido

function closeContent() {
    const contentElement = document.getElementById('content');
    if (contentElement) {
        contentElement.innerHTML = ''; // Borra el contenido
      
    }
}
