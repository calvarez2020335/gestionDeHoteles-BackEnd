const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventoSchema = Schema({
	Nombre: String,
	Descripcion: String,
	imgUrlEvento: String,
	hotel: { type: Schema.Types.ObjectId, ref: 'Hoteles' }
});

module.exports = mongoose.model('Eventos', EventoSchema);