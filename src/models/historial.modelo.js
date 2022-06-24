const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorialSchema = Schema({
	usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
	Habitacion: { type: Schema.Types.ObjectId, ref: 'Habitaciones'},
	hotel: { type: Schema.Types.ObjectId, ref: 'Hoteles' },
	servicios: [{
		nombreServicios: String,
		precio: Number,
	}],
});

module.exports = mongoose.model('Historiales', HistorialSchema);