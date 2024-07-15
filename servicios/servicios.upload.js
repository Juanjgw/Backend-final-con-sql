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
        throw err; // Reenviar el error para manejarlo en la función que llama a subirImagenServicioFTP
    } finally {
        client.close();
    }
}

// Función para manejar la subida de imagen del servicio
const subirImagenServicio = async (req, res) => {
    try {
        // Obtener el ID del servicio y la imagen del cuerpo de la solicitud
        const { servicio_id } = req.params;
        const { images } = req.files;

        // Verificar si se recibieron las imágenes
        if (!images || !Array.isArray(images)) {
            return res.status(400).json({ message: 'No se recibieron imágenes válidas' });
        }

        // Subir cada imagen al servidor FTP
        for (let i = 0; i < images.length; i++) {
            const imagen = images[i];
            const nombreImagen = `${uuidv4()}.${imagen.name.split('.').pop()}`;
            await subirImagenServicioFTP(imagen, nombreImagen);

            // Guardar el nombre de la imagen en la base de datos (debe ser adaptado según tu estructura)
            // const consultaString = `INSERT INTO ImagenesServicios (Servicio_id, imagen_url) VALUES (?, ?)`;
            // const valores = [servicio_id, `${process.env.IMAGEN_HOSTNAME}/Servicios/${nombreImagen}`];
            // await query(consultaString, valores);
        }

        res.status(200).json({ message: 'Imágenes subidas y registradas correctamente' });
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).json({ message: 'Error interno al subir las imágenes' });
    }
};

module.exports = { subirImagenServicio };

