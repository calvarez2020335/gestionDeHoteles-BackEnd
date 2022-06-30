const express = require('express');
const eventoController = require('../controllers/evento.controller');
const upload = require('../libs/storage');
const api = express.Router();

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

api.post('/crearEvento/:idhotel', [md_autenticacion.Auth, md_roles.verHotelAdmin, upload.single('image')], eventoController.crearEvento);
api.put('/editarEvento/:idEvento', [md_autenticacion.Auth, md_roles.verHotelAdmin], eventoController.editarEventos);
api.delete('/eliminarEvento/:idEvento', [md_autenticacion.Auth, md_roles.verHotelAdmin], eventoController.eliminarEventos);
api.get('/verEventos/:idHotel', md_autenticacion.Auth, eventoController.verEventos);
api.get('/verEventosId/:idHotel', md_autenticacion.Auth, eventoController.verEventosId);

module.exports = api;