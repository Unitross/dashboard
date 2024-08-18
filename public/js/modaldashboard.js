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

//-----------------------------------------
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
    displayContactsPage(1); // Cargar la primera página
    const modal = document.getElementById('verClientesModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Función para CERRAR el modal de "Ver Clientes"
function closeVerClientesModal() {
    const modal = document.getElementById('verClientesModal');
    if (modal) {
        modal.style.display = 'none';
    }
}


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

//------------------------------------------
// Habilitar la edición de una fila
function enableEdit(button) {
    const row = button.closest('tr');
    row.querySelectorAll('td[contenteditable="false"]').forEach(td => {
        td.setAttribute('contenteditable', 'true');
    });
    button.style.display = 'none';
    row.querySelector('.save-btn').style.display = 'inline-block';
    row.querySelector('.cancel-btn').style.display = 'inline-block';
}

// Guardar los cambios realizados en una fila
function saveEdit(button) {
    const row = button.closest('tr');
    const clienteId = row.getAttribute('data-id'); // Obtener el ID del cliente
    const updatedData = {};

    // Recorrer cada celda editable y obtener los datos
    row.querySelectorAll('td[contenteditable="true"]').forEach(td => {
        td.setAttribute('contenteditable', 'false');
        const fieldName = td.getAttribute('data-field'); // Obtener el campo de la base de datos
        
        if (fieldName) {
            updatedData[fieldName] = td.textContent.trim(); // Agregar el valor actualizado
        } else {
            console.error('data-field attribute missing in td:', td);
        }
    });
    
    if (!clienteId) {
        console.error('Cliente ID is missing in the row:', row);
        return;
    }

    // Enviar los datos actualizados al servidor
    fetch('/dash-bca/actualizar-cliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: clienteId, ...updatedData }), // Enviar ID y datos actualizados
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la actualización del cliente');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            console.error('Error al actualizar el cliente:', data.error);
        } else {
            console.log('Cliente actualizado:', data.cliente);
        }
    })
    .catch(error => console.error('Error al enviar los datos:', error));

    button.style.display = 'none';
    row.querySelector('.edit-btn').style.display = 'inline-block';
    row.querySelector('.cancel-btn').style.display = 'none';
}

//----------------------------------------
// Cancelar la edición y restaurar valores originales
function cancelEdit(button) {
    const row = button.closest('tr');
    row.querySelectorAll('td[contenteditable="true"]').forEach(td => {
        td.setAttribute('contenteditable', 'false');
    });
    button.style.display = 'none';
    row.querySelector('.edit-btn').style.display = 'inline-block';
    row.querySelector('.save-btn').style.display = 'none';
}

//-----------------------------------------
// Hacer que la tabla sea desplazable con el mouse
const tablaClientes = document.getElementById('tablaClientes');
let isDown = false;
let startX;
let scrollLeft;

tablaClientes.addEventListener('mousedown', (e) => {
    isDown = true;
    tablaClientes.classList.add('active');
    startX = e.pageX - tablaClientes.offsetLeft;
    scrollLeft = tablaClientes.scrollLeft;
});

tablaClientes.addEventListener('mouseleave', () => {
    isDown = false;
    tablaClientes.classList.remove('active');
});

tablaClientes.addEventListener('mouseup', () => {
    isDown = false;
    tablaClientes.classList.remove('active');
});

tablaClientes.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - tablaClientes.offsetLeft;
    const walk = (x - startX) * 3; // Velocidad de desplazamiento
    tablaClientes.scrollLeft = scrollLeft - walk;
});

//----------------------------------------------
let currentPage = 1;
const rowsPerPage = 20;

function displayContactsPage(page, searchTerm = '') {
    fetch(`/dash-bca/ver-clientes?page=${page}&limit=${rowsPerPage}&search=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#tablaClientes tbody');
            tbody.innerHTML = ''; // Limpia la tabla

            console.log('Datos recibidos para la página', page, ':', data.clientes);
            console.log('Total de registros:', data.total);

            if (data.clientes.length === 0) {
                tbody.insertAdjacentHTML('beforeend', '<tr><td colspan="16">No hay clientes registrados</td></tr>');
            } else {
                data.clientes.forEach(cliente => {
                    const row = `
                        <tr data-id="${cliente.id}">
                            <td contenteditable="false" data-field="nombre">${cliente.nombre}</td>
                            <td contenteditable="false" data-field="apellido">${cliente.apellido}</td>
                            <td contenteditable="false" data-field="dni">${cliente.dni}</td>
                            <td contenteditable="false" data-field="nombreEmpresa">${cliente.nombreEmpresa}</td>
                            <td contenteditable="false" data-field="email">${cliente.email}</td>
                            <td contenteditable="false" data-field="telefono">${cliente.telefono}</td>
                            <td contenteditable="false" data-field="direccion">${cliente.direccion}</td>
                            <td contenteditable="false" data-field="ciudad">${cliente.ciudad}</td>
                            <td contenteditable="false" data-field="codigoPostal">${cliente.codigoPostal}</td>
                            <td contenteditable="false" data-field="pais">${cliente.pais}</td>
                            <td contenteditable="false" data-field="website">${cliente.website}</td>
                            <td contenteditable="false" data-field="serviciosContratados">${cliente.serviciosContratados}</td>
                            <td contenteditable="false" data-field="fechaContratacion">${cliente.fechaContratacion}</td>
                            <td contenteditable="false" data-field="tipoContacto">${cliente.tipoContacto}</td>
                            <td contenteditable="false" data-field="tags">${cliente.tags}</td>
                            <td contenteditable="false" data-field="notas">${cliente.notas}</td>
                            <td>
                                <button class="edit-btn" onclick="enableEdit(this)">Editar</button>
                                <button class="save-btn" onclick="saveEdit(this)" style="display:none;">Guardar</button>
                                <button class="cancel-btn" onclick="cancelEdit(this)" style="display:none;">Cancelar</button>
                            </td>
                        </tr>`;
                    tbody.insertAdjacentHTML('beforeend', row);
                });

                const totalPages = Math.ceil(data.total / rowsPerPage);
                document.getElementById('prevPage').disabled = (page === 1);
                document.getElementById('nextPage').disabled = (page >= totalPages);
                console.log('Botones: Anterior –', page === 1, ', Siguiente –', page >= totalPages);
            }
        })
        .catch(error => console.error('Error al cargar los datos de los clientes:', error));
}

//----------
function refreshModal(page) {
    document.getElementById('verClientesModal').style.display = 'none';
    displayContactsPage(page);
    document.getElementById('verClientesModal').style.display = 'block';
}

// Inicialización de la paginación y carga de la primera página
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('openVerClientesModal').addEventListener('click', function(e) {
        e.preventDefault();
        currentPage = 1; // Resetea la página actual a 1
        displayContactsPage(currentPage); // Cargar la primera página
        document.getElementById('verClientesModal').style.display = 'block';
    });

    // Botones de paginación
    document.getElementById('prevPage').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            refreshModal(currentPage);
        }
    });

    document.getElementById('nextPage').addEventListener('click', function() {
        currentPage++;
        refreshModal(currentPage);
    });
});

//-------------------------------
//Filtro
document.getElementById('filtroCliente').addEventListener('input', function() {
    const searchTerm = this.value.trim().toLowerCase();
    currentPage = 1; // Reinicia a la primera página
    displayContactsPage(currentPage, searchTerm);
})
