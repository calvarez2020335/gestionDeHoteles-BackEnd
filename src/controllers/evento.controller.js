const Evento = require('../models/evento.model');
const Hoteles = require('../models/hotel.model');

function crearEvento(req, res) {
	const parametro = req.body;
	const eventoModel = new Evento();

	if (
		(parametro.Nombre,
		parametro.Descripcion,
		parametro.hotel,
		parametro.tipoEvento)
	) {
		Hoteles.findOne(
			{
				Nombre: { $regex: parametro.hotel, $options: 'i' },
				Dueno: req.user.sub,
			},
			(err, hotelEncontrado) => {
				if (!hotelEncontrado)
					return res.status(500).send({ mensaje: 'Hotel no encontrado' });
				console.log(hotelEncontrado);
				Evento.find(
					{
						Nombre: { $regex: parametro.Nombre, $options: 'i' },
						adminHotel: req.user.sub,
						hotel: hotelEncontrado._id,
					},
					(err, eventoEncontrado) => {
						if (eventoEncontrado.length > 0)
							return res
								.status(500)
								.send({ mensaje: 'Este evento ya a sido creado' });

						eventoModel.Nombre = parametro.Nombre;
						(eventoModel.tipoEvento = parametro.tipoEvento),
						(eventoModel.Descripcion = parametro.Descripcion);
						eventoModel.hotel = hotelEncontrado._id;
						eventoModel.adminHotel = req.user.sub;
						if (req.file) {
							const { filename } = req.file;
							eventoModel.setImgUrl(filename);
						}
						eventoModel.save((err, eventoGuardado) => {
							if (err)
								return res
									.status(500)
									.send({ mensaje: 'Error en la peticion de guardar evento' });
							if (!eventoGuardado)
								return res
									.status(500)
									.send({ mensaje: 'Error al guardar evento' });
							return res.status(200).send({ eventoGuardado: eventoGuardado });
						});
					}
				);
			}
		);
	} else {
		return res
			.status(500)
			.send({ mensaje: 'Debe de enviar los parametros obligatorios' });
	}
}

function editarEventos(req, res) {
	const idEvento = req.params.idEvento;
	if(idEvento == null) return res.status(500).send({mensaje: 'Necesita el id del evento'});
	const parametros = req.body;
	const eventosModel = new Evento();
	if (req.file) {
		const { filename } = req.file;
		eventosModel.setImgUrl(filename);
	}
	parametros.image = eventosModel.imgUrl;
	Evento.findById({ _id: idEvento }, (err, eventoEncontrado) => {
		console.log(eventoEncontrado);
		if (eventoEncontrado.adminHotel != req.user.sub)
			return res
				.status(500)
				.send({ mensaje: 'No puede editar eventos que no le pertenezcan' });

		Evento.findByIdAndUpdate(idEvento, {
			set: {
				Nombre: parametros.Nombre,
				tipoEvento: parametros.tipoEvento,
				Descripcion: parametros.Descripcion,
				imgUrlEvento: parametros.imgUrlEvento,
			},
		}, { new: true}, (err, eventoActualizado) => {
			if(err) return res.status(500).send({mensaje: 'Error en la petición de editar eventos'});
			if(!eventoActualizado) return res.status(500).send({mensaje: 'Error al editar el evento'});
			return res.status(200).send({eventoActualizado: eventoActualizado});
		});
	});
}

function eliminarEventos(req, res) {}

function verEventos(req, res) {}

function verEventosId(req, res) {}

module.exports = {
	crearEvento,
	editarEventos,
	eliminarEventos,
	verEventos,
	verEventosId,
};
