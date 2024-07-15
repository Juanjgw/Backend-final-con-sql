const express = require('express');
const multer = require('multer'); // Importamos multer
const upload = multer(); // Definimos la instancia de multer

const { postServicioController, getServicioByIdController, deleteServicioByIdController, getAllServicios, getServiciosUsuario, putServiciosUsuario } = require('./servicios.controller');
const { subirImagenServicio } = require('./servicios.upload'); // Importamos la función para subir imágenes

const ServiciosRouter = express.Router();

// Rutas de los servicios
ServiciosRouter.post('/', postServicioController);
ServiciosRouter.get('/', getAllServicios);
ServiciosRouter.get('/:id', getServicioByIdController);
ServiciosRouter.delete('/:id', deleteServicioByIdController);
ServiciosRouter.put('/:id', putServiciosUsuario);
ServiciosRouter.post('/:servicio_id/imagenes', upload.array('images'), subirImagenServicio); // Actualizamos la ruta para subir imágenes
ServiciosRouter.get('/servicios_usuario/:Usuario_ID', getServiciosUsuario);

module.exports = { ServiciosRouter };
