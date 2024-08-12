const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Asegúrate de tener este modelo
const fetch = require('node-fetch'); // Asegúrate de instalar node-fetch si no lo has hecho

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/Bca2024') // Usa el nombre de tu base de datos aquí
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// Configura la sesión
app.use(session({
    secret: 'Soybonita063', // Clave secreta para firmar las cookies de sesión
    resave: false,
    saveUninitialized: false
}));

// Inicializa Passport y usa sesiones
app.use(passport.initialize());
app.use(passport.session());

// Estrategia de autenticación local
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) return done(null, false, { message: 'Usuario no encontrado.' });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return done(null, false, { message: 'Contraseña incorrecta.' });
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Middleware de autenticación
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Rutas
app.use('/clients', require('./routes/clients'));
app.use('/contracts', require('./routes/contracts'));
app.use('/users', require('./routes/users'));

// Ruta principal
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard'); // Redirige al dashboard si el usuario está autenticado
    } else {
        res.redirect('/login'); // Redirige al login si el usuario no está autenticado
    }
});

// Ruta del dashboard
app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Ruta de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', async (req, res, next) => {
    const { username, password, recaptchaToken } = req.body;

    // Verifica el token de reCAPTCHA
    const recaptchaSecret = '6Le3QyUqAAAAANU3gm110CvjRwby4lp1a4Y_yizi'; // Tu clave secreta de reCAPTCHA
    const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            secret: recaptchaSecret,
            response: recaptchaToken
        })
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
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
