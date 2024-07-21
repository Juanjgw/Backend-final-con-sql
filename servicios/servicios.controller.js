//servicios.controller.js
const { 
    seleccionarServicioUsuarioId, 
    EditarServicioPorId, 
    seleccionarServicioPorIdCarrucel 
} = require("./servicios.repository");
const { 
    crearServicio, 
    obtenerServicioPorId, 
    eliminarServicioPorId, 
    buscarServicios 
} = require("./servicios.service");

const postServicioController = async (req, res) => {
    try {
        const result = await crearServicio(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const getServicioByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await obtenerServicioPorId(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const deleteServicioByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await eliminarServicioPorId(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const getAllServicios = async (req, res) => {
    try {
        const result = await buscarServicios();
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const getServiciosUsuario = async (req, res) => {
    try {
        const result = await seleccionarServicioUsuarioId(req.params.Usuario_ID);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const putServiciosUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, contactNumber } = req.body;
        const result = await EditarServicioPorId({ id, title, description, contactNumber });
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

// Nuevo controlador para obtener las imágenes de un servicio
const getImagenesPorServicioController = async (req, res) => {
    try {
        const { id } = req.params;
        const imagenes = await seleccionarServicioPorIdCarrucel(id);
        res.status(200).json(imagenes);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Error interno en el servidor' });
    }
};

module.exports = { 
    postServicioController, 
    putServiciosUsuario, 
    getServicioByIdController, 
    deleteServicioByIdController, 
    getAllServicios, 
    getServiciosUsuario, 
    getImagenesPorServicioController // Exportar el nuevo controlador sin afectar a los antiguos
};
