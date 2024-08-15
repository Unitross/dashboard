const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const db = require('../config/db'); 

// Ruta para mostrar el dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    const profilePic = req.user.profilePic || '/dash-bca/images/default-profile.png';
    res.render('dashboard', { 
        username: req.user.username, 
        profilePic: profilePic 
    });
});

// Ruta para cambiar el nombre de usuario
router.post('/change-username', ensureAuthenticated, (req, res) => {
    const newUsername = req.body.newUsername.trim();

    if (!newUsername) {
        return res.status(400).json({ success: false, message: 'El nombre de usuario no puede estar vacío.' });
    }

    // Validar el nuevo nombre de usuario (longitud, caracteres permitidos, etc.)
    if (newUsername.length < 3 || newUsername.length > 20) {
        return res.status(400).json({ success: false, message: 'El nombre de usuario debe tener entre 3 y 20 caracteres.' });
    }

    // Verificar si el nombre de usuario ya existe
    db.query('SELECT id FROM users WHERE username = ?', [newUsername], (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).json({ success: false, message: 'Error en el servidor.' });
        }
        
        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'El nombre de usuario ya está en uso.' });
        }

        // Actualizar el nombre de usuario en la base de datos
        db.query('UPDATE users SET username = ? WHERE id = ?', [newUsername, req.user.id], (err, results) => {
            if (err) {
                console.error('Error al actualizar el nombre de usuario:', err);
                return res.status(500).json({ success: false, message: 'Error en el servidor.' });
            }

            // Actualizar el nombre de usuario en la sesión
            req.user.username = newUsername;

            res.json({ success: true, message: 'Nombre de usuario actualizado con éxito.' });
        });
    });
});

module.exports = router;

//Cambio de Contraseña

router.post('/change-password', ensureAuthenticated, (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Verificar la contraseña actual
    db.query('SELECT password FROM users WHERE id = ?', [req.user.id], (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).json({ success: false, message: 'Error en el servidor.' });
        }

        const hashedPassword = results[0].password;

        bcrypt.compare(currentPassword, hashedPassword, (err, isMatch) => {
            if (err) {
                console.error('Error al comparar contraseñas:', err);
                return res.status(500).json({ success: false, message: 'Error en el servidor.' });
            }

            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Contraseña actual incorrecta.' });
            }

            // Si la contraseña actual es correcta, actualizar con la nueva
            bcrypt.hash(newPassword, 10, (err, hashedNewPassword) => {
                if (err) {
                    console.error('Error al encriptar la nueva contraseña:', err);
                    return res.status(500).json({ success: false, message: 'Error en el servidor.' });
                }

                db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, req.user.id], (err, results) => {
                    if (err) {
                        console.error('Error al actualizar la contraseña:', err);
                        return res.status(500).json({ success: false, message: 'Error en el servidor.' });
                    }

                    res.json({ success: true, message: 'Contraseña actualizada con éxito.' });
                });
            });
        });
    });
});

module.exports = router;