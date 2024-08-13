const express = require('express');
const router = express.Router();

// Aquí puedes definir rutas relacionadas con clientes
router.get('/', (req, res) => {
    res.send('Clients route');
});

module.exports = router;
