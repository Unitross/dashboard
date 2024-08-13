const bcrypt = require('bcrypt');

// La contraseña que quieres hashear
const plainPassword = 'tu_contraseña_segura';

// El número de rondas para generar el salt (recomendado 10)
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
    if (err) {
        console.error('Error al hashear la contraseña:', err);
    } else {
        console.log('Contraseña hasheada:', hash);
    }
});
