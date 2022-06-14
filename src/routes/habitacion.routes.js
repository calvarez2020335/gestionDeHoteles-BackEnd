const express = require('express');
const habitacionController = require('../controllers/habitacion.controller');
const upload = require('../libs/storage');
const api = express.Router();

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

//Rutas aqui

api.post('/registrarHabitacion/:idHotel', [md_autenticacion.Auth, md_roles.verHotelAdmin, upload.single('image')], habitacionController.registrarHabitacion);
api.get('/verHabitaciones/:idHotel', md_autenticacion.Auth, habitacionController.verHabitaciones);
api.get('/verHabitacionId/:idHabitacion', [md_autenticacion.Auth, md_roles.verHotelAdmin], habitacionController.verHabitacioId);


module.exports = api;