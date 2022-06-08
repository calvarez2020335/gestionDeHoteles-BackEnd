const Hotel = require('../models/hotel.model');
const Usuario = require('../models/usuario.model');

function creaHotel(req, res) {
	var parametro = req.body;
	var Hotelmodelo = new Hotel();

	if (req.user.rol == 'ROL_ADMIN') {
		//admin 
		if (parametro.nombre && parametro.descripcion && parametro.dirección && parametro.dueno) {


			Usuario.findOne({ nombre :{$regex: parametro.dueno ,$options:'i'}  , rol: 'ROL_ADMINHOTEL'}, (err, DuenoEncontrado) => {
				if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
				if (!DuenoEncontrado) return res.status(500).send({ mensaje: 'No Se Encontro al Dueno' });
				console.log(DuenoEncontrado);
				Hotel.find({Nombre: { $regex: parametro.Nombre, $options: 'i' },adminHotel: DuenoEncontrado._id ,},
					(err, hotelEncontrado) => {				
						if (hotelEncontrado.length > 0)
							return res.status(500).send({ mensaje: 'Este Hotel ya a sido creado' });

						Hotelmodelo.Nombre = parametro.nombre;
						Hotelmodelo.Descripcion = parametro.descripcion;
						Hotelmodelo.Dirección = parametro.dirección;
						Hotelmodelo.adminHotel = DuenoEncontrado._id;
						Hotelmodelo.save((err, hotelGuardado) =>{
							if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
							if (!hotelGuardado) return res.status(500).send({ mensaje: 'Error al agregar hotel' });
							return res.status(200).send({ usuario: hotelGuardado });
						});
					});
			});

		} else {
			return res.status(500).send({ mensaje: 'Debes enviar paramertros obligatorios ' });
		}
	} else if (req.user.rol == 'ROL_ADMINHOTEL') {
		//dueño
		if (parametro.nombre && parametro.descripcion && parametro.dirección) {
			Hotelmodelo.Nombre = parametro.nombre;
			Hotelmodelo.Descripcion = parametro.descripcion;
			Hotelmodelo.Dirección = parametro.dirección;
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
