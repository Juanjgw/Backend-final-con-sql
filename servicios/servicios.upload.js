const { query } = require('../config/connection.sql');
const { v4: uuidv4 } = require('uuid');
const { Client } = require('basic-ftp');
const stream = require('stream');

// Función para subir una imagen al servidor FTP
async function subirImagenServicioFTP(file, fileName) {
    const client = new Client();
    client.ftp.verbose = true;
    try {
        // Acceder al servidor FTP
        await client.access({
            host: process.env.IMAGEN_HOSTNAME,
            user: process.env.IMAGEN_USUARIO,
            password: process.env.IMAGEN_PASS,
            secure: true,
            secureOptions: {
                rejectUnauthorized: true // Desactiva la validación del certificado para desarrollo
            }
        });

        // Convertir el archivo en un flujo de datos
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.data);

        // Subir la imagen desde el buffer al servidor
        await client.uploadFrom(bufferStream, process.env.IMAGEN_DIRECTORIO + fileName);
        console.log(`Imagen subida correctamente a ${process.env.IMAGEN_DIRECTORIO + fileName}`);
    } catch (err) {
        console.error('Error al subir la imagen:', err);
    } finally {
        client.close();
    }
}

// Función para manejar la subida de imagen del servicio
const subirImagenServicio = async (req, res) => {
    try {
        // Obtener el ID del servicio y la imagen del cuerpo de la solicitud
        const { servicio_id } = req.params;
        const { imagen } = req.files;

        // Generar un nombre único para la imagen
        const nombreImagen = `${uuidv4()}.${imagen.name.split('.').pop()}`;

        // Subir la imagen al servidor FTP
        await subirImagenServicioFTP(imagen, nombreImagen);

        // Guardar el nombre de la imagen en la base de datos (comentado)
        // const consultaString = `INSERT INTO ImagenesServicios (Servicio_id, imagen_url) VALUES (?, ?)`;
        // const valores = [servicio_id, `${process.env.IMAGEN_HOSTNAME}/Servicios/${nombreImagen}`];
        // await query(consultaString, valores);

        res.status(200).json({ message: 'Imagen subida y registrada correctamente' });
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).json({ message: 'Error interno al subir la imagen' });
    }
};

module.exports = { subirImagenServicio };

