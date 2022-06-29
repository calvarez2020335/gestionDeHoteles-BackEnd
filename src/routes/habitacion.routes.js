const express = require('express');
const habitacionController = require('../controllers/habitacion.controller');
const upload = require('../libs/storage');
const api = express.Router();

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

//Rutas aqui

api.post('/registrarHabitacion/:idHotel', [md_autenticacion.Auth, upload.single('image')], habitacionController.registrarHabitacion);
api.get('/verHabitaciones/:idHotel', md_autenticacion.Auth, habitacionController.verHabitaciones);
api.get('/verHabitacionId/:idHabitacion', md_autenticacion.Auth, habitacionController.verHabitacioId);
api.put('/editarHabitacion/:idHabitacion', [md_autenticacion.Auth, md_roles.verHotelAdmin], habitacionController.editarHabitacion);
api.delete('/eliminarHabitacion/:idHabitacion', [md_autenticacion.Auth, md_roles.verHotelAdmin], habitacionController.eliminarHabitacion);
api.get('/disponibilidadHabitaciones/:idHotel', [md_autenticacion.Auth, md_roles.verHotelAdmin], habitacionController.verHabitacionesDisponibles);
api.get('/disponibilidadHabitacionesNumero/:idHotel', [md_autenticacion.Auth, md_roles.verHotelAdmin], habitacionController.habitacionesDisponiblesNumeros);

module.exports = api;