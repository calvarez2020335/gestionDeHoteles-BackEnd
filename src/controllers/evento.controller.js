const Evento = require('../models/evento.model');
const Hoteles = require('../models/hotel.model');

function crearEvento(req, res) {
	const parametro = req.body;
	const eventoModel = new Evento();

	if(parametro.Nombre, parametro.Descripcion, parametro.hotel){
		Hoteles.findOne({hotel: {$regex : parametro.hotel, $options:'i'}, Dueno: req.user.sub}, (err, hotelEncontrado) => {
			if(!hotelEncontrado) return res.status(500).send({ mensaje: 'Hotel no encontrado' });    
			
			Evento.find({Nombre :{$regex : parametro.Nombre, $options :'i'} , adminHotel:req.user.sub, hotel: hotelEncontrado._id}, (err, eventoEncontrado) => {
				if(eventoEncontrado.length > 0) return res.status(500).send({mensaje:'Este evento ya a sido creado'});

				eventoModel.Nombre = parametro.Nombre;
				eventoModel.Descripcion = parametro.Descripcion;
				eventoModel.hotel = hotelEncontrado._id;
				eventoModel.adminHotel = req.user.sub;
				if (req.file) {
					const { filename } = req.file;
					eventoModel.setImgUrl(filename);
				}
				eventoModel.save((err, eventoGuardado) => {
					if (err) return res.status(500).send({mensaje: 'Error en la peticion de guardar evento'});
					if(!eventoGuardado) return res.status(500).send({mensaje: 'Error al guardar evento'});
					return res.status(200).send({eventoGuardado: eventoGuardado});
				});
			});

		});
		
	}else{
		return res.status(500).send({ mensaje: 'Debe de enviar los parametros obligatorios'});
	}

}

module.exports={
	crearEvento
};