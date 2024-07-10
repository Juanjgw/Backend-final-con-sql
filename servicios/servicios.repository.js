const { query } = require("../config/connection.sql");

const insertarServicio = async ({ id, title, description, contactNumber, rating }) => {
    try {
        const consultaString = 'INSERT INTO Servicios (id, title, description, contactNumber, rating) VALUES (?, ?, ?, ?, ?)';
        const valores = [id, title, description, contactNumber, rating];
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
        const consultaString = 'SELECT * FROM Servicios';
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

module.exports = { insertarServicio, seleccionarServicioPorId, deleteServicioPorId, TodosLosServicios };
