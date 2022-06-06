const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
let regExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

function Login(req, res) {
	var parametros = req.body;
	Usuario.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
		if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
		if (usuarioEncontrado) {
			bcrypt.compare(parametros.password, usuarioEncontrado.password, (err, verificacionPassword) => {
				if (verificacionPassword) {
					if (parametros.obtenerToken === 'true') {
						return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) });
					} else {
						usuarioEncontrado.password = undefined;
						return res.status(200).send({ usuario: usuarioEncontrado });
					}
				} else {
					return res.status(500).send({ mensaje: 'Las contrasena no coincide' });
				}
			}
			);
		} else {
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
	if (emailOk != true) return res.status(500).send({ mensaje: 'No se reconoce el email' });
	if (parametro.nombre && parametro.email && parametro.password) {
		usuarioModel.nombre = parametro.nombre;

		usuarioModel.email = parametro.email;
		//Imagen
		if (req.file) {
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
					(err, passwordEncriptada) => {
						usuarioModel.password = passwordEncriptada;
						usuarioModel.save((err, usuarioGuardado) => {
							if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
							if (!usuarioGuardado) return res.status(500).send({ mensaje: 'Error al agregar Usuario' });
							return res.status(200).send({ usuario: usuarioGuardado });
						});
					});
			} else {
				return res.status(500).send({ mensaje: 'El Usuario ya a sido registrado' });
			}
		});
	} else {
		return res.status(500).send({ mensaje: 'Enviar parametros obligatorios' });
	}
}

//Funciones de gerentes de hoteles
function registraGerente(req, res) {
	var parametro = req.body;
	var usuarioModel = new Usuario();
	let emailOk = regExp.test(parametro.email);
	if (emailOk != true) return res.status(500).send({ mensaje: 'No se reconoce el email' });
	if (parametro.nombre && parametro.email && parametro.password) {
		usuarioModel.nombre = parametro.nombre;
		usuarioModel.email = parametro.email;
		//Imagen
		if (req.file) {
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
					(err, passwordEncriptada) => {
						usuarioModel.password = passwordEncriptada;
						usuarioModel.save((err, usuarioGuardado) => {
							if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
							if (!usuarioGuardado) return res.status(500).send({ mensaje: 'Error al agregar El Gerente' });
							return res.status(200).send({ usuario: usuarioGuardado });
						});
					});
			} else {
				return res.status(500).send({ mensaje: 'El Gerente ya a sido registrado' });
			}
		});
	} else {
		return res.status(500).send({ mensaje: 'Enviar parametros obligatorios' });
	}
}

//Funciones para ambos

function editarUsuario(req, res) {
	var idUser = req.params.idUser;
	var parametro = req.body;
	var emailOk = regExp.test(parametro.email);
	if (emailOk != true) return res.status(500).send({ mensaje: 'No se reconoce el email' });
	delete parametro.password;		
	delete parametro.rol;
	//Imagen
	var usuarioModel = new Usuario();
	if (req.file) {
		const { filename } = req.file;
		usuarioModel.setImgUrl(filename);
	}
	if (req.user.rol == 'ROL_ADMIN') {
		//ADMIN
		parametro.image = usuarioModel.imgUrl;
		if(idUser == null) return res.status(500).send({ mensaje: 'Necesita el id del usuario'});
		Usuario.findByIdAndUpdate(idUser,{$set: {
			nombre: parametro.nombre,
			email: parametro.email,
			imgUrl: parametro.image
		},},{ new: true },
		(err, usuarioActualizado) => {
			if (err)return res.status(500).send({ mensaje: 'Error en la peticion de editar-admin' });
			if (!usuarioActualizado)
				return res.status(500).send({ mensaje: 'Error al editar usuario-admin' });
			return res.status(200).send({ usuarioAdmin: usuarioActualizado });
		});
	} else if (req.user.rol == 'ROL_ADMINHOTEL') {
		//GERENTE
		parametro.image = usuarioModel.imgUrl;
		Usuario.findByIdAndUpdate(req.user.sub ,{$set: {
			nombre: parametro.nombre,
			email: parametro.email,
			imgUrl: parametro.image
		},},{ new: true },
		(err, usuarioActualizado) => {
			if (err)return res.status(500).send({ mensaje: 'Error en la peticon de admin-hotel' });
			if (!usuarioActualizado)
				return res.status(500).send({ mensaje: 'Error al editar admin-hotel' });
			return res.status(200).send({ AdminHotel: usuarioActualizado });
		});

	} else {
		//CLIENTE
		parametro.image = usuarioModel.imgUrl;
		Usuario.findByIdAndUpdate(req.user.sub ,{$set: {
			nombre: parametro.nombre,
			email: parametro.email,
			imgUrl: parametro.image
		},},{ new: true },
		(err, usuarioActualizado) => {
			if (err)return res.status(500).send({ mensaje: 'Error en la peticon de Usuario' });
			if (!usuarioActualizado)
				return res.status(500).send({ mensaje: 'Error al editar Usuario' });
			return res.status(200).send({ Usuario: usuarioActualizado });
		});
	}

}

