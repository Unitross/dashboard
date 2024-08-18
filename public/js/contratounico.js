document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('a[data-target="pagoUnico"]').addEventListener('click', function (event) {
        event.preventDefault();
        fetch('/dash-bca/contrato-unico')
            .then(response => response.text())
            .then(html => {
                console.log(html);  // Esto te permitirá ver en la consola lo que se está cargando
                document.getElementById('content').innerHTML = html;
                attachFormEventListener();
            })
            
            .catch(error => console.error('Error al cargar el formulario de contrato único:', error));
    });
});

function attachFormEventListener() {
    const form = document.querySelector('#form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const jsonData = {};
            formData.forEach((value, key) => {
                jsonData[key] = value;
            });

            fetch('/dash-bca/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'contratounico.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(error => console.error('Error al enviar el formulario:', error));
        });
    } else {
        console.error("Formulario no encontrado");
    }
}

//------------------------
//NO RECARGAR LA PAGINA
function attachFormEventListener() {
    const form = document.querySelector('#form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const jsonData = {};
            formData.forEach((value, key) => {
                jsonData[key] = value;
            });

            fetch('/dash-bca/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            })
            .then(response => {
                // Verificamos si la respuesta es un PDF
                if (response.ok) {
                    return response.blob();
                } else {
                    return response.json().then(err => { throw new Error(err.message); });
                }
            })
            .then(blob => {
                // Si la respuesta fue un PDF, lo descargamos
                const pdfURL = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = pdfURL;
                link.download = 'contratounico.pdf';
                link.click();
            })
            .catch(error => console.error('Error al enviar el formulario:', error));
        });
    } else {
        console.error("Formulario no encontrado");
    }
}
//--------------
//Mostrar número de contrato
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('a[data-target="pagoUnico"]').addEventListener('click', function (event) {
        event.preventDefault();
        fetch('/dash-bca/contrato-unico')
            .then(response => response.text())
            .then(html => {
                document.getElementById('content').innerHTML = html;
                attachFormEventListener();
                updateCurrentNumbers();
            })
            .catch(error => console.error('Error al cargar el formulario de contrato único:', error));
    });
});

function updateCurrentNumbers() {
    fetch('/dash-bca/get-current-numbers')
        .then(response => response.json())
        .then(data => {
            document.getElementById('ncontrato').value = data.ncontrato;
            document.getElementById('ncliente').value = data.ncliente;
            document.getElementById('contractNumberDisplay').textContent = `Número de contrato: ${data.ncontrato}`;
            document.getElementById('clientNumberDisplay').textContent = `Número de cliente: ${data.ncliente}`;
        })
        .catch(error => console.error('Error al obtener los números de contrato y cliente:', error));
}
