const mysql = require('mysql');
const util = require('util');

const DB_NAME = process.env.DB_NAME;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_USERNAME = process.env.DB_USERNAME || 'root';

const userSettings = {
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true,
    charset: 'utf8mb4',
    timezone: 'Z'
};

let database;

function handleDisconnect() {
    database = mysql.createConnection(userSettings);

    database.connect((err) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            setTimeout(handleDisconnect, 2000);
        } else {
            console.log('Conexión exitosa a la base de datos');
        }
    });

    database.on('error', (err) => {
        console.error('Error en la base de datos:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
            handleDisconnect();
        } else {
            throw err;
        }
    });

    database.query = util.promisify(database.query).bind(database);
}

handleDisconnect();

function keepAlive() {
    database.query('SELECT 1', (err) => {
        if (err) {
            console.error('Error al mantener la conexión viva:', err);
        }
    });
}

setInterval(keepAlive, 300000);

async function query(sql, params) {
    try {
        return await database.query(sql, params);
    } catch (err) {
        console.error('Error en la consulta:', err);
        if (err.fatal) {
            console.log('Reconectando después de un error fatal...');
            handleDisconnect();
            throw err; // Re-lanzar el error después de intentar la reconexión
        }
        throw err;
    }
}

module.exports = { database, query };
