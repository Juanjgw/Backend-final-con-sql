//Servicios.router.js
const express = require('express');
const { 
    postServicioController, 
    getServicioByIdController, 
    deleteServicioByIdController, 
    getAllServicios, 
    getServiciosUsuario, 
    putServiciosUsuario, 
    getImagenesPorServicioController 
} = require('./servicios.controller');
const { subirImagenServicio } = require('./servicios.upload');

const ServiciosRouter = express.Router();

// Rutas de los servicios
ServiciosRouter.post('/', postServicioController);
ServiciosRouter.get('/', getAllServicios);
ServiciosRouter.get('/:id', getServicioByIdController);
ServiciosRouter.delete('/:id', deleteServicioByIdController);
ServiciosRouter.put('/:id', putServiciosUsuario);
ServiciosRouter.post('/:servicio_id/imagenes', subirImagenServicio);
ServiciosRouter.get('/servicios_usuario/:Usuario_ID', getServiciosUsuario);
ServiciosRouter.get('/servicios/:id/imagenes', getImagenesPorServicioController);

module.exports = { ServiciosRouter };
