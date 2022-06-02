const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
let regExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

function Login(req, res) {
	var parametros = req.body;
	Usuario.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
		if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
		if (usuarioEncontrado){bcrypt.compare(parametros.password,usuarioEncontrado.password,(err, verificacionPassword) => {
			if (verificacionPassword) {if (parametros.obtenerToken === 'true') {
				return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) });} else {
				usuarioEncontrado.password = undefined;
				return res.status(200).send({ usuario: usuarioEncontrado });}
			} else {
				return res.status(500).send({ mensaje: 'Las contrasena no coincide' });
			}}
		);} else {
			return res.status(500).send({ mensaje: 'Error, el correo no se encuentra registrado.' });
		}
	});
}

function crearAdminInicio() {
	var modeloUsuario = new Usuario();
	Usuario.find({ email: 'SuperAdmin' }, (err, usuarioEncontrado) => {
		if (usuarioEncontrado.length > 0) return console.log('el SuperAdmin Ya Esta Registrado');
		modeloUsuario.nombre = 'SuperAdmin';
		modeloUsuario.email = 'SuperAdmin';
		modeloUsuario.rol = 'ROL_ADMIN';
		bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
			modeloUsuario.password = passwordEncriptada;
			modeloUsuario.save((err, usuarioGuardado) => {
				if (err) return console.log('Error en la peticion');
				if (!usuarioGuardado) return console.log('Error al registrar Admin');
				return console.log('SuperAdmin:' + ' ' + usuarioGuardado);
			});
		});	
	});
}

//Funciones del usuario

function registrarUsuario(req, res) {
	var parametro = req.body;
	var usuarioModel = new Usuario();
	let emailOk = regExp.test(parametro.email);
	if(emailOk != true) return res.status(500).send({ mensaje: 'No se reconoce el email'});
	if (parametro.nombre && parametro.email && parametro.password) {
		usuarioModel.nombre = parametro.nombre;

		usuarioModel.email = parametro.email;
		//Imagen
		if(req.file){
			const { filename } = req.file;
			usuarioModel.setImgUrl(filename);
		}	

		usuarioModel.password = parametro.password; 
		usuarioModel.rol = 'ROL_USUARIO';		
		Usuario.find({ email: parametro.email }, (err, usuarioEncontrado) => {
			if (usuarioEncontrado.length == 0) {
				bcrypt.hash(
					parametro.password,
					null,
					null,
					(err, passwordEncriptada) => { usuarioModel.password = passwordEncriptada; 
						usuarioModel.save((err, usuarioGuardado) => {
							if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
							if (!usuarioGuardado)return res.status(500).send({ mensaje: 'Error al agregar Usuario' }); 
							return res.status(200).send({ usuario: usuarioGuardado });
						});
					});
			} else {
				return res.status(500).send({ mensaje: 'El Usuario ya a sido registrado' });
			}});
	} else {
		return res.status(500).send({ mensaje: 'Enviar parametros obligatorios' });
	}
}

//Funciones de gerentes de hoteles
function registraGerente(req, res){
	var parametro = req.body;
	var usuarioModel = new Usuario();
	let emailOk = regExp.test(parametro.email);
	if(emailOk != true) return res.status(500).send({ mensaje: 'No se reconoce el email'});
	if (parametro.nombre && parametro.email && parametro.password) {
		usuarioModel.nombre = parametro.nombre;
		usuarioModel.email = parametro.email;  
		//Imagen
		if(req.file){
			const { filename } = req.file;
			usuarioModel.setImgUrl(filename);
		}
		usuarioModel.password = parametro.password; 
		usuarioModel.rol = 'ROL_ADMINHOTEL';
		Usuario.find({ email: parametro.email }, (err, usuarioEncontrado) => {
			if (usuarioEncontrado.length == 0) {
				bcrypt.hash(
					parametro.password,
					null,
					null,
					(err, passwordEncriptada) => { usuarioModel.password = passwordEncriptada; 
						usuarioModel.save((err, usuarioGuardado) => {
							if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
							if (!usuarioGuardado)return res.status(500).send({ mensaje: 'Error al agregar El Gerente' }); 
							return res.status(200).send({ usuario: usuarioGuardado });
						});
					});
			} else {
				return res.status(500).send({ mensaje: 'El Gerente ya a sido registrado' });
			}});
	} else {
		return res.status(500).send({ mensaje: 'Enviar parametros obligatorios' });
	}
}

//Funciones para ambos

//function editar(req, res) {
//}

module.exports  = {
	crearAdminInicio,
	Login,
	registrarUsuario,
	registraGerente,
	//editar
};