// Cargar el contenido en el DASH cuando se selecciona "Crear Contrato (Ú)"
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('a[data-target="pagoUnico"]').addEventListener('click', function (event) {
        event.preventDefault(); // Prevenir la acción predeterminada del enlace

        fetch('/dash-bca/contrato-unico')
            .then(response => response.text())
            .then(html => {
                document.getElementById('content').innerHTML = html;
                attachFormEventListener(); // Vincular el event listener del formulario después de cargar el contenido
            })
            .catch(error => {
                console.error('Error al cargar el formulario de contrato único:', error);
            });
    });
});

// Función para cargar imágenes
function loadImage(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "blob";
        xhr.onload = function () {
            const reader = new FileReader();
            reader.onload = function(event) {
                resolve(event.target.result);
            };
            const file = this.response;
            reader.readAsDataURL(file);
        };
        xhr.send();
    });
}

// Función para vincular el event listener del formulario
function attachFormEventListener() {
    const form = document.querySelector('#form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Acceder a jsPDF directamente desde window.jspdf.jsPDF
            const pdf = new window.jspdf.jsPDF('p', 'pt', 'letter');

            // Recoger los valores del formulario
            const ncliente = document.getElementById('ncliente').value;
            const ncontrato = document.getElementById('ncontrato').value;
            const nombreco = document.getElementById('nombreco').value;
            const rsocial = document.getElementById('rsocial').value;
            const dni = document.getElementById('dni').value;
            const telefono = document.getElementById('telefono').value;
            const telefonofijo = document.getElementById('telefonofijo').value;
            const nombrea = document.getElementById('nombrea').value;
            const email = document.getElementById('email').value;
            const direccion = document.getElementById('direccion').value;
            const municipio = document.getElementById('municipio').value;
            const provincia = document.getElementById('provincia').value;
            const cp = document.getElementById('cp').value;
            const pais = document.getElementById('pais').value;
            const pcontacto = document.getElementById('pcontacto').value;
            const telecontacto = document.getElementById('telecontacto').value;
            const plan = document.getElementById('plan').value;
            const formadepago = document.getElementById('formadepago').value;
            const referencia = document.getElementById('referencia').value;
            const totalproyecto = document.getElementById('totalproyecto').value;
            const anticipo = document.getElementById('anticipo').value;
            const subtotal = document.getElementById('subtotal').value;
            const descuentocomercial = document.getElementById('descuentocomercial').value;
            const iva = document.getElementById('iva').value;
            const importetotal = document.getElementById('importetotal').value;
            const dni2 = document.getElementById('dni2').value;
            const responsable = document.getElementById('responsable').value;

            // Generar el PDF
            generatePDF(pdf, ncliente, ncontrato, nombreco, rsocial, dni, telefono, telefonofijo, nombrea, email, direccion, municipio, provincia, cp, pais, pcontacto, telecontacto, plan, formadepago, referencia, totalproyecto, anticipo, subtotal, descuentocomercial, iva, importetotal, dni2, responsable);
        });
    } else {
        console.error("Formulario no encontrado");
    }
}

// Función para generar el PDF
async function generatePDF(pdf, ncliente, ncontrato, nombreco, rsocial, dni, telefono, telefonofijo, nombrea, email, direccion, municipio, provincia, cp, pais, pcontacto, telecontacto, plan, formadepago, referencia, totalproyecto, anticipo, subtotal, descuentocomercial, iva, importetotal, dni2, responsable) {

    // Cargar la primera imagen del contrato
    const image = await loadImage("/dash-bca/images/contrato1.png");
    pdf.addImage(image, 'PNG', 9, 0, 595, 792);

    // Posicionar los campos en el PDF
    pdf.setFontSize(8);
    pdf.setTextColor(112,112,112);
    const date = new Date();
    pdf.text(date.getUTCDate().toString(), 280, 749);
    pdf.text((date.getUTCMonth() + 1).toString(), 300, 749);
    pdf.text(date.getUTCFullYear().toString(), 320, 749);

    pdf.setFontSize(7);
    pdf.setTextColor(112,112,112);
    pdf.text(ncliente, 235, 29);
    pdf.text(ncontrato, 365, 29);
    pdf.text(nombreco, 246, 78);
    pdf.text(rsocial, 246, 93);
    pdf.text(dni, 246, 106);
    pdf.text(telefono, 386, 106);
    pdf.text(telefonofijo, 513, 106);
    pdf.text(pcontacto, 265, 175);
    pdf.text(email, 265, 193);
    pdf.text(telecontacto, 492, 193);
    pdf.text(direccion, 246, 120);
    pdf.text(municipio, 453, 120);
    pdf.text(provincia, 246, 133);
    pdf.text(pais, 473, 133);
    pdf.text(cp, 386, 133);
    pdf.text(plan, 58, 265);
    pdf.text(formadepago, 157, 450);
    pdf.text(referencia, 298, 450);
    pdf.text(totalproyecto, 157, 466);
    pdf.text(anticipo, 157, 483);
    pdf.text(subtotal, 517, 505);
    pdf.text(descuentocomercial, 517, 518);
    pdf.text(iva, 517, 530);
    pdf.text(importetotal, 517, 543);
    pdf.text(dni2, 166, 679);
    pdf.text(nombrea, 166, 664);
    pdf.text(responsable, 405, 679);

    pdf.setFontSize(6);
    pdf.setTextColor(112,112,112);
    pdf.text(ncontrato, 60, 774);
    pdf.text(nombrea, 501, 774);

    // Añadir una segunda página si es necesario
    pdf.addPage();

    const imageContrato = await loadImage("/dash-bca/images/acuerdo.jpg");
    pdf.addImage(imageContrato, 'PNG', 9, 0, 595, 792);

    pdf.setFontSize(6);
    pdf.text(ncontrato, 60, 774);
    pdf.text(nombrea, 501, 774);

    pdf.save("contratounico.pdf");
}
