const Reservacion = require('../models/reservacion.model');
const Usuario = require('../models/usuario.model');

function crearReservacion(req, res) {
	var parametro = req.body;
	var ReservacionModelo = new Reservacion();


	if (parametro.NombreReservacion && parametro.habitacion){


		let hoy = new Date();
		let fechaEnMilisegundos = 1000 * 60 * 60 * 24 * 1;
		let suma = hoy.getTime() + fechaEnMilisegundos; //getTime devuelve milisegundos de esa fecha
		console.log(hoy.toISOString().split('T')[0]);
		let fechaDentroDeUnaSemana = new Date(suma);
    
		console.log(fechaDentroDeUnaSemana.toISOString().split('T')[0]);

		ReservacionModelo.NombreReservacion = parametro.NombreReservacion,
		ReservacionModelo.FechaEntrada = hoy.toISOString().split('T')[0];
		ReservacionModelo.FechaSalida = fechaDentroDeUnaSemana.toISOString().split('T')[0];
        

	}



}



module.exports = {
	crearReservacion

};