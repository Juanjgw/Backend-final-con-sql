const { query } = require("../config/connection.sql");

const insertarServicio = async ({ title, description, contactNumber }) => {
    try {
        const consultaString = `INSERT INTO Servicios (title, description, contactNumber, rating) VALUES (?, ?, ?, 0)`;
        const valores = [title, description, contactNumber];
        const resultado = await query(consultaString, valores);
        return resultado.insertId;
    } catch (error) {
        throw { status: 500, message: 'Error interno en el servidor' };
    }
};

const seleccionarServicioPorId = async (id) => {
    try {
        const consultaString = 'SELECT * FROM Servicios WHERE id = ?';
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
        const consultaString = 'SELECT * FROM Servicios WHERE Usuario_ID = ? LIMIT 100';
        const resultado = await query(consultaString, [id]);

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

const EditarServicioPorId= async ({id, title, description,contactNumber}) => {
    try {
        const consultaString = 'UPDATE Servicios SET title=?,description=?,contactNumber=? WHERE id=? '
        const resultado = await query(consultaString, [ title, description,contactNumber,id]);

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
        const consultaString = 'DELETE FROM Servicios WHERE id = ?';
        const resultado = await query(consultaString, [id]);

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
  
module.exports = { insertarServicio, seleccionarServicioPorId, EditarServicioPorId, deleteServicioPorId, TodosLosServicios, seleccionarServicioUsuarioId };
