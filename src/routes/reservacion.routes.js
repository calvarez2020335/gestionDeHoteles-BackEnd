// RUTAS DEL USUARIO
const express = require('express');
const upload = require('../libs/storage');
const reservacionController = require('../controllers/reservacion.controller');

const md_autenticacion = require('../middlewares/autenticacion');
//const md_roles = require('../middlewares/roles');

const api = express.Router();

// Rutas
api.get('/reservacion' , reservacionController.crearReservacion);

module.exports = api;