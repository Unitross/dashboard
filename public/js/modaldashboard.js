// MODALES DEL MENÚ DEL PERFIL

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

//------------------------------------------------------

//Modal de REGISTROS DE CLIENTES

// Función para abrir el modal de Nuevo Cliente

function openNuevoClienteModal() {
    document.getElementById('nuevoClienteModal').style.display = 'block';
}

// Función para cerrar el modal de Nuevo Cliente

function closeNuevoClienteModal() {
    document.getElementById('nuevoClienteModal').style.display = 'none';
}

// Función para manejar el envío del formulario de nuevo cliente

document.getElementById('nuevoClienteForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const datosParaEnviar = Object.fromEntries(formData.entries());

    fetch('/dash-bca/guardar-cliente', {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosParaEnviar),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        mostrarMensajeExito();
        closeNuevoClienteModal();  // Cierra el modal si se guarda correctamente
    })
    .catch(error => console.error('Error al enviar los datos:', error));
});

// Función para mostrar el mensaje de éxito

function mostrarMensajeExito() {
    const mensaje = document.getElementById('mensajeExito');
    mensaje.style.display = 'block';
    setTimeout(() => {
        mensaje.style.display = 'none';
    }, 3000); // Desaparece después de 3 segundos
}

// Cerrar el modal cuando se hace clic fuera de él

window.addEventListener('click', function(event) {
    const modal = document.getElementById('nuevoClienteModal');
    if (event.target === modal) {
        closeNuevoClienteModal();
    }
});
