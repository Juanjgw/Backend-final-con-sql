const mysql = require('mysql');
const util = require('util');
const fs = require('fs');
const path = require('path');

// Configuración del logging
const logFile = path.join(__dirname, 'db_errors.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function logError(error) {
    const timestamp = new Date().toISOString();
    logStream.write(`[${timestamp}] ${error.stack || error}\n`);
}

// Configuración de la base de datos
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
    timezone: 'Z',
    connectTimeout: 10000,
    acquireTimeout: 10000,
    timeout: 28800000
};

let database;

function handleDisconnect() {
    database = mysql.createConnection(userSettings);

    database.connect((err) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            logError(err);
            setTimeout(handleDisconnect, 2000);
        } else {
            console.log('Conexión exitosa a la base de datos');
        }
    });

    database.on('error', (err) => {
        console.error('Error en la base de datos:', err);
        logError(err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET' || err.fatal) {
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
            logError(err);
        }
    });
}

setInterval(keepAlive, 300000);

async function query(sql, params) {
    try {
        return await database.query(sql, params);
    } catch (err) {
        console.error('Error en la consulta:', err);
        logError(err);
        if (err.fatal) {
            console.log('Reconectando después de un error fatal...');
            handleDisconnect();
            throw err;
        }
        throw err;
    }
}

// Ejecutar configuraciones de tiempo de espera para la sesión
async function setSessionTimeouts() {
    try {
        await query('SET @@session.wait_timeout = 28800');
        await query('SET @@session.interactive_timeout = 28800');
    } catch (err) {
        console.error('Error al configurar los tiempos de espera de la sesión:', err);
        logError(err);
    }
}

// Establecer los tiempos de espera de la sesión al iniciar la conexión
setSessionTimeouts();

module.exports = { database, query };


