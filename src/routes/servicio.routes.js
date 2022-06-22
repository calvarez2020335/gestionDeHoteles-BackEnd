const express = require('express');
const servicioController = require('../controllers/servicio.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/registrarServicio/:idHotel', [md_autenticacion.Auth, md_roles.verHotelAdmin], servicioController.registrarServicio);
api.get('/verServicios/:idHotel', [md_autenticacion.Auth], servicioController.verServicios);
api.get('/verServiciosId/:idServicio', md_autenticacion.Auth, servicioController.verServiciosId);
api.put('/editarServicio/:idServicio', [md_autenticacion.Auth, md_roles.verHotelAdmin], servicioController.editarServicio);
api.delete('/eliminarServicio/:idServicio', [md_autenticacion.Auth, md_roles.verHotelAdmin], servicioController.eliminarServicio);

module.exports = api;