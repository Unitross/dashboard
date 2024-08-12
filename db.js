const mongoose = require('mongoose');

// Configura la conexión a MongoDB
mongoose.connect('mongodb://Bca2024:dash24Bca63@localhost:27017/Bca2024', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// Exporta el objeto mongoose para poder usarlo en otros archivos
module.exports = mongoose;
