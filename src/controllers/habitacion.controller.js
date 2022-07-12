const Habitacion = require('../models/habitacion.model');
const Hotel = require('../models/hotel.model');

function registrarHabitacion(req, res) {
	const parametro = req.body;
	const idHotel = req.params.idHotel;
	const habitacionModel = new Habitacion();

	if (req.user.rol == 'ROL_ADMINHOTEL'){

		if(parametro.numHabitacion && parametro.tipoHabitacion && parametro.Precio){
			Hotel.findOne({_id: idHotel}, (err, hotelEncontrado) => {
	
				if(err) return res.status(500).send({ mensaje: 'Error en la petición de buscar hoteles-habitacion'});
				if(!hotelEncontrado) return res.status(500).send({ mensaje: 'No puede registrar habitaciones a un hotel que no le pertenezca'});
				Habitacion.find({numHabitacion: parametro.numHabitacion, hotel: idHotel}, (err, habitacionEncontrada) => {
	
					if(habitacionEncontrada.length > 0) return res.status(500).send({ mensaje: 'El numero de la habitación ya esta en uso'});
					if(parametro.Precio <= 0) return res.status(500).send({mensaje: 'Precio invalido'});
					if (req.file) {
						const { filename } = req.file;
						habitacionModel.setImgUrl(filename);
					}
	
					habitacionModel.numHabitacion = parametro.numHabitacion;
					habitacionModel.tipoHabitacion = parametro.tipoHabitacion;
					habitacionModel.Precio = parametro.Precio;
					habitacionModel.hotel = idHotel;
					habitacionModel.usuario = hotelEncontrado.adminHotel;
					habitacionModel.diponibilidad = 'true';
					habitacionModel.save((err, habitacionRegistrada)=>{
						if(err) return res.status(500).send({ mensaje: 'Error en la peticion de registrar habitación' });
						if(!habitacionRegistrada) return res.status(500).send({ mensaje: 'Error en registrar habitación' });
						return res.status(200).send({habitacionRegistrada: habitacionRegistrada});
					});
					
				});
			});
		}else{
			return res.status(500).send({ mensaje: 'Debe de enviar los parametros obligatorios' });
		}
	

	} else if (req.user.rol == 'ROL_ADMIN') {

		if(parametro.numHabitacion && parametro.tipoHabitacion && parametro.Precio){
			Hotel.findOne({_id: idHotel}, (err, hotelEncontrado) => {
	
				if(err) return res.status(500).send({ mensaje: 'Error en la petición de buscar hoteles-habitacion'});
				if(!hotelEncontrado) return res.status(500).send({ mensaje: 'No puede registrar habitaciones a un hotel que no le pertenezca'});
				Habitacion.find({numHabitacion: parametro.numHabitacion, hotel: idHotel}, (err, habitacionEncontrada) => {
	
					if(habitacionEncontrada.length > 0) return res.status(500).send({ mensaje: 'El numero de la habitación ya esta en uso'});
					if(parametro.Precio <= 0) return res.status(500).send({mensaje: 'Precio invalido'});
					if (req.file) {
						const { filename } = req.file;
						habitacionModel.setImgUrl(filename);
					}
	
					habitacionModel.numHabitacion = parametro.numHabitacion;
					habitacionModel.tipoHabitacion = parametro.tipoHabitacion;
					habitacionModel.Precio = parametro.Precio;
					habitacionModel.hotel = idHotel;
					habitacionModel.usuario = hotelEncontrado.adminHotel;
					habitacionModel.diponibilidad = 'true';
					habitacionModel.save((err, habitacionRegistrada)=>{
						if(err) return res.status(500).send({ mensaje: 'Error en la peticion de registrar habitación' });
						if(!habitacionRegistrada) return res.status(500).send({ mensaje: 'Error en registrar habitación' });
						return res.status(200).send({habitacionRegistrada: habitacionRegistrada});
					});
					
				});
			});
		}else{
			return res.status(500).send({ mensaje: 'Debe de enviar los parametros obligatorios' });
		}


	}


}

