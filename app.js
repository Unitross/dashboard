const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const multer = require('multer');

const app = express();

// Configurar el pool de conexiones a la base de datos
const db = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',  // Cambiar de 'localhost' a '127.0.0.1'
    user: 'dash_bca1',
    password: 'oPN0Yejs2q$rsxOu-afi',
    database: 'keroeneu_dash_bca'
});


// Configurar la sesión
app.use(session({
    secret: 'tu_secreto_de_sesion',
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos
app.use('/dash-bca', express.static(path.join(__dirname, 'public')));

// Configurar la estrategia de autenticación local con Passport y bcrypt
passport.use(new LocalStrategy((username, password, done) => {
    console.log('Intentando autenticar al usuario:', username);
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return done(err);
        }
        if (results.length === 0) {
            console.log('Usuario no encontrado:', username);
            return done(null, false, { message: 'Usuario no encontrado' });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error al comparar contraseñas:', err);
                return done(err);
            }
            if (isMatch) {
                console.log('Autenticación exitosa para el usuario:', username);
                return done(null, user);
            } else {
                console.log('Contraseña incorrecta para el usuario:', username);
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
        });
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            return done(err);
        }
        if (results.length === 0) {
            return done(new Error('Usuario no encontrado'));
        }
        const user = results[0];
        done(null, user);
    });
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
    res.redirect('/dash-bca/dashboard');
}

// Ruta para el login
app.get('/dash-bca/login', (req, res) => {
    res.render('login');
});

// Manejador del login para devolver una respuesta JSON adecuada
app.post('/dash-bca/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Error en el servidor durante la autenticación:', err);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }
        if (!user) {
            console.log('Autenticación fallida:', info.message);
            return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Error al iniciar sesión:', err);
                return res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
            }
            console.log('Inicio de sesión exitoso:', user.username);
            return res.status(200).json({ success: true, message: 'Inicio de sesión exitoso' });
        });
    })(req, res, next);
});

// Ruta protegida para el dashboard
app.get('/dash-bca/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', { username: req.user.username });
});

// Ruta para crear usuarios (accesible solo por el admin)
app.get('/dash-bca/admin/create-user', ensureAdmin, (req, res) => {
    res.render('create-user');
});

app.post('/dash-bca/admin/create-user', ensureAdmin, async (req, res) => {
    const { username, password } = req.body;

    // Hashear la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
             [username, hashedPassword, 'user'], 
             (err, results) => {
        if (err) {
            console.error('Error al crear el usuario:', err);
            return res.status(500).send('Error al crear el usuario');
        }
        res.redirect('/dash-bca/dashboard');
    });
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

// Configuración de multer para guardar las imágenes subidas
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public', 'images'));
    },
    filename: function (req, file, cb) {
        cb(null, `profile-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Ruta para cambiar la foto de perfil
app.post('/dash-bca/change-photo', ensureAuthenticated, upload.single('croppedImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No se subió ninguna imagen.' });
    }

    db.query('UPDATE users SET profilePic = ? WHERE id = ?', 
             [`/dash-bca/images/${req.file.filename}`, req.user.id], 
             (err, results) => {
        if (err) {
            console.error('Error al actualizar la foto de perfil:', err);
            return res.status(500).json({ success: false, message: 'Error al actualizar la foto de perfil' });
        }
        res.json({ success: true, newImageUrl: `/dash-bca/images/${req.file.filename}` });
    });
});
