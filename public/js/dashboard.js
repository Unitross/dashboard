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

