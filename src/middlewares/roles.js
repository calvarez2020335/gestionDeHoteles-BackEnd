exports.verUsuario = function(req, res, next) {
	if(req.user.rol !== 'ROL_USUARIO') return res.status(403).send({mensaje: 'Solo puede acceder la empresa'});
	next();
};

exports.verAdministrador = function(req, res, next) {
	if(req.user.rol !== 'ROL_ADMIN') return res.status(403).send({mensaje: 'Solo puede acceder el ADMIN'});
	next();
};

exports.verHotelAdmin = function(req, res, next) {
	if(req.user.rol !== 'ROL_ADMINHOTEL') return res.status(403).send({mensaje: 'Solo puede acceder el administrador del hotel'});
	next();
};