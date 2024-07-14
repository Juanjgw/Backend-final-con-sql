const express = require('express');
const { postServicioController, getServicioByIdController, deleteServicioByIdController, getAllServicios, getServiciosUsuario, putServiciosUsuario } = require('./servicios.controller');
const { subirImagenServicio } = require('./servicios.upload'); // Importamos la función para subir imágenes

const ServiciosRouter = express.Router();

// Rutas de los servicios
ServiciosRouter.post('/', postServicioController);
ServiciosRouter.get('/', getAllServicios);
ServiciosRouter.get('/:id', getServicioByIdController);
ServiciosRouter.delete('/:id', deleteServicioByIdController);
ServiciosRouter.put('/:id', putServiciosUsuario);
ServiciosRouter.post('/:servicio_id/imagen', subirImagenServicio);
ServiciosRouter.get('/servicios_usuario/:Usuario_ID', getServiciosUsuario);

module.exports = { ServiciosRouter };
