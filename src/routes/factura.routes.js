const express = require('express');
const facturaController = require('../controllers/factura.controller');
const upload = require('../libs/storage');
const api = express.Router();

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

api.post('/generarFactura/:idFactu', md_autenticacion.Auth, facturaController.confirmarFactura);
api.get('/generarpdf', facturaController.prueba);

module.exports = api;