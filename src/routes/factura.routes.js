const express = require('express');
const facturaController = require('../controllers/factura.controller');
const api = express.Router();

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

api.post('/generarFactura/:idFactu', [md_autenticacion.Auth, md_roles.verHotelAdmin], facturaController.confirmarFactura);
api.get('/generarpdf/:idFactura', [md_autenticacion.Auth, md_roles.verHotelAdmin], facturaController.prueba);
//falta eliminar reservacion y elimnar en factura 
module.exports = api;