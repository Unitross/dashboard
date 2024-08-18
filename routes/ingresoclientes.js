const express = require('express');
const router = express.Router();
const db = require('../config/db');


// REGISTRO DE CLIENTES EN LA BD
// Ruta para guardar los datos del nuevo cliente

router.post('/guardar-cliente', (req, res) => {
    const {
        nombre, apellido, nombreEmpresa, dni, email, telefono, tipoContacto,
        direccion, ciudad, pais, codigoPostal, website, serviciosContratados,
        fechaContratacion, tags, notas
    } = req.body;

    // Inserta en la base de datos
    
    db.query('INSERT INTO clientes SET ?', {
        nombre, apellido, nombreEmpresa, dni, email, telefono, tipoContacto,
        direccion, ciudad, pais, codigoPostal, website, serviciosContratados,
        fechaContratacion, tags, notas
    }, (err, results) => {
        if (err) {
            console.error('Error al guardar los datos:', err);
            return res.status(500).json({ message: 'Error en el servidor al guardar los datos.' });
        }
        res.status(201).json({ message: 'Cliente guardado con éxito.' });
    });
});

module.exports = router;


// RUTA PARA VER A LOS CLIENTES 

// Ruta para obtener los clientes con paginación
router.get('/ver-clientes', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const searchTerm = req.query.search ? `%${req.query.search}%` : '%';

    const query = `
        SELECT SQL_CALC_FOUND_ROWS * 
        FROM clientes 
        WHERE nombre LIKE ? OR apellido LIKE ? OR dni LIKE ? OR nombreEmpresa LIKE ? 
        LIMIT ?, ?;
    `;

    db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm, offset, limit], (err, results) => {
        if (err) {
            console.error('Error al obtener los clientes:', err);
            return res.status(500).json({ message: 'Error en el servidor al obtener los clientes.' });
        }

        db.query('SELECT FOUND_ROWS() as total', (err, totalResults) => {
            if (err) {
                console.error('Error al obtener el total de clientes:', err);
                return res.status(500).json({ message: 'Error en el servidor al obtener el total de clientes.' });
            }

            res.json({
                clientes: results,
                total: totalResults[0].total
            });
        });
    });
});

// REGISTRO DE CLIENTES EN LA BD
// Ruta para pedir a los clientes a la base

router.post('/actualizar-cliente', (req, res) => {
    const clienteId = req.body.id;
    const datosActualizados = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        nombreEmpresa: req.body.nombreEmpresa,
        dni: req.body.dni,
        email: req.body.email,
        telefono: req.body.telefono,
        tipoContacto: req.body.tipoContacto,
        direccion: req.body.direccion,
        ciudad: req.body.ciudad,
        pais: req.body.pais,
        codigoPostal: req.body.codigoPostal,
        website: req.body.website,
        serviciosContratados: req.body.serviciosContratados,
        fechaContratacion: req.body.fechaContratacion,
        tags: req.body.tags,
        notas: req.body.notas
    };

    db.query('UPDATE clientes SET ? WHERE id = ?', [datosActualizados, clienteId], (err, results) => {
        if (err) {
            console.error('Error al actualizar el cliente:', err);
            return res.status(500).json({ message: 'Error en el servidor al actualizar los datos.' });
        }
        res.json({ message: 'Cliente actualizado con éxito.' });
    });
});

module.exports = router;
