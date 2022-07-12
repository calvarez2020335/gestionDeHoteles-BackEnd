const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FacturaSchema = Schema({
	Usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
	servicios: [{
		nombreServicios: String,
		precio: Number,
	}],
	Subtotal:Number,
	total:Number,
	estado: String,
	hotelHospedado: {type: Schema.Types.ObjectId, ref: 'Hoteles'}
});

module.exports = mongoose.model('Facturas', FacturaSchema);