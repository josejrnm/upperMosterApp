const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'crimesus@localhost',
    password: 'tu_contraseña_segura', // Reemplaza con la contraseña correcta
    database: 'crimesus_uppermosterdb'
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});

// Ejemplo de una consulta
connection.query('SELECT * FROM tu_tabla', (err, results, fields) => {
    if (err) {
        console.error('Error al realizar la consulta:', err);
        return;
    }
    console.log('Resultados de la consulta:', results);
});

// Cerrar la conexión cuando ya no la necesites
connection.end();
