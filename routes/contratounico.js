const express = require('express');
const router = express.Router();
const db = require('../config/db');


// Ruta para manejar el envío del formulario y guardar los datos en la base de datos

router.post('/guardar-contrato', (req, res) => {
    const {
        ncliente, ncontrato, nombreco, rsocial, dni, telefono, telefonofijo, nombrea, email,
        direccion, municipio, provincia, cp, pais, pcontacto, telecontacto, plan, formadepago,
        referencia, totalproyecto, anticipo, subtotal, descuentocomercial, iva, importetotal, dni2, responsable
    } = req.body;

    // Inserta en la base de datos (ajusta este código según la estructura de tu base de datos)

    db.query('INSERT INTO contratos SET ?', {
        ncliente, ncontrato, nombreco, rsocial, dni, telefono, telefonofijo, nombrea, email,
        direccion, municipio, provincia, cp, pais, pcontacto, telecontacto, plan, formadepago,
        referencia, totalproyecto, anticipo, subtotal, descuentocomercial, iva, importetotal, dni2, responsable
    }, (err, results) => {
        if (err) {
            console.error('Error al guardar los datos:', err);
            return res.status(500).json({ message: 'Error en el servidor al guardar los datos.' });
        }
        res.status(201).json({ message: 'Datos guardados con éxito.' });
    });
});

module.exports = router;

// Ruta para renderizar el formulario de contrato único

router.get('/contrato-unico', (req, res) => {
    res.render('contratounico'); // 'contratounico' es el nombre del archivo EJS sin la extensión
});

module.exports = router;

