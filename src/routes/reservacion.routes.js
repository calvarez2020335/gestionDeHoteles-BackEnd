// RUTAS DEL USUARIO
const express = require('express');
const reservacionController = require('../controllers/reservacion.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

// Rutas
api.post('/reservacion/:idHabitacion', [md_autenticacion.Auth] ,reservacionController.crearReservacion);
api.get('/cancelarReservacion' ,[md_autenticacion.Auth ,md_roles.verUsuario ], reservacionController.CancelarResevacion );
api.get('/VerReservaciones/:idHotel', [md_autenticacion.Auth ,md_roles.verHotelAdmin ] , reservacionController.VerReservaciones);
api.get('/VerReservacionesId/:idReservacion' ,[md_autenticacion.Auth ,md_roles.verHotelAdmin ], reservacionController.VerReservacionesId );
api.get('/VerReservacionesUser' , [md_autenticacion.Auth ,md_roles.verUsuario ] , reservacionController.VerReservacioneUsuario);


module.exports = api;