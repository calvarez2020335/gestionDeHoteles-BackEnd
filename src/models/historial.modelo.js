const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorialSchema = Schema({
	usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
	hotel: { type: Schema.Types.ObjectId, ref: 'Hoteles' },
	factura: { type: Schema.Types.ObjectId, ref: 'Facturas' },
	NombreHotel: String,
	servicios: [{
		nombreServicios: String,
	}],
});

module.exports = mongoose.model('Historiales', HistorialSchema);