function eliminarUsuario(req, res) {

	const idUser = req.params.idUser;

	if (req.user.rol == 'ROL_ADMIN'){
		//Administrador
		if(idUser == null) return res.status(500).send({ mensaje: 'Necesita el id del usuario'});
		Usuario.findOne({_id: idUser}, (err, usuarioEncontrado)=>{
			if(usuarioEncontrado.rol == 'ROL_ADMIN') return res.status(500).send({ mensaje: 'No puede eliminar al administrador'});
			Usuario.findByIdAndDelete(idUser, (err, usuarioEliminado)=>{
				if(err) return res.status(500).send({ mensaje: 'Error en la petición de eliminar usuario'});
				if(!usuarioEliminado) return res.status(500).send({ mensaje: 'Error al eliminar usuario admin'});
				return res.status(200).send({usuarioEliminado: usuarioEliminado});
			});
		});
	}else if (req.user.rol == 'ROL_ADMINHOTEL') {
		Usuario.findByIdAndDelete(req.user.sub, (err, usuarioEliminado)=>{
			if(err) return res.status(500).send({ mensaje: 'Error en la petición de eliminar usuario hotel'});
			if(!usuarioEliminado) return res.status(500).send({ mensaje: 'Error al eliminar usuario hotel'});
			return res.status(200).send({usuarioEliminado: usuarioEliminado});
		});
	}else{
		Usuario.findByIdAndDelete(req.user.sub, (err, usuarioEliminado)=>{
			if(err) return res.status(500).send({ mensaje: 'Error en la petición de eliminar usuario usuario'});
			if(!usuarioEliminado) return res.status(500).send({ mensaje: 'Error al eliminar usuario usuario'});
			return res.status(200).send({usuarioEliminado: usuarioEliminado});
		});
	}
}

function verUsuarios(req, res){
	Usuario.find({}, (err, usuariosEncontrados)=>{
		if(err) return res.status(404).send({mensaje: 'Error en la petición de ver usuario usuario'});
		if(!usuariosEncontrados) return res.status(404).send({mensaje: 'Error en la petición usuario'});
		return res.status(200).send({usuarios: usuariosEncontrados});
	});
}

function verUsuarioId(req, res){
	const idUser = req.params.idUser;

	if (req.user.rol == 'ROL_ADMIN') {
		//Super Admin
		Usuario.findById({_id: idUser}, (err, usuarioEncontrado)=>{
			if(err) return res.status(500).send({ mensaje: 'Error en la petición de buscar usuarios admin'});
			if(!usuarioEncontrado) return res.status(500).send({ mensaje: 'Erroa la busacar id admin'});
			return res.status(200).send({usuarioEncontrado: usuarioEncontrado});
		});
	}else if (req.user.rol == 'ROL_ADMINHOTEL'){
		//Gerente Hotel
		Usuario.findById({_id: req.user.sub}, (err, usuarioEncontrado)=>{
			if(err) return res.status(500).send({ mensaje: 'Error en la petición de buscar usuarios admin'});
			if(!usuarioEncontrado) return res.status(500).send({ mensaje: 'Erroa la busacar id admin'});
			return res.status(200).send({usuarioEncontrado: usuarioEncontrado});
		});
	}else{
		//Usuario
		Usuario.findById({_id: req.user.sub}, (err, usuarioEncontrado)=>{
			if(err) return res.status(500).send({ mensaje: 'Error en la petición de buscar usuarios admin'});
			if(!usuarioEncontrado) return res.status(500).send({ mensaje: 'Erroa la busacar id admin'});
			return res.status(200).send({usuarioEncontrado: usuarioEncontrado});
		});
	}

}

module.exports = {
	crearAdminInicio,
	Login,
	registrarUsuario,
	registraGerente,
	editarUsuario,
	eliminarUsuario,
	verUsuarios,
	verUsuarioId
};