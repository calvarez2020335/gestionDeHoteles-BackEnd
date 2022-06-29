// RUTAS DEL USUARIO
const express = require('express');
const upload = require('../libs/storage');
const usuarioController = require('../controllers/usuario.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

// Rutas
api.post('/login', usuarioController.Login);
api.post('/registrarUsuario', upload.single('image') ,usuarioController.registrarUsuario);
api.post('/registrarGerente', upload.single('image'), usuarioController.registraGerente);
api.put('/editarUsuario/:idUser?', [md_autenticacion.Auth, upload.single('image')] , usuarioController.editarUsuario );
api.delete('/eliminarUsuario/:idUser?', md_autenticacion.Auth, usuarioController.eliminarUsuario);
api.get('/verUsuarios', md_autenticacion.Auth, usuarioController.verUsuarios);
api.get('/verUsuarioId/:idUser?', md_autenticacion.Auth, usuarioController.verUsuarioId);
api.get('/verAdminHoteles', [md_autenticacion.Auth ,md_roles.verAdministrador], usuarioController.verUsuariosHoteles);

module.exports = api;