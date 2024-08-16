// Función para abrir un modal y cerrar otros

function openModal(modalId) {

    // Cerrar todos los modales abiertos antes de abrir el nuevo

    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });

 // Cerrar el contenedor que contiene el formulario de registro
 
 const contentElement = document.getElementById('content');
 if (contentElement) {
     contentElement.innerHTML = ''; // Borra el contenido
 }


    // Abrir el modal solicitado
    const modalToOpen = document.getElementById(modalId);
    if (modalToOpen) {
        modalToOpen.style.display = 'block';
    }
}

// Función para cerrar un modal específico
function closeModal(modalId) {
    const modalToClose = document.getElementById(modalId);
    if (modalToClose) {
        modalToClose.style.display = 'none';
    }
}

// Asegurarse de que los botones o enlaces de los modales tengan el comportamiento esperado
document.querySelectorAll('.modal-button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();  // Prevenir el comportamiento predeterminado del enlace
        const targetModal = button.getAttribute('data-target');
        openModal(targetModal);
    });
});

// Cerrar con la 'X' en cada modal
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', function() {
        const modal = button.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
});

// También puedes agregar un evento para cerrar los modales si se hace clic fuera de ellos

window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    const contentElement = document.getElementById('content');

    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    if (contentElement && !contentElement.contains(event.target)) {
        contentElement.innerHTML = ''; // Borra el contenido si se hace clic fuera de él
    }
});