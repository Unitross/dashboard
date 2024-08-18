const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('./config/passport');
const db = require('./config/db');
const { ensureAuthenticated } = require('./middlewares/authMiddleware');

const app = express();

// Configurar la sesión utilizando file store
app.use(session({
    store: new FileStore({ path: './sessions' }), 
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

// Rutas
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const imageRoutes = require('./routes/images');
const contratounicoRouter = require('./routes/contratounico');
const ingresoclientesRouter = require('./routes/ingresoclientes');

app.use('/dash-bca', authRoutes);
app.use('/dash-bca', dashboardRoutes);
app.use('/dash-bca', imageRoutes);
app.use('/dash-bca', contratounicoRouter);
app.use('/dash-bca', ingresoclientesRouter);

// Redirigir la ruta raíz directamente al login
app.get('/dash-bca', (req, res) => {
    res.redirect('/dash-bca/login');
});

// Configurar el puerto y arrancar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
