const { query } = require('../config/connection.sql');
const { v4: uuidv4 } = require('uuid');

const subirImagenServicio = async (req, res) => {
    try {
        // Obtener el ID del servicio y la imagen del cuerpo de la solicitud
        const { servicio_id } = req.params;
        const { imagen } = req.files;

        // Generar un nombre único para la imagen
        const nombreImagen = `${uuidv4()}.${imagen.name.split('.').pop()}`;

        // Guardar la imagen en el directorio configurado
        imagen.mv(`${process.env.IMAGEN_DIRECTORIO}/${nombreImagen}`);

        // Guardar el nombre de la imagen en la base de datos
        const consultaString = `INSERT INTO ImagenesServicios (Servicio_id, imagen_url) VALUES (?, ?)`;
        const valores = [servicio_id, `${process.env.IMAGEN_HOSTNAME}/Servicios/${nombreImagen}`];
        await query(consultaString, valores);

        res.status(200).json({ message: 'Imagen subida y registrada correctamente' });
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).json({ message: 'Error interno al subir la imagen' });
    }
};

module.exports = { subirImagenServicio };
