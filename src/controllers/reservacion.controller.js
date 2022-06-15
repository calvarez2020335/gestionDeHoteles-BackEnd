const Reservacion = require('../models/reservacion.model');
const Habitacion = require('../models/habitacion.model');
const diasHabitacion = require('../models/diasHabitacion');
// const Hotel = require('../models/hotel.model');
// const Usuario = require('../models/usuario.model');

function crearReservacion(req, res) {
	var parametro = req.body;
	var ReservacionModelo = new Reservacion();
	var DiasHabitacionModelo = new diasHabitacion();
	const idHabitacion = req.params.idHabitacion;

	if (parametro.fechaentrada){
		Habitacion.findById( idHabitacion ,(err, habitacionEncontrada) =>{
			if(err) return res.status(500).send({ mensaje: 'Error en la peticion de buscar habitacion-reservacion' });
			if(!habitacionEncontrada) return res.status(500).send({ mensaje: 'No Se Encontro habitacion'});
			if( habitacionEncontrada.diponibilidad.toString() == 'false') return res.status(500).send({ mensaje: 'No puede reservar esta habitación'});
			let dias = parseInt(parametro.fechaentrada);
			// let hoy = new Date();
		
			// let fechaEnMilisegundos = 1000 * 60 * 60 * 24 * dias;
			// let suma = hoy.getTime() + fechaEnMilisegundos; //getTime devuelve milisegundos de esa fecha
			// let diasReservacion = new Date(suma);
			let hoy = new Date();
			let semanaEnMilisegundos = 1000 * 60 * 60 * 24 * 7;
			let suma = hoy.getTime() + semanaEnMilisegundos; //getTime devuelve milisegundos de esa fecha
			let fechaDentroDeUnaSemana = new Date(suma);

			console.log(hoy);
			console.log(fechaDentroDeUnaSemana);

			ReservacionModelo.CorreoReservacion = req.user.email;
			ReservacionModelo.FechaEntrada = hoy;
		

			ReservacionModelo.FechaSalida = fechaDentroDeUnaSemana;

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
				DiasHabitacionModelo.Usuario = req.user.sub;


				DiasHabitacionModelo.save((err, diasHabitacionGuardado)=>{
					if(err) return res.status(500).send({ mensaje: 'Error en la peticion de guardar en el modelo de diasHabitacion'});
					if (!diasHabitacionGuardado) return res.status(500).send({ mensaje: 'Error al guardar en el modelo dias' });
				
					ReservacionModelo.save((err, reservacionGuardada) =>{
						if (err) return res.status(500).send({ mensaje: 'Error en la peticion de reservacion' });
						if (!reservacionGuardada) return res.status(500).send({ mensaje: 'Error al agregar una reservacion' });
						return res.status(200).send({ ReservacionTotal: reservacionGuardada , diasHabitacionGuardado, habitacionActualizada});
					});

				});
        
			});

		});

	}

}



module.exports = {
	crearReservacion

};