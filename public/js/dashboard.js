// Función para manejar el clic en los botones del menú lateral
function handleMenuClick(contentId) {
    // Cerrar cualquier contenido abierto
    document.querySelectorAll('.content').forEach(content => {
        content.style.display = 'none';
    });

    // Mostrar el contenido correspondiente al botón presionado
    const contentToShow = document.getElementById(contentId);
    if (contentToShow) {
        contentToShow.style.display = 'block';
    }

    // Quitar clase 'active' de todos los botones
    document.querySelectorAll('nav ul li a').forEach(btn => btn.classList.remove('active'));

    // Agregar clase 'active' al botón presionado
    const link = document.querySelector(`nav ul li a[data-target="${contentId}"]`);
    if (link) {
        link.classList.add('active');
    }
}

// Asignar la función a cada botón del menú lateral
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // Evitar que el enlace realice la acción predeterminada

        const targetContent = this.getAttribute('data-target');
        if (targetContent) {
            handleMenuClick(targetContent);
        }
    });
});

// Función para manejar el menú de perfil
function toggleProfileMenu() {
    const menu = document.getElementById('profileMenu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

// Cierra el menú si se hace clic fuera de él
window.addEventListener('click', function(event) {
    const menu = document.getElementById('profileMenu');
    const profilePic = document.querySelector('.profile-pic');
    if (event.target !== profilePic && !menu.contains(event.target)) {
        menu.style.display = 'none';
    }
});
