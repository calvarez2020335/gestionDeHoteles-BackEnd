const Reservacion = require('../models/reservacion.model');
const Habitacion = require('../models/habitacion.model');
const diasHabitacion = require('../models/diasHabitacion.model');
const usuariosSubcritos = require('../models/usuariosSubcritos.model');
const Factura = require('../models/factura.model');
const Hotel = require('../models/hotel.model');
// const Hotel = require('../models/hotel.model');
// const Usuario = require('../models/usuario.model');

function crearReservacion(req, res) {
	var parametro = req.body;
	var ReservacionModelo = new Reservacion();
	var DiasHabitacionModelo = new diasHabitacion();
	var usuarioSubModelo = new usuariosSubcritos();
	var facturaModelo = new Factura();
	const idHabitacion = req.params.idHabitacion;

	if (parametro.FechaEntrada){
		Reservacion.find({usuario: req.user.sub}, (err, usuarioEncontrado)=>{
			if(err) return res.status(404).send({mensaje: 'Error en la petición de solicitar reservación'});
			if(usuarioEncontrado.length > 0) return res.status(500).send({mensaje: 'Solo puede reservar una habitación'});

			Habitacion.findById( idHabitacion ,(err, habitacionEncontrada) =>{
				if(err) return res.status(500).send({ mensaje: 'Error en la peticion de buscar habitacion-reservacion' });
				if(!habitacionEncontrada) return res.status(500).send({ mensaje: 'No Se Encontro habitacion'});
				if( habitacionEncontrada.diponibilidad.toString() == 'false') return res.status(500).send({ mensaje: 'No puede reservar esta habitación'});
				let dias = parseInt(parametro.FechaEntrada);
	
				let hoy = new Date();
				let semanaEnMilisegundos = 1000 * 60 * 60 * 24 * dias;
				let suma = hoy.getTime() + semanaEnMilisegundos; //getTime devuelve milisegundos de esa fecha
				let fechaDentroDeUnaSemana = new Date(suma);
	
				ReservacionModelo.CorreoReservacion = req.user.email;
				ReservacionModelo.FechaEntrada = hoy.toLocaleDateString();
				ReservacionModelo.FechaSalida = fechaDentroDeUnaSemana.toLocaleDateString();
				ReservacionModelo.Estado = 'Activa',
				ReservacionModelo.habitacion = idHabitacion;
				ReservacionModelo.usuario = req.user.sub;
				ReservacionModelo.hotel = habitacionEncontrada.hotel;
				Habitacion.findByIdAndUpdate(idHabitacion, {$set:{ diponibilidad: 'false'}}, {new:true}, (err, habitacionActualizada)=>{
					if(err) return res.status(404).send({mensaje: 'Error en la peticion de editar habitacion'});
					if(!habitacionActualizada) return res.status(500).send({mensaje: 'Error al editar habitacion'});
				
					DiasHabitacionModelo.dias = dias;
					DiasHabitacionModelo.PrecioHabitacion = habitacionEncontrada.Precio;
					DiasHabitacionModelo.Total = dias *  parseInt(habitacionEncontrada.Precio);
					DiasHabitacionModelo.habitacion = idHabitacion;
					DiasHabitacionModelo.numHabitacion = habitacionEncontrada.numHabitacion;
					DiasHabitacionModelo.Usuario = req.user.sub;
	
					DiasHabitacionModelo.save((err, diasHabitacionGuardado)=>{
						if(err) return res.status(500).send({ mensaje: 'Error en la peticion de guardar en el modelo de diasHabitacion'});
						if (!diasHabitacionGuardado) return res.status(500).send({ mensaje: 'Error al guardar en el modelo dias' });
						
						Hotel.findOne({_id: habitacionEncontrada.hotel}, (err, HotelEncontrado)=>{
							if(err) return res.status(500).send({ mensaje: 'Error en la peticion de guardar en el modelo de hotel'});
							if (!HotelEncontrado) return res.status(500).send({ mensaje: 'Error encontrar' });
								
		

							usuarioSubModelo.usuario = req.user.sub;
							usuarioSubModelo.NombreUsuario = req.user.nombre;
							usuarioSubModelo.NombreHotel = HotelEncontrado.Nombre;
							usuarioSubModelo.hotel = habitacionEncontrada.hotel;
		

							usuarioSubModelo.save((err, usuariosSubGuardado) =>{
								if(err) return res.status(500).send({ mensaje: 'Error en la peticion de guardar en el modelo de diasHabitacion'});
								if (!usuariosSubGuardado) return res.status(500).send({ mensaje: 'Error al guardar en el modelo dias' });
		
								facturaModelo.Usuario = req.user.sub;
								facturaModelo.servicios = [];
								facturaModelo.Subtotal = 0;
								facturaModelo.total = 0;
								facturaModelo.hotelHospedado = habitacionEncontrada.hotel;
								facturaModelo.estado = 'No Confirmado';

								facturaModelo.save((err, facturaGuardada) =>{
									if (err) return res.status(500).send({ mensaje: 'Error en la peticion de facturaGuardada' });
									if (!facturaGuardada) return res.status(500).send({ mensaje: 'Error al agregar una factura' });

									Hotel.findOneAndUpdate({ _id:  habitacionEncontrada.hotel} , { $inc: { VecesSolicitado: 1 } } ,{new: true} , (err , HotelSolicitado) =>{
										if (err) return res.status(500).send({ mensaje: 'Error en la peticion de actuaizar solicitacion de hotel' });
										if (!HotelSolicitado) return res.status(500).send({ mensaje: 'Error al actualiza la solicitacion' });
		

										ReservacionModelo.save((err, reservacionGuardada) =>{
											if (err) return res.status(500).send({ mensaje: 'Error en la peticion de reservacion' });
											if (!reservacionGuardada) return res.status(500).send({ mensaje: 'Error al agregar una reservacion' });
											return res.status(200).send({ ReservacionTotal: reservacionGuardada , diasHabitacionGuardado, habitacionActualizada, usuariosSubGuardado, facturaGuardada, HotelSolicitado});
										});

									} );
								});
							
				
							});
						});	
					});
				});
			});
		});
	} else {

		return res.status(500).send({ mensaje: 'debes mandar parametros oligatorios ' });
	}

}



