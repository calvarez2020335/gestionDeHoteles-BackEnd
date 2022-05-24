const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');

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

module.exports  = {
	crearAdminInicio
};