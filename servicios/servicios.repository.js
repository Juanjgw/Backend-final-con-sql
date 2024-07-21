//servicios.repository.js
const { query } = require("../config/connection.sql");
const { eliminarImagenServicioFTP } = require("./servicios.upload.js"); 

const insertarServicio = async ({ title, description, contactNumber, Usuario_ID }) => {
    try {
        const consultaString = `INSERT INTO Servicios (title, description, contactNumber, rating, Usuario_ID) VALUES (?, ?, ?, 0,?)`;
        const valores = [title, description, contactNumber, Usuario_ID];
        const resultado = await query(consultaString, valores);
        return resultado.insertId;
    } catch (error) {
        throw { status: 500, message: 'Error interno en el servidor' };
    }
};

const seleccionarServicioPorId = async (id) => {
    try {
        const consultaString = `
  SELECT s.id, s.title, s.description, s.rating, s.contactNumber, GROUP_CONCAT(i.imagen_url SEPARATOR ', ') AS imagen_url 
  FROM Servicios s 
  LEFT JOIN ImagenesServicios i ON s.id = i.Servicio_id 
  WHERE s.id = ?
  GROUP BY s.id, s.title, s.description, s.rating, s.contactNumber;
`;
        const resultado = await query(consultaString, [id]);

        if (resultado.length === 0) {
            throw { status: 404, message: 'Servicio con id ' + id + ' no encontrado' };
        } else {
            return resultado[0];
        }
    } catch (error) {
        if (error.status === 404) {
            throw error;
        } else {
            throw { status: 500, message: 'Error interno en el servidor' };
        }
    }
};

const seleccionarServicioUsuarioId = async (id) => {
    try {
        const consultaString = `
            SELECT 
                s.id, s.title, s.description, s.contactNumber, i.imagen_url
            FROM 
                Servicios s
            LEFT JOIN 
                ImagenesServicios i ON s.id = i.Servicio_id
            WHERE 
                s.Usuario_ID = ?
            LIMIT 100
        `;
        const resultado = await query(consultaString, [id]);

        if (resultado.length === 0) {
            return []; // Devuelve un array vacío en lugar de lanzar un error
        } else {
            return resultado;
        }
    } catch (error) {
        throw { status: 500, message: 'Error interno en el servidor' };
    }
};

const seleccionarServicioPorIdCarrucel = async (id) => {
    try {
        const consultaString = `
            SELECT s.id, s.title, s.description, s.rating, s.contactNumber, i.imagen_url, i.Orden
            FROM Servicios s
            LEFT JOIN ImagenesServicios i ON s.id = i.Servicio_id
            WHERE s.id = ?
            ORDER BY i.Orden ASC;
        `;
        const resultado = await query(consultaString, [id]);

        if (resultado.length === 0) {
            throw { status: 404, message: 'Servicio con id ' + id + ' no encontrado' };
        } else {
            // Agrupamos las imágenes en un array para el campo imagen_url
            const servicio = resultado[0];
            servicio.imagenes = resultado.map(row => row.imagen_url).filter(url => url !== null);

            // Elimina las imágenes del servicio del objeto resultante
            delete servicio.imagen_url;

            return servicio;
        }
    } catch (error) {
        if (error.status === 404) {
            throw error;
        } else {
            throw { status: 500, message: 'Error interno en el servidor' };
        }
    }
};


const EditarServicioPorId = async ({ id, title, description, contactNumber }) => {
    try {
        const consultaString = 'UPDATE Servicios SET title=?, description=?, contactNumber=? WHERE id=?';
        const resultado = await query(consultaString, [title, description, contactNumber, id]);

        if (resultado.length === 0) {
            throw { status: 404, message: 'Servicios para Usuario_ID ' + id + ' no encontrados' };
        } else {
            return resultado;
        }
    } catch (error) {
        if (error.status === 404) {
            throw error;
        } else {
            throw { status: 500, message: 'Error interno en el servidor' };
        }
    }
};

const deleteServicioPorId = async (id) => {
    try {
        // Obtener el nombre de la imagen desde la base de datos
        const consultaImagenUrl = 'SELECT imagen_url FROM ImagenesServicios WHERE Servicio_id = ?';
        const resultadosImagenes = await query(consultaImagenUrl, [id]);

        if (resultadosImagenes.length > 0) {
            // Eliminar las imágenes asociadas del servidor FTP
            for (const imagen of resultadosImagenes) {
                await eliminarImagenServicioFTP(imagen.imagen_url);
            }
        }

        // Eliminar las imágenes relacionadas con el servicio de la base de datos
        const consultaImagenes = 'DELETE FROM ImagenesServicios WHERE Servicio_id = ?';
        await query(consultaImagenes, [id]);

        // Eliminar el servicio
        const consultaServicio = 'DELETE FROM Servicios WHERE id = ?';
        const resultado = await query(consultaServicio, [id]);

        if (resultado.affectedRows === 0) {
            throw { status: 404, message: 'Servicio con id ' + id + ' no existe' };
        } else {
            return { status: 200, message: 'Servicio con id ' + id + ' eliminado correctamente' };
        }
    } catch (error) {
        if (error.status === 404) {
            throw error;
        } else {
            throw { status: 500, message: 'Error interno en el servidor' };
        }
    }
};

const TodosLosServicios = async () => {
    try {
        const consultaString = `
        SELECT s.id, s.title, s.description, s.rating, s.contactNumber, GROUP_CONCAT(i.imagen_url SEPARATOR ', ') AS imagen_url 
        FROM Servicios s 
        LEFT JOIN ImagenesServicios i ON s.id = i.Servicio_id 
        GROUP BY s.id, s.title, s.description, s.rating, s.contactNumber;
      `;
        const Servicios = await query(consultaString);
        return Servicios;
    } catch (error) {
        if (error.status) {
            throw error;
        } else {
            throw { status: 500, message: 'Error interno en el servidor' };
        }
    }
};

module.exports = { insertarServicio, seleccionarServicioPorId, seleccionarServicioPorIdCarrucel, EditarServicioPorId, deleteServicioPorId, TodosLosServicios, seleccionarServicioUsuarioId };