function verHabitaciones(req, res) {
	const idHotel = req.params.idHotel;
	if(req.user.rol == 'ROL_ADMINHOTEL'){
		Hotel.findOne({_id: idHotel, adminHotel: req.user.sub}, (err, hotelEncontrado) => {
			if(err) return res.status(500).send({ mensaje: 'Error en la petición de buscar hoteles-habitacion'});
			if(!hotelEncontrado) return res.status(500).send({ mensaje: 'No puede buscar habitaciones de un hotel que no le pertenezca'});
			Habitacion.find({hotel: idHotel, usuario: req.user.sub}, (err, habitacionEncontrada) => {
				if(err) return res.status(404).send({mensaje: 'Error en la pettcion de buscar habitacion'});
				if(!habitacionEncontrada) return res.status(404).send({mensaje: 'Error al buscar habitación'});
				return res.status(200).send({habitaciones: habitacionEncontrada});
			});
		});	
	}else{
		Habitacion.find({hotel: idHotel}, (err, habitacionEncontrada) => {
			if(err) return res.status(404).send({mensaje: 'Error en la pettcion de buscar habitacion'});
			if(!habitacionEncontrada) return res.status(404).send({mensaje: 'Error al buscar habitación'});
			let disponibles = habitacionEncontrada.filter(habitacionEncontrada => habitacionEncontrada.diponibilidad.toString() == 'true' );
			return res.status(200).send({habitaciones: disponibles});
		});
	}
}

function verHabitacioId(req, res) {
	const idHabitacion = req.params.idHabitacion;
	
	Habitacion.findOne({_id: idHabitacion}, (err, habitacionEncontrada) => {

		if(err) return res.status(404).send({mensaje: 'Error en la pettcion de buscar habitacion'});
		if(!habitacionEncontrada) return res.status(404).send({mensaje: 'No puede ver habitaciones que no le pertenezcan'});
		return res.status(200).send({habitacion: habitacionEncontrada});
	});

}

function verHabitacionesDisponibles(req, res) {
	const idHotel = req.params.idHotel;

	Habitacion.find({hotel: idHotel, usuario: req.user.sub}, (err, habitacionEncontrada) => {
		let disponibles = habitacionEncontrada.filter(habitacionEncontrada => habitacionEncontrada.diponibilidad.toString() == 'true' );
		return res.status(200).send({habitacionesDisponibles: disponibles});
	});

}

function habitacionesDisponiblesNumeros(req, res) {
	const idHotel = req.params.idHotel;

	Habitacion.find({hotel: idHotel, usuario: req.user.sub}, (err, habitacionEncontrada) => {
		let disponibles = habitacionEncontrada.filter(habitacionEncontrada => habitacionEncontrada.diponibilidad.toString() == 'true' );
		return res.status(200).send({habitacionesDisponibles: disponibles.length});
	});
}

function editarHabitacion(req, res) {
	const idHabitacion = req.params.idHabitacion;
	const parametro = req.body;
	if(parametro.Precio <=0) return res.status(500).send({mensaje: 'Precio invalido'});
	Habitacion.findOne({_id: idHabitacion, usuario: req.user.sub}, (err, habitacionEncontrada) => {
		if(err) return res.status(404).send({mensaje: 'Error en la peticion de buscar habitacion'});
		if(!habitacionEncontrada) return res.status(404).send({mensaje: 'No puede editar habitaciones que no le pertenezcan'});
		
		Habitacion.findByIdAndUpdate(idHabitacion, {$set:{ numHabitacion: parametro.numHabitacion, tipoHabitacion: parametro.tipoHabitacion, Precio:parametro.Precio}}, {new:true}, (err, habitacionActualizada)=>{
			if(err) return res.status(404).send({mensaje: 'Error en la peticion de editar habitacion'});
			if(!habitacionActualizada) return res.status(500).send({mensaje: 'Error al editar habitacion'});
			return res.status(200).send({habitacionEditada: habitacionActualizada});
		});

	});

}

function eliminarHabitacion(req, res){
	const idHabitacion = req.params.idHabitacion;
	Habitacion.findOne({_id: idHabitacion, usuario: req.user.sub}, (err, habitacionEncontrada) => {
		if(err) return res.status(404).send({mensaje: 'Error en la peticion de buscar habitacion'});
		if(!habitacionEncontrada) return res.status(404).send({mensaje: 'No puede editar habitaciones que no le pertenezcan'});
		
		Habitacion.findByIdAndDelete({_id: idHabitacion}, (err, habitacionEliminar) => {
			if(err) return res.status(404).send({mensaje: 'Error en la peticion de eliminar habitacion'});
			if(!habitacionEliminar) return res.status(404).send({ mensaje: 'Error al eliminar habitacion'});
			return res.status(200).send({habitacionEliminada: habitacionEliminar});
		});

	});

}

module.exports = {
	registrarHabitacion,
	verHabitaciones,
	verHabitacioId,
	editarHabitacion,
	eliminarHabitacion,
	verHabitacionesDisponibles,
	habitacionesDisponiblesNumeros
};