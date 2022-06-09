const Hotel = require('../models/hotel.model');
const Usuario = require('../models/usuario.model');

function creaHotel(req, res) {
	var parametro = req.body;
	var Hotelmodelo = new Hotel();

	if (req.user.rol == 'ROL_ADMIN') {
		//admin 
		if (parametro.nombre && parametro.descripcion && parametro.direccion && parametro.adminHotel) {


			Usuario.findOne({ nombre :{$regex: parametro.adminHotel ,$options:'i'}  , rol: 'ROL_ADMINHOTEL'}, (err, adminEncontrado) => {
				if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
				if (!adminEncontrado) return res.status(500).send({ mensaje: 'No Se Encontro al Dueno' });
				console.log(adminEncontrado);
				Hotel.find({Nombre: { $regex: parametro.Nombre, $options: 'i' },adminHotel: adminEncontrado._id ,},
					(err, hotelEncontrado) => {				
						if (hotelEncontrado.length > 0)
							return res.status(500).send({ mensaje: 'Este Hotel ya a sido creado' });

						Hotelmodelo.Nombre = parametro.nombre;
						Hotelmodelo.Descripcion = parametro.descripcion;
						Hotelmodelo.Direccion = parametro.direccion;
						Hotelmodelo.adminHotel = adminEncontrado._id;
						//Imagen
						if (req.file) {
							const { filename } = req.file;
							Hotelmodelo.setImgUrl(filename);
						}
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
		//adminHotel
		if (parametro.nombre && parametro.descripcion && parametro.direccion) {
			Hotel.find({Nombre: { $regex: parametro.nombre, $options: 'i' },adminHotel: req.user.sub},
				(err, hotelEncontrado) => {	
					console.log(hotelEncontrado);	
					if (hotelEncontrado.length > 0)
						return res.status(500).send({ mensaje: 'Este Hotel ya a sido creado' });

					Hotelmodelo.Nombre = parametro.nombre;
					Hotelmodelo.Descripcion = parametro.descripcion;
					Hotelmodelo.Direccion = parametro.direccion;
					Hotelmodelo.adminHotel = req.user.sub;
					//Imagen
					if (req.file) {
						const { filename } = req.file;
						Hotelmodelo.setImgUrl(filename);
					}
					Hotelmodelo.save((err, hotelGuardado) =>{
						if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
						if (!hotelGuardado) return res.status(500).send({ mensaje: 'Error al agregar hotel' });
						return res.status(200).send({ usuario: hotelGuardado });
					});
				});

		} else {
			return res.status(500).send({ mensaje: 'Debes enviar paramertros obligatorios ' });
		}
	}
}


function editarHotel (req, res){
	var idHotel = req.user.idUser;
	var parametro = req.body;

	//Imagen
	var Hotelmodelo = new Hotel();
	if (req.file) {
		const { filename } = req.file;
		Hotelmodelo.setImgUrl(filename);
	}

	if (req.user.rol == 'ROL_ADMIN'){
		//ADMIN
		parametro.image = Hotelmodelo.imgUrl;
		if(idHotel == null) return res.status(500).send({ mensaje: 'Necesita el id del hotel'});
		Hotel.findByIdAndUpdate(idHotel,{$set:{
			Nombre: parametro.nombre,
			Descripcion: parametro.descripcion,
			Direccion: parametro.direccion,
			imgUrlHoltel:parametro.image
		},},{new: true},(err, hotelActualizado) =>{
			if (err)return res.status(500).send({ mensaje: 'Error en la peticion de Hotel-admin' });
			if (!hotelActualizado)
				return res.status(500).send({ mensaje: 'Error al editar Hotel-admin' });
			return res.status(200).send({ hotelActualizadoAdmin: hotelActualizado });
		});
	} else {
		//Admin Hotel
		parametro.image = Hotelmodelo.imgUrl;
		Hotel.findByIdAndUpdate(req.user.sub,{$set:{
			Nombre: parametro.nombre,
			Descripcion: parametro.descripcion,
			Direccion: parametro.direccion,
			imgUrlHoltel:parametro.image
		},},{new: true},(err, hotelActualizado) =>{
			if (err)return res.status(500).send({ mensaje: 'Error en la peticion de Hotel' });
			if (!hotelActualizado)
				return res.status(500).send({ mensaje: 'Error al editar Hotel' });
			return res.status(200).send({ hotelActualizado: hotelActualizado });
		});


	}
		
}



module.exports = {
	creaHotel,
	editarHotel
};
