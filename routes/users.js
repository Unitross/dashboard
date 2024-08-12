const express = require('express');
const passport = require('passport');
const User = require('../models/User'); // Ajusta la ruta si es necesario
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch');

const router = express.Router();

// Ruta para el login
router.post('/login', async (req, res, next) => {
    const { username, password, recaptchaToken } = req.body;

    const recaptchaSecret = '6Le3QyUqAAAAANU3gm110CvjRwby4lp1a4Y_yizi'; // Tu secreto de reCAPTCHA
    try {
        const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ secret: recaptchaSecret, response: recaptchaToken })
        });

        const recaptchaResult = await recaptchaResponse.json();
        if (!recaptchaResult.success) {
            return res.json({ success: false, message: 'reCAPTCHA no verificado.' });
        }

        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.json({ success: false, message: info.message });

            req.logIn(user, (err) => {
                if (err) return next(err);
                return res.json({ success: true });
            });
        })(req, res, next);
    } catch (error) {
        console.error('Error en la verificación de reCAPTCHA:', error);
        res.json({ success: false, message: 'Error en la verificación de reCAPTCHA.' });
    }
});

module.exports = router;
