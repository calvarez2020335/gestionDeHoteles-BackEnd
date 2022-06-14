// RUTAS DEL USUARIO
const express = require('express');
const upload = require('../libs/storage');
const hotelController = require('../controllers/hotel.controller');

const md_autenticacion = require('../middlewares/autenticacion');
//const md_roles = require('../middlewares/roles');

const api = express.Router();

// Rutas
api.post('/RegistrarHotel', md_autenticacion.Auth, hotelController.creaHotel);
api.put('/editarHotel/:idHotel' ,[md_autenticacion.Auth, upload.single('image')] , hotelController.editarHotel);

module.exports = api;