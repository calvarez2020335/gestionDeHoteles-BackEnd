// RUTAS DEL USUARIO
const express = require('express');
const historialController = require('../controllers/historial.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

// Rutas
api.get('/VerHistorial', [md_autenticacion.Auth, md_roles.verUsuario], historialController.VerHistorial);
api.get('/VerHistorialId/:idHistorial', [md_autenticacion.Auth, md_roles.verUsuario], historialController.VerHistorialId);
api.delete('/eliminarHistorial' ,[md_autenticacion.Auth ,md_roles.verUsuario ], historialController.EliminarHistorial );

module.exports = api;