function CancelarResevacion(req, res) {
	const idUsuario = req.user.sub;

	Reservacion.findOne({usuario: idUsuario}, (err, reservacionEncontrada) =>{
		if(err) return res.status(500).send({ mensaje: 'Error en la peticion de buscar-reservación-cancelar'});
		if(!reservacionEncontrada) return res.status(500).send({ mensaje: 'No tiene reservaciones activas'});
		diasHabitacion.findOne({Usuario: idUsuario}, (err, diasHabitacionEncontrada)=>{
			let hoy = new Date();
			const diaInicial = parseInt(reservacionEncontrada.FechaEntrada);
			const fechaSalida = parseInt(hoy.toLocaleDateString());
			const nuevoDiaSalida = fechaSalida - diaInicial;
			const nuevoTotal = diasHabitacionEncontrada.PrecioHabitacion * nuevoDiaSalida;

			Reservacion.findOneAndUpdate({usuario: idUsuario}, {FechaSalida: hoy.toLocaleDateString(), Estado: 'Cancelada'}, {new:true}, (err, reservacionActualizada)=>{
				if(err) return res.status(500).send({ mensaje: 'Error en la peticion de editar fechas de salida'});
				if(!reservacionActualizada) return res.status(500).send({ mensaje: 'Error al editar fecha de salida'});
				diasHabitacion.findOneAndUpdate({usuario: idUsuario}, {dias: nuevoDiaSalida, Total: nuevoTotal}, {new: true}, (err, diasActualizados)=>{
					if(err) return res.status(500).send({ mensaje: 'Error en la peticion de editar dia de salida'});
					if(!diasActualizados) return res.status(500).send({ mensaje: 'Error al editar dia de salida'});
					return res.status(200).send({mensaje:reservacionActualizada});
				});
			});
		});
	});
}


function VerReservaciones (req , res) {
	var idHotel = req.params.idHotel;

	Hotel.findOne({ _id: idHotel , adminHotel: req.user.sub } , (err, HotelEncontrado) =>{
		if(err) return res.status(500).send({ mensaje: 'Error en la peticion de de Encotrar Hotel'});
		if(!HotelEncontrado) return res.status(500).send({ mensaje: 'Este Hotel No Te Pertece'});

		Reservacion.find({hotel: HotelEncontrado._id} , (err, reservacionEncontrada ) =>{
			if(err) return res.status(500).send({ mensaje: 'Error en la peticion de mostrar  reservaciones'});
			if(!reservacionEncontrada) return res.status(500).send({ mensaje: 'Error al mostrar reservaciones'});
			return res.status(200).send({mensaje: reservacionEncontrada});
		});
	});
}

function VerReservacionesId (req , res) {
	var idReservacion = req.params.idReservacion;

	Reservacion.find({_id: idReservacion }  , (err, reservacionEncontrada ) =>{
		if(err) return res.status(500).send({ mensaje: 'Error en la peticion de mostrar  reservaciones'});
		if(!reservacionEncontrada) return res.status(500).send({ mensaje: 'Error al mostrar reservaciones'});
		return res.status(200).send({mensaje: reservacionEncontrada});
	});
	
}

function VerReservacioneUsuario (req , res) {
	var idUsuario = req.user.sub;

	Reservacion.find({usuario: idUsuario }  , (err, reservacionEncontrada ) =>{
		if(err) return res.status(500).send({ mensaje: 'Error en la peticion de mostrar  reservaciones'});
		if(!reservacionEncontrada) return res.status(500).send({ mensaje: 'Error al mostrar reservaciones'});
		return res.status(200).send({mensaje: reservacionEncontrada});
	});
	
}


//ver reservacion y  
//ver habitaciones disponibles 



module.exports = {
	crearReservacion,
	CancelarResevacion,
	VerReservaciones,
	VerReservacionesId,
	VerReservacioneUsuario

};