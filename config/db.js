const mysql = require('mysql2');

const db = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1', 
    user: 'keroeneu_dash_bca10',
    password: 'oPN0Yejs2q$rsxOu-afi0',
    database: 'keroeneu_dash_bca'
});

module.exports = db;
