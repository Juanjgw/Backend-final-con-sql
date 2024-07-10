const { crearServicio, obtenerServicioPorId, eliminarServicioPorId, buscarServicios } = require("./servicios.service");

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

module.exports = { postServicioController, getServicioByIdController, deleteServicioByIdController, getAllServicios };
