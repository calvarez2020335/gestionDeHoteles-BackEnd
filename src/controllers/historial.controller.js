const Historial = require('../models/historial.modelo');


function VerHistorial (req, res) {

	Historial.find({ usuario: req.user.sub } , (err, HistorialEncontrado) =>{
		if(err) return res.status(500).send({ mensaje: 'Error en la petición de buscar historial'});
		if(!HistorialEncontrado) return res.status(500).send({ mensaje: 'Error la busacar historial otro'});

		return res.status(200).send({HistorialEncontrado: HistorialEncontrado});
	});

}

function VerHistorialId (req, res) {

	const idHisto = req.params.idHistorial;

	Historial.findById({ _id: idHisto ,usuario: req.user.sub } , (err, HistorialEncontrado) =>{
		if(err) return res.status(500).send({ mensaje: 'Error en la petición de buscar historial'});
		if(!HistorialEncontrado) return res.status(500).send({ mensaje: 'Error la busacar historial otro'});

		return res.status(200).send({HistorialEncontrado: HistorialEncontrado});
	});

}


function EliminarHistorial (req, res) {

	Historial.deleteMany({usuario: req.user.sub } , (err, HistorialEliminado) =>{
		if(err) return res.status(500).send({ mensaje: 'Error en la petición de eliminar'});
		if(!HistorialEliminado) return res.status(500).send({ mensaje: 'Error la eliminar historial'});

		return res.status(200).send({HstorialEliminado: HistorialEliminado});
	});

}



module.exports = {

	VerHistorial,
	VerHistorialId,
	EliminarHistorial
};