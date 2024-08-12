const express = require('express');
const router = express.Router();

// Define tus rutas aquí
router.get('/', (req, res) => {
    res.send('Clients route');
});

module.exports = router;
