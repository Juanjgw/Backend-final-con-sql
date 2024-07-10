const express = require('express');
const { postServicioController, getServicioByIdController, deleteServicioByIdController, getAllServicios } = require('./servicios.controller');

const ServiciosRouter = express.Router();

// Definición de rutas
ServiciosRouter.post('/', postServicioController);
ServiciosRouter.get('/:id', getServicioByIdController);
ServiciosRouter.delete('/:id', deleteServicioByIdController);
ServiciosRouter.get('/', getAllServicios);

module.exports = ServiciosRouter;
