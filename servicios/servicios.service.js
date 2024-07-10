const { CustomError } = require("../errors/customErrorManager");
const { insertarServicio, seleccionarServicioPorId, deleteServicioPorId, seleccionarServicios } = require("./servicios.repository");
const { validarPropiedadesServicio } = require("./utils/validarServicio");

const crearServicio = async (servicio) => {
    try {
        // Validar las propiedades del servicio
        const paso = validarPropiedadesServicio(servicio);
        if (paso) {
            const idCreado = await insertarServicio(servicio);
            return { ok: true, message: `Servicio creado con id ${idCreado}`, idCreado: idCreado };
        } else {
            throw { status: 400, message: 'Exception: No se pasaron las validaciones del servicio' };
        }
    } catch (error) {
        if (error.status) {
            throw error;
        } else {
            throw { status: 500, message: error +'Error interno del servidor al crear el servicio' };
        }
    }
};

const obtenerServicioPorId = async (id) => {
    try {
        const servicio = await seleccionarServicioPorId(id);
        return { ok: true, status: 200, servicio };
    } catch (error) {
        if (error.status) {
            throw error;
        } else {
            throw { status: 500, message: 'Error interno del servidor al obtener el servicio por ID' };
        }
    }
};

const eliminarServicioPorId = async (id) => {
    try {
        const servicio = await deleteServicioPorId(id);
        return { ok: true, status: 200, servicio };
    } catch (error) {
        if (error.status) {
            throw error;
        } else {
            throw { status: 500, message: 'Error interno del servidor al eliminar el servicio' };
        }
    }
};

const buscarServicios = async () => {
    try {
        const servicios = await seleccionarServicios();
        if (servicios.length === 0) {
            throw new CustomError('No hay servicios disponibles', 404);
        }
        return { ok: true, status: 200, message: 'Servicios obtenidos', servicios: servicios };
    } catch (error) {
        throw error;
    }
};

module.exports = { crearServicio, obtenerServicioPorId, eliminarServicioPorId, buscarServicios };
