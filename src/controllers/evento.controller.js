const Evento = require('../models/evento.model');
const Hoteles = require('../models/hotel.model');

function crearEvento(req, res) {
	const parametro = req.body;
	const idHotel = req.params.idhotel;
	const eventoModel = new Evento();

	if (parametro.Nombre, parametro.Descripcion, parametro.tipoEvento) {
		Hoteles.findOne({hotel: idHotel, Dueno: req.user.sub,},(err, hotelEncontrado) => {
			if (!hotelEncontrado) return res.status(500).send({ mensaje: 'Hotel no encontrado' });
			Evento.find({ Nombre: { $regex: parametro.Nombre, $options: 'i' }, adminHotel: req.user.sub, hotel: idHotel},(err, eventoEncontrado) => {
				if (eventoEncontrado.length > 0)
					return res.status(500).send({ mensaje: 'Este evento ya a sido creado' });
				eventoModel.Nombre = parametro.Nombre;
				eventoModel.tipoEvento = parametro.tipoEvento,
				eventoModel.Descripcion = parametro.Descripcion;
				eventoModel.hotel = idHotel;
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
	const parametros = req.body;
	Evento.findById({ _id: idEvento }, (err, eventoEncontrado) => {
		if (eventoEncontrado.adminHotel != req.user.sub)
			return res
				.status(500)
				.send({ mensaje: 'No puede editar eventos que no le pertenezcan' });

		Evento.findByIdAndUpdate(idEvento, {$set: {Nombre: parametros.Nombre, tipoEvento: parametros.tipoEvento, Descripcion: parametros.Descripcion}}, { new:true}, (err, eventoActualizado) => {
			if(err) return res.status(500).send({mensaje: 'Error en la petición de editar eventos'});
			if(!eventoActualizado) return res.status(500).send({mensaje: 'Error al editar el evento'});
			return res.status(200).send({eventoActualizado: eventoActualizado});
		});
	});
}

function eliminarEventos(req, res) {
	const idEvento = req.params.idEvento;
	if(idEvento == null) return res.status(500).send({mensaje: 'Necesita el id del evento'});

	Evento.findById({ _id: idEvento }, (err, eventoEncontrado) => {
		if (eventoEncontrado.adminHotel != req.user.sub)
			return res
				.status(500)
				.send({ mensaje: 'No puede eliminar eventos que no le pertenezcan' });
			
		Evento.findByIdAndDelete(idEvento, (err, eventoEliminado) => {
			if(err) return res.status(500).send({mensaje:'Error en la petición de eliminar evento' });
			if(!eventoEliminado) return res.status(500).send({ mensaje: 'Error en eliminar evento'});
			return res.status(200).send({mensaje: eventoEliminado});
		});	

	});
}

function verEventos(req, res) {
	const idHotel = req.params.idHotel;
	if(req.user.rol == 'ROL_ADMINHOTEL'){
		Evento.find({adminHotel: req.user.sub, hotel: idHotel}, (err, eventoEncontrado) => {
			if(err) return res.status(404).send({mensaje:'Error en al petición de ver los eventos' });
			if(!eventoEncontrado) return res.status(404).send({mensaje: 'Error al ver los eventos'});
			return res.status(200).send({eventos: eventoEncontrado});
		});
	}else{
		if(idHotel == null) return res.status(500).send({mensaje:'Necesita el id del hotel'});
		Evento.find({hotel: idHotel}, (err, eventoEncontrado) => {
			if(err) return res.status(404).send({mensaje:'Error en al petición de ver los eventos' });
			if(!eventoEncontrado) return res.status(404).send({mensaje: 'Error al ver los eventos'});
			return res.status(200).send({eventos: eventoEncontrado});
		});
	}
}

function verEventosId(req, res) {
	const idEvento = req.params.idHotel;
	if(req.user.rol == 'ROL_ADMINHOTEL'){
		Evento.findOne({_id: idEvento, adminHotel: req.user.sub}, (err, eventoEncontrado)=>{
			if(err) return res.status(404).send({mensaje:'Error en al petición de ver los eventos id admin' });
			if(!eventoEncontrado) return res.status(404).send({mensaje: 'No puede ver eventos de otros hoteles'});
			return res.status(200).send({eventos: eventoEncontrado});
		});
	}else{
		Evento.findOne({_id: idEvento}, (err, eventoEncontrado)=>{
			if(err) return res.status(404).send({mensaje:'Error en la petición de ver los eventos general'});
			if(!eventoEncontrado) return res.status(404).send({mensaje: 'Error al ver los eventos'});
			return res.status(200).send({evento: eventoEncontrado});
		});
	}
}

module.exports = {
	crearEvento,
	editarEventos,
	eliminarEventos,
	verEventos,
	verEventosId
};
