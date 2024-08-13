const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

// Configurar la sesión
app.use(session({
    secret: 'tu_secreto_de_sesion',  // Cambia esto por algo seguro
    resave: false,
    saveUninitialized: false
}));

app.use(express.json()); // Para manejar JSON en el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: true })); // Para manejar datos de formularios

app.use(passport.initialize());
app.use(passport.session());

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos
app.use('/dash-bca', express.static(path.join(__dirname, 'public')));

// Simulación de base de datos de usuarios
const users = [
    { id: 1, username: 'admin', password: 'adminpass', role: 'admin' } // Ejemplo de usuario administrador
];

// Configurar la estrategia de autenticación local
passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username);
    if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
    }
    if (user.password !== password) {
        return done(null, false, { message: 'Contraseña incorrecta' });
    }
    return done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

// Middleware de autenticación
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/dash-bca/login');
}

// Middleware para verificar el rol de administrador
function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.redirect('/dash-bca/dashboard'); // Redirige al dashboard si no es admin
}

// Ruta para el login
app.get('/dash-bca/login', (req, res) => {
    res.render('login');
});

// Manejador del login para devolver una respuesta JSON adecuada
app.post('/dash-bca/login', (req, res, next) => {
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

// Ruta protegida para el dashboard
app.get('/dash-bca/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard');
});

// Ruta para crear usuarios (accesible solo por el admin)
app.get('/dash-bca/admin/create-user', ensureAdmin, (req, res) => {
    res.render('create-user');
});

app.post('/dash-bca/admin/create-user', ensureAdmin, (req, res) => {
    const { username, password } = req.body;
    const newUser = { id: users.length + 1, username, password, role: 'user' };
    users.push(newUser);
    res.redirect('/dash-bca/dashboard');
});

// Ruta para logout
app.get('/dash-bca/logout', (req, res) => {
    req.logout(err => {
        if (err) { return next(err); }
        res.redirect('/dash-bca/login');
    });
});

// Redirigir la ruta raíz directamente al login
app.get('/dash-bca', (req, res) => {
    res.redirect('/dash-bca/login');
});

// Configurar el puerto y arrancar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
