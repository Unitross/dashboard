const bcrypt = require('bcrypt');

const password = 'Tango.063';  // Aquí coloca la contraseña que quieres hashear
bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    console.log('Hashed Password:', hash);
});
