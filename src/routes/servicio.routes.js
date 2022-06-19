const express = require('express');
const servicioController = require('../controllers/servicio.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/registrarServicio/:idHotel', [md_autenticacion.Auth, md_roles.verHotelAdmin], servicioController.registrarServicio);

module.exports = api;