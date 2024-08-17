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

//MODAL DE  REGISTROS DE CLIENTES

// Asegúrate de que el documento esté completamente cargado antes de agregar el evento
document.addEventListener('DOMContentLoaded', function() {
    // Agregar un event listener al botón para abrir el modal
    document.getElementById('openNuevoClienteModal').addEventListener('click', function(e) {
        e.preventDefault();  // Prevenir el comportamiento por defecto del enlace
        openNuevoClienteModal();
    });
});

// Asegurarse de que el modal esté cerrado al cargar la página


// Función para ABRIR el modal de Nuevo Cliente
function openNuevoClienteModal() {
    const modal = document.getElementById('nuevoClienteModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Función para CERRAR el modal de Nuevo Cliente
function closeNuevoClienteModal() {
    const modal = document.getElementById('nuevoClienteModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('nuevoClienteForm').reset(); // Limpia el formulario
    }
}

// Cerrar el modal cuando se hace clic fuera de él
window.addEventListener('click', function(event) {
    const modal = document.getElementById('nuevoClienteModal');
    if (event.target === modal) {
        closeNuevoClienteModal();
    }
});

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

// Cerrar el modal si se hace clic en cualquier otro botón o enlace en la página
document.querySelectorAll('button:not(.nuevoCliente-btn), a').forEach(element => {
    element.addEventListener('click', function(event) {
        const modal = document.getElementById('nuevoClienteModal');
        if (modal && modal.style.display === 'block') {
            closeNuevoClienteModal();
        }
    });
});

//MODAL PARA VER A LOS CLIENTES

// Asegúrate de que el documento esté completamente cargado antes de agregar el evento
document.addEventListener('DOMContentLoaded', function() {
    // Abrir modal de "Registrar Cliente"
    document.getElementById('openNuevoClienteModal').addEventListener('click', function(e) {
        e.preventDefault();
        openNuevoClienteModal();
    });

    // Abrir modal de "Ver Clientes"
    document.getElementById('openVerClientesModal').addEventListener('click', function(e) {
        e.preventDefault();
        openVerClientesModal();
    });
});

// Función para ABRIR el modal de "Registrar Cliente"
function openNuevoClienteModal() {
    closeModals(); // Cerrar otros modales
    const modal = document.getElementById('nuevoClienteModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Función para CERRAR el modal de "Registrar Cliente"
function closeNuevoClienteModal() {
    const modal = document.getElementById('nuevoClienteModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('nuevoClienteForm').reset(); // Limpia el formulario
    }
}

// Función para ABRIR el modal de "Ver Clientes"
function openVerClientesModal() {
    closeModals(); // Cerrar otros modales
    fetch('/dash-bca/ver-clientes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.querySelector('#tablaClientes tbody');
            tbody.innerHTML = ''; // Limpia la tabla

            if (data.length === 0) {
                tbody.insertAdjacentHTML('beforeend', '<tr><td colspan="16">No hay clientes registrados</td></tr>');
            } else {
                data.forEach(cliente => {
                    const row = `
                        <tr>
                            <td>${cliente.nombre}</td>
                            <td>${cliente.apellido}</td>
                            <td>${cliente.dni}</td>
                            <td>${cliente.nombreEmpresa}</td>
                            <td>${cliente.email}</td>
                            <td>${cliente.telefono}</td>
                            <td>${cliente.direccion}</td>
                            <td>${cliente.ciudad}</td>
                            <td>${cliente.codigoPostal}</td>
                            <td>${cliente.pais}</td>
                            <td>${cliente.website}</td>
                            <td>${cliente.serviciosContratados}</td>
                            <td>${cliente.fechaContratacion}</td>
                            <td>${cliente.tipoContacto}</td>
                            <td>${cliente.tags}</td>
                            <td>${cliente.notas}</td>
                        </tr>`;
                    tbody.insertAdjacentHTML('beforeend', row);
                });
            }
            const modal = document.getElementById('verClientesModal');
            if (modal) {
                modal.style.display = 'block';
            }
        })
        .catch(error => console.error('Error al cargar los datos de los clientes:', error));
}

// Función para CERRAR el modal de "Ver Clientes"
function closeVerClientesModal() {
    const modal = document.getElementById('verClientesModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Cerrar modales si se hace clic fuera de ellos
window.addEventListener('click', function(event) {
    const modalNuevoCliente = document.getElementById('nuevoClienteModal');
    const modalVerClientes = document.getElementById('verClientesModal');
    
    if (event.target === modalNuevoCliente) {
        closeNuevoClienteModal();
    } else if (event.target === modalVerClientes) {
        closeVerClientesModal();
    }
});

// Cerrar todos los modales
function closeModals() {
    closeNuevoClienteModal();
    closeVerClientesModal();
}

// Cerrar los modales si se hace clic en cualquier otro botón o enlace
document.querySelectorAll('button:not(.nuevoCliente-btn), a').forEach(element => {
    element.addEventListener('click', function() {
        closeModals();
    });
});

//----------------------
