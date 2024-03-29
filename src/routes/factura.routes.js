const express = require('express');
const facturaController = require('../controllers/factura.controller');
const api = express.Router();

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

api.get('/generarFactura/:idFactu', [md_autenticacion.Auth, md_roles.verHotelAdmin], facturaController.confirmarFactura);
api.get('/VerFacturas/:idHotel', [md_autenticacion.Auth , md_roles.verHotelAdmin], facturaController.VerFactura);
api.get('/VerFacturasId/:idFactura' , [md_autenticacion.Auth , md_roles.verHotelAdmin], facturaController.VerFacturaId);
api.get('/generarpdf/:idFactura', facturaController.pdf);
//falta eliminar reservacion y elimnar en factura 
module.exports = api;