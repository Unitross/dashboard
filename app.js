const express = require('express');
const path = require('path');
const app = express();

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos
app.use('/dash-bca', express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/dash-bca', (req, res) => {
    res.render('index');
});

app.get('/dash-bca/login', (req, res) => {
    res.render('login');
});

app.get('/dash-bca/dashboard', (req, res) => {
    res.render('dashboard');
});

// Configurar el puerto y arrancar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
