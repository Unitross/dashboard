const express = require('express');
const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const router = express.Router();

//----------------
// Ruta para renderizar el formulario de contrato único
router.get('/contrato-unico', (req, res) => {
    console.log("Cargando la vista del formulario único...");
    res.render('contratounico');
});

//----------------
// Obtener el número de contrato y cliente actual
router.get('/get-current-numbers', (req, res) => {
    db.query('SELECT ncontrato, ncliente FROM contratos_unicos ORDER BY id DESC LIMIT 1', (err, results) => {
        if (err) {
            console.error('Error al obtener los números:', err);
            return res.status(500).json({ success: false, message: 'Error en el servidor al obtener los números.' });
        }

        const lastContract = results[0];
        let ncontrato = 'BCA001';
        let ncliente = 'NºC001';

        if (lastContract) {
            const lastContractNumber = parseInt(lastContract.ncontrato.replace('BCA', '')) + 1;
            const lastClientNumber = parseInt(lastContract.ncliente.replace('NºC', '')) + 1;

            ncontrato = 'BCA' + String(lastContractNumber).padStart(3, '0');
            ncliente = 'NºC' + String(lastClientNumber).padStart(3, '0');
        }

        res.json({ success: true, ncontrato, ncliente });
    });
});

//----------------
// Ruta para generar y guardar el PDF
router.post('/generate-pdf', (req, res) => {
    try {
        const {
            ncliente, ncontrato, nombreco, rsocial, dni, telefono, telefonofijo,
            nombrea, email, direccion, municipio, provincia, cp, pais, pcontacto,
            telecontacto, plan, formadepago, referencia, totalproyecto, anticipo,
            subtotal, descuentocomercial, iva, importetotal, dni2, responsable
        } = req.body;

        const pdf = new jsPDF('p', 'pt', 'letter');

        // Cargar las imágenes desde la carpeta de imágenes
        const contratoImagePath = path.join(__dirname, '../public/images/contrato1.png');
        const acuerdoImagePath1 = path.join(__dirname, '../public/images/contratounico1.jpg');
        const acuerdoImagePath2 = path.join(__dirname, '../public/images/contratounico2.jpg');
        const acuerdoImagePath3 = path.join(__dirname, '../public/images/contratounico3.jpg');

        console.log("Cargando imágenes para el PDF...");
        const contratoImage = fs.readFileSync(contratoImagePath).toString('base64');
        const acuerdoImage1 = fs.readFileSync(acuerdoImagePath1).toString('base64');
        const acuerdoImage2 = fs.readFileSync(acuerdoImagePath2).toString('base64');
        const acuerdoImage3 = fs.readFileSync(acuerdoImagePath3).toString('base64');

        pdf.addImage(contratoImage, 'PNG', 9, 0, 595, 792);

        pdf.addPage();
        pdf.addImage(acuerdoImage1, 'JPEG', 9, 0, 595, 792);
        
        pdf.addPage();
        pdf.addImage(acuerdoImage2, 'JPEG', 9, 0, 595, 792);
        
        pdf.addPage();
        pdf.addImage(acuerdoImage3, 'JPEG', 9, 0, 595, 792);

        

        // Posicionar los campos en el PDF
        pdf.setFontSize(8);
        pdf.setTextColor(112, 112, 112);
        const date = new Date();
        pdf.text(date.getUTCDate().toString(), 280, 749);
        pdf.text((date.getUTCMonth() + 1).toString(), 300, 749);
        pdf.text(date.getUTCFullYear().toString(), 320, 749);

        pdf.setFontSize(7);
        pdf.setTextColor(112, 112, 112);
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
        pdf.setTextColor(112, 112, 112);
        pdf.text(ncontrato, 60, 774);
        pdf.text(nombrea, 501, 774);

        // Guardar los datos en la base de datos
        db.query('INSERT INTO contratos_unicos SET ?', {
            ncontrato, ncliente, nombreco, rsocial, dni, telefono, telefonofijo,
            nombrea, email, direccion, municipio, provincia, cp, pais, pcontacto,
            telecontacto, plan, formadepago, referencia, totalproyecto, anticipo,
            subtotal, descuentocomercial, iva, importetotal, dni2, responsable
        }, (err, result) => {
            if (err) {
                console.error('Error al guardar los datos en la base de datos:', err);
                return res.status(500).json({ success: false, message: 'Error al guardar los datos.' });
            }

            // Guardar el PDF en el servidor
            const pdfFileName = `contratounico_${nombrea}_${ncontrato}.pdf`;
            const pdfFilePath = path.join(__dirname, '../public/pdfs', pdfFileName);
            fs.writeFileSync(pdfFilePath, pdf.output());

            // Enviar el PDF al cliente para descarga
            res.download(pdfFilePath, pdfFileName, (err) => {
                if (err) {
                    console.error("Error al enviar el PDF:", err);
                    res.status(500).json({ message: "Error al enviar el PDF." });
                } else {
                    console.log("PDF enviado con éxito:", pdfFileName);
                }
            });
        });

    } catch (error) {
        console.error("Error al generar el PDF:", error);
        res.status(500).json({ message: "Error al generar el PDF." });
    }
});

module.exports = router;