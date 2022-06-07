const Hotele = require('../models/hotel.model');
const Usuario = require('../models/usuario.model');

function creaHotel(req, res) {
	var parametros = req.body;
	var Hotelmodelo = new Hotele();

	if (req.user.rol == 'ROL_ADMIN') {
		//admin 
		if (parametros.nombre && parametros.descripcion && parametros.dirección && parametros.dueno) {
			Usuario.findOne({ nombre : parametros.dueno , rol: 'ROL_ADMINHOTEL'}, (err, DuenoEncontrado) => {
				console.log(DuenoEncontrado);
				if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
				if (!DuenoEncontrado) return res.status(500).send({ mensaje: 'No Se Encontro al Dueno' });
	
				Hotelmodelo.Nombre = parametros.nombre;
				Hotelmodelo.Descripcion = parametros.descripcion;
				Hotelmodelo.Dirección = parametros.dirección;
				Hotelmodelo.Dueno = DuenoEncontrado._id;
	
				Hotelmodelo.save((err, hotelGuardado) =>{
					if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
					if (!hotelGuardado) return res.status(500).send({ mensaje: 'Error al agregar hotel' });
					return res.status(200).send({ usuario: hotelGuardado });
				});

			});
		} else {
			return res.status(500).send({ mensaje: 'Debes enviar paramertros obligatorios ' });
		}
	} else if (req.user.rol == 'ROL_ADMINHOTEL') {
		//dueño
		if (parametros.nombre && parametros.descripcion && parametros.dirección) {
			Hotelmodelo.Nombre = parametros.nombre;
			Hotelmodelo.Descripcion = parametros.descripcion;
			Hotelmodelo.Dirección = parametros.dirección;
			Hotelmodelo.Dueno = req.user.sub;
	
			Hotelmodelo.save((err, hotelGuardado) =>{
				if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
				if (!hotelGuardado) return res.status(500).send({ mensaje: 'Error al agregar hotel' });
				return res.status(200).send({ usuario: hotelGuardado });
			});
		} else {
			return res.status(500).send({ mensaje: 'Debes enviar paramertros obligatorios ' });
		}
	}
}

module.exports = {
	creaHotel
};
