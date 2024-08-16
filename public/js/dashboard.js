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



// Manejo de imagen de perfil

function loadImage(event) {
    const image = document.getElementById('image');
    image.src = URL.createObjectURL(event.target.files[0]);

    if (image.cropper) {
        image.cropper.destroy();
    }

    image.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        autoCropArea: 1,
    });
}

// Función para recortar la imagen y enviarla al servidor

function cropImage() {
    const image = document.getElementById('image');
    const cropper = image.cropper;

    cropper.getCroppedCanvas().toBlob((blob) => {
        const formData = new FormData();
        formData.append('croppedImage', blob);

        fetch('/dash-bca/change-photo', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Imagen cambiada con éxito.');
                location.reload();
            } else {
                alert('Error al subir la imagen.');
            }
        })
        .catch(error => console.error('Error al subir la imagen:', error));
    });
}


// Manejar el formulario de cambio de nombre

document.getElementById('changeNameForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir que el formulario se envíe de la forma tradicional

    const newUsername = document.getElementById('newUsername').value;

    fetch('/dash-bca/change-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUsername: newUsername })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Nombre de usuario cambiado con éxito.');
            closeModal('changeNameModal'); // Cerrar el modal después de cambiar el nombre
            location.reload(); // Recargar la página para reflejar el cambio
        } else {
            alert(data.message); // Mostrar el mensaje de error si algo salió mal
        }
    })
    .catch(error => console.error('Error al cambiar el nombre:', error));
});

// Manejar el formulario de cambio de contraseña

document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir el envío del formulario

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    // Validar que las contraseñas nuevas coincidan
    if (newPassword !== confirmNewPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    fetch('/dash-bca/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPassword, newPassword: newPassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Contraseña cambiada con éxito.');
            closeModal('changePasswordModal'); // Cerrar el modal después de cambiar la contraseña
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error al cambiar la contraseña:', error));
});


