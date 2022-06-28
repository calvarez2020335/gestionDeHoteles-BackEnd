const Hotel = require('../models/hotel.model');
const Usuario = require('../models/usuario.model');
const Servicios = require('../models/servicio.model');
const Reservacion = require('../models/reservacion.model');
const Habitacion = require('../models/habitacion.model');
const Eventos = require('../models/evento.model');

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
				Hotel.find({Nombre: { $regex: parametro.nombre, $options: 'i' },adminHotel: adminEncontrado._id ,},
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
	} else {
		return res.status(500).send({ mensaje: 'Eres Un Cliente' });
	}
}


function editarHotel (req, res){
	var idHotel = req.params.idHotel;
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
			if (err)return res.status(500).send({ mensaje: 'Error en la peticion de Hotel' });
			if (!hotelActualizado)
				return res.status(500).send({ mensaje: 'Error al editar Hotel' });
			return res.status(200).send({ hotelActualizadoAdmin: hotelActualizado });
		});
	} else {
		//Admin Hotel
		parametro.image = Hotelmodelo.imgUrl;
		if(idHotel == null) return res.status(500).send({ mensaje: 'Necesita el id del hotel'});
		Hotel.findOne({_id: idHotel} , (err, HotelEncontrado) =>{
			if (err)return res.status(500).send({ mensaje: 'Error en la peticion de Hotel-admin' });
			if (!HotelEncontrado)return res.status(500).send({ mensaje: 'no se encontro hotel' });
			if (req.user.sub == HotelEncontrado.adminHotel){
				Hotel.findByIdAndUpdate(HotelEncontrado._id ,{$set:{
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
			} else {
				res.status(500).send({ mensaje: 'este hotel no te pertenese' });
			}
		});
	}
}

function eliminarHotel(req, res) {
	var idHotel = req.params.idHotel;
	if (req.user.rol == 'ROL_ADMIN'){
		//Administrador
		console.log(idHotel);
		if(idHotel == null) return res.status(500).send({ mensaje: 'Necesita el id del hotel'});
		Servicios.deleteMany( {hotel: idHotel }, (err, servicioEliminado) =>{
			if(err) return res.status(500).send({ mensaje: 'Error en la petición de eliminar servicios'});
			if(!servicioEliminado) return res.status(500).send({ mensaje: 'Error al eliminar servicios admin'});
			//return res.status(200).send({servicioEliminado: servicioEliminado});
			console.log(servicioEliminado);
			Reservacion.deleteMany( {hotel: idHotel }, (err, reservacionEliminado) =>{ 
				if(err) return res.status(500).send({ mensaje: 'Error en la petición de eliminar reservacion'});
				if(!reservacionEliminado) return res.status(500).send({ mensaje: 'Error al eliminar reservacion admin'});
				console.log(reservacionEliminado);
				Habitacion.deleteMany( {hotel: idHotel }, (err, HabitacionEliminado) =>{ 
					if(err) return res.status(500).send({ mensaje: 'Error en la petición de eliminar habitacion'});
					if(!HabitacionEliminado) return res.status(500).send({ mensaje: 'Error al eliminar habitacion admin'});
					console.log(HabitacionEliminado);	
					Eventos.deleteMany( {hotel: idHotel }, (err, EventosEliminado) =>{ 
						if(err) return res.status(500).send({ mensaje: 'Error en la petición de eliminar eventos'});
						if(!EventosEliminado) return res.status(500).send({ mensaje: 'Error al eliminar eventos admin'});
						console.log(EventosEliminado);
						Hotel.findByIdAndDelete(idHotel, (err, hotelEliminado)=>{
							if(err) return res.status(500).send({ mensaje: 'Error en la petición de eliminar hotel'});
							if(!hotelEliminado) return res.status(500).send({ mensaje: 'Error al eliminar hotel admin'});
							return res.status(200).send({Eliminado: hotelEliminado ,servicioEliminado , 
								reservacionEliminado , HabitacionEliminado, EventosEliminado});
						});
					});
				});
			});
		} );
	}else if (req.user.rol == 'ROL_ADMINHOTEL' ){
		Hotel.findOne({_id: idHotel}, (err, HotelEncontrado)=>{
			if (err)return res.status(500).send({ mensaje: 'Error en la peticion de Hotel' });
			if (!HotelEncontrado) return res.status(500).send({ mensaje: 'No se pudo encontra al hotel'});
			if (req.user.sub == HotelEncontrado.adminHotel) {
				Servicios.deleteMany( {hotel: idHotel }, (err, servicioEliminado) =>{
					if(err) return res.status(500).send({ mensaje: 'Error en la petición de eliminar servicios'});
					if(!servicioEliminado) return res.status(500).send({ mensaje: 'Error al eliminar servicios admin'});
					//return res.status(200).send({servicioEliminado: servicioEliminado});
					console.log(servicioEliminado);
					Reservacion.deleteMany( {hotel: idHotel }, (err, reservacionEliminado) =>{ 
						if(err) return res.status(500).send({ mensaje: 'Error en la petición de eliminar reservacion'});
						if(!reservacionEliminado) return res.status(500).send({ mensaje: 'Error al eliminar reservacion admin'});
						console.log(reservacionEliminado);
						Habitacion.deleteMany( {hotel: idHotel }, (err, HabitacionEliminado) =>{ 
							if(err) return res.status(500).send({ mensaje: 'Error en la petición de eliminar habitacion'});
							if(!HabitacionEliminado) return res.status(500).send({ mensaje: 'Error al eliminar habitacion admin'});
							console.log(HabitacionEliminado);
							Eventos.deleteMany( {hotel: idHotel }, (err, EventosEliminado) =>{ 
								if(err) return res.status(500).send({ mensaje: 'Error en la petición de eliminar eventos'});
								if(!EventosEliminado) return res.status(500).send({ mensaje: 'Error al eliminar eventos admin'});
								console.log(EventosEliminado);
								Hotel.findByIdAndDelete(idHotel, (err, hotelEliminado)=>{
									if(err) return res.status(500).send({ mensaje: 'Error en la petición de eliminar hotel'});
									if(!hotelEliminado) return res.status(500).send({ mensaje: 'Error al eliminar hotel admin'});
									return res.status(200).send({Eliminado: hotelEliminado ,servicioEliminado , 
										reservacionEliminado , HabitacionEliminado, EventosEliminado});
								});
							});
						});
					});
				} );
			} else {
				return res.status(500).send({ mensaje: 'No Puedes Eliminar Este Hotel No te Pertenece'});
			}
		});
	}
}

function verHoteles(req, res){

	Hotel.find({}, (err, hotelEncontrado) => {
		if(err) return res.status(500).send({ mensaje: 'Error en la petición de ver hoteles'});
		if(!hotelEncontrado) return res.status(500).send({ mensaje: 'Error no se pudo encotrar hoteles'});
		return res.status(200).send({ Hoteles: hotelEncontrado });
	});
}

function verHotelesId(req, res){
	const idHotel = req.params.idHotel;

	if(idHotel == null) return res.status(500).send({ mensaje: 'Necesita el id del hotel'});
	Hotel.findById({_id: idHotel}, (err, hotelEncontrado)=>{
		if(err) return res.status(500).send({ mensaje: 'Error en la petición de buscar Hotel'});
		if(!hotelEncontrado) return res.status(500).send({ mensaje: 'Error la busacar id Hotel'});
		return res.status(200).send({Hotel: hotelEncontrado});
	});


}

function verHoteleNombre(req, res){
	var parametro = req.body;

	Hotel.find({Nombre:  {$regex: parametro.nombre, $options:'i'}}, (err, hotelEncontrado)=>{
		if(err) return res.status(500).send({ mensaje: 'Error en la petición de buscar Hotel'});
		if(!hotelEncontrado) return res.status(500).send({ mensaje: 'no se encontrar hotel'});

		return res.status(200).send({Hotel: hotelEncontrado});
	});
}

module.exports = {
	creaHotel,
	editarHotel,
	eliminarHotel,
	verHoteles,
	verHotelesId,
	verHoteleNombre
};
