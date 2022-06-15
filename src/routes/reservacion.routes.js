// RUTAS DEL USUARIO
const express = require('express');
const reservacionController = require('../controllers/reservacion.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

// Rutas
api.post('/reservacion/:idHabitacion', [md_autenticacion.Auth, md_roles.verUsuario] ,reservacionController.crearReservacion);

module.exports = api;