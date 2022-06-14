const Habitacion = require('../models/habitacion.model');
const Hotel = require('../models/hotel.model');

function registrarHabitacion(req, res) {
	const parametro = req.body;
	const idHotel = req.params.idHotel;
	const habitacionModel = new Habitacion();
	if(parametro.numHabitacion && parametro.tipoHabitacion && parametro.Precio){
		Hotel.findOne({_id: idHotel, adminHotel: req.user.sub}, (err, hotelEncontrado) => {

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
				habitacionModel.usuario = req.user.sub;
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

function verHabitaciones(req, res) {
	const idHotel = req.params.idHotel;

	
}

module.exports = {
	registrarHabitacion,
	verHabitaciones
};