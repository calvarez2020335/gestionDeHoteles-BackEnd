// RUTAS DEL USUARIO
const express = require('express');
const upload = require('../libs/storage');
const usuarioController = require('../controllers/usuario.controller');

// const md_autenticacion = require('../middlewares/autenticacion');
// const md_roles = require('../middlewares/roles');

const api = express.Router();

// Rutas
api.post('/login', usuarioController.Login);
api.post('/registrarUsuario', upload.single('image') ,usuarioController.registrarUsuario);
api.post('/registrarGerente', usuarioController.registraGerente);


module.exports = api;