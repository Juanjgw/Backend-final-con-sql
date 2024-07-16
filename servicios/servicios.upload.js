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
                rejectUnauthorized: false // Desactiva la validación del certificado para desarrollo
            }
        });

        // Verificar y crear el directorio si no existe
        const remotePath = process.env.IMAGEN_DIRECTORIO;
        const directories = remotePath.split('/');
        let path = '';
        for (const dir of directories) {
            if (dir) {
                path += `/${dir}`;
                try {
                    await client.send(`MKD ${path}`);
                    console.log(`Directorio creado: ${path}`);
                } catch (err) {
                    if (!err.message.includes('550')) { // Ignorar error si el directorio ya existe
                        throw err;
                    }
                }
            }
        }

        // Convertir el archivo en un flujo de datos
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.data);

        // Subir la imagen desde el buffer al servidor
        await client.uploadFrom(bufferStream, `${remotePath}/${fileName}`);
        console.log(`Imagen subida correctamente a ${remotePath}/${fileName}`);
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

        // Verificar si se recibió la imagen
        if (!imagen) {
            return res.status(400).json({ message: 'No se recibió ninguna imagen' });
        }

        // Generar un nombre único para la imagen
        const nombreImagen = `${uuidv4()}.${imagen.name.split('.').pop()}`;

        // Subir la imagen al servidor FTP
        await subirImagenServicioFTP(imagen, nombreImagen);

        // Guardar el nombre de la imagen en la base de datos (comentado)
         const consultaString = `INSERT INTO ImagenesServicios (Servicio_id, imagen_url) VALUES (?, ?)`;
         const valores = [servicio_id, `${nombreImagen}`];
         await query(consultaString, valores);

        res.status(200).json({ message: 'Imagen subida y registrada correctamente' });
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).json({ message: 'Error interno al subir la imagen' });
    }
};

module.exports = { subirImagenServicio };
