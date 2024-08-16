const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const passport = require('../config/passport');
const path = require('path');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');


console.log('Cargando middleware desde:', path.join(__dirname, '../middlewares/authMiddleware'));


// Ruta para el login
router.get('/login', (req, res) => {
    res.render('login');
});

// Manejador del login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
        if (!user) {
            return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
            }
            return res.status(200).json({ success: true, message: 'Inicio de sesión exitoso' });
        });
    })(req, res, next);
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) { return next(err); }
        res.redirect('/dash-bca/login');
    });
});

module.exports = router;

// Ruta para el formulario de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Ruta para manejar el registro de un nuevo usuario
router.post('/register', (req, res) => {
    const { fullName, username, password, role } = req.body;
    
    console.log('Datos recibidos:', fullName, username, password, role);

    // Aquí validamos los datos antes de proceder
    if (!fullName || !username || !password || !role) {
        return res.status(400).json({ message: 'Faltan datos para registrar el usuario' });
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).json({ message: 'Error en el servidor.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'El nombre de usuario ya existe.' });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error al encriptar la contraseña:', err);
                return res.status(500).json({ message: 'Error en el servidor.' });
            }

            db.query('INSERT INTO users (username, password, role, fullName) VALUES (?, ?, ?, ?)', 
            [username, hashedPassword, role, fullName], 
            (err, results) => {
                if (err) {
                    console.error('Error al insertar el usuario en la base de datos:', err);
                    return res.status(500).json({ message: 'Error en el servidor.' });
                }

                console.log('Usuario registrado:', results);
                res.status(201).json({ message: 'Usuario registrado con éxito.' });
            });
        });
    });
});
